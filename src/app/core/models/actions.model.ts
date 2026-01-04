import { Todo, TodoPriority } from './todo.model';

export enum ActionType {
  ADD_TODO = 'ADD_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  DELETE_TODO = 'DELETE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  SET_TODOS = 'SET_TODOS',
  SET_FILTER = 'SET_FILTER',
  SET_SEARCH = 'SET_SEARCH',
  UNDO = 'UNDO',
  REDO = 'REDO'
}

export interface AddTodoAction {
  type: ActionType.ADD_TODO;
  payload: {
    title: string;
    description?: string;
    priority: TodoPriority;
    tags: string[];
  };
}

export interface UpdateTodoAction {
  type: ActionType.UPDATE_TODO;
  payload: {
    id: string;
    changes: Partial<Todo>;
  };
}

export interface DeleteTodoAction {
  type: ActionType.DELETE_TODO;
  payload: {
    id: string;
  };
}

export interface ToggleTodoAction {
  type: ActionType.TOGGLE_TODO;
  payload: {
    id: string;
  };
}

export interface SetTodosAction {
  type: ActionType.SET_TODOS;
  payload: {
    todos: Todo[];
  };
}

export interface UndoAction {
  type: ActionType.UNDO;
}

export interface RedoAction {
  type: ActionType.REDO;
}

export interface SetFilterAction {
  type: ActionType.SET_FILTER;
  payload: {
    showCompleted?: boolean;
    showActive?: boolean;
    priority?: string | null;
    tags?: string[];
  };
}

export interface SetSearchAction {
  type: ActionType.SET_SEARCH;
  payload: {
    searchTerm: string;
  };
}

export type TodoAction =
  | AddTodoAction
  | UpdateTodoAction
  | DeleteTodoAction
  | ToggleTodoAction
  | SetTodosAction
  | SetFilterAction
  | SetSearchAction
  | UndoAction
  | RedoAction;
