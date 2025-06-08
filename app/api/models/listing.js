import { Schema, model, models } from "mongoose";
import User from "./user";

const ListingSchema = new Schema({
  agent: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: [true, 'Agent is required'],
  },
  school: {
    type: String,
    required: [true, 'School is required'],
  },
  mainImage: {
    type: String,
    required: [true, 'Main image is required'],
  },
  gallery: {
    type: [String],
    required: [true, 'Gallery images are required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  amenities: {
    type: [String],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  favorites: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
  },
  toilets: {
    type: Number,
    required: [true, 'Number of toilets is required'],
  },
  status: {
    type: String,
    enum: ['available', 'rented'],
    default: 'available',
  },
  totalViews: {
    type:Number,
    default: 0
  },
  weeklyViews: {
    type: Number,
    default: 0
  }
}, {timestamps: true});

const Listing = models?.Listing || model('Listing', ListingSchema);

export default Listing;
