# Handoff Report: adjustr-fluid.html Audit & Clinical Algorithm Verification

**Sender**: Explorer 2 (Clinical & Mathematical Algorithms Specialist)  
**Recipient**: Parent / Orchestrator (`a0b05d00-56dc-43db-a3e9-e2d1f609d22b`)  
**Target File**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\adjustr-fluid.html`  
**Report Type**: Hard Handoff (Investigation & Survey Complete)  
**Date**: 2026-09-18T18:44:00+08:00  

---

## 1. Observation

Direct examination of `adjustr-fluid.html` (491 total lines, 35,195 bytes) revealed the following concrete, verbatim code sections and anomalies:

1. **Hyponatremia Calculation Omits Target Rate and Fails to Compute Infusion Rate**:
   - Lines 223–225:
     ```html
     <label class="block text-sm font-bold text-slate-600 mb-1">Target Rate (mEq/L/hr)</label>
     <input type="number" id="hipo_rate_target" value="0.5" step="0.1" class="w-full p-3 border rounded-xl font-bold bg-indigo-50/50">
     <p class="text-xs text-slate-400 mt-1 font-medium">Safe Limit: 0.5 - 1.0 mEq/L/hr to prevent ODS</p>
     ```
   - Lines 477–486 (`calculateHypo` function):
     ```javascript
     function calculateHypo() {
         const weight = parseFloat(document.getElementById('hipo_weight').value);
         const naCurrent = parseFloat(document.getElementById('hipo_na_current').value);
         const naFluid = parseFloat(document.getElementById('hipo_fluid').value);
         const tbw = weight * 0.6;
         const deltaNa = (naFluid - naCurrent) / (tbw + 1);
         const resDiv = document.getElementById('result_hipo');
         resDiv.classList.remove('hidden');
         resDiv.innerHTML = `<div class="bg-indigo-900 text-white p-6 rounded-2xl mt-4 text-center">Predicted Na Increase per 1L: <b>${deltaNa.toFixed(2)} mEq/L</b></div>`;
     }
     ```
   - `hipo_rate_target` is never queried or used. No hourly pump rate (mL/hr) or 24h total infusion volume is calculated.
   - Zero guardrails or warnings exist if a clinician inputs hazardous rates (e.g. 2.0 mEq/L/hr).

2. **Hardcoded Body Water Bypassing Sex and Age Adjustments**:
   - Lines 384–387 define:
     ```javascript
     calculateTBW: (weight, gender, ageGroup) => {
         const map = { anak: 0.6, dewasa: gender === 'Pria' ? 0.6 : 0.5, lansia: gender === 'Pria' ? 0.5 : 0.45 };
         return weight * (map[ageGroup] || 0.6);
     }
     ```
   - Yet in `calculateHyper` (line 469) and `calculateHypo` (line 481), TBW is unconditionally hardcoded:
     ```javascript
     const tbw = weight * 0.6;
     ```
   - For an elderly female patient, actual physiological TBW factor is 0.45. Hardcoding 0.6 produces a 33% overestimation of TBW, underestimating the impact of hypertonic saline.

3. **Adrogué-Madias Formula Omits Infusate Potassium**:
   - Lines 470 and 482 implement:
     ```javascript
     const deltaNa = (fluidNa - naCurrent) / (tbw + 1);
     ```
   - The verified clinical Adrogué-Madias formula includes potassium:
     $$\Delta \text{Na}_{\text{1L}} = \frac{(\text{Na}_{\text{inf}} + \text{K}_{\text{inf}}) - \text{Na}_{\text{serum}}}{\text{TBW} + 1}$$
   - Infused potassium is an active extracellular-exchange cation ($Na^+ / K^+$ ATPase exchange) that directly elevates serum sodium.

4. **Maintenance Formula Lacks Holliday-Segar**:
   - Lines 424–425:
     ```javascript
     const baseRate = status === 'Normal' ? 30 : 20;
     let maintenance = weightForCalc * baseRate;
     ```
   - Uses a crude linear 30 mL/kg adult rule. The Holliday-Segar 100/50/20 rule (or 4/2/1 rule for hourly rate) is completely absent. For a 15 kg pediatric/underweight patient, 30 mL/kg yields 450 mL/24h vs. Holliday-Segar 1250 mL/24h (a 64% deficit).

5. **Complete Absence of Potassium Replenishment**:
   - A global search of `adjustr-fluid.html` shows zero functions, sections, or guidance for potassium deficit estimation, maximum IV infusion rates (10–20 mEq/hr), peripheral line concentration ceilings (40 mEq/L), or hyperkalemia emergency protocols.

6. **Conflation of Serum Urea with BUN in AKI Module**:
   - Lines 275–276:
     ```html
     <label class="block text-xs font-black text-slate-500 uppercase mb-1">Serum Urea / BUN (mg/dL)</label>
     <input type="number" id="aki_purea" value="100" class="w-full p-3 border rounded-xl font-bold focus:ring-2 focus:ring-emerald-500">
     ```
   - Lines 448–449:
     ```javascript
     let ratio = pcr > 0 ? purea / pcr : 0;
     let ratioInterp = ratio > 20 ? "Pre-Renal Etiology" : (ratio < 10 ? "Intrinsic Renal (ATN)" : "Normal / Post-renal");
     ```
   - Serum Urea molecular weight is 60 g/mol; BUN measures only nitrogen (28 g/mol). $\text{BUN} = \text{Urea} \times 0.467$. An entered Serum Urea of 100 mg/dL produces a false ratio of 40:1 ("Pre-Renal"), whereas true BUN:Cr is 18.7:1 (Intrinsic/ATN).
   - If `pcr = 0`, ratio is 0.0, which erroneously displays "Intrinsic Renal (ATN)".

7. **External Tailwind CDN & Aesthetic Mismatch**:
   - Line 7 loads external script: `<script src="https://cdn.tailwindcss.com"></script>`.
   - The body is light-themed: `<body class="bg-slate-50 font-sans text-slate-900">`.
   - Lacks Google Sites embed resilience, lacks the dark obsidian/cyan aesthetic (`#040814`, frosted glassmorphism, cyan `#00F2FE`), and has no `mailto:putrawan.2371041010@student.unud.ac.id` contact button.

