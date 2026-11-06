/**
 * verify_calculations.js
 * 
 * Comprehensive End-to-End Clinical Calculation & Safety Verification Suite
 * For Doctor Portfolio Clinical Applications:
 *   1. adjustr-io: Renal dosing, Cockcroft-Gault CrCl, Ideal & Adjusted Body Weight, KDIGO staging
 *   2. adjustr-fluid: Holliday-Segar fluid maintenance, Adrogué-Madias sodium correction,
 *                     ODS safety ceilings, Potassium infusion rate limits, AKI BUN:Cr
 *   3. rheumatools: DAS28-CRP, DAS28-ESR, CDAI, SDAI, ACR/EULAR scoring cutoffs
 *   4. index.html: Portfolio integration, contact links, obsidian design tokens
 * 
 * Clinical Reference Standards:
 *   - KDIGO 2012 / 2024 Clinical Practice Guidelines for CKD Evaluation and Management
 *   - Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron 1976;16:31-41
 *   - Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm 1974;8:650-655 (Ideal Body Weight)
 *   - Adrogué HJ, Madias NE. Hypernatremia / Hyponatremia. N Engl J Med 2000;342:1493-1499 / 1581-1589
 *   - Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics 1957;19:823-832
 *   - ACR / EULAR 2010 Rheumatoid Arthritis Classification & Disease Activity Thresholds
 * 
 * Usage:
 *   node verify_calculations.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ============================================================================
// ANSI Color Formatting for Test Runner Output
// ============================================================================
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function runTest(suiteName, testName, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`  ${colors.green}✓ PASS${colors.reset} [${suiteName}] ${testName}`);
  } catch (err) {
    failedTests++;
    console.error(`  ${colors.red}✗ FAIL${colors.reset} [${suiteName}] ${testName}`);
    console.error(`         ${colors.yellow}${err.message}${colors.reset}`);
    failureDetails.push({ suite: suiteName, test: testName, error: err.message, stack: err.stack });
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected '${expected}', got '${actual}'`);
  }
}

function assertAlmostEqual(actual, expected, tolerance = 0.01, message) {
  if (typeof actual !== 'number' || isNaN(actual)) {
    throw new Error(`${message || 'Assertion failed'}: actual value is not a valid number (${actual})`);
  }
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`${message || 'Assertion failed'}: expected ${expected} ± ${tolerance}, got ${actual} (diff: ${diff.toFixed(6)})`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed: expected true, got false');
  }
}

function assertThrows(fn, expectedErrorMessageSubstring, message) {
  let threw = false;
  let errorCaught = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    errorCaught = err;
  }
  if (!threw) {
    throw new Error(`${message || 'Assertion failed'}: expected function to throw an error, but it returned normally`);
  }
  if (expectedErrorMessageSubstring && !errorCaught.message.includes(expectedErrorMessageSubstring)) {
    throw new Error(`${message || 'Assertion failed'}: expected error containing "${expectedErrorMessageSubstring}", got "${errorCaught.message}"`);
  }
}

// ============================================================================
// Genuine Reference Clinical Engines (Derived from Reference Literature)
// ============================================================================

/**
 * 1. Renal Clinical Engine (adjustr-io logic)
 */
const RenalEngine = {
  calculateIBW(heightCm, gender) {
    if (!heightCm || heightCm <= 0) throw new Error('Height must be greater than 0 cm');
    const heightInches = heightCm / 2.54;
    const base = (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'pria') ? 50.0 : 45.5;
    return base + 2.3 * (heightInches - 60);
  },

  calculateBMI(weightKg, heightCm) {
    if (!weightKg || weightKg <= 0) throw new Error('Weight must be greater than 0 kg');
    if (!heightCm || heightCm <= 0) throw new Error('Height must be greater than 0 cm');
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  },

  selectWeightForCrCl(tbw, heightCm, gender) {
    const ibw = this.calculateIBW(heightCm, gender);
    const bmi = this.calculateBMI(tbw, heightCm);

    if (tbw < ibw) {
      // Underweight: use actual total body weight
      return { usedWeight: tbw, weightType: 'TBW (Underweight)', ibw, bmi, abw: null };
    } else if (bmi >= 30.0) {
      // Obese: use Adjusted Body Weight (ABW = IBW + 0.4 * (TBW - IBW))
      const abw = ibw + 0.4 * (tbw - ibw);
      return { usedWeight: abw, weightType: 'ABW (Obese BMI >= 30)', ibw, bmi, abw };
    } else {
      // Normal / Overweight (non-obese): use actual total body weight per clinical consensus
      return { usedWeight: tbw, weightType: 'TBW (Normal/Non-obese)', ibw, bmi, abw: null };
    }
  },

  calculateCrCl(age, tbw, heightCm, scr, gender) {
    if (age == null || isNaN(age) || age < 18) throw new Error('Age must be at least 18 years for Cockcroft-Gault equation');
    if (tbw == null || isNaN(tbw) || tbw <= 0) throw new Error('Total body weight must be a positive number');
    if (heightCm == null || isNaN(heightCm) || heightCm <= 0) throw new Error('Height must be a positive number');
    if (scr == null || isNaN(scr) || scr <= 0) throw new Error('Serum creatinine must be a positive number');

    const weightInfo = this.selectWeightForCrCl(tbw, heightCm, gender);
    const genderFactor = (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'wanita') ? 0.85 : 1.0;
    const crCl = ((140 - age) * weightInfo.usedWeight) / (72 * scr) * genderFactor;

    return {
      crCl: Math.round(crCl * 100) / 100,
      weightUsed: weightInfo.usedWeight,
      weightType: weightInfo.weightType,
      ibw: Math.round(weightInfo.ibw * 100) / 100,
      bmi: Math.round(weightInfo.bmi * 100) / 100,
      abw: weightInfo.abw ? Math.round(weightInfo.abw * 100) / 100 : null
    };
  },

  classifyKDIGO(crCl) {
    if (crCl >= 90) return { stage: 'G1', label: 'Normal or High', color: 'green', risk: 'Low' };
    if (crCl >= 60) return { stage: 'G2', label: 'Mildly Decreased', color: 'green', risk: 'Mild' };
    if (crCl >= 45) return { stage: 'G3a', label: 'Mildly to Moderately Decreased', color: 'yellow', risk: 'Moderate' };
    if (crCl >= 30) return { stage: 'G3b', label: 'Moderately to Severely Decreased', color: 'amber', risk: 'High' };
    if (crCl >= 15) return { stage: 'G4', label: 'Severely Decreased', color: 'orange', risk: 'Very High' };
    return { stage: 'G5', label: 'Kidney Failure (End Stage)', color: 'red', risk: 'Severe Failure' };
  }
};

