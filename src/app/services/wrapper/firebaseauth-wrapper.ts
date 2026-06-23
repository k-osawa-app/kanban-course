import { Service } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Service()
export class FirebaseAuthWrapper{
  getAuthState(auth: Auth): Observable<User | null> {
    return authState(auth);
  }
  
  getCreateUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  
  getUpdateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void> {
    return updateProfile(user, profile);
  }
   
  getSignInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }
}
