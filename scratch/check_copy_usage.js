const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const regex = /function\s+copy[a-zA-Z0-9_]*\s*\(/g;
let m;
const copyFuncs = [];
while ((m = regex.exec(content)) !== null) {
    copyFuncs.push(m[0]);
}
console.log('Copy functions:', copyFuncs);

// Let's check 3 places where copyToClipboard is used in HTML
const regex2 = /copyToClipboard\([^)]+\)/g;
let m2;
let c = 0;
while ((m2 = regex2.exec(content)) !== null && c < 5) {
    console.log(`Usage ${++c}:`, m2[0]);
}
