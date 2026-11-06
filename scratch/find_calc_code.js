const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const target = '<section id="hub-hepa"';
const idx = content.indexOf(target);
const endIdx = content.indexOf('</section>', idx);
console.log(content.substring(idx + 3000, endIdx));
