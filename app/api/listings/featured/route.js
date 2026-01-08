
import { connectToDB } from "@utils/database"
import Listing from "@models/listing"
import { NextResponse } from "next/server"

export const GET = async () => {
try {
    await connectToDB()

    const featuredListings = await Listing.aggregate([
      { $match: { isFeatured: true, status: 'available' } },
      { $sample: { size: 12 } },
      {
    $lookup: {
      from: 'users',
      localField: 'agent',
      foreignField: '_id',
      as: 'agent' 
    }
  },
  {
    $unwind: '$agent'
  },
  {
    $project: {
      price: 1,
      address:1,
      mainImage: 1,
      location:1,
      school:1,
      'agent._id':1,
      'agent.username': 1,
      'agent.email': 1,
        'agent.profilePic':1,
        'agent.isTierOne':1,
        'agent.isTierTwo':1,
      }
    }
      ])
    
    return NextResponse.json({ featuredListings }, { status: 200 })
  } catch (err) {
    console.error("Error fetching featured listings:", err)
    return NextResponse.json(err, { status: 500 })
  }
}
