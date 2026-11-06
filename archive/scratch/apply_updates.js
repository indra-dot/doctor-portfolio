const fs = require('fs');

let html = fs.readFileSync('adjustr-GEH.html', 'utf8');

// 1. Header: Add Lab Ref button & update tool count to 31
const headerOld = `<div class="flex items-center space-x-2 shrink-0">
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">30 Tools</span>
            </div>`;

const headerNew = `<div class="flex items-center space-x-2 shrink-0">
                <button type="button" onclick="openLabRefModal()" class="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center font-medium shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <i class="fa-solid fa-flask-vial mr-1.5"></i> <span class="hidden sm:inline">Rujukan Lab RS</span><span class="sm:hidden">Lab RS</span>
                </button>
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">31 Tools</span>
            </div>`;

if (!html.includes(headerOld)) throw new Error('Header old not found');
html = html.replace(headerOld, headerNew);

// 2. Home Dashboard Hub 2 card: Update count & description
const hub2CardOld = `<h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">2. Hepatology & Cirrhosis</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Child-Pugh, MELD Trio, ESPEN Nutrition (Dry Weight), SAAG & PMN, FIB-4 & APRI, R-Factor, De Ritis, NFS, Maddrey, CLIF-C, Baveno VII.</p>
                        <span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka 11 Kalkulator <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>`;

const hub2CardNew = `<h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">2. Hepatology & Cirrhosis</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Child-Pugh, MELD Trio, ESPEN Nutrition, SAAG & PMN, FIB-4 & APRI, R-Factor, De Ritis, NFS, Maddrey, CLIF-C, Baveno VII, & Panel LFT RS.</p>
                        <span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka 12 Kalkulator <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>`;

if (!html.includes(hub2CardOld)) throw new Error('Hub2 card old not found');
html = html.replace(hub2CardOld, hub2CardNew);

// 3. Hepatology Hub list: Add card for Panel LFT & Protein RS
const hub2ListEndOld = `                    <!-- Baveno VII -->
                    <button type="button" onclick="navigateTo('baveno-module', 'Baveno VII Criteria', 'pill-hepa', 'hub-hepa')" class="glass-card rounded-xl p-5 flex items-start text-left cursor-pointer group">
                        <div class="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-lg mr-4 shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors">Baveno VII Criteria</h4>
                            <p class="text-xs text-slate-400">Evaluasi kekakuan hati (FibroScan) dan trombosit untuk menunda skrining EGD varises.</p>
                        </div>
                    </button>
                </div>
            </section>`;

const hub2ListEndNew = `                    <!-- Baveno VII -->
                    <button type="button" onclick="navigateTo('baveno-module', 'Baveno VII Criteria', 'pill-hepa', 'hub-hepa')" class="glass-card rounded-xl p-5 flex items-start text-left cursor-pointer group">
                        <div class="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-lg mr-4 shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors">Baveno VII Criteria</h4>
                            <p class="text-xs text-slate-400">Evaluasi kekakuan hati (FibroScan) dan trombosit untuk menunda skrining EGD varises.</p>
                        </div>
                    </button>

                    <!-- Profil LFT & Protein RS -->
                    <button type="button" onclick="navigateTo('lft-profile-module', 'Panel Faal Hati & Protein RS', 'pill-hepa', 'hub-hepa')" class="glass-card rounded-xl p-5 flex items-start text-left cursor-pointer group border-emerald-500/40">
                        <div class="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-lg mr-4 shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-flask-vial"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-1.5 mb-1">
                                <h4 class="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">Panel Faal Hati & Protein</h4>
                                <span class="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">Normal RS</span>
                            </div>
                            <p class="text-xs text-slate-400">Fraksi Bilirubin (Direk/Indirek), Enzim Hepatoseluler & Kolestatik (ALP/GGT), serta Rasio A/G Protein terkalibrasi RS.</p>
                        </div>
                    </button>
                </div>
            </section>`;

if (!html.includes(hub2ListEndOld)) throw new Error('Hub2 list end old not found');
html = html.replace(hub2ListEndOld, hub2ListEndNew);

// 4. GBS BUN in HTML
const gbsBunOld = `<input type="number" id="gbs-bun" step="0.1" placeholder="e.g. 8.5 (mmol/L) / 24 (mg/dL)" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span id="gbs-bun-hint" class="text-[11px] text-slate-400 mt-1 block">Satuan aktif: mmol/L (Normal ~2.5 - 7.1)</span>`;

const gbsBunNew = `<input type="number" id="gbs-bun" step="0.1" placeholder="e.g. 8.5 (mmol/L) / 24 (mg/dL)" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span id="gbs-bun-hint" class="text-[11px] text-slate-400 mt-1 block">Satuan aktif: mmol/L (Normal RS ~3.5 - 7.2 mmol/L | 9.8 - 20.1 mg/dL)</span>`;

if (!html.includes(gbsBunOld)) throw new Error('GBS BUN old not found');
html = html.replace(gbsBunOld, gbsBunNew);

// 5. GBS JS unit switch
const gbsJsOld = `        function setGbsBunUnit(unit) {
            gbsBunUnit = unit;
            const btnMmol = document.getElementById('gbs-bun-unit-mmol');
            const btnMg = document.getElementById('gbs-bun-unit-mg');
            const hint = document.getElementById('gbs-bun-hint');
            if (unit === 'mmol') {
                btnMmol.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                btnMg.className = 'px-1.5 py-0.5 rounded text-slate-400';
                hint.textContent = 'Satuan aktif: mmol/L (Normal ~2.5 - 7.1)';
            } else {
                btnMg.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                btnMmol.className = 'px-1.5 py-0.5 rounded text-slate-400';
                hint.textContent = 'Satuan aktif: mg/dL (Normal ~7 - 20 mg/dL)';
            }
        }`;

const gbsJsNew = `        function setGbsBunUnit(unit) {
            gbsBunUnit = unit;
            const btnMmol = document.getElementById('gbs-bun-unit-mmol');
            const btnMg = document.getElementById('gbs-bun-unit-mg');
            const hint = document.getElementById('gbs-bun-hint');
            if (unit === 'mmol') {
                btnMmol.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                btnMg.className = 'px-1.5 py-0.5 rounded text-slate-400';
                hint.textContent = 'Satuan aktif: mmol/L (Normal RS ~3.5 - 7.2 mmol/L)';
            } else {
                btnMg.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                btnMmol.className = 'px-1.5 py-0.5 rounded text-slate-400';
                hint.textContent = 'Satuan aktif: mg/dL (Nilai rujukan normal RS: 9.8 - 20.1 mg/dL)';
            }
        }`;

if (!html.includes(gbsJsOld)) throw new Error('GBS JS old not found');
html = html.replace(gbsJsOld, gbsJsNew);

// 6. AIMS65 Albumin hint
const aims65Old = `<span class="text-sm font-semibold text-white block">A - Albumin &lt; 3.0 g/dL (30 g/L)</span>
                                    <span class="text-xs text-slate-400">Hipoalbuminemia bermakna</span>`;

const aims65New = `<span class="text-sm font-semibold text-white block">A - Albumin &lt; 3.0 g/dL (30 g/L)</span>
                                    <span class="text-xs text-slate-400">Hipoalbuminemia bermakna (Nilai rujukan normal RS: 3.40 - 4.80 g/dL)</span>`;

if (!html.includes(aims65Old)) throw new Error('AIMS65 old not found');
html = html.replace(aims65Old, aims65New);

// 7. FIB-4 & APRI inputs & default ULN
const fib4InputsOld = `                            <div>
                                <label for="fib4-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="fib4-ast" placeholder="e.g. 64" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>
                            <div>
                                <label for="fib4-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="fib4-alt" placeholder="e.g. 58" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>
                            <div>
                                <label for="fib4-plt" class="text-xs font-semibold text-slate-300 mb-1 block">Trombosit / Platelet (10⁹/L atau x10³/µL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="fib4-plt" placeholder="e.g. 145" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>
                            <div>
                                <label for="fib4-ast-uln" class="text-xs font-semibold text-slate-300 mb-1 block">Batas Atas Normal AST (ULN, U/L)</label>
                                <input type="number" id="fib4-ast-uln" value="40" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>`;

