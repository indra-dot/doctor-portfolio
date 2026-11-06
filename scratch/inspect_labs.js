const fs = require('fs');

const matches = JSON.parse(fs.readFileSync('scratch/lab_matches.json', 'utf8'));

// Filter matches that have input, label, placeholder, value, ULN, normal, ref, etc.
const relevant = matches.filter(m => {
  const t = m.text.toLowerCase();
  return t.includes('<input') || t.includes('<label') || t.includes('placeholder') || 
         t.includes('value=') || t.includes('uln') || t.includes('normal') || 
         t.includes('ref') || t.includes('const ') || t.includes('let ') || 
         t.includes('var ') || t.includes('function') || t.includes('hint') || 
         t.includes('badge') || t.includes('span');
});

console.log('Relevant matches:', relevant.length);
relevant.forEach(r => {
  console.log(`[${r.lineNum}] ${r.text}`);
});
