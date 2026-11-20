import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import CommunityPost from "@models/communityPost"
import { NextResponse } from "next/server"

export const POST = async (req, { params }) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDB()
  const post = await CommunityPost.findByIdAndUpdate((await params).id, { $addToSet: { reportedBy: session.user.id } }, { new: true })
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  return NextResponse.json({ message: "Report received" })
}
