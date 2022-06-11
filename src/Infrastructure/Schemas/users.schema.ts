import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  fullName: String,
  idDevice: String,
  isDevice: Boolean,
  isPossibleSick: Boolean,
  isSick: Boolean,
  mail: String,
  password: String,
  rol: String,
});
