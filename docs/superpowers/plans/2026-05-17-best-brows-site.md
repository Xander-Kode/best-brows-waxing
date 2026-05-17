# Best Brows & Waxing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page informational site with four full-screen service panels (Threading, Facials, Tinting, Waxing) and GSAP-powered horizontal slide transitions between them.

**Architecture:** Three standalone files — `index.html`, `styles.css`, `main.js` — with no build step or framework. Each service panel is a full-viewport `<section>` in the DOM; only one is visible at a time via CSS `transform`. GSAP handles all transitions (panel slides + nav indicator movement).

**Tech Stack:** Vanilla HTML5 / CSS3 / JavaScript (ES6), GSAP 3 (CDN), no dependencies beyond that.

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | DOM structure: nav, panels, media references, GSAP CDN link |
| `styles.css` | Layout, palette, typography, panel positioning, nav styling — designed with impeccable skill |
| `main.js` | All GSAP logic: panel transitions, nav indicator animation, click handlers |
| `media/` | 4 photos — filenames must match: `threading.jpg`, `facials.jpg`, `tinting.jpg`, `waxing.jpg` |

---

## Task 1: Scaffold HTML

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Best Brows & Waxing</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <nav class="site-nav">
    <div class="nav-inner">
      <button class="nav-item active" data-index="0">Threading</button>
      <button class="nav-item" data-index="1">Facials</button>
      <button class="nav-item" data-index="2">Tinting</button>
      <button class="nav-item" data-index="3">Waxing</button>
      <div class="nav-indicator"></div>
    </div>
  </nav>

  <main class="panels-container">

    <section class="panel active" data-index="0" style="background-image: url('media/threading.jpg');">
      <div class="panel-overlay"></div>
      <div class="panel-content">
        <h1>Threading</h1>
        <p>Precision threading for perfectly shaped brows and flawless facial hair removal. Clean, fast, and long-lasting results.</p>
        <span class="price">Starting at $12</span>
      </div>
    </section>

    <section class="panel" data-index="1" style="background-image: url('media/facials.jpg');">
      <div class="panel-overlay"></div>
      <div class="panel-content">
        <h1>Facials</h1>
        <p>Rejuvenating facials tailored to your skin type. Deep cleansing, exfoliation, and nourishment for a radiant glow.</p>
        <span class="price">Starting at $45</span>
      </div>
    </section>

    <section class="panel" data-index="2" style="background-image: url('media/tinting.jpg');">
      <div class="panel-overlay"></div>
      <div class="panel-content">
        <h1>Tinting</h1>
        <p>Brow and lash tinting that defines your features and eliminates the need for daily makeup. Results last up to 6 weeks.</p>
        <span class="price">Starting at $20</span>
      </div>
    </section>

    <section class="panel" data-index="3" style="background-image: url('media/waxing.jpg');">
      <div class="panel-overlay"></div>
      <div class="panel-content">
        <h1>Waxing</h1>
        <p>Smooth, silky skin with our gentle waxing services. Full body options available for face, arms, legs, and more.</p>
        <span class="price">Starting at $15</span>
      </div>
    </section>

  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify structure in browser**

Open `index.html` in a browser. You should see raw unstyled text for all four panels stacked vertically. Nav buttons visible at top. No styling yet — that's expected.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: scaffold HTML structure for Best Brows site"
```

---

## Task 2: Apply Styles with Impeccable Skill

**Files:**
- Create: `styles.css`

> **REQUIRED:** Invoke the `impeccable` skill before writing any CSS. The skill will guide layout, typography, spacing, and visual polish decisions. Use the palette and layout rules from the spec as your starting constraints.

**Palette constraints to give the skill:**
- Nav bg: `#111111`
- Panel base: `#1a1a1a`
- Photo overlay: `rgba(88, 28, 135, 0.45)`
- Active accent: `#9333ea`
- Primary text: `#ffffff`
- Secondary text: `#d1d5db`

**Layout constraints to give the skill:**
- `.panels-container` is full-screen (100vw × 100vh), overflow hidden, position relative
- Each `.panel` is 100vw × 100vh, position absolute, top 0, left 0
- Only `.panel.active` is visible initially; others are off-screen via `transform: translateX(100%)`
- `.site-nav` is fixed, top 0, full width, z-index above panels
- `.nav-indicator` is an absolutely positioned underline bar inside `.nav-inner`, to be moved by GSAP

- [ ] **Step 1: Invoke impeccable skill**

Use the `impeccable` skill with the above constraints. The skill will produce the full `styles.css` content.

- [ ] **Step 2: Save output to `styles.css`**

Write the complete CSS produced by the impeccable skill to `styles.css`.

- [ ] **Step 3: Verify in browser**

