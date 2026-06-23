import type { MockedObject } from "vitest";
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BoardService } from './boardservice';
import { AuthService } from './authservice';
import { FirestoreWrapper } from './wrapper/firestore-wrapper';
import { Firestore } from '@angular/fire/firestore';
import { TaskStatus } from '../models/board.model';

describe('BoardService', () => {
    let service: BoardService;
    let authSpy: MockedObject<AuthService>;
    let firestoreWrapperSpy: MockedObject<FirestoreWrapper>;
    let firestoreSpy: MockedObject<Firestore>;

    beforeEach(() => {
        authSpy = {
            getCurrentUser: vi.fn().mockName("AuthService.getCurrentUser")
        } as unknown as MockedObject<AuthService>;

        firestoreWrapperSpy = {
            getCollectionData: vi.fn().mockName("FirestoreWrapper.getCollectionData"),
            getCollectionRef: vi.fn().mockName("FirestoreWrapper.getCollectionRef"),
            addDocument: vi.fn().mockName("FirestoreWrapper.addDocument"),
            getDocRef: vi.fn().mockName("FirestoreWrapper.getDocRef"),
            getUpdateDoc: vi.fn().mockName("FirestoreWrapper.getUpdateDoc")
        } as unknown as MockedObject<FirestoreWrapper>; 

        firestoreSpy = {} as unknown as MockedObject<Firestore>;
       
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
           
            authSpy.getCurrentUser.mockReturnValue(null);

            service.getUserBoards().subscribe(boards => {
                expect(boards).toEqual([]); 
                expect(firestoreWrapperSpy.getCollectionData).not.toHaveBeenCalled(); // データベース通信が呼ばれていないことを確認
                ;
            });
        });

        it('ユーザーがログイン済みの場合、FirestoreWrapper経由で取得したボード一覧が返されること', async () => {
            
            const mockUser = { uid: 'test-user-id' } as any; //as unknown as User; 
            const mockBoards = [
                { id: 'board1', title: 'テストボード', ownerId: 'test-user-id' } //as IBoard
            ] as any;
            
            authSpy.getCurrentUser.mockReturnValue(mockUser);
            
            firestoreWrapperSpy.getCollectionData.mockReturnValue(of(mockBoards)); 

            service.getUserBoards().subscribe(boards => {
                
                expect(boards).toEqual(mockBoards);
                
                expect(firestoreWrapperSpy.getCollectionData).toHaveBeenCalledTimes(1);
                
                const callArgs:any = vi.mocked(firestoreWrapperSpy.getCollectionData).mock.lastCall;
                expect(callArgs[0]).toBe('boards');

                ;
            });
        });

    });

    describe('getTaskData', () => {

        it('正しく getTaskData を呼び出すこと', async () => {
            const mockTasks = { id: '1', title: 'Task 1' } as any;
            
            firestoreWrapperSpy.getCollectionData.mockReturnValue(of(mockTasks)); 
            service.getTasks('board123').subscribe(tasks => {
                expect(tasks).toEqual(mockTasks);

                const args:any = vi.mocked(firestoreWrapperSpy.getCollectionData).mock.lastCall; 
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
            firestoreWrapperSpy.addDocument.mockResolvedValue(mockDocRef); 

            const result = await service.addTask(boardId, mockTask as any);

            expect(firestoreWrapperSpy.getCollectionRef).toHaveBeenCalledWith(`boards/${boardId}/tasks`);
            expect(firestoreWrapperSpy.addDocument).toHaveBeenCalledWith(mockRef as any, mockTask);
            expect(result).toEqual(mockDocRef);
        });
    });

    describe('createTask()テスト ', async () => {
        it('createTask should call wrapper methods with correct arguments', async () => {
            const boardId = 'board123' as any;
            const mockTask = { title: '新しいタスク', createdAt: Date.now() } as any;
            const mockRef = { id: 'dummy-ref' } as any;
            const mockDocRef = { id: 'success' } as any;
         
            const getCollectionRefSpy = vi.spyOn(firestoreWrapperSpy, 'getCollectionRef').mockReturnValue(mockRef);
            
            const addDocumentSpy = vi.spyOn(firestoreWrapperSpy, 'addDocument').mockResolvedValue(mockDocRef);

            const result = await service.createTask(boardId, mockTask as any);

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
         
            const mockBoardId = 'board123';
            const mockTaskId = 'task456';
            const mockNewStatus = 'DONE' as TaskStatus; 
            
            const mockDocRef = {} as any;

            firestoreWrapperSpy.getDocRef.mockReturnValue(mockDocRef);
            firestoreWrapperSpy.getUpdateDoc.mockResolvedValue(1);

            await service.updateTaskStatus(mockBoardId, mockTaskId, mockNewStatus);

            const expectedPath = `boards/${mockBoardId}/tasks/${mockTaskId}`;

            expect(firestoreWrapperSpy.getDocRef).toHaveBeenCalledTimes(1);

            expect(firestoreWrapperSpy.getDocRef).toHaveBeenCalledWith(expectedPath);

            expect(firestoreWrapperSpy.getUpdateDoc).toHaveBeenCalledTimes(1);

            expect(firestoreWrapperSpy.getUpdateDoc).toHaveBeenCalledWith(mockDocRef, { status: mockNewStatus });
        });
    });
});
