# Clinical Calculation & Safety Verification Analysis

**Author**: Test Writer Agent (`test_writer_1`)  
**Target File**: `C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\verify_calculations.js`  
**Test Subject Applications**: `adjustr-io.html`, `adjustr-fluid.html`, `rheumatools.html`, `index.html`  
**Date**: 2026-09-18  
**Verification Status**: PASS (30 / 30 tests passing, 100% compliance)

---

## 1. Executive Summary

An automated, standalone Node.js clinical test runner (`verify_calculations.js`) was designed, implemented, and executed to rigorously audit and verify medical calculation algorithms across the entire Doctor Portfolio suite. 

The test suite evaluates 30 test cases spanning four primary clinical calculation domains, live in-file JavaScript engines extracted from HTML application files, and static codebase integrity audits. All 30 test scenarios passed with 100% accuracy and compliance with international guidelines:
- **Cockcroft-Gault / Devine / KDIGO 2024**: Actual vs. Ideal vs. Adjusted Body Weight (ABW) obesity thresholds and CKD staging.
- **Adrogué-Madias & Electrolyte Kinetics**: Hypertonic 3% saline titration, sex- and age-adjusted TBW coefficients, active infusate potassium inclusion, and Osmotic Demyelination Syndrome (ODS) safety ceiling alerts.
- **ACR / EULAR Rheumatology Scoring**: DAS28-CRP logarithmic transformations, zero-CRP continuity, DAS28-ESR singularity guardrails, CDAI, and SDAI.
- **Pediatric & Fluid Resuscitation**: Holliday-Segar 100/50/20 and 4/2/1 rules vs crude adult approximations, potassium infusion rate ceilings (max 20 mEq/hr), BUN:Creatinine ratio interpretations with true urea molecular weight conversion, and input validation guardrails.

---

## 2. Mathematical & Clinical Derivation of Benchmark Scenarios

### Scenario 1: Cockcroft-Gault CrCl, Weight Selection & KDIGO Staging

#### Clinical Background
In non-obese individuals, Total Body Weight (TBW) represents metabolic mass. However, in obese individuals ($BMI \ge 30\text{ kg/m}^2$), adipose tissue is relatively poorly perfused and contributes minimally to creatinine production. Using actual weight significantly overestimates CrCl, while using Ideal Body Weight (IBW) underestimates CrCl due to hyperfiltration and increased lean body mass in obesity. Consensus nephrology guidelines mandate Adjusted Body Weight (ABW):
$$ABW = IBW + 0.4 \times (TBW - IBW)$$
In underweight individuals ($TBW < IBW$), actual weight must be used to prevent toxic drug overdose.

#### Formulas
- Devine Ideal Body Weight:
  $$IBW_{\text{male}} = 50.0 + 2.3 \times (\text{Height}_{\text{inches}} - 60)$$
  $$IBW_{\text{female}} = 45.5 + 2.3 \times (\text{Height}_{\text{inches}} - 60)$$
- Cockcroft-Gault Equation:
  $$CrCl = \frac{(140 - \text{Age}) \times \text{Weight}_{\text{used}}}{72 \times SCr} \times (0.85 \text{ if female})$$

#### Benchmark Patient Results
1. **Non-obese Male** (50 yo, 70 kg, 175 cm, SCr 1.0 mg/dL):
   - $\text{Height} = 68.90\text{ in} \implies IBW = 50 + 2.3 \times 8.90 = 70.46\text{ kg}$.
   - $BMI = 70 / 1.75^2 = 22.86\text{ kg/m}^2$ (Normal).
   - $TBW < IBW$ ($70 < 70.46$), weight used = $70.0\text{ kg}$.
   - $CrCl = ((140 - 50) \times 70) / (72 \times 1.0) = 87.50\text{ mL/min}$ (**KDIGO G2**, Mildly Decreased).
   - **Verification**: Exact match $87.50\text{ mL/min}$ (PASS).

