import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo } from './schemas/todo.schema/todo.schema';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
  ) {}

  async create(data: Partial<Todo>, userId: Types.ObjectId): Promise<Todo> {
    return this.todoModel.create({ ...data, user: userId });
  }

  async findAll(userId: Types.ObjectId): Promise<Todo[]> {
    return this.todoModel.find({ user: userId });
  }

  async findOne(id: string, userId: Types.ObjectId): Promise<Todo> {
    const todo = await this.todoModel.findOne({ _id: id, user: userId });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, data: Partial<Todo>, userId: Types.ObjectId): Promise<Todo> {
    const todo = await this.todoModel.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      { new: true },
    );
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async remove(id: string, userId: Types.ObjectId): Promise<void> {
    const todo = await this.todoModel.findOneAndDelete({ _id: id, user: userId });
    if (!todo) throw new NotFoundException('Todo not found');
  }
}
