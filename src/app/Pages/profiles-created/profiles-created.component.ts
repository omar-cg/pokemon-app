import { Component, OnInit, ViewChild } from '@angular/core';
import { Profile } from 'src/app/Models/profile.interface';
import { FirebaseService } from 'src/app/Services/firebase.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-profiles-created',
  templateUrl: './profiles-created.component.html',
  styleUrls: ['./profiles-created.component.scss']
})
export class ProfilesCreatedComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'hobbie', 'dui'];
  dataSource: MatTableDataSource<Profile>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fireService: FirebaseService,
    private router: Router
  ){}

  ngOnInit() {
    console.log(this.dataSource)
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
}