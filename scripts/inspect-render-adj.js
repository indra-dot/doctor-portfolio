const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('function initAdjustrIo');
const renderP = content.indexOf('renderAdjustmentCards', p);
console.log('renderAdjustmentCards pos:', renderP);
if (renderP !== -1) {
  console.log(content.substring(renderP, renderP + 1200));
}
