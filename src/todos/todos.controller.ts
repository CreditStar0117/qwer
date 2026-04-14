import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { Todo } from './todo.interface';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAll(): Todo[] {
    return this.todosService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Todo {
    const todo = this.todosService.findOne(id);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  @Post()
  create(@Body() payload: { title?: string }): Todo {
    if (!payload?.title || payload.title.trim().length === 0) {
      throw new BadRequestException('Title is required');
    }

    return this.todosService.create(payload.title.trim());
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: { title?: string; completed?: boolean },
  ): Todo {
    if (
      payload.title !== undefined &&
      (typeof payload.title !== 'string' || payload.title.trim().length === 0)
    ) {
      throw new BadRequestException('Title must be a non-empty string');
    }

    if (payload.completed !== undefined && typeof payload.completed !== 'boolean') {
      throw new BadRequestException('Completed must be a boolean');
    }

    const todo = this.todosService.update(id, {
      title: payload.title?.trim(),
      completed: payload.completed,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): { success: true } {
    const removed = this.todosService.remove(id);

    if (!removed) {
      throw new NotFoundException('Todo not found');
    }

    return { success: true };
  }
}
