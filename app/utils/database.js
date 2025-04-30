import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if(isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {dbName: "firstestates",
          connectTimeoutMS: 20000,
        });
    
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        // console.log(error);
    }
}