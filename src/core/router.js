/* ===================== SEARCH ===================== */
function score(c, q) {
  const hay = (c.nama + ' ' + c.divisi + ' ' + c.tags).toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).reduce((s, w) => s + (hay.includes(w) ? (c.nama.toLowerCase().includes(w) ? 3 : 1) : -100), 0);
}
let divFilter = '';
function route() {
  const id = location.hash.slice(1);
  const c = R.find(x => x.id === id);
  renderChips();
  c ? renderCalc(c) : renderList();
}
function renderChips() {
  const divs = [...new Set(R.map(c => c.divisi))].sort();
  document.getElementById('chips').innerHTML = ['Semua', ...divs].map(d =>
    `<button class="chip ${(divFilter || 'Semua') === d ? 'on' : ''}" data-d="${d}">${d}</button>`).join('');
  document.querySelectorAll('.chip').forEach(b => b.onclick = () => { divFilter = b.dataset.d === 'Semua' ? '' : b.dataset.d; location.hash = ''; route(); });
}
function renderList() {
  const q = document.getElementById('q').value.trim();
  let list = R.filter(c => !divFilter || c.divisi === divFilter);
  if (q) list = list.map(c => [c, score(c, q)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).map(x => x[0]);
  document.getElementById('view').innerHTML = list.length
    ? `<div class="grid">${list.map(c => `<div class="card" onclick="location.hash='${c.id}'"><span class="tag">${c.divisi}</span><h3>${c.nama}</h3><small>${c.fields ? c.fields.length + ' parameter' : 'Protokol Interaktif'}</small></div>`).join('')}</div>`
    : '<p style="color:var(--mut)">Tidak ada hasil.</p>';
}
function renderCalc(c) {
  if (c.mount) {
    document.getElementById('view').innerHTML = `<button class="btn" onclick="location.hash=''">← Semua kalkulator</button>
      <div class="panel"><span class="tag">${c.divisi}</span><h2>${c.nama}</h2><div id="calc-mount"></div><div id="res"></div>
      <button class="btn" style="margin-top:14px" id="copyBtn">Salin hasil untuk CPPT</button></div>`;
    const mountEl = document.getElementById('calc-mount');
    const updateRes = (r) => {
      const tbl = r && r.table ? `<table style="width:100%;margin-top:10px;font-size:13px;border-collapse:collapse">${r.table.map(x => `<tr><td style="padding:4px 6px;border-bottom:1px solid var(--bd)">${x[0]}</td><td style="padding:4px 6px;border-bottom:1px solid var(--bd);text-align:right"><b>${x[1]}</b></td></tr>`).join('')}</table>` : '';
      document.getElementById('res').innerHTML = r ? `<div class="res" style="border-color:var(--${r.cls || 'ac'})"><b>${r.value || ''}</b><br>${r.text || ''}${tbl}</div>` : '';
      window._last = r ? (r.cppt || `${c.nama}: ${r.value}. ${String(r.text||'').replace(/<[^>]+>/g, '')}`) : '';
    };
    c.mount(mountEl, ctx, updateRes);
    document.getElementById('copyBtn').onclick = () => { if (window._last) { navigator.clipboard.writeText(window._last).catch(() => {}); toast('Hasil disalin untuk CPPT'); } };
    return;
  }
  const html = c.fields.map(f => {
    const pre = f.ctx ? ctx[f.ctx] : (f.ctxFn ? f.ctxFn(ctx) : undefined);
    const auto = pre !== undefined && pre !== '';
    if (f.type === 'check') return `<label class="chk"><input type="checkbox" data-f="${f.id}" ${pre ? 'checked' : ''}> ${f.label}${auto ? ' <small style="color:var(--ok)">(auto)</small>' : ''}</label>`;
    if (f.type === 'select') return `<label>${f.label}</label><select data-f="${f.id}">${f.options.map(o => `<option value="${o[1]}" ${String(o[1]) === String(f.def) ? 'selected' : ''}>${o[0]}</option>`).join('')}</select>`;
    const val = auto ? pre : (f.def !== undefined ? f.def : '');
    return `<label>${f.label}${auto ? ' <small style="color:var(--ok)">(auto)</small>' : ''}</label><input type="number" step="${f.step || 'any'}" data-f="${f.id}" class="${auto ? 'auto' : ''}" value="${val}">`;
  }).join('');
  document.getElementById('view').innerHTML = `<button class="btn" onclick="location.hash=''">← Semua kalkulator</button>
    <div class="panel"><span class="tag">${c.divisi}</span><h2>${c.nama}</h2>${html}<div id="res"></div>
    <button class="btn" style="margin-top:12px" id="copyBtn">Salin hasil untuk CPPT</button></div>`;
  const calc = () => {
    const v = {};
    document.querySelectorAll('[data-f]').forEach(el => { v[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.tagName === 'SELECT' ? el.value : (el.value === '' ? undefined : parseFloat(el.value)); });
    let r = null; try { r = c.compute(v); } catch (e) { r = { value: 'Input tidak valid', text: e.message, cls: 'bad' }; }
    const tbl = r && r.table ? `<table style="width:100%;margin-top:10px;font-size:13px;border-collapse:collapse">${r.table.map(x => `<tr><td style="padding:3px 6px;border-bottom:1px solid var(--bd)">${x[0]}</td><td style="padding:3px 6px;border-bottom:1px solid var(--bd);text-align:right"><b>${x[1]}</b></td></tr>`).join('')}</table>` : '';
    document.getElementById('res').innerHTML = r ? `<div class="res" style="border-color:var(--${r.cls})"><b>${r.value}</b><br>${r.text}${tbl}</div>` : '';
    window._last = r ? (r.cppt || `${c.nama}: ${r.value}. ${r.text.replace(/<[^>]+>/g, '')}`) : '';
  };
  document.querySelectorAll('[data-f]').forEach(el => el.addEventListener('input', calc));
  document.getElementById('copyBtn').onclick = () => { if (window._last) { navigator.clipboard.writeText(window._last).catch(() => {}); toast('Hasil disalin'); } };
  calc();
}
function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 2500); }

