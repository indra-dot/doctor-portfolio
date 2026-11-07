/* ==========================================================================
   MODULE 7: PSIKOSOMATIS & KEDOKTERAN PALIATIF (m7-psikosomatis.js)
   - HADS (Hospital Anxiety and Depression Scale)
   - PHQ-9 (Depression Screening)
   - GAD-7 (Generalized Anxiety Disorder)
   - Drip Analgetik / Pain Management Titrator (Morfin & Fentanyl)
   ========================================================================== */

// 1. Hospital Anxiety and Depression Scale (HADS)
reg({
  id: 'hads',
  nama: 'Hospital Anxiety and Depression Scale (HADS)',
  divisi: 'Psikosomatis',
  tags: 'hads anxiety depression cemas depresi psikosomatis paliatif distres',
  batch: 'M7',
  fields: [
    // HADS-A (Anxiety)
    { id: 'a1', label: '1. [A] Saya merasa tegang atau gelisah', type: 'select', options: [['Tidak pernah (0)', '0'], ['Kadang-kadang (1)', '1'], ['Sering kali (2)', '2'], ['Hampir sepanjang waktu (3)', '3']], val: '1' },
    { id: 'a2', label: '2. [A] Saya merasa takut seperti ada sesuatu yang buruk akan terjadi', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Sedikit tapi tidak mengkhawatirkan (1)', '1'], ['Ya, tapi tidak terlalu parah (2)', '2'], ['Sangat jelas dan menakutkan (3)', '3']], val: '1' },
    { id: 'a3', label: '3. [A] Pikiran mengkhawatirkan berkecamuk di benak saya', type: 'select', options: [['Hanya sesekali (0)', '0'], ['Dari waktu ke waktu (1)', '1'], ['Sangat sering (2)', '2'], ['Sebagian besar waktu (3)', '3']], val: '1' },
    { id: 'a4', label: '4. [A] Saya dapat duduk santai dan merasa tenang', type: 'select', options: [['Selalu (0)', '0'], ['Biasanya (1)', '1'], ['Jarang (2)', '2'], ['Sama sekali tidak bisa (3)', '3']], val: '1' },
    { id: 'a5', label: '5. [A] Saya merasakan sensasi berdebar/gemetar di perut', type: 'select', options: [['Tidak pernah (0)', '0'], ['Kadang-kadang (1)', '1'], ['Cukup sering (2)', '2'], ['Sangat sering (3)', '3']], val: '0' },
    { id: 'a6', label: '6. [A] Saya merasa gelisah dan tidak bisa diam', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Tidak terlalu (1)', '1'], ['Cukup sering (2)', '2'], ['Sangat gelisah (3)', '3']], val: '0' },
    { id: 'a7', label: '7. [A] Saya tiba-tiba merasakan perasaan panik', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Jarang (1)', '1'], ['Cukup sering (2)', '2'], ['Sangat sering (3)', '3']], val: '0' },

    // HADS-D (Depression)
    { id: 'd1', label: '8. [D] Saya masih menikmati hal-hal yang dulu saya sukai', type: 'select', options: [['Pasti sama seperti dulu (0)', '0'], ['Tidak sebanyak dulu (1)', '1'], ['Hanya sedikit (2)', '2'], ['Hampir tidak sama sekali (3)', '3']], val: '1' },
    { id: 'd2', label: '9. [D] Saya dapat tertawa dan melihat sisi lucu dari berbagai hal', type: 'select', options: [['Sama seperti dulu (0)', '0'], ['Sekarang tidak terlalu banyak (1)', '1'], ['Pasti kurang sekarang (2)', '2'], ['Sama sekali tidak bisa (3)', '3']], val: '1' },
    { id: 'd3', label: '10. [D] Saya merasa gembira / ceria', type: 'select', options: [['Sebagian besar waktu (0)', '0'], ['Kadang-kadang (1)', '1'], ['Jarang (2)', '2'], ['Sama sekali tidak pernah (3)', '3']], val: '1' },
    { id: 'd4', label: '11. [D] Saya merasa seolah-olah saya bergerak lambat', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Kadang-kadang (1)', '1'], ['Sangat sering (2)', '2'], ['Hampir sepanjang waktu (3)', '3']], val: '0' },
    { id: 'd5', label: '12. [D] Saya kehilangan minat pada penampilan diri saya', type: 'select', options: [['Saya merawat diri sebaik dulu (0)', '0'], ['Mungkin kurang peduli dibanding dulu (1)', '1'], ['Saya tidak merawat diri dengan baik (2)', '2'], ['Sama sekali tidak peduli (3)', '3']], val: '0' },
    { id: 'd6', label: '13. [D] Saya menantikan hal-hal yang menyenangkan di masa depan', type: 'select', options: [['Sama seperti dulu (0)', '0'], ['Agak kurang dari dulu (1)', '1'], ['Pasti kurang dari dulu (2)', '2'], ['Hampir tidak pernah (3)', '3']], val: '1' },
    { id: 'd7', label: '14. [D] Saya dapat menikmati buku, radio, atau acara TV yang bagus', type: 'select', options: [['Sering (0)', '0'], ['Kadang-kadang (1)', '1'], ['Jarang (2)', '2'], ['Sangat jarang (3)', '3']], val: '0' }
  ],
  compute: v => {
    const scoreA = Number(v.a1 || 0) + Number(v.a2 || 0) + Number(v.a3 || 0) + Number(v.a4 || 0) + Number(v.a5 || 0) + Number(v.a6 || 0) + Number(v.a7 || 0);
    const scoreD = Number(v.d1 || 0) + Number(v.d2 || 0) + Number(v.d3 || 0) + Number(v.d4 || 0) + Number(v.d5 || 0) + Number(v.d6 || 0) + Number(v.d7 || 0);

    function interpret(s) {
      if (s <= 7) return { text: 'Normal (Tanpa Distres Signifikan)', cls: 'ok' };
      if (s <= 10) return { text: 'Borderline / Gejala Subklinis Ringan', cls: 'warn' };
      return { text: 'Kasus Bermakna Klinis (Sedang-Berat)', cls: 'bad' };
    }

    const resA = interpret(scoreA);
    const resD = interpret(scoreD);
    const overallCls = (scoreA >= 11 || scoreD >= 11) ? 'bad' : (scoreA >= 8 || scoreD >= 8) ? 'warn' : 'ok';

    const resume = `[HOSPITAL ANXIETY AND DEPRESSION SCALE (HADS)]\n` +
      `- Subskala Ansietas (HADS-A): ${scoreA} / 21 (${resA.text})\n` +
      `- Subskala Depresi (HADS-D): ${scoreD} / 21 (${resD.text})\n` +
      `- Kesimpulan: ${overallCls === 'bad' ? 'Terindikasi intervensi psikososial/konsul Psikosomatis.' : overallCls === 'warn' ? 'Perlu evaluasi berkala dan konseling suportif.' : 'Dalam batas normal.'}`;

    return {
      value: `A: ${scoreA} (${scoreA >= 11 ? 'Abnormal' : scoreA >= 8 ? 'Borderline' : 'Normal'}) | D: ${scoreD} (${scoreD >= 11 ? 'Abnormal' : scoreD >= 8 ? 'Borderline' : 'Normal'})`,
      text: `<b>Ansietas (HADS-A):</b> ${scoreA}/21 — <span class="${resA.cls}">${resA.text}</span><br>` +
            `<b>Depresi (HADS-D):</b> ${scoreD}/21 — <span class="${resD.cls}">${resD.text}</span>`,
      cls: overallCls,
      resume
    };
  }
});

// 2. Patient Health Questionnaire-9 (PHQ-9)
reg({
  id: 'phq9',
  nama: 'Patient Health Questionnaire-9 (PHQ-9)',
  divisi: 'Psikosomatis',
  tags: 'phq9 depresi depression psikosomatis dsm suicidality skrining',
  batch: 'M7',
  fields: [
    { id: 'q1', label: '1. Kurang berminat atau kurang bergairah dalam melakukan apapun', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q2', label: '2. Merasa murung, sedih, atau putus asa', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q3', label: '3. Sulit tidur, sering terbangun, atau tidur terlalu banyak', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q4', label: '4. Merasa lelah atau kurang bertenaga', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q5', label: '5. Nafsu makan kurang atau makan berlebihan', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q6', label: '6. Merasa buruk tentang diri sendiri atau merasa gagal', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q7', label: '7. Sulit berkonsentrasi pada hal-hal seperti membaca koran/menonton TV', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q8', label: '8. Bergerak/berbicara sangat lambat, atau gelisah/resah', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'q9', label: '9. Memiliki pikiran bahwa Anda lebih baik mati atau ingin melukai diri', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' }
  ],
  compute: v => {
    let score = 0;
    for (let i = 1; i <= 9; i++) {
      score += Number(v['q' + i] || 0);
    }
    const hasSuicide = Number(v.q9 || 0) > 0;

    let cat = '', cls = 'ok', tatalaksana = '';
    if (score <= 4) {
      cat = 'Depresi Minimal / Tanpa Depresi';
      tatalaksana = 'Tidak memerlukan intervensi farmakologis khusus.';
      cls = 'ok';
    } else if (score <= 9) {
      cat = 'Depresi Ringan';
      tatalaksana = 'Watchful waiting, psikoedukasi, evaluasi ulang dalam 1 bulan.';
      cls = 'ok';
    } else if (score <= 14) {
      cat = 'Depresi Sedang (Moderate)';
      tatalaksana = 'Pertimbangkan psikoterapi (CBT) dan/atau farmakoterapi antidepresan (SSRI).';
      cls = 'warn';
    } else if (score <= 19) {
      cat = 'Depresi Sedang-Berat (Moderately Severe)';
      tatalaksana = 'Inisiasi antidepresan lini pertama dan/atau psikoterapi intensif.';
      cls = 'bad';
    } else {
      cat = 'Depresi Berat (Severe)';
      tatalaksana = 'Inisiasi segera antidepresan + rujuk/konsul Psikiatri/Psikosomatis.';
      cls = 'bad';
    }

    const suicideWarning = hasSuicide ? '<br><span style="color:#ef4444;font-weight:bold;">⚠️ PERINGATAN: Pasien memiliki ide mencederai diri/bunuh diri (Poin 9 aktif). Wajib evaluasi keamanan segera!</span>' : '';

    const resume = `[PATIENT HEALTH QUESTIONNAIRE-9 (PHQ-9)]\n` +
      `- Total Skor: ${score} / 27 (${cat})\n` +
      `- Saran: ${tatalaksana}\n` +
      (hasSuicide ? `- PERINGATAN: Terdapat ide bunuh diri/melukai diri aktif (Poin 9 = ${v.q9}).` : '');

    return {
      value: `${score} Poin (${cat.split(' ')[0]})`,
      text: `<b>Skor PHQ-9: ${score} / 27</b> — <b>${cat}</b><br>${tatalaksana}${suicideWarning}`,
      cls: hasSuicide ? 'bad' : cls,
      resume
    };
  }
});

// 3. Generalized Anxiety Disorder-7 (GAD-7)
reg({
  id: 'gad7',
  nama: 'Generalized Anxiety Disorder-7 (GAD-7)',
  divisi: 'Psikosomatis',
  tags: 'gad7 cemas anxiety panik psikosomatis skrining',
  batch: 'M7',
  fields: [
    { id: 'g1', label: '1. Merasa gugup, cemas, atau gelisah', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'g2', label: '2. Tidak mampu menghentikan atau mengendalikan kekhawatiran', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'g3', label: '3. Terlalu mengkhawatirkan berbagai hal yang berbeda', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'g4', label: '4. Kesulitan untuk bersantai / rileks', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'g5', label: '5. Begitu gelisah sehingga sulit untuk duduk diam', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'g6', label: '6. Menjadi mudah jengkel atau lekas marah', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' },
    { id: 'g7', label: '7. Merasa takut seolah-olah sesuatu yang mengerikan akan terjadi', type: 'select', options: [['Sama sekali tidak (0)', '0'], ['Beberapa hari (1)', '1'], ['Lebih dari separuh waktu (2)', '2'], ['Hampir setiap hari (3)', '3']], val: '0' }
  ],
  compute: v => {
    let score = 0;
    for (let i = 1; i <= 7; i++) {
      score += Number(v['g' + i] || 0);
    }

    let cat = '', cls = 'ok';
    if (score <= 4) {
      cat = 'Kecemasan Minimal';
      cls = 'ok';
    } else if (score <= 9) {
      cat = 'Kecemasan Ringan';
      cls = 'ok';
    } else if (score <= 14) {
      cat = 'Kecemasan Sedang (Moderate Anxiety)';
      cls = 'warn';
    } else {
      cat = 'Kecemasan Berat (Severe Anxiety)';
      cls = 'bad';
    }

    const resume = `[GENERALIZED ANXIETY DISORDER-7 (GAD-7)]\n` +
      `- Total Skor: ${score} / 21 (${cat})\n` +
      `- Rekomendasi: ${score >= 10 ? 'Indikasi evaluasi klinis mendalam dan intervensi kecemasan aktif.' : 'Kondisi kecemasan terkontrol.'}`;

    return {
      value: `${score} Poin (${cat.split(' ')[1] || cat})`,
      text: `<b>Skor GAD-7: ${score} / 21</b> — <b>${cat}</b>`,
      cls,
      resume
    };
  }
});

// 4. Drip Analgetik / Pain Management Titrator (Morfin & Fentanyl)
reg({
  id: 'pain-titrator',
  nama: 'Drip Pain Management Titrator (Morfin & Fentanyl)',
  divisi: 'Psikosomatis',
  tags: 'nyeri pain paliatif morfin fentanyl syringe pump konsul cppt analgetik',
  batch: 'M7',
  fields: [
    { id: 'opioid', label: 'Pilihan Opioid IV Kontinu', type: 'select', options: [['Morfin IV Drip (0.2 – 0.6 mg/kgBB/hari)', 'morphine'], ['Fentanyl IV Drip (0.25 – 0.5 mcg/kgBB/jam)', 'fentanyl']], val: 'morphine' },
    { id: 'bb', label: 'Berat Badan Pasien (kg)', type: 'number', step: 1, val: 50, ctx: 'bb' },
    { id: 'dose_target', label: 'Intensitas Dosis', type: 'select', options: [['Dosis Rendah (Inisiasi)', 'low'], ['Dosis Menengah (Standar)', 'mid'], ['Dosis Tinggi (Refrakter)', 'high']], val: 'mid' }
  ],
  compute: v => {
    const bb = Number(v.bb || 50);
    let outputText = '', resumeText = '', valSummary = '';

    if (v.opioid === 'morphine') {
      // Dosis: 0.2 - 0.6 mg/kgBB/hari (atau cc/kgBB/hari)
      let mgPerKgDay = v.dose_target === 'low' ? 0.2 : v.dose_target === 'mid' ? 0.4 : 0.6;
      let totalMgDay = mgPerKgDay * bb;
      // Dilarutkan dalam 20 cc NaCl 0.9%, habis dalam 24 jam -> 20 cc / 24 jam = 0.83 cc/jam (~ 0.8 cc/jam)
      valSummary = `${totalMgDay.toFixed(1)} mg/hari (0.8 cc/jam)`;
      outputText = `<b>Drip Morfin Harian:</b><br>` +
        `• Dosis harian terpilih: ${mgPerKgDay} mg/kgBB/hari × ${bb} kg = <b>${totalMgDay.toFixed(1)} mg/24 jam</b><br>` +
        `• Pelarut: <b>NaCl 0.9% ad 20 cc</b> pada syringe pump<br>` +
        `• Kecepatan infus: <b>0.8 cc/jam</b> (habis tepat dalam 24 jam)`;

      resumeText = `Drip Pain Management (Morfin)\n` +
        `*hitung dosis harian berdasarkan berat badan (kecepatan selalu sama, untuk dihabiskan dalam 24 jam)\n\n` +
        `*MORFIN*\n` +
        `Dosis: ${mgPerKgDay} mg/kgBB/hari (${bb} kg)\n` +
        `Ketikan (untuk kebutuhan drip dalam 1 hari):\n` +
        `* Drip morfin ${totalMgDay.toFixed(1)} mg dalam 20cc NaCl 0.9%; kecepatan 0.8cc/jam`;
    } else {
      // Fentanyl: 0.25 - 0.5 mcg/kgBB/jam
      let mcgKgHr = v.dose_target === 'low' ? 0.25 : v.dose_target === 'mid' ? 0.35 : 0.5;
      let mcgPerHr = mcgKgHr * bb;
      let totalMcgDay = mcgPerHr * 24;
      // Dilarutkan dalam 50 cc NaCl 0.9%, habis dalam 24 jam -> 50 cc / 24 jam = 2.08 cc/jam (~ 2.1 cc/jam)
      valSummary = `${totalMcgDay.toFixed(0)} mcg/hari (2.1 cc/jam)`;
      outputText = `<b>Drip Fentanyl Harian:</b><br>` +
        `• Dosis terpilih: ${mcgKgHr} mcg/kgBB/jam = <b>${mcgPerHr.toFixed(1)} mcg/jam</b> (Total: <b>${totalMcgDay.toFixed(0)} mcg/24 jam</b>)<br>` +
        `• Pelarut: <b>NaCl 0.9% ad 50 cc</b> pada syringe pump<br>` +
        `• Kecepatan infus: <b>2.1 cc/jam</b> (habis tepat dalam 24 jam)`;

      resumeText = `Drip Pain Management (Fentanyl)\n` +
        `*hitung dosis harian berdasarkan berat badan (kecepatan selalu sama, untuk dihabiskan dalam 24 jam)\n\n` +
        `*FENTANYL*\n` +
        `Dosis: ${mcgKgHr} mcg/kgBB/jam (${bb} kg)\n` +
        `Ketikan (untuk kebutuhan drip dalam 1 hari):\n` +
        `* Drip fentanyl ${totalMcgDay.toFixed(0)} mcg dalam 50cc NaCl 0.9%; kecepatan 2.1cc/ jam`;
    }

    return {
      value: valSummary,
      text: outputText,
      cls: 'ok',
      resume: resumeText
    };
  }
});
