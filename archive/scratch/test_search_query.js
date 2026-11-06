// Test search for AIH in CALCULATORS_DB
const fs = require('fs');
const scriptContent = fs.readFileSync('scratch/test_script_1.js', 'utf8');

const vm = require('vm');
const context = vm.createContext({
    document: { 
        getElementById: () => ({ addEventListener: () => {} }),
        querySelectorAll: () => [],
        addEventListener: () => {}
    },
    window: { addEventListener: () => {} },
    console: console
});

vm.runInContext(scriptContent, context);

const db = vm.runInContext('CALCULATORS_DB', context);
console.log('Total modules in CALCULATORS_DB:', db.length);

const queries = ['aih', 'autoimmune hepatitis', 'alvarez', 'hepatitis autoimun', 'lkm-1'];
for (const q of queries) {
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = db.filter(item => {
        const haystack = `${item.name} ${item.category} ${item.desc} ${item.keywords.join(' ')}`.toLowerCase();
        return terms.every(t => haystack.includes(t));
    });
    console.log(`Query "${q}": found ${matches.length} matches ->`, matches.map(m => m.name));
}
