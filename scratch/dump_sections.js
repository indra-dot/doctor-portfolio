const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

function getSection(title, startMatch, endMatch) {
  const startIdx = content.indexOf(startMatch);
  if (startIdx === -1) {
    return `\nNOT FOUND: ${startMatch}\n`;
  }
  const endIdx = endMatch ? content.indexOf(endMatch, startIdx) : startIdx + 2500;
  return `\n=================== ${title} ===================\n` + content.substring(startIdx, endIdx);
}

let out = '';
out += getSection('FIB4 HTML', 'id="calc-fib4"', '</section>');
out += getSection('FIB4 JS', 'function calculateFib4()', 'function ');
out += getSection('R-Factor HTML', 'id="calc-rfactor"', '</section>');
out += getSection('R-Factor JS', 'function calculateRFactor()', 'function ');
out += getSection('GBS BUN HTML', 'id="gbs-bun"', '</section>');
out += getSection('GBS toggle / JS', 'gbs-bun-hint', 'function calculateGbs()');
out += getSection('GBS JS', 'function calculateGbs()', 'function ');
out += getSection('Tokyo Guidelines HTML', 'id="calc-tokyo"', '</section>');
out += getSection('Tokyo Guidelines JS', 'function calculateTokyo()', 'function ');
out += getSection('De Ritis HTML', 'id="calc-deritis"', '</section>');
out += getSection('De Ritis JS', 'function calculateDeRitis()', 'function ');
out += getSection('NFS HTML', 'id="calc-nfs"', '</section>');
out += getSection('MELD HTML', 'id="calc-meld"', '</section>');
out += getSection('SAAG HTML', 'id="calc-saag"', '</section>');

fs.writeFileSync('scratch/sections_output_utf8.txt', out, 'utf8');
console.log('Saved to scratch/sections_output_utf8.txt');
