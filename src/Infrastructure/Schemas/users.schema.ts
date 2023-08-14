import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  fullName: String,
  idDevice: String,
  isDevice: Boolean,
  isPossibleSick: Boolean,
  isPossibleSickTs: Number,
  isSick: Boolean,
  mail: String,
  password: String,
  rol: String,
  nearNodes: [
    {
      mail: String,
      name: String,
      id: String,
      colour: String,
    },
  ],
});
