'use client'
import { useState, useRef, useEffect } from 'react'
import {client} from '@/lib/server/appwrite'
import {sendMessage,getMessages,getOrCreateConversation,updateReadStatus} from '@/lib/server/chats'
import { useUser } from '@utils/user'
import type { Models } from 'appwrite';
import { useSearchParams } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Inbox from '@components/Inbox';
import ChatBubble from './ChatBubble';
import { Loader2,SendHorizonal} from 'lucide-react';
import { groupMessagesByDate } from '@utils/date';

export default function Chat() {
  const [messages, setMessages] = useState<Models.Document[]>([])
  const groupedMessages = groupMessagesByDate(messages)
  const {session} = useUser()
  const userId = session?.user.id
  const recipientId = useSearchParams().get('recipientId')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [text, setText] = useState('');
  const [loading,setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [sending,setSending] = useState(false)
  const [showId,setShowId] = useState('')
  
  const handleSendMessage = async () => {
    if (!text.trim() || !conversationId || !userId) return
   setSending(true)
await sendMessage(text, userId, recipientId!, conversationId)
 setText('')
 setSending(false)
  } 
 
   useEffect(() => {
  if (!userId || !recipientId) return
  setLoading(true)
    const setupConversation = async () => {
      const convo = await getOrCreateConversation(userId, recipientId)
      setConversationId(convo.$id)

      const msgs = await getMessages(convo.$id)
      setMessages(msgs)
      setLoading(false)
   
    }
    setupConversation()
  }, [userId, recipientId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if(!conversationId) return
   const updateRead = async () => await updateReadStatus(userId,conversationId)
   updateRead()
  }, [sending,messages])

  useEffect(() => {
    if (!conversationId) return

     const unsubscribe = client.subscribe(
    `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}.documents`,
    (res) => {
      const newMsg = res.payload as Models.Document
       if (newMsg.conversationId !== conversationId) return;

         if (res.events.some((e) => e.includes('create'))) {
        setMessages((prev) => [...prev, newMsg])
      }

      if (res.events.some((e) => e.includes('update'))) {
        setMessages((prev) =>
          prev.map((msg) => (msg.$id === newMsg.$id ? newMsg : msg))
        )
      }

      if (res.events.some((e) => e.includes('delete'))) {
        setMessages((prev) => prev.filter((msg) => msg.$id !== newMsg.$id));
      }
    }
  );

  return () => unsubscribe();
  }, [conversationId])
  

if (loading) {
 return  <MoreHorizontal color='grey' size={40} className='mt-50 mx-auto animate-pulse'/>
 }
  if(!userId && !recipientId || !session) {
    return (<div className='loginFirst text-xl'>
    <span>To use our chat feature</span>
    <Link href='/login' className='cursor-pointer mx-1 p-1 px-4  rounded-md text-white dark:bg-coffee bg-darkblue'>Log in</Link>
    </div>
  )}
  if (userId === recipientId) {
    return <div className='text-xl text-gray-600 dark:text-white mt-40 text-center mx-auto font-bold'>
    <span>You can't chat with yourself</span>
    </div>
  }

  return (
    <div className='nobar flex gap-1 w-full h-screen'>
        <div className='hidden md:block flex-1 w-[30%]'>
          <Inbox topMargin='0'/>
        </div> 

     <div className="flex-1 flex flex-col  w-full  border rounded-xl  p-4 mx-auto dark:bg-gray-700/40">
      <div className="nobar null w-[98%] flex-1 flex flex-col overflow-y-auto space-y-2 mb-4">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
  <div key={date}>
    <h4 className="text-center dark:text-gray-300 text-gray-500 text-sm my-4">{date}</h4>
   <div className='flex flex-col gap-4 mb-2'>
    {msgs.map((msg:any) => (
    <ChatBubble key={msg.$id} msg={msg} userId={userId} showId={showId} setShowId={setShowId} recipientId={recipientId} />

    ))}
    </div>
  </div>
))}
      <div ref={bottomRef} />
      </div>
      <div>
      <div className='text-xs'> 
      To avoid getting banned or permanently removed from First Estates, please use the chat feature responsibly.
     </div>
        <ul className='px-2 ml-2 list-disc text-xs'>
            <li >
 Treat others with kindness and respect
            </li>
            <li>
     Avoid hate speech, harassment, or abusive language
            </li>
        </ul>
        </div>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 border dark:border-gray-400 rounded-lg px-4 py-2 focus:outline-none resize-none"
        />
        <div
          onClick={handleSendMessage}
          className="w-10 h-10 flex items-center justify-center clickable bg-goldPrimary text-white  rounded-full hover:bg-goldPrimary/90 cursor-pointer"
        >
      {sending ? <Loader2 size={22} className='animate-spin'/> : <SendHorizonal size={22}/>}
        </div>
      </div>
    </div> 
    </div>
  );
}
