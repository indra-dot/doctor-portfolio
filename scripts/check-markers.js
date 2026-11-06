const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const scriptStart = content.indexOf('<script>\n/* ===================== PATIENT CONTEXT') + '<script>\n'.length;
const scriptEnd = content.lastIndexOf('</script>');
const scriptBody = content.substring(scriptStart, scriptEnd);

const markers = [
  '/* ===================== PATIENT CONTEXT',
  '/* ===================== CALCULATOR REGISTRY',
  '/* ===================== RHEUMATOOLS REGISTRY',
  'const RHEUMA_TEMPLATES =',
  '// --- PART B: ANTIMICROBIAL RENAL DOSING ENGINE',
  '// --- CDSS CLINICAL CALCULATION ENGINE ---',
  'const IO_CONTAINER_HTML = "',
  '/* ===================== SEARCH, FILTER & ROUTER'
];

markers.forEach(m => {
  console.log(`Marker "${m.substring(0, 30)}...": index = ${scriptBody.indexOf(m)}`);
});
