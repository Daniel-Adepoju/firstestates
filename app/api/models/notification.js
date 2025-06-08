import { Schema, model, models } from "mongoose"
import User from "./user"

const NotificationSchema = new Schema({
  userId: {
   type: Schema.Types.ObjectId,
    ref: User.modelName
},
  recipientRole: {
    type: String,
    enum: ["admin", "agent", "client"],
    required: false
},
  type: {
    type: String,
    required: true
},
  message: {
    type: String,
    required: true
},
readBy: [{
  type: Schema.Types.ObjectId,
  ref:  User.modelName
}],
clearedBy: [{
  type: Schema.Types.ObjectId,
  ref:  User.modelName
}],
  mode: {
    type: String, enum: ["individual", "broadcast-agent","broadcast-admin"],
    default: "individual"
},
thumbnail: {
  type: String,
  required: false
},
  
},{timestamps: true})

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 6 * 30 * 86400 });

const Notification = models?.Notification || model('Notification', NotificationSchema);

export default Notification;
