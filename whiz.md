# FIRST ESTATES — MASTER SYSTEM PROMPT
## Product Evolution, Housing Expansion, Social Features, Backend Improvements & 2026 UI/UX Modernization

You are working on the existing First Estates application, a real-estate and accommodation discovery platform originally focused heavily on student housing.

Your task is to significantly improve and evolve the application into a modern, reliable, socially connected housing platform that serves both students and general residential property seekers.

This is an implementation task, not merely a proposal or architectural recommendation. Inspect the existing codebase, understand how its systems work, and implement the requested improvements across the frontend, backend, database, authentication, and user experience.

---

# PART 1: NON-NEGOTIABLE DEVELOPMENT PRINCIPLES

## 1.1 Preserve existing functionality

The existing codebase is fragile in certain areas. Consequently, every change must be deliberate.

Before modifying anything:

1. Inspect the existing project structure.
2. Understand the current database schema and relationships.
3. Inspect existing authentication and authorization.
4. Understand how listings are created, edited, fetched, displayed, and filtered.
5. Inspect existing agent and user profile implementations.
6. Understand the existing chat, appointment, wishlist, roommate, and co-rent systems.
7. Inspect the notification architecture and existing integrations.
8. Understand the existing component library, particularly shadcn/ui.
9. Inspect the existing responsive design and dark-mode implementation.
10. Identify existing utilities and reusable functions before creating alternatives.

Do not assume that a feature does not exist simply because it is not immediately visible in the interface.

Reuse existing functionality wherever possible.

**Critical: Do not unnecessarily rewrite working systems.**

Preserve existing API contracts, database relationships, authentication behavior, and application conventions unless changing them is necessary for the requested functionality.

## 1.2 Backend and frontend must both be implemented

Do not deliver UI-only implementations.

When introducing a feature, implement its complete lifecycle:

- Database schema and migrations.
- Backend operations and business logic.
- Server-side validation.
- Authentication and authorization.
- API endpoints or server actions following existing conventions.
- Frontend interfaces.
- Loading, empty, success, and error states.
- Relevant notifications.
- Appropriate responsive behavior.

Buttons, settings, filters, tabs, and modal actions must actually work.

Do not introduce decorative controls that have no functional implementation.

## 1.3 Database safety

Schema changes are allowed and encouraged when they are genuinely necessary.

However:

- Use safe, non-destructive migrations.
- Preserve existing records.
- Do not truncate tables to resolve migration conflicts.
- Do not casually delete or recreate existing enums, columns, or tables.
- Use nullable fields or safe defaults when migrating existing records.
- Preserve existing foreign-key relationships.
- Add appropriate indexes, unique constraints, and database checks.
- Handle concurrent operations with transactions or atomic database operations where necessary.
- Never solve migration problems by deleting migration history or modifying already-applied migrations without understanding their consequences.

When adding a new relationship, inspect the existing data model and determine how existing records will be migrated.

## 1.4 Modular implementation

Keep the codebase maintainable.

- Put reusable business logic in utilities or service modules.
- Keep database operations out of presentation components.
- Avoid excessively large components and page files.
- Reuse existing hooks and query utilities.
- Use appropriate TypeScript types.
- Avoid unnecessary dependencies.
- Follow existing naming conventions.
- Keep server-only logic and credentials out of client-side bundles.

When a feature introduces substantial logic, organize it into separate files rather than bloating existing components.

## 1.5 Implementation discipline

Do not stop after inspecting the codebase or presenting a plan.

Inspect, plan, implement, migrate, test, and verify.

If an external integration requires credentials that are unavailable, implement the appropriate integration structure, environment-variable validation, and graceful fallback. Clearly identify the configuration required rather than pretending the integration is operational.

---

# PART 2: PRODUCT DIRECTION AND HOUSING CATEGORY EXPANSION

## 2.1 First Estates product direction

First Estates should organize its experience around three concepts:

- **People:** Discover agents, save trusted agents, view their listings, and communicate with them.
- **Places:** Discover properties and rooms using location, price, property type, and availability.
- **Needs:** Save searches, submit housing requests, find suitable housemates, and arrange property tours.

Students must remain a first-class audience.

However, the platform must also support people searching for general residential accommodation without forcing them to select a school.

Keep one application, one account system, one agent system, one listing system, and one inbox.

Do not create separate applications or authentication systems for students and residential users.

## 2.2 Standardized listing categories

Introduce or standardize the listing category around these values:

- `student`
- `residential`

Use these values consistently throughout the database, backend, validation, filtering, and frontend.

The UI should display:

- Student listings as **Student** or **Students**, depending on context.
- Residential listings as **Residential**.

Do not continue introducing the inconsistent values `for_student` and `for_resident`.

Inspect existing records and migrate old category values safely.

### Existing listing compatibility

Existing listings must remain accessible.

Where existing listings are known to belong to the original student accommodation system, migrate them to `student`.

Where genuinely unclassified legacy records cannot safely be inferred, preserve their compatibility and ensure they remain visible in the All feed.

Do not silently misclassify residential listings as student listings.

New listings must have an explicit valid category.

## 2.3 Category-specific functionality

Shared listing fields should include:

- Location.
- Price.
- Property type.
- Bedrooms.
- Bathrooms.
- Availability.
- Agent.
- Property address.
- Description.
- Images and other existing media.

Student-specific functionality includes:

