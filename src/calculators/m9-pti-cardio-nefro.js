/* ==========================================================================
   MODULE 9: PENYAKIT TROPIK INFEKSI, KARDIOLOGI & GINJAL (m9-pti-cardio-nefro.js)
   - Wells Score for DVT & Wells Score for PE
   - Protokol Resusitasi Cairan Dengue Shock Syndrome (DSS)
   - Protokol Kontras & MACD (Maximum Allowable Contrast Dose)
   - Kalkulator Koreksi Bikarbonat (Nabic / Meylon 25 mEq)
   - Protokol Drip Ca Glukonas 3x Siklus Hipokalsemia
   - Panduan Profilaksis & Terapi Infeksi Oportunistik (IO) HIV
   - Panduan Penghentian & Memulai Kembali DMARDs/Imunosupresan Perioperatif
   ========================================================================== */

// 1. Wells Score for DVT
reg({
  id: 'wells-dvt',
  nama: 'Wells Score for DVT (Deep Vein Thrombosis)',
  divisi: 'Kardiologi',
  tags: 'wells dvt trombosis vena kaki bengkak kardiologi vaskular',
  batch: 'M9',
  fields: [
    { id: 'cancer', label: 'Keganasan aktif (dalam terapi atau paliatif 6 bulan terakhir) (+1)', type: 'check' },
    { id: 'bedridden', label: 'Tirah baring > 3 hari atau bedah mayor dalam 12 minggu (+1)', type: 'check' },
    { id: 'calf_swelling', label: 'Pembengkakan betis > 3 cm dibanding sisi asimtomatik (+1)', type: 'check' },
    { id: 'collateral_veins', label: 'Vena kolateral superfisial non-varikosa (+1)', type: 'check' },
    { id: 'entire_leg', label: 'Seluruh tungkai bengkak / entire leg swollen (+1)', type: 'check' },
    { id: 'tenderness', label: 'Nyeri tekan lokal sepanjang sistem vena profunda (+1)', type: 'check' },
    { id: 'pitting_edema', label: 'Pitting edema lebih berat pada tungkai yang bergejala (+1)', type: 'check' },
    { id: 'paralysis', label: 'Paresis, paralisis, atau imobilisasi gips tungkai bawah (+1)', type: 'check' },
    { id: 'prior_dvt', label: 'Riwayat DVT terkonfirmasi sebelumnya (+1)', type: 'check' },
    { id: 'alt_diag', label: 'Diagnosis alternatif lain sama atau lebih mungkin dibanding DVT (-2)', type: 'check' }
  ],
  compute: v => {
    let score = 0;
    if (v.cancer) score += 1;
    if (v.bedridden) score += 1;
    if (v.calf_swelling) score += 1;
    if (v.collateral_veins) score += 1;
    if (v.entire_leg) score += 1;
    if (v.tenderness) score += 1;
    if (v.pitting_edema) score += 1;
    if (v.paralysis) score += 1;
    if (v.prior_dvt) score += 1;
    if (v.alt_diag) score -= 2;

    let cat = '', prob = '', saran = '', cls = 'ok';
    if (score <= 0) {
      cat = 'Low Risk Group (DVT Unlikely)';
      prob = '~ 3% – 5%';
      saran = 'Pemeriksaan D-Dimer (sensitivitas tinggi). Bila D-Dimer normal (<500 ng/mL), DVT dapat dieksklusi tanpa perlu USG Doppler cito.';
      cls = 'ok';
    } else if (score <= 2) {
      cat = 'Moderate Risk Group';
      prob = '~ 17%';
      saran = 'Pemeriksaan D-Dimer dan/atau USG Vaskular Doppler Kompresi Tungkai Bawah.';
      cls = 'warn';
    } else {
      cat = 'High Risk Group (DVT Likely)';
      prob = '≥ 75%';
      saran = 'Segera lakukan USG Vaskular Doppler Kompresi Tungkai Bawah. Pertimbangkan inisiasi dini antikoagulan terapeutik (LMWH / UFH) bila USG tertunda dan tidak ada kontraindikasi perdarahan.';
      cls = 'bad';
    }

    const resume = `Wells score for DVT\n` +
      `Active Cancer (${v.cancer ? '+1' : '0'})\n` +
      `Bedridden >72h / Surgery (${v.bedridden ? '+1' : '0'})\n` +
      `Calf Swelling compared to other leg (${v.calf_swelling ? '+1' : '0'})\n` +
      `Collateral superficial veins (${v.collateral_veins ? '+1' : '0'})\n` +
      `Entire leg swollen (${v.entire_leg ? '+1' : '0'})\n` +
      `Localized tenderness along deep venous system (${v.tenderness ? '+1' : '0'})\n` +
      `Pitting edema compared to symptomatic leg (${v.pitting_edema ? '+1' : '0'})\n` +
      `Paresis/paralysis/plaster immobilization (${v.paralysis ? '+1' : '0'})\n` +
      `Previously documented DVT (${v.prior_dvt ? '+1' : '0'})\n` +
      `Alternate diagnosis as likely (${v.alt_diag ? '-2' : '0'})\n` +
      `Total: ${score} points\n` +
      `${cat} (Probabilitas DVT: ${prob})\n` +
      `Saran: ${saran}`;

    return {
      value: `${score} Poin (${cat.split(' ')[0]})`,
      text: `<b>${cat} (${score} Poin)</b><br>Probabilitas DVT: <b>${prob}</b><br><br><span style="color:var(--pri);">Saran:</span> ${saran}`,
      cls,
      resume
    };
  }
});

