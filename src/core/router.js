/* ===================== SUBSPECIALTIES METADATA ===================== */
const SUBSPECIALTIES = [
  {
    id: 'gastro',
    nama: 'Gastroenterologi & Hepatologi',
    short: 'GEH / Gastro',
    icon: 'fa-solid fa-utensils',
    color: '#00F2FE',
    glow: 'rgba(0, 242, 254, 0.4)',
    badge: 'GEH',
    deskripsi: 'Perdarahan saluran cerna (UGIB/LGIB), sirosis & dekompensasi hati (CTP/MELD), pankreatitis akut, IBD, dan motilitas.',
    matchDivisi: ['Gastroenterohepatologi']
  },
  {
    id: 'nefro',
    nama: 'Ginjal, Hipertensi & Cairan',
    short: 'Nefrologi',
    icon: 'fa-solid fa-water',
    color: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.4)',
    badge: 'Nefro',
    deskripsi: 'Klirens kreatinin Cockcroft-Gault, CKD-EPI 2021, AKI staging, terapi cairan & koreksi elektrolit (Na, K, Ca, Mg, P).',
    matchDivisi: ['Ginjal-Hipertensi', 'Cairan & Elektrolit'],
    matchIds: ['anion-gap', 'aki-bun-cr', 'crcl-cockcroft', 'ckd-epi-2021', 'maint-fluid', 'hypoNa', 'hyperNa', 'k-mgmt', 'ca-mgmt', 'mg-mgmt', 'po4-mgmt']
  },
  {
    id: 'endokrin',
    nama: 'Endokrin, Metabolik & Diabetes',
    short: 'Endokrin',
    icon: 'fa-solid fa-fire-flame-curved',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.4)',
    badge: 'EMD',
    deskripsi: 'Krisis tiroid (BWPS) & miksedema, krisis adrenal, DKA tracker, bridging insulin, hipoglikemia, TDD & kardiometabolik.',
    matchDivisi: ['Endokrin-Metabolik']
  },
  {
    id: 'rheuma',
    nama: 'Reumatologi',
    short: 'Reuma',
    icon: 'fa-solid fa-bone',
    color: '#C084FC',
    glow: 'rgba(192, 132, 252, 0.4)',
    badge: 'Reuma',
    deskripsi: 'Skor aktivitas RA (DAS28, CDAI, SDAI), kriteria SLEDAI, lupus, SpA aksial, sklerosis sistemik, gout & alur nyeri sendi.',
    matchDivisi: ['Reumatologi']
  },
  {
    id: 'hom',
    nama: 'Hematologi & Onkologi Medik',
    short: 'HOM',
    icon: 'fa-solid fa-droplet',
    color: '#F43F5E',
    glow: 'rgba(244, 63, 94, 0.4)',
    badge: 'HOM',
    deskripsi: 'Demam neutropenia (MASCC/CISNE), komplikasi onkologi (TLS, SVCO), kemoterapi Calvert, DIC, HIT, transfusi & myeloma.',
    matchDivisi: ['Hematologi-Onkologi']
  },
  {
    id: 'pulmo',
    nama: 'Pulmonologi & Respirologi',
    short: 'Pulmo',
    icon: 'fa-solid fa-lungs',
    color: '#2DD4BF',
    glow: 'rgba(45, 212, 191, 0.4)',
    badge: 'Pulmo',
    deskripsi: 'Stratifikasi risiko pneumonia komunitas (CURB-65 & PSI/PORT Score), evaluasi fungsi respirasi & asma perioperatif.',
    matchDivisi: ['Pulmonologi'],
    matchIds: ['curb65', 'psi', 'preop-asthma', 'abg']
  },
  {
    id: 'kardio',
    nama: 'Kardiologi & Vaskular',
    short: 'Kardio',
    icon: 'fa-solid fa-heart-pulse',
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.4)',
    badge: 'Kardio',
    deskripsi: 'Stratifikasi risiko kardiovaskular 10-tahun (ASCVD AHA/ACC), Wells DVT/PE, dan titrasi syringe pump inotropik & vasoaktif.',
    matchDivisi: ['Kardiologi'],
    matchIds: ['ascvd', 'pump-ne', 'pump-dobu', 'pump-dopa', 'pump-nica', 'pump-ntg', 'wells-dvt', 'wells-pe']
  },
  {
    id: 'pti',
    nama: 'Penyakit Tropik & Infeksi',
    short: 'Tropik Infeksi',
    icon: 'fa-solid fa-virus',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.4)',
    badge: 'PTI',
    deskripsi: 'Panduan penyesuaian dosis antimikroba Adjustr-IO (36 obat), resusitasi cairan DSS, dan tatalaksana IO HIV.',
    matchDivisi: ['Penyakit Tropik & Infeksi'],
    matchIds: ['adjustr-io', 'dss-fluid', 'hiv-oi-guide']
  },
  {
    id: 'alergi',
    nama: 'Alergi - Imunologi Klinik',
    short: 'Alergi-Imunologi',
    icon: 'fa-solid fa-shield-halved',
    color: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.4)',
    badge: 'Alergi-Imuno',
    deskripsi: 'Anafilaksis klinis, alergi obat, urtikaria kronik, angioedema herediter, dan evaluasi defisiensi imun.',
    matchDivisi: ['Alergi-Imunologi'],
    matchIds: []
  },
  {
    id: 'geriatri',
    nama: 'Geriatri',
    short: 'Geriatri',
    icon: 'fa-solid fa-person-walking-with-cane',
    color: '#F97316',
    glow: 'rgba(249, 115, 22, 0.4)',
    badge: 'Geriatri',
    deskripsi: 'Comprehensive Geriatric Assessment (CGA), frailty CFS, risiko jatuh, delirium, nutrisi, dan preoperatif suite.',
    matchDivisi: ['Geriatri'],
    matchIds: ['ariscat', 'rcri', 'caprini', 'improve-bleed', 'cfs', 'morse-fall', 'papdi-delirium', 'mna-sf', 'preop-checklist']
  },
  {
    id: 'psikosomatis',
    nama: 'Psikosomatis & Kedokteran Paliatif',
    short: 'Psikosomatis',
    icon: 'fa-solid fa-brain',
    color: '#818CF8',
    glow: 'rgba(129, 140, 248, 0.4)',
    badge: 'Psikosomatis',
    deskripsi: 'Gangguan cemas & depresi (HADS, PHQ-9, GAD-7), distres emosional kronis, dan titrasi drip analgetik paliatif.',
    matchDivisi: ['Psikosomatis'],
    matchIds: ['hads', 'phq9', 'gad7', 'pain-titrator']
  }
];

