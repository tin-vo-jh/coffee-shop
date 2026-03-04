# Ngopi — Coffee Shop Landing Page

A single-page marketing website for **Ngopi**, a Vietnamese coffee brand.  
Built with plain **HTML5 · CSS3 · Vanilla JavaScript** — no frameworks, no build step.

---

## Project Structure

```
.
├── index.html   — page content and structure
├── styles.css   — all styling and responsive rules
├── script.js    — all interactivity
└── README.md    — this file
```

---

## index.html

### Why Semantic HTML?

Every section is wrapped in the correct HTML5 landmark element (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`, `<article>`, `<address>`) instead of generic `<div>` tags. This matters for two reasons:

1. **SEO** — search engine crawlers understand the role of each content block (nav, hero heading, article, etc.) and rank the page more accurately.
2. **Accessibility** — screen readers (e.g. VoiceOver, NVDA) expose landmark roles to users. A blind visitor can jump directly to the main content or navigation without tabbing through everything.

### Accessibility Attributes

| Attribute | Where | Why |
|---|---|---|
| `aria-labelledby` | every `<section>` | links the section to its visible heading so screen readers announce the section name |
| `aria-label` | icon-only buttons (search, cart, social, hamburger) | gives them a text name since there is no visible label |
| `aria-hidden="true"` | all decorative Font Awesome icons | hides them from the accessibility tree so they are not read aloud as "star" or "icon" noise |
| `role="tablist"` / `role="tab"` | filter buttons | communicates the tab widget pattern to assistive technology |
| `role="menu"` / `role="menuitem"` | Products dropdown | marks the dropdown as a navigation menu for AT |
| `aria-expanded` | hamburger button, dropdown trigger | synced by JS to announce open/closed state in real time |
| `aria-controls` | hamburger button | points to the `id` of the nav panel it controls |
| `<time datetime="…">` | blog post dates | machine-readable ISO date alongside the human-readable display text |
| `<address>` | footer contact | semantic wrapper for contact information |
| `<blockquote>` | testimonials | correct element for quoted speech |

### Why One `@import` for All Fonts?

A single Google Fonts `@import` URL with all font families combined into one request reduces the number of HTTP connections the browser must open. Fewer connections = faster first paint, especially on slow mobile connections.

### Why Class-based Selectors, not Tag Selectors?

All CSS rules use classes (`.header`, `.footer`, `.nav`) rather than bare HTML tags (`header`, `footer`, `nav`). Tag selectors have a lower specificity than classes but they can accidentally bleed into nested elements — for example `nav { ... }` would also match any `<nav>` inside a `<section>`. Classes are explicit and predictable.

---

## styles.css

### CSS Custom Properties (Design Tokens)

All brand colours, font families, and shared values are declared as variables inside `:root`. This means:

- Changing the brand primary colour from `#6D1600` to anything else requires exactly **one** edit.
- Variables cascade naturally so any rule can reference `var(--primary-color)` without importing a Sass/Less dependency.

### Font Choices

| Font | Used For | Why |
|---|---|---|
| **Inter** | Body text, labels, UI numbers | Highly legible at small sizes; designed for screen |
| **Playfair Display** | Section headings | Classic editorial serif — signals premium / speciality coffee |
| **Playfair Display SC** | CTA button text | Small-caps variant adds formality that matches the brand tone |
| **Plus Jakarta Sans** | Product card titles | Friendly rounded forms contrast the formal headings |
| **Poppins** | Footer contact + email input | Geometric, very readable at small sizes in dark backgrounds |

### Why `border-radius: 0 32px 0 32px`?

The diagonal rounded-corner shape (two corners rounded, two square, on alternating corners) is a deliberate **brand signature** taken directly from the Figma design. It appears on buttons, product images, hero images, about images, and blog images — creating visual consistency throughout the page.

### Why `visibility + opacity` for the Dropdown Instead of `display: none`?

`display: none` removes the element from the layout immediately — you **cannot animate** transitions to or from it.  
`visibility: hidden` + `opacity: 0` keep the element in the document but make it invisible and non-interactive. Because both properties are transitionable, the dropdown can fade and slide in smoothly (`transition: opacity 0.25s, transform 0.25s`).

### Why `@media (max-width: 768px)` for the Hamburger Breakpoint?

768px is the conventional threshold where a tablet in portrait mode or a large phone loses enough horizontal space for the full horizontal nav to fit comfortably. Below this width the hamburger replaces the link list.

### Three Responsive Breakpoints

| Breakpoint | Target | Key changes |
|---|---|---|
| `≤ 1024px` | Tablet / small laptop | 2-col product grid, 2-col testimonials, 2-col blog, reduced padding/font sizes |
| `≤ 768px` | Mobile phone | Hamburger nav, single column layout, hero images hidden, stat numbers reduced |
| `≤ 480px` | Small phone | Further font size reduction, single-col products, minimal padding |

### Why No `gap: 80px` on `.container`?

`gap` is a property of **flex** and **grid** containers. `.container` is a plain block element — `gap` has no effect on it and would be a confusing dead rule. Spacing between sections is controlled by `padding` on each section directly.

### Why `max-height` Animation for the Mobile Nav Panel?

You cannot CSS-animate a height change from `0` to `auto` because `auto` is not a numeric value the browser can interpolate. The workaround is to animate `max-height` from `0` to a value that will always be larger than the real content height (`400px`). The content simply clips neatly at its own natural height.

### Why `backdrop-filter: blur(8px)` for the Floating Header?

When the user scrolls and the header floats over content, a semi-transparent background with a blur creates a **frosted glass** effect that visually separates the nav from the content below it without needing a fully opaque white box — matching the modern design language of the Figma spec.

---

## script.js

### Why Vanilla JS (No Framework)?

The page has no dynamic data fetching, no component state to synchronise, and no routing. Adding React, Vue, or any framework just for filter tabs and a hamburger menu would add 40–100 KB of JavaScript. Vanilla JS here costs zero extra bytes beyond what is written.

### `{ passive: true }` on the Scroll Listener

```js
window.addEventListener('scroll', onScroll, { passive: true });
```

This flag tells the browser that the listener will **never** call `event.preventDefault()`. Without it, the browser has to wait for the JS callback to finish before deciding whether it should scroll — which causes noticeable jank on mobile. `passive: true` lets the browser scroll immediately while the JS runs in parallel.

### `classList.toggle(name, force)`

```js
const isOpen = navLinks.classList.toggle('open');
hamburger.classList.toggle('active', isOpen);
```

`toggle(name)` adds the class if absent or removes it if present, and **returns** the new state as a boolean. Passing that boolean as the `force` argument to the second toggle means we can synchronise two elements in two lines without a verbose if/else block.

### `String(isOpen)` for `aria-expanded`

```js
hamburger.setAttribute('aria-expanded', String(isOpen));
```

`setAttribute` always sets a string. Passing a raw boolean (`true` / `false`) actually works in most browsers, but `String()` is explicit about the intent and avoids a potential `"true"` vs `true` type confusion during code review.

### `e.target.closest('.header')` for Click-Outside

```js
document.addEventListener('click', e => {
    if (e.target.closest('.header')) return;
    ...
});
```

Instead of attaching a separate `blur` handler to every focusable element inside the nav, one document-level listener catches every click. `.closest('.header')` walks up the DOM tree from the click target — if any ancestor matches `.header`, the click was **inside** the nav and we do nothing. If it returns `null`, the click was **outside** and we collapse the nav.

### Why the `window.innerWidth > 768` Guard?

```js
if (window.innerWidth > 768) return;
```

On desktop screens the Products dropdown is handled entirely by CSS `:hover` / `:focus-within` — no JS is needed or wanted. Adding a JS `click` handler on desktop would fight with the CSS behaviour. The guard exits the function early so the JS accordion only runs when the viewport is actually in mobile mode.

---

## Design Decisions Summary

| Decision | Reason |
|---|---|
| No CSS framework (Bootstrap etc.) | Avoids overriding hundreds of utility classes; keeps the stylesheet predictable |
| No JS framework | Unnecessary weight for a static landing page |
| CSS Custom Properties | Single-source-of-truth for colours and fonts |
| Semantic HTML | SEO + accessibility |
| `visibility/opacity` transitions | Allows smooth animation of shown/hidden elements |
| `:hover` dropdown on desktop / JS accordion on mobile | CSS :hover is more performant and needs no JS on desktop; mobile touch has no hover |
| `{ passive: true }` scroll listener | Eliminates scroll jank on mobile |
| Three responsive breakpoints | Covers the four main viewport ranges: desktop, tablet, mobile, small phone |
| Asymmetric `border-radius` shapes | Brand signature from the Figma spec, applied consistently across images and buttons |
| `max-height` for slide animations | Only practical CSS technique for animating to/from `height: auto` |
