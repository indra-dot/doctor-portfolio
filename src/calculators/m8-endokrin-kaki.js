/* ==========================================================================
   MODULE 8: ENDOKRIN, STATUS KAKI DIABETIK & STEROID (m8-endokrin-kaki.js)
   - Status Kaki Diabetik (PEDIS, Wagner-Meggit, Texas, & ABI Interpreter)
   - Suplementasi Kortikosteroid Perioperatif / Stres Medis (Tabel 12 Appel/Annane)
   - Tatalaksana Gula Darah & Drip Insulin Basal / ICU / Perioperatif
   ========================================================================== */

// 1. Status Kaki Diabetik & ABI Interpreter
reg({
  id: 'pedis-wagner',
  nama: 'Status Kaki Diabetik (PEDIS, Wagner, Texas & ABI)',
  divisi: 'Endokrin-Metabolik',
  tags: 'pedis wagner texas abi kaki diabetik ulkus gangren amputasi monofilamen endokrin',
  batch: 'M8',
  fields: [
    { id: 'regio', label: 'Regio Pedis', type: 'select', options: [['Pedis Sinistra (Kiri)', 'sinistra'], ['Pedis Dextra (Kanan)', 'dextra'], ['Bilateral', 'bilateral']], val: 'sinistra' },
    { id: 'abi_val', label: 'Nilai ABI (Ankle-Brachial Index)', type: 'number', step: 0.01, val: 1.00 },
    { id: 'monofilament', label: 'Tes Sensibilitas Monofilamen 10g', type: 'select', options: [['Normal / Sensasi Utuh (+)', 'intact'], ['Terganggu / Hilang Sensasi Proteksi (-)', 'loss']], val: 'loss' },
    
    // Dimensi & Karakteristik Ulkus
    { id: 'ulcer_len', label: 'Panjang Ulkus (cm)', type: 'number', step: 0.1, val: 4.0 },
    { id: 'ulcer_wid', label: 'Lebar Ulkus (cm)', type: 'number', step: 0.1, val: 3.0 },
    { id: 'depth', label: 'Kedalaman Ulkus (Depth)', type: 'select', options: [
      ['Derajat 0: Kulit utuh / Kalus pre-ulkus', '0'],
      ['Derajat 1: Superfisial (hanya dermis, tidak menembus subkutan)', '1'],
      ['Derajat 2: Dalam (mencapai tendon, fasia, kapsul sendi, atau otot)', '2'],
      ['Derajat 3: Menembus tulang / osteomielitis / abses sendi', '3']
    ], val: '2' },
    { id: 'infection', label: 'Derajat Infeksi (Infection)', type: 'select', options: [
      ['Grade 1: Tanpa tanda infeksi / pus', '1'],
      ['Grade 2: Infeksi Ringan (eritema < 2 cm dari tepi ulkus)', '2'],
      ['Grade 3: Infeksi Sedang (eritema ≥ 2 cm, abses dalam, osteitis, fasitis)', '3'],
      ['Grade 4: Infeksi Berat / Disertai SIRS / Sepsis', '4']
    ], val: '1' },
    { id: 'gangrene', label: 'Kondisi Gangren / Nekrosis', type: 'select', options: [
      ['Tidak ada gangren', 'none'],
      ['Gangren Terlokalisir (misal terbatas pada digiti/jari kaki)', 'localized'],
      ['Gangren Luas (meliputi seluruh forefoot / hindfoot)', 'extensive']
    ], val: 'none' },

    // Temuan Fisik Tambahan
    { id: 'dry_skin', label: 'Kulit kering / tumit pecah-pecah', type: 'check' },
    { id: 'hair_loss', label: 'Bulu rambut ekstremitas menipis', type: 'check' },
    { id: 'maceration', label: 'Maserasi interdigital', type: 'check' },
    { id: 'prior_amp', label: 'Riwayat amputasi jari sebelumnya', type: 'check' }
  ],
  compute: v => {
    const abi = Number(v.abi_val || 1.0);
    const area = (Number(v.ulcer_len || 0) * Number(v.ulcer_wid || 0)).toFixed(1);

    // 1. ABI Interpretation
    let abiCat = '';
    if (abi > 1.30) abiCat = 'Non-compressible / Kalsifikasi Arteri Berat';
    else if (abi >= 0.91) abiCat = 'Normal (Perfusi Adekuat)';
    else if (abi >= 0.70) abiCat = 'Penyakit Arteri Perifer (PAD) Ringan';
    else if (abi >= 0.41) abiCat = 'Penyakit Arteri Perifer (PAD) Sedang';
    else abiCat = 'PAD Berat / Iskemik Mengancam Ekstremitas';

    // 2. Wagner Classification
    let wagnerGrade = 0;
    if (v.gangrene === 'extensive') wagnerGrade = 5;
    else if (v.gangrene === 'localized') wagnerGrade = 4;
    else if (v.depth === '3') wagnerGrade = 3;
    else if (v.depth === '2') wagnerGrade = 2;
    else if (v.depth === '1') wagnerGrade = 1;
    else wagnerGrade = 0;

    const wagnerDesc = [
      'Grade 0: Kulit utuh / Pre-ulcerative lesion',
      'Grade 1: Ulkus superfisial tanpa infeksi jaringan dalam',
      'Grade 2: Ulkus dalam mencapai tendon / kapsul sendi tanpa abses/osteomielitis',
      'Grade 3: Ulkus dalam dengan abses, osteomielitis, atau infeksi sendi',
      'Grade 4: Gangren terlokalisir (digiti / forefoot)',
      'Grade 5: Gangren luas melibatkan seluruh kaki (ekstensif)'
    ];

    // 3. PEDIS Score
    let p_grade = abi >= 0.9 ? 1 : (abi >= 0.5 ? 2 : 3);
    let e_desc = `${area} cm²`;
    let d_grade = Number(v.depth || 1);
    let i_grade = Number(v.infection || 1);
    let s_grade = v.monofilament === 'loss' ? 2 : 1;

    let cls = (wagnerGrade >= 3 || i_grade >= 3 || abi < 0.5) ? 'bad' : (wagnerGrade >= 2 || i_grade >= 2) ? 'warn' : 'ok';

    const resume = `==================================\n` +
      `STATUS KAKI DIABETIK\n\n` +
      `Regio Pedis ${v.regio.toUpperCase()}\n` +
      `Kulit kaki kering (${v.dry_skin ? '+' : '-'}) tumit pecah-pecah (${v.dry_skin ? '+' : '-'}) bulu rambut menipis (${v.hair_loss ? '+' : '-'}) maserasi interdigital (${v.maceration ? '+' : '-'})\n` +
      `Ulkus (+) ukuran ${v.ulcer_len} x ${v.ulcer_wid} cm (Luas: ${area} cm²)\n` +
      `Dasar luka: ${v.depth === '3' ? 'tulang / osteomielitis' : v.depth === '2' ? 'otot / tendon' : 'superfisial dermis'}\n` +
      `Infeksi: Grade ${i_grade} (${v.infection === '1' ? 'Tanpa tanda infeksi' : 'Disertai infeksi'})\n` +
      `Gangren: ${v.gangrene}\n` +
      `Amputasi jari kaki: ${v.prior_amp ? '(+) riwayat amputasi' : '(-)'}\n` +
      `Tes monofilamen pada pedis: ${v.monofilament === 'loss' ? '(-) Hilang sensasi proteksi' : '(+) Normal'}\n\n` +
      `Vaskularisasi & ABI:\n` +
      `- ABI: ${abi.toFixed(2)} (${abiCat})\n\n` +
      `Staging Klinis:\n` +
      `- Wagner-Meggit: ${wagnerDesc[wagnerGrade]}\n` +
      `- Klasifikasi PEDIS: P${p_grade} E(${e_desc}) D${d_grade} I${i_grade} S${s_grade}\n` +
      `==================================`;

    return {
      value: `Wagner ${wagnerGrade} | PEDIS P${p_grade}E${d_grade}I${i_grade}S${s_grade}`,
      text: `<b>${wagnerDesc[wagnerGrade]}</b><br>` +
            `• <b>ABI:</b> ${abi.toFixed(2)} (${abiCat})<br>` +
            `• <b>PEDIS:</b> Perfusi P${p_grade}, Luas ${area} cm², Kedalaman D${d_grade}, Infeksi I${i_grade}, Sensasi S${s_grade}`,
      cls,
      resume
    };
  }
});

