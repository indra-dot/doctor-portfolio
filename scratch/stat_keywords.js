const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');
const lines = content.split('\n');

const checks = [
  'bili',
  'alp',
  'ast',
  'alt',
  'ggt',
  'gamma',
  'protein',
  'albumin',
  'globulin',
  'bun',
  'natrium',
  'sodium'
];

const found = {};
checks.forEach(c => found[c] = []);

lines.forEach((l, idx) => {
  const lineNum = idx + 1;
  const lower = l.toLowerCase();
  checks.forEach(c => {
    if (lower.includes(c)) {
      found[c].push({ lineNum, text: l.trim() });
    }
  });
});

Object.keys(found).forEach(k => {
  console.log(`=== KEYWORD: ${k} (Total: ${found[k].length}) ===`);
  // print first 10
  found[k].slice(0, 10).forEach(m => console.log(`  [${m.lineNum}] ${m.text.substring(0, 100)}`));
});
