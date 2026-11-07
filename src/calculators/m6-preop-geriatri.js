/* ==========================================================================
   MODULE 6: PREOPERATIF & GERIATRI SUITE (m6-preop-geriatri.js)
   - ARISCAT Score (Postoperative Pulmonary Complications)
   - Revised Cardiac Risk Index (RCRI / Lee Score)
   - Caprini VTE Risk Score & Antikoagulan Profilaksis
   - IMPROVE Bleeding Risk Score
   - Clinical Frailty Scale (CFS / Rockwood)
   - Morse Fall Scale (Risiko Jatuh)
   - Risiko Delirium Pasca Operasi (Skor Delirium PAPDI & AWOL)
   - Skrining Geriatri Cepat: Mini-Cog, Nutrisi (MNA-SF 2-Q), Depresi (GDS-2)
   - Master Preop Checklist & Generator Resume Konsul (Biasa & Geriatri)
   ========================================================================== */

// 1. ARISCAT Score
reg({
  id: 'ariscat',
  nama: 'ARISCAT Score (Postoperative Pulmonary Complications)',
  divisi: 'Geriatri',
  tags: 'ariscat preoperatif paru komplikasi respirasi bedah konsul',
  batch: 'M6',
  fields: [
    { id: 'age', label: 'Usia Pasien', type: 'select', options: [['≤ 50 tahun (0)', '0'], ['51 – 80 tahun (+3)', '3'], ['> 80 tahun (+16)', '16']], val: '0', ctx: 'age' },
    { id: 'spo2', label: 'SpO2 Preoperatif (Udara Ruangan)', type: 'select', options: [['≥ 96% (0)', '0'], ['91 – 95% (+8)', '8'], ['≤ 90% (+24)', '24']], val: '0', ctx: 'spo2' },
    { id: 'resp_inf', label: 'Infeksi Respirasi Akut dalam 1 Bulan Terakhir (+17)', type: 'check' },
    { id: 'anemia', label: 'Anemia Preoperatif (Hb ≤ 10 g/dL) (+11)', type: 'check', ctxFn: c => c.hb !== undefined ? c.hb <= 10 : undefined },
    { id: 'incision', label: 'Lokasi Insisi Bedah', type: 'select', options: [['Perifer / Ekstremitas / Kepala / Leher (0)', '0'], ['Abdomen Atas (+15)', '15'], ['Intratorakal (+24)', '24']], val: '0' },
    { id: 'duration', label: 'Durasi Operasi Terencana', type: 'select', options: [['≤ 2 jam (0)', '0'], ['> 2 jam hingga 3 jam (+16)', '16'], ['> 3 jam (+23)', '23']], val: '0' },
    { id: 'emergency', label: 'Prosedur Bedah Emergensi / Cito (+8)', type: 'check' }
  ],
  compute: v => {
    let score = Number(v.age || 0) + Number(v.spo2 || 0) + Number(v.incision || 0) + Number(v.duration || 0);
    if (v.resp_inf) score += 17;
    if (v.anemia) score += 11;
    if (v.emergency) score += 8;

    let riskCat = '', ppcRate = '', cls = 'ok';
    if (score < 26) {
      riskCat = 'Low Risk';
      ppcRate = '1.6%';
      cls = 'ok';
    } else if (score <= 44) {
      riskCat = 'Intermediate Risk';
      ppcRate = '13.3%';
      cls = 'warn';
    } else {
      riskCat = 'High Risk';
      ppcRate = '42.1%';
      cls = 'bad';
    }

    const resume = `ARISCAT score ${score} points (${riskCat})\n${ppcRate} risk of in-hospital post-op pulmonary complication`;
    return {
      value: `${score} Poin (${riskCat})`,
      text: `<b>${riskCat} (${score} poin)</b><br>Risiko komplikasi paru pasca-bedah (PPC): <b>${ppcRate}</b>`,
      cls,
      resume
    };
  }
});