// 2. Wells Score for PE
reg({
  id: 'wells-pe',
  nama: 'Wells Score for PE (Pulmonary Embolism)',
  divisi: 'Kardiologi',
  tags: 'wells pe emboli paru sesak napas kardiologi pulmo',
  batch: 'M9',
  fields: [
    { id: 'dvt_signs', label: 'Tanda & gejala klinis DVT objektif (+3.0)', type: 'check' },
    { id: 'pe_likely', label: 'Diagnosis alternatif lain kurang mungkin dibanding PE (+3.0)', type: 'check' },
    { id: 'tachycardia', label: 'Denyut Jantung / HR > 100 x/menit (+1.5)', type: 'check', ctxFn: c => c.hr !== undefined ? c.hr > 100 : undefined },
    { id: 'immob_surg', label: 'Imobilisasi ≥ 3 hari atau pembedahan dalam 4 minggu (+1.5)', type: 'check' },
    { id: 'prior_vte', label: 'Riwayat DVT atau PE sebelumnya terkonfirmasi (+1.5)', type: 'check' },
    { id: 'hemoptysis', label: 'Hemoptisis / Batuk Darah (+1.0)', type: 'check' },
    { id: 'malignancy', label: 'Keganasan aktif (dalam terapi atau paliatif) (+1.0)', type: 'check' }
  ],
  compute: v => {
    let score = 0;
    if (v.dvt_signs) score += 3.0;
    if (v.pe_likely) score += 3.0;
    if (v.tachycardia) score += 1.5;
    if (v.immob_surg) score += 1.5;
    if (v.prior_vte) score += 1.5;
    if (v.hemoptysis) score += 1.0;
    if (v.malignancy) score += 1.0;

    let cat = '', saran = '', cls = 'ok';
    if (score <= 4.0) {
      cat = 'PE Unlikely (Risiko Rendah / Sedang)';
      saran = 'Periksa D-Dimer. Bila D-Dimer negatif (<500 ng/mL), PE dapat disingkirkan tanpa CTPA (CT Pulmonary Angiography).';
      cls = 'ok';
    } else {
      cat = 'PE Likely (Risiko Tinggi)';
      saran = 'Segera jadwalkan CTPA (CT Pulmonary Angiography). Pertimbangkan inisiasi dini antikoagulan terapeutik bila tidak ada kontraindikasi perdarahan.';
      cls = 'bad';
    }

    const resume = `[WELLS SCORE FOR PULMONARY EMBOLISM]\n` +
      `- Total Skor: ${score.toFixed(1)} poin (${cat})\n` +
      `- Rekomendasi: ${saran}`;

    return {
      value: `${score.toFixed(1)} Poin (${score <= 4 ? 'PE Unlikely' : 'PE Likely'})`,
      text: `<b>${cat} (${score.toFixed(1)} Poin)</b><br><span style="color:var(--pri);">Alur Klinis:</span> ${saran}`,
      cls,
      resume
    };
  }
});

