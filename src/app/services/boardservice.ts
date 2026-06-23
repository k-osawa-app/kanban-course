import { inject, Service } from '@angular/core';
import {    
  where, 
  orderBy 
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Board, Task, TaskStatus } from '../models/board.model';
import { AuthService } from './authservice'; 
import { FirestoreWrapper } from './wrapper/firestore-wrapper'; 

@Service()
export class BoardService {
  private authService = inject(AuthService);
  private firestoreWrapper = inject(FirestoreWrapper);

  getUserBoards(): Observable<Board[]> {
    const user = this.authService.getCurrentUser(); 
    
    if (!user) return of([]); 
    
    return this.firestoreWrapper.getCollectionData<Board>(
      'boards',
      where('memberIds', 'array-contains', user.uid)
    );
  
  }

  getTasks(boardIds: string): Observable<Task[]> {  
    return this.firestoreWrapper.getCollectionData<Task>(
      `boards/${boardIds}/tasks`,
      orderBy('createdAt', 'asc')
    );    
    
  }

  addTask(boardId: string, task: Task): Promise<any> {
     const tasksRef = this.firestoreWrapper.getCollectionRef(`boards/${boardId}/tasks`);
  return this.firestoreWrapper.addDocument(tasksRef, task);
    
  }

  async createTask(boardId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    
    const tasksRef = this.firestoreWrapper.getCollectionRef(`boards/${boardId}/tasks`);
    const newTask: Task = {
      ...task,
      createdAt: Date.now(), 
    };
    
    await this.firestoreWrapper.addDocument(tasksRef, newTask);   
  }

  async updateTaskStatus(boardId: string, taskId: string, newStatus: TaskStatus): Promise<void> {
    const path = `boards/${boardId}/tasks/${taskId}`;   
    const taskDocRef = this.firestoreWrapper.getDocRef(path);
    await this.firestoreWrapper.getUpdateDoc(taskDocRef, { status: newStatus });
  }
}

