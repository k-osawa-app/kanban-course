import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem, 
  DragDropModule 
} from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/boardservice';
import { TaskForm } from '../../home/task-form/task-form';
import { Task, TaskStatus } from '../../models/board.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-board',
  imports: [CommonModule, DragDropModule, TaskForm ],
  templateUrl: './boardcomponent.html',
  styleUrl: './boardcomponent.scss',
})
export class BoardComponent {
  private route = inject(ActivatedRoute); 
  private boardService = inject(BoardService); 
  user: any;
  statuses: TaskStatus[] = ['todo', 'doing', 'done']; 
  onlyMyTasks = signal<boolean>(false); 
  isModalOpen = signal(false);
  public currentBoardId?: string ;
 
  private tasksStream$: Observable<Task[]> = this.route.paramMap.pipe(
 
    switchMap(params => {
      const id = params.get('id');

      if (id) {     
      this.currentBoardId = id;
      }
         
      return id ? this.boardService.getTasks(id) : [];            
    })
  );


  tasksSignal = toSignal(this.tasksStream$, { initialValue: [] });

  filteredTasks = computed(() => {

    const allTasks = this.tasksSignal();
    const isFilterActive = this.onlyMyTasks();

    if (!isFilterActive) {
      return allTasks;
    }
     return allTasks.filter(t => t.assignee === 'Me');   
  });
  
  toggleFilter(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.onlyMyTasks.set(isChecked);
  }
 
  getTasksByStatus(status: TaskStatus) {    
    return this.filteredTasks().filter(t => t.status === status);
  }

  //------------------------
  //------------------------
  // ヘルパー関数: ステータスごとにタスクを分ける
  // computedされた filteredTasks() を使うことで、フィルタリング状態も反映される  
  //getTasksByStatus(status: TaskStatus)-->tasksGroupedByStatus = computed
  tasksGroupedByStatus = computed(() => {
    const tasks = this.filteredTasks();
    const grouped: Record<TaskStatus, Task[]> = { todo: [], doing: [], done:[] };
    
    tasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  });

  /**
   * タスク作成ハンドラ-step5
   */
  async onTaskCreate(taskData: { title: string; description: string; status: TaskStatus }) {
    if (!this.currentBoardId) return;
    try {
      await this.boardService.createTask(this.currentBoardId, taskData);
      this.isModalOpen.set(false); // 成功したら閉じる
    } catch (error) {
      console.error('タスク作成失敗:', error);
      alert('タスクの作成に失敗しました');
    }
  }
  
    /**
   * ドラッグ＆ドロップ イベントハンドラ-step5
   * @param event CDKから渡されるドロップイベント
   * @param targetStatus ドロップ先のステータス
   */
  drop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      // A. 同じリスト内での並べ替え
      // Firestoreのデータは「配列」ではなく「コレクション」なので、
      // 厳密な順序保持には別途「order」フィールドが必要ですが、
      // ここではUI上の並べ替えのみシミュレートします。
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // B. 別のリスト（ステータス）への移動
      const task = event.previousContainer.data[event.previousIndex];
      
    // 1. UIを即座に更新 (Optimistic UI)
      // Angular CDKのtransferArrayItemはローカル配列を書き換えます
      // ※注意: Firestoreのリアルタイム更新と競合する場合があるため、
      // 本格的なアプリでは「ローカル更新」と「サーバー更新」の整合性を取る設計が必要です。
       transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
     console.log("task.id  =",task.id);
     console.log("this.currentBoardId  =",this.currentBoardId);
    // 2. バックエンド更新
    if (task.id && this.currentBoardId) { //task.id
        this.boardService.updateTaskStatus(this.currentBoardId, task.id, targetStatus)
      .catch(err => {
            console.error('更新失敗', err);
            // エラー時は元の状態に戻す処理（ロールバック）を入れるのがベストプラクティスです
          });
      }
    }
  }
}

