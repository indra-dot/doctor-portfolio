// Test cases for Revised AIH Score (Alvarez 1999)

function computeAihScore({
    sex, // 'female' (+2) or 'male' (0)
    alpRatio, // '<1.5' (+2), '1.5-3.0' (0), '>3.0' (-2)
    iggLevel, // '>2.0' (+3), '1.5-2.0' (+2), '1.0-1.5' (+1), '<1.0' (0)
    mainAntibody, // '>1:80' (+3), '1:80' (+2), '1:40' (+1), '<1:40' (0)
    ama, // 'pos' (-4) or 'neg' (0)
    viralMarkers, // 'neg' (+3) or 'pos' (-3)
    hepatotoxicDrugs, // 'no' (+1) or 'yes' (-4)
    alcoholIntake, // '<25' (+2), '25-60' (0), '>60' (-2)
    histologyDone, // boolean
    histologyInterface, // boolean (+3)
    histologyLympho, // boolean (+1)
    histologyRosettes, // boolean (+1)
    histologyBiliary, // boolean (-3)
    histologyOther, // boolean (-3)
    otherAutoimmune, // 'yes' (+2) or 'no' (0)
    otherAntibodies, // boolean (+2)
    hlaDr, // boolean (+1)
    therapyResponse // 'none' (0), 'complete' (+2), 'relapse' (+3)
}) {
    let score = 0;
    const breakdown = [];

    // 1. Sex
    if (sex === 'female') { score += 2; breakdown.push('Wanita: +2'); }
    else { breakdown.push('Pria: 0'); }

    // 2. ALP:AST/ALT ratio
    if (alpRatio === '<1.5') { score += 2; breakdown.push('Rasio ALP:AST/ALT <1.5: +2'); }
    else if (alpRatio === '>3.0') { score -= 2; breakdown.push('Rasio ALP:AST/ALT >3.0: -2'); }
    else { breakdown.push('Rasio ALP:AST/ALT 1.5-3.0: 0'); }

    // 3. Globulins or IgG
    if (iggLevel === '>2.0') { score += 3; breakdown.push('IgG/Globulin >2.0x ULN: +3'); }
    else if (iggLevel === '1.5-2.0') { score += 2; breakdown.push('IgG/Globulin 1.5-2.0x ULN: +2'); }
    else if (iggLevel === '1.0-1.5') { score += 1; breakdown.push('IgG/Globulin 1.0-1.5x ULN: +1'); }
    else { breakdown.push('IgG/Globulin <1.0x ULN: 0'); }

    // 4. ANA, SMA, LKM-1
    if (mainAntibody === '>1:80') { score += 3; breakdown.push('ANA/SMA/LKM-1 >1:80: +3'); }
    else if (mainAntibody === '1:80') { score += 2; breakdown.push('ANA/SMA/LKM-1 1:80: +2'); }
    else if (mainAntibody === '1:40') { score += 1; breakdown.push('ANA/SMA/LKM-1 1:40: +1'); }
    else { breakdown.push('ANA/SMA/LKM-1 <1:40: 0'); }

    // 5. AMA
    if (ama === 'pos') { score -= 4; breakdown.push('AMA Positif: -4'); }
    else { breakdown.push('AMA Negatif: 0'); }

    // 6. Viral markers
    if (viralMarkers === 'neg') { score += 3; breakdown.push('Penanda Hepatitis Virus Negatif: +3'); }
    else { score -= 3; breakdown.push('Penanda Hepatitis Virus Positif: -3'); }

    // 7. Hepatotoxic drugs
    if (hepatotoxicDrugs === 'no') { score += 1; breakdown.push('Tanpa Obat Hepatotoksik: +1'); }
    else { score -= 4; breakdown.push('Ada Riwayat Obat Hepatotoksik: -4'); }

    // 8. Alcohol
    if (alcoholIntake === '<25') { score += 2; breakdown.push('Alkohol <25 g/hari: +2'); }
    else if (alcoholIntake === '>60') { score -= 2; breakdown.push('Alkohol >60 g/hari: -2'); }
    else { breakdown.push('Alkohol 25-60 g/hari: 0'); }

    // 9. Histology
    if (histologyDone) {
        let histPoints = 0;
        let anyClassic = false;
        if (histologyInterface) { histPoints += 3; anyClassic = true; breakdown.push('Histologi Interface Hepatitis: +3'); }
        if (histologyLympho) { histPoints += 1; anyClassic = true; breakdown.push('Histologi Infiltrat Limfoplasmamositik: +1'); }
        if (histologyRosettes) { histPoints += 1; anyClassic = true; breakdown.push('Histologi Rosetting: +1'); }
        if (!anyClassic) {
            histPoints -= 5;
            breakdown.push('Histologi Tanpa Interface/Limfoplasma/Rosetting: -5');
        }
        if (histologyBiliary) { histPoints -= 3; breakdown.push('Histologi Perubahan Bilier: -3'); }
        if (histologyOther) { histPoints -= 3; breakdown.push('Histologi Gambaran Etiologi Lain: -3'); }
        score += histPoints;
    } else {
        breakdown.push('Biopsi Hepar Belum Dilakukan: 0');
    }

    // 10. Other autoimmune
    if (otherAutoimmune === 'yes') { score += 2; breakdown.push('Penyakit Autoimun Lain: +2'); }
    else { breakdown.push('Penyakit Autoimun Lain: 0'); }

    // 11. Optional parameters
    if (otherAntibodies) { score += 2; breakdown.push('Autoantibodi Spesifik Lain (SLA/LP/LC1/pANCA): +2'); }
    if (hlaDr) { score += 1; breakdown.push('HLA-DR3/DR4 Positif: +1'); }

    // 12. Response to therapy
    const isPostTx = (therapyResponse === 'complete' || therapyResponse === 'relapse');
    if (therapyResponse === 'complete') { score += 2; breakdown.push('Respon Terapi Komplet: +2'); }
    else if (therapyResponse === 'relapse') { score += 3; breakdown.push('Relaps Pasca Penghentian/Tapering Terapi: +3'); }
    else { breakdown.push('Evaluasi Pre-Treatment: 0'); }

    // Interpretation
    let interpretation = '';
    let category = '';
    let statusClass = '';

    if (!isPostTx) {
        if (score > 15) {
            category = 'Definite AIH (Pasti AIH)';
            interpretation = 'Skor >15 pada evaluasi pre-treatment mengonfirmasi diagnosis Definite Autoimmune Hepatitis.';
            statusClass = 'emerald';
        } else if (score >= 10) {
            category = 'Probable AIH (Kemungkinan AIH)';
            interpretation = 'Skor 10-15 pada evaluasi pre-treatment menunjukkan Probable Autoimmune Hepatitis.';
            statusClass = 'amber';
        } else {
            category = 'Unlikely AIH (Diagnosis Tidak Terbukti)';
            interpretation = 'Skor <10 menunjukkan diagnosis AIH tidak memenuhi kriteria.';
            statusClass = 'rose';
        }
    } else {
        if (score > 17) {
            category = 'Definite AIH (Pasti AIH) Post-Treatment';
            interpretation = 'Skor >17 pada evaluasi post-treatment mengonfirmasi diagnosis Definite Autoimmune Hepatitis.';
            statusClass = 'emerald';
        } else if (score >= 12) {
            category = 'Probable AIH (Kemungkinan AIH) Post-Treatment';
            interpretation = 'Skor 12-17 pada evaluasi post-treatment menunjukkan Probable Autoimmune Hepatitis.';
            statusClass = 'amber';
        } else {
            category = 'Unlikely AIH (Diagnosis Tidak Terbukti) Post-Treatment';
            interpretation = 'Skor <12 pasca terapi menunjukkan diagnosis AIH tidak terbukti.';
            statusClass = 'rose';
        }
    }

    return { score, isPostTx, category, statusClass, interpretation, breakdown };
}

