import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  public create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = new User(createUserDto);
    return this.entityManager.save(newUser);
  }

  public findAll(
    page: number = 1,
    size: number = 20,
  ): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });
  }

  public findOne<T>(fieldname: string, fieldValue: T): Promise<User> {
    const filter = {};
    filter[fieldname] = fieldValue;
    return this.userRepository.findOne({ where: filter });
  }

  public findOneById(id: string): Promise<User> {
    return this.userRepository.findOne(id as any);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string): Promise<any> {
    return this.userRepository.delete(id as any);
  }
}
