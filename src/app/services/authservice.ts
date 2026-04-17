import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  authState, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile
} from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';
import { LoginCredentials, SignupCredentials } from '../models/user.model'; 


@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private auth: Auth = inject(Auth);
  
  readonly user$: Observable<User | null> = authState(this.auth);
  
  readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

  signup(credentials: SignupCredentials): Observable<void> {
    // PromiseをObservableに変換して扱う
    const promise = createUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    ).then(userCredential => {
      return updateProfile(userCredential.user, {
        displayName: credentials.name
      });
    });

    return from(promise);
  }

  login(credentials: LoginCredentials): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    ).then(() => {
       return; 
    });
    return from(promise);
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

}