/**
 * 2. Fluid & Electrolyte Clinical Engine (adjustr-fluid logic)
 */
const FluidElectrolyteEngine = {
  calculateTBW(weightKg, gender, age) {
    if (!weightKg || weightKg <= 0) throw new Error('Weight must be positive');
    const isMale = gender.toLowerCase() === 'male' || gender.toLowerCase() === 'pria';
    const isElderly = age >= 65;

    let factor;
    if (isMale) {
      factor = isElderly ? 0.50 : 0.60;
    } else {
      factor = isElderly ? 0.45 : 0.50;
    }
    return weightKg * factor;
  },

  calculateDeltaNaPerLiter(infusateNa, infusateK, serumNa, tbw) {
    if (tbw <= 0) throw new Error('TBW must be positive');
    // Adrogué-Madias formula: DeltaNa = ((Na_inf + K_inf) - Na_serum) / (TBW + 1)
    return ((infusateNa + infusateK) - serumNa) / (tbw + 1);
  },

  calculateHyponatremiaCorrection({ weightKg, gender, age, initialNa, infusateNa, infusateK = 0, target24hRise }) {
    if (initialNa == null || initialNa <= 0 || initialNa > 150) throw new Error('Invalid initial serum sodium');
    if (target24hRise == null || target24hRise <= 0) throw new Error('Target 24h sodium rise must be positive');

    const tbw = this.calculateTBW(weightKg, gender, age);
    const deltaNaPerLiter = this.calculateDeltaNaPerLiter(infusateNa, infusateK, initialNa, tbw);

    if (deltaNaPerLiter <= 0) {
      throw new Error('Infusate sodium concentration must exceed serum sodium to correct hyponatremia');
    }

    const totalVolumeLiters = target24hRise / deltaNaPerLiter;
    const totalVolumeMl = totalVolumeLiters * 1000;
    const hourlyRateMl = totalVolumeMl / 24;

    // Safety assessment for Osmotic Demyelination Syndrome (ODS)
    let safetyLevel = 'SAFE';
    let safetyAlert = null;

    if (target24hRise > 10.0) {
      safetyLevel = 'CRITICAL_ALERT';
      safetyAlert = `CRITICAL ALERT: Target correction rate of ${target24hRise.toFixed(1)} mEq/L/24h exceeds the absolute safety ceiling of 10 mEq/L/24h. High risk of irreversible Osmotic Demyelination Syndrome (ODS) / Central Pontine Myelinolysis!`;
    } else if (target24hRise > 8.0) {
      safetyLevel = 'WARNING';
      safetyAlert = `WARNING: Target correction rate of ${target24hRise.toFixed(1)} mEq/L/24h exceeds standard recommended target (6-8 mEq/L/24h). Approaching maximum ODS ceiling (10 mEq/L/24h). Monitor sodium closely every 2-4 hours.`;
    }

    return {
      tbw: Math.round(tbw * 100) / 100,
      deltaNaPerLiter: Math.round(deltaNaPerLiter * 10000) / 10000,
      totalVolumeMl: Math.round(totalVolumeMl * 10) / 10,
      hourlyRateMl: Math.round(hourlyRateMl * 10) / 10,
      safetyLevel,
      safetyAlert
    };
  },

  calculateHollidaySegar(weightKg) {
    if (weightKg == null || weightKg <= 0) throw new Error('Weight must be positive');
    let dailyMl = 0;
    let hourlyMl = 0;

    if (weightKg <= 10) {
      dailyMl = weightKg * 100;
      hourlyMl = weightKg * 4;
    } else if (weightKg <= 20) {
      dailyMl = 1000 + (weightKg - 10) * 50;
      hourlyMl = 40 + (weightKg - 10) * 2;
    } else {
      dailyMl = 1500 + (weightKg - 20) * 20;
      hourlyMl = 60 + (weightKg - 20) * 1;
    }

    return {
      dailyMl: Math.round(dailyMl),
      hourlyMl: Math.round(hourlyMl * 10) / 10
    };
  },

  validatePotassiumInfusion(orderedRateMeqHr, concentrationMeqL, route = 'peripheral') {
    if (orderedRateMeqHr <= 0) throw new Error('Potassium infusion rate must be positive');
    const isPeripheral = route.toLowerCase() === 'peripheral';

    const alerts = [];
    let isPermitted = true;

    if (isPeripheral && concentrationMeqL > 40) {
      alerts.push(`CONCENTRATION WARNING: Peripheral IV potassium concentration of ${concentrationMeqL} mEq/L exceeds maximum recommended 40 mEq/L due to severe phlebitis and sclerosis risk.`);
      isPermitted = false;
    }

    if (isPeripheral && orderedRateMeqHr > 10) {
      alerts.push(`RATE WARNING: Peripheral potassium infusion rate of ${orderedRateMeqHr} mEq/hr exceeds standard peripheral ceiling (10 mEq/hr). Continuous cardiac monitoring required.`);
    }

    if (orderedRateMeqHr > 20) {
      alerts.push(`CRITICAL CEILING EXCEEDED: Infusion rate of ${orderedRateMeqHr} mEq/hr exceeds absolute clinical maximum (20 mEq/hr). Extreme risk of lethal hyperkalemic cardiac arrest / asystole! Requires ICU admission, central venous access, and continuous telemetry.`);
      isPermitted = false;
    }

    return {
      orderedRateMeqHr,
      concentrationMeqL,
      route,
      isPermitted,
      alerts
    };
  },

  calculateBunCrRatio(serumUreaOrBun, serumCr, inputType = 'urea') {
    if (serumCr == null || serumCr <= 0) {
      throw new Error('Serum creatinine must be a positive value (cannot divide by zero or negative)');
    }
    if (serumUreaOrBun == null || serumUreaOrBun < 0) {
      throw new Error('Serum Urea/BUN must be non-negative');
    }

    // Urea molecular weight 60 g/mol; BUN measures 2 nitrogen atoms (28 g/mol)
    // BUN = Urea / 2.14
    let bun = serumUreaOrBun;
    if (inputType.toLowerCase() === 'urea') {
      bun = serumUreaOrBun / 2.14;
    }

    const ratio = bun / serumCr;
    let interpretation = '';
    if (ratio > 20) {
      interpretation = 'Pre-Renal Etiology (Hypoperfusion / Dehydration)';
    } else if (ratio < 10) {
      interpretation = 'Intrinsic Renal Etiology (Acute Tubular Necrosis)';
    } else {
      interpretation = 'Normal or Post-Renal Etiology';
    }

    return {
      calculatedBUN: Math.round(bun * 100) / 100,
      ratio: Math.round(ratio * 10) / 10,
      interpretation
    };
  }
};

