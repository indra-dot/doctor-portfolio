# Master Execution Plan: Clinical Tools Audit, Modernization & Verification

## Objective
Rigorously verify clinical calculations, apply safety guardrails, restyle to dark obsidian/cyan aesthetic (#040814, frosted glassmorphism, cyan/blue highlights), integrate Contact Me buttons, and build + verify verify_calculations.js across:
1. `adjustr-io.html`
2. `adjustr-fluid.html`
3. `rheumatools.html`
4. `index.html`

## Phases

### Phase 0: Survey & Codebase Exploration
- Spawn 3 parallel Explorers:
  - Explorer 1: Deep dive on `adjustr-io.html` (Cockcroft-Gault, ABW for BMI>=30, eGFR staging, antibiotic dosing rules, existing DOM/styles).
  - Explorer 2: Deep dive on `adjustr-fluid.html` (Holliday-Segar, ongoing losses, Adrogué-Madias sodium correction rates & safety caps, K+ thresholds, BUN:Cr, existing DOM/styles).
  - Explorer 3: Deep dive on `rheumatools.html` & `index.html` (DAS28-ESR/CRP math, CDAI/SDAI, edge case guardrails, index.html obsidian theme styles/tokens, contact button integration points).

### Phase 1: Architecture, PROJECT.md, and E2E Test Infra
- Synthesize survey findings.
- Write `PROJECT.md` and `TEST_INFRA.md`.
- Formulate verification test cases for `verify_calculations.js`.

### Phase 2: Implementation & Iteration Loops
- **Milestone 1**: `adjustr-io.html` logic verification + obsidian UI restyle + contact link.
- **Milestone 2**: `adjustr-fluid.html` logic verification + obsidian UI restyle + contact link.
- **Milestone 3**: `rheumatools.html` logic verification + obsidian UI restyle + contact link.
- **Milestone 4**: `index.html` Contact Me button integration (navbar & footer).
- **Milestone 5**: E2E Verification Track (`verify_calculations.js`) covering all benchmark clinical scenarios, executed via Node.js.

### Phase 3: Gate & Verification
- For each milestone: Explorer -> Worker -> Reviewer(s) -> Challenger(s) -> Forensic Auditor -> Gate Check.
- Run `verify_calculations.js` and verify zero errors.

### Phase 4: Final Reporting
- Synthesize all findings.
- Generate final completion report to Sentinel via `send_message`.
