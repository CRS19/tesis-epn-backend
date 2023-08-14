import { JWTPayload } from './interfaces/JWTPayload.interface';
import { UsersService } from './../users/users.service';
import * as bcrypt from 'bcrypt';
import { get, unset } from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);
  private readonly passwordPath = '_doc.password';

  async validateUser(userName: string, pass: string): Promise<boolean> {
    this.logger.log(` | validateUser ${userName}`);

    const user = await this.usersService.findUser(userName);

    return this.validatePassword(pass, get(user, 'password', ''));
  }

  async generateAccessToken(name: string) {
    const user = await this.usersService.findUser(name);
    unset(user, this.passwordPath);
    const payload: JWTPayload = {
      user,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    this.logger.log(` | validatePassword... `);
    return await bcrypt.compareSync(password, userPassword);
  }
}
