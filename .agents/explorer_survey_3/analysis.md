# Explorer Survey 3: In-Depth Clinical Audit & Design Analysis

**Target Files**:
- `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\rheumatools.html`
- `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\index.html`
**Investigator**: Explorer 3 (Clinical Audit & Design Systems Specialist)  
**Date**: 2026-09-18  

---

## 1. Executive Summary

A comprehensive forensic and clinical audit was conducted on `rheumatools.html` and `index.html` in accordance with the project requirements specified in `ORIGINAL_REQUEST.md`.

### Critical Clinical Findings in `rheumatools.html`:
1. **Severe False Remission Glitch on Zero CRP**: Line 277 contains `if (crp > 0) { ... }`. When a patient has an undetectable or 0 mg/L CRP (a standard clinical occurrence in early or controlled rheumatoid arthritis), the entire calculation is skipped, leaving `score = 0`. This defaults to the `else` branch and displays: `Skor DAS28-CRP: 0.00 - Remisi`! Even if a patient presents with 20 swollen joints and 20 tender joints, they are declared to be in "Remisi" (Remission) if CRP is entered as 0 or left blank.
2. **NaN Classified as Remission**: Any negative number in TJC or SJC causes `Math.sqrt()` to yield `NaN`. Because in JavaScript all relational comparisons with `NaN` evaluate to `false` (`NaN > 5.1`, `NaN > 3.2`, `NaN >= 2.6`), execution falls into `else { interpretation = 'Remisi'; colorClass = 'bg-green-200'; }`, rendering: `Skor DAS28-CRP: NaN - Remisi`.
3. **Missing CDAI & SDAI Calculators**: Despite `index.html` explicitly describing `Rheumatools` as implementing "(DAS28, SLEDAI, CDAI)" and Requirement R1 requiring CDAI and SDAI calculations, neither CDAI (Clinical Disease Activity Index) nor SDAI (Simplified Disease Activity Index) exists anywhere in `rheumatools.html`.
4. **Natural Log vs. Log10 Verification**: The DAS28-ESR formula correctly uses natural log (`Math.log(esr)`), but fails completely when `esr <= 0` because Westergren ESR cannot be 0 or negative ($\ln(0) = -\infty$). Like CRP, `esr <= 0` currently skips calculation and reports `0.00 - Remisi`.
5. **Boundary Cutoff Inversion**: EULAR/ACR defines Remission as $\text{DAS28} \le 2.60$. The code evaluates `score >= 2.6` as "Aktivitas Penyakit Rendah" (Low Disease Activity), incorrectly denying Remission status to patients with a score of exactly 2.60.
6. **Iframe & Styling Incompatibilities**: `rheumatools.html` is built with a light-mode layout (`#f8fafc` background, white cards, teal buttons) that completely clashes with the dark obsidian aesthetic (`#040814`) of `index.html`. Furthermore, it relies on external Tailwind CDN (`cdn.tailwindcss.com`) and external Font Awesome CDN (with a typo `xintegrity`), violating the requirement for 100% self-contained single-file HTML embeddable in Google Sites iframes. The body structure `h-screen overflow-hidden` causes nested double scrollbars inside Google Sites iframes.
7. **Contact Link Missing**: Neither `rheumatools.html` nor `index.html` currently contains active links pointing to `mailto:putrawan.2371041010@student.unud.ac.id`. However, `index.html` already possesses the CSS styling rule `.nav-cta` primed for this button.

---

## 2. In-Depth Audit of `rheumatools.html`

### 2.1 Medical Formulas & Algorithmic Audit

#### A. DAS28-ESR (Erythrocyte Sedimentation Rate / LED)
- **Reference**: Prevoo MLL, et al. *Arthritis Rheum* 1995;38(1):44-48; Indonesian Rheumatology Association (IRA) Guidelines 2020.
- **Reference Mathematical Formula**:
  $$\text{DAS28-ESR} = 0.56 \times \sqrt{\text{TJC28}} + 0.28 \times \sqrt{\text{SJC28}} + 0.70 \times \ln(\text{ESR}) + 0.014 \times \text{PGA}$$
  - $\text{TJC28} \in [0, 28]$: Number of tender joints from the 28 standard joints.
  - $\text{SJC28} \in [0, 28]$: Number of swollen joints from the 28 standard joints.
  - $\text{ESR}$: Westergren erythrocyte sedimentation rate (mm/hr). Must use the **natural logarithm** ($\ln$, base $e$), NOT $\log_{10}$.
  - $\text{PGA} \in [0, 100]$: Patient Global Assessment of General Health on a 0–100 mm Visual Analog Scale (VAS).
