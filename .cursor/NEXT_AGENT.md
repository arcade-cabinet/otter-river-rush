# NEXT AGENT — OTTER RIVER RUSH (React Three Fiber)

Status: ✅ PRODUCTION READY
Mode: Development
Tech Stack: React Three Fiber + TypeScript + Miniplex ECS

---

## Project Overview

Otter River Rush is a mobile-first 3D endless runner game built with React Three Fiber.

### Architecture

- **Rendering**: React Three Fiber (R3F) with Three.js
- **State**: Zustand for global state, Miniplex for ECS
- **3D Models**: GLB format with embedded animations
- **Audio**: Howler.js with haptic feedback
- **Build**: Vite + pnpm monorepo
- **Mobile**: Capacitor for Android/iOS

### Workspace Structure

```
/src/client          - Game runtime (React Three Fiber app)
/src/dev-tools       - Asset generation tools (Meshy AI, Sharp)
```

---

## What to Do (Current Priorities)

### 1. Platform Testing (CRITICAL)

- Android APK has never been tested on real device
- Desktop builds (Linux, macOS, Windows) need verification
- See `.github/URGENT_TESTING_NEEDED.md` for checklist

### 2. Performance Optimization

- Fine-tune mobile rendering for consistent 60fps
- Optimize 3D model LOD for mobile devices
- Reduce bundle size where possible

### 3. Content Expansion

- Add more biomes, obstacles, power-ups
- Create additional otter animations
- Expand level pattern variety

---

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview production build

# Testing
pnpm test             # Unit tests (Vitest)
pnpm test:e2e         # E2E tests (Playwright)

# Code Quality
pnpm lint             # ESLint
pnpm type-check       # TypeScript checking
pnpm verify           # Full verification (lint + typecheck + test)
```

---

## Key Files

### Game Components

- `src/client/src/components/game/GameCanvas.tsx` - R3F canvas setup
- `src/client/src/components/game/EntityRenderer.tsx` - GLB model rendering
- `src/client/src/components/game/Terrain.tsx` - PBR terrain

### ECS Systems

- `src/client/src/ecs/systems.tsx` - Core ECS management
- `src/client/src/ecs/world.ts` - Entity definitions

### UI Components

- `src/client/src/components/ui/MainMenu.tsx` - Game mode selection
- `src/client/src/components/ui/GameHUD.tsx` - In-game UI

---

## Constraints

- Mobile-first design (touch controls, responsive UI)
- Privacy-first (local storage only, no tracking)
- PWA-ready (offline support, installable)
- Performance target: 30+ FPS on mid-range mobile devices

---

## Documentation

- `README.md` - Project overview and quick start
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/MOBILE_FIRST_DESIGN.md` - Mobile design principles
- `docs/TESTING.md` - Testing guide
- `docs/memory-bank/` - Development context and history
