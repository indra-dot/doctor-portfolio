/**
 * audit-code.js
 * 
 * Deep automated static inspection of internahub.html:
 * 1. innerHTML usages and tainted input analysis
 * 2. inline onclick handlers and function resolution
 * 3. DOM ID uniqueness
 * 4. localStorage keys and data sensitivity
 * 5. Registered modules inventory
 */

const fs = require('fs');

const content = fs.readFileSync('internahub.html', 'utf8');

console.log('=== 1. DOM ID DUPLICATION AUDIT ===');
const idRegex = /\bid=["']([^"']+)["']/g;
const idCounts = {};
let m;
while ((m = idRegex.exec(content)) !== null) {
  const id = m[1];
  idCounts[id] = (idCounts[id] || 0) + 1;
}
const duplicateIds = Object.entries(idCounts).filter(([id, cnt]) => cnt > 1);
console.log(`Found ${Object.keys(idCounts).length} unique IDs.`);
if (duplicateIds.length > 0) {
  console.log(`⚠️ ${duplicateIds.length} duplicate IDs detected:`);
  duplicateIds.forEach(([id, cnt]) => console.log(`  - #${id}: ${cnt} times`));
} else {
  console.log('✓ No duplicate DOM IDs found.');
}

console.log('\n=== 2. INLINE ONCLICK HANDLER RESOLUTION ===');
const onclickRegex = /\bonclick=["']([^"']+)["']/gi;
const onclickCalls = [];
while ((m = onclickRegex.exec(content)) !== null) {
  onclickCalls.push(m[1]);
}
console.log(`Found ${onclickCalls.length} inline onclick handlers.`);
// Extract function names from onclick
const fnCalls = new Set();
onclickCalls.forEach(call => {
  const fnMatch = call.match(/([a-zA-Z0-9_$]+)\s*\(/);
  if (fnMatch) fnCalls.add(fnMatch[1]);
});
console.log(`Discovered functions referenced in onclick:`, Array.from(fnCalls));

// Check if these functions are defined in content
fnCalls.forEach(fn => {
  const defRegex = new RegExp(`(function\\s+${fn}\\b|window\\.${fn}\\s*=|const\\s+${fn}\\s*=|let\\s+${fn}\\s*=)`);
  if (!defRegex.test(content)) {
    console.log(`❌ Missing function definition for onclick target: '${fn}'`);
  } else {
    console.log(`✓ Function '${fn}' is defined.`);
  }
});

console.log('\n=== 3. LOCALSTORAGE USAGE AUDIT ===');
const storageRegex = /localStorage\.(getItem|setItem|removeItem|clear)\(([^)]*)\)/g;
const storageOps = [];
while ((m = storageRegex.exec(content)) !== null) {
  storageOps.push({ op: m[1], arg: m[2].trim() });
}
console.log(`Found ${storageOps.length} localStorage operations:`);
storageOps.forEach(op => console.log(`  - localStorage.${op.op}(${op.arg})`));

console.log('\n=== 4. INNERHTML USAGE AUDIT ===');
const innerHtmlMatches = [...content.matchAll(/([a-zA-Z0-9_$.]+)\.innerHTML\s*=\s*([^;]+);/g)];
console.log(`Found ${innerHtmlMatches.length} innerHTML assignments.`);
let suspiciousInnerHTML = 0;
innerHtmlMatches.forEach((match, idx) => {
  const rhs = match[2].trim();
  // Check if RHS incorporates unescaped query parameters, user text, or raw input values
  if (/value\b|search|input|query/i.test(rhs) && !/escapeHtml|encodeURIComponent/i.test(rhs)) {
    suspiciousInnerHTML++;
    if (suspiciousInnerHTML <= 10) {
      console.log(`  ⚠ Potentially unescaped innerHTML #${idx + 1}: ${match[1]}.innerHTML = ${rhs.substring(0, 80)}`);
    }
  }
});
console.log(`Total potentially unescaped innerHTML assignments: ${suspiciousInnerHTML}`);

console.log('\n=== 5. MODULE REGISTRY INVENTORY ===');
const regMatches = [...content.matchAll(/reg\(\s*\{([^}]+)\}/g)];
console.log(`Found ${regMatches.length} registered modules via reg({...})`);
const registeredIds = [];
regMatches.forEach(m => {
  const idMatch = m[1].match(/id:\s*['"]([^'"]+)['"]/);
  const nameMatch = m[1].match(/nama:\s*['"]([^'"]+)['"]/);
  if (idMatch) {
    registeredIds.push({ id: idMatch[1], nama: nameMatch ? nameMatch[1] : '' });
  }
});
console.log(`Modules list (${registeredIds.length}):`);
registeredIds.slice(0, 15).forEach((mod, idx) => {
  console.log(`  ${idx + 1}. [${mod.id}] ${mod.nama}`);
});
if (registeredIds.length > 15) {
  console.log(`  ... and ${registeredIds.length - 15} more modules.`);
}
