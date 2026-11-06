const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('function renderDrugDosing');
console.log(content.substring(p, p + 1500));
