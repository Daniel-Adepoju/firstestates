export default function Guidelines() {
  return (
    <details className="mb-3 rounded-xl border border-border/70 bg-muted/30 px-3 py-2">
      <summary className="cursor-pointer text-xs font-semibold text-foreground">
        Chat guidelines &amp; quick tips
      </summary>
      <div className="mt-3 space-y-3 text-xs leading-5 text-muted-foreground">
        <section>
          <p className="font-semibold text-foreground">Reply to a message</p>
          <ul className="list-disc space-y-0.5 pl-5">
            <li>Click a message once to open its options, then choose <strong>Reply</strong>.</li>
            <li>On touch devices, swipe a message to the right to start a reply.</li>
            <li>Your reply preview shows the original text, or <strong>Replied to audio</strong> for a voice message.</li>
          </ul>
        </section>

        <section>
          <p className="font-semibold text-foreground">Message options</p>
          <p>Use the message menu to star, edit your own text, delete messages, or report a message. Actions available depend on who sent the message.</p>
        </section>

        <section>
          <p className="font-semibold text-foreground">Voice messages</p>
          <ul className="list-disc space-y-0.5 pl-5">
            <li>Tap the microphone when the composer is empty to record.</li>
            <li>Pause, resume, finish, cancel, or send from the recording controls.</li>
            <li>Tap play to listen, or drag across the waveform to seek.</li>
          </ul>
        </section>

        <section>
          <p className="font-semibold text-foreground">Conversation tips</p>
          <ul className="list-disc space-y-0.5 pl-5">
            <li>Chats started from a listing stay connected to that listing.</li>
            <li>Scroll to the top of the message area to load older messages.</li>
            <li>Treat people respectfully. Hate speech, harassment, scams, and abusive language are not allowed.</li>
          </ul>
        </section>
      </div>
    </details>
  )
}
