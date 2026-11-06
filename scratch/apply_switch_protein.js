const fs = require('fs');

const filePath = 'adjustr-GEH.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace the Serum Globulin / IgG input block in aih-module
const oldBlock = `                                <div>
                                    <label for="aih-igg-level" class="font-semibold text-slate-300 block mb-1">Serum Globulin atau IgG (&times; Batas Atas Normal) <span class="text-rose-400">*</span></label>
                                    <select id="aih-igg-level" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value=">2.0">&gt; 2.0 &times; ULN (+3 poin)</option>
                                        <option value="1.5-2.0" selected>1.5 - 2.0 &times; ULN (+2 poin)</option>
                                        <option value="1.0-1.5">1.0 - 1.5 &times; ULN (+1 poin)</option>
                                        <option value="<1.0">&lt; 1.0 &times; ULN / Normal (0 poin)</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">Dihitung berdasarkan kelipatan nilai batas atas normal (ULN) lab.</span>
                                </div>`;

const newBlock = `                                <div>
                                    <div class="flex items-center justify-between mb-1">
                                        <label id="aih-protein-label" for="aih-igg-level" class="font-semibold text-slate-300">
                                            Serum Globulin (&times; ULN) <span class="text-rose-400">*</span>
                                        </label>
                                        <!-- Switch Button Globulin vs IgG (Default: Globulin) -->
                                        <div class="flex items-center text-[10px] bg-slate-800/90 rounded-md p-0.5 border border-slate-700 shadow-sm">
                                            <button type="button" id="aih-toggle-globulin" onclick="switchAihProteinType('globulin')" class="px-2 py-0.5 rounded text-cyan-400 font-bold bg-slate-700/80 transition">
                                                Globulin
                                            </button>
                                            <button type="button" id="aih-toggle-igg" onclick="switchAihProteinType('igg')" class="px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition">
                                                IgG
                                            </button>
                                        </div>
                                    </div>
                                    <select id="aih-igg-level" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value=">2.0">&gt; 2.0 &times; ULN (+3 poin)</option>
                                        <option value="1.5-2.0" selected>1.5 - 2.0 &times; ULN (+2 poin)</option>
                                        <option value="1.0-1.5">1.0 - 1.5 &times; ULN (+1 poin)</option>
                                        <option value="<1.0">&lt; 1.0 &times; ULN / Normal (0 poin)</option>
                                    </select>
                                    <span id="aih-protein-hint" class="text-[10px] text-slate-400 mt-1 block">Parameter aktif: Serum Globulin (normal lab RS: ~3.2 - 3.5 g/dL).</span>
                                </div>`;

if (!content.includes(oldBlock)) {
    console.error('Could not find oldBlock in adjustr-GEH.html');
    process.exit(1);
}
content = content.replace(oldBlock, newBlock);

// 2. Update the accordion inputs in aih-module for quick calculation
const oldAccordionInputs = `                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">IgG (mg/dL)</label>
                                        <input type="number" id="aih-calc-igg" placeholder="mis. 2400" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">ULN IgG (mg/dL)</label>
                                        <input type="number" id="aih-calc-igg-uln" placeholder="mis. 1600" value="1600" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>`;

const newAccordionInputs = `                                    <div>
                                        <label id="aih-calc-protein-label" class="text-[11px] text-slate-300 block mb-0.5">Globulin (g/dL)</label>
                                        <input type="number" id="aih-calc-igg" step="0.1" placeholder="mis. 4.8" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                    <div>
                                        <label id="aih-calc-uln-label" class="text-[11px] text-slate-300 block mb-0.5">ULN Globulin (g/dL)</label>
                                        <input type="number" id="aih-calc-igg-uln" step="0.1" placeholder="mis. 3.2" value="3.2" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>`;

if (!content.includes(oldAccordionInputs)) {
    console.error('Could not find oldAccordionInputs in adjustr-GEH.html');
    process.exit(1);
}
content = content.replace(oldAccordionInputs, newAccordionInputs);

