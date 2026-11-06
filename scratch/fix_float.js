const fs = require('fs');

const filePath = 'adjustr-GEH.html';
let content = fs.readFileSync(filePath, 'utf8');

const oldAutoCalc = `            // Ratio ALP : AST or ALT
            if (!isNaN(alp) && (!isNaN(ast) || !isNaN(alt))) {
                let ratioAst = !isNaN(ast) && ast > 0 ? (alp / ast) : Infinity;
                let ratioAlt = !isNaN(alt) && alt > 0 ? (alp / alt) : Infinity;
                let minRatio = Math.min(ratioAst, ratioAlt);

                const selectRatio = document.getElementById('aih-alp-ratio');
                if (minRatio < 1.5) {
                    selectRatio.value = '<1.5';
                } else if (minRatio <= 3.0) {
                    selectRatio.value = '1.5-3.0';
                } else {
                    selectRatio.value = '>3.0';
                }
                appliedList.push(\`Rasio ALP/Transaminase: \${minRatio.toFixed(2)} (\${selectRatio.value})\`);
            }

            // Ratio Globulin or IgG times ULN
            if (!isNaN(proteinVal) && proteinUln > 0) {
                const timesUln = proteinVal / proteinUln;
                const selectIgg = document.getElementById('aih-igg-level');
                if (timesUln > 2.0) {
                    selectIgg.value = '>2.0';
                } else if (timesUln >= 1.5) {
                    selectIgg.value = '1.5-2.0';
                } else if (timesUln >= 1.0) {
                    selectIgg.value = '1.0-1.5';
                } else {
                    selectIgg.value = '<1.0';
                }
                const typeName = (currentAihProteinType === 'globulin') ? 'Globulin' : 'IgG';
                appliedList.push(\`\${typeName}: \${timesUln.toFixed(2)}× ULN (\${selectIgg.value})\`);
            }`;

const newAutoCalc = `            // Ratio ALP : AST or ALT (rounded to 2 decimal places to prevent float epsilon issues)
            if (!isNaN(alp) && (!isNaN(ast) || !isNaN(alt))) {
                let ratioAst = !isNaN(ast) && ast > 0 ? (alp / ast) : Infinity;
                let ratioAlt = !isNaN(alt) && alt > 0 ? (alp / alt) : Infinity;
                let minRatio = parseFloat(Math.min(ratioAst, ratioAlt).toFixed(2));

                const selectRatio = document.getElementById('aih-alp-ratio');
                if (minRatio < 1.5) {
                    selectRatio.value = '<1.5';
                } else if (minRatio <= 3.0) {
                    selectRatio.value = '1.5-3.0';
                } else {
                    selectRatio.value = '>3.0';
                }
                appliedList.push(\`Rasio ALP/Transaminase: \${minRatio.toFixed(2)} (\${selectRatio.value})\`);
            }

            // Ratio Globulin or IgG times ULN (rounded to 2 decimal places)
            if (!isNaN(proteinVal) && proteinUln > 0) {
                const timesUln = parseFloat((proteinVal / proteinUln).toFixed(2));
                const selectIgg = document.getElementById('aih-igg-level');
                if (timesUln > 2.0) {
                    selectIgg.value = '>2.0';
                } else if (timesUln >= 1.5) {
                    selectIgg.value = '1.5-2.0';
                } else if (timesUln >= 1.0) {
                    selectIgg.value = '1.0-1.5';
                } else {
                    selectIgg.value = '<1.0';
                }
                const typeName = (currentAihProteinType === 'globulin') ? 'Globulin' : 'IgG';
                appliedList.push(\`\${typeName}: \${timesUln.toFixed(2)}× ULN (\${selectIgg.value})\`);
            }`;

if (!content.includes(oldAutoCalc)) {
    console.error('Could not find oldAutoCalc');
    process.exit(1);
}

content = content.replace(oldAutoCalc, newAutoCalc);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated autoCalcLabRatios with precision rounding!');
