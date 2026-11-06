# Comprehensive Audit & Survey Report: adjustr-io.html

**Explorer**: Explorer 1 (Doctor Portfolio Audit Team)  
**Date**: 2026-09-18  
**Target File**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\adjustr-io.html`  
**Reference Design**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\index.html`  
**Original Mandate**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\.agents\ORIGINAL_REQUEST.md`

---

## 1. Executive Summary

A comprehensive, line-by-line clinical and architectural audit of `adjustr-io.html` was conducted. While the application possesses a functional single-page React architecture with 36 antimicrobial agents, the audit identified **severe clinical calculation defects, fatal boundary gap fallbacks, complete omissions of required clinical guidelines (CKD-EPI / KDIGO), and visual dissonance with the portfolio design system**.

### Summary of Critical Findings:

| Domain | Issue Description | Clinical / Operational Severity |
|---|---|---|
| **Weight Selection Logic** | Any patient with Total Body Weight (TBW) > Devine Ideal Body Weight (IBW)—even a lean patient with BMI 22—is classified as "Adjusted (Obese)" and dosed using Adjusted Body Weight (ABW). BMI is never computed. | **CRITICAL**: Falsely down-adjusts CrCl in normal-weight patients, risking underdosing of life-saving antibiotics in sepsis. |
| **Silent Fallback to Standard Dose** | 148 boundary test cases across nearly all 36 drugs fail range matching due to decimal gaps (e.g., 29.9 to 30) or missing low ranges (CrCl < 5 or < 15). When unmatched, the calculator silently defaults to the **full standard maximum dose**! | **CRITICAL / LETHAL**: An anuric or ESRD patient with CrCl = 3 mL/min on Ampicillin-Sulbactam or Cotrimoxazole receives the full unadjusted standard dose. |
| **eGFR & KDIGO Omission** | No eGFR equation (CKD-EPI 2021) is implemented. No KDIGO staging (G1–G5) is calculated or displayed. The tool only computes raw Cockcroft-Gault CrCl. | **HIGH**: Fails Requirement R1 and KDIGO international practice guidelines. |
| **RRT (HD / CRRT) Gaps** | 25 out of 36 antimicrobial agents completely lack Renal Replacement Therapy (Hemodialysis / CRRT) dosing regimens, including critical ICU agents like **Meropenem**, **Penicillin G**, **Gentamicin**, **Amikacin**, and **Daptomycin**. | **HIGH**: Leaves clinicians without guidance for dialyzed patients receiving nephrotoxic or cleared drugs. |
| **Input Validation & NaN** | Negative inputs (e.g., Weight = -70, Height = -170) produce `NaN` BSA values and negative CrCl without validation errors. Age > 140 produces negative CrCl. Age < 18 calculates adult Cockcroft-Gault without pediatric warnings. Extreme low creatinine (0.001) produces CrCl of 89,000 mL/min without upper cap. | **HIGH**: Produces misleading outputs, broken UI strings (`NaN m2`), and triggers the silent fallback to full dose. |
| **Safety Guardrails & Ceiling Limits** | No prominent warning banners for CrCl < 15 mL/min (Kidney Failure). No prominent neurotoxicity alerts for high-dose Cefepime/Penicillin G in renal impairment. No alert for contraindicated drugs like Nitrofurantoin. | **HIGH**: Lacks essential clinical guardrails for hazardous ranges. |
| **Visual Design Dissonance** | The application currently uses a light-mode generic slate/blue theme (`bg-slate-50`, white cards). It lacks the dark obsidian (`#040814`), frosted glassmorphic card styling (`rgba(15, 23, 42, 0.75)`), and cyan glow accents (`#00F2FE` / `#4FACFE`) of `index.html`. | **MEDIUM**: Inconsistent portfolio brand identity. |
| **Google Sites Iframe Compatibility** | Hardcoded reference to `./vite.svg` causes 404 network errors. Missing Google Fonts inlining/preconnect. Contact Me button pointing to `mailto:putrawan.2371041010@student.unud.ac.id` is completely absent. | **MEDIUM**: Broken asset calls and missing requirement R3. |

---

## 2. File Architecture & Script Construction

