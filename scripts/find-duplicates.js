const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (/\bid=["']res["']/.test(l)) {
    console.log('id=res at line:', idx + 1, l.trim().substring(0, 80));
  }
  if (/\bid=["']copyBtn["']/.test(l)) {
    console.log('id=copyBtn at line:', idx + 1, l.trim().substring(0, 80));
  }
});
