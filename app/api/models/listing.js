import { Schema, model,models } from "mongoose";
import User from "./user";
const ListingSchema = new Schema({
    agent: {
        type: Schema.Types.ObjectId,
        ref: User.modelName,
        required: [true, 'Agent is required'],
    },
    mainImage: {
        type:String,
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
     required: [true, 'Amenities is required']
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

})

const Listing = models.Listing || model('Listing', ListingSchema)