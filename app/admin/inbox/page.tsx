import Inbox from "@components/chats/Inbox";
import ConversationEmptyState from "@components/chats/ConversationEmptyState";

export default function AdminChatInbox() {
  return (
    <>
      <main className="flex h-screen min-w-0 gap-3"><div className="w-full min-w-0 md:w-[min(32rem,38%)]"><Inbox topMargin="mt-1 w-full "/></div><ConversationEmptyState /></main>
    </>
   
  )
}
