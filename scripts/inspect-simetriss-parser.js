const fs = require('fs');

const content = fs.readFileSync('src/core/context.js', 'utf8');
const p = content.indexOf('function parseSimetriss');
if (p !== -1) {
  console.log(content.substring(p, p + 1200));
} else {
  console.log('Parser search:');
  const p2 = content.indexOf('PARSER');
  console.log(content.substring(p2, p2 + 1000));
}