/**
 * 3. Rheumatology Clinical Scoring Engine (rheumatools logic)
 */
const RheumatologyEngine = {
  calculateDAS28_CRP(tjc28, sjc28, crpMgL, pgaMm) {
    if (tjc28 == null || isNaN(tjc28) || tjc28 < 0 || tjc28 > 28) {
      throw new Error('Tender Joint Count (TJC28) must be an integer between 0 and 28');
    }
    if (sjc28 == null || isNaN(sjc28) || sjc28 < 0 || sjc28 > 28) {
      throw new Error('Swollen Joint Count (SJC28) must be an integer between 0 and 28');
    }
    if (crpMgL == null || isNaN(crpMgL) || crpMgL < 0) {
      throw new Error('CRP must be a non-negative number (mg/L)');
    }
    if (pgaMm == null || isNaN(pgaMm) || pgaMm < 0 || pgaMm > 100) {
      throw new Error('Patient Global Assessment (PGA) must be between 0 and 100 mm');
    }

    // Formula: 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.36*ln(CRP + 1) + 0.014*PGA + 0.96
    const tjcTerm = 0.56 * Math.sqrt(tjc28);
    const sjcTerm = 0.28 * Math.sqrt(sjc28);
    const crpTerm = 0.36 * Math.log(crpMgL + 1);
    const pgaTerm = 0.014 * pgaMm;
    const constant = 0.96;

    const rawScore = tjcTerm + sjcTerm + crpTerm + pgaTerm + constant;
    const roundedScore = Math.round(rawScore * 100) / 100;

    let activity = '';
    if (roundedScore <= 2.60) {
      activity = 'Remission';
    } else if (roundedScore <= 3.20) {
      activity = 'Low Disease Activity';
    } else if (roundedScore <= 5.10) {
      activity = 'Moderate Disease Activity';
    } else {
      activity = 'High Disease Activity';
    }

    return {
      score: roundedScore,
      rawScore,
      activity,
      components: { tjcTerm, sjcTerm, crpTerm, pgaTerm, constant }
    };
  },

  calculateDAS28_ESR(tjc28, sjc28, esrMmHr, pgaMm) {
    if (tjc28 == null || isNaN(tjc28) || tjc28 < 0 || tjc28 > 28) {
      throw new Error('Tender Joint Count (TJC28) must be an integer between 0 and 28');
    }
    if (sjc28 == null || isNaN(sjc28) || sjc28 < 0 || sjc28 > 28) {
      throw new Error('Swollen Joint Count (SJC28) must be an integer between 0 and 28');
    }
    if (esrMmHr == null || isNaN(esrMmHr) || esrMmHr < 1) {
      throw new Error('ESR must be at least 1 mm/hr (log singularity guardrail)');
    }
    if (pgaMm == null || isNaN(pgaMm) || pgaMm < 0 || pgaMm > 100) {
      throw new Error('Patient Global Assessment (PGA) must be between 0 and 100 mm');
    }

    // Formula: 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.70*ln(ESR) + 0.014*PGA
    const tjcTerm = 0.56 * Math.sqrt(tjc28);
    const sjcTerm = 0.28 * Math.sqrt(sjc28);
    const esrTerm = 0.70 * Math.log(esrMmHr);
    const pgaTerm = 0.014 * pgaMm;

    const rawScore = tjcTerm + sjcTerm + esrTerm + pgaTerm;
    const roundedScore = Math.round(rawScore * 100) / 100;

    let activity = '';
    if (roundedScore <= 2.60) {
      activity = 'Remission';
    } else if (roundedScore <= 3.20) {
      activity = 'Low Disease Activity';
    } else if (roundedScore <= 5.10) {
      activity = 'Moderate Disease Activity';
    } else {
      activity = 'High Disease Activity';
    }

    return {
      score: roundedScore,
      rawScore,
      activity
    };
  },

  calculateCDAI(tjc28, sjc28, pga0_10, ega0_10) {
    if (tjc28 < 0 || tjc28 > 28 || sjc28 < 0 || sjc28 > 28) throw new Error('Joint counts must be 0-28');
    if (pga0_10 < 0 || pga0_10 > 10 || ega0_10 < 0 || ega0_10 > 10) throw new Error('PGA/EGA must be 0-10');

    const score = tjc28 + sjc28 + pga0_10 + ega0_10;
    let activity = '';
    if (score <= 2.8) activity = 'Remission';
    else if (score <= 10.0) activity = 'Low Disease Activity';
    else if (score <= 22.0) activity = 'Moderate Disease Activity';
    else activity = 'High Disease Activity';

    return { score, activity };
  },

  calculateSDAI(tjc28, sjc28, pga0_10, ega0_10, crpMgDl) {
    if (crpMgDl < 0) throw new Error('CRP must be non-negative');
    const cdai = this.calculateCDAI(tjc28, sjc28, pga0_10, ega0_10);
    const score = Math.round((cdai.score + crpMgDl) * 100) / 100;

    let activity = '';
    if (score <= 3.3) activity = 'Remission';
    else if (score <= 11.0) activity = 'Low Disease Activity';
    else if (score <= 26.0) activity = 'Moderate Disease Activity';
    else activity = 'High Disease Activity';

    return { score, activity };
  }
};

