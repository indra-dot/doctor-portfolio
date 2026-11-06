// Test execution of AIH calculator functions in simulated environment
const fs = require('fs');

const scriptContent = fs.readFileSync('scratch/test_script_1.js', 'utf8');

// Simple DOM Mock
class ElementMock {
    constructor(id) {
        this.id = id;
        this.value = '';
        this.checked = false;
        this.innerHTML = '';
        this.innerText = '';
        this.classList = {
            add: (...classes) => {},
            remove: (...classes) => {},
            contains: (c) => false
        };
        this.options = [];
        this.selectedIndex = 0;
    }
    scrollIntoView() {}
    addEventListener() {}
    reset() {}
}

const elements = {};
function getEl(id) {
    if (!elements[id]) {
        elements[id] = new ElementMock(id);
    }
    return elements[id];
}

const documentMock = {
    getElementById: (id) => getEl(id),
    querySelectorAll: (sel) => [],
    createElement: (tag) => new ElementMock(tag),
    body: { appendChild: () => {}, removeChild: () => {} },
    addEventListener: () => {}
};

const windowMock = {
    lastAihResume: null,
    isSecureContext: true,
    clipboard: { writeText: () => Promise.resolve() },
    addEventListener: () => {}
};

// Set up globals
global.document = documentMock;
global.window = windowMock;
global.showToast = (msg) => console.log('Toast:', msg);

// Run the script in a VM
const vm = require('vm');
const context = vm.createContext({
    document: documentMock,
    window: windowMock,
    console: console,
    showToast: (msg) => console.log('[Simulated Toast]:', msg),
    parseFloat: parseFloat,
    isNaN: isNaN,
    Math: Math
});

vm.runInContext(scriptContent, context);

console.log('calculateAihScore exists:', typeof context.calculateAihScore);
console.log('resetAihScore exists:', typeof context.resetAihScore);
console.log('copyAihResume exists:', typeof context.copyAihResume);
console.log('autoCalcLabRatios exists:', typeof context.autoCalcLabRatios);

// Test 1: Pre-treatment female with high titers and definite AIH
getEl('aih-sex').value = 'female'; // +2
getEl('aih-alp-ratio').value = '<1.5'; // +2
getEl('aih-igg-level').value = '>2.0'; // +3
getEl('aih-main-ab').value = '>1:80'; // +3
getEl('aih-ama').value = 'neg'; // 0
getEl('aih-viral-markers').value = 'neg'; // +3
getEl('aih-drugs').value = 'no'; // +1
getEl('aih-alcohol').value = '<25'; // +2
getEl('aih-biopsy-done').value = 'yes';
getEl('aih-hist-interface').checked = true; // +3
getEl('aih-hist-lympho').checked = true; // +1
getEl('aih-hist-rosettes').checked = false;
getEl('aih-hist-biliary').checked = false;
getEl('aih-hist-other').checked = false;
getEl('aih-other-autoimmune').value = 'no';
getEl('aih-other-abs').checked = false;
getEl('aih-hla-dr').checked = false;
getEl('aih-therapy-response').value = 'none';

context.calculateAihScore();
console.log('\n--- Output for Test 1 ---');
console.log('Window lastAihResume:\n' + context.window.lastAihResume);

// Test copy
context.copyAihResume();

// Test reset
context.resetAihScore();
console.log('\nReset completed. Result container innerHTML is empty:', getEl('aih-result-container').innerHTML === '');
