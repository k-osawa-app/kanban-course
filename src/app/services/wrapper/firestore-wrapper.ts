import { inject, Service } from '@angular/core';
import { Firestore, 
  collection, 
  collectionData, 
  query, 
  QueryConstraint, 
  addDoc, 
  DocumentReference, 
  UpdateData, 
  updateDoc,
  doc } 
  from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Service()
export class FirestoreWrapper {
  private firestore = inject(Firestore);

  getCollectionData<T>(path: string, ...queryConstraints: QueryConstraint[]): Observable<T[]> {
    const colRef = collection(this.firestore, path);

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

  getDocRef(path: string): DocumentReference {
    return doc(this.firestore, path);
  }

  getUpdateDoc(ref: DocumentReference, data: UpdateData<any>): Promise<any> {
    return updateDoc(ref, data);
  }
}

