import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Todo, TodoPriority } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './todo-edit-dialog.component.html',
  styleUrls: ['./todo-edit-dialog.component.scss']
})
export class TodoEditDialogComponent implements OnInit {
  editForm: FormGroup;
  priorities = Object.values(TodoPriority);
  tags: string[] = [];
  tagInput = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public todo: Todo
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [TodoPriority.MEDIUM, Validators.required]
    });
  }

  ngOnInit(): void {
    this.editForm.patchValue({
      title: this.todo.title,
      description: this.todo.description || '',
      priority: this.todo.priority
    });
    this.tags = [...this.todo.tags];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      const { title, description, priority } = this.editForm.value;
      const updatedTodo: Partial<Todo> = {
        title,
        description,
        priority,
        tags: this.tags
      };
      this.dialogRef.close(updatedTodo);
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
}