function getSubCalculators(sub) {
  return R.filter(c => {
    if (sub.matchIds && sub.matchIds.includes(c.id)) return true;
    if (sub.matchDivisi && sub.matchDivisi.includes(c.divisi)) return true;
    return false;
  });
}

function findSubspecialtyByCalc(c) {
  return SUBSPECIALTIES.find(s => (s.matchIds && s.matchIds.includes(c.id)) || (s.matchDivisi && s.matchDivisi.includes(c.divisi)));
}

/* ===================== SEARCH & SCORING ===================== */
function score(c, q) {
  const hay = (c.nama + ' ' + c.divisi + ' ' + (c.tags || '')).toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).reduce((s, w) => s + (hay.includes(w) ? (c.nama.toLowerCase().includes(w) ? 3 : 1) : -100), 0);
}

/* ===================== ROUTER ===================== */
function route() {
  const hash = location.hash.slice(1);
  const qEl = document.getElementById('q');
  const q = qEl ? qEl.value.trim() : '';

  // 1. If search query is active, display search results
  if (q) {
    renderChips();
    renderSearchResults(q);
    return;
  }

  // 2. Subspecialty Hero Category View (#sub:<id>)
  if (hash.startsWith('sub:')) {
    const subId = hash.slice(4);
    const sub = SUBSPECIALTIES.find(s => s.id === subId);
    if (sub) {
      renderChips(sub.id);
      renderSubspecialty(sub);
      return;
    }
  }

  // 3. Calculator Direct View (#<calc-id>)
  const c = R.find(x => x.id === hash);
  if (c) {
    const parentSub = findSubspecialtyByCalc(c);
    renderChips(parentSub ? parentSub.id : '');
    renderCalc(c);
    return;
  }

  // 4. Default Home Dashboard -> 11 Hero Buttons Launchpad
  renderChips('');
  renderHeroLaunchpad();
}

