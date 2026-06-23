import { Injectable, inject, Service } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData,
  query, 
  where, 
  orderBy,
  doc,
  addDoc, 
  updateDoc
} from '@angular/fire/firestore';
import { Observable, tap, of } from 'rxjs';
import { Board, Task, TaskStatus } from '../models/board.model';
import { AuthService } from './authservice'; 
import { FirestoreWrapper } from './wrapper/firestore-wrapper'; 

// @Injectable({
//   providedIn: 'root'
// })
@Service()
export class BoardService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private firestoreWrapper = inject(FirestoreWrapper);

  getUserBoards(): Observable<Board[]> {
    const user = this.authService.getCurrentUser(); 
    //if (!user) return new Observable(); 
    if (!user) return of([]); 
    
    return this.firestoreWrapper.getCollectionData<Board>(
      'boards',
      where('memberIds', 'array-contains', user.uid)
    );
    // const boardsRef = collection(this.firestore, 'boards');    
    // const q = query(boardsRef, where('memberIds', 'array-contains', user.uid));      
    // return collectionData(q, { idField: 'id' }) as Observable<Board[]>;
  }

  getTasks(boardIds: string): Observable<Task[]> {  
    return this.firestoreWrapper.getCollectionData<Task>(//getTaskData
      `boards/${boardIds}/tasks`,
      orderBy('createdAt', 'asc')
    );
    
    // const tasksRef = collection(this.firestore, `boards/${boardIds}/tasks`);      
    // const q = query(tasksRef, orderBy('createdAt', 'asc'));    
    // return collectionData(q, { idField: 'id' }) as Observable<Task[]>;  
  }

  addTask(boardId: string, task: Task): Promise<any> {
     const tasksRef = this.firestoreWrapper.getCollectionRef(`boards/${boardId}/tasks`);
  return this.firestoreWrapper.addDocument(tasksRef, task);
    
    // const tasksRef = collection(this.firestore, `boards/${boardId}/tasks`);    
    // return addDoc(tasksRef, task);
  }

  /**
   * タスクの新規作成
   */
  async createTask(boardId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    //const tasksRef = collection(this.firestore, `boards/${boardId}/tasks`);
    const tasksRef = this.firestoreWrapper.getCollectionRef(`boards/${boardId}/tasks`);
    const newTask: Task = {
      ...task,
      createdAt: Date.now(), // サーバー側で設定するのが理想ですが、今回は簡易的にここで行います
    };
    //await addDoc(tasksRef, newTask);
    await this.firestoreWrapper.addDocument(tasksRef, newTask);   
  }

   /**
   * タスクのステータス更新（ドラッグ＆ドロップ用）
   */
  async updateTaskStatus(boardId: string, taskId: string, newStatus: TaskStatus): Promise<void> {
    // const taskDocRef = doc(this.firestore, `boards/${boardId}/tasks/${taskId}`);
    // await updateDoc(taskDocRef, { status: newStatus });
    const path = `boards/${boardId}/tasks/${taskId}`;   
    const taskDocRef = this.firestoreWrapper.getDocRef(path);
    await this.firestoreWrapper.getUpdateDoc(taskDocRef, { status: newStatus });
  }
}

