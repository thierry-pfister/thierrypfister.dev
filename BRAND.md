# PFSTR_ — Brand Bible
> Read this file at the start of every session before writing any code.
> This is the single source of truth for Thierry Pfister's personal brand and website.

---

## 0. Identity

| | |
|---|---|
| **Mark** | `PFSTR_` — underscore is ALWAYS gold (#E8C547), never change this |
| **Full name** | Thierry Pfister |
| **Tagline** | BUILD · DEPLOY · REPEAT |
| **Domain** | thierrypfister.dev |
| **Location** | Switzerland |
| **Role** | Full-stack developer · Freelancer on the side |
| **Tone** | Confident but not arrogant · Young and honest · "Developer in Progress" |

---

## 1. Color Palette — Palette C (LOCKED)

### Dark Mode (Primary — default)
```css
--bg:         #0A0A0A;   /* primary background */
--bg2:        #080808;   /* slightly deeper — footer, alt sections */
--bg3:        #0E0E0E;   /* cards, panels */
--bg4:        #141414;   /* hover surfaces */
--border:     rgba(255,255,255,0.055);
--border-sub: rgba(255,255,255,0.03);
--tx:         #EAE8E2;   /* primary text — warm white, NOT pure white */
--ts:         #2A2826;   /* secondary text */
--tm:         #1A1816;   /* muted text — labels, meta */
```

### Light Mode (Secondary)
```css
--lbg:        #F4F2EB;   /* warm cream — NOT cold white */
--lbg2:       #ECEAE3;
--lbg3:       #E8E6DF;
--lborder:    rgba(0,0,0,0.07);
--ltx:        #0E0C0A;
--lts:        #5A5550;
--ltm:        #9A9590;
```

### Accent Colors (same in both modes)
```css
--gold:       #E8C547;   /* PRIMARY accent — CTA buttons, underscore, stats */
--gold-l:     #F0D060;   /* hover state */
--gold-d:     #C0A020;   /* active/pressed + light mode gold */
--purple:     #6366F1;   /* SECONDARY accent — links, tech tags, eyebrows */
--purple-l:   #818CF8;   /* handwriting color, glows, lighter usage */
--purple-p:   #A5B4FC;   /* pale — very subtle tags, icon fills */
```

### Color Usage Rules
- Gold = primary CTA, the underscore in PFSTR_, stats/numbers, marquee dots
- Purple/Indigo = eyebrows, code labels, tech stack tags, handwriting accent color
- NEVER use gold and purple at equal visual weight — gold leads, purple supports
- Dark mode is the default and primary experience
- Light mode uses gold-d (#C0A020) instead of gold for better legibility

---

## 2. Typography (LOCKED)

### Font Stack
```css
--font-display: 'Barlow', sans-serif;     /* weight: 900 ALWAYS */
--font-hand:    'Caveat', cursive;        /* weight: 600–700 */
--font-body:    'DM Sans', sans-serif;    /* weight: 300–500 */
--font-mono:    'Space Mono', monospace;  /* weight: 400–700 */
```

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,700;0,900;1,900&family=Caveat:wght@600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Font Roles
| Font | Role | Usage |
|------|------|-------|
| Barlow 900 | Display / Logo | Hero titles, section headers, PFSTR_ mark, big numbers |
| Caveat 600–700 | Handwriting accent | Personal intros, annotations on cards, "hey i'm Thierry", always rotate ±2° |
| DM Sans 300–500 | Body / UI | All body copy, descriptions, nav links, button text |
| Space Mono 400–700 | Mono / Labels | Tags, eyebrows, metadata, code, tagline, dates |

### Type Scale
```css
/* Display */
--text-hero:    clamp(58px, 8vw, 96px);   /* Barlow 900, lh: 0.88, ls: -0.02em */
--text-display: clamp(36px, 5vw, 56px);   /* Barlow 900, lh: 0.90, ls: -0.01em */
--text-title:   28px;                      /* Barlow 700 */

/* Handwriting */
--text-hand-lg: clamp(24px, 4vw, 40px);  /* Caveat 700, always rotate(-1.2deg) */
--text-hand-md: 20px;                     /* Caveat 600 */
--text-hand-sm: 16px;                     /* Caveat 600 */

/* Body */
--text-body-lg: 18px;   /* DM Sans 300, lh: 1.7 */
--text-body-md: 14px;   /* DM Sans 400, lh: 1.7 */
--text-body-sm: 12px;   /* DM Sans 300, lh: 1.65 */

/* Mono */
--text-label:   10px;   /* Space Mono, ls: 0.22em, uppercase */
--text-tag:     8.5px;  /* Space Mono, ls: 0.12em, uppercase */
--text-code:    13px;   /* Space Mono */
```

### Typography Rules
- Barlow is ALWAYS weight 900 — never 700 or less for display
- Caveat is NEVER used for more than 2 lines at a time
- Caveat is NEVER used for navigation, buttons, or any functional UI
- Space Mono is ALWAYS uppercase with generous letter-spacing
- DM Sans handles everything readable — never use display fonts for body
- The "handwriting + big display title" pairing is the key brand moment

---

## 3. Logo System

### The Mark
```
PFSTR_
```
- Font: Barlow Black 900
- Letter-spacing: -0.02em
- The `_` (underscore) = ALWAYS `#E8C547` (gold)
- Everything else adapts to context, the underscore NEVER changes color

### Variants
| Variant | Background | Usage |
|---------|-----------|-------|
| Primary Dark | #0A0A0A | Website hero, dark decks, default |
| Primary Light | #F4F2EB | Print, light mode, white decks |
| Brand BG | #E8C547 | Stickers, merch, bold social posts |
| Mark Only | Any dark | Nav bar, compact spaces |
| Horizontal Wordmark | Dark | Nav + name: `PFSTR_ · THIERRY PFISTER` |

### Tagline Usage
```
BUILD · DEPLOY · REPEAT
```
- Font: Space Mono, 9–10px, letter-spacing: 0.22em, uppercase
- Separator dots: gold (#E8C547), 3–4px circles
- Color: muted (--tm) — never full white, it's secondary info

---

## 4. Motion & Animation

### Easing Curves
```css
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* standard smooth */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy, for buttons/cards */
```

### Duration Scale
```css
--dur-micro:  150ms;   /* hover color changes */
--dur-fast:   250ms;   /* button interactions */
--dur-normal: 400ms;   /* card hovers, toggles */
--dur-slow:   600ms;   /* page transitions, hero entrance */
--dur-xslow:  900ms;   /* 3D scene transitions */
```

### Animation Patterns
- **Scroll reveal**: `opacity: 0 → 1` + `translateY(14px → 0)` on intersection
- **Card hover**: `translateY(-3px)` + subtle box-shadow + border-color lighten
- **Button hover**: `translateY(-2px)` + glow shadow in accent color
- **Pulse dot**: for "available" indicator — purple glow animation
- **Marquee**: horizontal scroll strip — `BUILD · DEPLOY · REPEAT · thierrypfister.dev`
- **Cursor blink**: `▌` after PFSTR in hero — gold color, 1s step-end

### Grain Overlay (always present)
```css
/* Add to body::before — subtle texture on all backgrounds */
background-image: url("data:image/svg+xml,...fractalNoise...");
opacity: 0.02;
position: fixed; inset: 0;
pointer-events: none; z-index: 9999;
```

---

## 5. Component Patterns

### Buttons
```css
/* Primary — gold */
.btn-primary {
  font-family: var(--font-mono);
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  font-weight: 700; padding: 13px 28px; border-radius: 7px;
  background: var(--gold); color: #0A0A0A; border: none;
  transition: all 250ms var(--ease-spring);
}
.btn-primary:hover {
  background: var(--gold-l);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(232,197,71,0.25);
}

/* Secondary — outlined */
.btn-secondary {
  font-family: var(--font-mono);
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 13px 28px; border-radius: 7px;
  background: transparent; color: var(--tx);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 250ms ease;
}
.btn-secondary:hover {
  border-color: var(--purple);
  color: var(--purple-l);
}
```

### Tags / Chips
```css
/* Tech tag — purple */
.tag-tech {
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 5px 12px; border-radius: 4px;
  background: rgba(99,102,241,0.12);
  color: var(--purple-p);
  border: 1px solid rgba(99,102,241,0.22);
}

/* Status tag — gold */
.tag-available {
  background: rgba(232,197,71,0.1);
  color: var(--gold);
  border: 1px solid rgba(232,197,71,0.2);
}

/* Neutral tag */
.tag-neutral {
  background: var(--bg3);
  color: var(--ts);
  border: 1px solid var(--border-sub);
}
```

### Cards
```css
.card {
  background: var(--bg3); border-radius: 14px;
  border: 1px solid var(--border-sub); padding: 28px;
  transition: border-color 300ms ease, transform 350ms var(--ease-spring), box-shadow 350ms ease;
  position: relative; overflow: hidden;
}
/* gradient top border on hover */
.card::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, var(--purple), var(--gold));
  opacity: 0; transition: opacity 300ms ease;
}
.card:hover {
  border-color: rgba(99,102,241,0.2);
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.card:hover::before { opacity: 1; }
```

### Section Pattern
```html
<!-- Every section follows this structure -->
<section>
  <!-- eyebrow label -->
  <div class="section-label">Selected projects</div>
  <!-- Barlow title with gold underscore -->
  <div class="section-title">PROJECTS<em style="color:var(--gold)">_</em></div>
  <!-- optional Caveat subtitle -->
  <div class="section-hand">some of my favourite builds</div>
  <!-- content -->
</section>
```

### Hero Pattern
```html
<section class="hero">
  <!-- Caveat handwriting — personal, rotated -->
  <div class="eyebrow-hand">hey, i'm Thierry —</div>
  <!-- Barlow display title -->
  <h1>BUILD.<br>DEPLOY.<br><em>REPEAT.</em></h1>
  <!-- DM Sans body -->
  <p>Full-stack developer based in Switzerland...</p>
  <!-- buttons -->
  <div class="hero-btns">...</div>
  <!-- Space Mono tags -->
  <div class="hero-tags">...</div>
</section>
```

---

## 6. Page Structure

```
thierrypfister.dev
│
├── Nav (sticky, blur backdrop)
│   └── PFSTR_ logo left · links center · "Hire me" CTA right
│
├── Hero
│   ├── THREE.js particle background (WebGL)
│   ├── Caveat eyebrow: "hey, i'm Thierry —"
│   ├── Barlow h1: BUILD. / DEPLOY. / REPEAT.
│   ├── DM Sans subtitle
│   ├── Two buttons: "See my work" / "Get in touch →"
│   └── Tech tags: React, Next.js, TypeScript, Available now...
│
├── Marquee Strip
│   └── BUILD · DEPLOY · REPEAT · thierrypfister.dev · React · ...
│
├── Projects (#work)
│   └── 3 cards with gradient top border on hover + Caveat annotation
│
├── About (#about)
│   ├── Left: "DEV IN PROGRESS." display title
│   └── Right: text + 4 stats in gold
│
├── Stack (#stack)
│   └── 4 grid cards: Frontend / Backend / Tooling / Learning
│
├── CTA / Contact (#contact)
│   ├── Caveat: "got a project?"
│   ├── Barlow: "LET'S BUILD."
│   └── Email + buttons
│
└── Footer
    ├── PFSTR_ mark left
    ├── Caveat: "made with care in Switzerland ✦" center
    └── BUILD · DEPLOY · REPEAT right
```

---

## 7. Tech Stack (for Claude Code)

```
Framework:    Next.js 14+ (App Router)
Styling:      Tailwind CSS + CSS custom properties for brand tokens
3D / WebGL:   Three.js + custom GLSL shaders
Animations:   GSAP + ScrollTrigger
Fonts:        Google Fonts (Barlow, Caveat, DM Sans, Space Mono)
Deployment:   Vercel
Domain:       thierrypfister.dev
```

---

## 8. Prototype Files

All prototype files are in `/prototypes/`. Read them to understand the design intent before writing components.

| File | What it shows |
|------|--------------|
| `prototypes/hero.html` | Hero section with 3D particle background |
| `prototypes/projects.html` | Project cards section |
| `prototypes/about.html` | About + stats section |
| `prototypes/stack.html` | Tech stack grid |
| `prototypes/contact.html` | CTA / contact section |
| `prototypes/full-page.html` | Complete page mockup |

---

## 9. Claude Code Instructions

When building components:
1. Always read `BRAND.md` first
2. Use CSS custom properties from Section 1 — never hardcode colors
3. Barlow Black is always weight 900 — no exceptions
4. The underscore in PFSTR_ is always `var(--gold)` — no exceptions
5. Caveat font is accent only — max 2 lines, always slightly rotated
6. Space Mono for all labels/tags — always uppercase with letter-spacing
7. Card hover = translateY(-3px) + gradient top border fade in
8. All scroll reveals: opacity 0→1 + translateY(14px→0) on intersection
9. Dark mode is default — light mode via `[data-theme="light"]` on `<html>`
10. Grain overlay on body::before always — opacity 0.02, z-index 9999

---

*PFSTR_ Brand Bible v1.0 · Thierry Pfister · 2025*
*Brand locked. Build everything from this file.*

---

## 10. Hero Prototype — LOCKED ✅

**File:** `prototypes/hero-final.html`

### What's in the hero (in order, back to front):

**Background (z:1)**
- 4 blobs: coral/red top-right, lavender top-left, butter bottom-left, blush bottom-right
- filter: blur(60-70px) — soft, atmospheric

**3D Objects (z:8 — behind type)**
- LEFT: Torus Knot — `TorusKnotGeometry(1.2, 0.42, 160, 20, 2, 3)` — color `#7B6EC4` indigo
  - Position: bottom-left, bleeds off screen (`left:-80px; bottom:-80px`)
  - Rotates slowly on all axes, mouse parallax
  - On scroll: flies off bottom-left with spin
- RIGHT: Morphing organic blob — `IcosahedronGeometry(1.4, 4)` with per-frame vertex displacement
  - Color `#F2B89A` peach, lit with coral/peach point lights
  - Position: top-right, bleeds off screen (`right:-60px; top:-40px`)
  - Morphs continuously, mouse parallax opposite to left object

**Grid lines (z:2)** — thin SVG editorial structure, 6% opacity

**Doodles (z:15)** — 9 hand-drawn SVG details:
- Dashed scribble circle top-left
- Arrow top area
- Wavy lavender underline below BUILD DEPLOY REPEAT (`rgba(91,78,170,0.35)`)
- Spiral bottom-right
- Coral arrow curve top-center
- Vertical bracket left side
- Asterisk cross
- Gold wavy underline below PFSTR (`rgba(200,168,48,0.4)`)
- Small lavender circle top-right
- All fade in staggered, subtle float loops, disappear on scroll

**Type (z:20)**
- `PFSTR_` — Nunito 900, `22vw`, color `--ink`, em underscore `--butter-d`
- `BUILD` `DEPLOY` `REPEAT.` — Nunito 900, `6.2vw`, colors: `--indigo` / `--butter-d` / `--lav-deep`
- Tight overlap: `margin-top: -0.04em` between PFSTR and BDR

**Handwriting (z:200 — on top of everything)**
- Text: `freelance dev & creator ✦`
- Font: Caveat 700, `5.2vw`, color `#FFFFFF`
- Position: `top:32%; left:3%` — cuts horizontally across PFSTR
- Rotate: `-6deg`
- Shadow: `0px 2px 20px rgba(0,0,0,.5), 0px 0px 40px rgba(0,0,0,.25)`
- Floats independently, fastest parallax on mouse

**Nav (z:200)**
- Left: `PFSTR_` logo — Nunito 900
- Center: Work / About / Services / Stack / Contact — Space Mono 8.5px
- Right: `Open for work` pill (sage green, pulse dot) + hamburger menu

**Vertical text (z:200)**
- `Based in Switzerland` — Space Mono, rotated 90°, far right edge
- Flanked by lavender dots and lines
- Slides in from right on load

**Bottom row (z:100)**
- Left: `I'm Thierry Pfister` + `Dev · designer · builder · Switzerland`
- Center: `Let's work together →` (dark pill button) + `▶ View my work`
- Right: `—— Scroll to explore ↓`

### Animations:
- **Load**: blobs scale in → 3D drift in from corners → type slides up → handwriting drops down → doodles fade in staggered → vertical text slides from right
- **Mouse**: blobs drift, type parallax, handwriting parallax fastest, 3D objects opposite directions = real depth
- **Scroll**: 3D objects spin off diagonally opposite, type fades up, doodles disappear, blobs fade

### Claude Code instructions for this section:
- Use Next.js with Three.js imported client-side (`'use client'` component)
- GSAP ScrollTrigger for scroll animations
- Canvas elements must be `position:absolute` with specific corner offsets
- Hand-drawn SVGs are inline — keep them exactly as coded
- Vertical text uses `transform: rotate(90deg)` with `transform-origin: center center`
