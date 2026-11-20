import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import DeviceToken from "@models/deviceToken"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { token, platform = "web" } = await req.json()
  if (!String(token || "").trim()) return NextResponse.json({ error: "Token is required" }, { status: 400 })
  await connectToDB()
  await DeviceToken.findOneAndUpdate({ token: String(token).trim() }, { user: session.user.id, token: String(token).trim(), platform, lastSeenAt: new Date() }, { upsert: true, new: true, runValidators: true })
  return NextResponse.json({ registered: true })
}

export const DELETE = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { token } = await req.json()
  await connectToDB()
  await DeviceToken.deleteOne({ user: session.user.id, token })
  return NextResponse.json({ removed: true })
}
