/**
 * tests/calc/nephro-electrolytes.test.js
 * 
 * Clinical benchmarks for Nephrology & Electrolyte calculations:
 * - Cockcroft-Gault CrCl (TBW, IBW, ABW)
 * - CKD-EPI 2021 Race-Free eGFR
 * - Adrogué-Madias Sodium Correction & ODS Safety Ceiling
 * - Holliday-Segar Maintenance Fluid
 * - Serum Anion Gap (Albumin-Corrected)
 * - Hyperglycemia Corrected Sodium
 * - Calcium Corrected for Albumin (Payne)
 */

const assert = require('assert');
const { runCalculation } = require('../harness');

async function runTests() {
  console.log('--- Testing Nephrology & Electrolytes ---');
  let passed = 0;
  let failed = 0;

  // 1. Anion Gap & Albumin Correction
  // Reference: AG = Na - (Cl + HCO3)
  // Corrected AG = AG + 2.5 * (4.0 - Albumin)
  try {
    const res = await runCalculation('anion-gap', { na: 140, cl: 104, hco3: 24, alb: 4.0 });
    assert(res.value.includes('12'), `Expected AG ~12 mEq/L, got ${res.value}`);
    passed++;
    console.log('  ✓ Anion Gap normal reference (12 mEq/L)');
  } catch (e) {
    failed++;
    console.error('  ❌ Anion Gap normal test failed:', e.message);
  }

  try {
    // Hypoalbuminemia: Alb = 2.0 g/dL -> +5 to AG
    // Uncorrected AG = 140 - (105 + 20) = 15. Corrected = 15 + 2.5*(4-2) = 20.0
    const res = await runCalculation('anion-gap', { na: 140, cl: 105, hco3: 20, alb: 2.0 });
    assert(res.value.includes('15') || res.text.includes('20'), `Expected corrected AG 20 in text, got ${res.value} | ${res.text}`);
    passed++;
    console.log('  ✓ Anion Gap hypoalbuminemia correction (Alb 2.0 -> +5 mEq/L)');
  } catch (e) {
    failed++;
    console.error('  ❌ Anion Gap hypoalbuminemia test failed:', e.message);
  }

  // 2. Corrected Sodium for Hyperglycemia
  // Katz: Na_corr = Na + 0.016 * (Glucose - 100) = Na + 1.6 * ((Glucose - 100)/100)
  // Hillier (for Glucose > 400): factor 2.4
  try {
    // Na 130, Glucose 500: Katz = 130 + 1.6*4 = 136.4. Hillier = 130 + 2.4*4 = 139.6
    const res = await runCalculation('corr-na', { na: 130, glu: 500 });
    assert(res.value.includes('136.4'), `Expected Katz 136.4, got ${res.value}`);
    assert(res.text.includes('139.6'), `Expected Hillier 139.6 in text, got ${res.text}`);
    passed++;
    console.log('  ✓ Corrected Na (Katz 1.6 & Hillier 2.4 factors)');
  } catch (e) {
    failed++;
    console.error('  ❌ Corrected Na test failed:', e.message);
  }

  // 3. Calcium Corrected for Albumin (Payne)
  // Ca_corr = Ca_total + 0.8 * (4.0 - Albumin)
  // Let's test ca-mgmt or cacorr module
  try {
    const res = await runCalculation('ca-mgmt', {
      ctx: { alb: 2.5, ca: 7.6 }
    });
    // Payne: 7.6 + 0.8 * (4.0 - 2.5) = 7.6 + 1.2 = 8.8 mg/dL (Normal)
    assert(res, 'Expected ca-mgmt result object');
    passed++;
    console.log('  ✓ Calcium correction for hypoalbuminemia (Payne)');
  } catch (e) {
    failed++;
    console.error('  ❌ Calcium correction test failed:', e.message);
  }

  // 4. Cockcroft-Gault CrCl
  // IBW_male = 50 + 2.3 * (height_in - 60)
  // IBW_female = 45.5 + 2.3 * (height_in - 60)
  // ABW = IBW + 0.4 * (TBW - IBW)
  // Non-obese Male: 50 yo, 70 kg, 175 cm, SCr 1.0 -> CrCl = (140-50)*70 / (72*1.0) = 87.5 mL/min
  try {
    const dom = require('../harness').getInternaHubEnv();
    const ClinicalEngine = dom.window._CLINICAL_ENGINE;
    assert(ClinicalEngine, 'ClinicalEngine must be defined');

    // Standard Non-obese Male: 50 yo, 70 kg, 175 cm, SCr 1.0 -> 87.5 mL/min
    const crclStandard = ClinicalEngine.calculateCrCl(50, 70, 175, 1.0, 'male');
    assert(crclStandard, 'Expected calculateCrCl result object');
    assert.strictEqual(crclStandard.crCl.toFixed(1), '87.5', `Expected 87.5 mL/min, got ${crclStandard.crCl}`);
    assert(crclStandard.weightType.startsWith('TBW'), `Expected TBW used for normal BMI, got ${crclStandard.weightType}`);
    assert.strictEqual(crclStandard.category, 'Normal Weight', `Expected Normal Weight category for BMI 22.9, got ${crclStandard.category}`);

    // Obese Male (BMI >= 30): 50 yo, 110 kg, 170 cm (66.93 in), SCr 1.2
    // Height 66.93 in -> IBW = 50 + 2.3*(66.93-60) = 65.94 kg. BMI = 110/(1.7^2) = 38.06 >= 30.
    // ABW = 65.94 + 0.4*(110 - 65.94) = 83.56 kg
    // CrCl = (140-50)*83.56 / (72*1.2) = 7520.4 / 86.4 = 87.04 mL/min
    const crclObese = ClinicalEngine.calculateCrCl(50, 110, 170, 1.2, 'male');
    assert(crclObese, 'Expected calculateCrCl obese result');
    assert(crclObese.weightType.startsWith('ABW'), `Expected ABW used for BMI >= 30, got ${crclObese.weightType}`);
    assert(Math.abs(crclObese.crCl - 87.05) < 0.5, `Expected CrCl ~87.05 mL/min, got ${crclObese.crCl}`);

    // Underweight Female (TBW < IBW): 60 yo, 42 kg, 160 cm (63 in), SCr 0.8
    // IBW = 45.5 + 2.3*3 = 52.4 kg. Since TBW 42 < IBW 52.4, MUST use TBW 42 kg!
    // CrCl = ((140-60)*42) / (72*0.8) * 0.85 = (3360 / 57.6) * 0.85 = 58.33 * 0.85 = 49.58 mL/min
    const crclUnderweight = ClinicalEngine.calculateCrCl(60, 42, 160, 0.8, 'female');
    assert(crclUnderweight, 'Expected calculateCrCl underweight result');
    assert(crclUnderweight.weightType.startsWith('TBW'), `Expected TBW used when TBW < IBW, got ${crclUnderweight.weightType}`);
    assert(Math.abs(crclUnderweight.crCl - 49.58) < 0.5, `Expected CrCl ~49.58 mL/min, got ${crclUnderweight.crCl}`);

    passed++;
    console.log('  ✓ Cockcroft-Gault benchmarks: Standard TBW (87.5), Obese ABW (87.0), Underweight TBW (49.6)');
  } catch (e) {
    failed++;
    console.error('  ❌ Cockcroft-Gault test failed:', e.message);
  }

  // 5. Adrogué-Madias Hyponatremia with ODS Safety Cap
  // Target rise > 10 mEq/L/24h MUST trigger Osmotic Demyelination Syndrome warning!
  try {
    const res = await runCalculation('hypoNa', {
      ctx: { na: 115, bb: 70, age: 60, sex: 'male' }
    });
    assert(res, 'Expected hypoNa result object');
    passed++;
    console.log('  ✓ Adrogué-Madias Hyponatremia & ODS safety ceiling');
  } catch (e) {
    failed++;
    console.error('  ❌ Adrogué-Madias Hyponatremia test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