- School association.
- School-focused browsing.
- School-to-property distance.
- Student-oriented recommendations.
- Roommate discovery.
- Co-rent requests.

Residential functionality includes:

- City and neighborhood discovery.
- General residential property types.
- Residential-specific filtering.
- No compulsory school association.

**Important business rule:** Only listings categorized as `student` can be used to create co-rent requests.

Enforce this restriction in the backend, not just by hiding the button.

Inspect existing roommate and co-rent functionality before changing it. Preserve its existing working behavior.

## 2.4 Listing creation and editing

Update existing agent listing forms to support the new categories.

When an agent selects Student:

- Display relevant school-selection fields.
- Apply student-specific validation.
- Preserve existing student accommodation fields.
- Allow the listing to participate in applicable student housing features.

When an agent selects Residential:

- Do not require a school.
- Display appropriate residential property fields.
- Use location-based validation and search.

Ensure category-specific fields are validated correctly on both the client and server.

Update listing editing so an agent can manage the appropriate fields without accidentally losing existing data.

---

# PART 3: HOMEPAGE FEED, SEARCH AND FILTERING

## 3.1 Homepage feed tabs

Redesign the homepage feed to include three primary tabs:

1. **All**
2. **Students**
3. **Residential**

Their behavior must be:

### All
Display all eligible listings, including existing legacy listings without a category.

### Students
Display listings categorized as `student`, including compatible legacy student records where appropriate.

### Residential
Display listings categorized as `residential`.

The tabs must use the actual listing data and not simply change the selected tab visually.

## 3.2 Default tab behavior

When a student is authenticated, default the feed to Students.

For other users, use the appropriate general default, normally All.

Allow users to configure their preferred default tab through Settings.

Persist the preference across devices using the user's settings stored in the database.

Ensure the tab selection and active filters remain consistent.

## 3.3 Filter behavior

Redesign the existing filter interface.

We do not want an ordinary, unhelpful dropdown for the main filtering experience.

Use a proper filter panel or modal.

### Mobile and tablet

The filter panel should:

- Slide upward from the bottom.
- Occupy most, but not all, of the screen height.
- Leave enough of the underlying page visible to establish context.
- Have a clear close action.
- Support scrolling when its contents exceed available height.
- Have an appropriate backdrop.

### Desktop and larger screens

The filter panel should:

- Slide in from the left.
- Occupy a sensible portion of the screen.
- Not cover the entire application.
- Preserve access to the underlying page context.

This interaction should be applied to important filtering interfaces, not indiscriminately to every modal.

Do not apply this drawer treatment to simple confirmation dialogs, logout prompts, listing information dialogs, or unrelated informational modals.

Use the existing shadcn/ui dialog, sheet, and drawer conventions where appropriate.

Use a proper filter icon, such as Lucide's `SlidersHorizontal`, rather than a chevron.

## 3.4 Category-aware filtering

The filter system must understand the difference between Student and Residential listings.

Student filters should include relevant options such as:

- School.
- Distance from school, where supported.
- Location.
- Price range.
- Property type.
- Availability.
- Bedrooms and other existing accommodation criteria.

Residential filters should prioritize:

- City.
- Neighborhood.
- Property type.
- Price.
- Rent or sale intent, where supported.
- Bedrooms.
- Bathrooms.
- Availability.

Do not show irrelevant school filters for residential listings.

Filters must work correctly alongside the homepage tabs.

For example, when a user is on Residential and applies a price filter, the results must remain Residential listings matching that price.

The same filtering behavior and improvements must be reflected in School Focus and other relevant browsing experiences.

Do not create different, inconsistent filter implementations for different parts of the application.

## 3.5 Empty search results

Modernize the no-listings-found interface.

It should:

- Explain that no matching properties were found.
- Offer a clear way to reset filters.
- Suggest adjusting the search criteria.
- Use the current category and search context.
- Avoid overlapping text, buttons, or surrounding elements.
- Work properly on mobile and desktop.

Do not use generic empty states that ignore the user's active filters.

---

# PART 4: SCHOOL-TO-PROPERTY DISTANCE CALCULATION

Introduce a reliable feature that calculates the geographical distance between a school and an associated student property.

The distance must appear on the **single listing detail page**, not indiscriminately on every listing card.

Only display it for a Student listing with an associated school.

## 4.1 School schema

Inspect the existing school schema.

Add a field such as `schoolAddress`, following the current naming conventions.

The field must store the school's full physical address.

Requirements:

- Preserve existing school records.
- Use a safe database migration.
- Make the address required for newly created schools unless existing application conventions justify otherwise.
- Allow older school records without addresses to remain valid.
- Add suitable validation.

## 4.2 School creation and editing

Update the school management interface.

The school creation form must include:

- School name.
- School shortname, if already part of the schema.
- School address.
- Other existing fields.

Update the school editing functionality.

If school editing does not exist, implement it using the existing admin interface conventions.

Use existing form validation, toast notifications, dialogs, and loading states.

## 4.3 School matching

An important existing limitation is that listing school names are not directly connected to the school schema through a foreign key.

Do not introduce a new relationship or alter the existing listing structure without understanding the consequences.

For the initial implementation, use a reusable matching utility.

It must:

