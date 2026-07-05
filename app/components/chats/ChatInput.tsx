import { Loader2, SendHorizonal } from "lucide-react"

export default function ChatInput({ text, setText, handleSendMessage, sending }: any) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
        placeholder="Type your message..."
        className="flex-1 border-2 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-none"
      />

      <button
        onClick={handleSendMessage}
        disabled={sending || !text.trim()}
        className="w-11 h-11 border-r-goldPrimary border-t-goldPrimary border-b-amber-400 border-l-amber-400 border-3 rounded-full gold-gradient text-white flex items-center justify-center hover:opacity-90 transition"
      >
        {sending ? (
          <Loader2
            className="animate-spin"
            size={20}
          />
        ) : (
          <SendHorizonal size={20} />
        )}
      </button>
    </div>
  )
}
