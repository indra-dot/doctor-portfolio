# Project: Doctor Portfolio Clinical Tools Audit, Modernization & Verification

## Architecture
- Standalone clinical web applications embedded as iframes in Google Sites:
  - `adjustr-io.html`: Antimicrobial renal dose adjustments, Cockcroft-Gault CrCl, eGFR KDIGO staging, IHD/CRRT parameters.
  - `adjustr-fluid.html`: Fluid therapy (Holliday-Segar), 24h loss balancing, Adrogué-Madias sodium correction with ODS safety cap, potassium deficit replenishment, AKI BUN:Cr interpretation.
  - `rheumatools.html`: Rheumatology disease activity scoring (DAS28-CRP, DAS28-ESR, CDAI, SDAI, ACR/EULAR response criteria).
  - `index.html`: Portfolio main landing page hosting tool cards, navigation, and contact access.
  - `verify_calculations.js`: Automated Node.js verification script benchmarking clinical calculation scenarios.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | CrCl Cockcroft-Gault with ABW | Use IBW when TBW < IBW, TBW when normal, ABW (IBW + 0.4*(TBW-IBW)) when BMI >= 30 | M1 | Survey 1 |
| 2 | KDIGO eGFR Staging | Classify G1 (>=90) to G5 (<15) with CKD-EPI reference note | M1 | Survey 1 |
| 3 | Antimicrobial Continuous Range Matching | Eliminate silent full-dose fallback on boundary gaps (29.9, 49.9, <5) | M1 | Survey 1 |
| 4 | Renal Failure Ceilings & Dialysis Timing | Warnings for CrCl < 15 and nephrotoxic drugs; add IHD / CRRT guidance | M1 | Survey 1 |
| 5 | adjustr-io Obsidian UI & Contact Link | #040814 backdrop, frosted glassmorphic cards, luminous cyan borders, contact link | M1 | Survey 1 |
| 6 | Holliday-Segar Maintenance | Standard 100/50/20 rule (and 4/2/1 mL/hr) replacing crude linear 30 mL/kg | M2 | Survey 2 |
| 7 | 24h Ongoing Loss Breakdown | Urine output (mL/kg/hr with oliguria alert), GI/drain losses, insensible balance | M2 | Survey 2 |
| 8 | Adrogué-Madias Sodium Correction | Accurate TBW (gender & age adjusted), K_infusate inclusion, hourly IV rate | M2 | Survey 2 |
| 9 | Sodium Safety Cap (ODS Prevention) | Explicit safety ceiling warning when target rise > 8-10 mEq/L/24h | M2 | Survey 2 |
| 10 | Potassium Deficit & Replenishment | Safe repletion calculator, peripheral rate max 10-20 mEq/hr, conc max 40 mEq/L | M2 | Survey 2 |
| 11 | AKI BUN:Cr Ratio Correction | Distinction between Serum Urea and BUN (Urea = 2.14*BUN), Cr=0 guardrail | M2 | Survey 2 |
| 12 | adjustr-fluid Obsidian UI & Contact Link | Obsidian/cyan glassmorphic UI, self-contained CSS, contact link | M2 | Survey 2 |
| 13 | DAS28-CRP Zero-CRP Fix | Allow CRP=0 mg/L (ln(CRP+1)=0) without bypassing joint counts | M3 | Survey 3 |
| 14 | DAS28-ESR Singularity Guardrail | Prevent ESR <= 0 causing ln(0) = -Infinity; enforce ESR >= 1 mm/hr | M3 | Survey 3 |
| 15 | Joint Count & Input Guardrails | Prevent negative inputs, sqrt(negative) NaN, blank false remission | M3 | Survey 3 |
| 16 | CDAI & SDAI Calculators | Clinical and Simple Disease Activity Index calculations and cutoffs | M3 | Survey 3 |
| 17 | ACR/EULAR Boundary Fix | Exact remission boundary <= 2.60 (not < 2.60) | M3 | Survey 3 |
| 18 | rheumatools Obsidian UI & Contact Link | Obsidian/cyan glassmorphism, fix iframe double scrollbar, contact link | M3 | Survey 3 |
| 19 | index.html Contact Me Button | Activate prominent navbar .nav-cta and footer CTA button | M4 | Survey 3 |
| 20 | verify_calculations.js Test Suite | Node.js verification script covering CrCl ABW, Hyponatremia rate & cap, DAS28-CRP | M5 | R1/Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | adjustr-io logic & obsidian UI | Features 1, 2, 3, 4, 5 | None | PLANNED |
| M2 | adjustr-fluid logic & obsidian UI | Features 6, 7, 8, 9, 10, 11, 12 | None | PLANNED |
| M3 | rheumatools logic & obsidian UI | Features 13, 14, 15, 16, 17, 18 | None | PLANNED |
| M4 | index.html Contact Me integration | Feature 19 | None | PLANNED |
| M5 | Automated E2E verification test suite | Feature 20, verify_calculations.js execution | M1, M2, M3, M4 | PLANNED |

## Code Layout
- `adjustr-io.html`: Self-contained HTML/CSS/JS clinical renal dosing tool.
- `adjustr-fluid.html`: Self-contained HTML/CSS/JS fluid and electrolyte resuscitation tool.
- `rheumatools.html`: Self-contained HTML/CSS/JS rheumatology disease activity tool.
- `index.html`: Portfolio landing page.
- `verify_calculations.js`: Clinical test runner script at project root.

## Interface Contracts
### Medical Formats & Standards
1. **Cockcroft-Gault CrCl**:
   - $IBW_{male} = 50 + 2.3 \times (\text{height\_in} - 60)$ kg
   - $IBW_{female} = 45.5 + 2.3 \times (\text{height\_in} - 60)$ kg
   - If $TBW < IBW \implies \text{weight} = TBW$.
   - If $BMI \ge 30 \implies \text{weight} = ABW = IBW + 0.4 \times (TBW - IBW)$.
   - Else $\text{weight} = TBW$ (or $IBW$ for normal/overweight per clinical consensus).
   - $CrCl = \frac{(140 - \text{age}) \times \text{weight}}{72 \times SCr} \times (0.85 \text{ if female})$.

2. **Adrogué-Madias Sodium Correction**:
   - $TBW = \text{weight} \times c$ where $c \in \{0.6 \text{ (non-elderly M)}, 0.5 \text{ (non-elderly F / elderly M)}, 0.45 \text{ (elderly F)}\}$.
   - $\Delta Na / L = \frac{Na_{infusate} + K_{infusate} - Na_{serum}}{TBW + 1}$.
   - Hourly infusion rate $R = \frac{\text{target\_rise\_per\_hour}}{\Delta Na / L} \times 1000$ mL/hr.
   - 24h projected rise $= \text{hourly\_rate} \times 24 \times \frac{\Delta Na / L}{1000}$.
   - Safety ceiling: Target rise MUST NOT exceed 10 mEq/L/24h (warning if $>8$, hard alert if $>10$).

3. **DAS28-CRP**:
   - $DAS28\text{-}CRP = 0.56\sqrt{TJC28} + 0.28\sqrt{SJC28} + 0.36\ln(CRP + 1) + 0.014(PGA) + 0.96$.
   - Remission: $\le 2.6$; Low: $> 2.6$ and $\le 3.2$; Moderate: $> 3.2$ and $\le 5.1$; High: $> 5.1$.