- **Audit of Current Code (Lines 287–302)**:
  ```javascript
  page.querySelector('#calculate-ra-das28-esr').addEventListener('click', () => {
      const tjc = parseFloat(page.querySelector('#ra-tjc-das').value) || 0;
      const sjc = parseFloat(page.querySelector('#ra-sjc-das').value) || 0;
      const esr = parseFloat(page.querySelector('#ra-esr-das').value) || 0;
      const pga = parseFloat(page.querySelector('#ra-pga-das').value) || 0;
      let score = 0;
      if (esr > 0) {
         score = (0.56 * Math.sqrt(tjc)) + (0.28 * Math.sqrt(sjc)) + (0.70 * Math.log(esr)) + (0.014 * pga);
      }
      let interpretation, colorClass;
      if (score > 5.1) { interpretation = 'Aktivitas Penyakit Tinggi'; colorClass = 'bg-red-200'; }
      else if (score > 3.2) { interpretation = 'Aktivitas Penyakit Sedang'; colorClass = 'bg-yellow-200'; }
      else if (score >= 2.6) { interpretation = 'Aktivitas Penyakit Rendah'; colorClass = 'bg-blue-200'; }
      else { interpretation = 'Remisi'; colorClass = 'bg-green-200'; }
      showResult(page.querySelector('#ra-das28-esr-result'), `Skor DAS28-LED: ${score.toFixed(2)}<br>${interpretation}`, colorClass);
  });
  ```
- **Findings & Flaws**:
  - `Math.log(esr)` correctly implements the natural logarithm ($\ln$).
  - When `esr <= 0` or blank, `if (esr > 0)` fails, leaving `score = 0`. The function proceeds to classify `0.00` as `Remisi` with `bg-green-200`. Westergren ESR mathematically requires $\text{ESR} \ge 1\text{ mm/hr}$ ($\ln(0) = -\infty$). Missing or non-positive ESR must trigger a clinical validation prompt: "ESR must be greater than 0 mm/hr".
  - If negative values are entered (e.g. `tjc = -4`), `Math.sqrt(-4)` returns `NaN`. `NaN` is categorized as `Remisi`.

#### B. DAS28-CRP (C-Reactive Protein)
- **Reference**: Inoue E, et al. *J Rheumatol* 2007;34(5):840-845; Wells G, et al. *Ann Rheum Dis* 2009;68(6):954-960.
- **Reference Mathematical Formula**:
  $$\text{DAS28-CRP} = 0.56 \times \sqrt{\text{TJC28}} + 0.28 \times \sqrt{\text{SJC28}} + 0.36 \times \ln(\text{CRP} + 1) + 0.014 \times \text{PGA} + 0.96$$
  - $\text{CRP}$: Must be in **mg/L** (if entered in mg/dL, it must be converted by multiplying by 10).
  - The term $\ln(\text{CRP} + 1)$ uses natural log. The addition of $+1$ ensures that if $\text{CRP} = 0\text{ mg/L}$, $\ln(0+1) = \ln(1) = 0$.
  - Intercept $+ 0.96$: Essential baseline scaling factor developed by Inoue et al. to align DAS28-CRP with DAS28-ESR.
