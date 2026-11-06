const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('adjustr') || l.includes('rheuma') || l.includes('internahub') || l.includes('Kalkulator') || l.includes('Clinical') || l.includes('Contact')) {
    console.log(`L${i + 1}: ${l.trim().substring(0, 100)}`);
  }
}