// ============================================================================
// TEST SUITES EXECUTION
// ============================================================================

console.log(`\n${colors.bold}${colors.cyan}================================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}   DOCTOR PORTFOLIO CLINICAL VERIFICATION & BENCHMARK SUITE    ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}================================================================${colors.reset}\n`);

// ----------------------------------------------------------------------------
// SCENARIO 1: Cockcroft-Gault CrCl, IBW, ABW, and KDIGO Staging
// ----------------------------------------------------------------------------
console.log(`${colors.bold}${colors.white}[SCENARIO 1: Renal Cockcroft-Gault CrCl & Weight Selection]${colors.reset}`);

runTest('Scenario 1', 'Non-obese Male: 50yo, 70kg, 175cm, SCr 1.0 -> Normal BMI (22.86), uses TBW 70kg -> CrCl = 87.5 mL/min', () => {
  const res = RenalEngine.calculateCrCl(50, 70, 175, 1.0, 'male');
  assertAlmostEqual(res.bmi, 22.86, 0.05, 'BMI check');
  assertAlmostEqual(res.ibw, 70.46, 0.1, 'IBW check');
  assertEqual(res.weightUsed, 70, 'Must use TBW');
  assertAlmostEqual(res.crCl, 87.5, 0.05, 'CrCl match');
  const kdigo = RenalEngine.classifyKDIGO(res.crCl);
  assertEqual(kdigo.stage, 'G2', 'KDIGO Stage G2');
});

runTest('Scenario 1', 'Obese Male: 50yo, 110kg, 170cm, SCr 1.2 -> Obese BMI (38.06), uses ABW 83.56kg -> CrCl = 87.05 mL/min', () => {
  const res = RenalEngine.calculateCrCl(50, 110, 170, 1.2, 'male');
  assertAlmostEqual(res.bmi, 38.06, 0.05, 'BMI check');
  assertAlmostEqual(res.ibw, 65.94, 0.1, 'IBW check');
  assertAlmostEqual(res.abw, 83.56, 0.1, 'ABW check');
  assertAlmostEqual(res.weightUsed, 83.56, 0.1, 'Weight used must be ABW');
  assertTrue(res.weightType.includes('ABW'), 'Weight type must indicate ABW');
  assertAlmostEqual(res.crCl, 87.05, 0.05, 'CrCl match');
  const kdigo = RenalEngine.classifyKDIGO(res.crCl);
  assertEqual(kdigo.stage, 'G2', 'KDIGO Stage G2');
});

runTest('Scenario 1', 'Underweight Female: 60yo, 42kg, 160cm, SCr 0.8 -> TBW (42kg) < IBW (52.4kg), uses TBW -> CrCl = 49.58 mL/min', () => {
  const res = RenalEngine.calculateCrCl(60, 42, 160, 0.8, 'female');
  assertAlmostEqual(res.ibw, 52.38, 0.1, 'IBW check');
  assertEqual(res.weightUsed, 42, 'Must use TBW when TBW < IBW');
  assertTrue(res.weightType.includes('TBW'), 'Weight type must indicate TBW');
  assertAlmostEqual(res.crCl, 49.58, 0.05, 'CrCl match');
  const kdigo = RenalEngine.classifyKDIGO(res.crCl);
  assertEqual(kdigo.stage, 'G3a', 'KDIGO Stage G3a');
});

runTest('Scenario 1', 'Standard Adult Female: 50yo, 60kg, 165cm, SCr 1.0 -> Normal BMI 22.04 -> CrCl = 63.75 mL/min (0.85 sex factor)', () => {
  const res = RenalEngine.calculateCrCl(50, 60, 165, 1.0, 'female');
  assertAlmostEqual(res.crCl, 63.75, 0.05, 'CrCl female factor check');
  assertEqual(res.weightUsed, 60, 'Uses standard TBW');
  const kdigo = RenalEngine.classifyKDIGO(res.crCl);
  assertEqual(kdigo.stage, 'G2', 'KDIGO Stage G2');
});

runTest('Scenario 1', 'Severe Renal Failure (CrCl < 15) triggers KDIGO G5 Stage and High Risk Warning', () => {
  const res = RenalEngine.calculateCrCl(75, 55, 160, 3.8, 'male');
  assertTrue(res.crCl < 15, 'CrCl must be < 15 mL/min');
  const kdigo = RenalEngine.classifyKDIGO(res.crCl);
  assertEqual(kdigo.stage, 'G5', 'KDIGO G5 End Stage');
  assertEqual(kdigo.color, 'red', 'High-alert red badge');
});

runTest('Scenario 1', 'BMI 30.0 Exact Boundary Condition triggers ABW switch', () => {
  // Height 180cm, Weight 97.2kg -> BMI = 97.2 / (1.8^2) = 97.2 / 3.24 = 30.0
  const res = RenalEngine.selectWeightForCrCl(97.2, 180, 'male');
  assertAlmostEqual(res.bmi, 30.0, 0.01, 'Exact BMI 30');
  assertTrue(res.abw !== null, 'ABW must be computed at BMI 30.0');
  assertTrue(res.weightType.includes('ABW'), 'Weight type must be ABW');
});

