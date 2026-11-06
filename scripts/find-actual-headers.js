const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const bannerComments = [...content.matchAll(/\/\* =+ [^=]+ =+ \*\//g)].map(m => m[0]);
console.log('All banner comments in internahub.html:');
bannerComments.forEach(b => console.log(' ', b));

const lineComments = [...content.matchAll(/\/\/\s*---+[^\n]+/g)].map(m => m[0]);
console.log('\nTop line comments in internahub.html:');
lineComments.slice(0, 15).forEach(c => console.log(' ', c));
