/* ===================== M1: CAIRAN, ELEKTROLIT, KRITIS (FULL FIDELITY) ===================== */
// Implementasi lengkap tanpa penyederhanaan dari adjustr-fluid.html dan Calc-Med.html
const fmtIndo = (num, digits = 1) => {
  if (isNaN(num) || !isFinite(num)) return "0";
  return Number(num).toFixed(digits).replace('.', ',');
};
const FluidEngine = {
  calcTBW(weight, sex = 'male', ageGroup = 'adult') {
    if (!weight || weight <= 0) return 0;
    const isMale = (sex === 'male' || sex === 'pria');
    const isElderly = (ageGroup === 'elderly' || ageGroup === 'lansia');
    const isChild = (ageGroup === 'child' || ageGroup === 'anak');
    if (isChild) return weight * 0.60;
    if (isMale) return weight * (isElderly ? 0.50 : 0.60);
    return weight * (isElderly ? 0.45 : 0.50);
  },
  calcHollidaySegar(weight) {
    if (!weight || weight <= 0) return 0;
    if (weight <= 10) return weight * 100;
    if (weight <= 20) return 1000 + (weight - 10) * 50;
    return 1500 + (weight - 20) * 20;
  }
};

/* 1. RUMATAN CAIRAN & BALANCE 24 JAM */
reg({ id:'maint-fluid', nama:'Rumatan Cairan & Balance 24 Jam', divisi:'Cairan & Elektrolit', tags:'holliday segar 4-2-1 rumatan nice balance uop iwl demam', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Jenis Kelamin</label>
          <select id="m_sex"><option value="male">Pria</option><option value="female">Wanita</option></select>
        </div>
        <div>
          <label>Tinggi Badan (cm)</label>
          <input type="number" id="m_h" value="170">
        </div>
      </div>
      <div class="row">
        <div>
          <label>Berat Badan Aktual (kg) ${c.bb ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="m_w" value="${c.bb || 70}">
        </div>
        <div>
          <label>Status Berat Badan (Devine IBW & ABW)</label>
          <div style="padding:9px;background:rgba(255,255,255,0.04);border-radius:8px;font-size:13px;margin-top:2px;">
            IBW: <b id="m_ibw_val" style="color:var(--ac)">-</b> | ABW: <b id="m_abw_val" style="color:var(--ac2)">-</b>
          </div>
        </div>
      </div>
      <div class="row">
        <div>
          <label>Formula Rumatan</label>
          <select id="m_formula">
            <option value="holliday" selected>Holliday-Segar (Aturan 4-2-1)</option>
            <option value="nice_standard">NICE Standar Dewasa (25–30 mL/kg/hari)</option>
          </select>
        </div>
        <div>
          <label>Basis Berat Badan</label>
          <select id="m_basis">
            <option value="actual" selected>Berat Aktual (TBW)</option>
            <option value="abw">Berat Terkoreksi (ABW - Obesitas)</option>
            <option value="ibw">Berat Ideal (IBW)</option>
          </select>
        </div>
      </div>
      <div style="margin:12px 0;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;">
        <label class="chk" style="margin:0;">
          <input type="checkbox" id="m_fever_cb"> Kompensasi Demam (+10% IWL per °C di atas 37,5°C)
        </label>
        <div id="m_fever_box" style="display:none;margin-top:8px;">
          <label>Suhu Tubuh Pasien (°C)</label>
          <input type="number" id="m_temp" step="0.1" value="${c.temp || 38.5}">
        </div>
      </div>
      <div style="font-weight:700;font-size:13px;color:var(--ac);margin:14px 0 6px;">PEMANTAUAN BALANCE CAIRAN 24 JAM</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
        <div>
          <label>Intake Total (mL)</label>
          <input type="number" id="m_intake" value="2500">
        </div>
        <div>
          <label>Output Urin / UOP (mL)</label>
          <input type="number" id="m_uop" value="1200">
        </div>
        <div>
          <label>IWL / Insensible (mL)</label>
          <input type="number" id="m_iwl" value="700">
        </div>
      </div>
      <div id="m_uop_badge" style="margin-top:12px;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:700;"></div>
    `;

    const fBox = container.querySelector('#m_fever_box');
    const fCb = container.querySelector('#m_fever_cb');
    fCb.onchange = () => { fBox.style.display = fCb.checked ? 'block' : 'none'; calc(); };

    const calc = () => {
      const w = parseFloat(container.querySelector('#m_w').value) || 0;
      const h = parseFloat(container.querySelector('#m_h').value) || 170;
      const sex = container.querySelector('#m_sex').value;
      const htInches = h / 2.54;
      let ibw = sex === 'male' ? 50 + 2.3 * Math.max(0, htInches - 60) : 45.5 + 2.3 * Math.max(0, htInches - 60);
      ibw = Math.max(10, Math.round(ibw * 10) / 10);
      let abw = ibw;
      if (w > ibw) abw = Math.round((ibw + 0.4 * (w - ibw)) * 10) / 10;
      container.querySelector('#m_ibw_val').textContent = `${ibw.toFixed(1)} kg`;
      container.querySelector('#m_abw_val').textContent = `${abw.toFixed(1)} kg`;

      const basis = container.querySelector('#m_basis').value;
      let cw = w;
      if (basis === 'abw') cw = abw;
      else if (basis === 'ibw') cw = ibw;

      const formula = container.querySelector('#m_formula').value;
      let daily = 0, hourly = 0;
      if (formula === 'nice_standard') {
        daily = cw * 30;
        hourly = daily / 24;
      } else {
        daily = FluidEngine.calcHollidaySegar(cw);
        if (cw <= 10) hourly = cw * 4;
        else if (cw <= 20) hourly = 40 + (cw - 10) * 2;
        else hourly = 60 + (cw - 20) * 1;
      }

      if (fCb.checked) {
        const temp = parseFloat(container.querySelector('#m_temp').value) || 38.5;
        if (temp > 37.5) {
          const mult = 1 + ((temp - 37.5) * 0.1);
          daily *= mult;
          hourly *= mult;
        }
      }

      const intake = parseFloat(container.querySelector('#m_intake').value) || 0;
      const uop = parseFloat(container.querySelector('#m_uop').value) || 0;
      const iwl = parseFloat(container.querySelector('#m_iwl').value) || 0;
      const net = intake - (uop + iwl);
      const uopRate = w > 0 ? uop / (w * 24) : 0;
      const oliguria = uopRate < 0.5;

      const badge = container.querySelector('#m_uop_badge');
      badge.style.background = oliguria ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.15)';
      badge.style.border = `1px solid ${oliguria ? 'var(--bad)' : 'var(--ok)'}`;
      badge.style.color = oliguria ? 'var(--bad)' : 'var(--ok)';
      badge.innerHTML = `UOP Rate: <b>${uopRate.toFixed(2)} mL/kg/jam</b> ${oliguria ? '— PERINGATAN: OLIGURIA (< 0,5 mL/kg/jam)!' : '— Normal (≥ 0,5 mL/kg/jam)'}`;

      const cppt = `[adjustrFluid CDSS] RUMATAN CAIRAN & BALANCE 24 JAM\n` +
        `Pasien: ${sex === 'male' ? 'Pria' : 'Wanita'} | TB ${h} cm | BB ${w} kg (IBW ${ibw} kg, ABW ${abw} kg)\n` +
        `Formula: ${formula === 'nice_standard' ? 'NICE Standard Dewasa' : 'Holliday-Segar (4-2-1)'} (${basis})\n` +
        (fCb.checked ? `Status Demam: Suhu ${container.querySelector('#m_temp').value}°C (Kompensasi IWL aktif)\n` : '') +
        `\nHASIL KALKULASI:\n` +
        `- Volume Rumatan Harian : ${Math.round(daily).toLocaleString()} mL/24h\n` +
        `- Kecepatan Infus Basal : ${hourly.toFixed(1)} mL/hr\n` +
        `- Balance Bersih 24 Jam : ${net >= 0 ? '+' : ''}${Math.round(net).toLocaleString()} mL (Intake ${intake} mL, Output Urin ${uop} mL, IWL ${iwl} mL)\n` +
        `- Evaluasi Produksi Urin: UOP Rate: ${uopRate.toFixed(2)} mL/kg/hr (${oliguria ? 'OLIGURIA' : 'Normal'})\n` +
        `Rekomendasi Cairan: Kristaloid seimbang (RL/Plasmalyte) atau D5 1/2NS + KCl 20 mEq/L bila fungsi ginjal intak.`;

      emit({
        value: `${Math.round(daily).toLocaleString()} mL/24j`,
        text: `Kecepatan infus basal: <b>${hourly.toFixed(1)} mL/jam</b> | Balance 24j: <b>${net >= 0 ? '+' : ''}${Math.round(net)} mL</b>`,
        cls: oliguria ? 'warn' : 'ok',
        cppt
      });
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 2. HIPONATREMIA (ADROGUÉ-MADIAS) */
reg({ id:'hypoNa', nama:'Hiponatremia: Adrogué-Madias + Pagar ODS', divisi:'Cairan & Elektrolit', tags:'hiponatremia natrium nacl 3% ods cpm koreksi adrogue', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Jenis Kelamin</label>
          <select id="h_sex"><option value="male">Pria</option><option value="female">Wanita</option></select>
        </div>
        <div>
          <label>Kelompok Usia</label>
          <select id="h_age"><option value="adult" selected>Dewasa (18–64 th)</option><option value="elderly">Lansia (≥ 65 th)</option></select>
        </div>
      </div>
      <div class="row">
        <div>
          <label>Berat Badan (kg) ${c.bb ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="h_w" value="${c.bb || 70}">
        </div>
        <div>
          <label>Kadar Na Serum Aktual (mEq/L) ${c.na ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="h_na" value="${c.na || 115}">
        </div>
      </div>
      <div class="row">
        <div>
          <label>Target Kenaikan Na 24 Jam (mEq/L)</label>
          <input type="number" id="h_tgt" step="0.5" value="6.0">
        </div>
        <div>
          <label>Pilihan Cairan Infus</label>
          <select id="h_fluid">
            <option value="513,0" selected>NaCl 3% Hipertonik (Na: 513 mEq/L)</option>
            <option value="154,0">NaCl 0.9% Isotonik (Na: 154 mEq/L)</option>
            <option value="130,4">Ringer Laktat (Na: 130, K: 4 mEq/L)</option>
          </select>
        </div>
      </div>
      <div style="margin:12px 0;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;">
        <label class="chk" style="margin:0;">
          <input type="checkbox" id="h_high_risk"> Risiko Tinggi ODS (Hipokalemia berat, malnutrisi, alkoholisme, penyakit hepar lanjut)
        </label>
        <small style="color:var(--mut);display:block;margin-top:4px;">Batas kecepatan kenaikan maksimal dibatasi 6–8 mEq/L/24j (standar 8–10 mEq/L/24j).</small>
      </div>
      <div id="h_alert_banner" style="display:none;margin-top:10px;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:700;"></div>
    `;

    const calc = () => {
      const w = parseFloat(container.querySelector('#h_w').value) || 0;
      const sex = container.querySelector('#h_sex').value;
      const age = container.querySelector('#h_age').value;
      const na = parseFloat(container.querySelector('#h_na').value) || 115;
      const tgt = parseFloat(container.querySelector('#h_tgt').value) || 6;
      const [infNa, infK] = container.querySelector('#h_fluid').value.split(',').map(Number);
      const highRisk = container.querySelector('#h_high_risk').checked;

      const tbw = FluidEngine.calcTBW(w, sex, age);
      const deltaPerLiter = tbw > 0 ? ((infNa + infK) - na) / (tbw + 1) : 0;
      const totalVolume24h = deltaPerLiter > 0 ? (tgt / deltaPerLiter) * 1000 : 0;
      const hourlyRate = totalVolume24h / 24;

      const banner = container.querySelector('#h_alert_banner');
      let alertMsg = '', cls = 'ok';
      if (tgt > 10) {
        banner.style.display = 'block';
        banner.style.background = 'rgba(239,68,68,0.18)';
        banner.style.border = '1px solid var(--bad)';
        banner.style.color = 'var(--bad)';
        alertMsg = `CRITICAL ALERT: Target kenaikan ${tgt.toFixed(1)} mEq/L/24j melebihi batas mutlak 10 mEq/L/24j. Risiko tinggi Sindrom Demielinasi Osmotik (ODS) / Central Pontine Myelinolysis!`;
        banner.textContent = alertMsg;
        cls = 'bad';
      } else if (tgt > 8) {
        banner.style.display = 'block';
        banner.style.background = 'rgba(251,191,36,0.18)';
        banner.style.border = '1px solid var(--warn)';
        banner.style.color = 'var(--warn)';
        alertMsg = `PERINGATAN: Target ${tgt.toFixed(1)} mEq/L/24j mendekati batas maksimal ODS (10 mEq/L/24j). Pantau Na ketat tiap 2-4 jam.`;
        banner.textContent = alertMsg;
        cls = 'warn';
      } else {
        banner.style.display = 'none';
      }

      const cppt = `[adjustrFluid CDSS] KOREKSI HIPONATREMIA (ADROGUÉ-MADIAS)\n` +
        `Pasien: ${sex === 'male' ? 'Pria' : 'Wanita'} (${age}) | BB ${w} kg | TBW ${tbw.toFixed(1)} L\n` +
        `Kadar Na Aktual: ${na} mEq/L | Target Kenaikan: +${tgt} mEq/L | Risiko ODS: ${highRisk ? 'TINGGI (Maks 6-8 mEq/24j)' : 'Standar (Maks 8-10 mEq/24j)'}\n` +
        `Cairan Infus: ${infNa === 513 ? 'NaCl 3% (513 mEq/L)' : infNa === 154 ? 'NaCl 0.9% (154 mEq/L)' : 'RL (130 mEq/L)'}\n\n` +
        `HASIL KALKULASI:\n` +
        `- Estimasi Delta Na per 1L Cairan: ${deltaPerLiter.toFixed(2)} mEq/L\n` +
        `- Total Volume Infus Dibutuhkan  : ${Math.round(totalVolume24h).toLocaleString()} mL\n` +
        `- Kecepatan Infus Direkomendasikan: ${hourlyRate.toFixed(1)} mL/hr\n` +
        `CRITICAL SAFETY GUARDRAIL: Kecepatan koreksi tidak boleh melebihi ${highRisk ? '6-8' : '8-10'} mEq/L per 24 jam untuk mencegah Sindrom Demielinasi Osmotik (ODS). Evaluasi elektrolit serial q4-6h.`;

      emit({
        value: `${hourlyRate.toFixed(1)} mL/jam`,
        text: `TBW: <b>${tbw.toFixed(1)} L</b> | Estimasi Δ Na: <b>+${deltaPerLiter.toFixed(2)} mEq/L</b> per 1L | Total volume: <b>${Math.round(totalVolume24h).toLocaleString()} mL/24j</b>`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 3. HIPERNATREMIA (FREE WATER DEFICIT & ADROGUÉ-MADIAS) */
reg({ id:'hyperNa', nama:'Hipernatremia: Free Water Deficit & Adrogué-Madias', divisi:'Cairan & Elektrolit', tags:'hipernatremia fwd free water deficit d5w edema serebri koreksi', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Jenis Kelamin</label>
          <select id="hy_sex"><option value="male">Pria</option><option value="female">Wanita</option></select>
        </div>
        <div>
          <label>Kelompok Usia</label>
          <select id="hy_age"><option value="adult" selected>Dewasa (18–64 th)</option><option value="elderly">Lansia (≥ 65 th)</option></select>
        </div>
      </div>
      <div class="row">
        <div>
          <label>Berat Badan (kg) ${c.bb ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="hy_w" value="${c.bb || 70}">
        </div>
        <div>
          <label>Kadar Na Aktual (mEq/L) ${c.na ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="hy_na" value="${c.na || 158}">
        </div>
      </div>
      <div class="row">
        <div>
          <label>Target Na Serum (mEq/L)</label>
          <input type="number" id="hy_tgt" value="148">
        </div>
        <div>
          <label>Cairan Pengganti</label>
          <select id="hy_fluid">
            <option value="0" selected>D5W (Dekstrosa 5% - 0 mEq Na)</option>
            <option value="77">NaCl 0.45% / 1/2NS (77 mEq Na)</option>
            <option value="0_oral">Air Minum Oral / NGT (0 mEq Na)</option>
          </select>
        </div>
      </div>
      <div id="hy_alert_banner" style="display:none;margin-top:10px;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:700;"></div>
    `;

    const calc = () => {
      const w = parseFloat(container.querySelector('#hy_w').value) || 0;
      const sex = container.querySelector('#hy_sex').value;
      const age = container.querySelector('#hy_age').value;
      const na = parseFloat(container.querySelector('#hy_na').value) || 158;
      const tgt = parseFloat(container.querySelector('#hy_tgt').value) || 148;
      const infNa = parseFloat(container.querySelector('#hy_fluid').value) || 0;

      const tbw = FluidEngine.calcTBW(w, sex, age);
      const fwd = tbw * ((na / 140) - 1);
      const deltaL = (infNa - na) / (tbw + 1);
      const dropNeeded = na - tgt;
      let vol = 0;
      if (deltaL < 0 && dropNeeded > 0) vol = (dropNeeded / Math.abs(deltaL)) * 1000;
      const hourlyRate = vol / 24;

      const banner = container.querySelector('#hy_alert_banner');
      let cls = 'ok';
      if (dropNeeded > 10) {
        banner.style.display = 'block';
        banner.style.background = 'rgba(239,68,68,0.18)';
        banner.style.border = '1px solid var(--bad)';
        banner.style.color = 'var(--bad)';
        banner.textContent = 'BAHAYA EDEMA SEREBRI: Target penurunan Na > 10 mEq/24h berisiko fatal hernia serebral!';
        cls = 'bad';
      } else {
        banner.style.display = 'none';
      }

      const cppt = `[adjustrFluid CDSS] KOREKSI HIPERNATREMIA (FREE WATER DEFICIT)\n` +
        `Pasien: ${sex === 'male' ? 'Pria' : 'Wanita'} (${age}) | BB ${w} kg | TBW ${tbw.toFixed(1)} L\n` +
        `Kadar Na Aktual: ${na} mEq/L | Target Na: ${tgt} mEq/L (Penurunan ${dropNeeded.toFixed(1)} mEq/L)\n` +
        `Cairan Pengganti: ${infNa === 0 ? 'D5% IV / Air Murni Enteral' : 'NaCl 0.45% (77 mEq/L)'}\n\n` +
        `HASIL KALKULASI:\n` +
        `- Free Water Deficit (FWD) : ${Math.max(0, fwd).toFixed(1)} Liter air murni\n` +
        `- Total Volume Cairan Infus : ${Math.round(vol).toLocaleString()} mL\n` +
        `- Kecepatan Infus Terencana  : ${hourlyRate.toFixed(1)} mL/hr (Target 24 jam)\n` +
        `SAFETY GUARDRAIL: Penurunan Na dibatasi maksimum 10 mEq/L per 24 jam (0.5 mEq/L/jam) untuk mencegah edema serebri akut dan kejang.`;

      emit({
        value: `${Math.max(0, fwd).toFixed(1)} Liter FWD`,
        text: `Volume infus: <b>${Math.round(vol).toLocaleString()} mL</b> (${hourlyRate.toFixed(1)} mL/jam) | Penurunan Na: <b>${dropNeeded.toFixed(1)} mEq/L</b>`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 4. GANGGUAN KALIUM */
reg({ id:'k-mgmt', nama:'Gangguan Kalium (Hipo & Hiperkalemia)', divisi:'Cairan & Elektrolit', tags:'kalium hipokalemia hiperkalemia kcl insulin dextrose ca glukonas', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Kadar Kalium Serum (mEq/L) ${c.k ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="k_serum" step="0.1" value="${c.k || 2.8}">
        </div>
        <div>
          <label>Stratifikasi Derajat</label>
          <div id="k_sev_box" style="padding:9px;background:rgba(255,255,255,0.04);border-radius:8px;font-size:14px;font-weight:700;margin-top:2px;">-</div>
        </div>
      </div>
      <div id="k_protocol_box" style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;"></div>
    `;

    const calc = () => {
      const k = parseFloat(container.querySelector('#k_serum').value) || 4.0;
      let kDef = 0, severity = 'Normal', cls = 'ok';
      if (k < 3.0) { kDef = 300; severity = 'Hipokalemia Berat (< 3.0 mEq/L)'; cls = 'bad'; }
      else if (k < 3.5) { kDef = 150; severity = 'Hipokalemia Sedang (3.0 - 3.4 mEq/L)'; cls = 'warn'; }
      else if (k > 5.5) { kDef = 0; severity = 'Hiperkalemia (> 5.5 mEq/L)'; cls = k > 6.5 ? 'bad' : 'warn'; }

      const sevEl = container.querySelector('#k_sev_box');
      sevEl.textContent = severity;
      sevEl.style.color = cls === 'bad' ? 'var(--bad)' : cls === 'warn' ? 'var(--warn)' : 'var(--ok)';

      let recText = '';
      if (k < 3.0) {
        recText = `<b>Jalur Intravena:</b> Infus KCl maksimal 10-20 mEq/jam via vena perifer (kepekatan maks 40 mEq/L) atau hingga 20-40 mEq/jam via CVC dengan monitor EKG kontinu.<br><b>Periksa Magnesium:</b> Koreksi hipomagnesemia wajib dilakukan karena hipokalemia refrakter tanpa magnesium adekuat.`;
      } else if (k < 3.5) {
        recText = `<b>Suplementasi Oral:</b> KSR / KCl tablet 20-40 mEq 2-3 kali sehari, evaluasi ulang kalium dalam 24-48 jam.`;
      } else if (k > 5.5) {
        recText = `<b>1. Stabilisasi Membran:</b> Ca Glukonas 10% 10 mL IV lambat 2-5 menit (bila ada perubahan EKG).<br><b>2. Shifting Intrasel:</b> Dextrose 10% (atau D40%) + 10 Unit Regular Insulin IV, nebulisasi Salbutamol 10-20 mg.<br><b>3. Eliminasi:</b> Loop diuretik, binder kalium GI (Kalitake / Lokelma), atau hemodialisis cito bila refrakter.`;
      } else {
        recText = `Kadar kalium dalam rentang normal (3.5 - 5.0 mEq/L). Pertahankan asupan rumatan harian.`;
      }
      container.querySelector('#k_protocol_box').innerHTML = recText;

      const cppt = `[adjustrFluid CDSS] MANAJEMEN GANGGUAN KALIUM\n` +
        `Kadar Kalium Serum: ${k} mEq/L\n` +
        `Stratifikasi Klinis: ${severity}\n` +
        `Estimasi Defisit Total Tubuh: ${kDef} mEq\n\n` +
        `REKOMENDASI & PROTOKOL TERAPI:\n` +
        (k < 3.0 ? `- Jalur Intravena: Infus KCl maksimal 10-20 mEq/jam via perifer (maks 40 mEq/L) atau 20-40 mEq/jam via CVC dengan EKG kontinu.\n- Periksa kadar Magnesium serum: Koreksi hipomagnesemia wajib dilakukan.` :
         k < 3.5 ? `- Suplementasi Oral: KSR / KCl tablet 20-40 mEq 2-3 kali sehari, evaluasi ulang dalam 24-48 jam.` :
         k > 5.5 ? `- Stabilisasi Membran: Ca Glukonas 10% 10 mL IV lambat 2-5 menit.\n- Shifting Intrasel: Dextrose + 10 U Regular Insulin IV, nebulisasi Salbutamol 10-20 mg.\n- Eliminasi: Loop diuretik, binder kalium GI, atau hemodialisis cito.` :
         `Kadar kalium dalam rentang normal (3.5 - 5.0 mEq/L). Pertahankan asupan rumatan harian.`);

      emit({
        value: `${severity} (Defisit: ${kDef} mEq)`,
        text: recText,
        cls,
        cppt
      });
    };

    container.querySelector('#k_serum').addEventListener('input', calc);
    calc();
  }
});

/* 5. KALSIUM TERKOREKSI (FORMULA PAYNE) */
reg({ id:'ca-mgmt', nama:'Kalsium Terkoreksi Albumin (Payne)', divisi:'Cairan & Elektrolit', tags:'kalsium calcium albumin payne hipokalsemia hiperkalsemia', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Kalsium Total (mg/dL) ${c.ca ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="ca_tot" step="0.1" value="${c.ca || 7.5}">
        </div>
        <div>
          <label>Albumin Serum (g/dL) ${c.alb ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="ca_alb" step="0.1" value="${c.alb || 2.5}">
        </div>
      </div>
      <div id="ca_interp_banner" style="margin-top:10px;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:700;"></div>
      <div id="ca_protocol_box" style="margin-top:10px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;"></div>
    `;

    const calc = () => {
      const ca = parseFloat(container.querySelector('#ca_tot').value) || 0;
      const alb = parseFloat(container.querySelector('#ca_alb').value) || 0;
      const caCorr = ca + 0.8 * (4.0 - alb);

      const ban = container.querySelector('#ca_interp_banner');
      let interp = '', cls = 'ok', rec = '';
      if (caCorr > 10.5) {
        interp = 'Hiperkalsemia (> 10.5 mg/dL)';
        cls = 'warn';
        ban.style.background = 'rgba(251,191,36,0.18)';
        ban.style.color = 'var(--warn)';
        ban.style.border = '1px solid var(--warn)';
        rec = `- Hidrasi agresif dengan NaCl 0.9% 200-300 mL/jam untuk memicu kalsiuresis.<br>- Pertimbangkan bisfosfonat IV (Zoledronic acid 4 mg) atau Calcitonin pada krisis hiperkalsemia malignansi.`;
      } else if (caCorr < 8.5) {
        interp = 'Hipokalsemia (< 8.5 mg/dL)';
        cls = 'bad';
        ban.style.background = 'rgba(239,68,68,0.18)';
        ban.style.color = 'var(--bad)';
        ban.style.border = '1px solid var(--bad)';
        rec = `- <b>Hipokalsemia Simptomatik / Berat:</b> Kalsium Glukonas 10% 1-2 ampul (10-20 mL) dalam 100 mL D5W habis dalam 10-20 menit, dilanjutkan drip kontinu bila perlu.<br>- Evaluasi kadar Magnesium, Fosfat, dan Hormon Paratiroid (PTH).`;
      } else {
        interp = 'Batas Normal (8.5 - 10.5 mg/dL)';
        cls = 'ok';
        ban.style.background = 'rgba(52,211,153,0.18)';
        ban.style.color = 'var(--ok)';
        ban.style.border = '1px solid var(--ok)';
        rec = `Kalsium terkoreksi albumin berada dalam batas fisiologis normal (8.5 - 10.5 mg/dL).`;
      }
      ban.textContent = `${interp} — Terkoreksi: ${caCorr.toFixed(2)} mg/dL`;
      container.querySelector('#ca_protocol_box').innerHTML = rec;

      const cppt = `[adjustrFluid CDSS] KALSIUM TERKOREKSI (FORMULA PAYNE)\n` +
        `Data Laboratorium: Kalsium Total ${ca} mg/dL | Albumin Serum ${alb} g/dL\n` +
        `Kalsium Terkoreksi: ${caCorr.toFixed(2)} mg/dL\n` +
        `Interpretasi: ${interp}\n\n` +
        `REKOMENDASI KLINIS:\n` +
        (caCorr < 8.5 ? `- Hipokalsemia Simptomatik / Berat (< 7.5 mg/dL atau tetani/kejang/QT memanjang): Kalsium Glukonas 10% 1-2 ampul (10-20 mL) dalam 100 mL D5W habis dalam 10-20 menit, dilanjutkan drip kontinu bila perlu.\n- Evaluasi kadar Magnesium, Fosfat, dan Hormon Paratiroid (PTH).` :
         caCorr > 10.5 ? `- Hidrasi agresif dengan NaCl 0.9% 200-300 mL/jam untuk memicu kalsiuresis.\n- Pertimbangkan bisfosfonat IV (Zoledronic acid 4 mg) atau Calcitonin pada krisis hiperkalsemia malignansi.` :
         `Kalsium terkoreksi albumin berada dalam batas fisiologis normal (8.5 - 10.5 mg/dL).`);

      emit({
        value: `${caCorr.toFixed(2)} mg/dL`,
        text: `${interp}. Formula Payne: Ca + 0,8 × (4,0 - Albumin).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('input').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 6. MAGNESIUM (PROTOKOL REPLESI MGSO4) */
reg({ id:'mg-mgmt', nama:'Magnesium (Protokol Replesi MgSO4)', divisi:'Cairan & Elektrolit', tags:'magnesium mgso4 hipomagnesemia torsades', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div>
        <label>Kadar Magnesium Serum (mg/dL)</label>
        <input type="number" id="mg_serum" step="0.1" value="1.2">
      </div>
      <div id="mg_protocol_text" style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;"></div>
      <div style="margin-top:10px;padding:10px 14px;background:rgba(251,191,36,0.1);border:1px solid var(--warn);border-radius:10px;font-size:12px;color:var(--warn);line-height:1.5;">
        <b>CATATAN KESELAMATAN (SAFETY PEARL):</b><br>
        - Jangan memberikan infus MgSO4 bolus cepat tanpa indikasi Torsades de Pointes / Eklampsia.<br>
        - Pantau refleks tendon patela, frekuensi napas (> 16x/menit), dan produksi urin selama infus MgSO4.<br>
        - Siapkan Kalsium Glukonas 10% sebagai antidotum spesifik bila terjadi toksisitas magnesium.
      </div>
    `;

    const calc = () => {
      const mg = parseFloat(container.querySelector('#mg_serum').value) || 2.0;
      let proto = '', cls = 'ok';
      if (mg < 1.0) { proto = "Defisit Berat (< 1.0 mg/dL): 4-8g IV MgSO4 dalam 12-24 jam (Monitoring EKG kontinu)."; cls = 'bad'; }
      else if (mg < 1.6) { proto = "Defisit Sedang (1.0 - 1.5 mg/dL): 2g IV MgSO4 dalam 1-2 jam."; cls = 'warn'; }
      else { proto = "Normal atau Ringan (1.6 - 2.4 mg/dL): Represi oral atau 1-2g IV MgSO4."; cls = 'ok'; }
      container.querySelector('#mg_protocol_text').innerHTML = `<b>Protokol Intervensi:</b> ${proto}`;

      const cppt = `[adjustrFluid CDSS] MANAJEMEN MAGNESIUM\n` +
        `Kadar Magnesium Serum: ${mg} mg/dL\n` +
        `Protokol Intervensi: ${proto}\n\n` +
        `CATATAN KESELAMATAN (SAFETY PEARL):\n` +
        `- Jangan memberikan infus MgSO4 bolus cepat tanpa indikasi Torsades de Pointes / Eklampsia.\n` +
        `- Pantau refleks tendon patela dan frekuensi napas (> 16x/menit) serta produksi urin selama infus MgSO4.\n` +
        `- Siapkan Kalsium Glukonas 10% sebagai antidotum spesifik bila terjadi toksisitas magnesium.`;

      emit({ value: `${mg} mg/dL`, text: proto, cls, cppt });
    };

    container.querySelector('#mg_serum').addEventListener('input', calc);
    calc();
  }
});

/* 7. FOSFAT (PROTOKOL HIPOFOSFATEMIA) */
reg({ id:'po4-mgmt', nama:'Fosfat (Protokol Hipofosfatemia)', divisi:'Cairan & Elektrolit', tags:'fosfat phosphate hipofosfatemia refeeding dka k-phos', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div>
        <label>Kadar Fosfat Serum (mg/dL)</label>
        <input type="number" id="po4_serum" step="0.1" value="1.5">
      </div>
      <div id="po4_protocol_text" style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;"></div>
      <div style="margin-top:10px;padding:10px 14px;background:rgba(251,191,36,0.1);border:1px solid var(--warn);border-radius:10px;font-size:12px;color:var(--warn);line-height:1.5;">
        <b>PERTIMBANGAN KLINIS KHUSUS:</b><br>
        - Pada Sindrom Refeeding atau DKA paska-insulin, hipofosfatemia berat dapat memicu gagal napas mendadak akibat disfungsi diafragma dan rhabdomiolisis.<br>
        - Hindari pemberian fosfat IV terlalu cepat untuk mencegah presipitasi kalsium-fosfat dan gagal ginjal akut.
      </div>
    `;

    const calc = () => {
      const po4 = parseFloat(container.querySelector('#po4_serum').value) || 3.0;
      let proto = '', cls = 'ok';
      if (po4 < 1.0) { proto = "Defisit Berat (< 1.0 mg/dL): 0.32 - 0.64 mmol/kg IV Potassium/Sodium Phosphate dalam 4-6 jam."; cls = 'bad'; }
      else if (po4 < 2.0) { proto = "Defisit Sedang (1.0 - 1.9 mg/dL): 0.16 - 0.32 mmol/kg IV atau sediaan oral ekuivalen."; cls = 'warn'; }
      else { proto = "Normal atau Ringan (2.0 - 4.5 mg/dL): Optimalkan asupan diet fosfat / susu / Neutra-Phos oral."; cls = 'ok'; }
      container.querySelector('#po4_protocol_text').innerHTML = `<b>Protokol Dosis:</b> ${proto}`;

      const cppt = `[adjustrFluid CDSS] MANAJEMEN HIPOFOSFATEMIA\n` +
        `Kadar Fosfat Serum: ${po4} mg/dL\n` +
        `Protokol Dosis: ${proto}\n\n` +
        `PERTIMBANGAN KLINIS KHUSUS:\n` +
        `- Pada Sindrom Refeeding atau DKA paska-insulin, hipofosfatemia berat dapat memicu gagal napas mendadak akibat disfungsi diafragma dan rhabdomiolisis.\n` +
        `- Hindari pemberian fosfat IV terlalu cepat untuk mencegah presipitasi kalsium-fosfat dan gagal ginjal akut.`;

      emit({ value: `${po4} mg/dL`, text: proto, cls, cppt });
    };

    container.querySelector('#po4_serum').addEventListener('input', calc);
    calc();
  }
});

/* 8. AKI STAGING & RASIO BUN:KREATININ */
reg({ id:'aki-bun-cr', nama:'AKI Staging & Rasio BUN:Creatinine', divisi:'Ginjal-Hipertensi', tags:'aki bun kreatinin rasio bun cr prerenal atn azotemia kdigo dialisis aeiou', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div>
        <label>Pilihan Satuan Ureum</label>
        <select id="aki_unit">
          <option value="bun_mgdl" selected>Blood Urea Nitrogen (BUN) [mg/dL]</option>
          <option value="urea_mgdl">Urea Serum Total [mg/dL] (Konversi Otomatis / 2.14)</option>
        </select>
      </div>
      <div class="row">
        <div>
          <label>Nilai Ureum / BUN (mg/dL) ${c.bun ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="aki_u" value="${c.bun || 100}">
        </div>
        <div>
          <label>Serum Kreatinin (mg/dL) ${c.cr ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="aki_cr" step="0.1" value="${c.cr || 2.5}">
        </div>
      </div>
      <div id="aki_interp_banner" style="margin-top:12px;padding:12px 14px;border-radius:10px;font-size:14px;font-weight:700;"></div>
      <div id="aki_rec_box" style="margin-top:10px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;"></div>
    `;

    const calc = () => {
      const isBun = container.querySelector('#aki_unit').value === 'bun_mgdl';
      const rawUrea = parseFloat(container.querySelector('#aki_u').value) || 1;
      const cr = parseFloat(container.querySelector('#aki_cr').value) || 1;
      const bun = isBun ? rawUrea : rawUrea / 2.14;
      const ratio = cr > 0 ? bun / cr : 0;

      const ban = container.querySelector('#aki_interp_banner');
      let diag = '', cls = 'ok', rec = '';
      if (ratio > 20) {
        diag = 'Prerenal Azotemia (Rasio > 20)';
        cls = 'ok';
        ban.style.background = 'rgba(52,211,153,0.15)';
        ban.style.color = 'var(--ok)';
        ban.style.border = '1px solid var(--ok)';
        rec = `- <b>Prerenal Azotemia:</b> Optimalkan perfusi renal dengan resusitasi kristaloid terukur, hentikan obat nefrotoksik (NSAID, ACEi/ARB), evaluasi respon perbaikan diuresis.<br>- Waspadai false high bila terdapat perdarahan SCBA masif atau terapi steroid dosis tinggi.`;
      } else if (ratio < 10) {
        diag = 'Intrinsic Renal Failure / ATN (Rasio < 10)';
        cls = 'bad';
        ban.style.background = 'rgba(239,68,68,0.15)';
        ban.style.color = 'var(--bad)';
        ban.style.border = '1px solid var(--bad)';
        rec = `- <b>Intrinsic Renal Failure (ATN):</b> Batasi cairan harian sesuai IWL + UOP aktual untuk mencegah fluid overload paru. Analisis sedimen urin & fraksi ekskresi natrium (FeNa).`;
      } else {
        diag = 'Normal / Post-Renal Etiology (Rasio 10 - 20)';
        cls = 'warn';
        ban.style.background = 'rgba(251,191,36,0.15)';
        ban.style.color = 'var(--warn)';
        ban.style.border = '1px solid var(--warn)';
        rec = `- Rentang intermediet/normal (10-20): Evaluasi etiologi post-renal (USG ginjal saluran kemih / evaluasi obstruksi buli).`;
      }
      rec += `<br><br><b>Indikasi Cito Dialisis (AEIOU):</b> Asidosis refrakter, Elektrolit K>6.5, Intoksikasi, Overload paru refrakter diuretik, Uremia ensefalopati/perikarditis.`;
      ban.textContent = `${diag} — Rasio ${ratio.toFixed(1)} : 1 (BUN: ${bun.toFixed(1)} mg/dL)`;
      container.querySelector('#aki_rec_box').innerHTML = rec;

      const cppt = `[adjustrFluid CDSS] EVALUASI AKI & RASIO BUN : KREATININ\n` +
        `Data Laboratorium: ${isBun ? 'BUN' : 'Urea Serum'} ${rawUrea} mg/dL | Serum Kreatinin ${cr} mg/dL\n` +
        `BUN Fisiologis Terkalkulasi: ${bun.toFixed(1)} mg/dL\n` +
        `Rasio BUN : Kreatinin: ${ratio.toFixed(1)} : 1\n` +
        `Interpretasi: ${diag}\n\n` +
        `REKOMENDASI & RENCANA TATA LAKSANA:\n` +
        (ratio > 20 ? `- Prerenal Azotemia: Optimalkan perfusi renal dengan resusitasi kristaloid terukur, hentikan obat nefrotoksik (NSAID, ACEi/ARB), evaluasi respon perbaikan diuresis.\n- Waspadai false high bila terdapat perdarahan SCBA masif atau terapi steroid dosis tinggi.` :
         ratio < 10 ? `- Intrinsic Renal Failure (ATN): Batasi cairan harian sesuai IWL + UOP aktual untuk mencegah fluid overload paru. Analisis sedimen urin & fraksi ekskresi natrium (FeNa).` :
         `- Rentang intermediet/normal (10-20): Evaluasi etiologi post-renal (USG ginjal saluran kemih / evaluasi obstruksi buli).`) +
        `\n\nIndikasi Cito Dialisis (AEIOU): Asidosis refrakter, Elektrolit K>6.5, Intoksikasi, Overload paru refrakter diuretik, Uremia ensefalopati/perikarditis.`;

      emit({
        value: `${ratio.toFixed(1)} : 1`,
        text: diag,
        cls,
        cppt
      });
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 9. BRIDGING INSULIN (TRANSISI KE SUBKUTAN - TABEL 24 JAM LENGKAP) */
reg({ id:'ins-bridge', nama:'Bridging Insulin (Transisi Drip ke Subkutan)', divisi:'Endokrin-Metabolik', tags:'insulin drip subkutan basal bolus kad dka transisi bridging 24 jam', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <label style="margin:0;">Jam Mulai Drip:</label>
          <select id="ins_start_hour" style="width:auto;padding:6px 10px;">
            ${Array.from({length:24}, (_, i) => `<option value="${i}">${i.toString().padStart(2, '0')}:00</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="font-size:12px;color:var(--mut);">Quick Fill:</span>
          <button class="btn qf-btn" data-v="0">0 U</button>
          <button class="btn qf-btn" data-v="1">1 U</button>
          <button class="btn qf-btn" data-v="1.5">1,5 U</button>
          <button class="btn qf-btn" data-v="2">2 U</button>
          <button class="btn qf-btn" data-v="3">3 U</button>
        </div>
      </div>
      <div id="ins_grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;max-height:260px;overflow-y:auto;padding:8px;background:rgba(255,255,255,0.02);border:1px solid var(--bd);border-radius:10px;"></div>
      <div style="margin-top:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
        <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
          <small style="color:var(--mut);">Total Drip 24 Jam</small>
          <div id="ins_tot_drip" style="font-size:18px;font-weight:800;color:var(--tx);">-</div>
        </div>
        <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
          <small style="color:var(--mut);">Basal-Bolus (80%)</small>
          <div id="ins_tot_bb" style="font-size:18px;font-weight:800;color:var(--ac);">-</div>
        </div>
        <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
          <small style="color:var(--mut);">Basal 1x/hr (50%)</small>
          <div id="ins_basal" style="font-size:18px;font-weight:800;color:var(--ok);">-</div>
        </div>
        <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
          <small style="color:var(--mut);">Prandial (/3)</small>
          <div id="ins_prandial" style="font-size:18px;font-weight:800;color:var(--warn);">-</div>
        </div>
      </div>
    `;

    const grid = container.querySelector('#ins_grid');
    const startSel = container.querySelector('#ins_start_hour');

    const renderGrid = () => {
      const sh = parseInt(startSel.value, 10) || 0;
      const prevVals = Array.from(grid.querySelectorAll('.ins-h-inp')).map(inp => inp.value);
      grid.innerHTML = Array.from({length:24}, (_, i) => {
        const h = (sh + i) % 24;
        const val = prevVals[i] !== undefined ? prevVals[i] : '2';
        return `<div style="display:flex;flex-direction:column;align-items:center;padding:4px;background:rgba(0,0,0,0.2);border-radius:6px;border:1px solid var(--bd);">
          <span style="font-size:11px;color:var(--mut);font-family:monospace;">${h.toString().padStart(2, '0')}:00</span>
          <input type="number" step="0.5" min="0" class="ins-h-inp" value="${val}" style="width:100%;text-align:center;padding:4px;font-size:13px;font-family:monospace;margin-top:2px;">
        </div>`;
      }).join('');
      grid.querySelectorAll('.ins-h-inp').forEach(inp => inp.addEventListener('input', calc));
      calc();
    };

    container.querySelectorAll('.qf-btn').forEach(btn => {
      btn.onclick = () => {
        const val = btn.dataset.v;
        grid.querySelectorAll('.ins-h-inp').forEach(inp => inp.value = val);
        calc();
      };
    });

    startSel.onchange = renderGrid;

    const calc = () => {
      let total = 0;
      grid.querySelectorAll('.ins-h-inp').forEach(inp => { total += parseFloat(inp.value) || 0; });
      const totalBB = total * 0.8;
      const basal = totalBB * 0.5;
      const prandial = basal / 3;

      container.querySelector('#ins_tot_drip').textContent = `${fmtIndo(total, 1)} U`;
      container.querySelector('#ins_tot_bb').textContent = `${fmtIndo(totalBB, 1)} U`;
      container.querySelector('#ins_basal').textContent = `${fmtIndo(basal, 1)} U`;
      container.querySelector('#ins_prandial').textContent = `${fmtIndo(prandial, 1)} U`;

      const cppt = `BRIDGING INSULIN (TRANSISI KE SUBKUTAN)\n\n` +
        `Total drip 24 jam       : ${fmtIndo(total, 1)} U\n` +
        `Total basal-bolus (80%) : ${fmtIndo(totalBB, 1)} U\n` +
        `Insulin basal (50%)     : ${fmtIndo(basal, 1)} U (diberikan 1x/hari SC)\n` +
        `Insulin prandial (/x3)  : ${fmtIndo(prandial, 1)} U (tiap makan SC)\n\n` +
        `Instruksi Overlap:\n` +
        `- Berikan dosis insulin basal subkutan 1 - 2 jam sebelum drip IV dihentikan.\n` +
        `- Pastikan pasien toleransi intake oral saat beralih ke regimen subkutan.`;

      emit({
        value: `${fmtIndo(totalBB, 1)} U/hari (80% Regimen)`,
        text: `Basal (Glargine/Detemir): <b>${fmtIndo(basal, 1)} U</b> 1x/hari SC | Prandial (Aspart/Lispro): <b>${fmtIndo(prandial, 1)} U</b> 3x/hari SC saat makan. Berikan basal 1-2 jam sebelum stop drip.`,
        cls: 'ok',
        cppt
      });
    };

    renderGrid();
  }
});

/* 10. TITRASI SYRINGE PUMP OBAT VASOAKTIF (Calc-Med) */
function pumpCalc(nama, key, drugLabel, def, doses, perKg, tags) {
  reg({ id:'pump-' + key, nama:'Titrasi ' + nama, divisi:'Perawatan Kritis', tags:'drip syringe pump titrasi vasoaktif ' + tags, batch:'M1',
    fields:[...(perKg ? [{id:'bb', label:'Berat Badan Pasien (kg)', type:'number', ctx:'bb', def:def.bb}] : []),
      {id:'mg', label:'Dosis Obat dalam Syringe (mg)', type:'number', def:def.mg, step:'0.1'},
      {id:'cc', label:'Volume Total Pengenceran NaCl 0.9% (cc)', type:'number', def:def.cc}],
    compute: v => {
      const mg = v.mg || def.mg;
      const cc = v.cc || def.cc;
      const bb = perKg ? (v.bb || def.bb) : 0;
      if (mg <= 0 || cc <= 0 || (perKg && bb <= 0)) return null;

      const conc = (mg * 1000) / cc; // mcg/cc
      const unit = perKg ? 'mcg/kg/menit' : 'mcg/menit';
      const rows = doses.map(d => {
        const rate = perKg ? (d * bb * 60) / conc : (d * 60) / conc;
        const dStr = String(d).replace('.', ',');
        return [`${dStr} ${unit}`, `${fmtIndo(rate, 1)} ml/jam`];
      });

      let cppt = `COPY KE CPPT\n` +
        `Drip ${drugLabel} ${mg} mg dalam NaCl 0.9% ${cc} cc${perKg ? ` (BB: ${bb} kg)` : ''}\n` +
        `Konsentrasi: ${conc.toFixed(0)} mcg/cc\n\n`;
      rows.forEach(r => {
        cppt += `  ${r[0].padEnd(20, ' ')}:   ${r[1].padStart(8, ' ')}\n`;
      });

      return {
        value: `${conc.toFixed(0)} mcg/cc`,
        text: `Drip ${drugLabel} ${mg} mg dalam ${cc} cc NaCl 0.9%${perKg ? ` (BB: ${bb} kg)` : ''}.`,
        cls: 'ok',
        table: rows,
        cppt
      };
    }
  });
}
pumpCalc('Norepinefrin', 'ne', 'norepinefrin', {bb:50, mg:8, cc:50}, [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], true, 'norepinephrine noradrenalin syok');
pumpCalc('Dobutamin', 'dobu', 'dobutamin', {bb:80, mg:500, cc:50}, Array.from({length:19}, (_, i) => i + 2), true, 'dobutamine inotrop gagal jantung');
pumpCalc('Dopamin', 'dopa', 'dopamin', {bb:70, mg:400, cc:50}, Array.from({length:16}, (_, i) => i + 5), true, 'dopamine');
pumpCalc('Nikardipin', 'nica', 'nikardipin', {bb:40, mg:10, cc:50}, [0.5, 1, 1.5, 2, 3, 4, 5, 6], true, 'nicardipine krisis hipertensi');
pumpCalc('Nitrogliserin (NTG)', 'ntg', 'nitrogliserin (NTG)', {mg:10, cc:50}, Array.from({length:10}, (_, i) => (i + 1) * 10), false, 'nitroglycerin nitrat gagal jantung akut');

/* 11. ANALISIS GAS DARAH (AGD & ASAM-BASA LENGKAP - 8 LANGKAH) */
reg({ id:'abg', nama:'Analisis Gas Darah (AGD & Asam-Basa Lengkap)', divisi:'Perawatan Kritis', tags:'agd bga asam basa winter henderson anion gap delta ratio p/f ards bikarbonat osmolal gap', batch:'M1',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
        <div>
          <label>pH ${c.ph ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_ph" step="0.01" value="${c.ph || 7.25}">
        </div>
        <div>
          <label>pCO2 (mmHg) ${c.pco2 ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_pco2" value="${c.pco2 || 30}">
        </div>
        <div>
          <label>HCO3 (mEq/L) ${c.hco3 ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_hco3" value="${c.hco3 || 13}">
        </div>
        <div>
          <label>Na+ (mEq/L) ${c.na ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_na" value="${c.na || 140}">
        </div>
        <div>
          <label>Cl- (mEq/L) ${c.cl ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_cl" value="${c.cl || 105}">
        </div>
        <div>
          <label>Albumin (g/dL) ${c.alb ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_alb" step="0.1" value="${c.alb || 4.0}">
        </div>
        <div>
          <label>PaO2 (mmHg)</label>
          <input type="number" id="abg_pao2" value="90">
        </div>
        <div>
          <label>FiO2 (%)</label>
          <input type="number" id="abg_fio2" value="21">
        </div>
        <div>
          <label>Berat Badan (kg) ${c.bb ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="abg_bb" value="${c.bb || 60}">
        </div>
      </div>
      <div style="margin:14px 0 8px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;">
        <label class="chk" style="margin:0;">
          <input type="checkbox" id="abg_enable_osmolal"> Langkah 8: Skrining Osmolal Gap (Curiga Toksin / Alkohol Toksik)
        </label>
        <div id="abg_osmo_inputs" style="display:none;margin-top:10px;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div>
            <label>Glukosa (mg/dL) ${c.glu ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
            <input type="number" id="abg_glu" value="${c.glu || 180}">
          </div>
          <div>
            <label>BUN (mg/dL) ${c.bun ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
            <input type="number" id="abg_bun" value="${c.bun || 28}">
          </div>
          <div>
            <label>Measured Osm (mOsm/kg)</label>
            <input type="number" id="abg_osm" value="305">
          </div>
        </div>
      </div>
      <div id="abg_steps_output" style="margin-top:12px;font-size:13px;line-height:1.6;"></div>
    `;

    const osmoCb = container.querySelector('#abg_enable_osmolal');
    const osmoBox = container.querySelector('#abg_osmo_inputs');
    osmoCb.onchange = () => { osmoBox.style.display = osmoCb.checked ? 'grid' : 'none'; calc(); };

    const calc = () => {
      const ph = parseFloat(container.querySelector('#abg_ph').value) || 0;
      const pco2 = parseFloat(container.querySelector('#abg_pco2').value) || 0;
      const hco3 = parseFloat(container.querySelector('#abg_hco3').value) || 0;
      const na = parseFloat(container.querySelector('#abg_na').value) || 140;
      const cl = parseFloat(container.querySelector('#abg_cl').value) || 105;
      const alb = parseFloat(container.querySelector('#abg_alb').value) || 4.0;
      const pao2 = parseFloat(container.querySelector('#abg_pao2').value) || 90;
      const fio2 = parseFloat(container.querySelector('#abg_fio2').value) || 21;
      const bb = parseFloat(container.querySelector('#abg_bb').value) || 60;
      const enableOsm = osmoCb.checked;
      const osm = parseFloat(container.querySelector('#abg_osm').value) || 290;
      const glu = parseFloat(container.querySelector('#abg_glu').value) || 90;
      const bun = parseFloat(container.querySelector('#abg_bun').value) || 14;

      if (ph === 0 || pco2 === 0 || hco3 === 0) return;

      // 1. Henderson Equation Validation: [H+] = 24 * (pCO2 / HCO3)
      const h_calc = 24 * (pco2 / hco3);
      let h_exact = 40;
      if (ph >= 7.0 && ph <= 7.8) h_exact = 40 + ((7.40 - ph) * 100);
      else h_exact = Math.pow(10, (9 - ph));
      const diff = Math.abs(h_calc - h_exact) / h_exact * 100;
      const valStatus = diff <= 15 ? `Valid (Δ ${diff.toFixed(1)}%)` : `Tidak Valid (Δ ${diff.toFixed(1)}%)`;

      // 2 & 3. Gangguan Primer & Winter's Formula
      let primer = "Normal / Terkompensasi Sempurna";
      let komp = "-";
      let winter = "-";

      if (ph < 7.35) {
        if (hco3 < 22 && pco2 <= 45) {
          primer = "Asidosis Metabolik";
          const expPco2 = (1.5 * hco3) + 8;
          winter = `Winter exp pCO2: ${expPco2.toFixed(1)} ± 2 mmHg`;
          if (pco2 >= expPco2 - 2 && pco2 <= expPco2 + 2) komp = "Kompensasi Respiratorik Adekuat";
          else if (pco2 > expPco2 + 2) komp = "Campuran: + Asidosis Respiratorik";
          else komp = "Campuran: + Alkalosis Respiratorik";
        } else if (pco2 > 45) {
          primer = "Asidosis Respiratorik";
          const expHco3Akut = 24 + 0.1 * (pco2 - 40);
          const expHco3Kronik = 24 + 0.35 * (pco2 - 40);
          winter = `Exp HCO3 Akut: ${expHco3Akut.toFixed(1)} | Kronik: ${expHco3Kronik.toFixed(1)}`;
          if (hco3 > 26) komp = "Kompensasi Metabolik Renal";
          else komp = "Fase Akut / Belum Ada Kompensasi Ginjal";
        }
      } else if (ph > 7.45) {
        if (hco3 > 26 && pco2 >= 35) {
          primer = "Alkalosis Metabolik";
          const expPco2 = (0.7 * hco3) + 21;
          winter = `Exp pCO2: ${expPco2.toFixed(1)} ± 2 mmHg`;
          if (pco2 >= expPco2 - 2 && pco2 <= expPco2 + 2) komp = "Kompensasi Respiratorik Adekuat";
          else if (pco2 > expPco2 + 2) komp = "Campuran: + Asidosis Respiratorik";
          else komp = "Campuran: + Alkalosis Respiratorik";
        } else if (pco2 < 35) {
          primer = "Alkalosis Respiratorik";
          const expHco3Akut = 24 - 0.2 * (40 - pco2);
          const expHco3Kronik = 24 - 0.5 * (40 - pco2);
          winter = `Exp HCO3 Akut: ${expHco3Akut.toFixed(1)} | Kronik: ${expHco3Kronik.toFixed(1)}`;
          if (hco3 < 22) komp = "Kompensasi Ginjal";
          else komp = "Fase Akut";
        }
      }

      // 4. Anion Gap + Koreksi Albumin
      const ag = na - (cl + hco3);
      const agCorr = ag + 2.5 * (4.0 - alb);
      const agStatus = agCorr > 12 ? "High Anion Gap (AGMA)" : "Normal Anion Gap (NAGMA)";

      // 5. Workup AGMA / Delta Ratio
      let workupText = "-";
      if (primer.includes("Asidosis Metabolik") && agCorr > 12) {
        const deltaAG = agCorr - 12;
        const deltaHCO3 = 24 - hco3;
        const deltaRatio = deltaHCO3 !== 0 ? (deltaAG / deltaHCO3) : 1;
        let dx = "";
        if (deltaRatio < 0.4) dx = "NAGMA Murni";
        else if (deltaRatio >= 0.4 && deltaRatio <= 0.8) dx = "Campuran AGMA + NAGMA";
        else if (deltaRatio > 0.8 && deltaRatio <= 2.0) dx = "AGMA Murni (Pure AGMA)";
        else dx = "Campuran AGMA + Alkalosis Metabolik Pre-existing";
        workupText = `Delta Ratio: ${deltaRatio.toFixed(2)} → ${dx}`;
      } else if (primer.includes("Asidosis Metabolik")) {
        workupText = `NAGMA Murni. Evaluasi GI loss (diare) atau Renal loss (RTA).`;
      } else {
        workupText = `N/A (Bukan kelainan primer Asidosis Metabolik).`;
      }

      // 6. Oksigenasi (PaO2 / FiO2 Ratio)
      const pfRatio = fio2 > 0 ? (pao2 / (fio2 / 100)) : 0;
      let pfStatus = "";
      if (pfRatio > 400) pfStatus = "Normal (>400)";
      else if (pfRatio > 300) pfStatus = "Oksigenasi suboptimal (300-400)";
      else if (pfRatio > 200) pfStatus = "Mild ARDS (200-300)";
      else if (pfRatio > 100) pfStatus = "Moderate ARDS (100-200)";
      else pfStatus = "Severe ARDS (≤ 100)";

      // 7. Indikasi Bikarbonat (NaHCO3)
      let bicarbText = "Tidak ada indikasi mutlak pemberian koreksi bikarbonat (pH ≥ 7.1).";
      if (ph < 7.1 && primer.includes("Asidosis Metabolik")) {
        const doseBicarb = 0.5 * bb * (15 - hco3);
        if (doseBicarb > 0) {
          bicarbText = `Asidemia Berat (pH < 7.1): Estimasi defisit awal = ${doseBicarb.toFixed(1)} mEq (berikan 1/2 dosis sebagai infus lambat).`;
        }
      }

      // 8. Osmolal Gap
      let osmGap = 0, oDiag = "";
      if (enableOsm) {
        const calcOsm = (2 * na) + (glu / 18) + (bun / 2.8);
        osmGap = osm - calcOsm;
        if (osmGap > 10) oDiag = `Gap: ${Math.round(osmGap)} mOsm/kg → ELEVATED GAP! Curiga toksin (Methanol/Ethylene Glycol).`;
        else oDiag = `Gap: ${Math.round(osmGap)} mOsm/kg → Normal Gap (≤ 10). Low suspicion toxic alcohol.`;
      }

      const stepsList = [
        ['1. Validasi Henderson', `${valStatus} (H+ hitung: ${h_calc.toFixed(1)}, aktual: ${h_exact.toFixed(1)})`],
        ['2. Gangguan Primer', primer],
        ['3. Kompensasi Paru/Ginjal', `${komp} (${winter})`],
        ['4. Anion Gap', `AG ${ag.toFixed(1)} | Terkoreksi Albumin: ${agCorr.toFixed(1)} (${agStatus})`],
        ['5. Analisis Delta Ratio', workupText],
        ['6. Status Oksigenasi', `P/F ${Math.round(pfRatio)} (${pfStatus})`],
        ['7. Koreksi NaHCO3', bicarbText]
      ];
      if (enableOsm) stepsList.push(['8. Osmolal Gap', oDiag]);

      container.querySelector('#abg_steps_output').innerHTML = stepsList.map(s => `
        <div style="padding:6px 10px;border-bottom:1px solid var(--bd);display:flex;justify-content:space-between;gap:10px;">
          <span style="color:var(--mut);min-width:160px;">${s[0]}</span>
          <b style="text-align:right;">${s[1]}</b>
        </div>
      `).join('');

      let cppt = `[adjustrFluid CDSS] ANALISIS GAS DARAH (BGA)\n` +
        `Parameter: pH ${ph} | pCO2 ${pco2} | HCO3 ${hco3} | PaO2 ${pao2} | FiO2 ${fio2}%\n` +
        (enableOsm ? `Elektrolit: Na ${na} | Cl ${cl} | Albumin ${alb} g/dL | Osmolalitas ${osm} mOsm/kg\n\n` : `Elektrolit: Na ${na} | Cl ${cl} | Albumin ${alb} g/dL\n\n`) +
        `INTERPRETASI:\n` +
        `1. Validasi Henderson : ${valStatus}\n` +
        `2. Gangguan Primer    : ${primer}\n` +
        `3. Kompensasi Paru    : ${komp} (${winter})\n` +
        `4. Anion Gap          : Koreksi ${agCorr.toFixed(1)} (${agStatus})\n` +
        `5. Analisis Delta     : ${workupText}\n` +
        `6. Status Oksigenasi  : P/F ${Math.round(pfRatio)} (${pfStatus})\n` +
        `7. Koreksi NaHCO3     : ${bicarbText}`;
      if (enableOsm) cppt += `\n8. Osmolal Gap        : ${Math.round(osmGap)} mOsm/kg (${osmGap > 10 ? 'High Gap / Toxic Suspicion' : 'Normal Gap'})`;

      emit({
        value: primer,
        text: `${komp}. Anion Gap terkoreksi: <b>${agCorr.toFixed(1)}</b>. ${workupText}`,
        cls: primer.startsWith('Normal') ? 'ok' : (ph < 7.2 || ph > 7.55) ? 'bad' : 'warn',
        cppt
      });
    };

    container.querySelectorAll('input').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});


window.showToast = window.showToast || function(msg) { toast(msg); };
window.copyToClipboard = window.copyToClipboard || function(text, msg) {
  window._last = text;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  toast(msg || 'Resume klinis berhasil disalin!');
};