// 2. Revised Cardiac Risk Index (RCRI / Lee Score)
reg({
  id: 'rcri',
  nama: 'Revised Cardiac Risk Index (RCRI / Lee Score)',
  divisi: 'Geriatri',
  tags: 'rcri lee cardiac risk mace kardiovaskular preoperatif konsul',
  batch: 'M6',
  fields: [
    { id: 'high_risk_surg', label: 'Operasi Risiko Tinggi (Intraperitoneal, Intratorakal, Suprainguinal vaskular) (+1)', type: 'check' },
    { id: 'ihd', label: 'Riwayat Penyakit Jantung Koroner / IHD (Infark, Angina, Gelombang Q) (+1)', type: 'check' },
    { id: 'chf', label: 'Riwayat Gagal Jantung Kongestif / CHF (+1)', type: 'check' },
    { id: 'cvd', label: 'Riwayat Penyakit Serebrovaskular (Stroke atau TIA) (+1)', type: 'check' },
    { id: 'insulin_dm', label: 'Diabetes Melitus Terapi Insulin Preoperatif (+1)', type: 'check' },
    { id: 'renal_cr', label: 'Insufisiensi Ginjal Preoperatif (Kreatinin Serum > 2.0 mg/dL) (+1)', type: 'check', ctxFn: c => c.cr !== undefined ? c.cr > 2.0 : undefined }
  ],
  compute: v => {
    const score = [v.high_risk_surg, v.ihd, v.chf, v.cvd, v.insulin_dm, v.renal_cr].filter(Boolean).length;
    let cls = 'ok', riskCat = '', maceRate = '';

    if (score === 0) {
      riskCat = 'Class I (Low Risk)';
      maceRate = '3.9%';
      cls = 'ok';
    } else if (score === 1) {
      riskCat = 'Class II (Low-Moderate Risk)';
      maceRate = '6.0% (1.1% death/MI/arrest)';
      cls = 'ok';
    } else if (score === 2) {
      riskCat = 'Class III (Moderate-High Risk)';
      maceRate = '10.1%';
      cls = 'warn';
    } else {
      riskCat = 'Class IV (High Risk)';
      maceRate = '≥ 15.0%';
      cls = 'bad';
    }

    const resume = `Revised Cardiac Risk Index ${score} point (${riskCat})\n${maceRate} 30 day risk of death, MI, or cardiac arrest`;
    return {
      value: `${score} Poin (${riskCat})`,
      text: `<b>${riskCat}</b><br>Estimasi risiko MACE 30 hari: <b>${maceRate}</b>`,
      cls,
      resume
    };
  }
});

