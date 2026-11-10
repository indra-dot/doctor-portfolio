/**
 * scripts/build-index.js
 *
 * Production build & Google Apps Script (GAS) sync pipeline for Doctor Portfolio (index.html).
 * Mirrors the InternaHub pipeline (scripts/build-internahub.js):
 * 1. Maintains modular source files in src/portfolio/ (template.html, styles.css, app.js)
 *    while also supporting direct edits to root index.html (bi-directional sync).
 * 2. Embeds profile.jpg as an inline base64 Data URI so the page is 100% self-contained
 *    when served from Google Apps Script (script.google.com) with zero broken relative URLs.
 * 3. Outputs to:
 *    - dist/index.html (production distribution file)
 *    - index.html (workspace active file)
 *    - G:/My Drive/internahub-deploy/index.html (auto-synced for Google Apps Script Web App)
 * 4. Runs automated syntax & script tag integrity verification (check-html-scripts.js).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('      BUILDING DOCTOR PORTFOLIO (INDEX.HTML)        ');
console.log('====================================================\n');

const srcDir = path.resolve('src/portfolio');
const tplPath = path.join(srcDir, 'template.html');
const cssPath = path.join(srcDir, 'styles.css');
const jsPath = path.join(srcDir, 'app.js');
const rootIndexPath = path.resolve('index.html');
const profileImgPath = path.resolve('profile.jpg');

const gasAnchorBridgeCode = `
    /* ==========================================================
       Google Apps Script (GAS) & Google Sites Iframe Bridge:
       Smooth internal #anchor scrolling without iframe reload
       ========================================================== */
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var targetId = href.slice(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });`;

/**
 * Extracts modular src/portfolio/* files from root index.html
 * (used on initial bootstrap or when root index.html was edited directly).
 */
function syncFromRootIndex() {
  const html = fs.readFileSync(rootIndexPath, 'utf8');
  const styleStart = html.indexOf('<style>');
  const styleEnd = html.indexOf('</style>');
  const scriptStart = html.lastIndexOf('<script>');
  const scriptEnd = html.lastIndexOf('</script>');

  if (styleStart === -1 || styleEnd === -1 || scriptStart === -1 || scriptEnd === -1) {
    throw new Error('Could not locate <style> or <script> blocks in index.html');
  }

  const styles = html.slice(styleStart + '<style>'.length, styleEnd).trim();
  let scripts = html.slice(scriptStart + '<script>'.length, scriptEnd).trim();

  if (!scripts.includes('Google Apps Script (GAS) & Google Sites Iframe Bridge')) {
    scripts += '\n' + gasAnchorBridgeCode;
  }

  let template =
    html.slice(0, styleStart + '<style>'.length) +
    '\n/* {{STYLES}} */\n  ' +
    html.slice(styleEnd, scriptStart + '<script>'.length) +
    '\n/* {{SCRIPTS}} */\n  ' +
    html.slice(scriptEnd);

  // Normalize profile avatar <img> tags to use {{PROFILE_DATA_URI}} placeholder
  template = template.replace(
    /<img\s+src="(?:profile\.jpg|data:image\/jpeg;base64,[^"]+)"\s+alt="dr\.\s*Ida Bagus Indra Wibawa Putrawan"(?:\s+onerror="[^"]+")?(?:\s+loading="eager")?\s*\/>/g,
    '<img src="{{PROFILE_DATA_URI}}" alt="dr. Ida Bagus Indra Wibawa Putrawan" loading="eager" />'
  );

  fs.mkdirSync(srcDir, { recursive: true });
  fs.writeFileSync(tplPath, template, 'utf8');
  fs.writeFileSync(cssPath, styles + '\n', 'utf8');
  fs.writeFileSync(jsPath, scripts + '\n', 'utf8');
}

// 1. Bootstrap or detect direct edits to index.html
if (!fs.existsSync(tplPath) || !fs.existsSync(cssPath) || !fs.existsSync(jsPath)) {
  console.log('• Initializing modular source files in src/portfolio/ from index.html...');
  syncFromRootIndex();
} else if (fs.existsSync(rootIndexPath)) {
  const rootMtime = fs.statSync(rootIndexPath).mtimeMs;
  const srcMaxMtime = Math.max(
    fs.statSync(tplPath).mtimeMs,
    fs.statSync(cssPath).mtimeMs,
    fs.statSync(jsPath).mtimeMs
  );
  // If index.html was directly edited more than 1.5s after src/portfolio/*
  if (rootMtime > srcMaxMtime + 1500) {
    console.log('• Detected direct edit in root index.html -> syncing to src/portfolio/...');
    syncFromRootIndex();
  }
}

// 2. Read Modular Source Components
const template = fs.readFileSync(tplPath, 'utf8');
const styles = fs.readFileSync(cssPath, 'utf8');
const scripts = fs.readFileSync(jsPath, 'utf8');

// 3. Read & Encode profile.jpg as Base64 Data URI for 100% Standalone GAS Compatibility
let profileDataUri = '';
if (fs.existsSync(profileImgPath)) {
  const b64 = fs.readFileSync(profileImgPath).toString('base64');
  profileDataUri = `data:image/jpeg;base64,${b64}`;
} else {
  console.warn('⚠ Warning: profile.jpg not found, using SVG fallback.');
  profileDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2300F2FE' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
}

// Guarantee: NEVER allow unescaped </script> inside JS
const safeScripts = scripts.replace(/<\/script/gi, '<\\/script');

// 4. Assemble Single Self-Contained HTML Output
const output = template
  .replace('/* {{STYLES}} */', () => styles.trim())
  .replace('/* {{SCRIPTS}} */', () => safeScripts.trim())
  .replace(/\{\{PROFILE_DATA_URI\}\}/g, () => profileDataUri);

// 5. Write to dist/ and workspace root
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync('dist/index.html', output, 'utf8');
fs.writeFileSync('index.html', output, 'utf8');

// Touch src/portfolio/template.html so its mtime matches the build
const now = new Date();
fs.utimesSync(tplPath, now, now);

const outputSizeKb = Math.round(output.length / 1024);
console.log(`✓ Generated dist/index.html (${outputSizeKb} KB)`);
console.log(`✓ Updated index.html (${outputSizeKb} KB)`);

// 6. Auto-Sync to Google Drive for Desktop (Google Apps Script Bridge)
const gDriveDeployDir = path.resolve('G:/My Drive/internahub-deploy');
if (fs.existsSync(gDriveDeployDir)) {
  const gDriveDest = path.join(gDriveDeployDir, 'index.html');
  fs.writeFileSync(gDriveDest, output, 'utf8');
  console.log(`✓ Synced to Google Drive: ${gDriveDest} (Auto-updating Google Apps Script)`);
} else {
  console.log(`ℹ Google Drive folder not mounted at ${gDriveDeployDir} (skipped Drive sync)`);
}

// 7. Run Automated Integrity Verification
console.log('\n[RUNNING PORTFOLIO BUILD INTEGRITY CHECKS]');
try {
  execSync('node scripts/check-html-scripts.js dist/index.html', { stdio: 'inherit' });
  console.log('✓ Portfolio build syntax verification passed!');
} catch (err) {
  console.error('❌ Portfolio build syntax verification failed!');
  process.exit(1);
}