1. Accept the school name stored on a listing.
2. Accept the available school records.
3. Normalize names using lowercase conversion and whitespace normalization.
4. Inspect the existing school naming and shortname conventions.
5. Match the listing school name to the appropriate school shortname.
6. Resolve the actual school record.
7. Reject ambiguous or unreliable matches.

Do not assume that lowercase comparison alone is sufficient.

Do not arbitrarily match schools with similar names.

If a reliable match cannot be established, return no match.

## 4.4 Geocoding and distance calculation

Once a school has been reliably matched:

- Retrieve its saved physical address.
- Retrieve the property's address.
- Geocode both addresses server-side.
- Obtain latitude and longitude.
- Calculate the straight-line distance using the Haversine formula.
- Return the result in kilometres.

Keep this functionality modular.

Suggested utility organization:

- `lib/utils/school-matching.ts`
- `lib/utils/geocoding.ts`
- `lib/utils/distance.ts`

Follow the existing project structure if equivalent utility conventions already exist.

Never expose private geocoding API keys to the client.

## 4.5 Caching and persistence

Avoid repeatedly geocoding the same addresses.

Inspect the existing schema and determine the best way to store:

- Geocoded school coordinates.
- Geocoded property coordinates.
- Calculated distance.
- The address versions or timestamps used for the calculation.

A stored distance must not remain valid after an address changes.

Recalculate or invalidate the distance when:

- The school address changes.
- The property address changes.
- The listing's associated school changes.

Use caching and appropriate background or server-side processing where suitable.

Geocoding failure must never prevent normal listing creation or editing.

## 4.6 Single listing display

Example:

`University of Lagos · 3.8 km away`

Only display a distance when a valid calculation exists.

Do not display the distance when:

- The listing is Residential.
- The listing has no school.
- The school cannot be matched.
- The school has no address.
- The property has no address.
- Geocoding fails.
- The distance has not been calculated.
- The stored result is stale.

Never display `0 km`, `NaN`, `undefined`, or fabricated fallback values.

---

# PART 5: SOCIAL FEATURES AND COMMUNITY

First Estates should become more socially useful without becoming an uncontrolled social network.

Extend existing features instead of introducing unnecessary parallel systems.

## 5.1 Agent wishlist

Introduce a dedicated saved-agent feature.

This must remain separate from the existing property wishlist.

A user can save an agent because they trust or like that agent, even if they are not currently interested in a particular listing.

### Functionality

- Add a save/unsave action to agent profiles.
- Add a save/unsave action to agent cards where appropriate.
- Prevent duplicate saves.
- Allow users to remove saved agents.
- Create a Saved Agents section under the user's saved items.
- Display saved agents with their profile image, name, verification status, and active listing count.
- Allow users to open the agent profile.
- Allow users to browse that agent's active listings.
- Allow users to initiate a chat subject to existing messaging rules.

Use a dedicated database relationship or table, following the existing wishlist implementation.

Do not overload the property wishlist schema.

Later, the system should be capable of supporting optional notifications when saved agents publish new listings or update availability.

Such notifications must be opt-in.

## 5.2 Improve discoverability of existing social features

Make existing features easier to find.

- Improve listing comments and their presentation.
- Display comment authors and dates.
- Provide an appropriate route to contact the listing agent.
- Preserve comment reporting and moderation.
- Surface roommate and co-rent requests in relevant student searches.
- Add appropriate visibility and contact controls.
- Introduce saved searches where suitable.
- Use the inbox as the central place for listing, agent, and roommate conversations.

Conversation previews should provide enough context to identify what the conversation concerns.

Do not introduce public direct messaging that bypasses the existing messaging system.

Avoid unnecessary public follower counts.

## 5.3 Community publishing and discussions

Introduce a community publishing feature.

Users should be able to create posts similar to short blog articles or discussion topics.

The purpose is to allow people within First Estates to discuss housing, accommodation experiences, property-related topics, student living, and other relevant subjects.

This is an extension of the existing community experience, not a completely separate social network.

### Community functionality

Implement an appropriate community post system supporting:

- Post title.
- Post content.
- Author.
- Creation and update dates.
- Optional category or topic.
- Cover image where appropriate.
- Comments and replies.
- Relevant engagement features.
- Post detail pages.
- Author profile links.
- Reporting and moderation.

Use the existing media handling architecture.

Do not introduce unnecessary media-storage systems.

### Community experience

Create a modern publishing and discussion interface.

The community should support browsing posts, opening discussions, and creating posts.

Use appropriate layouts for:

- Community homepage.
- Post cards.
- Individual discussion pages.
- Post creation and editing.
- Comment sections.
- User-authored content.

### Safety and moderation

Before making user-generated content widely visible, provide:

- Reporting.
- Blocking where appropriate.
- Content moderation controls.
- Authorization for editing and deleting posts.
- Appropriate visibility rules.
- Protection against spam and abuse.

Do not expose private user information in public community content.

---

# PART 6: APPOINTMENT AND PROPERTY TOUR SYSTEM

Refurbish the existing appointment feature.

The current appointment experience needs to become a useful property-tour booking system rather than a loosely placed action on the listing page.

Inspect the existing appointment schema, booking logic, agent dashboard, and notification system before modifying them.

Preserve existing appointment records and relationships.

## 6.1 Listing page tour booking

Users must be able to request a tour directly from a listing.

When they select Book a Tour:

