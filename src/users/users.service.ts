import { getNameInitials, rainbowGenerate } from './../utils/color-utils';
import { INode } from './../contacts/interfaces/buildData.interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { IUser, IUsersDB } from './interfaces/users.interfaces';
import { Model } from 'mongoose';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import { isNil, get, set } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<IUsersDB>,
  ) {}
  private readonly logger = new Logger(UsersService.name);

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
}
