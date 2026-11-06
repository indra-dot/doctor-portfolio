const assert = require('assert');

/**
 * Worker M3 - Rheumatology Calculation Engine Verification
 */
const RheumaCalc = {
  // DAS28-CRP (CRP in mg/L, PGA in 0-100 mm VAS)
  calculateDAS28_CRP(tjc, sjc, crp_mg_L, pga) {
    if (tjc === '' || tjc === null || tjc === undefined || isNaN(tjc)) throw new Error('Tender Joint Count (TJC) wajib diisi');
    if (sjc === '' || sjc === null || sjc === undefined || isNaN(sjc)) throw new Error('Swollen Joint Count (SJC) wajib diisi');
    if (crp_mg_L === '' || crp_mg_L === null || crp_mg_L === undefined || isNaN(crp_mg_L)) throw new Error('Kadar CRP wajib diisi');
    if (pga === '' || pga === null || pga === undefined || isNaN(pga)) throw new Error('Penilaian Global Pasien (PGA) wajib diisi');

    const t = Number(tjc);
    const s = Number(sjc);
    const c = Number(crp_mg_L);
    const p = Number(pga);

    if (t < 0 || t > 28) throw new Error('TJC harus bernilai antara 0 dan 28');
    if (s < 0 || s > 28) throw new Error('SJC harus bernilai antara 0 dan 28');
    if (c < 0) throw new Error('Kadar CRP harus >= 0 mg/L');
    if (p < 0 || p > 100) throw new Error('PGA harus bernilai antara 0 dan 100');

    // Formula: 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.36*ln(CRP+1) + 0.014*(PGA) + 0.96
    const scoreRaw = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.36 * Math.log(c + 1) + 0.014 * p + 0.96;
    const score = Math.round(scoreRaw * 100) / 100;
    return {
      scoreRaw,
      score: score.toFixed(2),
      numericScore: score,
      activity: this.classifyDAS28(score)
    };
  },

  // DAS28-ESR (ESR in mm/hr, PGA in 0-100 mm VAS)
  calculateDAS28_ESR(tjc, sjc, esr, pga) {
    if (tjc === '' || tjc === null || tjc === undefined || isNaN(tjc)) throw new Error('Tender Joint Count (TJC) wajib diisi');
    if (sjc === '' || sjc === null || sjc === undefined || isNaN(sjc)) throw new Error('Swollen Joint Count (SJC) wajib diisi');
    if (esr === '' || esr === null || esr === undefined || isNaN(esr)) throw new Error('Laju Endap Darah (ESR) wajib diisi');
    if (pga === '' || pga === null || pga === undefined || isNaN(pga)) throw new Error('Penilaian Global Pasien (PGA) wajib diisi');

    const t = Number(tjc);
    const s = Number(sjc);
    const e = Number(esr);
    const p = Number(pga);

    if (t < 0 || t > 28) throw new Error('TJC harus bernilai antara 0 dan 28');
    if (s < 0 || s > 28) throw new Error('SJC harus bernilai antara 0 dan 28');
    if (e < 1) throw new Error('ESR Westergren harus >= 1 mm/jam (karena ln(<=0) tidak terdefinisi)');
    if (p < 0 || p > 100) throw new Error('PGA harus bernilai antara 0 dan 100');

    // Formula: 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.70*ln(ESR) + 0.014*(PGA)
    const scoreRaw = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.70 * Math.log(e) + 0.014 * p;
    const score = Math.round(scoreRaw * 100) / 100;
    return {
      scoreRaw,
      score: score.toFixed(2),
      numericScore: score,
      activity: this.classifyDAS28(score)
    };
  },

  // CDAI (TJC28 + SJC28 + PGA[0-10] + EGA[0-10])
  calculateCDAI(tjc, sjc, pga_10, ega_10) {
    if (tjc === '' || tjc === null || tjc === undefined || isNaN(tjc)) throw new Error('Tender Joint Count (TJC) wajib diisi');
    if (sjc === '' || sjc === null || sjc === undefined || isNaN(sjc)) throw new Error('Swollen Joint Count (SJC) wajib diisi');
    if (pga_10 === '' || pga_10 === null || pga_10 === undefined || isNaN(pga_10)) throw new Error('Penilaian Pasien (PGA 0-10) wajib diisi');
    if (ega_10 === '' || ega_10 === null || ega_10 === undefined || isNaN(ega_10)) throw new Error('Penilaian Dokter/Evaluator (EGA 0-10) wajib diisi');

    const t = Number(tjc);
    const s = Number(sjc);
    const p = Number(pga_10);
    const e = Number(ega_10);

    if (t < 0 || t > 28) throw new Error('TJC harus bernilai antara 0 dan 28');
    if (s < 0 || s > 28) throw new Error('SJC harus bernilai antara 0 dan 28');
    if (p < 0 || p > 10) throw new Error('PGA harus bernilai antara 0 dan 10');
    if (e < 0 || e > 10) throw new Error('EGA harus bernilai antara 0 dan 10');

    const scoreRaw = t + s + p + e;
    const score = Math.round(scoreRaw * 100) / 100;
    return {
      scoreRaw,
      score: score.toFixed(2),
      numericScore: score,
      activity: this.classifyCDAI(score)
    };
  },

  // SDAI (CDAI + CRP in mg/dL)
  calculateSDAI(tjc, sjc, pga_10, ega_10, crp_mg_dL) {
    if (tjc === '' || tjc === null || tjc === undefined || isNaN(tjc)) throw new Error('Tender Joint Count (TJC) wajib diisi');
    if (sjc === '' || sjc === null || sjc === undefined || isNaN(sjc)) throw new Error('Swollen Joint Count (SJC) wajib diisi');
    if (pga_10 === '' || pga_10 === null || pga_10 === undefined || isNaN(pga_10)) throw new Error('Penilaian Pasien (PGA 0-10) wajib diisi');
    if (ega_10 === '' || ega_10 === null || ega_10 === undefined || isNaN(ega_10)) throw new Error('Penilaian Dokter/Evaluator (EGA 0-10) wajib diisi');
    if (crp_mg_dL === '' || crp_mg_dL === null || crp_mg_dL === undefined || isNaN(crp_mg_dL)) throw new Error('Kadar CRP (mg/dL) wajib diisi');

    const t = Number(tjc);
    const s = Number(sjc);
    const p = Number(pga_10);
    const e = Number(ega_10);
    const c = Number(crp_mg_dL);

    if (t < 0 || t > 28) throw new Error('TJC harus bernilai antara 0 dan 28');
    if (s < 0 || s > 28) throw new Error('SJC harus bernilai antara 0 dan 28');
    if (p < 0 || p > 10) throw new Error('PGA harus bernilai antara 0 dan 10');
    if (e < 0 || e > 10) throw new Error('EGA harus bernilai antara 0 dan 10');
    if (c < 0) throw new Error('CRP harus >= 0 mg/dL');

    const scoreRaw = t + s + p + e + c;
    const score = Math.round(scoreRaw * 100) / 100;
    return {
      scoreRaw,
      score: score.toFixed(2),
      numericScore: score,
      activity: this.classifySDAI(score)
    };
  },

  // DAPSA (TJC + SJC + CRP [mg/dL] + PGA [0-10] + Pain [0-10])
  calculateDAPSA(tjc, sjc, crp_mg_dL, pga, pain) {
    if (tjc === '' || isNaN(tjc) || sjc === '' || isNaN(sjc) || crp_mg_dL === '' || isNaN(crp_mg_dL) || pga === '' || isNaN(pga) || pain === '' || isNaN(pain)) {
      throw new Error('Semua input DAPSA wajib diisi');
    }
    const t = Number(tjc);
    const s = Number(sjc);
    const c = Number(crp_mg_dL);
    const p = Number(pga);
    const pn = Number(pain);
    if (t < 0 || t > 68 || s < 0 || s > 66 || c < 0 || p < 0 || p > 10 || pn < 0 || pn > 10) {
      throw new Error('Nilai input DAPSA di luar rentang valid');
    }
    const score = t + s + c + p + pn;
    return {
      score: score.toFixed(2),
      numericScore: score,
      activity: this.classifyDAPSA(score)
    };
  },

  // BASDAI
  calculateBASDAI(q1, q2, q3, q4, q5, q6) {
    const qs = [q1, q2, q3, q4, q5, q6];
    for (let i = 0; i < 6; i++) {
      if (qs[i] === '' || qs[i] === null || qs[i] === undefined || isNaN(qs[i])) {
        throw new Error(`Pertanyaan BASDAI Q${i+1} wajib diisi`);
      }
      const val = Number(qs[i]);
      if (val < 0 || val > 10) throw new Error(`Pertanyaan BASDAI Q${i+1} harus antara 0 dan 10`);
    }
    const score = ((Number(q1) + Number(q2) + Number(q3) + Number(q4)) + ((Number(q5) + Number(q6)) / 2)) / 5;
    return {
      score: score.toFixed(2),
      numericScore: score,
      active: score >= 4
    };
  },

  classifyDAS28(score) {
    if (isNaN(score)) return { level: 'Error', label: 'Input Tidak Valid' };
    if (score > 5.1) return { level: 'High', label: 'Aktivitas Penyakit Tinggi (High Activity)' };
    if (score > 3.2) return { level: 'Moderate', label: 'Aktivitas Penyakit Sedang (Moderate Activity)' };
    if (score > 2.6) return { level: 'Low', label: 'Aktivitas Penyakit Rendah (Low Activity)' };
    return { level: 'Remission', label: 'Remisi Klinis (Clinical Remission)' };
  },

  classifyCDAI(score) {
    if (isNaN(score)) return { level: 'Error', label: 'Input Tidak Valid' };
    if (score > 22.0) return { level: 'High', label: 'Aktivitas Penyakit Tinggi (High Activity)' };
    if (score > 10.0) return { level: 'Moderate', label: 'Aktivitas Penyakit Sedang (Moderate Activity)' };
    if (score > 2.8) return { level: 'Low', label: 'Aktivitas Penyakit Rendah (Low Activity)' };
    return { level: 'Remission', label: 'Remisi Klinis (Clinical Remission)' };
  },

  classifySDAI(score) {
    if (isNaN(score)) return { level: 'Error', label: 'Input Tidak Valid' };
    if (score > 26.0) return { level: 'High', label: 'Aktivitas Penyakit Tinggi (High Activity)' };
    if (score > 11.0) return { level: 'Moderate', label: 'Aktivitas Penyakit Sedang (Moderate Activity)' };
    if (score > 3.3) return { level: 'Low', label: 'Aktivitas Penyakit Rendah (Low Activity)' };
    return { level: 'Remission', label: 'Remisi Klinis (Clinical Remission)' };
  },

  classifyDAPSA(score) {
    if (score > 28) return { level: 'High', label: 'Aktivitas Penyakit Tinggi' };
    if (score > 14) return { level: 'Moderate', label: 'Aktivitas Penyakit Sedang' };
    if (score > 4) return { level: 'Low', label: 'Aktivitas Penyakit Rendah' };
    return { level: 'Remission', label: 'Remisi' };
  }
};

