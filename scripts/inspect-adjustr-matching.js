const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('function getActiveAdjustment');
if (p !== -1) {
  console.log(content.substring(p, p + 800));
} else {
  const p2 = content.indexOf('minCrCl');
  console.log('first minCrCl at pos', p2);
  const p3 = content.indexOf('minCrCl', p + 100000);
  console.log('code searching minCrCl:');
  const codeP = content.indexOf('function recalculate', 1100000);
  console.log(content.substring(codeP, codeP + 1200));
}
