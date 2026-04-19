import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BoardService } from '../../services/boardservice';
import { Task, TaskStatus } from '../../models/board.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './boardcomponent.html',
  styleUrl: './boardcomponent.scss',
})
export class BoardComponent {
  private route = inject(ActivatedRoute); 
  private boardService = inject(BoardService); // constructorの代わりにinjectを使用(統一感のため)

  private boardId = '0nOrOEPVjzlqUxObcHBQ'; // gzF3tTadOzO7LvcfwlNZ
  statuses: TaskStatus[] = ['todo', 'doing', 'done']; 
  onlyMyTasks = signal<boolean>(false); 

  // 1. Observableを変数として保持する（ここでは絶対に .subscribe() しない）
  // 慣例としてObservableの変数名には末尾に「$」をつけます。
  tasks$: Observable<Task[]> = this.boardService.getTasks(this.boardId);

  // 2. Observableをそのまま toSignal に渡す
  // 初期値を [] としているため、データ取得前は空配列として扱われます。
  // ※ toSignalが自動的にsubscribeし、コンポーネント破棄時にunsubscribeしてくれます。
  tasksSignal = toSignal(this.tasks$, { initialValue: [] });

  // 3. Signalを使ってフィルタリング
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
}