// 3. Protokol Resusitasi Cairan DSS (Dengue Shock Syndrome)
reg({
  id: 'dss-fluid',
  nama: 'Protokol Resusitasi Cairan DSS (Dengue Shock Syndrome)',
  divisi: 'Penyakit Tropik & Infeksi',
  tags: 'dss dengue shock syndrome resusitasi cairan ringer laktat pti konsul',
  batch: 'M9',
  fields: [
    { id: 'bb', label: 'Berat Badan Pasien (kg)', type: 'number', step: 1, val: 50, ctx: 'bb' },
    { id: 'phase', label: 'Tahapan Resusitasi Saat Ini', type: 'select', options: [
      ['Loading Awal: 10 - 20 mL/kg dalam 30 - 60 menit', 'bolus'],
      ['Tahap 1 Pasca Loading: 7 mL/kgBB/jam (1 - 2 jam)', 'step7'],
      ['Tahap 2 Stabilisasi: 5 mL/kgBB/jam (1 - 2 jam)', 'step5'],
      ['Tahap 3 Tapering: 3 mL/kgBB/jam (2 - 4 jam)', 'step3'],
      ['Tahap 4 Maintenance Pemulihan: 1.5 - 2 mL/kgBB/jam (~20-30 tpm)', 'maint']
    ], val: 'bolus' }
  ],
  compute: v => {
    const bb = Number(v.bb || 50);
    let volMl = 0, rateCcHr = 0, tpm = 0, desc = '', cls = 'warn';

    if (v.phase === 'bolus') {
      volMl = 20 * bb; // 1000 cc pd BB 50 kg
      rateCcHr = volMl; // dalam 1 jam
      tpm = Math.round((volMl * 20) / 60);
      desc = `Loading RL 1000 cc IV (atau ${volMl} cc = 10–20 mL/kg) habis dalam 30–60 menit. Berikan O2 nasal kanul 2–4 lpm.`;
      cls = 'bad';
    } else if (v.phase === 'step7') {
      rateCcHr = 7 * bb; // 350 cc/jam
      tpm = Math.round((rateCcHr * 20) / 60);
      desc = `RL ${rateCcHr} cc dalam 1 jam (7 cc/kgBB/jam). Evaluasi tanda vital, perfusi akral, dan hematokrit tiap jam.`;
      cls = 'warn';
    } else if (v.phase === 'step5') {
      rateCcHr = 5 * bb; // 250 cc/jam
      tpm = Math.round((rateCcHr * 20) / 60);
      desc = `RL ${rateCcHr} cc dalam 1 jam (5 cc/kgBB/jam). Bila hemodinamik membaik, turunkan ke tahap 3 cc/kgBB/jam.`;
      cls = 'ok';
    } else if (v.phase === 'step3') {
      rateCcHr = 3 * bb; // 150 cc/jam
      tpm = Math.round((rateCcHr * 20) / 60);
      desc = `RL ${rateCcHr} cc per jam (3 cc/kgBB/jam) selama 2–4 jam. Pantau ketat produksi urine (target ≥ 0.5 cc/kg/jam).`;
      cls = 'ok';
    } else {
      rateCcHr = Math.round(1.5 * bb);
      tpm = 30; // standard maintenance
      desc = `IVFD RL maintenance 20 – 30 tpm (~${rateCcHr} cc/jam). Hentikan cairan intravena 48 jam pasca syok teratasi / fase konvalesen.`;
      cls = 'ok';
    }

    const templateKonsul = `[PROTOKOL RESUSITASI CAIRAN DSS (BB ${bb} kg)]\n` +
      `Bila syok terkompensasi / dekompensasi:\n` +
      `1. Loading RL 1000 cc IV (atau 10-20 mL/kgBB) habis dalam 30-60 menit\n` +
      `   O2 Nasal Kanul 2-4 lpm | Pasang Kateter Urin | Diet lunak/cair 1900 kkal\n\n` +
      `2. Bila pasca loading membaik:\n` +
      `   - RL ${7 * bb} cc dalam 1 jam (7 cc/kgBB/jam)\n` +
      `3. Bila membaik:\n` +
      `   - RL ${5 * bb} cc dalam 1 jam (5 cc/kgBB/jam)\n` +
      `4. Bila membaik:\n` +
      `   - RL ${3 * bb} cc per jam (3 cc/kgBB/jam) selama 2-4 jam\n` +
      `5. Bila stabil:\n` +
      `   - Kembali pada maintenance IVFD RL 20-30 tpm (~${Math.round(1.5 * bb)} cc/jam)\n\n` +
      `Monitoring Ketat:\n` +
      `- TTV & Akral tiap 15-30 menit hingga stabil\n` +
      `- Cek Darah Lengkap & Hematokrit serial tiap 4-6 jam\n` +
      `- Waspadai overload cairan bila Hct turun drastis namun klinis memburuk`;

    return {
      value: `${rateCcHr} cc/jam (~${tpm} tpm)`,
      text: `<b>Tahapan: ${v.phase.toUpperCase()} (BB ${bb} kg)</b><br>${desc}<br>Kecepatan infus: <b>${rateCcHr} cc/jam</b> (~<b>${tpm} tetes/menit makro</b>)`,
      cls,
      resume: templateKonsul
    };
  }
});

