/**
 * tests/run-all-tests.js
 * 
 * Master test runner for InternaHub clinical calculation audit suite.
 */

const nephroTest = require('./calc/nephro-electrolytes.test');
const endoTest = require('./calc/endocrinology-metabolic.test');
const critTest = require('./calc/critical-care-pulm.test');
const rheumaTest = require('./calc/rheumatology.test');
const antiTest = require('./calc/antimicrobial.test');
const parserTest = require('./calc/clinical-parser.test');
const { execSync } = require('child_process');

async function main() {
  console.log('====================================================');
  console.log('   INTERNAHUB CLINICAL CALCULATION AUDIT SUITE      ');
  console.log('====================================================');

  // Step 1: Run Syntax & Leaked Script Check
  console.log('\n[PHASE 1: SYNTAX & SCRIPT INTEGRITY CHECK]');
  try {
    execSync('node scripts/check-html-scripts.js internahub.html', { stdio: 'inherit' });
    console.log('✓ Syntax and script tags validated without errors.');
  } catch (err) {
    console.error('❌ Script integrity check failed!');
    process.exit(1);
  }

  // Step 2: Run Clinical Formula Verification Suites
  console.log('\n[PHASE 2: CLINICAL FORMULAS BENCHMARK SUITES]');
  let totalPassed = 0;
  let totalFailed = 0;

  const suites = [
    { name: 'Nephrology & Electrolytes', fn: nephroTest.runTests },
    { name: 'Endocrinology & Metabolic', fn: endoTest.runTests },
    { name: 'Critical Care & Pulmonology', fn: critTest.runTests },
    { name: 'Rheumatology Scoring', fn: rheumaTest.runTests },
    { name: 'Antimicrobial Dosing (Adjustr-IO)', fn: antiTest.runTests },
    { name: 'SIMETRISS / CPPT Clinical Parser', fn: parserTest.runTests }
  ];

  for (const suite of suites) {
    try {
      const res = await suite.fn();
      totalPassed += res.passed;
      totalFailed += res.failed;
    } catch (err) {
      console.error(`❌ Suite '${suite.name}' threw unhandled exception:`, err);
      totalFailed++;
    }
  }

  console.log('\n====================================================');
  console.log(`TOTAL BENCHMARK TESTS RUN: ${totalPassed + totalFailed}`);
  console.log(`PASSED: ${totalPassed}`);
  console.log(`FAILED: ${totalFailed}`);
  console.log('====================================================');

  if (totalFailed > 0) {
    console.error(`\n❌ Clinical test suite failed with ${totalFailed} errors.`);
    process.exit(1);
  } else {
    console.log('\n✓ ALL CLINICAL CALCULATION AUDIT TESTS PASSED CLEANLY!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
