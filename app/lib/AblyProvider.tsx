"use client"
// client-ably

import * as Ably from "ably"
import { AblyProvider } from "ably/react"

export const client = new Ably.Realtime({
  authUrl: `api/ably/auth`,
  authMethod: "POST",
  // key: process.env.ABLY_CLIENT_KEY!,
})
export default function AblyClientProvider({ children }: { children: React.ReactNode }) {
  return <AblyProvider client={client}>{children}</AblyProvider>
}