// 3. Update JavaScript functions
const jsMarker = `        // ==========================================
        // 2.12 REVISED ORIGINAL SCORE FOR AUTOIMMUNE HEPATITIS (AIH) - IAHG 1999
        // ==========================================`;

const newJsCode = `        // ==========================================
        // 2.12 REVISED ORIGINAL SCORE FOR AUTOIMMUNE HEPATITIS (AIH) - IAHG 1999
        // ==========================================

        let currentAihProteinType = 'globulin'; // Default parameter: Globulin

        function switchAihProteinType(type) {
            currentAihProteinType = type;
            const btnGlob = document.getElementById('aih-toggle-globulin');
            const btnIgg = document.getElementById('aih-toggle-igg');
            const label = document.getElementById('aih-protein-label');
            const hint = document.getElementById('aih-protein-hint');
            const calcProteinLabel = document.getElementById('aih-calc-protein-label');
            const calcUlnLabel = document.getElementById('aih-calc-uln-label');
            const calcInput = document.getElementById('aih-calc-igg');
            const calcUlnInput = document.getElementById('aih-calc-igg-uln');

            if (type === 'globulin') {
                if (btnGlob) {
                    btnGlob.className = 'px-2 py-0.5 rounded text-cyan-400 font-bold bg-slate-700/80 transition';
                }
                if (btnIgg) {
                    btnIgg.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition';
                }
                if (label) {
                    label.innerHTML = 'Serum Globulin (&times; ULN) <span class="text-rose-400">*</span>';
                }
                if (hint) {
                    hint.innerText = 'Parameter aktif: Serum Globulin (normal lab RS: ~3.2 - 3.5 g/dL).';
                }
                if (calcProteinLabel) calcProteinLabel.innerText = 'Globulin (g/dL)';
                if (calcUlnLabel) calcUlnLabel.innerText = 'ULN Globulin (g/dL)';
                if (calcInput) {
                    calcInput.placeholder = 'mis. 4.8';
                    calcInput.step = '0.1';
                }
                if (calcUlnInput && (calcUlnInput.value === '1600' || calcUlnInput.value === '')) {
                    calcUlnInput.value = '3.2';
                    calcUlnInput.placeholder = 'mis. 3.2';
                    calcUlnInput.step = '0.1';
                }
            } else {
                if (btnGlob) {
                    btnGlob.className = 'px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 transition';
                }
                if (btnIgg) {
                    btnIgg.className = 'px-2 py-0.5 rounded text-cyan-400 font-bold bg-slate-700/80 transition';
                }
                if (label) {
                    label.innerHTML = 'Serum IgG (&times; ULN) <span class="text-rose-400">*</span>';
                }
                if (hint) {
                    hint.innerText = 'Parameter aktif: Serum IgG (normal lab RS: ~700 - 1600 mg/dL).';
                }
                if (calcProteinLabel) calcProteinLabel.innerText = 'IgG (mg/dL)';
                if (calcUlnLabel) calcUlnLabel.innerText = 'ULN IgG (mg/dL)';
                if (calcInput) {
                    calcInput.placeholder = 'mis. 2400';
                    calcInput.step = '1';
                }
                if (calcUlnInput && (calcUlnInput.value === '3.2' || calcUlnInput.value === '')) {
                    calcUlnInput.value = '1600';
                    calcUlnInput.placeholder = 'mis. 1600';
                    calcUlnInput.step = '1';
                }
            }
        }`;

content = content.replace(jsMarker, newJsCode);

