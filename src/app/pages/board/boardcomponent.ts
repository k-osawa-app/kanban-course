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
  user: any;
  statuses: TaskStatus[] = ['todo', 'doing', 'done']; 
  onlyMyTasks = signal<boolean>(false); 
 
  private tasksStream$: Observable<Task[]> = this.route.paramMap.pipe(
 
    switchMap(params => {

      const id = params.get('id');
         
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
}

