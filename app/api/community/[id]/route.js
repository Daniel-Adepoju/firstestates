import { auth } from "@auth"
import { connectToDB } from "@utils/database"
import CommunityPost from "@models/communityPost"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
  await connectToDB()
  const post = await CommunityPost.findOne({ _id: (await params).id, status: "published" }).populate({ path: "author", select: "username profilePic role" })
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  return NextResponse.json({ post })
}

export const PATCH = async (req, { params }) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDB()
  const post = await CommunityPost.findById((await params).id)
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  if (String(post.author) !== String(session.user.id) && session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const body = await req.json()
  if (body.title !== undefined) post.title = body.title
  if (body.content !== undefined) post.content = body.content
  if (body.category !== undefined) post.category = body.category
  if (body.status !== undefined && session.user.role === "admin") post.status = body.status
  await post.save()
  return NextResponse.json({ post })
}

export const DELETE = async (req, { params }) => {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectToDB()
  const post = await CommunityPost.findById((await params).id)
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  if (String(post.author) !== String(session.user.id) && session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await post.deleteOne()
  return NextResponse.json({ message: "Post deleted" })
}
