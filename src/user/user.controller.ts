import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const existingUser: User = await this.userService.findOne<string>(
        'email',
        createUserDto.email,
      );

      if (existingUser) {
        return res
          .status(403)
          .json({ message: 'User account already exists!' });
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
        message: 'User added successfully!',
        access_token: accessToken,
      });
    } catch (err) {
      return res.json(err);
    }
  }

  @Post('/signin')
  async signin(@Body() loginUserDto: LoginUserDto, @Res() res) {
    try {
      const existingUser: User = await this.userService.findOne<string>(
        'email',
        loginUserDto.email,
      );

      if (!existingUser) {
        return res
          .status(403)
          .json({ message: 'User account does not exists!' });
      }

      const isPasswordComparable: boolean = AuthService.compareHashString(
        loginUserDto.password,
        existingUser.password,
      );

      if (!isPasswordComparable) {
        return res.status(403).json({ message: 'Invalid Password' });
      }

      const accessToken: string = AuthService.generateAccessToken<
        Partial<User>
      >({
        username: existingUser.username,
        email: existingUser.email,
      });

      return res.status(201).json({
        message: 'User logged in successfully!',
        access_token: accessToken,
      });
    } catch (err) {
      return res.json(err);
    }
  }
}
