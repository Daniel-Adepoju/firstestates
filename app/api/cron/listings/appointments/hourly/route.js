import Appointment from "@models/appointment";
import { connectToDB } from "@utils/database"
import { NextResponse } from "next/server"
import {inMinutes} from "@utils/date";
import {sendEmail} from '@lib/server/sendEmail'
import {parseDate} from "@utils/date";

export const GET = async (req) => {
    try {
    
  await connectToDB()
      const now = new Date()
         const oneHourFromNow = inMinutes(60)
  const appointments = await Appointment.find({
            date: { $gte: now, $lte: oneHourFromNow },
            reminderSent: { $ne: true }
    }).sort('date').populate('creatorID clientID listingID')
 
    if(appointments.length > 0) {
      for (const appointment of appointments) {
   const subject = "Appointment Reminder"
      const message = `
      <div>
Hi ${appointment.creatorID?.username || "there"},

Just a reminder that you have a scheduled appointment:

<p>
📅  <strong>Appointment Date:</strong> ${parseDate(appointment.date)}
</p>
<p>
  📍 <strong>Listing Location:</strong> ${appointment.listingID?.location || "Location not available"}
</p>
<p>
  👤 <strong>Client:</strong> ${appointment.clientName || "Client information not available"}
</p>

Best,  
First Estates
      </div>`

          await sendEmail({
        to: appointment.creatorID.email,
        subject,
        message,
          })
          appointment.reminderSent = true
          await appointment.save()
        }
        
     return NextResponse.json({posts:{message:'Reminders sent successfully'}}, { status: 200 }) 
    } else {
      return NextResponse.json({posts:{message:'No Reminder'}}, { status: 200 }) 
    }

    } catch(err) {
            console.error("Error in sending reminder:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
    }
    }