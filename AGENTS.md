<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MyGameBucket Project Conventions

1. **Architecture**: Feature-based modular architecture (`src/features/*`).
2. **Business Logic**: Exclusively in the `services/` layer. React components and API routes MUST NOT contain business logic.
3. **Database Access**: Exclusively via `services/*Repository.ts` files or Supabase SDK in backend services.
4. **Theming**: Relies on CSS variables in `globals.css` and the `ThemeProvider` context. Do not hardcode colors; use Tailwind semantic colors (e.g., `bg-primary`, `text-muted-foreground`).
5. **State**: Server Components fetch data; Client Components (`'use client'`) use React hooks. Pass data as props where possible.
6. **Documentation**: Always consult the `/docs` folder for architectural decisions and the `Decision_log.md` for resolved contradictions.

