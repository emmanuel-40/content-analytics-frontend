# Content Analytics — Frontend

Black-and-yellow SPA for the Content Analytics backend. Built with React 19,
TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Router and STOMP
WebSocket progress.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:3000
```

The API must be running on `http://localhost:8080` (see the sibling
`content-analytics-backend` project). Set `VITE_API_URL=/` to use the Vite dev
proxy instead of calling port 8080 directly.

```bash
npm run build        # type-check + production bundle in dist/
npm run preview      # serve the production bundle
npm run lint
```

## Design system

- Background: near-black (`ink-950` → `ink-800`) with thin borders and soft glow.
- Accent: signal yellow (`signal-300` → `signal-600`) used sparingly for actions,
  highlights and active states.
- Typography: Space Grotesk headings, DM Sans body.
- Tokens live in `src/index.css` (`@theme`); primitives in `src/components/ui`.

## Architecture

- `src/lib/api.ts` — typed fetch client: credentials, CSRF bootstrap, error mapping.
- `src/lib/queryClient.ts` — TanStack Query defaults + central query keys.
- `src/hooks` — auth session, document jobs, WebSocket subscriptions.
- `src/components/landing` — landing page, including the auto-rotating product carousel.
- `src/pages` — route-level screens (auth, dashboard, documents, billing, settings).

Auth uses HttpOnly JWT cookies; there is no token in `localStorage`. CSRF is
read from the backend before mutations. Google sign-in is a backend redirect
and returns to `/auth/callback?status=...`.

## Environment

| Variable | Meaning | Default |
|---|---|---|
| `VITE_API_URL` | Backend origin (`/` uses the dev proxy) | `http://localhost:8080` |
| `VITE_WS_URL` | STOMP endpoint origin | derived from API URL |
| `VITE_PAYSTACK_PUBLIC_KEY` | Optional inline checkout key | empty |
| `VITE_GOOGLE_OAUTH_URL` | Backend OAuth entry point | `/oauth2/authorization/google` |

`NEXT_PUBLIC_API_URL` is also accepted as an alias to match the backend docs.
