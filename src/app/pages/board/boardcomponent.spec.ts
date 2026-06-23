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

  let paramMapSubject: BehaviorSubject<any>;

  const mockIBoards: Board[] = [{ id: 'board-123', title: 'SBoard 1', ownerId: 'My Board' }];

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: '', status: 'todo', assignee: 'Me' },
    { id: '2', title: 'Task 2', description: '', status: 'doing', assignee: 'Other' },
    { id: '3', title: 'Task 3', description: '', status: 'done', assignee: 'Me' },
  ];

  beforeEach(async () => {
   
    mockBoardService = {
      getUserBoards: vi.fn().mockName('BoardService.getUserBoards'),
      getTasks: vi.fn().mockName('BoardService.getTasks'),
    } as unknown as MockedObject<BoardService>;

    mockBoardService.getUserBoards.mockReturnValue(of(mockIBoards)); //[{id: 'board-123', name: 'My Board' }]
    mockBoardService.getTasks.mockReturnValue(of(mockTasks));

    paramMapSubject = new BehaviorSubject(convertToParamMap({})); // 初期状態はパラメータなし new Map()

    await TestBed.configureTestingModule({
      imports: [BoardComponent], 
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

  });

  it('1. コンポーネントが生成されること', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('2. データストリームと Computed Signal のテスト', () => {
    it('idがある場合、最初のボードIDを取得してタスクを読み込み、グループ化されること', () => {
  
      paramMapSubject.next(convertToParamMap({ id: 'board-123' }));

      fixture.detectChanges();

      expect(mockBoardService.getTasks).toHaveBeenCalledWith('board-123');

      const grouped = component.tasksGroupedByStatus();
      expect(grouped['todo'].length).toBe(1); // Task 1
      expect(grouped['doing'].length).toBe(1); // Task 2
      expect(grouped['done'].length).toBe(1); // Task 3

    });

    it('idがない場合、空配列となり新しいタスクは取得されないこと', () => {
  
      mockBoardService.getTasks.mockClear();

      fixture.detectChanges();

      expect(mockBoardService.getTasks).not.toHaveBeenCalled();

      expect(component.tasksSignal()).toEqual([]);

    });
  });

  describe('3. フィルタリング (onlyMyTasks) のテスト', () => {
    beforeEach(() => {

      paramMapSubject.next(convertToParamMap({ id: 'board-123' }));

      fixture.detectChanges(); 
    });

    it('toggleFilter() によって "onlyMyTasks" の状態が切り替わること', () => {
      const mockEvent = { target: { checked: true } } as unknown as Event;

      component.toggleFilter(mockEvent);

      expect(component.onlyMyTasks()).toBe(true);
    });

    it('"自分のみ表示" がONの場合、担当者が "Me" のタスクのみに絞り込まれること', () => {

      expect(component.filteredTasks().length).toBe(3);

      component.onlyMyTasks.set(true);

      expect(component.filteredTasks().length).toBe(2);

      const grouped = component.tasksGroupedByStatus();
      expect(grouped['todo'].length).toBe(1);
      expect(grouped['doing'].length).toBe(0); 
      expect(grouped['done'].length).toBe(1);
    });
  });
});
