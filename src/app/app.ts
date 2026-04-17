import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // RouterLinkも追加
import { Header } from "./home/header/header"; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: `./app.html`,
  styleUrl: './app.scss'
})
export class App {}