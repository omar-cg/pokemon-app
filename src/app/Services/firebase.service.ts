import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  getProfiles(): Observable<Profile[]>{
    const profileRef = collection(this.firestore, 'profiles');
    return collectionData(profileRef, {idField: 'id'}) as Observable<Profile[]>;
  }

  deleteProfile(profile: Profile) {
    const profileRef = doc(this.firestore, 'profiles/' + profile.id);
    return deleteDoc(profileRef);
  }

}