// 3. Caprini VTE Risk Score & Antikoagulan Profilaksis
reg({
  id: 'caprini',
  nama: 'Caprini VTE Risk Score (Surgical Thromboprophylaxis)',
  divisi: 'Geriatri',
  tags: 'caprini vte dvt pe trombosis emboli profilaksis enoxaparin heparin bedah',
  batch: 'M6',
  fields: [
    { id: 'age_group', label: 'Kelompok Usia', type: 'select', options: [['< 41 tahun (0)', '0'], ['41 – 60 tahun (+1)', '1'], ['61 – 74 tahun (+2)', '2'], ['≥ 75 tahun (+3)', '3']], val: '1', ctx: 'age' },
    { id: 'surg_type', label: 'Tipe Bedah / Durasi', type: 'select', options: [['Bedah Minor / Rawat Jalan (0)', '0'], ['Bedah Mayor terencana (>45 menit) (+1)', '1'], ['Laparoskopi > 45 menit (+2)', '2'], ['Artroplasti Panggul / Lutut elektif (+5)', '5']], val: '1' },
    { id: 'mobility', label: 'Mobilitas / Imobilisasi', type: 'select', options: [['Mobilisasi Normal (0)', '0'], ['Tirah Baring > 72 jam (+2)', '2'], ['Imobilisasi gips / splint (+2)', '2']], val: '0' },
    
    // 1 poin
    { id: 'bmi25', label: 'BMI > 25 kg/m² (+1)', type: 'check', ctxFn: c => c.bmi !== undefined ? c.bmi > 25 : undefined },
    { id: 'swollen_legs', label: 'Edema tungkai bawah saat ini (+1)', type: 'check' },
    { id: 'varicose', label: 'Vena varikosa (+1)', type: 'check' },
    { id: 'sepsis1m', label: 'Sepsis dalam 1 bulan terakhir (+1)', type: 'check' },
    { id: 'copd', label: 'PPOK berat (+1)', type: 'check' },

    // 2 poin
    { id: 'cancer', label: 'Keganasan aktif / riwayat keganasan (+2)', type: 'check' },
    { id: 'cvc', label: 'Kateter vena sentral / CVC line (+2)', type: 'check' },

    // 3 poin
    { id: 'prior_vte', label: 'Riwayat DVT / Emboli Paru sebelumnya (+3)', type: 'check' },
    { id: 'thrombophilia', label: 'Trombofilia kongenital / didapat (+3)', type: 'check' },

    // 5 poin
    { id: 'stroke1m', label: 'Stroke / Stroke iskemik < 1 bulan (+5)', type: 'check' },
    { id: 'polytrauma', label: 'Politrauma multipel / Fraktur panggul < 1 bulan (+5)', type: 'check' }
  ],
  compute: v => {
    let score = Number(v.age_group || 0) + Number(v.surg_type || 0) + Number(v.mobility || 0);
    if (v.bmi25) score += 1;
    if (v.swollen_legs) score += 1;
    if (v.varicose) score += 1;
    if (v.sepsis1m) score += 1;
    if (v.copd) score += 1;
    if (v.cancer) score += 2;
    if (v.cvc) score += 2;
    if (v.prior_vte) score += 3;
    if (v.thrombophilia) score += 3;
    if (v.stroke1m) score += 5;
    if (v.polytrauma) score += 5;

    let cat = '', vteRisk = '', saran = '', cls = 'ok';
    if (score === 0) {
      cat = 'Very Low Risk';
      vteRisk = '< 0.5%';
      saran = 'Mobilisasi dini agresif.';
      cls = 'ok';
    } else if (score <= 2) {
      cat = 'Low Risk';
      vteRisk = '1.5%';
      saran = 'Profilaksis mekanik (IPC / stocking kompresi elastis).';
      cls = 'ok';
    } else if (score <= 4) {
      cat = 'Moderate Risk';
      vteRisk = '3.0%';
      saran = 'Profilaksis mekanik ATAU farmakologis (LMWH Enoxaparin 20–40 mg SC q24h).';
      cls = 'warn';
    } else if (score <= 8) {
      cat = 'High Risk';
      vteRisk = '4.0% – 6.0%';
      saran = 'Pemberian enoxaparin 0.4 cc (40 mg) tiap 24 jam SC hingga 24 jam sebelum operasi dan dimulai kembali 12 jam post operasi + profilaksis mekanik.';
      cls = 'bad';
    } else {
      cat = 'Highest Risk';
      vteRisk = '≥ 10.7%';
      saran = 'Pemberian enoxaparin 0.4 cc tiap 24 jam SC hingga 24 jam sebelum operasi dan dimulai kembali 12 jam post operasi + IPC mekanik. Pertimbangkan durasi diperpanjang hingga 28–35 hari post-op bedah onkologi/ortopedi.';
      cls = 'bad';
    }

    const resume = `Caprini VTE score ${score} points (~ ${cat})\n${vteRisk} VTE risk\nSARAN: ${saran}`;
    return {
      value: `${score} Poin (${cat})`,
      text: `<b>${cat} (${score} poin)</b><br>Estimasi risiko VTE: <b>${vteRisk}</b><br><br><span style="color:var(--pri);">Rekomendasi:</span> ${saran}`,
      cls,
      resume
    };
  }
});

