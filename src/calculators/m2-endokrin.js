/* ===================== M2: ENDOKRIN, METABOLIK & TIROID (adjustr-emd.html FULL FIDELITY) ===================== */

/* 1. BURCH-WARTOFSKY POINT SCALE (BWPS) */
reg({ id:'bwps', nama:'Burch-Wartofsky Point Scale (BWPS) - Thyroid Storm', divisi:'Endokrin-Metabolik', tags:'bwps burch wartofsky badai tiroid thyroid storm tirotoksikosis ptu', batch:'M2',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>1. Termoregulasi / Suhu Tubuh (°C)</label>
          <select id="bwps_temp">
            <option value="0">&lt; 37.2 °C (0)</option>
            <option value="5">37.2 - 37.7 °C (+5)</option>
            <option value="10">37.8 - 38.3 °C (+10)</option>
            <option value="15">38.4 - 38.8 °C (+15)</option>
            <option value="20">38.9 - 39.3 °C (+20)</option>
            <option value="25">39.4 - 39.9 °C (+25)</option>
            <option value="30">≥ 40.0 °C (+30)</option>
          </select>
        </div>
        <div>
          <label>2. Disfungsi Sistem Saraf Pusat (SSP)</label>
          <select id="bwps_cns">
            <option value="0">Tidak Ada (0)</option>
            <option value="10">Ringan: Agitasi (+10)</option>
            <option value="20">Sedang: Delirium, Psikosis, Letargi Ekstrem (+20)</option>
            <option value="30">Berat: Kejang, Koma (+30)</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div>
          <label>3. Disfungsi Gastrointestinal / Hepar</label>
          <select id="bwps_gi">
            <option value="0">Tidak Ada (0)</option>
            <option value="10">Sedang: Diare, Mual/Muntah, Nyeri Abdomen (+10)</option>
            <option value="20">Berat: Ikterus tanpa sebab jelas (+20)</option>
          </select>
        </div>
        <div>
          <label>4. Kardiovaskular: Laju Nadi (bpm)</label>
          <select id="bwps_hr">
            <option value="0">&lt; 90 bpm (0)</option>
            <option value="5">90 - 109 bpm (+5)</option>
            <option value="10">110 - 119 bpm (+10)</option>
            <option value="15">120 - 129 bpm (+15)</option>
            <option value="20">130 - 139 bpm (+20)</option>
            <option value="25">≥ 140 bpm (+25)</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div>
          <label>5. Gagal Jantung Kongestif (CHF)</label>
          <select id="bwps_chf">
            <option value="0">Tidak Ada (0)</option>
            <option value="5">Ringan: Edema Perifer (+5)</option>
            <option value="10">Sedang: Ronki Basal Bilateral (+10)</option>
            <option value="15">Berat: Edema Paru Akut (+15)</option>
          </select>
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;gap:10px;padding:10px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;">
          <label class="chk" style="margin:0;"><input type="checkbox" id="bwps_af" value="10"> Fibrilasi Atrium (AF) (+) (+10)</label>
          <label class="chk" style="margin:0;"><input type="checkbox" id="bwps_prec" value="10"> Riwayat Faktor Pencetus Akut (+) (+10)</label>
        </div>
      </div>
      <div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;">
        <span style="color:var(--ok);font-weight:700;">SEKUENS TERAPI (REKOMENDASI/PLAN):</span><br>
        Rawat ICU bila skor ≥ 45. Urutan intervensi:
        1) <b>Beta-blocker:</b> Propranolol 60-80 mg p.o. q4h atau IV;<br>
        2) <b>Thionamide:</b> PTU loading 500-1000 mg p.o./NGT lanjut 200 mg q4h;<br>
        3) <b>Solutio Lugol:</b> 5 tetes q8h (diberikan 1 jam pasca PTU);<br>
        4) <b>Kortikosteroid:</b> Hidrokortison 100 mg IV q8h.
      </div>
    `;

    const calc = () => {
      let score = 0;
      score += parseInt(container.querySelector('#bwps_temp').value) || 0;
      score += parseInt(container.querySelector('#bwps_cns').value) || 0;
      score += parseInt(container.querySelector('#bwps_gi').value) || 0;
      score += parseInt(container.querySelector('#bwps_hr').value) || 0;
      score += parseInt(container.querySelector('#bwps_chf').value) || 0;
      if (container.querySelector('#bwps_af').checked) score += 10;
      if (container.querySelector('#bwps_prec').checked) score += 10;

      let interp = '', cls = 'ok';
      if (score >= 45) { interp = "Highly suggestive of Thyroid Storm (Krisis Tiroid)"; cls = 'bad'; }
      else if (score >= 25) { interp = "Impending Thyroid Storm"; cls = 'warn'; }
      else { interp = "Thyroid Storm Unlikely"; cls = 'ok'; }

      const tempTxt = container.querySelector('#bwps_temp').selectedOptions[0].text;
      const cnsTxt = container.querySelector('#bwps_cns').selectedOptions[0].text;
      const giTxt = container.querySelector('#bwps_gi').selectedOptions[0].text;
      const hrTxt = container.querySelector('#bwps_hr').selectedOptions[0].text;
      const chfTxt = container.querySelector('#bwps_chf').selectedOptions[0].text;
      const afTxt = container.querySelector('#bwps_af').checked ? 'Ya (+10)' : 'Tidak';
      const precTxt = container.querySelector('#bwps_prec').checked ? 'Ya (+10)' : 'Tidak';

      const cppt = `[CPPT - InternaHub EMD]
Modul: Burch-Wartofsky Point Scale (BWPS) - Thyroid Storm
- Parameter: Suhu [${tempTxt}], SSP [${cnsTxt}], GI/Hepar [${giTxt}], Nadi [${hrTxt}], CHF [${chfTxt}], AF: ${afTxt}, Pencetus: ${precTxt}
- Total Skor: ${score} / 140
- Kesimpulan: ${interp}
- Rekomendasi/Plan: Rawat ICU bila skor >= 45. Terapi: 1) Propranolol 60-80 mg p.o. q4h / IV, 2) PTU loading 500-1000 mg p.o. lanjut 200 mg q4h, 3) Lugol (5 tetes q8h, 1 jam post-PTU), 4) Hidrokortison 100 mg IV q8h.`;

      emit({
        value: `Skor ${score} / 140`,
        text: `Kesimpulan: <b>${interp}</b>. (Skor <25: Unlikely; 25-44: Impending; ≥45: Badai Tiroid).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('select, input').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 2. WAYNE'S CLINICAL INDEX */
