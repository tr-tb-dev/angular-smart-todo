import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoStateService } from '../state/todo-state.service';
import { DatabaseService } from './db.service';
import { Todo, TodoPriority } from '../models/todo.model';
import { ActionType } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public todos$ = this.stateService.todos$;
  public filteredTodos$ = this.stateService.filteredTodos$;
  public loading$ = this.stateService.loading$;
  public canUndo$ = this.stateService.canUndo$;
  public canRedo$ = this.stateService.canRedo$;

  constructor(
    private stateService: TodoStateService,
    private db: DatabaseService
  ) {
    this.loadTodosFromDB();
  }

  private async loadTodosFromDB(): Promise<void> {
    try {
      const todos = await this.db.getAllTodos();
      this.stateService.dispatch({
        type: ActionType.SET_TODOS,
        payload: { todos }
      });
    } catch (error) {
      console.error('Error loading todos from database:', error);
    }
  }

  async addTodo(
    title: string,
    description?: string,
    priority: TodoPriority = TodoPriority.MEDIUM,
    tags: string[] = []
  ): Promise<void> {
    const todo: Todo = {
      id: this.generateId(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority,
      tags
    };

    await this.db.addTodo(todo);

    this.stateService.dispatch({
      type: ActionType.ADD_TODO,
      payload: { title, description, priority, tags }
    });
  }

  async updateTodo(id: string, changes: Partial<Todo>): Promise<void> {
    await this.db.updateTodo(id, changes);

    this.stateService.dispatch({
      type: ActionType.UPDATE_TODO,
      payload: { id, changes }
    });
  }

  async deleteTodo(id: string): Promise<void> {
    await this.db.deleteTodo(id);

    this.stateService.dispatch({
      type: ActionType.DELETE_TODO,
      payload: { id }
    });
  }

  async toggleTodo(id: string): Promise<void> {
    await this.db.toggleTodo(id);

    this.stateService.dispatch({
      type: ActionType.TOGGLE_TODO,
      payload: { id }
    });
  }

  undo(): void {
    this.stateService.dispatch({
      type: ActionType.UNDO
    });
    this.syncStateToDatabase();
  }

  redo(): void {
    this.stateService.dispatch({
      type: ActionType.REDO
    });
    this.syncStateToDatabase();
  }

  private async syncStateToDatabase(): Promise<void> {
    try {
      const currentState = this.stateService.getStateSnapshot();
      await this.db.clearAllTodos();
      for (const todo of currentState.todos) {
        await this.db.addTodo(todo);
      }
    } catch (error) {
      console.error('Error syncing state to database:', error);
    }
  }

  async getTodosByPriority(priority: string): Promise<Todo[]> {
    return await this.db.getTodosByPriority(priority);
  }

  async getTodosByTag(tag: string): Promise<Todo[]> {
    return await this.db.getTodosByTag(tag);
  }

  async searchTodos(searchTerm: string): Promise<Todo[]> {
    return await this.db.searchTodos(searchTerm);
  }

  getStateSnapshot() {
    return this.stateService.getStateSnapshot();
  }

  setFilter(filter: { showCompleted?: boolean; showActive?: boolean; priority?: string | null; tags?: string[] }): void {
    this.stateService.dispatch({
      type: ActionType.SET_FILTER,
      payload: filter
    });
  }

  setSearchTerm(searchTerm: string): void {
    this.stateService.dispatch({
      type: ActionType.SET_SEARCH,
      payload: { searchTerm }
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
