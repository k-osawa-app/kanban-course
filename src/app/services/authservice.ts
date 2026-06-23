import { Injectable, inject, Service } from '@angular/core';
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
import { FirebaseAuthWrapper } from './wrapper/firebaseauth-wrapper'; // 追加

//@Injectable({ providedIn: 'root' })
@Service()
export class AuthService {  
  private auth: Auth = inject(Auth);  
  private fireAuthWrapper = inject(FirebaseAuthWrapper); // 追加
  readonly user$: Observable<User | null> = authState(this.auth);  
  readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

 signup(credentials: SignupCredentials): Observable<void> {    
    const promise = this.fireAuthWrapper.getCreateUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    ).then(userCredential => {
      return this.fireAuthWrapper.getUpdateProfile(userCredential.user, {
        displayName: credentials.name
      });
    });

    return from(promise);
  }

  login(credentials: LoginCredentials): Observable<void> {
    const promise = this.fireAuthWrapper.getSignInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    ).then(() => {
       const user = this.getCurrentUser(); 
       console.log('Login Success! User Value:', user);
       return; 
    })
    .catch((error) => {        
        console.error('Login Failed:', error.code, error.message);
        throw error;
    });
    return from(promise);
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

   getCurrentUser(): User | null {
    console.log(this.auth.currentUser);    
    return this.auth.currentUser;
  } 
}
