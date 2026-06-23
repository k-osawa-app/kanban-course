import { Component, inject, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { TaskStatus } from '../../models/board.model';

export interface TaskForm {
  title: AbstractControl<string>;
  description: AbstractControl<string>;
  status: AbstractControl<TaskStatus>;
}

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  private fb = inject(FormBuilder);

  readonly submitTask = output<{
    title: string;
    description: string;
    status: TaskStatus;
  }>();
  readonly cancel = output<void>();

  myForm = new FormGroup<any>({

    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),

    description: new FormControl<string>('', { nonNullable: true }),

    status: new FormControl<TaskStatus>('todo', { nonNullable: true }),
  });

  get titleControl() {
    return this.myForm.get('title');
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.submitTask.emit(this.myForm.getRawValue());
      this.myForm.reset();
    }
  }
}
