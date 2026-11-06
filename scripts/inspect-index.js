const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
console.log('index.html size:', content.length);

const toolLinks = [...content.matchAll(/href=["']([^"']+\.html)["']/g)].map(m => m[1]);
console.log('Tools linked in index.html:', [...new Set(toolLinks)]);

const mailLinks = [...content.matchAll(/href=["'](mailto:[^"']+)["']/g)].map(m => m[1]);
console.log('Mail links in index.html:', [...new Set(mailLinks)]);

const headings = [...content.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('Main sections in index.html:', headings.slice(0, 10));