const fib4InputsNew = `                            <div>
                                <label for="fib4-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="fib4-ast" placeholder="e.g. 64" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-0.5 block">Nilai rujukan normal RS: &lt; 34 U/L</span>
                            </div>
                            <div>
                                <label for="fib4-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="fib4-alt" placeholder="e.g. 58" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-0.5 block">Nilai rujukan normal RS: &lt; 55 U/L</span>
                            </div>
                            <div>
                                <label for="fib4-plt" class="text-xs font-semibold text-slate-300 mb-1 block">Trombosit / Platelet (10⁹/L atau x10³/µL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="fib4-plt" placeholder="e.g. 145" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>
                            <div>
                                <label for="fib4-ast-uln" class="text-xs font-semibold text-slate-300 mb-1 block">Batas Atas Normal AST (ULN RS, U/L)</label>
                                <input type="number" id="fib4-ast-uln" value="34" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-0.5 block">Terkalibrasi RS: 34 U/L (standar lab lama: 40)</span>
                            </div>`;

if (!html.includes(fib4InputsOld)) throw new Error('FIB4 inputs old not found');
html = html.replace(fib4InputsOld, fib4InputsNew);

// 8. FIB-4 JS default fallback: 40 -> 34
const fib4JsOld = `const uln = parseFloat(document.getElementById('fib4-ast-uln').value) || 40;`;
const fib4JsNew = `const uln = parseFloat(document.getElementById('fib4-ast-uln').value) || 34;`;

if (!html.includes(fib4JsOld)) throw new Error('FIB4 JS old not found');
html = html.replace(fib4JsOld, fib4JsNew);

// 9. Maddrey & Lille hints
const maddreyBiliOld = `<input type="number" id="maddrey-bili" step="0.1" placeholder="e.g. 14.2 (mg/dL) / 240 (µmol/L)" class="glass-input w-full px-3 py-2 rounded-lg text-sm">`;
const maddreyBiliNew = `<input type="number" id="maddrey-bili" step="0.1" placeholder="e.g. 14.2 (mg/dL) / 240 (µmol/L)" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500 mt-1 block">Nilai rujukan normal RS: 0.3 - 1.2 mg/dL</span>`;

if (!html.includes(maddreyBiliOld)) throw new Error('Maddrey bili old not found');
html = html.replace(maddreyBiliOld, maddreyBiliNew);

const lilleAlbOld = `<label for="lille-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Albumin Hari-0 (g/dL)</label>
                                    <input type="number" id="lille-alb" step="0.1" placeholder="e.g. 2.6" class="glass-input w-full px-3 py-2 rounded-lg text-sm">`;

const lilleAlbNew = `<label for="lille-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Albumin Hari-0 (g/dL)</label>
                                    <input type="number" id="lille-alb" step="0.1" placeholder="e.g. 2.6" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-500 mt-1 block">Nilai rujukan normal RS: 3.40 - 4.80 g/dL</span>`;

if (!html.includes(lilleAlbOld)) throw new Error('Lille alb old not found');
html = html.replace(lilleAlbOld, lilleAlbNew);

const lilleBiliOld = `                                <div>
                                    <label for="lille-bili0" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin Hari-0 (mg/dL)</label>
                                    <input type="number" id="lille-bili0" step="0.1" placeholder="e.g. 15.0" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                </div>
                                <div>
                                    <label for="lille-bili7" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin Hari-7 (mg/dL)</label>
                                    <input type="number" id="lille-bili7" step="0.1" placeholder="e.g. 11.2" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                </div>`;

const lilleBiliNew = `                                <div>
                                    <label for="lille-bili0" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin Hari-0 (mg/dL)</label>
                                    <input type="number" id="lille-bili0" step="0.1" placeholder="e.g. 15.0" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-500 mt-1 block">Normal RS: 0.3 - 1.2 mg/dL</span>
                                </div>
                                <div>
                                    <label for="lille-bili7" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin Hari-7 (mg/dL)</label>
                                    <input type="number" id="lille-bili7" step="0.1" placeholder="e.g. 11.2" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-500 mt-1 block">Normal RS: 0.3 - 1.2 mg/dL</span>
                                </div>`;

if (!html.includes(lilleBiliOld)) throw new Error('Lille bili old not found');
html = html.replace(lilleBiliOld, lilleBiliNew);

// 10. CLIF-C Bilirubin hint
const clifBiliOld = `<label for="clif-bili" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin (mg/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="clif-bili" step="0.1" placeholder="e.g. 8.4" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">`;

const clifBiliNew = `<label for="clif-bili" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin (mg/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="clif-bili" step="0.1" placeholder="e.g. 8.4" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500 mt-1 block">Nilai rujukan normal RS: 0.3 - 1.2 mg/dL</span>`;

if (!html.includes(clifBiliOld)) throw new Error('CLIF-C bili old not found');
html = html.replace(clifBiliOld, clifBiliNew);

// 11. CTP Bilirubin & Albumin hints
const ctpBiliOld = `<p id="ctp-bili-hint" class="text-[11px] text-slate-500 mt-1">Standar non-kolestatik: &lt;2, 2-3, &gt;3 mg/dL.</p>`;
const ctpBiliNew = `<p id="ctp-bili-hint" class="text-[11px] text-slate-500 mt-1">Standar non-kolestatik: &lt;2, 2-3, &gt;3 mg/dL. (Nilai rujukan normal RS: 0.3 - 1.2 mg/dL).</p>`;

if (!html.includes(ctpBiliOld)) throw new Error('CTP bili old not found');
html = html.replace(ctpBiliOld, ctpBiliNew);

const ctpAlbOld = `<select id="ctp-alb" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <option value="1">&gt; 3.5 g/dL (1 Poin)</option>
                                    <option value="2">2.8 - 3.5 g/dL (2 Poin)</option>
                                    <option value="3">&lt; 2.8 g/dL (3 Poin)</option>
                                </select>`;

const ctpAlbNew = `<select id="ctp-alb" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <option value="1">&gt; 3.5 g/dL (1 Poin)</option>
                                    <option value="2">2.8 - 3.5 g/dL (2 Poin)</option>
                                    <option value="3">&lt; 2.8 g/dL (3 Poin)</option>
                                </select>
                                <p class="text-[11px] text-slate-500 mt-1">Cutoff CTP: &gt;3.5, 2.8-3.5, &lt;2.8 g/dL. (Nilai rujukan normal RS: 3.40 - 4.80 g/dL).</p>`;

if (!html.includes(ctpAlbOld)) throw new Error('CTP alb old not found');
html = html.replace(ctpAlbOld, ctpAlbNew);

const ctpJsOld = `        function toggleCtpBiliHint() {
            const isPbc = document.getElementById('ctp-pbc-toggle').checked;
            const hint = document.getElementById('ctp-bili-hint');
            const select = document.getElementById('ctp-bili');
            if (isPbc) {
                hint.textContent = 'Kriteria kolestatik (PBC/PSC): <4, 4-10, >10 mg/dL.';
                select.options[0].text = '< 4.0 mg/dL (1 Poin)';
                select.options[1].text = '4.0 - 10.0 mg/dL (2 Poin)';
                select.options[2].text = '> 10.0 mg/dL (3 Poin)';
            } else {
                hint.textContent = 'Standar non-kolestatik: <2, 2-3, >3 mg/dL.';
                select.options[0].text = '< 2.0 mg/dL (1 Poin)';
                select.options[1].text = '2.0 - 3.0 mg/dL (2 Poin)';
                select.options[2].text = '> 3.0 mg/dL (3 Poin)';
            }
        }`;

const ctpJsNew = `        function toggleCtpBiliHint() {
            const isPbc = document.getElementById('ctp-pbc-toggle').checked;
            const hint = document.getElementById('ctp-bili-hint');
            const select = document.getElementById('ctp-bili');
            if (isPbc) {
                hint.textContent = 'Kriteria kolestatik (PBC/PSC): <4, 4-10, >10 mg/dL. (Normal RS: 0.3 - 1.2 mg/dL).';
                select.options[0].text = '< 4.0 mg/dL (1 Poin)';
                select.options[1].text = '4.0 - 10.0 mg/dL (2 Poin)';
                select.options[2].text = '> 10.0 mg/dL (3 Poin)';
            } else {
                hint.textContent = 'Standar non-kolestatik: <2, 2-3, >3 mg/dL. (Normal RS: 0.3 - 1.2 mg/dL).';
                select.options[0].text = '< 2.0 mg/dL (1 Poin)';
                select.options[1].text = '2.0 - 3.0 mg/dL (2 Poin)';
                select.options[2].text = '> 3.0 mg/dL (3 Poin)';
            }
        }`;