// 4. IMPROVE Bleeding Risk Score
reg({
  id: 'improve-bleed',
  nama: 'IMPROVE Bleeding Risk Score',
  divisi: 'Geriatri',
  tags: 'improve bleeding perdarahan preoperatif antikoagulan risiko konsul',
  batch: 'M6',
  fields: [
    { id: 'ulcer', label: 'Ulkus Gastroduodenal Aktif (+4.5)', type: 'check' },
    { id: 'prior_bleed', label: 'Riwayat Perdarahan dalam 3 Bulan Terakhir (+4.0)', type: 'check' },
    { id: 'plt50', label: 'Trombositopenia < 50.000 /µL (+4.0)', type: 'check', ctxFn: c => c.plt !== undefined ? c.plt < 50 : undefined },
    { id: 'age85', label: 'Usia ≥ 85 tahun (+3.5)', type: 'check', ctxFn: c => c.age !== undefined ? c.age >= 85 : undefined },
    { id: 'liver_fail', label: 'Gagal Hati / Sirosis dengan INR > 1.5 (+2.5)', type: 'check' },
    { id: 'severe_ckd', label: 'Insufisiensi Ginjal Berat (eGFR < 30 mL/min) (+2.5)', type: 'check' },
    { id: 'icu_stay', label: 'Dirawat di ICU / Ruang Intensif (+2.5)', type: 'check' },
    { id: 'cvc', label: 'Terpasang Central Venous Catheter / CVC (+2.0)', type: 'check' },
    { id: 'rheuma', label: 'Penyakit Reumatik Aktif (+2.0)', type: 'check' },
    { id: 'cancer', label: 'Keganasan Aktif (+2.0)', type: 'check' },
    { id: 'age40_84', label: 'Usia 40 – 84 tahun (+1.5)', type: 'check', ctxFn: c => c.age !== undefined ? (c.age >= 40 && c.age < 85) : undefined },
    { id: 'male', label: 'Jenis Kelamin Pria (+1.0)', type: 'check', ctxFn: c => c.sex === 'm' },
    { id: 'mod_ckd', label: 'Insufisiensi Ginjal Sedang (eGFR 30–59 mL/min) (+1.0)', type: 'check' }
  ],
  compute: v => {
    let score = 0;
    if (v.ulcer) score += 4.5;
    if (v.prior_bleed) score += 4.0;
    if (v.plt50) score += 4.0;
    if (v.age85) score += 3.5;
    if (v.liver_fail) score += 2.5;
    if (v.severe_ckd) score += 2.5;
    if (v.icu_stay) score += 2.5;
    if (v.cvc) score += 2.0;
    if (v.rheuma) score += 2.0;
    if (v.cancer) score += 2.0;
    if (v.age40_84 && !v.age85) score += 1.5;
    if (v.male) score += 1.0;
    if (v.mod_ckd && !v.severe_ckd) score += 1.0;

    let cat = '', cls = 'ok';
    if (score < 7.0) {
      cat = 'No increased risk of bleeding (Low Risk)';
      cls = 'ok';
    } else {
      cat = 'Increased risk of bleeding (High Risk ≥ 7.0)';
      cls = 'bad';
    }

    const resume = `Improved bleeding risk score ${score.toFixed(1)} points (${score < 7 ? 'No increased risk of bleeding' : 'Increased risk of bleeding'})`;
    return {
      value: `${score.toFixed(1)} Poin (${score < 7 ? 'Low Bleed Risk' : 'Increased Risk'})`,
      text: `<b>${cat}</b><br>Insiden perdarahan mayor: <b>${score < 7 ? '< 1.5%' : '≥ 7.9%'}</b>`,
      cls,
      resume
    };
  }
});

