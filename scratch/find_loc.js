const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const regex = /<section\s+id="([^"]+)"/g;
let m;
const sections = [];
while ((m = regex.exec(content)) !== null) {
    sections.push({ id: m[1], pos: m.index });
}
console.log('Sections order:');
sections.forEach((s, i) => console.log(`${i + 1}. ${s.id} (at ${s.pos})`));
