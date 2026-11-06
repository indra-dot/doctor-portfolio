const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Let's print out lines around fib4, rfactor, gbs, deritis, nfs, meld, ctp, saag, tokyo
function printSection(title, startMatch, endMatch) {
  const startIdx = content.indexOf(startMatch);
  if (startIdx === -1) {
    console.log('NOT FOUND:', startMatch);
    return;
  }
  const endIdx = endMatch ? content.indexOf(endMatch, startIdx) : startIdx + 2000;
  console.log(`\n=================== ${title} ===================`);
  console.log(content.substring(startIdx, endIdx));
}

// 1. FIB-4 HTML & JS
printSection('FIB4 HTML', 'id="calc-fib4"', '</section>');
printSection('FIB4 JS', 'function calculateFib4()', 'function ');

// 2. R-Factor HTML & JS
printSection('R-Factor HTML', 'id="calc-rfactor"', '</section>');
printSection('R-Factor JS', 'function calculateRFactor()', 'function ');

// 3. GBS BUN HTML & JS
printSection('GBS BUN HTML', 'id="gbs-bun"', '</div>');
printSection('GBS toggle / JS', 'gbs-bun-hint', 'function calculateGbs()');
printSection('GBS JS', 'function calculateGbs()', 'function ');

// 4. Tokyo Guidelines HTML & JS
printSection('Tokyo Guidelines HTML', 'id="calc-tokyo"', '</section>');
printSection('Tokyo Guidelines JS', 'function calculateTokyo()', 'function ');

// 5. De Ritis HTML & JS
printSection('De Ritis HTML', 'id="calc-deritis"', '</section>');
printSection('De Ritis JS', 'function calculateDeRitis()', 'function ');

// 6. NFS HTML & JS
printSection('NFS HTML', 'id="calc-nfs"', '</section>');

// 7. MELD HTML & JS
printSection('MELD HTML', 'id="calc-meld"', '</section>');

// 8. SAAG HTML & JS
printSection('SAAG HTML', 'id="calc-saag"', '</section>');
