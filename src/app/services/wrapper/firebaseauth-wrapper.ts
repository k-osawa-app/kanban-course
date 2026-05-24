import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthWrapper{
  // authState のラッパー
  getAuthState(auth: Auth): Observable<User | null> {
    return authState(auth);
  }
  // signup 用のラッパー
  getCreateUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  // updateProfile 用のラッパー
  getUpdateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void> {
    return updateProfile(user, profile);
  }
   // signInWithEmailAndPasswordのラッパーを追加
  getSignInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }
}
