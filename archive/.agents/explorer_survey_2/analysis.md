# Deep-Dive Audit & Forensic Clinical Analysis: adjustr-fluid.html

**Auditor**: Explorer 2 (Clinical & Mathematical Algorithms Specialist)  
**Target File**: `adjustr-fluid.html`  
**Project Root**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio`  
**Date**: 2026-09-18  
**Integrity Mode**: Development / Clinical Audit  

---

## 1. Executive Summary

A comprehensive line-by-line clinical and technical audit of `adjustr-fluid.html` was conducted against international clinical standards (NICE CG174, Adrogué-Madias NEJM 2000, KDIGO AKI 2012, European/American Hyponatremia Guidelines 2013/2014, and endocrine/critical care potassium replacement protocols). 

The audit revealed **critical clinical hazards, missing core features, and architectural liabilities** in the current implementation:
1. **Critical Clinical Hazard (ODS Prevention Missing)**: The hyponatremia calculator prompts for a target hourly rate (`hipo_rate_target`), but **completely ignores it in the calculation**, fails to compute an hourly pump infusion rate (mL/hr), and has **zero safety caps or warnings** if hazardous rates (> 8–10 mEq/L/24h) are entered.
2. **Failure to Implement Holliday-Segar**: The maintenance calculator claims to calculate fluid maintenance, but completely omits the standard Holliday-Segar (100/50/20 mL/kg/day or 4/2/1 mL/kg/hr) formula, relying instead on an arbitrary linear 30 mL/kg adult rule that severely underhydrates lower-weight patients (e.g. 64% underhydration in a 15 kg patient).
3. **Hardcoded Body Water Ignoring Gender & Age**: The Adrogué-Madias module in both hypernatremia and hyponatremia hardcodes TBW to `weight * 0.6`, ignoring female sex (0.5) and elderly physiology (0.5 male, 0.45 female), despite having defined an unused lookup table in `MedicalLogic`.
4. **Omission of Infusate Potassium**: The Adrogué-Madias equation in code omits $K_{\text{infusate}}$, despite potassium being an osmotically active cation that directly raises serum sodium (Edelman equation).
5. **Total Absence of Potassium Replenishment**: There is no potassium module, deficit calculator, or IV safety rate limit warnings (max 10–20 mEq/hr, max 40 mEq/L peripheral, zero IV bolus rule) anywhere in the application.
6. **Serum Urea vs. BUN Diagnostic Distortion**: The AKI module labels an input as "Serum Urea / BUN (mg/dL)" and directly computes $\text{Urea} / \text{Cr}$. Conflating international Serum Urea with BUN alters the ratio by a factor of 2.14, generating false-positive "Pre-Renal" diagnoses.
7. **Architectural & Embed Fragility**: The file depends on the runtime script `https://cdn.tailwindcss.com` (which fails in offline/restricted iframe environments) and uses a light theme (`bg-slate-50`) that completely clashes with the dark obsidian/cyan aesthetic of `index.html`. It also lacks the required "Contact Me" link.

---

## 2. Detailed Mathematical & Algorithmic Audit

### 2.1 Holliday-Segar Maintenance Fluid Formula vs. Current Implementation

#### Current Implementation (Lines 420-432):
```javascript
const ibw = MedicalLogic.calculateIBW(height, gender);
const weightForCalc = weightActual > (1.2 * ibw) ? ibw : weightActual;
const baseRate = status === 'Normal' ? 30 : 20;
let maintenance = weightForCalc * baseRate;

if (isFever && temp > 37.5) {
    maintenance += (temp - 37.0) * 0.125 * maintenance; 
}
if (isTachypnea) maintenance += 0.15 * maintenance;
const total = maintenance + ongoing;
```

