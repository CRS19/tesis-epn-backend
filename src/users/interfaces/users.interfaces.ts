import { INode } from '../../contacts/interfaces/buildData.interfaces';
export interface IUser {
  fullName: string;
  idDevice: string;
  isDevice: boolean;
  isPossibleSick: boolean;
  isPossibleSickTs: number;
  isSick: boolean;
  mail: string;
  password: string;
  rol: string;
  nearNodes: INode[];
}

export interface IUsersDB extends Document {
  fullName: string;
  idDevice: string;
  isDevice: boolean;
  isPossibleSick: boolean;
  isPossibleSickTs: number;
  isSick: boolean;
  mail: string;
  password: string;
  rol: string;
  nearNodes: INode[];
}