- **Audit of Current Code (Lines 271–286)**:
  ```javascript
  page.querySelector('#calculate-ra-das28-crp').addEventListener('click', () => {
      const tjc = parseFloat(page.querySelector('#ra-tjc-das').value) || 0;
      const sjc = parseFloat(page.querySelector('#ra-sjc-das').value) || 0;
      const crp = parseFloat(page.querySelector('#ra-crp-das').value) || 0;
      const pga = parseFloat(page.querySelector('#ra-pga-das').value) || 0;
      let score = 0;
      if (crp > 0) {
          score = (0.56 * Math.sqrt(tjc)) + (0.28 * Math.sqrt(sjc)) + (0.36 * Math.log(crp + 1)) + (0.014 * pga) + 0.96;
      }
      let interpretation, colorClass;
      if (score > 5.1) { interpretation = 'Aktivitas Penyakit Tinggi'; colorClass = 'bg-red-200'; }
      else if (score > 3.2) { interpretation = 'Aktivitas Penyakit Sedang'; colorClass = 'bg-yellow-200'; }
      else if (score >= 2.6) { interpretation = 'Aktivitas Penyakit Rendah'; colorClass = 'bg-blue-200'; }
      else { interpretation = 'Remisi'; colorClass = 'bg-green-200'; }
      showResult(page.querySelector('#ra-das28-crp-result'), `Skor DAS28-CRP: ${score.toFixed(2)}<br>${interpretation}`, colorClass);
  });
  ```
- **Findings & Flaws**:
  - **Severe Bug**: `if (crp > 0)` prevents calculation when `crp === 0`. In clinical biochemistry, normal high-sensitivity CRP is often reported as `< 1 mg/L` or `0.0 mg/L`. When entered as 0, the code ignores joints and PGA, outputting `0.00 - Remisi`! The mathematical equation explicitly accounts for 0 via $\ln(\text{CRP}+1) = \ln(1) = 0$. Therefore, valid CRP input is $\text{CRP} \ge 0$.
  - Benchmark Test Case from `ORIGINAL_REQUEST.md`:
    - Patient: $\text{TJC} = 6, \text{SJC} = 4, \text{CRP} = 15\text{ mg/L}, \text{PGA} = 40\text{ mm}$.
    - Exact calculation:
      $$0.56 \times \sqrt{6} \approx 1.371714$$
      $$0.28 \times \sqrt{4} = 0.560000$$
      $$0.36 \times \ln(15 + 1) = 0.36 \times \ln(16) \approx 0.998132$$
      $$0.014 \times 40 = 0.560000$$
      $$\text{Constant} = 0.960000$$
      $$\text{Total} = 1.371714 + 0.56 + 0.998132 + 0.56 + 0.96 = 4.449846 \to \mathbf{4.45}$$
    - Disease activity: Moderate ($3.2 < 4.45 \le 5.1$).

#### C. Missing Calculators: CDAI and SDAI
Neither CDAI nor SDAI is present in `rheumatools.html`. They must be added to provide a complete, validated rheumatology suite.
1. **CDAI (Clinical Disease Activity Index)**:
   - **Reference**: Aletaha D, et al. *Arthritis Res Ther* 2005;7(4):R796-R806.
   - **Formula**:
     $$\text{CDAI} = \text{TJC28} + \text{SJC28} + \text{PGA} + \text{EGA}$$
     - $\text{TJC28} \in [0, 28]$
     - $\text{SJC28} \in [0, 28]$
     - $\text{PGA} \in [0, 10]$: Patient Global Assessment (0 to 10 cm scale).
     - $\text{EGA} \in [0, 10]$: Evaluator / Physician Global Assessment (0 to 10 cm scale).
     - Range: 0 to 76. No laboratory test required.
2. **SDAI (Simplified Disease Activity Index)**:
   - **Reference**: Smolen JS, et al. *Rheumatology* 2003;42(2):244-257.
   - **Formula**:
     $$\text{SDAI} = \text{TJC28} + \text{SJC28} + \text{PGA} + \text{EGA} + \text{CRP}_{(\text{mg/dL})}$$
     - Crucial Clinical Distinction: $\text{CRP}$ in SDAI is expressed in **mg/dL**!
     - If patient CRP is entered in mg/L, it must be divided by 10 ($\text{mg/dL} = \text{mg/L} / 10$).
     - Range: 0.0 to $86.0+$ (depending on CRP magnitude).

#### D. ACR/EULAR Scoring Cutoffs & Activity Classifications
A rigorous comparison of all validated ACR/EULAR activity cutoffs:

