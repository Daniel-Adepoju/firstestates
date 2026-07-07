import { NextResponse, NextRequest } from "next/server"
import { auth } from "@auth"
import * as Ably from "ably"

export async function POST(req: NextRequest) {
  if (!process.env.ABLY_API_KEY) {
    return NextResponse.json({ error: "Ably API key missing" }, { status: 500 })
  }

  try {
    // Optional: Add your custom session validation/auth logic here
    const session = await auth()
    const client = new Ably.Rest(process.env.ABLY_API_KEY)

    // Generate the Token Request object
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: session?.user?.id,
    })
    console.log({ ablyAREturn: tokenRequestData })
    return NextResponse.json(tokenRequestData)
  } catch (err) {
    console.log(err)
    return NextResponse.json({ err }, { status: 500 })
  }
}
