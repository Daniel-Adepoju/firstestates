import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async (req) => {
const {searchParams} = new URL(req.url)
const agentId = searchParams.get('id')
  const location = searchParams.get('location') || ''
  const school = searchParams.get('school') || ''
 const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
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
     let totalDocs = await Listing.countDocuments({agent: agentId})
     let filterLength = await Listing.countDocuments({$or:searchOptions})
     let currentRentings = await Listing.countDocuments({agent: agentId, status: "rented"})
     const numOfPages = Math.ceil(filterLength/ Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }

    let listingConfig
    if(searchOptions.length > 0) {
      listingConfig = Listing.find({$or:searchOptions,agent: agentId}).populate(["agent"])
    } else {
      listingConfig = Listing.find({agent: agentId}).populate(["agent"])
    }
  
    
   listingConfig = listingConfig.skip(skipNum).limit(limit).sort('-createdAt')
 
    const listings = await listingConfig
 return NextResponse.json({listings,currentListings:totalDocs,currentRentings,cursor,numOfPages}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}
