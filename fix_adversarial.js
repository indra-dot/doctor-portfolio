const fs = require('fs');

// Unicode codepoint → HTML entity map
const entityMap = [
  [/\u2265/g, '&ge;'],
  [/\u2264/g, '&le;'],
  [/\u00B0/g, '&deg;'],
  [/\u00B2/g, '&sup2;'],
  [/\u00B3/g, '&sup3;'],
  [/\u00D7/g, '&times;'],
  [/\u00F7/g, '&divide;'],
  [/\u03B1/g, '&alpha;'],
  [/\u03B2/g, '&beta;'],
  [/\u03B3/g, '&gamma;'],
  [/\u2248/g, '&asymp;'],
  [/\u00B1/g, '&plusmn;'],
  [/\u2192/g, '&rarr;'],
  [/\u00B5/g, '&micro;'],
  [/\u2026/g, '&hellip;'],
];

const files = [
  'adjustr-io.html',
  'adjustr-fluid.html',
  'rheumatools.html',
];

for (const fname of files) {
  let html = fs.readFileSync(fname, 'utf8');
  let totalReplacements = 0;

  // Fix Unicode → HTML entities (outside of base64 data URIs to avoid corruption)
  // Split on data:image blocks to avoid touching them
  const parts = html.split(/(data:[^;]+;base64,[A-Za-z0-9+/=]+)/);
  const fixedParts = parts.map((part, i) => {
    // Odd indices are base64 data URIs — skip them
    if (i % 2 === 1) return part;
    let fixed = part;
    for (const [re, entity] of entityMap) {
      const before = fixed;
      fixed = fixed.replace(re, entity);
      if (fixed !== before) totalReplacements++;
    }
    return fixed;
  });
  html = fixedParts.join('');

  // Fix mailto links: add target="_blank" rel="noopener" if missing
  html = html.replace(/<a([^>]*?href=["']mailto:[^"']+["'][^>]*?)>/gi, (match, attrs) => {
    if (/target\s*=/i.test(attrs)) return match;
    return '<a' + attrs + ' target="_blank" rel="noopener">';
  });

  fs.writeFileSync(fname, html, 'utf8');
  console.log('FIXED: ' + fname + ' (' + totalReplacements + ' entity replacements)');
}

console.log('\nAll files sanitized successfully.');
