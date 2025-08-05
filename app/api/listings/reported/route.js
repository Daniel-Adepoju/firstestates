import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import Listing from "@models/listing"

export const GET = async (req) => {
  const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)

    try {
        await connectToDB()

        const reportedCount = await Listing.countDocuments({reportedBy: { $exists: true, $ne: [] } })
        
        const numOfPages =  Math.ceil(reportedCount/limit)
        
        if (cursor >= numOfPages) {
            cursor = numOfPages
          }

        const reported = await Listing.find(
        {reportedBy: { $exists: true, $ne: [] } 
        }).populate({
            path: 'agent',    
          }).skip(skipNum).limit(limit).sort('createdAt')

         return NextResponse.json({reported,cursor,numOfPages}, { status: 200 }) 
    } catch (err) {
        console.log(err)
        return NextResponse.json(err, { status: 500}) 
    }

}