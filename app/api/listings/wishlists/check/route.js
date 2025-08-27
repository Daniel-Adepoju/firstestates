import Wishlist from "@models/wishlist"
import { connectToDB } from "@utils/database";
import { auth } from "@auth";
import { NextResponse } from "next/server";

export const POST = async (req,{params}) => {
const { listingIds } = await req.json()
  try {
 const session = await auth()
  await connectToDB()
//  if(!session?.user?.id) {
//   return NextResponse.json({message: 'Unauthenticated'}, { status: 401})
//  }
  if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { message: "listingIds must be a non-empty array" },
        { status: 400 }
      )
    }
  const wishlists = await Wishlist.find({user: session?.user.id, listing: { $in: listingIds}}).populate('listing')

 const result = {}
 for (const id of listingIds) {
   result[id] = wishlists.some(wishlist => wishlist.listing._id.toString() === id.toString())
 }
  return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(err, { status: 500}) 
  }
}