const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const initFnStart = content.indexOf('function initAdjustrIo');
console.log('initFnStart:', initFnStart);

const snippet = content.substring(initFnStart, initFnStart + 1500);
console.log('--- initAdjustrIo snippet ---');
console.log(snippet);

// Find where initAdjustrIo is called or registered
const regIdx = content.indexOf('initAdjustrIo(', initFnStart + 50);
console.log('Call to initAdjustrIo index:', regIdx);
if (regIdx !== -1) {
  console.log('Snippet around call:');
  console.log(content.substring(regIdx - 200, regIdx + 300));
}
