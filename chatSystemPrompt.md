# SYSTEM PROMPT: First Estates — Complete Chat Experience Upgrade

## 1. Project Objective

Upgrade the existing First Estates messaging system into a modern, interactive, feature-rich messaging experience.

This is a substantial frontend and backend improvement. It involves message interactions, conversation navigation, voice messages, recording controls, message management, conversation filtering, pinning, and user-specific conversation deletion.

The objective is to make the chat experience feel polished, intuitive, responsive, and reliable without compromising existing conversations, data integrity, authentication, or messaging functionality.

**This is not a request to rebuild the messaging system from scratch.**

We already have an existing chat implementation, database schema, messaging infrastructure, and working functionality. Extend these intelligently.

The implementation must preserve existing functionality and reuse existing infrastructure wherever possible.

---

# PHASE 1: ARCHITECTURE INVESTIGATION AND SAFETY

## 1.1 Inspect the Existing Chat Implementation

Before writing code or modifying the database, thoroughly inspect:

- Existing chat and inbox routes.
- Conversation and message schemas.
- Existing conversation relationships and participant identification.
- Message sending and receiving logic.
- Existing real-time messaging subscriptions.
- Message read receipts and unread counts.
- Existing image, video, and file attachment handling.
- Existing chat components and their responsibilities.
- Authentication and authorization checks.
- Existing conversation settings and user preferences.
- Existing notification infrastructure.
- Existing message deletion and reporting implementations, if any.
- Existing database indexes, constraints, and RLS policies.

Identify which requested features already exist, which are partially implemented, and which require new functionality.

Do not create duplicate database tables, handlers, or components when suitable implementations already exist.

## 1.2 Establish a Safe Implementation Strategy

This upgrade may require significant backend and frontend changes.

Follow these rules:

1. Do not destructively modify existing tables.
2. Do not drop existing messages or conversations.
3. Do not reset the database or truncate tables.
4. Do not replace working real-time infrastructure unnecessarily.
5. Preserve existing message IDs and conversation relationships.
6. Use backward-compatible migrations wherever possible.
7. Add appropriate indexes and constraints.
8. Ensure existing conversations remain accessible after migrations.
9. Verify authorization at the server/database level, not just in the UI.
10. Avoid unnecessary dependencies.

If a schema change is required, create a proper Drizzle migration and inspect its generated SQL before applying it.

Do not delete existing migration files or journal entries to resolve migration conflicts.

**Implement incrementally and verify each phase before proceeding.**

---

# PHASE 2: MODERN MESSAGE BUBBLES

## 2.1 Redesign the Chat Bubble

Modernize the existing message bubble design.

The bubbles should feel like a contemporary messaging application rather than generic rectangular containers.

Consider:

- Improved bubble shapes and border radii.
- Clear distinction between sent and received messages.
- Better typography and message spacing.
- Improved timestamp placement.
- Read/delivered indicators where supported.
- Grouped messages from the same sender.
- Appropriate spacing between consecutive messages.
- Responsive sizing and maximum widths.
- Consistent treatment of images, videos, documents, and voice messages.
- Proper light and dark mode support.

### Sender and recipient distinction

Messages sent by the current user should have a distinct visual treatment from messages received from the other participant.

Do not rely solely on different background colours. Also consider bubble alignment, grouping, and subtle shape variations.

Keep the interface visually clean.

Avoid:
- Excessively rounded bubbles that consume too much space.
- Unnecessary gradients.
- Oversized timestamps.
- Repeating the sender's profile picture beside every consecutive message.
- Excessive padding.
- Inconsistent message widths.

## 2.2 Message Grouping

Group consecutive messages intelligently.

For example:

- Consecutive messages from the same sender should visually belong together.
- The first message in a group can have a different corner treatment.
- The final message can have its own ending shape.
- Display sender information and timestamps only when useful.

Preserve clear separation when the sender changes or when a meaningful time interval has passed.

---

# PHASE 3: TWO CHAT NAVIGATION VARIANTS

Introduce two distinct navigation variants.

These should be separate components or clearly separated component variants, not one oversized component with complicated conditional rendering.

