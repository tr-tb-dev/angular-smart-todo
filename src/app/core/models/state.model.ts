import { Todo } from './todo.model';

export interface AppState {
  todos: Todo[];
  filter: TodoFilter;
  searchTerm: string;
  selectedTodoId: string | null;
  loading: boolean;
}

export interface TodoFilter {
  showCompleted: boolean;
  showActive: boolean;
  priority: string | null;
  tags: string[];
}

export interface StateHistory {
  past: AppState[];
  present: AppState;
  future: AppState[];
}

export const initialState: AppState = {
  todos: [],
  filter: {
    showCompleted: true,
    showActive: true,
    priority: null,
    tags: []
  },
  searchTerm: '',
  selectedTodoId: null,
  loading: false
};
