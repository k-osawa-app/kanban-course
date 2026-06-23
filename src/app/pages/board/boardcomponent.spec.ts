import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './boardcomponent';
import { BoardService } from '../../services/boardservice';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { of, BehaviorSubject } from 'rxjs';
import { Task, Board } from '../../models/board.model';

describe('Board Component', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockBoardService: MockedObject<BoardService>;

  // URLパラメータをテストごとに切り替えられるように BehaviorSubject を使う
  let paramMapSubject: BehaviorSubject<any>;

  const mockIBoards: Board[] = [{ id: 'board-123', title: 'SBoard 1', ownerId: 'My Board' }];

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: '', status: 'todo', assignee: 'Me' },
    { id: '2', title: 'Task 2', description: '', status: 'doing', assignee: 'Other' },
    { id: '3', title: 'Task 3', description: '', status: 'done', assignee: 'Me' },
  ];

  beforeEach(async () => {
    // サービスのモック化
    mockBoardService = {
      getUserBoards: vi.fn().mockName('BoardService.getUserBoards'),
      getTasks: vi.fn().mockName('BoardService.getTasks'),
    } as unknown as MockedObject<BoardService>;

    // デフォルトのモック戻り値
    mockBoardService.getUserBoards.mockReturnValue(of(mockIBoards)); //[{id: 'board-123', name: 'My Board' }]
    mockBoardService.getTasks.mockReturnValue(of(mockTasks));

    // ルーティングパラメータのモック
    paramMapSubject = new BehaviorSubject(convertToParamMap({})); // 初期状態はパラメータなし new Map()

    await TestBed.configureTestingModule({
      imports: [BoardComponent], // Standaloneコンポーネントなのでimports,NoopAnimationsModule
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: Firestore, useValue: {} }, // 簡易的なモック
        {
          provide: ActivatedRoute,
          useValue: { paramMap: paramMapSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges() をここで呼ぶと、初期化ストリームが走ります
  });

  it('1. コンポーネントが生成されること', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('2. データストリームと Computed Signal のテスト', () => {
    it('idがある場合、最初のボードIDを取得してタスクを読み込み、グループ化されること', () => {
      // mockBoardService.getUserBoards.and.returnValue(of(mockIBoards));//[{id: 'board-123', name: 'My Board' }]
      // mockBoardService.getTasks.and.returnValue(of(mockTasks));

      //fixture.detectChanges(); // 初期化（ngOnInit相当の処理やSignalの初期評価）
      // 1. Setup: URLパラメータに 'id' をセットする
      paramMapSubject.next(convertToParamMap({ id: 'board-123' }));

      // 2. 初期化（ngOnInitが走り、パラメータのidを取得して getTasks が呼ばれるはず）
      fixture.detectChanges();

      // 3. BoardServiceの getTasks が正しいIDで呼ばれたか確認
      expect(mockBoardService.getTasks).toHaveBeenCalledWith('board-123');

      // (コンポーネントに currentBoardId というプロパティがあるならその確認)
      // expect(component.currentBoardId).toBe('board-123');

      // 4. Computed Signal (tasksGroupedByStatus) の評価が正しいか確認
      const grouped = component.tasksGroupedByStatus();
      expect(grouped['todo'].length).toBe(1); // Task 1
      expect(grouped['doing'].length).toBe(1); // Task 2
      expect(grouped['done'].length).toBe(1); // Task 3

      //expect(mockBoardService.getUserBoards).not.toHaveBeenCalled();
      // expect(mockBoardService.getTasks).toHaveBeenCalledWith('board-123');
      // expect(component.currentBoardId).toBe('board-123');

      // Computed Signal (tasksGroupedByStatus) の評価
      // const grouped = component.tasksGroupedByStatus();
      // expect(grouped['todo'].length).toBe(1);   // Task 1
      // expect(grouped['doing'].length).toBe(1);  // Task 2
      // expect(grouped['done'].length).toBe(1);   // Task 3
    });

    it('idがない場合、空配列となり新しいタスクは取得されないこと', () => {
      //mockBoardService.getUserBoards.calls.reset();

      // Setup: パラメータに 'id' をセットしてから初期化
      //paramMapSubject.next(new Map([['id', 'some-id']]));
      //paramMapSubject.next(convertToParamMap({id:'board-123' }));//id: 'some-id'

      // 念のため呼び出し履歴をクリア
      mockBoardService.getTasks.mockClear();

      // 1. Setup: パラメータは空のままにする（beforeEachの初期状態のまま）

      // 2. 初期化
      fixture.detectChanges();

      // 3. パラメータがないので getTasks は呼ばれないはず
      expect(mockBoardService.getTasks).not.toHaveBeenCalled();

      // 4. タスクのSignalは空配列であること
      expect(component.tasksSignal()).toEqual([]);

      // fixture = TestBed.createComponent(BoardComponent);
      // component = fixture.componentInstance;

      // // 3. 直前の beforeEach で生成された際の呼び出し履歴をクリアする
      // mockBoardService.getUserBoards.calls.reset();//reset();
      // mockBoardService.getTasks.calls.reset();//.reset();

      // fixture.detectChanges();

      // expect(mockBoardService.getUserBoards).not.toHaveBeenCalled();
      // expect(component.tasksSignal())
      // .toEqual(
      //   []
      //   // [{ id: '1', title: 'Task 1', description: '', status: 'todo', assignee: 'Me' },
      //   //  { id: '2', title: 'Task 2', description: '', status: 'doing', assignee: 'Other' },
      //   //  { id: '3', title: 'Task 3', description: '', status: 'done', assignee: 'Me' }
      //   // ]
      // ); // 空配列であること
    });
  });

  describe('3. フィルタリング (onlyMyTasks) のテスト', () => {
    beforeEach(() => {
      // 【追加】コンポーネントがタスクを取得できるように、URLパラメータを設定する
      // ※ 'id' や 'boardId' など、実際のコンポーネントの params.get(...) に合わせてキー名を変更してください。
      paramMapSubject.next(convertToParamMap({ id: 'board-123' }));

      fixture.detectChanges(); // まずタスクを読み込ませる
    });

    it('toggleFilter() によって "onlyMyTasks" の状態が切り替わること', () => {
      const mockEvent = { target: { checked: true } } as unknown as Event;

      component.toggleFilter(mockEvent);

      expect(component.onlyMyTasks()).toBe(true);
    });

    it('"自分のみ表示" がONの場合、担当者が "Me" のタスクのみに絞り込まれること', () => {
      // 初期状態の確認 (全3件)
      expect(component.filteredTasks().length).toBe(3);

      //Signalの値を直接変更
      component.onlyMyTasks.set(true);

      // 担当者が 'Me' の Task 1 (todo) と Task 3 (done) だけになる
      expect(component.filteredTasks().length).toBe(2);

      const grouped = component.tasksGroupedByStatus();
      expect(grouped['todo'].length).toBe(1);
      expect(grouped['doing'].length).toBe(0); // Other担当なので消える
      expect(grouped['done'].length).toBe(1);
    });
  });
});
