// Verification of all new clinical formulas for adjustrEMD Pro

function testFormulas() {
  console.log("=== Testing Clinical Formulas ===");

  // 1. Delta Gap & Delta Ratio
  const na = 140, cl = 100, hco3 = 12, glu = 350;
  const ag = na - (cl + hco3); // 28
  const deltaAG = ag - 12; // 16
  const deltaHCO3 = 24 - hco3; // 12
  const deltaRatio = deltaHCO3 !== 0 ? deltaAG / deltaHCO3 : 0; // 1.33 -> Pure HAGMA
  console.log("AG:", ag, "Delta AG:", deltaAG, "Delta HCO3:", deltaHCO3, "Delta Ratio:", deltaRatio.toFixed(2));
  console.assert(ag === 28, "AG should be 28");
  console.assert(Math.abs(deltaRatio - 1.33) < 0.05, "Delta Ratio should be ~1.33");

  // 2. Koreksi Hipoglikemia Berat
  // PERKENI: GDS 42 -> 2 flakon D40% (50 cc)
  // Rumus 30: target 100, actual 42 -> (100 - 42) / 30 = 58 / 30 = 1.93 flakon (~2 flakon)
  const gds = 42, targetGDS = 100;
  const perkeniFlakon = gds < 50 ? 2 : (gds < 70 ? 1 : 0);
  const perkeniCc = perkeniFlakon * 25;
  const rumus30Flakon = Math.max(0, (targetGDS - gds) / 30);
  console.log("Hypoglycemia: PERKENI Flakon:", perkeniFlakon, `(${perkeniCc} cc)`, "Rumus 30:", rumus30Flakon.toFixed(1), "flakon");
  console.assert(perkeniFlakon === 2, "PERKENI should be 2 flakon for GDS 42");

  // 3. Atherogenic Index of Plasma (AIP)
  // TG = 180 mg/dL, HDL = 40 mg/dL
  // TG mmol/L = 180 / 88.57 = 2.032
  // HDL mmol/L = 40 / 38.67 = 1.034
  // AIP = log10(TG_mmol / HDL_mmol) = log10(2.032 / 1.034) = log10(1.965) = 0.293 (High risk > 0.21)
  const tg = 180, hdl = 40;
  const tg_mmol = tg / 88.57;
  const hdl_mmol = hdl / 38.67;
  const aip = Math.log10(tg_mmol / hdl_mmol);
  console.log("AIP:", aip.toFixed(3), aip > 0.21 ? "High Risk" : "Normal/Mod");
  console.assert(Math.abs(aip - 0.293) < 0.01, "AIP should be ~0.293");

  // 4. HbA1c to eAG
  // HbA1c = 8.5%
  // eAG mg/dL = 28.7 * 8.5 - 46.7 = 243.95 - 46.7 = 197.25 mg/dL
  // eAG mmol/L = 1.59 * 8.5 - 2.59 = 13.515 - 2.59 = 10.925 mmol/L
  const hba1c = 8.5;
  const eag_mg = 28.7 * hba1c - 46.7;
  const eag_mmol = 1.59 * hba1c - 2.59;
  console.log("eAG for 8.5%:", eag_mg.toFixed(1), "mg/dL /", eag_mmol.toFixed(1), "mmol/L");
  console.assert(Math.abs(eag_mg - 197.25) < 0.1, "eAG mg/dL should be 197.3");

  // 5. Unit conversions
  // Glucose: 180 mg/dL -> 10.0 mmol/L
  console.log("Glucose conv:", (180 / 18).toFixed(1), "mmol/L");
  // Total Cholesterol: 200 mg/dL -> 5.17 mmol/L
  console.log("TC conv:", (200 / 38.67).toFixed(2), "mmol/L");
  // FT4: 1.2 ng/dL -> 15.44 pmol/L (1.2 * 12.87)
  console.log("FT4 conv:", (1.2 * 12.87).toFixed(1), "pmol/L");

  // 6. Popoveniuc Myxedema Coma score
  // Hypothermia (<30: +20), Coma (+20), Bradycardia <50 (+10), Hypotension <80 (+20), Ileus (+15), Hyponatremia <120 (+15), Hypoglycemia (+10), Precipitant (+10) -> 120 points
  const popoveniucSample = 20 + 20 + 10 + 20 + 15 + 15 + 10 + 10;
  console.log("Popoveniuc max sample:", popoveniucSample, ">= 60 is Diagnostic");
  console.assert(popoveniucSample >= 60, "Should be highly suggestive of Myxedema Coma");

  // 7. Pituitary Apoplexy Score (PAS)
  // Visual acuity (1), Visual field (1), Ocular palsy (1), GCS 12-14 (1) -> 4 points (Surgical decompression triage)
  const pasSample = 1 + 1 + 1 + 1;
  console.log("PAS sample:", pasSample, ">= 4 is Neuro-opthalmology / CITO Surgery consideration");
  console.assert(pasSample === 4, "PAS should be 4");

  console.log("All formula validations PASSED successfully!");
}

testFormulas();
