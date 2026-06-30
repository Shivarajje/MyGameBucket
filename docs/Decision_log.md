# Decision Log

This document records the architectural and design decisions made throughout the development of MyGameBucket.

## Version 1 Decisions

| Date | Topic | Decision | Rationale |
|---|---|---|---|
| 2026-06-29 | Animation | **400ms duration** | Balanced compromise between snappy (350ms) and cinematic (700ms). |
| 2026-06-29 | Collections | **No custom descriptions** | Followed Product Requirements over Database Schema to keep UI clean. |
| 2026-06-29 | Collections | **Auto-generated covers** | Approved by user; provides visual richness without upload overhead. |
| 2026-06-29 | Pinned Games | **New `pinned_games` table** | Separation of concerns: pinning is a profile presentation feature, not library metadata. |
| 2026-06-29 | Genre Mapping | **Theme Engine Mapping** | `game_catalog` stores raw API genres; Theme Engine maps these to the 13 supported internal Theme Categories. |
| 2026-06-29 | Admin Roles | **New `user_roles` table** | Clean separation of authorization concerns. Supports scaling roles later. |
| 2026-06-29 | Fonts | **Inter** | Highly readable, modern, pairs well with cinematic dark interfaces. |
| 2026-06-29 | Project Structure | **`src/` directory adopted** | Cleaner separation of application code from Next.js root config files. |
| 2026-06-29 | Settings | **Light / Dark mode only** | Simplifies implementation; "System" removed per user approval. |
