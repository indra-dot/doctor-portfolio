const fs = require('fs');
const path = require('path');
const { getAllModules } = require('../tests/harness');

const internahubModules = getAllModules();
const internahubIds = new Set(internahubModules.map(m => m.id));

const scratchDir = 'archive/scratch';
if (fs.existsSync(scratchDir)) {
  const files = fs.readdirSync(scratchDir).filter(f => f.endsWith('.js'));
  console.log(`Checking ${files.length} scratch files...`);
  const foundCalculators = new Set();
  files.forEach(f => {
    const c = fs.readFileSync(path.join(scratchDir, f), 'utf8');
    const matches = [...c.matchAll(/id:\s*['"]([a-zA-Z0-9_-]+)['"]\s*,\s*nama:\s*['"]([^'"]+)['"]/g)];
    matches.forEach(m => {
      foundCalculators.add(m[1] + ' -> ' + m[2]);
      if (!internahubIds.has(m[1])) {
        console.log(`Found unmigrated in ${f}: [${m[1]}] ${m[2]}`);
      }
    });
  });
  console.log(`Total unique calculator definitions found in scratch: ${foundCalculators.size}`);
}
