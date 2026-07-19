# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npx vitest run` | Run all tests once |
| `npx vitest` | Run tests in watch mode |
| `npx astro check` | Type-check Astro files and all `.ts/.tsx` |
| `npx wrangler pages dev dist` | Local Cloudflare Pages parity check (run after `build`) |
| `npx prettier --write .` | Format the codebase |

The `vitest` config lives in `vitest.config.ts` — environment is `jsdom`, test files live under `test/**/*.test.{ts,tsx}` (none exist yet; `passWithNoTests: true`).

## Tech Stack

- **Framework**: Astro 5 (SSG/SSR, View Transitions)
- **Interactive islands**: Preact (`*.tsx` with `client:*` directives)
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **Testing**: Vitest + Testing Library (`@testing-library/preact`, `jsdom`)
- **Runtime target**: Cloudflare Pages (also serves Pages Functions for API)
- **TypeScript**: Strict mode via `astro/tsconfigs/strict`, Preact JSX transform (`react-jsx` with `jsxImportSource: preact`)

## Code Architecture

### Routing and page composition (`src/pages/`)

- `index.astro` — Home page (Hero + Timeline)
- `blog.astro` — Blog list page (articles, moments, notes with sidebar)
- `about.astro` — About/resume page
- `experience.astro` — Experience/timeline page
- `posts/[slug].astro` — Individual blog post pages
- `tags/[tag].astro` — Per-tag filtered post lists
- `rss.xml.js` — RSS feed
- `search.json.ts` — Search index JSON
- `api/ai/chat.ts` — AI chat API endpoint (OpenAI-compatible)

### Component organization

Components are grouped by the page they belong to, plus shared modules:

- `src/components/index-page/` — hero + timeline
- `src/components/blog-page/` — content views (Article/Moment/Note), post shell, sidebar (tags, heatmap, profile), modals
- `src/components/about-page/` — resume workbench (editor topbar, code panels, language toggle)
- `src/components/experience-page/` — hero, section TOC, project/pub/research lists
- `src/components/shared/` — cross-cutting modules:
  - **Dock system** (`dock/`): layered architecture — `data/` (store, constants, storage), `logic/` (controller, visibility, activity, actions), `ui/` (Dock.astro, DockItem, items)
  - **Terminal** (`terminal/`): terminal modal with command system
  - **Dynamic island** (`dynamic-island/`): shell + Preact island for notifications
  - **Bot** (`bot/`): AI assistant floating button
  - **Icons** (`icons/`): per-page icon sets
  - **Footer**, **Social** — global blocks
- `src/components/mobile/` — mobile-specific variants (dock, drawer, FAB)

### Interactive islands pattern

Preact islands (`.tsx` files mounted via `client:load` or `client:idle`) handle all client-side interactivity. The naming convention uses an `*Island.tsx` suffix (e.g., `TimelineRevealIsland.tsx`, `BlogSidebarIsland.tsx`). They are mounted inside `.astro` components.

### Data and content

- **Blog posts**: Markdown files in `src/blog/` with frontmatter fields defined in `src/content.config.ts` (title, pubDate, description, author, tags, series, draft, docked, etc.)
- **Static domain data**: TypeScript files in `src/data/` — `development.ts` (timeline entries), `about.ts` (resume), `experience.ts`, `notes.ts`, `moments.ts`
- **Data is consumed** via `getCollection("blog")` from `astro:content` and direct imports from `src/data/`

### Tag system

Hierarchical tags with `/` path separators (e.g., `frontend/react`). Utilities in `src/utils/tags.ts` handle:
- `tagToSlug()` — normalizes tags to URL-safe slugs (supports Chinese characters)
- `buildTagTree()` — builds a tree structure from flat tag paths
- `getPostsByTagPath()` — matches posts by tag prefix

### Layout

- **`BaseLayout.astro`** (`src/layouts/`) is the global shell: theme initialization, Dock, DynamicIsland, TerminalModal, Footer, PlayBot, client scripts
- Theme: light/dark/auto, persisted in localStorage under key `"theme"`, managed by `src/scripts/theme/`
- Client scripts: `globalShortcuts.js`, `registerSw.ts` (service worker registration)

### Styling conventions

- Custom CSS variables for light/dark themes in `src/styles/global.css`
- Component-specific styles use `<style is:global>` blocks in `.astro` files
- Tailwind utility classes + DaisyUI component classes throughout

### API: AI Chat (`/api/ai/chat`)

Dual implementation — both an **Astro API route** (`src/pages/api/ai/chat.ts`) and a **Cloudflare Pages Function** (`functions/api/ai/chat.ts`) for identical behavior:
- POST with JSON body (`{ messages, stream, threadId }`)
- GET via query params (`q`, `h`) or headers (`x-ai-question`, `x-ai-history`)
- Streaming SSE support for POST with `stream: true`
- OpenAI-compatible, configurable via env vars: `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_BASE_URL`

### Dock system architecture

The dock is a macOS-style app launcher with pinned + dynamic items:
- **Storage**: localStorage-based persistence of items and positions
- **Activity**: tracks open/close/minimize for document-style items
- **Visibility**: show/hide toggles and focus management
- **Controller**: orchestrates store, activity, visibility, and actions
- Cleanup via event listener removal on `astro:page-load` rebinding

### Deployment

Deployed to Cloudflare Pages with `wrangler.toml`:
- Build: `npm ci && npm run build`, output dir: `dist`
- Required env vars: `OPENAI_API_KEY`
- Optional: `OPENAI_MODEL`, `OPENAI_BASE_URL`

## Commit conventions

Use conventional commits: `feat(scope): ...`, `fix(scope): ...`, `chore: ...`, `refactor(scope): ...`, `docs: ...`. Scopes match component groups or subsystems (e.g., `dock`, `blog`, `terminal`, `about`).
