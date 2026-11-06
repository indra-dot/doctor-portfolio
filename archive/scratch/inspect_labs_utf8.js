const fs = require('fs');

const matches = JSON.parse(fs.readFileSync('scratch/lab_matches.json', 'utf8'));

const relevant = matches.filter(m => {
  const t = m.text.toLowerCase();
  return t.includes('<input') || t.includes('<label') || t.includes('placeholder') || 
         t.includes('value=') || t.includes('uln') || t.includes('normal') || 
         t.includes('ref') || t.includes('hint') || 
         t.includes('badge') || (t.includes('span') && (t.includes('text-') || t.includes('font-')));
});

let out = `Relevant matches: ${relevant.length}\n`;
relevant.forEach(r => {
  out += `[${r.lineNum}] ${r.text}\n`;
});
fs.writeFileSync('scratch/relevant_labs_utf8.txt', out, 'utf8');
console.log('Done, count:', relevant.length);
