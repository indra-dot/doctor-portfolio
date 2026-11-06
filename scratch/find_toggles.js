const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Find switch/toggle patterns like setGbsBunUnit or switchTg18Type
const funcMatches = content.match(/function\s+(?:switch|set|toggle)[a-zA-Z0-9_]*\s*\([^)]*\)\s*\{[\s\S]*?\}/g);
if (funcMatches) {
    console.log('Toggle functions:');
    funcMatches.slice(0, 10).forEach(f => {
        const name = f.match(/function\s+([a-zA-Z0-9_]+)/)[1];
        console.log(name);
        if (name.includes('Unit') || name.includes('Type') || name.includes('Tg18')) {
            console.log(f.substring(0, 400));
        }
    });
}

// Find HTML buttons for setGbsBunUnit
const gbsIdx = content.indexOf('setGbsBunUnit');
if (gbsIdx !== -1) {
    console.log('\n--- GBS unit toggle HTML snippet ---');
    console.log(content.substring(gbsIdx - 200, gbsIdx + 500));
}
