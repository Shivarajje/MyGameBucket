# MyGameBucket — Milestone Implementation Plan

> Derived from Document 09 (Development Roadmap), cross-referenced with all architecture, schema, UI/UX, and standards documents. All resolved decisions from the previous review are incorporated.

---

## Overview

| Milestone | Phase | Focus | Depends On |
|---|---|---|---|
| M1 | Foundation | Project infrastructure & design system | — |
| M2 | Authentication | Account creation & session management | M1 |
| M3 | Game System | External API, catalog, search, game pages | M2 |
| M4 | Library | Personal game library & tracking | M3 |
| M5 | Profiles | Public/private profiles & theming | M4 |
| M6 | Journal | Personal gaming memories | M5 |
| M7 | Collections | Custom game groups | M6 |
| M8 | Search | User search, improved game search | M7 |
| M9 | Administration | Admin dashboard, moderation, logs | M8 |
| M10 | Polish & Release | Performance, accessibility, QA, deployment | M9 |

---

# Milestone 1 — Foundation

## Objective

Create the complete project infrastructure: directory structure, design system, theme engine, shared components, configuration, global types, and Supabase connection. At the end, the app is a deployable skeleton with navigation, theming, and all shared UI components — but no features.

## Files to Create

### Project Restructure
```
src/                                          (new root wrapper)
```

### Configuration & Environment
```
src/config/api.ts                             (API URLs, endpoints)
src/config/animation.ts                       (ANIMATION_DURATION = 400, easing curves)
src/config/theme.ts                           (theme configuration, genre palettes)
src/config/upload.ts                          (avatar upload limits, file types)
src/config/pagination.ts                      (DEFAULT_PAGE_SIZE = 50)
src/config/limits.ts                          (character limits, collection limits)
.env.local.example                            (template for environment variables)
```

### Constants
```
src/constants/routes.ts                       (all route paths as constants)
src/constants/enums.ts                        (GameStatus, Visibility, GenreCategory, etc.)
src/constants/labels.ts                       (status labels, genre labels)
src/constants/messages.ts                     (toast messages, error messages)
src/constants/loading-messages.ts             (themed loading messages array)
src/constants/empty-states.ts                 (empty state text per feature)
```

### Global Types
```
src/types/database.ts                         (all table row types matching schema)
src/types/api.ts                              (ApiResponse<T>, PaginatedResponse<T>, ApiError)
src/types/game.ts                             (Game, GameSearchResult, GameDetail)
src/types/profile.ts                          (Profile, PublicProfile)
src/types/library.ts                          (LibraryEntry, LibraryFilters, LibrarySortOption)
src/types/journal.ts                          (JournalEntry)
src/types/collection.ts                       (Collection, CollectionWithGames)
src/types/settings.ts                         (UserSettings, AppearanceMode)
src/types/auth.ts                             (AuthUser, Session, LoginCredentials, RegisterCredentials)
src/types/admin.ts                            (AdminLog, SystemLog, ManualGameSubmission)
src/types/common.ts                           (PinnedGame, UserRole, GenreCategory)
```

### Utility Functions
```
src/lib/utils.ts                              (cn() helper — already exists, move to src/)
src/lib/supabase/client.ts                    (browser Supabase client)
src/lib/supabase/server.ts                    (server-side Supabase client)
src/lib/supabase/middleware.ts                (auth middleware helper)
src/lib/formatDate.ts                         (date formatting utility)
src/lib/formatNumber.ts                       (number/hours formatting)
src/lib/slugify.ts                            (slug generation)
src/lib/validation.ts                         (shared validation helpers)
src/lib/genre-mapper.ts                       (maps API genre text → GenreCategory enum)
```

### Shared Hooks
```
src/hooks/useDebounce.ts                      (debounced value hook)
src/hooks/useTheme.ts                         (theme context hook)
src/hooks/useBreakpoint.ts                    (responsive breakpoint detection)
src/hooks/useLocalStorage.ts                  (persisted local storage)
src/hooks/useReducedMotion.ts                 (prefers-reduced-motion detection)
```

### Shared UI Components (shadcn/ui)
```
src/components/ui/button.tsx                  (Primary, Secondary, Ghost, Danger)
src/components/ui/card.tsx
src/components/ui/input.tsx
src/components/ui/dialog.tsx
src/components/ui/toast.tsx
src/components/ui/toaster.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/skeleton.tsx
src/components/ui/tooltip.tsx
src/components/ui/tabs.tsx
src/components/ui/separator.tsx
src/components/ui/label.tsx
src/components/ui/select.tsx
src/components/ui/textarea.tsx
src/components/ui/sonner.tsx                  (toast provider)
```

### Layout Components
```
src/components/layout/Navbar.tsx              (desktop top nav + mobile drawer)
src/components/layout/MobileDrawer.tsx        (slide-out mobile navigation)
src/components/layout/Footer.tsx
src/components/layout/Container.tsx           (max-w-[1440px] centered wrapper)
src/components/layout/Section.tsx             (vertical section with spacing)
src/components/layout/PageHeader.tsx          (page title + optional subtitle)
src/components/layout/LoadingOverlay.tsx      (full-page themed loading)
src/components/layout/EmptyState.tsx          (icon + headline + text + CTA)
src/components/layout/ThemeProvider.tsx       (Light/Dark theme context)
src/components/layout/GenreThemeProvider.tsx   (genre-based accent provider)
```

