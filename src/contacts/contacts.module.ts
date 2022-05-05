import { ConctactsSchema } from './../Infrastructure/Schemas/contacts.schema';
import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'contacts',
        schema: ConctactsSchema,
      },
    ]),
  ],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
