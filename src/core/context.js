/* ===================== PATIENT CONTEXT STORE ===================== */
const LS_KEY = 'internahub_ctx_v1';
const ctx = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (_) { return {}; } })();
function saveCtx() { try { localStorage.setItem(LS_KEY, JSON.stringify(ctx)); } catch (_) {} renderCtxBar(); }
function setCtx(patch) { Object.assign(ctx, patch); saveCtx(); }
function clearCtx() { Object.keys(ctx).forEach(k => delete ctx[k]); saveCtx(); }

const CTX_LABELS = {
  // Demografi & Fisik
  bb:'BB', tb:'TB', age:'Usia', sex:'JK',
  // Tanda Vital & Saraf
  sbp:'TD sis', dbp:'TD dia', hr:'Nadi', rr:'RR', temp:'Suhu', spo2:'SpO2', gcs:'GCS',
  // Hematologi
  wbc:'WBC', hb:'Hb', hct:'HCT', plt:'PLT', ne_abs:'NE#', ly_abs:'LY#',
  mcv:'MCV', mch:'MCH', mchc:'MCHC', ppt:'PPT', inr:'INR', aptt:'APTT',
  ddimer:'D-dimer', fib:'Fibrinogen',
  // Kimia & Elektrolit
  bun:'BUN', ureum:'Ureum', cr:'Kreatinin', egfr_lab:'e-LFG',
  na:'Na', k:'K', cl:'Cl', ca:'Ca', po4:'Fosfat', mg:'Mg',
  alb:'Albumin', prot:'Protein Tot', glob:'Globulin',
  ast:'AST', alt:'ALT', bili:'Bilirubin', bili_dir:'Bili Dir', bili_ind:'Bili Ind',
  alp:'ALP', ggt:'GGT', ldh:'LDH', ua:'Asam Urat',
  glu:'GDS', hba1c:'HbA1c', keton:'Keton',
  tc:'Kol Total', tg:'Trigliserida', hdl:'HDL', ldl:'LDL',
  // AGD / Analisis Gas Darah
  ph:'pH', pco2:'pCO2', po2:'pO2', hco3:'HCO3', be:'BE', so2:'SO2', lac:'Laktat', fio2:'FiO2',
  // Imunologi & Marker
  crp:'CRP', pct:'Procalcitonin', ferritin:'Ferritin', esr:'LED',
  // Analisa Cairan
  ascites_alb:'Alb Asites', ascites_prot:'Prot Asites',
  pleura_prot:'Prot Pleura', pleura_ldh:'LDH Pleura', pleura_alb:'Alb Pleura'
};

function renderCtxBar() {
  const bar = document.getElementById('ctxbar');
  if (!bar) return;
  const keys = Object.keys(ctx).filter(k => CTX_LABELS[k] && ctx[k] !== undefined && ctx[k] !== '');
  if (!keys.length) {
    bar.innerHTML = 'Belum ada data pasien aktif. Tekan <b>Ctrl+V</b> di mana saja untuk menempelkan hasil <b>LabKeep / SIMETRISS</b>, atau gunakan tombol di samping: <button class="btn" style="padding:4px 10px;font-size:12px;margin-left:6px;" onclick="pasteFromClipboard()">⚡ Ambil dari Clipboard</button>';
    return;
  }
  bar.innerHTML = 'Data pasien aktif: ' + keys.map(k => `${CTX_LABELS[k]} <b>${ctx[k]}</b>`).join(' · ') +
    ' <button class="btn" style="padding:4px 8px;font-size:12px;margin-left:8px;" onclick="clearCtx();route()">Hapus</button>';
}

/* ===================== UNIVERSAL CLINICAL & LABKEEP PARSER ===================== */
function parseClinical(text) {
  return parseFastTrackLabKeep(text);
}

