import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Profile } from '../Models/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) { }

  addProfile(profile: Profile) {
    const profileRef = collection(this.firestore, 'profiles');
    return addDoc(profileRef, profile);
  }

}
