import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authservice';


@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink], 
  templateUrl: `./header.html`,
  styleUrl: `./header.scss`
})
export class Header {
  // テンプレートからpublicでアクセスできるようにする
  public authService = inject(AuthService);
  private router = inject(Router);
  user: any;

  logout():void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      //return true;
    });
  }
}