function renderChips(activeSubId = '') {
  const chipsEl = document.getElementById('chips');
  if (!chipsEl) return;
  const items = [
    { label: 'Semua', id: '' },
    ...SUBSPECIALTIES.map(s => ({ label: s.short, id: s.id }))
  ];
  chipsEl.innerHTML = items.map(it =>
    `<button class="chip ${activeSubId === it.id ? 'on' : ''}" data-sub="${it.id}">${it.label}</button>`
  ).join('');

  chipsEl.querySelectorAll('.chip').forEach(b => {
    b.onclick = () => {
      const qEl = document.getElementById('q');
      if (qEl) qEl.value = '';
      const subId = b.dataset.sub;
      location.hash = subId ? `#sub:${subId}` : '';
      route();
    };
  });
}

/* ===================== HERO LAUNCHPAD VIEW & AUTOCALC PANEL ===================== */
function renderAutoCalcPanel() {
  if (typeof runAutoCalc !== 'function') return '';
  const hasData = Object.keys(ctx).some(k => CTX_LABELS[k] && ctx[k] !== undefined && ctx[k] !== '');
  if (!hasData) return '';

  const res = runAutoCalc(ctx);
  if (!res.scores.length && !res.alerts.length) return '';

  const alertsHtml = res.alerts.length ? `
    <div class="autocalc-alerts">
      <div class="autocalc-alert-title"><i class="fa-solid fa-triangle-exclamation"></i> Peringatan Klinis Kritis:</div>
      <ul>
        ${res.alerts.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const quickInputsHtml = `
    <div class="autocalc-quick-inputs">
      <span class="quick-in-title"><i class="fa-solid fa-user-pen"></i> Parameter Pasien:</span>
      <div class="quick-in-fields">
        <label>Usia: <input type="number" id="qi_age" min="0" max="120" value="${ctx.age || ''}" placeholder="Th" onchange="setCtx({age: parseInt(this.value,10)||undefined});route();"></label>
        <label>JK: <select id="qi_sex" onchange="setCtx({sex: this.value||undefined});route();">
          <option value="">Pilih</option>
          <option value="L" ${ctx.sex === 'L' ? 'selected' : ''}>Pria (L)</option>
          <option value="P" ${ctx.sex === 'P' ? 'selected' : ''}>Wanita (P)</option>
        </select></label>
        <label>BB: <input type="number" id="qi_bb" step="0.1" value="${ctx.bb || ''}" placeholder="kg" onchange="setCtx({bb: parseFloat(this.value)||undefined});route();"></label>
        <label>TB: <input type="number" id="qi_tb" step="1" value="${ctx.tb || ''}" placeholder="cm" onchange="setCtx({tb: parseFloat(this.value)||undefined});route();"></label>
      </div>
    </div>
  `;

  const cardsHtml = res.scores.map(s => `
    <div class="autocalc-card ${s.status}" onclick="location.hash='#${s.calcId}'" title="Klik untuk membuka kalkulator interaktif lengkap">
      <div class="autocalc-card-top">
        <span class="autocalc-badge">${s.group}</span>
        <span class="autocalc-status-pill status-${s.status}">${s.status === 'bad' ? 'Kritis' : (s.status === 'warn' ? 'Waspada' : 'Normal')}</span>
      </div>
      <div class="autocalc-name">${s.name}</div>
      <div class="autocalc-val">${s.value}</div>
      <div class="autocalc-interp">${s.interpretation}</div>
      <div class="autocalc-sub">${s.subvalue}</div>
      <div class="autocalc-action"><span>Buka Kalkulator Detail</span> <i class="fa-solid fa-arrow-right"></i></div>
    </div>
  `).join('');

  return `
    <div class="autocalc-panel">
      <div class="autocalc-header">
        <div>
          <h3><i class="fa-solid fa-bolt" style="color:var(--ac)"></i> Hasil Kalkulasi Otomatis (LabKeep / FastTrack)</h3>
          <p>Dihitung secara deterministik berdasarkan data laboratorium dan riwayat pasien yang aktif:</p>
        </div>
        <div class="autocalc-btns">
          <button class="btn pri" onclick="copyAutoCalcKeep()"><i class="fa-regular fa-copy"></i> Salin Format LabKeep</button>
          <button class="btn" onclick="copyAutoCalcCppt()"><i class="fa-solid fa-file-medical"></i> Salin Format CPPT</button>
        </div>
      </div>
      ${alertsHtml}
      ${quickInputsHtml}
      <div class="autocalc-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function renderHeroLaunchpad() {
  const viewEl = document.getElementById('view');
  if (!viewEl) return;

  const autoCalcHtml = renderAutoCalcPanel();

  const html = `
    ${autoCalcHtml}
    <div class="hero-section" id="tool-grid">
      <div class="hero-header">
        <h2>Subspesialis Ilmu Penyakit Dalam</h2>
        <p>Pilih divisi subspesialis untuk mengakses kalkulator klinis, panduan dosis, dan instrumen diagnostik terkait:</p>
      </div>
      <div class="hero-grid">
        ${SUBSPECIALTIES.map(s => {
          const calcs = getSubCalculators(s);
          const count = calcs.length;
          const countLabel = count > 0 ? `${count} Kalkulator` : 'Segera Hadir';
          return `
            <div class="hero-sub-btn" data-filter="cdss" style="--sub-color:${s.color};--sub-glow:${s.glow}" onclick="location.hash='#sub:${s.id}'">
              <div class="hero-icon-box">
                <i class="${s.icon}"></i>
              </div>
              <div class="hero-info">
                <div class="hero-badge-row">
                  <span class="hero-badge">${s.badge}</span>
                  <span class="hero-count-badge">${countLabel}</span>
                </div>
                <div class="hero-title">${s.nama}</div>
                <div class="hero-desc">${s.deskripsi}</div>
              </div>
              <div class="hero-arrow">
                <i class="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  viewEl.innerHTML = html;
}

