/**
 * tests/calc/rheumatology.test.js
 * 
 * Clinical benchmarks for Rheumatology Scoring:
 * - DAS28-CRP (Formula: 0.56*sqrt(TJC) + 0.28*sqrt(SJC) + 0.36*ln(CRP+1) + 0.014*PGA + 0.96)
 * - DAS28-ESR (Formula: 0.56*sqrt(TJC) + 0.28*sqrt(SJC) + 0.70*ln(ESR) + 0.014*PGA)
 * - CDAI (TJC + SJC + PGA + EGA)
 * - SDAI (CDAI + CRP mg/dL)
 * - Edge case & Guardrails: Zero CRP (ln(0+1)=0), ESR < 1 error, Remission boundary <= 2.60
 */

const assert = require('assert');
const { getInternaHubEnv } = require('../harness');

async function runTests() {
  console.log('\n--- Testing Rheumatology Calculations ---');
  let passed = 0;
  let failed = 0;

  const dom = getInternaHubEnv();
  const RheumaCalc = dom.window._RHEUMA_CALC;

  assert(RheumaCalc, 'RheumaCalc must be defined and loaded');

  // 1. DAS28-CRP Benchmark Scenario:
  // TJC = 6, SJC = 4, CRP = 15 mg/L, PGA = 40 mm
  // Math:
  // 0.56 * sqrt(6) = 1.3717
  // 0.28 * sqrt(4) = 0.5600
  // 0.36 * ln(15 + 1) = 0.36 * ln(16) = 0.36 * 2.7725887 = 0.9981
  // 0.014 * 40 = 0.5600
  // Constant = 0.96
  // Total = 1.3717 + 0.5600 + 0.9981 + 0.5600 + 0.96 = 4.4498... -> 4.45 (Moderate Activity)
  try {
    const res = RheumaCalc.calculateDAS28_CRP(6, 4, 15, 40);
    assert.strictEqual(res.score, '4.45', `Expected 4.45, got ${res.score}`);
    assert.strictEqual(res.activity.level, 'Moderate', `Expected Moderate Activity, got ${res.activity.level}`);
    passed++;
    console.log('  ✓ DAS28-CRP standard benchmark: 4.45 (Moderate)');
  } catch (e) {
    failed++;
    console.error('  ❌ DAS28-CRP benchmark test failed:', e.message);
  }

  // 2. DAS28-CRP Zero CRP edge case
  // CRP = 0 mg/L -> ln(0 + 1) = ln(1) = 0. Must NOT produce NaN or Infinity!
  // TJC = 0, SJC = 0, CRP = 0, PGA = 0 -> 0.96 (Remission)
  try {
    const res = RheumaCalc.calculateDAS28_CRP(0, 0, 0, 0);
    assert.strictEqual(res.score, '0.96', `Expected 0.96, got ${res.score}`);
    assert.strictEqual(res.activity.level, 'Remission', `Expected Remission, got ${res.activity.level}`);
    passed++;
    console.log('  ✓ DAS28-CRP zero CRP edge case: ln(0+1)=0 -> 0.96 (Remission)');
  } catch (e) {
    failed++;
    console.error('  ❌ DAS28-CRP zero CRP test failed:', e.message);
  }

  // 3. DAS28-ESR Benchmark Scenario:
  // TJC = 8, SJC = 6, ESR = 45 mm/hr, PGA = 50 mm
  // Math:
  // 0.56 * sqrt(8) = 0.56 * 2.8284 = 1.5839
  // 0.28 * sqrt(6) = 0.28 * 2.4495 = 0.6859
  // 0.70 * ln(45) = 0.70 * 3.80666 = 2.6647
  // 0.014 * 50 = 0.7000
  // Total = 1.5839 + 0.6859 + 2.6647 + 0.7000 = 5.6345... -> 5.63 (High Activity)
  try {
    const res = RheumaCalc.calculateDAS28_ESR(8, 6, 45, 50);
    assert.strictEqual(res.score, '5.63', `Expected 5.63, got ${res.score}`);
    assert.strictEqual(res.activity.level, 'High', `Expected High Activity, got ${res.activity.level}`);
    passed++;
    console.log('  ✓ DAS28-ESR standard benchmark: 5.63 (High Activity)');
  } catch (e) {
    failed++;
    console.error('  ❌ DAS28-ESR benchmark test failed:', e.message);
  }

  // 4. DAS28-ESR Singularity Guardrail (ESR < 1)
  // Prevent ln(0) = -Infinity
  try {
    assert.throws(() => {
      RheumaCalc.calculateDAS28_ESR(2, 2, 0, 20);
    }, /LED \/ ESR Westergren harus >= 1 mm\/jam/);
    passed++;
    console.log('  ✓ DAS28-ESR singularity guardrail (ESR < 1 mm/hr properly rejected)');
  } catch (e) {
    failed++;
    console.error('  ❌ DAS28-ESR singularity guardrail test failed:', e.message);
  }

  // 5. CDAI Benchmark:
  // TJC = 4, SJC = 2, PGA = 3.5, EGA = 2.5 -> CDAI = 4 + 2 + 3.5 + 2.5 = 12.0 (Moderate: >10 and <=22)
  try {
    const res = RheumaCalc.calculateCDAI(4, 2, 3.5, 2.5);
    assert.strictEqual(res.score, '12.00', `Expected 12.00, got ${res.score}`);
    assert.strictEqual(res.activity.level, 'Moderate', `Expected Moderate Activity, got ${res.activity.level}`);
    passed++;
    console.log('  ✓ CDAI benchmark: 12.00 (Moderate Activity)');
  } catch (e) {
    failed++;
    console.error('  ❌ CDAI benchmark test failed:', e.message);
  }

  // 6. SDAI Benchmark:
  // CDAI = 12.0, CRP = 1.2 mg/dL -> SDAI = 12.0 + 1.2 = 13.20 (Moderate: >11 and <=26)
  try {
    const res = RheumaCalc.calculateSDAI(4, 2, 3.5, 2.5, 1.2);
    assert.strictEqual(res.score, '13.20', `Expected 13.20, got ${res.score}`);
    assert.strictEqual(res.activity.level, 'Moderate', `Expected Moderate Activity, got ${res.activity.level}`);
    passed++;
    console.log('  ✓ SDAI benchmark: 13.20 (Moderate Activity)');
  } catch (e) {
    failed++;
    console.error('  ❌ SDAI benchmark test failed:', e.message);
  }

  // 7. ACR/EULAR Remission Boundary:
  // Exactly 2.60 must classify as Remission (not Low Activity)
  try {
    const cls = RheumaCalc.classifyDAS28(2.60);
    assert.strictEqual(cls.level, 'Remission', `Expected score 2.60 to be Remission, got ${cls.level}`);
    passed++;
    console.log('  ✓ ACR/EULAR exact remission cutoff boundary (score <= 2.60 is Remission)');
  } catch (e) {
    failed++;
    console.error('  ❌ ACR/EULAR remission boundary test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