// --- RUN TESTS ---
console.log('--- Testing Rheumatology Calculations ---');

// Test 1: Benchmark from ORIGINAL_REQUEST.md (TJC=6, SJC=4, CRP=15, PGA=40)
const b1 = RheumaCalc.calculateDAS28_CRP(6, 4, 15, 40);
console.log('Benchmark 1 (TJC=6, SJC=4, CRP=15, PGA=40):', b1);
assert.strictEqual(b1.score, '4.45', 'DAS28-CRP score must be 4.45');
assert.strictEqual(b1.activity.level, 'Moderate', 'Activity level must be Moderate');

// Test 2: Zero CRP Bypass Fix (TJC=10, SJC=5, CRP=0, PGA=50)
const b2 = RheumaCalc.calculateDAS28_CRP(10, 5, 0, 50);
console.log('Zero CRP Test (TJC=10, SJC=5, CRP=0, PGA=50):', b2);
// 0.56*sqrt(10) [1.7708] + 0.28*sqrt(5) [0.6261] + 0 + 0.014*50 [0.70] + 0.96 = 4.0569 -> 4.06
assert.strictEqual(b2.score, '4.06', 'Score with CRP=0 must compute joint & PGA, not 0.00');
assert.strictEqual(b2.activity.level, 'Moderate');

