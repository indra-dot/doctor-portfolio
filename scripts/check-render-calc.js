const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const calcMatch = content.match(/function\s+renderCalc\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
if (calcMatch) {
  console.log('--- renderCalc() function ---');
  console.log(calcMatch[0].substring(0, 1500));
}
