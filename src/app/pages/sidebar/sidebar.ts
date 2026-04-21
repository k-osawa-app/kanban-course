import { Component, inject } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { BoardService } from '../../services/boardservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule, RouterLink ], 
  templateUrl: `./sidebar.html`
})
export class Sidebar {
  private boardService = inject(BoardService);
  // Observableをそのままテンプレートに渡す
  boards$ = this.boardService.getUserBoards();
}