// ----------------------------------------------------------------------------
// SCENARIO 2: Severe Hyponatremia & ODS Safety Ceiling
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.white}[SCENARIO 2: Severe Hyponatremia & ODS Safety Guardrails]${colors.reset}`);

runTest('Scenario 2', 'Adrogué-Madias: 60yo Male, 70kg, initial Na 115, 3% Saline (513 mEq/L) -> DeltaNa = 9.26 mEq/L', () => {
  const res = FluidElectrolyteEngine.calculateHyponatremiaCorrection({
    weightKg: 70,
    gender: 'male',
    age: 60,
    initialNa: 115,
    infusateNa: 513,
    target24hRise: 6
  });
  assertAlmostEqual(res.tbw, 42.0, 0.1, 'TBW = 70 * 0.6 = 42L');
  assertAlmostEqual(res.deltaNaPerLiter, 9.2558, 0.01, 'Delta Na per 1L');
  assertAlmostEqual(res.hourlyRateMl, 27.0, 0.2, 'Hourly infusion rate ~ 27.0 mL/hr');
  assertEqual(res.safetyLevel, 'SAFE', 'Target rise 6 mEq/24h is SAFE');
});

runTest('Scenario 2', 'Safety Warning: Target 24h rise > 8 mEq/24h (e.g. 9 mEq/24h) triggers WARNING alert', () => {
  const res = FluidElectrolyteEngine.calculateHyponatremiaCorrection({
    weightKg: 70,
    gender: 'male',
    age: 60,
    initialNa: 115,
    infusateNa: 513,
    target24hRise: 9.0
  });
  assertEqual(res.safetyLevel, 'WARNING', '9 mEq/24h must trigger WARNING');
  assertTrue(res.safetyAlert.includes('WARNING'), 'Alert text contains WARNING');
  assertTrue(res.safetyAlert.includes('ODS'), 'Alert text warns about ODS');
});

runTest('Scenario 2', 'Safety Ceiling Alert: Target 24h rise > 10 mEq/24h (e.g. 12 mEq/24h) triggers CRITICAL ODS ALERT', () => {
  const res = FluidElectrolyteEngine.calculateHyponatremiaCorrection({
    weightKg: 70,
    gender: 'male',
    age: 60,
    initialNa: 115,
    infusateNa: 513,
    target24hRise: 12.0
  });
  assertEqual(res.safetyLevel, 'CRITICAL_ALERT', '12 mEq/24h must trigger CRITICAL_ALERT');
  assertTrue(res.safetyAlert.includes('CRITICAL ALERT'), 'Alert text contains CRITICAL ALERT');
  assertTrue(res.safetyAlert.includes('Osmotic Demyelination Syndrome'), 'Alert explicitly names Osmotic Demyelination Syndrome');
  assertAlmostEqual(res.hourlyRateMl, 54.0, 0.5, 'Hourly pump rate 54.0 mL/hr');
});

runTest('Scenario 2', 'Elderly Female TBW Coefficient: 75yo Female, 50kg -> Uses 0.45 factor (TBW = 22.5L, NOT hardcoded 0.6)', () => {
  const res = FluidElectrolyteEngine.calculateHyponatremiaCorrection({
    weightKg: 50,
    gender: 'female',
    age: 75,
    initialNa: 118,
    infusateNa: 513,
    target24hRise: 6.0
  });
  assertAlmostEqual(res.tbw, 22.5, 0.1, 'TBW = 50 * 0.45 = 22.5L');
  // Delta Na = (513 - 118) / (22.5 + 1) = 395 / 23.5 = 16.8085
  assertAlmostEqual(res.deltaNaPerLiter, 16.8085, 0.05, 'Delta Na per 1L with 0.45 TBW');
});

runTest('Scenario 2', 'Elderly Male TBW Coefficient: 70yo Male, 70kg -> Uses 0.50 factor (TBW = 35.0L)', () => {
  const tbw = FluidElectrolyteEngine.calculateTBW(70, 'male', 70);
  assertAlmostEqual(tbw, 35.0, 0.1, 'Elderly male TBW = 70 * 0.50 = 35.0L');
});

runTest('Scenario 2', 'Active Infusate Potassium Inclusion: Ringer Lactate (Na=130, K=4) into Na=120, TBW=35L', () => {
  const deltaNa = FluidElectrolyteEngine.calculateDeltaNaPerLiter(130, 4, 120, 35);
  // (130 + 4 - 120) / (35 + 1) = 14 / 36 = 0.3889
  assertAlmostEqual(deltaNa, 0.3889, 0.001, 'K_infusate must be summed with Na_infusate');
});

// ----------------------------------------------------------------------------
// SCENARIO 3: Rheumatoid Arthritis DAS28-CRP and Disease Activity Scoring
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.white}[SCENARIO 3: Rheumatology DAS28-CRP & Disease Activity Scoring]${colors.reset}`);

runTest('Scenario 3', 'Benchmark RA Patient: TJC=6, SJC=4, CRP=15 mg/L, PGA=40mm -> DAS28-CRP = 4.45 (Moderate Disease Activity)', () => {
  const res = RheumatologyEngine.calculateDAS28_CRP(6, 4, 15, 40);
  assertAlmostEqual(res.score, 4.45, 0.01, 'Exact DAS28-CRP score match');
  assertEqual(res.activity, 'Moderate Disease Activity', 'Classification match');
});

