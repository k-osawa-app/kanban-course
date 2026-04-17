import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard'; // インポート追加

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./pages/login/login').then(m => m.Login)
  },
   {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup').then(m => m.Signup)    
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard] 

  },
  {
    path: 'board/:id',
    loadComponent: () => 
      import('./pages/board-detail/board-detail').then(m => m.BoardDetail),
    canActivate: [authGuard] 

  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