| Assessment Tool | Remission | Low Disease Activity (LDA) | Moderate Disease Activity (MDA) | High Disease Activity (HDA) |
|---|---|---|---|---|
| **DAS28-ESR** | $\le 2.6$ | $2.6 < \text{score} \le 3.2$ | $3.2 < \text{score} \le 5.1$ | $> 5.1$ |
| **DAS28-CRP** | $\le 2.6$ | $2.6 < \text{score} \le 3.2$ | $3.2 < \text{score} \le 5.1$ | $> 5.1$ |
| **CDAI** | $\le 2.8$ | $2.8 < \text{score} \le 10.0$ | $10.0 < \text{score} \le 22.0$ | $> 22.0$ |
| **SDAI** | $\le 3.3$ | $3.3 < \text{score} \le 11.0$ | $11.0 < \text{score} \le 26.0$ | $> 26.0$ |

*Implementation Guardrail Requirement*:
```javascript
function classifyDAS28(score) {
  if (isNaN(score)) return { level: 'Error', text: 'Invalid Input', color: 'bg-red-900/50 text-red-300' };
  if (score > 5.1) return { level: 'High', text: 'Aktivitas Penyakit Tinggi (High Activity)', color: 'bg-red-500/20 text-red-400 border border-red-500/30' };
  if (score > 3.2) return { level: 'Moderate', text: 'Aktivitas Penyakit Sedang (Moderate Activity)', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' };
  if (score > 2.6) return { level: 'Low', text: 'Aktivitas Penyakit Rendah (Low Activity)', color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' };
  return { level: 'Remission', text: 'Remisi Klinis (Clinical Remission)', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' };
}
```

---

### 2.2 Survey of Remaining Tools in `rheumatools.html`

| Tab / Page | Clinical Standard / Criteria | Current Logic Status & Observations |
|---|---|---|
| **1. Pendekatan Diagnosis Nyeri Sendi** | Algoritma Diagnosis Nyeri Sendi (IRA 2020) | Step-by-step interactive decision tree (Trauma $\to$ Articular/Non-articular $\to$ Acute/Chronic $\to$ Inflammatory $\to$ Joint Count). Logic is sound, but styled in bright light mode. |
| **2. Rheumatoid Arthritis (Diagnosis)** | ACR/EULAR 2010 Classification Criteria | Evaluates Joint involvement (0-5), Serology RF/ACPA (0-3), APR CRP/ESR (0-1), Duration (0-1). Threshold $\ge 6$ points. Functioning as intended. |
| **3. SLE (Diagnosis & Activity)** | ACR/EULAR 2019 SLE Criteria & SLEDAI-2K (Gladman 2002) | - ACR 2019: 10 domains with radio/checkboxes. Prerequisite ANA $\ge 1:80$. Cutoff $\ge 10$.<br>- SLEDAI-2K: 24 descriptors across 4 weight tiers (8, 4, 2, 1). Thresholds: $>20$ Very High, 11-20 High, 6-10 Moderate, 1-5 Mild, 0 Inactive. Sound implementation. |
| **4. Psoriatic Arthritis** | CASPAR Criteria (2006) & DAPSA | - CASPAR: Points for psoriasis, nails, RF neg, dactylitis, juxta-articular new bone. Cutoff $\ge 3$.<br>- DAPSA: $\text{TJC} + \text{SJC} + \text{CRP}_{(\text{mg/dL})} + \text{PGA} + \text{Pain}$. Cutoffs: $\le 4$ Remission, $4-14$ Low, $14-28$ Moderate, $>28$ High. Note: prone to same blank-input bug as DAS28! |
| **5. Ankylosing Spondylitis** | ASAS 2009 & BASDAI (0-10 VAS) | - ASAS: Sacroiliitis + $\ge 1$ SpA feature, or HLA-B27 + $\ge 2$ features.<br>- BASDAI: Formula `((Q1 + Q2 + Q3 + Q4) + ((Q5 + Q6) / 2)) / 5`. Cutoff $\ge 4$ active. Missing validation if questions are unanswered. |
| **6. Systemic Sclerosis** | ACR/EULAR 2013 Criteria & modified Rodnan Skin Score (mRSS) | - ACR 2013: Cutoff $\ge 9$.<br>- mRSS: 0-51 score with embedded base64 anatomy diagram. Cutoffs: 0 none, 1-14 mild, 15-29 moderate, $>29$ severe. Diagram is base64 inlined (self-contained). |
| **7. Gout** | ACR/EULAR 2015 Criteria & Steinbrocker Functional Class | Pattern, characteristics, time course, tophi, urate level, imaging. Cutoff $\ge 8$. Steinbrocker class I-IV. Sound logic. |
| **8. Referensi** | IRA, ACR, EULAR literature citations | Text list of 7 primary guideline citations. |

