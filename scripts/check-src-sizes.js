const fs = require('fs');

const files = [
  'src/core/context.js',
  'src/calculators/registry.js',
  'src/engines/rheuma-engine.js',
  'src/modules/rheumatools-templates.js',
  'src/data/drug-database.js',
  'src/engines/clinical-engine.js',
  'src/modules/adjustr-io.js',
  'src/core/router.js'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(`${f} size: ${Math.round(c.length / 1024)} KB, contains LS_KEY: ${c.includes('LS_KEY')}`);
});
