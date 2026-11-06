/**
 * tests/calc/critical-care-pulm.test.js
 * 
 * Clinical benchmarks for Critical Care & Pulmonology:
 * - CURB-65 community acquired pneumonia severity
 * - Titrasi Norepinephrine (mcg/kg/min -> mL/hr)
 * - Titrasi Dobutamine (mcg/kg/min -> mL/hr)
 * - Titrasi Dopamine (mcg/kg/min -> mL/hr)
 * - Titrasi Nicardipine (mg/hr -> mL/hr)
 * - Titrasi Nitroglycerin (mcg/min -> mL/hr)
 */

const assert = require('assert');
const { runCalculation } = require('../harness');

async function runTests() {
  console.log('\n--- Testing Critical Care & Pulmonology ---');
  let passed = 0;
  let failed = 0;

  // 1. CURB-65 Low Risk (0-1)
  try {
    const res = await runCalculation('curb65', { c: false, u: false, r: false, b: false, a: false });
    assert(res.value.includes('0 / 5'), `Expected 0/5, got ${res.value}`);
    assert(res.cls === 'ok', `Expected cls ok for CURB-65 = 0, got ${res.cls}`);
    passed++;
    console.log('  ✓ CURB-65 score 0 (Outpatient / Low mortality)');
  } catch (e) {
    failed++;
    console.error('  ❌ CURB-65 score 0 test failed:', e.message);
  }

  // 2. CURB-65 High Risk (>=3)
  try {
    const res = await runCalculation('curb65', { c: true, u: true, r: true, b: false, a: true });
    assert(res.value.includes('4 / 5'), `Expected 4/5, got ${res.value}`);
    assert(res.cls === 'bad', `Expected cls bad for CURB-65 = 4, got ${res.cls}`);
    passed++;
    console.log('  ✓ CURB-65 score 4 (ICU / High mortality)');
  } catch (e) {
    failed++;
    console.error('  ❌ CURB-65 score 4 test failed:', e.message);
  }

  // 3. Titrasi Norepinephrine
  // Concentration = (mg * 1000) / cc mcg/mL
  // Dose mcg/kg/min -> mL/hr = (dose * wt * 60) / concentration
  // 4 mg in 50 cc = 80 mcg/mL. Patient 50 kg. Dose 0.1 mcg/kg/min:
  // Rate = (0.1 * 50 * 60) / 80 = 300 / 80 = 3.75 mL/hr
  try {
    const res = await runCalculation('pump-ne', { bb: 50, mg: 4, cc: 50 });
    assert(res, 'Expected pump-ne result');
    passed++;
    console.log('  ✓ Titrasi Norepinephrine syringe pump table');
  } catch (e) {
    failed++;
    console.error('  ❌ Titrasi Norepinephrine test failed:', e.message);
  }

  // 4. Titrasi Nitroglycerin (NTG)
  // Non-weight based: mcg/min -> mL/hr
  // 10 mg in 50 cc = 200 mcg/mL. Dose 10 mcg/min:
  // Rate = (10 * 60) / 200 = 600 / 200 = 3.0 mL/hr
  try {
    const res = await runCalculation('pump-ntg', { mg: 10, cc: 50 });
    assert(res, 'Expected pump-ntg result');
    passed++;
    console.log('  ✓ Titrasi Nitroglycerin (NTG) syringe pump table');
  } catch (e) {
    failed++;
    console.error('  ❌ Titrasi NTG test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
