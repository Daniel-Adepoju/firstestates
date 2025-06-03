import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const location = searchParams.get('location') || ''
  const school = searchParams.get('school') || ''
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)
  const searchOptions = []

  if (location) {
   searchOptions.push({location: { $regex: location, $options: "i" }})
  }

  if (school) {
 searchOptions.push({school: { $regex: school, $options: "i" }})
}

  try {
    await connectToDB()
    let totalDocs = await Listing.countDocuments({$or:searchOptions})

    let listingConfig

    if(searchOptions.length > 0) {
    listingConfig = Listing.find({$or:searchOptions}).populate(["agent"])
    } else {
    listingConfig = Listing.find().populate(["agent"])
    }

    listingConfig = listingConfig.skip(skipNum).limit(limit).sort('-createdAt')
    
  const numOfPages = Math.ceil(totalDocs / Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }
    const posts = await listingConfig
 
 return NextResponse.json({posts,cursor,numOfPages}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
