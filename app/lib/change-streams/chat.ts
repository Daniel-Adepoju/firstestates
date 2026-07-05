import Chat from "@models/chat"
import { ObjectId } from "mongodb"
import {ably} from "@/lib/server/ably"

export function watchChats(io: any, conversationId: string | ObjectId) {
  const stream = Chat.watch(
    [
      //   {
      //     $match: {
      //       "fullDocument.conversationId": new ObjectId(conversationId),
      //     },
      //   },
    ],
    {
      fullDocument: "updateLookup",
    },
  )

   stream.on("change", async (change) => {
    try {
      switch (change.operationType) {
        case "insert": {
          const message = change.fullDocument

          await ably.channels
            .get(`chat:${message.conversationId}`)
            .publish("message:create", message)

          break
        }

        case "update": {
          const message = change.fullDocument

          await ably.channels
            .get(`chat:${message.conversationId}`)
            .publish("message:update", message)

          break
        }

        case "delete": {
          await ably.channels
            .get("chat")
            .publish("message:delete", {
              _id: change.documentKey._id,
            })

          break
        }
      }
    } catch (err) {
      console.error(err)
    }
  })
}