// Test case 1: Typical female patient with definite AIH pre-treatment
const test1 = computeAihScore({
    sex: 'female', // +2
    alpRatio: '<1.5', // +2
    iggLevel: '>2.0', // +3
    mainAntibody: '>1:80', // +3
    ama: 'neg', // 0
    viralMarkers: 'neg', // +3
    hepatotoxicDrugs: 'no', // +1
    alcoholIntake: '<25', // +2
    histologyDone: true,
    histologyInterface: true, // +3
    histologyLympho: true, // +1
    histologyRosettes: false,
    histologyBiliary: false,
    histologyOther: false,
    otherAutoimmune: 'no', // 0
    otherAntibodies: false,
    hlaDr: false,
    therapyResponse: 'none'
});
console.log('Test 1 (Expected definite > 15):', test1.score, test1.category);
// 2 + 2 + 3 + 3 + 0 + 3 + 1 + 2 + 4 + 0 = 20

// Test case 2: Borderline / Probable AIH
const test2 = computeAihScore({
    sex: 'female', // +2
    alpRatio: '1.5-3.0', // 0
    iggLevel: '1.0-1.5', // +1
    mainAntibody: '1:40', // +1
    ama: 'neg', // 0
    viralMarkers: 'neg', // +3
    hepatotoxicDrugs: 'no', // +1
    alcoholIntake: '<25', // +2
    histologyDone: false, // 0
    histologyInterface: false,
    histologyLympho: false,
    histologyRosettes: false,
    histologyBiliary: false,
    histologyOther: false,
    otherAutoimmune: 'yes', // +2
    otherAntibodies: false,
    hlaDr: false,
    therapyResponse: 'none'
});
console.log('Test 2 (Expected probable 10-15):', test2.score, test2.category);
// 2 + 0 + 1 + 1 + 0 + 3 + 1 + 2 + 0 + 2 = 12 (Probable AIH)
