const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const target = 'id="aih-igg-level"';
const idx = content.indexOf(target);
console.log(content.substring(idx - 400, idx + 1200));
