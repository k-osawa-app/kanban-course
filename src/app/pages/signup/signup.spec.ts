import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signup } from './signup';
import { AuthService } from '../../services/authservice';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let mockAuthService: MockedObject<AuthService>;
  let mockRouter: MockedObject<Router>;

  beforeEach(async () => {
   
    mockAuthService = {
      signup: vi.fn().mockName('AuthService.signup'),
    } as unknown as MockedObject<AuthService>;

    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
    } as unknown as MockedObject<Router>;

    await TestBed.configureTestingModule({
      imports: [Signup, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    //await fixture.whenStable();
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('フォームのバリデーションテスト', () => {
    it('初期状態ではフォームは無効(invalid)であること', () => {
      expect(component.signupForm.valid).toBe(false);
    });

    it('nameが空の場合は無効になること', () => {
      const nameControl = component.signupForm.controls.name;

      nameControl.setValue('');
      expect(nameControl.valid).toBe(false);
      expect(nameControl.hasError('required')).toBe(true);

      nameControl.setValue('山田 太郎');
      expect(nameControl.valid).toBe(true);
    });

    it('emailの形式が正しくない場合は無効になること', () => {
      const emailControl = component.signupForm.controls.email;

      emailControl.setValue('');
      expect(emailControl.valid).toBe(false); 

      emailControl.setValue('invalid-email');
      expect(emailControl.valid).toBe(false);
      expect(emailControl.hasError('email')).toBe(true); 

      emailControl.setValue('test@example.com');
      expect(emailControl.valid).toBe(true);
    });

    it('passwordが6文字未満の場合は無効になること', () => {
      const passwordControl = component.signupForm.controls.password;

      passwordControl.setValue('');
      expect(passwordControl.valid).toBe(false); 

      passwordControl.setValue('12345'); 
      expect(passwordControl.valid).toBe(false);
      expect(passwordControl.hasError('minlength')).toBe(true); 

      passwordControl.setValue('123456');
      expect(passwordControl.valid).toBe(true);
    });
  });

  describe('onSubmit() のテスト', () => {
    it('フォームが無効な場合、authService.signup は呼ばれないこと', () => {
      
      component.onSubmit();
      expect(mockAuthService.signup).not.toHaveBeenCalled();
    });

    it('登録成功時、/ に遷移し、成功ログが出力されること', () => {
      
      vi.spyOn(console, 'log').mockReturnValue(undefined);
      
      component.signupForm.setValue({
        name: '山田 太郎',
        email: 'test@example.com',
        password: 'password123',
      });

      mockAuthService.signup.mockReturnValue(of(undefined)); //of({})

      component.onSubmit();

      expect(mockAuthService.signup).toHaveBeenCalledWith({
        name: '山田 太郎',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(console.log).toHaveBeenCalledWith('登録成功！');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']); //dashboard
    });

    it('登録失敗時、エラーメッセージが表示され、エラーログが出力されること', () => {

      vi.spyOn(console, 'error').mockReturnValue(undefined);

      component.signupForm.setValue({
        name: '山田 太郎',
        email: 'test@example.com',
        password: 'password123',
      });

      const mockError = new Error('メールアドレスが既に使用されています');
      mockAuthService.signup.mockReturnValue(throwError(() => mockError));

      component.onSubmit();

      expect(mockAuthService.signup).toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith('登録失敗', mockError);

      expect(component.errorMessage).toBe(
        '登録に失敗しました: メールアドレスが既に使用されています',
      );

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
