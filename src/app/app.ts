import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // RouterLinkも追加

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: `./app.html`,
  styleUrl: './app.scss'
})
export class App {}