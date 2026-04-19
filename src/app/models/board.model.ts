import { Timestamp } from "@angular/fire/firestore";

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id?: string;       
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;  // 担当者のユーザー名
  seqNo?: number;
  createdAt?: number; //Timestamp | undefined;  
  updatedAt?: number;//Timestamp | undefined;
}

export interface Board {
  id?: string;
  title: string;
  ownerId: string;    // 作成者のUID
  memberIds?: string[]; // //共有しているメンバーのUID配列
  seqNo?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
