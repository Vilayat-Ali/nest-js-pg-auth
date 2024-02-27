import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  public static generateAccessToken<T extends Buffer | string | object>(
    claims: T,
  ): string {
    return sign(claims, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6d' });
  }

  public static hashString(password: string): string {
    return hashSync(password);
  }

  public static compareHashString(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