// 5. Clinical Frailty Scale (CFS / Rockwood)
reg({
  id: 'cfs',
  nama: 'Clinical Frailty Scale (CFS / Rockwood)',
  divisi: 'Geriatri',
  tags: 'cfs clinical frailty scale rockwood kerapuhan geriatri lansia preop',
  batch: 'M6',
  fields: [
    { id: 'cfs_level', label: 'Tingkat Frailty Pasien', type: 'select', options: [
      ['1. Sangat Bugar (Very Fit - berolahraga rutin)', '1'],
      ['2. Bugar / Baik (Fit - aktif tanpa keluhan)', '2'],
      ['3. Mengelola Mandiri (Managing Well - gejala terkontrol)', '3'],
      ['4. Rentan (Living with Very Mild Frailty - lambat/mudah lelah)', '4'],
      ['5. Frail Ringan (Mild Frailty - butuh bantuan IADL belanja/keuangan)', '5'],
      ['6. Frail Sedang (Moderate Frailty - butuh bantuan mandi/berpakaian)', '6'],
      ['7. Frail Berat (Severe Frailty - sangat bergantung penuh pada ADL)', '7'],
      ['8. Frail Sangat Berat (Very Severe - tirah baring total, mendekati akhir hidup)', '8'],
      ['9. Sakit Terminal (Terminally Ill - harapan hidup < 6 bulan)', '9']
    ], val: '3' }
  ],
  compute: v => {
    const lvl = Number(v.cfs_level || 3);
    const labels = [
      '',
      'Very Fit (Sangat Bugar)',
      'Fit / Well (Bugar)',
      'Managing Well (Mengelola Mandiri)',
      'Vulnerable (Rentan)',
      'Mild Frailty (Frail Ringan)',
      'Moderate Frailty (Frail Sedang)',
      'Severe Frailty (Frail Berat)',
      'Very Severe Frailty (Frail Sangat Berat)',
      'Terminally Ill (Sakit Terminal)'
    ];

    let cls = 'ok';
    if (lvl >= 7) cls = 'bad';
    else if (lvl >= 4) cls = 'warn';

    const resume = `Frailty (clinical frailty assessment) ${lvl} points (${labels[lvl]})`;
    return {
      value: `Skor ${lvl}: ${labels[lvl]}`,
      text: `<b>Clinical Frailty Scale ${lvl}/9: ${labels[lvl]}</b><br>${lvl >= 5 ? 'Pasien memiliki cadangan fisiologis rendah, risiko delirium dan disabilitas pasca bedah meningkat signifikan.' : 'Cadangan fisiologis adekuat untuk toleransi stres operatif.'}`,
      cls,
      resume
    };
  }
});

// 6. Morse Fall Scale (Risiko Jatuh)
reg({
  id: 'morse-fall',
  nama: 'Morse Fall Scale (Risiko Jatuh Rawat Inap)',
  divisi: 'Geriatri',
  tags: 'morse fall scale risiko jatuh geriatri keselamatan pasien preop',
  batch: 'M6',
  fields: [
    { id: 'history_fall', label: 'Riwayat jatuh baru saja atau dalam 3 bulan terakhir? (Ya=25, Tidak=0)', type: 'check' },
    { id: 'secondary_diag', label: 'Diagnosis medis sekunder / multipel diagnosis? (Ya=15, Tidak=0)', type: 'check' },
    { id: 'ambulatory_aid', label: 'Bantuan Berjalan / Ambulasi', type: 'select', options: [
      ['Tidak ada / tirah baring / kursi roda / dibantu perawat (0)', '0'],
      ['Tongkat ketiak (crutch) / tongkat (cane) / walker (+15)', '15'],
      ['Berpegangan pada dinding / furnitur / mebel (+30)', '30']
    ], val: '0' },
    { id: 'iv_line', label: 'Terpasang infus intravena / heparin lock? (Ya=20, Tidak=0)', type: 'check' },
    { id: 'gait', label: 'Gaya Berjalan / Berpindah', type: 'select', options: [
      ['Normal / tirah baring total / tidak dapat bergerak (0)', '0'],
      ['Lemah / langkah pendek / diseret (+10)', '10'],
      ['Terganggu / hilang keseimbangan / butuh sokongan penuh (+20)', '20']
    ], val: '0' },
    { id: 'mental_status', label: 'Status Mental', type: 'select', options: [
      ['Mengetahui dan sadar kemampuan diri sendiri (0)', '0'],
      ['Lupa keterbatasan / overestimasi kemampuan (+15)', '15']
    ], val: '0' }
  ],
  compute: v => {
    let score = Number(v.ambulatory_aid || 0) + Number(v.gait || 0) + Number(v.mental_status || 0);
    if (v.history_fall) score += 25;
    if (v.secondary_diag) score += 15;
    if (v.iv_line) score += 20;

    let cat = '', cls = 'ok';
    if (score <= 24) {
      cat = 'Tidak ada risiko jatuh (Tindakan dasar keselamatan)';
      cls = 'ok';
    } else if (score <= 50) {
      cat = 'Risiko rendah (Pencegahan jatuh standar)';
      cls = 'warn';
    } else {
      cat = 'Risiko tinggi jatuh (Pencegahan jatuh intensif / gelang kuning)';
      cls = 'bad';
    }

    const resume = `Risk of Fall (MORSE)\nSkor ${score} = ${cat}`;
    return {
      value: `Skor ${score} (${score >= 51 ? 'Risiko Tinggi' : score >= 25 ? 'Risiko Rendah' : 'Tanpa Risiko'})`,
      text: `<b>Morse Fall Score: ${score} Poin</b><br>Kategori: <b>${cat}</b>`,
      cls,
      resume
    };
  }
});

