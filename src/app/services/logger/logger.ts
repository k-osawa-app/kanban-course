import { Service } from '@angular/core';

@Service()
export class Logger {
  log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[KanBan-Course ${timestamp}]: ${message}`);
  }
}
