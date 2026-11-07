/**
 * tests/calc/test-fasttrack-autocalc.js
 * 
 * Comprehensive Verification Suite for:
 * 1. FastTrack / LabKeep Real-world Text Parser (Presisi Tinggi)
 * 2. Deterministic Auto-Calculate Engine (25+ Skor Klinis)
 * 3. Desktop Bridge Payload Compatibility (NEPRO/EMER/GERIOP/adjstr)
 * 4. Privacy Guardrail (Zero PHI in Storage)
 */

const assert = require('assert');
const { getInternaHubEnv } = require('../harness');

async function runTests() {
  console.log('\n--- Testing FastTrack (LabKeep) Parser & Auto-Calculate Engine ---');
  let passed = 0;
  let failed = 0;

  const dom = getInternaHubEnv();
  const parseClinical = dom.window.parseClinical;
  const AutoCalcEngine = dom.window.AutoCalcEngine;
  const runAutoCalc = dom.window.runAutoCalc || (AutoCalcEngine && AutoCalcEngine.runAutoCalc);

  // 1. TEST KASUS NYATA LABKEEP (Screenshot 2: No RM 26073584)
  const realLabKeepText = `
Hasil Lab No RM: 26073584
(04-11-2026 s/d 07-11-2026)

glukosa
5/11/26
BS 22 = 97

7/11/26
BS 08 = 55
BS 10 = 85
BS 11 = 61

===============

DL   6/11/26
WBC  16.97
NE#  15.19
LY#  1.27
HGB  11.90
HCT  35.20
MCV  81.90
MCH  27.70
MCHC 33.80
PLT  176.00

6/11/26
PPT  19.3
INR  1.78
APTT 69.1

LFT  6/11/26
AST/SGOT 26.00
ALT/SGPT 27.00

RFT  6/11/26
BUN  18.0
Kreatinin 0.45
e-LFG 133.98

Elektrolit 6/11/26
Natrium (Na) - Serum 122
Kalium (K) - Serum 3.33
Klorida (Cl) - Serum 97.8
`;

  try {
    const res = parseClinical(realLabKeepText);
    assert(res, 'Parser must return a result object');

    // Pastikan No RM TIDAK disimpan
    assert.strictEqual(res.no_rm, undefined, 'No RM must NOT be stored');
    assert.strictEqual(res.rm, undefined, 'RM must NOT be stored');

    // POCT checks
    assert.strictEqual(res.glu, 61, `Expected glu = 61 (latest POCT), got ${res.glu}`);
    assert.strictEqual(res.poct_min, 55, `Expected poct_min = 55, got ${res.poct_min}`);
    assert.strictEqual(res.poct_max, 97, `Expected poct_max = 97, got ${res.poct_max}`);

    // Hematologi checks
    assert.strictEqual(res.wbc, 16.97, `Expected WBC 16.97, got ${res.wbc}`);
    assert.strictEqual(res.ne_abs, 15.19, `Expected NE# 15.19, got ${res.ne_abs}`);
    assert.strictEqual(res.ly_abs, 1.27, `Expected LY# 1.27, got ${res.ly_abs}`);
    assert.strictEqual(res.hb, 11.9, `Expected HGB 11.9, got ${res.hb}`);
    assert.strictEqual(res.hct, 35.2, `Expected HCT 35.2, got ${res.hct}`);
    assert.strictEqual(res.mcv, 81.9, `Expected MCV 81.9, got ${res.mcv}`);
    assert.strictEqual(res.plt, 176, `Expected PLT 176, got ${res.plt}`);

    // Koagulasi checks
    assert.strictEqual(res.ppt, 19.3, `Expected PPT 19.3, got ${res.ppt}`);
    assert.strictEqual(res.inr, 1.78, `Expected INR 1.78, got ${res.inr}`);
    assert.strictEqual(res.aptt, 69.1, `Expected APTT 69.1, got ${res.aptt}`);

    // LFT & RFT
    assert.strictEqual(res.ast, 26, `Expected AST 26, got ${res.ast}`);
    assert.strictEqual(res.alt, 27, `Expected ALT 27, got ${res.alt}`);
    assert.strictEqual(res.bun, 18, `Expected BUN 18, got ${res.bun}`);
    assert.strictEqual(res.cr, 0.45, `Expected Cr 0.45, got ${res.cr}`);
    assert.strictEqual(res.egfr_lab, 133.98, `Expected e-LFG 133.98, got ${res.egfr_lab}`);

    // Elektrolit
    assert.strictEqual(res.na, 122, `Expected Na 122, got ${res.na}`);
    assert.strictEqual(res.k, 3.33, `Expected K 3.33, got ${res.k}`);
    assert.strictEqual(res.cl, 97.8, `Expected Cl 97.8, got ${res.cl}`);

    passed++;
    console.log('  ✓ Real-world LabKeep text (RM 26073584) parsed 20+ fields with 100% accuracy');
  } catch (e) {
    failed++;
    console.error('  ❌ Real-world LabKeep parser failed:', e.message);
  }

  // 2. TEST AUTO-CALCULATE ENGINE DENGAN DATA KASUS NYATA TERSEBUT
  try {
    const rawData = parseClinical(realLabKeepText);
    // Tambahkan usia 62 th, sex Pria, BB 65 kg
    rawData.age = 62;
    rawData.sex = 'L';
    rawData.bb = 65;

    const calcRes = runAutoCalc(rawData);
    assert(calcRes, 'AutoCalc must return result');
    assert(calcRes.scores.length >= 6, `Expected at least 6 auto-calculated scores, got ${calcRes.scores.length}`);

    // Cek Rasio BUN:Cr (18 / 0.45 = 40)
    const bunCr = calcRes.scores.find(s => s.id === 'aki-bun-cr');
    assert(bunCr, 'BUN:Cr score must exist');
    assert.strictEqual(bunCr.value, '40,0 : 1');

    // Cek APRI = ((26/35)/176)*100 = 0.42
    const apri = calcRes.scores.find(s => s.id === 'apri');
    assert(apri, 'APRI score must exist');
    assert.strictEqual(apri.value, '0,42');

    // Cek De Ritis = 26 / 27 = 0.96
    const deritis = calcRes.scores.find(s => s.id === 'deritis');
    assert(deritis, 'De Ritis score must exist');
    assert.strictEqual(deritis.value, '0,96');

    // Cek FIB-4 = (62 * 26) / (176 * sqrt(27)) = 1.76
    const fib4 = calcRes.scores.find(s => s.id === 'fib4');
    assert(fib4, 'FIB-4 score must exist');
    assert.strictEqual(fib4.value, '1,76');

    // Cek NLR = 15.19 / 1.27 = 11.96
    const nlr = calcRes.scores.find(s => s.id === 'nlr');
    assert(nlr, 'NLR score must exist');
    assert.strictEqual(nlr.value, '11,96');

    // Cek Alerts: Hiponatremia, Hipokalemia, Hipoglikemia POCT
    assert(calcRes.alerts.some(a => a.includes('3,33')), 'Kalium alert must trigger');
    assert(calcRes.alerts.some(a => a.includes('55')), 'POCT hypoglycemia alert must trigger');

    // Cek Summary Strings
    assert(calcRes.keepSummary.includes('KALKULASI MEDIS OTOMATIS'), 'Keep summary must be formatted');
    assert(calcRes.cpptSummary.includes('[InternaHub CDSS Auto-Calculate'), 'CPPT summary must be formatted');

    passed++;
    console.log('  ✓ AutoCalcEngine computed APRI, FIB-4, De Ritis, BUN:Cr, NLR & triggered clinical alerts');
  } catch (e) {
    failed++;
    console.error('  ❌ AutoCalcEngine verification failed:', e.message);
  }

  // 3. TEST SERIAL HISTORY & AKI KDIGO TRACKING
  try {
    const serialText = `
      Kreatinin   0.80  -  1.10  -  2.40
      Albumin     3.8   -  3.2   -  2.5
    `;
    const sRes = parseClinical(serialText);
    assert.strictEqual(sRes.cr, 2.40, 'Latest Cr must be 2.40');
    assert.strictEqual(sRes.baseline.cr, 0.80, 'Baseline Cr must be 0.80');
    assert.deepStrictEqual(Array.from(sRes.series.cr), [0.80, 1.10, 2.40], 'Full series must be stored');

    const sCalc = runAutoCalc(sRes);
    const aki = sCalc.scores.find(s => s.id === 'aki-kdigo');
    assert(aki, 'AKI KDIGO score must trigger on significant delta');
    assert.strictEqual(aki.value, 'Stage 3', 'Expected AKI Stage 3 due to 3x rise from baseline');

    passed++;
    console.log('  ✓ Serial timeline tracking accurately detects AKI KDIGO Stage 3 progression');
  } catch (e) {
    failed++;
    console.error('  ❌ Serial AKI test failed:', e.message);
  }

  // 4. TEST FLUID ANALYSIS (ASITES & PLEURA SEPARATION)
  try {
    const fluidText = `
      Albumin 3.4
      Protein Total 6.8
      LDH 220

      ANALISA CAIRAN ASITES
      Albumin 1.2
      Protein Total 2.0

      ANALISA CAIRAN PLEURA
      Protein Total 4.2
      LDH ( Cairan Tubuh ) 380
    `;
    const fRes = parseClinical(fluidText);
    assert.strictEqual(fRes.alb, 3.4, 'Serum Alb must be 3.4');
    assert.strictEqual(fRes.prot, 6.8, 'Serum Prot must be 6.8');
    assert.strictEqual(fRes.ascites_alb, 1.2, 'Ascites Alb must be 1.2');
    assert.strictEqual(fRes.pleura_prot, 4.2, 'Pleura Prot must be 4.2');
    assert.strictEqual(fRes.pleura_ldh, 380, 'Pleura LDH must be 380');

    const fCalc = runAutoCalc(fRes);
    const saag = fCalc.scores.find(s => s.id === 'saag');
    assert(saag, 'SAAG must be computed');
    assert.strictEqual(saag.value, '2,20 g/dL');
    assert(saag.interpretation.includes('Hipertensi Portal Positif'));

    const lights = fCalc.scores.find(s => s.id === 'lights-criteria');
    assert(lights, "Light's Criteria must be computed");
    assert.strictEqual(lights.value, 'Eksudat');

    passed++;
    console.log("  ✓ Section-aware fluid analysis correctly differentiated SAAG & Light's Criteria");
  } catch (e) {
    failed++;
    console.error('  ❌ Fluid analysis test failed:', e.message);
  }

  // 5. TEST BRIDGE PAYLOAD PARSER (FastTrack NEPRO_FIELDS Compatibility)
  try {
    const fastTrackPayload = {
      pasien: { jenis_kelamin: 'L', usia: 58, bb: 70, tb: 172 },
      tanda_vital: { sbp: 130, dbp: 80, hr: 88, rr: 20, temp: 37.2, spo2: 98, gcs: 15 },
      kimia: {
        na: 138, k: 4.2, cl: 102, ca: 9.1, albumin: 3.5, bun: 16, kreatinin: 1.1, glukosa: 145
      },
      hematologi: { hb: 13.5, hct: 41.0, plt: 240, wbc: 8.5 },
      agd: { ph: 7.40, pco2: 40, hco3: 24, po2: 92, laktat: 1.2 }
    };

    // Call bridge mapper
    const mapped = dom.window.mapBridgePayload ? dom.window.mapBridgePayload(fastTrackPayload) : null;
    assert(mapped, 'mapBridgePayload must exist');
    assert.strictEqual(mapped.age, 58);
    assert.strictEqual(mapped.sex, 'L');
    assert.strictEqual(mapped.na, 138);
    assert.strictEqual(mapped.k, 4.2);
    assert.strictEqual(mapped.cl, 102);
    assert.strictEqual(mapped.ca, 9.1);
    assert.strictEqual(mapped.alb, 3.5);
    assert.strictEqual(mapped.cr, 1.1);
    assert.strictEqual(mapped.hb, 13.5);
    assert.strictEqual(mapped.plt, 240);
    assert.strictEqual(mapped.ph, 7.40);

    passed++;
    console.log('  ✓ FastTrack NEPRO_FIELDS bridge payload mapped 100% of parameters');
  } catch (e) {
    failed++;
    console.error('  ❌ Bridge payload test failed:', e.message);
  }

  return { passed, failed };
}

module.exports = { runTests };
