const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Let's inspect the sections / hubs in adjustr-GEH.html
const sectionRegex = /<section[^>]*id=["']([^"']+)["'][^>]*>/g;
let match;
console.log('Sections:');
while ((match = sectionRegex.exec(content)) !== null) {
    console.log(match[1]);
}

// Let's inspect L1400-L1700 to see how hepatology calculators are laid out
const lines = content.split('\n');
console.log('\n--- Lines 1430 to 1480 (FIB-4 module sample) ---');
console.log(lines.slice(1429, 1480).join('\n'));
