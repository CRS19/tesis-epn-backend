import { rolesEnum } from './../../auth/Enums/RolesEnum';
import { IUser } from './../interfaces/users.interfaces';

export const USER_TEST_RESPONSE_MOCK: IUser = {
  fullName: 'CRS test',
  mail: 'a@a.com',
  password: 'secret',
  idDevice: '',
  isDevice: false,
  isSick: false,
  isPossibleSick: false,
  rol: rolesEnum.USER,
  isPossibleSickTs: 0,
  nearNodes: [],
};
