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
  firstValidation: boolean = false;
  years: number;
  pokemons: any = [];
  pokemonsInfo: any = [];
  selectedPokemons: any = [];
  search: any;
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
    // Validaciones fecha de cumpleaños, se agregan validadores dependiendo de la edad del perfil

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


    // Consumo de API de pokemons

    this.pokemonService.getPokemons().subscribe({
      next: (response: any) => {
        this.pokemons = response.results
        for (let item of this.pokemons) {
          var cutId = item.url.substring(33);
          var id = cutId.slice(1, -1);
          item.id = Number(id);
          if(item.id <= 9) {
            this.pokemonService.getPokemon(item.id).subscribe({
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
      },
      error: () => {
        this.openSnackBar("Error al obtener pokémons", "Error");
      }
    });
  }

  // Mensages de error personalizados para el formulario
  
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

  // Manejo de archivos

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files;
      var now = new Date;
      var decimalDate = moment(now).format('YYYYMMDDHHmmss');
      this.profileForm.get('profileImageName')?.setValue(decimalDate + "_" + this.file[0].name);
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
    this.profileForm.get('profileImageName')?.setValue("");
    this.url = "";
    setTimeout(() => {
      this.isFile = false;
    }, 500);
  }

  uploadImage(){
    this.fireService.uploadImage(this.file[0], this.profileForm.value.profileImageName).then(() => {
    }).catch(error => {
      this.openSnackBar(error, "Error")
    });
  }


  // Cambio de páginas

  nextStep() {
    this.loading = true;
    this.firstValidation = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  goTohome() {
    this.router.navigate(['/inicio']);
  }

  changeValidation() {
    this.loading = true;
    this.firstValidation = false;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  // Abrir componente de notificación

  openSnackBar(message: string, status: string) {
    this.snackbar.openFromComponent(NotificationComponent, {
      duration: 3000,
      panelClass: ['snackbar-styles'],
      data: {message: message, status: status}
    });
  }

  // Función para seleccionar pokemons

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

  // Funicón para búsqueda de pokemons
  
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

  // Función para guardar perfil

  async saveProfile() {
    this.loading = true;
    let profile: Profile = this.profileForm.value;
    profile.pokemonIds = this.selectedPokemons;
    if (this.file != undefined) {
      this.uploadImage();
    }
    if (this.profileForm.valid) {
      await this.fireService.addProfile(profile).then((response: any) => {
        if (response.id) {
          this.componentsService.profileId = response.id;
          this.loading = false;
          this.openSnackBar("El perfil se ha creado exitosamente", "Success");
          this.router.navigate(['/detalle-perfil'])
        }
      }).catch(() => {
        this.openSnackBar("Error al crear el perfil", "Error");
      });
    }
  }
}
