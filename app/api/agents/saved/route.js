import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import SavedAgent from "@models/savedAgent"
import User from "@models/user"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDB()
  const { searchParams } = new URL(req.url)
  const agentId = searchParams.get("agent")
  if (agentId) {
    const saved = await SavedAgent.exists({ user: session.user.id, agent: agentId })
    return NextResponse.json({ saved: Boolean(saved) })
  }
  const savedAgents = await SavedAgent.find({ user: session.user.id }).sort("-createdAt").populate({ path: "agent", select: "username profilePic isPremium phone address" }).lean()
  const agents = await Promise.all(savedAgents.filter((item) => item.agent).map(async (item) => ({
    ...item.agent,
    savedAgentId: item._id,
    activeListingCount: await Listing.countDocuments({ agent: item.agent._id, status: "available" }),
  })))
  return NextResponse.json({ agents })
}

export const POST = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { agentId } = await req.json()
  await connectToDB()
  const agent = await User.findOne({ _id: agentId, role: "agent" }).select("_id")
  if (!agent || String(agent._id) === String(session.user.id)) return NextResponse.json({ error: "Invalid agent" }, { status: 400 })
  const existing = await SavedAgent.findOne({ user: session.user.id, agent: agentId })
  if (existing) {
    await existing.deleteOne()
    return NextResponse.json({ saved: false, message: "Agent removed from saved agents" })
  }
  await SavedAgent.create({ user: session.user.id, agent: agentId })
  return NextResponse.json({ saved: true, message: "Agent saved" }, { status: 201 })
}
