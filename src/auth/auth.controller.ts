import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('login')
  async login(@Body() login) {
    this.logger.debug(` | login -> ${JSON.stringify(login)}`);

    const { mail, password } = login;
    const valid = await this.authService.validateUser(mail, password);
    if (!valid) {
      throw new UnauthorizedException();
    }
    return await this.authService.generateAccessToken(mail);
  }
}