if (!html.includes(ctpJsOld)) throw new Error('CTP JS old not found');
html = html.replace(ctpJsOld, ctpJsNew);

// 12. MELD Trio hints (Bili, Na, Albumin)
const meldBiliOld = `<label for="meld-bili" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin (mg/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="meld-bili" step="0.1" placeholder="e.g. 2.4" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">`;

const meldBiliNew = `<label for="meld-bili" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin (mg/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="meld-bili" step="0.1" placeholder="e.g. 2.4" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500 mt-1 block">Nilai rujukan normal RS: 0.3 - 1.2 mg/dL</span>`;

if (!html.includes(meldBiliOld)) throw new Error('MELD bili old not found');
html = html.replace(meldBiliOld, meldBiliNew);

const meldNaOld = `<span class="text-[10px] text-slate-500">Rentang penyesuaian UNOS: 125 - 137</span>`;
const meldNaNew = `<span class="text-[10px] text-slate-500">Rentang UNOS: 125 - 137 | Normal RS: 136 - 145 mmol/L</span>`;

if (!html.includes(meldNaOld)) throw new Error('MELD Na old not found');
html = html.replace(meldNaOld, meldNaNew);

const meldAlbOld = `<span class="text-[10px] text-slate-500">Parameter spesifik MELD 3.0 (1.5 - 3.5)</span>`;
const meldAlbNew = `<span class="text-[10px] text-slate-500">Parameter MELD 3.0 (1.5 - 3.5) | Normal RS: 3.40 - 4.80 g/dL</span>`;

if (!html.includes(meldAlbOld)) throw new Error('MELD Alb old not found');
html = html.replace(meldAlbOld, meldAlbNew);

// 13. SAAG Serum Albumin hint
const saagAlbOld = `<label for="saag-serum-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Albumin Serum (g/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="saag-serum-alb" step="0.1" placeholder="e.g. 2.6" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">`;

const saagAlbNew = `<label for="saag-serum-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Albumin Serum (g/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="saag-serum-alb" step="0.1" placeholder="e.g. 2.6" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500 mt-1 block">Nilai rujukan normal RS: 3.40 - 4.80 g/dL</span>`;

if (!html.includes(saagAlbOld)) throw new Error('SAAG alb old not found');
html = html.replace(saagAlbOld, saagAlbNew);

// 14. R-Factor ALT & ALP ULN + Bilirubin
const rFactorAltOld = `<div>
                                <label for="rfactor-alt-uln" class="text-xs font-semibold text-slate-300 mb-1 block">Batas Atas Normal (ULN) ALT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="rfactor-alt-uln" value="35" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500">Nilai rujukan lab (Pria ~35 U/L, Wanita ~25 U/L)</span>
                            </div>`;

const rFactorAltNew = `<div>
                                <label for="rfactor-alt-uln" class="text-xs font-semibold text-slate-300 mb-1 block">Batas Atas Normal (ULN) ALT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="rfactor-alt-uln" value="55" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400">Terkalibrasi RS: &lt; 55 U/L (ULN: 55 U/L)</span>
                            </div>`;

if (!html.includes(rFactorAltOld)) throw new Error('R-factor ALT old not found');
html = html.replace(rFactorAltOld, rFactorAltNew);

const rFactorAlpOld = `<div>
                                <label for="rfactor-alp-uln" class="text-xs font-semibold text-slate-300 mb-1 block">Batas Atas Normal (ULN) ALP (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="rfactor-alp-uln" value="120" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500">Nilai rujukan lab (biasanya ~120 - 130 U/L)</span>
                            </div>`;

const rFactorAlpNew = `<div>
                                <label for="rfactor-alp-uln" class="text-xs font-semibold text-slate-300 mb-1 block">Batas Atas Normal (ULN) ALP (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="rfactor-alp-uln" value="150" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400">Terkalibrasi RS: 40 - 150 U/L (ULN: 150 U/L)</span>
                            </div>`;

if (!html.includes(rFactorAlpOld)) throw new Error('R-factor ALP old not found');
html = html.replace(rFactorAlpOld, rFactorAlpNew);

const rFactorBiliOld = `<div class="md:col-span-2">
                                <label for="rfactor-bili" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin Pasien (mg/dL) <span class="text-slate-500 font-normal">(Opsional - untuk deteksi kriteria Hy's Law)</span></label>
                                <input type="number" id="rfactor-bili" step="0.1" placeholder="e.g. 3.2" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>`;

const rFactorBiliNew = `<div class="md:col-span-2">
                                <label for="rfactor-bili" class="text-xs font-semibold text-slate-300 mb-1 block">Total Bilirubin Pasien (mg/dL) <span class="text-slate-400 font-normal">(Opsional - Kriteria Hy's Law: &ge; 2x ULN [Normal RS: 0.3 - 1.2 mg/dL &rarr; &ge; 2.4 mg/dL])</span></label>
                                <input type="number" id="rfactor-bili" step="0.1" placeholder="e.g. 3.2" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-500 mt-1 block">Nilai rujukan normal RS: 0.3 - 1.2 mg/dL</span>
                            </div>`;

if (!html.includes(rFactorBiliOld)) throw new Error('R-factor Bili old not found');
html = html.replace(rFactorBiliOld, rFactorBiliNew);

// 15. R-Factor JS Hy's Law check
const rFactorJsOld = `            // Hy's Law check
            let hysLawAlert = '';
            if (!isNaN(bili) && altRatio >= 3.0 && bili >= 2.0 && alpRatio < 2.0) {
                hysLawAlert = \`
                    <div class="mt-3 p-3 rounded-lg bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200">
                        <strong class="text-rose-300 block mb-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Memenuhi Kriteria Hy's Law (DILI Berat)</strong>
                        ALT ≥ 3x ULN dengan Total Bilirubin ≥ 2x ULN tanpa kolestasis awal (ALP &lt; 2x ULN). Menandakan risiko mortalitas hepar atau kebutuhan transplantasi hati hingga 10 - 50%. Hentikan segera obat yang dicurigai!
                    </div>
                \`;
            }`;

const rFactorJsNew = `            // Hy's Law check (Total Bilirubin >= 2x ULN, ULN RS: 1.2 mg/dL -> >= 2.4 mg/dL)
            let hysLawAlert = '';
            const biliUln = 1.2;
            const hysBiliThreshold = 2.0 * biliUln; // 2.4 mg/dL
            if (!isNaN(bili) && altRatio >= 3.0 && bili >= hysBiliThreshold && alpRatio < 2.0) {
                hysLawAlert = \`
                    <div class="mt-3 p-3 rounded-lg bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200">
                        <strong class="text-rose-300 block mb-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Memenuhi Kriteria Hy's Law (DILI Berat)</strong>
                        ALT ≥ 3x ULN dengan Total Bilirubin ≥ 2x ULN (≥ \${hysBiliThreshold.toFixed(1)} mg/dL [ULN RS: \${biliUln} mg/dL]) tanpa kolestasis awal (ALP &lt; 2x ULN). Menandakan risiko mortalitas hepar atau kebutuhan transplantasi hati hingga 10 - 50%. Hentikan segera obat yang dicurigai!
                    </div>
                \`;
            }`;

if (!html.includes(rFactorJsOld)) throw new Error('R-factor JS old not found');
html = html.replace(rFactorJsOld, rFactorJsNew);

// 16. De Ritis inputs & JS
const deRitisInputsOld = `                            <div>
                                <label for="deritis-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="deritis-ast" placeholder="e.g. 180" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>

                            <div>
                                <label for="deritis-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="deritis-alt" placeholder="e.g. 75" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>`;

const deRitisInputsNew = `                            <div>
                                <label for="deritis-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="deritis-ast" placeholder="e.g. 180" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-1 block">Nilai rujukan normal RS: &lt; 34 U/L</span>
                            </div>

                            <div>
                                <label for="deritis-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="deritis-alt" placeholder="e.g. 75" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-1 block">Nilai rujukan normal RS: &lt; 55 U/L</span>
                            </div>`;

if (!html.includes(deRitisInputsOld)) throw new Error('De Ritis inputs old not found');
html = html.replace(deRitisInputsOld, deRitisInputsNew);

