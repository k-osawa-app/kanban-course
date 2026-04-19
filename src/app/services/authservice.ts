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
       const user = this.getCurrentUser(); 
       console.log('Login Success! User Value:', user);
       return; 
    })
    .catch((error) => {
        // --- 失敗時 ---
        console.error('Login Failed:', error.code, error.message);
        throw error; // エラーを呼び出し元（コンポーネント）に伝えるために再スロー
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
