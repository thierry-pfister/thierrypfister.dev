# CLAUDE.md — thierrypfister.dev

> Read this before every session. No exceptions.
> This file is the engineering contract for the PFSTR_ portfolio.

---

## 0. Project Context

Personal portfolio for Thierry Pfister — **thierrypfister.dev**
Brand: **PFSTR_** · Tagline: **BUILD · DEPLOY · REPEAT**

Design source of truth: `BRAND.md` + `prototypes/hero-final.html`

**Planned features (in order):**
1. Portfolio / CV website — current focus
2. Blog — added later, must not be retrofitted awkwardly

Plan for the blog from day one even if it does not exist yet.
This means: routing, layout, and data patterns should not make adding `/blog` painful later.

---

## 1. Stack

```
Framework:  Next.js 14+ (App Router)
Language:   TypeScript — strict mode
Styling:    CSS Modules (.module.css)
3D:         Three.js — client-side only
Animations: GSAP + ScrollTrigger — client-side only
Fonts:      next/font (Google Fonts)
Hosting:    Vercel
```

No Tailwind. No UI libraries. No inline styles except truly dynamic values.

---

## 2. Core Philosophy

### Break big problems into small ones
Before writing any code, state the problem.
Then break it into the smallest useful step.
Only implement that step.

If a task feels big, it needs to be broken down further.
Never implement two things at once if one depends on the other.

### Think before you nest
Component hierarchy determines animation capability.
GSAP ScrollTrigger and Three.js have strict rules about DOM ownership.

Before creating any component that will be animated:
- Know which element owns the animation
- Know which component mounts/unmounts it
- Know where cleanup lives
- Know if the parent or child controls the trigger

Wrong nesting = broken animations that are painful to fix.
Plan nesting first, code second.

### Types are introduced when needed
Do not pre-declare types speculatively.
When a new data shape appears — introduce a type.
When a prop interface is needed — write it.
No `any`. No type assertions without a comment.

Types live close to where they are used.
Shared types go in `src/types/` only when genuinely shared across 3+ files.

### Server vs Client — intentional, not accidental
Every component is a Server Component by default.
Add `'use client'` only when the component needs:
- browser APIs
- event listeners
- useState / useReducer
- useEffect
- Three.js
- GSAP

Think about this before creating a component, not after.
SEO-critical content (headings, meta, body text) stays in Server Components.
Animations and interactivity are isolated into thin Client Components.

Good pattern:
```
ServerComponent (renders text, structure, SEO content)
  └── ClientWrapper (handles animation, interaction)
        └── (animates the server-rendered DOM if possible,
             or renders its own minimal DOM)
```

---

## 3. Engineering Principles

### Single responsibility
Functions do one thing.
Components render one thing.
Hooks manage one concern.

If you are describing a function with "and" — split it.

### Small files
Aim for under 100 lines.
Not a hard rule. Never split something that is clearer together.
But if a file is growing, ask: what responsibility can be extracted?

### Pure functions where possible
Logic that does not touch the DOM or state is a pure function.
Pure functions go in `lib/` or co-located utility files.
They are easy to test and easy to reason about.

### Cleanup is not optional
Three.js: dispose renderer, geometry, material on unmount.
GSAP: `ctx.revert()` on unmount.
Event listeners: remove on unmount.
requestAnimationFrame: cancel on unmount.

A component that does not clean up is a bug waiting to happen.

### No premature abstraction
Do not create a shared component until you have 2+ real uses.
Do not create a hook until the logic appears in 2+ components.
Duplication is fine when the pattern is not yet stable.

---

## 4. CSS Architecture

### globals.css — CSS custom properties only
No component styles in globals.
No utility classes.
Only brand tokens:

```css
:root {
  --cream:    #F4F0E8;
  --butter-d: #C8A830;
  --indigo:   #6366F1;
  --lav-deep: #5B4EAA;
  --ink:      #14120F;
  /* ... full list in BRAND.md */

  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### CSS Modules — one per component
Never hardcode color hex values. Always `var(--token)`.
camelCase class names.
No `!important`.
Animations defined in the module that uses them.

---

## 5. Animation Contract

### GSAP nesting rule
GSAP `context()` owns a subtree.
The component that creates the context must be the one that cleans it up.
Never animate a ref that belongs to a parent component.
Never let a child component reach up to animate a parent's DOM.

```tsx
// Always use gsap.context for cleanup safety
useEffect(() => {
  const ctx = gsap.context(() => {
    // all animations here
  }, rootRef) // scope to this component's DOM
  return () => ctx.revert()
}, [])
```

### ScrollTrigger rule
Register once at the app level or in the component that uses it.
Never register in a loop or on every render.
Always pair with `ScrollTrigger.kill()` or `ctx.revert()` on cleanup.

### Three.js rule
Always dynamic import. Never SSR.
Always clean up on unmount:
```tsx
return () => {
  cancelAnimationFrame(animId)
  renderer.dispose()
  geometry.dispose()
  material.dispose()
  renderer.domElement.remove()
}
```

---

## 6. Git Workflow

```
feature/* → development → main
```

- `main` = production, auto-deploys to Vercel
- `development` = integration branch
- `feature/*` = all active work
- Never commit directly to `main`

### Commit style — Gitmoji
```
✨ add hero type component
🐛 fix Three.js cleanup on unmount
♻️ extract blob animation into hook
🎨 adjust handwriting position
📝 update CLAUDE.md
🚀 merge hero to main
```

### Small commits
One logical change = one commit.
Each commit should build and type-check.
Do not mix animation logic with layout changes.
Do not mix refactors with new features.

---

## 7. Step-by-Step Session Protocol

At the start of every session:
1. Read `CLAUDE.md` (this file)
2. Read `BRAND.md`
3. State what we are building this session in one sentence
4. Break it into the smallest first step
5. Implement only that step
6. Type-check: `npm run type-check`
7. Commit with Gitmoji
8. Move to the next step

Never skip ahead.
Never implement two steps in one go without discussion.

---

## 8. What Never Changes

- The underscore in `PFSTR_` is always `var(--butter-d)` — no exceptions
- Three.js and GSAP are never imported in Server Components
- CSS custom properties are never hardcoded as hex values in modules
- Cleanup is never optional

---

*PFSTR_ · thierrypfister.dev · CLAUDE.md v2.0*
*BUILD · DEPLOY · REPEAT*
