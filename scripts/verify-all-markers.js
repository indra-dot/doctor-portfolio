const fs = require('fs');
const content = fs.readFileSync('internahub.html', 'utf8');

const markers = [
  '/* ===================== PATIENT CONTEXT STORE ===================== */',
  '/* ===================== CALCULATOR REGISTRY ===================== */',
  '/* ===================== M2: ENDOKRIN, METABOLIK & TIROID',
  '/* ===================== M1: CAIRAN, ELEKTROLIT, KRITIS',
  '/* ===================== M3: GASTROENTEROHEPATOLOGI',
  '/* ===================== M4: HEMATOLOGI-ONKOLOGI',
  '/* ===================== M5: REUMATOLOGI & DOSIS ANTIMIKROBA',
  'const RHEUMA_TEMPLATES = {',
  '// --- PART B: ANTIMICROBIAL RENAL DOSING ENGINE',
  'const IO_CONTAINER_HTML = "',
  'function initAdjustrIo(container, ctx, emit) {',
  '/* ===================== SEARCH ===================== */'
];

let lastIdx = -1;
markers.forEach(m => {
  const idx = content.indexOf(m);
  console.log(`${idx > lastIdx ? '✓' : '❌'} Marker [${m.substring(0, 35)}...] -> at index ${idx}`);
  lastIdx = idx;
});
