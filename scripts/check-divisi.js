const { getAllModules } = require('../tests/harness');
const modules = getAllModules();

const divMap = {};
modules.forEach(m => {
  divMap[m.divisi] = (divMap[m.divisi] || 0) + 1;
});

console.log('Current Divisi distribution in InternaHub:');
Object.entries(divMap).sort((a,b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`- ${k}: ${v} kalkulator`);
});