const deRitisJsOld = `                            <div class="flex items-center space-x-4 my-2 text-xs text-slate-300">
                                <span>AST: <strong class="text-white">\${ast} U/L</strong></span>
                                <span>ALT: <strong class="text-white">\${alt} U/L</strong></span>
                            </div>`;

const deRitisJsNew = `                            <div class="flex items-center space-x-4 my-2 text-xs text-slate-300 flex-wrap gap-y-1">
                                <span>AST: <strong class="text-white">\${ast} U/L</strong> <span class="text-[11px] text-slate-400">(Ref RS: &lt;34)</span></span>
                                <span>ALT: <strong class="text-white">\${alt} U/L</strong> <span class="text-[11px] text-slate-400">(Ref RS: &lt;55)</span></span>
                            </div>`;

if (!html.includes(deRitisJsOld)) throw new Error('De Ritis JS old not found');
html = html.replace(deRitisJsOld, deRitisJsNew);

// 17. NFS & BARD inputs
const nfsInputsOld = `                            <div>
                                <label for="nfs-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-ast" placeholder="e.g. 55" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>

                            <div>
                                <label for="nfs-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-alt" placeholder="e.g. 62" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>

                            <div>
                                <label for="nfs-plt" class="text-xs font-semibold text-slate-300 mb-1 block">Trombosit (10⁹/L atau x10³/µL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-plt" placeholder="e.g. 185" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>

                            <div class="md:col-span-3">
                                <label for="nfs-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Serum Albumin (g/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-alb" step="0.1" placeholder="e.g. 3.8" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>`;

const nfsInputsNew = `                            <div>
                                <label for="nfs-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-ast" placeholder="e.g. 55" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-0.5 block">Nilai rujukan RS: &lt; 34 U/L</span>
                            </div>

                            <div>
                                <label for="nfs-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-alt" placeholder="e.g. 62" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-0.5 block">Nilai rujukan RS: &lt; 55 U/L</span>
                            </div>

                            <div>
                                <label for="nfs-plt" class="text-xs font-semibold text-slate-300 mb-1 block">Trombosit (10⁹/L atau x10³/µL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-plt" placeholder="e.g. 185" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                            </div>

                            <div class="md:col-span-3">
                                <label for="nfs-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Serum Albumin (g/dL) <span class="text-rose-400">*</span></label>
                                <input type="number" id="nfs-alb" step="0.1" placeholder="e.g. 3.8" required class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                <span class="text-[10px] text-slate-400 mt-0.5 block">Nilai rujukan RS: 3.40 - 4.80 g/dL</span>
                            </div>`;

if (!html.includes(nfsInputsOld)) throw new Error('NFS inputs old not found');
html = html.replace(nfsInputsOld, nfsInputsNew);

// 18. TG18 Cholangitis Jaundice item
const tg18JaundiceOld = `<label class="flex items-center p-3 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="tg-chol-jaundice" class="w-4 h-4 accent-cyan-400 rounded">
                                    <span class="ml-3 text-xs sm:text-sm text-slate-200">Ikterus (Bilirubin &ge; 2.0 mg/dL)</span>
                                </label>`;

const tg18JaundiceNew = `<label class="flex items-start p-3 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="tg-chol-jaundice" class="mt-1 w-4 h-4 accent-cyan-400 rounded">
                                    <div class="ml-3">
                                        <span class="text-xs sm:text-sm text-slate-200 block">Ikterus / Kolestasis (Bilirubin &ge; 2.0 mg/dL atau LFT &gt; 1.5x ULN RS)</span>
                                        <span class="text-[10px] text-slate-400">Rujukan RS: Bili 0.3 - 1.2 mg/dL, ALP 40 - 150 U/L, GGT &lt; 33 U/L, AST &lt; 34 U/L, ALT &lt; 55 U/L</span>
                                    </div>
                                </label>`;

if (!html.includes(tg18JaundiceOld)) throw new Error('TG18 jaundice old not found');
html = html.replace(tg18JaundiceOld, tg18JaundiceNew);

// 19. BISAP BUN item
const bisapBunOld = `<label class="flex items-start p-3 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer hover:border-cyan-400/50 transition-colors">
                                <input type="checkbox" id="bisap-b" class="mt-1 w-4 h-4 accent-cyan-400 rounded">
                                <div class="ml-3">
                                    <span class="text-xs sm:text-sm font-bold text-white block">B - BUN &gt; 25 mg/dL (&gt; 8.9 mmol/L)</span>
                                    <span class="text-[11px] text-slate-400">Peningkatan nitrogen urea darah akibat hemokonsentrasi atau disfungsi renal akut</span>
                                </div>
                            </label>`;

const bisapBunNew = `<label class="flex items-start p-3 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer hover:border-cyan-400/50 transition-colors">
                                <input type="checkbox" id="bisap-b" class="mt-1 w-4 h-4 accent-cyan-400 rounded">
                                <div class="ml-3">
                                    <span class="text-xs sm:text-sm font-bold text-white block">B - BUN &gt; 25 mg/dL (&gt; 8.9 mmol/L)</span>
                                    <span class="text-[11px] text-slate-400">Peningkatan BUN di atas batas normal (Nilai rujukan normal RS: 9.8 - 20.1 mg/dL)</span>
                                </div>
                            </label>`;

if (!html.includes(bisapBunOld)) throw new Error('BISAP bun old not found');
html = html.replace(bisapBunOld, bisapBunNew);

// 20. Ranson AST & BUN items
const ransonAstOld = `<label class="flex items-start p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="ranson-ast" class="mt-1 w-4 h-4 accent-cyan-400 rounded">
                                    <div class="ml-3">
                                        <span id="ranson-ast-label" class="text-xs sm:text-sm font-semibold text-slate-200 block">Serum AST / SGOT &gt; 250 U/L</span>
                                    </div>
                                </label>`;

const ransonAstNew = `<label class="flex items-start p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="ranson-ast" class="mt-1 w-4 h-4 accent-cyan-400 rounded">
                                    <div class="ml-3">
                                        <span id="ranson-ast-label" class="text-xs sm:text-sm font-semibold text-slate-200 block">Serum AST / SGOT &gt; 250 U/L</span>
                                        <span class="text-[10px] text-slate-400">Peningkatan &gt; 7x ULN (Nilai rujukan normal RS: &lt; 34 U/L)</span>
                                    </div>
                                </label>`;

if (!html.includes(ransonAstOld)) throw new Error('Ranson AST old not found');
html = html.replace(ransonAstOld, ransonAstNew);

const ransonBunOld = `<label class="flex items-start p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="ranson-bun" class="mt-1 w-4 h-4 accent-amber-400 rounded">
                                    <div class="ml-3">
                                        <span id="ranson-bun-label" class="text-xs sm:text-sm font-semibold text-slate-200 block">Peningkatan BUN &gt; 5 mg/dL (&gt; 1.8 mmol/L)</span>
                                    </div>
                                </label>`;

const ransonBunNew = `<label class="flex items-start p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="ranson-bun" class="mt-1 w-4 h-4 accent-amber-400 rounded">
                                    <div class="ml-3">
                                        <span id="ranson-bun-label" class="text-xs sm:text-sm font-semibold text-slate-200 block">Peningkatan BUN &gt; 5 mg/dL (&gt; 1.8 mmol/L)</span>
                                        <span class="text-[10px] text-slate-400">Peningkatan pasca 48 jam (Nilai rujukan baseline RS: 9.8 - 20.1 mg/dL)</span>
                                    </div>
                                </label>`;

if (!html.includes(ransonBunOld)) throw new Error('Ranson BUN old not found');
html = html.replace(ransonBunOld, ransonBunNew);

// 21. Add new calculator: Panel Faal Hati & Protein RS (Module section HTML)
const insertionPointOld = `            <!-- 3.1 Tokyo Guidelines 2018 -->`;

