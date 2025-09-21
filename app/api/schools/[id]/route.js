import { connectToDB } from "@utils/database"
import School from "@models/school"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
  const schoolId = (await params).id
  try {
    await connectToDB()
    const school = await School.findById(schoolId)
    if (!school) {
      return new NextResponse("School not found", { status: 404 })
    }
    return NextResponse.json(school, { status: 200 })
  } catch (err) {
    return new NextResponse("Failed to fetch school", { status: 500 })
  }
}

export const PATCH = async (req, { params }) => {
    const searchParams = new URL(req.url)
    const isDeleteArea = searchParams.searchParams.get('deleteArea') === 'true'
  const schoolId = (await params).id
//   const { fullname, shortname, logo, address } = await req.json()
const { areaValue} = await req.json()
  try {
    await connectToDB()

    if (isDeleteArea) {
         await School.findOneAndUpdate(
            { _id: schoolId },
            { $pull: { schoolAreas: areaValue }},
            { new: true, runValidators: true }
          )
        } else {
  await School.findOneAndUpdate(
      { _id: schoolId },
      { $push: { schoolAreas: areaValue }},
      { new: true, runValidators: true }
    )
  }
    const updatedSchool = await School.findById(schoolId)
    if (!updatedSchool) {
      return new NextResponse("School not found", { status: 404 })
    }

    return NextResponse.json(updatedSchool, { status: 200 })
  } catch (err) {
    return new NextResponse("Failed to update school", { status: 500 })
  }
}

// export const DELETE = async (req, { params }) => {
    
//   const schoolId = (await params).id
//     try {
//         await connectToDB()
        
//     } catch (err) {
//         return new NextResponse("Failed to delete school", { status: 500 })
//     }
// }
