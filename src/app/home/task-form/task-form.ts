import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { TaskStatus } from '../../models/board.model';

// フォームの型定義
export interface TaskForm {
  title: AbstractControl<string>;
  description: AbstractControl<string>;
  status: AbstractControl<TaskStatus>;
}

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  //changeDetection: ChangeDetectionStrategy.Eager
})
export class TaskForm {
  private fb = inject(FormBuilder);

  // 親コンポーネントへの通知用
  readonly submitTask = output<{
    title: string;
    description: string;
    status: TaskStatus;
  }>();
  readonly cancel = output<void>();

  // フォームの実体を作成
  myForm = new FormGroup<any>({
    // タイトル：初期値は空文字、必須入力(Validators.required)
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),

    // 説明：初期値は空文字
    description: new FormControl<string>('', { nonNullable: true }),

    // ステータス：初期値は 'TODO'
    status: new FormControl<TaskStatus>('todo', { nonNullable: true }),
  });

  // テンプレートで短く書くためのゲッター
  get titleControl() {
    return this.myForm.get('title');
    //return this.myForm.controls; //title
  }

  onSubmit() {
    if (this.myForm.valid) {
      // getRawValue() は disabled なコントロールの値も含めて取得できる
      this.submitTask.emit(this.myForm.getRawValue());
      this.myForm.reset();
    }
  }
}
