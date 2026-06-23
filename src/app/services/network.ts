import { Service } from '@angular/core';
import { fromEvent, merge, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Service()
export class Network {
  
  isOnline = toSignal(
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).pipe(startWith(navigator.onLine)), 
    { initialValue: navigator.onLine }
  );
  
}