## 3.1 Variant One: Conversation Navigation

This is the navigation displayed at the top of an active conversation.

It should contain:

- The other participant's profile picture.
- Their display name.
- Their online/availability indicator, if existing presence infrastructure supports it.
- Any existing verification indicator.
- A vertical three-dot menu.

The participant information should be clickable where appropriate, following existing profile navigation conventions.

### Three-dot menu

Clicking the vertical three-dot icon should open a well-designed dropdown or popover containing relevant conversation-level actions.

Include:

1. Report conversation/person.
2. Starred messages.
3. Shared listings.
4. Any other useful existing conversation-level options.

#### Report

Reuse the existing reporting infrastructure where available.

Ensure reporting is authenticated, validated, and securely submitted.

#### Starred messages

Open a dedicated view showing messages starred in the current conversation.

Users should be able to:

- View starred messages.
- Identify the sender.
- See the original message timestamp.
- Navigate to the original message in the conversation.
- Unstar a message.

Starred messages must remain associated with the user who starred them.

#### Shared listings

Provide a view of listings shared or discussed within the conversation.

Reuse existing listing-message relationships or message metadata if available.

Do not build a duplicate listing storage system unnecessarily.

When possible, display listing previews that link to the original listing.

## 3.2 Variant Two: Message Interaction Navigation

This is a contextual navigation/action menu associated with an individual message.

It must appear when:

- The user double-clicks a message bubble.
- The user long-presses a message bubble on touch devices.

The menu should contain:

- Reply.
- Delete.
- Edit.
- Star / Unstar.

Only display actions that are valid for that particular message.

### Ownership rules

**For messages sent by the current user:**

- Reply.
- Edit, subject to existing editing rules.
- Delete.
- Star or unstar.

**For messages received from another user:**

- Reply.
- Delete for me.
- Star or unstar.

Do not offer editing or global deletion of another user's message.

### Interaction design

The contextual menu should:

- Appear close to the selected bubble.
- Avoid going outside the viewport.
- Adapt its position depending on available space.
- Have appropriate desktop and mobile positioning.
- Close when the user clicks elsewhere.
- Close after an action is completed.
- Avoid blocking other essential chat interactions.

On mobile, long-press must not unnecessarily trigger browser text selection or interfere with scrolling.

Use suitable pointer/touch handling and clean up all event listeners.

Double-click should not interfere with normal single-click behaviour.

---

# PHASE 4: SWIPE-TO-REPLY INTERACTION

Introduce swipe-right-to-reply functionality on message bubbles.

This should be an actual interactive gesture, not simply an event that triggers after a swipe threshold.

## Expected behaviour

1. The user starts dragging a message bubble to the right.
2. The bubble physically shifts with the user's finger or pointer.
3. A reply icon gradually becomes visible as the drag progresses.
4. The drag has a sensible maximum distance.
5. When the user releases:
   - If the reply threshold is reached, activate reply mode.
   - Otherwise, smoothly return the bubble to its original position.

The movement must follow the user's finger naturally.

### Interaction requirements

- Use smooth, performant movement.
- Avoid unnecessary React re-renders on every pointer movement.
- Use refs or an appropriate gesture implementation where necessary.
- Prevent horizontal swipe gestures from breaking vertical message-list scrolling.
- Ensure the interaction works on touch devices and desktop where appropriate.
- Respect reduced-motion preferences.
- Prevent swipe gestures from conflicting with long-press and double-click interactions.

Use a suitable animation approach already available in the project. Do not introduce a large gesture dependency unless genuinely necessary.

---

# PHASE 5: VOICE MESSAGING SYSTEM

**This is the most sensitive feature in this upgrade. Implement it carefully and independently.**

Voice messages must integrate naturally with the existing messaging infrastructure.

Do not treat voice messages as ordinary file attachments with a generic audio player.

## 5.1 Voice Bubble Component

Create a dedicated reusable `VoiceMessageBubble` component.

The voice bubble should be a custom interactive visual component built from a collection of individual waveform bars or div elements.

It should not be a generic audio-player interface.

### Visual structure

A voice bubble should contain:

