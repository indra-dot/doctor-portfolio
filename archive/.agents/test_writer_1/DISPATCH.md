## 2026-09-18T10:51:25Z
You are Test Writer for the Doctor Portfolio project.
Your working directory is: C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\.agents\test_writer_1
Project root directory is: C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio
Original request file: C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\.agents\ORIGINAL_REQUEST.md
Test Infra file: C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\.agents\orchestrator_1\TEST_INFRA.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership: You exclusively own C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\verify_calculations.js.

Task:
1. Read ORIGINAL_REQUEST.md, PROJECT.md, and TEST_INFRA.md.
2. Create verify_calculations.js at project root as a Node.js test runner script.
3. The script must test the required clinical scenarios:
   - Scenario 1: Standard adult male/female CrCl vs obese patient requiring Adjusted Body Weight (ABW) (Cockcroft-Gault with IBW, ABW when BMI >= 30, TBW when TBW < IBW).
   - Scenario 2: Severe hyponatremia scenario calculating hourly infusion rate (using 3% saline, TBW age/sex adjusted) and verifying that safety cap warning fires if target 24h rise exceeds 10 mEq/24h (warning if > 8).
   - Scenario 3: Sample RA patient (TJC=6, SJC=4, CRP=15, PGA=40) verifying exact DAS28-CRP score match against reference formula: 4.45 (Moderate). Also test CRP=0 edge case.
   - Scenario 4: Additional edge cases: Holliday-Segar fluid volumes, potassium infusion rate ceilings (max 20 mEq/hr), negative/blank input validation error handling.
4. Execute `node verify_calculations.js` via run_command to verify that all benchmark tests pass.
5. Write your findings to C:\Users\Wib PC\.gemini\antigravity\scratch\doctor-portfolio\.agents\test_writer_1\analysis.md and handoff report to handoff.md.
6. Update progress.md and send a completion message to your parent.
