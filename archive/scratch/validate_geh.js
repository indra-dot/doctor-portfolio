const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Check unclosed sections
const openSections = (content.match(/<section/g) || []).length;
const closeSections = (content.match(/<\/section>/g) || []).length;
console.log(`Sections: open = ${openSections}, close = ${closeSections}`);

// Check forms
const openForms = (content.match(/<form/g) || []).length;
const closeForms = (content.match(/<\/form>/g) || []).length;
console.log(`Forms: open = ${openForms}, close = ${closeForms}`);

// Check scripts
const openScripts = (content.match(/<script/g) || []).length;
const closeScripts = (content.match(/<\/script>/g) || []).length;
console.log(`Scripts: open = ${openScripts}, close = ${closeScripts}`);

// Check module-section classes count
const moduleSections = (content.match(/class="[^"]*module-section[^"]*"/g) || []).length;
console.log(`Module sections count: ${moduleSections}`);

if (openSections === closeSections && openForms === closeForms && openScripts === closeScripts) {
    console.log('HTML tag structure is completely balanced and valid!');
} else {
    console.error('Mismatch found in HTML tags!');
}