// 4. Protokol Kontras & MACD (Maximum Allowable Contrast Dose)
reg({
  id: 'macd-cin',
  nama: 'Protokol Kontras & MACD (Contrast-Induced Nephropathy)',
  divisi: 'Ginjal-Hipertensi',
  tags: 'macd kontras cin aki kreatinin resfar hidrasi nefropati nefro',
  batch: 'M9',
  fields: [
    { id: 'bb', label: 'Berat Badan Pasien (kg)', type: 'number', step: 1, val: 60, ctx: 'bb' },
    { id: 'cr', label: 'Serum Kreatinin Pre-Tindakan (mg/dL)', type: 'number', step: 0.1, val: 1.5, ctx: 'cr' },
    { id: 'planned_vol', label: 'Volume Kontras Terencana (mL)', type: 'number', step: 5, val: 100 }
  ],
  compute: v => {
    const bb = Number(v.bb || 60);
    const cr = Number(v.cr || 1.5);
    const planned = Number(v.planned_vol || 100);

    // MACD = 5 mL x BB / SC
    const macd = Math.round((5 * bb) / cr);
    const isExceeded = planned > macd;
    const ratio = (planned / macd).toFixed(2);

    let cls = isExceeded ? 'bad' : (ratio > 0.8 ? 'warn' : 'ok');

    const templateKonsul = `[PROTOKOL PERLINDUNGAN KONTRAS GINJAL]\n` +
      `Estimasi Batas Maksimal Kontras (MACD):\n` +
      `- Rumus MACD: (5 mL x ${bb} kg) / ${cr} mg/dL = ${macd} mL\n` +
      `- Volume Kontras Terencana: ${planned} mL (Rasio: ${ratio}x MACD) ${isExceeded ? '➔ MELEBIHI BATAS AMAN!' : '➔ Dalam batas aman'}\n\n` +
      `Himbauan / Protokol Pencegahan CIN:\n` +
      `- Hidrasi NaCl 0.9% 1 - 1.5 cc/kgBB/jam (${Math.round(1.2 * bb)} cc/jam), mulai 12 jam sebelum sampai 12 jam post tindakan\n` +
      `- Injeksi intravena Resfar (NAC) 5 gr, 4 jam sebelum dan 4 jam post tindakan, dilanjutkan NAC oral 2x600 mg sampai H+5\n` +
      `- Hindari obat nefrotoksik (NSAID, Aminoglikosida, dll) & tunda Metformin 48 jam\n` +
      `- Saran penggunaan jenis kontras Iso-osmolar (IOCM) dengan volume < ${macd} mL\n` +
      `- Monitoring Cairan Masuk - Cairan Keluar (CM-CK): urine 6 jam pertama, lalu urine 24 jam\n` +
      `- Cek serial BUN & Serum Kreatinin pada 12, 24, dan 48 jam post tindakan`;

    return {
      value: `MACD: ${macd} mL (${ratio}x)`,
      text: `<b>Maksimum Volume Kontras (MACD): ${macd} mL</b><br>` +
            `Rasio Volume Terencana: <b>${ratio}x</b> ${isExceeded ? '<span style="color:var(--bad);font-weight:bold;">(Melebihi MACD! Risiko CIN Tinggi)</span>' : '<span style="color:var(--ok);">(Aman)</span>'}<br><br>` +
            `• Hidrasi NaCl: <b>${Math.round(1.2 * bb)} cc/jam</b> (12 jam pre & post)<br>` +
            `• Resfar (NAC): 5 g IV 4 jam pre & post, lanjut oral 2x600 mg s.d. H+5`,
      cls,
      resume: templateKonsul
    };
  }
});

