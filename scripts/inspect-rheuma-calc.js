const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('const RheumaCalc =');
console.log(content.substring(p, p + 2500));
