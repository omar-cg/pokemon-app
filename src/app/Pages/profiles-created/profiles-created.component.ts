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
    private snackbar: MatSnackBar
  ){}

  ngOnInit() {
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

  async deleteProfile(profile: Profile) {
    await this.fireService.deleteProfile(profile).then(() => {
      this.openSnackBar('Perfil eliminado exitosamente', 'Success');
    }).catch(() => {
      this.openSnackBar('El perfil no pudo ser eliminado', 'Error');
    });
  }
}
