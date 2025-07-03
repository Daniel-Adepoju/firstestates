import {Client,Databases,ID,Query} from 'appwrite'

//track the searches made by a user

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!
const CONVERSATIONS_ID = process.env.NEXT_PUBLIC_APPWRITE_CONVERSATIONS_ID!
export const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(process.env.NEXT_PUBLIC_APPWRITE_ID!)

const database = new Databases(client);

export const sendMessage = async (text:string,userId:string,conversationId:string) => {
  const createdAt = new Date().toISOString();
//   Create Message
    await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
  conversationId,
  userId,
  text,
   createdAt,
 })
//  Update Conversation
   await database.updateDocument(DATABASE_ID,CONVERSATIONS_ID,conversationId,{
     updatedAt: createdAt,
    lastMessage: text,
 })


}

export const getMessages = async (conversationId:string) => {
  if(!conversationId) return [];

   const res = await database.listDocuments(
     DATABASE_ID,
     COLLECTION_ID,
    [
        Query.equal('conversationId', conversationId),
        Query.orderAsc('createdAt')
    ])
  return res.documents
}

export const deleteMessage = async (chatId:string) => {
  try {
  await database.deleteDocument(DATABASE_ID,COLLECTION_ID,chatId)
} catch(err) {
  console.log('Failed To Delete Chat')
}
}

export async function getUserConversations(userId: string) {
  const res = await database.listDocuments(DATABASE_ID, CONVERSATIONS_ID, [

    Query.contains('userIds', [userId]),
    Query.orderDesc('updatedAt'),
  ]);

  return res.documents;
}


export async function getOrCreateConversation(userAId:string, userBId:string) {
  const userIds = [userAId, userBId].sort();

  const existing = await database.listDocuments(DATABASE_ID, CONVERSATIONS_ID, [
    Query.equal('userIds', [userIds[0]]),
    Query.equal('userIds', [userIds[1]]),
  ]);

  if (existing.total > 0) {
    return existing.documents[0];
  }

  const conversation = await database.createDocument(DATABASE_ID, CONVERSATIONS_ID, ID.unique(), {
    userIds,
    updatedAt: new Date().toISOString(),
    lastMessage: '',
  });

  return conversation;
}


