# MyGameBucket — Project Context & Guide

Welcome! This is the context and guidance file for MyGameBucket, a game library management and social tracking application.

## Tech Stack
- **Framework**: Next.js 16.2.9 (App Router)
- **Language**: TypeScript, React 19.2.4
- **Database / Auth**: Supabase via `@supabase/ssr` and `@supabase/supabase-js`
- **Styling**: Tailwind CSS v4, Vanilla CSS variable mapping (`globals.css`)
- **Animations**: `motion` (Framer Motion) (Transitions standard: 400ms)
- **Icons**: Lucide React
- **Package Manager**: npm

---

## Build & Dev Commands

```bash
# Start development server
npm run dev

# Run build compilation and check for errors
npm run build

# Run linter
npm run lint
```

---

## Codebase Conventions & Architecture

1. **Feature-Based Modular Structure** (`src/features/*`):
   - Group related code by features (e.g., `src/features/friends/`, `src/features/library/`, `src/features/collections/`).
   - Feature folders contain `components/` and `hooks/`.
2. **Business Logic Separation**:
   - Keep business logic **exclusively in the `src/services/*Service.ts` layer**. React components and API routes MUST NOT contain business logic.
   - Keep database access **exclusively in the `src/services/*Repository.ts` layer** or Supabase SDK in backend services.
3. **Theming & Color Palettes**:
   - Relies on CSS variables in `globals.css` and `ThemeProvider` context. Do not hardcode hex colors.
   - Use Tailwind semantic colors (e.g., `bg-primary`, `text-muted-foreground`).
   - Accent colors can shift dynamically based on game/genre themes (via `GenreThemeProvider` and the Theme Engine).
4. **State Management**:
   - Server Components fetch data at the page level.
   - Client Components (`'use client'`) use React hooks (e.g., `useLibrary`, `useFriends`) to manage state and talk to local `/api/...` routes.
5. **Documentation Reference**:
   - Always consult the `/docs` folder for detailed architectural decisions (Backend, Frontend, Database) and `docs/Decision_log.md` for resolved design considerations.

---

## Current Status & Completed Milestones

All milestones are built sequentially and kept clean and functional. Here is what has been fully implemented:
- **Phase 1: Foundation**: Project setup, styling configuration, core components, and main layout structure.
- **Phase 2: Authentication**: Secure login, registration, password reset, and session hooks linked to Supabase.
- **Phase 3: Game System**: Search, catalog queries, game details pages, and IGDB API client proxy.
- **Phase 4: Library**: Add/remove games, update status (Playing, Completed, Plan to Play, Dropped), rate, and log play hours.
- **Phase 5: Profiles**: Customizable public/private profiles, usernames, avatars, statistics, and dynamic theme colors.
- **Phase 6: Journal**: Creating, reading, editing, and deleting personal gaming memories/journal logs (one per game).
- **Phase 7: Collections**: Custom game collections (up to a limit of 10) with addition/removal features.
- **Phase 8 (Partially Complete): User Search & Discovery**: Finding other users' public profiles.
- **Phase 9 (Partially Complete): Administration**: Basic dashboards, user role checks (`user_roles` table), and logging.
- **Social / Friends Extension (In Progress)**:
  - Database schema & RLS policies for friendships and blocks (`supabase/migrations/014_friends_and_blocking.sql`).
  - Friendship repository, service, hooks, and API endpoints completed (`src/services/friendshipService.ts`, `src/features/friends/hooks/useFriends.ts`).
  - Friendship UI components implemented (`FriendshipButton`, `FriendCard`, `FriendRequestCard`, `SentRequestCard`, `BlockedUserCard`, `DiscoverCard`, `UserSearchDialog`).
  - Active profile visibility rules integrated.

---

## Next Steps / Active Work

The **Friendship and Blocking System** is now complete (2026-07-12):
1. ~~**Migration Verification**~~ ✅ Done: migrations `013`, `014`, and `015` are applied and recorded on the remote Supabase DB (`npx supabase migration list` shows local/remote in sync). `014` was made idempotent (policies now `DROP IF EXISTS` before `CREATE`).
2. ~~**Friends Page Integration**~~ ✅ Done: `/friends` page works with the `useFriends` hooks — friends list, incoming/sent requests, blocked users, user search dialog, and discover link all render with loading/empty states.
3. ~~**Profile Privacy Integration**~~ ✅ Done, with fixes:
   - `friendshipService.canViewProfile` now restricts blocked users in **either direction**, regardless of profile visibility.
   - `api/journal/profile/[username]/route.ts` now enforces `canViewProfile` (previously leaked journal entries of Private/FriendsOnly profiles).
   - New migration `015_fix_blocked_users_select_rls.sql`: the `blocked_users` SELECT policy now covers both directions so "blocked by them" checks (friendship status, discovery filtering, visibility) work under RLS.

Remaining active work — **Journaling/UI Polishing** (see Milestone 10 in `implementation_plan.md`): performance, accessibility, error states, and documentation checklists.

---

## Environment Configuration
Ensure your `.env.local` contains the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
IGDB_CLIENT_ID=your_igdb_client_id
IGDB_CLIENT_SECRET=your_igdb_client_secret
```