const newLftModuleHtml = `            <!-- 2.12 Panel Faal Hati, Fraksi Bilirubin & Rasio Protein A/G (Terkalibrasi RS) -->
            <section id="lft-profile-module" class="module-section hidden">
                <div class="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3 flex-wrap">
                        <button type="button" onclick="navigateTo('hub-hepa', 'Hepatology Hub', 'pill-hepa')" class="btn-back">
                            <i class="fa-solid fa-arrow-left"></i> Kembali ke Hepatology
                        </button>
                        <div class="flex items-center space-x-2">
                            <button type="button" onclick="openLabRefModal()" class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center">
                                <i class="fa-solid fa-table-list mr-1.5"></i> Tabel Rujukan RS
                            </button>
                            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">Terkalibrasi RS</span>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h2 class="text-xl sm:text-2xl font-bold text-white">Panel Faal Hati, Fraksi Bilirubin &amp; Rasio Protein A/G</h2>
                        <p class="text-slate-400 text-xs sm:text-sm mt-1">Analisis profil laboratorium hati terkalibrasi nilai rujukan normal Rumah Sakit: fraksi bilirubin (direk vs indirek), enzim hepatoseluler (AST/ALT) &amp; De Ritis, penanda kolestasis (ALP &amp; GGT), serta fraksi protein &amp; rasio A/G.</p>
                    </div>

                    <form id="lft-profile-form" class="space-y-4">
                        <!-- Grup 1: Fraksi Bilirubin -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-droplet mr-1.5"></i> 1. Fraksi Bilirubin Serum (mg/dL)
                                </h4>
                                <span class="text-[10px] text-slate-400">Rujukan RS: Total 0.3 - 1.2 | Direk 0.0 - 0.5 | Indirek 0.2 - 0.7</span>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label for="lft-bili-tot" class="text-xs font-semibold text-slate-300 mb-1 block">Bilirubin Total (mg/dL) <span class="text-rose-400">*</span></label>
                                    <input type="number" id="lft-bili-tot" step="0.01" placeholder="e.g. 3.20" oninput="autoCalcLftFractions()" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 0.3 - 1.2 mg/dL</span>
                                </div>
                                <div>
                                    <label for="lft-bili-dir" class="text-xs font-semibold text-slate-300 mb-1 block">Bilirubin Direk (mg/dL) <span class="text-rose-400">*</span></label>
                                    <input type="number" id="lft-bili-dir" step="0.01" placeholder="e.g. 2.10" oninput="autoCalcLftFractions()" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 0.0 - 0.5 mg/dL</span>
                                </div>
                                <div>
                                    <label for="lft-bili-indir" class="text-xs font-semibold text-slate-300 mb-1 block">Bilirubin Indirek (mg/dL) <span class="text-slate-500 font-normal">(Otomatis)</span></label>
                                    <input type="number" id="lft-bili-indir" step="0.01" placeholder="Auto: Total - Direk" class="glass-input w-full px-3 py-2 rounded-lg text-sm bg-slate-900/90 text-amber-300">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 0.2 - 0.7 mg/dL</span>
                                </div>
                            </div>
                        </div>

                        <!-- Grup 2: Enzim Hepatoseluler & Kolestatik -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-dna mr-1.5"></i> 2. Enzim Hepatoseluler &amp; Kolestasis (U/L)
                                </h4>
                                <span class="text-[10px] text-slate-400">Rujukan RS: AST &lt;34 | ALT &lt;55 | ALP 40-150 | GGT &lt;33</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                    <label for="lft-ast" class="text-xs font-semibold text-slate-300 mb-1 block">AST / SGOT (U/L)</label>
                                    <input type="number" id="lft-ast" step="1" placeholder="e.g. 45" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: &lt; 34 U/L</span>
                                </div>
                                <div>
                                    <label for="lft-alt" class="text-xs font-semibold text-slate-300 mb-1 block">ALT / SGPT (U/L)</label>
                                    <input type="number" id="lft-alt" step="1" placeholder="e.g. 68" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: &lt; 55 U/L</span>
                                </div>
                                <div>
                                    <label for="lft-alp" class="text-xs font-semibold text-slate-300 mb-1 block">Fosfatase Alkali / ALP (U/L)</label>
                                    <input type="number" id="lft-alp" step="1" placeholder="e.g. 195" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 40 - 150 U/L</span>
                                </div>
                                <div>
                                    <label for="lft-ggt" class="text-xs font-semibold text-slate-300 mb-1 block">Gamma GT / GGT (U/L)</label>
                                    <input type="number" id="lft-ggt" step="1" placeholder="e.g. 78" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: &lt; 33 U/L</span>
                                </div>
                            </div>
                        </div>

                        <!-- Grup 3: Protein Total, Albumin, Globulin & Rasio A/G -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-layer-group mr-1.5"></i> 3. Profil Protein &amp; Rasio A/G (g/dL)
                                </h4>
                                <span class="text-[10px] text-slate-400">Rujukan RS: Protein 6.40-8.30 | Alb 3.40-4.80 | Glob 2.2-3.7</span>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label for="lft-prot-tot" class="text-xs font-semibold text-slate-300 mb-1 block">Protein Total (g/dL)</label>
                                    <input type="number" id="lft-prot-tot" step="0.01" placeholder="e.g. 7.10" oninput="autoCalcLftFractions()" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 6.40 - 8.30 g/dL</span>
                                </div>
                                <div>
                                    <label for="lft-alb" class="text-xs font-semibold text-slate-300 mb-1 block">Serum Albumin (g/dL)</label>
                                    <input type="number" id="lft-alb" step="0.01" placeholder="e.g. 3.20" oninput="autoCalcLftFractions()" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 3.40 - 4.80 g/dL</span>
                                </div>
                                <div>
                                    <label for="lft-glob" class="text-xs font-semibold text-slate-300 mb-1 block">Globulin (g/dL) <span class="text-slate-500 font-normal">(Otomatis)</span></label>
                                    <input type="number" id="lft-glob" step="0.01" placeholder="Auto: Total - Albumin" class="glass-input w-full px-3 py-2 rounded-lg text-sm bg-slate-900/90 text-emerald-300">
                                    <span class="text-[10px] text-slate-400 mt-1 block">Normal RS: 2.2 - 3.7 g/dL</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-2 flex items-center space-x-3">
                            <button type="button" onclick="calculateLftProfile()" class="glass-btn px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center">
                                <i class="fa-solid fa-microscope mr-2"></i> Analisis Profil Faal Hati &amp; Protein
                            </button>
                            <button type="button" onclick="resetLftProfile()" class="glass-btn-secondary px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white">
                                Reset Form
                            </button>
                        </div>
                    </form>

                    <div id="lft-profile-result-container" class="hidden mt-6"></div>

                    <div class="mt-8 pt-4 border-t border-slate-800 text-xs">
                        <div class="flex items-center text-cyan-400 font-semibold mb-2">
                            <i class="fa-solid fa-book-medical mr-2"></i> Clinical Reference &amp; Guidelines
                        </div>
                        <p class="text-slate-300"><strong>ACG Clinical Guideline (2017):</strong> Evaluation of Abnormal Liver Chemistries (Kwo PY, Cohen SM, Lim JK). <em>Am J Gastroenterol</em>. 2017;112(1):18-35. Fraksi bilirubin direk &gt;50% mengonfirmasi hiperbilirubinemia terkonjugasi/kolestatik. Rasio A/G &lt;1.0 (reversal) merupakan penanda penurunan fungsi sintesis hepatik kronis dan hipergamaglobulinemia poliklonal pada sirosis hepar.</p>
                    </div>
                </div>
            </section>

`;

if (!html.includes(insertionPointOld)) throw new Error('Insertion point old not found');
html = html.replace(insertionPointOld, newLftModuleHtml + insertionPointOld);

// 22. Register in CALCULATORS_DB
const dbOld = `            { id: 'baveno-module', name: 'Baveno VII Criteria', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Evaluasi kekakuan hati (FibroScan) dan trombosit untuk menunda skrining EGD varises.', keywords: ['baveno vii', 'fibroscan', 'lsm', 'trombosit', 'varises', 'hipertensi portal'] },`;

const dbNew = `            { id: 'baveno-module', name: 'Baveno VII Criteria', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Evaluasi kekakuan hati (FibroScan) dan trombosit untuk menunda skrining EGD varises.', keywords: ['baveno vii', 'fibroscan', 'lsm', 'trombosit', 'varises', 'hipertensi portal'] },
            { id: 'lft-profile-module', name: 'Panel Faal Hati & Protein RS', category: 'Hepatology', color: 'emerald', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Analisis fraksi bilirubin, enzim hepatoseluler/kolestasis (ALP & GGT), dan rasio A/G protein normal RS.', keywords: ['lft', 'faal hati', 'bilirubin direk', 'bilirubin indirek', 'ast', 'alt', 'alp', 'ggt', 'gamma gt', 'protein total', 'albumin', 'globulin', 'rasio ag', 'nilai normal rs'] },`;

