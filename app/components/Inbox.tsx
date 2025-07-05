'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@utils/user'
import { getUserConversations} from '@/lib/server/chats'
import type { Models } from 'appwrite'
import { CldImage } from 'next-cloudinary'
import { MoreHorizontal } from 'lucide-react'
import ConversationRow from '@components/ConversationRow'
import { Skeleton } from './ui/skeleton'

type InboxProps = {
  topMargin?: string
}

export default function Inbox({ topMargin }: InboxProps) {
  const { session } = useUser()
  const userId = session?.user.id
  const [conversations, setConversations] = useState<Models.Document[]>([])
  const router = useRouter()
const [loading,setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    const loadConversations = async () => {
      const convos = await getUserConversations(userId)
      setConversations(convos)
      setLoading(false)
    }

    loadConversations()
  }, [userId])


  const handleOpenChat = (recipientId: string) => {
    router.push(`/chat?recipientId=${recipientId}`)
  }

  if (loading) {
    return <MoreHorizontal size={40} color='grey' className='animate-pulse'/>
  }

  return (
    <div className={`${topMargin} h-screen w-full mx-auto bg-white dark:bg-gray-700/40 shadow rounded-lg`}>
     
     <div className='ml-2 py-2 mb-2 flex flex-row items-center gap-2 border-2 border-transparent border-b-gray-500/20'>
      {session?.user.profilePic ?  <CldImage
        width={45}
        height={45}
        crop='auto'
        src={session?.user.profilePic}
        alt='profile pic'
        className='rounded-full'
        /> : <Skeleton className='w-10 h-10 rounded-full animate-none bg-gray-500/20'/>}
    <h2 className="otherHead  text-center text-xl font-semibold">Chats</h2>
     </div>
      <div className="space-y-3 p-2 overflow-y-scroll h-full nobar null">
        {conversations.map((convo) => (
          <ConversationRow
            key={convo.$id}
            convo={{
              $id:convo.$id,
              userIds: convo.userIds,
              lastMessage: convo.lastMessage,
            }}
            currentUserId={userId}
            onClick={handleOpenChat}
          />
        ))}
        {!loading && userId && conversations.length === 0 && (
          <p className="w-50 mt-45 text-center text-sm text-gray-400 mx-auto">No conversations yet.</p>
        )}
      </div>
    </div>
  )
}
