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
    // Firebase Auth のモックオブジェクト（中身は空でOK）
    authMock = {};

    loginAuthMock = {
      currentUser: { uid: 'test-uid', email: 'test@example.com' },
    };

    // ラッパーサービスのスパイ（モック）を作成
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
    // authState は CAuth クラスの初期化時に呼ばれるため、Observable を返すように設定
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
    // TODO: vitest-migration: The 'done' callback was used in an unhandled way. Please migrate manually.
    it('正常にユーザー登録され、プロフィールが更新されること', async() => {//done
      // 1. テストデータの準備 (Arrange)
      const mockCredentials: SignupCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUserCredential: any = {
        user: { uid: '12345' },
      };

      // createUserWithEmailAndPassword が成功し、mockUserCredential を返すよう設定
      wrapperSpy.getCreateUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
      // updateProfile が成功し、完了するよう設定
      wrapperSpy.getUpdateProfile.mockResolvedValue();

      // 実行 (Act)
      await firstValueFrom(service.signup(mockCredentials));

      // 検証 (Assert) - await が完了した後にアサーションを行います
      // createUserWithEmailAndPassword が正しい引数で呼ばれたか
      expect(wrapperSpy.getCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
       authMock,
       mockCredentials.email,
       mockCredentials.password,
      );
      // updateProfile が正しい引数で呼ばれたか
      expect(wrapperSpy.getUpdateProfile).toHaveBeenCalledWith(mockUserCredential.user, {
      displayName: mockCredentials.name,
      });
    });

  //});
      // await service.signup(mockCredentials).subscribe({
      //   next: () => {
      //     // 3. 検証 (Assert)
      //     // createUserWithEmailAndPassword が正しい引数で呼ばれたか
      //     expect(wrapperSpy.getCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      //       authMock,
      //       mockCredentials.email,
      //       mockCredentials.password,
      //     );
       
      //     // updateProfile が正しい引数で呼ばれたか
      //     expect(wrapperSpy.getUpdateProfile).toHaveBeenCalledWith(mockUserCredential.user, {
      //       displayName: mockCredentials.name,
      //     });
      //     //done(); // 非同期テスト終了
      //   },
      //   //error: done.fail,
      // });     
  
    it('ユーザー登録(createUserWithEmailAndPassword)でエラーになった場合、エラーを返すこと', () => {
      // 1. テストデータの準備
      const mockCredentials: SignupCredentials = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockError = new Error('Auth Failed');

      // createUserWithEmailAndPassword が失敗（Reject）するよう設定
      wrapperSpy.getCreateUserWithEmailAndPassword.mockRejectedValue(mockError);

      // 2. 実行
      service.signup(mockCredentials).subscribe({
        next: () => {
          throw new Error('成功ルートに入ってはいけない');
        },
        error: (err) => {
          // 3. 検証
          expect(err).toBe(mockError);
          expect(wrapperSpy.getCreateUserWithEmailAndPassword).toHaveBeenCalled();
          // 登録が失敗したので updateProfile は呼ばれないはず
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
    // Authオブジェクトのモック作成

    authMock = {
      currentUser: { uid: 'test-uid', email: 'test@example.com' },
    };

    // FirebaseAuthWrapperServiceのモック作成
    fireAuthWrapperMock = {
      getAuthState: vi.fn().mockName('FirebaseAuthWrapper.getAuthState'),
      getSignInWithEmailAndPassword: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getSignInWithEmailAndPassword'),
        
      // 不足しているメソッドを追加
      getCreateUserWithEmailAndPassword: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getCreateUserWithEmailAndPassword'),
      getUpdateProfile: vi
        .fn()
        .mockName('FirebaseAuthWrapper.getUpdateProfile'),  
    };

    // authState はコンストラクタ(プロパティ初期化)時に呼ばれるため、デフォルトの戻り値を設定しておく
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

      // signInWithEmailAndPassword が成功（resolve）するようにモックを設定
      fireAuthWrapperMock.getSignInWithEmailAndPassword.mockResolvedValue({} as any);

      // getCurrentUserが呼ばれることを確認するためのスパイ
      vi.spyOn(service, 'getCurrentUser');

      service.login(credentials).subscribe({
        next: (result) => {
          // ラッパーサービスのメソッドが正しい引数で呼ばれたか検証
          expect(fireAuthWrapperMock.getSignInWithEmailAndPassword).toHaveBeenCalledWith(
            authMock,
            credentials.email,
            credentials.password,
          );
          // getCurrentUser が実行されたか検証
          expect(service.getCurrentUser).toHaveBeenCalled();
          // 戻り値が undefined(void) であるか検証
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

      // signInWithEmailAndPassword が失敗（reject）するようにモックを設定
      fireAuthWrapperMock.getSignInWithEmailAndPassword.mockRejectedValue(mockError);

      service.login(credentials).subscribe({
        next: () => {
          throw new Error('成功するべきではありません');
        },
        error: (err) => {
          // ラッパーのメソッドが呼ばれたか検証
          expect(fireAuthWrapperMock.getSignInWithEmailAndPassword).toHaveBeenCalledWith(
            authMock,
            credentials.email,
            credentials.password,
          );
          // エラーオブジェクトがそのまま返ってきているか検証
          expect(err).toBe(mockError);
        },
      });
    });
  });
});
