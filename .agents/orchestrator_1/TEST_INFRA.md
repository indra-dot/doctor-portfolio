# E2E Test Infra: Doctor Portfolio Clinical Calculations & Safety

## Test Philosophy
- Opaque-box and unit benchmark clinical testing.
- Derives directly from clinical reference guidelines (KDIGO/Cockcroft-Gault, Adrogué-Madias, IDSA, ACR/EULAR) and user requirements in ORIGINAL_REQUEST.md.

## Required Benchmark Scenarios
1. **Scenario 1: CrCl Standard Adult Male/Female vs Obese Patient with ABW**
   - Non-obese Male: 50 yo, 70 kg, 175 cm, SCr 1.0 -> Normal BMI 22.86, uses TBW 70 kg -> CrCl = 87.5 mL/min.
   - Obese Male: 50 yo, 110 kg, 170 cm, SCr 1.2 -> Height 66.93 inches -> IBW = 50 + 2.3*(66.93-60) = 65.94 kg. BMI = 110 / (1.7)^2 = 38.06 (Obese >= 30).
     -> ABW = 65.94 + 0.4 * (110 - 65.94) = 83.56 kg.
     -> CrCl = ((140-50)*83.56) / (72*1.2) = 87.05 mL/min.
   - Underweight Female: 60 yo, 42 kg, 160 cm, SCr 0.8 -> Height 63 inches -> IBW = 45.5 + 2.3*3 = 52.4 kg. Since TBW (42) < IBW (52.4), use TBW 42 kg -> CrCl = ((140-60)*42) / (72*0.8) * 0.85 = 49.58 mL/min.

2. **Scenario 2: Severe Hyponatremia Infusion Rate & Safety Cap Warning**
   - Patient: 60 yo Male (non-elderly or elderly threshold, standard 0.6 or 0.5), 70 kg, initial Na = 115 mEq/L.
   - Infusate: 3% Hypertonic Saline (513 mEq/L Na).
   - ΔNa per liter: (513 - 115) / (42 + 1) = 398 / 43 = 9.256 mEq/L.
   - Target rise: e.g. 6 mEq/L in 24h -> safe; e.g. 12 mEq/L in 24h -> MUST trigger immediate safety cap alert (>10 mEq/L/24h) for Osmotic Demyelination Syndrome (ODS) prevention.
   - Hourly infusion rate calculation: rate = (target_rise / ΔNa_per_L) * 1000 / hours.

3. **Scenario 3: Rheumatoid Arthritis DAS28-CRP Score Match**
   - Inputs: TJC28 = 6, SJC28 = 4, CRP = 15 mg/L, PGA = 40 mm.
   - Math:
     0.56 * sqrt(6) = 1.3717
     0.28 * sqrt(4) = 0.5600
     0.36 * ln(15 + 1) = 0.36 * ln(16) = 0.36 * 2.77259 = 0.9981
     0.014 * 40 = 0.5600
     Constant = 0.96
     Total = 1.3717 + 0.5600 + 0.9981 + 0.5600 + 0.96 = 4.4498... -> rounded to 2 decimal places: 4.45 (Moderate Disease Activity).
   - Zero-CRP Test: TJC=6, SJC=4, CRP=0, PGA=40 -> 0.36*ln(1) = 0 -> Total = 1.3717 + 0.56 + 0 + 0.56 + 0.96 = 3.45 (Moderate Disease Activity, NOT 0.00 Remission).

4. **Scenario 4: Boundary & Guardrail Edge Cases**
   - Negative values -> graceful validation error, no NaN.
   - Blank inputs -> prompt user to fill required fields, no calculation or false remission.
   - High-risk nephrotoxic drugs in severe renal failure (CrCl < 15) -> warning banner.
