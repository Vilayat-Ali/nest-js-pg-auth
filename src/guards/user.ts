import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    // Bearer <TOKEN>
    const authToken = authHeader.split(' ')[1].trim();

    jwt.verify(
      authToken,
      process.env.ACCESS_TOKEN_SECRET,
      function (err: any, decode: User) {
        if (err) {
          return false;
        }

        request['user'] = decode;
      },
    );

    return true;
  }
}