// Test 3: True Remission with 0 joints, 0 CRP, 0 PGA
const b3 = RheumaCalc.calculateDAS28_CRP(0, 0, 0, 0);
console.log('True Zero Remission (TJC=0, SJC=0, CRP=0, PGA=0):', b3);
// 0 + 0 + 0 + 0 + 0.96 = 0.96
assert.strictEqual(b3.score, '0.96');
assert.strictEqual(b3.activity.level, 'Remission');

// Test 4: Cutoff exact boundaries for DAS28
// score <= 2.60 -> Remission
assert.strictEqual(RheumaCalc.classifyDAS28(2.60).level, 'Remission');
assert.strictEqual(RheumaCalc.classifyDAS28(2.61).level, 'Low');
assert.strictEqual(RheumaCalc.classifyDAS28(3.20).level, 'Low');
assert.strictEqual(RheumaCalc.classifyDAS28(3.21).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyDAS28(5.10).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyDAS28(5.11).level, 'High');

// Test 5: DAS28-ESR Westergren test
const esr1 = RheumaCalc.calculateDAS28_ESR(6, 4, 30, 40);
console.log('DAS28-ESR (TJC=6, SJC=4, ESR=30, PGA=40):', esr1);
// 0.56*sqrt(6) [1.3717] + 0.28*sqrt(4) [0.56] + 0.70*ln(30) [2.3808] + 0.014*40 [0.56] = 4.8725 -> 4.87
assert.strictEqual(esr1.score, '4.87');
assert.strictEqual(esr1.activity.level, 'Moderate');

