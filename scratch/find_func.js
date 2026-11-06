const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const regex = /function calculateRome4Ibs[\s\S]*?copyToClipboard[\s\S]*?<\/div>/;
const match = content.match(regex);
if (match) {
    console.log(match[0].slice(-1000));
} else {
    console.log('Not matched with regex');
}
