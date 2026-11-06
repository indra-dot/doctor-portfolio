const fs = require('fs');

const content = fs.readFileSync('src/core/context.js', 'utf8');
const p = content.indexOf('function parseClinical');
console.log(content.substring(p + 800, p + 2200));