// 5. Kalkulator Koreksi Bikarbonat (Nabic / Meylon 25 mEq)
reg({
  id: 'koreksi-nabic',
  nama: 'Kalkulator Koreksi Bikarbonat (Nabic / Meylon 25 mEq)',
  divisi: 'Ginjal-Hipertensi',
  tags: 'nabic meylon bikarbonat hco3 asidosis asidemia koreksi nefro cairan',
  batch: 'M9',
  fields: [
    { id: 'bb', label: 'Berat Badan Pasien (kg)', type: 'number', step: 1, val: 50, ctx: 'bb' },
    { id: 'cur_hco3', label: 'HCO3 Aktual Pasien (mEq/L)', type: 'number', step: 0.5, val: 4.0, ctx: 'hco3' },
    { id: 'target_hco3', label: 'Target HCO3 Awal (mEq/L)', type: 'number', step: 0.5, val: 10.0 }
  ],
  compute: v => {
    const bb = Number(v.bb || 50);
    const cur = Number(v.cur_hco3 || 4);
    const target = Number(v.target_hco3 || 10);

    const delta = Math.max(0, target - cur);
    // Defisit = 0.5 x BB x Delta HCO3
    const defisit = 0.5 * bb * delta;
    // 1 flacon Meylon = 25 mEq (8.4% 25 mL)
    const flacon = (defisit / 25).toFixed(1);

    // Bolus 1/3 (atau 50 mEq) dan sisa drip 24 jam
    let bolusMeq = defisit >= 50 ? 50 : defisit;
    let dripMeq = Math.max(0, defisit - bolusMeq);
    let bolusFlacon = Math.round(bolusMeq / 25);
    let dripFlacon = (dripMeq / 25).toFixed(1);

    const templateKonsul = `[KOREKSI ASIDOSIS METABOLIK BERAT / NABIC]\n` +
      `- Delta HCO3: ${target} - ${cur} = ${delta.toFixed(1)} mEq/L\n` +
      `- Rumus Defisit: 0.5 x ${bb} kg x ${delta.toFixed(1)} = ${defisit.toFixed(0)} mEq (Total: ~${flacon} flacon Meylon @ 25 mEq)\n\n` +
      `Protokol Pemberian:\n` +
      `➔ Bolus Nabic ${bolusMeq} mEq (${bolusFlacon} flacon Meylon) dalam 100 cc NaCl 0.9% habis dalam 30 menit IV\n` +
      (dripMeq > 0 ? `➔ Lanjut Drip Nabic ${dripMeq.toFixed(0)} mEq (~${dripFlacon} flacon Meylon) dalam 500 cc NaCl 0.9% habis dalam 24 jam IV\n\n` : '\n') +
      `Evaluasi & Monitoring:\n` +
      `- Evaluasi AGD ulang besok pagi (24 jam post koreksi)\n` +
      `- Waspadai hipokalsemia akut (kalsium ionik turun saat asidosis terkoreksi) dan hipokalemia`;

    return {
      value: `${defisit.toFixed(0)} mEq (~${flacon} fl Meylon)`,
      text: `<b>Defisit Bikarbonat: ${defisit.toFixed(0)} mEq (~${flacon} flacon Meylon)</b><br>` +
            `• <b>Bolus:</b> Nabic ${bolusMeq} mEq (${bolusFlacon} fl Meylon) dlm 100 cc NS habis 30 menit<br>` +
            (dripMeq > 0 ? `• <b>Drip:</b> Nabic ${dripMeq.toFixed(0)} mEq (~${dripFlacon} fl Meylon) dlm 500 cc NS habis 24 jam` : ''),
      cls: defisit > 0 ? 'warn' : 'ok',
      resume: templateKonsul
    };
  }
});

