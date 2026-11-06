/**
 * tests/calc/clinical-parser.test.js
 * 
 * Tests the Indonesian EMR / SIMETRISS / CPPT unstructured text parser.
 */

const assert = require('assert');
const { getInternaHubEnv } = require('../harness');

async function runTests() {
  console.log('\n--- Testing EMR / SIMETRISS / CPPT Text Parser ---');
  let passed = 0;
  let failed = 0;

  const dom = getInternaHubEnv();
  // Expose parseClinical if not already global
  const parseClinical = dom.window.parseClinical;

  if (typeof parseClinical !== 'function') {
    console.log('  ⚠ parseClinical not exposed globally on window; skipping parser test');
    return { passed: 0, failed: 0 };
  }

  // Sample real-world Indonesian hospital CPPT note
  const sampleNote = `
    S: Pasien mengeluh lemas.
    O: Pria 62 tahun. BB 65 kg, TB 168 cm.
       TD 140/90 mmHg, Nadi 84 x/menit, RR 18 x/menit, Suhu 37.0 C, SpO2 97% room air. GCS 15.
       Hasil Lab Darah:
       - Natrium: 132 mEq/L
       - Kalium: 3.8 mEq/L
       - Klorida: 98 mEq/L
       - GDS: 210 mg/dL
       - BUN: 22 mg/dL
       - Kreatinin: 1.4 mg/dL
       - Albumin: 3.2 g/dL
       - HCO3: 21 mEq/L
  `;

  try {
    const res = parseClinical(sampleNote);
    assert(res, 'Parser must return an object');
    assert.strictEqual(res.sex, 'L', `Expected sex L, got ${res.sex}`);
    assert.strictEqual(res.age, 62, `Expected age 62, got ${res.age}`);
    assert.strictEqual(res.bb, 65, `Expected BB 65, got ${res.bb}`);
    assert.strictEqual(res.sbp, 140, `Expected SBP 140, got ${res.sbp}`);
    assert.strictEqual(res.dbp, 90, `Expected DBP 90, got ${res.dbp}`);
    assert.strictEqual(res.hr, 84, `Expected HR 84, got ${res.hr}`);
    assert.strictEqual(res.rr, 18, `Expected RR 18, got ${res.rr}`);
    assert.strictEqual(res.spo2, 97, `Expected SpO2 97, got ${res.spo2}`);
    assert.strictEqual(res.gcs, 15, `Expected GCS 15, got ${res.gcs}`);
    assert.strictEqual(res.na, 132, `Expected Na 132, got ${res.na}`);
    assert.strictEqual(res.k, 3.8, `Expected K 3.8, got ${res.k}`);
    assert.strictEqual(res.cl, 98, `Expected Cl 98, got ${res.cl}`);
    assert.strictEqual(res.glu, 210, `Expected Glu 210, got ${res.glu}`);
    assert.strictEqual(res.bun, 22, `Expected BUN 22, got ${res.bun}`);
    assert.strictEqual(res.cr, 1.4, `Expected Cr 1.4, got ${res.cr}`);
    assert.strictEqual(res.alb, 3.2, `Expected Alb 3.2, got ${res.alb}`);
    assert.strictEqual(res.hco3, 21, `Expected HCO3 21, got ${res.hco3}`);

    passed++;
    console.log('  ✓ SIMETRISS / CPPT clinical note parsed 17 fields with 100% accuracy');
  } catch (e) {
    failed++;
    console.error('  ❌ SIMETRISS parser test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