runTest('Scenario 3', 'Zero-CRP Edge Case: TJC=6, SJC=4, CRP=0 mg/L, PGA=40mm -> DAS28-CRP = 3.45 (Moderate, NEVER 0.00 Remission)', () => {
  const res = RheumatologyEngine.calculateDAS28_CRP(6, 4, 0, 40);
  assertAlmostEqual(res.score, 3.45, 0.01, 'DAS28-CRP with CRP=0');
  assertEqual(res.activity, 'Moderate Disease Activity', 'Must NOT bypass joints and fall through to Remission');
});

runTest('Scenario 3', 'Polyarthritis with Normal CRP: TJC=16, SJC=8, CRP=0 mg/L, PGA=70mm -> DAS28-CRP = 4.97 (Moderate)', () => {
  const res = RheumatologyEngine.calculateDAS28_CRP(16, 8, 0, 70);
  assertAlmostEqual(res.score, 4.97, 0.02, 'Severe joint involvement correctly reflects disease activity');
  assertEqual(res.activity, 'Moderate Disease Activity');
});

runTest('Scenario 3', 'True Remission Case: TJC=0, SJC=0, CRP=0.5 mg/L, PGA=5mm -> DAS28-CRP = 1.18 <= 2.6 (Remission)', () => {
  const res = RheumatologyEngine.calculateDAS28_CRP(0, 0, 0.5, 5);
  assertAlmostEqual(res.score, 1.18, 0.02, 'DAS28 Remission score');
  assertEqual(res.activity, 'Remission', 'Correctly classified as Remission');
});

runTest('Scenario 3', 'High Disease Activity Case: TJC=18, SJC=12, CRP=45 mg/L, PGA=80mm -> DAS28-CRP = 6.80 > 5.1 (High)', () => {
  const res = RheumatologyEngine.calculateDAS28_CRP(18, 12, 45, 80);
  assertAlmostEqual(res.score, 6.80, 0.05, 'High disease activity score');
  assertEqual(res.activity, 'High Disease Activity');
});

runTest('Scenario 3', 'DAS28-ESR Singularity Guardrail: ESR=0 mm/hr must be rejected to prevent ln(0) = -Infinity', () => {
  assertThrows(() => {
    RheumatologyEngine.calculateDAS28_ESR(6, 4, 0, 40);
  }, 'ESR must be at least 1 mm/hr', 'ESR singularity guardrail');
});

runTest('Scenario 3', 'CDAI & SDAI Calculations: TJC=6, SJC=4, PGA=4.0, EGA=3.0, CRP=1.5 mg/dL -> CDAI=17.0, SDAI=18.5 (Moderate)', () => {
  const cdai = RheumatologyEngine.calculateCDAI(6, 4, 4.0, 3.0);
  assertEqual(cdai.score, 17.0, 'CDAI score');
  assertEqual(cdai.activity, 'Moderate Disease Activity', 'CDAI activity');

  const sdai = RheumatologyEngine.calculateSDAI(6, 4, 4.0, 3.0, 1.5);
  assertEqual(sdai.score, 18.5, 'SDAI score');
  assertEqual(sdai.activity, 'Moderate Disease Activity', 'SDAI activity');
});

// ----------------------------------------------------------------------------
// SCENARIO 4: Fluid Maintenance, Electrolyte Ceilings & Boundary Guardrails
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.white}[SCENARIO 4: Fluid Maintenance, Electrolyte Ceilings & Edge Guardrails]${colors.reset}`);

runTest('Scenario 4', 'Holliday-Segar Fluid Volumes: 5kg, 15kg, and 70kg patients vs crude 30 mL/kg', () => {
  const infant5 = FluidElectrolyteEngine.calculateHollidaySegar(5);
  assertEqual(infant5.dailyMl, 500, '5kg infant -> 500 mL/24h');
  assertAlmostEqual(infant5.hourlyMl, 20.0, 0.5, '5kg infant -> 20.0 mL/hr (4 mL/kg/hr)');

  const child15 = FluidElectrolyteEngine.calculateHollidaySegar(15);
  assertEqual(child15.dailyMl, 1250, '15kg child -> 1000 + 5*50 = 1250 mL/24h (vs 450 mL if crude 30mL/kg!)');
  assertAlmostEqual(child15.hourlyMl, 50.0, 0.5, '15kg child -> 50.0 mL/hr');

  const adult70 = FluidElectrolyteEngine.calculateHollidaySegar(70);
  assertEqual(adult70.dailyMl, 2500, '70kg adult -> 1500 + 50*20 = 2500 mL/24h');
  assertAlmostEqual(adult70.hourlyMl, 110.0, 0.5, '70kg adult -> 110.0 mL/hr');
});

runTest('Scenario 4', 'Potassium Infusion Ceilings: Peripheral max 10 mEq/hr, central absolute ceiling 20 mEq/hr', () => {
  // Safe peripheral
  const safeP = FluidElectrolyteEngine.validatePotassiumInfusion(10, 40, 'peripheral');
  assertTrue(safeP.isPermitted, '10 mEq/hr at 40 mEq/L is permitted peripherally');
  assertEqual(safeP.alerts.length, 0, 'No warning for safe rate');

  // Peripheral concentration exceeded (> 40 mEq/L)
  const highConc = FluidElectrolyteEngine.validatePotassiumInfusion(10, 60, 'peripheral');
  assertTrue(!highConc.isPermitted, '60 mEq/L is not permitted peripherally');
  assertTrue(highConc.alerts.some(a => a.includes('CONCENTRATION WARNING')));

  // Peripheral rate exceeded (> 10 mEq/hr)
  const highRate = FluidElectrolyteEngine.validatePotassiumInfusion(15, 40, 'peripheral');
  assertTrue(highRate.alerts.some(a => a.includes('RATE WARNING')));

  // Critical absolute ceiling exceeded (> 20 mEq/hr)
  const lethalRate = FluidElectrolyteEngine.validatePotassiumInfusion(30, 40, 'central');
  assertTrue(!lethalRate.isPermitted, '30 mEq/hr must be prohibited');
  assertTrue(lethalRate.alerts.some(a => a.includes('CRITICAL CEILING EXCEEDED')));
  assertTrue(lethalRate.alerts.some(a => a.includes('cardiac arrest')));
});

runTest('Scenario 4', 'AKI BUN:Cr Ratio: Serum Urea vs BUN conversion and zero-creatinine guardrail', () => {
  // Pre-renal: Serum Urea 100 mg/dL, Cr 1.0 -> BUN = 46.73, Ratio = 46.7
  const preRenal = FluidElectrolyteEngine.calculateBunCrRatio(100, 1.0, 'urea');
  assertAlmostEqual(preRenal.ratio, 46.7, 0.1, 'Pre-renal BUN:Cr ratio');
  assertTrue(preRenal.interpretation.includes('Pre-Renal'));

  // Intrinsic ATN: Serum Urea 40 mg/dL, Cr 2.5 -> BUN = 18.69, Ratio = 7.5
  const atn = FluidElectrolyteEngine.calculateBunCrRatio(40, 2.5, 'urea');
  assertAlmostEqual(atn.ratio, 7.5, 0.1, 'ATN BUN:Cr ratio');
  assertTrue(atn.interpretation.includes('Intrinsic Renal'));

  // Division by zero creatinine guardrail
  assertThrows(() => {
    FluidElectrolyteEngine.calculateBunCrRatio(100, 0, 'urea');
  }, 'Serum creatinine must be a positive value', 'Cr=0 guardrail');
});

runTest('Scenario 4', 'Input Validation: Negative and blank inputs gracefully rejected without NaN', () => {
  // Negative joint count
  assertThrows(() => {
    RheumatologyEngine.calculateDAS28_CRP(-1, 4, 15, 40);
  }, 'must be an integer between 0 and 28');

  // Blank/null joint count
  assertThrows(() => {
    RheumatologyEngine.calculateDAS28_CRP(null, 4, 15, 40);
  }, 'must be an integer between 0 and 28');

  // Negative weight for CrCl
  assertThrows(() => {
    RenalEngine.calculateCrCl(50, -70, 170, 1.0, 'male');
  }, 'must be a positive number');

  // Negative age for CrCl
  assertThrows(() => {
    RenalEngine.calculateCrCl(-5, 70, 170, 1.0, 'male');
  }, 'Age must be at least 18');

  // Zero SCr for CrCl
  assertThrows(() => {
    RenalEngine.calculateCrCl(50, 70, 170, 0, 'male');
  }, 'Serum creatinine must be a positive number');
});

// ----------------------------------------------------------------------------
// SUITE 5: Live In-File Engine Interoperability Testing
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.white}[SUITE 5: Live In-File Engine Interoperability Testing]${colors.reset}`);

