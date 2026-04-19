import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
//import { initializeApp } from "firebase/app";
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';//initializeApp,
import { getAuth, provideAuth } from '@angular/fire/auth';
//import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxk9WpwWBezXgU-3N6kKPbNYJnjSxwNnU",
  authDomain: "kanban-app-ffa43.firebaseapp.com",
  projectId: "kanban-app-ffa43",
  storageBucket: "kanban-app-ffa43.firebasestorage.app",
  messagingSenderId: "148995567752",
  appId: "1:148995567752:web:249ddc3ad647d4d6466f3d"

  
  // apiKey: "",
  // authDomain: "",
  // projectId: "",
  // storageBucket: "",
  // messagingSenderId: "",
  // appId: ""
};

//const app = initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())  
  ] 
};