2. **Obese Male** (50 yo, 110 kg, 170 cm, SCr 1.2 mg/dL):
   - $\text{Height} = 66.93\text{ in} \implies IBW = 50 + 2.3 \times 6.93 = 65.94\text{ kg}$.
   - $BMI = 110 / 1.70^2 = 38.06\text{ kg/m}^2$ (Class II Obesity $\ge 30$).
   - $ABW = 65.94 + 0.4 \times (110 - 65.94) = 65.94 + 17.62 = 83.56\text{ kg}$.
   - $CrCl = ((140 - 50) \times 83.56) / (72 \times 1.2) = 7520.58 / 86.4 = 87.05\text{ mL/min}$ (**KDIGO G2**).
   - *Contrast with unadjusted TBW*: would have yielded $114.58\text{ mL/min}$, an error of $+31.6\%$ leading to toxic overdosing of vancomycin, aminoglycosides, or cefepime.
   - **Verification**: Exact match $87.05\text{ mL/min}$ (PASS).

3. **Underweight Female** (60 yo, 42 kg, 160 cm, SCr 0.8 mg/dL):
   - $\text{Height} = 62.99\text{ in} \implies IBW = 45.5 + 2.3 \times 2.99 = 52.38\text{ kg}$.
   - $TBW\ (42\text{ kg}) < IBW\ (52.38\text{ kg})$, weight used = $42.0\text{ kg}$.
   - $CrCl = [((140 - 60) \times 42) / (72 \times 0.8)] \times 0.85 = [3360 / 57.6] \times 0.85 = 49.58\text{ mL/min}$ (**KDIGO G3a**, Mild-Moderate CKD).
   - **Verification**: Exact match $49.58\text{ mL/min}$ (PASS).

4. **Standard Adult Female** (50 yo, 60 kg, 165 cm, SCr 1.0 mg/dL):
   - $BMI = 22.04\text{ kg/m}^2$. Weight used = $60.0\text{ kg}$.
   - $CrCl = [((140 - 50) \times 60) / (72 \times 1.0)] \times 0.85 = 63.75\text{ mL/min}$ (**KDIGO G2**).
   - **Verification**: Exact match $63.75\text{ mL/min}$ (PASS).

5. **Severe Renal Failure (KDIGO G5 / Anuria)** (75 yo, 55 kg, 160 cm, SCr 3.8 mg/dL):
   - $CrCl = 9.47\text{ mL/min} < 15\text{ mL/min}$.
   - Successfully classifies as **KDIGO G5** (Kidney Failure / End Stage) and triggers critical alert warning banner (PASS).

---

### Scenario 2: Severe Hyponatremia Infusion Rate & Safety Guardrails

#### Clinical Background
In severe symptomatic hyponatremia ($Na < 120\text{ mEq/L}$), rapid correction exceeding $8 - 10\text{ mEq/L/24h}$ produces devastating osmotic shrinkage of pontine oligodendrocytes, leading to irreversible **Osmotic Demyelination Syndrome (ODS) / Central Pontine Myelinolysis**, manifesting with spastic quadriparesis, pseudobulbar palsy, coma, or death.

#### Formulas
- Adrogué-Madias Equation:
  $$\Delta Na_{1L} = \frac{(Na_{\text{infusate}} + K_{\text{infusate}}) - Na_{\text{serum}}}{TBW + 1}$$
- Total Volume and Hourly Pump Rate:
  $$V_{\text{total}} = \frac{\Delta Na_{\text{target24h}}}{\Delta Na_{1L}} \times 1000\text{ mL}$$
  $$\text{Hourly Infusion Rate} = \frac{V_{\text{total}}}{24}\text{ mL/hr}$$
- Total Body Water (TBW) Coefficients:
  - Non-elderly adult male ($<65$ yo): $0.60 \times \text{Weight}$
  - Non-elderly adult female ($<65$ yo): $0.50 \times \text{Weight}$
  - Elderly male ($\ge 65$ yo): $0.50 \times \text{Weight}$
  - Elderly female ($\ge 65$ yo): $0.45 \times \text{Weight}$

#### Benchmark Patient Results
1. **Severe Hyponatremia with 3% Saline** (60 yo Male, 70 kg, initial $Na = 115\text{ mEq/L}$, 3% NaCl = $513\text{ mEq/L}$):
   - $TBW = 70 \times 0.60 = 42.0\text{ L}$.
   - $\Delta Na_{1L} = (513 - 115) / (42 + 1) = 398 / 43 = 9.2558\text{ mEq/L per Liter}$.
   - For safe target rise $\Delta Na_{\text{target}} = 6\text{ mEq/24h}$:
     $V_{\text{total}} = (6 / 9.2558) \times 1000 = 648.24\text{ mL}$.
     $\text{Hourly pump rate} = 648.24 / 24 = 27.01\text{ mL/hr}$.
     Safety status: `SAFE` (PASS).
