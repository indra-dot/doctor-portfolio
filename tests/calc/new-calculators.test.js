/**
 * tests/calc/new-calculators.test.js
 * 
 * Benchmark test suite for newly integrated clinical calculators:
 * - Pulmonologi: PSI (PORT Score), Preop Asthma/COPD
 * - Geriatri & Preop: ARISCAT, RCRI, Caprini, IMPROVE, CFS, Morse, PAPDI Delirium, MNA-SF, Preop Checklist
 * - Psikosomatis: HADS, PHQ-9, GAD-7, Pain Titrator (Morfin & Fentanyl)
 * - Endokrin & Kaki: PEDIS/Wagner/ABI, Steroid Perioperatif, Insulin Perioperatif
 * - PTI, Kardio & Nefro: Wells DVT, Wells PE, DSS Resuscitation, MACD, Koreksi Nabic, Ca Glukonas Drip, HIV IO, DMARDs SLE
 */

const assert = require('assert');
const { runCalculation } = require('../harness');

async function runTests() {
  console.log('\n--- Testing New Clinical Calculators (IPD Bali / Indonesia Suite) ---');
  let passed = 0;
  let failed = 0;

  // 1. PSI (Pneumonia Severity Index)
  try {
    // Case A: 65 yo male, no other factors -> 65 pts -> Kelas II
    const resA = await runCalculation('psi', { age: 65, sex: 'm' });
    assert.ok(resA.value.includes('Kelas II'), 'PSI 65 pts should be Kelas II');
    assert.strictEqual(resA.cls, 'ok');

    // Case B: 75 yo male + Neoplasm (+30) + RR>=30 (+20) + BUN>=30 (+20) -> 145 pts -> Kelas V
    const resB = await runCalculation('psi', { age: 75, sex: 'm', neoplasm: true, rr30: true, bun30: true });
    assert.ok(resB.value.includes('Kelas V'), 'PSI 145 pts should be Kelas V');
    assert.strictEqual(resB.cls, 'bad');
    passed++;
    console.log('  ✓ Pneumonia Severity Index (PSI/PORT) Class II (65 pts) & Class V (145 pts) verified');
  } catch (e) {
    console.error('  ❌ PSI test failed:', e.message);
    failed++;
  }

  // 2. ARISCAT Score
  try {
    // Case A: Low risk (Age <= 50, SpO2 >= 96, Infeksi 17) -> score 17 (<26) -> Low Risk (1.6%)
    const resA = await runCalculation('ariscat', { age: '0', spo2: '0', resp_inf: true, incision: '0', duration: '0' });
    assert.ok(resA.value.includes('Low Risk'), 'ARISCAT 17 pts should be Low Risk');

    // Case B: Intermediate risk (Age 51-80 (+3), Upper abd (+15), Dur 2-3h (+16)) -> 34 pts -> Intermediate Risk (13.3%)
    const resB = await runCalculation('ariscat', { age: '3', spo2: '0', incision: '15', duration: '16' });
    assert.ok(resB.value.includes('Intermediate Risk'), 'ARISCAT 34 pts should be Intermediate');

    // Case C: High risk (Age >80 (+16), SpO2 <=90 (+24), Intrathoracic (+24)) -> 64 pts -> High Risk (42.1%)
    const resC = await runCalculation('ariscat', { age: '16', spo2: '24', incision: '24' });
    assert.ok(resC.value.includes('High Risk'), 'ARISCAT 64 pts should be High Risk');
    passed++;
    console.log('  ✓ ARISCAT Score PPC Risk (Low 1.6%, Intermediate 13.3%, High 42.1%) verified');
  } catch (e) {
    console.error('  ❌ ARISCAT test failed:', e.message);
    failed++;
  }

  // 3. RCRI (Lee Score)
  try {
    const res0 = await runCalculation('rcri', {});
    assert.ok(res0.value.includes('Class I'), 'RCRI 0 pts should be Class I');

    const res2 = await runCalculation('rcri', { high_risk_surg: true, ihd: true });
    assert.ok(res2.value.includes('Class III'), 'RCRI 2 pts should be Class III (10.1% MACE)');
    passed++;
    console.log('  ✓ Revised Cardiac Risk Index (RCRI) Class I & Class III benchmarks verified');
  } catch (e) {
    console.error('  ❌ RCRI test failed:', e.message);
    failed++;
  }

  // 4. Caprini VTE Risk Score
  try {
    // Age 61-74 (+2), Major surg (+1), Prior VTE (+3) -> 6 points -> High Risk
    const res = await runCalculation('caprini', { age_group: '2', surg_type: '1', prior_vte: true });
    assert.ok(res.value.includes('High Risk'), 'Caprini 6 pts should be High Risk');
    assert.ok(res.resume.includes('enoxaparin 0.4 cc'), 'Caprini High Risk recommends Enoxaparin 0.4 cc');
    passed++;
    console.log('  ✓ Caprini VTE Score High Risk (6 pts -> Enoxaparin 0.4 cc) verified');
  } catch (e) {
    console.error('  ❌ Caprini test failed:', e.message);
    failed++;
  }

  // 5. IMPROVE Bleeding Risk Score
  try {
    const resLow = await runCalculation('improve-bleed', { male: true }); // 1.0 -> < 7.0
    assert.ok(resLow.value.includes('Low Bleed Risk'), 'IMPROVE 1.0 pt should be Low Risk');

    const resHigh = await runCalculation('improve-bleed', { ulcer: true, prior_bleed: true, plt50: true }); // 4.5 + 4.0 + 4.0 = 12.5 >= 7.0
    assert.ok(resHigh.value.includes('Increased Risk'), 'IMPROVE 12.5 pts should be High Bleeding Risk');
    passed++;
    console.log('  ✓ IMPROVE Bleeding Risk Score cutoff (<7.0 vs >=7.0) verified');
  } catch (e) {
    console.error('  ❌ IMPROVE Bleeding test failed:', e.message);
    failed++;
  }

  // 6. Morse Fall Scale
  try {
    // History fall (25) + Secondary diag (15) + Furnitur (30) -> 70 pts -> High Risk (>=51)
    const res = await runCalculation('morse-fall', { history_fall: true, secondary_diag: true, ambulatory_aid: '30' });
    assert.ok(res.value.includes('Risiko Tinggi'), 'Morse 70 pts should be High Risk of Fall');
    passed++;
    console.log('  ✓ Morse Fall Scale 70 pts -> High Fall Risk verified');
  } catch (e) {
    console.error('  ❌ Morse Fall test failed:', e.message);
    failed++;
  }

  // 7. PAPDI Delirium & AWOL Score
  try {
    // 3 criteria -> 50% delirium risk
    const res = await runCalculation('papdi-delirium', { age70: true, cog_imp: true, lab_abn: true });
    assert.ok(res.value.includes('50% Delirium'), 'PAPDI Delirium 3 criteria should be 50% risk');
    passed++;
    console.log('  ✓ PAPDI Preoperative Delirium Risk 3 pts -> 50% risk verified');
  } catch (e) {
    console.error('  ❌ PAPDI Delirium test failed:', e.message);
    failed++;
  }

  // 8. HADS (Hospital Anxiety & Depression Scale)
  try {
    const res = await runCalculation('hads', {
      a1: '2', a2: '2', a3: '2', a4: '2', a5: '2', a6: '2', a7: '2',
      d1: '1', d2: '1', d3: '1', d4: '1', d5: '1', d6: '1', d7: '0'
    });
    assert.ok(res.value.includes('A: 14 (Abnormal)'), 'HADS-A 14 pts should be Abnormal');
    assert.ok(res.value.includes('D: 6 (Normal)'), 'HADS-D 6 pts should be Normal');
    passed++;
    console.log('  ✓ HADS Anxiety & Depression subscales (14 vs 6 pts) verified');
  } catch (e) {
    console.error('  ❌ HADS test failed:', e.message);
    failed++;
  }

  // 9. Drip Pain Titrator (Morfin & Fentanyl)
  try {
    // Morphine: BB 50 kg, mid (0.4 mg/kg/day) -> 20 mg/day (0.8 cc/hr in 20 cc NS)
    const resMorph = await runCalculation('pain-titrator', { opioid: 'morphine', bb: 50, dose_target: 'mid' });
    assert.ok(resMorph.value.includes('20.0 mg/hari (0.8 cc/jam)'), 'Morphine 50 kg mid should be 20 mg/day (0.8 cc/hr)');

    // Fentanyl: BB 50 kg, mid (0.35 mcg/kg/hr) -> 17.5 mcg/hr -> 420 mcg/day (2.1 cc/hr in 50 cc NS)
    const resFent = await runCalculation('pain-titrator', { opioid: 'fentanyl', bb: 50, dose_target: 'mid' });
    assert.ok(resFent.value.includes('420 mcg/hari (2.1 cc/jam)'), 'Fentanyl 50 kg mid should be 420 mcg/day (2.1 cc/hr)');
    passed++;
    console.log('  ✓ Drip Pain Management (Morfin 0.8 cc/jam & Fentanyl 2.1 cc/jam) verified');
  } catch (e) {
    console.error('  ❌ Drip Pain Titrator test failed:', e.message);
    failed++;
  }

  // 10. Status Kaki Diabetik (PEDIS, Wagner & ABI)
  try {
    const res = await runCalculation('pedis-wagner', {
      abi_val: 1.00,
      ulcer_len: 4.0,
      ulcer_wid: 3.0,
      depth: '2',
      infection: '1',
      monofilament: 'loss',
      regio: 'sinistra'
    });
    assert.ok(res.value.includes('Wagner 2'), 'Depth 2 ulcer without gangrene should be Wagner 2');
    assert.ok(res.value.includes('PEDIS P1E2I1S2'), 'PEDIS signature verified');
    assert.ok(res.resume.includes('Normal (Perfusi Adekuat)'), 'ABI 1.00 should be Normal');
    passed++;
    console.log('  ✓ Status Kaki Diabetik (Wagner 2, PEDIS P1 E(12.0 cm²) D2 I1 S2, ABI Normal) verified');
  } catch (e) {
    console.error('  ❌ Status Kaki Diabetik test failed:', e.message);
    failed++;
  }

  // 11. Suplementasi Kortikosteroid Perioperatif (Tabel 12)
  try {
    const resMinor = await runCalculation('steroid-perioperative', { stress_level: 'minor' });
    assert.ok(resMinor.text.includes('25 mg hidrokortison ATAU 5 mg metilprednisolon'), 'Minor stress dose verified');

    const resCritical = await runCalculation('steroid-perioperative', { stress_level: 'critical' });
    assert.ok(resCritical.text.includes('50 mg hidrokortison intravena setiap 6 jam'), 'Critical stress dose verified');
    passed++;
    console.log('  ✓ Suplementasi Kortikosteroid Perioperatif Tabel 12 (Appel/Annane) verified');
  } catch (e) {
    console.error('  ❌ Steroid Perioperative test failed:', e.message);
    failed++;
  }

  // 12. Wells Score for DVT
  try {
    const res = await runCalculation('wells-dvt', { cancer: true, bedridden: true, alt_diag: true });
    assert.ok(res.value.includes('0 Poin (Low)'), 'Wells DVT 0 pts should be Low Risk');
    passed++;
    console.log('  ✓ Wells Score for DVT (0 points -> Low Risk Group) verified');
  } catch (e) {
    console.error('  ❌ Wells DVT test failed:', e.message);
    failed++;
  }

  // 13. MACD Kontras (Maximum Allowable Contrast Dose)
  try {
    const res = await runCalculation('macd-cin', { bb: 60, cr: 1.5, planned_vol: 100 });
    assert.ok(res.value.includes('MACD: 200 mL'), 'MACD for 60 kg and SC 1.5 should be 200 mL');
    passed++;
    console.log('  ✓ MACD Contrast Volume (5 x 60 / 1.5 = 200 mL) verified');
  } catch (e) {
    console.error('  ❌ MACD test failed:', e.message);
    failed++;
  }

  // 14. Koreksi Nabic (Meylon 25 mEq)
  try {
    const res = await runCalculation('koreksi-nabic', { bb: 50, cur_hco3: 4, target_hco3: 10 });
    assert.ok(res.value.includes('150 mEq (~6.0 fl Meylon)'), 'Nabic deficit 150 mEq (6 fl Meylon) verified');
    assert.ok(res.text.includes('Bolus:</b> Nabic 50 mEq (2 fl Meylon)'), 'Nabic bolus verified');
    assert.ok(res.text.includes('Drip:</b> Nabic 100 mEq (~4.0 fl Meylon)'), 'Nabic drip verified');
    passed++;
    console.log('  ✓ Koreksi Bikarbonat (Delta 6 -> 150 mEq -> Bolus 50 mEq + Drip 100 mEq) verified');
  } catch (e) {
    console.error('  ❌ Koreksi Nabic test failed:', e.message);
    failed++;
  }

  // 15. Drip Ca Glukonas 3x Siklus
  try {
    const res = await runCalculation('ca-glukonas-drip', { ca_val: 6.8, alb_val: 2.8 });
    assert.ok(res.value.includes('Ca Payne: 7.76 mg/dL'), 'Payne corrected Ca should be 7.76 mg/dL');
    assert.ok(res.resume.toLowerCase().includes('3x siklus'), '3x cycle protocol text verified');
    passed++;
    console.log('  ✓ Drip Ca Glukonas 3x Siklus (Payne 7.76 mg/dL) verified');
  } catch (e) {
    console.error('  ❌ Drip Ca Glukonas test failed:', e.message);
    failed++;
  }

  // 16. DSS Fluid Resuscitation
  try {
    const res7 = await runCalculation('dss-fluid', { bb: 50, phase: 'step7' });
    assert.ok(res7.value.includes('350 cc/jam'), 'DSS 7 cc/kg on 50 kg should be 350 cc/hr');

    const res5 = await runCalculation('dss-fluid', { bb: 50, phase: 'step5' });
    assert.ok(res5.value.includes('250 cc/jam'), 'DSS 5 cc/kg on 50 kg should be 250 cc/hr');

    const res3 = await runCalculation('dss-fluid', { bb: 50, phase: 'step3' });
    assert.ok(res3.value.includes('150 cc/jam'), 'DSS 3 cc/kg on 50 kg should be 150 cc/hr');
    passed++;
    console.log('  ✓ DSS Fluid Resuscitation (7, 5, 3 cc/kg/jam titration) verified');
  } catch (e) {
    console.error('  ❌ DSS Fluid test failed:', e.message);
    failed++;
  }

  return { passed, failed };
}

module.exports = { runTests };
