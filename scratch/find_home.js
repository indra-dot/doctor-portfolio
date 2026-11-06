const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const target = '<h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">2. Hepatology & Cirrhosis</h4>';
const idx = content.indexOf(target);
console.log(content.substring(idx - 200, idx + 800));
