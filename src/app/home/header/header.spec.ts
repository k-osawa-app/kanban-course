import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';//, ActivatedRoute
import { of } from 'rxjs';

import { Header } from './header'; 
import { AuthService } from '../../services/authservice';
import { Network } from '../../services/network';

describe('Header Component', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  
  // 依存関係（サービスなど）のモックを用意
  let mockAuthService: any;// jasmine.SpyObj<CAuth>;
  ///let mockRouter: jasmine.SpyObj<Router>;
  let mockNetworkService: jasmine.SpyObj<Network>;// any;

  beforeEach(async () => {
    // CAuth のメソッド 'logout' をスパイし、ダミーのObservableを返すように設定
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {user$: of(null)}
);
    mockAuthService.logout.and.returnValue(of(null));//of(null)
    // Router のメソッド 'navigate' をスパイする
    ///mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    // Network は現在のところメソッド呼び出しがないため、空のオブジェクトとしてモック化
    mockNetworkService = jasmine.createSpyObj('Network', ['isOnline']);//['dummyMethod']
    // デフォルトの戻り値を設定（例: オンライン状態をtrueとする）
    //ここでtrueは不要、’オフライン時にはオフラインバッジが表示されること’に移動
    //mockNetworkService.isOnline.and.returnValue(true);

    await TestBed.configureTestingModule({
      // ※ Angular 19など、デフォルトでStandaloneの場合は imports を使用します。
      // もしエラーになる場合は `declarations: [Header]` に変更してください。
      imports: [Header],
      providers:[
        { provide: AuthService, useValue: mockAuthService },
        ///{ provide: Router, useValue: mockRouter },
        { provide: Network, useValue: mockNetworkService },
        // RouterLink を使っている場合、ActivatedRoute の依存解決が必要になるためモックを提供
        ///{ provide: ActivatedRoute, useValue: {} } 
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが正常に生成されること (should create)', () => {
    expect(component).toBeTruthy();
  });

  it('オフライン時にはオフラインバッジが表示されること', () => {
    // テスト内で意図的にオフライン状態(false)に変更する
    mockNetworkService.isOnline.and.returnValue(false);//false
    fixture.detectChanges(); // 変更をHTMLに反映

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.offline-badge');
    expect(badge).toBeTruthy(); // バッジが存在することを検証
    expect(badge?.textContent).toContain('オフラインモード');
  });

  describe('logout() メソッド', () => {
    it('実行時に authService.logout() が呼ばれること', () => {
      component.logout();
      
      // logoutメソッドが呼び出されたかを検証
      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('ログアウト時に /login へ遷移すること', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // テスト内で navigate を監視する

    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });    
  });
});
