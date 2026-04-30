import { Injectable, inject } from '@angular/core';
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
import { Observable, tap } from 'rxjs';
import { Board, Task, TaskStatus } from '../models/board.model';
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

  /**
   * タスクの新規作成
   */
  async createTask(boardId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    const tasksRef = collection(this.firestore, `boards/${boardId}/tasks`);
    const newTask: Task = {
      ...task,
      createdAt: Date.now(), // サーバー側で設定するのが理想ですが、今回は簡易的にここで行います
    };
    await addDoc(tasksRef, newTask);
  }

   /**
   * タスクのステータス更新（ドラッグ＆ドロップ用）
   */
  async updateTaskStatus(boardId: string, taskId: string, newStatus: TaskStatus): Promise<void> {
    const taskDocRef = doc(this.firestore, `boards/${boardId}/tasks/${taskId}`);
    await updateDoc(taskDocRef, { status: newStatus });
  }
}

