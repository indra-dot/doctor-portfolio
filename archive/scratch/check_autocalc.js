const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const target = 'function autoCalcLabRatios';
const idx = content.indexOf(target);
console.log(content.substring(idx + 1000, idx + 2000));
