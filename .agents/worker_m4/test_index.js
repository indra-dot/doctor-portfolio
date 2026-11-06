const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../../index.html');
const content = fs.readFileSync(indexPath, 'utf8');

console.log('Testing index.html at:', indexPath);

// 1. Check mailto links
const mailtoRegex = /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const matches = [...content.matchAll(mailtoRegex)].map(m => m[0]);
console.log('Found mailto links:', matches);

if (matches.length < 2) {
  console.error('FAIL: Expected at least 2 mailto links, found ' + matches.length);
  process.exit(1);
}

const targetEmail = 'mailto:putrawan.2371041010@student.unud.ac.id';
for (const m of matches) {
  if (m !== targetEmail) {
    console.error('FAIL: Found mismatch mailto link: ' + m);
    process.exit(1);
  }
}
console.log('PASS: All mailto links match', targetEmail);

// 2. Check navbar .nav-cta
const navCtaPattern = /<div class="nav-items">[\s\S]*?<a[^>]+class="nav-cta"[^>]*>[\s\S]*?<\/div>/;
if (!navCtaPattern.test(content)) {
  console.error('FAIL: .nav-cta link not found within <div class="nav-items">');
  process.exit(1);
}
console.log('PASS: .nav-cta link successfully located inside .nav-items');

// 3. Check footer CTA
const footerCtaPattern = /<footer[\s\S]*?<a[^>]+href="mailto:putrawan\.2371041010@student\.unud\.ac\.id"[^>]*class="btn-gradient"[^>]*>[\s\S]*?<\/footer>/;
if (!footerCtaPattern.test(content)) {
  console.error('FAIL: Matching .btn-gradient CTA not found inside <footer>');
  process.exit(1);
}
console.log('PASS: Matching .btn-gradient CTA successfully located inside <footer>');

// 4. Check existing tool cards and links
const requiredLinks = [
  'https://sites.google.com/view/drguswib/adjustr-io',
  'https://sites.google.com/view/drguswib/adjustr-fluid',
  'https://sites.google.com/view/drguswib/rheumatools',
  'https://ipd-cbt-pro.vercel.app/',
  'https://financial-tracker-nine-wine.vercel.app/',
  '#clinical-tools',
  '#utilities'
];

for (const link of requiredLinks) {
  if (!content.includes(link)) {
    console.error('FAIL: Missing required existing link: ' + link);
    process.exit(1);
  }
}
console.log('PASS: All 7 existing tool links and anchor targets are present');

// 5. Check CSS classes
const requiredCssClasses = ['.nav-cta', '.nav-items', '.btn-gradient', '.footer-contact', '.footer-links'];
for (const cls of requiredCssClasses) {
  if (!content.includes(cls)) {
    console.error('FAIL: Missing CSS definition for: ' + cls);
    process.exit(1);
  }
}
console.log('PASS: All CSS classes defined properly');

// 6. Check tag balance
const majorTags = ['header', 'nav', 'section', 'footer', 'style', 'script', 'head', 'body', 'html'];
for (const tag of majorTags) {
  const openRegex = new RegExp('<' + tag + '(?:\\s+[^>]*)?>', 'gi');
  const closeRegex = new RegExp('</' + tag + '>', 'gi');
  const openMatches = content.match(openRegex) || [];
  const closeMatches = content.match(closeRegex) || [];
  if (openMatches.length !== closeMatches.length) {
    console.error(`FAIL: Tag mismatch for <${tag}>: opened ${openMatches.length} times, closed ${closeMatches.length} times`);
    process.exit(1);
  }
  console.log(`PASS: Tag <${tag}> balanced (${openMatches.length}/${closeMatches.length})`);
}

console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
