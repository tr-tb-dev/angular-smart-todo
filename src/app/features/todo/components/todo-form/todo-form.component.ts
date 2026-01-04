import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TodoService } from '../../../../core/services/todo.service';
import { TodoPriority } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFormComponent {
  todoForm: FormGroup;
  priorities = Object.values(TodoPriority);
  tags: string[] = [];
  tagInput = '';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [TodoPriority.MEDIUM, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const { title, description, priority } = this.todoForm.value;
      this.todoService.addTodo(title, description, priority, this.tags);
      this.resetForm();
    }
  }

  addTag(tag: string): void {
    const trimmedTag = tag.trim();
    if (trimmedTag && !this.tags.includes(trimmedTag)) {
      this.tags.push(trimmedTag);
      this.tagInput = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.tagInput.trim()) {
      event.preventDefault();
      this.addTag(this.tagInput);
    }
  }

  private resetForm(): void {
    this.todoForm.reset({
      priority: TodoPriority.MEDIUM
    });
    this.tags = [];
    this.tagInput = '';
  }
}