// 7. Risiko Delirium Pasca Operasi PAPDI & AWOL Score
reg({
  id: 'papdi-delirium',
  nama: 'Risiko Delirium Pasca Operasi PAPDI & AWOL Score',
  divisi: 'Geriatri',
  tags: 'delirium awol papdi geriatri preoperatif kognitif konfusi bedah',
  batch: 'M6',
  fields: [
    // Kriteria Buku PAPDI
    { id: 'age70', label: '1. Usia > 70 tahun (+1)', type: 'check', ctxFn: c => c.age !== undefined ? c.age > 70 : undefined },
    { id: 'alcohol', label: '2. Riwayat ketergantungan alkohol (+1)', type: 'check' },
    { id: 'cog_imp', label: '3. Gangguan fungsi kognitif preoperatif (+1)', type: 'check' },
    { id: 'physical_dep', label: '4. Kelainan jasmani berat (penurunan kemampuan aktivitas sehari-hari/ADL) (+1)', type: 'check' },
    { id: 'lab_abn', label: '5. Abnormalitas hasil lab darah (elektrolit atau glukosa darah) (+1)', type: 'check' },
    { id: 'thoracic_surg', label: '6. Operasi toraks non-kardiak (+1)', type: 'check' },
    { id: 'aaa_surg', label: '7. Operasi aneurisma aorta abdominal (AAA) (+1)', type: 'check' },
    
    // Kriteria AWOL tambahan
    { id: 'world_backward', label: '[AWOL] Kesulitan mengeja kata "WORLD" terbalik / serial 7 (+1)', type: 'check' },
    { id: 'orient_fail', label: '[AWOL] Disorientasi waktu/tempat saat asesmen (+1)', type: 'check' }
  ],
  compute: v => {
    let papdiScore = [v.age70, v.alcohol, v.cog_imp, v.physical_dep, v.lab_abn, v.thoracic_surg, v.aaa_surg].filter(Boolean).length;
    let awolScore = (v.age70 ? 1 : 0) + (v.world_backward ? 1 : 0) + (v.orient_fail ? 1 : 0) + (v.physical_dep ? 1 : 0);

    let papdiRisk = '', cls = 'ok';
    if (papdiScore === 0) {
      papdiRisk = '2% risiko delirium post operasi (Risiko Rendah)';
      cls = 'ok';
    } else if (papdiScore <= 2) {
      papdiRisk = '11% risiko delirium post operasi (Risiko Sedang)';
      cls = 'warn';
    } else {
      papdiRisk = '50% risiko delirium post operasi (Risiko Tinggi)';
      cls = 'bad';
    }

    const resume = `Risiko Delirium Rawat Inap / Post Operasi:\n` +
      `- SKORING BUKU PAPDI: Skor ${papdiScore} (${papdiRisk})\n` +
      `- AWOL SCORE: ${awolScore} poin`;

    return {
      value: `Skor PAPDI ${papdiScore} (${papdiScore >= 3 ? '50% Delirium' : papdiScore >= 1 ? '11% Delirium' : '2% Delirium'})`,
      text: `<b>Skor Delirium PAPDI: ${papdiScore} Poin</b><br>Estimasi: <b>${papdiRisk}</b><br>AWOL Score: <b>${awolScore} / 4</b>`,
      cls,
      resume
    };
  }
});

