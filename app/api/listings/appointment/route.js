import Appointment from "@models/appointment";
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
   let cursor = Number(page)
   const skipNum = (cursor - 1) * limit

   try {
    // const session = await auth() 
    const now = new Date()
    await connectToDB()
    


    const appointments = await Appointment.countDocuments()
    
    const numOfPages = Math.ceil(appointments / Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }

    const appointmentsConfig = Appointment.find().
    populate({path:"clientID",select:"_id"}).
    populate({path:"listingID", select:'mainImage _id'})
    .skip(skipNum).limit(limit).sort('-createdAt')

    const lastAppointment = await Appointment.findOne({ date: { $lt: now } }).sort('-date').select('date')
    const nextAppointment = await Appointment.findOne({ date: { $gt: now } }).sort('date').select('date')

    const posts = await appointmentsConfig

 return NextResponse.json({posts,cursor,numOfPages,lastAppointment,nextAppointment}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}



export const POST = async (req) => {
  const session = await auth()
   const userId = session?.user.id
  const val = await req.json()
 
  await connectToDB()
  try {
    const newAppointment = new Appointment(val)
    newAppointment.creatorID = userId
    await newAppointment.save()
    return NextResponse.json(newAppointment, { status: 201 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}

export const DELETE = async(req) => {

  await connectToDB()

  try {
   

    return NextResponse.json(
      { message: `Deleted past appointments` },
      { status: 200 }
    )
  } catch (err) {
    console.error("Error deleting appointments:", err);
    return NextResponse.json(err, { status: 500 });
  }
}