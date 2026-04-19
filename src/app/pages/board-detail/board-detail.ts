import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { BoardComponent } from '../board/boardcomponent';

@Component({
  selector: 'app-board-detail',
  imports: [ RouterOutlet,BoardComponent],//
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.scss',
})
export class BoardDetail {}