const projectRoot = path.resolve(__dirname);

// 1. Test adjustr-io.html's live ClinicalEngine
runTest('Live In-File', 'adjustr-io.html: In-file ClinicalEngine calculates exact CrCl with ABW for obese patient', () => {
  const ioHtml = fs.readFileSync(path.join(projectRoot, 'adjustr-io.html'), 'utf8');
  const engineMatch = ioHtml.match(/const ClinicalEngine = \{[\s\S]*?\n    \};/);
  assertTrue(!!engineMatch, 'adjustr-io.html must define ClinicalEngine');

  const sandbox = { console, Math };
  vm.createContext(sandbox);
  vm.runInContext(engineMatch[0] + '; inEngine = ClinicalEngine;', sandbox);
  const inEngine = sandbox.inEngine;

  // Test Obese Male benchmark: 50yo, 110kg, 170cm, SCr 1.2
  const obeseRes = inEngine.calculateCrCl(50, 110, 170, 1.2, 'male');
  assertTrue(obeseRes !== null, 'Calculation returned valid result');
  assertAlmostEqual(obeseRes.crCl, 87.05, 0.05, 'In-file CrCl matches reference 87.05');
  assertAlmostEqual(obeseRes.usedWeight, 83.56, 0.1, 'In-file uses ABW 83.56kg');
  assertTrue(obeseRes.weightType.includes('ABW'), 'In-file confirms ABW weight type');

  // Test Underweight Female benchmark: 60yo, 42kg, 160cm, SCr 0.8
  const underRes = inEngine.calculateCrCl(60, 42, 160, 0.8, 'female');
  assertAlmostEqual(underRes.crCl, 49.58, 0.05, 'In-file Underweight CrCl matches reference 49.58');
  assertEqual(underRes.usedWeight, 42, 'In-file uses TBW 42kg');
});

// 2. Test adjustr-fluid.html's live FluidElectrolyteEngine
runTest('Live In-File', 'adjustr-fluid.html: In-file FluidElectrolyteEngine computes exact Adrogué-Madias & ODS alerts', () => {
  const fluidHtml = fs.readFileSync(path.join(projectRoot, 'adjustr-fluid.html'), 'utf8');
  const engineMatch = fluidHtml.match(/const FluidElectrolyteEngine = \{[\s\S]*?\n    \};/);
  assertTrue(!!engineMatch, 'adjustr-fluid.html must define FluidElectrolyteEngine');

  const sandbox = { console, Math };
  vm.createContext(sandbox);
  vm.runInContext(engineMatch[0] + '; inEngine = FluidElectrolyteEngine;', sandbox);
  const inEngine = sandbox.inEngine;

  // Test benchmark severe hyponatremia case
  const res = inEngine.calcHyponatremia({
    weight: 70,
    sex: 'male',
    ageGroup: 'adult',
    serumNa: 115,
    targetRise24h: 6,
    infusateNa: 513
  });
  assertAlmostEqual(res.tbw, 42.0, 0.1, 'In-file TBW');
  assertAlmostEqual(res.deltaNaPerLiter, 9.2558, 0.01, 'In-file DeltaNa');
  assertAlmostEqual(res.hourlyRateMl, 27.01, 0.1, 'In-file Hourly rate');
  assertEqual(res.isDangerODS, false, 'In-file safe target');

  // Test dangerous ODS ceiling (> 10 mEq/24h)
  const dangerRes = inEngine.calcHyponatremia({
    weight: 70,
    sex: 'male',
    ageGroup: 'adult',
    serumNa: 115,
    targetRise24h: 12,
    infusateNa: 513
  });
  assertEqual(dangerRes.isDangerODS, true, 'In-file ODS danger triggered');
  assertTrue(dangerRes.warningMessage.includes('Osmotic Demyelination Syndrome'), 'In-file warning message');

  // Test Holliday-Segar in file
  assertEqual(inEngine.calcHollidaySegar(15), 1250, 'In-file 15kg Holliday-Segar = 1250 mL');
});

