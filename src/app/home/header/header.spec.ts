import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router'; //, ActivatedRoute
import { of } from 'rxjs';

import { Header } from './header';
import { AuthService } from '../../services/authservice';
import { Network } from '../../services/network';
import { signal ,WritableSignal} from '@angular/core'; 

describe('Header Component', () => {
  let component: Header;
  let fixture: any;//ComponentFixture<Header>;

  // 依存関係（サービスなど）のモックを用意
  let mockAuthService: any; // jasmine.SpyObj<CAuth>;
  ///let mockRouter: jasmine.SpyObj<Router>;
  let mockNetworkService: { isOnline: WritableSignal<boolean> }; // any;

  const mockRouter = {
    navigate: vi.fn().mockResolvedValue(true),
    navigateByUrl: vi.fn().mockResolvedValue(true),
    // その他、コンポーネント内で使っているRouterのプロパティ（events等）があればここに追加
  };

    const mockActivatedRoute = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      paramMap: {
        get: () => null,
      },
      queryParamMap: {
        get: () => null,
      }
    }
  };

  beforeEach(async () => {
    // CAuth のメソッド 'logout' をスパイし、ダミーのObservableを返すように設定
    mockAuthService = {
      logout: vi.fn().mockName('AuthService.logout'),
      user$: of(null),
    };
    mockAuthService.logout.mockReturnValue(of(null)); //of(null)
  
    mockNetworkService = {
        //isOnline: vi.fn().mockName('Network.isOnline').mockReturnValue(true) as any,
        isOnline: signal(true),
      }; 

    await TestBed.configureTestingModule({

      providers: [
        { provide: AuthService, useValue: mockAuthService },
        //{ provide: Router, useValue: mockRouter },
        { provide: Network, useValue: mockNetworkService },
        // 本物のRouterの代わりにモックを提供する
        { provide: Router, useValue: mockRouter },
        // ActivatedRoute のモックを providers に追加
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
       
      ],
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
    //mockNetworkService.isOnline.mockReturnValue(false); //false
    mockNetworkService.isOnline.set(false);
    fixture.detectChanges(); // 変更をHTMLに反映

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.offline-badge');
       
    expect(badge).toBeTruthy(); // バッジが存在することを検証

    expect(badge?.textContent).toContain('オフラインモード');
  });

  //describe('logout() メソッド', () => {
    it('実行時に logout() が呼ばれること', () => {
      component.logout();
     
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('ログアウト時に /login へ遷移すること', () => {
      const router = TestBed.inject(Router);
      //vi.spyOn(router, 'navigate').mockReturnValue(undefined); // テスト内で navigate を監視する
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      component.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  //});
});
