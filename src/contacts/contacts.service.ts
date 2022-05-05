import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getTimestampNow } from '../utils/time-utils';
import { IContactsDB } from './interfaces/contacts.interface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('contacts')
    private readonly contactsModel: Model<IContactsDB>,
  ) {}
  private readonly logger = new Logger(ContactsService.name);

  async createContact(idDevice: string) {
    this.logger.log(` | createContact idDevice -> ${idDevice}`);

    const contact = new this.contactsModel({
      idDevice,
      timestampInit: getTimestampNow(),
      timestampEnd: 0,
    });

    return await contact.save();
  }
}
