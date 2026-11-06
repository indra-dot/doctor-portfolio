const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('activeStrategyData = drug.strategies');
console.log(content.substring(p, p + 2500));
