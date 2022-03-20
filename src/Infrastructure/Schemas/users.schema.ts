import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  fullname: String,
  mail: String,
  password: String,
  idDevice: String,
  isSick: Boolean,
  isPossibleSick: Boolean,
});
