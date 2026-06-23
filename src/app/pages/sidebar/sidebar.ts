import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { BoardService } from '../../services/boardservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule, RouterLink ], 
  templateUrl: `./sidebar.html`,
  //changeDetection: ChangeDetectionStrategy.Eager
})
export class Sidebar {
  private boardService = inject(BoardService);
  
  boards$ = this.boardService.getUserBoards();
}

