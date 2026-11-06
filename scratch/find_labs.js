const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');
const lines = content.split('\n');

const results = [];
lines.forEach((line, idx) => {
  const l = line.toLowerCase();
  if (/(bili|alp|ast|sgot|alt|sgpt|ggt|gamma|protein|album|globulin|bun|natrium|sodium)/i.test(l)) {
    results.push({ lineNum: idx + 1, text: line.trim() });
  }
});

console.log('Total matches:', results.length);
fs.writeFileSync('scratch/lab_matches.json', JSON.stringify(results, null, 2));

// Also let's find all calculators / sections in adjustr-GEH.html
const sections = [];
lines.forEach((line, idx) => {
  if (line.includes('id="calc-') || line.includes('data-calc') || line.includes('<h2') || line.includes('<h3')) {
    sections.push({ lineNum: idx + 1, text: line.trim() });
  }
});
fs.writeFileSync('scratch/calc_sections.json', JSON.stringify(sections, null, 2));
