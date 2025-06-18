import { connectToDB } from "@utils/database"
import User from "@models/user"
import {NextResponse} from "next/server"

export const GET = async (req, {params}) => {
  
    const id =  (await params).id

  try {
    await connectToDB()
    const user = await User.findById(id).select("-password")
    
    if (!user) {
      return NextResponse.json({message: "User not found"}, {status: 404})
    }

    return NextResponse.json(user, {status: 200})
  } catch (err) {
    console.log(err)
    return NextResponse.json({message: "Internal Server Error"}, {status: 500})
  }
}