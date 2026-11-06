const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const p = content.indexOf("id:'curb65'");
console.log(content.substring(p, p + 800));