### App Shell
```
src/app/layout.tsx                            (root layout: font, providers, metadata)
src/app/page.tsx                              (landing/home page placeholder)
src/app/loading.tsx                           (root loading state)
src/app/error.tsx                             (root error boundary)
src/app/not-found.tsx                         (404 page)
src/app/globals.css                           (design tokens, base styles, Tailwind imports)
```

### Assets
```
src/assets/                                   (directory placeholder)
public/avatars/                               (default avatar images directory)
public/images/placeholder-cover.webp          (placeholder game cover)
public/images/placeholder-avatar.webp         (placeholder avatar)
```

### Documentation
```
docs/Decision_log.md                          (living decision log)
```

## Dependencies

- None (this is the foundation)

## Expected Result

- A fully deployable Next.js application with **no features** but a complete design system
- Dark/Light theme switching works
- Navigation bar renders on desktop and mobile
- Footer renders
- All shared UI components are available
- Supabase client connects (but no tables exist yet)
- TypeScript compiles with zero errors
- ESLint passes
- All design tokens are centralized
- Genre theme palettes are configured

## Testing Checklist

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes
- [ ] No TypeScript `any` types
- [ ] Dark mode renders correctly (near-black background, high-contrast text)
- [ ] Light mode renders correctly
- [ ] Theme toggle persists between page reloads
- [ ] Navigation renders on desktop (top bar)
- [ ] Navigation renders on mobile (drawer)
- [ ] Footer renders
- [ ] 404 page displays correctly
- [ ] Error page displays correctly
- [ ] Inter font loads
- [ ] All shadcn/ui components render without errors
- [ ] Empty state component renders with icon, text, and CTA
- [ ] Loading overlay shows random themed messages
- [ ] Container respects max-width 1440px
- [ ] 8-point spacing system is applied consistently
- [ ] Responsive at all breakpoints (0–640px, 641–1024px, 1025px+)

---

# Milestone 2 — Authentication

## Objective

Allow users to register, log in, log out, and access protected routes. Upon registration, automatically create a profile, settings record, and user role record. Session handling persists across page refreshes.

## Files to Create

### Database Migrations
```
supabase/migrations/001_create_enums.sql              (all ENUM types)
supabase/migrations/002_create_profiles.sql            (profiles table + RLS)
supabase/migrations/003_create_user_roles.sql          (user_roles table + RLS)
supabase/migrations/004_create_settings.sql            (settings table + RLS)
supabase/migrations/005_create_profile_trigger.sql     (auto-create profile on auth.users insert)
```

### Auth Feature Module
```
src/features/auth/components/LoginForm.tsx
src/features/auth/components/RegisterForm.tsx
src/features/auth/components/LogoutButton.tsx
src/features/auth/components/AuthGuard.tsx             (protected route wrapper)
src/features/auth/hooks/useAuth.ts                     (auth state + actions)
src/features/auth/services/authService.ts              (login, register, logout, session)
src/features/auth/types/index.ts                       (auth-specific types)
src/features/auth/constants/index.ts                   (validation rules, min/max lengths)
src/features/auth/utils/validateCredentials.ts         (client-side validation)
```

### API Routes
```
src/app/api/auth/register/route.ts                    (POST: register)
src/app/api/auth/login/route.ts                       (POST: login)
src/app/api/auth/logout/route.ts                      (POST: logout)
src/app/api/auth/session/route.ts                     (GET: current session)
src/app/api/auth/reset-password/route.ts              (POST: password reset request)
```

### Auth Pages
```
src/app/(auth)/layout.tsx                              (auth layout — no nav)
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/(auth)/reset-password/page.tsx
```

### Protected Layout
```
src/app/(main)/layout.tsx                              (authenticated layout — with nav)
src/app/(main)/page.tsx                                (home dashboard placeholder)
```

### Middleware
```
src/middleware.ts                                       (Next.js middleware for auth redirect)
```

### Backend Services
```
src/services/profileService.ts                         (createProfile on registration)
src/services/settingsService.ts                        (createDefaultSettings)
src/services/userRoleService.ts                        (assignDefaultRole)
```

## Dependencies

- **M1**: Design system, Supabase client, shared components, global types

## Expected Result

- Users can register with email + password
- Users can log in and receive a session
- Users can log out
- Unauthenticated users are redirected to `/login`
- Authenticated users are redirected away from auth pages
- On registration: profile, settings, and user_role records are auto-created
- Password reset flow works
- Session persists across page refreshes and new tabs
- Toast notifications confirm auth actions

## Testing Checklist

- [ ] Register with valid email + password → profile created
- [ ] Register with duplicate email → clear error message
- [ ] Register with duplicate username → clear error message
- [ ] Login with valid credentials → redirected to home
- [ ] Login with invalid credentials → clear error message
- [ ] Logout → redirected to login
- [ ] Visit protected route while logged out → redirected to login
- [ ] Visit login while logged in → redirected to home
- [ ] Session persists on page refresh
- [ ] Password reset email sends (disabled in dev, but route exists)
- [ ] Profile record exists after registration
- [ ] Settings record exists after registration (default: Dark)
- [ ] User role record exists after registration (default: user)
- [ ] Username validation: min 3, max 30 chars, case-insensitive unique
- [ ] All forms show validation errors below relevant fields
- [ ] All forms show loading state during submission
- [ ] Responsive on mobile

---

# Milestone 3 — Game System

## Objective

