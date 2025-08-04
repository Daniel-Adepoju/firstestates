import Wishlist from "@models/wishlist"
import { connectToDB } from "@utils/database";
import { auth } from "@auth";
import { NextResponse } from "next/server";

export const GET = async (req) => {
      const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)


  try {
 const session = await auth() 
  await connectToDB()

  const wishlistCount = await Wishlist.countDocuments({user: session?.user.id})
  const numOfPages =  Math.ceil(wishlistCount/limit)
   
  if (cursor >= numOfPages) {
      cursor = numOfPages
    }

    const wishlist = await Wishlist.find({user: session?.user.id}).populate({
    path: 'listing',
    populate: {
      path: 'agent',    
    //   model: 'User'  
  }}).skip(skipNum).limit(limit)

    if (!wishlist) {
      return NextResponse.json({message: 'No wishlists found'}, { status: 404 }) 
    }

    return NextResponse.json({wishlist,numOfPages,cursor}, { status: 200 }) 
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}

export const POST = async (req) => {
    const session = await auth()
    await connectToDB()
    try {
        const { listingId } = await req.json()
        const checkExisting = await Wishlist.findOne({user: session?.user.id, listing: listingId})
        // if (checkExisting) {
        // return NextResponse.json({message: 'Listing already in wishlist'}, { status: 400 })
        // }
        const newWishlist = new Wishlist({
            user: session?.user.id,
            listing: listingId
        })
        await newWishlist.save()
    return NextResponse.json({message: 'Added To Wishlist'}, { status: 201 })
    } catch (err) {
        console.log(err)
        return NextResponse.json(err, {status:500})
    }
}

export const DELETE = async (req) => {
  const session = await auth()
  await connectToDB()
  try {
    const { listingId,wishlistId } = await req.json()
    const wishlist = await Wishlist.findOne({_id:wishlistId, user: session?.user.id, listing: listingId})
    if (!wishlist) {
      return NextResponse.json({message: 'No wishlist found'}, { status: 404 }) 
    }
    await wishlist.deleteOne()
    return NextResponse.json({message: 'Removed from wishlist'}, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}