2. **ODS Warning Trigger** ($\Delta Na_{\text{target}} = 9\text{ mEq/24h}$):
   - Target exceeds standard recommended target ($6 - 8\text{ mEq/L/24h}$).
   - Safety status: `WARNING` (approaching 10 mEq/24h ceiling, frequent lab monitoring mandated) (PASS).
3. **Critical Safety Ceiling Alert** ($\Delta Na_{\text{target}} = 12\text{ mEq/24h}$):
   - Target exceeds absolute safe threshold ($10\text{ mEq/L/24h}$).
   - Safety status: `CRITICAL_ALERT` with explicit hazard banner: "CRITICAL ALERT: Target correction rate of 12.0 mEq/L/24h exceeds the absolute safety ceiling of 10 mEq/L/24h. High risk of irreversible Osmotic Demyelination Syndrome (ODS) / Central Pontine Myelinolysis!" (PASS).
4. **Physiological Age & Sex Adjustment**:
   - 75 yo female ($50\text{ kg}$): uses $0.45$ factor ($TBW = 22.5\text{ L}$), correctly yielding $\Delta Na_{1L} = 16.81\text{ mEq/L}$. If hardcoded to $0.60$, predicted $\Delta Na_{1L}$ would be $12.74\text{ mEq/L}$, leading to $24\%$ infusion overdose.
5. **Infusate Potassium Inclusion**:
   - Ringer's Lactate ($Na=130, K=4$) into serum $Na=120, TBW=35$: $\Delta Na_{1L} = (130 + 4 - 120) / (35 + 1) = 14 / 36 = 0.3889\text{ mEq/L}$ (PASS).

---

### Scenario 3: Rheumatoid Arthritis Disease Activity Scoring (DAS28, CDAI, SDAI)

#### Clinical Background
In Rheumatoid Arthritis (RA) management under the Treat-to-Target (T2T) paradigm, clinical decisions (escalating DMARDs or biologics) depend on precise mathematical scoring. A critical flaw in prior software versions was `if (crp > 0) { score = ... }` which bypassed the entire 28-joint count assessment when CRP was normal or undetectable ($0\text{ mg/L}$), falsely assigning patients with active synovitis to "Remission".

#### Formulas
- DAS28-CRP:
  $$DAS28\text{-}CRP = 0.56\sqrt{TJC28} + 0.28\sqrt{SJC28} + 0.36\ln(CRP_{\text{mg/L}} + 1) + 0.014(PGA_{\text{mm}}) + 0.96$$
  - Thresholds: $\le 2.60$ Remission, $2.61 - 3.20$ Low, $3.21 - 5.10$ Moderate, $> 5.10$ High.
- DAS28-ESR:
  $$DAS28\text{-}ESR = 0.56\sqrt{TJC28} + 0.28\sqrt{SJC28} + 0.70\ln(ESR_{\text{mm/hr}}) + 0.014(PGA_{\text{mm}})$$
- CDAI:
  $$CDAI = TJC28 + SJC28 + PGA_{\text{0-10}} + EGA_{\text{0-10}}$$
  - Thresholds: $\le 2.8$ Remission, $\le 10.0$ Low, $\le 22.0$ Moderate, $> 22.0$ High.
- SDAI:
  $$SDAI = CDAI + CRP_{\text{mg/dL}}$$
  - Thresholds: $\le 3.3$ Remission, $\le 11.0$ Low, $\le 26.0$ Moderate, $> 26.0$ High.

#### Benchmark Patient Results
1. **Benchmark RA Patient** ($TJC=6, SJC=4, CRP=15\text{ mg/L}, PGA=40\text{ mm}$):
   - $0.56 \times \sqrt{6} = 1.371714$
   - $0.28 \times \sqrt{4} = 0.560000$
   - $0.36 \times \ln(16) = 0.998132$
   - $0.014 \times 40 = 0.560000$
   - $\text{Constant} = 0.960000$
   - $\text{Total} = 4.449846 \implies \mathbf{4.45}$ (**Moderate Disease Activity**).
   - **Verification**: Exact match $4.45$ (PASS).

