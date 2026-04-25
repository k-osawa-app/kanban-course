import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData,
  query, 
  where, 
  orderBy,
  doc,
  addDoc 
} from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { Board, Task } from '../models/board.model';
import { AuthService } from './authservice'; 

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  getUserBoards(): Observable<Board[]> {
    const user = this.authService.getCurrentUser(); 
    if (!user) return new Observable(); 

    const boardsRef = collection(this.firestore, 'boards');
    
    const q = query(boardsRef, where('memberIds', 'array-contains', user.uid));    
    
    return collectionData(q, { idField: 'id' }) as Observable<Board[]>;
  }

  getTasks(boardIds: string): Observable<Task[]> {
    
    const tasksRef = collection(this.firestore, `boards/${boardIds}/tasks`);   
   
    const q = query(tasksRef, orderBy('createdAt', 'asc'));        
  
    return collectionData(q, { idField: 'id' }) as Observable<Task[]>;  
  }

  addTask(boardId: string, task: Task): Promise<any> {

    const tasksRef = collection(this.firestore, `boards/${boardId}/tasks`);
    
    return addDoc(tasksRef, task);
  }
}

