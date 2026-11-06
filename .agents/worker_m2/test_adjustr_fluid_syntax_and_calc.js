const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.resolve('C:/Users/Wib PC/.gemini/antigravity/scratch/doctor-portfolio/adjustr-fluid.html');
const content = fs.readFileSync(htmlPath, 'utf8');

// Extract script tag content
const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("FATAL: No <script> tag found in adjustr-fluid.html");
  process.exit(1);
}

const scriptCode = scriptMatch[1];
console.log("Found embedded script code, length:", scriptCode.length, "bytes");

// Create a DOM-like sandbox to run the entire script
const sandbox = {
  console: console,
  document: {
    addEventListener: () => {},
    querySelectorAll: () => [],
    getElementById: (id) => ({
      value: "0",
      checked: false,
      classList: { add: () => {}, remove: () => {} },
      style: {},
      innerHTML: "",
      innerText: "",
      querySelectorAll: () => []
    })
  },
  module: { exports: {} }
};

try {
  vm.createContext(sandbox);
  vm.runInContext(scriptCode, sandbox);
  console.log("SUCCESS: Script compiled and executed in sandbox with zero syntax errors!");
} catch (err) {
  console.error("SYNTAX / RUNTIME ERROR in adjustr-fluid.html script:", err);
  process.exit(1);
}

const engine = sandbox.module.exports;
if (!engine || !engine.calcHollidaySegar) {
  console.error("FATAL: FluidElectrolyteEngine was not exported or missing methods!");
  process.exit(1);
}

console.log("\n================ CLINICAL VERIFICATION TESTS ================");

let passCount = 0;
let totalTests = 0;

