const FluidElectrolyteEngine = {
  calcHollidaySegar: function(weight) {
    if (!weight || weight <= 0 || isNaN(weight)) return 0;
    if (weight <= 10) return weight * 100;
    if (weight <= 20) return 1000 + (weight - 10) * 50;
    return 1500 + (weight - 20) * 20;
  },

  calcHourlyHollidaySegar: function(weight) {
    if (!weight || weight <= 0 || isNaN(weight)) return 0;
    if (weight <= 10) return weight * 4;
    if (weight <= 20) return 40 + (weight - 10) * 2;
    return 60 + (weight - 20) * 1;
  },

  calcDevineIBW: function(heightCm, sex) {
    if (!heightCm || heightCm <= 0 || isNaN(heightCm)) return 0;
    const heightInches = heightCm * 0.393701;
    const isFemale = (sex === 'Wanita' || sex === 'female' || sex === 'Female');
    const base = isFemale ? 45.5 : 50.0;
    if (heightInches < 60) {
      return Math.max(30, base - 1.5 * (60 - heightInches));
    }
    return base + 2.3 * (heightInches - 60);
  },

  calcABW: function(actualWeight, ibw) {
    if (!actualWeight || !ibw || actualWeight <= ibw) return actualWeight;
    return ibw + 0.4 * (actualWeight - ibw);
  },

  calcAdultMaintenance: function(weight, status) {
    const rate = (status === 'restricted' || status === 'CHF/CKD') ? 20 : 30;
    return weight * rate;
  },

  calcUOPRate: function(uopMl, weightKg, hours) {
    if (!uopMl || !weightKg || !hours || weightKg <= 0 || hours <= 0) return 0;
    return uopMl / (weightKg * hours);
  },

  calcNetBalance: function(intakeTotal, uopMl, giLoss, insensibleLoss) {
    const totalOut = (uopMl || 0) + (giLoss || 0) + (insensibleLoss || 0);
    return (intakeTotal || 0) - totalOut;
  },

  getTBWFactor: function(sex, ageGroup) {
    const isFemale = (sex === 'Wanita' || sex === 'female' || sex === 'Female');
    const isElderly = (ageGroup === 'lansia' || ageGroup === 'elderly' || ageGroup === '>=65');
    const isChild = (ageGroup === 'anak' || ageGroup === 'child' || ageGroup === '<18');
    if (isChild) return 0.60;
    if (isFemale) return isElderly ? 0.45 : 0.50;
    return isElderly ? 0.50 : 0.60;
  },

  calcTBW: function(weight, sex, ageGroup) {
    if (!weight || weight <= 0 || isNaN(weight)) return 0;
    const factor = this.getTBWFactor(sex, ageGroup);
    return weight * factor;
  },

  calcAdrogueMadias: function(serumNa, infusateNa, infusateK, tbw) {
    if (!tbw || tbw <= 0) return 0;
    const k = infusateK || 0;
    return ((infusateNa + k) - serumNa) / (tbw + 1);
  },

  calcHyponatremia: function(params) {
    const tbw = this.calcTBW(params.weight, params.sex, params.ageGroup);
    const deltaNaPerLiter = this.calcAdrogueMadias(params.serumNa, params.infusateNa, params.infusateK || 0, tbw);
    const targetRise = params.targetRise24h;

    const isDangerODS = targetRise > 10;
    const isWarningODS = (params.isHighRisk && targetRise > 8) || (!params.isHighRisk && targetRise > 8 && targetRise <= 10);
    const isHighRiskExceeded = params.isHighRisk && targetRise > 8;

    let totalVolumeMl = 0;
    let hourlyRateMl = 0;
    if (deltaNaPerLiter > 0) {
      totalVolumeMl = (targetRise / deltaNaPerLiter) * 1000;
      hourlyRateMl = totalVolumeMl / 24;
    }

    return {
      tbw: tbw,
      deltaNaPerLiter: deltaNaPerLiter,
      totalVolumeMl: totalVolumeMl,
      hourlyRateMl: hourlyRateMl,
      targetRise: targetRise,
      isDangerODS: isDangerODS,
      isWarningODS: isWarningODS,
      isHighRiskExceeded: isHighRiskExceeded
    };
  },

  calcPotassiumDeficit: function(serumK, weight) {
    if (!serumK || isNaN(serumK)) return { deficit: 0, severity: 'Normal' };
    let severity = 'Normal';
    let deficit = 0;
    if (serumK >= 5.5) {
      severity = 'Hyperkalemia';
      deficit = 0;
    } else if (serumK >= 3.5) {
      severity = 'Normal';
      deficit = 0;
    } else if (serumK >= 3.0) {
      severity = 'Mild Hypokalemia';
      deficit = 150;
    } else if (serumK >= 2.5) {
      severity = 'Moderate Hypokalemia';
      deficit = 300;
    } else {
      severity = 'Severe Hypokalemia';
      deficit = 600;
    }
    return { deficit: deficit, severity: severity };
  },

  calcBUNFromUrea: function(value, unit) {
    if (!value || isNaN(value)) return 0;
    if (unit === 'urea_mgdl') {
      return value / 2.14;
    } else if (unit === 'urea_mmol') {
      return value * 2.80;
    }
    return value;
  },

  calcBUNtoCrRatio: function(bunMgDl, serumCr) {
    if (!serumCr || serumCr <= 0 || isNaN(serumCr)) {
      return { ratio: null, category: 'Invalid', error: 'Serum Creatinine must be > 0.0 mg/dL' };
    }
    const ratio = bunMgDl / serumCr;
    let category = ratio > 20 ? 'Pre-Renal' : (ratio < 10 ? 'Intrinsic' : 'Normal/Post-Renal');
    return { ratio: ratio, category: category, error: null };
  }
};

