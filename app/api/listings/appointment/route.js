import Appointment from "@models/appointment"
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"
import { auth } from "@auth"
import Listing from "@models/listing"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || 1
  const limit = Number(searchParams.get("limit")) || 10
  let cursor = Number(page)
  const skipNum = (cursor - 1) * limit

  try {
    const session = await auth()
    const creatorID = session?.user.id
    const now = new Date()
    await connectToDB()

    const numberOfAppointments = await Appointment.countDocuments({ $or: [{ creatorID }, { clientID: creatorID }] })

    const numOfPages = Math.ceil(numberOfAppointments / Number(limit))

    const cursor = Math.min(page, numOfPages)

    const appointmentsConfig = Appointment.find({ $or: [{ creatorID }, { clientID: creatorID }] })
      .populate({ path: "clientID", select: "_id" })
      .populate({ path: "listingID", select: "mainImage _id" })
      .skip(skipNum)
      .limit(limit)
      .sort("-createdAt")

    const ownership = { $or: [{ creatorID }, { clientID: creatorID }] }
    const nextAppointmentDoc = await Appointment.findOne({ ...ownership, date: { $gt: now } })
      .sort("date")
      .select("date")

    const nextAppointment = nextAppointmentDoc ? nextAppointmentDoc.date : null

    // last appointment
    const lastAppointmentDoc = await Appointment.findOne({ ...ownership, date: { $lt: now } })
      .sort("-date")
      .select("date")

    const lastAppointment = lastAppointmentDoc?.date ?? null

    const posts = await appointmentsConfig

    return NextResponse.json(
      { posts, cursor, numOfPages, numberOfAppointments, nextAppointment, lastAppointment },
      { status: 200 },
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
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const listing = await Listing.findById(val.listingID).populate("agent", "_id")
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    const isAgentRequest = String(listing.agent?._id || listing.agent) === String(userId)
    const newAppointment = new Appointment({ ...val, creatorID: isAgentRequest ? userId : listing.agent?._id, clientID: isAgentRequest ? val.clientID : userId, clientName: isAgentRequest ? val.clientName : session.user.name || session.user.email, status: "requested" })
    const existing = await Appointment.findOne({ listingID: val.listingID, clientID: newAppointment.clientID, status: { $in: ["requested", "accepted", "rescheduled"] } })
    if (existing) return NextResponse.json({ error: "You already have an active appointment request for this listing" }, { status: 409 })
    await newAppointment.save()
    return NextResponse.json(newAppointment, { status: 201 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500 })
  }
}

export const PATCH = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { appointmentId, status, date, notes } = await req.json()
  if (!["accepted", "declined", "rescheduled", "completed"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  await connectToDB()
  const appointment = await Appointment.findById(appointmentId).populate({ path: "listingID", select: "agent" })
  if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
  const isAgent = String(appointment.listingID.agent) === String(session.user.id)
  const isClient = String(appointment.clientID) === String(session.user.id)
  if (!isAgent && !(isClient && status === "declined")) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  appointment.status = status
  if (date) appointment.date = new Date(date)
  if (notes !== undefined) appointment.notes = String(notes).slice(0, 1000)
  await appointment.save()
  return NextResponse.json({ appointment })
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
