import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Sidebar } from './sidebar';
import { BoardService } from '../../services/boardservice';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>; 
  let mockBoardService: MockedObject<BoardService>;

  beforeEach(async () => {

    mockBoardService = {
      getUserBoards: vi.fn().mockName('BoardService.getUserBoards'),
    }  as unknown as MockedObject<BoardService>;

    await TestBed.configureTestingModule({
 
      imports: [Sidebar],
      providers: [  
        provideRouter([]),      
        { provide: BoardService, useValue: mockBoardService },
      ],
    }).compileComponents();
  });

  it('コンポーネントが正常に作成されること', () => {
  
    mockBoardService.getUserBoards.mockReturnValue(of([]));

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('ボードデータが存在する場合、リストとしてリンクが表示されること', () => {
    
    const mockBoards: any = [
      { id: '1', title: 'プロジェクトA' },
      { id: '2', title: 'プロジェクトB' },
    ];
   
    mockBoardService.getUserBoards.mockReturnValue(of(mockBoards));

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges(); 

    const listItems = fixture.nativeElement.querySelectorAll('li');

    expect(listItems.length).toBe(2);

    const firstLink = listItems[0].querySelector('a');
    expect(firstLink.textContent.trim()).toBe('プロジェクトA');
    expect(firstLink.getAttribute('href')).toBe('/board/1');
  });

  it('ボードデータが空の場合、リスト項目(li)は表示されないこと', () => {
  
    mockBoardService.getUserBoards.mockReturnValue(of([]));

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('li');

    expect(listItems.length).toBe(0);
  });

  it('固定の案内テキストが正しく表示されていること', () => {
    mockBoardService.getUserBoards.mockReturnValue(of([]));
    fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const h4 = compiled.querySelector('h4');
    const h5 = compiled.querySelector('h5');

    expect(h4?.textContent).toContain('タスクを表示するには下のボードをクリックします');
    expect(h5?.textContent).toContain('何もないときは表示はありません');
  });
});
