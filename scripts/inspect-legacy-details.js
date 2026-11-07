const fs = require('fs');

const files = [
  'adjustr-emd.html',
  'adjustr-fluid.html',
  'adjustr-GEH.html',
  'adjustr-HOM.html',
  'adjustr-io.html',
  'Calc-Med.html',
  'rheumatools.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`\n========================================`);
  console.log(`FILE: ${f}`);
  console.log(`Length: ${content.length}`);
  
  // Look for functions or tools
  const funcs = [...content.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
  console.log(`Functions (${funcs.length}):`, funcs.slice(0, 25).join(', '));
  
  // Look for calc cards, button titles, or labels
  const buttons = [...content.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(b => b.length > 2 && b.length < 50);
  console.log(`Sample buttons (${buttons.length}):`, [...new Set(buttons)].slice(0, 15).join(' | '));

  // Look for IDs of cards or sections or modals
  const ids = [...content.matchAll(/id=['"]([a-zA-Z0-9_-]+)['"]/g)].map(m => m[1]);
  console.log(`IDs count: ${ids.length}, unique: ${new Set(ids).size}`);
});