if (!html.includes(dbOld)) throw new Error('CALCULATORS_DB old not found');
html = html.replace(dbOld, dbNew);

// 23. Add JS Functions for LFT Profile & Lab Reference Modal
const jsInsertionPointOld = `        // ==========================================
        // 3. PANCREATOBILIARY & INFECTION LOGIC
        // ==========================================`;

const newJsCode = `        // ==========================================
        // 2.12 PANEL FAAL HATI & PROTEIN RS LOGIC
        // ==========================================

        function autoCalcLftFractions() {
            const totBili = parseFloat(document.getElementById('lft-bili-tot').value);
            const dirBili = parseFloat(document.getElementById('lft-bili-dir').value);
            const indirInput = document.getElementById('lft-bili-indir');

            if (!isNaN(totBili) && !isNaN(dirBili)) {
                const calculatedIndir = Math.max(0, totBili - dirBili);
                indirInput.value = calculatedIndir.toFixed(2);
            }

            const totProt = parseFloat(document.getElementById('lft-prot-tot').value);
            const alb = parseFloat(document.getElementById('lft-alb').value);
            const globInput = document.getElementById('lft-glob');

            if (!isNaN(totProt) && !isNaN(alb)) {
                const calculatedGlob = Math.max(0, totProt - alb);
                globInput.value = calculatedGlob.toFixed(2);
            }
        }

        function resetLftProfile() {
            document.getElementById('lft-profile-form').reset();
            const res = document.getElementById('lft-profile-result-container');
            res.innerHTML = '';
            res.classList.add('hidden');
        }

        function calculateLftProfile() {
            const res = document.getElementById('lft-profile-result-container');

            const totBili = parseFloat(document.getElementById('lft-bili-tot').value);
            const dirBili = parseFloat(document.getElementById('lft-bili-dir').value);
            let indirBili = parseFloat(document.getElementById('lft-bili-indir').value);

            const ast = parseFloat(document.getElementById('lft-ast').value);
            const alt = parseFloat(document.getElementById('lft-alt').value);
            const alp = parseFloat(document.getElementById('lft-alp').value);
            const ggt = parseFloat(document.getElementById('lft-ggt').value);

            const totProt = parseFloat(document.getElementById('lft-prot-tot').value);
            const alb = parseFloat(document.getElementById('lft-alb').value);
            let glob = parseFloat(document.getElementById('lft-glob').value);

            // Validasi: setidaknya ada satu kelompok data yang diisi
            const hasBili = !isNaN(totBili) || !isNaN(dirBili);
            const hasEnzyme = !isNaN(ast) || !isNaN(alt) || !isNaN(alp) || !isNaN(ggt);
            const hasProtein = !isNaN(totProt) || !isNaN(alb);

            if (!hasBili && !hasEnzyme && !hasProtein) {
                res.innerHTML = \`<div class="p-4 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-sm">Mohon isi setidaknya salah satu parameter laboratorium (Bilirubin, Enzim Hati, atau Protein Serum).</div>\`;
                res.classList.remove('hidden');
                return;
            }

            // Reference Constants RS
            const REF = {
                biliTot: { min: 0.3, max: 1.2 },
                biliDir: { min: 0.0, max: 0.5 },
                biliIndir: { min: 0.2, max: 0.7 },
                ast: { max: 34 },
                alt: { max: 55 },
                alp: { min: 40, max: 150 },
                ggt: { max: 33 },
                protTot: { min: 6.40, max: 8.30 },
                alb: { min: 3.40, max: 4.80 },
                glob: { min: 2.2, max: 3.7 }
            };

            let cardsHtml = '';
            let resumeParts = [];

            // 1. Bilirubin Analysis Card
            if (!isNaN(totBili) || !isNaN(dirBili)) {
                if (isNaN(indirBili) && !isNaN(totBili) && !isNaN(dirBili)) {
                    indirBili = Math.max(0, totBili - dirBili);
                }
                const bTotStr = !isNaN(totBili) ? totBili.toFixed(2) : '-';
                const bDirStr = !isNaN(dirBili) ? dirBili.toFixed(2) : '-';
                const bIndirStr = !isNaN(indirBili) ? indirBili.toFixed(2) : '-';

                let biliCategory = 'Kadar Normal';
                let biliColor = 'emerald';
                let biliAdvice = 'Metabolisme bilirubin dalam batas normal rujukan RS.';
                let directPct = null;

                if (!isNaN(totBili) && totBili > REF.biliTot.max) {
                    if (!isNaN(dirBili) && totBili > 0) {
                        directPct = (dirBili / totBili) * 100;
                        if (directPct > 50) {
                            biliCategory = 'Hiperbilirubinemia Terkonjugasi / Direk (> 50%)';
                            biliColor = 'rose';
                            biliAdvice = \`Fraksi Direk \${directPct.toFixed(1)}% menandakan defek ekskresi kanalikular atau obstruksi bilier ekstra/intra-hepatik (Kolelitiasis, striktur, kolangitis, keganasan kaput pankreas, atau kolestasis obat).\`;
                        } else if (directPct >= 20) {
                            biliCategory = 'Hiperbilirubinemia Campuran / Hepatoseluler (20 - 50%)';
                            biliColor = 'amber';
                            biliAdvice = \`Fraksi Direk \${directPct.toFixed(1)}% menandakan kombinasi cedera integritas membran hepatosit dan ekskresi kanalikuli (Hepatitis virus akut, sirosis hepar dekompensata, atau toksisitas obat).\`;
                        } else {
                            biliCategory = 'Hiperbilirubinemia Tak Terkonjugasi / Indirek (< 20%)';
                            biliColor = 'amber';
                            biliAdvice = \`Fraksi Direk \${directPct.toFixed(1)}% menandakan dominasi indirek: pertimbangkan hemolisis berlebih, sindrom Gilbert (defisiensi glukuronil transferase), atau hematoma masif.\`;
                        }
                    } else {
                        biliCategory = 'Hiperbilirubinemia Total Meningkat';
                        biliColor = 'amber';
                        biliAdvice = 'Kadar bilirubin total di atas normal RS (> 1.2 mg/dL). Lengkapi data bilirubin direk untuk menentukan fraksi.';
                    }
                }

                resumeParts.push(\`Fraksi Bilirubin: Tot \${bTotStr}, Dir \${bDirStr}, Indir \${bIndirStr} mg/dL (\${biliCategory})\`);

                cardsHtml += \`
                    <div class="p-4 rounded-xl bg-\${biliColor}-950/20 border border-\${biliColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-\${biliColor}-400 uppercase tracking-wider">Fraksi Bilirubin Serum</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-\${biliColor}-500/20 text-\${biliColor}-300">\${biliCategory}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Total (RS: 0.3-1.2)</span>
                                <span class="text-sm font-bold \${!isNaN(totBili) && totBili > REF.biliTot.max ? 'text-amber-400' : 'text-white'}">\${bTotStr}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Direk (RS: 0.0-0.5)</span>
                                <span class="text-sm font-bold \${!isNaN(dirBili) && dirBili > REF.biliDir.max ? 'text-rose-400' : 'text-white'}">\${bDirStr}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Indirek (RS: 0.2-0.7)</span>
                                <span class="text-sm font-bold \${!isNaN(indirBili) && indirBili > REF.biliIndir.max ? 'text-amber-400' : 'text-white'}">\${bIndirStr}</span>
                            </div>
                        </div>
                        \${directPct !== null ? \`<div class="text-[11px] text-cyan-300 font-semibold mb-1">Rasio Bilirubin Direk / Total: \${directPct.toFixed(1)}%</div>\` : ''}
                        <p class="text-xs text-slate-300 leading-relaxed">\${biliAdvice}</p>
                    </div>
                \`;
            }

            // 2. Transaminase & De Ritis Card
            if (!isNaN(ast) || !isNaN(alt)) {
                const astUlnRatio = !isNaN(ast) ? (ast / REF.ast.max).toFixed(2) : '-';
                const altUlnRatio = !isNaN(alt) ? (alt / REF.alt.max).toFixed(2) : '-';
                let deRitisStr = '-';
                let enzymeAdvice = '';
                let enzymeColor = 'emerald';

                if (!isNaN(ast) && !isNaN(alt) && alt > 0) {
                    const deRitis = (ast / alt).toFixed(2);
                    deRitisStr = deRitis;
                    if (ast <= REF.ast.max && alt <= REF.alt.max) {
                        enzymeAdvice = 'AST dan ALT dalam batas normal rujukan RS.';
                    } else if (deRitis > 2.0) {
                        enzymeColor = 'rose';
                        enzymeAdvice = \`Rasio AST/ALT \${deRitis} (> 2.0): Sangat spesifik untuk Alcoholic Liver Disease, iskemia miokard, atau sirosis dekompensata.\`;
                    } else if (deRitis >= 1.0) {
                        enzymeColor = 'amber';
                        enzymeAdvice = \`Rasio AST/ALT \${deRitis} (≥ 1.0): Waspadai progresi ke arah fibrosis lanjut / sirosis hepatis pada MASLD atau hepatitis kronik.\`;
                    } else {
                        enzymeColor = 'amber';
                        enzymeAdvice = \`Rasio AST/ALT \${deRitis} (< 1.0, ALT dominan): Pola khas MASLD/NAFLD atau hepatitis virus fase aktif.\`;
                    }
                } else if (!isNaN(ast) || !isNaN(alt)) {
                    enzymeAdvice = 'Salah satu transaminase terisi. Lengkapi keduanya untuk kalkulasi otomatis Rasio De Ritis.';
                }

                resumeParts.push(\`Transaminase: AST \${!isNaN(ast) ? ast : '-'} (\${astUlnRatio}x ULN), ALT \${!isNaN(alt) ? alt : '-'} (\${altUlnRatio}x ULN), De Ritis: \${deRitisStr}\`);

                cardsHtml += \`
                    <div class="p-4 rounded-xl bg-\${enzymeColor}-950/20 border border-\${enzymeColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-\${enzymeColor}-400 uppercase tracking-wider">Enzim Hepatoseluler &amp; De Ritis</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">ULN: AST 34 | ALT 55</span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">AST (RS: &lt;34)</span>
                                <span class="text-sm font-bold \${!isNaN(ast) && ast > REF.ast.max ? 'text-rose-400' : 'text-white'}">\${!isNaN(ast) ? ast + ' U/L' : '-'}</span>
                                <span class="text-[9px] text-slate-500 block">\${astUlnRatio !== '-' ? astUlnRatio + 'x ULN' : ''}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">ALT (RS: &lt;55)</span>
                                <span class="text-sm font-bold \${!isNaN(alt) && alt > REF.alt.max ? 'text-rose-400' : 'text-white'}">\${!isNaN(alt) ? alt + ' U/L' : '-'}</span>
                                <span class="text-[9px] text-slate-500 block">\${altUlnRatio !== '-' ? altUlnRatio + 'x ULN' : ''}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Rasio AST/ALT</span>
                                <span class="text-sm font-bold text-cyan-300">\${deRitisStr}</span>
                                <span class="text-[9px] text-slate-500 block">De Ritis</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">\${enzymeAdvice}</p>
                    </div>
                \`;
            }

            // 3. Cholestasis Card (ALP & GGT)
            if (!isNaN(alp) || !isNaN(ggt)) {
                let cholColor = 'emerald';
                let cholAdvice = '';

                const isAlpHigh = !isNaN(alp) && alp > REF.alp.max;
                const isGgtHigh = !isNaN(ggt) && ggt > REF.ggt.max;

                if (isAlpHigh && isGgtHigh) {
                    cholColor = 'rose';
                    cholAdvice = 'Peningkatan konkordan ALP (>150 U/L) dan GGT (>33 U/L) mengonfirmasi etiologi hepatobilier / kolestasis (intrahepatik atau ekstrahepatik).';
                } else if (isAlpHigh && !isGgtHigh) {
                    cholColor = 'amber';
                    cholAdvice = 'Peningkatan ALP terisolasi dengan GGT normal rujukan RS (<33 U/L) mengindikasikan sumber non-hepatik (tulang, turnover osteoblastik, plasenta, atau kehamilan).';
                } else if (!isAlpHigh && isGgtHigh) {
                    cholColor = 'amber';
                    cholAdvice = 'Peningkatan GGT terisolasi (>33 U/L) dengan ALP normal sering disebabkan induksi enzim mikrosomal hepar (alkohol, obat antikonvulsan fenitoin, atau fatty liver).';
                } else {
                    cholAdvice = 'Marker kolestasis (ALP & GGT) berada dalam batas normal rujukan RS.';
                }

                resumeParts.push(\`Kolestasis: ALP \${!isNaN(alp) ? alp : '-'} U/L (RS: 40-150), GGT \${!isNaN(ggt) ? ggt : '-'} U/L (RS: <33)\`);

                cardsHtml += \`
                    <div class="p-4 rounded-xl bg-\${cholColor}-950/20 border border-\${cholColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-\${cholColor}-400 uppercase tracking-wider">Marker Kolestasis &amp; Saluran Empedu</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">ULN: ALP 150 | GGT 33</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">ALP (RS: 40 - 150 U/L)</span>
                                <span class="text-sm font-bold \${isAlpHigh ? 'text-rose-400' : 'text-white'}">\${!isNaN(alp) ? alp + ' U/L' : '-'}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Gamma GT (RS: &lt; 33 U/L)</span>
                                <span class="text-sm font-bold \${isGgtHigh ? 'text-rose-400' : 'text-white'}">\${!isNaN(ggt) ? ggt + ' U/L' : '-'}</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">\${cholAdvice}</p>
                    </div>
                \`;
            }

            // 4. Protein Fractions & A/G Ratio Card
            if (!isNaN(totProt) || !isNaN(alb)) {
                if (isNaN(glob) && !isNaN(totProt) && !isNaN(alb)) {
                    glob = Math.max(0, totProt - alb);
                }
                const pTotStr = !isNaN(totProt) ? totProt.toFixed(2) : '-';
                const pAlbStr = !isNaN(alb) ? alb.toFixed(2) : '-';
                const pGlobStr = !isNaN(glob) ? glob.toFixed(2) : '-';

                let agRatioStr = '-';
                let protColor = 'emerald';
                let protAdvice = 'Profil protein serum dalam batas rujukan normal RS.';

                if (!isNaN(alb) && !isNaN(glob) && glob > 0) {
                    const agRatio = parseFloat((alb / glob).toFixed(2));
                    agRatioStr = agRatio.toString();

                    if (agRatio < 1.0) {
                        protColor = 'rose';
                        protAdvice = \`Rasio A/G terbalik (\${agRatio} < 1.0) menunjukkan penurunan kapasitas sintesis albumin dan/atau peningkatan globulin (hipergamaglobulinemia poliklonal). Karakteristik khas sirosis hepatis lanjut, hepatitis autoimun, penyakit kolagen vaskular, atau multipel mieloma.\`;
                    } else if (agRatio < 1.2) {
                        protColor = 'amber';
                        protAdvice = \`Rasio A/G borderline rendah (\${agRatio}). Periksa kecukupan nutrisi dan evaluasi kehilangan albumin (asites, proteinuria).\`;
                    } else {
                        protAdvice = \`Rasio Albumin/Globulin (\${agRatio}) normal (rentang fisiologis ~1.1 - 2.5).\`;
                    }
                }

                resumeParts.push(\`Profil Protein: Tot \${pTotStr}, Alb \${pAlbStr}, Glob \${pGlobStr} g/dL, Rasio A/G: \${agRatioStr}\`);

                cardsHtml += \`
                    <div class="p-4 rounded-xl bg-\${protColor}-950/20 border border-\${protColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-\${protColor}-400 uppercase tracking-wider">Profil Protein Serum &amp; Rasio A/G</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">Rujukan RS</span>
                        </div>
                        <div class="grid grid-cols-4 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Protein Total</span>
                                <span class="text-xs sm:text-sm font-bold text-white">\${pTotStr}</span>
                                <span class="text-[8px] text-slate-500 block">6.4-8.3</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Albumin</span>
                                <span class="text-xs sm:text-sm font-bold \${!isNaN(alb) && alb < REF.alb.min ? 'text-rose-400' : 'text-white'}">\${pAlbStr}</span>
                                <span class="text-[8px] text-slate-500 block">3.4-4.8</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Globulin</span>
                                <span class="text-xs sm:text-sm font-bold \${!isNaN(glob) && glob > REF.glob.max ? 'text-amber-400' : 'text-white'}">\${pGlobStr}</span>
                                <span class="text-[8px] text-slate-500 block">2.2-3.7</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Rasio A/G</span>
                                <span class="text-xs sm:text-sm font-bold text-cyan-300">\${agRatioStr}</span>
                                <span class="text-[8px] text-slate-500 block">&ge; 1.0</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">\${protAdvice}</p>
                    </div>
                \`;
            }

            const resumeText = \`[adjusterGEH CDSS] Profil Faal Hati & Protein RS:\\n\${resumeParts.join('\\n')}\`;

            res.innerHTML = \`
                <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-xl space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                Hasil Interpretasi Terkalibrasi RS
                            </span>
                            <h3 class="text-lg font-bold text-white mt-1">Evaluasi Komprehensif LFT &amp; Protein</h3>
                        </div>
                        <button type="button" onclick="copyToClipboard(\\\`\${resumeText.replace(/"/g, '&quot;')}\\\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center shrink-0">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume LFT
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        \${cardsHtml}
                    </div>
                </div>
            \`;
            res.classList.remove('hidden');
        }

        // ==========================================
        // LAB REFERENCE MODAL CONTROLLER
        // ==========================================

        function openLabRefModal() {
            const modal = document.getElementById('lab-ref-modal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeLabRefModal() {
            const modal = document.getElementById('lab-ref-modal');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }

`;

