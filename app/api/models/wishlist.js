import { Schema, model, models } from "mongoose";
import User from "./user";
import Listing from "./listing";
const WishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: [true, 'User is required'],
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: Listing.modelName,
    required: [true, 'Listing is required'],
  }
}, {timestamps: true});

const Wishlist = models?.Wishlist || model('Wishlist', WishlistSchema);

export default Wishlist;
