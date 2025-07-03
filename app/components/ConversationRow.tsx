'use client'
import { useGetUser } from "@lib/customApi"
import { CldImage } from "next-cloudinary"
import { Skeleton } from "./ui/skeleton";

type ConversationRowProps = {
  convo: {
    userIds: string[];
    lastMessage?: string;
  };
  currentUserId: string;
  onClick: (otherId: string) => void;
};

export default function ConversationRow({ convo, currentUserId, onClick }: ConversationRowProps) {
  const otherId = convo.userIds.find((id) => id !== currentUserId)
  const { data: user, isLoading } = useGetUser({ id: otherId, enabled: !!otherId, page: "1", limit: 1 })

  return (
    <div
      className="p-3 bg-gray-100 dark:bg-black/10 rounded border-1 border-transparent border-t-gray-500/30 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500/20"
      onClick={() => otherId && onClick(otherId)}
    >
        <div className="flex items-center">
    {isLoading ?
     <Skeleton className=" gap-4 w-10 h-10 rounded-full bg-gray-500/20" />
     : <CldImage
        src={user?.profilePic}
        width={40}
        height={40}
        alt='profilePic'
        crop={'auto'}
        className="rounded-full"
        />}
      <div className="font-medium ml-1">
        {isLoading ? <Skeleton className="w-32 h-4 bg-gray-500/20" /> : user?.username || 'Unknown User'}

      </div>
      </div>
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 truncate">
       {isLoading ? <Skeleton className="ml-1 w-32 h-4 bg-gray-500/20" />
       :  convo.lastMessage || 'No messages'}
      </div>
    </div>
  )
}
