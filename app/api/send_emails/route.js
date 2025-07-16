import { NextResponse } from "next/server"
import { sendEmail } from "@lib/server/sendEmail"

export const POST = async (req) => {
  const { to, subject, message } = await req.json()
  try {
    await sendEmail({to,subject,message})
    return NextResponse.json({ success: true })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
