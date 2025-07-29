import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { RequestWithUser } from '../common/interfaces/request.interface';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.todosService.create(createTodoDto, new Types.ObjectId(userId));
  }

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.todosService.findAll(new Types.ObjectId(userId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.todosService.findOne(id, new Types.ObjectId(userId));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.todosService.update(id, updateTodoDto, new Types.ObjectId(userId));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    await this.todosService.remove(id, new Types.ObjectId(userId));
  }
}
