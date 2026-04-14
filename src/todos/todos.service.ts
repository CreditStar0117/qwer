import { Injectable } from '@nestjs/common';
import { Todo } from './todo.interface';

@Injectable()
export class TodosService {
  private readonly todos: Todo[] = [];
  private nextId = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  create(title: string): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: number, payload: { title?: string; completed?: boolean }): Todo | undefined {
    const todo = this.findOne(id);

    if (!todo) {
      return undefined;
    }

    if (typeof payload.title === 'string') {
      todo.title = payload.title;
    }

    if (typeof payload.completed === 'boolean') {
      todo.completed = payload.completed;
    }

    return todo;
  }

  remove(id: number): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      return false;
    }

    this.todos.splice(index, 1);
    return true;
  }
}