// Unit verification runs
console.log("--- TEST RUNS ---");

// Test 1: Holliday-Segar 15 kg child
const hs15 = FluidElectrolyteEngine.calcHollidaySegar(15);
console.log(`HS 15kg: ${hs15} mL (expected: 1250) -> ${hs15 === 1250 ? 'PASS' : 'FAIL'}`);

// Test 2: Holliday-Segar 70 kg adult
const hs70 = FluidElectrolyteEngine.calcHollidaySegar(70);
console.log(`HS 70kg: ${hs70} mL (expected: 2500) -> ${hs70 === 2500 ? 'PASS' : 'FAIL'}`);

// Test 3: Scenario 2 - Severe Hyponatremia (60yo Male, 70kg, Na 115, 3% saline)
const hypoTestSafe = FluidElectrolyteEngine.calcHyponatremia({
  weight: 70,
  sex: 'Male',
  ageGroup: 'dewasa', // < 65
  serumNa: 115,
  targetRise24h: 6,
  infusateNa: 513,
  infusateK: 0,
  isHighRisk: false
});
console.log(`Hypo TBW: ${hypoTestSafe.tbw} L (expected: 42) -> ${hypoTestSafe.tbw === 42 ? 'PASS' : 'FAIL'}`);
console.log(`Hypo DeltaNa/L: ${hypoTestSafe.deltaNaPerLiter.toFixed(4)} (expected: ~9.2558)`);
console.log(`Hypo Safe 6 mEq/24h Rate: ${hypoTestSafe.hourlyRateMl.toFixed(1)} mL/hr, isDanger: ${hypoTestSafe.isDangerODS} (expected: false) -> ${!hypoTestSafe.isDangerODS ? 'PASS' : 'FAIL'}`);

const hypoTestDanger = FluidElectrolyteEngine.calcHyponatremia({
  weight: 70,
  sex: 'Male',
  ageGroup: 'dewasa',
  serumNa: 115,
  targetRise24h: 12,
  infusateNa: 513,
  infusateK: 0,
  isHighRisk: false
});
console.log(`Hypo Danger 12 mEq/24h isDanger: ${hypoTestDanger.isDangerODS} (expected: true) -> ${hypoTestDanger.isDangerODS ? 'PASS' : 'FAIL'}`);

// Test 4: AKI BUN:Cr
const bunFromUrea = FluidElectrolyteEngine.calcBUNFromUrea(100, 'urea_mgdl');
console.log(`Urea 100 mg/dL -> BUN: ${bunFromUrea.toFixed(2)} mg/dL (expected: ~46.73)`);
const akiRatio = FluidElectrolyteEngine.calcBUNtoCrRatio(bunFromUrea, 2.5);
console.log(`AKI Ratio: ${akiRatio.ratio.toFixed(2)} (${akiRatio.category}) (expected: 18.69, Normal/Post-Renal) -> ${akiRatio.category === 'Normal/Post-Renal' ? 'PASS' : 'FAIL'}`);

const akiZeroCr = FluidElectrolyteEngine.calcBUNtoCrRatio(bunFromUrea, 0);
console.log(`AKI Cr=0 Guard: ${akiZeroCr.error} -> ${akiZeroCr.ratio === null ? 'PASS' : 'FAIL'}`);
