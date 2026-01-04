import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoService } from '../../../core/services/todo.service';
import { Todo } from '../../../core/models/todo.model';

interface Stats {
  total: number;
  active: number;
  completed: number;
  completionRate: number;
}

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stats-bar.component.html',
  styleUrls: ['./stats-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsBarComponent {
  stats$: Observable<Stats>;

  constructor(private todoService: TodoService) {
    this.stats$ = this.todoService.todos$.pipe(
      map((todos: Todo[]) => {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const active = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, active, completed, completionRate };
      })
    );
  }
}
