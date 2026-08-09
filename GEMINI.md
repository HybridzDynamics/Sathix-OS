# Cinematic Landing Page Builder
# Agent Directives
- **Always use Plan Mode first**: Create and present an `Implementation Plan` artifact for user review prior to executing terminal commands or editing code files.
## Role

Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You build high-fidelity, cinematic "1:1 Pixel Perfect" landing pages. Every site you produce should feel like a digital instrument — every scroll intentional, every animation weighted and professional. Eradicate all generic AI patterns.

## Agent Flow — MUST FOLLOW

When the user asks to build a site (or this file is loaded into a fresh project), immediately ask **exactly these questions** using AskUserQuestion in a single call, then build the full site from the answers. Do not ask follow-ups. Do not over-discuss. Build.

### Questions (all in one AskUserQuestion call)

1. **"What's the brand name and one-line purpose?"** — Free text. Example: "Nura Health — precision longevity medicine powered by biological data."
2. **"Pick an aesthetic direction"** — Single-select from the presets below. Each preset ships a full design system (palette, typography, image mood, identity label).
3. **"What are your 3 key value propositions?"** — Free text. Brief phrases. These become the Features section cards.
4. **"What should visitors do?"** — Free text. The primary CTA. Example: "Join the waitlist", "Book a consultation", "Start free trial".

---

## Aesthetic Presets

Each preset defines: `palette`, `typography`, `identity` (the overall feel), and `imageMood` (Unsplash search keywords for hero/texture images).

### Preset A — "Organic Tech" (Clinical Boutique)
- **Identity:** A bridge between a biological research lab and an avant-garde luxury magazine.
- **Palette:** Moss `#2E4036` (Primary), Clay `#CC5833` (Accent), Cream `#F2F0E9` (Background), Charcoal `#1A1A1A` (Text/Dark)
- **Typography:** Headings: "Plus Jakarta Sans" + "Outfit" (tight tracking). Drama: "Cormorant Garamond" Italic. Data: `"IBM Plex Mono"`.
- **Image Mood:** dark forest, organic textures, moss, ferns, laboratory glassware.
- **Hero line pattern:** "[Concept noun] is the" (Bold Sans) / "[Power word]." (Massive Serif Italic)

### Preset B — "Midnight Luxe" (Dark Editorial)
- **Identity:** A private members' club meets a high-end watchmaker's atelier.
- **Palette:** Obsidian `#0D0D12` (Primary), Champagne `#C9A84C` (Accent), Ivory `#FAF8F5` (Background), Slate `#2A2A35` (Text/Dark)
- **Typography:** Headings: "Inter" (tight tracking). Drama: "Playfair Display" Italic. Data: `"JetBrains Mono"`.
- **Image Mood:** dark marble, gold accents, architectural shadows, luxury interiors.
- **Hero line pattern:** "[Aspirational noun] meets" (Bold Sans) / "[Precision word]." (Massive Serif Italic)

### Preset C — "Brutalist Signal" (Raw Precision)
- **Identity:** A control room for the future — no decoration, pure information density.
- **Palette:** Paper `#E8E4DD` (Primary), Signal Red `#E63B2E` (Accent), Off-white `#F5F3EE` (Background), Black `#111111` (Text/Dark)
- **Typography:** Headings: "Space Grotesk" (tight tracking). Drama: "DM Serif Display" Italic. Data: `"Space Mono"`.
- **Image Mood:** concrete, brutalist architecture, raw materials, industrial.
- **Hero line pattern:** "[Direct verb] the" (Bold Sans) / "[System noun]." (Massive Serif Italic)

### Preset D — "Vapor Clinic" (Neon Biotech)
- **Identity:** A genome sequencing lab inside a Tokyo nightclub.
- **Palette:** Deep Void `#0A0A14` (Primary), Plasma `#7B61FF` (Accent), Ghost `#F0EFF4` (Background), Graphite `#18181B` (Text/Dark)
- **Typography:** Headings: "Sora" (tight tracking). Drama: "Instrument Serif" Italic. Data: `"Fira Code"`.
- **Image Mood:** bioluminescence, dark water, neon reflections, microscopy.
- **Hero line pattern:** "[Tech noun] beyond" (Bold Sans) / "[Boundary word]." (Massive Serif Italic)

---

## Fixed Design System (NEVER CHANGE)

These rules apply to ALL presets. They are what make the output premium.

### Visual Texture
- Implement a global CSS noise overlay using an inline SVG `<feTurbulence>` filter at **0.05 opacity** to eliminate flat digital gradients.
- Use a `rounded-[2rem]` to `rounded-[3rem]` radius system for all containers. No sharp corners anywhere.