`adjustr-io.html` is a 253,490-byte self-contained HTML document compiled from a Vite + React 19 project.
- **Lines 1–7**: Document doctype, meta tags, and broken favicon link (`href="./vite.svg"`).
- **Line 8**: Minified `<script type="module" crossorigin>` containing:
  - React v19.2.3 core & DOM reconciler (~192 KB).
  - Lucide icons bundle (`activity`, `calculator`, `alert-triangle`, `book-open`, etc.).
  - Antibiotic database `Ol` (36 drugs, lines 196832–217343).
  - Calculation functions `R1`, `B1`, `V1`, `Gt`, `Ut`, `zl` (lines 217344–218900).
  - React state & UI component `Y1` (lines 218901–231180).
  - Mounting call: `createRoot(document.getElementById("root")).render(...)` (line 231181).
- **Line 17**: Minified `<style rel="stylesheet" crossorigin>` containing compiled Tailwind CSS utility classes (21,818 bytes).
- **Line 20**: `<div id="root"></div>`.

---

## 3. Mathematical & Body Weight Logic Audit

### 3.1 Ideal Body Weight (IBW) Formula (`R1`)
The IBW calculation function in `adjustr-io.html` is defined as:
```javascript
const R1 = (T, j) => {
  if (!T) return 0;
  const B = T / 2.54; // Convert cm to inches
  return (j === "male" ? 50 : 45.5) + 2.3 * (B - 60);
};
```
Where `T` = Height in cm, `j` = Gender (`"male"` | `"female"`).

#### Clinical & Mathematical Flaws:
1. **Short Stature Underflow (< 60 inches / 152.4 cm)**:
   The Devine formula is calibrated for individuals >= 60 inches. When height is < 60 inches, `(B - 60)` becomes negative:
   - For a female of height 140 cm (55.1 inches): $45.5 + 2.3 \times (55.12 - 60) = 45.5 - 11.23 = 34.27\text{ kg}$.
   - For an individual of height 100 cm (39.37 inches): $50 + 2.3 \times (39.37 - 60) = 2.55\text{ kg}$!
   - For negative height inputs (e.g. `-170 cm`): $50 + 2.3 \times (-66.93 - 60) = -241.9\text{ kg}$!
