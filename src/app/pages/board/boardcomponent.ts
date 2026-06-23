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
  styleUrl: './boardcomponent.scss' 
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
 
  drop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
    
      const task = event.previousContainer.data[event.previousIndex];
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    
    if (task.id && this.currentBoardId) { 
        this.boardService.updateTaskStatus(this.currentBoardId, task.id, targetStatus)
      .catch(err => {
            console.error('更新失敗', err);            
          });
      }
    }
  }
}

