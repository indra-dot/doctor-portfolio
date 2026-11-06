const fs = require('fs');

const files = ['adjustr-GEH.html', 'rheumatools.html', 'adjustr-emd.html', 'adjustr-fluid.html', 'adjustr-io.html', 'Calc-Med.html'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const copyMatches = content.match(/copy/gi);
    const resetMatches = content.match(/reset/gi);
    console.log(`${file}: length ${content.length}, 'copy' mentions: ${copyMatches ? copyMatches.length : 0}, 'reset' mentions: ${resetMatches ? resetMatches.length : 0}`);
}