- Play/pause control.
- Waveform visualization.
- Voice message duration.
- Playback progress.
- Appropriate sender/recipient styling.

Use two distinct waveform treatments:

- One for messages sent by the current user.
- Another for messages received from the other participant.

Reuse the application's existing colour system.

### Waveform interaction

The waveform must be interactive.

Users should be able to:

- Play and pause the voice message.
- Click a position on the waveform to seek.
- Drag across the waveform to move playback position.
- See the waveform progress update as audio plays.
- See the remaining or elapsed duration.

The waveform should respond to actual audio duration and playback progress.

Do not create decorative bars that have no relationship to playback.

Where practical, generate or derive waveform amplitude data from the recorded audio.

If waveform generation is expensive, process it efficiently and avoid repeatedly decoding the same recording.

### Playback requirements

- Support playback of existing voice messages.
- Handle loading and playback errors.
- Release audio resources when appropriate.
- Avoid creating unnecessary audio instances.
- Preserve playback state correctly when navigating or unmounting components.
- Ensure multiple messages do not play simultaneously unless the existing product explicitly supports that behaviour.

Use the existing media storage infrastructure.

Inspect the current storage implementation before choosing how voice files are uploaded and retrieved.

Do not introduce an unrelated storage provider.

## 5.2 Voice Message Reply

When a user replies to a voice message, the reply preview must clearly identify the original message as audio.

Display:

- A Lucide audio-related icon, such as `Mic` or `AudioLines`.
- The label **"Replied to audio"**.
- Appropriate sender information where useful.

Do not display a generic attachment label or attempt to render the audio as ordinary text.

When clicked, the reply reference should navigate to or highlight the original voice message where possible.

---

# PHASE 6: CHAT INPUT AND VOICE RECORDING

Redesign the message composer to support text and voice messaging naturally.

## 6.1 Dynamic Input Behaviour

The input should intelligently switch its primary action.

### When the input is empty

Display the microphone button as the primary action instead of the ordinary Send button.

### When the input contains text

Display the Send button instead of the microphone as the primary action.

The input must support:

- Multiline text.
- Enter-to-send behaviour where appropriate.
- Shift + Enter for a new line on desktop.
- Existing attachment actions.
- Reply previews.
- Appropriate mobile keyboard behaviour.

Do not break existing attachment, image, document, or text messaging functionality.

## 6.2 Recording Interface

When the microphone button is clicked, transition into a dedicated recording interface.

Do not simply start recording without giving the user clear recording controls.

The recording UI should display:

- Recording indicator.
- Recording duration.
- Animated waveform or live amplitude visualization.
- Pause control.
- Resume control.
- Stop/finish control.
- Cancel/delete recording control.
- Send recording control.

### Recording states

Implement a clear recording state machine.

At minimum:

1. Idle.
2. Recording.
3. Paused.
4. Ready to send.
5. Uploading.
6. Sending.
7. Error.

### Pause and resume

Users should be able to pause and continue recording.

The final recording must preserve all recorded segments in the correct order.

Do not reset the duration or discard earlier audio when recording resumes.

Use appropriate browser recording APIs, such as MediaRecorder, with graceful handling for unsupported browsers and unavailable microphone permissions.

### Cancel recording

Cancel must discard the current unsent recording and release the microphone resources.

It must not accidentally send an incomplete recording.

### Send recording

When the user confirms the recording:

1. Finalize the recording.
2. Generate the appropriate audio file.
3. Upload it through the existing media storage system.
4. Create the voice message using the existing messaging infrastructure.
5. Update the conversation through the established real-time mechanism.
6. Show appropriate sending and failure states.

Handle failed uploads and failed message submissions without losing the user's recording unnecessarily.

### Microphone permissions

Handle:
- Permission denied.
- Microphone unavailable.
- Browser incompatibility.
- Recording interruption.
- Unexpected recording termination.

Provide meaningful feedback rather than leaving the interface stuck.

## 6.3 Component Separation

Do not place all recording logic inside the existing chat input component.

Create dedicated components and utilities, for example:

