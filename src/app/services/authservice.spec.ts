import type { MockedObject } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './authservice';
import { Auth } from '@angular/fire/auth';
import { FirebaseAuthWrapper } from './wrapper/firebaseauth-wrapper';
import { SignupCredentials, LoginCredentials } from '../models/user.model';
import { of, firstValueFrom } from 'rxjs';

describe('AuthService1', () => {
  let service: AuthService;
  let wrapperSpy: MockedObject<FirebaseAuthWrapper>;
  let authMock: any;
  let loginAuthMock: any;

  beforeEach(() => {
    
    authMock = {};

    loginAuthMock = {
      currentUser: { uid: 'test-uid', email: 'test@example.com' },
    };

    const spy = {
      getAuthState: vi.fn().mockName('FirebaseAuthWrapper.getAuthState'),
      getCreateUserWithEmailAndPassword: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getCreateUserWithEmailAndPassword'),
      getUpdateProfile: vi.fn().mockName('FirebaseAuthWrapper.getUpdateProfile'),
      getSignInWithEmailAndPassword: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getSignInWithEmailAndPassword'),
    };
  
    spy.getAuthState.mockReturnValue(of(null)); //authState

    spy.getAuthState.mockReturnValue(of(authMock.currentUser));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: FirebaseAuthWrapper, useValue: spy }, //spy
      ],
    });

    service = TestBed.inject(AuthService);
    wrapperSpy = TestBed.inject(FirebaseAuthWrapper) as MockedObject<FirebaseAuthWrapper>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signup',() => {
    
    it('正常にユーザー登録され、プロフィールが更新されること', async() => {
      
      const mockCredentials: SignupCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUserCredential: any = {
        user: { uid: '12345' },
      };

      wrapperSpy.getCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
     
      wrapperSpy.getUpdateProfile.mockResolvedValue();

      await firstValueFrom(service.signup(mockCredentials));

      expect(wrapperSpy.getCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
       authMock,
       mockCredentials.email,
       mockCredentials.password,
      );
 
      expect(wrapperSpy.getUpdateProfile).toHaveBeenCalledWith(mockUserCredential.user, {
      displayName: mockCredentials.name,
      });
    });
   
    it('ユーザー登録(createUserWithEmailAndPassword)でエラーになった場合、エラーを返すこと', () => {
      
      const mockCredentials: SignupCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockError = new Error('Auth Failed');

      wrapperSpy.getCreateUserWithEmailAndPassword.mockRejectedValue(mockError);

      service.signup(mockCredentials).subscribe({
        next: () => {
          throw new Error('成功ルートに入ってはいけない');
        },
        error: (err) => {
         
          expect(err).toBe(mockError);

          expect(wrapperSpy.getCreateUserWithEmailAndPassword).toHaveBeenCalled();
         
          expect(wrapperSpy.getUpdateProfile).not.toHaveBeenCalled();
        },
      });
    });
  });
});

describe('AuthService2', () => {
  let service: AuthService;
  let authMock: any;
  let fireAuthWrapperMock: MockedObject<FirebaseAuthWrapper>;

  beforeEach(() => {

    authMock = {
      currentUser: { uid: 'test-uid', email: 'test@example.com' },
    };

    fireAuthWrapperMock = {
      getAuthState: vi.fn().mockName('FirebaseAuthWrapper.getAuthState'),
      getSignInWithEmailAndPassword: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getSignInWithEmailAndPassword'),

      getCreateUserWithEmailAndPassword: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getCreateUserWithEmailAndPassword'),
      getUpdateProfile: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getUpdateProfile'),  
    };

    fireAuthWrapperMock.getAuthState.mockReturnValue(of(authMock.currentUser)); //?

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: FirebaseAuthWrapper, useValue: fireAuthWrapperMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('認証が成功した場合、正常に解決されて void を返すこと', async () => {
      const credentials: LoginCredentials = { email: 'test@example.com', password: 'password123' };

      fireAuthWrapperMock.getSignInWithEmailAndPassword.mockResolvedValue({} as any);

      vi.spyOn(service, 'getCurrentUser');

      service.login(credentials).subscribe({
        next: (result) => {
     
          expect(fireAuthWrapperMock.getSignInWithEmailAndPassword).toHaveBeenCalledWith(
            authMock,
            credentials.email,
            credentials.password,
          );
    
          expect(service.getCurrentUser).toHaveBeenCalled();
       
          expect(result).toBeUndefined();
        },
        error: () => {
          throw new Error('エラーが発生するべきではありません');
        },
      });
    });

    it('認証が失敗した場合、エラーが伝播されること', async () => {
      const credentials: LoginCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };
      const mockError = new Error('auth/user-not-found');

      fireAuthWrapperMock.getSignInWithEmailAndPassword.mockRejectedValue(mockError);

      service.login(credentials).subscribe({
        next: () => {
          throw new Error('成功するべきではありません');
        },
        error: (err) => {
     
          expect(fireAuthWrapperMock.getSignInWithEmailAndPassword).toHaveBeenCalledWith(
            authMock,
            credentials.email,
            credentials.password,
          );  
          expect(err).toBe(mockError);
        },
      });
    });
  });
});
