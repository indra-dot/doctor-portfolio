const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('normalizedCrCl: Math.max(0, normalizedCrCl),');
console.log(content.substring(p - 100, p + 200));
