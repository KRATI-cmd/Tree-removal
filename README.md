# Ironwood Tree & Storm — Landing Page

React 19 + Vite + Tailwind CSS v4.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Before launch

- **Business details** (phone, license, insurance, ISA IDs, service areas): `src/data/site.js`
- **Lead delivery**: set `VITE_LEAD_ENDPOINT` in `.env.local` to a URL that accepts a JSON POST
  (`{ emergency, hazard, phone, zip, source, submittedAt }`). Without it, submissions are simulated and logged to the console.
- **Calculator pricing**: `HEIGHTS` / `LOCATIONS` ranges in `src/components/Calculator.jsx`
- **Reviews, stats, equipment specs**: placeholder copy in their components — replace with real data.

## 3D scenes & loader

- `src/three/stormScene.js`: hero storm (instanced pine forest with shader wind, rain, lightning). Mouse steers the wind; clicking the sky strikes lightning.
- `src/three/treePreview.js`: calculator 3D preview (drag to rotate); reacts to height, hazard and stump choices.
- Both are lazy-loaded via `src/lib/useThreeScene.js`, pause when off-screen, and fall back to the static design without WebGL. With `prefers-reduced-motion`, the storm renders a still frame and never flashes.
- The page loader lives inline in `index.html` (so it shows before JS) and is dismissed by `src/lib/loader.js`, after at least 1.1 s and at most 3 s.

## Theme & story animation

- Palette: forest green base (`--color-forest-*` in `src/index.css`) with orange accents; Services and Reviews are the orange bands.
- `src/components/StormStory.jsx`: scroll-driven "How It Works" illustration (storm → call → crane lift → chipping → tarp & insurance). With reduced motion it becomes click-through still frames.
