const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const htmlPath = path.resolve(__dirname, '../../rheumatools.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('=== VERIFYING RHEUMATOOLS.HTML INTEGRITY & ACCURACY ===');

// Check 1: Design and Iframe Attributes
console.log('\n[Check 1] Checking Design & Iframe Attributes...');
assert(htmlContent.includes('#040814'), 'Must contain #040814 deep obsidian background');
assert(htmlContent.includes('rgba(15, 23, 42'), 'Must contain frosted glassmorphism rgba(15, 23, 42)');
assert(htmlContent.includes('#00F2FE'), 'Must contain #00F2FE cyan highlight');
assert(htmlContent.includes('#4FACFE'), 'Must contain #4FACFE blue highlight');
assert(htmlContent.includes('mailto:putrawan.2371041010@student.unud.ac.id'), 'Must contain contact email link');
assert(!htmlContent.includes('cdn.tailwindcss.com'), 'Must NOT depend on client-side Tailwind CDN');
assert(!htmlContent.includes('h-screen overflow-hidden'), 'Must NOT have h-screen overflow-hidden scroll trap');
assert(htmlContent.includes('data:image/png;base64,'), 'Must contain base64 mRSS diagram');
console.log('✓ Design and iframe compatibility verified.');

// Check 2: Extract embedded script and test syntax
console.log('\n[Check 2] Checking Embedded JavaScript Syntax...');
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
assert(scriptMatch, 'Must find <script> tag in rheumatools.html');
const scriptCode = scriptMatch[1];

// Compile in VM to check syntax
try {
  new vm.Script(scriptCode);
  console.log('✓ Embedded JavaScript syntax is completely valid (no parse errors).');
} catch (e) {
  console.error('Syntax Error in embedded JS:', e);
  process.exit(1);
}

// Check 3: Extract RheumaCalc engine and test clinical calculations
console.log('\n[Check 3] Testing Clinical Calculation Logic in Sandbox...');

// Create minimal DOM sandbox
const sandbox = {
  console,
  document: {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => [],
    querySelector: () => null
  },
  window: {
    scrollTo: () => {}
  }
};
vm.createContext(sandbox);

const startIndex = scriptCode.indexOf('const RheumaCalc =');
const endIndex = scriptCode.indexOf('/* --- DOM & UI LOGIC --- */');
assert(startIndex !== -1 && endIndex !== -1, 'Must find RheumaCalc bounds');

const calcEngineCode = scriptCode.substring(startIndex, endIndex) + '\nthis.RheumaCalc = RheumaCalc;';
vm.runInContext(calcEngineCode, sandbox);
const RheumaCalc = sandbox.RheumaCalc;
assert(RheumaCalc, 'RheumaCalc must be instantiated in sandbox');

// Test 3.1: Benchmark Patient Scenario (TJC=6, SJC=4, CRP=15, PGA=40)
const b1 = RheumaCalc.calculateDAS28_CRP(6, 4, 15, 40);
console.log('Benchmark Result (TJC=6, SJC=4, CRP=15, PGA=40):', b1);
assert.strictEqual(b1.score, '4.45', 'Benchmark DAS28-CRP score must be exactly 4.45');
assert.strictEqual(b1.activity.level, 'Moderate', 'Activity level must be Moderate');

// Test 3.2: Zero-CRP Calculation Bypass Fix
const b2 = RheumaCalc.calculateDAS28_CRP(10, 5, 0, 50);
console.log('Zero-CRP Result (TJC=10, SJC=5, CRP=0, PGA=50):', b2);
assert.strictEqual(b2.score, '4.06', 'Zero-CRP must calculate joint & PGA score, not 0.00');
assert.strictEqual(b2.activity.level, 'Moderate', 'Zero-CRP patient with 15 active joints must be Moderate, not Remission');

// Test 3.3: True Zero Remission
const b3 = RheumaCalc.calculateDAS28_CRP(0, 0, 0, 0);
console.log('True Zero Remission (TJC=0, SJC=0, CRP=0, PGA=0):', b3);
assert.strictEqual(b3.score, '0.96', 'True zero score is baseline constant 0.96');
assert.strictEqual(b3.activity.level, 'Remission');

// Test 3.4: DAS28-ESR Calculation & Guardrails
const esr1 = RheumaCalc.calculateDAS28_ESR(6, 4, 30, 40);
console.log('DAS28-ESR Result (TJC=6, SJC=4, ESR=30, PGA=40):', esr1);
assert.strictEqual(esr1.score, '4.87');
assert.strictEqual(esr1.activity.level, 'Moderate');

// DAS28-ESR guardrails: ESR must be >= 1 mm/hr
assert.throws(() => RheumaCalc.calculateDAS28_ESR(6, 4, 0, 40), /LED \/ ESR Westergren harus >= 1 mm\/jam/);
assert.throws(() => RheumaCalc.calculateDAS28_ESR(6, 4, -5, 40), /LED \/ ESR Westergren harus >= 1 mm\/jam/);

// Test 3.5: CDAI Implementation
const cdai1 = RheumaCalc.calculateCDAI(4, 2, 3.5, 2.0);
console.log('CDAI Result (TJC=4, SJC=2, PGA=3.5, EGA=2.0):', cdai1);
assert.strictEqual(cdai1.score, '11.50');
assert.strictEqual(cdai1.activity.level, 'Moderate');

// Test 3.6: SDAI Implementation (with CRP in mg/dL)
const sdai1 = RheumaCalc.calculateSDAI(4, 2, 3.5, 2.0, 1.2);
console.log('SDAI Result (CDAI 11.5 + CRP 1.2 mg/dL):', sdai1);
assert.strictEqual(sdai1.score, '12.70');
assert.strictEqual(sdai1.activity.level, 'Moderate');

// Test 3.7: DAPSA Implementation
const dapsa1 = RheumaCalc.calculateDAPSA(5, 3, 1.5, 4, 3);
console.log('DAPSA Result (TJC=5, SJC=3, CRP=1.5, PGA=4, Pain=3):', dapsa1);
assert.strictEqual(dapsa1.score, '16.50');
assert.strictEqual(dapsa1.activity.level, 'Moderate');

// Test 3.8: BASDAI Implementation
const basdai1 = RheumaCalc.calculateBASDAI(4, 5, 3, 4, 6, 6);
console.log('BASDAI Result (Q1=4, Q2=5, Q3=3, Q4=4, Q5=6, Q6=6):', basdai1);
assert.strictEqual(basdai1.score, '4.40');
assert.strictEqual(basdai1.active, true);

// Test 3.9: Boundary and Negative Input Validation Guardrails
assert.throws(() => RheumaCalc.calculateDAS28_CRP(-1, 4, 15, 40), /TJC28 harus berada di antara 0 dan 28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(30, 4, 15, 40), /TJC28 harus berada di antara 0 dan 28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, -2, 15, 40), /SJC28 harus berada di antara 0 dan 28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 35, 15, 40), /SJC28 harus berada di antara 0 dan 28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 4, -1, 40), /Kadar CRP harus >= 0 mg\/L/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 4, 15, -10), /PGA VAS harus berada di antara 0 dan 100/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 4, 15, 110), /PGA VAS harus berada di antara 0 dan 100/);

