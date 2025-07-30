import Appointment from "@models/appointment";
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"
import {inMinutes} from "@utils/date";
import {sendEmail} from '@lib/server/sendEmail'

export const GET = async (req) => {
    try {
  await connectToDB()
      const now = new Date()
  const appointment = await Appointment.findOne({
      date: {$gte:now, $lte:inMinutes(1440)}
    }).sort('date').populate('creatorID clientID listingID')
 
    if(appointment) {

   const subject = "Reminder: You have an appointment today"
      const message = `
      <div>
Hi ${appointment.creatorID?.username || "there"},

Just a reminder that you have an appointment scheduled today:

<p>
  📅 <strong>Appointment Date:</strong> ${appointment.date.toLocaleString().slice(0,10)}
</p>
<p>
  📍 <strong>Listing Location:</strong> ${appointment.listingID?.location || "Location not available"}
</p>
<p>
  👤 <strong>Client:</strong> ${appointment.clientName || "Client information not available"}
</p>

Best,  
First Estates
     </div> `

          await sendEmail({
        to: appointment.creatorID.email,
        subject,
        message,
      })

    } else {
      return
    }

     return NextResponse.json({posts:{}}, { status: 200 }) 
    } catch(err) {
            console.error("Error in sending reminder:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
    }
    }