// 8. Skrining Nutrisi 2 Pertanyaan (MNA-SF) & Mini-Cog Kognitif
reg({
  id: 'mna-sf',
  nama: 'Skrining Geriatri Cepat: Nutrisi, Kognitif & Depresi',
  divisi: 'Geriatri',
  tags: 'mna nutrisi kognitif minicog gds depresi geriatri preop malnutrisi',
  batch: 'M6',
  fields: [
    // Nutrisi
    { id: 'wt_loss', label: 'Nutrisi: Berat badan berkurang > 3 kg dalam 3 bulan terakhir / baju lebih longgar', type: 'check' },
    { id: 'appetite_loss', label: 'Nutrisi: Hilang nafsu makan dalam 1 minggu terakhir', type: 'check' },
    
    // Kognitif Mini-Cog
    { id: 'words_fail', label: 'Kognitif: Gagal mengingat kembali 3 kata (misal: bunga, pintu, nasi)', type: 'check' },
    { id: 'orient_fail', label: 'Kognitif: Disorientasi waktu (tanggal) atau tempat (keberadaan saat ini)', type: 'check' },

    // Depresi GDS-2
    { id: 'depressed_mood', label: 'Depresi: Sering merasa sedih, tertekan, atau putus asa dalam 1 bulan terakhir', type: 'check' },
    { id: 'anhedonia', label: 'Depresi: Penurunan minat atau kesenangan melakukan aktivitas', type: 'check' }
  ],
  compute: v => {
    const nutrisiRisiko = v.wt_loss || v.appetite_loss;
    const kognitifTerganggu = v.words_fail || v.orient_fail;
    const depresiRisiko = v.depressed_mood || v.anhedonia;

    let cls = (!nutrisiRisiko && !kognitifTerganggu && !depresiRisiko) ? 'ok' : 'warn';
    if (nutrisiRisiko && kognitifTerganggu) cls = 'bad';

    const resume = `- Nutrisi: ${nutrisiRisiko ? 'Risiko Malnutrisi (Asupan / BB menurun)' : 'Status Gizi Baik'}\n` +
      `- Kognitif: ${kognitifTerganggu ? 'Kognitif Terganggu' : 'Baik'}\n` +
      `- Depresi: ${depresiRisiko ? 'Skrining Depresi Positif' : 'Tidak ditemukan tanda depresi'}`;

    return {
      value: `${nutrisiRisiko ? 'Nutrisi Risk' : 'Nutrisi OK'} | ${kognitifTerganggu ? 'Kognitif Abn' : 'Kognitif OK'}`,
      text: `• <b>Nutrisi:</b> ${nutrisiRisiko ? '<span style="color:var(--bad);">Risiko Malnutrisi</span>' : '<span style="color:var(--ok);">Baik</span>'}<br>` +
            `• <b>Kognitif:</b> ${kognitifTerganggu ? '<span style="color:var(--bad);">Terganggu</span>' : '<span style="color:var(--ok);">Baik</span>'}<br>` +
            `• <b>Depresi:</b> ${depresiRisiko ? '<span style="color:var(--warn);">Skrining Positif</span>' : '<span style="color:var(--ok);">Negatif</span>'}`,
      cls,
      resume
    };
  }
});

