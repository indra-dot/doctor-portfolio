const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'Calc-Med.html'), 'utf8');

// Check tokens
console.log('Checking static tokens in Calc-Med.html...');
if (!html.includes('#040814')) throw new Error('Missing #040814 obsidian token');
if (!html.includes('mailto:putrawan.2371041010@student.unud.ac.id')) throw new Error('Missing contact mailto');
if (!html.includes('toast-notice')) throw new Error('Missing toast-notice');
if (!html.includes('CALCULATORS_DB')) throw new Error('Missing CALCULATORS_DB');

// Extract script
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/i);
if (!scriptMatch) throw new Error('Script block not found in Calc-Med.html');
const scriptContent = scriptMatch[1];

// Mock DOM
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
  String: String,
  Math: Math
};

const context = vm.createContext(sandbox);
vm.runInContext(scriptContent, context);
console.log('Calc-Med script parsed and executed without errors!');

// Test NE calculation
dom.elements['ne-bb'] = { value: '50' };
dom.elements['ne-mg'] = { value: '8' };
dom.elements['ne-cc'] = { value: '50' };
dom.elements['ne-conc'] = { innerText: '' };
dom.elements['ne-cppt'] = { innerText: '' };
context.calcNE();
console.log('NE conc:', dom.elements['ne-conc'].innerText);
if (dom.elements['ne-conc'].innerText !== '160') throw new Error('NE conc mismatch');

// Test Dobu calculation
dom.elements['dobu-bb'] = { value: '80' };
dom.elements['dobu-mg'] = { value: '500' };
dom.elements['dobu-cc'] = { value: '50' };
dom.elements['dobu-conc'] = { innerText: '' };
dom.elements['dobu-cppt'] = { innerText: '' };
context.calcDobu();
console.log('Dobu conc:', dom.elements['dobu-conc'].innerText);
if (dom.elements['dobu-conc'].innerText !== '10000') throw new Error('Dobu conc mismatch');

// Test Nicardipine calculation
dom.elements['nica-bb'] = { value: '40' };
dom.elements['nica-mg'] = { value: '10' };
dom.elements['nica-cc'] = { value: '50' };
dom.elements['nica-conc'] = { innerText: '' };
dom.elements['nica-cppt'] = { innerText: '' };
context.calcNica();
console.log('Nica conc:', dom.elements['nica-conc'].innerText);
if (dom.elements['nica-conc'].innerText !== '200') throw new Error('Nica conc mismatch');

console.log('ALL CALC-MED TESTS PASSED 100%!');