// 6. Protokol Drip Ca Glukonas 3x Siklus Hipokalsemia
reg({
  id: 'ca-glukonas-drip',
  nama: 'Protokol Drip Ca Glukonas 3x Siklus (Hipokalsemia)',
  divisi: 'Cairan & Elektrolit',
  tags: 'kalsium glukonas ca hipokalsemia tetani drip konsul meylon elektrolit',
  batch: 'M9',
  fields: [
    { id: 'ca_val', label: 'Kadar Kalsium Serum Total (mg/dL)', type: 'number', step: 0.1, val: 6.8, ctx: 'ca' },
    { id: 'alb_val', label: 'Albumin Serum (g/dL)', type: 'number', step: 0.1, val: 2.8, ctx: 'alb' },
    { id: 'symptomatic', label: 'Gejala Akut / Tetani / Tanda Chvostek / Trousseau (+)', type: 'check' }
  ],
  compute: v => {
    const ca = Number(v.ca_val || 7.0);
    const alb = Number(v.alb_val || 3.0);
    const caCorr = ca + 0.8 * (4.0 - alb);

    const templateKonsul = `[KOREKSI HIPOKALSEMIA - PROTOKOL DRIP 3X SIKLUS]\n` +
      `- Kalsium Terukur: ${ca.toFixed(2)} mg/dL | Albumin: ${alb.toFixed(1)} g/dL\n` +
      `- Kalsium Terkoreksi (Payne): ${caCorr.toFixed(2)} mg/dL ${caCorr < 8.5 ? '(Hipokalsemia)' : '(Normal)'}\n\n` +
      `Protokol Pemberian:\n` +
      `- Drip cepat Ca Glukonas 1 ampul (10 mL 10%) dalam D5% 200 cc, habis dalam 30 menit IV\n` +
      `- Diberikan sebanyak 3x siklus, dengan jeda 2 jam tiap pemberian\n` +
      `- Cek Ca serum dan albumin ulang 2 jam setelah 3x pemberian drip selesai\n\n` +
      `Perhatian Klinis:\n` +
      `- Jangan mencampur Kalsium Glukonas dengan Bikarbonat (Nabic) atau Fosfat dalam satu jalur infus (risiko presipitasi kristal kalsium kation-anion)\n` +
      `- Cek dan koreksi kadar Magnesium (hipomagnesemia menyebabkan hipokalsemia refrakter)`;

    return {
      value: `Ca Payne: ${caCorr.toFixed(2)} mg/dL`,
      text: `<b>Kalsium Terkoreksi: ${caCorr.toFixed(2)} mg/dL</b><br>` +
            `• <b>Regimen:</b> Drip cepat Ca Glukonas 1 ampul dalam D5% 200 cc habis 30 menit IV (diberikan 3x, jeda 2 jam tiap pemberian)<br>` +
            `• <b>Monitoring:</b> Cek ulang Ca serum & albumin 2 jam pasca 3x drip`,
      cls: caCorr < 8.0 ? 'bad' : 'warn',
      resume: templateKonsul
    };
  }
});