// 2. Suplementasi Kortikosteroid Perioperatif / Stres Medis (Tabel 12 Appel/Annane)
reg({
  id: 'steroid-perioperative',
  nama: 'Rekomendasi Suplementasi Kortikosteroid Perioperatif',
  divisi: 'Endokrin-Metabolik',
  tags: 'kortikosteroid steroid hidrokortison metilprednisolon stres operasi insufisiensi adrenal preop',
  batch: 'M8',
  fields: [
    { id: 'stress_level', label: 'Derajat Stres Medis atau Operasi', type: 'select', options: [
      ['Minor (Hernia inguinalis, kolonoskopi, demam ringan, GE ringan-sedang)', 'minor'],
      ['Sedang (Kolesistektomi, hemikolektomi, demam tinggi, pneumonia, GE berat)', 'moderate'],
      ['Berat (Operasi kardiotoraks mayor, Whipple, reseksi hepar, pankreatitis)', 'severe'],
      ['Kondisi Kritis (Syok septik, hipotensi refrakter sepsis)', 'critical']
    ], val: 'moderate' }
  ],
  compute: v => {
    let dosis = '', detail = '', cls = 'ok';

    if (v.stress_level === 'minor') {
      dosis = '25 mg hidrokortison ATAU 5 mg metilprednisolon intravena pada hari prosedur.';
      detail = 'Diberikan saat induksi anestesi. Pada hari berikutnya pasien dapat langsung kembali ke dosis steroid rumatan oral biasa.';
      cls = 'ok';
    } else if (v.stress_level === 'moderate') {
      dosis = '50–75 mg hidrokortison ATAU 10–15 mg metilprednisolon intravena pada hari prosedur.';
      detail = 'Diturunkan secara cepat dalam 1–2 hari ke dosis awal. Atau: Dosis steroid yang biasa digunakan ditambah + 25 mg Hidrokortison saat induksi + 100 mg hidrokortison/hari.';
      cls = 'warn';
    } else if (v.stress_level === 'severe') {
      dosis = '100–150 mg hidrokortison ATAU 20–30 mg metilprednisolon intravena pada hari prosedur.';
      detail = 'Diturunkan dengan cepat dalam 1–2 hari ke dosis awal rumatan pasca operasi stabil.';
      cls = 'bad';
    } else {
      dosis = '50 mg hidrokortison intravena setiap 6 jam (200 mg/hari) DENGAN 50 µg fludrokortison/hari selama 7 hari.';
      detail = 'Protokol syok septik / hipotensi refrakter vasopresor (Annane et al.). Tappering off bertahap setelah vasopresor berhasil disapih.';
      cls = 'bad';
    }

    const resume = `[REKOMENDASI SUPLEMENTASI KORTIKOSTEROID PERIOPERATIF / STRES MEDIS]\n` +
      `Kategori: ${v.stress_level.toUpperCase()}\n` +
      `Dosis Rekomendasi: ${dosis}\n` +
      `Instruksi: ${detail}\n` +
      `*Sumber: Panduan Suplementasi Kortikosteroid (Appel GB, Silva FG, Pirani CL / Annane dkk.)`;

    return {
      value: `${v.stress_level.toUpperCase()} STRESS`,
      text: `<b>Dosis Rekomendasi:</b><br>${dosis}<br><br><span style="color:var(--mut);">Instruksi: ${detail}</span>`,
      cls,
      resume
    };
  }
});