// Test 3.10: Empty/Blank Input Guardrails (prevent false remission!)
assert.throws(() => RheumaCalc.calculateDAS28_CRP('', 4, 15, 40), /TJC28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, '', 15, 40), /SJC28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 4, '', 40), /Kadar CRP/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 4, 15, ''), /PGA/);

// Test 3.11: Cutoff Accuracy Across Scales
assert.strictEqual(RheumaCalc.classifyDAS28(2.60).level, 'Remission');
assert.strictEqual(RheumaCalc.classifyDAS28(2.61).level, 'Low');
assert.strictEqual(RheumaCalc.classifyDAS28(3.20).level, 'Low');
assert.strictEqual(RheumaCalc.classifyDAS28(3.21).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyDAS28(5.10).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyDAS28(5.11).level, 'High');

assert.strictEqual(RheumaCalc.classifyCDAI(2.80).level, 'Remission');
assert.strictEqual(RheumaCalc.classifyCDAI(2.81).level, 'Low');
assert.strictEqual(RheumaCalc.classifyCDAI(10.00).level, 'Low');
assert.strictEqual(RheumaCalc.classifyCDAI(10.01).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyCDAI(22.00).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyCDAI(22.01).level, 'High');

assert.strictEqual(RheumaCalc.classifySDAI(3.30).level, 'Remission');
assert.strictEqual(RheumaCalc.classifySDAI(3.31).level, 'Low');
assert.strictEqual(RheumaCalc.classifySDAI(11.00).level, 'Low');
assert.strictEqual(RheumaCalc.classifySDAI(11.01).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifySDAI(26.00).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifySDAI(26.01).level, 'High');

console.log('\n=== ALL VERIFICATION TESTS PASSED PERFECTLY WITH ZERO ERRORS ===');
