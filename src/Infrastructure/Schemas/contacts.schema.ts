import { Schema } from 'mongoose';

export const ConctactsSchema = new Schema({
  idDevice: String,
  idContactDevice: String,
  rssi: Number,
  distance: Number,
  timestampInit: Number,
  timestampEnd: Number,
});
