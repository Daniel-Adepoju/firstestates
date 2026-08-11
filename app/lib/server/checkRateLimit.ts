"use server"

import { headers } from "next/headers"
import ratelimit from "@lib/server/ratelimit"

export async function checkLoginRateLimit() {
  const headersList = await headers()

  const forwardedFor = headersList.get("x-forwarded-for")
  const realIp = headersList.get("x-real-ip")

  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1"

  const { success } = await ratelimit.limit(`login:${ip}`)

  return {
    success,
  }
}
