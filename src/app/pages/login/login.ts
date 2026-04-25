import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./login.html`,
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  loginForm = this.fb.group({

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {

    if (this.loginForm.valid) {

      const { email, password } = this.loginForm.getRawValue();
      
      this.authService.login({ email: email!, password: password! }).subscribe({
        
        next: () => {

          console.log('Component: Login Complete');
         
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          
          this.errorMessage = 'ログインに失敗しました。入力内容を確認してください。';

          console.error(err);
        }
      });
    }
  }
}