Build the shared game infrastructure: external Game API integration (IGDB), local Game Catalog, game search with live suggestions, and cinematic game detail pages. Users can search and view games but cannot yet add them to a library.

## Files to Create

### Database Migrations
```
supabase/migrations/006_create_game_catalog.sql        (game_catalog table + indexes + RLS)
supabase/migrations/007_create_manual_game_submissions.sql
```

### Game Feature Module
```
src/features/games/components/GameCard.tsx              (cover, title, genre badge, status, rating, hours)
src/features/games/components/GameCover.tsx             (image with placeholder fallback)
src/features/games/components/GameHero.tsx              (cinematic hero section, ~65% viewport)
src/features/games/components/GameInfo.tsx              (metadata: developer, platform, release year)
src/features/games/components/GameActions.tsx           (Add to Library / In Library button)
src/features/games/components/GameStats.tsx             (game-specific stats display)
src/features/games/components/ScreenshotGallery.tsx     (max 5 screenshots + lightbox)
src/features/games/components/GameCardSkeleton.tsx
src/features/games/components/GamePageSkeleton.tsx
src/features/games/hooks/useGame.ts                     (fetch single game details)
src/features/games/hooks/useGameSearch.ts               (debounced search with suggestions)
src/features/games/services/gameService.ts              (search, fetch details, cache check)
src/features/games/types/index.ts
src/features/games/constants/index.ts
src/features/games/utils/normalizeGameData.ts           (normalize IGDB response → internal type)
```

### Search Feature Module (Game Search portion)
```
src/features/search/components/SearchBar.tsx            (global search bar)
src/features/search/components/SearchSuggestions.tsx    (live dropdown suggestions)
src/features/search/components/SearchResultCard.tsx
src/features/search/components/SearchResultsSkeleton.tsx
src/features/search/hooks/useSearch.ts
src/features/search/services/searchService.ts
src/features/search/types/index.ts
src/features/search/constants/index.ts
```

### API Routes
```
src/app/api/games/search/route.ts                      (GET: search games)
src/app/api/games/[slug]/route.ts                      (GET: game details by slug)
src/app/api/games/manual/route.ts                      (POST: manual game submission)
```

### Backend Services & Repositories
```
src/services/gameService.ts                             (backend: search, fetch, sync, cache)
src/services/gameRepository.ts                          (DB queries for game_catalog)
src/services/externalGameApi.ts                         (IGDB API abstraction layer)
src/services/manualGameService.ts                       (submission handling)
```

### Game Pages
```
src/app/(main)/game/[slug]/page.tsx                    (game detail page)
src/app/(main)/game/[slug]/loading.tsx                 (game page skeleton)
src/app/(main)/game/[slug]/error.tsx
src/app/(main)/game/[slug]/not-found.tsx
src/app/(main)/search/page.tsx                          (full search results page)
src/app/(main)/search/loading.tsx
```

### Configuration
```
src/config/igdb.ts                                      (IGDB API config, client ID, endpoints)
```

## Dependencies

- **M2**: Authentication, profiles table, Supabase connection

## Expected Result

- Global search bar in navigation works
- Typing shows live suggestions (debounced, skeleton loading)
- Clicking a suggestion opens the game detail page at `/game/elden-ring`
- Game page shows cinematic hero (~65% viewport), cover art, title, genre, release year, developer, platform
- Screenshots display in a gallery (max 5) with lightbox
- Genre-based accent colors apply automatically
- "Add to Library" button is visible but non-functional (wired in M4)
- Game Catalog grows as users search for new games
- If IGDB is unavailable, cached catalog data is shown with a friendly message
- Manual game submission form exists
- Missing covers show placeholder image

## Testing Checklist

- [ ] Search "Elden Ring" → results appear with debounce
- [ ] Suggestions show cover, title, genre
- [ ] Click suggestion → navigates to `/game/elden-ring`
- [ ] Game page hero renders at ~65% viewport height
- [ ] Cover art displays (or placeholder if missing)
- [ ] Genre badge displays correct genre
- [ ] Screenshots render in gallery (or hide if none)
- [ ] Lightbox opens on screenshot click
- [ ] Game is inserted into `game_catalog` on first search
- [ ] Subsequent searches for same game hit local catalog first
- [ ] `last_synced_at` updates on fresh API fetch
- [ ] Manual game submission form submits with status "Pending"
- [ ] Search results paginate (infinite scroll, 50 per page)
- [ ] Game page skeleton loads before data
- [ ] Empty search shows "Search for your next adventure."
- [ ] Responsive: game page works on mobile
- [ ] Keyboard navigation works in search suggestions

---

# Milestone 4 — Library

## Objective

Create the user's personal game library. Users can add/remove games, update status, hours, rating, and dates. Library displays in grid or list view with sorting, filtering, and infinite scroll.

## Files to Create

### Database Migrations
```
supabase/migrations/008_create_user_games.sql          (user_games table + constraints + RLS)
```

