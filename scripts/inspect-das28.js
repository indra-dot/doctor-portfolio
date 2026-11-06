const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf("id: 'das28-crp'");
if (p !== -1) {
  console.log(content.substring(p, p + 600));
} else {
  const p2 = content.indexOf("das28-crp");
  console.log('pos', p2);
  console.log(content.substring(p2 - 50, p2 + 500));
}
