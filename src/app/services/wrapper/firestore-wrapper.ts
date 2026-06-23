import { inject, Service } from '@angular/core';
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


// @Injectable({
//   providedIn: 'root'
// })
@Service()
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

