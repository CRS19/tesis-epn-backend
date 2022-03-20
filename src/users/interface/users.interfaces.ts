export interface IUser {
  fullName: string;
  mail: string;
  password: string;
  idDevice: string;
  isSick: boolean;
  isPosibleSick: boolean;
}

export interface IUsersDB extends Document {
  fullName: string;
  mail: string;
  password: string;
  idDevice: string;
  isSick: boolean;
  isPosibleSick: boolean;
}
