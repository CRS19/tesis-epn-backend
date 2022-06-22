import { UsersService } from './../users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getTimestampNow } from '../utils/time-utils';
import { IContactRequest, IContactsDB } from './interfaces/contacts.interface';
import { set, isNil, last, get } from 'lodash';
import {
  IGraphData,
  ILayerListAndLinks,
  ILink,
  ILinkToGraph,
  IReducedListContact,
} from './interfaces/buildData.interfaces';
import {
  buildReducedListsAndLayerLinks,
  INITIAL_REDUCED_LIST_AND_LINKS,
} from './constants/buildData.constants';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('contacts')
    private readonly contactsModel: Model<IContactsDB>,
    private readonly userService: UsersService,
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

  async buildData(idDeviceRoot: string): Promise<IGraphData> {
    this.logger.log(' | buildData');

    const rootLayerOneList = await this.contactsModel
      .find({
        idDevice: idDeviceRoot,
      })
      .sort({ idContactDevice: 'asc' });

    const layerOne = rootLayerOneList.reduce(
      buildReducedListsAndLayerLinks,
      INITIAL_REDUCED_LIST_AND_LINKS,
    );

    const promises = layerOne.reducedLists.map(
      async (reducedList: IReducedListContact) => {
        // TODO: verify possible error smell
        return await this.contactsModel
          .find({
            idDevice: reducedList.idContactDevice,
          })
          .sort({ idContactDevice: 'asc' });
      },
    );

    const responses = await Promise.all(promises);

    const reduceFunction =
      (rootId: string) => (prevVal: IContactsDB[], currentVal: IContactsDB) => {
        if (currentVal.idContactDevice !== rootId) {
          prevVal.push(currentVal);

          return prevVal;
        }

        return prevVal;
      };

    const layerTwoRootFiltered = responses
      .flat()
      .reduce(reduceFunction(idDeviceRoot), []);

    const layerTwo = layerTwoRootFiltered.reduce(
      buildReducedListsAndLayerLinks,
      INITIAL_REDUCED_LIST_AND_LINKS,
    );

    const fullLayer: ILayerListAndLinks = {
      reducedLists: [...layerOne.reducedLists, ...layerTwo.reducedLists],
      links: [...layerOne.links, ...layerTwo.links],
    };

    const rootNode = await this.userService.getUsersAsNodes(idDeviceRoot);
    const nodesPromises = fullLayer.reducedLists.map(
      async (list: IReducedListContact) => {
        return await this.userService.getUsersAsNodes(list.idContactDevice);
      },
    );
    const pepe = await Promise.all(nodesPromises);

    const layerNodes = pepe.flat();

    const fullNodes = [rootNode, ...layerNodes];

    const nodesAndLinks = {
      nodes: fullNodes,
      links: fullLayer.links.map(
        (link): ILinkToGraph => ({
          value: link.value,
          source: link.idDevice,
          target: link.idContactDevice,
        }),
      ),
    };

    return nodesAndLinks;
  }

  private calculateDistance(rssi: number) {
    console.log('elpepe');
    return rssi * this.a;
  }
}
