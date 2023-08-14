import { UsersService } from './../users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  getDateFromTimestamp,
  getTimeDifference,
  getTimestampNow,
  getTimestampOfTwoWeeksAgo,
} from '../utils/time-utils';
import {
  IContactRequest,
  IContactsDB,
  IContactsTableInfo,
} from './interfaces/contacts.interface';
import { set, isNil, uniqWith, isEqual, tail } from 'lodash';
import {
  IGraphData,
  ILayerListAndLinks,
  ILink,
  ILinkToGraph,
  INode,
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
  private readonly A: number = -66.5;
  private readonly N: number = 2.6;

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
        timestampInit: {
          $gt: getTimestampOfTwoWeeksAgo(),
          $lt: getTimestampNow(),
        },
      })
      .sort({ idContactDevice: 'asc' });

    const layerOne = rootLayerOneList.reduce(
      buildReducedListsAndLayerLinks,
      INITIAL_REDUCED_LIST_AND_LINKS,
    );

    const promises = layerOne.reducedLists.map(
      async (reducedList: IReducedListContact) => {
        // TODO: verify possible error smell,
        return await this.contactsModel
          .find({
            idDevice: reducedList.idContactDevice,
            timestampInit: {
              $gt: getTimestampOfTwoWeeksAgo(),
              $lt: getTimestampNow(),
            },
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
      links: this.buildFullLayerLinks(layerOne.links, layerTwo.links),
    };

    const rootNode = await this.userService.getUsersAsNodes(idDeviceRoot);

    const nodesPromises = fullLayer.reducedLists.map(
      async (list: IReducedListContact) => {
        return await this.userService.getUsersAsNodes(list.idContactDevice);
      },
    );

    const pepe = await Promise.all(nodesPromises);

    const layerNodes = pepe.flat();

    const fullNodesWithDuplicatesNodes = [rootNode, ...layerNodes];

    const fullNodes: INode[] = uniqWith(fullNodesWithDuplicatesNodes, isEqual);

    await this.userService.updateNearNode(fullNodes[0].mail, tail(fullNodes));

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

  async getContacts(
    idDevice: string,
  ): Promise<{ contacts: IContactsTableInfo[]; documentsCount: number }> {
    const documentsCount = await this.contactsModel.countDocuments({
      idDevice,
      timestampInit: {
        $gt: getTimestampOfTwoWeeksAgo(),
        $lt: getTimestampNow(),
      },
      timestampEnd: { $ne: undefined },
    });

    this.logger.debug(`document conunter -> ${documentsCount}`);

    const contacts = await this.contactsModel
      .find({
        idDevice,
        timestampInit: {
          $gt: getTimestampOfTwoWeeksAgo(),
          $lt: getTimestampNow(),
        },
        timestampEnd: { $ne: undefined },
      })
      .sort({ timestampInit: -1 });

    this.logger.debug(`contacts -> ${JSON.stringify(contacts, null, 3)}`);

    if (contacts.length === 0) return;

    const contactsTableData = await this.buildContactsTableData(contacts);

    this.logger.debug(
      `Este son los contactos contruidos -> ${JSON.stringify(
        contactsTableData,
        null,
        3,
      )}`,
    );

    return { contacts: contactsTableData, documentsCount };
  }

  private buildFullLayerLinks(layerOne: ILink[], layerTwo: ILink[]): ILink[] {
    const directory = {};

    layerOne.map((link, index) => {
      directory[link.idContactDevice] = index;
    });

    layerTwo.map((link) => {
      if (directory[link.idContactDevice] !== undefined) {
        layerOne[directory[link.idContactDevice]].idContactDevice =
          layerOne[directory[link.idContactDevice]].idDevice;

        layerOne[directory[link.idContactDevice]].idDevice =
          link.idContactDevice;
      }
    });

    return [...layerOne, ...layerTwo];
  }

  private calculateDistance(rssi: number) {
    const distance = Math.pow(10, -(rssi - this.A) / (10 * this.N)).toFixed(2);

    return distance;
  }

  private async buildContactsTableData(
    contacts: IContactsDB[],
  ): Promise<IContactsTableInfo[]> {
    const buildedDataPromises = contacts.map(
      async (contact): Promise<IContactsTableInfo> => {
        const contactUser = await this.userService.findUserByIdDevice(
          contact.idContactDevice,
        );

        this.logger.debug(`usuario encontrado ?? -> ${contactUser.fullName}`);

        return {
          name: contactUser.fullName,
          duration: getTimeDifference(
            contact.timestampInit,
            contact.timestampEnd,
          ),
          idDevice: contact.idContactDevice,
          date: getDateFromTimestamp(contact.timestampInit),
        };
      },
    );

    return await Promise.all(buildedDataPromises);
  }
}
