const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines in index.html:', lines.length);

// Print first 80 lines and search for button/card links
for (let i = 0; i < Math.min(100, lines.length); i++) {
  if (lines[i].includes('href=') || lines[i].includes('onclick') || lines[i].includes('InternaHub') || lines[i].includes('adjustr')) {
    console.log(`L${i + 1}: ${lines[i].trim()}`);
  }
}