// 9. Master Preoperative Checklist & Consultation Generator
reg({
  id: 'preop-checklist',
  nama: 'Checklist Kesiapan Preoperatif & Generator Konsul IPD',
  divisi: 'Geriatri',
  tags: 'preoperatif konsul template simetriss cppt ariscat rcri caprini morse geriatri',
  batch: 'M6',
  fields: [
    { id: 'tipe_konsul', label: 'Tipe Pasien Konsul', type: 'select', options: [['Preop Pasien Dewasa Umum', 'dewasa'], ['Preop Pasien Geriatri (Usia ≥ 60 th)', 'geriatri']], val: 'geriatri' },
    { id: 'sbp', label: 'Tekanan Darah Sistolik (mmHg)', type: 'number', step: 1, val: 130, ctx: 'sbp' },
    { id: 'dbp', label: 'Tekanan Darah Diastolik (mmHg)', type: 'number', step: 1, val: 80, ctx: 'dbp' },
    { id: 'gds', label: 'Gula Darah Sewaktu (mg/dL)', type: 'number', step: 1, val: 140, ctx: 'glu' },
    { id: 'cr', label: 'Serum Kreatinin (mg/dL)', type: 'number', step: 0.1, val: 1.1, ctx: 'cr' },
    { id: 'hb', label: 'Hemoglobin (g/dL)', type: 'number', step: 0.1, val: 11.5, ctx: 'hb' },
    { id: 'k', label: 'Kalium Serum (mmol/L)', type: 'number', step: 0.1, val: 4.2, ctx: 'k' },
    { id: 'alb', label: 'Albumin Serum (g/dL)', type: 'number', step: 0.1, val: 3.5, ctx: 'alb' }
  ],
  compute: v => {
    const sbpOk = v.sbp < 160 && (v.dbp ? v.dbp < 90 : true);
    const bsOk = v.gds < 200;
    const crOk = v.cr < 7.0;
    const hbOk = v.hb > 10.0;
    const kOk = v.k >= 3.5 && v.k <= 5.3;
    const albOk = !v.alb || v.alb >= 2.5;

    const allOk = sbpOk && bsOk && crOk && hbOk && kOk && albOk;
    const cls = allOk ? 'ok' : 'warn';

    const header = v.tipe_konsul === 'geriatri' ? 'PRE OP GERIATRI' : 'PRE OP BIASA';
    const resume = `============================================================\n` +
      `${header}\n\n` +
      `Saat ini dengan risiko tindakan :\n` +
      `- ARISCAT Score : (Lihat modul kalkulator ARISCAT)\n` +
      `- Revised Cardiac Risk Index : (Lihat modul kalkulator RCRI)\n` +
      `- Caprini VTE Score : (Lihat modul kalkulator Caprini)\n` +
      `- Improved Bleeding Risk Score : (Lihat modul kalkulator IMPROVE)\n` +
      (v.tipe_konsul === 'geriatri' ?
        `- Frailty (Clinical Frailty Scale) : Terlampir\n` +
        `- Risk of Fall (MORSE) : Terlampir\n` +
        `- Nutrisi : Evaluasi MNA-SF\n` +
        `- Kognitif : Evaluasi Mini-Cog\n` +
        `- Depresi : Evaluasi GDS-2\n` +
        `- Risiko Delirium Pasca Operasi PAPDI / AWOL : Terlampir\n\n` : `\n`) +
      `Optimal dilakukan tindakan apabila :\n` +
      `- TD < 160/90 mmHg ${sbpOk ? '(Tercapai: ' + v.sbp + '/' + v.dbp + ')' : '(BELUM OPTIMAL: ' + v.sbp + '/' + v.dbp + ')'}\n` +
      `- BS < 200 mg/dL ${bsOk ? '(Tercapai: ' + v.gds + ' mg/dL)' : '(BELUM OPTIMAL: ' + v.gds + ' mg/dL)'}\n` +
      `- SC < 7.0 mg/dL ${crOk ? '(Tercapai: ' + v.cr + ' mg/dL)' : '(BELUM OPTIMAL: ' + v.cr + ' mg/dL)'}\n` +
      `- HB > 10.0 g/dL ${hbOk ? '(Tercapai: ' + v.hb + ' g/dL)' : '(BELUM OPTIMAL: ' + v.hb + ' g/dL)'}\n` +
      `- K 3.5 - 5.3 mmol/L ${kOk ? '(Tercapai: ' + v.k + ' mmol/L)' : '(BELUM OPTIMAL: ' + v.k + ' mmol/L)'}\n` +
      `- Albumin > 2.5 g/dL ${albOk ? '(Tercapai)' : '(BELUM OPTIMAL: ' + v.alb + ' g/dL)'}\n` +
      `- Eutiroid / Hipertiroid subklinis\n\n` +
      `Indikasi dan kontraindikasi tindakan sesuai TS Leader/Operator.\n` +
      `Terapi lain sesuai PPA terkait.\n` +
      `============================================================`;

    return {
      value: allOk ? 'Optimal untuk Tindakan' : 'Perlu Optimalisasi Pra-Bedah',
      text: `<b>Status: ${allOk ? '<span style="color:var(--ok);">Parameter Biokimiawi Optimal</span>' : '<span style="color:var(--warn);">Terdapat Parameter yang Perlu Dioptimasi</span>'}</b><br>` +
            `TD: ${sbpOk ? '✓' : '✗'} | BS: ${bsOk ? '✓' : '✗'} | SC: ${crOk ? '✓' : '✗'} | Hb: ${hbOk ? '✓' : '✗'} | K: ${kOk ? '✓' : '✗'}`,
      cls,
      resume
    };
  }
});
