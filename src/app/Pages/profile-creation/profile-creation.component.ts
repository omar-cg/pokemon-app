import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  styleUrls: ['./profile-creation.component.scss']
})
export class ProfileCreationComponent implements OnInit {
  file: any;
  isFile: boolean = false;
  url: string = "";
  today: Date = new Date();
  readonlyDocInput: boolean = true;
  loading: boolean = false;
  hobbies = ["Jugar Fútbol", "Jugar Basketball", "Jugar Tennis", "Jugar Voleibol", "Jugar Fifa", "Jugar Videojuegos"];
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ0-9 ]+$')]),
    hobbie: new FormControl(''),
    birthday: new FormControl('', Validators.required),
    document: new FormControl('')
  });

  constructor() {
  }
  ngOnInit() {
    this.profileForm.get("birthday")?.valueChanges.subscribe(value => {
      var now = moment(new Date);
      var birthday = moment(value);
      var years = now.diff(birthday, 'years');
      if(years > 17) {
        this.profileForm.get('document')?.addValidators([Validators.required, Validators.pattern("^\\d{8}-\\d{1}$")]);
        this.profileForm.get('document')?.reset();
        this.readonlyDocInput = false;
      } else {
        this.profileForm.get('document')?.clearValidators();
        this.profileForm.get('document')?.reset();
        this.profileForm.get('document')?.setValue('Carnet de minoridad');
        this.readonlyDocInput = true;
      }
   })
  }
  
  errorMessageName() {
    if(this.profileForm.get('name')?.hasError('required')) {
      return "Ingresa tu nombre para continuar"
    }
    if(this.profileForm.get('name')?.hasError('maxlength')) {
      return "Has alcanzado el límite máximo de caracteres (20)"
    }
    if(this.profileForm.get('name')?.hasError('pattern')) {
      return "No se permiten caracteres especiales"
    }
  }

  errorMessageDoc() {
    if(this.profileForm.get('document')?.hasError('required')) {
      return "Ingresa tu número de identificación"
    }
    if(this.profileForm.get('document')?.hasError('pattern')) {
      return "El DUI debe tener el siguiente formato: 00000000-0"
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files;
      this.isFile = true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    }
  }

  deleteFile() {
    this.file = undefined;
    this.url = "";
    setTimeout(() => {
      this.isFile = false;
    }, 500);
  }

  nextStep() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
