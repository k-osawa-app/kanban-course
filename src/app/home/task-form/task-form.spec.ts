import { ReactiveFormsModule } from '@angular/forms';
import { TaskForm } from './task-form'; // 実際のファイルパスに合わせてください
import { TaskStatus } from '../../models/board.model'; // 実際のファイルパスに合わせてください
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('TaskForm Component', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Standalone コンポーネントおよび ReactiveFormsModule をインポート
      imports: [TaskForm, ReactiveFormsModule], 
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが正常に生成されること (should create)', () => {
    expect(component).toBeTruthy();
  });

  describe('フォームの初期状態', () => {
    it('初期状態では title が未入力のためフォームは無効 (invalid) であること', () => {
      expect(component.myForm.valid).toBeFalse();
    });

    it('各コントロールに正しい初期値が設定されていること', () => {
      const formValue = component.myForm.getRawValue();
      expect(formValue).toEqual({
        title: '',
        description: '',
        status: 'todo' as TaskStatus // TaskStatus の型定義に合わせてアサーション
      });
    });
  });

  describe('バリデーション (Validators)', () => {
    it('title が空の場合は必須エラー (required) になること', () => {
      const titleControl = component.titleControl;
      titleControl?.setValue('');
      expect(titleControl?.hasError('required')).toBeTrue();
      expect(titleControl?.valid).toBeFalse();
    });

    it('title が3文字未満の場合は minLength エラーになること', () => {
      const titleControl = component.titleControl;
      titleControl?.setValue('ab'); // 2文字
      expect(titleControl?.hasError('minlength')).toBeTrue();
      expect(titleControl?.valid).toBeFalse();
    });

    it('title が3文字以上の場合は有効 (valid) になること', () => {
      const titleControl = component.titleControl;
      titleControl?.setValue('abc'); // 3文字
      expect(titleControl?.valid).toBeTrue();
    });
  });

  describe('onSubmit() メソッド', () => {
    it('フォームが無効 (invalid) の場合、submitTask は発行されないこと', () => {
      // EventEmitter の emit を監視（スパイ）
      spyOn(component.submitTask, 'emit');
      
      // title が空(invalid)のまま送信
      component.onSubmit();
      
      expect(component.submitTask.emit).not.toHaveBeenCalled();
    });

    it('フォームが有効 (valid) の場合、submitTask が発行され、フォームがリセットされること', () => {
      spyOn(component.submitTask, 'emit');
      spyOn(component.myForm, 'reset').and.callThrough(); // resetの呼び出しも確認する

      // フォームを有効な状態にする
      component.myForm.patchValue({
        title: 'テスト用のタスク',
        description: 'これはテストです',
        status: 'todo' as TaskStatus
      });

      // フォームが有効になっているか念の為確認
      expect(component.myForm.valid).toBeTrue();

      component.onSubmit();

      // submitTask.emit がフォームの値とともに呼ばれたか
      expect(component.submitTask.emit).toHaveBeenCalledWith({
        title: 'テスト用のタスク',
        description: 'これはテストです',
        status: 'todo' as TaskStatus
      });

      // フォームがリセットされたか
      expect(component.myForm.reset).toHaveBeenCalled();
    });
  });
});




// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { TaskForm } from './task-form';

// describe('TaskForm', () => {
//   let component: TaskForm;
//   let fixture: ComponentFixture<TaskForm>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [TaskForm]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(TaskForm);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