/* ===================== SUBSPECIALTY VIEW ===================== */
function renderSubspecialty(sub) {
  const viewEl = document.getElementById('view');
  if (!viewEl) return;

  const calcs = getSubCalculators(sub);
  const count = calcs.length;

  let bodyHtml = '';
  if (count === 0) {
    bodyHtml = `
      <div class="empty-state-box">
        <div class="empty-state-icon" style="color:${sub.color}">
          <i class="${sub.icon}"></i>
        </div>
        <h3>Divisi ${sub.nama}</h3>
        <p>Saat ini belum ada kalkulator klinis aktif di divisi ${sub.nama}. Modul kalkulator sedang disiapkan dan akan ditambahkan secara bertahap.</p>
        <button class="btn pri" onclick="location.hash=''">Kembali ke Semua Subspesialis</button>
      </div>
    `;
  } else {
    bodyHtml = `
      <div class="grid">
        ${calcs.map(c => `
          <div class="card" onclick="location.hash='${c.id}'">
            <span class="tag" style="color:${sub.color}">${c.divisi}</span>
            <h3>${c.nama}</h3>
            <small>${c.fields ? c.fields.length + ' parameter' : 'Protokol Interaktif'}</small>
          </div>
        `).join('')}
      </div>
    `;
  }

  viewEl.innerHTML = `
    <div style="margin-bottom:14px">
      <button class="btn" onclick="location.hash=''">← Kembali ke Semua Subspesialis</button>
    </div>
    <div class="sub-banner" style="--sub-color:${sub.color}">
      <div class="sub-banner-icon">
        <i class="${sub.icon}"></i>
      </div>
      <div class="sub-banner-content">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span class="hero-badge" style="--sub-color:${sub.color}">${sub.badge}</span>
          <span class="hero-count-badge">${count > 0 ? count + ' Kalkulator Aktif' : 'Modul Segera Hadir'}</span>
        </div>
        <h2>${sub.nama}</h2>
        <p>${sub.deskripsi}</p>
      </div>
    </div>
    ${bodyHtml}
  `;
}

