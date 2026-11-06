const drugDatabase = require('./build_drug_data');

function matchAdjustment(adjustments, crcl) {
  if (!adjustments || adjustments.length === 0) return null;
  // Sort descending by minCrCl
  const sorted = [...adjustments].sort((a, b) => b.minCrCl - a.minCrCl);
  for (const adj of sorted) {
    if (crcl >= adj.minCrCl) {
      return adj;
    }
  }
  // Safe fallback to most restrictive tier, NEVER standard dose!
  return sorted[sorted.length - 1];
}

const testCrCls = [
  0, 0.5, 1.0, 2.5, 4.95, 5.0, 9.95, 10.0, 10.05, 14.95, 15.0, 19.95, 20.0,
  24.95, 25.0, 25.95, 26.0, 29.95, 30.0, 30.05, 34.95, 35.0, 39.95, 40.0,
  49.95, 50.0, 50.05, 59.95, 60.0, 69.95, 70.0, 89.95, 90.0, 120.0
];

let totalCases = 0;
let errors = 0;

for (const [key, drug] of Object.entries(drugDatabase)) {
  let stratList = [];
  if (drug.isMultiStrategy) {
    for (const [sname, sdata] of Object.entries(drug.strategies)) {
      stratList.push({ name: sname, data: sdata });
    }
  } else {
    stratList.push({ name: 'default', data: drug });
  }

  for (const strat of stratList) {
    // Check RRT exists
    const rrt = strat.data.rrt || drug.rrt;
    if (!rrt || !rrt.ihd || !rrt.crrt) {
      console.error(`ERROR: Drug [${key}] strat [${strat.name}] missing RRT data!`);
      errors++;
    }

    for (const crcl of testCrCls) {
      totalCases++;
      const adj = matchAdjustment(strat.data.adjustments, crcl);
      if (!adj || !adj.recommendation) {
        console.error(`ERROR: Drug [${key}] strat [${strat.name}] CrCl=${crcl} returned null or no recommendation!`);
        errors++;
      }
      // If CrCl < 10, check that recommendation is not standard dose (for drugs that adjust)
      if (crcl < 10 && strat.data.adjustments.length > 1) {
        const topTier = strat.data.adjustments[0];
        const lowestTier = strat.data.adjustments[strat.data.adjustments.length - 1];
        if (adj.recommendation === topTier.recommendation && topTier.recommendation !== lowestTier.recommendation) {
          console.error(`CRITICAL: Drug [${key}] strat [${strat.name}] at CrCl=${crcl} falsely matched top tier!`);
          errors++;
        }
      }
    }
  }
}

console.log(`Ran ${totalCases} continuous range tests across 36 drugs. Errors: ${errors}`);
if (errors > 0) process.exit(1);
console.log("All continuous interval tests PASSED!");
