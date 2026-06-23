import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router'; //, ActivatedRoute
import { of } from 'rxjs';

import { Header } from './header';
import { AuthService } from '../../services/authservice';
import { Network } from '../../services/network';
import { signal ,WritableSignal} from '@angular/core'; 

describe('Header Component', () => {
  let component: Header;
  let fixture: any;
  let mockAuthService: any; 
  let mockNetworkService: { isOnline: WritableSignal<boolean> }; 
  const mockRouter = {
    navigate: vi.fn().mockResolvedValue(true),
    navigateByUrl: vi.fn().mockResolvedValue(true)
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
   
    mockAuthService = {
      logout: vi.fn().mockName('AuthService.logout'),
      user$: of(null),
    };
    mockAuthService.logout.mockReturnValue(of(null)); 
  
    mockNetworkService = {
      
        isOnline: signal(true),
      }; 

    await TestBed.configureTestingModule({

      providers: [
        { provide: AuthService, useValue: mockAuthService },
       
        { provide: Network, useValue: mockNetworkService },
        
        { provide: Router, useValue: mockRouter },
       
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
    mockNetworkService.isOnline.set(false);
    fixture.detectChanges(); // 変更をHTMLに反映

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.offline-badge');
       
    expect(badge).toBeTruthy(); 

    expect(badge?.textContent).toContain('オフラインモード');
  });

    it('実行時に logout() が呼ばれること', () => {
      component.logout();
     
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('ログアウト時に /login へ遷移すること', () => {
      const router = TestBed.inject(Router);

      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      component.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  //});
});