function parseFastTrackLabKeep(text) {
  let t = String(text || '');
  // Normalisasi spasi Unicode proporsional (LabKeep / Google Keep) ke spasi standar
  t = t.replace(/[\u2000-\u200B\u00A0\u3000]/g, ' ');
  t = t.replace(/\r/g, '');

  const out = { baseline: {}, series: {} };

  // Helper konversi angka aman
  const toNum = (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const clean = String(val).replace(/,/g, '.').trim();
    const n = parseFloat(clean);
    return isFinite(n) ? n : undefined;
  };

  // Helper ekstraksi deret angka serial (mis. "0.80  -  1.10  -  1.95" atau "176.00")
  const parseSerialNumbers = (str) => {
    if (!str) return [];
    // Pisahkan berdasarkan ' - ' atau spasi/tab serial, abaikan 'x' / '-'
    const tokens = str.trim().split(/\s+(?:-\s+)?|\s*-\s+/);
    const nums = [];
    tokens.forEach(tok => {
      const n = toNum(tok);
      if (n !== undefined) nums.push(n);
    });
    return nums;
  };

  const applySerialParam = (key, rawValStr) => {
    const nums = parseSerialNumbers(rawValStr);
    if (!nums.length) return;
    const latest = nums[nums.length - 1];
    out[key] = latest;
    out.series[key] = nums;
    if (nums.length > 1) {
      out.baseline[key] = nums[0];
    }
  };

  // 1. Ekstraksi Demografi (Usia & JK)
  // Format operan: "NAMA / L / 62 th / 26089265" atau "Pria 62 tahun"
  const ageMatch = t.match(/\b(\d{1,3})\s*(?:tahun|thn|th)\b/i) ||
                   t.match(/\/\s*(?:L|P)\s*\/\s*(\d{1,3})\b/i) ||
                   t.match(/\/\s*(\d{1,3})\s*\/\s*(?:L|P)\b/i);
  if (ageMatch) {
    const a = parseInt(ageMatch[1], 10);
    if (isFinite(a) && a >= 0 && a <= 125) out.age = a;
  }

  if (/\b(?:laki-?laki|pria|male)\b/i.test(t) || /\/\s*L\s*[\/\b]/i.test(t)) {
    out.sex = 'L';
  } else if (/\b(?:perempuan|wanita|female)\b/i.test(t) || /\/\s*P\s*[\/\b]/i.test(t)) {
    out.sex = 'P';
  }

  // 2. Ekstraksi Antropometri & Tanda Vital
  const numRe = '(-?\\d+(?:[.,]\\d+)?)';
  const grabRegex = (key, re, group = 1) => {
    const m = t.match(re);
    if (m) {
      const v = toNum(m[group]);
      if (v !== undefined) out[key] = v;
    }
  };

  // Tekanan Darah
  const td = t.match(/\b(?:T\.?D\.?|BP|Tekanan\s+Darah)\s*[:=]?\s*(\d{2,3})\s*\/\s*(\d{2,3})/i);
  if (td) {
    out.sbp = parseInt(td[1], 10);
    out.dbp = parseInt(td[2], 10);
  }

  grabRegex('hr', new RegExp('\\b(?:N|Nadi|HR|Heart\\s+Rate)\\s*[:=]?\\s*' + numRe + '\\s*(?:x|/|bpm)?', 'i'));
  grabRegex('rr', new RegExp('\\b(?:R|RR|Napas|Respirasi)\\s*[:=]?\\s*' + numRe + '\\s*(?:x|/)?', 'i'));
  grabRegex('temp', new RegExp('\\b(?:S|Suhu|Temp|T)\\s*[:=]?\\s*(3[4-9][.,]?\\d?|4[0-3][.,]?\\d?)\\s*(?:°|c)?', 'i'));
  grabRegex('spo2', new RegExp('\\bSp\\s*O2\\s*[:=]?\\s*' + numRe + '\\s*%?', 'i'));
  grabRegex('gcs', /\bGCS\s*[:=]?\s*(\d{1,2})\b/i);
  grabRegex('bb', new RegExp('\\b(?:BB|Berat\\s+Badan|Weight)\\s*[:=]?\\s*' + numRe + '\\s*(?:kg)?\\b', 'i'));
  grabRegex('tb', new RegExp('\\b(?:TB|Tinggi\\s+Badan|Height)\\s*[:=]?\\s*' + numRe + '\\s*(?:cm)?\\b', 'i'));

  // 3. Ekstraksi POCT (Glukosa POCT Jam-ke-Jam LabKeep)
  // Format: "BS 08 = 55\nBS 10 = 85\nBS 11 = 61"
  const poctMatches = [...t.matchAll(/\bBS\s+(\d{1,2}(?::\d{2})?)\s*=\s*(\d+(?:[.,]\d+)?)/gi)];
  if (poctMatches.length > 0) {
    const poctVals = [];
    poctMatches.forEach(m => {
      const v = toNum(m[2]);
      if (v !== undefined) poctVals.push(v);
    });
    if (poctVals.length > 0) {
      out.poct_latest = poctVals[poctVals.length - 1];
      out.poct_min = Math.min(...poctVals);
      out.poct_max = Math.max(...poctVals);
      if (out.glu === undefined) {
        out.glu = out.poct_latest;
      }
    }
  }

  // 4. Deteksi Seksi Cairan Tubuh (Asites & Pleura)
  let ascitesText = '';
  let pleuraText = '';
  const ascitesIdx = t.search(/ANALISA\s+CAIRAN\s+ASITES/i);
  const pleuraIdx = t.search(/ANALISA\s+CAIRAN\s+PLEURA/i);

  if (ascitesIdx !== -1) {
    const afterAscites = t.slice(ascitesIdx);
    const endAscites = afterAscites.search(/\n\s*===|\n\s*ANALISA|\n\s*UTDRS/i);
    ascitesText = endAscites !== -1 ? afterAscites.slice(0, endAscites) : afterAscites;
  }
  if (pleuraIdx !== -1) {
    const afterPleura = t.slice(pleuraIdx);
    const endPleura = afterPleura.search(/\n\s*===|\n\s*ANALISA|\n\s*UTDRS/i);
    pleuraText = endPleura !== -1 ? afterPleura.slice(0, endPleura) : afterPleura;
  }

  if (ascitesText) {
    const aAlb = ascitesText.match(/\bAlbumin\s+([0-9.,\s-]+)/i);
    if (aAlb) applySerialParam('ascites_alb', aAlb[1]);
    const aProt = ascitesText.match(/\bProtein\s+Total\s+([0-9.,\s-]+)/i);
    if (aProt) applySerialParam('ascites_prot', aProt[1]);
  }
  if (pleuraText) {
    const pProt = pleuraText.match(/\bProtein\s+Total\s+([0-9.,\s-]+)/i);
    if (pProt) applySerialParam('pleura_prot', pProt[1]);
    const pLdh = pleuraText.match(/\bLDH\s*(?:\([^)]+\))?\s+([0-9.,\s-]+)/i);
    if (pLdh) applySerialParam('pleura_ldh', pLdh[1]);
    const pAlb = pleuraText.match(/\bAlbumin\s+([0-9.,\s-]+)/i);
    if (pAlb) applySerialParam('pleura_alb', pAlb[1]);
  }

  // 5. Pemetaan Baris Parameter Laboratorium Utama (Hematologi & Kimia)
  // Menghindari pencocokan di dalam seksi cairan jika sudah terpotong
  const lines = t.split('\n');
  lines.forEach(rawLine => {
    const line = rawLine.trim().replace(/^[-*•·•]+\s*/, '');
    if (!line || line.startsWith('===') || line.startsWith('---') || line.startsWith('Hasil Lab No RM')) return;

    // Helper match line prefix
    const matchLine = (labelRegex) => {
      const m = line.match(labelRegex);
      if (m) {
        return m[1];
      }
      return null;
    };

    // HEMATOLOGI
    let valStr = matchLine(/^WBC\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('wbc', valStr);

    valStr = matchLine(/^NE#\s+([0-9.,\s-]+)/i) || matchLine(/^Neutrofil\s+Absolut\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ne_abs', valStr);

    valStr = matchLine(/^LY#\s+([0-9.,\s-]+)/i) || matchLine(/^Limfosit\s+Absolut\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ly_abs', valStr);

    valStr = matchLine(/^HGB\s+([0-9.,\s-]+)/i) || matchLine(/^Hemoglobin\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/\bHb\s*[:=]?\s*(\d+(?:[.,]\d+)?)/i);
    if (valStr) return applySerialParam('hb', valStr);

    valStr = matchLine(/^HCT\s+([0-9.,\s-]+)/i) || matchLine(/^Hematokrit\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('hct', valStr);

    valStr = matchLine(/^MCV\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('mcv', valStr);

    valStr = matchLine(/^MCH\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('mch', valStr);

    valStr = matchLine(/^MCHC\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('mchc', valStr);

    valStr = matchLine(/^PLT\s+([0-9.,\s-]+)/i) || matchLine(/^Trombosit\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('plt', valStr);

    valStr = matchLine(/^PPT\s+([0-9.,\s-]+)/i) || matchLine(/^PT\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ppt', valStr);

    valStr = matchLine(/^INR\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('inr', valStr);

    valStr = matchLine(/^APTT\s+([0-9.,\s-]+)/i) || matchLine(/^aPTT\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('aptt', valStr);

    valStr = matchLine(/^D-dimer\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ddimer', valStr);

    valStr = matchLine(/^Fibrinogen\s+([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('fib', valStr);

    // LIVER FUNCTION TEST
    valStr = matchLine(/^AST\/SGOT\s+([0-9.,\s-]+)/i) || matchLine(/^SGOT\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^AST\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ast', valStr);

    valStr = matchLine(/^ALT\/SGPT\s+([0-9.,\s-]+)/i) || matchLine(/^SGPT\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^ALT\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('alt', valStr);

    valStr = matchLine(/^Albumin\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr && out.alb === undefined) return applySerialParam('alb', valStr);

    valStr = matchLine(/^Protein\s+Total\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr && out.prot === undefined) return applySerialParam('prot', valStr);

    valStr = matchLine(/^Globulin\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('glob', valStr);

    valStr = matchLine(/^Bilirubin\s+Total\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('bili', valStr);

    valStr = matchLine(/^Bilirubin\s+Direk\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('bili_dir', valStr);

    valStr = matchLine(/^Bilirubin\s+Indirek\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('bili_ind', valStr);

    valStr = matchLine(/^Fosfatase\s+alkali\s*\(ALP\)\s+([0-9.,\s-]+)/i) || matchLine(/^ALP\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('alp', valStr);

    valStr = matchLine(/^Gamma\s+GT\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^GGT\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ggt', valStr);

    valStr = matchLine(/^LDH\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr && out.ldh === undefined) return applySerialParam('ldh', valStr);

    // RENAL FUNCTION TEST
    valStr = matchLine(/^BUN\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('bun', valStr);

    valStr = matchLine(/^Ureum\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ureum', valStr);

    valStr = matchLine(/^Kreatinin\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^Creatinine\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('cr', valStr);

    valStr = matchLine(/^e-LFG\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^eGFR\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('egfr_lab', valStr);

    // ELEKTROLIT & MINERAL
    valStr = matchLine(/^Natrium\s*(?:\(Na\))?(?:\s*-\s*Serum)?\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^Na\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('na', valStr);

    valStr = matchLine(/^Kalium\s*(?:\(K\))?(?:\s*-\s*Serum)?\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^K\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('k', valStr);

    valStr = matchLine(/^Klorida\s*(?:\(Cl\))?(?:\s*-\s*Serum)?\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^Cl\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('cl', valStr);

    valStr = matchLine(/^Kalsium\s*(?:\(Ca\))?(?:\s*Darah)?\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^Ca\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ca', valStr);

    valStr = matchLine(/^Fosfat\s*(?:Inorganik\s*Darah)?\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^Phosphate\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('po4', valStr);

    valStr = matchLine(/^Magnesium\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^Mg\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('mg', valStr);

    // METABOLIK & GULA DARAH
    valStr = matchLine(/^Glukosa\s+Darah\s*\(?Sewaktu\)?\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^GDS\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('glu', valStr);

    valStr = matchLine(/^Hb-?A1c\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('hba1c', valStr);

    valStr = matchLine(/^Asam\s+Urat\s*(?:Darah)?\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ua', valStr);

    // LIPID PROFILE
    valStr = matchLine(/^Kolesterol\s+Total\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('tc', valStr);

    valStr = matchLine(/^Trigliserida\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('tg', valStr);

    valStr = matchLine(/^Kolesterol\s+HDL\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('hdl', valStr);

    valStr = matchLine(/^Kolesterol\s+LDL\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ldl', valStr);

    // AGD / BGA
    valStr = matchLine(/^pH\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ph', valStr);

    valStr = matchLine(/^pCO2\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('pco2', valStr);

    valStr = matchLine(/^pO2\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('po2', valStr);

    valStr = matchLine(/^HCO3-?\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('hco3', valStr);

    valStr = matchLine(/^BE(?:ecf)?\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('be', valStr);

    valStr = matchLine(/^Laktat\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('lac', valStr);

    valStr = matchLine(/^FiO2\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('fio2', valStr);

    // INFLAMASI & LAINNYA
    valStr = matchLine(/^CRP\s*(?:Kuantitatif)?\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('crp', valStr);

    valStr = matchLine(/^Procalcitonin\s*[:=]?\s*([0-9.,\s-]+)/i) || matchLine(/^PCT\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('pct', valStr);

    valStr = matchLine(/^Ferritin\s*[:=]?\s*([0-9.,\s-]+)/i);
    if (valStr) return applySerialParam('ferritin', valStr);
  });

  return out;
}

if (typeof window !== 'undefined') {
  window.parseClinical = parseClinical;
  window.parseFastTrackLabKeep = parseFastTrackLabKeep;
}
