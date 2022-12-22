import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationComponent } from 'src/app/Components/notification/notification.component';
import { Profile } from 'src/app/Models/profile.interface';
import { ComponentsService } from 'src/app/Services/components.service';
import { FirebaseService } from 'src/app/Services/firebase.service';
import { PokemonService } from 'src/app/Services/pokemon.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  file: any;
  isFile: boolean = false;
  url: string = "";
  today: Date = new Date();
  readonlyDocInput: boolean = true;
  loading: boolean = false;
  firstValidation: boolean = false;
  years: number;
  pokemons: any = [];
  pokemonsInfo: any = [];
  selectedPokemons: any = [];
  defaultPokemons: any = [];
  search: any;
  originalFileName: any = "empty";
  imageToRemove: any;
  profile: any = [];
  hobbies = ["Jugar Fútbol", "Jugar Basketball", "Jugar Tennis", "Jugar Voleibol", "Jugar Fifa", "Jugar Videojuegos"];
  
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zñáéíóúA-ZÑÁÉÍÓÚ0-9 ]+$')]),
    hobbie: new FormControl(''),
    birthday: new FormControl('', Validators.required),
    document: new FormControl(''),
    profileImageName: new FormControl('')
  });

  constructor(
    private fireService: FirebaseService,
    private pokemonService: PokemonService,
    private router: Router,
    private snackbar: MatSnackBar,
    private componentsService: ComponentsService
  ) {}

  ngOnInit() {
    if (this.componentsService.profileId == undefined) {
      this.router.navigate(['/inicio']);
    }
    // Validaciones fecha de cumpleaños, se agregan validadores dependiendo de la edad del perfil:

    this.profileForm.get("birthday")?.valueChanges.subscribe(value => {
      var now = moment(new Date);
      var birthday = moment(value);
      this.years = now.diff(birthday, 'years');
      if (this.years > 17) {
        this.profileForm.get('document')?.addValidators([Validators.required, Validators.pattern("^\\d{8}-\\d{1}$")]);
        this.profileForm.get('document')?.reset();
        this.readonlyDocInput = false;
      } else {
        this.profileForm.get('document')?.clearValidators();
        this.profileForm.get('document')?.reset();
        this.profileForm.get('document')?.setValue('Carnet de minoridad');
        this.readonlyDocInput = true;
      }
    });

    this.getProfile();
    this.getAllPokemons();
  }

  // Consumo de API para obtener la información del perfil

  async getProfile() {
    await this.fireService.getProfile(this.componentsService.profileId).then(response => {
      this.profile = response.data();
      var now = moment(new Date);
      var birthday = this.profile.birthday;
      var birthDate = new Date(birthday?.seconds*1000);
      this.years = now.diff(birthDate, 'years');
      if(this.profile.profileImageName != "") {
        this.downloadImage(this.profile.profileImageName);
      }
      this.getProfilePokemons();
      this.profileForm.get('name')?.setValue(this.profile.name);
      this.profileForm.get('hobbie')?.setValue(this.profile.hobbie);
      var formatedDate = moment(birthDate).add(1, 'day');
      this.profileForm.get('birthday')?.setValue(moment(formatedDate).format('YYYY-MM-DD'));
      this.profileForm.get('document')?.setValue(this.profile.document);
      this.profileForm.get('profileImageName')?.setValue(this.profile.profileImageName);
      if(this.profileForm.value.profileImageName != "") {
        this.originalFileName = this.profileForm.value.profileImageName;
      }
    });
    
  }

  //Consumo de endpoint para descargar imagen de perfil:

  async downloadImage(imageName: string){
    await this.fireService.getImage(imageName).then(response => {
      this.url = response;
    })
  }

  // Consumo de API para obtener pokémons:

  getProfilePokemons() {
    this.defaultPokemons = [];
    for (let i = 1; i <= 9; i++) {
      if (!this.profile.pokemonIds.includes(i)) {
        this.defaultPokemons.push(i)
      }
    }
    for(let id of this.profile.pokemonIds) {
      this.selectedPokemons.push(id);
      this.pokemonService.getPokemon(id).subscribe({
        next: (response: any) => {
          response.isSelected = true;
          this.pokemonsInfo.unshift(response);
        },
        error: () => {
          this.openSnackBar("Error al obtener pokémon", "Error");
        }
      });
    }
    this.getAllPokemons();
  }

  // Consumo de API de pokemons:
  
  getAllPokemons() {
    for (let id of this.defaultPokemons) {
      this.pokemonService.getPokemon(id.toString()).subscribe({
        next: (response: any) => {
          response.isSelected = false;
          this.pokemonsInfo.push(response);
        },
        error: () => {
          this.openSnackBar("Error al obtener pokémon", "Error");
        }
      });      
    }
  }

  // Mensages de error personalizados para el formulario:
  
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

  // Manejo de archivos:

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files;
      var now = new Date;
      var decimalDate = moment(now).format('YYYYMMDDHHmmss');
      if (this.profileForm.value.profileImageName == "") {
        this.profileForm.get('profileImageName')?.setValue(decimalDate + "_" + this.file[0].name);
      }
      this.isFile = true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    }
  }

  // Función para eliminar de la vista imagen que no ha sido subida a la base de datos:

  deleteFile() {
    this.file = undefined;
    this.profileForm.get('profileImageName')?.setValue("");
    this.url = "";
    setTimeout(() => {
      this.isFile = false;
    }, 500);
  }

  // Consumo de endpoint para guardar imagen en la base de datos:

  async uploadImage(){
    await this.fireService.uploadImage(this.file[0], this.profileForm.value.profileImageName).then(() => {
    }).catch(error => {
      this.openSnackBar(error, "Error")
    });
  }

  // Consumo de endpoint para eliminar imagen de la base de datos:

  async deleteImage(filename: any) {
    await this.fireService.deleteImage(filename).then(()=>{}).catch(()=>{
      this.openSnackBar("Error al eliminar imagen", "Error");
    });
  }

  // Eliminar de la vista imagen guardada en la base de datos:

  removeImage() {
    this.imageToRemove = this.profileForm.value.profileImageName;
    this.file = undefined;
    this.profileForm.get('profileImageName')?.setValue("");
    this.url = "";    
    this.originalFileName = "deleted";
  }


  // Cambiar a la vista de selección de pokémons:

  nextStep() {
    this.loading = true;
    this.firstValidation = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Navegar a la página de inicio:

  goTohome() {
    this.router.navigate(['/inicio']);
  }

  // Función para regresar a la visa del formulario de datos personales:

  backToProfileForm() {
    this.loading = true;
    this.firstValidation = false;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Abrir componente de notificación:

  openSnackBar(message: string, status: string) {
    this.snackbar.openFromComponent(NotificationComponent, {
      duration: 3000,
      panelClass: ['snackbar-styles'],
      data: {message: message, status: status}
    });
  }

  // Función para seleccionar pokemons:

  selectPokemon(id: number) {
    if(this.selectedPokemons.length > 0) {
      if (!this.selectedPokemons.includes(id)) {
        this.selectedPokemons.push(id);
        for(let pokemon of this.pokemonsInfo) {
          if(pokemon.id == id) {
            pokemon.isSelected = true;
          }
        }
      } else {
        for (var i = 0; i < this.selectedPokemons.length; i++) {
          if (this.selectedPokemons[i] == id) {
            this.selectedPokemons.splice(i, 1);
          }
        }
        for (let item of this.pokemonsInfo) {
          if (item.id == id) {
            item.isSelected = false;
          }
        }
      }
    } else {
      this.selectedPokemons.push(id);
      for (let pokemon of this.pokemonsInfo) {
        if (pokemon.id == id) {
          pokemon.isSelected = true;
        }
      }
    }
  }

  // Funicón para búsqueda de pokemons:
  
  searchPokemon(){
    this.pokemonService.getPokemon(this.search).subscribe({
      next: (response: any) => {
        this.openSnackBar("Pokémon encontrado", "Success");
        response.isSelected = false;
        for(let pokemon of this.pokemonsInfo) {
          if(pokemon.id == response.id) {
            this.pokemonsInfo = this.pokemonsInfo.filter((item: any) => item.id !== response.id);
          }
        }
        this.pokemonsInfo.unshift(response);
      },
      error: () => {
        this.openSnackBar("Lo sentimos, no existe un pokémon con ese nombre o índice", "Error");
      }
    });
  }

  // Función para guardar perfil:

  async saveProfile() {
    this.loading = true;
    let profile: Profile = this.profileForm.value;
    profile.pokemonIds = this.selectedPokemons;
    profile.id = this.componentsService.profileId;
    if (typeof this.profileForm.value.birthday === "string") {
      profile.birthday = new Date(this.profileForm.value.birthday);
    }
    if (this.file != undefined) {
      await this.uploadImage();
    }
    if (this.originalFileName == "deleted") {
      await this.deleteImage(this.imageToRemove);
    }
    if (this.profileForm.valid) {
      await this.fireService.updateProfile(profile).then(() => {
        this.loading = false;
        this.openSnackBar("El perfil ha sido editado exitosamente", "Success");
        this.router.navigate(['/detalle-perfil'])
      }).catch(() => {
        this.openSnackBar("Error al editar el perfil", "Error");
      });
    }
  }

}
