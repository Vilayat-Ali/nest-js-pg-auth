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
  async findAll(@Req() req, @Res() res) {
    try {
      const userId = (await this.userService.findOne('email', req.user.email))
        .id;
      return this.todoService.findAll(userId);
    } catch (err: any) {
      return res.json(err);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
