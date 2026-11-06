const fs = require('fs');

const content = fs.readFileSync('src/template.html', 'utf8');
const p = content.indexOf('header');
console.log(content.substring(p, p + 1000));
