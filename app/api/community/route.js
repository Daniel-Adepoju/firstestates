import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import CommunityPost from "@models/communityPost"
import { NextResponse } from "next/server"

export const GET = async () => {
  await connectToDB()
  const posts = await CommunityPost.find({ status: "published" }).sort("-createdAt").limit(50).populate({ path: "author", select: "username profilePic role" }).lean()
  return NextResponse.json({ posts })
}

export const POST = async (req) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  if (!String(body.title || "").trim() || !String(body.content || "").trim()) return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
  await connectToDB()
  const post = await CommunityPost.create({ title: body.title, content: body.content, category: body.category, author: session.user.id })
  return NextResponse.json({ post }, { status: 201 })
}
