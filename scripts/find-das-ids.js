const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const matches = [...content.matchAll(/das28[a-zA-Z0-9_-]*/gi)].map(m => m[0]);
console.log('DAS28 related identifiers:', [...new Set(matches)]);

const btnMatches = [...content.matchAll(/btn[a-zA-Z0-9_-]*das[a-zA-Z0-9_-]*/gi)].map(m => m[0]);
console.log('DAS button identifiers:', [...new Set(btnMatches)]);
