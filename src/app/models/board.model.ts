import { Timestamp } from "@angular/fire/firestore";

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id?: string;       
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;  
  
  seqNo?: number;
  createdAt?: number;  
  updatedAt?: number;
}

export interface Board {
  id: string;
  title: string;
  ownerId?: string;  
  memberIds?: string[]; 
  seqNo?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
