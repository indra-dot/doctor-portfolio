/* ==========================================================================
   MODULE 5: PULMONOLOGI & RESPIROLOGI (m5-pulmo.js)
   - Pneumonia Severity Index (PSI / PORT Score for CAP)
   - Evaluasi & Optimasi Preoperatif Asma / PPOK
   ========================================================================== */

// 1. Pneumonia Severity Index (PSI / PORT Score)
reg({
  id: 'psi',
  nama: 'Pneumonia Severity Index (PSI / PORT Score)',
  divisi: 'Pulmonologi',
  tags: 'pneumonia port fine score psi cap rawat inap icu severity mortalitas',
  batch: 'M5',
  fields: [
    { id: 'age', label: 'Usia (tahun)', type: 'number', step: 1, val: 65, ctx: 'age' },
    { id: 'sex', label: 'Jenis Kelamin', type: 'select', options: [['Pria', 'm'], ['Wanita', 'f']], val: 'm', ctx: 'sex' },
    { id: 'nursing_home', label: 'Penghuni Panti Jompo / Nursing Home (+10)', type: 'check' },
    
    // Komorbiditas
    { id: 'neoplasm', label: 'Riwayat Keganasan / Neoplasma Aktif (+30)', type: 'check' },
    { id: 'liver_dis', label: 'Penyakit Hati Kronis / Sirosis (+20)', type: 'check' },
    { id: 'chf', label: 'Gagal Jantung Kongestif / CHF (+10)', type: 'check' },
    { id: 'cvd', label: 'Penyakit Serebrovaskular / Stroke (+10)', type: 'check' },
    { id: 'renal_dis', label: 'Penyakit Ginjal Kronis (+10)', type: 'check' },

    // Pemeriksaan Fisik
    { id: 'ams', label: 'Gangguan Kesadaran / Altered Mental Status (+20)', type: 'check' },
    { id: 'rr30', label: 'Frekuensi Napas ≥ 30 x/menit (+20)', type: 'check', ctxFn: c => c.rr !== undefined ? c.rr >= 30 : undefined },
    { id: 'sbp90', label: 'Tekanan Darah Sistolik < 90 mmHg (+20)', type: 'check', ctxFn: c => c.sbp !== undefined ? c.sbp < 90 : undefined },
    { id: 'temp_abn', label: 'Suhu Tubuh < 35°C atau ≥ 40°C (+15)', type: 'check' },
    { id: 'hr125', label: 'Denyut Nadi ≥ 125 x/menit (+10)', type: 'check', ctxFn: c => c.hr !== undefined ? c.hr >= 125 : undefined },

    // Lab & Radiologi
    { id: 'ph735', label: 'Analisis Gas Darah: pH arteri < 7.35 (+30)', type: 'check' },
    { id: 'bun30', label: 'BUN ≥ 30 mg/dL (atau Ureum ≥ 64 mg/dL) (+20)', type: 'check', ctxFn: c => c.bun !== undefined ? c.bun >= 30 : undefined },
    { id: 'na130', label: 'Natrium Serum < 130 mEq/L (+20)', type: 'check', ctxFn: c => c.na !== undefined ? c.na < 130 : undefined },
    { id: 'glu250', label: 'Glukosa Darah ≥ 250 mg/dL (+10)', type: 'check', ctxFn: c => c.glu !== undefined ? c.glu >= 250 : undefined },
    { id: 'hct30', label: 'Hematokrit < 30% (+10)', type: 'check' },
    { id: 'hypox', label: 'PaO2 < 60 mmHg atau SpO2 < 90% (+10)', type: 'check', ctxFn: c => c.spo2 !== undefined ? c.spo2 < 90 : undefined },
    { id: 'pleural_eff', label: 'Efusi Pleura pada Rontgen Toraks (+10)', type: 'check' }
  ],
  compute: v => {
    let score = Number(v.age || 0);
    if (v.sex === 'f') score -= 10;
    if (v.nursing_home) score += 10;

    // Komorbid
    if (v.neoplasm) score += 30;
    if (v.liver_dis) score += 20;
    if (v.chf) score += 10;
    if (v.cvd) score += 10;
    if (v.renal_dis) score += 10;

    // Fisik
    if (v.ams) score += 20;
    if (v.rr30) score += 20;
    if (v.sbp90) score += 20;
    if (v.temp_abn) score += 15;
    if (v.hr125) score += 10;

    // Lab & X-ray
    if (v.ph735) score += 30;
    if (v.bun30) score += 20;
    if (v.na130) score += 20;
    if (v.glu250) score += 10;
    if (v.hct30) score += 10;
    if (v.hypox) score += 10;
    if (v.pleural_eff) score += 10;

    // Tentukan Kelas PSI
    let riskClass = '', mortality = '', rec = '', cls = 'ok';
    const hasComorbid = v.neoplasm || v.liver_dis || v.chf || v.cvd || v.renal_dis;
    const hasAbnVitals = v.ams || v.rr30 || v.sbp90 || v.temp_abn || v.hr125;

    if (v.age <= 50 && !v.nursing_home && !hasComorbid && !hasAbnVitals && score <= 50) {
      riskClass = 'Kelas I';
      mortality = '0.1%';
      rec = 'Risiko sangat rendah. Rekomendasi: Rawat Jalan (Outpatient).';
      cls = 'ok';
    } else if (score <= 70) {
      riskClass = 'Kelas II';
      mortality = '0.6%';
      rec = 'Risiko rendah. Rekomendasi: Rawat Jalan (Outpatient).';
      cls = 'ok';
    } else if (score <= 90) {
      riskClass = 'Kelas III';
      mortality = '0.9% – 2.8%';
      rec = 'Risiko sedang. Pertimbangkan Observasi Rawat Inap Singkat / Ruang Rawat.';
      cls = 'warn';
    } else if (score <= 130) {
      riskClass = 'Kelas IV';
      mortality = '8.2% – 9.3%';
      rec = 'Risiko tinggi. Rekomendasi: Rawat Inap Ruangan Umum.';
      cls = 'bad';
    } else {
      riskClass = 'Kelas V';
      mortality = '27.0% – 31.0%';
      rec = 'Risiko sangat tinggi. Rekomendasi: Rawat Inap, evaluasi indikasi ICU.';
      cls = 'bad';
    }

    const resume = `[PNEUMONIA SEVERITY INDEX / PORT SCORE]\n` +
      `- Total Skor: ${score} poin (${riskClass})\n` +
      `- Estimasi Mortalitas 30 Hari: ${mortality}\n` +
      `- Rekomendasi Penempatan: ${rec}\n` +
      `- Parameter Kunci Terpenuhi: ${[
        v.nursing_home ? 'Nursing Home' : '',
        v.neoplasm ? 'Neoplasma' : '',
        v.liver_dis ? 'Liver Dis' : '',
        v.chf ? 'CHF' : '',
        v.cvd ? 'Stroke' : '',
        v.renal_dis ? 'CKD' : '',
        v.ams ? 'Kesadaran Terganggu' : '',
        v.rr30 ? 'RR≥30' : '',
        v.sbp90 ? 'TDS<90' : '',
        v.ph735 ? 'pH<7.35' : '',
        v.bun30 ? 'BUN≥30' : '',
        v.na130 ? 'Na<130' : '',
        v.hypox ? 'Hipoksemia' : '',
        v.pleural_eff ? 'Efusi Pleura' : ''
      ].filter(Boolean).join(', ') || 'Nihil'}`;

    return {
      value: `${score} Poin (${riskClass})`,
      text: `<b>${riskClass}</b> (Mortalitas: ${mortality})<br>${rec}`,
      cls,
      resume
    };
  }
});

