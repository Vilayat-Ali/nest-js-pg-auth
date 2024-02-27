import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/user';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UserService } from 'src/user/user.service';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() Req, @Res() res, @Body() createTodoDto: CreateTodoDto) {
    try {
      const author = await this.userService.findOne('email', Req.user.email);
      createTodoDto['author'] = author;
      await this.todoService.create(createTodoDto);
      return res.json({ message: 'Todo added successfully!' });
    } catch (err: any) {
      return res.json(err);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Req() req, @Res() res) {
    try {
      const todos = await this.todoService.findAll(req.user.email);
      return res.json({ message: 'Todos fetched successfully!', todos });
    } catch (err: any) {
      return res.json(err);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Req() req,
    @Res() res,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    try {
      await this.todoService.update(id, req.user.email, updateTodoDto);
      return res.json({ message: 'Todo updated successfully!' });
    } catch (err: any) {
      return res.json(err);
    }
  }

  @Delete(':id')
  async remove(@Req() req, @Res() res, @Param('id') id: string) {
    try {
      await this.todoService.remove(id, req.user.email);
      return res.json({ message: 'Todo deleted successfully!' });
    } catch (err: any) {
      return res.json(err);
    }
  }
}
