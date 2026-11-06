const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Find headings, tabs, or calculators
const headings = content.match(/<h[234][^>]*>.*?<\/h[234]>/gi);
console.log('Total h2/h3/h4 headings:', headings ? headings.length : 0);
if (headings) {
    console.log('First 20 headings:', headings.slice(0, 20));
}

// Find copy and reset buttons
const copyButtons = content.match(/<button[^>]*onclick="[^"]*copy[^"]*"[^>]*>.*?<\/button>/gi);
console.log('Copy buttons count:', copyButtons ? copyButtons.length : 0);
if (copyButtons) {
    console.log('Sample copy buttons:', copyButtons.slice(0, 3));
}

const resetButtons = content.match(/<button[^>]*onclick="[^"]*reset[^"]*"[^>]*>.*?<\/button>/gi);
console.log('Reset buttons count:', resetButtons ? resetButtons.length : 0);
if (resetButtons) {
    console.log('Sample reset buttons:', resetButtons.slice(0, 3));
}

// Also check rheumatools.html or Calc-Med.html or adjustr-emd.html to see what the user meant by "dengan stadar yg sudh kita buat (ada reset dan copy)"
