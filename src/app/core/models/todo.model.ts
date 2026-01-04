export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: TodoPriority;
  tags: string[];
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
  createdAt: Date;
  updatedAt: Date;
}