### Library Feature Module
```
src/features/library/components/LibraryPage.tsx         (main library container)
src/features/library/components/LibraryGrid.tsx         (grid layout)
src/features/library/components/LibraryList.tsx         (list layout)
src/features/library/components/LibraryToolbar.tsx      (search, sort, filter, view toggle)
src/features/library/components/LibraryGameCard.tsx     (extended game card with personal data)
src/features/library/components/LibraryEmptyState.tsx   ("Your journey hasn't begun yet.")
src/features/library/components/LibrarySkeleton.tsx
src/features/library/components/AddGameDialog.tsx       (rating, status, hours, dates, journal)
src/features/library/components/EditGameDialog.tsx      (update personal data)
src/features/library/components/RemoveGameDialog.tsx    (confirmation dialog)
src/features/library/components/LibraryStats.tsx        (total games, completed, total hours)
src/features/library/components/StatusBadge.tsx         (Playing, Completed, On Hold, Dropped)
src/features/library/components/RatingDisplay.tsx       (1.0–10.0 display)
src/features/library/hooks/useLibrary.ts                (fetch, sort, filter, paginate)
src/features/library/hooks/useLibraryMutations.ts       (add, remove, update)
src/features/library/services/libraryService.ts         (frontend service)
src/features/library/types/index.ts
src/features/library/constants/index.ts
src/features/library/utils/libraryFilters.ts
src/features/library/utils/librarySorting.ts
```

### API Routes
```
src/app/api/library/route.ts                            (GET: user library, POST: add game)
src/app/api/library/[id]/route.ts                       (PATCH: update, DELETE: remove)
src/app/api/library/stats/route.ts                      (GET: computed statistics)
```

### Backend Services & Repositories
```
src/services/libraryService.ts                          (backend: add, remove, update, validate dupes)
src/services/libraryRepository.ts                       (DB queries for user_games)
```

### Library Page
```
src/app/(main)/library/page.tsx
src/app/(main)/library/loading.tsx
src/app/(main)/library/error.tsx
```

### Shared Hook
```
src/hooks/useInfiniteScroll.ts                          (reusable infinite scroll logic)
```

## Dependencies

- **M3**: Game system, game_catalog table, GameService, GameCard component

## Expected Result

- Users can add a game from the game page → fills rating, status, hours, dates
- Library page shows all added games
- Grid view (default) and list view toggle
- Sorting: Date Added, Started Date, Name (A–Z), Hours Played
- Filtering by status (Playing, Completed, On Hold, Dropped)
- Library search filters the user's own games
- Infinite scroll loads 50 games per page
- Editing a game updates hours, rating, status, dates
- Removing a game requires confirmation dialog
- Library statistics display: Total Games, Completed, Total Hours
- Duplicate game addition is prevented
- "Add to Library" button on game page works and shows "In Library" after
- Empty library shows cinematic empty state

## Testing Checklist

- [ ] Add game from game page → game appears in library
- [ ] Add same game again → validation error "Game already in library"
- [ ] Update status → badge changes immediately
- [ ] Update hours → display updates
- [ ] Update rating → display updates
- [ ] Remove game → confirmation dialog → game removed from library
- [ ] Removed game: "Add to Library" reappears on game page
- [ ] Grid view renders correctly
- [ ] List view renders correctly
- [ ] Sort by Date Added → correct order
- [ ] Sort by Name → alphabetical
- [ ] Sort by Hours Played → correct order
- [ ] Filter by "Completed" → only completed games shown
- [ ] Library search → instant filter within user's games
- [ ] Infinite scroll loads next 50 on scroll
- [ ] Stats compute correctly (Total Games, Completed, Total Hours)
- [ ] Empty library shows "Your journey hasn't begun yet."
- [ ] Responsive on mobile
- [ ] Game page shows "In Library" if game is in user's library

---

# Milestone 5 — Profiles

## Objective

Allow users to personalize their profile (avatar, bio, favorite game, favorite genre), enable public/private visibility, display library preview and stats, and apply dynamic genre-based theming.

## Files to Create

### Database Migrations
```
supabase/migrations/009_create_pinned_games.sql        (pinned_games table + RLS)
```

### Profile Feature Module
```
src/features/profile/components/ProfilePage.tsx         (main profile container)
src/features/profile/components/ProfileHero.tsx         (avatar, username, bio, favorite game)
src/features/profile/components/ProfileStats.tsx        (total games, completed, hours, genre, member since)
src/features/profile/components/ProfileLibraryPreview.tsx (top games from library)
src/features/profile/components/PinnedGames.tsx         (max 3 pinned games display)
src/features/profile/components/ProfileEmptyState.tsx   ("This player hasn't started their gaming journal yet.")
src/features/profile/components/ProfilePrivateState.tsx ("This profile is private.")
src/features/profile/components/ProfileSkeleton.tsx
src/features/profile/components/EditProfileDialog.tsx   (bio, favorite game, favorite genre)
src/features/profile/components/AvatarUpload.tsx        (custom upload or preset selection)
src/features/profile/components/PinGameDialog.tsx       (select up to 3 games to pin)
src/features/profile/components/ProfileCard.tsx         (compact card for search results)
src/features/profile/hooks/useProfile.ts                (fetch profile + stats)
src/features/profile/hooks/useProfileMutations.ts       (update profile fields)
src/features/profile/hooks/usePinnedGames.ts
src/features/profile/services/profileService.ts         (frontend service)
src/features/profile/types/index.ts
src/features/profile/constants/index.ts
src/features/profile/utils/profileValidation.ts
```

### API Routes
```
src/app/api/profiles/[username]/route.ts                (GET: public profile)
src/app/api/profiles/me/route.ts                        (GET: own profile, PATCH: update)
src/app/api/profiles/me/avatar/route.ts                 (POST: upload avatar)
src/app/api/profiles/me/pinned/route.ts                 (GET, PUT: pinned games)
src/app/api/profiles/me/stats/route.ts                  (GET: computed stats)
```