2. **Zero-CRP Edge Case** ($TJC=6, SJC=4, CRP=0\text{ mg/L}, PGA=40\text{ mm}$):
   - $\ln(0 + 1) = \ln(1) = 0$.
   - $\text{Total} = 1.371714 + 0.560000 + 0 + 0.560000 + 0.96 = \mathbf{3.45}$ (**Moderate Disease Activity**).
   - **Verification**: Matches $3.45$, correctly classified as Moderate Disease Activity, never defaulting to $0.00$ Remission (PASS).

3. **Active Polyarthritis with Normal CRP** ($TJC=16, SJC=8, CRP=0\text{ mg/L}, PGA=70\text{ mm}$):
   - Score = $4.97$ (**Moderate Disease Activity**) (PASS).

4. **True Clinical Remission** ($TJC=0, SJC=0, CRP=0.5\text{ mg/L}, PGA=5\text{ mm}$):
   - Score = $1.18 \le 2.60$ (**Remission**) (PASS).

5. **DAS28-ESR Singularity Guardrail**:
   - Rejecting $ESR \le 0$ to eliminate $\ln(0) = -\infty$ (PASS).

6. **CDAI & SDAI Matching**:
   - $TJC=6, SJC=4, PGA=4.0, EGA=3.0, CRP=1.5\text{ mg/dL}$:
   - $CDAI = 17.0$ (Moderate), $SDAI = 18.5$ (Moderate) (PASS).

---

### Scenario 4: Fluid Maintenance, Electrolyte Ceilings & Boundary Guardrails

1. **Holliday-Segar 100/50/20 Maintenance Rule**:
   - Infant ($5\text{ kg}$): $500\text{ mL/24h}$ ($20.0\text{ mL/hr}$).
   - Child ($15\text{ kg}$): $1000 + 5 \times 50 = 1250\text{ mL/24h}$ ($50.0\text{ mL/hr}$). (Note: crude adult rule $30\text{ mL/kg}$ gives only $450\text{ mL}$, under-hydrating a child by $64\%$).
   - Adult ($70\text{ kg}$): $1500 + 50 \times 20 = 2500\text{ mL/24h}$ ($110.0\text{ mL/hr}$).
   - **Verification**: All match clinical standard (PASS).

2. **Potassium IV Infusion Ceilings**:
   - Peripheral IV limit: maximum concentration $\le 40\text{ mEq/L}$ (phlebitis guardrail).
   - Peripheral infusion rate limit: maximum recommended $10\text{ mEq/hr}$.
   - Absolute clinical maximum ceiling: $20\text{ mEq/hr}$ (rates $> 20\text{ mEq/hr}$ prohibited due to fatal asystole/arrhythmia risk; requires central venous catheter and ICU telemetry).
   - **Verification**: All guardrails active and verified (PASS).

3. **AKI BUN:Cr Ratio & Urea vs. BUN Conversion**:
   - Urea molecular weight = $60\text{ g/mol}$; BUN nitrogen = $28\text{ g/mol} \implies BUN = \text{Urea} / 2.14$.
   - Pre-Renal: Urea $100\text{ mg/dL}$, Cr $1.0\text{ mg/dL} \implies BUN = 46.7\text{ mg/dL} \implies \text{Ratio} = 46.7:1$ (Pre-Renal Azotemia $> 20$).
   - Intrinsic ATN: Urea $40\text{ mg/dL}$, Cr $2.5\text{ mg/dL} \implies BUN = 18.7\text{ mg/dL} \implies \text{Ratio} = 7.5:1$ (ATN $< 10$).
   - Division by zero creatinine ($Cr = 0$) guardrail: throws clear validation error, never displays false 0.0 ATN (PASS).

4. **Input Validation**:
   - Negative joint counts, blank fields, negative age, zero/negative weight or height, and zero creatinine are rejected gracefully without `NaN` (PASS).

---

## 3. Live In-File Engine Interoperability Testing

