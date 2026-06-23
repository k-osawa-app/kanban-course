import type { MockedObject } from "vitest";
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { BoardService } from './boardservice';
import { AuthService } from './authservice';
import { FirestoreWrapper } from './wrapper/firestore-wrapper';
import { Firestore } from '@angular/fire/firestore';
import { Board, TaskStatus } from '../models/board.model';

describe('BoardService', () => {
    let service: BoardService;
    // 各サービスのモック（Spy）の型定義
    let authSpy: MockedObject<AuthService>;
    let firestoreWrapperSpy: MockedObject<FirestoreWrapper>;
    let firestoreSpy: MockedObject<Firestore>;

    beforeEach(() => {
        // 依存するサービスのモックを作成
        authSpy = {
            getCurrentUser: vi.fn().mockName("AuthService.getCurrentUser")
        } as unknown as MockedObject<AuthService>;

        //add 'getTaskData'
        firestoreWrapperSpy = {
            getCollectionData: vi.fn().mockName("FirestoreWrapper.getCollectionData"),
            getCollectionRef: vi.fn().mockName("FirestoreWrapper.getCollectionRef"),
            addDocument: vi.fn().mockName("FirestoreWrapper.addDocument"),
            getDocRef: vi.fn().mockName("FirestoreWrapper.getDocRef"),
            getUpdateDoc: vi.fn().mockName("FirestoreWrapper.getUpdateDoc")
        } as unknown as MockedObject<FirestoreWrapper>; 

        firestoreSpy = {} as unknown as MockedObject<Firestore>;
        // BoardService内では直接メソッドが呼ばれないので空でOK

        TestBed.configureTestingModule({
            providers: [
                BoardService,
                { provide: AuthService, useValue: authSpy },
                { provide: FirestoreWrapper, useValue: firestoreWrapperSpy },
                { provide: Firestore, useValue: firestoreSpy }
            ]
        });

        service = TestBed.inject(BoardService);

        firestoreWrapperSpy = TestBed.inject(FirestoreWrapper) as MockedObject<FirestoreWrapper>;

    });
    it('サービスが正しく生成されること', () => {
        expect(service).toBeTruthy();

    });

    describe('getUserBoards()', () => {

        it('ユーザーが未ログイン（null）の場合、空の配列が返されること', async () => {
            // 1. CAuthモックの戻り値を null に設定
            authSpy.getCurrentUser.mockReturnValue(null);

            // 2. メソッドを実行して結果を検証
            service.getUserBoards().subscribe(boards => {
                expect(boards).toEqual([]); // 空配列であることを確認
                expect(firestoreWrapperSpy.getCollectionData).not.toHaveBeenCalled(); // データベース通信が呼ばれていないことを確認
                ;
            });
        });

        it('ユーザーがログイン済みの場合、FirestoreWrapper経由で取得したボード一覧が返されること', async () => {
            // 1. テスト用のダミーデータを用意
            const mockUser = { uid: 'test-user-id' } as any; //as unknown as User; 
            const mockBoards = [
                { id: 'board1', title: 'テストボード', ownerId: 'test-user-id' } //as IBoard
            ] as any;
            // 2. モックの戻り値を設定
            authSpy.getCurrentUser.mockReturnValue(mockUser);
            // getCollectionDataが呼ばれたら、ObservableでラップしたmockBoardsを返す
            firestoreWrapperSpy.getCollectionData.mockReturnValue(of(mockBoards)); //of

            // 3. メソッドを実行して結果を検証
            service.getUserBoards().subscribe(boards => {
                // ダミーデータがそのまま返ってくることを確認
                expect(boards).toEqual(mockBoards);
                // FirestoreWrapperのメソッドが1回呼ばれたことを確認
                expect(firestoreWrapperSpy.getCollectionData).toHaveBeenCalledTimes(1);
                // 呼び出し時の第1引数がコレクション名の 'boards' であることを確認
                const callArgs:any = vi.mocked(firestoreWrapperSpy.getCollectionData).mock.lastCall;
                expect(callArgs[0]).toBe('boards');

                ;
            });
        });

    });

    describe('getTaskData', () => {

        it('正しく getTaskData を呼び出すこと', async () => {
            const mockTasks = { id: '1', title: 'Task 1' } as any;
            // モックデータを返すように設定
            firestoreWrapperSpy.getCollectionData.mockReturnValue(of(mockTasks)); //getTaskData
            service.getTasks('board123').subscribe(tasks => {
                expect(tasks).toEqual(mockTasks);

                // 第1引数に正しいパスが渡されたかだけ検証すればOK
                const args:any = vi.mocked(firestoreWrapperSpy.getCollectionData).mock.lastCall; //getTaskData
                expect(args[0]).toBe('boards/board123/tasks');

                ;
            });
        });
    });

    describe('AddTask()テスト', () => {
        it('addTask should call wrapper methods with correct arguments', async () => {
            const boardId = 'board123' as any;
            const mockTask = { title: '新しいタスク' } as any;
            const mockRef = { id: 'dummy-ref' } as any;
            const mockDocRef = { id: 'success' } as any;
            //wrapperSpy
            firestoreWrapperSpy.getCollectionRef.mockReturnValue(mockRef);
            firestoreWrapperSpy.addDocument.mockResolvedValue(mockDocRef); //Promise.resolve('success')

            const result = await service.addTask(boardId, mockTask as any);

            expect(firestoreWrapperSpy.getCollectionRef).toHaveBeenCalledWith(`boards/${boardId}/tasks`);
            expect(firestoreWrapperSpy.addDocument).toHaveBeenCalledWith(mockRef as any, mockTask);
            expect(result).toEqual(mockDocRef); //toBe
        });
    });

    describe('createTask()テスト ', async () => {
        it('createTask should call wrapper methods with correct arguments', async () => {
            const boardId = 'board123' as any;
            const mockTask = { title: '新しいタスク', createdAt: Date.now() } as any;
            const mockRef = { id: 'dummy-ref' } as any;
            const mockDocRef = { id: 'success' } as any;
            //wrapperSpy
            //firestoreWrapperSpy.getCollectionRef.mockReturnValue(mockRef);
            //firestoreWrapperSpy.addDocument.mockResolvedValue(mockDocRef);
            const getCollectionRefSpy = vi.spyOn(firestoreWrapperSpy, 'getCollectionRef').mockReturnValue(mockRef);
            
            const addDocumentSpy = vi.spyOn(firestoreWrapperSpy, 'addDocument').mockResolvedValue(mockDocRef);

            const result = await service.createTask(boardId, mockTask as any);

            //expect(firestoreWrapperSpy.getCollectionRef).toHaveBeenCalledWith(`boards/${boardId}/tasks`);
            //expect(firestoreWrapperSpy.addDocument).toHaveBeenCalledWith(mockRef as any, mockTask);
            expect(getCollectionRefSpy).toHaveBeenCalledWith(`boards/${boardId}/tasks`);
            expect(addDocumentSpy).toHaveBeenCalledWith(
            mockRef,
            expect.objectContaining({
                title: '新しいタスク',
                
                createdAt: expect.any(Number)
             })
            );
           expect(result).toBeUndefined();
        });
    });

    describe('updateTaskStatus()テスト ', async () => {
        it('should update task status correctly', async () => {
            // Arrange (準備)
            const mockBoardId = 'board123';
            const mockTaskId = 'task456';
            const mockNewStatus = 'DONE' as TaskStatus; // ※TaskStatusに合わせて変更してください

            // getDocRefが返すダミーのリファレンスを作成
            const mockDocRef = {} as any;

            // スパイの戻り値を設定
            firestoreWrapperSpy.getDocRef.mockReturnValue(mockDocRef);
            firestoreWrapperSpy.getUpdateDoc.mockResolvedValue(1); // 成功するPromiseを返す

            // Act (実行)
            await service.updateTaskStatus(mockBoardId, mockTaskId, mockNewStatus);

            // Assert (検証)
            const expectedPath = `boards/${mockBoardId}/tasks/${mockTaskId}`;

            // ① getDocRef が正しいパス文字列で呼び出されたか検証
            expect(firestoreWrapperSpy.getDocRef).toHaveBeenCalledTimes(1);

            // ① getDocRef が正しいパス文字列で呼び出されたか検証
            expect(firestoreWrapperSpy.getDocRef).toHaveBeenCalledWith(expectedPath);

            // ② getUpdateDoc が、①で取得したリファレンスと正しい更新データで呼び出されたか検証
            expect(firestoreWrapperSpy.getUpdateDoc).toHaveBeenCalledTimes(1);

            // ② getUpdateDoc が、①で取得したリファレンスと正しい更新データで呼び出されたか検証
            expect(firestoreWrapperSpy.getUpdateDoc).toHaveBeenCalledWith(mockDocRef, { status: mockNewStatus });
        });

    });

});