- `ChatComposer`
- `VoiceRecorder`
- `RecordingControls`
- `RecordingWaveform`
- `VoiceMessageBubble`
- `VoicePlaybackWaveform`
- `useVoiceRecorder`
- Appropriate audio-processing utilities.

These names are suggestions; follow the project's existing naming conventions.

Keep recording logic separate from message submission logic.

---

# PHASE 7: MESSAGE ACTIONS AND BACKEND SUPPORT

All new message actions must have proper persistence.

## 7.1 Reply

Use the existing message relationship structure if available.

Otherwise, introduce a suitable reference to the original message.

The reply relationship must:

- Identify the original message.
- Preserve the original sender information.
- Support text, attachments, and voice messages.
- Handle cases where the original message is deleted or unavailable.
- Avoid duplicating the original message content unnecessarily.

## 7.2 Edit

Only the original sender can edit their message.

Preserve the original message ID.

Maintain an edited indicator.

Follow existing product rules about which message types are editable. Do not allow editing voice or attachment messages unless the existing product explicitly supports it.

Ensure edits propagate correctly through real-time subscriptions.

## 7.3 Star

Allow users to star and unstar messages.

Starred messages must be user-specific.

If one participant stars a message, it must not automatically become starred for the other participant.

Use an existing message-star table if one exists. Otherwise, create an appropriately indexed relational structure with a unique constraint preventing duplicate stars by the same user.

## 7.4 Delete

Deletion is particularly sensitive because messages belong to shared conversations.

Implement strict ownership checks.

Do not use a simplistic global deletion handler for all messages.

### Delete another participant's message

When the current user deletes a message sent by the other participant:

- Do not delete the actual message from the database.
- Do not remove it from the other participant's conversation.
- Hide it only for the current user.
- Persist the deletion state so it stays hidden after refresh.
- Preserve the other participant's message history.

Use a per-user deletion/visibility mechanism, such as `deletedFor`, or a separate message visibility table, depending on the existing schema.

### Delete a message sent by the current user

The application must verify ownership by comparing the authenticated user's ID with the message's `senderId`.

Never trust a sender ID supplied by the client.

Only allow the current sender to perform a global deletion of their own message.

When globally deleted:

- The message must no longer be visible to either participant.
- The deletion must propagate through real-time updates.
- Related reply previews must gracefully show that the original message is unavailable.
- The deletion must not leave broken message references.

Prefer a safe tombstone/soft-deletion mechanism if it provides the required user-visible behaviour and preserves database integrity.

Do not physically delete rows if that would break foreign keys, audit history, or dependent records.

### Authorization

Every delete operation must be validated server-side.

The database/API must independently verify:

- Authenticated user.
- Message existence.
- Conversation participation.
- Message ownership.
- Whether the requested deletion is personal or global.

---

# PHASE 8: INBOX AND CONVERSATION MANAGEMENT

Upgrade the `/inbox` experience.

The inbox should be easier to navigate and manage, especially when users have many conversations.

## 8.1 Inbox Filters

Introduce conversation filters:

- All.
- Read.
- Unread.
- Pinned.

These filters must reflect actual conversation state.

### All

Display all conversations visible to the current user.

### Read

Display conversations that have no unread messages for the current user.

### Unread

Display conversations with unread messages for the current user.

### Pinned

Display conversations the current user has pinned.

Filters should work with existing pagination or infinite loading.

Do not fetch every conversation unnecessarily just to filter on the client.

Use appropriate server-side filtering where practical.

## 8.2 Conversation Card Menu

Each conversation card should have a vertical three-dot menu.

Clicking it should display:

- Pin / Unpin.
- Delete conversation.

### Pinning

Allow users to pin conversations independently.

Requirements:

- Pinning should persist across sessions.
- Pinned conversations should appear in the Pinned filter.
- Pinned conversations should have an appropriate visual indicator.
- Prevent duplicate pin records.
- Unpinning should immediately update the interface.
- Pinning one participant's conversation must not pin it for the other participant.

Reuse existing conversation settings if available.

Inspect the existing `conversation_settings` schema before adding anything new.

## 8.3 Conversation Deletion

This feature requires particular care.

Deleting a conversation must not blindly delete the conversation row or all associated messages.

