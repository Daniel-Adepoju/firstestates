import Appointment from "@models/appointment"
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"
import { auth } from "@auth"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || 1
  const limit = Number(searchParams.get("limit")) || 10
  let cursor = Number(page)
  const skipNum = (cursor - 1) * limit

  try {
    const session = await auth()
    const creatorID = session.user.id
    const now = new Date()
    await connectToDB()

    const numberOfAppointments = await Appointment.countDocuments({ creatorID })

    const numOfPages = Math.ceil(numberOfAppointments / Number(limit))

    const cursor = Math.min(page, numOfPages)

    const appointmentsConfig = Appointment.find({ creatorID })
      .populate({ path: "clientID", select: "_id" })
      .populate({ path: "listingID", select: "mainImage _id" })
      .skip(skipNum)
      .limit(limit)
      .sort("-createdAt")

    const nextAppointmentDoc = await Appointment.findOne({ creatorID, date: { $gt: now } })
      .sort("date")
      .select("date")

    const nextAppointment = nextAppointmentDoc ? nextAppointmentDoc.date : null

    // last appointment
    const lastAppointmentDoc = await Appointment.findOne({ creatorID, date: { $lt: now } }).sort("-date").select("date")

    const lastAppointment = lastAppointmentDoc?.date ?? null

    const posts = await appointmentsConfig

    return NextResponse.json(
      { posts, cursor, numOfPages, numberOfAppointments, nextAppointment, lastAppointment },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500 })
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
    return NextResponse.json(err, { status: 500 })
  }
}

export const DELETE = async (req) => {
  await connectToDB()
  try {
    const { appointmentId } = await req.json()
    await Appointment.findOneAndDelete({ _id: appointmentId })
    return NextResponse.json({ message: `Deleted appointment` }, { status: 200 })
  } catch (err) {
    console.error("Error deleting appointments:", err)
    return NextResponse.json(err, { status: 500 })
  }
}