// 3. Test rheumatools.html's live RheumaCalc
runTest('Live In-File', 'rheumatools.html: In-file RheumaCalc computes exact DAS28-CRP and zero-CRP without bypass', () => {
  const rheumaHtml = fs.readFileSync(path.join(projectRoot, 'rheumatools.html'), 'utf8');
  const engineMatch = rheumaHtml.match(/const RheumaCalc = \{[\s\S]*?\n      \};/);
  assertTrue(!!engineMatch, 'rheumatools.html must define RheumaCalc');

  const sandbox = { console, Math };
  vm.createContext(sandbox);
  vm.runInContext(engineMatch[0] + '; inRheuma = RheumaCalc;', sandbox);
  const inRheuma = sandbox.inRheuma;

  // Test benchmark RA patient
  const res = inRheuma.calculateDAS28_CRP(6, 4, 15, 40);
  assertEqual(res.score, '4.45', 'In-file DAS28-CRP score match');
  assertEqual(res.activity.level, 'Moderate', 'In-file Activity Moderate');

  // Test zero-CRP edge case
  const zeroRes = inRheuma.calculateDAS28_CRP(6, 4, 0, 40);
  assertEqual(zeroRes.score, '3.45', 'In-file Zero-CRP score match');
  assertEqual(zeroRes.activity.level, 'Moderate', 'In-file Zero-CRP Moderate (NOT Remission)');
});

// ----------------------------------------------------------------------------
// SUITE 6: Static Code Audit & Project Integrity Verification
// ----------------------------------------------------------------------------
console.log(`\n${colors.bold}${colors.white}[SUITE 6: Static Code Audit & Project Integrity Verification]${colors.reset}`);

runTest('Static Audit', 'index.html contains required Contact Me email and obsidian tokens', () => {
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  assertTrue(indexHtml.includes('drguswib@gmail.com'), 'index.html must have correct contact email');
  assertTrue(indexHtml.includes('#040814'), 'index.html has obsidian background token #040814');
  assertTrue(indexHtml.includes('#00F2FE'), 'index.html has cyan accent token #00F2FE');
});

runTest('Static Audit', 'rheumatools.html contains obsidian tokens, contact link, and eliminates crp>0 bypass', () => {
  const rheumaHtml = fs.readFileSync(path.join(projectRoot, 'rheumatools.html'), 'utf8');
  assertTrue(rheumaHtml.includes('mailto:drguswib@gmail.com'), 'rheumatools.html contact link');
  assertTrue(rheumaHtml.includes('#040814'), 'rheumatools.html obsidian background');
  const dangerousPattern = /if\s*\(\s*crp\s*>\s*0\s*\)\s*\{\s*score\s*=/;
  assertTrue(!dangerousPattern.test(rheumaHtml), 'rheumatools.html must not use if (crp > 0) calculation bypass');
});

runTest('Static Audit', 'adjustr-fluid.html contains obsidian tokens, contact link, and age/gender TBW', () => {
  const fluidHtml = fs.readFileSync(path.join(projectRoot, 'adjustr-fluid.html'), 'utf8');
  assertTrue(fluidHtml.includes('mailto:drguswib@gmail.com'), 'adjustr-fluid.html contact link');
  assertTrue(fluidHtml.includes('#040814'), 'adjustr-fluid.html obsidian background');
  assertTrue(fluidHtml.includes('calcTBW'), 'adjustr-fluid.html has dynamic calcTBW');
});

runTest('Static Audit', 'adjustr-io.html contains obsidian tokens, contact link, KDIGO, and ABW logic', () => {
  const ioHtml = fs.readFileSync(path.join(projectRoot, 'adjustr-io.html'), 'utf8');
  assertTrue(ioHtml.includes('mailto:drguswib@gmail.com'), 'adjustr-io.html contact link');
  assertTrue(ioHtml.includes('#040814'), 'adjustr-io.html obsidian background');
  assertTrue(ioHtml.includes('classifyKDIGO'), 'adjustr-io.html has KDIGO classification');
  assertTrue(ioHtml.includes('selectWeight'), 'adjustr-io.html has dosing weight selection');
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log(`\n${colors.bold}${colors.cyan}================================================================${colors.reset}`);
console.log(`${colors.bold}VERIFICATION SUMMARY:${colors.reset}`);
console.log(`  Total Tests Run:  ${totalTests}`);
console.log(`  Tests Passed:    ${colors.green}${passedTests}${colors.reset}`);
console.log(`  Tests Failed:    ${failedTests > 0 ? colors.red + failedTests + colors.reset : colors.green + '0' + colors.reset}`);

if (failedTests > 0) {
  console.log(`\n${colors.red}${colors.bold}FAILURES ENCOUNTERED:${colors.reset}`);
  failureDetails.forEach((f, idx) => {
    console.log(`  ${idx + 1}. [${f.suite}] ${f.test}: ${f.error}`);
  });
  console.log(`\n${colors.red}Verification test run FAILED.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}${colors.bold}All benchmark clinical test scenarios passed with 100% compliance!${colors.reset}\n`);
  process.exit(0);
}
