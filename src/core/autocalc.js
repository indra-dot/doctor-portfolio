/**
 * src/core/autocalc.js
 * 
 * Deterministic Clinical Auto-Calculate Engine for InternaHub & Internize.ai.
 * Evaluates patient context (ctx) and automatically computes 25+ validated medical scores,
 * indexes, and clinical decision support flags.
 * 
 * 100% On-Device, Deterministic, Zero External Dependencies.
 */

(function (global) {
  'use strict';

  const fmt = (num, digits = 1) => {
    if (num === undefined || num === null || isNaN(num) || !isFinite(num)) return '-';
    return Number(num).toFixed(digits).replace('.', ',');
  };

  const toNum = (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    const n = parseFloat(String(val).replace(/,/g, '.'));
    return isFinite(n) ? n : undefined;
  };

  const has = (...vals) => vals.every(v => v !== undefined && v !== null && (typeof v !== 'number' || (!isNaN(v) && isFinite(v))));

  /**
   * Main Auto-Calculate Evaluation
   * @param {Object} c Patient context dictionary (e.g. from ctx / parseClinical)
   * @returns {Object} { scores: [], alerts: [], missing: [], keepSummary: string, cpptSummary: string }
   */
  function runAutoCalc(c) {
    if (!c || typeof c !== 'object') {
      return { scores: [], alerts: [], missing: [], keepSummary: '', cpptSummary: '' };
    }

    const scores = [];
    const alerts = [];
    const missing = [];

    const age = toNum(c.age);
    const sex = c.sex === 'P' || c.sex === 'female' ? 'female' : (c.sex === 'L' || c.sex === 'male' ? 'male' : undefined);
    const bb = toNum(c.bb);
    const tb = toNum(c.tb);

    const na = toNum(c.na);
    const k = toNum(c.k);
    const cl = toNum(c.cl);
    const ca = toNum(c.ca);
    const po4 = toNum(c.po4);
    const mg = toNum(c.mg);
    const alb = toNum(c.alb);
    const prot = toNum(c.prot);
    const glu = toNum(c.glu);

    const bun = toNum(c.bun);
    const ureum = toNum(c.ureum);
    const cr = toNum(c.cr);

    const ast = toNum(c.ast);
    const alt = toNum(c.alt);
    const bili = toNum(c.bili);
    const alp = toNum(c.alp);
    const ldh = toNum(c.ldh);

    const wbc = toNum(c.wbc);
    const hb = toNum(c.hb);
    const plt = toNum(c.plt);
    const ne_abs = toNum(c.ne_abs);
    const ly_abs = toNum(c.ly_abs);

    const inr = toNum(c.inr);
    const ppt = toNum(c.ppt);
    const aptt = toNum(c.aptt);
    const fib = toNum(c.fib);
    const ddimer = toNum(c.ddimer);

    const ph = toNum(c.ph);
    const pco2 = toNum(c.pco2);
    const po2 = toNum(c.po2);
    const hco3 = toNum(c.hco3);
    const fio2 = toNum(c.fio2);
    const lac = toNum(c.lac);

    const sbp = toNum(c.sbp);
    const dbp = toNum(c.dbp);
    const hr = toNum(c.hr);
    const rr = toNum(c.rr);

    const asc_alb = toNum(c.ascites_alb);
    const pl_prot = toNum(c.pleura_prot);
    const pl_ldh = toNum(c.pleura_ldh);

    // ==========================================
    // 1. ELEKTROLIT, OSMOLARITAS & GULA DARAH
    // ==========================================

    // Natrium Terkoreksi Hiperglikemia
    if (has(na, glu)) {
      if (glu > 100) {
        const corrKatz = na + 1.6 * (glu - 100) / 100;
        const corrHillier = na + 2.4 * (glu - 100) / 100;
        const isHi = corrKatz > 145;
        const isLo = corrKatz < 135;
        scores.push({
          id: 'corr-na',
          name: 'Natrium Terkoreksi Hiperglikemia',
          group: 'Elektrolit & Metabolik',
          value: `${fmt(corrKatz)} mEq/L`,
          subvalue: `Faktor 1.6: ${fmt(corrKatz)} | Faktor 2.4: ${fmt(corrHillier)}`,
          status: (isHi || isLo) ? 'warn' : 'ok',
          interpretation: isLo ? 'Hiponatremia hipotonik sejati (terkoreksi)' : (isHi ? 'Hipernatremia terselubung' : 'Eunatremia (terkoreksi)'),
          calcId: 'corr-na'
        });
      } else {
        scores.push({
          id: 'corr-na',
          name: 'Natrium Terkoreksi',
          group: 'Elektrolit & Metabolik',
          value: `${fmt(na)} mEq/L`,
          subvalue: 'Glukosa darah normal (tanpa koreksi pseudohiponatremia)',
          status: (na < 135 || na > 145) ? 'warn' : 'ok',
          interpretation: na < 135 ? 'Hiponatremia' : (na > 145 ? 'Hipernatremia' : 'Normal'),
          calcId: 'corr-na'
        });
      }
    }

    // Kalsium Terkoreksi Albumin (Payne)
    if (has(ca, alb)) {
      const corrCa = ca + 0.8 * (4.0 - alb);
      let st = 'ok';
      let interp = 'Normal (8,5 – 10,5 mg/dL)';
      if (corrCa < 8.5) {
        st = corrCa < 7.5 ? 'bad' : 'warn';
        interp = corrCa < 7.5 ? 'Hipokalsemia Berat / Simtomatik' : 'Hipokalsemia Ringan-Sedang';
      } else if (corrCa > 10.5) {
        st = corrCa > 12.0 ? 'bad' : 'warn';
        interp = corrCa > 12.0 ? 'Krisis Hiperkalsemia Maligna (>12 mg/dL)' : 'Hiperkalsemia Ringan-Sedang';
      }
      scores.push({
        id: 'ca-mgmt',
        name: 'Kalsium Terkoreksi (Payne)',
        group: 'Elektrolit & Metabolik',
        value: `${fmt(corrCa)} mg/dL`,
        subvalue: `Ca terukur ${fmt(ca)} mg/dL, Albumin ${fmt(alb)} g/dL`,
        status: st,
        interpretation: interp,
        calcId: 'ca-mgmt'
      });
      if (st === 'bad') {
        alerts.push(`Kalsium terkoreksi kritis: ${fmt(corrCa)} mg/dL (${interp})`);
      }
    }

    // Effective & Total Serum Osmolarity
    if (has(na, glu)) {
      const effOsm = 2 * na + (glu / 18);
      let totOsm = null;
      let bunVal = bun;
      if (bunVal === undefined && ureum !== undefined) {
        bunVal = ureum / 2.14; // Ureum to BUN
      }
      if (bunVal !== undefined) {
        totOsm = 2 * na + (glu / 18) + (bunVal / 2.8);
      }
      const isHhs = effOsm >= 320;
      scores.push({
        id: 'osmo',
        name: 'Osmolaritas Serum Efektif (Tonisitas)',
        group: 'Elektrolit & Metabolik',
        value: `${fmt(effOsm, 0)} mOsm/kg`,
        subvalue: totOsm ? `Total Osm: ${fmt(totOsm, 0)} mOsm/kg | Nilai Normal: 275–295` : 'Nilai Normal: 275–295 mOsm/kg',
        status: isHhs ? 'bad' : (effOsm > 295 || effOsm < 275 ? 'warn' : 'ok'),
        interpretation: isHhs ? 'Hiperosmolaritas Berat (Kriteria HHS ≥ 320 mOsm/kg)' : (effOsm > 295 ? 'Hipertonik' : (effOsm < 275 ? 'Hipotonik' : 'Isotonik')),
        calcId: 'osmo'
      });
    }

    // Alert Gangguan Kalium
    if (has(k)) {
      if (k < 3.5 || k > 5.5) {
        const isCrit = k < 2.5 || k > 6.0;
        alerts.push(`Kalium ${fmt(k, 2)} mEq/L: ${isCrit ? 'KRITIS (' + (k < 2.5 ? 'Hipokalemia Berat' : 'Hiperkalemia Mengancam Jiwa') + ')' : (k < 3.5 ? 'Hipokalemia' : 'Hiperkalemia')}`);
      }
    }

    // Alert POCT Hipoglikemia
    if (c.poct_min !== undefined && c.poct_min < 70) {
      alerts.push(`Glukosa POCT Terendah: ${fmt(c.poct_min, 0)} mg/dL — Waspada Hipoglikemia! Segera koreksi D40% Rumus 30.`);
    }

    // ==========================================
    // 2. FUNGSI GINJAL & AZOTEMIA
    // ==========================================

    // Rasio BUN:Kreatinin
    if (has(bun, cr) && cr > 0) {
      const ratio = bun / cr;
      let interp = 'Normal / Post-renal (10–20 : 1)';
      let st = 'ok';
      if (ratio > 20) {
        st = 'warn';
        interp = 'Azotemia Prerenal, Dehidrasi Berat, atau Perdarahan Saluran Cerna Atas (> 20:1)';
      } else if (ratio < 10) {
        st = 'warn';
        interp = 'Kerusakan Intrinsik Renal / ATN (< 10:1) atau Malnutrisi';
      }
      scores.push({
        id: 'aki-bun-cr',
        name: 'Rasio BUN : Kreatinin',
        group: 'Ginjal & Cairan',
        value: `${fmt(ratio, 1)} : 1`,
        subvalue: `BUN ${fmt(bun)} mg/dL, Kreatinin ${fmt(cr)} mg/dL`,
        status: st,
        interpretation: interp,
        calcId: 'aki-bun-cr'
      });
    }

    // eGFR CKD-EPI 2021 (Refit Without Race)
    if (has(cr, age, sex) && cr > 0 && age > 0) {
      const kappa = sex === 'female' ? 0.7 : 0.9;
      const alpha = sex === 'female' ? -0.241 : -0.302;
      const minVal = Math.min(cr / kappa, 1);
      const maxVal = Math.max(cr / kappa, 1);
      const genderMult = sex === 'female' ? 1.012 : 1.0;
      const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * genderMult;

      let ckdStage = 'G1 (Normal ≥ 90)';
      let st = 'ok';
      if (egfr < 15) { ckdStage = 'G5 (Gagal Ginjal Akut/Terminal < 15)'; st = 'bad'; }
      else if (egfr < 30) { ckdStage = 'G4 (Penurunan Berat 15–29)'; st = 'bad'; }
      else if (egfr < 45) { ckdStage = 'G3b (Penurunan Sedang-Berat 30–44)'; st = 'warn'; }
      else if (egfr < 60) { ckdStage = 'G3a (Penurunan Ringan-Sedang 45–59)'; st = 'warn'; }
      else if (egfr < 90) { ckdStage = 'G2 (Penurunan Ringan 60–89)'; st = 'ok'; }

      scores.push({
        id: 'ckd-epi-2021',
        name: 'eGFR CKD-EPI 2021 (Formula Baku)',
        group: 'Ginjal & Cairan',
        value: `${fmt(egfr, 0)} mL/min/1.73m²`,
        subvalue: `Stadium KDIGO: ${ckdStage}`,
        status: st,
        interpretation: `Fungsi Filtrasi Ginjal: ${ckdStage}. Selalu sesuaikan dosis antimikroba (Adjustr-IO) bila eGFR < 50.`,
        calcId: 'crcl-cockcroft'
      });

      // CrCl Cockcroft-Gault (jika BB ada)
      if (has(bb) && bb > 0) {
        let crcl = ((140 - age) * bb) / (72 * cr);
        if (sex === 'female') crcl *= 0.85;
        scores.push({
          id: 'crcl-cockcroft',
          name: 'Klirens Kreatinin Cockcroft-Gault',
          group: 'Ginjal & Cairan',
          value: `${fmt(crcl, 1)} mL/min`,
          subvalue: `BB Aktual ${fmt(bb)} kg, Usia ${age} th, Cr ${fmt(cr)}`,
          status: crcl < 30 ? 'bad' : (crcl < 50 ? 'warn' : 'ok'),
          interpretation: crcl < 50 ? 'Penyesuaian dosis obat ginjal Adjustr-IO diperlukan!' : 'Klirens ginjal adekuat untuk dosis standar.',
          calcId: 'crcl-cockcroft'
        });
      } else {
        missing.push({ param: 'BB', purpose: 'Menghitung Klirens Kreatinin Cockcroft-Gault & Dosis Obat Ginjal' });
      }
    } else {
      if (has(cr) && (!age || !sex)) {
        missing.push({ param: 'Usia & Jenis Kelamin', purpose: 'Menghitung eGFR CKD-EPI 2021 & Cockcroft-Gault' });
      }
    }

    // Monitoring AKI KDIGO jika ada data kreatinin serial/baseline
    if (has(cr) && c.baseline && has(c.baseline.cr)) {
      const bCr = c.baseline.cr;
      const deltaCr = Math.round((cr - bCr) * 100) / 100;
      const ratioCr = Math.round((cr / bCr) * 100) / 100;
      if (deltaCr >= 0.3 || ratioCr >= 1.5) {
        let stage = 'Stage 1';
        let st = 'warn';
        if (ratioCr >= 3.0 || cr >= 4.0) {
          stage = 'Stage 3'; st = 'bad';
        } else if (ratioCr >= 2.0) {
          stage = 'Stage 2'; st = 'bad';
        }
        alerts.push(`Kecurigaan AKI KDIGO ${stage}! Kenaikan SCr dari baseline ${fmt(bCr)} -> ${fmt(cr)} mg/dL (Δ ${fmt(deltaCr)} mg/dL, Rasio ${fmt(ratioCr)}x)`);
        scores.push({
          id: 'aki-kdigo',
          name: 'Staging AKI KDIGO (Riwayat LabKeep)',
          group: 'Ginjal & Cairan',
          value: stage,
          subvalue: `Baseline: ${fmt(bCr)} mg/dL | Terkini: ${fmt(cr)} mg/dL (Rasio ${fmt(ratioCr)}x)`,
          status: st,
          interpretation: `Acute Kidney Injury ${stage}. Hindari nefrotoksik, evaluasi hemodinamik dan balans cairan.`,
          calcId: 'aki-bun-cr'
        });
      }
    }

    // ==========================================
    // 3. ANALISIS GAS DARAH (AGD / BGA)
    // ==========================================
    if (has(na, cl, hco3)) {
      const ag = na - cl - hco3;
      const corrAg = alb ? ag + 2.5 * (4.0 - alb) : ag;
      const isHagma = corrAg > 12;

      let agInterp = isHagma ? 'High Anion Gap Metabolic Acidosis (HAGMA) > 12' : 'Anion Gap Normal (NAGMA / Normal)';
      let subDetail = `AG Terukur: ${fmt(ag)} | Terkoreksi Albumin: ${fmt(corrAg)}`;

      // Delta Ratio / Delta Gap bila HAGMA
      if (isHagma) {
        const deltaGap = (corrAg - 12) - (24 - hco3);
        const deltaRatio = (24 - hco3) > 0 ? (corrAg - 12) / (24 - hco3) : null;
        if (deltaRatio !== null) {
          let deltaInterp = '';
          if (deltaRatio < 0.4) deltaInterp = 'Campuran HAGMA + NAGMA hiperkloremik';
          else if (deltaRatio <= 0.8) deltaInterp = 'Campuran HAGMA + NAGMA (mis. DKA + Saline berlebih)';
          else if (deltaRatio <= 1.6) deltaInterp = 'HAGMA Murni (DKA, Asidosis Laktat, atau Toksin)';
          else deltaInterp = 'Campuran HAGMA + Alkalosis Metabolik pre-eksisting';
          subDetail += ` | Delta Ratio: ${fmt(deltaRatio, 2)} (${deltaInterp})`;
        }
      }

      scores.push({
        id: 'anion-gap',
        name: 'Anion Gap & Analisa Asam-Basa',
        group: 'Asam Basa & Respirasi',
        value: `${fmt(corrAg)} mEq/L`,
        subvalue: subDetail,
        status: isHagma ? 'bad' : 'ok',
        interpretation: agInterp,
        calcId: 'anion-gap'
      });
    }

    // A-a Gradient (jika ada pO2, pCO2)
    if (has(po2, pco2)) {
      const fi = fio2 ? fio2 : 21;
      const pao2Exp = (fi / 100) * 713 - (pco2 / 0.8);
      const aaGrad = Math.max(0, pao2Exp - po2);
      const normalAa = age ? (age / 4) + 4 : 12;
      const isWide = aaGrad > normalAa;

      scores.push({
        id: 'abg-aa',
        name: 'A-a Oxygen Gradient',
        group: 'Asam Basa & Respirasi',
        value: `${fmt(aaGrad, 1)} mmHg`,
        subvalue: `Batas Normal Sesuai Usia: ≤ ${fmt(normalAa, 0)} mmHg (FiO2 ${fi}%)`,
        status: isWide ? 'warn' : 'ok',
        interpretation: isWide ? 'Gradien A-a Melebar: Curiga defek V/Q mismatch, pirau intrapulmonal, atau kelainan difusi paru' : 'Gradien A-a Normal: Hipoksemia murni akibat hipoventilasi atau FiO2 rendah',
        calcId: 'abg'
      });
    }

    // ==========================================
    // 4. HEPATOLOGI & GASTROENTEROLOGI
    // ==========================================

    // APRI Score (AST to Platelet Ratio Index)
    if (has(ast, plt) && plt > 0) {
      const astUln = 35; // Standard ULN RS Ngoerah
      const apri = ((ast / astUln) / plt) * 100;
      let interp = 'Fibrosis signifikan minimal / tidak mungkin (APRI < 0.5)';
      let st = 'ok';
      if (apri > 1.5) {
        st = 'bad';
        interp = 'Probabilitas Sirosis Hepar Tinggi (APRI > 1.5)';
      } else if (apri >= 0.5) {
        st = 'warn';
        interp = 'Zona Intermediate Fibrosis (0.5 – 1.5)';
      }
      scores.push({
        id: 'apri',
        name: 'APRI Score (Fibrosis Hepar)',
        group: 'Gastroenterologi & Hepatologi',
        value: fmt(apri, 2),
        subvalue: `AST ${fmt(ast)} U/L (ULN 35), PLT ${fmt(plt)} ribu/µL`,
        status: st,
        interpretation: interp,
        calcId: 'geh-ctp'
      });
    }

    // FIB-4 Index
    if (has(age, ast, alt, plt) && alt > 0 && plt > 0 && age > 0) {
      const fib4 = (age * ast) / (plt * Math.sqrt(alt));
      let interp = 'Risiko Rendah Fibrosis Lanjut F0–F2 (FIB-4 < 1.45, NPV ~90%)';
      let st = 'ok';
      if (fib4 > 3.25) {
        st = 'bad';
        interp = 'Risiko Tinggi Fibrosis Lanjut / Sirosis F3–F4 (FIB-4 > 3.25)';
      } else if (fib4 >= 1.45) {
        st = 'warn';
        interp = 'Zona Intermediate (1.45 – 3.25, evaluasi modalitas elastografi/biopsi)';
      }
      scores.push({
        id: 'fib4',
        name: 'FIB-4 Index (Stratifikasi Fibrosis Hati)',
        group: 'Gastroenterologi & Hepatologi',
        value: fmt(fib4, 2),
        subvalue: `Usia ${age} th, AST ${fmt(ast)}, ALT ${fmt(alt)}, PLT ${fmt(plt)}`,
        status: st,
        interpretation: interp,
        calcId: 'geh-ctp'
      });
    } else {
      if (has(ast, alt, plt) && !age) {
        missing.push({ param: 'Usia', purpose: 'Menghitung FIB-4 Index' });
      }
    }

    // Rasio De Ritis (AST/ALT)
    if (has(ast, alt) && alt > 0) {
      const deRitis = ast / alt;
      let interp = 'Pola Non-Alkoholik / Steatohepatitis / Hepatitis Akut (Rasio < 1.0)';
      let st = 'ok';
      if (deRitis >= 2.0) {
        st = 'warn';
        interp = 'Sugestif Kerusakan Akibat Alkoholik atau Sirosis Lanjut (Rasio AST/ALT ≥ 2.0)';
      } else if (deRitis > 1.0) {
        interp = 'Rasio 1.0–2.0: Perhatikan progresivitas fibrosis atau hepatitis kronik';
      }
      scores.push({
        id: 'deritis',
        name: 'Rasio De Ritis (AST / ALT)',
        group: 'Gastroenterologi & Hepatologi',
        value: fmt(deRitis, 2),
        subvalue: `AST ${fmt(ast)} U/L, ALT ${fmt(alt)} U/L`,
        status: st,
        interpretation: interp,
        calcId: 'geh-ctp'
      });
    }

    // R-Factor (Pola DILI Drug-Induced Liver Injury)
    if (has(alt, alp) && alp > 0) {
      const altUln = 35;
      const alpUln = 105;
      const rFactor = (alt / altUln) / (alp / alpUln);
      let interp = 'Pola Cholestatic Injury (R < 2.0)';
      let st = 'warn';
      if (rFactor > 5.0) {
        st = 'bad';
        interp = 'Pola Hepatocellular Injury (R > 5.0) — Waspadai DILI / Kriteria Hy\'s Law';
      } else if (rFactor >= 2.0) {
        interp = 'Pola Mixed Liver Injury (R 2.0 – 5.0)';
      }
      scores.push({
        id: 'rfactor',
        name: 'R-Factor (Klasifikasi Pola DILI)',
        group: 'Gastroenterologi & Hepatologi',
        value: fmt(rFactor, 2),
        subvalue: `ALT ${fmt(alt)} U/L, ALP ${fmt(alp)} U/L`,
        status: st,
        interpretation: interp,
        calcId: 'geh-ctp'
      });
    }

    // SAAG (Serum-Ascites Albumin Gradient)
    if (has(alb, asc_alb)) {
      const saag = alb - asc_alb;
      const isPortalHt = saag >= 1.1;
      scores.push({
        id: 'saag',
        name: 'SAAG (Serum-Ascites Albumin Gradient)',
        group: 'Gastroenterologi & Hepatologi',
        value: `${fmt(saag, 2)} g/dL`,
        subvalue: `Serum Alb: ${fmt(alb)} g/dL | Cairan Asites Alb: ${fmt(asc_alb)} g/dL`,
        status: isPortalHt ? 'warn' : 'ok',
        interpretation: isPortalHt
          ? 'Gradien Tinggi (SAAG ≥ 1.1 g/dL): Hipertensi Portal Positif (Sirosis Hepar, Gagal Jantung, Sindrom Budd-Chiari)'
          : 'Gradien Rendah (SAAG < 1.1 g/dL): Non-Hipertensi Portal (Karsinomatosis Peritoneum, TB Peritoneum, Sindrom Nefrotik, Pankreatitis)',
        calcId: 'geh-ctp'
      });
    }

    // Light's Criteria (Cairan Pleura)
    if (has(prot, pl_prot) && prot > 0) {
      const protRatio = pl_prot / prot;
      let ldhRatio = null;
      if (has(ldh, pl_ldh) && ldh > 0) {
        ldhRatio = pl_ldh / ldh;
      }
      const isExudate = protRatio > 0.5 || (ldhRatio !== null && ldhRatio > 0.6);
      scores.push({
        id: 'lights-criteria',
        name: 'Kriteria Light (Analisa Cairan Pleura)',
        group: 'Gastroenterologi & Hepatologi',
        value: isExudate ? 'Eksudat' : 'Transudat',
        subvalue: `Rasio Protein Pleura/Serum: ${fmt(protRatio, 2)} ${ldhRatio !== null ? '| Rasio LDH: ' + fmt(ldhRatio, 2) : ''}`,
        status: isExudate ? 'warn' : 'ok',
        interpretation: isExudate
          ? 'Efusi Pleura Eksudat (Infeksi/TB, Keganasan, Emboli Paru, Pankreatitis)'
          : 'Efusi Pleura Transudat (Gagal Jantung Kongestif, Sirosis Hepar, Hipoalbuminemia Berat)',
        calcId: 'abg'
      });
    }

    // Child-Turcotte-Pugh (CTP) Lab Components
    if (has(bili, alb, inr)) {
      let ctpLabPts = 0;
      if (bili < 2.0) ctpLabPts += 1; else if (bili <= 3.0) ctpLabPts += 2; else ctpLabPts += 3;
      if (alb > 3.5) ctpLabPts += 1; else if (alb >= 2.8) ctpLabPts += 2; else ctpLabPts += 3;
      if (inr < 1.7) ctpLabPts += 1; else if (inr <= 2.2) ctpLabPts += 2; else ctpLabPts += 3;

      scores.push({
        id: 'ctp-score',
        name: 'CTP Score (Komponen Lab Sirosis)',
        group: 'Gastroenterologi & Hepatologi',
        value: `${ctpLabPts} / 9 Poin Lab`,
        subvalue: `Bilirubin ${fmt(bili)} mg/dL, Albumin ${fmt(alb)} g/dL, INR ${fmt(inr)}`,
        status: ctpLabPts >= 6 ? 'bad' : (ctpLabPts >= 4 ? 'warn' : 'ok'),
        interpretation: `Skor dasar lab: ${ctpLabPts}. Buka kalkulator untuk menambah poin klinis Asites (+1-3) dan Ensefalopati (+1-3).`,
        calcId: 'geh-ctp'
      });
    }

    // ==========================================
    // 5. HEMATOLOGI, ONKOLOGI & INFEKSI
    // ==========================================

    // Absolute Neutrophil Count (ANC) & NLR
    if (has(wbc)) {
      let ancVal = null;
      if (has(ne_abs)) {
        ancVal = ne_abs >= 100 ? ne_abs : ne_abs * 1000;
      }
      if (ancVal !== null) {
        let st = 'ok';
        let interp = 'Normal (ANC ≥ 1.500 /µL)';
        if (ancVal < 500) {
          st = 'bad';
          interp = 'Neutropenia Berat (ANC < 500 /µL) — Risiko Tinggi Sepsis / Indikasi MASCC!';
        } else if (ancVal < 1000) {
          st = 'warn';
          interp = 'Neutropenia Sedang (500–1.000 /µL)';
        } else if (ancVal < 1500) {
          st = 'warn';
          interp = 'Neutropenia Ringan (1.000–1.500 /µL)';
        }
        scores.push({
          id: 'anc',
          name: 'Absolute Neutrophil Count (ANC)',
          group: 'Hematologi & Onkologi',
          value: `${fmt(ancVal, 0)} /µL`,
          subvalue: `WBC ${fmt(wbc)} ribu/µL, NE# ${fmt(ne_abs)}`,
          status: st,
          interpretation: interp,
          calcId: 'hom-mascc'
        });
        if (st === 'bad') {
          alerts.push(`NEUTROPENIA BERAT: ANC ${fmt(ancVal, 0)} /µL. Pantau demam neutropenia, antibiotik broad-spectrum cito bila demam!`);
        }
      }

      if (has(ne_abs, ly_abs) && ly_abs > 0) {
        const nlr = ne_abs / ly_abs;
        scores.push({
          id: 'nlr',
          name: 'Neutrophil-to-Lymphocyte Ratio (NLR)',
          group: 'Hematologi & Onkologi',
          value: fmt(nlr, 2),
          subvalue: `NE# ${fmt(ne_abs)}, LY# ${fmt(ly_abs)}`,
          status: nlr > 5.0 ? 'warn' : 'ok',
          interpretation: nlr > 5.0 ? 'Respon Inflamasi Sistemik Kuat / Infeksi Berat' : 'Dalam batas inflamasi fisiologis',
          calcId: 'hom-mascc'
        });
      }
    }

    // Skrining Koagulopati & Koagulasi Intravaskular (DIC / ISTH)
    if (has(plt)) {
      if (plt < 50) {
        alerts.push(`Trombositopenia Berat: ${fmt(plt, 0)} ribu/µL. Waspada perdarahan spontan; tunda prosedur invasif / transfusi TC bila perlu.`);
      }
      if (has(inr) && inr > 1.5) {
        alerts.push(`Pemanjangan INR ${fmt(inr)} — Disfungsi koagulasi / sintesis faktor pembekuan hepar.`);
      }
    }

    // Ganzoni Iron Deficit (jika Hb dan BB tersedia)
    if (has(hb, bb) && hb < 12) {
      const targetHb = sex === 'male' ? 13 : 12;
      const deficit = bb * (targetHb - hb) * 2.4 + 500;
      if (deficit > 500) {
        scores.push({
          id: 'ganzoni',
          name: 'Defisit Besi Total (Formula Ganzoni)',
          group: 'Hematologi & Onkologi',
          value: `${fmt(deficit, 0)} mg Fe`,
          subvalue: `Hb Aktual ${fmt(hb)} g/dL (Target ${targetHb}), BB ${fmt(bb)} kg`,
          status: 'warn',
          interpretation: `Kebutuhan elemental besi: ~${Math.ceil(deficit / 100)} ampul Iron Sucrose (100 mg/ampul) atau Ferric Carboxymaltose sesuai protokol.`,
          calcId: 'ganzoni'
        });
      }
    }

    // ==========================================
    // 6. RAWAT KRITIS & SEPSIS (CURB-65, SOFA PARSIAL)
    // ==========================================

    // CURB-65 Komponen Lab & Vital
    if (has(bun, rr, sbp, age)) {
      let curbPts = 0;
      if (bun > 19) curbPts += 1;
      if (rr >= 30) curbPts += 1;
      if (sbp < 90 || (dbp !== undefined && dbp <= 60)) curbPts += 1;
      if (age >= 65) curbPts += 1;

      let interp = 'Mortalitas Rendah (Rawat Jalan / Observasi Singkat)';
      let st = 'ok';
      if (curbPts >= 3) {
        st = 'bad';
        interp = 'Pneumonia Komunitas Berat (Rawat Inap / Evaluasi ICU)';
      } else if (curbPts === 2) {
        st = 'warn';
        interp = 'Risiko Sedang (Pertimbangkan Rawat Inap Ruangan)';
      }

      scores.push({
        id: 'curb65',
        name: 'CURB-65 (Komponen Lab & Vital)',
        group: 'Rawat Kritis & Infeksi',
        value: `${curbPts} / 4 Poin Objektif`,
        subvalue: `BUN ${fmt(bun)}, RR ${fmt(rr)}, TD ${sbp}/${dbp || '-'}, Usia ${age}`,
        status: st,
        interpretation: interp + ' (+1 poin bila terdapat Confusion baru)',
        calcId: 'curb65'
      });
    }

    // SOFA Lab Score (Sequential Organ Failure Assessment)
    let sofaLabPts = 0;
    const sofaDetails = [];
    if (has(plt)) {
      if (plt < 20) { sofaLabPts += 4; sofaDetails.push('Koagulasi +4'); }
      else if (plt < 50) { sofaLabPts += 3; sofaDetails.push('Koagulasi +3'); }
      else if (plt < 100) { sofaLabPts += 2; sofaDetails.push('Koagulasi +2'); }
      else if (plt < 150) { sofaLabPts += 1; sofaDetails.push('Koagulasi +1'); }
    }
    if (has(bili)) {
      if (bili > 12.0) { sofaLabPts += 4; sofaDetails.push('Liver +4'); }
      else if (bili >= 6.0) { sofaLabPts += 3; sofaDetails.push('Liver +3'); }
      else if (bili >= 2.0) { sofaLabPts += 2; sofaDetails.push('Liver +2'); }
      else if (bili >= 1.2) { sofaLabPts += 1; sofaDetails.push('Liver +1'); }
    }
    if (has(cr)) {
      if (cr > 4.9) { sofaLabPts += 4; sofaDetails.push('Ginjal +4'); }
      else if (cr >= 3.5) { sofaLabPts += 3; sofaDetails.push('Ginjal +3'); }
      else if (cr >= 2.0) { sofaLabPts += 2; sofaDetails.push('Ginjal +2'); }
      else if (cr >= 1.2) { sofaLabPts += 1; sofaDetails.push('Ginjal +1'); }
    }
    if (has(sbp) && sbp < 90) {
      sofaLabPts += 1;
      sofaDetails.push('Kardio +1');
    }

    if (sofaDetails.length > 0) {
      scores.push({
        id: 'sofa',
        name: 'SOFA Score (Komponen Lab/Vital Terkini)',
        group: 'Rawat Kritis & Infeksi',
        value: `${sofaLabPts} Poin Organ Terhitung`,
        subvalue: sofaDetails.join(' · '),
        status: sofaLabPts >= 4 ? 'bad' : (sofaLabPts >= 2 ? 'warn' : 'ok'),
        interpretation: sofaLabPts >= 2 ? 'Kecurigaan Disfungsi Organ / Sepsis (Skor SOFA Lab ≥ 2)' : 'Disfungsi organ minimal pada parameter lab saat ini',
        calcId: 'curb65'
      });
    }

    // ==========================================
    // 7. FORMAT SUMMARY UNTUK VIEW KEEP & CPPT
    // ==========================================
    const keepSummary = formatAutoCalcForKeep(scores, alerts, c);
    const cpptSummary = formatAutoCalcForCppt(scores, alerts, c);

    return {
      scores,
      alerts,
      missing,
      keepSummary,
      cpptSummary
    };
  }

  /**
   * Format hasil auto-calculate untuk Keep (selaras dengan font LabKeep)
   */
  function formatAutoCalcForKeep(scores, alerts, c) {
    if (!scores.length) return '';
    let out = '\n================\nKALKULASI MEDIS OTOMATIS (InternaHub)\n================\n';
    if (alerts.length) {
      out += 'PERINGATAN KLINIS:\n' + alerts.map(a => `! ${a}`).join('\n') + '\n\n';
    }
    const grouped = {};
    scores.forEach(s => {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push(s);
    });

    for (const g in grouped) {
      out += `[${g}]\n`;
      grouped[g].forEach(s => {
        out += `${s.name.padEnd(30, ' ')}: ${s.value} (${s.interpretation})\n`;
      });
      out += '\n';
    }
    return out.trimEnd();
  }

  /**
   * Format hasil auto-calculate untuk SOAP/CPPT
   */
  function formatAutoCalcForCppt(scores, alerts, c) {
    if (!scores.length) return '';
    const dt = new Date().toLocaleDateString('id-ID');
    let out = `[InternaHub CDSS Auto-Calculate — ${dt}]\n`;
    if (alerts.length) {
      out += `ALERT:\n` + alerts.map(a => `- ${a}`).join('\n') + `\n`;
    }
    out += `ANALISIS HASIL LAB & INDEKS KLINIS:\n`;
    scores.forEach(s => {
      out += `- ${s.name}: ${s.value} -> ${s.interpretation}\n`;
    });
    out += `*Hasil kalkulasi otomatis berbasis riwayat lab; verifikasi klinis tetap oleh DPJP.`;
    return out;
  }

  const AutoCalcEngine = {
    runAutoCalc,
    formatAutoCalcForKeep,
    formatAutoCalcForCppt
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoCalcEngine;
  }
  if (typeof window !== 'undefined') {
    window.AutoCalcEngine = AutoCalcEngine;
    window.runAutoCalc = runAutoCalc;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
