import { Injectable } from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { EntityManager, Repository, UpdateResult } from "typeorm";
import { Todo } from "./entities/todo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager
  ) {}

  public create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const newTodo: Todo = new Todo(createTodoDto);
    return this.entityManager.save(newTodo);
  }

  public findAll(
    userEmail: string,
    page: number = 1,
    size: number = 20
  ): Promise<[Todo[], number]> {
    const skip = (page - 1) * size;
    return this.todoRepository.findAndCount({
      where: {
        author: {
          email: userEmail,
        },
      },
      skip,
      take: skip,
    });
  }

  public findOne<T>(fieldname: string, fieldValue: T): Promise<Todo> {
    const filter = {};
    filter[fieldname] = fieldValue;
    return this.todoRepository.findOne({ where: filter });
  }

  public findOneById(id: string): Promise<Todo> {
    return this.todoRepository.findOne(id as any);
  }

  public update(
    id: string,
    userEmail: string,
    updateTodoDto: UpdateTodoDto
  ): Promise<UpdateResult> {
    return this.todoRepository.update(
      {
        author: {
          email: userEmail,
        },
        id: Number(id),
      },
      updateTodoDto
    );
  }

  remove(id: string, currrUserEmail: string): Promise<any> {
    return this.todoRepository.delete({
      author: {
        email: currrUserEmail,
      },
      id: Number(id),
    });
  }
}
