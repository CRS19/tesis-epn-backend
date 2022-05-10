export interface IContactRequest {
  idDevice: string;
  idContactDevice: string;
  rssi: number;
  isInit: boolean;
}

export interface IContacts {
  idDevice: string;
  idContactDevice: string;
  rssi: number;
  distance: number;
  timestampInit: number;
  timestampEnd: number;
}

export interface IContactsDB extends Document {
  idDevice: string;
  idContactDevice: string;
  rssi: number;
  distance: number;
  timestampInit: number;
  timestampEnd: number;
}