#### Identified Deficiencies:
1. **Holliday-Segar Omission**:
   - The classical Holliday-Segar formula (1957) is based on physiological caloric expenditure:
     - 0 – 10 kg: 100 mL/kg/day (4 mL/kg/hr)
     - 11 – 20 kg: 1000 mL + 50 mL/kg for each kg > 10 kg (40 mL/hr + 2 mL/kg/hr for kg > 10)
     - > 20 kg: 1500 mL + 20 mL/kg for each kg > 20 kg (60 mL/hr + 1 mL/kg/hr for kg > 20)
   - For a 70 kg adult:
     - Holliday-Segar: $1500 + (50 \times 20) = 2500$ mL/24h (hourly: $60 + 50 = 110$ mL/hr, or $2500/24 = 104.2$ mL/hr).
     - Current code: $70 \times 30 = 2100$ mL/24h (87.5 mL/hr).
   - For a pediatric/adolescent or low-weight patient (e.g., 15 kg):
     - Holliday-Segar: $1000 + (5 \times 50) = 1250$ mL/24h.
     - Current code: $15 \times 30 = 450$ mL/24h — **a severe 64% under-hydration deficit**!
2. **NICE Adult Guideline (CG174)**:
   - For adult maintenance, NICE recommends 25–30 mL/kg/day for routine maintenance, and 20–25 mL/kg/day for restricted patients (renal/heart failure, elderly).
   - **Recommendation**: Provide both validated modes:
     1. **Holliday-Segar (100/50/20 rule / 4-2-1 rule)** — primary standard for pediatrics, adolescents, and general metabolic maintenance.
     2. **Adult Weight-Based (NICE 25–30 mL/kg/day)** — with toggle for restricted (20–25 mL/kg/day).
3. **IBW Calculation & Boundary Bugs**:
   - Devine formula:
     $$\text{IBW}_{\text{male}} = 50 + 2.3 \times (\text{Height in inches} - 60)$$
     $$\text{IBW}_{\text{female}} = 45.5 + 2.3 \times (\text{Height in inches} - 60)$$
   - If height < 152.4 cm (60 inches), $(\text{Height in inches} - 60)$ is negative. For height = 140 cm (55.1 inches), $\text{IBW} = 50 - 11.27 = 38.7$ kg.
   - If height is 0 or unentered, $\text{IBW}$ calculates as a negative number (e.g. $-88$ kg), causing `weightForCalc` to evaluate to negative weight, resulting in negative maintenance fluids!
   - In clinical obesity ($\text{Actual} > 1.2 \times \text{IBW}$ or $\text{BMI} \ge 30$), cutting straight to IBW risks under-hydration. Clinical practice strongly favors **Adjusted Body Weight (ABW)**:
     $$\text{ABW} = \text{IBW} + 0.4 \times (\text{Actual Weight} - \text{IBW})$$
4. **Fever & Respiratory Modifier Artifacts**:
   - Line 428 checks `temp > 37.5`, but then calculates `(temp - 37.0) * 0.125 * maintenance`.
   - At 37.5°C, it adds 0%. At 37.6°C, it instantaneously jumps to adding $(37.6 - 37.0) \times 0.125 = 7.5\%$ of the *total* fluid maintenance.
   - Physiological Insensible Water Loss (IWL) is only ~30–40% of baseline maintenance (~400–600 mL/day). Multiplying *total* maintenance by 12.5% per °C overestimates renal/GI requirements during fever.
   - Tachypnea: Adding 15% to total maintenance is crude; typical respiratory loss increment is 100–300 mL/day.

---

### 2.2 24-Hour Ongoing Loss & Net Fluid Balancing

#### Current Implementation (Lines 97-100, 420, 432):
- A single input field: `ongoing_losses` (placeholder: "NGT, Polyuria, Drains").
- Logic: `const total = maintenance + ongoing;`.

#### Identified Deficiencies:
1. **No Net Fluid Balance Calculation**:
   - Acute inpatient care requires tracking:
     $$\text{Net Balance (24h)} = \text{Total Intake} - \text{Total Output}$$
   - Positive balance (fluid overload) correlates strongly with ICU mortality, AKI progression, and pulmonary edema.
2. **Missing Output Component Breakdown**:
   - **Urine Output (UOP)**: The single most vital metric in acute nephrology. Must be recorded in mL/24h and calculated as $\text{mL/kg/hr}$.
     - $\ge 0.5$ mL/kg/hr: Adequate
     - $< 0.5$ mL/kg/hr for 6–12h: Oliguria (KDIGO Stage 1 AKI)
     - $< 0.3$ mL/kg/hr for $\ge 24$h or anuria for 12h: Severe oliguria / Anuria (KDIGO Stage 3 AKI)
   - **Gastrointestinal / Drain Losses**: NGT suction, stoma output, emesis, chest tube, surgical drains.
   - **Insensible Water Loss**: Calculated dynamically based on weight (~10–12 mL/kg/day or ~500 mL/day) + fever/tachypnea adjustments.
