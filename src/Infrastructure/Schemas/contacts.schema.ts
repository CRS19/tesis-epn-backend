import { Schema } from 'mongoose';

export const ConctactsSchema = new Schema({
  idDevice: String,
  timestampInit: Number,
  timestampEnd: Number,
});
