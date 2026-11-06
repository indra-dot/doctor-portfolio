const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('selectWeight');
console.log(content.substring(p - 50, p + 1200));
