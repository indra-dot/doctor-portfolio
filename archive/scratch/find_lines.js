const fs = require('fs');
const content = fs.readFileSync('adjustr-GEH.html', 'utf8');

const start = content.indexOf('<section id="hub-hepa"');
const end = content.indexOf('</section>', start);
const hubText = content.substring(start, end);
const cardMatches = hubText.match(/navigateTo\('[^']+-module'/g);
console.log('Hub hepa card modules count:', cardMatches ? cardMatches.length : 0);
console.log('Card modules:', cardMatches);
