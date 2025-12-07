import { client } from "@lib/server/appwrite"

import { Databases, ID, Query , Models} from "appwrite"

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const MESSAGES_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!
const CONVERSATIONS_ID = process.env.NEXT_PUBLIC_APPWRITE_CONVERSATIONS_ID!

const database = new Databases(client)

export const sendMessage = async (
  text: string,
  userId: string,
  receiverId: string,
  conversationId: string
) => {
  const createdAt = new Date().toISOString()
  //   Create Message
  await database.createDocument(DATABASE_ID, MESSAGES_ID, ID.unique(), {
    conversationId,
    userId,
    receiverId,
    text,
    createdAt,
    readBy: [userId],
  })
  //  Update Conversation
  await database.updateDocument(DATABASE_ID, CONVERSATIONS_ID, conversationId, {
    updatedAt: createdAt,
    lastMessage: text,
  })
}

// export const getMessages = async (conversationId: string) => {
//   if (!conversationId) return []

//   // get conversation
//   const res = await database.listDocuments(DATABASE_ID, MESSAGES_ID, [
//     Query.equal("conversationId", conversationId),
//     Query.orderDesc("createdAt"),
//     Query.limit(5),
//   ])

//   const lastDoc = res.documents[res.documents.length - 1]

//   // fetch older messges

// const older = await database.listDocuments(
//   DATABASE_ID,
//   MESSAGES_ID,
//   [
//     Query.equal("conversationId", conversationId),
//     Query.orderDesc("createdAt"),
//     Query.limit(5),
//     Query.cursorAfter(lastDoc.$id), // ← This is the key
//   ]
// );
//   // combine older messages with newer messages
//   const combined = [...older.documents, ...res.documents]
//   // sort combined messages by createdAt
//  const ordered = combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())




//   return ordered
// }

// lib/server/chats.ts
export const getMessages = async (
  conversationId: string,
  limit = 5,
  cursor?: string // document ID to paginate after (for older messages)
): Promise<Models.Document[]> => {
  if (!conversationId) return []

  const queries = [
    Query.equal("conversationId", conversationId),
    Query.orderDesc("createdAt"), // newest first
    Query.limit(limit),
  ]

  if (cursor) {
    queries.push(Query.cursorAfter(cursor))
  }

  const res = await database.listDocuments(
    DATABASE_ID,
    MESSAGES_ID,
    queries
  )

  // Return messages in chronological order (oldest → newest)
  return res.documents.reverse()
}

export const deleteMessage = async (chatId: string) => {
  try {
    const selectedChat = await database.getDocument(DATABASE_ID, MESSAGES_ID, chatId)
    // selectedChat.delete()
    await database.deleteDocument(DATABASE_ID, MESSAGES_ID, chatId)
    // change conversation last message to deleted
    await database.updateDocument(DATABASE_ID, CONVERSATIONS_ID, selectedChat.conversationId, {
      lastMessage: "[Deleted Message]",
    })
  } catch (err) {
    console.log(err, "Failed To Delete Chat")
  }
}

export async function getUserConversations(userId: string) {
  const res = await database.listDocuments(DATABASE_ID, CONVERSATIONS_ID, [
    Query.contains("userIds", [userId]),
    Query.orderDesc("updatedAt"),
  ])

  return res.documents
}

export async function getOrCreateConversation(userAId: string, userBId: string) {
  const userIds = [userAId, userBId].sort()

  const existing = await database.listDocuments(DATABASE_ID, CONVERSATIONS_ID, [
    Query.equal("userIds", [userIds[0]]),
    Query.equal("userIds", [userIds[1]]),
  ])

  if (existing.total > 0) {
    return existing.documents[0]
  }

  const conversation = await database.createDocument(DATABASE_ID, CONVERSATIONS_ID, ID.unique(), {
    userIds,
    updatedAt: new Date().toISOString(),
    lastMessage: "",
  })

  return conversation
}

export async function updateReadStatus(userId: string, conversationId: string) {
  const res = await database.listDocuments(DATABASE_ID, MESSAGES_ID, [
    Query.equal("conversationId", conversationId),
    Query.equal("receiverId", userId),
    Query.notEqual("userId", userId),
    Query.limit(100),
  ])

  const messages = res.documents

  const updatePromises = []
  for (let message of messages) {
    if (message.readBy.includes(userId)) continue
    updatePromises.push(
      database.updateDocument(DATABASE_ID, MESSAGES_ID, message.$id, {
        readBy: [...message.readBy, userId],
      })
    )
  }
  await Promise.all(updatePromises)
}

export async function getUnreadChats(userId: string) {
  const res = await database.listDocuments(DATABASE_ID, MESSAGES_ID, [
    Query.equal("receiverId", userId),
    Query.notEqual("userId", userId),
    Query.limit(100),
  ])

  const unreadMessages = res.documents.filter((msg) => !msg.readBy?.includes(userId))

  return unreadMessages.length.toString()
}
export async function getUnreadChatsInConversation(conversationId: string, userId: string) {
  const res = await database.listDocuments(DATABASE_ID, MESSAGES_ID, [
    Query.equal("conversationId", conversationId),
    Query.equal("receiverId", userId),
    Query.notEqual("userId", userId),
    // Query.limit(100),
  ])

  const unreadMessages = res.documents.filter((msg) => !msg.readBy?.includes(userId))

  return unreadMessages.length.toString()
}






// comments


  //  get converssation date
  // console.log(res.documents, "pol")

  // delete old conversation with no messages

  //    const convo = await database.getDocument(DATABASE_ID, CONVERSATIONS_ID, conversationId)
  //     const isOld = Date.now() - new Date(convo.createdAt).getTime() > 30 * 1000;
  //     if (isOld && conversationId && res.documents.length < 1) {
  //  await database.deleteDocument(DATABASE_ID, CONVERSATIONS_ID, conversationId)
  //     }