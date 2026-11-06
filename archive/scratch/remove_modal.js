const fs = require('fs');

let html = fs.readFileSync('adjustr-GEH.html', 'utf8');

// 1. Remove Header Button
const headerButtonOld = `            <div class="flex items-center space-x-2 shrink-0">
                <button type="button" onclick="openLabRefModal()" class="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center font-medium shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <i class="fa-solid fa-flask-vial mr-1.5"></i> <span class="hidden sm:inline">Rujukan Lab RS</span><span class="sm:hidden">Lab RS</span>
                </button>
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">31 Tools</span>
            </div>`;

const headerButtonNew = `            <div class="flex items-center space-x-2 shrink-0">
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">31 Tools</span>
            </div>`;

if (!html.includes(headerButtonOld)) throw new Error('Header button old not found');
html = html.replace(headerButtonOld, headerButtonNew);

// 2. Remove button inside lft-profile-module header
const lftModuleHeaderOld = `                        <div class="flex items-center space-x-2">
                            <button type="button" onclick="openLabRefModal()" class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center">
                                <i class="fa-solid fa-table-list mr-1.5"></i> Tabel Rujukan RS
                            </button>
                            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">Terkalibrasi RS</span>
                        </div>`;

const lftModuleHeaderNew = `                        <div class="flex items-center space-x-2">
                            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">Terkalibrasi RS</span>
                        </div>`;

if (!html.includes(lftModuleHeaderOld)) throw new Error('LFT module header old not found');
html = html.replace(lftModuleHeaderOld, lftModuleHeaderNew);

// 3. Remove JS functions openLabRefModal & closeLabRefModal
const jsModalOld = `        // ==========================================
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
        }`;

if (!html.includes(jsModalOld)) throw new Error('JS modal functions old not found');
html = html.replace(jsModalOld, '');

// 4. Remove Modal HTML element
const modalHtmlRegex = /<!-- Modal: Nilai Rujukan Normal Laboratorium RS -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/body>/;
if (!modalHtmlRegex.test(html)) throw new Error('Modal HTML element not found with regex');
html = html.replace(modalHtmlRegex, '</body>');

fs.writeFileSync('adjustr-GEH.html', html, 'utf8');
console.log('Successfully removed Lab Reference Modal and Header button!');