// 2. Evaluasi Preoperatif Asma / PPOK
reg({
  id: 'preop-asthma',
  nama: 'Evaluasi & Optimasi Preoperatif Asma / PPOK',
  divisi: 'Pulmonologi',
  tags: 'asma ppok preoperatif paru bronkodilator metilprednisolon spirometri konsul',
  batch: 'M5',
  fields: [
    { id: 'diag', label: 'Diagnosis Respirasi', type: 'select', options: [['Asma Bronkial', 'asthma'], ['PPOK (Penyakit Paru Obstruktif Kronik)', 'copd'], ['Asma-PPOK Overlap (ACO)', 'aco']], val: 'asthma' },
    { id: 'symptom_freq', label: 'Kontrol Klinis / Gejala Saat Ini', type: 'select', options: [['Terkontrol Penuh (tanpa wheezing / sesak)', 'controlled'], ['Sebagian Terkontrol (wheezing intermiten)', 'partially'], ['Tidak Terkontrol / Eksaserbasi 4 Minggu Terakhir', 'uncontrolled']], val: 'controlled' },
    { id: 'fev1', label: 'Nilai FEV1 Spirometri (% Prediksi)', type: 'number', step: 1, val: 75 },
    { id: 'urgency', label: 'Urgensi Tindakan Bedah', type: 'select', options: [['Elektif', 'elective'], ['Urgent / Cito', 'urgent']], val: 'elective' }
  ],
  compute: v => {
    let rec = '';
    let cls = 'ok';

    if (v.symptom_freq === 'uncontrolled' || (v.fev1 && v.fev1 < 50)) {
      cls = 'bad';
      rec = `<b>Peringatan: Risiko Bronkospasme Perioperatif Tinggi!</b><br>` +
        `• Tunda operasi elektif hingga kondisi respirasi optimal (bebas eksaserbasi minimal 4 minggu).<br>` +
        `• Bila operasi emergensi/urgent: Berikan terapi agresif pra-bedah sesuai protokol.`;
    } else if (v.symptom_freq === 'partially' || (v.fev1 && v.fev1 < 70)) {
      cls = 'warn';
      rec = `<b>Risiko Moderat: Diperlukan Profilaksis Perioperatif Ketat.</b>`;
    } else {
      cls = 'ok';
      rec = `<b>Status Respirasi Stabil / Terkontrol Baik.</b> Jalankan protokol perlindungan perioperatif standar.`;
    }

    const templateKonsul = `[PREOPERATIVE ASMA / PPOK - REKOMENDASI KLINIS]\n` +
      `Planning:\n` +
      `- Spirometri (evaluasi FEV1 preop: ${v.fev1 || '-'}%)\n\n` +
      `Terapi jika saat akan melakukan tindakan:\n` +
      `- Nebulisasi Farbivent 1 respul 4 jam sebelum dan sesudah tindakan\n` +
      `- Metilprednisolone 62.5 mg IV 4 jam sebelum dan sesudah tindakan\n` +
      `- Optimalisasi TS terkait\n\n` +
      `Saran perioperatif:\n` +
      `- Persiapan pre-op: Respiratory muscle training (saran konsul TS URM/Rehab Medik)\n` +
      `- Intraoperasi:\n` +
      `  * Pilih prosedur dan durasi anestesi optimal (2-3 jam)\n` +
      `  * Minimalisasi durasi anestesi dan manipulasi jalan napas\n` +
      `- Post Operasi (saran konsul TS URM):\n` +
      `  * Deep breathing exercise\n` +
      `  * Mobilisasi dini\n` +
      `  * Manajemen nyeri adekuat untuk mencegah splinting toraks`;

    return {
      value: v.diag.toUpperCase() + ` (${v.symptom_freq})`,
      text: `${rec}<br><br><div style="font-size:0.85em;line-height:1.4;background:rgba(0,0,0,0.2);padding:10px;border-radius:8px;">${templateKonsul.replace(/\n/g, '<br>')}</div>`,
      cls,
      resume: templateKonsul
    };
  }
});
