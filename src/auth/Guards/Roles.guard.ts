import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { rolesEnum } from '../Enums/RolesEnum';
import { JwtStrategy } from '../jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtStrategy: JwtStrategy,
  ) {}
  private readonly logger = new Logger(RolesGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log(` | canActivate attempt...`);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    if (roles.includes(request.user.rol)) {
      this.logger.log(` | canActivate OK`);
      return true;
    }

    this.logger.log(` | canActivate -> FAIL`);
    return false;
  }
}