reg({ id:'wayne', nama:"Wayne's Clinical Index (Hipertiroidisme)", divisi:'Endokrin-Metabolik', tags:'wayne index hipertiroid toksik goiter tremor palpitasi', batch:'M2',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:10px;border:1px solid var(--bd);">
          <span style="font-size:12px;font-weight:700;color:var(--ac);text-transform:uppercase;">Gejala Subyektif (Symptoms)</span>
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;font-size:13px;">
            <label class="chk"><input type="checkbox" value="1" class="w-chk"> Dispnea saat aktivitas (+1)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Palpitasi / berdebar (+2)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Mudah lelah (+2)</label>
            <label class="chk"><input type="checkbox" value="-5" class="w-chk"> Suka suhu panas (-5)</label>
            <label class="chk"><input type="checkbox" value="5" class="w-chk"> Suka suhu dingin (+5)</label>
            <label class="chk"><input type="checkbox" value="3" class="w-chk"> Keringat berlebih (+3)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Gelisah / Nervousness (+2)</label>
            <label class="chk"><input type="checkbox" value="3" class="w-chk"> Nafsu makan bertambah (+3)</label>
            <label class="chk"><input type="checkbox" value="-3" class="w-chk"> Nafsu makan berkurang (-3)</label>
            <label class="chk"><input type="checkbox" value="-3" class="w-chk"> Berat badan naik (-3)</label>
            <label class="chk"><input type="checkbox" value="3" class="w-chk"> Berat badan turun (+3)</label>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:10px;border:1px solid var(--bd);">
          <span style="font-size:12px;font-weight:700;color:var(--ac2);text-transform:uppercase;">Tanda Obyektif (Signs)</span>
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;font-size:13px;">
            <label class="chk"><input type="checkbox" value="3" class="w-chk"> Tiroid teraba membesar (+3)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Bruit pada kelenjar tiroid (+2)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Eksoftalmus (+2)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Retraksi kelopak mata (+2)</label>
            <label class="chk"><input type="checkbox" value="1" class="w-chk"> Lid lag (+1)</label>
            <label class="chk"><input type="checkbox" value="4" class="w-chk"> Gerakan hiperkinetik (+4)</label>
            <label class="chk"><input type="checkbox" value="1" class="w-chk"> Fine tremor jari tangan (+1)</label>
            <label class="chk"><input type="checkbox" value="2" class="w-chk"> Telapak tangan hangat (+2)</label>
            <label class="chk"><input type="checkbox" value="1" class="w-chk"> Telapak tangan basah (+1)</label>
          </div>
          <div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--bd);">
            <label>Laju Nadi / Irama Jantung</label>
            <select id="w_pulse">
              <option value="0">Normal (80 - 90 bpm) (0)</option>
              <option value="-3">&lt; 80 bpm (-3)</option>
              <option value="3">&gt; 90 bpm (+3)</option>
              <option value="4">Atrial Fibrillation (+4)</option>
            </select>
          </div>
        </div>
      </div>
    `;

    const calc = () => {
      let score = 0;
      container.querySelectorAll('.w-chk:checked').forEach(cb => { score += parseInt(cb.value) || 0; });
      score += parseInt(container.querySelector('#w_pulse').value) || 0;

      let interp = '', cls = 'ok';
      if (score > 19) { interp = "Toxic (Hyperthyroidism)"; cls = 'bad'; }
      else if (score >= 11) { interp = "Equivocal (Meragukan)"; cls = 'warn'; }
      else { interp = "Euthyroid"; cls = 'ok'; }

      const cppt = `[CPPT - InternaHub EMD]
Modul: Wayne's Clinical Index - Hipertiroidisme
- Total Skor: ${score}
- Kesimpulan: ${interp} (Skor >19 Toksik, 11-19 Equivocal, <11 Eutiroid)
- Rekomendasi/Plan: Konfirmasi profil hormon tiroid (TSH sensitif & Free T4). Kontrol gejala simpatis dengan beta-blocker bila takikardia bermakna.`;

      emit({
        value: `Skor ${score}`,
        text: `Status: <b>${interp}</b>. (Skor >19: Toksik / Hipertiroidisme Klinis; 11-19: Equivocal; <11: Eutiroid).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 3. BILLEWICZ DIAGNOSTIC SCORE (HIPOTIROIDISME) */
reg({ id:'billewicz', nama:'Billewicz Diagnostic Score (Hipotiroidisme)', divisi:'Endokrin-Metabolik', tags:'billewicz hipotiroid woltman ankle jerk levothyroxine', batch:'M2',
  mount: (container, c, emit) => {
    const items = [
      ['Berkurangnya Keringat', [['Tidak Ada (-2)', -2], ['Ada (+6)', 6]]],
      ['Kulit Kering', [['Tidak Ada (-6)', -6], ['Ada (+3)', 3]]],
      ['Intoleransi Dingin', [['Tidak Ada (-5)', -5], ['Ada (+4)', 4]]],
      ['Peningkatan Berat Badan', [['Tidak Ada (-1)', -1], ['Ada (+1)', 1]]],
      ['Konstipasi', [['Tidak Ada (-1)', -1], ['Ada (+2)', 2]]],
      ['Suara Serak (Hoarseness)', [['Tidak Ada (-6)', -6], ['Ada (+5)', 5]]],
      ['Parestesia', [['Tidak Ada (-4)', -4], ['Ada (+5)', 5]]],
      ['Penurunan Pendengaran', [['Tidak Ada (0)', 0], ['Ada (+2)', 2]]],
      ['Gerakan Melambat (Slow movements)', [['Tidak Ada (-3)', -3], ['Ada (+11)', 11]]],
      ["Delayed Ankle Jerk (Woltman's sign)", [['Tidak Ada (-6)', -6], ['Ada (+15)', 15]]],
      ['Kulit Kasar (Coarse skin)', [['Tidak Ada (-7)', -7], ['Ada (+7)', 7]]],
      ['Kulit Dingin (Cold skin)', [['Tidak Ada (-2)', -2], ['Ada (+3)', 3]]],
      ['Sembab Periorbita', [['Tidak Ada (-6)', -6], ['Ada (+4)', 4]]],
      ['Frekuensi Nadi', [['75 - 85 bpm (0)', 0], ['< 75 bpm (+4)', 4], ['> 85 bpm (-4)', -4]]]
    ];

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;">
        ${items.map((it, idx) => `
          <div>
            <label>${it[0]}</label>
            <select class="bil-sel" data-idx="${idx}">
              ${it[1].map(opt => `<option value="${opt[1]}">${opt[0]}</option>`).join('')}
            </select>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:12px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:12px;color:var(--mut);">
        <b>Clinical Pearl:</b> Delayed ankle jerk (tanda Woltman) memiliki bobot spesifisitas tinggi (+15 poin). Skor ≥ 25: Hipotiroid; -29 s/d +24: Equivocal; ≤ -30: Eutiroid.
      </div>
    `;

    const calc = () => {
      let score = 0;
      container.querySelectorAll('.bil-sel').forEach(sel => { score += parseInt(sel.value) || 0; });

      let interp = '', cls = 'ok';
      if (score >= 25) { interp = "Hypothyroid (Hipotiroidisme Klinis)"; cls = 'bad'; }
      else if (score > -30) { interp = "Equivocal (Meragukan)"; cls = 'warn'; }
      else { interp = "Euthyroid"; cls = 'ok'; }

      const cppt = `[CPPT - InternaHub EMD]
Modul: Billewicz Diagnostic Score - Hipotiroidisme
- Total Skor: ${score > 0 ? '+' : ''}${score}
- Kesimpulan: ${interp} (Skor >= 25 Hipotiroid, -29 s/d +24 Equivocal, <= -30 Eutiroid)
- Rekomendasi/Plan: Konfirmasi TSH dan FT4. Inisiasi Levothyroxine low and slow (12.5 - 25 mcg/hari pada geriatri/CAD), evaluasi TSH serial 6-8 minggu.`;

      emit({
        value: `Skor ${score > 0 ? '+' : ''}${score}`,
        text: `Kesimpulan: <b>${interp}</b>. (≥25: Hipotiroid; -29 s/d +24: Equivocal; ≤-30: Eutiroid).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 4. MYXEDEMA COMA DIAGNOSTIC SCORE (Popoveniuc 2014) */
reg({ id:'myxedema', nama:'Myxedema Coma Diagnostic Score (Popoveniuc 2014)', divisi:'Endokrin-Metabolik', tags:'myxedema miksedema koma popoveniuc hipotiroid berat levothyroxine hidrokortison', batch:'M2',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div id="myx_guardrail" style="display:none;padding:12px 14px;background:rgba(239,68,68,0.15);border:1px solid var(--bad);border-radius:10px;margin-bottom:12px;">
        <b style="color:var(--bad);">CRITICAL CLINICAL GUARDRAIL (WASPADA INSUFISIENSI ADRENAL SEKUNDER):</b><br>
        <span style="font-size:12.5px;color:var(--tx);">Berikan <b>Hidrokortison 100 mg IV stres dosis SEBELUM atau bersamaan dengan hormon tiroid</b>. Terapi tiroid tunggal tanpa steroid dapat memicu Krisis Adrenal fatal akibat peningkatan clearance kortisol metabolik!</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
        <div>
          <label>1. Termoregulasi / Suhu Tubuh (°C)</label>
          <select id="myx_temp">
            <option value="0">&gt; 35.0 °C (0)</option>
            <option value="10">32.0 - 35.0 °C (+10)</option>
            <option value="15">30.0 - 31.9 °C (+15)</option>
            <option value="20">&lt; 30.0 °C (+20)</option>
          </select>
        </div>
        <div>
          <label>2. Disfungsi SSP (Status Mental)</label>
          <select id="myx_cns">
            <option value="0">Tidak Ada / Alert (0)</option>
            <option value="10">Somnolen / Letargi (+10)</option>
            <option value="15">Stupor (+15)</option>
            <option value="20">Koma atau Kejang (+20)</option>
          </select>
        </div>
        <div>
          <label>3. Disfungsi Gastrointestinal</label>
          <select id="myx_gi">
            <option value="0">Tidak Ada (0)</option>
            <option value="5">Anoreksia, Nyeri Perut, atau Konstipasi (+5)</option>
            <option value="15">Ileus Paralitik / Penurunan bising usus berat (+15)</option>
          </select>
        </div>
        <div>
          <label>4. Kardiovaskular: Laju Nadi</label>
          <select id="myx_hr">
            <option value="0">≥ 60 bpm (0)</option>
            <option value="5">50 - 59 bpm (+5)</option>
            <option value="10">&lt; 50 bpm (+10)</option>
          </select>
        </div>
        <div>
          <label>5. Kardiovaskular: Tekanan Darah</label>
          <select id="myx_bp">
            <option value="0">Normotensi / SBP ≥ 100 mmHg (0)</option>
            <option value="10">Hipotensi Ringan: SBP 80 - 100 mmHg (+10)</option>
            <option value="20">Hipotensi Berat: SBP &lt; 80 mmHg (+20)</option>
          </select>
        </div>
        <div>
          <label>6. Elektrolit: Hiponatremia</label>
          <select id="myx_na">
            <option value="0">Na ≥ 130 mEq/L (0)</option>
            <option value="10">Na 120 - 129 mEq/L (+10)</option>
            <option value="15">Na &lt; 120 mEq/L (+15)</option>
          </select>
        </div>
      </div>
      <div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;">
        <label class="chk"><input type="checkbox" id="myx_glu" value="10"> Hipoglikemia (&lt; 60 mg/dL) (+10)</label>
        <label class="chk"><input type="checkbox" id="myx_resp" value="10"> Hipoksemia (PaO2 &lt; 60) / Hiperkapnia (+10)</label>
        <label class="chk"><input type="checkbox" id="myx_eff" value="10"> Efusi Perikardial / Low Voltage EKG (+10)</label>
        <label class="chk"><input type="checkbox" id="myx_prec" value="10"> Faktor Pencetus (Sepsis, MI, Dingin) (+10)</label>
      </div>
      <div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;">
        <b>Protokol Terapi Darurat:</b> 1) <b>Hidrokortison 100 mg IV stat</b>, lalu 100 mg q8h → 2) <b>Levothyroxine (LT4)</b> loading 200-400 mcg IV (atau oral 300-500 mcg via NGT), lanjut 50-100 mcg/hari → 3) Passive rewarming.
      </div>
    `;

    const calc = () => {
      let score = 0;
      score += parseInt(container.querySelector('#myx_temp').value) || 0;
      score += parseInt(container.querySelector('#myx_cns').value) || 0;
      score += parseInt(container.querySelector('#myx_gi').value) || 0;
      score += parseInt(container.querySelector('#myx_hr').value) || 0;
      score += parseInt(container.querySelector('#myx_bp').value) || 0;
      score += parseInt(container.querySelector('#myx_na').value) || 0;
      if (container.querySelector('#myx_glu').checked) score += 10;
      if (container.querySelector('#myx_resp').checked) score += 10;
      if (container.querySelector('#myx_eff').checked) score += 10;
      if (container.querySelector('#myx_prec').checked) score += 10;

      const grd = container.querySelector('#myx_guardrail');
      let interp = '', cls = 'ok';
      if (score >= 60) {
        interp = "Diagnostik Koma Miksedema (Highly Suggestive)";
        cls = 'bad';
        grd.style.display = 'block';
      } else if (score >= 25) {
        interp = "Risiko Tinggi / Impending Myxedema Coma";
        cls = 'warn';
        grd.style.display = 'block';
      } else {
        interp = "Unlikely (Kecil Kemungkinan)";
        cls = 'ok';
        grd.style.display = 'none';
      }

      const cppt = `[CPPT - InternaHub EMD]
Modul: Myxedema Coma Diagnostic Score (Popoveniuc 2014)
- Total Skor: ${score}
- Kesimpulan: ${interp} (>=60 Diagnostik Koma Miksedema, 25-59 Risiko Tinggi)
- CRITICAL GUARDRAIL: Berikan Hidrokortison 100 mg IV stres dosis SEBELUM hormon tiroid untuk mencegah Krisis Adrenal terinduksi peningkatan clearance kortisol!
- Rekomendasi/Plan: Rawat ICU, Hidrokortison 100 mg IV q8h, Levothyroxine loading 200-400 mcg IV (atau 300-500 mcg oral via NGT), passive external warming.`;

      emit({
        value: `Skor ${score}`,
        text: `Klasifikasi: <b>${interp}</b>. (≥60 Diagnostik; 25-59 Risiko Tinggi; <25 Unlikely).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('select, input').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 5. ADRENAL CRISIS DIAGNOSTIC & DOSING SCORE */
reg({ id:'adrenal', nama:'Adrenal Crisis Diagnostic & Dosing Score', divisi:'Endokrin-Metabolik', tags:'adrenal krisis adrenal hidrokortison addison hipotensi refrakter steroid', batch:'M2',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div class="row">
        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:10px;border:1px solid var(--bd);">
          <span style="font-size:12px;font-weight:700;color:var(--ac);text-transform:uppercase;">Kriteria Hemodinamik & Laboratorium</span>
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;font-size:13px;">
            <label class="chk"><input type="checkbox" value="3" class="ad-chk"> Hipotensi refrakter cairan / SBP &lt; 90 mmHg / butuh vasopresor (+3)</label>
            <label class="chk"><input type="checkbox" value="3" class="ad-chk"> Kombinasi Hiponatremia (&lt;135) + Hiperkalemia (&gt;5.0) (+3)</label>
            <label class="chk"><input type="checkbox" value="2" class="ad-chk"> Hipoglikemia tanpa sebab lain / GDS &lt; 70 mg/dL (+2)</label>
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:10px;border:1px solid var(--bd);">
          <span style="font-size:12px;font-weight:700;color:var(--ac2);text-transform:uppercase;">Anamnesis & Faktor Risiko</span>
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;font-size:13px;">
            <label class="chk"><input type="checkbox" value="3" class="ad-chk"> Riwayat steroid kronis (&gt;3 minggu) / Penyakit Addison / Hipofisis (+3)</label>
            <label class="chk"><input type="checkbox" value="2" class="ad-chk"> Nyeri abdomen akut hebat, mual muntah persisten, demam (+2)</label>
            <label class="chk"><input type="checkbox" value="2" class="ad-chk"> Stresor presipitasi mayor (Sepsis berat, operasi, trauma mayor) (+2)</label>
          </div>
        </div>
      </div>
      <div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;">
        <span style="color:var(--ok);font-weight:700;">PROTOKOL CEPAT KRISIS ADRENAL (STAT):</span><br>
        1. <b>Bolus Stat:</b> Hidrokortison <b>100 mg IV bolus segera</b> (Jangan tunda menunggu lab!).<br>
        2. <b>Maintenance:</b> Hidrokortison <b>200 mg/24 jam</b> via syringe pump kontinu ATAU <b>50 mg IV tiap 6 jam</b>.<br>
        3. <b>Resusitasi Cairan:</b> NaCl 0.9% 1000 mL pada jam pertama.<br>
        4. <b>Mineralokortikoid:</b> Fludrokortison TIDAK diperlukan pada fase akut bila hidrokortison &gt; 50 mg/hari.
      </div>
    `;

    const calc = () => {
      let score = 0;
      container.querySelectorAll('.ad-chk:checked').forEach(cb => { score += parseInt(cb.value) || 0; });

      let interp = '', cls = 'ok';
      if (score >= 6) { interp = "Probabilitas Sangat Tinggi"; cls = 'bad'; }
      else if (score >= 3) { interp = "Probabilitas Sedang"; cls = 'warn'; }
      else { interp = "Probabilitas Rendah"; cls = 'ok'; }

      const cppt = `[CPPT - InternaHub EMD]
Modul: Adrenal Crisis Diagnostic & Dosing Score
- Total Skor Kecurigaan: ${score}
- Kesimpulan: ${interp}
- Rekomendasi/Plan (STAT):
  1. Hidrokortison 100 mg IV bolus segera (jangan ditunda!).
  2. Maintenance Hidrokortison 200 mg/24 jam kontinyu atau 50 mg IV q6h.
  3. Resusitasi Salin NaCl 0.9% 1000 mL jam pertama.
  4. Fludrokortison TIDAK diperlukan pada fase akut dosis hidrokortison tinggi (>50 mg/hari).`;

      emit({
        value: `Skor ${score}`,
        text: `Kecurigaan: <b>${interp}</b>. (≥6: Sangat Tinggi; 3-5: Sedang; <3: Rendah).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('input').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 6. PITUITARY APOPLEXY SCORE (PAS) */
reg({ id:'apoplexy', nama:'Pituitary Apoplexy Score (PAS)', divisi:'Endokrin-Metabolik', tags:'pituitary apoplexy pas hipofisis dekompresi visus deksametason', batch:'M2',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;">
        <div>
          <label>1. Tajam Penglihatan (Visual Acuity)</label>
          <select id="pas_va">
            <option value="0">Normal (6/6) (0)</option>
            <option value="1">Penurunan Unilateral (1)</option>
            <option value="2">Penurunan Bilateral / Buta (2)</option>
          </select>
        </div>
        <div>
          <label>2. Lapang Pandang (Visual Field)</label>
          <select id="pas_vf">
            <option value="0">Normal (0)</option>
            <option value="1">Defek Bitemporal / Parsial Unilateral (1)</option>
            <option value="2">Defek Bitemporal Bilateral Parah (2)</option>
          </select>
        </div>
        <div>
          <label>3. Paresis Okulomotor (CN III, IV, VI)</label>
          <select id="pas_oc">
            <option value="0">Tidak Ada / Absent (0)</option>
            <option value="1">Paresis Unilateral (1)</option>
            <option value="2">Paresis Bilateral (2)</option>
          </select>
        </div>
        <div>
          <label>4. Tingkat Kesadaran (GCS)</label>
          <select id="pas_gcs">
            <option value="0">GCS 15 (Compos Mentis) (0)</option>
            <option value="1">GCS 12 - 14 (Somnolen) (1)</option>
            <option value="2">GCS &lt; 12 (Stupor / Koma) (2)</option>
          </select>
        </div>
      </div>
      <div style="margin-top:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid var(--bd);border-radius:10px;font-size:13px;line-height:1.6;">
        <b>Interpretasi Triase PAS (0 - 8):</b><br>
        - <b>Skor ≥ 4:</b> CITO Konsul Bedah Saraf untuk indikasi dekompresi transsfenoid darurat.<br>
        - <b>Skor &lt; 4:</b> Manajemen Konservatif di HCU/ICU, berikan Deksametason 4-8 mg IV tiap 6 jam, evaluasi MRI sella dan lapang pandang per 24 jam.
      </div>
    `;

    const calc = () => {
      let score = 0;
      score += parseInt(container.querySelector('#pas_va').value) || 0;
      score += parseInt(container.querySelector('#pas_vf').value) || 0;
      score += parseInt(container.querySelector('#pas_oc').value) || 0;
      score += parseInt(container.querySelector('#pas_gcs').value) || 0;

      let interp = '', cls = 'ok';
      if (score >= 4) { interp = "CITO Konsul Bedah Saraf (Dekompresi)"; cls = 'bad'; }
      else if (score >= 2) { interp = "Observasi Ketat / HCU"; cls = 'warn'; }
      else { interp = "Manajemen Konservatif"; cls = 'ok'; }

      const cppt = `[CPPT - InternaHub EMD]
Modul: Pituitary Apoplexy Score (PAS)
- Total Skor PAS: ${score} / 8
- Keputusan Triase: ${interp}
- Rekomendasi/Plan: ${score >= 4 ? 'KONSUL BEDAH SARAF CITO untuk indikasi dekompresi transsfenoid darurat.' : 'Rawat HCU/ICU, Deksametason 4-8 mg IV q6h atau Hidrokortison, evaluasi fungsi endokrin lengkap & MRI sella serial.'}`;

      emit({
        value: `Skor ${score} / 8`,
        text: `Triase: <b>${interp}</b>. (≥4: Cito Bedah Saraf; <4: Konservatif).`,
        cls,
        cppt
      });
    };

    container.querySelectorAll('select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 7. EFFECTIVE SERUM OSMOLARITY */
reg({ id:'osmo', nama:'Effective Serum Osmolarity (Tonisitas HHS vs DKA)', divisi:'Endokrin-Metabolik', tags:'osmolaritas osmo hhs dka hiperglikemia tonisitas', batch:'M2',
  fields:[
    {id:'na', label:'Natrium Serum Terukur (mEq/L)', type:'number', ctx:'na', def:140},
    {id:'glu', label:'Glukosa Darah Sewaktu (mg/dL)', type:'number', ctx:'glu', def:600}],
  compute: v => {
    if (!has(v.na, v.glu) || v.na <= 0 || v.glu <= 0) return null;
    const osmo = (2 * v.na) + (v.glu / 18);
    const hi = osmo >= 320;
    const cppt = `[CPPT - InternaHub EMD]
Modul: Effective Serum Osmolarity (Tonisitas)
- Parameter: Na terukur = ${v.na} mEq/L, Glukosa = ${v.glu} mg/dL
- Osmolaritas Efektif (2xNa + Glu/18): ${osmo.toFixed(1)} mOsm/kg
- Kesimpulan: ${hi ? 'Hiperosmolaritas Berat (Korelasi kuat dengan penurunan kesadaran/HHS)' : 'Osmolaritas dalam batas terkontrol'}
- Rekomendasi/Plan: Resusitasi cairan kristaloid isotonik NaCl 0.9% mendahului inisiasi insulin pada HHS.`;

    return {
      value: `${osmo.toFixed(1)} mOsm/kg`,
      text: hi ? `<b>Hiperosmolaritas Berat (≥ 320 mOsm/kg)</b> — korelasi kuat dengan penurunan kesadaran pada HHS.` : `Osmolaritas terkontrol (< 320 mOsm/kg). Rumus: 2×Na + Glukosa/18.`,
      cls: hi ? 'bad' : 'ok',
      cppt
    };
  }
});

/* 8. ANION GAP, CORRECTED NA, DELTA GAP & RATIO */
reg({ id:'ag-delta', nama:'Anion Gap & Delta Ratio (EMD Protocol)', divisi:'Endokrin-Metabolik', tags:'anion gap corrected na delta gap ratio cna katz dka hagma nagma', batch:'M2',
  fields:[
    {id:'na', label:'Na Terukur (mEq/L)', type:'number', ctx:'na', def:130},
    {id:'cl', label:'Cl (mEq/L)', type:'number', ctx:'cl', def:95},
    {id:'hco3', label:'HCO3 (mEq/L)', type:'number', ctx:'hco3', def:10},
    {id:'glu', label:'Glukosa (mg/dL)', type:'number', ctx:'glu', def:450}],
  compute: v => {
    if (!has(v.na, v.cl, v.hco3, v.glu)) return null;
    const ag = v.na - (v.cl + v.hco3);
    const cNa = v.glu > 100 ? v.na + 1.6 * ((v.glu - 100) / 100) : v.na;
    const deltaAG = ag - 12;
    const deltaHCO3 = 24 - v.hco3;
    let deltaRatio = null, deltaInterp = '';

    if (deltaHCO3 > 0) {
      deltaRatio = deltaAG / deltaHCO3;
      if (deltaRatio < 0.8) {
        deltaInterp = 'Delta Ratio < 0.8: Mixed HAGMA + NAGMA (Hiperkloremik). Sering pasca resusitasi NaCl 0.9% masif.';
      } else if (deltaRatio <= 2.0) {
        deltaInterp = 'Delta Ratio 0.8 - 2.0: Pure High Anion Gap Acidosis (HAGMA murni). Tipikal untuk DKA murni.';
      } else {
        deltaInterp = 'Delta Ratio > 2.0: Mixed HAGMA + Alkalosis Metabolik (akibat muntah hebat) / retensi HCO3.';
      }
    } else {
      deltaInterp = 'HCO3 ≥ 24 mEq/L (tidak ada penurunan bikarbonat).';
    }

    const cppt = `[CPPT - InternaHub EMD]
Modul: Anion Gap & Delta Ratio
- Parameter: Na ${v.na}, Cl ${v.cl}, HCO3 ${v.hco3}, Glu ${v.glu} mg/dL
- Hasil: Anion Gap = ${ag.toFixed(1)} mEq/L, Corrected Na = ${cNa.toFixed(1)} mEq/L
- Delta Ratio (ΔAG/ΔHCO3): ${deltaRatio !== null ? deltaRatio.toFixed(2) : '-'}
- Interpretasi Asam-Basa: ${deltaInterp}
- Rekomendasi/Plan: Identifikasi etiologi HAGMA (DKA, Laktat, Uremia, Toksin). Sesuaikan cairan dengan corrected Na (0.45% NaCl jika cNa normal/tinggi).`;

    return {
      value: `AG: ${ag.toFixed(1)} | Corrected Na: ${cNa.toFixed(1)}`,
      text: deltaInterp + (deltaRatio !== null ? ` (Ratio: <b>${deltaRatio.toFixed(2)}</b>, ΔAG: ${deltaAG.toFixed(1)}, ΔHCO3: ${deltaHCO3.toFixed(1)})` : ''),
      cls: ag > 12 ? 'warn' : 'ok',
      cppt
    };
  }
});

/* 9. DKA SEVERITY & RESOLUTION TRACKER */
reg({ id:'dka-tracker', nama:'DKA Severity & ADA Resolution Tracker', divisi:'Endokrin-Metabolik', tags:'dka tracker ketoasidosis kda resolusi ada bikarbonat ph kalium', batch:'M2',
  mount: (container, c, emit) => {
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;">
        <div>
          <label>pH Darah ${c.ph ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="dka_ph" step="0.01" value="${c.ph || 7.15}">
        </div>
        <div>
          <label>Serum HCO3 (mEq/L) ${c.hco3 ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="dka_hco3" value="${c.hco3 || 12}">
        </div>
        <div>
          <label>GDS (mg/dL) ${c.glu ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="dka_glu" value="${c.glu || 350}">
        </div>
        <div>
          <label>Anion Gap (mEq/L)</label>
          <input type="number" id="dka_ag" value="18">
        </div>
        <div>
          <label>Kalium Serum ${c.k ? '<small style="color:var(--ok)">(auto)</small>' : ''}</label>
          <input type="number" id="dka_k" step="0.1" value="${c.k || 4.2}">
        </div>
        <div>
          <label>Status Mental</label>
          <select id="dka_mental">
            <option value="alert" selected>Sadar Penuh / Alert</option>
            <option value="drowsy">Mengantuk / Drowsy</option>
            <option value="stupor">Stupor / Koma</option>
          </select>
        </div>
      </div>
      <div id="dka_k_alert" style="display:none;margin-top:10px;padding:10px 14px;background:rgba(239,68,68,0.18);border:1px solid var(--bad);border-radius:10px;font-size:12.5px;font-weight:700;color:var(--bad);">
        ⚠️ ALERT KRITIS: Kadar Kalium &lt; 3.5 mEq/L! TUNDA INSULIN SEGERA dan berikan infus KCl 20-30 mEq/jam hingga K &gt; 3.5 mEq/L untuk mencegah aritmia fatal dan henti jantung!
      </div>
      <div style="font-weight:700;font-size:12.5px;color:var(--ac);margin:14px 0 6px;">CHECKLIST KRITERIA RESOLUSI ADA (TRANSISI KE SUBKUTAN):</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:6px;" id="dka_crit_boxes">
        <div id="crit_glu_box" style="padding:8px 10px;border-radius:8px;border:1px solid var(--bd);background:rgba(0,0,0,0.2);font-size:12px;">1. GDS &lt; 200 mg/dL</div>
        <div id="crit_hco3_box" style="padding:8px 10px;border-radius:8px;border:1px solid var(--bd);background:rgba(0,0,0,0.2);font-size:12px;">2. Serum HCO3 ≥ 18 mEq/L</div>
        <div id="crit_ph_box" style="padding:8px 10px;border-radius:8px;border:1px solid var(--bd);background:rgba(0,0,0,0.2);font-size:12px;">3. pH Vena &gt; 7.30</div>
        <div id="crit_ag_box" style="padding:8px 10px;border-radius:8px;border:1px solid var(--bd);background:rgba(0,0,0,0.2);font-size:12px;">4. Anion Gap ≤ 12 mEq/L</div>
      </div>
    `;

    const calc = () => {
      const ph = parseFloat(container.querySelector('#dka_ph').value) || 0;
      const hco3 = parseFloat(container.querySelector('#dka_hco3').value) || 0;
      const glu = parseFloat(container.querySelector('#dka_glu').value) || 0;
      const ag = parseFloat(container.querySelector('#dka_ag').value) || 0;
      const k = parseFloat(container.querySelector('#dka_k').value) || 4.0;
      const mental = container.querySelector('#dka_mental').value;

      // Kalium Guardrail
      const kAlert = container.querySelector('#dka_k_alert');
      kAlert.style.display = k < 3.5 ? 'block' : 'none';

      // Severity
      let sev = 'Non-Acidotic', cls = 'ok';
      if (ph < 7.00 || hco3 < 10 || mental === 'stupor') { sev = "DKA Berat (Severe)"; cls = 'bad'; }
      else if (ph < 7.25 || hco3 < 15 || mental === 'drowsy') { sev = "DKA Sedang (Moderate)"; cls = 'warn'; }
      else if (ph <= 7.30 || hco3 <= 18) { sev = "DKA Ringan (Mild)"; cls = 'ok'; }

      // Resolution
      const cGlu = glu > 0 && glu < 200;
      const cHco3 = hco3 >= 18;
      const cPh = ph > 7.30;
      const cAg = ag > 0 && ag <= 12;

      const styleBox = (id, pass) => {
        const el = container.querySelector('#' + id);
        el.style.background = pass ? 'rgba(52,211,153,0.18)' : 'rgba(0,0,0,0.2)';
        el.style.borderColor = pass ? 'var(--ok)' : 'var(--bd)';
        el.style.color = pass ? 'var(--ok)' : 'var(--mut)';
      };
      styleBox('crit_glu_box', cGlu);
      styleBox('crit_hco3_box', cHco3);
      styleBox('crit_ph_box', cPh);
      styleBox('crit_ag_box', cAg);

      let resolvedCount = (cHco3 ? 1 : 0) + (cPh ? 1 : 0) + (cAg ? 1 : 0);
      const isResolved = cGlu && resolvedCount >= 2;
      const resStatus = isResolved ? "Resolusi Tercapai (Siap Bridging SC)" : "Belum Resolusi (Lanjut Drip IV)";

      const cppt = `[CPPT - InternaHub EMD]
Modul: DKA Severity & Resolution Tracker (ADA/ISPAD)
- Parameter: pH ${ph}, HCO3 ${hco3} mEq/L, GDS ${glu} mg/dL, K+ ${k} mEq/L
- Derajat Keparahan: ${sev}
- Status Resolusi DKA: ${resStatus}
${k < 3.5 ? '⚠️ ALERT: K+ < 3.5 mEq/L! Tunda insulin, lakukan koreksi KCl terlebih dahulu.' : ''}
- Rekomendasi/Plan: Tambahkan D5%/D10% saat GDS < 200 mg/dL. Bila kriteria resolusi terpenuhi (HCO3 >= 18, pH > 7.30, AG normal) dan intake oral baik, rencanakan bridging ke insulin subkutan.`;

      emit({
        value: sev,
        text: `Status Resolusi: <b>${resStatus}</b>. ${k < 3.5 ? '<span style="color:var(--bad)">⚠️ TUNDA INSULIN (K < 3.5)</span>' : ''}`,
        cls: isResolved ? 'ok' : cls,
        cppt
      });
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', calc));
    calc();
  }
});

/* 10. KOREKSI HIPOGLIKEMIA BERAT (PERKENI & RUMUS 30) */
reg({ id:'hypoglycemia', nama:'Koreksi Hipoglikemia Berat (PERKENI & Rumus 30)', divisi:'Endokrin-Metabolik', tags:'hipoglikemia d40 dekstrosa perkeni rumus 30 bolus', batch:'M2',
  fields:[
    {id:'gds', label:'GDS Aktual (mg/dL)', type:'number', ctx:'glu', def:45},
    {id:'target', label:'Target GDS (mg/dL)', type:'number', def:100},
    {id:'conscious', label:'Tingkat Kesadaran Pasien', type:'select', options:[['Sadar Penuh', 'conscious'], ['Penurunan Kesadaran / Koma', 'unconscious']], def:'unconscious'}],
  compute: v => {
    if (!has(v.gds)) return null;
    const gds = v.gds;
    const target = v.target || 100;

    let perkeniFlakon = 0, perkeniText = '';
    if (gds < 50) { perkeniFlakon = 2; perkeniText = "Bolus D40% 50 cc (2 flakon) IV stat"; }
    else if (gds < 70) { perkeniFlakon = 1; perkeniText = "Bolus D40% 25 cc (1 flakon) IV stat"; }
    else { perkeniFlakon = 0; perkeniText = "Tidak perlu bolus D40% (GDS ≥ 70 mg/dL)"; }

    const delta = Math.max(0, target - gds);
    const r30Flakon = (delta / 30);
    const gramDextrose = r30Flakon * 10;

    const cppt = `[CPPT - InternaHub EMD]
Modul: Koreksi Hipoglikemia Berat (PERKENI & Rumus 30)
- GDS Aktual: ${gds} mg/dL | Target: ${target} mg/dL
- Dosis Bolus PERKENI: ${perkeniText}
- Hitungan Rumus 30 Presisi: ${r30Flakon.toFixed(1)} Flakon (~ ${gramDextrose.toFixed(0)} gram Dekstrosa murni)
- Maintenance: IVFD Dextrose 10% / D5% 20 tpm
- Evaluasi: Cek ulang GDS dalam 15 - 30 menit pasca bolus.`;

    return {
      value: `${perkeniFlakon > 0 ? perkeniFlakon + ' Flakon D40% IV (' + (perkeniFlakon * 25) + ' cc)' : 'GDS ≥ 70 mg/dL'}`,
      text: `<b>PERKENI:</b> ${perkeniText}.<br><b>Rumus 30 Presisi:</b> ${(delta/30).toFixed(1)} flakon D40% (~ ${gramDextrose.toFixed(0)} g Dekstrosa murni). Pasang D10% rumatan, evaluasi GDS serial 15-30 menit.`,
      cls: gds < 50 ? 'bad' : gds < 70 ? 'warn' : 'ok',
      cppt
    };
  }
});

/* 11. INSULIN BASAL-BOLUS TOTAL DAILY DOSE (TDD) */
reg({ id:'insulin-tdd', nama:'Insulin Basal-Bolus Total Daily Dose (TDD)', divisi:'Endokrin-Metabolik', tags:'tdd insulin basal bolus dosis harian glargine aspart', batch:'M2',
  fields:[
    {id:'wt', label:'Berat Badan Pasien (kg)', type:'number', ctx:'bb', def:60},
    {id:'factor', label:'Faktor Total Daily Dose (U/kg/hari)', type:'select', options:[
      ['0.3 U/kg (Inisiasi awal / Lansia / CKD lanjut)', '0.3'],
      ['0.5 U/kg (Standar Fisiologis Dewasa)', '0.5'],
      ['0.7 U/kg (Resistensi Insulin / Infeksi Akut)', '0.7'],
      ['1.0 U/kg (Resistensi Berat / Obesitas Morbid)', '1.0']
    ], def:'0.5'}],
  compute: v => {
    if (!has(v.wt) || v.wt <= 0) return null;
    const factor = parseFloat(v.factor) || 0.5;
    const tdd = v.wt * factor;
    const basal = tdd * 0.5;
    const bolus = (tdd * 0.5) / 3;

    const cppt = `[CPPT - InternaHub EMD]
Modul: Insulin Basal-Bolus Total Daily Dose (TDD)
- Parameter: BB = ${v.wt} kg, Faktor = ${factor} U/kg
- Total Daily Dose (TDD): ${Math.round(tdd)} Unit/hari
- Pembagian Fisiologis:
  * Basal (50%): ${Math.round(basal)} U Qd (malam)
  * Bolus Prandial (50% / 3): ${Math.round(bolus)} U TID (sebelum makan)
- Rekomendasi/Plan: Evaluasi glukosa puasa untuk titrasi basal, dan glukosa pre-meal untuk titrasi bolus. Tunda bolus nutrisional bila pasien dipuasakan (NPO).`;

    return {
      value: `${Math.round(tdd)} Unit / hari (TDD)`,
      text: `<b>Basal (50%):</b> ${Math.round(basal)} U 1x/hari SC malam | <b>Prandial (50% / 3):</b> ${Math.round(bolus)} U 3x/hari SC tiap sebelum makan.`,
      cls: 'ok',
      cppt
    };
  }
});

/* 12. TRIGLYCERIDE-GLUCOSE (TyG) INDEX */
reg({ id:'tyg', nama:'Triglyceride-Glucose (TyG) Index', divisi:'Endokrin-Metabolik', tags:'tyg triglyceride glucose resistensi insulin masld nafld kardiometabolik', batch:'M2',
  fields:[
    {id:'tg', label:'Trigliserida Puasa (mg/dL)', type:'number', def:150},
    {id:'glu', label:'Glukosa Darah Puasa (mg/dL)', type:'number', ctx:'glu', def:110}],
  compute: v => {
    if (!has(v.tg, v.glu) || v.tg <= 0 || v.glu <= 0) return null;
    const tyg = Math.log(v.tg * v.glu) / 2;
    const isIR = tyg > 4.49;

    const cppt = `[CPPT - InternaHub EMD]
Modul: Triglyceride-Glucose (TyG) Index
- Parameter: TG Puasa = ${v.tg} mg/dL, Glukosa Puasa = ${v.glu} mg/dL
- Nilai TyG Index: ${tyg.toFixed(2)} (Cutoff: > 4.49 mengindikasikan resistensi insulin)
- Rekomendasi/Plan: Edukasi modifikasi gaya hidup (diet rendah karbohidrat olahan, aktivitas aerobik rutin) & evaluasi risiko perlemakan hati metabolik (MASLD).`;

    return {
      value: `${tyg.toFixed(2)}`,
      text: isIR ? `<b>TyG Index &gt; 4.49:</b> Mengindikasikan resistensi insulin bermakna & peningkatan risiko MASLD.` : `TyG Index ≤ 4.49 (Dalam batas normal).`,
      cls: isIR ? 'warn' : 'ok',
      cppt
    };
  }
});

/* 13. HOMA-IR ASSESSMENT */
reg({ id:'homa-ir', nama:'HOMA-IR Assessment (Resistensi Insulin)', divisi:'Endokrin-Metabolik', tags:'homa homa-ir insulin puasa resistensi matthews pcos prediabetes', batch:'M2',
  fields:[
    {id:'ins', label:'Insulin Puasa (µU/mL)', type:'number', def:12},
    {id:'glu', label:'Glukosa Darah Puasa (mg/dL)', type:'number', ctx:'glu', def:105}],
  compute: v => {
    if (!has(v.ins, v.glu) || v.ins <= 0 || v.glu <= 0) return null;
    const homa = (v.ins * v.glu) / 405;
    const isHigh = homa > 2.5;
    const isEarly = homa > 2.0;

    const cppt = `[CPPT - InternaHub EMD]
Modul: HOMA-IR (Homeostatic Model Assessment of Insulin Resistance)
- Parameter: Insulin Puasa = ${v.ins} µU/mL, Glukosa Puasa = ${v.glu} mg/dL
- Nilai HOMA-IR: ${homa.toFixed(2)} (Cutoff: > 2.0 resistensi insulin awal, > 2.5 signifikan)
- Rekomendasi/Plan: Evaluasi sindrom metabolik / PCOS, pertimbangkan terapi insulin sensitizer sesuai indikasi klinis.`;

    return {
      value: `${homa.toFixed(2)}`,
      text: isHigh ? `<b>HOMA-IR &gt; 2.5:</b> Resistensi insulin signifikan.` : (isEarly ? `<b>HOMA-IR 2.0 - 2.5:</b> Resistensi insulin awal.` : `HOMA-IR normal (&lt; 2.0). Formula Matthews: (Insulin × Glukosa) / 405.`),
      cls: isHigh ? 'bad' : isEarly ? 'warn' : 'ok',
      cppt
    };
  }
});

/* 14. FRIEDEWALD ESTIMATED LDL-C */
reg({ id:'friedewald', nama:'Friedewald Estimated LDL Cholesterol', divisi:'Endokrin-Metabolik', tags:'friedewald ldl kolesterol profil lipid trigliserida non-hdl', batch:'M2',
  fields:[
    {id:'tc', label:'Kolesterol Total (mg/dL)', type:'number', def:210},
    {id:'hdl', label:'HDL Kolesterol (mg/dL)', type:'number', def:45},
    {id:'tg', label:'Trigliserida (mg/dL)', type:'number', def:180}],
  compute: v => {
    if (!has(v.tc, v.hdl, v.tg) || v.tc <= 0 || v.hdl <= 0 || v.tg <= 0) return null;
    if (v.tg > 400) {
      return {
        value: 'N/A (TG > 400 mg/dL)',
        text: 'Rumus Friedewald TIDAK VALID bila kadar Trigliserida &gt; 400 mg/dL. Wajib menggunakan pemeriksaan <b>Direct LDL-C</b>.',
        cls: 'bad',
        cppt: `[CPPT - InternaHub EMD]\nModul: Friedewald Estimated LDL-C\nParameter: TC ${v.tc}, HDL ${v.hdl}, TG ${v.tg} mg/dL\nHasil: N/A (Trigliserida > 400 mg/dL, rumus tidak valid, lakukan Direct LDL).`
      };
    }
    const ldl = v.tc - v.hdl - (v.tg / 5);
    const nonHdl = v.tc - v.hdl;
    if (ldl < 0) {
      return {
        value: '< 0 mg/dL',
        text: 'Hasil perhitungan negatif. Rumus Friedewald tidak valid untuk sampel ini.',
        cls: 'warn'
      };
    }
    const cppt = `[CPPT - InternaHub EMD]
Modul: Friedewald Estimated LDL Cholesterol
- Parameter: TC = ${v.tc} mg/dL, HDL = ${v.hdl} mg/dL, TG = ${v.tg} mg/dL
- Estimasi LDL-C: ${ldl.toFixed(1)} mg/dL (Formula: TC - HDL - TG/5)
- Non-HDL Cholesterol: ${nonHdl.toFixed(1)} mg/dL
- Catatan: Valid jika TG <= 400 mg/dL.`;

    return {
      value: `${ldl.toFixed(1)} mg/dL`,
      text: `Formula: TC - HDL - TG/5. Non-HDL Kolesterol: <b>${nonHdl.toFixed(1)} mg/dL</b>.`,
      cls: ldl >= 160 ? 'bad' : ldl >= 100 ? 'warn' : 'ok',
      cppt
    };
  }
});

/* 15. ATHEROGENIC INDEX OF PLASMA (AIP) */
reg({ id:'aip', nama:'Atherogenic Index of Plasma (AIP)', divisi:'Endokrin-Metabolik', tags:'aip atherogenic index sdldl trigliserida hdl kardiometabolik', batch:'M2',
  fields:[
    {id:'tg', label:'Trigliserida (mg/dL)', type:'number', def:180},
    {id:'hdl', label:'HDL Kolesterol (mg/dL)', type:'number', def:40}],
  compute: v => {
    if (!has(v.tg, v.hdl) || v.tg <= 0 || v.hdl <= 0) return null;
    const tg_mmol = v.tg / 88.57;
    const hdl_mmol = v.hdl / 38.67;
    const aip = Math.log10(tg_mmol / hdl_mmol);

    let interp = '', cls = 'ok';
    if (aip > 0.21) { interp = "Risiko Tinggi (Partikel small dense LDL dominan)"; cls = 'bad'; }
    else if (aip >= 0.11) { interp = "Risiko Sedang"; cls = 'warn'; }
    else { interp = "Risiko Rendah"; cls = 'ok'; }

    const cppt = `[CPPT - InternaHub EMD]
Modul: Atherogenic Index of Plasma (AIP)
- Parameter: TG = ${v.tg} mg/dL, HDL = ${v.hdl} mg/dL
- Nilai AIP [log(TG/HDL)]: ${aip.toFixed(3)}
- Stratifikasi Risiko: ${interp} (<0.11 Rendah, 0.11-0.21 Sedang, >0.21 Tinggi / Partikel sdLDL dominan)
- Rekomendasi/Plan: Terapi gaya hidup intensif, optimalisasi target lipid atherogenik.`;

    return {
      value: `${aip.toFixed(3)}`,
      text: `Stratifikasi: <b>${interp}</b>. (Cutoff: &lt;0.11 Rendah; 0.11–0.21 Sedang; &gt;0.21 Tinggi).`,
      cls,
      cppt
    };
  }
});

/* 16. ASCVD 10-YEAR RISK ESTIMATOR & TARGET LDL */
reg({ id:'ascvd', nama:'ASCVD 10-Year Risk & Target LDL (AHA/ACC)', divisi:'Endokrin-Metabolik', tags:'ascvd aha acc statin target ldl risiko 10 tahun kolesterol', batch:'M2',
  fields:[
    {id:'gender', label:'Jenis Kelamin', type:'select', options:SEX_OPT, def:'male'},
    {id:'age', label:'Usia Pasien (tahun)', type:'number', ctx:'age', def:55},
    {id:'sbp', label:'Tekanan Darah Sistolik (mmHg)', type:'number', ctx:'sbp', def:135},
    {id:'htn', label:'Sedang dalam Terapi Antihipertensi?', type:'select', options:[['Tidak', 'no'], ['Ya', 'yes']], def:'no'},
    {id:'tc', label:'Kolesterol Total (mg/dL)', type:'number', def:210},
    {id:'hdl', label:'HDL Kolesterol (mg/dL)', type:'number', def:42},
    {id:'dm', label:'Riwayat Diabetes Melitus?', type:'select', options:[['Tidak', 'no'], ['Ya', 'yes']], def:'no'},
    {id:'smoke', label:'Perokok Aktif?', type:'select', options:[['Tidak', 'no'], ['Ya', 'yes']], def:'no'}],
  compute: v => {
    if (!has(v.age, v.sbp, v.tc, v.hdl)) return null;
    let estRisk = 0;
    const isMale = v.gender === 'male';
    const isHtn = v.htn === 'yes';
    const isDm = v.dm === 'yes';
    const isSmoke = v.smoke === 'yes';

    if (isMale) {
      estRisk = (v.age * 0.4) + (v.tc * 0.05) - (v.hdl * 0.08) + (v.sbp * (isHtn ? 0.08 : 0.04)) + (isDm ? 8.0 : 0) + (isSmoke ? 7.5 : 0) - 22;
    } else {
      estRisk = (v.age * 0.35) + (v.tc * 0.04) - (v.hdl * 0.07) + (v.sbp * (isHtn ? 0.07 : 0.035)) + (isDm ? 7.0 : 0) + (isSmoke ? 6.5 : 0) - 20;
    }
    estRisk = Math.max(1.0, Math.min(65.0, estRisk));

    let targetLdl = '', cls = 'ok';
    if (estRisk >= 20.0 || isDm) {
      targetLdl = '< 55 - 70 mg/dL (Statin Intensitas Tinggi)';
      cls = 'bad';
    } else if (estRisk >= 7.5) {
      targetLdl = '< 70 - 100 mg/dL (Statin Intensitas Sedang/Tinggi)';
      cls = 'warn';
    } else {
      targetLdl = '< 100 - 115 mg/dL (Gaya Hidup / Statin Intensitas Sedang)';
      cls = 'ok';
    }

    const cppt = `[CPPT - InternaHub EMD]
Modul: ASCVD 10-Year Risk & Target LDL
- Parameter: Usia ${v.age} th, SBP ${v.sbp} mmHg, TC ${v.tc} mg/dL, HDL ${v.hdl} mg/dL, DM: ${v.dm}, Smoke: ${v.smoke}
- Estimasi Risiko Kardiovaskular 10 Tahun: ${estRisk.toFixed(1)} %
- Target LDL: ${targetLdl}
- Rekomendasi/Plan: Terapi statin intensitas sesuai stratifikasi risiko (High-intensity statin reduksi >= 50% bila risiko tinggi).`;

    return {
      value: `${estRisk.toFixed(1)} %`,
      text: `Target LDL: <b>${targetLdl}</b>. (≥20% atau DM: Risiko Tinggi; 7.5-19.9%: Risiko Sedang; <7.5%: Risiko Rendah).`,
      cls,
      cppt
    };
  }
});

/* 17. KONVERSI HBA1C KE ESTIMATED AVERAGE GLUCOSE (eAG) */
reg({ id:'hba1c-eag', nama:'Konversi HbA1c ke eAG (ADAG Formula)', divisi:'Endokrin-Metabolik', tags:'hba1c eag estimated average glucose edukasi diabetes gula darah rata-rata', batch:'M2',
  fields:[{id:'hba1c', label:'Kadar HbA1c Pasien (%)', type:'number', step:'0.1', def:8.0}],
  compute: v => {
    if (!has(v.hba1c) || v.hba1c <= 3.0) return null;
    const eagMg = 28.7 * v.hba1c - 46.7;
    const eagMmol = 1.59 * v.hba1c - 2.59;

    const cppt = `[CPPT - InternaHub EMD]
Modul: Konversi HbA1c ke Estimated Average Glucose (eAG)
- HbA1c Pasien: ${v.hba1c} %
- Estimasi Rerata Gula Darah Harian: ${Math.round(eagMg)} mg/dL (${eagMmol.toFixed(1)} mmol/L)
- Formula ADAG: eAG = 28.7 x HbA1c - 46.7
- Edukasi Pasien: Telah dijelaskan korelasi HbA1c dengan rerata glukosa harian pasien.`;

    return {
      value: `${Math.round(eagMg)} mg/dL (${eagMmol.toFixed(1)} mmol/L)`,
      text: `Formula ADAG: 28,7 × HbA1c - 46,7. Nilai ini menggambarkan rerata glukosa darah harian selama 2-3 bulan terakhir.`,
      cls: v.hba1c >= 8.0 ? 'bad' : v.hba1c >= 7.0 ? 'warn' : 'ok',
      cppt
    };
  }
});