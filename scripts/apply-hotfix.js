const fs = require('fs');

const filePath = 'internahub.html';
// Restore from pre-fix.bak
let content = fs.readFileSync('internahub.html.pre-fix.bak', 'utf8');

const markerStart = '<!-- Embedded Standalone JavaScript Engine -->';
const markerEnd = '</script>";';

const startIdx = content.indexOf(markerStart);
const endIdx = content.indexOf(markerEnd);

console.log('startIdx:', startIdx);
console.log('endIdx:', endIdx);

// After markerEnd is `\n\nfunction initAdjustrIo(container, ctx, emit) {`
const afterEnd = content.substring(endIdx + markerEnd.length);

// We replace from startIdx to endIdx + markerEnd.length with `";`
const newContent = content.substring(0, startIdx).trimEnd() + '";' + afterEnd;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed cleanly!');
