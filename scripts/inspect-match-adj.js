const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('matchAdjustment');
console.log(content.substring(p - 100, p + 1000));
