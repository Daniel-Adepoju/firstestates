import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { analytics } from "@/utils/analytics"

export const proxy = async (req: NextRequest) => {
  const url = new URL(req.url)
  const pathname = url.pathname

  try {
    if (pathname === "/") {
      await analytics.track("pageview", { page: "/" })
    } else if (pathname === "/agent") {
      await analytics.track("pageview", { page: "/agent" })
    }
  } catch (err) {
    console.log(err)
  }
  return NextResponse.next()
}

