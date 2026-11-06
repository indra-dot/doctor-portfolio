const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Find all script contents
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(content)) !== null) {
    count++;
    const jsCode = match[1];
    const testFileName = `scratch/test_script_${count}.js`;
    fs.writeFileSync(testFileName, jsCode, 'utf8');
    console.log(`Saved script ${count} (${jsCode.length} bytes) to ${testFileName}`);
}