// 7. Panduan Profilaksis & Terapi IO HIV
reg({
  id: 'hiv-oi-guide',
  nama: 'Panduan Profilaksis & Terapi Infeksi Oportunistik HIV',
  divisi: 'Penyakit Tropik & Infeksi',
  tags: 'hiv cd4 viral load kotrimoksazol pcp toxo candidiasis sifilis pti konsul',
  batch: 'M9',
  fields: [
    { id: 'condition', label: 'Indikasi Klinis / Infeksi Oportunistik', type: 'select', options: [
      ['Profilaksis Primer PCP & Toksoplasmosis (CD4 < 200)', 'prophylaxis'],
      ['PCP Sedang – Berat (PaO2 < 70 mmHg / A-a gradient ≥ 35)', 'pcp_severe'],
      ['PCP Ringan – Sedang (PaO2 ≥ 70 mmHg)', 'pcp_mild'],
      ['Toksoplasmosis Serebri Akut', 'toxo'],
      ['Kandidiasis Orofaringeal & Esofageal', 'candida'],
      ['Sifilis (Early Stage vs Late / Latent)', 'syphilis'],
      ['Monitoring Pasien HIV Baru & Kontrol Rutin', 'monitoring']
    ], val: 'prophylaxis' },
    { id: 'bb', label: 'Berat Badan Pasien (kg)', type: 'number', step: 1, val: 50, ctx: 'bb' },
    { id: 'cd4', label: 'Hitung CD4 Saat Ini (sel/µL)', type: 'number', step: 1, val: 120 }
  ],
  compute: v => {
    const bb = Number(v.bb || 50);
    const cd4 = Number(v.cd4 || 100);

    let title = '', regimen = '', cls = 'ok';

    if (v.condition === 'prophylaxis') {
      title = 'Profilaksis Primer PCP & Toxoplasma';
      regimen = `• Dosis: <b>Kotrimoksasol 1 x 960 mg per oral</b> harian.\n` +
        `• Indikasi Stop: CD4 > 200 sel/µL setelah minimal 3 bulan terapi ARV stabil, atau CD4 100–200 dengan viral load tidak terdeteksi 3–6 bulan.`;
      cls = cd4 < 200 ? 'warn' : 'ok';
    } else if (v.condition === 'pcp_severe') {
      title = 'PCP Sedang-Berat (PaO2 < 70 / Aa ≥ 35) (21 Hari)';
      regimen = `• TMP (${(15*bb).toFixed(0)}–${(20*bb).toFixed(0)} mg) + SMX (${(75*bb).toFixed(0)}–${(100*bb).toFixed(0)} mg)/hari terbagi dalam 3–4 dosis IV/PO.\n` +
        `• Terapi Tambahan Kortikosteroid Oral:\n` +
        `  - H1–H5: Prednison 2 x 40 mg PO (atau Metilprednisolon IV 75% dosis prednison)\n` +
        `  - H6–H10: Prednison 1 x 40 mg PO\n` +
        `  - H11–H21: Prednison 1 x 20 mg PO\n` +
        `• Lanjut profilaksis sekunder Kotrimoksasol 1x960 mg hingga CD4 > 200.`;
      cls = 'bad';
    } else if (v.condition === 'pcp_mild') {
      title = 'PCP Ringan-Sedang (21 Hari)';
      regimen = `• TMP-SMX PO dosis: TMP 15–20 mg/kg/hari terbagi 3 dosis, ATAU TMP-SMX oral 3 x 1920 mg (3 x 2 tablet Forte).\n` +
        `• Dilanjutkan profilaksis sekunder 1 x 960 mg.`;
      cls = 'warn';
    } else if (v.condition === 'toxo') {
      title = 'Toksoplasmosis Serebri (6 Minggu)';
      regimen = `• Lini Alternatif Indonesia: TMP 5 mg/kg + SMX 25 mg/kg tiap 12 jam (atau TMP-SMX 4 x 960 mg PO/IV).\n` +
        `• Dilanjutkan sekunder profilaksis 1 x 960 mg jika CD4 < 200.`;
      cls = 'bad';
    } else if (v.condition === 'candida') {
      title = 'Kandidiasis Mukokutan';
      regimen = `• Orofaringeal: Flukonazol 1 x 150 mg PO (selama 7–14 hari).\n` +
        `• Esofageal: Flukonazol 1 x 150–400 mg IV/PO (selama 14–21 hari).`;
      cls = 'ok';
    } else if (v.condition === 'syphilis') {
      title = 'Sifilis Dewasa (WHO Guideline)';
      regimen = `• Early Stage (Primer, Sekunder, Laten Dini < 1 tahun): Benzatin Penisilin G 2.4 juta Unit IM single dose.\n` +
        `• Late Latent (> 1 tahun / durasi tidak diketahui) / Tersier: Benzatin Penisilin G 2.4 juta Unit IM tiap minggu sebanyak 3 dosis (total 7.2 juta Unit).`;
      cls = 'ok';
    } else {
      title = 'Jadwal Monitoring Pasien HIV';
      regimen = `• Pasien Baru Pra-ARV: DL, SGOT/SGPT, SC, HBsAg, Anti-HCV, GDS, VDRL/TPHA, Rontgen dada, TCM sputum, tes kehamilan, CD4.\n` +
        `• Evaluasi Post-Inisiasi: Cek SC pada 1 bulan post TLD; Cek VL dan CD4 pada 6 bulan post ARV; Pasien kontrol rutin: Cek Viral Load dan CD4 tiap 1 tahun.`;
      cls = 'ok';
    }

    const resume = `[PANDUAN TATALAKSANA IO & PROFILAKSIS HIV]\n` +
      `Kategori: ${title}\n` +
      `Rekomendasi:\n${regimen.replace(/<[^>]+>/g, '')}\n` +
      `*Sumber: WHO Guidelines on Opportunistic Infections in HIV`;

    return {
      value: title,
      text: `<b>${title}</b><br><div style="font-size:0.9em;margin-top:6px;line-height:1.4;">${regimen.replace(/\n/g, '<br>')}</div>`,
      cls,
      resume
    };
  }
});