### Backend Services & Repositories
```
src/services/profileRepository.ts                       (DB queries for profiles)
src/services/pinnedGamesService.ts                      (manage pinned games)
src/services/pinnedGamesRepository.ts
src/services/avatarService.ts                           (upload to Supabase Storage)
```

### Profile Pages
```
src/app/(main)/profile/[username]/page.tsx              (public profile)
src/app/(main)/profile/[username]/loading.tsx
src/app/(main)/profile/[username]/not-found.tsx
```

### Settings Feature Module
```
src/features/settings/components/SettingsPage.tsx
src/features/settings/components/AccountSettings.tsx    (email, username, delete account)
src/features/settings/components/ProfileSettings.tsx    (bio, favorite game, favorite genre)
src/features/settings/components/AppearanceSettings.tsx (Light/Dark, reduced motion, perf mode)
src/features/settings/components/PrivacySettings.tsx    (profile visibility)
src/features/settings/components/AboutSection.tsx       (app info)
src/features/settings/components/DeleteAccountDialog.tsx
src/features/settings/hooks/useSettings.ts
src/features/settings/hooks/useSettingsMutations.ts
src/features/settings/services/settingsService.ts       (frontend)
src/features/settings/types/index.ts
src/features/settings/constants/index.ts
```

### API Routes (Settings)
```
src/app/api/settings/route.ts                           (GET, PATCH)
src/app/api/auth/delete-account/route.ts                (DELETE: cascade delete)
```

### Settings Page
```
src/app/(main)/settings/page.tsx
src/app/(main)/settings/loading.tsx
```

## Dependencies

- **M4**: Library, user_games table, library stats computation

## Expected Result

- Public profiles display at `/profile/shivaraj`
- Private profiles show "This profile is private."
- Profile hero shows avatar, username, bio, favorite game, favorite genre
- Stats section shows: Total Games, Completed, Total Hours, Favorite Genre, Member Since
- Pinned games display (up to 3) near the top
- Genre-based theme applies dynamically (accent colors change based on favorite genre)
- Avatar upload works (custom or preset)
- Bio limited to 100 chars
- Settings page works with all categories
- Profile visibility toggle (Public/Private)
- Reduced Motion toggle disables decorative animations
- Performance Mode toggle disables expensive effects
- Delete account with confirmation cascades all data

## Testing Checklist

- [ ] Visit own profile → all data displays
- [ ] Visit another user's public profile → data displays (read-only)
- [ ] Visit private profile → "This profile is private."
- [ ] Update bio (max 100 chars) → saves and displays
- [ ] Set favorite game → displays on profile
- [ ] Set favorite genre → theme colors change
- [ ] Upload avatar → displays immediately
- [ ] Select preset avatar → displays immediately
- [ ] Pin up to 3 games → display on profile
- [ ] Pin 4th game → error
- [ ] Stats calculate correctly from library
- [ ] Empty profile shows "This player hasn't started their gaming journal yet."
- [ ] Toggle visibility to Private → profile hidden from others
- [ ] Toggle Reduced Motion → decorative animations removed
- [ ] Toggle Performance Mode → heavy effects disabled
- [ ] Theme switches between Light/Dark
- [ ] Delete account → all data removed, redirected to login
- [ ] Delete account confirmation dialog requires explicit action
- [ ] Responsive on mobile
- [ ] Profile URL uses username slug

---

# Milestone 6 — Journal

## Objective

Allow users to create, edit, and delete personal journal entries for each game. Journal entries appear on game pages, profile pages, and in a timeline view.

## Files to Create

### Database Migrations
```
supabase/migrations/010_create_journal_entries.sql     (journal_entries + constraints + RLS)
```

### Journal Feature Module
```
src/features/journal/components/JournalCard.tsx         (game cover thumb, entry preview, date)
src/features/journal/components/JournalForm.tsx          (create/edit form, 280 char limit)
src/features/journal/components/JournalTimeline.tsx      (chronological list on profile)
src/features/journal/components/JournalEmptyState.tsx    ("Great adventures deserve to be remembered.")
src/features/journal/components/JournalSkeleton.tsx
src/features/journal/components/DeleteJournalDialog.tsx
src/features/journal/hooks/useJournal.ts                 (fetch entries)
src/features/journal/hooks/useJournalMutations.ts        (create, update, delete)
src/features/journal/services/journalService.ts          (frontend service)
src/features/journal/types/index.ts
src/features/journal/constants/index.ts
src/features/journal/utils/journalValidation.ts
```

### API Routes
```
src/app/api/journal/route.ts                             (GET: user's entries, POST: create)
src/app/api/journal/[id]/route.ts                        (PATCH: update, DELETE: delete)
src/app/api/journal/game/[gameId]/route.ts               (GET: entry for specific game)
```

### Backend Services & Repositories
```
src/services/journalService.ts                           (backend: create, update, delete, validate)
src/services/journalRepository.ts                        (DB queries for journal_entries)
```

### Integration Points (updates to existing files)
```
src/features/games/components/GamePage.tsx               (add journal section)
src/features/profile/components/ProfilePage.tsx          (add journal timeline)
src/features/library/components/AddGameDialog.tsx        (include journal entry field)
```

## Dependencies

- **M5**: Profiles, profile pages (journal timeline), game pages (journal display)

