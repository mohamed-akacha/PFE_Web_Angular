import { Injectable } from '@angular/core';
import { initializeApp, FirebaseOptions } from 'firebase/app';
import {getStorage} from "firebase/storage";
import {provideStorage} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {
    const firebaseConfig: FirebaseOptions = {
      apiKey: "AIzaSyAq7r4DkfxygnAHZkQhNIEBCh1A99Asjk4",
        projectId: "pfe-flutter-d7ae8",
        storageBucket: "pfe-flutter-d7ae8.appspot.com"
    };
    const app = initializeApp(firebaseConfig);
    const storageInstance = getStorage(app);

    // Provide the storage instance to the AngularFireStorage service
    provideStorage(() => storageInstance);
  }
}
