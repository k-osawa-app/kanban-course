import { Injectable,Service, signal } from '@angular/core';
import { fromEvent, merge, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

// @Injectable({
//   providedIn: 'root'
// })
@Service()
export class Network {
  // オンライン状態を監視するSignal
  // windowの 'online' / 'offline' イベントをマージして監視
  isOnline = toSignal(
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).pipe(startWith(navigator.onLine)), // 初期値
    { initialValue: navigator.onLine }
  );
  
}