## Expected Result

- Each game in the library can have one journal entry (max 280 chars)
- Journal entries can be created when adding a game or later from the game page
- Editing updates `updated_at` while preserving `created_at`
- Journal entries appear on game pages and in the profile timeline
- Deleting a journal entry requires confirmation
- Public profiles show journal entries; private profiles hide them
- Entry previews truncate gracefully on cards
- Character counter shows remaining characters

## Testing Checklist

- [ ] Create journal entry for a game → appears on game page
- [ ] Create journal entry → appears in profile timeline
- [ ] Edit journal entry → `updated_at` changes, `created_at` preserved
- [ ] Delete journal entry → confirmation → removed
- [ ] Journal entry max 280 chars → validation enforced client + server
- [ ] One entry per game → second attempt updates existing
- [ ] Public profile shows journal entries
- [ ] Private profile hides journal entries from visitors
- [ ] Journal card shows game cover, text preview, last updated
- [ ] Empty journal → "Great adventures deserve to be remembered."
- [ ] Journal entry input sanitized (no HTML/scripts)
- [ ] Responsive on mobile
- [ ] Character counter displays correctly

---

# Milestone 7 — Collections

## Objective

Allow users to create, rename, and delete collections, add/remove games, and set per-collection visibility. Collections display on profile pages with auto-generated cover previews.

## Files to Create

### Database Migrations
```
supabase/migrations/011_create_collections.sql          (collections + RLS)
supabase/migrations/012_create_collection_games.sql     (collection_games + constraints + RLS)
```

### Collections Feature Module
```
src/features/collections/components/CollectionsPage.tsx
src/features/collections/components/CollectionCard.tsx   (name, game count, auto-cover)
src/features/collections/components/CollectionDetail.tsx  (full collection view)
src/features/collections/components/CollectionCover.tsx   (auto-generated from game covers)
src/features/collections/components/CreateCollectionDialog.tsx
src/features/collections/components/RenameCollectionDialog.tsx
src/features/collections/components/DeleteCollectionDialog.tsx
src/features/collections/components/AddToCollectionDialog.tsx  (select collection for a game)
src/features/collections/components/RemoveFromCollectionDialog.tsx
src/features/collections/components/CollectionEmptyState.tsx ("Every collection starts with one game.")
src/features/collections/components/CollectionSkeleton.tsx
src/features/collections/components/CollectionVisibilityToggle.tsx
src/features/collections/hooks/useCollections.ts
src/features/collections/hooks/useCollectionMutations.ts
src/features/collections/services/collectionService.ts    (frontend)
src/features/collections/types/index.ts
src/features/collections/constants/index.ts
src/features/collections/utils/collectionValidation.ts
```

### API Routes
```
src/app/api/collections/route.ts                         (GET: list, POST: create)
src/app/api/collections/[id]/route.ts                    (GET, PATCH: rename/visibility, DELETE)
src/app/api/collections/[id]/games/route.ts              (POST: add game, DELETE: remove game)
```

### Backend Services & Repositories
```
src/services/collectionService.ts                        (backend: CRUD, validate max 10)
src/services/collectionRepository.ts                     (DB queries)
```

### Collection Pages
```
src/app/(main)/collections/page.tsx                      (user's collections)
src/app/(main)/collections/loading.tsx
src/app/(main)/collections/[id]/page.tsx                 (collection detail)
src/app/(main)/collections/[id]/loading.tsx
```

### Integration Points
```
src/features/profile/components/ProfilePage.tsx          (add collections section)
src/features/games/components/GameActions.tsx             (add "Add to Collection" button)
```

## Dependencies

- **M6**: Journal (profile page structure complete), Game system, Library

## Expected Result

- Users can create up to 10 collections
- Collections have a name (max 100 chars) and visibility (Public/Private)
- Games can be added to multiple collections
- Same game can't be added to a collection twice
- Collection cards show auto-generated cover from game covers
- Deleting a game from library removes it from all collections
- Collections display on public profiles (if public)
- Deleting a collection requires confirmation

## Testing Checklist

- [ ] Create collection → appears in collections page
- [ ] Create 10 collections → 11th rejected with error
- [ ] Rename collection → name updates
- [ ] Delete collection → confirmation → removed (games unaffected)
- [ ] Add game to collection → appears in collection detail
- [ ] Add same game again → error "already in collection"
- [ ] Add game to multiple collections → works
- [ ] Remove game from collection → removed
- [ ] Delete game from library → removed from all collections
- [ ] Collection cover auto-generates from game covers
- [ ] Public collection visible on public profile
- [ ] Private collection hidden from visitors
- [ ] Collection visibility toggle works
- [ ] Empty collection → "Every collection starts with one game."
- [ ] Collection name max 100 chars enforced
- [ ] Responsive on mobile

---

# Milestone 8 — Search

## Objective

Complete the search experience with user search, improved game search ranking, suggestions, and filtering. Both game and user search results use infinite scrolling.

## Files to Create

### Search Feature Module (additions)
```
src/features/search/components/UserSearchResults.tsx
src/features/search/components/UserCard.tsx              (avatar, username, fav game, game count)
src/features/search/components/SearchTabs.tsx             (Games | Users tabs)
src/features/search/components/SearchFilters.tsx          (genre, platform, release year)
src/features/search/components/SearchEmptyState.tsx       ("Search for your next adventure.")
src/features/search/hooks/useUserSearch.ts
src/features/search/services/userSearchService.ts         (frontend)
```

