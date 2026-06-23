import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { AuthService } from '../../services/authservice';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let mockAuthService: MockedObject<AuthService>;
  let mockRouter: MockedObject<Router>;

  beforeEach(async () => {
  
    mockAuthService = {
      login: vi.fn().mockName('CAuth.login'),
    } as unknown as MockedObject<AuthService>;;
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    } as unknown as MockedObject<Router>;

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    //await fixture.whenStable();
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('フォームのバリデーションテスト', () => {
    it('初期状態ではフォームは無効(invalid)であること', () => {
      expect(component.loginForm.valid).toBe(false);
    });

    it('emailの形式が正しくない場合は無効になること', () => {
      const emailControl = component.loginForm.controls.email;

      emailControl.setValue('invalid-email');
      expect(emailControl.valid).toBe(false);
      expect(emailControl.hasError('email')).toBe(true);

      emailControl.setValue('test@example.com');
      expect(emailControl.valid).toBe(true);
    });

    it('passwordが6文字未満の場合は無効になること', () => {
      const passwordControl = component.loginForm.controls.password;

      passwordControl.setValue('12345'); // 5文字
      expect(passwordControl.valid).toBe(false);
      expect(passwordControl.hasError('minlength')).toBe(true);

      passwordControl.setValue('123456'); // 6文字
      expect(passwordControl.valid).toBe(true);
    });
  });

  describe('onSubmit() のテスト', () => {
    it('フォームが無効な場合、authService.login は呼ばれないこと', () => {
      component.onSubmit();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('ログイン成功時、/dashboard に遷移すること', () => {
  
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      mockAuthService.login.mockReturnValue(of(undefined)); //of({ token: 'dummy-token' })

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('ログイン失敗時、エラーメッセージが表示されること', () => {
   
      vi.spyOn(console, 'error').mockReturnValue(undefined);

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      mockAuthService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalled();

      expect(component.errorMessage).toBe('ログインに失敗しました。入力内容を確認してください。');

      expect(console.error).toHaveBeenCalled();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
