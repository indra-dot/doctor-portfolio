/* ===================== PATIENT CONTEXT STORE ===================== */
const LS_KEY = 'internahub_ctx_v1';
const ctx = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (_) { return {}; } })();
function saveCtx() { try { localStorage.setItem(LS_KEY, JSON.stringify(ctx)); } catch (_) {} renderCtxBar(); }
function setCtx(patch) { Object.assign(ctx, patch); saveCtx(); }
function clearCtx() { Object.keys(ctx).forEach(k => delete ctx[k]); saveCtx(); }
const CTX_LABELS = { bb:'BB', age:'Usia', sex:'JK', sbp:'TD sis', dbp:'TD dia', hr:'Nadi', rr:'RR', temp:'Suhu', spo2:'SpO2', gcs:'GCS',
  bun:'BUN', cr:'Kreatinin', na:'Na', k:'K', ca:'Ca', alb:'Albumin', glu:'GDS', ph:'pH', pco2:'pCO2', hco3:'HCO3', cl:'Cl' };
function renderCtxBar() {
  const keys = Object.keys(ctx).filter(k => CTX_LABELS[k] && ctx[k] !== undefined && ctx[k] !== '');
  document.getElementById('ctxbar').innerHTML = keys.length
    ? 'Data pasien aktif: ' + keys.map(k => `${CTX_LABELS[k]} <b>${ctx[k]}</b>`).join(' · ') + ' <button class="btn" onclick="clearCtx();route()">Hapus</button>'
    : 'Belum ada data pasien. Gunakan "Tempel Data SIMETRISS" atau kirim dari FastTrack.';
}

/* ===================== PARSER (SIMETRISS / CPPT) ===================== */
function parseClinical(text) {
  const t = String(text || '');
  const out = {};
  const num = '(-?\\d+(?:[.,]\\d+)?)';
  const grab = (key, re, group = 1) => { const m = t.match(re); if (m) out[key] = parseFloat(m[group].replace(',', '.')); };
  // Vital: TD 100/60
  const td = t.match(/\bT\.?D\.?\s*[:=]?\s*(\d{2,3})\s*\/\s*(\d{2,3})/i);
  if (td) { out.sbp = +td[1]; out.dbp = +td[2]; }
  grab('hr', new RegExp('\\b(?:N|Nadi|HR)\\s*[:=]?\\s*' + num + '\\s*(?:x|/)?', 'i'));
  grab('rr', new RegExp('\\b(?:R|RR|Napas)\\s*[:=]?\\s*' + num + '\\s*(?:x|/)?', 'i'));
  grab('temp', new RegExp('\\b(?:S|Suhu|T)\\s*[:=]?\\s*(3[4-9][.,]?\\d?|4[0-2][.,]?\\d?)\\s*(?:°|c)?', 'i'));
  grab('spo2', new RegExp('SpO2\\s*[:=]?\\s*' + num, 'i'));
  grab('gcs', /GCS\s*[:=]?\s*(\d{1,2})/i);
  grab('bun', new RegExp('\\bBUN\\s*[:=]?\\s*' + num, 'i'));
  grab('cr', new RegExp('\\b(?:Kreatinin|Creatinine|SC|Cr)\\s*[:=]?\\s*' + num, 'i'));
  grab('na', new RegExp('\\b(?:Natrium|Na)\\s*[:=]?\\s*' + num, 'i'));
  grab('k', new RegExp('\\b(?:Kalium|K)\\s*[:=]?\\s*' + num, 'i'));
  grab('cl', new RegExp('\\b(?:Klorida|Chlorida|Cl)\\s*[:=]?\\s*' + num, 'i'));
  grab('ca', new RegExp('\\b(?:Kalsium|Calcium|Ca)\\s*[:=]?\\s*' + num, 'i'));
  grab('alb', new RegExp('\\bAlbumin\\s*[:=]?\\s*' + num, 'i'));
  grab('glu', new RegExp('\\b(?:GDS|BS|Gula Darah Sewaktu)\\s*[:=]?\\s*' + num, 'i'));
  grab('ph', new RegExp('\\bpH\\s*[:=]?\\s*(7[.,]\\d+|6[.,]\\d+)', 'i'));
  grab('pco2', new RegExp('\\bpCO2\\s*[:=]?\\s*' + num, 'i'));
  grab('hco3', new RegExp('\\bHCO3-?\\s*[:=]?\\s*' + num, 'i'));
  grab('bb', new RegExp('\\b(?:BB|Berat Badan)\\s*[:=]?\\s*' + num + '\\s*(?:kg)?', 'i'));
  const age = t.match(/(\d{1,3})\s*(?:tahun|thn|th)\b/i); if (age) out.age = +age[1];
  if (/\b(laki-?laki|pria|male)\b/i.test(t)) out.sex = 'L';
  else if (/\b(perempuan|wanita|female)\b/i.test(t)) out.sex = 'P';
  return out;
}