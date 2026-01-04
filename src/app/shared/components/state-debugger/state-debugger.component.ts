import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable } from 'rxjs';
import { TodoStateService } from '../../../core/state/todo-state.service';
import { AppState } from '../../../core/models/state.model';

@Component({
  selector: 'app-state-debugger',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './state-debugger.component.html',
  styleUrls: ['./state-debugger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateDebuggerComponent {
  state$: Observable<AppState>;
  canUndo$: Observable<boolean>;
  canRedo$: Observable<boolean>;
  isOpen = false;

  constructor(private stateService: TodoStateService) {
    this.state$ = this.stateService.state$;
    this.canUndo$ = this.stateService.canUndo$;
    this.canRedo$ = this.stateService.canRedo$;
  }

  toggleDebugger(): void {
    this.isOpen = !this.isOpen;
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  getStateSnapshot(): AppState {
    return this.stateService.getStateSnapshot();
  }

  copyToClipboard(): void {
    const state = this.getStateSnapshot();
    navigator.clipboard.writeText(this.formatJson(state));
  }

  getCompletedCount(todos: any[]): number {
    return todos.filter(t => t.completed).length;
  }

  getActiveCount(todos: any[]): number {
    return todos.filter(t => !t.completed).length;
  }
}
