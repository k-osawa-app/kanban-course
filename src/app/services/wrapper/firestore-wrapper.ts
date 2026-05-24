import { Injectable, inject } from '@angular/core';
import { Firestore, 
  collection, 
  collectionData, 
  query, 
  QueryConstraint, 
  //where, 
  addDoc, 
  DocumentReference, 
  UpdateData, 
  updateDoc,
  doc } 
  from '@angular/fire/firestore';
import { Observable } from 'rxjs';
//import { CAuth } from './cauth';
//import { IBoard } from '../models/board.model';
//import { Board } from '../pages/board/board';

@Injectable({
  providedIn: 'root'
})
export class FirestoreWrapper {
  private firestore = inject(Firestore);

  getCollectionData<T>(path: string, ...queryConstraints: QueryConstraint[]): Observable<T[]> {
    const colRef = collection(this.firestore, path);
    
    // queryConstraintsが渡されている場合はquery()を適用し、なければコレクション参照をそのまま使う
    const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;
    
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }


  getTaskData<T>(path: string, ...queryConstraints: QueryConstraint[]): Observable<T[]> {
    const colRef = collection(this.firestore, path);

    const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;
    
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  getCollectionRef(path: string) {
    return collection(this.firestore, path);
  }

  addDocument(ref: any, data: any) {
    return addDoc(ref, data);
  }

  // docをラップし、パス文字列からDocumentReferenceを取得する
  getDocRef(path: string): DocumentReference {
    return doc(this.firestore, path);
  }

  // updateDocをラップする
  getUpdateDoc(ref: DocumentReference, data: UpdateData<any>): Promise<any> {
    return updateDoc(ref, data);
  }


}


//-------------------------------
// export class FirestoreWrapper {
//      private firestore = inject(Firestore);
//      private authService = inject(CAuth); // ユーザーID取得用     

//   /**
//    * collectionDataをラップしたメソッド
//    * テスト時はこのメソッドをモック化します
//    */
//   getCollectionData<T>(path: string, ...queryConstraints: QueryConstraint[]): Observable<T[]> {
//     const user = this.authService.getCurrentUser(); 
//     console.log('User value:', user);//問題なく取得
//     if (!user) return new Observable(); // 未ログイン時は空
    
//     const colRef = collection(this.firestore, path);

//     //return colRef;
//     if (queryConstraints.length > 0) {
//       const q = query(colRef, where('ownerId',"==", user.uid), ...queryConstraints);
//       return collectionData(q, { idField: 'id' }) as Observable<T[]>;
//     }
//     return collectionData(colRef, { idField: 'id' }) as Observable<T[]>;
//   }
//   // ※必要に応じて getDocData, addDoc などのラッパーメソッドも追加します
// }
