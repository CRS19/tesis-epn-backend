export interface IUser {
  fullName: string;
  idDevice: string;
  isDevice: boolean;
  isPossibleSick: boolean;
  isSick: boolean;
  mail: string;
  password: string;
  rol: String;
}

export interface IUsersDB extends Document {
  fullName: string;
  idDevice: string;
  isDevice: boolean;
  isPossibleSick: boolean;
  isSick: boolean;
  mail: string;
  password: string;
  rol: String;
}
