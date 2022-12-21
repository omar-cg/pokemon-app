import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/Services/components.service';
import { FirebaseService } from 'src/app/Services/firebase.service';
import * as moment from 'moment';
import { PokemonService } from 'src/app/Services/pokemon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from 'src/app/Components/notification/notification.component';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {
  profile: any = [];
  url: string = "";
  years: number;
  pokemons: any = [];
  constructor(
    private componentsService: ComponentsService,
    private fireService: FirebaseService,
    private router: Router,
    private pokemonService: PokemonService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getProfile();
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
      this.getPokemons();
    })
  }

  // Consumo de API para obtener pokémons

  getPokemons() {
    for(let item of this.profile.pokemonIds) {
      this.pokemonService.getPokemon(item).subscribe({
        next: (response: any) => {
          for (let item of response.stats) {
            if (item.stat.name == 'hp') {
              response.hp = item.base_stat 
            }
            if (item.stat.name == 'attack') {
              response.attack = item.base_stat 
            }
            if (item.stat.name == 'defense') {
              response.defense = item.base_stat 
            }
            if (item.stat.name == 'special-attack') {
              response.specialAttack = item.base_stat 
            }
            if (item.stat.name == 'special-defense') {
              response.specialDefense = item.base_stat 
            }
            if (item.stat.name == 'speed') {
              response.speed = item.base_stat 
            }
          }
          this.pokemons.push(response);
        },
        error: () => {
          this.openSnackBar("Error al obtener pokémon", "Error");
        }
      });
    }
  }

  // Abrir componente de notificación

  openSnackBar(message: string, status: string) {
    this.snackbar.openFromComponent(NotificationComponent, {
      duration: 3000,
      panelClass: ['snackbar-styles'],
      data: {message: message, status: status}
    });
  }

  //Consumo de endpoint para descargar imagen de perfil

  async downloadImage(imageName: string){
    await this.fireService.getImage(imageName).then(response => {
      this.url = response;
    })
  }

  //Navegación hacia la página de inicio

  goTohome() {
    this.router.navigate(['/inicio']);
  }
}
