// Test Globulin vs IgG switch
const fs = require('fs');
const scriptContent = fs.readFileSync('scratch/test_script_1.js', 'utf8');

class ElementMock {
    constructor(id) {
        this.id = id;
        this.value = '';
        this.checked = false;
        this.innerHTML = '';
        this.innerText = '';
        this.className = '';
        this.placeholder = '';
        this.step = '';
        this.classList = { add: () => {}, remove: () => {}, contains: () => false };
        this.options = [];
        this.selectedIndex = 0;
    }
    scrollIntoView() {}
    addEventListener() {}
    reset() {}
}

const elements = {};
function getEl(id) {
    if (!elements[id]) elements[id] = new ElementMock(id);
    return elements[id];
}

const documentMock = {
    getElementById: (id) => getEl(id),
    querySelectorAll: () => [],
    createElement: (tag) => new ElementMock(tag),
    body: { appendChild: () => {}, removeChild: () => {} },
    addEventListener: () => {}
};

const windowMock = {
    lastAihResume: null,
    isSecureContext: true,
    addEventListener: () => {}
};

const vm = require('vm');
const context = vm.createContext({
    document: documentMock,
    window: windowMock,
    navigator: { clipboard: { writeText: () => Promise.resolve() } },
    console: console,
    showToast: (msg) => console.log('[Toast]:', msg),
    parseFloat: parseFloat,
    isNaN: isNaN,
    Math: Math
});

vm.runInContext(scriptContent, context);

console.log('Default currentAihProteinType:', context.currentAihProteinType); // should be 'globulin'

// 1. Test autoCalc with Globulin default: Globulin 4.8, ULN 3.2 (4.8/3.2 = 1.5x -> 1.5-2.0)
getEl('aih-calc-igg').value = '4.8';
getEl('aih-calc-igg-uln').value = '3.2';
context.autoCalcLabRatios();
console.log('Globulin Auto-calc dropdown value:', getEl('aih-igg-level').value);
console.log('Globulin Auto-calc hint:', getEl('aih-lab-calc-hint').innerText);

// 2. Switch to IgG
context.switchAihProteinType('igg');
console.log('\nSwitched to IgG:');
console.log('Current protein type:', context.currentAihProteinType);
console.log('Label:', getEl('aih-protein-label').innerHTML);
console.log('Calc placeholder:', getEl('aih-calc-igg').placeholder);
console.log('Calc ULN value:', getEl('aih-calc-igg-uln').value);

// Test autoCalc with IgG: IgG 3500, ULN 1600 (3500/1600 = 2.18x -> >2.0)
getEl('aih-calc-igg').value = '3500';
getEl('aih-calc-igg-uln').value = '1600';
context.autoCalcLabRatios();
console.log('IgG Auto-calc dropdown value:', getEl('aih-igg-level').value);
console.log('IgG Auto-calc hint:', getEl('aih-lab-calc-hint').innerText);

// 3. Calculate score with IgG
getEl('aih-sex').value = 'female';
getEl('aih-alp-ratio').value = '<1.5';
getEl('aih-main-ab').value = '1:80';
getEl('aih-ama').value = 'neg';
getEl('aih-viral-markers').value = 'neg';
getEl('aih-drugs').value = 'no';
getEl('aih-alcohol').value = '<25';
getEl('aih-biopsy-done').value = 'no';
getEl('aih-other-autoimmune').value = 'no';
getEl('aih-other-abs').checked = false;
getEl('aih-hla-dr').checked = false;
getEl('aih-therapy-response').value = 'none';

context.calculateAihScore();
console.log('\nResume with IgG active:');
console.log(context.window.lastAihResume);

// 4. Test reset -> should return currentAihProteinType to globulin
context.resetAihScore();
console.log('\nAfter reset:');
console.log('Current protein type:', context.currentAihProteinType); // should be 'globulin'
console.log('Label:', getEl('aih-protein-label').innerHTML);
