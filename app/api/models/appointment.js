import { Schema, model, models } from "mongoose";
import User from "./user";
import Listing from "./listing";

const AppointmentSchema = new Schema({
    date:{
        type:Date,
        required:true
    },
    creatorID: {
        type: Schema.Types.ObjectId,
        ref: User.modelName,
        required: [true, 'Creator is required'],
    },
    clientID: {
        type: Schema.Types.ObjectId,
        ref: User.modelName,
    },
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
    },
    listingID: {
        type: Schema.Types.ObjectId,
        ref: Listing.modelName,
        required: [true, 'Listing is required'],
    },
   appointmentType:{
        type: String,
        enum:['initial','revisit','final'],
        default:'Initial'
    },
    reminderSent: {
        type: Boolean,
        default: false,
    },
},{timestamps:true})

const Appointment = models?.Appointment || model('Appointment', AppointmentSchema);
export default Appointment;