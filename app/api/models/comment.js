import { Schema, model, models } from "mongoose";
import User from "./user";
import Listing from "./listing";

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: [true, 'Agent is required'],
  },
    listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: [true, 'Listing is required'],
  },
  content: {
    type: String,
    required: [true, 'School is required'],
  },


}, {timestamps: true});

const Comment = models?.Comment || model('Comment', CommentSchema);

export default Comment;