function clearSearch() {
  const qEl = document.getElementById('q');
  if (qEl) qEl.value = '';
  route();
}

/* ===================== SEARCH RESULTS VIEW ===================== */
function renderSearchResults(q) {
  const viewEl = document.getElementById('view');
  if (!viewEl) return;

  let list = R.map(c => [c, score(c, q)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).map(x => x[0]);

  viewEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:14px;color:var(--tx)">
        Ditemukan <b>${list.length}</b> kalkulator untuk "<i>${q}</i>"
      </div>
      <button class="btn" onclick="clearSearch()">Hapus Pencarian</button>
    </div>
    ${list.length ? `
      <div class="grid">
        ${list.map(c => `
          <div class="card" onclick="location.hash='${c.id}'">
            <span class="tag">${c.divisi}</span>
            <h3>${c.nama}</h3>
            <small>${c.fields ? c.fields.length + ' parameter' : 'Protokol Interaktif'}</small>
          </div>
        `).join('')}
      </div>
    ` : '<p style="color:var(--mut);padding:20px 0;text-align:center">Tidak ada kalkulator yang cocok dengan kata kunci tersebut.</p>'}
  `;
}

/* ===================== CALCULATOR RENDER VIEW ===================== */
function renderCalc(c) {
  const parentSub = findSubspecialtyByCalc(c);
  const backTarget = parentSub ? `#sub:${parentSub.id}` : '';
  const backLabel = parentSub ? `← Kembali ke ${parentSub.short}` : '← Semua kalkulator';

  const backHtml = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <button class="btn" onclick="location.hash='${backTarget}'">${backLabel}</button>
      ${parentSub ? `<button class="btn" onclick="location.hash=''">Beranda</button>` : ''}
    </div>
  `;

  if (c.mount) {
    document.getElementById('view').innerHTML = `
      ${backHtml}
      <div class="panel">
        <span class="tag">${c.divisi}</span>
        <h2>${c.nama}</h2>
        <div id="calc-mount"></div>
        <div id="res"></div>
        <button class="btn" style="margin-top:14px" id="copyBtn">Salin hasil untuk CPPT</button>
      </div>
    `;
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

  document.getElementById('view').innerHTML = `
    ${backHtml}
    <div class="panel">
      <span class="tag">${c.divisi}</span>
      <h2>${c.nama}</h2>
      ${html}
      <div id="res"></div>
      <button class="btn" style="margin-top:12px" id="copyBtn">Salin hasil untuk CPPT</button>
    </div>
  `;

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

function toast(m) { const t = document.getElementById('toast'); if (t) { t.textContent = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 2500); } }

/* ===================== PASTE MODAL ===================== */
const pm = document.getElementById('pasteModal');
if (document.getElementById('btnPaste')) document.getElementById('btnPaste').onclick = () => pm && pm.classList.add('show');
if (document.getElementById('pasteCancel')) document.getElementById('pasteCancel').onclick = () => pm && pm.classList.remove('show');
if (document.getElementById('pasteGo')) {
  document.getElementById('pasteGo').onclick = () => {
    const txtEl = document.getElementById('pasteTxt');
    const r = parseClinical(txtEl ? txtEl.value : '');
    const n = Object.keys(r).length;
    const outEl = document.getElementById('pasteOut');
    if (outEl) outEl.innerHTML = n ? `Terdeteksi ${n} nilai: ` + Object.entries(r).map(([k, v]) => `${CTX_LABELS[k] || k}=<b>${v}</b>`).join(', ') : 'Tidak ada nilai terdeteksi.';
    if (n) { setCtx(r); route(); toast(`${n} nilai diisi otomatis`); setTimeout(() => pm && pm.classList.remove('show'), 1200); }
  };
}

/* ===================== FASTTRACK & LABKEEP UNIVERSAL BRIDGE ===================== */
function mapBridgePayload(p) {
  const o = {};
  const pick = (obj, map) => {
    if (!obj) return;
    for (const [src, dst] of Object.entries(map)) {
      const v = parseFloat(obj[src]);
      if (!isNaN(v) && isFinite(v)) o[dst] = v;
    }
  };
  const ps = p.pasien || {};
  const age = parseInt(ps.usia ?? ps.umur ?? ps.age, 10);
  if (!isNaN(age)) o.age = age;
  const sx = String(ps.jenis_kelamin ?? ps.sex ?? ps.gender ?? '').toUpperCase();
  if (sx.startsWith('L') || sx.startsWith('M')) o.sex = 'L';
  else if (sx.startsWith('P') || sx.startsWith('W') || sx.startsWith('F')) o.sex = 'P';

  pick(p.pasien, { bb:'bb', berat_badan:'bb', tb:'tb', tinggi_badan:'tb' });
  pick(p.tanda_vital, { bb:'bb', sbp:'sbp', dbp:'dbp', nadi:'hr', hr:'hr', rr:'rr', respirasi:'rr', suhu:'temp', temp:'temp', spo2:'spo2', gcs:'gcs' });
  pick(p.kimia, {
    bun:'bun', ureum:'ureum', kreatinin:'cr', creatinine:'cr', cr:'cr',
    natrium:'na', na:'na', kalium:'k', k:'k', klorida:'cl', cl:'cl',
    kalsium:'ca', ca:'ca', albumin:'alb', alb:'alb', protein_total:'prot',
    gds:'glu', glukosa:'glu', glu:'glu', hba1c:'hba1c',
    ast:'ast', alt:'alt', sgot:'ast', sgpt:'alt',
    bilirubin_total:'bili', bilirubin:'bili', bili:'bili',
    alp:'alp', ggt:'ggt', ldh:'ldh', asam_urat:'ua', ua:'ua'
  });
  pick(p.hematologi, {
    hb:'hb', hgb:'hb', hct:'hct', plt:'plt', trombosit:'plt',
    wbc:'wbc', leukosit:'wbc', ne:'ne_abs', ne_abs:'ne_abs',
    ly:'ly_abs', ly_abs:'ly_abs', ppt:'ppt', inr:'inr', aptt:'aptt',
    ddimer:'ddimer', fib:'fib', fibrinogen:'fib'
  });
  pick(p.agd, {
    ph:'ph', pco2:'pco2', hco3:'hco3', po2:'po2', laktat:'lac', lac:'lac', fio2:'fio2', be:'be'
  });
  pick(p.urin, {
    na:'na_urin', k:'k_urin', cl:'cl_urin', uacr:'uacr'
  });
  return o;
}

function importPayload(p) {
  const patch = mapBridgePayload(p);
  if (Object.keys(patch).length) {
    setCtx(patch);
    route();
    toast('⚡ Data klinis dari FastTrack / LabKeep berhasil dimuat!');
  } else {
    console.warn('InternaHub: payload tidak dikenali', p);
  }
}

// 1. Hook injeksi frame langsung (Protokol NE.PRO & EMER Desktop Bridge)
window.applyBridgeData = function(payload, source) {
  importPayload(payload);
  return true;
};
window.importPatient = function(payload) {
  importPayload(payload);
  return true;
};

// 2. Hook impor teks (Protokol GERIOP)
window.openImport = function() {};
window.runImport = function() {
  const imp = document.getElementById('impText');
  if (imp && imp.value) {
    const r = parseClinical(imp.value);
    const n = Object.keys(r).filter(k => k !== 'baseline' && k !== 'series').length;
    if (n > 0) {
      setCtx(r);
      route();
      toast(`⚡ ${n} data dari GERIOP berhasil diimpor!`);
    }
  }
  return true;
};

// 3. Hook PostMessage (Recursive Post & Cross-origin)
window.addEventListener('message', ev => {
  const d = ev.data;
  if (!d || (d.type !== 'INTERNAHUB_IMPORT' && d.type !== 'NEPRO_IMPORT')) return;
  importPayload(d.data || {});
  const tid = d.data && d.data.transfer_id;
  try { ev.source && ev.source.postMessage({ type: d.type + '_ACK', transfer_id: tid }, '*'); } catch (_) {}
  if (d.type === 'INTERNAHUB_IMPORT') try { ev.source && ev.source.postMessage({ type: 'NEPRO_IMPORT_ACK', transfer_id: tid }, '*'); } catch (_) {}
});

// 4. Hook Impor Parameter URL (?data= & #data=)
(function urlImport() {
  const m = (location.search + '&' + location.hash.slice(1)).match(/data=([^&]+)/);
  if (!m) return;
  try {
    const raw = decodeURIComponent(m[1]).replace(/ /g, '+');
    const jsonStr = decodeURIComponent(escape(atob(raw)));
    importPayload(JSON.parse(jsonStr));
    history.replaceState(null, '', location.pathname);
  } catch (_) {}
})();

// 5. Global Clipboard & Paste Anywhere (Ctrl+V)
window.pasteFromClipboard = async function() {
  try {
    const txt = await navigator.clipboard.readText();
    if (!txt) return toast('Clipboard kosong.');
    const r = parseClinical(txt);
    const n = Object.keys(r).filter(k => k !== 'baseline' && k !== 'series').length;
    if (n > 0) {
      setCtx(r);
      route();
      toast(`⚡ ${n} parameter dari Clipboard berhasil diekstrak!`);
    } else {
      toast('Tidak ada parameter medis yang dikenali dari clipboard.');
    }
  } catch (e) {
    const pm = document.getElementById('pasteModal');
    if (pm) pm.classList.add('show');
  }
};

window.addEventListener('paste', function(e) {
  const targetTag = (e.target && e.target.tagName) || '';
  if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
  const txt = (e.clipboardData || window.clipboardData).getData('text');
  if (!txt) return;
  const r = parseClinical(txt);
  const n = Object.keys(r).filter(k => k !== 'baseline' && k !== 'series').length;
  if (n > 0) {
    setCtx(r);
    route();
    toast(`⚡ ${n} data dari FastTrack / LabKeep berhasil diekstrak otomatis!`);
  }
});

// Copy Helpers untuk Auto-Calculate Panel
window.copyAutoCalcKeep = function() {
  if (typeof runAutoCalc !== 'function') return;
  const res = runAutoCalc(ctx);
  if (res.keepSummary) {
    navigator.clipboard.writeText(res.keepSummary).catch(() => {});
    toast('Hasil kalkulasi disalin dalam format LabKeep!');
  } else {
    toast('Belum ada hasil kalkulasi untuk disalin.');
  }
};

window.copyAutoCalcCppt = function() {
  if (typeof runAutoCalc !== 'function') return;
  const res = runAutoCalc(ctx);
  if (res.cpptSummary) {
    navigator.clipboard.writeText(res.cpptSummary).catch(() => {});
    toast('Hasil kalkulasi disalin dalam format CPPT!');
  } else {
    toast('Belum ada hasil kalkulasi untuk disalin.');
  }
};

/* ===================== INIT ===================== */
const qInput = document.getElementById('q');
if (qInput) {
  qInput.addEventListener('input', () => {
    route();
  });
}
const btnTheme = document.getElementById('btnTheme');
if (btnTheme) {
  btnTheme.onclick = () => {
    document.body.classList.toggle('light');
    localStorage.setItem('internahub_theme', document.body.classList.contains('light') ? 'light' : 'dark');
  };
}
if (localStorage.getItem('internahub_theme') === 'light') document.body.classList.add('light');
window.addEventListener('hashchange', route);
renderCtxBar();
route();
