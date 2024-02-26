import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      console.log(createUserDto);

      const existingUser: User = await this.userService.findOne<string>(
        'email',
        createUserDto.email,
      );

      if (existingUser) {
        return res
          .status(403)
          .json({ message: 'Student account already exists!' });
      }

      createUserDto.password = AuthService.hashString(createUserDto.password);

      const accessToken: string = AuthService.generateAccessToken<
        Partial<User>
      >({
        username: createUserDto.username,
        email: createUserDto.email,
      });

      await this.userService.create(createUserDto);

      return res.status(201).json({
        message: 'Student added successfully!',
        access_token: accessToken,
      });
    } catch (err) {
      console.log(err);
      return res.json(err);
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
