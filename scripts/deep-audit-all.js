const fs = require('fs');
const { getAllModules } = require('../tests/harness');

const modules = getAllModules();
const internahubMap = new Map();
modules.forEach(m => {
  internahubMap.set(m.id, m);
});

console.log('=== AUDIT PER LEGACY FILE ===\n');

// 1. adjustr-emd.html
console.log('1. AUDITING adjustr-emd.html:');
// Tools in adjustr-emd:
// - calcBWPS -> bwps
// - calcWayne -> wayne
// - calcBillewicz -> billewicz
// - calcMyxedema -> myxedema
// - calcAdrenalCrisis -> adrenal
// - calcPAS -> apoplexy
// - calcOsmo -> osmo
// - calcAG -> ag-delta & anion-gap
// - calcDKATracker -> dka-tracker
// - calcHypoglycemia -> hypoglycemia
// - calcInsulin -> insulin-tdd
// - calcMetabolic (TyG, HOMA-IR, Friedewald) -> tyg, homa-ir, friedewald
// - calcAIP -> aip
// - calcASCVD -> ascvd
// - calcHbA1cToEAG -> hba1c-eag
// - Bridging Insulin -> ins-bridge
// Check all against internahub:
const emdTools = [
  'bwps', 'wayne', 'billewicz', 'myxedema', 'adrenal', 'apoplexy',
  'osmo', 'ag-delta', 'anion-gap', 'dka-tracker', 'hypoglycemia',
  'insulin-tdd', 'tyg', 'homa-ir', 'friedewald', 'aip', 'ascvd',
  'hba1c-eag', 'ins-bridge', 'corr-na'
];
emdTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// 2. adjustr-fluid.html
console.log('\n2. AUDITING adjustr-fluid.html:');
const fluidTools = [
  'maint-fluid', 'hypoNa', 'hyperNa', 'k-mgmt', 'ca-mgmt', 'mg-mgmt', 'po4-mgmt', 'aki-bun-cr', 'abg'
];
fluidTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// 3. Calc-Med.html
console.log('\n3. AUDITING Calc-Med.html:');
const calcMedTools = [
  'pump-ne', 'pump-dobu', 'pump-dopa', 'pump-nica', 'pump-ntg', 'ins-bridge', 'hyperNa', 'abg'
];
calcMedTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// 4. adjustr-HOM.html
console.log('\n4. AUDITING adjustr-HOM.html:');
const homTools = [
  'mascc', 'cisne', 'tls', 'cacorr', 'redflag', 'calvert', 'bsa', 'antiemetic', 'organ',
  'khorana', '4ts', 'isth', 'plasmic', 'acplt', 'ganzoni', 'prc', 'cci', 'pltthr', 'riss', 'ipi'
];
homTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// 5. adjustr-io.html
console.log('\n5. AUDITING adjustr-io.html:');
const ioTools = ['adjustr-io', 'crcl-cockcroft', 'ckd-epi-2021'];
ioTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// 6. rheumatools.html
console.log('\n6. AUDITING rheumatools.html:');
const rheumaTools = [
  'diag-approach', 'ra-acr', 'das28-crp', 'das28-esr', 'cdai', 'sdai', 'sle-eular',
  'sledai-2k', 'mex-sledai', 'caspar', 'dapsa', 'as-asas', 'basdai', 'ssc-acr',
  'mrss', 'gout-acr', 'steinbrocker'
];
rheumaTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// 7. adjustr-GEH.html
console.log('\n7. AUDITING adjustr-GEH.html:');
const gehTools = [
  'gbs', 'oakland', 'aims65', 'antithrombotic', 'forrest', 'rockall',
  'fib4-apri', 'maddrey-lille', 'clif-aclf', 'baveno', 'ctp', 'meld',
  'saag', 'rfactor', 'deritis', 'nfs', 'lft-profile', 'aih', 'espen-nutrition',
  'tg18', 'atlanta', 'cdiff', 'bisap', 'ranson', 'truelove', 'mayo',
  'cdai-hbi', 'calprotectin', 'la-grade', 'lyon', 'rome4-ibs', 'rome4-dyspepsia', 'polyp'
];
gehTools.forEach(t => {
  console.log(`  [${internahubMap.has(t) ? '✓' : '❌'}] ${t}: ${internahubMap.get(t)?.nama || 'NOT FOUND'}`);
});

// Check if any legacy file has something that wasn't covered above!
