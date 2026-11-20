# BUS: Social features and growth beyond student housing

## Goal

Make First Estates feel useful as a trusted home-finding community, while allowing it to serve renters and buyers who are not students. Keep the existing student housing journey working throughout the change.

The current product already has useful building blocks: listing wishlists, agent profiles, chat, listing comments, roommate requests, and co-rent requests. Extend these in small steps instead of introducing a separate social network or replacing the current flow.

## Product direction

Organize the product around **people, places, and housing needs**:

- **People:** discover and follow agents, save trusted agents, and see their current listings.
- **Places:** browse homes and rooms by location, price, type, and availability.
- **Needs:** save a search or post a housing request, then connect with suitable agents or potential housemates.

Keep students as a first-class audience and add broader renter/buyer options alongside them. A student should still be able to search near a school and find roommates; a non-student should be able to search by city or neighborhood without being asked to choose a school.

## Social improvements

### 1. Agent wishlist (recommended first feature)

Let a signed-in user save an agent, view their saved agents, and open the agent's profile and active listings. Treat this separately from the existing property wishlist: users may like an agent without currently wanting a particular listing.

Minimum release:

- Add a save/unsave control to the agent profile and agent cards.
- Add a **Saved agents** page or section under the user's saved items.
- Show the agent's verification status and active listing count.
- Allow users to start a chat from the agent profile, subject to existing account and messaging rules.
- Prevent duplicate saves and allow users to remove a saved agent.

Later, users could opt into notifications when a saved agent posts a listing or changes availability. Make these notifications opt-in and provide controls to turn them off.

### 2. Make existing social features easier to find

- Connect listing comments to useful conversation: show the author, date, and a clear route to contact the agent, while keeping moderation and reporting available.
- Surface roommate and co-rent requests in relevant searches, with clear visibility and contact controls.
- Add saved searches so people can return to a housing need and optionally receive alerts when matching listings appear.
- Use the inbox as the central place for listing, agent, and roommate conversations; show enough context to know what each conversation is about.

Avoid public follower counts, open-ended user feeds, or public direct messages as the first social release. They add moderation and privacy work before proving that users need them.

## Expand beyond student housing

### Product and data changes

- Introduce a housing audience or category such as **Student**, **Residential**, and (if the business intends to support it) **Commercial**. Start with Student and Residential; only add categories the team can actually support.
- Keep school as an optional, student-specific field. Do not require it for general residential listings or searches.
- Add explicit listing fields for property type and transaction intent (for example, rent or sale) instead of encoding these differences in school or free-text tags.
- Keep location, price, bedrooms, bathrooms, availability, and agent as shared listing concepts.
- Preserve current listing records by treating existing records as Student during migration or via a compatibility default. Do not make existing school data disappear.
- Update search filters, listing forms, validation, cards, and detail pages to show the right fields for each category.

### User experience

- Retain the current student entry points and school-based browsing.
- Add a clear category selector or audience filter, with Residential as an additional path rather than a replacement for Student.
- For non-student browsing, lead with location and housing type; hide school-only controls unless the user selects Student.
- Keep one account, agent profile, inbox, and listing system so users do not have to understand separate products.
- Label results and listing pages with their category so users know what they are viewing.

## Suggested rollout

### Phase 1: Validate the direction

1. Decide which new audience to support first (recommended: general residential rentals).
2. Define the initial location, property types, and rent/sale scope the team can reliably serve.
3. Review current listing creation and search flows to map which fields are student-only and which are shared.
4. Talk to a small set of students, agents, and non-student renters about saved agents and the broader search flow.

### Phase 2: Ship low-risk social value

1. Add saved agents using a dedicated relation/model, following the existing property wishlist pattern.
2. Add a saved-agent list and connect it to existing agent profiles, listings, and chat.
3. Add saved searches only after deciding alert frequency and notification preferences.
4. Track saves, profile visits, agent-contact starts, and repeat visits to saved items.

### Phase 3: Add the broader housing category

1. Add category and transaction intent as explicit listing properties, with backward-compatible defaults for existing records.
2. Update agent listing forms and validation so required fields depend on category.
3. Update search and filter logic while preserving the existing student/school route.
4. Update listing cards and detail pages to conditionally show school and other category-specific details.
5. Launch to a limited set of locations or agents first, then broaden after reviewing search quality and listing supply.

### Phase 4: Improve community with evidence

Use feedback and usage data to decide whether to add agent updates, listing questions, reviews, roommate matching, or notifications. Add reporting, blocking, moderation ownership, and notification controls before making user-generated activity more public.

## What to measure

- Student search success and contact starts before and after each release.
- Number of complete, current listings by category and location.
- Search-to-listing-view and listing-view-to-contact rates for each audience.
- Saved-agent usage and how often it leads to a profile visit or conversation.
- Request response time, report volume, and user-reported spam or confusion.

Keep a student-specific dashboard or segment in these metrics so expansion does not hide a decline in the original experience.

## Decisions and first actions for you

1. Confirm the first non-student audience and geography. A focused residential-rentals launch in one existing service area is the simplest starting point.
2. Decide whether sales listings are in scope now or later; rent and sale need different fields and user expectations.
3. Ask a few agents whether they would keep profiles and listings current and whether saved-agent alerts would be valuable.
4. Start with the agent wishlist as the first social feature because it fits the existing product and is easy to explain.
5. Before implementation, agree on the category, transaction, and optional-school data rules, including how existing listings receive a safe default.
6. Roll out the new audience gradually and compare its results with the student experience before expanding further.

## Scope note

This document is a product plan, not an implementation change. The first concrete build can be the saved-agent relation, save/unsave endpoint, saved-agent view, and links to existing agent pages and chat. The broader audience should follow once the initial categories, location coverage, and listing rules are decided.
