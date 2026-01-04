import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoListComponent } from './features/todo/components/todo-list/todo-list.component';
import { TodoFormComponent } from './features/todo/components/todo-form/todo-form.component';
import { TodoFilterComponent } from './features/todo/components/todo-filter/todo-filter.component';
import { StatsBarComponent } from './shared/components/stats-bar/stats-bar.component';
import { CollapsibleSectionComponent } from './shared/components/collapsible-section/collapsible-section.component';
import { StateDebuggerComponent } from './shared/components/state-debugger/state-debugger.component';
import { TodoService } from './core/services/todo.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TodoListComponent,
    TodoFormComponent,
    TodoFilterComponent,
    StatsBarComponent,
    CollapsibleSectionComponent,
    StateDebuggerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Smart To-Do List';
  canUndo$: Observable<boolean>;
  canRedo$: Observable<boolean>;

  constructor(private todoService: TodoService) {
    this.canUndo$ = this.todoService.canUndo$;
    this.canRedo$ = this.todoService.canRedo$;
  }

  onUndo(): void {
    this.todoService.undo();
  }

  onRedo(): void {
    this.todoService.redo();
  }
}
