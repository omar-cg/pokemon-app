import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, doc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { FirebaseStorage, getDownloadURL, list, listAll, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Profile } from '../Models/profile.interface';
import { getStorage } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  addProfile(profile: Profile) {
    const profileRef = collection(this.firestore, 'profiles');
    return addDoc(profileRef, profile);
  }

  getProfiles(): Observable<Profile[]>{
    const profileRef = collection(this.firestore, 'profiles');
    return collectionData(profileRef, {idField: 'id'}) as Observable<Profile[]>;
  }

  getProfile(id: string) {
    const docRef = doc(this.firestore, 'profiles', id);
    return getDoc(docRef);
  }

  deleteProfile(profile: Profile) {
    const profileRef = doc(this.firestore, 'profiles/' + profile.id);
    return deleteDoc(profileRef);
  }

  uploadImage(file: any, filename: any) {
    const imgRef = ref(this.storage, `images/${filename}`);
    return uploadBytes(imgRef, file);
  }

  getImage(filename: string){
    const storage = getStorage();
    return getDownloadURL(ref(storage, `images/${filename}`))
  }

}