---

### 2.3 Edge Case Inputs & Guardrail Audit Matrix

| Input Scenario | Current Behavior in `rheumatools.html` | Clinical Risk | Correct Guardrail Behavior |
|---|---|---|---|
| **All fields empty / blank on click** | Coerces to `0`. `score = 0.00`, reports **Remisi** (`bg-green-200`). | Severe False Remission diagnosis on unexamined patient. | Halt execution, display toast or inline validation: *"Please enter Tender Joint Count, Swollen Joint Count, and Lab values."* |
| **CRP = 0 mg/L (Normal / undetectable)** | Line 277 `if (crp > 0)` skips calculation; `score = 0`; reports **Remisi**. | Patient with 20 swollen joints and 0 CRP falsely classified in Remission. | Compute formula normally: $\ln(0+1) = \ln(1) = 0$. $\text{DAS28-CRP} = 0.56\sqrt{\text{TJC}} + 0.28\sqrt{\text{SJC}} + 0.014\text{PGA} + 0.96$. |
| **ESR = 0 mm/hr (Entered as 0 or empty)** | Line 293 `if (esr > 0)` skips calculation; `score = 0`; reports **Remisi**. | Skips assessment, outputs false Remission. | Display error: *"Westergren ESR must be $\ge 1\text{ mm/hr}$."* |
| **Negative joint counts (e.g. TJC = -2)** | `Math.sqrt(-2)` returns `NaN`. `NaN` falls through to `else` branch, reports `NaN - Remisi`. | Nonsensical, misleading output claiming remission. | Validate $0 \le \text{TJC} \le 28$ and $0 \le \text{SJC} \le 28$. Clamp or reject negatives. |
| **Joint count > 28 (e.g. TJC = 35)** | Allowed without warning; inflates score beyond standard 28-joint boundaries. | Mathematical violation of 28-joint protocol. | Reject inputs $> 28$ or clamp to 28 with warning badge. |
| **PGA > 100 or PGA < 0** | Allowed without warning; distorts score scaling. | VAS distortion. | Validate $\text{PGA} \in [0, 100]$. |
| **Extremely high CRP (e.g. CRP = 300 mg/L)** | Mathematically computes $\ln(301) \approx 5.70$; yields very high DAS28 score. | Accurately reflects extreme acute phase reaction. | Handled correctly, but should include clinical note regarding concurrent infection. |

---

### 2.4 Styling & Iframe Embedding Compatibility

1. **Current Layout & Dependencies**:
   - Lines 7–10:
     ```html
     <script src="https://cdn.tailwindcss.com"></script>
     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" xintegrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
     ```
   - **Issues Identified**:
     - CDN script `cdn.tailwindcss.com` evaluates Tailwind on the client side. If embedded inside Google Sites or an intranet sandbox with Content Security Policy (CSP) blocking external eval scripts, Tailwind fails to run, causing severe CSS breakage.
     - External Font Awesome stylesheet has an invalid attribute `xintegrity` (legacy typo from copy-pasting).
     - Light-mode palette (`background-color: #f8fafc;`, white cards, teal borders) completely diverges from `index.html`.
2. **Iframe Scroll Trap & Google Sites Sandbox**:
   - `rheumatools.html` uses:
     `<body class="flex h-screen overflow-hidden">`
     and inside `<main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">`.
   - In an iframe on Google Sites, `h-screen` sets height to $100\text{vh}$ of the iframe viewport. When the user scrolls on mobile or desktop, mouse events get trapped in the inner `overflow-y-auto` container, creating awkward double scrollbars.
   - **Recommendation**: Provide a responsive, fluid container layout with standalone glassmorphic cards and optional iframe-friendly mode (allowing page-level scroll or clean auto-resizing), while eliminating runtime CDN script dependencies.