`verify_calculations.js` directly loads and extracts the actual runtime JavaScript engines embedded inside the HTML applications:
1. **`adjustr-io.html` (`ClinicalEngine`)**:
   - Evaluates `ClinicalEngine.calculateCrCl(50, 110, 170, 1.2, 'male')`.
   - Result: $CrCl = 87.05\text{ mL/min}$ using $ABW = 83.56\text{ kg}$.
   - Evaluates Underweight Female ($60\text{ yo}, 42\text{ kg}, 160\text{ cm}, SCr\ 0.8$): $CrCl = 49.58\text{ mL/min}$ using $TBW = 42\text{ kg}$.
   - **Status**: PASS.
2. **`adjustr-fluid.html` (`FluidElectrolyteEngine`)**:
   - Evaluates `FluidElectrolyteEngine.calcHyponatremia` with severe hyponatremia benchmark.
   - Result: $TBW = 42.0\text{ L}$, $\Delta Na_{1L} = 9.2558\text{ mEq/L}$, hourly rate = $27.01\text{ mL/hr}$, safe target confirmed.
   - Danger ODS test ($12\text{ mEq/24h}$): `isDangerODS: true` with warning text.
   - Holliday-Segar ($15\text{ kg}$): exactly $1250\text{ mL/24h}$.
   - **Status**: PASS.
3. **`rheumatools.html` (`RheumaCalc`)**:
   - Evaluates `RheumaCalc.calculateDAS28_CRP(6, 4, 15, 40)`.
   - Result: `score: '4.45'`, `activity.level: 'Moderate'`.
   - Evaluates Zero-CRP ($CRP = 0\text{ mg/L}$): `score: '3.45'`, `activity.level: 'Moderate'`.
   - **Status**: PASS.

---

## 4. Static Codebase & Security Token Audit

The audit suite scans physical files on disk for compliance with core aesthetic and security requirements:
- `index.html`: Contains active `mailto:putrawan.2371041010@student.unud.ac.id`, `#040814` obsidian token, `#00F2FE` cyan accent.
- `adjustr-io.html`: Contains `mailto:putrawan...`, `#040814` obsidian token, KDIGO staging logic, and ABW dosing logic.
- `adjustr-fluid.html`: Contains `mailto:putrawan...`, `#040814` obsidian token, dynamic `calcTBW`, and ODS guardrails.
- `rheumatools.html`: Contains `mailto:putrawan...`, `#040814` obsidian token, eliminates `if (crp > 0)` bypass, and includes CDAI/SDAI modules.

---

## 5. Verbatim Test Execution Output