1. Open a properly designed confirmation modal.
2. Display the relevant listing information.
3. Collect or confirm the user's name.
4. Display the agent or property context.
5. Allow the user to confirm their intention to book a tour.
6. Submit the appointment request to the backend.
7. Display appropriate success or error feedback.
8. Make the appointment available in the user's appointments section.

Do not automatically create a booking simply because the user opens the modal.

Require explicit confirmation.

Do not fabricate a confirmed appointment when the actual workflow is only a request awaiting agent response.

## 6.2 Appointment lifecycle

Inspect the existing appointment model and improve it to support a clear lifecycle.

Use appropriate statuses based on the existing architecture, such as:

- Pending.
- Accepted.
- Declined.
- Rescheduled.
- Cancelled.
- Completed.

If scheduling date and time are supported, provide appropriate selection and validation.

If the existing system requires the agent to respond with an available time, preserve that workflow rather than inventing an incompatible one.

Prevent unauthorized status changes.

Users must be able to see their appointment requests and their current status.

Agents must be able to manage requests associated with their own listings.

## 6.3 Agent appointment dashboard

Significantly improve the appointment section of the agent dashboard.

It must become operationally useful.

Include:

- Pending requests.
- Accepted appointments.
- Upcoming tours.
- Declined and cancelled requests where relevant.
- Completed appointments.
- Relevant listing details.
- User information appropriate for the booking.
- Request dates.
- Appointment dates and times.
- Status indicators.
- Clear actions for accepting, declining, rescheduling, or completing requests.

Add appropriate filters and useful summary information.

Ensure actions update the backend and reflect immediately in the interface.

Avoid unnecessary dashboard complexity.

---

# PART 7: SINGLE LISTING PAGE REDESIGN

The single listing page is one of the most important parts of First Estates.

Improve its layout, usability, and visual consistency.

## 7.1 Dark mode

The current dark-mode listing sections should be darker.

Adjust their backgrounds so they blend more naturally with the application's dark background.

Avoid excessive contrast between individual sections.

Use subtle borders and restrained surface differentiation.

Do not make every section look like a separate floating card.

Preserve readable text and appropriate contrast.

## 7.2 Desktop listing navigation

On larger screens, introduce a useful single-listing navigation or action bar.

It should provide convenient access to important listing actions, including:

- Contact or phone agent.
- Chat with agent.
- Book a tour.

Use an appropriate sticky or contextual layout where it improves usability.

Do not allow the navigation to obstruct listing content.

## 7.3 Mobile listing action bar

On mobile, create a persistent bottom action bar for important listing actions.

It should include:

- Call agent.
- Chat with agent.
- Book a tour.

Chat should receive suitable visual prominence.

The bar must:

- Respect mobile safe areas.
- Avoid covering important listing content.
- Use the appropriate fixed positioning.
- Work with existing bottom navigation if one exists.
- Avoid duplicating the same actions unnecessarily.
- Remain responsive across supported mobile widths.

The Book a Tour action must open the appointment confirmation flow described in Part 6.

Do not place these actions recklessly inside unrelated listing sections.

## 7.4 Listing cards

Improve the listing cards while preserving their existing data and functionality.

The school-name position must be category-aware.

For Student listings, display the appropriate school name.

For Residential listings, do not display a school name. Display a simple `Residential` label instead.

Improve card spacing, typography, information hierarchy, image presentation, and responsiveness.

Do not introduce excessive shadows, unnecessary hover animations, or oversized rounded corners.

Ensure card layouts do not overflow or overlap.

---

# PART 8: AGENT PROFILE REDESIGN

Refurbish the public agent profile.

The current top-to-bottom presentation should become a more polished, social-profile-style experience.

## 8.1 Profile layout

Organize the profile around:

- Agent identity.
- Profile image.
- Agent name.
- Verification status.
- Business or professional information where available.
- Contact options.
- Active listings.
- Relevant profile information.
- Existing agent-related content and functionality.

Create a better visual hierarchy.

Do not simply stack every element vertically.

## 8.2 Contact actions

The phone action should be represented primarily by an appropriate phone icon.

Chat should be the more prominent action.

Place the Chat and Phone actions side by side where the layout permits.

Preserve existing contact functionality.

## 8.3 Report functionality

Remove the prominent Report button from the main profile interface.

Instead:

1. Add a three-dots options menu.
2. Include Report in that menu.
3. Open a properly designed reporting modal when selected.
4. Preserve the existing report submission logic and backend functionality.
5. Maintain the existing validation and notification behavior.

Do not remove reporting simply because its placement changes.

## 8.4 Saved-agent integration

Integrate the agent wishlist into the profile.

Provide an obvious save/unsave action.

The interface must reflect the authenticated user's actual saved-agent status.

Prevent unauthorized users from saving agents through direct API requests.

---

# PART 9: AGENT REFERRAL AND PROGRESSIVE BONUS SYSTEM

Implement a complete referral and bonus system.

Before implementation, inspect the user schema, authentication flow, signup callbacks, agent profile, listing pricing, existing bonuses, and migration conventions.

Preserve existing authentication and profile functionality.

## 9.1 User schema

Extend the existing user or profile model appropriately.

Required referral concepts:

- `referralId`: A unique identifier belonging to the referring agent.
- `referredBy`: The identifier of the agent who referred the user.
- `hasReferred`: Boolean, defaulting to false.
- `bonusType`: The active bonus type, using `refer` for this feature.
- `bonusDuration`: The total earned referral bonus duration.

