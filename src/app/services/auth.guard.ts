import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './authservice'; 
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    take(1), 
    map(user => {
      if (user) {
        return true;
      }
      
      console.warn('アクセス拒否: ログインが必要です');
      router.navigate(['/login']);
      return false;
    })
  );
};