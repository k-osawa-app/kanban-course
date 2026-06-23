import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authservice';
import { Network } from '../../services/network';


@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink], 
  templateUrl: `./header.html`,
  styleUrl: `./header.scss`,
  //changeDetection: ChangeDetectionStrategy.Eager
})
export class Header { 
  public authService = inject(AuthService);
  private router = inject(Router);
  public network = inject(Network);

  logout():void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);     
    });
  }
}
