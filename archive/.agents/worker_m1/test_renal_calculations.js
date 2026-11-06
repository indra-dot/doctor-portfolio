const assert = require('assert');

function calculateIBW(heightCm, gender) {
  if (!heightCm || heightCm <= 0) return 0;
  const heightInches = heightCm / 2.54;
  const base = (gender === 'female' || gender === 'wanita') ? 45.5 : 50.0;
  if (heightInches <= 60) return base;
  return base + 2.3 * (heightInches - 60);
}

function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function selectWeight(tbw, heightCm, gender) {
  const ibw = calculateIBW(heightCm, gender);
  const bmi = calculateBMI(tbw, heightCm);
  const abw = (tbw > ibw) ? (ibw + 0.4 * (tbw - ibw)) : null;

  if (tbw < ibw) {
    return { usedWeight: tbw, weightType: 'TBW (Underweight)', ibw, bmi, abw };
  } else if (bmi >= 30.0) {
    return { usedWeight: abw, weightType: 'ABW (Obese, BMI ≥ 30)', ibw, bmi, abw };
  } else {
    return { usedWeight: tbw, weightType: 'TBW (Normal/Overweight)', ibw, bmi, abw };
  }
}

function calculateCrCl(age, tbw, heightCm, scr, gender) {
  if (age < 18 || scr <= 0 || tbw <= 0 || heightCm <= 0) return null;
  const weightInfo = selectWeight(tbw, heightCm, gender);
  const factor = (gender === 'female' || gender === 'wanita') ? 0.85 : 1.0;
  const crcl = ((140 - age) * weightInfo.usedWeight) / (72 * scr) * factor;
  const bsa = Math.sqrt((heightCm * tbw) / 3600);
  const normalizedCrCl = (crcl * 1.73) / bsa;

  return {
    crCl: Math.round(crcl * 100) / 100,
    normalizedCrCl: Math.round(normalizedCrCl * 100) / 100,
    usedWeight: Math.round(weightInfo.usedWeight * 100) / 100,
    weightType: weightInfo.weightType,
    ibw: Math.round(weightInfo.ibw * 100) / 100,
    bmi: Math.round(weightInfo.bmi * 100) / 100,
    abw: weightInfo.abw ? Math.round(weightInfo.abw * 100) / 100 : null,
    bsa: Math.round(bsa * 100) / 100
  };
}

function calculateCKDEPI(age, scr, gender) {
  if (age < 18 || scr <= 0) return null;
  const isFemale = (gender === 'female' || gender === 'wanita');
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const genderMult = isFemale ? 1.012 : 1.0;
  const scrRatio = scr / kappa;
  const minPart = Math.pow(Math.min(scrRatio, 1), alpha);
  const maxPart = Math.pow(Math.max(scrRatio, 1), -1.200);
  const agePart = Math.pow(0.9938, age);
  const egfr = 142 * minPart * maxPart * agePart * genderMult;
  return Math.round(egfr * 10) / 10;
}

function classifyKDIGO(gfr) {
  if (gfr >= 90) return { stage: 'G1', label: 'Normal or High', severity: 'normal', color: '#10B981' };
  if (gfr >= 60) return { stage: 'G2', label: 'Mildly Decreased', severity: 'mild', color: '#34D399' };
  if (gfr >= 45) return { stage: 'G3a', label: 'Mild to Moderately Decreased', severity: 'moderate', color: '#FBBF24' };
  if (gfr >= 30) return { stage: 'G3b', label: 'Moderately to Severely Decreased', severity: 'warning', color: '#F59E0B' };
  if (gfr >= 15) return { stage: 'G4', label: 'Severely Decreased', severity: 'danger', color: '#F97316' };
  return { stage: 'G5', label: 'Kidney Failure (End Stage)', severity: 'critical', color: '#EF4444' };
}

// Test 1: Non-obese Male: 50yo, 70kg, 175cm, SCr 1.0
const t1 = calculateCrCl(50, 70, 175, 1.0, 'male');
assert.ok(Math.abs(t1.crCl - 87.5) < 0.1);
assert.strictEqual(t1.usedWeight, 70);
assert.ok(classifyKDIGO(t1.crCl).stage === 'G2');
console.log('✓ Test 1 Passed:', t1);

// Test 2: Obese Male: 50yo, 110kg, 170cm, SCr 1.2
const t2 = calculateCrCl(50, 110, 170, 1.2, 'male');
assert.ok(Math.abs(t2.crCl - 87.05) < 0.1);
assert.ok(Math.abs(t2.usedWeight - 83.56) < 0.1);
assert.ok(t2.weightType.includes('ABW'));
console.log('✓ Test 2 Passed:', t2);

// Test 3: Underweight Female: 60yo, 42kg, 160cm, SCr 0.8
const t3 = calculateCrCl(60, 42, 160, 0.8, 'female');
assert.ok(Math.abs(t3.crCl - 49.58) < 0.1);
assert.strictEqual(t3.usedWeight, 42);
assert.ok(classifyKDIGO(t3.crCl).stage === 'G3a');
console.log('✓ Test 3 Passed:', t3);

// Test 4: Standard Adult Female: 50yo, 60kg, 165cm, SCr 1.0
const t4 = calculateCrCl(50, 60, 165, 1.0, 'female');
assert.ok(Math.abs(t4.crCl - 63.75) < 0.1);
console.log('✓ Test 4 Passed:', t4);

// Test 5: Severe Renal Failure (CrCl < 15) -> G5
const t5 = calculateCrCl(75, 55, 160, 3.8, 'male');
assert.ok(t5.crCl < 15);
assert.strictEqual(classifyKDIGO(t5.crCl).stage, 'G5');
console.log('✓ Test 5 Passed:', t5);

// Test 6: CKD-EPI calculations
const epi1 = calculateCKDEPI(50, 1.0, 'male');
console.log('CKD-EPI Male 50yo SCr 1.0:', epi1);
assert.ok(epi1 > 80 && epi1 < 100);

console.log('All renal calculation unit tests PASSED!');
