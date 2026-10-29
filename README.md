# Shahzaib — Premium 3D Developer Portfolio

A responsive portfolio built with React, TypeScript, Vite, Three.js via React Three Fiber, Rapier physics, GSAP, and semantic HTML.

## Run locally

1. Install Node.js 20 or newer.
2. In this directory run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. Run `npm run build` to create the production bundle in `dist/`.

## Before publishing

- Confirm the canonical domain in `index.html` (`https://shahzaib315.site.je/`) is the domain you will use.
- Replace concept projects in `src/App.tsx` with real projects and working URLs.
- Update contact email if it changes.
- Deploy the generated `dist/` directory to Cloudflare Pages or Vercel. This is a Vite/React app, so deploy the built output rather than the source folder for static hosting.

## Notes

The 3D character is procedurally built from Three.js primitives, so no external model file is needed. Tech spheres use Rapier rigid-body physics. The desktop work section pins horizontally with GSAP ScrollTrigger; on smaller screens it becomes a native horizontal scroller. A reduced-motion preference is respected.
