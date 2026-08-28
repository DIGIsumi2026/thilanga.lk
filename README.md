# Lawyer Demo Recreation — React + TypeScript

A React/TypeScript recreation built from the supplied screen-recording reference. The architecture intentionally separates pages, page sections and page-specific CSS.

## Stack
- React + TypeScript + Vite
- React Router
- GSAP (hero timelines / high-control motion)
- Anime.js (Crafto-style staggered entrance animations)
- Framer Motion (route/menu transitions)
- Swiper (practice-area carousel)
- Lenis (smooth scrolling)
- Lucide React (icons)
- Express + TypeScript (small temporary backend)

## Why Anime.js is included
The visual reference matches Crafto's Lawyer demo. Crafto's own animation documentation uses `data-anime` entrance effects such as translateY + opacity + stagger. For that reason Anime.js is a good fit for matching the original reveal feel. GSAP is kept for the hero and more precise timelines rather than replacing Anime.js everywhere.

## Font system
The recreation uses **DM Serif Display** for editorial serif headings and **Inter** for interface/body copy. This pairing is chosen from close visual inspection of the supplied video. If you own the original Crafto package and want byte-for-byte typography parity, replace these two font declarations in `frontend/src/styles/global.css` with the licensed font declarations from the original demo CSS.

## Project structure
```text
lawyer-demo-clone/
├─ frontend/
│  ├─ src/
│  │  ├─ assets/
│  │  │  ├─ images/
│  │  │  ├─ videos/
│  │  │  ├─ imageAssets.ts
│  │  │  └─ videoAssets.ts
│  │  ├─ components/common/
│  │  ├─ data/
│  │  ├─ hooks/
│  │  ├─ lib/
│  │  ├─ pages/
│  │  │  ├─ Home.tsx
│  │  │  ├─ About.tsx
│  │  │  ├─ PracticeAreas.tsx
│  │  │  ├─ Attorneys.tsx
│  │  │  ├─ Journal.tsx
│  │  │  └─ Contact.tsx
│  │  ├─ sections/
│  │  │  ├─ home/
│  │  │  ├─ about/
│  │  │  ├─ practice/
│  │  │  ├─ attorneys/
│  │  │  ├─ journal/
│  │  │  └─ contact/
│  │  └─ styles/
│  │     ├─ global.css
│  │     ├─ home.css
│  │     ├─ about.css
│  │     ├─ practice.css
│  │     ├─ attorneys.css
│  │     ├─ journal.css
│  │     └─ contact.css
│  └─ package.json
├─ backend/
│  ├─ src/routes/contact.ts
│  ├─ src/server.ts
│  └─ package.json
└─ package.json
```

## Run it
### Option A — terminals separately
```bash
cd frontend
npm install
npm run dev
```
In another terminal:
```bash
cd backend
npm install
npm run dev
```

### Option B — root helper
```bash
npm run install:all
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## Animation mapping from the video
- Hero: full-screen dark legal imagery, image scale settling, clipped line-by-line text reveal, timed slide change, minimal numbered pagination.
- Header: transparent overlay, underline hover, compact white dropdown/mega cards, mobile accordion menu.
- Scroll sections: upward translate + opacity entrance, staggered group timing.
- Practice areas: dark navy horizontal image carousel with circular arrows and image zoom-on-hover.
- Statistics: count-up animation when entering the viewport.
- Achievement content: compact accordion with subtle open/close transition.
- Expertise: split dark/image layout with floating testimonial card.
- Attorneys/blog: stagger reveal and lift/zoom hover behavior.
- Page navigation: short Framer Motion opacity transitions.
- Smooth scrolling: Lenis.

## Centralized media asset rule
All images and videos are registered centrally. Components, sections, pages, and data files must **never** import media files directly.

Images:
```ts
import { imageAssets } from '../assets/imageAssets';
```

Videos:
```ts
import { videoAssets } from '../assets/videoAssets';
```

When adding a new image, place the physical file in `frontend/src/assets/images/`, register it in `imageAssets.ts`, then use `imageAssets...` everywhere else. When adding a video, place it in `frontend/src/assets/videos/`, register it in `videoAssets.ts`, then use `videoAssets...` everywhere else.

## Asset note
The included images are cropped visual-reference assets made from the user-supplied demo recording so the starter project stays self-contained. Replace them with your final licensed/high-resolution photography before production deployment.
