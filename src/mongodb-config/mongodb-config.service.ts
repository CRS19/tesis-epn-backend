import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongodbConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const pass = decodeURIComponent(this.configService.get<string>('PASS_DB'));
    const user = this.configService.get<string>('USER_DB');
    const authSource = this.configService.get<string>('AUTH_DB_SOURCE');

    return await {
      uri: this.configService.get<string>('MONGODB_URL'),
      useNewUrlParser: true,
      authSource,
      user,
      pass,
    };
  }
}
