import {Schema,model,models} from "mongoose";

const UserSchema = new Schema({
    email: {
        type:String,
        unique:[true,'Email already exists'],
        required:[true,'Email is required'],
        match:[/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        'Please Provide Valid email'],
     },
     username: {
        type:String,
        required:[true,'Username is required'],
        min: 3,
     },
     
     password: {
        type:String,
        required:false,
        min: 5
     },
    
     profilePic: {
        type:String,
        default: 'firstestatesdefaultuserpicture',
     },
     phone: {
        type: Number,
     },

     address: {
        type: String,
     },
     school: {
        type: String,
     },
    role: {
        type:String,
        enum:['client','agent','admin'],
        default:'client'
    },

    isPremium: {
        type:Boolean,
        default:false
    },
    lastActivityDate : {
        type:String,
        default:new Date().toLocaleDateString("en-GB")
    },
    banStatus: {
        type:Boolean,
        default:false
    },
    referralId: { type: String, unique: true, sparse: true, index: true },
    referralCount: { type: Number, default: 0, min: 0, max: 3 },
    referralBonusMonths: { type: Number, default: 0, min: 0 },
    referralBonusExpiresAt: { type: Date },
    referredBy: { type: Schema.Types.ObjectId, ref: "User" },
    referralCompletedAt: { type: Date },
    settings: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      defaultFeed: { type: String, enum: ["all", "student", "residential"], default: "all" },
      locationFeed: { type: Boolean, default: false },
      preferredSchool: { type: String },
      notifications: {
        messages: { type: Boolean, default: true },
        appointments: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        listingActivity: { type: Boolean, default: true },
      },
    },
},{timestamps: true})

const User = models?.User || model("User",UserSchema)
export default User
