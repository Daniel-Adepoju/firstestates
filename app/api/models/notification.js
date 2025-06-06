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
  read: {
    type: Boolean,
    default: false 
},

  mode: {
    type: String, enum: ["individual", "broadcast"],
    default: "individual"
},
},{timestamps: true})

NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 6 * 30 * 86400 });

const Notification = models?.Notification || model('Notification', NotificationSchema);

export default Notification;