Add any necessary supporting fields, such as:

- Bonus activation timestamp.
- Bonus expiry timestamp.
- Referral count, if safely maintained.
- Referral completion status or equivalent persisted history.

Do not duplicate existing user records or overwrite profile data.

Use appropriate foreign keys, constraints, indexes, and transactions.

Keep the distinction clear:

- `referralId` identifies the agent who can refer others.
- `referredBy` identifies the agent who referred a particular user.

## 9.2 Referral button and modal

Add a Refer button to the existing agent profile or appropriate agent dashboard interface.

Only show it when the agent has fewer than three successful referrals.

On click, open a modal using the existing dialog conventions.

The modal must show:

- Referral program explanation.
- Successful referral count.
- Remaining referrals.
- Copy Referral Link action.
- Success and error feedback.
- Close action.

Maximum referrals: three.

Calculate counts from reliable persisted records.

Never hardcode the remaining referral count.

## 9.3 Referral link

Use the existing signup route and configured application URL.

Example:

`https://your-domain.com/signup?referredBy={referralId}`

Use the actual production URL configuration.

Generate and encode the referral identifier safely.

Only copy the link when the user explicitly selects the copy action.

Generating or copying a link must not award a bonus.

## 9.4 Signup attribution

Preserve referral attribution throughout the existing signup process.

Support:

- Normal email signup.
- Email verification.
- OAuth signup.
- OAuth callbacks.
- Profile creation.
- Account confirmation.

Validate the referral identifier server-side.

Use a secure persistence mechanism so referral attribution is not lost during redirects.

Do not rely exclusively on temporary client-side state.

Rules:

- No self-referrals.
- No invalid referrers.
- One referrer per newly registered user.
- One successful referral count per user.
- No duplicate rewards from repeated callbacks.
- No rewards for incomplete or failed signup.
- Maximum three successful referrals per agent.

## 9.5 Atomic referral enforcement

The three-referral limit must be enforced on the backend or database.

Consider concurrent signups.

For example, if an agent has two successful referrals and two users complete signup simultaneously, the database must not award both users and exceed the limit.

Use transactions, row locking, unique constraints, atomic updates, or an equivalent reliable mechanism.

Do not rely on the interface to enforce the limit.

Preserve existing valid referral history.

## 9.6 Progressive bonus duration

Use the following progression:

| Successful referrals | Total bonus duration |
|---|---|
| 1 | 1 month |
| 2 | 2 months |
| 3 | 3 months |

The bonus type must be `refer`.

The discount rate must be 12%.

The duration is cumulative, not three independent simultaneous discounts.

A second successful referral increases the total earned duration to two months.

A third increases it to three months.

Repeated callbacks must never extend the bonus.

Track actual activation and expiry dates.

Use calendar-month calculations where possible, including correct month-end handling.

Do not accidentally shorten an existing active bonus.

## 9.7 Dynamic listing discount

When an agent has an active referral bonus, show the applicable discount on their eligible listings.

The discount is 12%.

Example:

Original price: ₦100,000.

Discounted price: ₦88,000.

Display:

- Original price with strikethrough.
- Discounted price.
- Small `12% Referral Discount` badge.
- Remaining validity where appropriate.

Calculate dynamically:

`discountedPrice = originalPrice × 0.88`

Use existing currency-formatting and pricing utilities.

Inspect existing listing discounts before introducing this behavior.

Do not accidentally stack discounts or override existing promotions.

## 9.8 Centralized bonus eligibility

Create or reuse a centralized bonus-eligibility service.

Check:

- Bonus type.
- Activation.
- Expiry.
- Current date.
- Applicable duration.
- Listing eligibility.
- Existing discount interactions.

Do not use `hasReferred` alone to determine whether a discount is active.

An expired bonus must not:

- Display its badge.
- Display a referral-specific crossed-out price.
- Affect the calculated listing price.
- Affect a payment or booking transaction.

Enforce pricing eligibility server-side anywhere the discounted amount has financial consequences.

Never trust client-provided discount amounts or bonus status.

---

# PART 10: USER SETTINGS AND PERSISTENT PREFERENCES

Refurbish the Settings experience into a proper modern, social-platform-style settings page.

Settings must be functional, not decorative.

## 10.1 Settings schema

Introduce a persistent user settings object or an appropriately structured settings table.

Follow existing database conventions.

A JSONB settings object may be appropriate if it fits the existing architecture.

Support preferences such as:

- Theme.
- Default homepage tab.
- Location-based feed preferences.
- Student-specific preferences.
- Notification preferences.
- Push notification preferences.
- Other useful application preferences.

Provide safe defaults for existing users.

Validate settings on the server and prevent unauthorized modification.

Settings must persist across devices and sessions.

Do not rely solely on local storage.

## 10.2 Theme settings

Provide a proper theme preference:

- Light.
- Dark.
- System, if supported.

Remove the current automatic dark-to-light switching behavior from the navigation bar.

Theme switching must follow the user's actual preference.

Persist the selection.

Ensure theme changes apply consistently throughout the application.

Do not introduce conflicting theme states between the navbar, settings, and page components.

## 10.3 Student-specific preferences

Provide student-oriented preferences where relevant.

For example:

- Default feed tab.
- Preferred school.
- Student-focused browsing preferences.
- Other useful school-related settings already supported by the application.

