import { Injectable } from '@angular/core';
import { Task, Board } from '../models/kanban.model';
import { Logger } from './logger'; 

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private mockBoard: Board = {
    id: 'b1',
    title: 'アプリ開発プロジェクト',
    ownerId: 'u1',
    created: new Date(),
    tasks: [
      { id: 't1', title: '要件定義', description: 'クライアントへのヒアリング', status: 'done', color: 'green' },
      { id: 't2', title: '設計', description: 'コンポーネント設計図を作る', status: 'doing', color: 'blue' },
      { id: 't3', title: '実装', description: 'Angularでコーディング', status: 'todo', color: 'red' },
    ]
  };

 constructor(private logger: Logger) {}
  getBoard(): Board {
    this.logger.log('ボードデータを取得しました');
    return this.mockBoard;
  }
  
  addTask(title: string): void {
    const newTask: Task = {
        id: Math.random().toString(36).substring(7), // 簡易的なID生成
        title: title,
        description: 'テスト',
        status: 'done'
    };
    this.mockBoard.tasks.push(newTask);
    this.logger.log(`タスク追加: ${title}`);
  }
}