---

## 3. In-Depth Audit of `index.html`

### 3.1 Design System Tokens & Aesthetic Architecture

`index.html` implements an ultra-modern "clinical dark obsidian" design language with the following token hierarchy:

```css
:root {
  --bg-dark: #040814;                      /* Deep obsidian space backdrop */
  --card-bg: rgba(15, 23, 42, 0.75);       /* Frosted glass slate container */
  --card-border: rgba(255, 255, 255, 0.08);/* Subtle border */
  --card-border-hover: rgba(0, 242, 254, 0.45); /* Luminous cyan border */
  --accent-cyan: #00F2FE;                   /* Glowing primary clinical cyan */
  --accent-blue: #4FACFE;                   /* Gradient blue companion */
  --text-pure: #F8FAFC;                     /* High-contrast crisp white */
  --text-dim: #94A3B8;                      /* Secondary slate text */
  --text-muted: #64748B;                    /* Tertiary muted text */
  --radius-pill: 9999px;                    /* Fully rounded pill buttons & nav */
  --radius-lg: 20px;                        /* Primary card container curvature */
  --radius-md: 14px;                        /* Nested container curvature */
}
```

Key visual characteristics:
- **Atmospheric Glows**: Fixed-position radial gradient ambient halos (`.ambient-glow-1` cyan, `.ambient-glow-2` indigo) that dynamically track mouse cursor motion (`window.addEventListener('mousemove')`).
- **Interactive 3D Tilt Cards**: CSS 3D perspective (`perspective(1000px)`) with dynamic spotlight gradient (`radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 242, 254, 0.12), transparent 40%)`).
- **Typography**:
  - Headings & Branding: `Plus Jakarta Sans`, font-weights 600, 700, 800.
  - Body & Metrics: `Inter`, font-weights 400, 500, 600.
- **Glassmorphism**: `backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);`.
- **Buttons**:
  - Primary: `.btn-gradient` (`linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)`, color `#030712`, box-shadow `0 8px 24px rgba(0, 242, 254, 0.3)`).
  - Secondary: `.btn-glass` (`rgba(255, 255, 255, 0.05)`, border `rgba(255, 255, 255, 0.14)`).

---

### 3.2 Navbar & Footer Contact Integration Points

#### A. Navbar Analysis (Lines 581–593):
```html
<header class="nav-wrapper">
  <nav class="nav-pill">
    <a href="#" class="nav-brand">
      <span class="nav-brand-dot"></span>
      <span>drguswib</span>
    </a>
    <div class="nav-items">
      <a href="#clinical-tools">Clinical Tools</a>
      <a href="#utilities">Utilities</a>
    </div>
  </nav>
</header>
```
- **Discovery**: In `index.html` lines 134–147, the `.nav-cta` class is **already defined** in the stylesheet:
  ```css
  .nav-cta {
    background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%);
    color: #030712 !important;
    font-weight: 600 !important;
    padding: 0.35rem 0.9rem;
    border-radius: var(--radius-pill);
    font-size: 0.8rem !important;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
  }
  ```
  However, no element in the HTML was currently assigned this class!
- **Exact Integration Point**:
  Insert inside `<div class="nav-items">`:
  ```html
  <a href="mailto:putrawan.2371041010@student.unud.ac.id" class="nav-cta">Contact Me</a>
  ```

#### B. Footer Analysis (Lines 740–753):
```html
<footer>
  <div class="footer-inner">
    <p style="font-weight: 600; color: #FFFFFF; font-size: 0.95rem;">
      drguswib
    </p>
    <div class="disclaimer-box">
      <strong>Clinical Disclaimer:</strong> Clinical calculators and protocols on this site are intended for clinical decision support and educational reference for qualified healthcare professionals. They do not replace autonomous medical judgment or institutional hospital guidelines.
    </div>
    <p style="font-size: 0.82rem; color: var(--text-muted);">
      &copy; 2026 drguswib. All rights reserved.
    </p>
  </div>
</footer>
```
- **Exact Integration Point**:
  Add a high-contrast, prominent Contact CTA container directly above or below the disclaimer:
  ```html
  <div class="footer-contact" style="margin: 0.5rem 0 1rem;">
    <a href="mailto:putrawan.2371041010@student.unud.ac.id" class="btn-gradient" style="padding: 0.75rem 1.75rem; font-size: 0.9rem;">
      Contact Dr. Guswib &#9993;
    </a>
  </div>
  ```