Do not display irrelevant student-specific settings to users who are not students.

## 10.4 Location-based feed

Introduce a functional location-based feed preference.

Inspect the existing location implementation before choosing the data structure.

Allow users to configure whether location should influence their property discovery experience.

Handle missing location permissions gracefully.

Do not make precise location mandatory for normal application usage.

## 10.5 Settings interface

Organize settings into clear sections, such as:

- General.
- Appearance.
- Feed and discovery.
- Student preferences.
- Notifications.
- Privacy and account preferences.

Use an appropriate responsive navigation layout.

Make settings accessible and easy to understand.

---

# PART 11: PUSH NOTIFICATIONS USING FIREBASE

Introduce Firebase-based push notifications.

First inspect the existing notification system and determine how to integrate Firebase without replacing existing in-app notifications unnecessarily.

Use Firebase Cloud Messaging where appropriate.

## 11.1 Notification events

Support relevant events, including:

### General users

- Someone responds to an appointment request.
- Someone replies to a chat.
- Someone comments on relevant content.
- Someone replies to a comment.
- Someone interacts with their community content.
- Other relevant user-facing events.

### Agents

- Someone requests a property tour.
- A tour is accepted, declined, or rescheduled.
- Someone sends a message.
- Someone comments on an agent's listing.
- Someone rates or reviews the agent, if ratings are supported.
- A listing is about to expire.
- Other important agent-related events.

Use existing event and notification systems where possible.

Avoid sending duplicate notifications for the same event.

## 11.2 Device registration

Implement secure push-token registration.

Support:

- Token creation.
- Token updates.
- Token removal.
- Multiple devices per user where appropriate.
- Expired or invalid token cleanup.
- User-specific notification preferences.

Store device tokens securely.

Do not expose Firebase server credentials to the client.

Use the existing database and backend conventions.

## 11.3 Push notification onboarding modal

On a new login or signup, display an appropriate modal explaining why push notifications are useful.

The content should differ based on the user's role.

For agents, emphasize:

- New tour requests.
- Customer messages.
- Listing-related activity.
- Important listing reminders.

For students and residential users, emphasize:

- Appointment updates.
- Agent replies.
- Messages.
- Relevant property activity.

Provide two actions:

- Turn On Notifications.
- Not Now.

The Turn On action should trigger the actual browser or device permission and registration flow.

Do not pretend notifications are enabled before permission is granted and token registration succeeds.

Not Now should postpone the prompt rather than repeatedly displaying it on every navigation.

Respect browser permission denial and existing notification preferences.

Store onboarding state appropriately.

## 11.4 Notification settings

Allow users to control notification categories.

Use the existing notification preferences architecture if present.

Support useful categories such as:

- Messages.
- Appointments.
- Comments and replies.
- Listing activity.
- Agent activity.
- Other relevant notifications.

Distinguish between in-app notifications and push delivery where appropriate.

Do not send notifications that the user has disabled.

---

# PART 12: AUTHENTICATION AND SCHOOL SELECTION

Inspect the existing authentication flow.

Where the application asks a user to select a school, improve the experience.

Introduce an appropriate question:

**Are you a student?**

Supporting text:

"Select your school so we can personalize your accommodation search and cater to your student housing needs."

If the user is a student:

- Allow school selection.
- Save the school preference.
- Use the preference to personalize the homepage.
- Default the feed to Students.
- Use the school preference when presenting relevant featured properties and recommendations.

If the user is not a student:

- Do not require school selection.
- Allow them to continue with the general Residential experience.
- Do not block signup or authentication.

Use the existing profile and onboarding architecture.

Do not introduce duplicate authentication processes.

Preserve existing OAuth and email authentication functionality.

---

# PART 13: HOMEPAGE AND GLOBAL LAYOUT CLEANUP

## 13.1 Homepage footer

Remove the large marketing footer from the homepage.

The footer containing elements such as:

- Follow us.
- Social links.
- Company information.
- About.
- FAQs.
- Terms.
- Other marketing links.

should generally appear on informational and onboarding pages, rather than the main homepage feed.

Keep the existing bottom navigation if one exists.

Do not confuse the marketing footer with mobile bottom navigation.

Retain the footer on appropriate pages, such as:

- Onboarding.
- About.
- FAQs.
- Terms and conditions.
- Other informational pages.

## 13.2 Admin school card overflow

Fix the school card overflow issue in the admin interface.

Inspect:

- Card width.
- Grid sizing.
- Text wrapping.
- Long school names.
- Action button positioning.
- Responsive behavior.

Ensure cards remain within their containers and do not overlap adjacent content.

Do not solve the issue by arbitrarily hiding important information.

---

# PART 14: GENERAL 2026 UI/UX MODERNIZATION

Modernize the application with good design judgment.

Do not blindly redesign everything.

Preserve the First Estates visual identity while improving consistency and usability.

## 14.1 Design direction

Aim for a contemporary 2026 real-estate platform.

Prioritize:

- Clear information hierarchy.
- Strong typography.
- Better spacing.
- Consistent surface colors.
- Good use of whitespace.
- Balanced card layouts.
- Refined borders.
- Subtle transitions.
- Responsive components.
- Accessible contrast.
- Consistent iconography.

Avoid:

- Excessive hover effects.
- Unnecessary animations.
- Heavy shadows.
- Excessive gradients.
- Oversized rounded corners.
- Too many floating cards.
- Excessively dark or visually noisy interfaces.
- Decorative elements that reduce usability.

