import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { BoardDetail } from './board-detail';
import { BoardComponent } from '../board/boardcomponent';

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
      
      imports: [BoardDetail],
      providers: [       
        provideRouter([]),
      ],
    })
       .overrideComponent(BoardDetail, {
        remove: { imports: [BoardComponent] },
        add: { imports: [MockBoardComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BoardDetail);
    component = fixture.componentInstance;
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
