import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from './services/boardservicen';
import { Board } from './models/kanban.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit { 
  board?: Board;

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
       this.loadData();
  }

  loadData(): void {
      this.board = this.boardService.getBoard();
  }
  
  onAddTask() {
      this.boardService.addTask('Doneの新しい追加タスク');
      this.loadData();
  }
}