import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  public static generateAccessToken<T extends Buffer | string | object>(
    claims: T,
  ): string {
    return sign(claims, 'asd', { expiresIn: '6d ' });
  }

  public static hashString(password: string): string {
    return hashSync(password);
  }
}