Open `index.html`. Confirm:
- Nav is fixed at top, dark background
- Only the Threading panel (first `.panel`) is visible — others are off-screen
- Threading panel fills the full viewport with the photo background and purple overlay
- Nav items are styled with white text
- No layout overflow or scroll bars

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "feat: add styled layout for Best Brows site"
```

---

## Task 3: Wire GSAP Animations

**Files:**
- Create: `main.js`

- [ ] **Step 1: Create `main.js` with panel transition logic**

```javascript
(function () {
  const panels = Array.from(document.querySelectorAll('.panel'));
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const indicator = document.querySelector('.nav-indicator');

  let currentIndex = 0;
  let isAnimating = false;

  // Position indicator under the active nav item on load
  function positionIndicator(navItem, animate) {
    const { offsetLeft, offsetWidth } = navItem;
    if (animate) {
      gsap.to(indicator, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.4,
        ease: 'power2.out'
      });
    } else {
      gsap.set(indicator, { x: offsetLeft, width: offsetWidth });
    }
  }

  // Slide panels in/out
  function goToPanel(targetIndex) {
    if (targetIndex === currentIndex || isAnimating) return;
    isAnimating = true;

    const direction = targetIndex > currentIndex ? 1 : -1;
    const outgoing = panels[currentIndex];
    const incoming = panels[targetIndex];

    // Place incoming panel off-screen in the correct direction
    gsap.set(incoming, { x: direction * 100 + '%', autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        navItems[currentIndex].classList.remove('active');
        navItems[targetIndex].classList.add('active');
        currentIndex = targetIndex;
        isAnimating = false;
      }
    });

    tl.to(outgoing, { x: direction * -100 + '%', duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(incoming, { x: '0%', duration: 0.6, ease: 'power2.inOut' }, 0);

    positionIndicator(navItems[targetIndex], true);
  }

  // Nav click handlers
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetIndex = parseInt(item.dataset.index, 10);
      goToPanel(targetIndex);
    });
  });

  // Initialize: set all non-active panels off-screen, position indicator
  panels.forEach((panel, i) => {
    if (i !== 0) gsap.set(panel, { x: '100%' });
  });
  positionIndicator(navItems[0], false);
})();
```

- [ ] **Step 2: Verify panel transitions in browser**

Open `index.html`. Click each nav item and confirm:
- Clicking a nav item to the right slides the current panel left and brings in the next from the right
- Clicking a nav item to the left reverses direction
- The purple underline indicator moves to the clicked nav item smoothly
- Rapid clicking does not break the layout (isAnimating guard prevents overlap)
- Threading panel is visible on load with no entrance animation

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add GSAP panel transitions and nav indicator"
```

---

## Task 4: Add Media Photos

**Files:**
- Populate: `media/`

- [ ] **Step 1: Confirm photo filenames**

Ensure the 4 photos in the `media/` folder are named exactly:
- `threading.jpg`
- `facials.jpg`
- `tinting.jpg`
- `waxing.jpg`

Rename them if needed. The `index.html` references these exact filenames.

- [ ] **Step 2: Verify photos in browser**

Open `index.html`. Navigate through all 4 panels. Confirm:
- Each panel shows its corresponding photo as a full-bleed background
- The purple-tinted overlay (`rgba(88, 28, 135, 0.45)`) renders over each photo
- Text is legible on all 4 photos
- No broken image icons appear

- [ ] **Step 3: Commit**

```bash
git add media/
git commit -m "feat: add service photography to media folder"
```

---

## Task 5: Final Polish Pass

**Files:**
- Modify: `styles.css` (if adjustments needed after real photos are in)
- Modify: `index.html` (placeholder pricing/copy review)

- [ ] **Step 1: Full browser review across all 4 panels**

Check each panel with real photos in place:
- Overlay opacity adequate for all photos? Adjust `rgba(88, 28, 135, X)` in `styles.css` if any photo makes text hard to read
- Heading and price text correctly sized and positioned
- Nav indicator aligns precisely under each item on click

- [ ] **Step 2: Check on a narrow viewport**

Resize browser to 375px wide (mobile). Confirm nav items don't overflow. If they do, add this to `styles.css`:

```css
@media (max-width: 480px) {
  .nav-item {
    font-size: 0.75rem;
    padding: 0 0.5rem;
  }
}
```

- [ ] **Step 3: Leave business info placeholder comment in HTML**

In `index.html`, after the last `</section>` and before `</main>`, add:

```html
<!-- TODO: Add contact section (address, phone, hours) once client provides -->
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "polish: final review and mobile nav adjustment"
```

---

## Placeholder Content Note

Pricing in all 4 panels (`Starting at $XX`) is placeholder. Once the client provides real pricing, update each `.price` span in `index.html`. Business contact info (address, phone, hours) is deferred — a new section will be added in a future pass.