/* ===================== PASTE MODAL ===================== */
const pm = document.getElementById('pasteModal');
document.getElementById('btnPaste').onclick = () => pm.classList.add('show');
document.getElementById('pasteCancel').onclick = () => pm.classList.remove('show');
document.getElementById('pasteGo').onclick = () => {
  const r = parseClinical(document.getElementById('pasteTxt').value);
  const n = Object.keys(r).length;
  document.getElementById('pasteOut').innerHTML = n ? `Terdeteksi ${n} nilai: ` + Object.entries(r).map(([k, v]) => `${CTX_LABELS[k] || k}=<b>${v}</b>`).join(', ') : 'Tidak ada nilai terdeteksi.';
  if (n) { setCtx(r); route(); toast(`${n} nilai diisi otomatis`); setTimeout(() => pm.classList.remove('show'), 1200); }
};

/* ===================== FASTTRACK BRIDGE ===================== */
// Payload NE.PRO FastTrack: {pasien, tanda_vital, kimia, agd, hematologi, urin, transfer_id}
function mapBridgePayload(p) {
  const o = {}; const pick = (obj, map) => { if (!obj) return; for (const [src, dst] of Object.entries(map)) { const v = parseFloat(obj[src]); if (!isNaN(v)) o[dst] = v; } };
  const ps = p.pasien || {};
  const age = parseInt(ps.usia ?? ps.umur ?? ps.age, 10); if (!isNaN(age)) o.age = age;
  const sx = String(ps.jenis_kelamin ?? ps.sex ?? '').toUpperCase(); if (sx.startsWith('L') || sx.startsWith('P')) o.sex = sx[0];
  pick(p.pasien, { bb:'bb', berat_badan:'bb' });
  pick(p.tanda_vital, { bb:'bb', sbp:'sbp', dbp:'dbp', nadi:'hr', hr:'hr', rr:'rr', respirasi:'rr', suhu:'temp', temp:'temp', spo2:'spo2', gcs:'gcs' });
  pick(p.kimia, { bun:'bun', kreatinin:'cr', creatinine:'cr', natrium:'na', kalium:'k', klorida:'cl', kalsium:'ca', albumin:'alb', gds:'glu', glukosa:'glu' });
  pick(p.agd, { ph:'ph', pco2:'pco2', hco3:'hco3' });
  return o;
}
function importPayload(p) {
  const patch = mapBridgePayload(p);
  if (Object.keys(patch).length) { setCtx(patch); route(); toast('Data dari FastTrack diterima'); }
  else console.warn('InternaHub: payload tidak dikenali', p);
}
window.addEventListener('message', ev => {
  const d = ev.data;
  if (!d || (d.type !== 'INTERNAHUB_IMPORT' && d.type !== 'NEPRO_IMPORT')) return;
  importPayload(d.data || {});
  const tid = d.data && d.data.transfer_id;
  try { ev.source && ev.source.postMessage({ type: d.type + '_ACK', transfer_id: tid }, '*'); } catch (_) {}
  if (d.type === 'INTERNAHUB_IMPORT') try { ev.source && ev.source.postMessage({ type: 'NEPRO_IMPORT_ACK', transfer_id: tid }, '*'); } catch (_) {}
});
(function urlImport() {
  const m = (location.search + '&' + location.hash.slice(1)).match(/data=([^&]+)/);
  if (!m) return;
  try { importPayload(JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1])))))); history.replaceState(null, '', location.pathname); } catch (_) {}
})();

/* ===================== INIT ===================== */
document.getElementById('q').addEventListener('input', () => { if (location.hash) location.hash = ''; renderList(); });
document.getElementById('btnTheme').onclick = () => { document.body.classList.toggle('light'); localStorage.setItem('internahub_theme', document.body.classList.contains('light') ? 'light' : 'dark'); };
if (localStorage.getItem('internahub_theme') === 'light') document.body.classList.add('light');
window.addEventListener('hashchange', route);
renderCtxBar(); route();