# NautilusOS

**Explore Your Digital Ocean** — A browser-based operating system inspired by the mysteries of the deep sea.

Built with Next.js, TypeScript, and an ocean of curiosity.

## Features

- **Lock Screen** — Password-protected session with live clock, date, animated Nautilus logo, and dynamic wallpaper backdrop
- **Desktop Environment** — Windowed multitasking with drag, minimize, maximize, and close
- **Ocean Background** — Animated canvas with bubbles, plankton particles, light caustics, and a shifting deep-sea floor — all overlaying your chosen wallpaper
- **Wallpaper System** — 5 ocean-themed SVG wallpapers switchable from Settings (Deep Blue, Abyssal, Coral Reef, Aurora, Sunlight)
- **Apps**
  - **Explorer** — Virtual file browser with folders, files, and context menus
  - **Browser** — Minimal web viewer
  - **Notes** — Persistent note-taking with local storage
  - **Music** — Ambient sound player with visualizer
  - **Timer** — Pomodoro-style focus timer with ring progress
  - **Calculator** — Full expression calculator
  - **Lighthouse** — AI chat companion
  - **Settings** — Appearance (wallpapers, effects), system info, data management
- **Tidebar** — Bottom taskbar with app launcher, running tasks, clock, and notification center
- **Sonar Search** — Spotlight-style app/search launcher
- **Bottled Messages** — Toast notification system
- **Welcome App** — First-run onboarding with app overview

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On first run, set a password to lock your session. Press Enter to unlock.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Built With

- [Next.js](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Three.js](https://threejs.org/) — 3D rendering (via @react-three/fiber)
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling (PostCSS)

## Project Structure

```
src/
├── app/            # Next.js routing & global styles
├── components/
│   ├── apps/       # Individual application windows
│   └── ...         # Shell components (Tidebar, LockScreen, etc.)
├── hooks/          # Desktop state management
└── lib/            # Types, icons, file system, audio engine
public/
├── images/         # Nautilus logo
└── wallpapers/     # SVG wallpapers
```

## Design

NautilusOS uses a deep-ocean color palette with glassmorphism UI elements. The ambient canvas renders live particle effects that overlay the user's selected wallpaper, creating a layered underwater atmosphere.

## License

MIT
