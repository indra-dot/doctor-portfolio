const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const drugDbMatches = [...content.matchAll(/const\s+DRUG_DATABASE\s*=/g)];
console.log('DRUG_DATABASE occurrences:', drugDbMatches.length);
drugDbMatches.forEach(m => {
  const line = content.substring(0, m.index).split('\n').length;
  console.log('Found DRUG_DATABASE at line:', line, 'pos:', m.index);
});

// Check if DRUG_DATABASE is referenced in initAdjustrIo
const initFnStart = content.indexOf('function initAdjustrIo');
const nextFn = content.indexOf('reg({', initFnStart);
const initBody = content.substring(initFnStart, nextFn);
console.log('initAdjustrIo references DRUG_DATABASE:', initBody.includes('DRUG_DATABASE'));
console.log('initAdjustrIo defines DRUG_DATABASE:', initBody.includes('const DRUG_DATABASE'));
