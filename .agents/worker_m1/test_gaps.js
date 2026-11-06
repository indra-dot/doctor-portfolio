const fs = require('fs');
const path = require('path');
const drugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_drugs.json'), 'utf8'));

let gapCount = 0;
let missingFloorCount = 0;

for (const [k, d] of Object.entries(drugs)) {
  const getAdjs = (obj) => obj.adjustments || [];
  let stratList = [{ name: 'default', adjs: getAdjs(d) }];
  if (d.isMultiStrategy && d.strategies) {
    stratList = Object.entries(d.strategies).map(([sname, sval]) => ({ name: sname, adjs: getAdjs(sval) }));
  }
  for (const s of stratList) {
    if (s.adjs.length === 0) continue;
    const mins = s.adjs.map(a => a.min);
    const minVal = Math.min(...mins);
    if (minVal > 0) {
      missingFloorCount++;
      console.log(`Drug [${k}] strategy [${s.name}] lowest min is ${minVal} > 0`);
    }
    for (let i = 0; i < s.adjs.length - 1; i++) {
      const cur = s.adjs[i];
      const next = s.adjs[i+1];
      if (cur.min > next.max + 0.001) {
        gapCount++;
        console.log(`Drug [${k}] strategy [${s.name}] GAP between cur.min=${cur.min} and next.max=${next.max}`);
      }
    }
  }
}

console.log(`Total gaps: ${gapCount}, Total missing floor: ${missingFloorCount}`);
