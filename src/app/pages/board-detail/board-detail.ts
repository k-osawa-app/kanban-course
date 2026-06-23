import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; 
import { BoardComponent } from '../board/boardcomponent';

@Component({
  selector: 'app-board-detail',
  imports: [ RouterOutlet, RouterLink,BoardComponent],//
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.scss',
  //changeDetection: ChangeDetectionStrategy.Eager
})
export class BoardDetail {}
