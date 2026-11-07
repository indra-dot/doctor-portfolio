const fs = require('fs');
const path = require('path');
const { getAllModules } = require('../tests/harness');

const internahubModules = getAllModules();
const internahubIds = new Set(internahubModules.map(m => m.id));
const internahubNames = new Set(internahubModules.map(m => m.nama.toLowerCase()));

console.log('Total registered modules in InternaHub:', internahubModules.length);

const legacyFiles = [
  'adjustr-emd.html',
  'adjustr-fluid.html',
  'adjustr-GEH.html',
  'adjustr-HOM.html',
  'adjustr-io.html',
  'Calc-Med.html',
  'rheumatools.html'
];

legacyFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`[FILE NOT FOUND] ${file}`);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  console.log(`\n========================================`);
  console.log(`ANALYZING: ${file} (${Math.round(content.length / 1024)} KB)`);
  console.log(`========================================`);

  // Detect structure of legacy file
  // Check if it registers into an array R or has tab buttons or calc cards
  const rMatches = [...content.matchAll(/id:\s*['"]([a-zA-Z0-9_-]+)['"]\s*,\s*nama:\s*['"]([^'"]+)['"]/g)];
  if (rMatches.length > 0) {
    console.log(`Found ${rMatches.length} R-like calculator definitions:`);
    let missingCount = 0;
    rMatches.forEach(m => {
      const id = m[1];
      const name = m[2];
      const exists = internahubIds.has(id);
      if (!exists) {
        missingCount++;
        console.log(`  ❌ MISSING [${id}]: "${name}"`);
      }
    });
    if (missingCount === 0) {
      console.log(`  ✓ All ${rMatches.length} calculators migrated!`);
    }
  }

  // Check for tab buttons or nav items
  const tabMatches = [...content.matchAll(/data-tab=['"]([^'"]+)['"]/g)].map(m => m[1]);
  if (tabMatches.length > 0) {
    console.log(`Found data-tab attributes:`, [...new Set(tabMatches)]);
  }

  // Check for section IDs or headings
  const h2h3Matches = [...content.matchAll(/<(?:h2|h3)[^>]*>(.*?)<\/(?:h2|h3)>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 3 && !t.includes('InternaHub') && !t.includes('Adjustr'));
  console.log(`Sample headings / tools (${h2h3Matches.length}):`, h2h3Matches.slice(0, 10));
});
