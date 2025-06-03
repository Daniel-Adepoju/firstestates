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
        required:[true,'Password is required'],
        min: 5
     },
    
     profilePic: {
        type:String,
        default: 'firstestatesdefaultuserpicture',
     },
     phone: {
        type: Number,
     },
     whatsapp: {
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
    lastActivityDate : {
        type:String,
        default:new Date().toLocaleDateString("en-GB")
    }
},{timestamps: true})

const User = models?.User || model("User",UserSchema)
export default User