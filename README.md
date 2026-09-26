# Something’s Working — webpage mockup

A single-page Next.js mockup of the Something’s Working design. It pairs an Instrument Serif wordmark with a full-screen, 2D force-directed graph powered by [`@jonobr1/force-directed-graph`](https://github.com/jonobr1/force-directed-graph) and Three.js.

## Run locally

Install Node.js and npm, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js (usually `http://localhost:3000`). To check and serve a production build:

```bash
npm run build
npm run start
```

## How it works

- `app/page.tsx` renders the corner labels, slogan, and wordmark. The two “o” letters cycle through regular and italic styles once per second.
- `app/graph-background.tsx` creates a 600-node graph on the client. All nodes participate from the start; the canvas fades in with GSAP after its first simulation tick.
- The graph keeps `decay` at `1` and switches `damping` directly between `0.7` and `1.005` every second. The values are discrete, with no tween between them.
- `app/globals.css` controls the page layout and typography. Font files come from the installed Fontsource packages, so they do not rely on a runtime Google Fonts request.

Graph count, camera distance, warmup ticks, force values, and damping are set near the top of `app/graph-background.tsx` or in its setup block. The corner labels are visual placeholders; destinations and additional pages have not been wired up.
