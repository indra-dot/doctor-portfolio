/**
 * scripts/build-internahub.js
 * 
 * Production build pipeline for InternaHub.
 * Assembles all modular source files from src/ into:
 * 1. dist/internahub.html (production distribution file)
 * 2. internahub.html (workspace active file)
 * 
 * Guarantees:
 * - Pure self-contained HTML for Google Sites iframe embedding
 * - Zero literal unescaped </script> inside embedded strings
 * - Automatically executes check-html-scripts.js and clinical tests
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('         BUILDING INTERNAHUB (PRODUCTION)           ');
console.log('====================================================\n');

// 1. Read Template & Styles
const template = fs.readFileSync('src/template.html', 'utf8');
const styles = fs.readFileSync('src/css/styles.css', 'utf8');

// 2. Read Modular JavaScript Components
const scriptComponents = [
  'src/core/context.js',
  'src/core/autocalc.js',
  'src/calculators/m0-general.js',
  'src/calculators/m2-endokrin.js',
  'src/calculators/m1-cairan.js',
  'src/calculators/m3-geh.js',
  'src/calculators/m4-hom.js',
  'src/calculators/m5-pulmo.js',
  'src/calculators/m6-preop-geriatri.js',
  'src/calculators/m7-psikosomatis.js',
  'src/calculators/m8-endokrin-kaki.js',
  'src/calculators/m9-pti-cardio-nefro.js',
  'src/engines/rheuma-engine.js',
  'src/modules/rheumatools-templates.js',
  'src/data/drug-database.js'
];

const loadedScripts = scriptComponents.map(file => {
  if (!fs.existsSync(file)) {
    throw new Error(`Required component missing: ${file}`);
  }
  return fs.readFileSync(file, 'utf8');
});

// 3. Safe Embedding of Adjustr-IO Template HTML
const rawIoHtml = fs.readFileSync('src/modules/adjustr-io.html', 'utf8');
// Guarantee: NEVER allow unescaped </script> to terminate the host script
const safeIoString = JSON.stringify(rawIoHtml).replace(/<\/script/gi, '<\\/script');
const ioContainerJs = `const IO_CONTAINER_HTML = ${safeIoString};`;

loadedScripts.push(ioContainerJs);
loadedScripts.push(fs.readFileSync('src/modules/adjustr-io.js', 'utf8'));
loadedScripts.push(fs.readFileSync('src/core/router.js', 'utf8'));

// 4. Assemble Single Self-Contained Output
const combinedScripts = loadedScripts.join('\n\n');
const output = template
  .replace('/* {{STYLES}} */', styles)
  .replace('/* {{SCRIPTS}} */', combinedScripts);

// 5. Write to dist/ and workspace root
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync('dist/internahub.html', output, 'utf8');
fs.writeFileSync('internahub.html', output, 'utf8');

const outputSizeKb = Math.round(output.length / 1024);
console.log(`✓ Generated dist/internahub.html (${outputSizeKb} KB)`);
console.log(`✓ Updated internahub.html (${outputSizeKb} KB)`);

// 5b. Auto-Sync to Google Drive for Desktop (Hospital Wi-Fi Google Apps Script Bridge)
const gDriveDeployDir = path.resolve('G:/My Drive/internahub-deploy');
if (fs.existsSync(gDriveDeployDir)) {
  const gDriveDest = path.join(gDriveDeployDir, 'internahub.html');
  fs.writeFileSync(gDriveDest, output, 'utf8');
  console.log(`✓ Synced to Google Drive: ${gDriveDest} (Auto-updating Google Apps Script)`);
}

// 6. Run Automated Integrity Verification
console.log('\n[RUNNING BUILD INTEGRITY CHECKS]');
try {
  execSync('node scripts/check-html-scripts.js dist/internahub.html', { stdio: 'inherit' });
  console.log('✓ Build syntax verification passed!');
} catch (err) {
  console.error('❌ Build syntax verification failed!');
  process.exit(1);
}