3. **Loss Replacement Guidance**:
   - Different losses require specific replacement fluids (e.g., gastric secretions lose H+, Cl-, K+ requiring 0.45% NS + 20 mEq KCl; biliary/pancreatic/diarrheal secretions lose HCO3- requiring Ringer's Lactate). The current tool provides zero clinical guidance.

---

### 2.3 Adrogué-Madias Formula for Sodium Correction

#### Current Implementation:
```javascript
// Lines 384-387
calculateTBW: (weight, gender, ageGroup) => {
    const map = { anak: 0.6, dewasa: gender === 'Pria' ? 0.6 : 0.5, lansia: gender === 'Pria' ? 0.5 : 0.45 };
    return weight * (map[ageGroup] || 0.6);
}

// Lines 469-471 (calculateHyper)
const tbw = weight * 0.6;
const deltaNa = (fluidNa - naCurrent) / (tbw + 1);
const totalVol = ((naTarget - naCurrent) / deltaNa) * 1000;

// Lines 481-485 (calculateHypo)
const tbw = weight * 0.6;
const deltaNa = (naFluid - naCurrent) / (tbw + 1);
resDiv.innerHTML = `<div class="...">Predicted Na Increase per 1L: <b>${deltaNa.toFixed(2)} mEq/L</b></div>`;
```

#### Identified Deficiencies & Critical Clinical Flaws:
1. **Unused TBW Logic & Sex/Age Erasure**:
   - `MedicalLogic.calculateTBW` is completely bypassed!
   - `calculateHyper` and `calculateHypo` both hardcode `const tbw = weight * 0.6`.
   - For an elderly female (TBW factor = 0.45), using 0.6 overestimates TBW by **33%** ($0.6 / 0.45 = 1.33$), severely underestimating the predicted sodium change and leading to inadvertent **over-infusion and toxic overcorrection**!
2. **Missing Infusate Potassium ($K_{\text{infusate}}$)**:
   - The verified Adrogué-Madias formula (NEJM 2000; 342:1493-1499) is:
     $$\Delta \text{Na}_{\text{1L}} = \frac{(\text{Na}_{\text{infusate}} + \text{K}_{\text{infusate}}) - \text{Na}_{\text{serum}}}{\text{TBW} + 1}$$
   - Based on the Edelman equation ($\text{Na}_{\text{serum}} \approx \frac{\text{Na}_e + \text{K}_e}{\text{TBW}}$), infused potassium enters cells and drives sodium out into extracellular fluid, raising serum sodium concentration.
   - Completely omitting $K_{\text{infusate}}$ causes underestimation of $\Delta\text{Na}$ whenever potassium is co-infused.
3. **Dead-End Hyponatremia Calculation (No Hourly Infusion Rate)**:
   - The user inputs `hipo_rate_target` (e.g. 0.5 mEq/L/hr), but `calculateHypo()` **never reads or uses `hipo_rate_target`**!
   - It only outputs "Predicted Na Increase per 1L: X mEq/L".
   - The clinician is not given the hourly IV pump infusion rate (mL/hr) or the total 24h volume.
   - **Correct Infusion Rate Formula**:
     $$\text{Hourly Infusion Rate (mL/hr)} = \frac{\text{Target Hourly Change (mEq/L/hr)}}{\Delta \text{Na per 1L (mEq/L)}} \times 1000 \text{ mL}$$
     $$\text{Total 24h Volume (mL)} = \frac{\text{Target 24h Change (mEq/L)}}{\Delta \text{Na per 1L (mEq/L)}} \times 1000 \text{ mL}$$
4. **Hypernatremia Free Water Deficit vs. Non-Water Infusates**:
   - In hypernatremia, classic Free Water Deficit (FWD) is:
     $$\text{FWD (Liters)} = \text{TBW} \times \left(\frac{\text{Na}_{\text{serum}}}{140} - 1\right)$$
   - The current code computes total volume via Adrogué-Madias, but does not provide the hourly administration rate, nor does it factor in ongoing insensible losses (which causes under-replacement if omitted, as noted in the text but not in code).

---

### 2.4 Safety Caps for Sodium Correction & ODS Prevention

#### Current State:
- **Zero code enforcement**.
- No validation on target sodium change.
- No warning banner when target rate exceeds 10 mEq/L/24h.

#### Clinical Guidelines & Standards:
1. **Osmotic Demyelination Syndrome (ODS) / Central Pontine Myelinolysis**:
   - Rapid correction of chronic hyponatremia (> 48h duration) causes cellular dehydration of pontine and extrapontine neurons, resulting in quadriplegia, dysarthria, pseudobulbar palsy, coma, or death.
2. **Standard Consensus Limits (US / European Guidelines)**:
   - **Standard Risk**: Maximum correction rate **8–10 mEq/L in any 24-hour window**; maximum **18 mEq/L in 48 hours**. Target rate: **0.5 mEq/L/hr** (4–8 mEq/L/day).
   - **High Risk for ODS**: Maximum correction rate **6–8 mEq/L in 24 hours**.
     - High risk criteria:
       - Baseline serum $\text{Na} \le 105$ mEq/L
       - Concomitant hypokalemia
       - Malnutrition, alcoholism, advanced cirrhosis, liver transplant
3. **Severe Symptomatic Emergency Protocol (Seizures / Coma / Herniation)**:
   - Hypertonic 3% NaCl bolus: **100–150 mL IV over 10–20 minutes**, repeatable 1–2 times until acute symptoms resolve or serum Na rises by 4–6 mEq/L.
   - Stop rapid bolusing once acute symptoms abate.
4. **Required Tool Guardrails**:
   - **Hard Cap / Warning Alert**: If calculated 24h target rise $> 10$ mEq/L (or $> 8$ mEq/L with high-risk toggle active), display a prominent red **CRITICAL SAFETY WARNING: ODS HAZARD**.
   - **Overcorrection Re-lowering Protocol**: Inpatient instructions for inadvertent overcorrection (stop hypertonic fluid, administer D5W $\pm$ IV DDAVP 1–2 mcg).
   - **Hypernatremia Lowering Limit**: Cap lowering at $\le 10$ mEq/L/24h (0.5 mEq/L/hr) to prevent cerebral edema and brain herniation.

---

### 2.5 Potassium Replenishment Protocol & Safety Warnings

#### Current State:
- **COMPLETELY MISSING from `adjustr-fluid.html`**.

#### Clinical Requirements for New Module:
1. **Hypokalemia Severity & Deficit Estimation**:
   - Serum K 3.0 – 3.5 mEq/L (Mild): Deficit ~100–200 mEq. Oral replacement preferred (20–40 mEq PO 2–4 times/day).
   - Serum K 2.5 – 2.9 mEq/L (Moderate): Deficit ~200–400 mEq. Oral + IV replacement.
   - Serum K < 2.5 mEq/L (Severe / ECG changes / arrhythmias): Deficit > 400–800 mEq. Urgent IV infusion with continuous ECG telemetry.
2. **IV Infusion Safety Limits & Guardrails**:
   - **NEVER IV PUSH OR BOLUS**: Explicit black-box warning. IV bolus potassium causes instantaneous lethal asystole.
   - **Peripheral IV Line**:
     - Maximum concentration: **40 mEq/L** (higher causes severe burning, phlebitis, and sclerosis).
     - Maximum infusion rate: **10 mEq/hr** (up to 20 mEq/hr only in emergency with ICU cardiac monitoring).
   - **Central Venous Catheter (CVC)**:
     - Required for concentrations $> 40$ mEq/L or rates $\ge 20$ mEq/hr. Max central concentration typically 60–80 mEq/L.
   - **Renal Impairment Adjustment**: If eGFR < 30 mL/min, oliguria, or AKI, **reduce replacement dose by 50%** and monitor serum K every 2–4 hours.
   - **Mandatory Magnesium Check**: If serum $\text{Mg}^{2+} < 1.7$ mg/dL (or $< 0.7$ mmol/L), hypokalemia is refractory to replacement due to ROMK potassium channel disinhibition. Replace magnesium first!
3. **Hyperkalemia Emergency Management Protocol**:
   - Serum K > 5.5 mEq/L (Mild), 6.0–6.4 mEq/L (Moderate), $\ge 6.5$ mEq/L (Severe / ECG changes):
     - Step 1: Cardiac membrane stabilization (IV Calcium Gluconate 10% 10 mL over 2–3 min).
     - Step 2: Intracellular shift (Regular Insulin 10 units IV + 50 mL D50W, nebulized albuterol 10–20 mg).
     - Step 3: Potassium excretion (Furosemide, Patiromer / Lokelma / Kayexalate, or urgent hemodialysis).

---

### 2.6 AKI BUN:Cr Ratio & Diagnostic Workup

#### Current Implementation (Lines 275-280, 442-452):
```javascript
function calculateAKI() {
    const purea = parseFloat(document.getElementById('aki_purea').value) || 0;
    const pcr = parseFloat(document.getElementById('aki_pcr').value) || 0;
    ...
    let ratio = pcr > 0 ? purea / pcr : 0;
    let ratioInterp = ratio > 20 ? "Pre-Renal Etiology" : (ratio < 10 ? "Intrinsic Renal (ATN)" : "Normal / Post-renal");
    ...
}
```

#### Identified Deficiencies:
1. **Urea vs. Blood Urea Nitrogen (BUN) Confusion**:
   - Input label: `Serum Urea / BUN (mg/dL)`.
   - International clinical distinction:
     - BUN measures only nitrogen content: $\text{MW} = 28$ g/mol.
     - Serum Urea measures whole molecule: $\text{MW} = 60$ g/mol.
     - Conversion: $\text{BUN (mg/dL)} = \text{Serum Urea (mg/dL)} \times \frac{28}{60} = \text{Serum Urea (mg/dL)} \times 0.467$.
     - $\text{Urea in mmol/L}$: $\text{BUN (mg/dL)} = \text{Urea (mmol/L)} \times 2.8$.
   - **Clinical impact**: In Indonesian and European hospitals, labs report Serum Urea. If a clinician enters Urea = 100 mg/dL with Cr = 2.5 mg/dL, the current code calculates $100 / 2.5 = 40.0$ and declares "Pre-Renal Etiology". But true BUN is 46.7 mg/dL, giving a ratio of $46.7 / 2.5 = 18.7$ (Intrinsic/ATN range)! This causes **gross diagnostic misclassification**.
   - **Required Fix**: Provide an explicit unit selector:
     - `BUN (mg/dL)`
     - `Serum Urea (mg/dL)`
     - `Serum Urea (mmol/L)`
2. **Cr = 0 Edge Case**:
   - If `pcr = 0`, ratio evaluates to 0.0 and prints `"Intrinsic Renal (ATN)"`. Serum creatinine of 0 is a data entry error or hyperfiltration, not ATN!
3. **Diagnostic Nuances**:
   - Pre-renal ($> 20:1$): Mention false positives (GI bleed, steroids, TPN/high protein).
   - Intrinsic ($< 10:1$): ATN, AIN, glomerulonephritis, or severe liver disease / low protein.
   - Post-renal (10–20:1): Obstruction requires renal/bladder ultrasound to evaluate hydronephrosis.
4. **KDIGO AKI Definition & Staging Support**:
   - Adding KDIGO staging criteria (baseline vs current Cr, 48h change $\ge 0.3$, UOP $< 0.5$ mL/kg/h) provides genuine clinical utility for bedside trainees and physicians.

---

### 2.7 Bicarbonate Deficit & Acid-Base Module

#### Current Implementation (Lines 454-463):
```javascript
function calculateAcid() {
    const weight = parseFloat(document.getElementById('acid_weight').value);
    const hco3Curr = parseFloat(document.getElementById('acid_hco3_curr').value);
    const hco3Target = parseFloat(document.getElementById('acid_hco3_target').value);
    const deficit = 0.5 * weight * (hco3Target - hco3Curr);
    ...
}
```

#### Deficiencies & Improvements:
1. **Boundary / Validation**:
   - If `hco3Target <= hco3Curr`, deficit is negative or zero.
   - If inputs are blank, displays `NaN mEq`.
2. **Clinical Safety Warning on Target HCO3**:
   - In severe metabolic acidosis, target HCO3 should NOT be set to normal (24 mEq/L).
   - Target should be **15–18 mEq/L** (or target pH > 7.20) to prevent overshoot alkalosis, CSF acidosis, hypokalemia, and reduced ionized calcium. If target > 20 is selected, flag a warning.
3. **Dosing Guidance & Infusion Volumes**:
   - Standard 8.4% Sodium Bicarbonate (Meylon): $1 \text{ mL} = 1 \text{ mEq } \text{HCO}_3^-$ and $1 \text{ mEq } \text{Na}^+$.
   - Administration strategy: Give **half of the calculated deficit over 2–4 hours**, then recheck arterial blood gas (ABG) before giving the remainder.

---

### 2.8 Input Validation, NaN Prevention & Edge Cases

| Module | Tested Input | Current Result | Expected Safe Clinical Behavior |
|---|---|---|---|
| **Maintenance** | Blank weight or height | `NaN mL/24h`, `NaN mL/hr` | Graceful validation error: "Please enter valid weight and height." |
| **Maintenance** | Height = 0 or < 100 cm | Negative IBW (e.g. -88 kg), negative total fluid! | Floor IBW calculation; ensure height within physiological bounds (100–250 cm); fallback to actual weight. |
| **Maintenance** | Weight = 15 kg (pediatric) | 450 mL/24h (30 mL/kg rule) | Holliday-Segar: 1250 mL/24h (prevent fatal underhydration). |
| **Hypernatremia** | Blank weight/Na | `Total Deficit Volume: NaN mL` | Clear inline validation prompting required inputs. |
| **Hypernatremia** | Current Na = Target Na | `Total Deficit Volume: 0 mL` | State: "Serum sodium is already at target." |
| **Hypernatremia** | Current Na < Target Na | Negative deficit volume | Clinical error: "For hypernatremia, current sodium must be higher than target." |
| **Hyponatremia** | Current Na > Fluid Na | Negative predicted change | Alert: "Selected infusate has lower sodium than current serum sodium; this will lower sodium further!" |
| **Hyponatremia** | Target Rate = 2.0 mEq/L/hr | Completely ignored; outputs 1L delta | Hard safety alert: "Target rate exceeds 0.5–1.0 mEq/L/hr safe limit! Extreme risk of ODS." |
| **AKI** | Creatinine = 0 or blank | Ratio 0.0 -> "Intrinsic Renal (ATN)" | Validation error: "Creatinine must be greater than 0." |
| **Acid-Base** | Current HCO3 > Target | Displays negative deficit | Info note: "Current bicarbonate meets or exceeds target. No bicarbonate deficit." |

---

## 3. UI, Styling, Layout & Google Sites Embed Compatibility

### 3.1 Styling Discrepancy with Portfolio Index
- `index.html` implements an Obsidian/Cyan Glassmorphic theme:
  - Background: Deep obsidian `#040814`
  - Cards: Frosted glassmorphism `rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(14px)` and `border: 1px solid rgba(255, 255, 255, 0.08)`
  - Accents: Electric cyan `#00F2FE` and luminous blue `#4FACFE`
  - Text: Pure `#F8FAFC`, dim `#94A3B8`, muted `#64748B`
  - Typography: `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`
  - Interactive: Luminous borders, smooth tabs, clean pill badges
- `adjustr-fluid.html` currently implements:
  - Background: Generic light gray `bg-slate-50`
  - Cards: Flat white `bg-white` with `border-slate-200`
  - Accents: Dark blue `#1e40af`, red `#b91c1c`, emerald `#065f46`, amber `#92400e`
  - Total aesthetic mismatch with portfolio.

### 3.2 Google Sites Iframe Embed Vulnerabilities
1. **Runtime Tailwind CDN Dependency**:
   - Line 7: `<script src="https://cdn.tailwindcss.com"></script>`
   - **Why this is fragile**:
     - CDN script is ~300 KB and requires JavaScript runtime JIT parsing.
     - In hospital intranets, government clinics, or restricted networks, external CDNs are frequently blocked by firewall / Content Security Policy (CSP).
     - If the CDN fails to load or times out, `adjustr-fluid.html` renders completely broken, unstyled, and unusable.
     - `ORIGINAL_REQUEST.md` specifically mandates: **"Ensure 100% self-contained single-file HTML compatibility with Google Sites embed iframes (inlined CSS, inlined base64 assets, no broken external dependencies)."**
2. **Responsive Constraints in Iframes**:
   - Google Sites iframe embeds frequently render at widths between 340px (mobile) and 900px (desktop embeds).
   - The current fixed grid columns (`lg:grid-cols-3`, `min-w-[120px]` tab headers) cause horizontal scrollbars inside iframes.
   - All navigation tabs and cards must be fluid and responsive with touch-friendly targets.
3. **Contact Link Integration**:
   - `ORIGINAL_REQUEST.md` requirement R3 requires a subtle feedback/contact link configured with `href="mailto:putrawan.2371041010@student.unud.ac.id"`.
   - Missing from `adjustr-fluid.html`.

---

## 4. Comprehensive Architectural Recommendations

### Recommendation 1: Medical Logic Refactoring (`MedicalCalculations` Object)
Consolidate all clinical algorithms into a clean, testable, dependency-free JS object:
```javascript
const FluidElectrolyteEngine = {
    // 1. Holliday-Segar & Maintenance
    calcHollidaySegar: (weight) => { ... },
    calcAdultMaintenance: (weight, mode) => { ... },
    calcIBW: (heightCm, sex) => { ... },
    calcABW: (actualWeight, ibw) => { ... },
    
    // 2. 24h Fluid Balance
    calcNetBalance: (intake, uop, giLoss, drains, insensible) => { ... },
    calcUOPRate: (uopTotal, weight, hours) => { ... },
    
    // 3. Adrogué-Madias & Dysnatremia
    calcTBW: (weight, sex, ageGroup) => { ... },
    calcAdrogueMadias: (serumNa, infusateNa, infusateK, tbw) => { ... },
    calcHyponatremiaInfusion: (serumNa, targetNa, infusateNa, infusateK, tbw, targetRateHr) => { ... },
    calcHypernatremiaDeficit: (serumNa, targetNa, infusateNa, tbw) => { ... },
    
    // 4. Potassium Replacement
    calcPotassiumDeficit: (serumK, weight) => { ... },
    getPotassiumGuardrails: (serumK, eGFR, lineType) => { ... },
    
    // 5. AKI Diagnostics & BUN:Cr
    calcBUNtoCrRatio: (ureaVal, unitType, serumCr) => { ... },
    interpretAKI: (bunCrRatio, uopRate, crBaseline, crCurrent) => { ... },
    
    // 6. Bicarbonate Deficit
    calcBicarbonateDeficit: (weight, currentHCO3, targetHCO3) => { ... }
};
```

### Recommendation 2: Safety Guardrail Framework
- Hyponatremia: Hard warnings if 24h sodium rise exceeds 10 mEq/L (or 8 mEq/L for high-risk toggle).
- Potassium: Prominent warnings for peripheral IV rate limit (max 10 mEq/hr, max 40 mEq/L) and absolute prohibition of IV push.
- Hypernatremia: Warning if lowering rate exceeds 10 mEq/L/24h.
- Acid-Base: Warning if target HCO3 exceeds 20 mEq/L.
- AKI: Require Cr > 0; convert Urea to BUN accurately.

### Recommendation 3: Self-Contained Inlined Obsidian UI
- Replace `<script src="https://cdn.tailwindcss.com"></script>` with pure inlined CSS using CSS variables matching `index.html`.
- Add 5 distinct clinical tabs:
  1. `Maintenance & 24h Balance` (Holliday-Segar + NICE adult + UOP rate + Net balance)
  2. `Hyponatremia & ODS Safety` (Adrogué-Madias + IV pump rate mL/hr + ODS safety caps)
  3. `Hypernatremia Protocol` (Free water deficit + ongoing loss + safe lowering rate)
  4. `Potassium Replenishment` (Deficit estimation + IV safety limits + oral protocols + hyperkalemia rescue)
  5. `AKI & Acid-Base Workup` (BUN/Urea conversion + BUN:Cr interpretation + HCO3 deficit + Meylon volume)
- Include sticky navigation, responsive cards, high-contrast metric badges, and "Contact Me" link pointing to `mailto:putrawan.2371041010@student.unud.ac.id`.