---

## 2. Logic Chain

1. **Step 1 (Risk of Brain Herniation / ODS)**:
   - *From Observation 1*: The hyponatremia tool accepts `hipo_rate_target` but fails to calculate an infusion rate, leaving the user with an abstract "Predicted Na Increase per 1L". If a user attempts to manually titrate or assumes the calculation incorporated their target, there is no verification. Furthermore, entering excessive rates (> 10 mEq/L/24h) triggers no safety alerts.
   - *Inference*: In severe hyponatremia, exceeding 8–10 mEq/L/24h causes irreversible Osmotic Demyelination Syndrome (ODS). Without automatic calculation of IV pump rate (mL/hr) and explicit safety caps/alerts, the tool poses high clinical risk in acute inpatient care.

2. **Step 2 (Dosing Error from Hardcoded TBW and Omitted Potassium)**:
   - *From Observations 2 & 3*: TBW is hardcoded to 0.6 regardless of sex or age, and infusate potassium is omitted.
   - *Inference*: For an elderly female (TBW 0.45), hardcoding TBW 0.6 underestimates the predicted sodium rise per liter by 25–33%. If potassium is added to the infusate (common in hyponatremia with hypokalemia), the true rise is further underestimated. The clinician will unknowingly administer an overdose of hypertonic saline, rapidly exceeding safe limits.

3. **Step 3 (Pediatric & Underweight Underhydration)**:
   - *From Observation 4*: Applying 30 mL/kg instead of Holliday-Segar causes a severe deficit in lower-weight patients.
   - *Inference*: The tool must explicitly implement the validated Holliday-Segar (100/50/20 rule / 4-2-1 hourly rule) alongside adult weight-based maintenance (25–30 mL/kg/day standard, 20–25 mL/kg/day restricted).

4. **Step 4 (Diagnostic Error in AKI)**:
   - *From Observation 6*: Indonesian and international labs report Serum Urea. Directly dividing Serum Urea by Creatinine skews the ratio upward by 2.14x.
   - *Inference*: Clinicians will misdiagnose intrinsic renal failure (ATN) as pre-renal dehydration, potentially administering harmful fluid boluses to a patient with oliguric acute tubular necrosis.

5. **Step 5 (Iframe Embedding Fragility)**:
   - *From Observation 7*: Reliance on `cdn.tailwindcss.com` violates the single-file self-contained requirement and will break inside hospital intranet iframes or restricted Google Sites embeds.
   - *Inference*: The file must be refactored with pure inlined CSS adopting the obsidian/cyan design tokens from `index.html`.

---

## 3. Caveats

1. **No Source Code Modification During This Phase**: In strict compliance with the Explorer role, no changes have been committed to `adjustr-fluid.html`. Proposed algorithmic replacements and UI structures are detailed in `analysis.md` and this report.
2. **Formula Variation in Severe Acidosis**: The bicarbonate deficit formula uses $V_d = 0.5 \times \text{Weight}$. In extreme acidosis (pH < 7.0), $V_d$ can expand to 0.8. The tool should document this caveat and emphasize serial blood gas monitoring.
3. **Chronic vs. Acute Dysnatremia Distinction**: Adrogué-Madias assumes a closed-system distribution. In vivo renal response (e.g. self-induced water diuresis upon volume resuscitation in hypovolemic hyponatremia) can trigger rapid spontaneous sodium overcorrection, necessitating serial lab checks every 2–4 hours.

