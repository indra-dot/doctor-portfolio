/* ===================== M5: REUMATOLOGI & DOSIS ANTIMIKROBA (rheumatools.html & adjustr-io.html FULL FIDELITY) ===================== */

// --- PART A: RHEUMATOID & AUTOIMMUNE ENGINE ---
const RheumaCalc = {
        calculateDAS28_CRP(tjc, sjc, crp_mg_L, pga) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (crp_mg_L === '' || crp_mg_L === null || isNaN(crp_mg_L)) throw new Error('Kadar CRP wajib diisi.');
          if (pga === '' || pga === null || isNaN(pga)) throw new Error('Penilaian Global Pasien (PGA) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const c = Number(crp_mg_L);
          const p = Number(pga);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (c < 0) throw new Error('Kadar CRP harus >= 0 mg/L.');
          if (p < 0 || p > 100) throw new Error('PGA VAS harus berada di antara 0 dan 100 mm.');

          const raw = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.36 * Math.log(c + 1) + 0.014 * p + 0.96;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyDAS28(score)
          };
        },

        calculateDAS28_ESR(tjc, sjc, esr, pga) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (esr === '' || esr === null || isNaN(esr)) throw new Error('Laju Endap Darah (LED/ESR) wajib diisi.');
          if (pga === '' || pga === null || isNaN(pga)) throw new Error('Penilaian Global Pasien (PGA) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const e = Number(esr);
          const p = Number(pga);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (e < 1) throw new Error('LED / ESR Westergren harus >= 1 mm/jam.');
          if (p < 0 || p > 100) throw new Error('PGA VAS harus berada di antara 0 dan 100 mm.');

          const raw = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.70 * Math.log(e) + 0.014 * p;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyDAS28(score)
          };
        },

        calculateCDAI(tjc, sjc, pga_10, ega_10) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (pga_10 === '' || pga_10 === null || isNaN(pga_10)) throw new Error('Penilaian Global Pasien (PGA 0-10) wajib diisi.');
          if (ega_10 === '' || ega_10 === null || isNaN(ega_10)) throw new Error('Penilaian Global Dokter (EGA 0-10) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const p = Number(pga_10);
          const e = Number(ega_10);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (p < 0 || p > 10) throw new Error('PGA harus berada di antara 0 dan 10.');
          if (e < 0 || e > 10) throw new Error('EGA harus berada di antara 0 dan 10.');

          const raw = t + s + p + e;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyCDAI(score)
          };
        },

        calculateSDAI(tjc, sjc, pga_10, ega_10, crp_mg_dL) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (pga_10 === '' || pga_10 === null || isNaN(pga_10)) throw new Error('Penilaian Global Pasien (PGA 0-10) wajib diisi.');
          if (ega_10 === '' || ega_10 === null || isNaN(ega_10)) throw new Error('Penilaian Global Dokter (EGA 0-10) wajib diisi.');
          if (crp_mg_dL === '' || crp_mg_dL === null || isNaN(crp_mg_dL)) throw new Error('Kadar CRP (mg/dL) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const p = Number(pga_10);
          const e = Number(ega_10);
          const c = Number(crp_mg_dL);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (p < 0 || p > 10) throw new Error('PGA harus berada di antara 0 dan 10.');
          if (e < 0 || e > 10) throw new Error('EGA harus berada di antara 0 dan 10.');
          if (c < 0) throw new Error('Kadar CRP (mg/dL) harus >= 0.');

          const raw = t + s + p + e + c;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifySDAI(score)
          };
        },

        calculateDAPSA(tjc, sjc, crp_mg_dL, pga, pain) {
          if (tjc === '' || isNaN(tjc) || sjc === '' || isNaN(sjc) || crp_mg_dL === '' || isNaN(crp_mg_dL) || pga === '' || isNaN(pga) || pain === '' || isNaN(pain)) {
            throw new Error('Semua field DAPSA wajib diisi.');
          }
          const t = Number(tjc), s = Number(sjc), c = Number(crp_mg_dL), p = Number(pga), pn = Number(pain);
          if (t < 0 || t > 68 || s < 0 || s > 66 || c < 0 || p < 0 || p > 10 || pn < 0 || pn > 10) {
            throw new Error('Nilai input DAPSA di luar rentang valid.');
          }
          const score = Math.round((t + s + c + p + pn) * 100) / 100;
          return {
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyDAPSA(score)
          };
        },

        calculateBASDAI(q1, q2, q3, q4, q5, q6) {
          const qs = [q1, q2, q3, q4, q5, q6];
          for (let i = 0; i < 6; i++) {
            if (qs[i] === '' || isNaN(qs[i])) throw new Error('Pertanyaan Q' + (i + 1) + ' wajib diisi.');
            const val = Number(qs[i]);
            if (val < 0 || val > 10) throw new Error('Pertanyaan Q' + (i + 1) + ' harus di antara 0 dan 10.');
          }
          const score = ((Number(q1) + Number(q2) + Number(q3) + Number(q4)) + ((Number(q5) + Number(q6)) / 2)) / 5;
          const rounded = Math.round(score * 100) / 100;
          return {
            score: rounded.toFixed(2),
            numericScore: rounded,
            active: rounded >= 4.0
          };
        },

        classifyDAS28(score) {
          if (score > 5.10) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high', desc: 'Indikasi eskalasi terapi DMARD / Biologic menurut rekomendasi IRA & EULAR.' };
          if (score > 3.20) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'Aktivitas moderat; pertimbangkan optimasi dosis DMARD konvensional / kombinasi.' };
          if (score > 2.60) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low', desc: 'Aktivitas terkontrol rendah; pertahankan terapi sesuai target Treat-to-Target (T2T).' };
          return { level: 'Remission', label: 'Remisi Klinis (Clinical Remission)', badgeClass: 'badge-remission', desc: 'Target klinis tercapai (DAS28 <= 2.60). Lanjutkan pemantauan rutin dan evaluasi de-eskalasi bila stabil >6 bulan.' };
        },

        classifyCDAI(score) {
          if (score > 22.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high', desc: 'CDAI > 22.0: Aktivitas penyakit tinggi; evaluasi perubahan strategi terapi.' };
          if (score > 10.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'CDAI 10.1 - 22.0: Aktivitas sedang.' };
          if (score > 2.8) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low', desc: 'CDAI 2.9 - 10.0: Aktivitas rendah terkontrol.' };
          return { level: 'Remission', label: 'Remisi Klinis (Remission)', badgeClass: 'badge-remission', desc: 'CDAI <= 2.8: Remisi klinis tercapai.' };
        },

        classifySDAI(score) {
          if (score > 26.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high', desc: 'SDAI > 26.0: Aktivitas penyakit tinggi.' };
          if (score > 11.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'SDAI 11.1 - 26.0: Aktivitas sedang.' };
          if (score > 3.3) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low', desc: 'SDAI 3.4 - 11.0: Aktivitas rendah terkontrol.' };
          return { level: 'Remission', label: 'Remisi Klinis (Remission)', badgeClass: 'badge-remission', desc: 'SDAI <= 3.3: Remisi klinis tercapai (rekomendasi ACR/EULAR).' };
        },

        classifyDAPSA(score) {
          if (score > 28.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high' };
          if (score > 14.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate' };
          if (score > 4.0) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low' };
          return { level: 'Remission', label: 'Remisi Klinis (Remission)', badgeClass: 'badge-remission' };
        },

        classifyMEX_SLEDAI(score) {
          if (score >= 10) return { level: 'Severe', label: 'Aktivitas Berat / Flare Mayor', badgeClass: 'badge-high', desc: 'Skor MEX-SLEDAI &ge; 10 menandakan keterlibatan organ vital (neuropsikiatri aktif, nefritis aktif, atau vaskulitis sistemik). Indikasi evaluasi rawat inap dan eskalasi imunosupresi agresif (misal: kortikosteroid dosis tinggi pulse / DMARD imunosupresif).' };
          if (score >= 6) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'Skor MEX-SLEDAI 6–9: Menunjukkan flare derajat sedang; pertimbangkan eskalasi dosis glukokortikoid dan/atau penyesuaian DMARD.' };
          if (score >= 2) return { level: 'Mild', label: 'Aktivitas Ringan (Mild Activity)', badgeClass: 'badge-low', desc: 'Skor MEX-SLEDAI 2–5: Menunjukkan aktivitas penyakit derajat ringan (manifestasi mukokutan/artritis); pertahankan antimalaria hidroksiklorokuin dan optimasi dosis pemeliharaan.' };
          return { level: 'Remission', label: 'Inaktif / Remisi Klinis', badgeClass: 'badge-remission', desc: 'Skor MEX-SLEDAI 0–1: Tidak terdeteksi tanda klinis flare aktif dalam evaluasi 30 hari terakhir. Lanjutkan terapi rumatan.' };
        }
      };

      // ==========================================
      // GLOBAL TOOL REGISTRY & SEARCH ENGINE
      // ==========================================