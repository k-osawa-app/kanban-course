import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

// テスト対象のコンポーネント
import { Dashboard } from './dashboard';
// モック化対象の実際のコンポーネント
import { Sidebar } from '../sidebar/sidebar';

// テスト用のダミーSidebarコンポーネントを作成
@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: '<div>Mock Sidebar</div>'
})
class MockSidebar {}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Standalone Componentなので declarations ではなく imports に指定
      imports: [Dashboard],
      providers: [
        // <router-outlet> のエラーを防ぐためのダミールーティングプロバイダ
        provideRouter([]) 
      ]
    })
    // 実際の Sidebar を MockSidebar に差し替える
    .overrideComponent(Dashboard, {
      remove: { imports: [Sidebar] },
      add: { imports: [MockSidebar] }
    })
    .compileComponents();

    // コンポーネントのインスタンス化
    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    // 初期データバインディングの実行（HTMLの描画）
    fixture.detectChanges();
  });

  it('コンポーネントが正常に作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('h2タグに「ダッシュボード(マイボード一覧）」と表示されていること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2Element = compiled.querySelector('h2');
    
    expect(h2Element).not.toBeNull();
    expect(h2Element?.textContent?.trim()).toBe('ダッシュボード（マイボード一覧）');
  });

  it('テンプレートに <app-sidebar> が存在すること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sidebarElement = compiled.querySelector('app-sidebar');
    
    expect(sidebarElement).not.toBeNull();
  });

  it('テンプレートに <router-outlet> が存在すること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutletElement = compiled.querySelector('router-outlet');
    
    expect(routerOutletElement).not.toBeNull();
  });
});