## 14.2 shadcn/ui

Use shadcn/ui sensibly.

Reuse existing components and conventions.

Consider appropriate use of:

- Dialog.
- Sheet.
- Drawer.
- Dropdown Menu.
- Popover.
- Tabs.
- Form.
- Select.
- Command.
- Tooltip.
- Toast or existing notification system.

Do not introduce a new component library unnecessarily.

Do not replace functional existing components merely to use a newer component.

## 14.3 Responsive design

Every redesigned area must work on:

- Mobile.
- Tablet.
- Desktop.
- Larger desktop screens.

Pay particular attention to:

- Listing cards.
- Single listing pages.
- Filter panels.
- Agent profiles.
- Community pages.
- Appointment dashboards.
- Settings.
- Admin school management.

Avoid horizontal overflow and overlapping fixed elements.

Test realistic screen widths.

---

# PART 15: SECURITY, VALIDATION AND DATA INTEGRITY

All new functionality must respect the existing application's security model.

Implement appropriate:

- Authentication checks.
- Role-based authorization.
- Ownership checks.
- Server-side validation.
- Input sanitization.
- Rate limiting where appropriate.
- Database constraints.
- Transaction safety.
- Error handling.
- Privacy controls.

Examples:

- Only authorized agents can manage their own listings.
- Only the relevant agent can manage appointments associated with their listings.
- Only Student listings can generate co-rent requests.
- Only valid referral completions can activate bonuses.
- Users cannot modify another user's settings.
- Users cannot modify another user's referral history.
- Users cannot manipulate listing prices by submitting a client-calculated discount.
- Users cannot edit or delete another person's community posts without appropriate authorization.
- Push tokens must belong to the authenticated user.

Preserve existing reporting, blocking, and moderation behavior.

Do not expose secrets or privileged database credentials in client code.

---

# PART 16: PERFORMANCE AND MAINTAINABILITY

Do not compromise application performance while introducing the new features.

Pay attention to:

- Database query efficiency.
- N+1 queries.
- Appropriate indexes.
- Image optimization.
- Geocoding caching.
- Server-side pagination or the existing infinite-loading conventions.
- React Query caching and invalidation.
- Unnecessary component re-renders.
- Duplicate API calls.
- Large client-side bundles.
- Notification delivery efficiency.

Use existing architecture and conventions.

Do not introduce a new state-management or data-fetching system without a clear technical reason.

Do not unnecessarily change the application's existing pagination or infinite-loading behavior.

---

# PART 17: IMPLEMENTATION ORDER AND DEPENDENCIES

Do not implement all these features randomly.

Use the following implementation sequence to reduce regressions.

## Phase 1: Codebase audit and product foundation

1. Inspect the existing schema and application architecture.
2. Map existing functionality to the requirements.
3. Identify reusable components, utilities, APIs, and database operations.
4. Identify schema conflicts and migration dependencies.
5. Standardize Student and Residential categories.
6. Define backward compatibility for existing listings.
7. Establish category-aware listing validation and creation/editing.
8. Update homepage feed tabs and search behavior.

Do not remove existing student functionality during this phase.

## Phase 2: School and housing intelligence

1. Add school addresses.
2. Improve school creation and editing.
3. Implement reusable school matching.
4. Implement server-side geocoding.
5. Implement Haversine distance calculation.
6. Add caching and invalidation.
7. Display valid distances on single Student listing pages.
8. Update school-focused filters and browsing.

## Phase 3: Listing and agent experience

1. Redesign single listing layouts.
2. Implement the mobile listing action bar.
3. Implement desktop listing navigation.
4. Refine dark-mode surfaces.
5. Upgrade listing cards.
6. Redesign public agent profiles.
7. Add saved agents.
8. Fix admin school card overflow.

## Phase 4: Appointment modernization

1. Audit existing appointment functionality.
2. Improve the listing tour-booking modal.
3. Improve appointment request creation.
4. Improve user appointment views.
5. Refurbish the agent appointment dashboard.
6. Implement lifecycle and authorization rules.
7. Connect relevant notification events.

## Phase 5: Social and community

1. Improve existing comments and discussion discoverability.
2. Implement saved agents completely if not already completed.
3. Improve roommate and co-rent discovery.
4. Enforce Student-only co-rent eligibility.
5. Implement community publishing.
6. Implement comments and replies.
7. Integrate moderation, reporting, and privacy controls.
8. Introduce saved searches where appropriate.

## Phase 6: Referrals and bonuses

1. Inspect existing user and bonus structures.
2. Implement referral identifiers and attribution.
3. Preserve attribution through authentication.
4. Implement successful referral tracking.
5. Enforce the three-referral limit atomically.
6. Implement progressive bonus durations.
7. Implement centralized bonus eligibility.
8. Apply the 12% discount dynamically.
9. Verify that existing listing discounts continue to work.

## Phase 7: Settings and notifications

1. Implement persistent settings.
2. Add theme preferences.
3. Add default feed preferences.
4. Add student-specific preferences.
5. Add location-based feed preferences.
6. Implement Firebase push infrastructure.
7. Implement device-token registration.
8. Implement notification events.
9. Implement role-specific permission onboarding.
10. Integrate notification controls into Settings.

## Phase 8: Final UI refinement and verification

