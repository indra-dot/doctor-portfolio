# Handoff Report: Explorer Survey 1 (adjustr-io.html)

**Agent**: explorer_survey_1  
**Target**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\adjustr-io.html`  
**Date**: 2026-09-18  
**Handoff Type**: Hard (Task complete)

---

## 1. Observation

Direct observations from source inspection of `adjustr-io.html` and executable Node.js test scripts:

1. **Weight Selection Logic & Cockcroft-Gault**:
   - Location: `adjustr-io.html`, lines 217344–217420 (within bundled script).
   - Verbatim Code:
     ```javascript
     const R1 = (T, j) => {
       if (!T) return 0;
       const B = T / 2.54;
       return (j === "male" ? 50 : 45.5) + 2.3 * (B - 60);
     };
     const B1 = (T, j) => !T || !j ? 0 : Math.sqrt(T * j / 3600);
     const V1 = (T, j, B, d, R) => {
       if (!T || !j || !B || !R || B <= 0) return null;
       const V = R1(R, d);
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
   - Observed: There is no BMI calculation. Every patient where actual weight (`j`) exceeds ideal weight (`V`) is adjusted with $F = V + 0.4 \times (j - V)$ and labeled `"Adjusted (Obese)"`, regardless of whether their BMI is normal (e.g., BMI 22–24).

2. **Boundary Gap Failure & Silent Fallback to Maximum Standard Dose**:
   - Verbatim Code:
     ```javascript
     const Nt = (G, xt) => G.find(tl => xt <= tl.max && xt >= tl.min);
     const Ut = (E, w, bt) => {
       ...
       const Tt = Nt(E.adjustments, w);
       return Tt ? Tt.recommendation : E.standard_dose || "Standard Dose";
     };
     ```
   - Automated Node.js boundary test execution: 148 test queries across 36 drugs failed range matching at decimal boundaries (e.g. `29.95`, `49.95`, `50.05`) and low ranges ($0 \le \text{CrCl} < 5$).
   - Verbatim Test Output for Ampicillin-Sulbactam at $\text{CrCl} = 3\text{ mL/min}$:
     ```
     CrCl = 3 adjustment found: undefined
     Fallback recommendation output: 3 g IV q6h
     ```
   - Anuric / dialysis patients with $\text{CrCl} = 3\text{ mL/min}$ are prescribed full unadjusted standard dose ($3\text{ g IV q6h}$).

3. **Total Absence of eGFR and KDIGO Staging**:
   - Keyword search across `adjustr-io.html`:
     `eGFR matches: 0`, `KDIGO matches: 0`, `CKD-EPI matches: 0`.
   - The only staging logic present is a 3-tier color function:
     ```javascript
     const zl = E => !E && E !== 0 ? "bg-slate-100 text-slate-400" : E < 30 ? "bg-red-600 text-white shadow-red-200" : E < 60 ? "bg-amber-500 text-white shadow-amber-200" : "bg-green-600 text-white shadow-green-200";
     ```

4. **Antimicrobial Database RRT Omissions**:
   - Out of 36 antimicrobials in database `Ol`, 25 have no RRT (IHD / CRRT) dosing defined, including ICU backbone agents: Meropenem, Penicillin G, Gentamicin, Amikacin, Daptomycin, Cotrimoxazole, Linezolid, Metronidazole, Fluconazole, Acyclovir.

5. **Edge-Case Math Failures**:
   - Running `V1(-10, 70, 1.0, "male", 170)` yields `value: 140.75` (negative age accepted).
   - Running `V1(150, 70, 1.0, "male", 170)` yields `value: -9.38` (negative CrCl rendered without guardrail).
   - Running `V1(45, -70, 1.0, "male", 170)` yields `value: -92.36`, `bsa: NaN` (UI renders `"NaN m2"`).
   - Running `V1(45, 70, 0.001, "male", 170)` yields `value: 89144.58 mL/min` (unphysiologic clearance).

6. **Styling and Asset Dependencies**:
   - Background is light gray (`bg-slate-50`), cards are white (`bg-white border-slate-200`), primary buttons are blue (`bg-blue-600`). It completely lacks the `#040814` obsidian backdrop and cyan/blue glassmorphism of `index.html`.
   - Line 5: `<link rel="icon" type="image/svg+xml" href="./vite.svg" />`. The file `vite.svg` does not exist in the root folder, triggering a 404 error.
   - Contact Me link: Searching for `putrawan`, `mailto`, `feedback`, or `contact` yields zero occurrences.

---

## 2. Logic Chain

1. **From Observation 1**: The weight assignment `j > V ? (F = V + 0.4*(j-V)) : F = j` directly checks whether Total Body Weight > Ideal Body Weight without calculating BMI ($\text{Weight} / \text{Height}^2$). Because Devine IBW reflects a lean BMI of roughly 21.5–22.5 kg/m², anyone with a normal BMI between 22 and 25 kg/m² has $\text{TBW} > \text{IBW}$. Therefore, normal-weight patients are inappropriately placed on Adjusted Body Weight, which underestimates their CrCl and leads to subtherapeutic dosing in acute infections.

2. **From Observation 2**: Range tables in `Ol` contain non-contiguous brackets (`min: 50.1` and `max: 50`, `min: 5` without a $0$ bracket). The lookup `G.find(tl => xt <= tl.max && xt >= tl.min)` fails whenever `xt` falls into these gaps. In `Ut`, failed lookups default to `E.standard_dose`. Therefore, severe renal impairment or borderline values silently revert to maximum standard adult dosing, presenting a lethal risk of antibiotic overdose (e.g. encephalopathy, neurotoxicity).

3. **From Observation 3**: International nephrology guidelines (KDIGO 2012/2024) require eGFR staging (G1–G5) based on CKD-EPI equations, and project mandate R1 requires eGFR staging logic. Because neither CKD-EPI nor KDIGO is implemented, the tool is non-compliant with clinical requirements.

4. **From Observation 4**: In acute renal failure or ESRD requiring hemodialysis or continuous renal replacement therapy, hydrophilic drugs like Meropenem and Aminoglycosides are extensively cleared by extracorporeal circuits. The absence of IHD/CRRT dosing recommendations for 25 drugs forces clinicians to guess or look outside the application, defeating the purpose of an ICU adjustment calculator.

5. **From Observation 5**: Functions `R1`, `B1`, and `V1` lack numerical domain assertions ($\text{Age} \in [18, 120]$, $\text{Weight} > 0$, $\text{Height} > 0$, $\text{SCr} \in [0.1, 30]$). As a result, anomalous user inputs generate negative numbers and `NaN`, which break UI strings and trigger the silent maximum-dose fallback.

6. **From Observation 6**: The application UI is built with Tailwind CSS light slate utilities, whereas `index.html` uses an obsidian glassmorphic design token system (`--bg-dark: #040814`, `--card-bg: rgba(15, 23, 42, 0.75)`, `--accent-cyan: #00F2FE`). Furthermore, the mandate requires a "Contact Me" button with `href="mailto:putrawan.2371041010@student.unud.ac.id"`, which is currently missing.

---

## 3. Caveats

1. **Pediatric Scope**: Cockcroft-Gault is clinically validated only for adults ($\ge 18$ years). This investigation assumes the tool is strictly intended for adult inpatient care; if pediatric support is desired, the Bedside Schwartz equation would need to be added.
2. **Dialysis Machine Modalities**: CRRT dosing varies somewhat depending on effluent flow rate ($20–25\text{ mL/kg/h}$ vs. $> 35\text{ mL/kg/h}$). Proposed RRT additions reflect standard consensus effluent rates ($20–25\text{ mL/kg/h}$) and high-flux hemodialysis membranes.
3. **Single-File Compilation**: `adjustr-io.html` is currently an inlined Vite bundle. When rewriting or modernizing, care must be taken to ensure the resulting HTML remains 100% self-contained without external build dependencies.

---

## 4. Conclusion

`adjustr-io.html` has severe medical calculation vulnerabilities (inappropriate obesity down-adjustment for normal-weight individuals, fatal silent fallback to standard dose in severe renal impairment/gaps, omitted KDIGO and CKD-EPI algorithms, missing RRT data for 25 drugs) and requires a full aesthetic redesign into the dark obsidian glassmorphic theme of `index.html` with an active Contact Me button (`putrawan.2371041010@student.unud.ac.id`) and 100% self-contained Google Sites iframe embed compatibility.

---

## 5. Verification Method

To independently verify these findings, run the following commands in Node.js:

1. **Verify Inappropriate Obesity Adjustment for Normal-Weight Patient**:
   ```bash
   node -e "
   const R1 = (T, j) => { const B = T / 2.54; return (j === 'male' ? 50 : 45.5) + 2.3 * (B - 60); };
   const V1 = (T, j, B, d, R) => {
     const V = R1(R, d);
     let F = j, rt = 'Actual';
     j > V ? (F = V + 0.4 * (j - V), rt = 'Adjusted (Obese)') : (F = j, rt = 'Actual');
     return { usedWeight: F, weightType: rt, ibw: V, actualWeight: j };
   };
   // Male 175 cm, 72 kg (BMI 23.5 - Normal)
   console.log(V1(45, 72, 1.0, 'male', 175));
   "
   ```
   *Expected Output*: `{ usedWeight: 71.078, weightType: 'Adjusted (Obese)', ibw: 70.46, actualWeight: 72 }`. Confirms normal-weight patient is dosed on ABW and labeled Obese.

2. **Verify Fatal Fallback to Standard Dose at CrCl = 3 mL/min (Ampicillin-Sulbactam)**:
   ```bash
   node -e "
   const fs = require('fs');
   const html = fs.readFileSync('adjustr-io.html', 'utf8');
   const script = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)[1];
   const appSlice = script.substring(196835);
   const r1Idx = appSlice.indexOf(',R1=');
   const Ol = eval('(' + appSlice.substring(0, r1Idx) + ')');
   const Nt = (G, xt) => G.find(tl => xt <= tl.max && xt >= tl.min);
   const strat = Ol['ampicillin-sulbactam'].strategies['Systemic / Severe'];
   const match = Nt(strat.adjustments, 3);
   console.log('Match for CrCl=3:', match);
   console.log('Resulting Dose:', match ? match.recommendation : strat.standard_dose);
   "
   ```
   *Expected Output*: `Match for CrCl=3: undefined`, `Resulting Dose: 3 g IV q6h`. Confirms that severe renal failure receives the full standard dose.

3. **Verify Boundary Decimal Gaps Across All Drugs**:
   ```bash
   node -e "
   const fs = require('fs');
   const html = fs.readFileSync('adjustr-io.html', 'utf8');
   const script = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)[1];
   const appSlice = script.substring(196835);
   const r1Idx = appSlice.indexOf(',R1=');
   const Ol = eval('(' + appSlice.substring(0, r1Idx) + ')');
   const Nt = (G, xt) => G.find(tl => xt <= tl.max && xt >= tl.min);
   let fails = 0;
   [9.95, 14.95, 29.95, 49.95, 50.05].forEach(crcl => {
     Object.keys(Ol).forEach(k => {
       const d = Ol[k];
       const list = d.isMultiStrategy ? Object.values(d.strategies) : [d];
       list.forEach(s => { if (s.adjustments && !Nt(s.adjustments, crcl)) fails++; });
     });
   });
   console.log('Total boundary gap failures:', fails);
   "
   ```
   *Expected Output*: Output will show dozens of failures where discrete ranges fail to match continuous clearance values.

4. **Verify Missing Contact Me Button and Broken Favicon Link**:
   - Inspect `adjustr-io.html` lines 4–7: `<link rel="icon" type="image/svg+xml" href="./vite.svg" />`.
   - Search for `putrawan.2371041010@student.unud.ac.id`: zero matches.

---

### Invalidation Conditions
This assessment would be invalidated if:
1. `adjustr-io.html` was found to be an obsolete draft and a separate production version exists containing CKD-EPI, continuous range interpolation, and the obsidian design system.
2. Clinical consensus for Cockcroft-Gault weight selection was proven to mandate Adjusted Body Weight for all patients whose actual weight exceeds ideal weight regardless of BMI.