// 4. Update autoCalcLabRatios in content to use currentAihProteinType and default ULN
const oldAutoCalc = `            const igg = parseFloat(document.getElementById('aih-calc-igg').value);
            const iggUln = parseFloat(document.getElementById('aih-calc-igg-uln').value) || 1600;
            const hint = document.getElementById('aih-lab-calc-hint');

            let appliedList = [];

            // Ratio ALP : AST or ALT
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

            // Ratio IgG times ULN
            if (!isNaN(igg) && iggUln > 0) {
                const timesUln = igg / iggUln;
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
                appliedList.push(\`IgG: \${timesUln.toFixed(2)}× ULN (\${selectIgg.value})\`);
            }`;

const newAutoCalc = `            const proteinVal = parseFloat(document.getElementById('aih-calc-igg').value);
            const defaultUln = (currentAihProteinType === 'globulin') ? 3.2 : 1600;
            const proteinUln = parseFloat(document.getElementById('aih-calc-igg-uln').value) || defaultUln;
            const hint = document.getElementById('aih-lab-calc-hint');

            let appliedList = [];

            // Ratio ALP : AST or ALT
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

if (!content.includes(oldAutoCalc)) {
    console.error('Could not find oldAutoCalc in adjustr-GEH.html');
    process.exit(1);
}
content = content.replace(oldAutoCalc, newAutoCalc);

// 5. Update calculateAihScore breakdown to reflect whether Globulin or IgG is chosen
const oldBreakdownIgg = `            // 3. Globulins or IgG times ULN
            if (iggLevel === '>2.0') {
                score += 3;
                pointBreakdown.push({ param: 'Serum Globulin / IgG', val: '> 2.0 × ULN', pts: '+3' });
            } else if (iggLevel === '1.5-2.0') {
                score += 2;
                pointBreakdown.push({ param: 'Serum Globulin / IgG', val: '1.5 - 2.0 × ULN', pts: '+2' });
            } else if (iggLevel === '1.0-1.5') {
                score += 1;
                pointBreakdown.push({ param: 'Serum Globulin / IgG', val: '1.0 - 1.5 × ULN', pts: '+1' });
            } else {
                pointBreakdown.push({ param: 'Serum Globulin / IgG', val: '< 1.0 × ULN (Normal)', pts: '0' });
            }`;

const newBreakdownIgg = `            // 3. Globulins or IgG times ULN
            const proteinTitle = (currentAihProteinType === 'globulin') ? 'Serum Globulin' : 'Serum IgG';
            if (iggLevel === '>2.0') {
                score += 3;
                pointBreakdown.push({ param: \`\${proteinTitle} / ULN\`, val: '> 2.0 × ULN', pts: '+3' });
            } else if (iggLevel === '1.5-2.0') {
                score += 2;
                pointBreakdown.push({ param: \`\${proteinTitle} / ULN\`, val: '1.5 - 2.0 × ULN', pts: '+2' });
            } else if (iggLevel === '1.0-1.5') {
                score += 1;
                pointBreakdown.push({ param: \`\${proteinTitle} / ULN\`, val: '1.0 - 1.5 × ULN', pts: '+1' });
            } else {
                pointBreakdown.push({ param: \`\${proteinTitle} / ULN\`, val: '< 1.0 × ULN (Normal)', pts: '0' });
            }`;

if (!content.includes(oldBreakdownIgg)) {
    console.error('Could not find oldBreakdownIgg in adjustr-GEH.html');
    process.exit(1);
}
content = content.replace(oldBreakdownIgg, newBreakdownIgg);

// 6. Update resetAihScore to reset to Globulin
const oldResetAih = `        function resetAihScore() {
            const form = document.getElementById('aih-form');
            if (form) form.reset();`;

const newResetAih = `        function resetAihScore() {
            const form = document.getElementById('aih-form');
            if (form) form.reset();
            switchAihProteinType('globulin');`;

if (!content.includes(oldResetAih)) {
    console.error('Could not find oldResetAih in adjustr-GEH.html');
    process.exit(1);
}
content = content.replace(oldResetAih, newResetAih);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adjustr-GEH.html with Globulin / IgG switch button!');