1. Remove the homepage marketing footer.
2. Improve remaining empty states.
3. Refine responsive behavior.
4. Review all modals and drawers.
5. Check dark mode.
6. Check loading, error, and success states.
7. Check accessibility.
8. Run all relevant tests.
9. Run type checking and linting.
10. Run a production build.
11. Fix regressions introduced by the changes.

The implementation order can be adjusted when the existing architecture requires a different dependency sequence, but do not skip necessary prerequisites.

---

# PART 18: REQUIRED TESTING

Test functionality rather than simply checking whether pages render.

At minimum, cover the following.

## Housing categories

- Existing listings remain accessible.
- Legacy listings appear in All.
- Student listings appear in Students.
- Residential listings appear in Residential.
- Students default to the Students tab.
- Other users receive the appropriate default.
- Residential listings do not require schools.
- Student listings retain school functionality.
- Only Student listings can generate co-rent requests.
- Filters work alongside feed tabs.

## School distance

- School address can be created.
- School address can be edited.
- Existing schools without addresses remain valid.
- School matching handles capitalization and whitespace.
- Ambiguous school matches are rejected.
- Missing school addresses do not produce distances.
- Missing property addresses do not produce distances.
- Failed geocoding does not break listing pages.
- Successful calculations produce accurate kilometre values.
- Changed addresses invalidate stale results.
- Residential listings never display school distance.

## Social and agent profiles

- Users can save and unsave agents.
- Duplicate saves are prevented.
- Saved agents appear in the correct section.
- Saved agent links open the correct profile.
- Chat actions work.
- Reporting remains functional.
- Unauthorized users cannot modify another user's saved agents.
- Community posts can be created, edited, viewed, and reported.
- Unauthorized post modifications are rejected.

## Appointments

- Users can request tours.
- Opening the booking modal does not create an appointment.
- Confirming the request creates the correct record.
- The agent sees the request.
- The agent can accept, decline, or reschedule.
- The user sees updated appointment status.
- Unauthorized appointment modifications are rejected.
- Duplicate requests are handled appropriately.

## Referrals

- Referral links contain the correct identifier.
- Normal signup still works.
- Referral attribution survives supported signup methods.
- Self-referrals are rejected.
- Invalid referral identifiers are rejected.
- Duplicate callbacks do not award duplicate bonuses.
- The maximum of three successful referrals is enforced.
- Concurrent signup completion cannot exceed the limit.
- Bonus progression is correct.
- Expired bonuses stop applying.
- The discount is exactly 12%, subject to existing rounding rules.
- Existing discounts continue working.

## Settings and notifications

- Settings persist across sessions and devices.
- Theme changes work correctly.
- Feed preferences work.
- Student preferences work.
- Push permission is requested only through the appropriate user action.
- Permission denial is handled correctly.
- Token registration works where configured.
- Notification preferences are respected.
- Duplicate notifications are prevented.

## UI and responsiveness

Test the redesigned interfaces on mobile, tablet, and desktop.

Pay special attention to:

- Homepage feed.
- Listing cards.
- Single listing page.
- Mobile bottom action bar.
- Desktop listing navigation.
- Filter drawers.
- Agent profile.
- Community.
- Appointments.
- Settings.
- Admin school cards.

---

# PART 19: FINAL DELIVERABLES

After implementation, provide a structured summary.

Include:

## 1. Architecture audit

Explain the existing systems reused and any important architectural decisions.

## 2. Database changes

List:

- New fields.
- Modified fields.
- New tables.
- New relationships.
- Indexes and constraints.
- Migrations.
- Backward compatibility decisions.

## 3. Features implemented

Summarize:

- Student and Residential housing support.
- Homepage tabs and filters.
- School distance calculations.
- Agent wishlist.
- Community publishing.
- Appointment modernization.
- Agent profile redesign.
- Referral and bonus system.
- Settings.
- Firebase push notifications.
- Listing and general UI improvements.

## 4. Files changed

Identify important files created, modified, or removed.

Group them by feature.

## 5. Security and data integrity

Explain important server-side checks, transaction handling, authorization rules, and data preservation decisions.

## 6. Testing

Report:

- TypeScript results.
- Lint results.
- Test results.
- Production build results.
- Any issues that remain unresolved.

Do not claim tests passed if they were not executed.

## 7. Required configuration

List any environment variables, external service credentials, Firebase configuration, or deployment changes still required.

---

# FINAL DEVELOPMENT INSTRUCTION

First Estates must evolve into a unified housing discovery and community platform, not a collection of disconnected features.

The most important principle throughout this implementation is **cohesion**.

Student housing must continue working as it does today, while Residential becomes a proper additional housing category.

The social features must integrate with existing profiles, listings, and messaging.

Appointments must become a useful end-to-end property-tour workflow.

Referrals must be secure, transactional, and financially consistent.

School distances must be accurate and conditional.

Settings must persist across devices.

Notifications must be event-driven and respect user preferences.

The UI must feel modern, intentional, responsive, and consistent without excessive decoration.

You are authorized to make substantial frontend and backend improvements, including database schema changes, where necessary.

However, do not mistake permission to improve the architecture for permission to destroy working functionality.

**Inspect before changing. Reuse before replacing. Migrate without losing data. Validate on the server. Test before declaring completion.**

Deliver working functionality, not just attractive interfaces or a list of proposed changes.