### API Routes
```
src/app/api/search/users/route.ts                        (GET: search users by username)
src/app/api/search/games/route.ts                        (GET: enhanced game search with filters)
```

### Backend Services
```
src/services/searchService.ts                            (backend: user search, game search ranking)
src/services/searchRepository.ts                         (optimized search queries)
```

### Update Existing
```
src/app/(main)/search/page.tsx                           (add user search tab)
src/features/search/services/searchService.ts            (add user search)
```

## Dependencies

- **M7**: All user-facing features complete (profiles, library, collections, journal)

## Expected Result

- Search page has two tabs: Games and Users
- Game search: exact matches → starts-with → partial matches (ranked)
- Game search supports filters: genre, platform, release year
- User search by username only
- User cards show avatar, username, favorite game, game count
- Clicking a user card navigates to their public profile
- Both search types use infinite scroll (50 per page)
- Search suggestions appear while typing
- Search feels instantaneous (debounced, skeleton loading, cached)

## Testing Checklist

- [ ] Search games → results ranked: exact > starts-with > partial
- [ ] Filter by genre → only matching games shown
- [ ] Filter by platform → only matching platform shown
- [ ] Filter by release year → correct results
- [ ] Search users → results by username
- [ ] Click user card → navigates to `/profile/username`
- [ ] Private profiles don't appear in user search
- [ ] Both tabs infinite scroll at 50 per page
- [ ] Empty game search → "Search for your next adventure."
- [ ] Empty user search → appropriate message
- [ ] Search debounces at ~300ms
- [ ] Skeleton loaders during search
- [ ] Keyboard navigation through search results
- [ ] Responsive on mobile

---

# Milestone 9 — Administration

## Objective

Build the admin dashboard with user management, manual game approval/rejection, system logs, and admin logs. Only users with `admin` role can access.

## Files to Create

### Database Migrations
```
supabase/migrations/013_create_admin_logs.sql           (admin_logs + RLS)
supabase/migrations/014_create_system_logs.sql          (system_logs + RLS)
```

### Admin Feature Module
```
src/features/admin/components/AdminDashboard.tsx         (overview with stats)
src/features/admin/components/AdminGuard.tsx             (role-based access guard)
src/features/admin/components/UserManagement.tsx         (user table with search)
src/features/admin/components/UserDetailPanel.tsx
src/features/admin/components/ManualGameQueue.tsx        (pending submissions list)
src/features/admin/components/GameApprovalCard.tsx       (approve/reject controls)
src/features/admin/components/SystemLogViewer.tsx        (filterable log table)
src/features/admin/components/AdminLogViewer.tsx         (admin action history)
src/features/admin/components/AdminStats.tsx             (total users, games, collections, etc.)
src/features/admin/components/ModerationPanel.tsx        (remove journal/collection/profile)
src/features/admin/hooks/useAdmin.ts
src/features/admin/hooks/useManualGames.ts
src/features/admin/hooks/useLogs.ts
src/features/admin/services/adminService.ts              (frontend)
src/features/admin/types/index.ts
src/features/admin/constants/index.ts
```

### API Routes
```
src/app/api/admin/stats/route.ts                        (GET: platform statistics)
src/app/api/admin/users/route.ts                        (GET: user list)
src/app/api/admin/users/[id]/route.ts                   (GET: user detail, DELETE: remove)
src/app/api/admin/games/queue/route.ts                  (GET: pending submissions)
src/app/api/admin/games/queue/[id]/route.ts             (PATCH: approve/reject)
src/app/api/admin/logs/system/route.ts                  (GET: system logs)
src/app/api/admin/logs/admin/route.ts                   (GET: admin logs)
src/app/api/admin/moderate/route.ts                     (DELETE: remove content)
```

### Backend Services
```
src/services/adminService.ts                             (backend: all admin operations)
src/services/adminRepository.ts
src/services/systemLogService.ts                         (log system events)
src/services/adminLogService.ts                          (log admin actions)
src/services/systemLogRepository.ts
src/services/adminLogRepository.ts
```

### Admin Pages
```
src/app/(main)/admin/page.tsx                            (admin dashboard)
src/app/(main)/admin/layout.tsx                          (admin layout with sidebar)
src/app/(main)/admin/users/page.tsx
src/app/(main)/admin/games/page.tsx                      (manual game queue)
src/app/(main)/admin/logs/page.tsx
src/app/(main)/admin/loading.tsx
```

### Integration: Logging Middleware
```
src/lib/logger.ts                                        (structured logging utility)
```

## Dependencies

- **M8**: All features complete (search, profiles, library, journal, collections)

## Expected Result

- Admin dashboard shows: Total Users, Total Games, Total Collections, Most Added Games, Daily Active Users
- User management: list users, view details, remove content
- Manual game queue: view pending, approve → inserts into game_catalog, reject → stores reason
- System logs: filterable by level, source, date
- Admin logs: immutable history of admin actions
- Non-admin users are blocked from admin routes (403)
- Admin moderation: remove journal entries, collections, or profiles
- Every admin action is logged to admin_logs

## Testing Checklist

