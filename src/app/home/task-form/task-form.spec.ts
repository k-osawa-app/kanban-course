import { ReactiveFormsModule } from '@angular/forms';
import { TaskForm } from './task-form'; 
import { TaskStatus } from '../../models/board.model'; 
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('TaskForm Component', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
      expect(component.myForm.valid).toBe(false);
    });

    it('各コントロールに正しい初期値が設定されていること', () => {
      const formValue = component.myForm.getRawValue();
      expect(formValue).toEqual({
        title: '',
        description: '',
        status: 'todo' as TaskStatus, 
      });
    });
  });

  describe('バリデーション (Validators)', () => {
    it('title が空の場合は必須エラー (required) になること', () => {
      const titleControl = component.titleControl;
      titleControl?.setValue('');
      expect(titleControl?.hasError('required')).toBe(true);
      expect(titleControl?.valid).toBe(false);
    });

    it('title が3文字未満の場合は minLength エラーになること', () => {
      const titleControl = component.titleControl;
      titleControl?.setValue('ab'); 
      expect(titleControl?.hasError('minlength')).toBe(true);
      expect(titleControl?.valid).toBe(false);
    });

    it('title が3文字以上の場合は有効 (valid) になること', () => {
      const titleControl = component.titleControl;
      titleControl?.setValue('abc'); 
      expect(titleControl?.valid).toBe(true);
    });
  });

  describe('onSubmit() メソッド', () => {
    it('フォームが無効 (invalid) の場合、submitTask は発行されないこと', () => {
   
      vi.spyOn(component.submitTask, 'emit').mockReturnValue(undefined);

      component.onSubmit();

      expect(component.submitTask.emit).not.toHaveBeenCalled();
    });

    it('フォームが有効 (valid) の場合、submitTask が発行され、フォームがリセットされること', () => {
      vi.spyOn(component.submitTask, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.myForm, 'reset'); // resetの呼び出しも確認する

      component.myForm.patchValue({
        title: 'テスト用のタスク',
        description: 'これはテストです',
        status: 'todo' as TaskStatus,
      });

      expect(component.myForm.valid).toBe(true);

      component.onSubmit();

      expect(component.submitTask.emit).toHaveBeenCalledWith({
        title: 'テスト用のタスク',
        description: 'これはテストです',
        status: 'todo' as TaskStatus,
      });

      expect(component.myForm.reset).toHaveBeenCalled();
    });
  });
});
