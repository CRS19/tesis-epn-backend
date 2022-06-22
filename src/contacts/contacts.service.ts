import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getTimestampNow } from '../utils/time-utils';
import { IContactRequest, IContactsDB } from './interfaces/contacts.interface';
import { set, isNil } from 'lodash';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('contacts')
    private readonly contactsModel: Model<IContactsDB>,
  ) {}
  private readonly logger = new Logger(ContactsService.name);
  private readonly a = 4;

  async createContact({
    idDevice,
    idContactDevice,
    rssi,
    isInit,
  }: IContactRequest) {
    this.logger.log(` | createContact idDevice -> ${idDevice}`);

    if (isInit) {
      const hasAnotherInit = await this.contactsModel.findOne({
        idDevice,
        idContactDevice,
        timestampEnd: 0,
      });

      if (isNil(hasAnotherInit)) {
        const contact = new this.contactsModel({
          idDevice,
          idContactDevice,
          rssi,
          distance: this.calculateDistance(rssi),
          timestampInit: getTimestampNow(),
          timestampEnd: 0,
        });

        return await contact.save();
      }

      return;
    }

    const lastContactInit = await this.contactsModel.findOne({
      idDevice,
      idContactDevice,
      timestampEnd: 0,
    });

    if (!isNil(lastContactInit)) {
      set(lastContactInit, 'timestampEnd', getTimestampNow());

      return await lastContactInit.save();
    }

    return;
  }

  private calculateDistance(rssi: number) {
    console.log('elpepe');
    return rssi * this.a;
  }
}
