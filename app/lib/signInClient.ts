"use client"

import { signIn } from "next-auth/react"
import { checkLoginRateLimit } from "@lib/server/checkRateLimit"

export const signInClient = async (
  email: string,
  password: string
) => {
  const { success } = await checkLoginRateLimit()

  if (!success) {
    return {
      message: "Too many login attempts. Please try again later.",
      status: "rate_limited",
    }
  }

  try {
    const res = await signIn("credentials", {
      email,
      password,
    callbackUrl: "/",
    })

 
  } catch (err: any) {
    console.error(err)

    return {
      message: "Something went wrong, please try again",
      status: "danger",
      other: err?.type,
    }
  }
}