import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database"
import Payment from "@models/payment"


export async function GET(req) {
    const {searchParams} = new URL(req.url)
  const userId = searchParams.get('userId')

  await connectToDB();
  
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const stats = await Payment.aggregate([
    {
      $match: {
        status: 'success',
        ...(userId && {userId}),
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return NextResponse.json(stats);
}


// export async function POST(req){
//     const data = await req.json()
//     await connectToDB()
//     const newPayment = new Payment(data)
//     await newPayment.save()
//     return NextResponse.json(newPayment) 
// }