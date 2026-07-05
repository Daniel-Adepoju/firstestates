import Conversation from "@models/conversation"
import { ably } from "@/lib/server/ably"

export function watchConversations() {
  const stream = Conversation.watch([], {
    fullDocument: "updateLookup",
  })

  stream.on("change", async (change) => {
    if (change.operationType === "delete") return

    const conversation = change.fullDocument

    await Promise.all(
      conversation.userIds.map((userId: string) =>
        ably.channels.get(`user:${userId}`).publish("conversation:update", conversation),
      ),
    )
  })
}
