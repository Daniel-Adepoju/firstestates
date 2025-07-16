import Appointment from "@models/appointment";
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"


export const GET = async (req) => {
  await connectToDB()
      const now = new Date()
     await Appointment.deleteMany({
      date: { $lt: now }
    })
     return NextResponse.json({posts:{}}, { status: 200 }) 
}