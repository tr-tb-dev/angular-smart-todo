import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { scan, shareReplay, map } from 'rxjs/operators';
import { TodoAction, ActionType } from '../models/actions.model';
import { AppState, StateHistory, initialState } from '../models/state.model';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoStateService {
  private actions$ = new Subject<TodoAction>();

  private stateHistory$ = new BehaviorSubject<StateHistory>({
    past: [],
    present: initialState,
    future: []
  });

  public state$: Observable<AppState> = this.stateHistory$.pipe(
    map(history => history.present),
    shareReplay(1)
  );

  public todos$: Observable<Todo[]> = this.state$.pipe(
    map(state => state.todos)
  );

  public filteredTodos$: Observable<Todo[]> = this.state$.pipe(
    map(state => this.applyFilters(state.todos, state.filter, state.searchTerm))
  );

  public loading$: Observable<boolean> = this.state$.pipe(
    map(state => state.loading)
  );

  public canUndo$: Observable<boolean> = this.stateHistory$.pipe(
    map(history => history.past.length > 0)
  );

  public canRedo$: Observable<boolean> = this.stateHistory$.pipe(
    map(history => history.future.length > 0)
  );

  constructor() {
    this.actions$.pipe(
      scan((history: StateHistory, action: TodoAction) => {
        return this.reducer(history, action);
      }, this.stateHistory$.value)
    ).subscribe(this.stateHistory$);
  }

  public dispatch(action: TodoAction): void {
    this.actions$.next(action);
  }

  private reducer(history: StateHistory, action: TodoAction): StateHistory {
    const { past, present, future } = history;

    switch (action.type) {
      case ActionType.UNDO:
        if (past.length === 0) return history;
        return {
          past: past.slice(0, -1),
          present: past[past.length - 1],
          future: [present, ...future]
        };

      case ActionType.REDO:
        if (future.length === 0) return history;
        return {
          past: [...past, present],
          present: future[0],
          future: future.slice(1)
        };

      default:
        const newPresent = this.stateReducer(present, action);
        if (newPresent === present) return history;
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        };
    }
  }

  private stateReducer(state: AppState, action: TodoAction): AppState {
    switch (action.type) {
      case ActionType.ADD_TODO:
        const newTodo: Todo = {
          id: this.generateId(),
          title: action.payload.title,
          description: action.payload.description,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          priority: action.payload.priority,
          tags: action.payload.tags
        };
        return {
          ...state,
          todos: [...state.todos, newTodo]
        };

      case ActionType.UPDATE_TODO:
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, ...action.payload.changes, updatedAt: new Date() }
              : todo
          )
        };

      case ActionType.DELETE_TODO:
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload.id)
        };

      case ActionType.TOGGLE_TODO:
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
              : todo
          )
        };

      case ActionType.SET_TODOS:
        return {
          ...state,
          todos: action.payload.todos
        };

      case ActionType.SET_FILTER:
        return {
          ...state,
          filter: {
            ...state.filter,
            ...action.payload
          }
        };

      case ActionType.SET_SEARCH:
        return {
          ...state,
          searchTerm: action.payload.searchTerm
        };

      default:
        return state;
    }
  }

  private applyFilters(todos: Todo[], filter: any, searchTerm: string): Todo[] {
    return todos.filter(todo => {
      if (!filter.showCompleted && todo.completed) return false;
      if (!filter.showActive && !todo.completed) return false;

      if (filter.priority && todo.priority !== filter.priority) return false;

      if (filter.tags.length > 0) {
        const hasTag = filter.tags.some((tag: string) => todo.tags.includes(tag));
        if (!hasTag) return false;
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(term);
        const matchesDescription = todo.description?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDescription) return false;
      }

      return true;
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public getStateSnapshot(): AppState {
    return this.stateHistory$.value.present;
  }
}