function assertTest(name, condition, details) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${name}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${name} - Details: ${details}`);
  }
}

// 1. Holliday-Segar Standard (100/50/20 mL/kg/day & 4-2-1 rule)
const hs10 = engine.calcHollidaySegar(10);
assertTest("Holliday-Segar 10 kg infant", hs10 === 1000, `Got ${hs10}, expected 1000`);

const hs15 = engine.calcHollidaySegar(15);
assertTest("Holliday-Segar 15 kg child", hs15 === 1250, `Got ${hs15}, expected 1250`);

const hs70 = engine.calcHollidaySegar(70);
assertTest("Holliday-Segar 70 kg adult", hs70 === 2500, `Got ${hs70}, expected 2500`);

const hr70 = engine.calcHourlyHollidaySegar(70);
assertTest("Holliday-Segar 4-2-1 hourly rate for 70 kg", hr70 === 110, `Got ${hr70}, expected 110`);

const hsZero = engine.calcHollidaySegar(0);
assertTest("Holliday-Segar 0 kg guard", hsZero === 0, `Got ${hsZero}, expected 0`);

// 2. Devine IBW & ABW
const ibwMale = engine.calcDevineIBW(170, 'male');
// 170 cm = 66.929 inches -> 50 + 2.3*(6.929) = 65.937
assertTest("Devine IBW Male 170cm", Math.abs(ibwMale - 65.94) < 0.1, `Got ${ibwMale}, expected ~65.94`);

const abwObese = engine.calcABW(110, 65.94);
// 65.94 + 0.4*(110-65.94) = 83.564
assertTest("ABW for Obese Male 110kg with IBW 65.94", Math.abs(abwObese - 83.56) < 0.1, `Got ${abwObese}, expected ~83.56`);

// 3. 24h Ongoing Loss & UOP rate
const uopRateNormal = engine.calcUOPRate(1200, 70, 24);
assertTest("UOP Rate 1200mL/70kg/24h", Math.abs(uopRateNormal - 0.714) < 0.01, `Got ${uopRateNormal}, expected ~0.71`);

const uopRateOliguria = engine.calcUOPRate(600, 70, 24);
assertTest("UOP Rate 600mL/70kg/24h (Oliguria < 0.5)", uopRateOliguria < 0.5 && uopRateOliguria >= 0.3, `Got ${uopRateOliguria}`);

const netBal = engine.calcNetBalance(2500, 1200, 200, 700);
assertTest("Net Fluid Balance 2500 - (1200+200+700)", netBal === 400, `Got ${netBal}, expected 400`);

// 4. Adrogué-Madias Hyponatremia with Sex, Age TBW and Infusate K+
// Scenario: 60 yo male, 70 kg, Na 115, 3% saline (513 mEq/L Na, 0 K)
const hypo60yo = engine.calcHyponatremia({
  weight: 70,
  sex: 'male',
  ageGroup: 'adult',
  serumNa: 115,
  targetRise24h: 6,
  infusateNa: 513,
  infusateK: 0,
  isHighRisk: false
});
assertTest("Adrogue-Madias 70kg Male TBW = 42L", hypo60yo.tbw === 42, `Got ${hypo60yo.tbw}, expected 42`);
assertTest("Adrogue-Madias DeltaNa per 1L (~9.26 mEq/L)", Math.abs(hypo60yo.deltaNaPerLiter - 9.2558) < 0.01, `Got ${hypo60yo.deltaNaPerLiter}`);
assertTest("Adrogue-Madias 24h Vol for 6 mEq rise (~648 mL)", Math.abs(hypo60yo.totalVolumeMl - 648.24) < 1, `Got ${hypo60yo.totalVolumeMl}`);
assertTest("Adrogue-Madias Hourly Rate (~27.0 mL/hr)", Math.abs(hypo60yo.hourlyRateMl - 27.01) < 0.1, `Got ${hypo60yo.hourlyRateMl}`);
assertTest("ODS Safe Rate (6 mEq/24h) No Danger", !hypo60yo.isDangerODS, "Should not be danger");

// Elderly Female TBW factor = 0.45
const hypoElderlyFemale = engine.calcHyponatremia({
  weight: 60,
  sex: 'female',
  ageGroup: 'elderly',
  serumNa: 115,
  targetRise24h: 6,
  infusateNa: 513,
  infusateK: 0,
  isHighRisk: false
});
assertTest("Adrogue-Madias Elderly Female TBW factor = 0.45 (27L)", hypoElderlyFemale.tbw === 27, `Got ${hypoElderlyFemale.tbw}, expected 27`);

// Infusate K inclusion (e.g. 0.9% NS + 20 mEq KCl: Na 154, K 20 = 174 total cations)
const hypoWithK = engine.calcHyponatremia({
  weight: 70,
  sex: 'male',
  ageGroup: 'adult',
  serumNa: 115,
  targetRise24h: 6,
  infusateNa: 154,
  infusateK: 20,
  isHighRisk: false
});
// DeltaNa = (154 + 20 - 115) / (42 + 1) = 59 / 43 = 1.372 mEq/L
assertTest("Adrogue-Madias DeltaNa with K+ included (59/43 = 1.372)", Math.abs(hypoWithK.deltaNaPerLiter - (59/43)) < 0.001, `Got ${hypoWithK.deltaNaPerLiter}`);

// ODS Safety Cap Danger Alert (> 10 mEq/24h)
const hypoDanger = engine.calcHyponatremia({
  weight: 70,
  sex: 'male',
  ageGroup: 'adult',
  serumNa: 115,
  targetRise24h: 12,
  infusateNa: 513,
  infusateK: 0,
  isHighRisk: false
});
assertTest("ODS Safety Cap Hazard Flag for 12 mEq/24h", hypoDanger.isDangerODS === true, `Got ${hypoDanger.isDangerODS}`);
assertTest("ODS Safety Warning Message Present", hypoDanger.warningMessage && hypoDanger.warningMessage.includes("Osmotic Demyelination Syndrome"), `Got: ${hypoDanger.warningMessage}`);

// High-Risk ODS Warning for > 8 mEq/24h
const hypoHighRisk = engine.calcHyponatremia({
  weight: 70,
  sex: 'male',
  ageGroup: 'adult',
  serumNa: 105,
  targetRise24h: 9,
  infusateNa: 513,
  infusateK: 0,
  isHighRisk: true
});
assertTest("High Risk ODS ceiling flag for > 8 mEq/24h", hypoHighRisk.isHighRiskExceeded === true, `Got ${hypoHighRisk.isHighRiskExceeded}`);

// 5. Potassium Replenishment
const kMild = engine.calcPotassiumDeficit(3.2, 70);
assertTest("Potassium Mild Deficit ~150 mEq", kMild.deficit === 150 && kMild.severity === 'Mild Hypokalemia', `Got ${kMild.deficit}, ${kMild.severity}`);

const kMod = engine.calcPotassiumDeficit(2.7, 70);
assertTest("Potassium Moderate Deficit ~300 mEq", kMod.deficit === 300 && kMod.severity === 'Moderate Hypokalemia', `Got ${kMod.deficit}, ${kMod.severity}`);

const kSev = engine.calcPotassiumDeficit(2.2, 70);
assertTest("Potassium Severe Deficit ~600 mEq", kSev.deficit === 600 && kSev.severity === 'Severe Hypokalemia', `Got ${kSev.deficit}, ${kSev.severity}`);
assertTest("Potassium Peripheral Rate Ceiling = 10 mEq/hr", kSev.maxPeripheralRate === 10, `Got ${kSev.maxPeripheralRate}`);
assertTest("Potassium Peripheral Conc Ceiling = 40 mEq/L", kSev.maxPeripheralConc === 40, `Got ${kSev.maxPeripheralConc}`);
assertTest("Potassium Zero Bolus Black Box Warning Present", kSev.neverBolusWarning.includes("NEVER"), `Got: ${kSev.neverBolusWarning}`);

// 6. AKI BUN:Cr Clarification (Serum Urea vs BUN)
const bunFromUrea = engine.calcBUNFromUrea(100, 'urea_mgdl');
assertTest("Serum Urea 100 mg/dL converts to BUN ~46.7 mg/dL", Math.abs(bunFromUrea - (100 / 2.14)) < 0.1, `Got ${bunFromUrea}`);

const akiNormalRatio = engine.calcBUNtoCrRatio(bunFromUrea, 2.5);
assertTest("AKI Ratio with Converted BUN = 18.7 (Normal/Post-Renal, NOT False Pre-Renal)", akiNormalRatio.category === 'Normal/Post-Renal' && Math.abs(akiNormalRatio.ratio - 18.69) < 0.1, `Got ${akiNormalRatio.ratio} (${akiNormalRatio.category})`);

const akiDirectBUN = engine.calcBUNtoCrRatio(100, 2.5);
assertTest("Direct BUN 100 with Cr 2.5 = 40.0 (Pre-Renal)", akiDirectBUN.category === 'Pre-Renal' && akiDirectBUN.ratio === 40, `Got ${akiDirectBUN.ratio} (${akiDirectBUN.category})`);

const akiZeroCr = engine.calcBUNtoCrRatio(40, 0);
assertTest("Cr = 0 Guard prevents division by zero / false ATN", akiZeroCr.ratio === null && akiZeroCr.error.includes("must be > 0.0"), `Got error: ${akiZeroCr.error}`);

// 7. Bicarbonate Deficit
const acidDeficit = engine.calcBicarbonateDeficit(70, 12, 18);
// 0.5 * 70 * (18 - 12) = 35 * 6 = 210 mEq
assertTest("Bicarbonate Deficit 70kg, 12->18 = 210 mEq", acidDeficit.deficit === 210 && acidDeficit.meylonVolumeMl === 210 && acidDeficit.initialDoseMl === 105, `Got ${acidDeficit.deficit}`);

const acidDangerTarget = engine.calcBicarbonateDeficit(70, 12, 24);
assertTest("Target HCO3 > 20 Warning Flagged", acidDangerTarget.warning && acidDangerTarget.warning.includes("NOT recommended"), `Got: ${acidDangerTarget.warning}`);

console.log(`\nResults: ${passCount} / ${totalTests} tests passed.`);
if (passCount === totalTests) {
  console.log("ALL CLINICAL INTEGRITY TESTS PASSED PERFECTLY!");
  process.exit(0);
} else {
  console.error("SOME TESTS FAILED!");
  process.exit(1);
}
