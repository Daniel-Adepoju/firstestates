'use server'

import { connectToDB } from "@utils/database"
import Payment from "@models/payment"
import redis from "./redis"
import {parseDate} from "@utils/date";


  const date = new Date()
  const day = date.getDay()
  const year = date.getFullYear()
  const parsedDate = parseDate(date)
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const pastDays = Math.floor((date.getTime() - firstDay.getTime()) / 86400000)
  const week = String(Math.ceil((pastDays + firstDay.getDay() + 1) / 7)).padStart(2, '0')
  const daykey=`payments${day}`
  const weekKey=`payments${week}`
  const yearlyKey = `payments${year}`


    const storePayment = async (amount:number) => {
   //day redis
 await redis.hincrby(daykey, "amount", amount)
 await redis.expire(daykey, 86400)
  
 //week redis
await redis.hincrby(weekKey, "amount", amount)
 await redis.expire(weekKey,8 * 86400)

//year redis
await redis.hincrby(yearlyKey, "amount", amount)
 await redis.expire(yearlyKey,370 * 86400)
}

export const getPayment = async () => {
const getDayPayment = await redis.hgetall(daykey)
const getWeekPayment = await redis.hgetall(weekKey)
const getYearPayment = await redis.hgetall(yearlyKey)

return {getDayPayment, getWeekPayment, getYearPayment}
}


export  const makePayment = async (val:any) => {
    try {
    await connectToDB()
    const newPayment = new Payment(val)
    await newPayment.save()
    await storePayment(Number(val.amount))
    return
} catch (err) {
    console.log(err)
}
}