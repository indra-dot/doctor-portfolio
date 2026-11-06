const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const regDef = content.match(/function\s+reg\s*\([^)]*\)\s*\{[\s\S]*?\}/);
if (regDef) {
  console.log('--- function reg definition ---');
  console.log(regDef[0]);
}

const regArray = content.match(/(const|let|var)\s+(REGISTRY|MODULES|CALCULATORS|registry|modules)\s*=/i);
if (regArray) {
  console.log('--- Registry array declaration ---');
  console.log(regArray[0]);
}
