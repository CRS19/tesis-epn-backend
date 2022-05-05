export interface IContacts {
  idDevice: string;
  timestampInit: number;
  timestampEnd: number;
}

export interface IContactsDB extends Document {
  idDevice: string;
  timestampInit: number;
  timestampEnd: number;
}
