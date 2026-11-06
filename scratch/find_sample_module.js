const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const sample = 'function calculateRome4IBS';
const idx = content.indexOf(sample);
console.log(content.substring(idx, idx + 2500));
