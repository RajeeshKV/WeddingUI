# Ever After Wedding Website Demo

Premium React + Vite wedding invitation demo with Tailwind CSS, Framer Motion, a dedicated gallery page and ten selectable visual animation presets.

## Run locally
1. Install Node.js 20 or newer.
2. Extract the ZIP and open a terminal in the project directory.
3. Run `npm install`.
4. Run `npm run dev`.
5. Run `npm run build` to verify production output.

## Vercel
Push to GitHub, import the repository in Vercel, select Vite, use `npm run build` and `dist` as output. No environment variables are needed for this frontend demo.

## Ten animation / style directions
Use the **Animation** menu in the fixed header:
1. Editorial Classic
2. Cinematic
3. Botanical
4. Parallax
5. Curtain Reveal
6. Floating Paper
7. Minimal Luxe
8. Analog Film
9. Falling Petals
10. Typography First

Selection is reflected in the `?style=` URL parameter, so a chosen direction can be shared manually. The layout stays consistent while entrance motion and decorative treatment vary.

## Gallery
The Gallery navigation opens `/gallery`, a dedicated responsive page with its own editorial masonry-inspired layout and image lightbox. Vercel's Vite SPA fallback handles this route by default.

## Important
This is a frontend prototype. RSVP is not persisted to an API, selected photos are local previews only, and sound is UI-only. Sample names, date, venue and stock photography must be replaced before a real client launch. Connect backend persistence and object storage before collecting real guest information or photo uploads.
