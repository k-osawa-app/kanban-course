import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { 
  //getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';

const firebaseConfig = {
  projectId: 'kanban-app-ffa43',
  appId: '1:148995567752:web:249ddc3ad647d4d6466f3d',
  storageBucket: 'kanban-app-ffa43.firebasestorage.app',
  apiKey: 'AIzaSyBxk9WpwWBezXgU-3N6kKPbNYJnjSxwNnU',
  authDomain: 'kanban-app-ffa43.firebaseapp.com',
  messagingSenderId: '148995567752',
  projectNumber: '148995567752',
  version: '2',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    //provideFirestore(() => getFirestore()),
    // Firestoreの設定を変更：オフライン永続化を有効にする
    provideFirestore(() => {
      const app = initializeApp(firebaseConfig);
      // initializeFirestore を使って詳細設定を行う
      return initializeFirestore(app, {
        // ローカルキャッシュ（IndexedDB）を有効化
        // persistentMultipleTabManager: 複数タブを開いていても同期が壊れないようにする
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
    })
  ],
};
