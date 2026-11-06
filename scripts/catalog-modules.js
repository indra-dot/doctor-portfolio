const { getAllModules } = require('../tests/harness');

const modules = getAllModules();
console.log(`Total registered modules: ${modules.length}\n`);

const computeModules = [];
const mountModules = [];
const otherModules = [];

modules.forEach(m => {
  if (m.compute) {
    computeModules.push(m);
  } else if (m.mount) {
    mountModules.push(m);
  } else {
    otherModules.push(m);
  }
});

console.log(`Schema compute modules: ${computeModules.length}`);
console.log(`Interactive mount modules: ${mountModules.length}`);
console.log(`Other modules: ${otherModules.length}\n`);

console.log('--- Compute Modules ---');
computeModules.forEach((m, idx) => {
  const fields = m.fields ? m.fields.map(f => f.id).join(', ') : 'none';
  console.log(`${idx + 1}. [${m.id}] ${m.nama} (${m.divisi}) -> fields: [${fields}]`);
});

console.log('\n--- Mount Modules ---');
mountModules.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.id}] ${m.nama} (${m.divisi})`);
});
