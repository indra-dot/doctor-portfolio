const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Check for all calculators in detail
// Let's find occurrences of:
// - "uln"
// - "fib4-ast-uln"
// - "rfactor-alt-uln"
// - "rfactor-alp-uln"
// - "gbs-bun-hint"
// - "ranson"
// - "bili"
// - "alt"
// - "ast"
// - "alp"
// - "ggt"
// - "albumin"
// - "protein"
// - "globulin"
// - "bun"
// - "natrium" / "sodium" / "na"
// - "normal"

const lines = content.split('\n');
const results = [];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const l = line.toLowerCase();
  
  if (l.includes('uln') || 
      l.includes('fib4') || 
      l.includes('apri') || 
      l.includes('rfactor') || 
      l.includes('deritis') || 
      l.includes('gbs-bun') || 
      l.includes('meld-na') || 
      l.includes('meld-alb') || 
      l.includes('meld-bili') || 
      l.includes('ctp-bili') || 
      l.includes('ctp-alb') || 
      l.includes('saag-') || 
      l.includes('nfs-') || 
      l.includes('ranson-') || 
      l.includes('bisap') ||
      l.includes('maddrey') ||
      l.includes('lille') ||
      l.includes('clif-bili') ||
      l.includes('tokyo') ||
      l.includes('biliary')) {
    results.push({ lineNum, line: line.trim() });
  }
});

console.log('Matches count:', results.length);
fs.writeFileSync('scratch/deep_search.json', JSON.stringify(results, null, 2));
