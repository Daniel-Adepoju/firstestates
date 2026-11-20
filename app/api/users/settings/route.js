import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import User from "@models/user"
import { NextResponse } from "next/server"

const allowed = new Set(["theme", "defaultFeed", "locationFeed", "preferredSchool", "notifications"])
export const GET = async () => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDB()
  const user = await User.findById(session.user.id).select("settings school role").lean()
  return NextResponse.json({ settings: user?.settings || {}, school: user?.school, role: user?.role })
}

export const PATCH = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const updates = {}
  for (const [key, value] of Object.entries(body)) if (allowed.has(key)) updates[`settings.${key}`] = value
  if (body.notifications && typeof body.notifications === "object") {
    for (const [key, value] of Object.entries(body.notifications)) updates[`settings.notifications.${key}`] = Boolean(value)
    delete updates["settings.notifications"]
  }
  await connectToDB()
  const user = await User.findByIdAndUpdate(session.user.id, { $set: updates }, { new: true, runValidators: true }).select("settings")
  return NextResponse.json({ settings: user.settings })
}