// 8. Panduan Perioperatif DMARDs / Imunosupresan SLE & Reumatik
reg({
  id: 'rheuma-perioperative',
  nama: 'Panduan Perioperatif DMARDs & Imunosupresan (SLE / RA)',
  divisi: 'Reumatologi',
  tags: 'dmard mtx leflunomide sulfasalazin azatioprin steroid preop reuma sle konsul',
  batch: 'M9',
  fields: [
    { id: 'drug', label: 'Jenis Obat Imunosupresan / DMARD', type: 'select', options: [
      ['Metotreksat (MTX)', 'mtx'],
      ['Leflunomide (Arava)', 'leflunomide'],
      ['Sulfasalazin', 'ssz'],
      ['Azatioprin (Imuran)', 'aza'],
      ['Klorokuin / Hidroksiklorokuin (Plaquenil)', 'hcq'],
      ['Agen Biologi (Infliximab, Etanercept, Rituximab)', 'biologics']
    ], val: 'mtx' }
  ],
  compute: v => {
    let guide = '';
    if (v.drug === 'mtx') {
      guide = '• <b>Metotreksat (MTX):</b> Dihentikan <b>1 minggu sebelum operasi</b> dan dapat dilanjutkan kembali <b>1 minggu setelah tindakan operatif</b> (setelah luka operasi sembuh baik tanpa tanda infeksi).';
    } else if (v.drug === 'leflunomide') {
      guide = '• <b>Leflunomide:</b> Harus dihentikan <b>2 minggu sebelum operasi</b> dan dapat dilanjutkan kembali <b>3 hari sesudahnya</b> bila fungsi hepar dan penyembuhan luka baik.';
    } else if (v.drug === 'ssz' || v.drug === 'aza') {
      guide = '• <b>Sulfasalazin & Azatioprin:</b> Dihentikan <b>1 hari sebelum tindakan bedah</b> dan dilanjutkan kembali <b>3 hari setelahnya</b>.';
    } else if (v.drug === 'hcq') {
      guide = '• <b>Klorokuin / Hidroksiklorokuin (HCQ):</b> <b>DAPAT DILANJUTKAN</b> sepanjang periode perioperatif tanpa harus dihentikan.';
    } else {
      guide = '• <b>Agen Biologi (Anti-TNF, Rituximab):</b> Dianjurkan dihentikan <b>1 siklus dosis sebelum tindakan</b> (umumnya minimal 1 minggu) dan dilanjutkan kembali <b>1–2 minggu setelah tindakan</b> pasca evaluasi luka bedah.';
    }

    const templateKonsul = `[MANAJEMEN PERIOPERATIF DMARDs / IMUNOSUPRESAN]\n` +
      `${guide.replace(/<[^>]+>/g, '')}\n` +
      `*Sumber: Panduan Rekomendasi Perioperatif Pasien Reumatik & SLE (ACR / IRA)`;

    return {
      value: v.drug.toUpperCase(),
      text: guide,
      cls: 'ok',
      resume: templateKonsul
    };
  }
});
