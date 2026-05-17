# Best Brows & Waxing — Site Design Spec

**Date:** 2026-05-17  
**Type:** Informational single-page website  
**Client:** Best Brows & Waxing  
**Location:** D:\CLIENTS\Best Brows & Waxing\

---

## Overview

A single-page, fully informational website for Best Brows & Waxing. No booking system. Four full-viewport service panels with GSAP-powered horizontal slide transitions and a fixed nav bar. Designed using the impeccable skill. Business contact details (address, phone, hours) are placeholders — to be filled in by the client later.

---

## File Structure

```
D:\CLIENTS\Best Brows & Waxing\
├── index.html
├── styles.css
├── main.js
└── media/
    ├── threading.jpg
    ├── facials.jpg
    ├── tinting.jpg
    └── waxing.jpg
```

Three separate output files: `index.html`, `styles.css`, `main.js`. No frameworks, no build step.

---

## Sections / Panels

Four full-screen (100vw × 100vh) service panels, in this order:

1. Threading
2. Facials
3. Tinting
4. Waxing

Each panel contains:
- Full-bleed background photo from `/media/` (one per service)
- Dark grey/purple overlay on the photo for text legibility
- Large service name heading in white
- 2–3 lines of placeholder description copy
- Placeholder pricing line (e.g., "Starting at $XX")

Only one panel is visible at a time. The Threading panel is shown on initial load.

---

## Color Palette

| Role | Value |
|---|---|
| Nav background | `#111111` |
| Panel base | `#1a1a1a` |
| Photo overlay | `rgba(88, 28, 135, 0.45)` — purple-tinted |
| Active accent / indicator | `#9333ea` (vivid purple) |
| Primary text | `#ffffff` |
| Secondary text | `#d1d5db` (light grey) |

---

## Navigation

Fixed top nav bar listing all four service names: Threading · Facials · Tinting · Waxing.

A sliding purple underline indicator (`#9333ea`) moves between nav items using GSAP when the user clicks. The active item's indicator animates smoothly to its new position.

---

## GSAP Animation

**Library:** GSAP core (CDN, no ScrollTrigger needed)

**Panel transition behavior:**
- Clicking a nav item to the right of the current: current panel slides out left (`x: "-100%"`), incoming slides in from right (`x: "100%"` → `x: 0`)
- Clicking a nav item to the left of the current: current slides out right, incoming slides in from left
- Ease: `power2.inOut`, duration: `0.6s`
- No animation on initial load — Threading panel starts visible

**Nav indicator behavior:**
- On click, the purple underline animates its `x` position to the target nav item using GSAP
- Duration: `0.4s`, ease: `power2.out`

---

## Placeholder Content

Business info fields (address, phone, hours) are omitted from the initial build and will be added once the client provides them. Each section's description copy is placeholder text styled to match the final layout.

---

## Skills Used

- **impeccable** — visual design, palette, typography, layout polish
- **gsap-core** — panel slide transitions, nav indicator animation
