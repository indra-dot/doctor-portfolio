# DESIGN.md — Dr. Guswib Clinical Software Portfolio

## Design Philosophy & Identity
- **Inspiration:** RedSun (Oversight) Webflow SaaS Showcase (`https://ovo-redsun.webflow.io/`) with custom medical precision adaptations.
- **Tone:** Authoritative, high-clarity, modern, trustworthy, physician-crafted, tech-savvy.
- **Key Enhancements (Phase 2):**
  1. **Mathematical Centering:** Hero container column alignment, centered display headline (`margin: 0 auto 1.25rem; text-align: center;`), and 3-column CSS Grid window header (`grid-template-columns: 1fr auto 1fr`) keeping tab switcher centered.
  2. **Signature RedSun Horizon Sun Graphic:** Massive circular planetary horizon orb (`.redsun-orb-wrapper`, `.redsun-solar-flare`, `.redsun-planet-disc`, `.redsun-core-glow`, `.redsun-horizon-fade`) sitting behind the Showcase Window that rotates/scales with scroll (`--scroll-ratio`, `--beam-angle`).
  3. **Multi-Layered Glassmorphism:** Rich frosted glass surfaces (`backdrop-filter: blur(18px–28px) saturate(165%–185%)`), dual specular borders (`inset 0 1px 0 rgba(255,255,255,0.24)`), and ambient backlight refraction.
  4. **3-Tab Interactive Showcase Window:**
     - Tab 1: **InternaHub CDSS** (Live Cockcroft-Gault CrCl calculator + Sanford Meropenem renal adjustment).
     - Tab 2: **IPD CBT Pro** (Computer-based board exam simulator with CURB-65 pneumonia case vignette).
     - Tab 3: **Internize.ai** (Interactive on-device clinical AI simulator with HIPAA Safe Harbor de-identification, NER entity highlight, and live FHIR R4 Transaction Bundle JSON inspector).
- **Craft Floor Compliance:** Zero decorative AI gradient-text slop, zero low-contrast text (<4.5:1), zero sub-11px text, zero fake pulsing dots, zero unnumbered bento card titles.

## Color Palette & Glassmorphic Tokens
```css
--bg: #040814;
--bg-surface: #0A1022;
--surface-card: #0D162E;
--surface-card-hover: #121D3D;
--surface-elevated: #162244;

/* Glassmorphism System */
--glass-surface-1: linear-gradient(145deg, rgba(14, 26, 56, 0.62) 0%, rgba(6, 12, 28, 0.48) 100%);
--glass-surface-2: linear-gradient(145deg, rgba(18, 34, 74, 0.72) 0%, rgba(8, 16, 36, 0.58) 100%);
--glass-blur: blur(20px) saturate(175%);
--glass-bevel: inset 0 1px 0 rgba(255, 255, 255, 0.22);
--line-glass-edge: rgba(255, 255, 255, 0.16);

--text-1: #F8FAFC;        /* 15.8:1 contrast on #040814 */
--text-2: #CBD5E1;        /* 11.2:1 contrast */
--text-3: #94A3B8;        /* 6.8:1 contrast */
--text-subtle: #8494AB;   /* 5.2:1 contrast */

--cyan: #00F2FE;          /* Primary Clinical Accent */
--teal: #2DD4BF;          /* Secondary Clinical Accent */
--blue: #38BDF8;
--emerald: #10B981;
--amber: #F59E0B;
--rose: #F43F5E;
```

## Typography
- **Display Headings:** `'Outfit', system-ui, -apple-system, sans-serif`
- **Body & Controls:** `'Manrope', system-ui, -apple-system, sans-serif`
- **Metrics, Calculators & Code:** `'JetBrains Mono', monospace` (`font-variant-numeric: tabular-nums`)

## Dynamic Interactive Components
1. **RedSun Scroll Lighting Engine:** Conformed linear-gradient beam and planetary corona rotation tracking `--scroll-ratio`, `--beam-angle`, and `--beam-pos`.
2. **Interactive Showcase Mockup:** 3-tab window with live CrCl calculator, IPD CBT Pro question bank, and Internize.ai On-Device Clinical AI simulator.
3. **Asymmetric Bento Grid (Clean Titles without Numbers):** 12-column hierarchical grid with 7-col featured card for InternaHub CDSS, 5-col for IPD CBT Pro, and three 4-col companion cards (Pindai Sehat, Internize.ai, Dompetku).
