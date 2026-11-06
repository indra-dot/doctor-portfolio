const fs = require('fs');

let content = fs.readFileSync('adjustr-GEH.html', 'utf8');

// Replace the copy button in calculateAihScore
const oldCopyBtn = `<button type="button" onclick="copyToClipboard(\\\`\${resumeText.replace(/\\\\\`/g, '\\\\\\\\\`').replace(/"/g, '&quot;')}\\\`)" class="glass-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center">`;
const newCopyBtn = `<button type="button" onclick="copyAihResume()" class="glass-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center">`;

if (content.includes(oldCopyBtn)) {
    content = content.replace(oldCopyBtn, newCopyBtn);
    console.log('Replaced oldCopyBtn with newCopyBtn');
} else {
    console.log('oldCopyBtn not matched directly, checking regex...');
    content = content.replace(/onclick="copyToClipboard\(\\\`\$\{resumeText[\s\S]*?class="glass-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center">/, 'onclick="copyAihResume()" class="glass-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center">');
}

// Add window.lastAihResume = resumeText in calculateAihScore
const assignMarker = `const resumeText = resumeLines.join('\\n');`;
if (content.includes(assignMarker)) {
    content = content.replace(assignMarker, assignMarker + `\n            window.lastAihResume = resumeText;`);
    console.log('Added window.lastAihResume assignment');
}

// Add copyAihResume function
const copyFunc = `
        function copyAihResume() {
            if (window.lastAihResume) {
                copyToClipboard(window.lastAihResume, 'Resume Skor AIH berhasil disalin ke clipboard!');
            } else {
                showToast('Belum ada hasil kalkulasi untuk disalin.');
            }
        }
`;

if (!content.includes('function copyAihResume(')) {
    content = content.replace(`function resetAihScore() {`, copyFunc + `\n        function resetAihScore() {`);
    console.log('Added copyAihResume function');
}

fs.writeFileSync('adjustr-GEH.html', content, 'utf8');
console.log('Updated copy logic in adjustr-GEH.html successfully!');
