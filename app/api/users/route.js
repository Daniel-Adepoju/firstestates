import { connectToDB } from "@utils/database"
import User from "@models/user"
import {NextResponse} from "next/server"

export const GET = async (req) => {
    const {searchParams} = new URL(req.url)
  const page = searchParams.get('page') || 1
  const limit =  Number(searchParams.get('limit')) ||  10
  const search = searchParams.get('search') || ''
  const skipNum = Number((page- 1) * Number(limit))
  let cursor = Number(page)

    try {
 await connectToDB()
 const searchOption = {username: {$regex:search, $options: "i" }}
const usersNum = await User.countDocuments({$or: [searchOption]} )
   const numOfPages = Math.ceil(usersNum / Number(limit))
    if (cursor >= numOfPages) {
      cursor = numOfPages
    }


    let usersConfig = User.find( {$or: [searchOption]} )
      usersConfig = usersConfig.skip(skipNum).limit(limit).sort('-createdAt')

const users = await usersConfig
 return NextResponse.json({users,cursor,numOfPages}, {status: 200})
    } catch (err) {
console.log(err)
return NextResponse.json(err, {status: 500})
    }

} 