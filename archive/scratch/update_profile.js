const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, '..', 'profile.jpg');
const indexPath = path.join(__dirname, '..', 'index.html');

const b64 = fs.readFileSync(profilePath).toString('base64');
let html = fs.readFileSync(indexPath, 'utf8');

const target = '<img src="__PROFILE_IMG__" alt="dr. Ida Bagus Indra Wibawa Putrawan" width="152" height="152" />';

if (!html.includes(target)) {
  console.error('Target not found in index.html!');
  process.exit(1);
}

const replacement = `<img src="profile.jpg" onerror="this.onerror=null;this.src='data:image/jpeg;base64,${b64}';" alt="dr. Ida Bagus Indra Wibawa Putrawan" width="152" height="152" loading="eager" />`;

html = html.replace(target, replacement);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated profile image in index.html!');
