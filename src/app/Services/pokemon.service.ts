import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(
    private http: HttpClient
  ) { }

  getPokemons() {
    return this.http.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1154');
  }

  getPokemon(id: string) {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/' + id);
  }
}
