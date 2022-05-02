import { JWTPayload } from './interfaces/JWTPayload.interface';
import { UsersService } from './../users/users.service';
import * as bcrypt from 'bcrypt';
import { get } from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(userName: string, pass: string): Promise<boolean> {
    this.logger.debug(` | validateUser ${pass} y ${userName}`);

    const user = await this.usersService.findUser(userName);

    this.logger.debug(
      ` | validateUser usuario encontrado ${JSON.stringify(user)}`,
    );

    return this.validatePassword(pass, get(user, 'password', ''));
  }

  async generateAccessToken(name: string) {
    const user = await this.usersService.findUser(name);
    const payload: JWTPayload = { userMail: user.mail };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    this.logger.debug(
      ` | validatePassword comparar ${password} y ${userPassword}`,
    );
    return await bcrypt.compareSync(password, userPassword);
  }
}
