import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authservice'; 
import { SignupCredentials } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService); 
  private router = inject(Router);  
  errorMessage: string | null = null;
 
  signupForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]], 
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(6)]] 
  });
  
  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const { name, email, password } = this.signupForm.getRawValue();
    
    const credentials: SignupCredentials = {
      name,
      email,
      password
    };

    this.authService.signup(credentials).subscribe({
      next: () => {
        console.log('登録成功！');
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('登録失敗', err);
        this.errorMessage = '登録に失敗しました: ' + err.message;
      }
    });
  }
}
