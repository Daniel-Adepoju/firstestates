import { cookies } from "next/headers" // For Next.js cookies API


export const storeOtpInCookie = async (otp) => {
  const cookieStore = await cookies()
  
  cookieStore.set("otp", otp, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    sameSite: "strict",
    path: "/",
    maxAge: 6000220,
  })
    console.log("OTP stored in cookie:", otp)
}

export const getOtpFromCookie = async () => {
    const cookieStore = await cookies()
    const otpCookie = cookieStore.get('otp')
    if (otpCookie) {
        console.log("OTP retrieved from cookie:", otpCookie.value)
        return otpCookie.value
    } else {
        console.log("No OTP found in cookie")
        return 'mukk'
    }

}
