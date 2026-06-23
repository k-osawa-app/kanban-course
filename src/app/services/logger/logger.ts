import { Injectable, Service } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
@Service()
export class Logger {
  log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[KanBan-Course ${timestamp}]: ${message}`);
  }
}
