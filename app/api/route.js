// import nodemailer from "nodemailer"
// import otpGenerator from "otp-generator"
// export const POST = async (req) => {
//   const { subject, content } = await req.json()

 
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "zoho",
//       host: "smtp.zoho.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.ZOHO_EMAIL,
//         pass: process.env.ZOHO_APP_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false,
//         minVersion: "TLSv1.2",
//       },
//     })

//     const mailOptions = {
//       from: process.env.ZOHO_EMAIL,
//       to: "torrentboy149@gmail.com",
//       subject: "Verify Your Email Address",
//       html: `
//   <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center;">
//     <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px;">
//       <h2 style="color: rgb(8, 116, 199); font-size: 28px; margin-bottom: 20px;">${otp}</h2>
//       <p style="font-size: 16px; margin: 0; color: #555;">
//         Input the provided OTP to verify your email address.
//       </p>
//       <p style="font-size: 14px; margin: 10px 0; color: #888;">
//         OTP is valid for <strong>5 minutes</strong>.
//       </p>
//     </div>
//   </div>
// `,
//     }

//     await transporter.sendMail(mailOptions)
//     return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 201 })
//   } catch (err) {
//     console.error(err)
//     return new Response(err, { status: 500 })
//   }
// }
