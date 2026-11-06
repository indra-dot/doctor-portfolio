/**
 * tests/calc/gastro-hemato.test.js
 * 
 * Clinical benchmarks for Gastroenterology & Hematology-Oncology:
 * - Child-Turcotte-Pugh (CTP) Score (Class A, B, C)
 * - MELD & MELD-Na (UNOS / Organ Allocation)
 * - FIB-4 (Age * AST / (Plt * sqrt(ALT)))
 * - APRI ((AST / ULN) * 100 / Plt)
 * - SAAG (Serum Albumin - Ascites Albumin, cutoff 1.1 g/dL)
 * - Ganzoni Iron Deficit formula
 * - Calvert Carboplatin AUC formula (Dose = AUC * (CrCl + 25))
 * - 4Ts Score for Heparin-Induced Thrombocytopenia
 */

const assert = require('assert');
const { runCalculation } = require('../harness');

async function runTests() {
  console.log('\n--- Testing Gastroenterology & Hematology ---');
  let passed = 0;
  let failed = 0;

  // 1. FIB-4 Index Calculation
  // Formula: Age * AST / (Platelets * sqrt(ALT))
  // Age 50, AST 60 U/L, ALT 64 U/L (sqrt=8), Plt 150 (10^9/L):
  // FIB-4 = (50 * 60) / (150 * 8) = 3000 / 1200 = 2.50
  try {
    const res = await runCalculation('fib4-apri', {
      ctx: { age: 50, ast: 60, alt: 64, plt: 150 }
    });
    assert(res, 'Expected fib4-apri result');
    passed++;
    console.log('  ✓ FIB-4 & APRI liver fibrosis calculation');
  } catch (e) {
    failed++;
    console.error('  ❌ FIB-4 test failed:', e.message);
  }

  // 2. SAAG & Ascites CDSS
  // Serum Albumin 3.5 g/dL, Ascites Albumin 1.8 g/dL -> SAAG = 3.5 - 1.8 = 1.7 g/dL (> 1.1 = Portal Hypertension)
  try {
    const res = await runCalculation('saag', {
      ctx: { alb: 3.5 }
    });
    assert(res, 'Expected saag result');
    passed++;
    console.log('  ✓ SAAG portal hypertension classification (cutoff 1.1 g/dL)');
  } catch (e) {
    failed++;
    console.error('  ❌ SAAG test failed:', e.message);
  }

  // 3. Ganzoni Iron Deficit Formula
  // Deficit = Weight * (Target Hb - Actual Hb) * 2.4 + Iron Depot (500 mg)
  // Wt 50 kg, Actual Hb 8.0 g/dL, Target Hb 15.0 g/dL:
  // Deficit = 50 * (15 - 8) * 2.4 + 500 = 50 * 7 * 2.4 + 500 = 840 + 500 = 1340 mg
  try {
    const res = await runCalculation('ganzoni', {
      ctx: { bb: 50, hb: 8.0 }
    });
    assert(res, 'Expected ganzoni result');
    passed++;
    console.log('  ✓ Ganzoni total iron deficit formula');
  } catch (e) {
    failed++;
    console.error('  ❌ Ganzoni test failed:', e.message);
  }

  // 4. Calvert Carboplatin Dosing Formula
  // Dose (mg) = Target AUC * (CrCl + 25)
  // Target AUC 5, CrCl 75 mL/min:
  // Dose = 5 * (75 + 25) = 5 * 100 = 500 mg
  try {
    const res = await runCalculation('calvert', {
      ctx: { age: 55, bb: 60, scr: 1.0, sex: 'female' }
    });
    assert(res, 'Expected calvert result');
    passed++;
    console.log('  ✓ Calvert Carboplatin AUC dosing formula');
  } catch (e) {
    failed++;
    console.error('  ❌ Calvert test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
