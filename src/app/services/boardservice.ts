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
import { AuthService } from './authservice'; // Step 3で作ったもの

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService); // ユーザーID取得用

  /**
   * 自分が所属するボード一覧をリアルタイム取得
   */
  getUserBoards(): Observable<Board[]> {
    // 現在のユーザーIDが必要（本来はAuthServiceから取得）
    // 簡略化のため、ここでは固定値か、コンポーネントから渡す設計にします
    const user = this.authService.getCurrentUser(); 
    if (!user) return new Observable(); // 未ログイン時は空

    const boardsRef = collection(this.firestore, 'boards');
    // memberIds配列に自分のuidが含まれているボードを探すクエリ
    const q = query(boardsRef, where('memberIds', 'array-contains', user.uid));
    
    // collectionDataはObservableを返す。idFieldを指定するとドキュメントIDもオブジェクトに含まれる
    return collectionData(q, { idField: 'id' }) as Observable<Board[]>;
  }

  getBoards(): Observable<Board[]> {
    // 念のため 'boards ' の末尾の余計なスペースも削除すると安全です
    const boardsRef = collection(this.firestore, 'boards');
    const q = query(boardsRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Board[]>
  }
  
   /*
   * 特定のボード内のタスク一覧を取得
   * パス: boards/{boardId}/tasks
   */
    getTasks(boardIds: string): Observable<Task[]> {
     console.log(boardIds); 
    const tasksRef = collection(this.firestore, `boards/${boardIds}/tasks`);
    console.log('tasksRef :',tasksRef);
    // 作成日順に並べる
    const q = query(tasksRef, orderBy('createdAt', 'asc'));        
    // return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
    console.log("q   =",q);
    return collectionData(q, { idField: 'id' }).pipe(
      // tapはデータには影響を与えず、副作用（ログ出力など）だけを実行します
      tap((tasks:any) => console.log('Firestoreから取得したデータ:', tasks))
    ) as Observable<Task[]>; 
  }

  /**
   * タスクの追加（Promiseを返す）
   */
  addTask(boardId: string, task: Task): Promise<any> {
    const tasksRef = collection(this.firestore, `boards/${boardId}/tasks`);
    return addDoc(tasksRef, task);
  }
}

