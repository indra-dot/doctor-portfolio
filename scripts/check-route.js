const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const routeMatch = content.match(/function\s+route\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
if (routeMatch) {
  console.log('--- route() function ---');
  console.log(routeMatch[0].substring(0, 1500));
}
