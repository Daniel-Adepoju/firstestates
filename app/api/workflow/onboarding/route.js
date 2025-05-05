import { serve } from "@upstash/workflow/nextjs"
import { connectToDB } from "@utils/database";
import  UserModel from "@models/user";
import {sendEmail} from '@lib/server/workflow'

const oneDay = 1000*60*60*24;
const threeDays = 3 * oneDay;
const  thirtyDays = 30 * oneDay;

const getUserState = async(email) => {
  await connectToDB()
  const user = await UserModel.findById(session?.user.id)
  if(!user) return "non-active"
  const lastActivityDate = new Date(user.lastActivityDate)
  const now = new Date()
  const timeDifference = now.getTime() - lastActivityDate.getTime()
 if (timeDifference > threeDays && timeDifference <= thirtyDays) {
  return "non-active"
 } 
 return "active"
}

export const {POST} = serve(async (context) => {
  const {email, username} = context.requestPayload;
  await context.run("new-signup", async() => {
    await sendEmail({
      email,
      subject: 'Welcome to the platform',
      message: `Welcome to firstestates ${username}`
  })
  })

await context.sleep("wait for 3 days", 60*60*24*3)

while(true) {
    const state = await context.run("check user state", async() => {
        return await getUserState(email)
    })
 console.log('processing user state') 

if (state === "non-active") {
    await context.run("send-email-non-active", async() => {
        await sendEmail({
            email,
            subject: 'Newsletter',
            message: `Hey ${username}, we've missed you!`
        })
    })
} else if (state === "active") {
   await context.run("send-email-active", async () => {
    await sendEmail(
      {email,
      subject: 'Newsletter',
      message: `Welcome back ${username}`})
   })
}
  await context.sleep("wait for a month", thirtyDays)
}
})