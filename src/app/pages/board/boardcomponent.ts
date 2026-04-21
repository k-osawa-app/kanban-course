import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BoardService } from '../../services/boardservice';
import { Task, TaskStatus } from '../../models/board.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './boardcomponent.html',
  styleUrl: './boardcomponent.scss',
})
export class BoardComponent {
  private route = inject(ActivatedRoute); 
  private boardService = inject(BoardService); 
  statuses: TaskStatus[] = ['todo', 'doing', 'done']; 
  onlyMyTasks = signal<boolean>(false); 

  // 1. Observableを変数として保持する（ここでは絶対に .subscribe() しない）
  // 慣例としてObservableの変数名には末尾に「$」をつけます 
  private tasksStream$: Observable<Task[]> = this.route.paramMap.pipe(
    // switchMap: IDが変わったら前の購読をキャンセルし、新しいIDで購読し直す
    switchMap(params => {
      const id = params.get('id');
         
      return id ? this.boardService.getTasks(id) : [];            
    })
  );

  // 2. Observableをそのまま toSignal に渡す
  // 初期値を [] としているため、データ取得前は空配列として扱われます。
  tasksSignal = toSignal(this.tasksStream$, { initialValue: [] });

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