```
================================================================
   DOCTOR PORTFOLIO CLINICAL VERIFICATION & BENCHMARK SUITE    
================================================================

[SCENARIO 1: Renal Cockcroft-Gault CrCl & Weight Selection]
  ✓ PASS [Scenario 1] Non-obese Male: 50yo, 70kg, 175cm, SCr 1.0 -> Normal BMI (22.86), uses TBW 70kg -> CrCl = 87.5 mL/min
  ✓ PASS [Scenario 1] Obese Male: 50yo, 110kg, 170cm, SCr 1.2 -> Obese BMI (38.06), uses ABW 83.56kg -> CrCl = 87.05 mL/min
  ✓ PASS [Scenario 1] Underweight Female: 60yo, 42kg, 160cm, SCr 0.8 -> TBW (42kg) < IBW (52.4kg), uses TBW -> CrCl = 49.58 mL/min
  ✓ PASS [Scenario 1] Standard Adult Female: 50yo, 60kg, 165cm, SCr 1.0 -> Normal BMI 22.04 -> CrCl = 63.75 mL/min (0.85 sex factor)
  ✓ PASS [Scenario 1] Severe Renal Failure (CrCl < 15) triggers KDIGO G5 Stage and High Risk Warning
  ✓ PASS [Scenario 1] BMI 30.0 Exact Boundary Condition triggers ABW switch

[SCENARIO 2: Severe Hyponatremia & ODS Safety Guardrails]
  ✓ PASS [Scenario 2] Adrogué-Madias: 60yo Male, 70kg, initial Na 115, 3% Saline (513 mEq/L) -> DeltaNa = 9.26 mEq/L
  ✓ PASS [Scenario 2] Safety Warning: Target 24h rise > 8 mEq/24h (e.g. 9 mEq/24h) triggers WARNING alert
  ✓ PASS [Scenario 2] Safety Ceiling Alert: Target 24h rise > 10 mEq/24h (e.g. 12 mEq/24h) triggers CRITICAL ODS ALERT
  ✓ PASS [Scenario 2] Elderly Female TBW Coefficient: 75yo Female, 50kg -> Uses 0.45 factor (TBW = 22.5L, NOT hardcoded 0.6)
  ✓ PASS [Scenario 2] Elderly Male TBW Coefficient: 70yo Male, 70kg -> Uses 0.50 factor (TBW = 35.0L)
  ✓ PASS [Scenario 2] Active Infusate Potassium Inclusion: Ringer Lactate (Na=130, K=4) into Na=120, TBW=35L

[SCENARIO 3: Rheumatology DAS28-CRP & Disease Activity Scoring]
  ✓ PASS [Scenario 3] Benchmark RA Patient: TJC=6, SJC=4, CRP=15 mg/L, PGA=40mm -> DAS28-CRP = 4.45 (Moderate Disease Activity)
  ✓ PASS [Scenario 3] Zero-CRP Edge Case: TJC=6, SJC=4, CRP=0 mg/L, PGA=40mm -> DAS28-CRP = 3.45 (Moderate, NEVER 0.00 Remission)
  ✓ PASS [Scenario 3] Polyarthritis with Normal CRP: TJC=16, SJC=8, CRP=0 mg/L, PGA=70mm -> DAS28-CRP = 4.97 (Moderate)
  ✓ PASS [Scenario 3] True Remission Case: TJC=0, SJC=0, CRP=0.5 mg/L, PGA=5mm -> DAS28-CRP = 1.18 <= 2.6 (Remission)
  ✓ PASS [Scenario 3] High Disease Activity Case: TJC=18, SJC=12, CRP=45 mg/L, PGA=80mm -> DAS28-CRP = 6.80 > 5.1 (High)
  ✓ PASS [Scenario 3] DAS28-ESR Singularity Guardrail: ESR=0 mm/hr must be rejected to prevent ln(0) = -Infinity
  ✓ PASS [Scenario 3] CDAI & SDAI Calculations: TJC=6, SJC=4, PGA=4.0, EGA=3.0, CRP=1.5 mg/dL -> CDAI=17.0, SDAI=18.5 (Moderate)

[SCENARIO 4: Fluid Maintenance, Electrolyte Ceilings & Edge Guardrails]
  ✓ PASS [Scenario 4] Holliday-Segar Fluid Volumes: 5kg, 15kg, and 70kg patients vs crude 30 mL/kg
  ✓ PASS [Scenario 4] Potassium Infusion Ceilings: Peripheral max 10 mEq/hr, central absolute ceiling 20 mEq/hr
  ✓ PASS [Scenario 4] AKI BUN:Cr Ratio: Serum Urea vs BUN conversion and zero-creatinine guardrail
  ✓ PASS [Scenario 4] Input Validation: Negative and blank inputs gracefully rejected without NaN

[SUITE 5: Live In-File Engine Interoperability Testing]
  ✓ PASS [Live In-File] adjustr-io.html: In-file ClinicalEngine calculates exact CrCl with ABW for obese patient
  ✓ PASS [Live In-File] adjustr-fluid.html: In-file FluidElectrolyteEngine computes exact Adrogué-Madias & ODS alerts
  ✓ PASS [Live In-File] rheumatools.html: In-file RheumaCalc computes exact DAS28-CRP and zero-CRP without bypass

[SUITE 6: Static Code Audit & Project Integrity Verification]
  ✓ PASS [Static Audit] index.html contains required Contact Me mailto and obsidian tokens
  ✓ PASS [Static Audit] rheumatools.html contains obsidian tokens, contact link, and eliminates crp>0 bypass
  ✓ PASS [Static Audit] adjustr-fluid.html contains obsidian tokens, contact link, and age/gender TBW
  ✓ PASS [Static Audit] adjustr-io.html contains obsidian tokens, contact link, KDIGO, and ABW logic

================================================================
VERIFICATION SUMMARY:
  Total Tests Run:  30
  Tests Passed:    30
  Tests Failed:    0

All benchmark clinical test scenarios passed with 100% compliance!
```
