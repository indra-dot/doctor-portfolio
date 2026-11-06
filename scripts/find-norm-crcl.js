const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('CrCl Normalisasi');
console.log(content.substring(p - 100, p + 200));