#### C. Tool-Level Contact Links:
Inside `rheumatools.html` (and similarly `adjustr-io.html`, `adjustr-fluid.html`), place a subtle feedback pill in the top header and footer:
```html
<a href="mailto:putrawan.2371041010@student.unud.ac.id" class="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5">
  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  Clinical Feedback & Contact
</a>
```

---

## 4. Implementation Blueprint for Worker Agents

### 4.1 Recommended Calculation Engine for `rheumatools.html`
```javascript
/**
 * Validated Rheumatology Calculation Engine
 */
const RheumaCalc = {
  // DAS28-ESR
  calculateDAS28_ESR(tjc, sjc, esr, pga) {
    if (isNaN(tjc) || tjc < 0 || tjc > 28) throw new Error('Tender Joint Count must be between 0 and 28');
    if (isNaN(sjc) || sjc < 0 || sjc > 28) throw new Error('Swollen Joint Count must be between 0 and 28');
    if (isNaN(esr) || esr <= 0) throw new Error('ESR must be greater than 0 mm/hr');
    if (isNaN(pga) || pga < 0 || pga > 100) throw new Error('Patient Global Assessment must be between 0 and 100 mm');

    const score = (0.56 * Math.sqrt(tjc)) + (0.28 * Math.sqrt(sjc)) + (0.70 * Math.log(esr)) + (0.014 * pga);
    return {
      score: parseFloat(score.toFixed(2)),
      activity: this.classifyDAS28(score)
    };
  },

  // DAS28-CRP (CRP in mg/L)
  calculateDAS28_CRP(tjc, sjc, crp_mg_L, pga) {
    if (isNaN(tjc) || tjc < 0 || tjc > 28) throw new Error('Tender Joint Count must be between 0 and 28');
    if (isNaN(sjc) || sjc < 0 || sjc > 28) throw new Error('Swollen Joint Count must be between 0 and 28');
    if (isNaN(crp_mg_L) || crp_mg_L < 0) throw new Error('CRP must be >= 0 mg/L');
    if (isNaN(pga) || pga < 0 || pga > 100) throw new Error('Patient Global Assessment must be between 0 and 100 mm');

    const score = (0.56 * Math.sqrt(tjc)) + (0.28 * Math.sqrt(sjc)) + (0.36 * Math.log(crp_mg_L + 1)) + (0.014 * pga) + 0.96;
    return {
      score: parseFloat(score.toFixed(2)),
      activity: this.classifyDAS28(score)
    };
  },

  // CDAI (PGA and EGA on 0-10 scale)
  calculateCDAI(tjc, sjc, pga_10, ega_10) {
    if (isNaN(tjc) || tjc < 0 || tjc > 28) throw new Error('Tender Joint Count must be between 0 and 28');
    if (isNaN(sjc) || sjc < 0 || sjc > 28) throw new Error('Swollen Joint Count must be between 0 and 28');
    if (isNaN(pga_10) || pga_10 < 0 || pga_10 > 10) throw new Error('PGA must be between 0 and 10');
    if (isNaN(ega_10) || ega_10 < 0 || ega_10 > 10) throw new Error('EGA must be between 0 and 10');

    const score = tjc + sjc + pga_10 + ega_10;
    return {
      score: parseFloat(score.toFixed(2)),
      activity: this.classifyCDAI(score)
    };
  },

  // SDAI (CRP in mg/dL, PGA and EGA on 0-10 scale)
  calculateSDAI(tjc, sjc, pga_10, ega_10, crp_mg_dL) {
    if (isNaN(tjc) || tjc < 0 || tjc > 28) throw new Error('Tender Joint Count must be between 0 and 28');
    if (isNaN(sjc) || sjc < 0 || sjc > 28) throw new Error('Swollen Joint Count must be between 0 and 28');
    if (isNaN(pga_10) || pga_10 < 0 || pga_10 > 10) throw new Error('PGA must be between 0 and 10');
    if (isNaN(ega_10) || ega_10 < 0 || ega_10 > 10) throw new Error('EGA must be between 0 and 10');
    if (isNaN(crp_mg_dL) || crp_mg_dL < 0) throw new Error('CRP must be >= 0 mg/dL');

    const score = tjc + sjc + pga_10 + ega_10 + crp_mg_dL;
    return {
      score: parseFloat(score.toFixed(2)),
      activity: this.classifySDAI(score)
    };
  },

  classifyDAS28(score) {
    if (score > 5.1) return { level: 'High', label: 'Aktivitas Penyakit Tinggi (High Activity)' };
    if (score > 3.2) return { level: 'Moderate', label: 'Aktivitas Penyakit Sedang (Moderate Activity)' };
    if (score > 2.6) return { level: 'Low', label: 'Aktivitas Penyakit Rendah (Low Activity)' };
    return { level: 'Remission', label: 'Remisi Klinis (Remission)' };
  },

  classifyCDAI(score) {
    if (score > 22.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)' };
    if (score > 10.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)' };
    if (score > 2.8) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)' };
    return { level: 'Remission', label: 'Remisi Klinis (Remission)' };
  },

  classifySDAI(score) {
    if (score > 26.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)' };
    if (score > 11.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)' };
    if (score > 3.3) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)' };
    return { level: 'Remission', label: 'Remisi Klinis (Remission)' };
  }
};
```

