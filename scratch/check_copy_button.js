const fs = require('fs');

const content = fs.readFileSync('adjustr-GEH.html', 'utf8');
const idx = content.indexOf('Salin Resume AIH');
if (idx !== -1) {
    console.log(content.substring(idx - 250, idx + 100));
} else {
    console.log('Salin Resume AIH not found!');
}