Conversation deletion is a user-specific action.

The expected behaviour is:

- The current user no longer sees that conversation in their inbox.
- The other participant's conversation remains accessible.
- The current user's own messages are removed from the shared conversation.
- Messages received from the other participant are hidden only from the current user's view.
- The other participant's own messages remain visible to them.

For example:

User A and User B have exchanged 20 messages.

User A deletes the conversation.

Expected result:

**For User A:**
- The conversation disappears from the inbox.
- Incoming messages are no longer visible.
- Their sent messages are no longer visible.

**For User B:**
- The conversation remains accessible.
- User B's own messages remain visible.
- User A's messages are no longer visible.

### Recommended implementation strategy

Investigate the current conversation and message schemas before implementing this.

Use an appropriate combination of:

- Per-user conversation deletion/visibility state.
- Per-user message visibility.
- Sender-authorized global message tombstones.
- Existing conversation settings, where appropriate.

A possible approach is:

1. Record that the current user has hidden/deleted the conversation.
2. Mark incoming messages as hidden for that user.
3. Mark messages authored by that user as globally deleted using a sender-authorized tombstone.
4. Preserve the other participant's own messages.
5. Ensure the conversation is excluded from the current user's inbox.
6. Ensure new messages and real-time updates follow the chosen deletion semantics.

Use transactions or appropriately atomic server-side operations to prevent partially deleted conversations.

**Important:** Do not physically delete the entire conversation or cascade-delete every message.

Do not allow a user to globally delete another participant's messages.

### Reopening conversations

Determine how a previously deleted conversation should behave when the other participant sends a new message.

The application should handle this intentionally rather than leaving the conversation permanently inaccessible or accidentally restoring previously hidden messages.

Preserve the user's deletion state and apply the existing product's intended conversation-reopening rules.

---

# PHASE 9: DESKTOP INBOX LAYOUT

This is an important UI improvement.

Do not wait until a conversation is opened before displaying the split layout.

The desktop inbox should use a persistent two-panel layout from the beginning.

## Desktop layout

### Left panel: Conversation list

Contains:

- Inbox heading.
- Search.
- All / Read / Unread / Pinned filters.
- Conversation cards.
- Pin indicators.
- Unread indicators.
- Conversation three-dot menus.

### Right panel: Conversation workspace

When no conversation is selected, display a proper empty state.

Do not leave the entire right panel blank.

Create a polished empty state containing:

- An appropriate Lucide icon or illustration.
- A short heading, such as "Your conversations".
- A brief description inviting the user to select a conversation.
- Optional helpful context or subtle visual elements.

When a conversation is selected, replace the empty state with the active conversation interface.

### Responsive behaviour

**Desktop:**
- Display both panels immediately.
- Keep the conversation list visible when a conversation is selected.
- Keep the right workspace independently scrollable where appropriate.
- Avoid unnecessary full-page navigation when switching conversations if the existing routing architecture supports a persistent split view.

**Tablet:**
- Use a responsive split layout when sufficient space is available.
- Otherwise, use a conversation-list-first layout.

**Mobile:**
- Show the conversation list as the initial view.
- Opening a conversation should transition into the conversation screen.
- Provide a clear back control to return to the inbox.
- Preserve the current conversation state where possible.

Do not force the desktop split layout onto narrow screens.

---

# PHASE 10: REAL-TIME AND STATE MANAGEMENT

All new features must integrate with the existing real-time messaging system.

Investigate existing subscriptions before making changes.

Ensure real-time updates work for:

- New text messages.
- New voice messages.
- Edited messages.
- Deleted messages.
- Starred message changes where relevant.
- Read/unread status.
- Conversation pinning.
- Conversation deletion/visibility.
- New conversation activity.

Avoid duplicate subscriptions and unnecessary re-fetching.

Ensure optimistic updates are correctly rolled back when an operation fails.

Do not let stale React Query caches, if used, cause deleted or hidden conversations to reappear.

Maintain correct unread counts after message deletion and conversation filtering.

---

# PHASE 11: COMPONENT ARCHITECTURE

Do not jam all these features into the existing chat component.

