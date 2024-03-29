import { PossibleSickAlertGateway } from './../websockets/possibleSickAlert/possibleSickAlert.gateway';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../Infrastructure/Schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'users',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersService, PossibleSickAlertGateway],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