// 3. Tatalaksana Gula Darah & Drip Insulin Basal / Perioperatif
reg({
  id: 'insulin-perioperative',
  nama: 'Tatalaksana Gula Darah & Drip Insulin Perioperatif / ICU',
  divisi: 'Endokrin-Metabolik',
  tags: 'insulin drip sliding scale gds perioperatif kad hhs icu gula darah',
  batch: 'M8',
  fields: [
    { id: 'cur_bs', label: 'Gula Darah Saat Ini (mg/dL)', type: 'number', step: 1, val: 240, ctx: 'glu' },
    { id: 'prior_bs', label: 'Gula Darah 1 Jam Sebelumnya (bila evaluasi drip)', type: 'number', step: 1, val: 280 },
    { id: 'cur_rate', label: 'Kecepatan Drip Insulin Saat Ini (Unit/jam)', type: 'number', step: 0.5, val: 2.0 },
    { id: 'condition', label: 'Kondisi Klinis Pasien', type: 'select', options: [
      ['Pasien Puasa Preoperatif / Perioperatif', 'preop'],
      ['Pasien Kritis / Syok / Kebutuhan Basal ICU', 'icu']
    ], val: 'preop' }
  ],
  compute: v => {
    const bs = Number(v.cur_bs || 200);
    const prevBs = v.prior_bs ? Number(v.prior_bs) : null;
    const curRate = Number(v.cur_rate || 0);

    let tindakan = '', targetDrip = '', cls = 'ok';

    if (bs < 100) {
      cls = 'bad';
      tindakan = '<b>Standby OFF drip insulin!</b> Maintenance infus D5% 20 tpm. Monitor BS tiap 1 jam.';
      targetDrip = '0 Unit/jam (OFF)';
    } else if (bs < 140) {
      cls = 'ok';
      tindakan = 'Turunkan kecepatan drip menjadi <b>0.5 Unit/jam</b>. Monitor BS tiap 4 jam.';
      targetDrip = '0.5 Unit/jam';
    } else if (bs <= 180) {
      cls = 'ok';
      tindakan = '<b>Target BS Tercapai (140 – 180 mg/dL)!</b> Pertahankan drip <b>1 Unit/jam</b>.';
      targetDrip = '1.0 Unit/jam';
    } else if (bs <= 250) {
      cls = 'warn';
      if (v.condition === 'preop') {
        tindakan = 'Berikan <b>Correctional dose Insulin Rapid 3 Unit Subkutan (SC)</b>. Evaluasi BS 2-4 jam.';
        targetDrip = 'Rapid 3 U SC';
      } else {
        tindakan = 'Jalankan drip insulin <b>1 – 2 Unit/jam</b>. Evaluasi BS tiap 2 jam.';
        targetDrip = '1.5 Unit/jam';
      }
    } else {
      cls = 'bad';
      let newRate = curRate > 0 ? curRate + 1 : 2.0;
      tindakan = `GDS > 250 mg/dL: Mulai/Titrasi Drip Insulin Aspart (50 unit dalam NS 50 mL). Jalankan <b>${newRate} Unit/jam</b> (${newRate} cc/jam).`;
      targetDrip = `${newRate} Unit/jam`;
    }

    // Evaluasi Delta Penurunan GDS
    let deltaNote = '';
    if (prevBs !== null) {
      const drop = prevBs - bs;
      if (drop > 75) {
        deltaNote = `<br><span style="color:var(--warn);">⚠️ Penurunan GDS cepat (${drop} mg/dL dalam 1 jam > 75 mg/dL) ➔ Turunkan drip 1 Unit/jam untuk cegah hipoglikemia!</span>`;
      } else if (drop < 50 && bs > 200) {
        deltaNote = `<br><span style="color:var(--warn);">⚠️ Penurunan GDS lambat (${drop} mg/dL dalam 1 jam < 50 mg/dL) ➔ Naikkan drip 1 Unit/jam.</span>`;
      }
    }

    const templateKonsul = `[TATALAKSANA GULA DARAH PERIOPERATIF / BASAL INFUSION]\n` +
      `- Cek BS tiap 2-4 jam perioperatif selama pasien puasa\n` +
      `- Status Saat Ini: GDS ${bs} mg/dL ➔ ${tindakan.replace(/<[^>]+>/g, '')}\n` +
      `- Protokol Standar:\n` +
      `  * Bila BS < 100 mg/dL : Standby off drip, infus maintenance D5% 20 tpm, monitor BS tiap 1 jam\n` +
      `  * Bila BS 100-139 mg/dL : Jalan 0.5 unit/jam\n` +
      `  * Bila BS 140-180 mg/dL : Target optimal, jalan 1 unit/jam\n` +
      `  * Bila BS 200-250 mg/dL : Correctional dose insulin rapid 3 unit SC\n` +
      `  * Bila BS > 250 mg/dL : Drip insulin aspart (50 unit dalam NS 50 ml) jalan 0.5 - 2 unit/jam\n` +
      `- Monitoring Wajib:\n` +
      `  * Cek Kalium serum tiap 6-8 jam selama drip insulin berjalan\n` +
      `  * Target BS perioperatif: 140 - 180 mg/dL`;

    return {
      value: `Target: ${targetDrip}`,
      text: `${tindakan}${deltaNote}<br><br><span style="color:var(--mut);">Target BS perioperatif: 140 – 180 mg/dL | Monitor K+ q6-8h</span>`,
      cls,
      resume: templateKonsul
    };
  }
});
