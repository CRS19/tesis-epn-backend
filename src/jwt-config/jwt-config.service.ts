import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public async createJwtOptions(): Promise<JwtModuleOptions> {
    const secret = this.configService.get('JWT_SECRET');

    return await {
      secret,
      signOptions: { expiresIn: '24h' },
    };
  }
}
