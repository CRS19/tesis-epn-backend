import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUsersDB } from './interface/users.interfaces';
import { Model } from 'mongoose';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<IUsersDB>,
  ) {}

  async createNewUser(userToInsert: CreateUserRequestDTO) {
    const newUser = new this.userModel(userToInsert);
    return newUser.save();
  }
}
