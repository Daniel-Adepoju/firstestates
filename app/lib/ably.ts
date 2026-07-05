// client-ably

import * as Ably from "ably"

export const ably = new Ably.Realtime({
  key: process.env.ABLY_CLIENT_KEY!,
})
