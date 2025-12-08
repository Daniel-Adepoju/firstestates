import { Loader2, SendHorizonal } from "lucide-react"

export default function ChatInput({ text, setText, handleSendMessage, sending }: any) {
  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
        placeholder="Type your message..."
        className="flex-1 border dark:border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-none"
      />

      <button
        onClick={handleSendMessage}
        disabled={sending || !text.trim()}
        className="w-10 h-10 rounded-full gold-gradient text-white flex items-center justify-center hover:opacity-90 transition"
      >
        {sending ? <Loader2 className="animate-spin" size={20} /> : <SendHorizonal size={20} />}
      </button>
    </div>
  )
}
