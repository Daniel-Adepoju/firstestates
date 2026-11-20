import { Schema, model, models } from "mongoose";

const SchoolSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'School name is required'],
    unique: true,
  },
  shortname: {
    type: String,
    required: [true, 'School short name is required'],
  },
    logo: {
    type: String,
    required: [true, 'School logo is required'],
  },
   schoolAreas:{
    type: [String],
    default: [],
   },
    address: {
    type: String,
    trim: true,
  },
  geocoding: {
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    sourceAddress: { type: String, trim: true },
    geocodedAt: { type: Date },
  },
   
},{timestamps: true});

const School = models?.School || model("School", SchoolSchema);

export default School;
