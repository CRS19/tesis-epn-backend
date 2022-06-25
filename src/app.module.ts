import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContactsModule } from './contacts/contacts.module';
import { ConfigModule } from '@nestjs/config';
import { MongodbConfigService } from './mongodb-config/mongodb-config.service';
import { JwtConfigService } from './jwt-config/jwt-config.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PossibleSickAlertGateway } from './websockets/possibleSickAlert/possibleSickAlert.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbConfigService,
    }),
    AuthModule,
    UsersModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MongodbConfigService,
    JwtConfigService,
    PossibleSickAlertGateway,
  ],
})
export class AppModule {}
