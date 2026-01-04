import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TodoService } from '../../../../core/services/todo.service';
import { Todo } from '../../../../core/models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoEditDialogComponent } from '../todo-edit-dialog/todo-edit-dialog.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  todos$: Observable<Todo[]> = this.todoService.filteredTodos$;
  loading$: Observable<boolean> = this.todoService.loading$;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog
  ) {}

  onToggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
  }

  onDeleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  onEditTodo(id: string): void {
    const todos = this.todoService.getStateSnapshot().todos;
    const todo = todos.find(t => t.id === id);

    if (todo) {
      const dialogRef = this.dialog.open(TodoEditDialogComponent, {
        width: '500px',
        data: todo
      });

      dialogRef.afterClosed().subscribe((result: Partial<Todo> | undefined) => {
        if (result) {
          this.todoService.updateTodo(id, result);
        }
      });
    }
  }

  trackByTodoId(index: number, todo: Todo): string {
    return todo.id;
  }
}
