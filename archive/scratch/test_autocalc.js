// Test autoCalcLabRatios
const fs = require('fs');
const scriptContent = fs.readFileSync('scratch/test_script_1.js', 'utf8');

class ElementMock {
    constructor(id) {
        this.id = id;
        this.value = '';
        this.checked = false;
        this.innerHTML = '';
        this.innerText = '';
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

// Test autoCalcLabRatios: ALP 120, AST 180, ALT 240, IgG 3400, ULN 1600
getEl('aih-calc-alp').value = '120';
getEl('aih-calc-ast').value = '180';
getEl('aih-calc-alt').value = '240';
getEl('aih-calc-igg').value = '3400';
getEl('aih-calc-igg-uln').value = '1600';

context.autoCalcLabRatios();
console.log('Selected ALP ratio:', getEl('aih-alp-ratio').value); // Expected: '<1.5' (120/240 = 0.5)
console.log('Selected IgG level:', getEl('aih-igg-level').value); // Expected: '>2.0' (3400/1600 = 2.125)
console.log('Hint text:', getEl('aih-lab-calc-hint').innerText);
