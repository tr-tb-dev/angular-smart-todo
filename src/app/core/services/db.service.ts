import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  todos!: Table<Todo, string>;

  constructor() {
    super('SmartTodoDatabase');

    this.version(1).stores({
      todos: 'id, title, completed, createdAt, priority, *tags'
    });
  }

  async getAllTodos(): Promise<Todo[]> {
    return await this.todos.toArray();
  }

  async getTodoById(id: string): Promise<Todo | undefined> {
    return await this.todos.get(id);
  }

  async addTodo(todo: Todo): Promise<string> {
    return await this.todos.add(todo);
  }

  async updateTodo(id: string, changes: Partial<Todo>): Promise<number> {
    return await this.todos.update(id, changes);
  }

  async deleteTodo(id: string): Promise<void> {
    await this.todos.delete(id);
  }

  async toggleTodo(id: string): Promise<void> {
    const todo = await this.getTodoById(id);
    if (todo) {
      await this.updateTodo(id, {
        completed: !todo.completed,
        updatedAt: new Date()
      });
    }
  }

  async clearAllTodos(): Promise<void> {
    await this.todos.clear();
  }

  async getCompletedTodos(): Promise<Todo[]> {
    return await this.todos.where('completed').equals(1).toArray();
  }

  async getActiveTodos(): Promise<Todo[]> {
    return await this.todos.where('completed').equals(0).toArray();
  }

  async getTodosByPriority(priority: string): Promise<Todo[]> {
    return await this.todos.where('priority').equals(priority).toArray();
  }

  async getTodosByTag(tag: string): Promise<Todo[]> {
    return await this.todos.where('tags').equals(tag).toArray();
  }

  async searchTodos(searchTerm: string): Promise<Todo[]> {
    const term = searchTerm.toLowerCase();
    return await this.todos
      .filter(todo => {
        const titleMatch = todo.title.toLowerCase().includes(term);
        const descMatch = todo.description?.toLowerCase().includes(term) || false;
        return titleMatch || descMatch;
      })
      .toArray();
  }
}
