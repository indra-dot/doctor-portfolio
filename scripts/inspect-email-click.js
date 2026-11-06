const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const p = content.indexOf('function handleEmailClick');
console.log(content.substring(p, p + 600));
