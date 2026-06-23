import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { Dashboard } from './dashboard';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: '<div>Mock Sidebar</div>',
})
class MockSidebar {}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
   
      imports: [Dashboard],
      providers: [
        provideRouter([]),
      ],
    })
      .overrideComponent(Dashboard, {
        remove: { imports: [Sidebar] },
        add: { imports: [MockSidebar] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
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