The application should remain modular and maintainable.

Organize components according to their responsibilities.

Suggested architecture:

## Conversation components

- `InboxLayout`
- `ConversationList`
- `ConversationCard`
- `ConversationCardMenu`
- `ConversationFilters`
- `ConversationHeader`
- `ConversationMenu`
- `ConversationEmptyState`

## Message components

- `MessageList`
- `MessageBubble`
- `MessageGroup`
- `MessageContextMenu`
- `MessageReplyPreview`
- `MessageAttachment`
- `VoiceMessageBubble`

## Composer components

- `ChatComposer`
- `ChatInput`
- `VoiceRecorder`
- `RecordingControls`
- `RecordingWaveform`
- `AttachmentPicker`

## Hooks and utilities

- `useVoiceRecorder`
- `useVoicePlayback`
- `useMessageGestures`
- `useConversationFilters`
- `useConversationActions`
- `useMessageActions`
- Appropriate audio and message utilities.

This is a suggested structure, not an instruction to create unnecessary files.

Reuse existing project conventions and avoid duplicating existing components.

Keep components focused and reusable.

---

# PHASE 12: VISUAL DESIGN AND INTERACTION QUALITY

The upgraded chat must feel like a modern, cohesive messaging product.

Prioritize:

- Clean visual hierarchy.
- Consistent typography.
- Comfortable spacing.
- Smooth transitions.
- Responsive layouts.
- Clear message ownership.
- Thoughtful empty states.
- Intuitive action menus.
- Proper loading and error states.
- Good light and dark mode support.

Use the application's existing fonts, colour palette, buttons, icon conventions, and design tokens.

Use Lucide icons consistently.

Avoid:
- Oversized message bubbles.
- Excessive blur.
- Repetitive action buttons.
- Unnecessary gradients.
- Excessive animations.
- Crowded menus.
- Overloaded conversation cards.
- Large blank spaces.
- Inconsistent icon sizes.
- Introducing multiple visual patterns for the same interaction.

Animations should communicate interaction, not distract from messaging.

---

# PHASE 13: DATABASE AND MIGRATION REQUIREMENTS

Before creating or modifying schemas, inspect the current Drizzle schema and migration history.

Potential database requirements include:

- Voice message metadata or appropriate message type support.
- Audio file storage references.
- Message reply relationships.
- Message star persistence.
- Per-user message visibility/deletion.
- Per-user conversation visibility/deletion.
- Conversation pinning.
- Edited message metadata.
- Appropriate conversation and message indexes.

Do not automatically create all these tables or columns.

First determine what already exists.

Reuse existing structures where possible.

### Migration safety

- Never truncate existing message tables.
- Preserve historical records.
- Use nullable/defaulted additions where backward compatibility requires them.
- Add foreign keys with appropriate deletion behaviour.
- Add unique constraints where appropriate.
- Index frequently queried fields.
- Review RLS policies for all new operations.
- Ensure one participant cannot modify another participant's personal settings.
- Ensure a user cannot globally delete messages they did not send.

For complex conversation deletion, use a transaction or secure database function where appropriate.

Never rely on a sequence of uncontrolled client-side requests to perform a logically atomic deletion.

---

# PHASE 14: TESTING AND VERIFICATION

Test the application as two separate users.

Use two authenticated accounts to verify that shared conversation behaviour is correct.

## Message interaction tests

- Send and receive text messages.
- Reply to messages.
- Double-click a message.
- Long-press a message.
- Swipe right to reply.
- Edit an owned message.
- Attempt to edit another user's message.
- Star and unstar messages.
- Delete received messages.
- Delete owned messages.
- Verify deletion permissions.

## Voice tests

- Record a voice message.
- Pause recording.
- Resume recording.
- Verify duration continues correctly.
- Cancel recording.
- Send a recording.
- Receive and play the recording from another account.
- Pause and resume playback.
- Seek by clicking the waveform.
- Seek by dragging the waveform.
- Reply to a voice message.
- Verify the "Replied to audio" preview.
- Test microphone permission denial.
- Test failed uploads.
- Test mobile browser behaviour.

## Inbox tests

