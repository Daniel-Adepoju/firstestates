export default function Guidelines() {
  return (
    <details className="mb-3">
      <summary className="text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
        Chat Guidelines
      </summary>
      <div className="mt-2 text-xs text-sky-500 dark:text-sky-400 font-medium">
        Normal chats are general, but chats started via a listing are automatically attached to that
        listing.
      </div>
      <div className="mt-2 text-xs text-green-700 dark:text-green-400 font-medium">
        To load older messages: scroll down at the top, then scroll back up.
      </div>
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
        <span className="font-head">
          To avoid getting banned or permanently removed from First Estates, please use the chat
          feature responsibly.
        </span>
        <ul className="list-disc pl-5 space-y-0.5">
          <li>Treat others with kindness and respect</li>
          <li>Avoid hate speech, harassment, or abusive language</li>
        </ul>
      </div>
    </details>
  )
}