// Test 6: DAS28-ESR invalid ESR <= 0
assert.throws(() => RheumaCalc.calculateDAS28_ESR(6, 4, 0, 40), /ESR Westergren harus >= 1/);
assert.throws(() => RheumaCalc.calculateDAS28_ESR(6, 4, -5, 40), /ESR Westergren harus >= 1/);

// Test 7: Negative joint count rejected
assert.throws(() => RheumaCalc.calculateDAS28_CRP(-1, 4, 15, 40), /TJC harus bernilai antara 0 dan 28/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, -2, 15, 40), /SJC harus bernilai antara 0 dan 28/);

// Test 8: Empty/blank input rejected
assert.throws(() => RheumaCalc.calculateDAS28_CRP('', 4, 15, 40), /Tender Joint Count/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, '', 15, 40), /Swollen Joint Count/);
assert.throws(() => RheumaCalc.calculateDAS28_CRP(6, 4, '', 40), /Kadar CRP/);

// Test 9: CDAI test
// TJC=4, SJC=2, PGA=3.5, EGA=2.0 -> CDAI = 4 + 2 + 3.5 + 2.0 = 11.5 (Moderate: >10 and <=22)
const cdai1 = RheumaCalc.calculateCDAI(4, 2, 3.5, 2.0);
console.log('CDAI Test:', cdai1);
assert.strictEqual(cdai1.score, '11.50');
assert.strictEqual(cdai1.activity.level, 'Moderate');

// CDAI Cutoffs
assert.strictEqual(RheumaCalc.classifyCDAI(2.80).level, 'Remission');
assert.strictEqual(RheumaCalc.classifyCDAI(2.85).level, 'Low');
assert.strictEqual(RheumaCalc.classifyCDAI(10.00).level, 'Low');
assert.strictEqual(RheumaCalc.classifyCDAI(10.10).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyCDAI(22.00).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifyCDAI(22.50).level, 'High');

// Test 10: SDAI test
// CDAI = 11.5 + CRP 1.2 mg/dL -> SDAI = 12.7 (Moderate: >11 and <=26)
const sdai1 = RheumaCalc.calculateSDAI(4, 2, 3.5, 2.0, 1.2);
console.log('SDAI Test:', sdai1);
assert.strictEqual(sdai1.score, '12.70');
assert.strictEqual(sdai1.activity.level, 'Moderate');

// SDAI Cutoffs
assert.strictEqual(RheumaCalc.classifySDAI(3.30).level, 'Remission');
assert.strictEqual(RheumaCalc.classifySDAI(3.35).level, 'Low');
assert.strictEqual(RheumaCalc.classifySDAI(11.00).level, 'Low');
assert.strictEqual(RheumaCalc.classifySDAI(11.05).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifySDAI(26.00).level, 'Moderate');
assert.strictEqual(RheumaCalc.classifySDAI(26.10).level, 'High');

// Test 11: BASDAI test
// Q1=4, Q2=5, Q3=3, Q4=4, Q5=6, Q6=6
// score = ((4+5+3+4) + ((6+6)/2)) / 5 = (16 + 6) / 5 = 22 / 5 = 4.4 (Active)
const bas1 = RheumaCalc.calculateBASDAI(4, 5, 3, 4, 6, 6);
console.log('BASDAI Test:', bas1);
assert.strictEqual(bas1.score, '4.40');
assert.strictEqual(bas1.active, true);

console.log('ALL RHEUMATOLOGY VERIFICATION TESTS PASSED SUCCESSFULLY!');
