import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

// テスト対象のコンポーネント
import { BoardDetail } from './board-detail';
// モック化対象の実際のコンポーネント
import { BoardComponent } from '../board/boardcomponent';

// テスト用のダミーSidebarコンポーネントを作成
@Component({
  selector: 'app-board',
  standalone: true,
  template: '<div>Mock BoardComponent</div>',
})
class MockBoardComponent {}

describe('BoardDetail', () => {
  let component: BoardDetail;
  let fixture: ComponentFixture<BoardDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Standalone Componentなので declarations ではなく imports に指定
      imports: [BoardDetail],
      providers: [
        // <router-outlet> のエラーを防ぐためのダミールーティングプロバイダ
        provideRouter([]),
      ],
    })
      // 実際の Sidebar を MockSidebar に差し替える
      .overrideComponent(BoardDetail, {
        remove: { imports: [BoardComponent] },
        add: { imports: [MockBoardComponent] },
      })
      .compileComponents();

    // コンポーネントのインスタンス化
    fixture = TestBed.createComponent(BoardDetail);
    component = fixture.componentInstance;
    // 初期データバインディングの実行（HTMLの描画）
    fixture.detectChanges();
  });

  it('コンポーネントが正常に作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('h3タグに「プロジェクト(詳細画面)」と表示されていること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2Element = compiled.querySelector('h3');

    expect(h2Element).not.toBeNull();
    expect(h2Element?.textContent?.trim()).toBe('プロジェクト(詳細画面)');
  });

  it('テンプレートに <app-board> が存在すること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sidebarElement = compiled.querySelector('app-board');

    expect(sidebarElement).not.toBeNull();
  });

  it('テンプレートに <router-outlet> が存在すること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutletElement = compiled.querySelector('router-outlet');

    expect(routerOutletElement).not.toBeNull();
  });
});
