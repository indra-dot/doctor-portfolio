/**
 * scripts/slice-src.js
 * 
 * Accurately slices internahub.html into modular source files in src/
 */

const fs = require('fs');

const content = fs.readFileSync('internahub.html', 'utf8');

// 1. Styles
const styleStart = content.indexOf('<style>') + '<style>'.length;
const styleEnd = content.indexOf('</style>');
const styles = content.substring(styleStart, styleEnd).trim();
fs.writeFileSync('src/css/styles.css', styles, 'utf8');
console.log('✓ src/css/styles.css');

// 2. HTML Skeleton Template
const headBeforeStyle = content.substring(0, content.indexOf('<style>'));
const headAfterStyle = content.substring(styleEnd + '</style>'.length, content.indexOf('<script>\n/* ===================== PATIENT CONTEXT STORE'));
const templateHtml = headBeforeStyle + '<style>\n/* {{STYLES}} */\n</style>' + headAfterStyle + '<script>\n/* {{SCRIPTS}} */\n</script>\n</body>\n</html>\n';
fs.writeFileSync('src/template.html', templateHtml, 'utf8');
console.log('✓ src/template.html');

// 3. Script Slices
const pContext = content.indexOf('/* ===================== PATIENT CONTEXT STORE ===================== */');
const pCalc = content.indexOf('/* ===================== CALCULATOR REGISTRY ===================== */');
const pM2 = content.indexOf('/* ===================== M2: ENDOKRIN, METABOLIK & TIROID');
const pM1 = content.indexOf('/* ===================== M1: CAIRAN, ELEKTROLIT, KRITIS');
const pM3 = content.indexOf('/* ===================== M3: GASTROENTEROHEPATOLOGI');
const pM4 = content.indexOf('/* ===================== M4: HEMATOLOGI-ONKOLOGI');
const pM5 = content.indexOf('/* ===================== M5: REUMATOLOGI & DOSIS ANTIMIKROBA');
const pRheumaTpl = content.indexOf('const RHEUMA_TEMPLATES = {');
const pDrugDb = content.indexOf('// --- PART B: ANTIMICROBIAL RENAL DOSING ENGINE');
const pIoHtml = content.indexOf('const IO_CONTAINER_HTML = "');
const pIoFn = content.indexOf('function initAdjustrIo(container, ctx, emit) {');
const pSearch = content.indexOf('/* ===================== SEARCH ===================== */');
const pScriptEnd = content.lastIndexOf('</script>');

fs.writeFileSync('src/core/context.js', content.substring(pContext, pCalc).trim(), 'utf8');
fs.writeFileSync('src/calculators/m0-general.js', content.substring(pCalc, pM2).trim(), 'utf8');
fs.writeFileSync('src/calculators/m2-endokrin.js', content.substring(pM2, pM1).trim(), 'utf8');
fs.writeFileSync('src/calculators/m1-cairan.js', content.substring(pM1, pM3).trim(), 'utf8');
fs.writeFileSync('src/calculators/m3-geh.js', content.substring(pM3, pM4).trim(), 'utf8');
fs.writeFileSync('src/calculators/m4-hom.js', content.substring(pM4, pM5).trim(), 'utf8');
fs.writeFileSync('src/engines/rheuma-engine.js', content.substring(pM5, pRheumaTpl).trim(), 'utf8');
fs.writeFileSync('src/modules/rheumatools-templates.js', content.substring(pRheumaTpl, pDrugDb).trim(), 'utf8');
fs.writeFileSync('src/data/drug-database.js', content.substring(pDrugDb, pIoHtml).trim(), 'utf8');

// Extract pure HTML for Adjustr-IO (removing JSON escaping)
const rawIoStr = content.substring(pIoHtml + 'const IO_CONTAINER_HTML = "'.length, pIoFn).trim();
// Strip trailing '";'
const rawIoJson = rawIoStr.replace(/";$/, '');
const ioHtmlClean = JSON.parse('"' + rawIoJson + '"');
fs.writeFileSync('src/modules/adjustr-io.html', ioHtmlClean, 'utf8');

fs.writeFileSync('src/modules/adjustr-io.js', content.substring(pIoFn, pSearch).trim(), 'utf8');
fs.writeFileSync('src/core/router.js', content.substring(pSearch, pScriptEnd).trim(), 'utf8');

console.log('✓ All 13 modular source files sliced successfully!');