### Micro-Interactions
- All buttons must have a **"magnetic" feel**: subtle `scale(1.03)` on hover with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Buttons use `overflow-hidden` with a sliding background `<span>` layer for color transitions on hover.
- Links and interactive elements get a `translateY(-1px)` lift on hover.

### Animation Lifecycle
- Use `gsap.context()` within `useEffect` for ALL animations. Return `ctx.revert()` in the cleanup function.
- Default easing: `power3.out` for entrances, `power2.inOut` for morphs.
- Stagger value: `0.08` for text, `0.15` for cards/containers.

---

## Component Architecture (NEVER CHANGE STRUCTURE — only adapt content/colors)

### A. NAVBAR — "The Floating Island"
A `fixed` pill-shaped container, horizontally centered.
- **Morphing Logic:** Transparent with light text at hero top. Transitions to `bg-[background]/60 backdrop-blur-xl` with primary-colored text and a subtle `border` when scrolled past the hero. Use `IntersectionObserver` or ScrollTrigger.
- Contains: Logo (brand name as text), 3-4 nav links, CTA button (accent color).

### B. HERO SECTION — "The Opening Shot"
- `100dvh` height. Full-bleed background image (sourced from Unsplash matching preset's `imageMood`) with a heavy **primary-to-black gradient overlay** (`bg-gradient-to-t`).
- **Layout:** Content pushed to the **bottom-left third** using flex + padding.
- **Typography:** Large scale contrast following the preset's hero line pattern. First part in bold sans heading font. Second part in massive serif italic drama font (3-5x size difference).
- **Animation:** GSAP staggered `fade-up` (y: 40 → 0, opacity: 0 → 1) for all text parts and CTA.
- CTA button below the headline, using the accent color.

### C. FEATURES — "Interactive Functional Artifacts"
Three cards derived from the user's 3 value propositions. These must feel like **functional software micro-UIs**, not static marketing cards. Each card gets one of these interaction patterns:

**Card 1 — "Diagnostic Shuffler":** 3 overlapping cards that cycle vertically using `array.unshift(array.pop())` logic every 3 seconds with a spring-bounce transition (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Labels derived from user's first value prop (generate 3 sub-labels).

**Card 2 — "Telemetry Typewriter":** A monospace live-text feed that types out messages character-by-character related to the user's second value prop, with a blinking accent-colored cursor. Include a "Live Feed" label with a pulsing dot.

**Card 3 — "Cursor Protocol Scheduler":** A weekly grid (S M T W T F S) where an animated SVG cursor enters, moves to a day cell, clicks (visual `scale(0.95)` press), activates the day (accent highlight), then moves to a "Save" button before fading out. Labels from user's third value prop.

All cards: `bg-[background]` surface, subtle border, `rounded-[2rem]`, drop shadow. Each card has a heading (sans bold) and a brief descriptor.

### D. PHILOSOPHY — "The Manifesto"
- Full-width section with the **dark color** as background.
- A parallaxing organic texture image (Unsplash, `imageMood` keywords) at low opacity behind the text.
- **Typography:** Two contrasting statements. Pattern:
  - "Most [industry] focuses on: [common approach]." — neutral, smaller.
  - "We focus on: [differentiated approach]." — massive, drama serif italic, accent-colored keyword.
- **Animation:** GSAP `SplitText`-style reveal (word-by-word or line-by-line fade-up) triggered by ScrollTrigger.

### E. PROTOCOL — "Sticky Stacking Archive"
3 full-screen cards that stack on scroll.
- **Stacking Interaction:** Using GSAP ScrollTrigger with `pin: true`. As a new card scrolls into view, the card underneath scales to `0.9`, blurs to `20px`, and fades to `0.5`.
- **Each card gets a unique canvas/SVG animation:**
  1. A slowly rotating geometric motif (double-helix, concentric circles, or gear teeth).
  2. A scanning horizontal laser-line moving across a grid of dots/cells.
  3. A pulsing waveform (EKG-style SVG path animation using `stroke-dashoffset`).
- Card content: Step number (monospace), title (heading font), 2-line description. Derive from user's brand purpose.

### F. MEMBERSHIP / PRICING
- Three-tier pricing grid. Card names: "Essential", "Performance", "Enterprise" (adjust to fit brand).
- **Middle card pops:** Primary-colored background with an accent CTA button. Slightly larger scale or `ring` border.
- If pricing doesn't apply, convert this into a "Get Started" section with a single large CTA.

### G. FOOTER
- Deep dark-colored background, `rounded-t-[4rem]`.
- Grid layout: Brand name + tagline, navigation columns, legal links.
- **"System Operational" status indicator** with a pulsing green dot and monospace label.

---

## Technical Requirements (NEVER CHANGE)

- **Stack:** React 19, Tailwind CSS v3.4.17, GSAP 3 (with ScrollTrigger plugin), Lucide React for icons.
- **Fonts:** Load via Google Fonts `<link>` tags in `index.html` based on the selected preset.
- **Images:** Use real Unsplash URLs. Select images matching the preset's `imageMood`. Never use placeholder URLs.
- **File structure:** Single `App.jsx` with components defined in the same file (or split into `components/` if >600 lines). Single `index.css` for Tailwind directives + noise overlay + custom utilities.
- **No placeholders.** Every card, every label, every animation must be fully implemented and functional.
- **Responsive:** Mobile-first. Stack cards vertically on mobile. Reduce hero font sizes. Collapse navbar into a minimal version.

---

## Build Sequence

After receiving answers to the 4 questions:

1. Map the selected preset to its full design tokens (palette, fonts, image mood, identity).
2. Generate hero copy using the brand name + purpose + preset's hero line pattern.
3. Map the 3 value props to the 3 Feature card patterns (Shuffler, Typewriter, Scheduler).
4. Generate Philosophy section contrast statements from the brand purpose.
5. Generate Protocol steps from the brand's process/methodology.
6. Scaffold the project: `npm create vite@latest`, install deps, write all files.
7. Ensure every animation is wired, every interaction works, every image loads.

**Execution Directive:** "Do not build a website; build a digital instrument. Every scroll should feel intentional, every animation should feel weighted and professional. Eradicate all generic AI patterns."




—

2. The prompt I used to build the Splintr site




Act as an elite, award-winning creative developer and digital generative artist. Your task is to write a single, self-contained executable file that renders an ultra-detailed, pixel-perfect, and breathtaking hero section for a next-generation tech company. 

CRITICAL CONSTRAINTS:
- Write the entire solution in exactly ONE single file. 
- Use whatever standard web technologies are best suited to make this run flawlessly in a browser. I do not care about the specific languages or stacks, just deliver the raw, functional code.
- DO NOT use any external image assets, SVGs, placeholders, or stock photos. Everything—including the complex background patterns and the massive 3D-like main visual—must be generated procedurally through pure code, math, and live rendering algorithms.

THEME & CONTENT:
- Industry: Quantum Neural Computing & Advanced AI Syndication.
- Vibe: Immaculate, clinical, hyper-modern, brutalist-yet-elegant. Background is a sleek, stark off-white/silver-grey.

LAYOUT & GLOBAL STYLING:
- Layout: A strict 50/50 vertical split screen (100vw, 100vh), divided exactly in the center by a microscopic 1px subtle line.
- Background: Overlay the entire background with a very faint, highly precise isometric tech-grid or blueprint pattern generated via code.
- Typography: Use a stark contrast between a premium geometric Sans-Serif font for massive headings, and a crisp, technical Monospace font for micro-copy, overlines, and navigation.

TOP NAVIGATION (Overlay):
- Left: A custom, code-drawn minimalist geometric logo.
- Center: Navigation links divided into two groups around the center line. Prefix each link with a subtle `//` (e.g., `// Core`, `// Synapse`, `// Topology`).
- Right: A tiny language toggle (`v EN`) and a sleek, solid dark CTA button ("Initialize").

LEFT PANE (Typography & UI):
- Background Graphic: In the lower-left background, draw a highly detailed, purely code-generated isometric blueprint/schematic of a quantum circuit (barely visible at 10% opacity).
- Overline: `// GENERATE ONCE, PUBLISH EVERYWHERE` in small, widely spaced uppercase monospace.
- Headline: Massive, cinematic sizing. "One piece of content." (medium/bold weight) and "Every platform. Instantly." (very light/thin font weight) on the next line.
- Description: A crisp monospace paragraph detailing zero-latency neural bridging.
- Buttons: Two buttons side-by-side. 
  - Button 1 ("Sign in"): A frosted-glass/blur effect. It MUST be framed by custom, mathematically precise "tech brackets" on the corners (looking like `[ ]` bounding boxes drawn with 1px borders strictly on the absolute corners).
  - Button 2 ("Learn more"): Solid dark, sleek button.
- Stats Row: Anchored at the bottom left, a row of 4 equal data boxes. These boxes must feature a frosted glass background and the exact same custom geometric `[ ]` bracket corners. Inside each: a large bold stat number (e.g., "128Q", "0.01ms") and a tiny uppercase monospace label.

RIGHT PANE (The Generative Masterpiece & HUD):
- The Main Visual: Program a breathtaking, highly complex, live-rendered particle visualization representing a "Quantum Neural Matrix" or "Synthetic Brain".
- Algorithm details: Generate over 80,000 flowing, motion-blurred particle lines forming a 3D asymmetrical, floating neural/quantum structure. It should look like high-speed fiber-optic data streams pulsing with extreme energy.
- Colors: A dense core of blinding hot-cyan and white, mathematically radiating outward into deep ultra-violet, electric blues, and fiery magenta/orange at the outer synapses.
- Backlight: Place a soft, code-generated radial glow behind the nexus.
- Floating HUD Labels: Overlapping the glowing matrix, place 4 distinct UI labels (e.g., "Cryo-State: 15mK", "Entanglement Ratio"). They MUST have frosted glass backgrounds, tiny monospace text, and the custom `[ ]` tech brackets. 
- HUD Lines: From each label, draw a very thin, precise 1px geometric line pointing directly into specific parts of the glowing particle nexus, finished with a tiny intersecting target dot.

EXECUTION:
Give me a masterclass in UI design and algorithmic generative art. Make the particle rendering sharp, highly performant, and visually explosive. Provide only the complete, functional code. No explanations.

–

3. Other website prompt (1)


Role & Context:
Act as an award-winning Senior Creative Frontend Developer and UI/UX Designer. Create a state-of-the-art, breathtaking Hero Section. The entire code (HTML, CSS, JS) must be written in a single .html file using CDN links for libraries (like Tailwind CSS).
Reference Material (Attached):
Based on the attached video/image, I need you to recreate the exact "Only Paper" button effect perfectly.
Design Language & Aesthetics:

Style: Premium "Liquid Metal" meets modern "Soft UI" (Neumorphism) and "Glassmorphism".
Theme: Ultra-clean Light Mode. Highly breathable and minimalist.
Color Palette: Monochromatic metallic tones. Use pristine whites, brushed platinum, cool grays (e.g., #e8eaed), and subtle silver. Absolutely no harsh background colors. Let the iridescent light from the button be the main focal point.
Typography: Bold, structural, and modern (use Google Fonts like 'Syne' for headlines and 'Inter' for text). Tight tracking on massive headings with a subtle metallic text-gradient.
Core Features & Tech Stack:1. The Button Effect (Crucial):
Recreate the liquid metal button border from the reference perfectly. Use an animated, spinning CSS conic-gradient masked behind a Soft UI pill shape. Include "chromatic aberration" (subtle red and blue light fringing) and a pure white specular highlight to mimic realistic light refracting on polished chrome.
2. Interactive Background (Paper.js):
Natively integrate the Paper.js library via CDN. Render a fluid, organic "liquid silver" blob/pool on a <canvas> background that morphs smoothly and reacts magnetically (push/pull physics) to the user's cursor. Add a fixed, subtle SVG noise/grain overlay for a premium tactile texture.
3. UI Elements:
Create a highly creative, floating navigation bar using a Glassmorphism effect (frosted glass with backdrop-filter: blur(24px), translucent white background, and delicate white inset borders).
4. Epic Animations (GSAP):
Use GSAP via CDN for a cinematic entrance timeline. Headlines should use staggered text-mask reveals (skewY), and UI elements should slide up smoothly with premium easing (ease: "power4.out").
5. Imagery & Micro-Interactions:
Do NOT use generic placeholder boxes. Use high-quality Unsplash source URLs featuring abstract 3D shapes, chrome objects, or fluid architecture. Apply CSS filters (grayscale, contrast) to make them blend perfectly with the metal theme. Frame them in asymmetrical Soft UI glass cards. Program a 3D mouse parallax effect so the floating images shift slightly based on cursor position. Implement a custom dot cursor (mix-blend-mode: difference) that expands when hovering over interactive elements.
Output: Provide ONLY the raw, production-ready <!DOCTYPE html> code block. Ensure it is heavily commented and visually spectacular.


—

4. Other website prompt (2)

Act as an elite, Awwwards-winning Creative Frontend Developer and Avant-Garde UI/UX Art Director. Your task is to write a single, production-ready HTML file containing embedded CSS and vanilla JavaScript. 

Create an ultra-detailed "Avant-Garde Architectural Atelier" Features section exactly as described below. Do NOT output any conversational text or markdown explanations. ONLY output the raw HTML code starting with <!DOCTYPE html>.

1. STRICT ART DIRECTION & COLOR PALETTE
- Theme: High-end architectural studio, editorial print magazine, raw materiality.
- Prohibitions: STRICTLY NO purple, blue, green, or neon colors. STRICTLY NO generic SaaS bento grids. NO tech/hacker themes. NO nature themes.
- Exact Color Palette (You MUST use these hex codes):
  - Background Base: #EAE6DF (Warm Plaster)
  - Surface/Cards: #F4F1EB (Museum Off-White)
  - Text Main: #1C1B1A (Deep Charcoal/Ink)
  - Text Muted: #827C75 (Warm Taupe)
  - Accent: #A84B2B (Muted Terracotta/Fired Clay)
  - Borders: rgba(28, 27, 26, 0.12)
- Typography: Use 'Instrument Serif' (for massive, elegant headings with italicized words) and 'Manrope' (for crisp UI text) via Google Fonts. STRICTLY NO Inter or Roboto.
- Icons: Use Phosphor Icons via CDN (Light and Fill weights). Do NOT use Lucide.
- Image Treatment (CRITICAL): Apply a global CSS filter to all Unsplash placeholder images to force them into the earthy palette: `filter: grayscale(80%) sepia(15%) hue-rotate(345deg) contrast(1.1) brightness(0.9);`. Transition to brighter contrast/less grayscale on hover.

2. GLOBAL EFFECTS & BACKGROUND ARCHITECTURE
- Noise Overlay: Add a fixed SVG fractal noise overlay (opacity 0.35, pointer-events none) for an analogue print texture.
- Background Depth: Include an Unsplash texture image with `mix-blend-mode: multiply` and `opacity: 0.12`.
- Drafting Grid: A CSS background grid (using linear-gradients) masked with a radial-gradient fading out at the edges.
- Vertical Lines: Exactly 5 vertical baseline grid lines (1px width) spanning the container, animated to scaleY(1) on scroll.
- Giant Typography: Floating background text (e.g., "ATELIER") at `25vw` font size, perfectly centered, `2%` opacity, with parallax scroll.
- Decorative Markers: Absolute positioned plus (+) and asterisk (*) icons in the background, one slowly spinning.

3. ADVANCED ASYMMETRICAL LAYOUT (12-Column Grid)
Build a highly creative CSS grid featuring these 4 exact components. DO NOT make generic symmetrical boxes:
1. "The Tall Editorial": A tall image spanning multiple rows vertically. The image mask must have an arched top-left corner (`border-radius: 200px 2px 2px 2px`). Overlap a Surface-colored content box on the bottom right corner (breaking outside the image bounds) with meta tags ("01 Methodology") and a title.
2. "The Dark Abstract Block": A dark charcoal box. Inside, add topographic background lines via CSS repeating-radial-gradient. Include a "Discover" Magnetic Button (a circular outline button with absolute positioning logic in JS that smoothly pulls towards the mouse on hover).
3. "The Detail Overlap": A smaller card overlapping the tall editorial. Attach a continuously spinning circular SVG text seal ("• BESPOKE CRAFT • RAW MATERIALITY" using `<textPath>`) halfway off the edge, with a sparkle icon in the center.
4. "The Interactive List": A full-width row at the bottom. Left side: large italicized heading. Right side: A list of 3 items separated by borders. CRITICAL: Hovering a list row must translate the text to the right, turn it terracotta, rotate the icon, AND reveal a floating image that instantly follows the user's cursor across the viewport.

4. ANIMATIONS & MICRO-INTERACTIONS (GSAP)
Import GSAP, ScrollTrigger, and Split-Type. Implement the following:
- Custom Cursor: Hide default cursor. Create a custom cursor with a terracotta dot and a 40px outline ring. Use `gsap.quickTo` for zero-lag tracking. Expand the ring and add a backdrop-blur on interactive elements. On images, turn the ring solid charcoal, hide the dot, and reveal the text "VIEW".
- Hover Reveal Image: Use `gsap.quickTo` to make an absolutely positioned, hidden image follow the cursor when hovering over the methodology list rows. Change the image `src` based on the hovered row.
- Magnetic Logic: Write JS to calculate `clientX/Y` relative to the "Discover" button's bounding box so the button and text smoothly pull towards the cursor.
- Text Reveal: Split the main headline and reveal word-by-word from `translateY(115%)` with `overflow: hidden` wrappers on scroll.
- Scroll Animations: Reveal images using smooth `clip-path: inset(100% 0 0 0)`. Add smooth parallax (`yPercent`) to the background image, giant background text, and grid images.

### 5. EXECUTION
Code must be semantic, production-ready, and fully responsive (stack grid to 1 column and disable custom cursor/hover reveals on touch devices). Write professional, poetic architectural copywriting (e.g. "Orchestrating Silent Volumes"). Start writing the HTML immediately.