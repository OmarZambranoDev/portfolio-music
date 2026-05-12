# Portfolio Music

[![CI](https://github.com/OmarZambranoDev/portfolio-music/actions/workflows/ci.yml/badge.svg)](https://github.com/OmarZambranoDev/portfolio-music/actions/workflows/ci.yml)

Music library and player micro-frontend remote for the portfolio platform. Built with Vite + React + TypeScript, deployed as a Module Federation remote.

## Overview

- 200 tracks with search, sort, and filter
- Playlist creation, editing, and management
- Persistent playback state with mock audio progress
- Earth-tone theme with shared `@OmarZambranoDev/portfolio-ui` components
- Module Federation remote consumed by the Vite host shell
- Mobile-responsive with bottom navigation and condensed player
- Unit tests with Vitest, E2E tests with Playwright, Lighthouse CI

## Tech Stack

| Category   | Technology                            |
| ---------- | ------------------------------------- |
| Framework  | React 18.2                            |
| Build Tool | Vite 5                                |
| Language   | TypeScript 5.2                        |
| Styling    | Tailwind CSS 3.4                      |
| State      | Zustand 4.5                           |
| Icons      | Lucide React                          |
| Shared UI  | `@OmarZambranoDev/portfolio-ui`       |
| Testing    | Vitest + Testing Library + Playwright |
| CI         | GitHub Actions + Lighthouse CI        |

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub Packages access for `@OmarZambranoDev/portfolio-ui`

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs on **http://localhost:3002** with CORS enabled.

### Build

```bash
npm run build
```

Outputs to `dist/` with Module Federation `remoteEntry.js`.

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

Unit tests

```bash
npm test
```

E2E tests

```bash
npx playwright test
```

### Lighthouse

```bash
npm run lhci
```

## Module Federation

| Config       | Value                      |
| ------------ | -------------------------- |
| Name         | `music`                    |
| Remote Entry | `remoteEntry.js`           |
| Exposes      | `./MusicApp` → `./src/App` |
| Deployed URL | `[VERCEL_URL]`             |

Shared dependencies (singletons):

- `react`
- `react-dom`
- `@OmarZambranoDev/portfolio-ui`
- `zustand`

## Project Structure

```
src/
├── components/
│ ├── Layout/
│ │ ├── LibrarySidebar.tsx
│ │ ├── PlaybackBar.tsx
│ │ └── MobileLayout.tsx
│ ├── Library/
│ │ ├── AllSongsView.tsx
│ │ ├── PlaylistView.tsx
│ │ ├── PlaylistModal.tsx
│ │ ├── TrackRow.tsx
│ │ ├── SeekBar.tsx
│ │ └── PlaybackControls.tsx
│ └── Mobile/
│ ├── MobileLibraryView.tsx
│ ├── MobileSearchView.tsx
│ ├── MobileProfileView.tsx
│ ├── SearchTrackResult.tsx
│ ├── CondensedPlaybackBar.tsx
│ └── ExpandedPlayer.tsx
├── hooks/
│ ├── useIsMobile.ts
│ ├── usePlaylistModals.ts
│ ├── useTrackActions.ts
│ ├── usePlaybackProgress.ts
│ └── useSwipeBack.ts
├── store/
│ └── musicStore.ts
├── types/
│ └── index.ts
├── utils/
│ ├── fallbackTracks.ts
│ ├── generateMockTracks.ts
│ └── formatTime.ts
├── e2e/
│ ├── desktop/
│ │ ├── layout.spec.ts
│ │ ├── playback.spec.ts
│ │ └── playlists.spec.ts
│ └── mobile/
│ └── layout.spec.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Scripts

| Script       | Description                              |
| ------------ | ---------------------------------------- |
| `dev`        | Start dev server on port 3002            |
| `build`      | TypeScript check + Vite production build |
| `preview`    | Preview production build                 |
| `test`       | Run Vitest unit tests                    |
| `test:watch` | Run tests in watch mode                  |
| `lint`       | Run ESLint with max-warnings 0           |
| `format`     | Run Prettier on source files             |
| `lhci`       | Build and run Lighthouse CI audit        |

## Deployment

Deployed to Vercel with CORS headers configured in `vercel.json`.

## License

MIT
