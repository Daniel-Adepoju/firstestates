import { connectToDB } from "@utils/database"
import School from "@models/school"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || 1
  const limit = Number(searchParams.get("limit")) || 10
  const fullname = searchParams.get("fullname") || ""
  const shortname = searchParams.get("shortname") || ""
  const skipNum = Number((page - 1) * Number(limit))
  let cursor = Number(page)
  const searchOptions = []

  if (fullname) {
    searchOptions.push({ fullname: { $regex: fullname, $options: "i" } })
  }

  if (shortname) {
    searchOptions.push({ shortname: { $regex: shortname, $options: "i" } })
  }

  try {
    await connectToDB()
    const totalSchools =
      searchOptions.length > 0
        ? await School.countDocuments({ $or: searchOptions })
        : await School.countDocuments()
    const numOfPages = Math.ceil(totalSchools / limit)
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }

    let schoolsConfig
    if (searchOptions.length > 0) {
      schoolsConfig = School.find({ $or: searchOptions })
    } else {
      schoolsConfig = School.find()
    }
    schoolsConfig = schoolsConfig.skip(skipNum).limit(limit).sort("-createdAt")
    const schools = await schoolsConfig
    return NextResponse.json({ schools, cursor, numOfPages }, { status: 200 })
  } catch (err) {
    return new NextResponse("Failed to fetch schools", { status: 500 })
  }
}

export const POST = async (req) => {
  const { fullname, shortname, logo, address } = await req.json()
    try {
        await connectToDB()
        const newSchool = new School({ fullname, shortname, logo, address })
        await newSchool.save()
        return NextResponse.json(newSchool, { status: 201 })
    } catch (err) {
        return new NextResponse("Failed to create a new school", { status: 500 })
    }
}
