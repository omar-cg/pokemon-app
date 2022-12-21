import { Component, OnInit, ViewChild } from '@angular/core';
import { Profile } from 'src/app/Models/profile.interface';
import { FirebaseService } from 'src/app/Services/firebase.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { WarningsDialogComponent } from 'src/app/Components/warnings-dialog/warnings-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/Components/notification/notification.component';
import { ComponentsService } from 'src/app/Services/components.service';

@Component({
  selector: 'app-profiles-created',
  templateUrl: './profiles-created.component.html',
  styleUrls: ['./profiles-created.component.scss']
})
export class ProfilesCreatedComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'hobbie', 'dui', 'actions'];
  dataSource: MatTableDataSource<Profile>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fireService: FirebaseService,
    private router: Router,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private componentService: ComponentsService
  ){}

  ngOnInit() {
    // Consumo de endpoint para obtener usuarios

    this.fireService.getProfiles().subscribe({
      next: (response) => {
        for(let profile of response) {
          var now = moment(new Date);
          var birthday = profile.birthday;
          var birthDate = new Date(birthday?.seconds*1000);
          var years = now.diff(birthDate, 'years');
          profile.years = years;
        }
        
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = "Ítems por página"
      }
    });
  }

  goTohome() {
    this.router.navigate(['/inicio']);
  }

  // Funciones para abrir componentes de notificaciones

  openDialog(message: string, profile: Profile) {
    const dialogRef = this.dialog.open(WarningsDialogComponent, {
      height: 'auto',
      width: '300px',
      data: {message: message}
    })
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if(result) {
          this.deleteProfile(profile); 
        }
      }
    });
  }

  openSnackBar(message: string, status: string) {
    this.snackbar.openFromComponent(NotificationComponent, {
      duration: 3000,
      panelClass: ['snackbar-styles'],
      data: {message: message, status: status}
    });
  }

  // Consumo de endpoint para eliminar perfil

  async deleteProfile(profile: Profile) {
    await this.fireService.deleteProfile(profile).then(() => {
      this.openSnackBar('Perfil eliminado exitosamente', 'Success');
    }).catch(() => {
      this.openSnackBar('El perfil no pudo ser eliminado', 'Error');
    });
  }

  // Función para búsquedas en la tabla

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Función para navegar al detalle de un perfil

  goToProfile(id: string) {
    this.componentService.profileId = id;
    this.router.navigate(['detalle-perfil']);
  }
}
