const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('function initAdjustrIo');
const nextFn = content.indexOf('reg({', p);
const body = content.substring(p, nextFn);

const fnMatches = [...body.matchAll(/function\s+([a-zA-Z0-9_$]+)/g)].map(m => m[1]);
console.log('Functions inside initAdjustrIo:', fnMatches);
