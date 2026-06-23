import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

// テスト対象のコンポーネントと依存するサービス
import { Sidebar } from './sidebar';
import { BoardService } from '../../services/boardservice';
//import { Board } from '../../models/board.model';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  // BoardServiceのモック（スパイ）を定義
  let mockBoardService: MockedObject<BoardService>;

  beforeEach(async () => {
    // 'getUserBoards' メソッドを持つ BoardService のモックを作成
    mockBoardService = {
      getUserBoards: vi.fn().mockName('BoardService.getUserBoards'),
    }  as unknown as MockedObject<BoardService>;

    await TestBed.configureTestingModule({
      // Standalone Componentなので imports に指定
      imports: [Sidebar],
      providers: [
        // RouterLink用（hrefを正しく生成・ルーティングエラー回避のため）
        provideRouter([]),
        // コンポーネント内の inject(BoardService) にモックを渡す
        { provide: BoardService, useValue: mockBoardService },
      ],
    }).compileComponents();
  });

  it('コンポーネントが正常に作成されること', () => {
    // 空のデータを返すように設定
    mockBoardService.getUserBoards.mockReturnValue(of([]));

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('ボードデータが存在する場合、リストとしてリンクが表示されること', () => {
    // モックデータの準備
    const mockBoards: any = [
      { id: '1', title: 'プロジェクトA' },
      { id: '2', title: 'プロジェクトB' },
    ];
    // コンポーネント生成前に、サービスがモックデータを返すように設定
    mockBoardService.getUserBoards.mockReturnValue(of(mockBoards));

    // コンポーネントを生成（ここで sidebar.ts 内の getUserBoards() が呼ばれる）
    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges(); // HTMLの描画（asyncパイプの解決）

    // HTMLから <li> 要素を取得
    const listItems = fixture.nativeElement.querySelectorAll('li');

    // 2件のボードが描画されているか
    expect(listItems.length).toBe(2);

    // 1件目のリンクの内容と routerLink のパスを検証
    const firstLink = listItems[0].querySelector('a');
    expect(firstLink.textContent.trim()).toBe('プロジェクトA');
    expect(firstLink.getAttribute('href')).toBe('/board/1');
  });

  it('ボードデータが空の場合、リスト項目(li)は表示されないこと', () => {
    // 空の配列を返すように設定
    mockBoardService.getUserBoards.mockReturnValue(of([]));

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('li');

    // データがないため <li> は1つも生成されないこと
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
