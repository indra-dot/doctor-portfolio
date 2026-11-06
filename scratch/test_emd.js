const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'adjustr-emd.html'), 'utf8');

// Check obsidian tokens and contact
console.log('Checking static tokens in adjustr-emd.html...');
if (!html.includes('#040814')) throw new Error('Missing #040814 obsidian token');
if (!html.includes('mailto:putrawan.2371041010@student.unud.ac.id')) throw new Error('Missing contact mailto');
if (!html.includes('toast-notice')) throw new Error('Missing toast-notice');
if (!html.includes('CALCULATORS_DB')) throw new Error('Missing CALCULATORS_DB');

// Extract script
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/i);
if (!scriptMatch) throw new Error('Script block not found in adjustr-emd.html');
const scriptContent = scriptMatch[1];

// Create mock DOM environment
const dom = {
  elements: {},
  getElementById: function(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        value: '',
        textContent: '',
        innerText: '',
        innerHTML: '',
        className: '',
        style: {},
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
          replace: () => {}
        },
        querySelectorAll: () => [],
        addEventListener: () => {}
      };
    }
    return this.elements[id];
  },
  querySelectorAll: function(sel) {
    return [];
  },
  addEventListener: () => {}
};

const sandbox = {
  document: dom,
  window: {
    scrollTo: () => {},
    innerWidth: 1200
  },
  console: console,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  isFinite: isFinite,
  Number: Number,
  Math: Math
};

const context = vm.createContext(sandbox);
vm.runInContext(scriptContent, context);
console.log('Script parsed and executed without errors!');

// Test clinical calculations
// 1. Osmolarity: 2 * 140 + 600 / 18 = 313.33
dom.elements['osmo-na'] = { value: '140' };
dom.elements['osmo-glu'] = { value: '600' };
dom.elements['res-osmo'] = { textContent: '' };
context.calcOsmo();
console.log('Effective Osmolarity:', dom.elements['res-osmo'].textContent);
if (dom.elements['res-osmo'].textContent !== '313.3') throw new Error('Osmolarity mismatch');

// 2. Anion Gap & Corrected Na: na=140, cl=100, hco3=24, glu=250
dom.elements['ag-na'] = { value: '140' };
dom.elements['ag-cl'] = { value: '100' };
dom.elements['ag-hco3'] = { value: '24' };
dom.elements['ag-glu'] = { value: '250' };
dom.elements['res-ag'] = { textContent: '' };
dom.elements['res-cna'] = { textContent: '' };
context.calcAG();
console.log('Anion Gap:', dom.elements['res-ag'].textContent, 'Corrected Na:', dom.elements['res-cna'].textContent);
if (dom.elements['res-ag'].textContent !== '16.0') throw new Error('Anion Gap mismatch');
if (dom.elements['res-cna'].textContent !== '142.4') throw new Error('Corrected Na mismatch');

// 3. TyG: tg=150, glu=100 -> ln(7500) = 8.92
dom.elements['tyg-tg'] = { value: '150' };
dom.elements['tyg-glu'] = { value: '100' };
dom.elements['res-tyg'] = { textContent: '' };
// 4. HOMA-IR: ins=15, glu=100 -> 3.70
dom.elements['homa-ins'] = { value: '15' };
dom.elements['homa-glu'] = { value: '100' };
dom.elements['res-homa'] = { textContent: '' };
// 5. Friedewald: tc=200, hdl=45, tg=150 -> 125.0
dom.elements['lip-tc'] = { value: '200' };
dom.elements['lip-hdl'] = { value: '45' };
dom.elements['lip-tg'] = { value: '150' };
dom.elements['res-ldl'] = { textContent: '', className: '' };
context.calcMetabolic();
console.log('TyG:', dom.elements['res-tyg'].textContent, 'HOMA-IR:', dom.elements['res-homa'].textContent, 'LDL:', dom.elements['res-ldl'].textContent);
if (dom.elements['res-tyg'].textContent !== '8.92') throw new Error('TyG mismatch');
if (dom.elements['res-homa'].textContent !== '3.70') throw new Error('HOMA mismatch');
if (dom.elements['res-ldl'].textContent !== '125.0') throw new Error('LDL mismatch');

console.log('ALL ADJUSTER-EMD CHECKS PASSED 100%!');
