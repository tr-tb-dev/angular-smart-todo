import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { TodoService } from '../../../../core/services/todo.service';
import { TodoPriority } from '../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule
  ],
  templateUrl: './todo-filter.component.html',
  styleUrls: ['./todo-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFilterComponent {
  priorities = [
    { value: null, label: 'All Priorities' },
    { value: TodoPriority.LOW, label: 'Low' },
    { value: TodoPriority.MEDIUM, label: 'Medium' },
    { value: TodoPriority.HIGH, label: 'High' }
  ];

  searchTerm = '';
  showCompleted = true;
  showActive = true;
  selectedPriority: string | null = null;

  constructor(private todoService: TodoService) {
    const currentState = this.todoService.getStateSnapshot();
    this.showCompleted = currentState.filter.showCompleted;
    this.showActive = currentState.filter.showActive;
    this.selectedPriority = currentState.filter.priority;
    this.searchTerm = currentState.searchTerm;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.todoService.setSearchTerm(value);
  }

  onShowCompletedChange(checked: boolean): void {
    this.showCompleted = checked;
    this.todoService.setFilter({ showCompleted: checked });
  }

  onShowActiveChange(checked: boolean): void {
    this.showActive = checked;
    this.todoService.setFilter({ showActive: checked });
  }

  onPriorityChange(priority: string | null): void {
    this.selectedPriority = priority;
    this.todoService.setFilter({ priority });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.showCompleted = true;
    this.showActive = true;
    this.selectedPriority = null;

    this.todoService.setSearchTerm('');
    this.todoService.setFilter({
      showCompleted: true,
      showActive: true,
      priority: null,
      tags: []
    });
  }

  hasActiveFilters(): boolean {
    const hasSearch = this.searchTerm.length > 0;
    const hasPriority = this.selectedPriority !== null;
    const hasStatusFilter = !this.showActive || !this.showCompleted;

    return hasSearch || hasPriority || hasStatusFilter;
  }

  getPriorityIcon(priority: string | null): string {
    switch (priority) {
      case TodoPriority.HIGH:
        return 'keyboard_double_arrow_up';
      case TodoPriority.MEDIUM:
        return 'drag_handle';
      case TodoPriority.LOW:
        return 'keyboard_double_arrow_down';
      default:
        return 'priority_high';
    }
  }
}
