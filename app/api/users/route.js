import { connectToDB } from "@utils/database"
import User from "@models/user"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  try {
    await connectToDB()

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search")?.trim() || ""
    const skipNum = (page - 1) * limit

    const searchFilter = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    const usersNum = await User.countDocuments(searchFilter)
    const numOfPages = Math.max(1, Math.ceil(usersNum / limit))
    const cursor = Math.min(page, numOfPages)

    const users = await User.find(searchFilter)
      .sort("-createdAt")
      .skip(skipNum)
      .limit(limit)

    return NextResponse.json({ users, cursor, numOfPages }, { status: 200 })
  } catch (err) {
    console.error("GET /users error:", err)
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 })
  }
}
