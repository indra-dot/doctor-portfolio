const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf('DAS28_CRP');
console.log('DAS28_CRP found at:', p);
console.log(content.substring(p - 100, p + 500));
