"use server"
import { connectToDB } from "@utils/database"
import nodemailer from "nodemailer"
import otpGenerator from "otp-generator"
import User from "@models/user"
import { storeOtpInCookie } from "@utils/otpUtils"
import { hash } from "bcryptjs"
import { getOtpFromCookie } from "@utils/otpUtils"
import { signIn, signOut } from "@auth"
import { headers } from "next/headers"
import ratelimit from "@lib/server/ratelimit"
import {workflowClient} from "@lib/server/workflow"
import { redirect } from "next/navigation"

export const sendOTP = async ({ email }) => {
  try {
    await connectToDB()
    //Check For Existing User
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log("already exists")
      return { message: "Email already exists", status: "warning" }
    } else {
      let otp = otpGenerator.generate(5, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      })
  await storeOtpInCookie(otp)

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
        from:`First Estates ${process.env.ZOHO_EMAIL}`,
        to: email,
        subject: "Verify Your Email Address",
        html: `
<div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px;">
    <h2 style="color: rgb(8, 116, 199); font-size: 28px; margin-bottom: 20px;">${otp}</h2>
    <p style="font-size: 16px; margin: 0; color: #555;">
      Input the provided OTP to verify your email address.
    </p>
    <p style="font-size: 14px; margin: 10px 0; color: #888;">
      OTP is valid for <strong>5 minutes</strong>.
    </p>
  </div>
</div>
`,
      }

      await transporter.sendMail(mailOptions)
    }
    return { message: "OTP sent successfully", status: "success" }
  } catch (err) {
    console.error(err)
    return { message: "An error occurred while sending OTP", status: "danger" }
  }
}

export const verifyOTP = async ({
  username,
  email,
  role,
  userPassword,
  phone,
  whatsapp,
  address,
  clientOtp,
}) => {
  const getOtp = await getOtpFromCookie()
  try {
    await connectToDB()
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
    const { success } = await ratelimit.limit(ip)
    if (!success) return redirect("/too-fast")
    
      //Create New User
    if (getOtp === clientOtp) {
      const password = await hash(userPassword, 10)
      const newUser = {
        username,
        email,
        role,
        password,
        phone: role === "client" ? null : phone,
        whatsapp: role === "client" ? null : whatsapp,
        address: role === "client" ? null : address
      }
      const user = new User(newUser)
      await user.save()

      await workflowClient.trigger({
        url:`${process.env.PROD_BASE_URL}/api/workflow/onboarding`,
        body: {email,username}
      })
      return { message: "Verification successful", status: "success" }
    } else {
      return { message: "Invalid OTP", status: "warning" }
    }
  } catch (err) {
    console.error(err)
    return { message: "An error occurred while verifying OTP", status: "danger" }
  }
}

export const signInWithCredentials = async (email, password) => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return redirect("/too-fast")
  }
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })     

    if (res?.error) {
      return { message: res.error, status: "danger" }
    }
  } catch (err) {
    console.log(err)
    if (err.type === "CredentialsSignin") {
      return { message: "Invalid Email or Password", status: "warning" }
    } else {
      return { message: "something went wrong, please try again", status: "danger" ,other: err.type}
    }
  }
  return { message: "Log In Successful", status: "success" }
}

export const logOut = async () => {
  await signOut("/")
  return redirect("/")
}