### 4.2 Benchmark Test Suite Verification Script (`verify_calculations.js`)
Test Scenario 3 specification:
```javascript
// Test Scenario 3: Rheumatology DAS28-CRP Reference Test
const res = RheumaCalc.calculateDAS28_CRP(6, 4, 15, 40);
assert.strictEqual(res.score, 4.45, 'DAS28-CRP score must equal 4.45');
assert.strictEqual(res.activity.level, 'Moderate', 'Activity level must be Moderate');
```
Edge Case Test Scenario:
```javascript
// Zero CRP test: Must compute joints and PGA, not output 0.00 Remission
const resZero = RheumaCalc.calculateDAS28_CRP(10, 5, 0, 50);
// 0.56*sqrt(10) [1.7708] + 0.28*sqrt(5) [0.6261] + 0 + 0.014*50 [0.70] + 0.96 = 4.06
assert.strictEqual(resZero.score, 4.06, 'Zero CRP must not wipe out joint score');
assert.strictEqual(resZero.activity.level, 'Moderate');
```

---

## 5. Summary Table of Action Items for Implementation

| File | Target Section | Required Action | Status in Audit |
|---|---|---|---|
| `rheumatools.html` | RA Activity Tab | Fix zero-CRP bypass; add input validation for bounds ($0-28, 0-100, \text{ESR}>0$); fix NaN classification. | Documented & Verified |
| `rheumatools.html` | RA Activity Section | Add CDAI and SDAI calculators with appropriate 0-10 scale inputs and mg/dL CRP conversions. | Architected & Specified |
| `rheumatools.html` | Visual Styles | Convert light theme (`#f8fafc`) to dark obsidian glassmorphism (`#040814`, `rgba(15, 23, 42, 0.75)`, cyan luminous accents). | Token specs provided |
| `rheumatools.html` | Embedding & Dependencies | Inline CSS; remove external `cdn.tailwindcss.com` dependency; replace CDN Font Awesome with inline SVG icons; fix `overflow-hidden` iframe scrolling traps. | Documented & Specified |
| `rheumatools.html` | Header/Footer | Add Contact / Feedback link to `mailto:putrawan.2371041010@student.unud.ac.id`. | Exact code provided |
| `index.html` | Floating Navbar | Activate `.nav-cta` class on new "Contact Me" button inside `.nav-items`. | Verified CSS & DOM |
| `index.html` | Footer | Add high-visibility "Contact Me" button styled with `.btn-gradient`. | Verified DOM & placement |
| `verify_calculations.js` | Test Suite | Include DAS28-CRP, DAS28-ESR, CDAI, SDAI, and edge case assertions. | Test cases constructed |