---

## 4. Conclusion

`adjustr-fluid.html` requires a comprehensive algorithmic overhaul and architectural rewrite:
1. **Implement Holliday-Segar & 24h Fluid Balancing**: Build 100/50/20 rule (and 4/2/1 hourly), adult NICE maintenance (25–30 vs 20–25 mL/kg), UOP monitoring (mL/kg/hr with oliguria flagging), and 24h intake/output net balance.
2. **Upgrade Adrogué-Madias with Full Variables & Output**: Integrate sex- and age-adjusted TBW (Children 0.6, Adult Male 0.6, Female 0.5, Elderly Male 0.5, Elderly Female 0.45), include infusate K+, and calculate **exact hourly IV infusion rate (mL/hr)** and 24h volume.
3. **Hardcode ODS & Cerebral Edema Safety Guardrails**: Enforce 8–10 mEq/L/24h ceiling (6–8 mEq/L for high-risk patients), with prominent red warning banners and overcorrection rescue protocols (DDAVP / D5W).
4. **Add Dedicated Potassium Replenishment Module**: Build deficit estimation, IV rate limits (10 mEq/hr peripheral, 20 mEq/hr central), 40 mEq/L peripheral concentration ceiling, absolute IV push ban, magnesium check alerts, and hyperkalemia emergency protocols.
5. **Fix AKI Module**: Add unit selector for BUN (mg/dL) vs Serum Urea (mg/dL) vs Serum Urea (mmol/L), correct the 2.14x conversion ratio, guard against Cr = 0, and incorporate KDIGO staging criteria.
6. **Migrate to Obsidian Dark Theme & Self-Contained Inlined CSS**: Remove Tailwind CDN runtime; embed dark obsidian styles (`#040814`, frosted glassmorphism, `#00F2FE` cyan accents) for 100% resilient Google Sites iframe embedding; add Contact Me button (`mailto:putrawan.2371041010@student.unud.ac.id`).

---

## 5. Verification Method

To verify the findings and proposed algorithm implementations:
1. **Mathematical Verification Scenarios (Node.js Script `verify_calculations.js`)**:
   - **Scenario A (Severe Hyponatremia & ODS Guardrail)**:
     - 65 kg female, age 72 (Elderly Female: $\text{TBW} = 65 \times 0.45 = 29.25$ L).
     - Serum Na = 112 mEq/L. Infusate: 3% NaCl (513 mEq/L).
     - Adrogué-Madias $\Delta\text{Na per 1L} = (513 - 112) / (29.25 + 1) = 401 / 30.25 = 13.26$ mEq/L.
     - Planned Target: Raise Na by 6 mEq/L in 24 hours ($0.25$ mEq/L/hr).
     - Infusion volume = $(6 / 13.26) \times 1000 = 452.6$ mL/24h $\rightarrow$ Hourly Rate = **18.9 mL/hr**.
     - Test assertion: If user inputs target rise of 12 mEq/L/24h, the system **MUST trigger an ODS Safety Alert** and refuse/flag the calculation.
   - **Scenario B (Holliday-Segar vs. Adult)**:
     - 15 kg child: Holliday-Segar gives $1000 + (5 \times 50) = 1250$ mL/24h (52.1 mL/hr). Current code gives $15 \times 30 = 450$ mL/24h (assert discrepancy).
     - 70 kg adult: Holliday-Segar gives $1500 + (50 \times 20) = 2500$ mL/24h (104.2 mL/hr).
   - **Scenario C (BUN:Cr Ratio with Serum Urea Conversion)**:
     - Serum Urea = 100 mg/dL, Creatinine = 2.5 mg/dL.
     - With Serum Urea mode selected: $\text{BUN} = 100 \times 0.467 = 46.7$ mg/dL $\rightarrow$ Ratio = $46.7 / 2.5 = 18.7$ (Intrinsic/ATN range).
     - Verifies fix against the uncorrected 40:1 false pre-renal output.
2. **Iframe & Offline Resiliency Inspection**:
   - Verify zero external `<script>` or `<link rel="stylesheet">` tags in `adjustr-fluid.html`.
   - Open in an isolated local browser window with network disabled to confirm full rendering without FOUC or layout shifts.
   - Inspect viewport scaling at 360px width to verify zero clipping or horizontal overflow.
