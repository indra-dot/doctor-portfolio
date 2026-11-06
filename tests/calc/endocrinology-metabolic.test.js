/**
 * tests/calc/endocrinology-metabolic.test.js
 * 
 * Clinical benchmarks for Endocrinology & Metabolic calculations:
 * - HbA1c to eAG (Nathan ADAG: eAG = 28.7 * HbA1c - 46.7)
 * - Effective Serum Osmolarity (Tonisitas = 2*Na + Glucose/18)
 * - HOMA-IR (Glucose * Insulin / 405)
 * - TyG Index (ln(Fast TG * Fast Glu / 2))
 * - Friedewald LDL (TC - HDL - TG/5)
 * - Atherogenic Index of Plasma (AIP = log10(TG / HDL))
 * - Insulin TDD (0.5 U/kg/d -> 50% Basal, 50% Bolus)
 * - Hypoglycemia correction (Rule of 30)
 */

const assert = require('assert');
const { runCalculation } = require('../harness');

async function runTests() {
  console.log('\n--- Testing Endocrinology & Metabolic ---');
  let passed = 0;
  let failed = 0;

  // 1. HbA1c to eAG (ADAG)
  // HbA1c = 8.0% -> eAG = 28.7 * 8.0 - 46.7 = 229.6 - 46.7 = 182.9 mg/dL
  try {
    const res = await runCalculation('hba1c-eag', { hba1c: 8.0 });
    assert(res.value.includes('183') || res.value.includes('182.9'), `Expected ~183 mg/dL, got ${res.value}`);
    passed++;
    console.log('  ✓ HbA1c 8.0% -> eAG 183 mg/dL (ADAG)');
  } catch (e) {
    failed++;
    console.error('  ❌ HbA1c to eAG test failed:', e.message);
  }

  // 2. Effective Serum Osmolarity (Tonisitas HHS vs DKA)
  // 2*Na + Glucose/18
  // Na 140, Glu 720 -> 280 + 40 = 320 mOsm/kg (>320 HHS)
  try {
    const res = await runCalculation('osmo', { na: 140, glu: 720 });
    assert(res.value.includes('320'), `Expected 320 mOsm/kg, got ${res.value}`);
    passed++;
    console.log('  ✓ Effective Serum Osmolarity (320 mOsm/kg HHS criterion)');
  } catch (e) {
    failed++;
    console.error('  ❌ Osmolarity test failed:', e.message);
  }

  // 3. HOMA-IR (Insulin * Glucose / 405)
  // Fasting Insulin 15 uU/mL, Fasting Glucose 108 mg/dL -> (15 * 108) / 405 = 1620 / 405 = 4.0
  try {
    const res = await runCalculation('homa-ir', { ins: 15, glu: 108 });
    assert(res.value.includes('4.0') || res.value.includes('4'), `Expected HOMA-IR 4.0, got ${res.value}`);
    passed++;
    console.log('  ✓ HOMA-IR insulin resistance index (4.0)');
  } catch (e) {
    failed++;
    console.error('  ❌ HOMA-IR test failed:', e.message);
  }

  // 4. Friedewald LDL Formula
  // LDL = TC - HDL - TG/5
  // TC 200, HDL 50, TG 150 -> LDL = 200 - 50 - 30 = 120 mg/dL
  try {
    const res = await runCalculation('friedewald', { tc: 200, hdl: 50, tg: 150 });
    assert(res.value.includes('120'), `Expected LDL 120 mg/dL, got ${res.value}`);
    passed++;
    console.log('  ✓ Friedewald LDL (120 mg/dL)');
  } catch (e) {
    failed++;
    console.error('  ❌ Friedewald test failed:', e.message);
  }

  // 5. Friedewald TG >= 400 guardrail
  // When TG >= 400 mg/dL, Friedewald formula is clinically invalid (chylomicronemia)
  try {
    const res = await runCalculation('friedewald', { tc: 250, hdl: 35, tg: 450 });
    assert(res.text.includes('tidak akurat') || res.text.includes('inval') || res.cls === 'bad' || res.cls === 'warn',
      `Expected invalid/inaccurate warning for TG >= 400, got text: ${res.text}`);
    passed++;
    console.log('  ✓ Friedewald TG >= 400 clinical guardrail');
  } catch (e) {
    failed++;
    console.error('  ❌ Friedewald TG guardrail test failed:', e.message);
  }

  // 6. Insulin TDD
  // Wt 60 kg, factor 0.5 U/kg -> TDD = 30 U (Basal 15 U, Bolus 15 U = 3x 5 U)
  try {
    const res = await runCalculation('insulin-tdd', { wt: 60, factor: 0.5 });
    assert(res.value.includes('30'), `Expected TDD 30 U, got ${res.value}`);
    passed++;
    console.log('  ✓ Insulin TDD (60 kg x 0.5 = 30 U, Basal 15 U, Bolus 3x5 U)');
  } catch (e) {
    failed++;
    console.error('  ❌ Insulin TDD test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
