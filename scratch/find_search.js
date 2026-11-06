const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const target = "{ id: 'nfs-module'";
const idx = content.indexOf(target);
console.log(content.substring(idx, idx + 1500));
