const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf("id: 'crcl-cockcroft'");
console.log(content.substring(p + 1000, p + 2500));
