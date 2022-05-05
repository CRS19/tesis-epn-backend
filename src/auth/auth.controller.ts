import { rolesEnum } from './Enums/RolesEnum';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Logger,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { hasRoles } from './Decorators/roles.decorator';
import { RolesGuard } from './Guards/Roles.guard';
import { ILogginRequest } from './interfaces/LogginRequest';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('login')
  async login(@Body() login: ILogginRequest) {
    this.logger.log(` | login `);

    const { mail, password } = login;
    const valid = await this.authService.validateUser(mail, password);
    if (!valid) {
      throw new UnauthorizedException();
    }
    return await this.authService.generateAccessToken(mail);
  }

  @Get('protected')
  @hasRoles(rolesEnum.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async protectedEnpoint() {
    this.logger.debug(' ITS ALIVEEE !');
  }
}
