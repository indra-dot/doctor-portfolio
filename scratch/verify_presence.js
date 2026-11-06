const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

console.log('aih-module in CALCULATORS_DB:', content.includes("id: 'aih-module'"));
console.log('aih-module in hub-hepa:', content.includes("navigateTo('aih-module'"));
console.log('aih-module section:', content.includes('<section id="aih-module"'));
console.log('calculateAihScore function:', content.includes('function calculateAihScore('));
console.log('resetAihScore function:', content.includes('function resetAihScore('));
