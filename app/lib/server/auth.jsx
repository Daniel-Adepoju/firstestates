"use server"
import { connectToDB } from "@utils/database"
import nodemailer from "nodemailer"
import otpGenerator from "otp-generator"
import User from "@models/user"
import { storeOtpInCookie } from "@utils/otpUtils"
import { hash } from "bcryptjs"
import { getOtpFromCookie } from "@utils/otpUtils"
import { signIn, signOut, auth } from "@auth"
import { headers } from "next/headers"
import ratelimit from "@lib/server/ratelimit"
import {workflowClient} from "@lib/server/workflow"
import { redirect } from "next/navigation"
import { deleteImage } from "./deleteImage"

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

export const verifyOTP = async (val) => {
  const getOtp = await getOtpFromCookie()

  try {
    await connectToDB()

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
    const { success } = await ratelimit.limit(ip)
    if (!success) return redirect("/too-fast")

    // Create New User
    console.log("Verifying OTP", getOtp, val.clientOtp)
    if (getOtp === val.clientOtp) {
      const password = await hash(val.userPassword, 10)

      const newUser = {
        username: val.username,
        email: val.email,
        role: val.role,
        password,
        school: val.role === "client" ? (val.school || null) : undefined,
   ...(val.role === "agent" && val.phone && { phone: val.phone }),
  ...(val.role === "agent" && val.whatsapp && { whatsapp: val.whatsapp }),
  ...(val.role === "agent" && val.address && { address: val.address }),
      }

      const user = new User(newUser)
      await user.save()

      await workflowClient.trigger({
        url: `${process.env.PROD_BASE_URL}/api/workflow/onboarding`,
        body: { email: val.email, username: val.username }
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

export const signInWithGoogle = async () => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return redirect("/too-fast")
  }
    await signIn('google', {redirectTo:'/continue-google'})

  return
}


export const logOut = async () => {
  await signOut({redirect: false })
  redirect('/logged-out')
}

export const updateUser = async(val) => {
  try {
await connectToDB()
const session = await auth()
const userId = val.id || session.user.id
 
await User.findOneAndUpdate(
  {_id: userId},
  val,
  {
    new: true,
    runValidators: true,
  }
)
      return { message: 'Update Successful', status: "success" }
  } catch (err) {
    console.log(err)
      return { message: res.error, status: "danger" }
  }

}

export const updateProfilePic = async(val) => {
  console.log(val)
  try {
    if (val.oldPic !== 'firstestatesdefaultuserpicture') {
 await deleteImage(val.oldPic)
    }
 await updateUser({profilePic: val.newPic})
   return { message: 'Profile picture updated successfully', status: "success" }
  } catch (err) {
    console.log(err)
  }
}

export const resetPassword = async (val) => {
     await connectToDB()
    const hashedPassword =  await hash(val.password,10)
     await User.findOneAndUpdate(
      {email: val.email},
     {password:hashedPassword},
      {
    new: true,
    runValidators: true,
      }
    )
  return { message: "Password updated successfully" }
}

export const banUser = async (userId) => {
  try {
    await connectToDB()
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return { message: "Unauthorized", status: "warning" }
    }

   const user = await User.findByIdAndUpdate(userId)
    user.banStatus = !user.banStatus;
  await user.save();
  if (!user.banStatus) {
    return { message: "Restored successfully", status: "success" }
  }
    return { message: "User banned successfully", status: "success" }
  } catch (err) {
    console.error(err)
    return { message: "An error occurred while banning user", status: "danger" }
  }
}