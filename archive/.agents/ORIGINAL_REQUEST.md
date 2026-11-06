# Original User Request

## Initial Request — 2026-09-18T10:37:11Z

Audit and rigorously verify the medical calculation algorithms of three clinical tools (adjustr-io, adjustr-fluid, and rheumatools) to prevent misleading or hazardous outputs in acute hospital care, modernize their interfaces to match the dark obsidian/cyan aesthetic of the portfolio index, and add a Contact Me button linking to putrawan.2371041010@student.unud.ac.id.

Working directory: C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio
Integrity mode: development

## Requirements

### R1. Clinical Logic Verification & Safety Guardrails
Audit, cross-check, and update mathematical and algorithmic formulas in all 3 clinical applications against clinical reference guidelines (KDIGO/Cockcroft-Gault for nephrology, IDSA/Sanford for antimicrobial dosing, Adrogué-Madias for electrolytes, and IRA/EULAR/ACR for rheumatology scoring):
- adjustr-io: Verify CrCl calculation (Cockcroft-Gault with actual vs. ideal/adjusted body weight logic for obesity), eGFR staging, and antibiotic dosage adjustments (especially renal failure ceiling limits, loading doses, and hemodialysis/CRRT timing).
- adjustr-fluid: Verify Holliday-Segar fluid maintenance, 24-hour ongoing loss balancing, sodium correction rates (ensuring explicit safety caps at 8–10 mEq/L/24h to prevent Osmotic Demyelination Syndrome), potassium replenishment thresholds, and AKI BUN:Cr ratio interpretations.
- rheumatools: Verify DAS28 formula math (both ESR and CRP equations, square root and log transformations), CDAI/SDAI calculations, and ACR/EULAR scoring cutoffs. Prevent NaN or misleading output on edge-case inputs (e.g., negative or zero values, missing lab inputs).

### R2. Visual & Modern UI Redesign Matching Index Aesthetic
Restyle adjustr-io.html, adjustr-fluid.html, and rheumatools.html to share the same dark aesthetic as index.html:
- Deep obsidian backdrop (#040814), frosted glassmorphic card containers (rgba(15, 23, 42, 0.75) with backdrop-filter: blur), subtle luminous borders, and clinical cyan/blue accent glowing highlights (#00F2FE / #4FACFE).
- Clean typography using Inter / Plus Jakarta Sans, high-contrast readable metric badges, and smooth tab navigation.
- Ensure 100% self-contained single-file HTML compatibility with Google Sites embed iframes (inlined CSS, inlined base64 assets, no broken external dependencies).

### R3. Contact Me Integration
Add a prominent, modern "Contact Me" button on the main portfolio navbar and footer, as well as a subtle feedback/contact link in each of the 3 tools, configured with href="mailto:putrawan.2371041010@student.unud.ac.id".

## Verification Resources & Mechanisms

### Automated Testing
- Provide a Node.js verification script (verify_calculations.js) that runs benchmark patient scenarios through the core calculation functions:
  1. Standard adult male/female CrCl vs. obese patient requiring Adjusted Body Weight (ABW).
  2. Severe hyponatremia scenario calculating hourly infusion rate and verifying that safety cap warning fires if rate exceeds 10 mEq/24h.
  3. Sample RA patient (TJC=6, SJC=4, CRP=15, PGA=40) verifying exact DAS28-CRP score match against reference formula.

## Acceptance Criteria

### Clinical Integrity & Guardrails
- [ ] No NaN, undefined, or silent math failures on extreme, boundary, or blank numerical inputs.
- [ ] Safety warnings are prominently rendered when entering hazardous clinical ranges (e.g. sodium correction > 10 mEq/L/24h, high-dose nephrotoxic drugs in CrCl < 15).
- [ ] Verification script passes all clinical test scenarios with zero errors.

### Visual Polish & Integration
- [ ] adjustr-io.html, adjustr-fluid.html, and rheumatools.html present a consistent dark obsidian UI matching index.html.
- [ ] All three applications remain 100% self-contained single files that embed flawlessly inside Google Sites without mojibake or broken styling.
- [ ] "Contact Me" button is active on index.html and available within each tool pointing to mailto:putrawan.2371041010@student.unud.ac.id.