- [ ] Non-admin user visits `/admin` → blocked / 403
- [ ] Admin user visits `/admin` → dashboard loads
- [ ] Dashboard stats display correctly
- [ ] User list displays with search
- [ ] View user detail panel
- [ ] Manual game queue shows pending submissions
- [ ] Approve game → inserted into game_catalog, status = Approved
- [ ] Reject game → reason stored, status = Rejected
- [ ] System logs display and filter by level
- [ ] Admin logs display chronologically
- [ ] Every admin action creates an admin_log entry
- [ ] Moderate: remove journal entry → entry deleted, logged
- [ ] Moderate: remove collection → collection deleted, logged
- [ ] Admin cannot modify user ratings, hours, or library data
- [ ] Responsive on mobile (admin pages use tables, simplified on small screens)

---

# Milestone 10 — Polish & Release

## Objective

Optimize performance, complete accessibility review, fix bugs, finalize documentation, and prepare for production deployment.

## Files to Create / Update

### Performance
```
src/app/(main)/page.tsx                                  (finalize Home Dashboard: "Continue Your Journey")
src/features/library/components/LibraryPage.tsx          (optimize re-renders)
(Various) — audit all Next.js Image usage, add loading="lazy"
(Various) — audit dynamic imports / React.lazy for heavy modules
(Various) — verify Server Components used where possible
```

### Home Dashboard
```
src/features/home/components/ContinueJourney.tsx         (recently updated games section)
src/features/home/components/HomeEmptyState.tsx           (encouraging first-time CTA)
src/features/home/hooks/useRecentGames.ts
src/features/home/services/homeService.ts
```

### Accessibility Audit
```
(Various) — add aria-labels to all icon-only buttons
(Various) — verify focus indicators on all interactive elements
(Various) — verify minimum 44×44px touch targets
(Various) — test keyboard navigation flow on every page
(Various) — verify Reduced Motion disables all decorative animations
```

### SEO
```
src/app/layout.tsx                                       (meta tags, Open Graph, structured data)
src/app/(main)/game/[slug]/page.tsx                     (game-specific meta)
src/app/(main)/profile/[username]/page.tsx              (profile-specific meta)
public/robots.txt
public/sitemap.xml                                       (or dynamic generation)
```

### Error States (finalize)
```
src/app/offline/page.tsx                                 (connection lost page)
(Various) — verify all API calls have proper error handling
(Various) — verify all forms show error toasts on failure
```

### Documentation
```
docs/Decision_log.md                                     (finalize all entries)
docs/API_documentation.md                                (optional: document all API routes)
README.md                                                (update with setup instructions)
```

### Deployment Configuration
```
.env.production                                          (production environment template)
next.config.ts                                           (production optimizations, image domains)
```

## Dependencies

- **M9**: All features complete

## Expected Result

- Home dashboard shows "Continue Your Journey" with recently updated games
- All pages load with skeleton → content (no blank screens)
- All images lazy-load and use Next.js Image
- Bundle size optimized (heavy modules lazy-loaded)
- Full keyboard navigation on every page
- Screen reader support verified
- Reduced Motion fully functional
- All error states handled gracefully
- SEO metadata on every page
- Documentation complete and synchronized
- Application is production-ready

## Testing Checklist

### Performance
- [ ] Lighthouse performance score ≥ 90
- [ ] First Contentful Paint < 1.5s
- [ ] No layout shifts
- [ ] All images use Next.js Image
- [ ] Heavy modules lazy-loaded (admin, settings, large dialogs)
- [ ] No unnecessary re-renders (React DevTools profiler)

### Accessibility
- [ ] Keyboard navigation works on every page
- [ ] All interactive elements have visible focus indicators
- [ ] All icon-only buttons have aria-labels
- [ ] Minimum 44×44px touch targets
- [ ] Screen reader announces meaningful labels
- [ ] Reduced Motion removes all decorative animations
- [ ] High contrast text meets WCAG AA

### Functional
- [ ] Complete user journey: Register → Search → Add Game → Update → Journal → Collection → Profile → Search User → View Profile
- [ ] Delete account cascade removes all data
- [ ] Admin flow: approve game → available to all users
- [ ] All empty states display correctly
- [ ] All error states display correctly
- [ ] Offline behavior: existing content stays, errors are friendly

### Documentation
- [ ] All architecture docs match implementation
- [ ] Decision log is complete
- [ ] README has setup instructions
- [ ] Environment variables documented

### Deployment
- [ ] Production build succeeds
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies verified
- [ ] SSL configured
- [ ] Domain configured

---

## Summary

| Milestone | Tables Created | API Routes | Feature Components | Est. Files |
|---|---|---|---|---|
| M1 Foundation | 0 | 0 | ~30 shared | ~65 |
| M2 Authentication | 3 (profiles, user_roles, settings) | 5 | ~10 | ~25 |
| M3 Game System | 2 (game_catalog, manual_submissions) | 3 | ~15 | ~30 |
| M4 Library | 1 (user_games) | 3 | ~20 | ~30 |
| M5 Profiles | 1 (pinned_games) | 5 | ~25 | ~40 |
| M6 Journal | 1 (journal_entries) | 3 | ~10 | ~20 |
| M7 Collections | 2 (collections, collection_games) | 3 | ~15 | ~25 |
| M8 Search | 0 | 2 | ~8 | ~15 |
| M9 Administration | 2 (admin_logs, system_logs) | 8 | ~15 | ~30 |
| M10 Polish | 0 | 0 | ~5 + updates | ~20 |
| **Total** | **12 tables** | **32 routes** | **~153 components** | **~300 files** |

---

> **No implementation code will be written until this plan is approved.**
