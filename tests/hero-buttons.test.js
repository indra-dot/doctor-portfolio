const assert = require('assert');
const { getInternaHubEnv } = require('./harness');

console.log('--- Testing 11 IPD Subspecialty Hero Buttons & Router Navigation ---');

const dom = getInternaHubEnv();
const { window } = dom;
const { document } = window;

// 1. Initial / Default Route (Hero Launchpad)
assert.strictEqual(window.location.hash, '', 'Initial hash should be empty');
const heroButtons = document.querySelectorAll('.hero-sub-btn');
console.log(`  Found ${heroButtons.length} hero buttons in DOM.`);
assert.strictEqual(heroButtons.length, 11, 'Must render exactly 11 IPD subspecialty hero buttons');

const expectedSubs = [
  'gastro', 'nefro', 'endokrin', 'rheuma', 'hom', 'pulmo', 'kardio', 'pti', 'alergi', 'geriatri', 'psikosomatis'
];

expectedSubs.forEach(subId => {
  const btn = [...heroButtons].find(b => b.getAttribute('onclick')?.includes(`'#sub:${subId}'`));
  assert.ok(btn, `Hero button for subspecialty '${subId}' must exist in launchpad`);
});
console.log('  ✓ All 11 expected subspecialty hero buttons exist');

// 2. Test Subspecialty Navigation: Gastro
window.location.hash = '#sub:gastro';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const gastroCards = document.querySelectorAll('#view .card');
console.log(`  Navigated to #sub:gastro -> found ${gastroCards.length} cards`);
assert.strictEqual(gastroCards.length, 33, 'Gastroenterologi must display 33 calculators');
const gastroBanner = document.querySelector('.sub-banner');
assert.ok(gastroBanner, 'Subspecialty banner must be displayed');
assert.ok(gastroBanner.textContent.includes('Gastroenterologi'), 'Banner must display subspecialty name');
console.log('  ✓ #sub:gastro displays 33 calculators and banner');

// 3. Test Subspecialty Navigation: Nefrologi
window.location.hash = '#sub:nefro';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const nefroCards = document.querySelectorAll('#view .card');
console.log(`  Navigated to #sub:nefro -> found ${nefroCards.length} cards`);
assert.strictEqual(nefroCards.length, 15, 'Nefrologi must display 15 calculators');
console.log('  ✓ #sub:nefro displays 15 calculators');

// 4. Test Subspecialty Navigation: Endokrin
window.location.hash = '#sub:endokrin';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const endoCards = document.querySelectorAll('#view .card');
console.log(`  Navigated to #sub:endokrin -> found ${endoCards.length} cards`);
assert.strictEqual(endoCards.length, 22, 'Endokrin must display 22 calculators');
console.log('  ✓ #sub:endokrin displays 22 calculators');

// 5. Test Subspecialty Navigation: Geriatri & Psikosomatis
window.location.hash = '#sub:geriatri';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const geriatriCards = document.querySelectorAll('#view .card');
console.log(`  Navigated to #sub:geriatri -> found ${geriatriCards.length} cards`);
assert.strictEqual(geriatriCards.length, 9, 'Geriatri must display 9 calculators');
console.log('  ✓ #sub:geriatri displays 9 calculators');

window.location.hash = '#sub:psikosomatis';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const psikoCards = document.querySelectorAll('#view .card');
console.log(`  Navigated to #sub:psikosomatis -> found ${psikoCards.length} cards`);
assert.strictEqual(psikoCards.length, 4, 'Psikosomatis must display 4 calculators');
console.log('  ✓ #sub:psikosomatis displays 4 calculators');

// 5b. Test Empty State on Alergi
window.location.hash = '#sub:alergi';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const emptyBox = document.querySelector('.empty-state-box');
assert.ok(emptyBox, 'Empty state box must be displayed for empty subspecialties');
assert.ok(emptyBox.textContent.includes('Alergi'), 'Empty state mentions Alergi');
console.log('  ✓ #sub:alergi displays elegant empty state');

// 6. Test Direct Calculator Hash: #curb65
window.location.hash = '#curb65';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const calcTitle = document.querySelector('#view h2');
assert.strictEqual(calcTitle.textContent, 'CURB-65', 'Calculator title must match');
const backBtns = document.querySelectorAll('#view .btn');
const backToPulmo = [...backBtns].find(b => b.textContent.includes('Pulmo'));
assert.ok(backToPulmo, 'Calculator must have back button to parent subspecialty (Pulmo)');
console.log('  ✓ #curb65 displays calculator with back button to Pulmo');

// 7. Test Return to Hero Launchpad
window.location.hash = '';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
const returnedHeroBtns = document.querySelectorAll('.hero-sub-btn');
assert.strictEqual(returnedHeroBtns.length, 11, 'Returning to empty hash displays 11 hero buttons');
console.log('  ✓ Returning to empty hash restores 11 hero buttons');

console.log('\n✓ ALL 11 HERO BUTTON & ROUTER TESTS PASSED!\n');
