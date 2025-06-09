import Comment from "@models/comment";
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"

export const GET = async (req) => {
    const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const listingId = searchParams.get('listingId') || ''
 const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)


  try {
    await connectToDB()
     const commentsCount = await Comment.countDocuments({listing:listingId})
     const numOfPages = Math.ceil(commentsCount / Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }

    const comments = await Comment.find({ listing: listingId})
     .populate({
    path: 'author',
    select: 'username profilePic'
  })
    .sort('-createdAt').skip(skipNum).limit(limit)

         return NextResponse.json({comments,cursor,numOfPages}, { status: 200 }) 
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}