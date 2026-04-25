import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {  
        projectId: 'kanban-app-ffa43',
        appId: '1:148995567752:web:249ddc3ad647d4d6466f3d',
        storageBucket: 'kanban-app-ffa43.firebasestorage.app',
        apiKey: 'AIzaSyBxk9WpwWBezXgU-3N6kKPbNYJnjSxwNnU',
        authDomain: 'kanban-app-ffa43.firebaseapp.com',
        messagingSenderId: '148995567752',
        projectNumber: '148995567752',
        version: '2',

  // apiKey: "",
  // authDomain: "",
  // projectId: "",
  // storageBucket: "",
  // messagingSenderId: "",
  // appId: ""  
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())  
  ] 
};