if (!html.includes(jsInsertionPointOld)) throw new Error('JS insertion point old not found');
html = html.replace(jsInsertionPointOld, newJsCode + jsInsertionPointOld);

// 24. Add the Lab Reference Modal right before </body>
const bodyEndOld = `</body>`;

const labModalHtml = `    <!-- Modal: Nilai Rujukan Normal Laboratorium RS -->
    <div id="lab-ref-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md transition-opacity">
        <div class="glass-panel w-full max-w-3xl max-h-[90vh] rounded-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <!-- Modal Header -->
            <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div class="flex items-center space-x-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-sm">
                        <i class="fa-solid fa-flask-vial"></i>
                    </div>
                    <div>
                        <h3 class="text-sm sm:text-base font-bold text-white font-['Plus_Jakarta_Sans']">Nilai Rujukan Normal Laboratorium RS</h3>
                        <p class="text-[11px] text-slate-400">Parameter terkalibrasi pada kalkulator klinis adjusterGEH CDSS</p>
                    </div>
                </div>
                <button type="button" onclick="closeLabRefModal()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
                <!-- Group 1: Faal Hati, Protein & Biliary Tract -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                            <i class="fa-solid fa-liver mr-1.5"></i> Faal Hati, Protein, &amp; Biliary Tract
                        </h4>
                        <span class="px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded text-[10px]">10 Parameter</span>
                    </div>
                    <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                                    <th class="py-2.5 px-3 font-semibold">Pemeriksaan</th>
                                    <th class="py-2.5 px-3 font-semibold">Nilai Normal RS</th>
                                    <th class="py-2.5 px-3 font-semibold">Satuan</th>
                                    <th class="py-2.5 px-3 font-semibold">Kalkulator Terkait</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 text-slate-200">
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Bilirubin Total</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">0.3 - 1.2</td>
                                    <td class="py-2 px-3 text-slate-400">mg/dL</td>
                                    <td class="py-2 px-3 text-[11px]">MELD Trio, CTP, R-Factor (Hy's Law), CLIF-C, Maddrey, Lille, TG18, Panel LFT</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Bilirubin Direk</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">0.0 - 0.5</td>
                                    <td class="py-2 px-3 text-slate-400">mg/dL</td>
                                    <td class="py-2 px-3 text-[11px]">Panel LFT RS (Fraksi &gt;50% Kolestatik)</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Bilirubin Indirek</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">0.2 - 0.7</td>
                                    <td class="py-2 px-3 text-slate-400">mg/dL</td>
                                    <td class="py-2 px-3 text-[11px]">Panel LFT RS (Fraksi &lt;20% Hemolitik/Gilbert)</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Fosfatase Alkali (ALP)</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">40 - 150</td>
                                    <td class="py-2 px-3 text-slate-400">U/L</td>
                                    <td class="py-2 px-3 text-[11px]">R-Factor (ULN: 150), TG18 Kolangitis, Panel LFT RS</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">AST / SGOT</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">&lt; 34</td>
                                    <td class="py-2 px-3 text-slate-400">U/L</td>
                                    <td class="py-2 px-3 text-[11px]">FIB-4 &amp; APRI (ULN: 34), De Ritis, NFS, Ranson, TG18, Panel LFT</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">ALT / SGPT</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">&lt; 55</td>
                                    <td class="py-2 px-3 text-slate-400">U/L</td>
                                    <td class="py-2 px-3 text-[11px]">R-Factor (ULN: 55), FIB-4, De Ritis, NFS, TG18, Panel LFT</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Gamma GT (GGT)</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">&lt; 33</td>
                                    <td class="py-2 px-3 text-slate-400">U/L</td>
                                    <td class="py-2 px-3 text-[11px]">TG18 Kolangitis, Panel LFT RS (Konfirmasi ALP bilier)</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Protein Total</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">6.40 - 8.30</td>
                                    <td class="py-2 px-3 text-slate-400">g/dL</td>
                                    <td class="py-2 px-3 text-[11px]">Panel LFT RS, Asites SAAG diferensiasi</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Albumin Serum</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">3.40 - 4.80</td>
                                    <td class="py-2 px-3 text-slate-400">g/dL</td>
                                    <td class="py-2 px-3 text-[11px]">MELD 3.0, CTP, SAAG, NFS, AIMS65, Lille, Panel LFT</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Globulin</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">2.2 - 3.7</td>
                                    <td class="py-2 px-3 text-slate-400">g/dL</td>
                                    <td class="py-2 px-3 text-[11px]">Panel LFT RS (Rasio A/G &lt; 1.0 Reversal)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Group 2: Fungsi Ginjal & Elektrolit -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center">
                            <i class="fa-solid fa-kidneys mr-1.5"></i> Fungsi Ginjal &amp; Elektrolit
                        </h4>
                        <span class="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded text-[10px]">2 Parameter</span>
                    </div>
                    <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                                    <th class="py-2.5 px-3 font-semibold">Pemeriksaan</th>
                                    <th class="py-2.5 px-3 font-semibold">Nilai Normal RS</th>
                                    <th class="py-2.5 px-3 font-semibold">Satuan</th>
                                    <th class="py-2.5 px-3 font-semibold">Kalkulator Terkait</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 text-slate-200">
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Blood Urea Nitrogen (BUN)</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">9.8 - 20.1</td>
                                    <td class="py-2 px-3 text-slate-400">mg/dL</td>
                                    <td class="py-2 px-3 text-[11px]">Glasgow-Blatchford Score (GBS), BISAP Score, Ranson Criteria</td>
                                </tr>
                                <tr class="hover:bg-slate-800/40">
                                    <td class="py-2 px-3 font-semibold text-white">Natrium (Na) - Serum</td>
                                    <td class="py-2 px-3 text-cyan-300 font-mono font-bold">136 - 145</td>
                                    <td class="py-2 px-3 text-slate-400">mmol/L (mEq/L)</td>
                                    <td class="py-2 px-3 text-[11px]">MELD-Na &amp; MELD 3.0, Restriksi Natrium ESPEN Sirosis</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <strong class="text-slate-200 block font-semibold"><i class="fa-solid fa-circle-info text-cyan-400 mr-1"></i> Catatan Implementasi Klinis CDSS:</strong>
                    <p>Batas Atas Normal (ULN) pada kalkulator rasio enzimatik otomatis mengadopsi standar laboratorium ini (AST ULN: 34 U/L, ALT ULN: 55 U/L, ALP ULN: 150 U/L). Evaluasi Hy's Law dihitung pada ambang Total Bilirubin &ge; 2x ULN (&ge; 2.4 mg/dL).</p>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/70">
                <span class="text-[11px] text-slate-400">adjusterGEH • Hospital Lab Calibrated v2.3</span>
                <button type="button" onclick="closeLabRefModal()" class="glass-btn px-4 py-1.5 rounded-lg text-xs font-semibold">
                    Tutup
                </button>
            </div>
        </div>
    </div>
</body>`;

if (!html.includes(bodyEndOld)) throw new Error('Body end old not found');
html = html.replace(bodyEndOld, labModalHtml);

// Write updated file
fs.writeFileSync('adjustr-GEH.html', html, 'utf8');
console.log('Successfully updated adjustr-GEH.html!');