- Filter all conversations.
- Filter read conversations.
- Filter unread conversations.
- Filter pinned conversations.
- Pin and unpin conversations.
- Delete a conversation for one user.
- Verify the other participant's conversation remains.
- Verify the sender's messages disappear for the other participant after the specified deletion operation.
- Verify incoming messages remain hidden for the deleting user.
- Refresh and confirm the deletion state persists.
- Test new messages after conversation deletion.

## Responsive tests

Test:

- Small mobile.
- Large mobile.
- Tablet.
- Laptop.
- Large desktop.

Confirm the desktop split layout is visible immediately, even when no conversation is selected.

## Final checks

- Run TypeScript checks.
- Run linting.
- Run the production build.
- Verify migrations.
- Verify RLS policies.
- Verify real-time subscriptions.
- Check for memory leaks in audio recording and playback.
- Check for horizontal overflow.
- Check browser console errors.

---

# IMPLEMENTATION ORDER

Implement this upgrade in the following order to reduce risk.

**Phase A — Investigation and architecture**
- Audit existing chat implementation.
- Identify existing functionality and schema.
- Prepare a safe migration plan.

**Phase B — Core message experience**
- Modern message bubbles.
- Conversation navigation variant one.
- Message interaction navigation variant two.
- Swipe-to-reply.
- Reply previews.
- Edit and star actions.

**Phase C — Voice messaging**
- Recording infrastructure.
- Recording controls.
- Upload integration.
- Voice message persistence.
- Voice bubble playback and waveform interaction.
- Audio reply previews.

**Phase D — Inbox management**
- Conversation filters.
- Conversation pinning.
- Conversation card menus.
- Safe per-user conversation deletion.
- Desktop split layout and empty state.

**Phase E — Integration and testing**
- Real-time updates.
- Cache synchronization.
- Authorization.
- Database migration verification.
- Responsive testing.
- Production build.

Do not move forward blindly when a previous phase introduces unresolved database, authorization, or messaging issues.

---

# FINAL NON-NEGOTIABLE RULES

1. Do not break existing messaging functionality.
2. Do not destroy historical conversations.
3. Do not globally delete messages belonging to another participant.
4. Verify sender ownership before allowing global message deletion.
5. Make conversation deletion user-specific.
6. Keep voice recording, waveform rendering, and playback logic modular.
7. Ensure gestures are genuine, responsive interactions.
8. Ensure every new action has a functional backend implementation.
9. Do not use placeholder buttons or fake waveform visualizations.
10. Do not introduce duplicate schemas or unnecessary dependencies.
11. Preserve existing authentication, real-time infrastructure, and storage integrations.
12. Do not compromise security for optimistic UI behaviour.
13. Keep the interface responsive and visually consistent.
14. Do not put the entire upgrade inside one massive component.
15. Do not make destructive database changes without inspecting the migration and its consequences.

**The expected outcome is a complete, polished First Estates messaging experience with modern chat bubbles, two navigation variants, interactive gestures, voice messaging, message management, conversation filtering, pinning, and safe per-user deletion.**

Prioritize data integrity, authorization, backward compatibility, and maintainability just as much as the visual experience.
:::A few important architectural decisions
There are three areas I particularly want the coding agent to get right.
1. Conversation deletion must be different from message deletion
Your intended behaviour is asymmetric. This is important because a conversation is shared, but the decision to hide it belongs to an individual user.

A useful way to understand it:

Before deletion

(User A) (User B)

Hello, how are you?

I'm fine, thank you!
After User A deletes the conversation

User A

Conversation hidden

Both messages are no longer visible.

User B

Conversation remains

User B's own message remains visible.

I would implement this using per-user conversation visibility and message deletion markers rather than deleting conversation records. This protects foreign keys and makes recovery and auditing safer.
2. Voice messages need a real recording pipeline
The waveform and the audio are two separate things:
- Audio is the actual recorded media.
- Waveform is the visual representation of that media.
- Playback progress determines which waveform bars appear played.
- Dragging the waveform changes the audio's current playback position.
This separation is what will make the voice component feel like a proper messaging feature rather than a decorative audio attachment.