2. **Clinical Standard**:
   Nephrology and pharmacokinetic guidelines (Sanford Guide, Winter's Clinical Pharmacokinetics) dictate that if height is < 60 inches, IBW should be either capped at baseline (45.5 kg female / 50 kg male) or actual weight should be utilized directly without subtracting negative inches.

### 3.2 Body Surface Area (BSA) Formula (`B1`)
Defined as:
```javascript
const B1 = (T, j) => !T || !j ? 0 : Math.sqrt(T * j / 3600);
```
Where `T` = Height in cm, `j` = Weight in kg.
- Uses Mosteller formula: $\text{BSA} = \sqrt{\frac{\text{Height (cm)} \times \text{Weight (kg)}}{3600}}$.
- **Flaw**: If either Height or Weight is negative (e.g., user error typing `-70`), `T * j` is negative. `Math.sqrt()` evaluates to `NaN`. In the UI, `Q.bsa.toFixed(2)` renders literally as `"NaN m2"`.

### 3.3 Cockcroft-Gault & Weight Selection Logic (`V1`)
Defined as:
```javascript
const V1 = (T, j, B, d, R) => {
  if (!T || !j || !B || !R || B <= 0) return null;
  const V = R1(R, d); // IBW
  let F = j, rt = "Actual";
  j > V ? (F = V + 0.4 * (j - V), rt = "Adjusted (Obese)") : (F = j, rt = "Actual");
  const O = d === "male" ? 1 : 0.85,
        _ = B1(R, j);
  return {
    value: (140 - T) * F / (72 * B) * O,
    usedWeight: F,
    weightType: rt,
    bsa: _,
    ibw: V,
    actualWeight: j
  };
};
```
Where `T` = Age, `j` = Actual Weight (TBW), `B` = Serum Creatinine, `d` = Gender, `R` = Height.

#### Critical Flaws in Weight Selection:
1. **The "Every Overweight Patient is Obese" Bug**:
   Look at line:
   ```javascript
   j > V ? (F = V + 0.4 * (j - V), rt = "Adjusted (Obese)") : (F = j, rt = "Actual");
   ```
   If Actual Weight (`j`) is greater than IBW (`V`), the code **immediately** switches to Adjusted Body Weight:
   $$\text{ABW} = \text{IBW} + 0.4 \times (\text{TBW} - \text{IBW})$$
   and labels the patient `"Adjusted (Obese)"`!
2. **Clinical Guideline Violation**:
   Under all established medical consensus (Sanford, KDIGO, Winter, Bauer, Pai & Paloucek):
   - **Underweight ($\text{TBW} < \text{IBW}$)**: Use Actual Body Weight ($\text{TBW}$).
   - **Normal Weight ($\text{TBW} \ge \text{IBW}$ and $\text{BMI} < 30\text{ kg/m}^2$, or $\text{TBW} < 1.2 \times \text{IBW}$)**: Use **Actual Body Weight** ($\text{TBW}$).
   - **Obese ($\text{BMI} \ge 30\text{ kg/m}^2$ or $\text{TBW} \ge 1.3 \times \text{IBW}$)**: Use **Adjusted Body Weight** ($\text{ABW}$).
3. **Clinical Consequence**:
   Consider a healthy male: Age 45, Height 175 cm (68.9 in), Weight 72 kg, SCr 1.0 mg/dL:
   - Devine IBW = $50 + 2.3 \times 8.898 = 70.46\text{ kg}$.
   - BMI = $\frac{72}{(1.75)^2} = 23.51\text{ kg/m}^2$ (Normal, healthy weight!).
   - In `adjustr-io.html`: Because $72 > 70.46$, the calculator classifies him as **Obese** and down-adjusts his weight to:
     $$\text{Used Weight} = 70.46 + 0.4 \times (72 - 70.46) = 71.08\text{ kg}$$
   - This erroneously reduces estimated renal clearance. In severe infections where beta-lactams or vancomycin are dosed according to CrCl, underestimating CrCl can result in subtherapeutic antibiotic concentrations and treatment failure.
4. **Complete Absence of BMI Calculation**:
   BMI is never computed, displayed, or factored into the decision logic.

---

## 4. Renal Staging Audit: eGFR & KDIGO

### 4.1 Absence of CKD-EPI 2021 Equation
Requirement R1 explicitly calls for **eGFR staging logic**.
- `adjustr-io.html` does **not** implement CKD-EPI (2021 race-free refitted equation):
  $$\text{eGFR} = 142 \times \min(\text{SCr}/\kappa, 1)^\alpha \times \max(\text{SCr}/\kappa, 1)^{-1.200} \times 0.9938^{\text{Age}} \times [1.012\text{ if female}]$$
  (where $\kappa = 0.7$ for females, $0.9$ for males; $\alpha = -0.241$ for females, $-0.302$ for males).
- The calculator only computes raw Cockcroft-Gault CrCl in mL/min. It does not provide BSA-normalized CrCl (mL/min/1.73m²) nor eGFR.

### 4.2 Complete Omission of KDIGO Classification
KDIGO defines chronic kidney disease stages as:
- **G1**: Normal or high ($\ge 90\text{ mL/min/1.73m}^2$)
- **G2**: Mildly decreased ($60–89\text{ mL/min/1.73m}^2$)
- **G3a**: Mildly to moderately decreased ($45–59\text{ mL/min/1.73m}^2$)
- **G3b**: Moderately to severely decreased ($30–44\text{ mL/min/1.73m}^2$)
- **G4**: Severely decreased ($15–29\text{ mL/min/1.73m}^2$)
- **G5**: Kidney failure ($< 15\text{ mL/min/1.73m}^2$)

In `adjustr-io.html`, KDIGO staging does not exist. The only staging logic present in the entire file is a 3-tier CSS background color switcher (`zl`):
```javascript
const zl = E => !E && E !== 0 
  ? "bg-slate-100 text-slate-400" 
  : E < 30 
  ? "bg-red-600 text-white shadow-red-200" 
  : E < 60 
  ? "bg-amber-500 text-white shadow-amber-200" 
  : "bg-green-600 text-white shadow-green-200";
```
This fails both academic rigor and clinical decision support expectations.

---

## 5. Antimicrobial Database & Dosing Logic Audit (`Ol`)

The database `Ol` contains 36 antimicrobials. Each drug was systematically analyzed across all titration brackets, dosing factors, strategies, and renal replacement therapy entries.

### 5.1 The Silent Fallback Bug (148 Boundary Failures)
The range matching function `Nt` is implemented as:
```javascript
const Nt = (G, xt) => G.find(tl => xt <= tl.max && xt >= tl.min);
```
When selecting the dose in `Ut`:
```javascript
const Ut = (E, w, bt) => {
  ...
  const Tt = Nt(E.adjustments, w);
  return Tt ? Tt.recommendation : E.standard_dose || "Standard Dose";
};
```
If `Nt` does not find a match, `Ut` **silently falls back to `E.standard_dose`** (the unadjusted, maximum normal dose)!

#### Two Systematic Root Causes for Failed Matches:
1. **Discrete Floating-Point Gaps Between Brackets**:
   Brackets were written with gaps:
   - E.g., `max: 500, min: 50.1` and `max: 50, min: 10`.
   - If a patient's calculated CrCl is `50.05 mL/min`:
     - $50.05 \ge 50.1 \rightarrow \text{false}$
     - $50.05 \le 50 \rightarrow \text{false}$
     - `Nt` returns `undefined`!
     - The patient is silently prescribed the **full normal dose**!
   - This occurs across **32 drugs** at boundaries like `9.95`, `10.95`, `14.95`, `19.95`, `29.95`, `34.95`, `39.95`, `49.95`, `50.05`, `59.95`, `60.05`.
2. **Missing Low Ranges (No Zero Floor)**:
   For multiple drugs, the lowest bracket has a minimum cutoff of 5, 10, or 15 mL/min, with **no bracket covering CrCl 0 to 4.9**:
   - **Ampicillin-Sulbactam**: Lowest bracket is `max: 14.9, min: 5`.
     If CrCl = 3 mL/min: `Nt` returns `undefined` $\rightarrow$ Patient gets **3 g IV q6h** (full standard dose for severe sepsis)!
   - **Cotrimoxazole (TMP-SMX)** (Bone/Joint, GNB Bacteremia, Stenotrophomonas): Lowest bracket is `min: 15`.
     If CrCl < 15 mL/min: `Nt` returns `undefined` $\rightarrow$ Patient gets **full 5 mg/kg q12h**!
   - **Ganciclovir Maintenance**: Lowest bracket is `min: 10`.
     If CrCl < 10 mL/min: `Nt` returns `undefined` $\rightarrow$ Patient gets **full 5 mg/kg q24h**!
   - **Oseltamivir Prophylaxis**: Lowest bracket is `min: 11`.
     If CrCl < 10 mL/min: `Nt` returns `undefined` $\rightarrow$ Patient gets **full 75 mg q24h**!

### 5.2 Renal Replacement Therapy (IHD / CRRT) Audit
Out of 36 antimicrobials in `Ol`:
- **Only 11 drugs** have any RRT (IHD or CRRT) data.
- **25 drugs (69.4%) have ZERO RRT information**:
  - `meropenem`: Carbapenem of choice in ICU sepsis; dialyzed by HD and cleared by CRRT. Currently has **no RRT data**!
  - `penicillin-g`: Neurotoxic in renal failure; no RRT data.
  - `gentamicin` & `amikacin`: Post-HD re-dosing is mandatory; no RRT data.
  - `daptomycin`: Dosed 6–8 mg/kg q48h post-HD; no RRT data.
  - `linezolid`: Cleared ~30% by HD; dose post-HD; no RRT data.
  - `metronidazole`: Cleared by HD; supplemental dose post-HD; no RRT data.
  - `cotrimoxazole`: Cleared by HD; 50% supplemental dose post-HD; no RRT data.
  - `acyclovir-iv`, `acyclovir-po`, `valacyclovir`: Significant HD clearance; require post-HD dosing to prevent neurotoxicity; no RRT data.
  - `fluconazole`: Cleared by HD; requires 100% supplemental dose post-HD; no RRT data.

### 5.3 Loading Doses in Renal Impairment
- **Clinical Rule**: In acute sepsis, the volume of distribution ($V_d$) is preserved or expanded regardless of renal dysfunction. Therefore, the **loading dose must NEVER be reduced based on renal function**. Renal adjustments apply solely to the maintenance dose.
- **Audit**:
  - Beta-lactams (Piperacillin-Tazobactam, Cefepime, Meropenem): Do not explicitly state that the initial dose must be full standard before dropping to the renal maintenance interval.
  - Only 9 drugs mention a loading dose in their text notes, and it is not structured as an actionable clinical step.

### 5.4 Single Dose Calculation Discrepancy (`Gt`)
When a drug has `dose_factor`, `Gt` calculates:
```javascript
const Gt = (E, w, bt) => {
  ...
  let Tt = bt.usedWeight;
  if (E.name.includes("Vancomycin") && (Tt = bt.actualWeight), Nt.is_bsa) 
    return `${(Nt.dose_factor * bt.bsa).toFixed(0)} mg`;
  const G = Nt.dose_factor * Tt;
  return G >= 1e3 ? `${(G / 1e3).toFixed(1)} g` : `${G.toFixed(0)} mg`;
};
```
- For Vancomycin, it computes using `actualWeight`, but the card footer renders: `"Based on " + Q?.usedWeight.toFixed(1) + " kg"`. If the patient is obese, `usedWeight` is ABW, displaying a conflicting weight.
- For Amikacin, `dose_factor = 15`. If CrCl is 30 mL/min, the adjustment card recommends `7.5 mg/kg q48h`, but the "Calculated Single Dose" card prominently displays the unadjusted full dose ($15 \times W = 1050\text{ mg}$), confusing the prescriber.

---

## 6. Input Validation & Edge Case Vulnerabilities

Comprehensive testing of numerical boundary and invalid inputs revealed multiple vulnerabilities:

| Input Condition | Test Value | Tool Output | Expected Clinical Behavior |
|---|---|---|---|
| **Negative Age** | Age = -10, Wt = 70, Ht = 170, SCr = 1.0 | `CrCl = 140.8 mL/min` | Reject with validation error: Age must be positive integer (>= 18). |
| **Extreme Age** | Age = 150, Wt = 70, Ht = 170, SCr = 1.0 | `CrCl = -9.4 mL/min` | Reject: Age > 120 clinically invalid. Prevent negative clearance. |
| **Negative Weight** | Age = 45, Wt = -70, Ht = 170, SCr = 1.0 | `CrCl = -92.4 mL/min`, `BSA = NaN` | Reject with validation error: Weight must be > 0. |
| **Negative Height** | Age = 45, Wt = 70, Ht = -170, SCr = 1.0 | `CrCl = -154.6 mL/min`, `BSA = NaN`, `IBW = -241.9 kg` | Reject with validation error: Height must be > 0. |
| **Extreme Low SCr** | Age = 45, Wt = 70, Ht = 170, SCr = 0.001 | `CrCl = 89,144.6 mL/min` | Apply physiological floor (e.g. SCr 0.6–0.8 mg/dL for cachectic/elderly) or cap estimated CrCl at 150–200 mL/min. |
| **Pediatric Patient** | Age = 5, Wt = 18, Ht = 110, SCr = 0.5 | `CrCl = 45.0 mL/min` | Block or warn: Cockcroft-Gault is invalid in pediatrics (< 18 yr); use Bedside Schwartz equation. |
| **Short Stature** | Height = 100 cm, Wt = 40, Age = 45, SCr = 1.0 | `IBW = 2.55 kg`, `CrCl = 23.1 mL/min`, `Type: Adjusted (Obese)` | Cap IBW; do not subtract below 60 inches. |

---

## 7. Safety Warnings & High-Risk Guardrails

The application currently has **no safety alert banners or modal guardrails**:
1. **CrCl < 15 mL/min (ESRD / Kidney Failure)**: No banner warning about profound drug accumulation, metabolic acidosis, or need for urgent nephrology consult/dialysis.
2. **Nephrotoxic Antimicrobials**:
   - Amphotericin B deoxycholate, Vancomycin, Aminoglycosides (Gentamicin/Amikacin): No warning banner indicating severe nephrotoxic synergism or mandatory Therapeutic Drug Monitoring (TDM) trough levels.
3. **Neurotoxic Antimicrobials**:
   - Cefepime: Known cause of non-convulsive status epilepticus in renal impairment; only a minor static note in text.
   - Penicillin G: High risk of seizures in renal impairment; no visual guardrail.
4. **Absolute Contraindications**:
   - Nitrofurantoin: Contraindicated in CrCl < 30 (or < 60). The card displays text inside the blue box, but there is no red warning alert preventing prescription.
   - Voriconazole IV: Vehicle SBECD accumulates in CrCl < 50; oral switch should be actively recommended with a distinct alert.

---

## 8. Visual & Modern UI Redesign Audit (vs `index.html`)

A side-by-side comparison with `index.html` reveals complete visual disconnection:

| Design Element | Current `adjustr-io.html` | Required Theme (`index.html`) | Gap Severity |
|---|---|---|---|
| **Background** | Light gray (`#F8FAFC` / `bg-slate-50`) | Deep Obsidian Backdrop (`#040814`) with ambient radial glows (`rgba(0, 242, 254, 0.14)` and `rgba(99, 102, 241, 0.12)`) | High |
| **Card Containers** | White (`#FFFFFF`) with thin gray border (`border-slate-200`) | Frosted Glassmorphism (`rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(16px)` and border `rgba(255, 255, 255, 0.08)`) | High |
| **Accent Colors** | Plain Tailwind Blue (`#2563EB` / `bg-blue-600`) | Luminous Cyan/Blue Gradients (`#00F2FE` to `#4FACFE`) | High |
| **Typography** | Generic system sans-serif | `Plus Jakarta Sans` (headers) and `Inter` (body/metrics) | Medium |
| **Navbar** | Static dark bar with plain text | Floating Glassmorphic Pill Navbar with luminous brand dot and quick links | Medium |
| **Contact Integration** | None | Prominent "Contact Me" button linking to `mailto:putrawan.2371041010@student.unud.ac.id` | High (Mandate R3) |
| **Asset Dependencies** | Broken link to `./vite.svg` | Fully self-contained SVG data URIs or inlined vectors | Medium |

---

## 9. Google Sites Iframe Compatibility

1. **Favicon Reference**:
   `<link rel="icon" type="image/svg+xml" href="./vite.svg" />` causes a 404 in iframe environments. Must be replaced with an inlined data URI SVG or removed.
2. **Script Format**:
   The code is currently bundled inside `<script type="module" crossorigin>`. In restricted iframe environments (such as some sandboxed Google Sites configurations or local file protocols), module scripts may trigger origin or CORS issues. Converting to a classic self-executing IIFE (`<script>(function(){...})()</script>`) ensures 100% universal compatibility.
3. **Responsive Scaling**:
   The container has `max-w-2xl mx-auto px-4`. In narrow iframes (< 400px width), the grid and multi-column tables must stack cleanly to avoid horizontal clipping.
4. **Typography Loading**:
   Google Fonts `<link>` tags must include `preconnect` and fail gracefully to system sans-serif fonts if iframe security blocks external font fetching.

---

## 10. Specific Remediation Specifications

### 10.1 Mathematical Corrections
```javascript
// 1. Devine Ideal Body Weight with height clamp
function calculateIBW(heightCm, gender) {
  if (!heightCm || heightCm <= 0) return 0;
  const heightInches = heightCm / 2.54;
  const base = gender === "female" ? 45.5 : 50.0;
  if (heightInches <= 60) return base; // Prevent negative subtraction for short stature
  return base + 2.3 * (heightInches - 60);
}

// 2. Body Mass Index
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// 3. Clinical Dosing Weight Selection
function getDosingWeight(actualWeightKg, ibwKg, bmi) {
  if (actualWeightKg < ibwKg) {
    return { weight: actualWeightKg, type: "Actual (Underweight)" };
  }
  if (bmi >= 30.0) {
    const abw = ibwKg + 0.4 * (actualWeightKg - ibwKg);
    return { weight: abw, type: "Adjusted (Obese, BMI >= 30)" };
  }
  return { weight: actualWeightKg, type: "Actual (Non-Obese)" };
}

// 4. Cockcroft-Gault CrCl
function calculateCrCl(age, weightKg, scr, gender) {
  if (age < 18 || scr <= 0 || weightKg <= 0) return 0;
  const factor = gender === "female" ? 0.85 : 1.0;
  return ((140 - age) * weightKg) / (72 * scr) * factor;
}

// 5. CKD-EPI 2021 (Race-Free)
function calculateCKDEPI(age, scr, gender) {
  if (age < 18 || scr <= 0) return 0;
  const isFemale = gender === "female";
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const genderMult = isFemale ? 1.012 : 1.0;
  const scrRatio = scr / kappa;
  const minPart = Math.pow(Math.min(scrRatio, 1), alpha);
  const maxPart = Math.pow(Math.max(scrRatio, 1), -1.200);
  const agePart = Math.pow(0.9938, age);
  return 142 * minPart * maxPart * agePart * genderMult;
}

// 6. KDIGO Staging
function getKDIGOStage(gfr) {
  if (gfr >= 90) return { stage: "G1", label: "Normal or High", severity: "normal" };
  if (gfr >= 60) return { stage: "G2", label: "Mildly Decreased", severity: "mild" };
  if (gfr >= 45) return { stage: "G3a", label: "Mild to Moderately Decreased", severity: "moderate" };
  if (gfr >= 30) return { stage: "G3b", label: "Moderately to Severely Decreased", severity: "warning" };
  if (gfr >= 15) return { stage: "G4", label: "Severely Decreased", severity: "danger" };
  return { stage: "G5", label: "Kidney Failure", severity: "critical" };
}
```

### 10.2 Continuous Interval Matching (Preventing Boundary Gaps)
Replace discrete `min`/`max` checks with continuous half-open interval evaluation:
```javascript
// Adjustment format: { max: 50, recommendation: "..." } sorted descending
function matchAdjustment(adjustments, crcl) {
  for (const adj of adjustments) {
    if (crcl >= adj.minCrCl) return adj;
  }
  return adjustments[adjustments.length - 1]; // Safe fallback to most restrictive renal bracket, NOT standard dose!
}
```

### 10.3 Expanded RRT Data for Key Drugs
Add full IHD and CRRT dosing for all 25 omitted drugs, specifically:
- **Meropenem**:
  - `IHD`: 500 mg q24h post-HD (1 g q24h for severe/Pseudomonal infections).
  - `CRRT`: 1 g q8h (extended 3h infusion) for CVVHDF; 500 mg–1 g q12h for standard CVVH.
- **Daptomycin**:
  - `IHD`: 6–8 mg/kg q48h post-HD.
  - `CRRT`: 6–8 mg/kg q24h.
- **Gentamicin / Amikacin**:
  - `IHD`: Gentamicin 1–2 mg/kg post-HD; Amikacin 5–7.5 mg/kg post-HD, redose strictly per pre-HD serum levels.
  - `CRRT`: Amikacin 7.5–10 mg/kg q24–48h; Gentamicin 2–2.5 mg/kg q24–48h, guided by TDM.

---

## 11. Conclusion
`adjustr-io.html` requires a comprehensive overhaul:
1. **Clinical Mathematics**: Implement BMI-triggered ABW logic, Devine height guards, CKD-EPI 2021 eGFR, and KDIGO G1–G5 staging.
2. **Antimicrobial Database**: Eliminate boundary gap fallbacks, supply missing RRT data for 25 drugs, enforce unadjusted loading doses, and provide ceiling limits for CrCl < 15.
3. **Safety Guardrails**: Add alert banners for high-risk nephrotoxicity, neurotoxicity, contraindications, and pediatric misuse.
4. **Visual & System Redesign**: Rebuild the UI in dark obsidian/cyan glassmorphic styling matching `index.html` with an active Contact Me button pointing to `putrawan.2371041010@student.unud.ac.id` and 100% self-contained Google Sites iframe embed compatibility.
