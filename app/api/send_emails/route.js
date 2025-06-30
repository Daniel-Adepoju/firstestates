import nodemailer from "nodemailer"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  const { to, subject, message } = await req.json()
  try {
    const transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      }, //remove from production
    })

    const mailOptions = {
      from: `First Estates ${process.env.ZOHO_EMAIL}`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html: `
    <html lang="en">
  <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="400" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;">
            <tr>
              <td style="background-color: rgb(8, 116, 199); padding: 20px; text-align:center; color:white;">
  <h1 style="margin:0; font-size:24px;">${subject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px; color:#333;">
              <div style="margin-top: -50px; white-space:pre-wrap;">
                 ${message}
              </div>

                <div style="margin: 30px 0; text-align:center;">
                  <a href=${process.env.BASE_URL} style="background-color: rgb(8, 116, 199); color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;">
                    Go to Homepage
                  </a>
                </div>
                <p style="font-size:14px; color:#666;">
                  If you have any questions, reply to this email or visit our <a href=${process.env.BASE_URL}/help style="color:#4f46e5; text-decoration:none;">Help Center</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#999;">
                &copy; <span id="current-date"></span> First Estates. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <script>
 document.getElementById("current-date").textContent = new Date().getFullYear()
</script>
  </body>
</html>
    `,
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
