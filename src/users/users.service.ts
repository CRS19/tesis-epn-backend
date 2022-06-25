import { PossibleSickAlertGateway } from './../websockets/possibleSickAlert/possibleSickAlert.gateway';
import {
  getTimestampNow,
  getTimestampOfTwoWeeksAgo,
} from './../utils/time-utils';
import { getNameInitials, rainbowGenerate } from './../utils/color-utils';
import { INode } from './../contacts/interfaces/buildData.interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { IUsersDB } from './interfaces/users.interfaces';
import { Model } from 'mongoose';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import { isNil, get, set } from 'lodash';
import { Cron } from '@nestjs/schedule';
import { EVERY_DAY_AT_TWO_AM } from './constants/CronConstants';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<IUsersDB>,
    private readonly possibleSickAlertGateway: PossibleSickAlertGateway,
  ) {}
  private readonly logger = new Logger(UsersService.name);
  @WebSocketServer() server: Server;

  async createNewUser(userToInsert: CreateUserRequestDTO) {
    this.logger.log(`createNewUser | userToInsert -> ${userToInsert.mail}`);

    const userExists = await this.userModel.exists({ mail: userToInsert.mail });

    if (isNil(userExists)) {
      const mySalt = await bcrypt.genSalt();
      const encryptedPass = await bcrypt.hash(userToInsert.password, mySalt);

      const newUser = new this.userModel({
        ...userToInsert,
        password: encryptedPass,
      });
      return newUser.save();
    }

    return;
  }

  async findUser(mail: string): Promise<IUsersDB> {
    const user = await this.userModel.findOne({ mail });
    return user;
  }

  async vinculateDevice(mail: string, idDevice: string) {
    this.logger.log(` | vinculateDevice mail -> ${mail} `);
    const user = await this.userModel.findOne({ mail });

    if (isNil(user)) return false;

    const newUser = { ...user, _doc: { ...get(user, '_doc', {}), idDevice } };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { mail },
      newUser,
      { new: true },
    );

    set(updatedUser, '_doc.password', undefined);
    console.log(updatedUser);

    return updatedUser;
  }

  async getUsersAsNodes(idDevice: string): Promise<INode> {
    const user = await this.userModel.findOne({ idDevice });

    const initials = getNameInitials(user.fullName);

    return {
      mail: user.mail,
      name: user.fullName,
      id: user.idDevice,
      colour: rainbowGenerate(
        initials.codePointAt(0)!,
        initials.codePointAt(1)!,
      ),
    };
  }

  async getUserByMail(mail: string): Promise<IUsersDB> {
    const user = await this.userModel.findOne({ mail });
    set(user, '_doc.password', undefined);

    return user;
  }

  async updateNearNode(mail: string, nearNodes: INode[]): Promise<boolean> {
    this.logger.log(
      ` | updateNearNode mail -> ${mail} nearNodes -> ${JSON.stringify(
        nearNodes,
        null,
        3,
      )} `,
    );
    const user = await this.userModel.findOne({ mail });

    if (isNil(user)) return false;

    const newUser = { ...user, _doc: { ...get(user, '_doc', {}), nearNodes } };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { mail },
      newUser,
      { new: true },
    );

    if (!isNil(updatedUser)) {
      return true;
    }

    return false;
  }

  async updateIsSick(mail: string, isSick: boolean): Promise<IUsersDB> {
    this.logger.log(` | updateIsSick mail -> ${mail} `);
    const user = await this.userModel.findOne({ mail });

    if (isNil(user)) return undefined;

    const newUser = { ...user, _doc: { ...get(user, '_doc', {}), isSick } };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { mail },
      newUser,
      { new: true },
    );

    if (isSick === true) {
      const updatePosibleSickNodesPromises = updatedUser.nearNodes.map(
        async (node: INode) => {
          return await this.userModel.updateOne(
            { mail: node.mail },
            { isPossibleSick: true, isPossibleSickTs: getTimestampNow() },
          );
        },
      );

      await Promise.all(updatePosibleSickNodesPromises);
      this.logger.debug('Llamar al socket');
      this.possibleSickAlertGateway.server.emit(
        'elpepeResponse',
        'Hola, soy el servidor',
      );
      this.logger.debug('Socket llamado OK');
    }

    set(updatedUser, '_doc.password', undefined);

    console.log(JSON.stringify(updatedUser));

    return updatedUser;
  }

  @Cron(EVERY_DAY_AT_TWO_AM)
  async setPossibleSickToFalse() {
    this.logger.log(` | handleCron `);

    const response = await this.userModel.updateMany(
      {
        isPossibleSick: true,
        isPossibleSickTs: {
          $lt: getTimestampOfTwoWeeksAgo(),
        },
      },
      { isPossibleSick: false },
    );

    this.logger.log(` | handleCron response -> ${JSON.stringify(response)} `);

    return response.modifiedCount > 0;
  }
}
