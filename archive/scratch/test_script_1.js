
        // Global State
        let gbsBunUnit = 'mmol';
        let maddreyBiliUnit = 'mg';
        let currentTg18Type = 'chole';

        const headerTitle = document.getElementById('header-title');
        const moduleSections = document.querySelectorAll('.module-section');
        const quickPills = document.querySelectorAll('.quick-nav-pill');
        const toastNotice = document.getElementById('toast-notice');
        const toastMessage = document.getElementById('toast-message');

        function showToast(msg) {
            toastMessage.textContent = msg;
            toastNotice.classList.remove('translate-y-24', 'opacity-0');
            toastNotice.classList.add('translate-y-0', 'opacity-100');
            setTimeout(() => {
                toastNotice.classList.remove('translate-y-0', 'opacity-100');
                toastNotice.classList.add('translate-y-24', 'opacity-0');
            }, 2500);
        }

        function copyToClipboard(text, successMsg = 'Resume klinis berhasil disalin!') {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => showToast(successMsg)).catch(() => fallbackCopy(text, successMsg));
            } else {
                fallbackCopy(text, successMsg);
            }
        }

        function fallbackCopy(text, successMsg) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showToast(successMsg);
            } catch (err) {
                alert('Gagal menyalin otomatis. Silakan salin manual.');
            }
            document.body.removeChild(textArea);
        }

        // Direct Navigation (Immune to iframe sandboxing)
        function navigateTo(targetId, title, activePillId = null) {
            // Hide all sections dynamically
            document.querySelectorAll('.module-section').forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('block');
            });

            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('block');
            }

            // Update top title
            if (headerTitle) {
                headerTitle.textContent = title;
            }

            // Update active pill in quick nav bar
            quickPills.forEach(pill => pill.classList.remove('active'));
            if (activePillId) {
                const el = document.getElementById(activePillId);
                if (el) el.classList.add('active');
            }

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // ==========================================
        // GLOBAL TOOL REGISTRY & SEARCH ENGINE
        // ==========================================
        const CALCULATORS_DB = [
            // GI Bleeding (6)
            { id: 'gbs-module', name: 'Glasgow-Blatchford Score (GBS)', category: 'GI Bleeding', color: 'rose', pillId: 'pill-bleed', hubId: 'hub-bleed', desc: 'Stratifikasi risiko UGIB sebelum endoskopi untuk menentukan kelayakan rawat jalan.', keywords: ['gbs', 'ugib', 'upper gi bleeding', 'perdarahan cerna atas', 'melena', 'hematemesis', 'bun', 'hb', 'blatchford'] },
            { id: 'oakland-module', name: 'Oakland Score for LGIB', category: 'GI Bleeding', color: 'rose', pillId: 'pill-bleed', hubId: 'hub-bleed', desc: 'Prediksi safe discharge rawat jalan pada perdarahan saluran cerna bawah akut.', keywords: ['oakland', 'lgib', 'lower gi', 'hematochezia', 'darah segar', 'safe discharge'] },
            { id: 'rockall-module', name: 'Rockall Score (Pre & Post)', category: 'GI Bleeding', color: 'rose', pillId: 'pill-bleed', hubId: 'hub-bleed', desc: 'Stratifikasi risiko mortalitas pre-endoskopi & rebleeding post-endoskopi pada UGIB.', keywords: ['rockall', 'rebleeding', 'post-egd', 'pre-egd', 'mortalitas'] },
            { id: 'aims65-module', name: 'AIMS65 Score (UGIB)', category: 'GI Bleeding', color: 'rose', pillId: 'pill-bleed', hubId: 'hub-bleed', desc: 'Skor prediksi mortalitas in-hospital dan risiko ICU pada perdarahan saluran cerna atas.', keywords: ['aims65', 'albumin', 'inr', 'mental status', 'sbp', 'mortalitas'] },
            { id: 'antithrombotic-module', name: 'Antithrombotic Management', category: 'GI Bleeding', color: 'rose', pillId: 'pill-bleed', hubId: 'hub-bleed', desc: 'Algoritma reversal dan waktu aman memulai kembali antiplatelet/antikoagulan.', keywords: ['antithrombotic', 'aspirin', 'clopidogrel', 'warfarin', 'doac', 'reversal', 'hemostasis'] },
            { id: 'forrest-module', name: 'Forrest Classification', category: 'GI Bleeding', color: 'rose', pillId: 'pill-bleed', hubId: 'hub-bleed', desc: 'Klasifikasi stigmata ulkus peptikum pada EGD untuk stratifikasi rebleeding & PPI drip.', keywords: ['forrest', 'ulkus peptikum', 'stigmata', 'spurting', 'oozing', 'ppi drip', 'endoskopi'] },

            // Hepatology (12)
            { id: 'aih-module', name: 'Revised Original AIH Score (IAHG 1999)', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Skor komprehensif IAHG (Alvarez 1999) untuk diagnosis Autoimmune Hepatitis pre- & post-terapi.', keywords: ['aih', 'autoimmune hepatitis', 'hepatitis autoimun', 'alvarez', 'iahg', 'ana', 'sma', 'lkm-1', 'ama', 'igg', 'globulin', 'biopsi hati'] },
            { id: 'ctp-module', name: 'Child-Turcotte-Pugh (CTP) Score', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Klasifikasi keparahan sirosis (Class A/B/C), survival rate, dan risiko operasi.', keywords: ['child pugh', 'ctp', 'sirosis', 'ensefalopati', 'asites', 'bilirubin', 'albumin', 'inr'] },
            { id: 'meld-module', name: 'MELD Trio (MELD, MELD-Na, MELD 3.0)', category: 'Hepatology', color: 'cyan', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Model end-stage liver disease: MELD standar, MELD-Na, & MELD 3.0 modern.', keywords: ['meld', 'meld-na', 'meld 3.0', 'transplantasi hati', 'kreatinin', 'natrium', 'mortalitas 90 hari'] },
            { id: 'espen-nutrition-module', name: 'Liver Disease Nutrition Calculator (ESPEN)', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Kebutuhan kalori (30-35 kcal/kg) & protein (1.2-1.5 g/kg) dengan koreksi dry weight asites/edema.', keywords: ['nutrisi', 'espen', 'kalori', 'protein', 'dry weight', 'berat kering', 'asites', 'edema', 'parasentesis', 'bcaa', 'les', 'snack malam', 'sirosis'] },
            { id: 'saag-module', name: 'SAAG & Absolute PMN', category: 'Hepatology', color: 'emerald', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Gradien hipertensi portal (≥1.1) dan skrining Spontaneous Bacterial Peritonitis (PMN ≥250).', keywords: ['saag', 'sbp', 'peritonitis', 'asites', 'serum ascites albumin gradient', 'pmn', 'parasentesis'] },
            { id: 'rfactor-module', name: 'R-Factor (DILI Pattern)', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Kalkulasi rasio ALT/ALP untuk klasifikasi Hepatocellular, Mixed, atau Cholestatic.', keywords: ['r-factor', 'dili', 'drug induced liver injury', 'alt', 'alp', 'hepatoselular', 'kolestatik'] },
            { id: 'deritis-module', name: 'The De Ritis Ratio (AST/ALT)', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Rasio AST/ALT membedakan Alcoholic Liver Disease (>2), sirosis (>1), vs MASLD (<1).', keywords: ['de ritis', 'ast', 'alt', 'sgot', 'sgpt', 'alkoholik', 'steatohepatitis'] },
            { id: 'nfs-module', name: 'NAFLD Fibrosis Score & BARD', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Skrining non-invasif advanced fibrosis pada MASLD/NAFLD sebelum rujukan FibroScan.', keywords: ['nfs', 'bard', 'nafld', 'masld', 'fibrosis hati', 'fatty liver'] },
            { id: 'fib4-module', name: 'FIB-4 & APRI Calculator', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Estimasi non-invasif derajat fibrosis dan sirosis hepar (MASLD/Hepatitis kronik).', keywords: ['fib-4', 'apri', 'fibrosis', 'trombosit', 'ast', 'alt', 'trombositopenia'] },
            { id: 'maddrey-module', name: "Maddrey's dF & Lille Model", category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Penentuan hepatitis alkoholik berat dan respon kortikosteroid pada hari ke-7.', keywords: ['maddrey', 'lille', 'hepatitis alkoholik', 'kortikosteroid', 'pt', 'prothrombin'] },
            { id: 'easl-module', name: 'CLIF-C ACLF & AD Score', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Stratifikasi kegagalan organ dan estimasi mortalitas sirosis dekompensasi (EASL).', keywords: ['clif-c', 'aclf', 'acute on chronic liver failure', 'easl', 'kegagalan organ'] },
            { id: 'baveno-module', name: 'Baveno VII Criteria', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Evaluasi kekakuan hati (FibroScan) dan trombosit untuk menunda skrining EGD varises.', keywords: ['baveno vii', 'fibroscan', 'lsm', 'trombosit', 'varises', 'hipertensi portal'] },
            { id: 'lft-profile-module', name: 'Panel Faal Hati & Protein RS', category: 'Hepatology', color: 'emerald', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Analisis fraksi bilirubin, enzim hepatoseluler/kolestasis (ALP & GGT), dan rasio A/G protein normal RS.', keywords: ['lft', 'faal hati', 'bilirubin direk', 'bilirubin indirek', 'ast', 'alt', 'alp', 'ggt', 'gamma gt', 'protein total', 'albumin', 'globulin', 'rasio ag', 'nilai normal rs'] },

            // Pancreatobiliary (5)
            { id: 'bisap-module', name: 'BISAP Score (Pancreatitis)', category: 'Pancreatobiliary', color: 'emerald', pillId: 'pill-pancreato', hubId: 'hub-pancreato', desc: 'Prediksi mortalitas dan keparahan pankreatitis akut cepat di IGD ≤24 jam.', keywords: ['bisap', 'pankreatitis akut', 'bun', 'sirs', 'pleura', 'mortalitas'] },
            { id: 'ranson-module', name: "Ranson's Criteria (0 & 48h)", category: 'Pancreatobiliary', color: 'emerald', pillId: 'pill-pancreato', hubId: 'hub-pancreato', desc: 'Stratifikasi klasik pankreatitis saat admisi dan evaluasi 48 jam.', keywords: ['ranson', 'pankreatitis', 'biliary', 'kalsium', 'ldh', 'glukosa', 'hematokrit'] },
            { id: 'tg18-module', name: 'Tokyo Guidelines 2018 (TG18)', category: 'Pancreatobiliary', color: 'emerald', pillId: 'pill-pancreato', hubId: 'hub-pancreato', desc: 'Diagnosis & grading keparahan Kolesistitis Akut dan Kolangitis Akut.', keywords: ['tg18', 'tokyo guidelines', 'kolesistitis', 'kolangitis', 'murphy', 'charcot', 'drainase'] },
            { id: 'atlanta-module', name: 'Revised Atlanta 2012', category: 'Pancreatobiliary', color: 'emerald', pillId: 'pill-pancreato', hubId: 'hub-pancreato', desc: 'Diagnosis & klasifikasi keparahan Pankreatitis Akut (Mild, Moderately Severe, Severe).', keywords: ['atlanta 2012', 'pankreatitis', 'organ failure', 'nekrosis pankreas'] },
            { id: 'cdiff-module', name: 'ACG C. diff Severity (2021)', category: 'Pancreatobiliary', color: 'emerald', pillId: 'pill-pancreato', hubId: 'hub-pancreato', desc: 'Klasifikasi infeksi Clostridioides difficile & panduan antibiotik lini pertama.', keywords: ['cdiff', 'clostridioides difficile', 'fidaxomicin', 'vancomycin', 'diare antibiotik'] },

            // Luminal & IBD (4)
            { id: 'truelove-module', name: 'Truelove & Witts Criteria', category: 'Luminal & IBD', color: 'purple', pillId: 'pill-ibd', hubId: 'hub-ibd', desc: 'Stratifikasi derajat keparahan Kolitis Ulseratif dan kegawatdaruratan ASUC untuk steroid IV.', keywords: ['truelove', 'witts', 'kolitis ulseratif', 'asuc', 'diare darah', 'steroid iv', 'disease', 'keparahan'] },
            { id: 'mayo-module', name: 'Mayo Score for UC', category: 'Luminal & IBD', color: 'purple', pillId: 'pill-ibd', hubId: 'hub-ibd', desc: 'Skor kuantitatif aktivitas penyakit Kolitis Ulseratif (Full vs Partial Mayo).', keywords: ['mayo score', 'kolitis ulseratif', 'remisi', 'endoskopi', 'mukosa'] },
            { id: 'cdai-module', name: "Crohn's Disease (HBI / CDAI)", category: 'Luminal & IBD', color: 'purple', pillId: 'pill-ibd', hubId: 'hub-ibd', desc: 'Evaluasi cepat Harvey-Bradshaw Index (HBI) dan ekuivalensi standar Full CDAI.', keywords: ['crohn', 'hbi', 'cdai', 'harvey bradshaw', 'fistula', 'nyeri perut'] },
            { id: 'calprotectin-module', name: 'Fecal Calprotectin Interpreter', category: 'Luminal & IBD', color: 'purple', pillId: 'pill-ibd', hubId: 'hub-ibd', desc: 'Interpretasi biomarker inflamasi usus untuk membedakan IBD vs IBS fungsional.', keywords: ['calprotectin', 'fecal', 'tinja', 'inflamasi', 'ibd', 'ibs', 'biomarker'] },

            // Functional GI (4)
            { id: 'rome4-ibs-module', name: 'Rome IV: Irritable Bowel Syndrome (IBS)', category: 'Functional GI', color: 'pink', pillId: 'pill-functional', hubId: 'hub-functional', desc: 'Kriteria Rome IV diagnosis IBS, penentuan subtipe (IBS-C/D/M/U), alarm red flags, & terapi.', keywords: ['rome iv', 'rome 4', 'ibs', 'irritable bowel', 'konstipasi', 'diare', 'bristol', 'fodmap', 'kembung', 'gut-brain'] },
            { id: 'rome4-dyspepsia-module', name: 'Rome IV: Functional Dyspepsia (EPS vs PDS)', category: 'Functional GI', color: 'pink', pillId: 'pill-functional', hubId: 'hub-functional', desc: 'Kriteria Rome IV dispepsia fungsional: PDS vs EPS, skrining alarm EGD, & tatalaksana.', keywords: ['rome iv', 'dispepsia fungsional', 'dyspepsia', 'pds', 'eps', 'postprandial fullness', 'epigastric pain', 'h pylori', 'prokinetik', 'tca'] },
            { id: 'lyon-module', name: 'Lyon Consensus 2.0: Objective GERD Criteria', category: 'Functional GI', color: 'cyan', pillId: 'pill-functional', hubId: 'hub-functional', desc: 'Kriteria objektif diagnosis GERD (EGD, AET %, refluks episode), fenotip RH vs Functional Heartburn.', keywords: ['lyon consensus', 'gerd', 'aet', 'acid exposure time', 'ph metri', 'impedansi', 'reflux hypersensitivity', 'functional heartburn', 'mnbi', 'pspw'] },
            { id: 'la-module', name: 'Los Angeles (LA) Classification for GERD', category: 'Functional GI', color: 'pink', pillId: 'pill-functional', hubId: 'hub-functional', desc: 'Derajat esofagitis refluks pada EGD (Grade A-D), durasi terapi PPI, dan panduan surveilans.', keywords: ['los angeles', 'la classification', 'la grade', 'esofagitis', 'refluks', 'ppi', 'barrett'] },

            // Endoscopy (1)
            { id: 'polyp-module', name: 'Polyp Surveillance (USMSTF)', category: 'Endoscopy', color: 'teal', pillId: 'pill-endo', hubId: 'hub-endo', desc: 'Kalkulator interval pengulangan kolonoskopi pasca polipektomi berdasarkan histologi dan jumlah.', keywords: ['polip', 'kolonoskopi', 'surveilans', 'usmstf', 'adenoma', 'serrated', 'ssl'] }
        ];

        function initGlobalSearch() {
            const searchInput = document.getElementById('global-search-input');
            const searchDropdown = document.getElementById('search-results-dropdown');
            const clearBtn = document.getElementById('search-clear-btn');

            if (!searchInput || !searchDropdown) return;

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                if (!query) {
                    searchDropdown.classList.add('hidden');
                    if (clearBtn) clearBtn.classList.add('hidden');
                    return;
                }

                if (clearBtn) clearBtn.classList.remove('hidden');

                const terms = query.split(/\s+/).filter(Boolean);
                const results = CALCULATORS_DB.filter(item => {
                    const haystack = `${item.name} ${item.category} ${item.desc} ${item.keywords.join(' ')}`.toLowerCase();
                    return terms.every(term => haystack.includes(term));
                });

                if (results.length === 0) {
                    searchDropdown.innerHTML = `
                        <div class="p-4 text-center text-xs text-slate-400">
                            <i class="fa-solid fa-circle-question text-slate-500 text-lg mb-1 block"></i>
                            Tidak ada kalkulator yang cocok dengan "<strong>${e.target.value}</strong>".
                        </div>
                    `;
                } else {
                    searchDropdown.innerHTML = `
                        <div class="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 border-b border-slate-800 flex justify-between">
                            <span>Ditemukan ${results.length} Modul</span>
                            <span>Tekan Esc untuk tutup</span>
                        </div>
                        <div class="space-y-1 mt-1">
                            ${results.map(item => `
                                <div onclick="selectSearchResult('${item.id}', '${item.name.replace(/'/g, "\\'")}', '${item.pillId}', '${item.hubId}')" 
                                     class="p-2.5 rounded-lg hover:bg-slate-800/90 cursor-pointer border border-transparent hover:border-cyan-500/30 transition-all flex items-start gap-3 group">
                                    <div class="px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 bg-${item.color}-500/20 text-${item.color}-300 border border-${item.color}-500/30">
                                        ${item.category}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h5 class="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">${item.name}</h5>
                                        <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${item.desc}</p>
                                    </div>
                                    <i class="fa-solid fa-arrow-right text-xs text-slate-500 group-hover:text-cyan-400 shrink-0 mt-1 transition-colors"></i>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }

                searchDropdown.classList.remove('hidden');
            });

            // Keyboard shortcut Ctrl+K & /
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                } else if (e.key === 'Escape') {
                    searchDropdown.classList.add('hidden');
                    searchInput.blur();
                }
            });

            // Close dropdown when clicked outside
            document.addEventListener('click', (e) => {
                const container = document.getElementById('header-search-container');
                if (container && !container.contains(e.target)) {
                    searchDropdown.classList.add('hidden');
                }
            });
        }

        function clearGlobalSearch() {
            const searchInput = document.getElementById('global-search-input');
            const searchDropdown = document.getElementById('search-results-dropdown');
            const clearBtn = document.getElementById('search-clear-btn');
            if (searchInput) searchInput.value = '';
            if (searchDropdown) searchDropdown.classList.add('hidden');
            if (clearBtn) clearBtn.classList.add('hidden');
        }

        function selectSearchResult(id, name, pillId, hubId) {
            clearGlobalSearch();
            navigateTo(id, name, pillId, hubId);
        }

        // ==========================================
        // 1. HEMORRHAGIC & GI BLEED LOGIC
        // ==========================================

        function setGbsBunUnit(unit) {
            gbsBunUnit = unit;
            const btnMmol = document.getElementById('gbs-bun-unit-mmol');
            const btnMg = document.getElementById('gbs-bun-unit-mg');
            const btnUreum = document.getElementById('gbs-bun-unit-ureum');
            const hint = document.getElementById('gbs-bun-hint');
            btnMmol.className = 'px-1.5 py-0.5 rounded text-slate-400';
            btnMg.className = 'px-1.5 py-0.5 rounded text-slate-400';
            if (btnUreum) btnUreum.className = 'px-1.5 py-0.5 rounded text-slate-400';

            if (unit === 'mmol') {
                btnMmol.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                hint.textContent = 'Satuan aktif: mmol/L Urea (Nilai normal RS: ~3.5 - 7.2 mmol/L)';
            } else if (unit === 'mg') {
                btnMg.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                hint.textContent = 'Satuan aktif: mg/dL BUN (Nilai normal RS: 9.8 - 20.1 mg/dL, faktor pembagi 2.801)';
            } else {
                if (btnUreum) btnUreum.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                hint.textContent = 'Satuan aktif: mg/dL Serum Ureum RS (Nilai normal RS: 15 - 45 mg/dL, faktor pembagi 6.006)';
            }
        }

        function calculateGBS() {
            const bunRaw = parseFloat(document.getElementById('gbs-bun').value);
            const hb = parseFloat(document.getElementById('gbs-hb').value);
            const sbp = parseInt(document.getElementById('gbs-sbp').value, 10);
            const hr = parseInt(document.getElementById('gbs-hr').value, 10);
            const res = document.getElementById('gbs-result-container');

            if (isNaN(bunRaw) || isNaN(hb) || isNaN(sbp) || isNaN(hr)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-sm">Mohon isi semua data numerik (BUN/Ureum, Hb, TD Sistolik, dan Denyut Nadi).</div>`;
                res.classList.remove('hidden');
                return;
            }

            let bunMmol = bunRaw;
            if (gbsBunUnit === 'mg') {
                bunMmol = bunRaw / 2.801;
            } else if (gbsBunUnit === 'ureum') {
                bunMmol = bunRaw / 6.006;
            }
            const sex = document.querySelector('input[name="gbs-sex"]:checked').value;
            const melena = document.getElementById('gbs-melena').checked;
            const syncope = document.getElementById('gbs-syncope').checked;
            const hepatic = document.getElementById('gbs-hepatic').checked;
            const cardiac = document.getElementById('gbs-cardiac').checked;

            let score = 0;

            if (bunMmol >= 25.0) score += 6;
            else if (bunMmol >= 10.0) score += 4;
            else if (bunMmol >= 8.0) score += 3;
            else if (bunMmol >= 6.5) score += 2;

            if (sex === 'male') {
                if (hb < 10.0) score += 6;
                else if (hb < 12.0) score += 3;
                else if (hb < 13.0) score += 1;
            } else {
                if (hb < 10.0) score += 6;
                else if (hb < 12.0) score += 1;
            }

            if (sbp < 90) score += 3;
            else if (sbp <= 99) score += 2;
            else if (sbp <= 109) score += 1;

            if (hr >= 100) score += 1;

            if (melena) score += 1;
            if (syncope) score += 2;
            if (hepatic) score += 2;
            if (cardiac) score += 2;

            const isLowRisk = score <= 1;
            const riskCategory = isLowRisk ? 'Low Risk (Risiko Rendah)' : 'High Risk (Risiko Tinggi)';
            const colorClass = isLowRisk ? 'emerald' : 'rose';
            const actionAdvice = isLowRisk
                ? 'Pasien berpeluang besar aman untuk rawat jalan (*outpatient management*). Kebutuhan hemostasis endoskopi atau mortalitas &lt; 1%.'
                : 'Pasien memerlukan rawat inap, resusitasi cairan/darah agresif, PPI intravena, dan endoskopi saluran cerna atas (EGD) dalam waktu 24 jam.';

            const resumeText = `[adjusterGEH CDSS] GBS Score: ${score} (${riskCategory})\nParameter: Sex ${sex}, Hb ${hb} g/dL, BUN ${bunRaw} ${gbsBunUnit}/L, SBP ${sbp} mmHg, HR ${hr} bpm, Melena: ${melena}, Syncope: ${syncope}, Hepatic: ${hepatic}, Cardiac: ${cardiac}.\nInterpretasi: ${actionAdvice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-3xl font-black shrink-0">
                                ${score}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${riskCategory}</span>
                                <h3 class="text-lg font-bold text-white mt-1">Glasgow-Blatchford Score: ${score} poin</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${actionAdvice}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume EMR
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateOakland() {
            const age = parseFloat(document.getElementById('oakland-age').value);
            const hr = parseFloat(document.getElementById('oakland-hr').value);
            const sbp = parseFloat(document.getElementById('oakland-sbp').value);
            const hb = parseFloat(document.getElementById('oakland-hb').value);
            const res = document.getElementById('oakland-result-container');

            if (isNaN(age) || isNaN(hr) || isNaN(sbp) || isNaN(hb)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-sm">Mohon lengkapi seluruh kolom input numerik.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const sex = document.querySelector('input[name="oakland-sex"]:checked').value;
            const prior = document.getElementById('oakland-prior').checked;
            const dre = document.getElementById('oakland-dre').checked;

            let score = 0;
            if (age >= 70) score += 2;
            else if (age >= 40) score += 1;

            if (sex === 'male') score += 1;
            if (prior) score += 1;
            if (dre) score += 1;

            if (hr >= 110) score += 3;
            else if (hr >= 90) score += 2;
            else if (hr >= 70) score += 1;

            if (sbp < 90) score += 5;
            else if (sbp <= 119) score += 4;
            else if (sbp <= 129) score += 3;
            else if (sbp <= 159) score += 2;

            if (hb < 7.0) score += 22;
            else if (hb < 9.0) score += 17;
            else if (hb < 11.0) score += 13;
            else if (hb < 13.0) score += 8;
            else if (hb < 16.0) score += 4;

            const isSafeDischarge = score <= 8;
            const category = isSafeDischarge ? 'Safe for Discharge (Risiko Rendah)' : 'High Risk (Perlu Rawat Inap)';
            const colorClass = isSafeDischarge ? 'emerald' : 'rose';
            const advice = isSafeDischarge
                ? 'Pasien memenuhi kriteria safe discharge (probabilitas 95% aman tanpa komplikasi berat). Dapat dipulangkan untuk evaluasi/kolonoskopi rawat jalan.'
                : 'Pasien berisiko komplikasi/transfusi/intervensi hemostasis. Direkomendasikan rawat inap dan pertimbangan kolonoskopi/angiografi sesuai indikasi.';

            const resumeText = `[adjusterGEH CDSS] Oakland Score: ${score} (${category})\nUsia ${age}th, Sex ${sex}, SBP ${sbp} mmHg, HR ${hr} bpm, Hb ${hb} g/dL, Riwayat LGIB: ${prior}, DRE Darah: ${dre}.\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-3xl font-black shrink-0">
                                ${score}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${category}</span>
                                <h3 class="text-lg font-bold text-white mt-1">Oakland Score: ${score} poin</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume EMR
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateAIMS65() {
            let score = 0;
            const a = document.getElementById('aims-a').checked;
            const i = document.getElementById('aims-i').checked;
            const m = document.getElementById('aims-m').checked;
            const s = document.getElementById('aims-s').checked;
            const age65 = document.getElementById('aims-65').checked;

            if (a) score++;
            if (i) score++;
            if (m) score++;
            if (s) score++;
            if (age65) score++;

            let mortText = '';
            let riskCategory = '';
            let colorClass = 'emerald';

            if (score <= 1) {
                riskCategory = 'Low Mortality Risk';
                mortText = 'Mortalitas rawat inap &lt; 1 - 2%. Risiko rendah masuk ICU atau lama rawat panjang.';
                colorClass = 'emerald';
            } else if (score === 2) {
                riskCategory = 'Intermediate Risk';
                mortText = 'Mortalitas rawat inap ~3 - 5%. Memerlukan pemantauan hemodinamik ketat di bangsal.';
                colorClass = 'amber';
            } else {
                riskCategory = 'High Mortality Risk';
                mortText = 'Mortalitas rawat inap tinggi (Skor 3: ~10%, Skor 4: ~17%, Skor 5: &gt;25%). Indikasi kuat evaluasi rawat ICU/HCU.';
                colorClass = 'rose';
            }

            const resumeText = `[adjusterGEH CDSS] AIMS65 Score: ${score} (${riskCategory})\nKriteria: Albumin<3.0 (${a}), INR>1.5 (${i}), Mental Status (${m}), SBP<=90 (${s}), Usia>=65 (${age65}).\nEstimasi: ${mortText}`;
            const res = document.getElementById('aims65-result-container');

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-3xl font-black shrink-0">
                                ${score}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${riskCategory} (0-5)</span>
                                <h3 class="text-lg font-bold text-white mt-1">AIMS65: ${score} Poin</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${mortText}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume EMR
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function updateAntithromboticAdvice() {
            const bleed = document.getElementById('at-bleed-status').value;
            const drug = document.getElementById('at-drug').value;
            const box = document.getElementById('at-advice-box');

            let guidance = '';
            let reversal = '';
            let restart = '';

            if (drug === 'aspirin-sec') {
                guidance = 'Aspirin monoterapi tidak boleh dihentikan permanen. Pada perdarahan aktif/syok, tunda sementara saat resusitasi.';
                reversal = 'Transfusi trombosit tidak direkomendasikan secara rutin kecuali trombositopenia berat (&lt;50.000/µL).';
                restart = 'Lanjutkan kembali Aspirin segera dalam 3 - 5 hari pasca hemostasis tercapai.';
            } else if (drug === 'aspirin-prim') {
                guidance = 'Hentikan Aspirin pencegahan primer. Pertimbangkan penghentian permanen.';
                reversal = 'Tidak diperlukan agen reversal.';
                restart = 'Sebaiknya dihentikan permanen kecuali ada indikasi kardiovaskular sekunder baru.';
            } else if (drug === 'p2y12') {
                guidance = 'Hentikan sementara inhibitor P2Y12 pada perdarahan aktif. Lakukan hemostasis endoskopi segera.';
                reversal = 'Transfusi trombosit tidak terbukti memperbaiki luaran dan dapat memicu trombosis stent.';
                restart = 'Lanjutkan kembali dalam 3 - 7 hari pasca hemostasis jika indikasi kardiologi kuat.';
            } else if (drug === 'dapt') {
                guidance = 'Pasien berisiko tinggi trombosis stent fatal! Jangan hentikan kedua obat sekaligus bila memungkinkan.';
                reversal = 'Konsultasi cito dengan kardiolog intervensi. Pertahankan Aspirin bila menghentikan P2Y12.';
                restart = 'Mulai kembali agen P2Y12 secepatnya dalam 3 - 5 hari pasca hemostasis aman.';
            } else if (drug === 'warfarin') {
                guidance = 'Periksa INR cito. Tunda endoskopi hingga hemodinamik stabil dan INR &lt; 2.5.';
                reversal = 'Bila perdarahan aktif/instabil: Berikan 4-Factor PCC (25-50 IU/kg IV) + Vitamin K 5-10 mg IV lambat.';
                restart = 'Lanjutkan kembali Warfarin dalam 4 - 7 hari pasca hemostasis sukses.';
            } else if (drug === 'doac-fxa') {
                guidance = 'Hentikan DOAC segera. Endoskopi dapat dilakukan saat hemodinamik stabil.';
                reversal = 'Pada perdarahan aktif yang mengancam nyawa: Andexanet alfa ATAU 4F-PCC (50 IU/kg IV).';
                restart = 'Lanjutkan kembali DOAC dalam 3 - 7 hari setelah hemostasis tercapai.';
            } else if (drug === 'doac-dabi') {
                guidance = 'Hentikan Dabigatran. Periksa fungsi ginjal / klirens kreatinin.';
                reversal = 'Bila perdarahan mengancam nyawa: Berikan Idarucizumab (Praxbind) 5 gram IV (2x 2.5 g).';
                restart = 'Lanjutkan kembali Dabigatran dalam 3 - 7 hari pasca hemostasis sukses.';
            }

            box.innerHTML = `
                <div class="border-l-4 border-l-cyan-400 pl-4 py-1">
                    <h4 class="text-sm font-bold text-white mb-1">Rekomendasi Klinis Protokol (ASGE / ACG 2022)</h4>
                    <p class="text-xs text-slate-300 leading-relaxed mb-3">${guidance}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div class="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                            <span class="font-bold text-rose-300 block mb-1"><i class="fa-solid fa-rotate-left mr-1"></i> Tindakan & Agen Reversal:</span>
                            <span class="text-slate-300">${reversal}</span>
                        </div>
                        <div class="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                            <span class="font-bold text-emerald-300 block mb-1"><i class="fa-solid fa-play mr-1"></i> Waktu Resumption:</span>
                            <span class="text-slate-300">${restart}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function copyAntithromboticResume() {
            const bleed = document.getElementById('at-bleed-status').selectedOptions[0].text;
            const drug = document.getElementById('at-drug').selectedOptions[0].text;
            const box = document.getElementById('at-advice-box').innerText;
            const resume = `[adjusterGEH CDSS] Antithrombotic Management\nStatus: ${bleed}\nObat: ${drug}\n${box}`;
            copyToClipboard(resume);
        }

        function selectForrest(type) {
            document.querySelectorAll('.forrest-card').forEach(c => {
                c.classList.remove('border-cyan-400', 'bg-cyan-950/30');
            });
            const activeCard = document.getElementById(`forrest-card-${type}`);
            if (activeCard) {
                activeCard.classList.add('border-cyan-400', 'bg-cyan-950/30');
            }

            const box = document.getElementById('forrest-detail-box');
            let risk = '';
            let endoRx = '';
            let ppiRx = '';
            let alertColor = 'rose';

            if (type === 'Ia') {
                risk = 'High Risk (Perdarahan arteri aktif menyemprot, rebleeding ~90%).';
                endoRx = 'Hemostasis endoskopi GANDA WAJIB (Dual Therapy: Injeksi Epinefrin + koagulasi termal bipolar / Hemoklip mekanik).';
                ppiRx = 'IV PPI Bolus 80 mg dilanjutkan infus kontinu 8 mg/jam selama 72 jam pertama.';
            } else if (type === 'Ib') {
                risk = 'High Risk (Perdarahan merembes aktif lambat, rebleeding ~50%).';
                endoRx = 'Hemostasis endoskopi GANDA WAJIB (Epinefrin + Hemoklip atau Koagulasi Termal).';
                ppiRx = 'IV PPI infus kontinu 8 mg/jam selama 72 jam pertama.';
            } else if (type === 'IIa') {
                risk = 'High Risk (Pembuluh darah non-bleeding terlihat jelas, rebleeding 40-50%).';
                endoRx = 'Hemostasis endoskopi direkomendasikan kuat (Hemoklip mekanik atau probe termal).';
                ppiRx = 'IV PPI dosis tinggi selama 72 jam.';
                alertColor = 'amber';
            } else if (type === 'IIb') {
                risk = 'Intermediate Risk (Bekuan darah melekat / adherent clot, rebleeding 25-35%).';
                endoRx = 'Irigasi hati-hati untuk visualisasi lesi dasar. Jika pembuluh terlihat, terapi endoskopi.';
                ppiRx = 'IV PPI dosis tinggi rawat inap.';
                alertColor = 'amber';
            } else if (type === 'IIc') {
                risk = 'Low Risk (Bintik berpigmen datar, rebleeding ~7-10%).';
                endoRx = 'TIDAK dianjurkan hemostasis endoskopi.';
                ppiRx = 'PPI oral dosis standar rawat jalan.';
                alertColor = 'emerald';
            } else if (type === 'III') {
                risk = 'Low Risk (Dasar ulkus bersih, rebleeding &lt; 3-5%).';
                endoRx = 'TIDAK ada indikasi hemostasis endoskopi.';
                ppiRx = 'PPI oral rawat jalan (dapat segera dipulangkan).';
                alertColor = 'emerald';
            }

            const resumeText = `[adjusterGEH CDSS] Forrest Classification: ${type}\nRisiko: ${risk}\nEndoskopi: ${endoRx}\nRegimen PPI: ${ppiRx}`;

            box.innerHTML = `
                <div class="border-l-4 border-l-${alertColor}-400 pl-4 py-1">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-bold text-white">Klasifikasi Forrest ${type}</span>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3 py-1 rounded text-xs">
                            <i class="fa-regular fa-copy mr-1"></i> Salin Resume
                        </button>
                    </div>
                    <p class="text-xs text-${alertColor}-300 font-semibold mb-2">${risk}</p>
                    <div class="space-y-2 text-xs text-slate-300">
                        <p><strong>Rekomendasi Endoskopi:</strong> ${endoRx}</p>
                        <p><strong>Rekomendasi Farmakoterapi PPI:</strong> ${ppiRx}</p>
                    </div>
                </div>
            `;
        }

        function calculateRockall() {
            const agePts = parseInt(document.getElementById('rockall-age').value, 10);
            const shockPts = parseInt(document.getElementById('rockall-shock').value, 10);
            const comorbidPts = parseInt(document.getElementById('rockall-comorbid').value, 10);
            const dxVal = document.getElementById('rockall-dx').value;
            const srhVal = document.getElementById('rockall-srh').value;
            const res = document.getElementById('rockall-result-container');

            const preScore = agePts + shockPts + comorbidPts;
            let preMort = '< 1%';
            if (preScore === 0) preMort = '0.2%';
            else if (preScore === 1) preMort = '2.4%';
            else if (preScore === 2) preMort = '5.6%';
            else if (preScore === 3) preMort = '11.0%';
            else if (preScore === 4) preMort = '24.6%';
            else preMort = '> 39.6%';

            const isPost = (dxVal !== 'skip' && srhVal !== 'skip');
            let postScore = null;
            let postRisk = '';
            let rebleedRate = '';
            let postMort = '';
            let colorClass = 'emerald';
            let advice = '';

            if (isPost) {
                postScore = preScore + parseInt(dxVal, 10) + parseInt(srhVal, 10);
                if (postScore <= 2) {
                    postRisk = 'Low Risk (Risiko Rendah)';
                    rebleedRate = '~4.3%';
                    postMort = '~0.1%';
                    colorClass = 'emerald';
                    advice = 'Kandidat kuat untuk pemulangan dini (early discharge) atau rawat jalan bila kondisi sosial mendukung dan hemodinamik stabil.';
                } else if (postScore <= 4) {
                    postRisk = 'Moderate / Intermediate Risk';
                    rebleedRate = '~14.1%';
                    postMort = '~2.9 - 5.3%';
                    colorClass = 'amber';
                    advice = 'Observasi di ruang rawat inap standar, berikan terapi PPI oral/IV, pantau tanda vital dan serial hemoglobin berkala.';
                } else if (postScore <= 7) {
                    postRisk = 'High Risk (Risiko Tinggi)';
                    rebleedRate = '~24 - 33%';
                    postMort = '~11 - 17%';
                    colorClass = 'rose';
                    advice = 'Rawat inap intensif (HCU/ICU), IV PPI dosis tinggi terus-menerus (bolus 80 mg + infus kontinu 8 mg/jam 72 jam), siapkan transfusi PRC.';
                } else {
                    postRisk = 'Very High Risk (Risiko Sangat Tinggi)';
                    rebleedRate = '> 40 - 53%';
                    postMort = '> 41 - 53%';
                    colorClass = 'rose';
                    advice = 'Risiko rebleeding dan kematian fatal sangat tinggi. Wajib rawat ICU, hemostasis endoskopi agresif, siapkan opsi embolisasi transkateter / operasi cito.';
                }
            } else {
                if (preScore <= 1) {
                    colorClass = 'emerald';
                    advice = 'Skor pre-endoskopi rendah. Stabilkan pasien dan jadwalkan EGD elektif/subakut.';
                } else if (preScore <= 2) {
                    colorClass = 'amber';
                    advice = 'Risiko mortalitas moderat (~5.6%). Lakukan resusitasi dan jadwalkan EGD dini dalam 24 jam.';
                } else {
                    colorClass = 'rose';
                    advice = 'Skor pre-endoskopi tinggi (mortalitas > 11-40%). Resusitasi hemodinamik agresif, PPI IV, dan EGD darurat pasca stabilisasi dalam 12-24 jam.';
                }
            }

            const resumeText = isPost
                ? `[adjusterGEH CDSS] Complete Rockall Score: ${postScore}/11 (${postRisk})\nPre-Endoscopy Score: ${preScore}/7 (Mort: ${preMort})\nRebleeding Risk: ${rebleedRate}, Mortalitas Post-EGD: ${postMort}.\nRekomendasi: ${advice}`
                : `[adjusterGEH CDSS] Pre-Endoscopy Rockall Score: ${preScore}/7\nPrediksi Mortalitas Pre-EGD: ${preMort}.\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="w-full">
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">
                                ${isPost ? postRisk : 'Pre-Endoscopy Assessment'}
                            </span>
                            <h3 class="text-lg font-bold text-white mt-1">
                                ${isPost ? `Complete Rockall Score: ${postScore} / 11 poin` : `Pre-Endoscopy Rockall Score: ${preScore} / 7 poin`}
                            </h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 text-xs">
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">Skor Pre-EGD:</span>
                                    <span class="text-base font-bold text-white">${preScore} poin</span>
                                    <span class="text-[10px] text-slate-400 block mt-0.5">Mortalitas ~${preMort}</span>
                                </div>
                                ${isPost ? `
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">Risiko Rebleeding:</span>
                                    <span class="text-base font-bold text-amber-300">${rebleedRate}</span>
                                </div>
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">Mortalitas Total:</span>
                                    <span class="text-base font-bold text-rose-300">${postMort}</span>
                                </div>
                                ` : `
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60 col-span-2">
                                    <span class="text-slate-400 block">Status Post-Endoskopi:</span>
                                    <span class="text-xs text-cyan-300 font-semibold">Pilih temuan diagnosis &amp; stigmata EGD untuk skor komplit (0-11).</span>
                                </div>
                                `}
                            </div>
                            <p class="text-xs sm:text-sm text-slate-300 max-w-2xl">${advice}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume EMR
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 2. HEPATOLOGY & CIRRHOSIS LOGIC
        // ==========================================

        function calculateFib4AndApri() {
            const age = parseFloat(document.getElementById('fib4-age').value);
            const ast = parseFloat(document.getElementById('fib4-ast').value);
            const alt = parseFloat(document.getElementById('fib4-alt').value);
            const plt = parseFloat(document.getElementById('fib4-plt').value);
            const uln = parseFloat(document.getElementById('fib4-ast-uln').value) || 34;
            const res = document.getElementById('fib4-result-container');

            if (isNaN(age) || isNaN(ast) || isNaN(alt) || isNaN(plt)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-sm">Mohon isi semua data numerik (Usia, AST, ALT, dan Trombosit).</div>`;
                res.classList.remove('hidden');
                return;
            }

            const fib4 = (age * ast) / (plt * Math.sqrt(alt));
            const fib4Val = fib4.toFixed(2);

            const apri = ((ast / uln) / plt) * 100;
            const apriVal = apri.toFixed(2);

            let fib4Interp = '';
            let fib4Color = 'emerald';
            if (fib4 < 1.30 || (age > 65 && fib4 < 2.0)) {
                fib4Interp = 'Risiko Rendah Fibrosis Lanjut (F0 - F1, NPV &gt; 90%). Pantau di faskes primer.';
                fib4Color = 'emerald';
            } else if (fib4 <= 2.67) {
                fib4Interp = 'Zona Abu-abu / Indeterminate Risk (F2). Diperlukan pemeriksaan lini kedua (FibroScan).';
                fib4Color = 'amber';
            } else {
                fib4Interp = 'Risiko Tinggi Fibrosis Lanjut / Sirosis (F3 - F4). Rujuk ke hepatologi.';
                fib4Color = 'rose';
            }

            let apriInterp = '';
            if (apri < 0.5) apriInterp = 'Fibrosis signifikan unlikely (F0-F1).';
            else if (apri <= 1.5) apriInterp = 'Indeterminate / Fibrosis sedang (F2).';
            else apriInterp = 'Kemungkinan besar Fibrosis Signifikan / Sirosis (&gt; 2.0 = F4).';

            const resumeText = `[adjusterGEH CDSS] FIB-4: ${fib4Val}, APRI: ${apriVal}\nParameter: Usia ${age}th, AST ${ast}, ALT ${alt}, Platelet ${plt}k.\nFIB-4: ${fib4Interp}\nAPRI: ${apriInterp}`;

            res.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-5 rounded-2xl bg-${fib4Color}-900/30 border border-${fib4Color}-500/50">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-${fib4Color}-400 uppercase tracking-wider">FIB-4 Index</span>
                            <span class="text-2xl font-black text-white">${fib4Val}</span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-200 mt-2">${fib4Interp}</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-slate-900/50 border border-slate-700/60">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">APRI Score</span>
                            <span class="text-2xl font-black text-white">${apriVal}</span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-300 mt-2">${apriInterp}</p>
                    </div>
                </div>
                <div class="mt-3 flex justify-end">
                    <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                        <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume FIB-4 & APRI
                    </button>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function setMaddreyBiliUnit(unit) {
            maddreyBiliUnit = unit;
            const btnMg = document.getElementById('maddrey-bili-unit-mg');
            const btnUmol = document.getElementById('maddrey-bili-unit-umol');
            if (unit === 'mg') {
                btnMg.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                btnUmol.className = 'px-1.5 py-0.5 rounded text-slate-400';
            } else {
                btnUmol.className = 'px-1.5 py-0.5 rounded text-cyan-400 font-bold';
                btnMg.className = 'px-1.5 py-0.5 rounded text-slate-400';
            }
        }

        function calculateMaddrey() {
            const ptPtn = parseFloat(document.getElementById('maddrey-pt-ptn').value);
            const ptCtrl = parseFloat(document.getElementById('maddrey-pt-ctrl').value);
            const biliRaw = parseFloat(document.getElementById('maddrey-bili').value);
            const he = document.querySelector('input[name="maddrey-he"]:checked').value === 'yes';
            const res = document.getElementById('maddrey-result-container');

            if (isNaN(ptPtn) || isNaN(ptCtrl) || isNaN(biliRaw)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-sm">Mohon isi PT Pasien, PT Kontrol, dan Kadar Bilirubin.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const biliMg = (maddreyBiliUnit === 'umol') ? (biliRaw / 17.1) : biliRaw;
            const df = 4.6 * (ptPtn - ptCtrl) + biliMg;
            const dfVal = df.toFixed(1);

            const isSevere = df >= 32 || he;
            const colorClass = isSevere ? 'rose' : 'emerald';
            const statusTitle = isSevere ? 'Severe Alcoholic Hepatitis' : 'Non-Severe Alcoholic Hepatitis';
            const advice = isSevere
                ? 'Pasien mengalami hepatitis alkoholik berat (mDF &ge; 32 / HE). Indikasi terapi Kortikosteroid (Prednisolon 40 mg/hari oral 28 hari) bila tidak ada kontraindikasi infeksi/perdarahan. Nilai respon Lille di hari ke-7.'
                : 'Pasien tidak memenuhi kriteria hepatitis alkoholik berat. Terapi suportif, nutrisi enteral adekuat, tiamin/vitamin, dan penghentian alkohol tanpa kortikosteroid.';

            const resumeText = `[adjusterGEH CDSS] Maddrey's dF: ${dfVal} (${statusTitle})\nPT Pasien: ${ptPtn}s, Kontrol: ${ptCtrl}s, Bilirubin: ${biliRaw} ${maddreyBiliUnit}/dL, HE: ${he}\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-2xl font-black shrink-0">
                                ${dfVal}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${statusTitle}</span>
                                <h3 class="text-base sm:text-lg font-bold text-white mt-1">mDF Score: ${dfVal} (Cutoff 32)</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume mDF
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function toggleLilleAccordion() {
            const sec = document.getElementById('lille-section');
            const arrow = document.getElementById('lille-arrow');
            sec.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
        }

        function calculateLille() {
            const age = parseFloat(document.getElementById('lille-age').value);
            const alb = parseFloat(document.getElementById('lille-alb').value);
            const cr = parseFloat(document.getElementById('lille-cr').value);
            const bili0 = parseFloat(document.getElementById('lille-bili0').value);
            const bili7 = parseFloat(document.getElementById('lille-bili7').value);
            const pt = parseFloat(document.getElementById('lille-pt').value);
            const res = document.getElementById('lille-result-container');

            if (isNaN(age) || isNaN(alb) || isNaN(cr) || isNaN(bili0) || isNaN(bili7) || isNaN(pt)) {
                res.innerHTML = `<div class="p-3 rounded-lg bg-rose-900/40 text-rose-200 text-xs">Mohon isi semua parameter Lille hari ke-0 dan hari ke-7.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const bili0_umol = bili0 * 17.1;
            const bili7_umol = bili7 * 17.1;
            const alb_gl = alb * 10;
            const cr_umol = cr * 88.4;

            const r = 3.19 - (0.101 * age) + (0.147 * alb_gl) + (0.0165 * (bili0_umol - bili7_umol)) - (0.206 * (cr_umol > 115 ? 1 : 0)) - (0.0065 * bili0_umol) - (0.0096 * pt);
            const lille = Math.exp(-r) / (1 + Math.exp(-r));
            const lilleVal = lille.toFixed(3);

            const isResponder = lille <= 0.45;
            const colorClass = isResponder ? 'emerald' : 'rose';
            const status = isResponder ? 'Steroid Responder (Lille &le; 0.45)' : 'Steroid Non-Responder (Lille &gt; 0.45)';
            const advice = isResponder
                ? 'Respon terapi baik. Lanjutkan Prednisolon hingga siklus penuh 28 hari, kemudian tapering.'
                : 'Pasien tidak berespon terhadap kortikosteroid. Hentikan steroid untuk mencegah sepsis fatal; evaluasi transplantasi hepar.';

            const resumeText = `[adjusterGEH CDSS] Lille Score Day 7: ${lilleVal} (${status})\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-4 rounded-xl bg-${colorClass}-900/30 border border-${colorClass}-500/50">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-${colorClass}-300 uppercase">${status}</span>
                        <span class="text-xl font-bold text-white">${lilleVal}</span>
                    </div>
                    <p class="text-xs text-slate-300 mt-1.5">${advice}</p>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateClif() {
            const age = parseFloat(document.getElementById('clif-age').value);
            let wbc = parseFloat(document.getElementById('clif-wbc').value);
            const bili = parseFloat(document.getElementById('clif-bili').value);
            const cr = parseFloat(document.getElementById('clif-cr').value);
            const inr = parseFloat(document.getElementById('clif-inr').value);
            const res = document.getElementById('clif-result-container');

            if (isNaN(age) || isNaN(wbc) || isNaN(bili) || isNaN(cr) || isNaN(inr)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon isi semua parameter lab yang bertanda bintang (*).</div>`;
                res.classList.remove('hidden');
                return;
            }

            if (wbc > 100) wbc = wbc / 1000;

            const dialysis = document.getElementById('clif-dialysis').checked;
            const vaso = document.getElementById('clif-vaso').checked;
            const he = document.getElementById('clif-he').checked;

            let failures = 0;
            if (bili >= 12.0) failures++;
            if (cr >= 2.0 || dialysis) failures++;
            if (he) failures++;
            if (inr >= 2.5) failures++;
            if (vaso) failures++;

            let grade = 'No ACLF';
            let mort28 = '&lt; 5%';
            let mort90 = '&lt; 15%';
            let colorClass = 'emerald';

            if (failures === 0) {
                grade = 'Acute Decompensation (Tanpa ACLF)';
                mort28 = '~5%';
                mort90 = '~14%';
                colorClass = 'emerald';
            } else if (failures === 1) {
                grade = 'CLIF-C ACLF Grade 1';
                mort28 = '~22%';
                mort90 = '~41%';
                colorClass = 'amber';
            } else if (failures === 2) {
                grade = 'CLIF-C ACLF Grade 2';
                mort28 = '~32%';
                mort90 = '~55%';
                colorClass = 'rose';
            } else {
                grade = 'CLIF-C ACLF Grade 3 (Multiple Organ Failure)';
                mort28 = '&gt; 75%';
                mort90 = '&gt; 85%';
                colorClass = 'rose';
            }

            const resumeText = `[adjusterGEH CDSS] EASL CLIF-C: ${grade}\nKegagalan Organ: ${failures} sistem.\nEstimasi Mortalitas 28-hari: ${mort28}, 90-hari: ${mort90}.`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${grade}</span>
                            <h3 class="text-lg font-bold text-white mt-1">Kegagalan Organ: ${failures} Sistem</h3>
                            <div class="grid grid-cols-2 gap-3 mt-2 text-xs">
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">Mortalitas 28-Hari:</span>
                                    <span class="text-base font-bold text-white">${mort28}</span>
                                </div>
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">Mortalitas 90-Hari:</span>
                                    <span class="text-base font-bold text-white">${mort90}</span>
                                </div>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume CLIF
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateBaveno() {
            const lsm = parseFloat(document.getElementById('baveno-lsm').value);
            const plt = parseFloat(document.getElementById('baveno-plt').value);
            const res = document.getElementById('baveno-result-container');

            if (isNaN(lsm) || isNaN(plt)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon masukkan nilai LSM (kPa) dan Trombosit.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const isSafeToSpare = (lsm < 20.0 && plt > 150.0);
            const isCsphConfirmed = (lsm >= 25.0);

            let status = '';
            let colorClass = 'emerald';
            let advice = '';

            if (isSafeToSpare) {
                status = 'Memenuhi Kriteria Baveno VII (Safe to Avoid Endoscopy)';
                colorClass = 'emerald';
                advice = 'Risiko varises berisiko tinggi &lt; 5%. Pasien AMAN untuk menghindari endoskopi skrining (EGD). Pantau berkala tahunan.';
            } else if (isCsphConfirmed) {
                status = 'CSPH Confirmed (Clinically Significant Portal Hypertension)';
                colorClass = 'rose';
                advice = 'LSM &ge; 25 kPa menegakkan adanya hipertensi portal signifikan. Direkomendasikan memulai NSBB (Carvedilol 6.25 - 12.5 mg/hari) atau skrining EGD.';
            } else {
                status = 'Kriteria Tidak Terpenuhi (Skrining EGD Diindikasikan)';
                colorClass = 'amber';
                advice = 'Pasien tidak memenuhi kriteria keamanan Baveno VII. Jadwalkan endoskopi saluran cerna atas (EGD) untuk penapisan varises.';
            }

            const resumeText = `[adjusterGEH CDSS] Baveno VII: ${status}\nLSM: ${lsm} kPa, Trombosit: ${plt}k.\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${status}</span>
                            <h3 class="text-lg font-bold text-white mt-1">LSM: ${lsm} kPa | Trombosit: ${plt} x10³/µL</h3>
                            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Baveno
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 2.5 Child-Turcotte-Pugh (CTP) Logic ---
        function toggleCtpBiliHint() {
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
        }

        function calculateCtp() {
            const he = parseInt(document.getElementById('ctp-he').value, 10);
            const ascites = parseInt(document.getElementById('ctp-ascites').value, 10);
            const bili = parseInt(document.getElementById('ctp-bili').value, 10);
            const alb = parseInt(document.getElementById('ctp-alb').value, 10);
            const inr = parseInt(document.getElementById('ctp-inr').value, 10);
            const res = document.getElementById('ctp-result-container');

            const score = he + ascites + bili + alb + inr;
            let ctpClass = '';
            let surv1 = '';
            let surv2 = '';
            let opMort = '';
            let colorClass = 'emerald';
            let rxAdvice = '';

            if (score <= 6) {
                ctpClass = 'Class A (Well-Compensated)';
                surv1 = '100%';
                surv2 = '85%';
                opMort = '~10%';
                colorClass = 'emerald';
                rxAdvice = 'Fungsi hepar terkompensasi baik. Dosis obat sebagian besar normal, hindari hepatotoksin potensial. Evaluasi sirosis berkala dan surveilans HCC.';
            } else if (score <= 9) {
                ctpClass = 'Class B (Significant Functional Compromise)';
                surv1 = '80%';
                surv2 = '60%';
                opMort = '~30 - 35%';
                colorClass = 'amber';
                rxAdvice = 'Kerusakan fungsional hepar signifikan. Kurangi dosis obat yang dimetabolisme hepar sekitar 25 - 50%. Pertimbangkan evaluasi transplantasi hepar dan skrining varises.';
            } else {
                ctpClass = 'Class C (Decompensated Cirrhosis)';
                surv1 = '45%';
                surv2 = '35%';
                opMort = '~75 - 82% (Kontraindikasi Relatif Operasi Mayor Elektif)';
                colorClass = 'rose';
                rxAdvice = 'Sirosis dekompensasi berat. Hindari sedatif, NSAID, dan obat dengan klirens hepatik tinggi (turunkan dosis ≥ 50%). Indikasi kuat evaluasi transplantasi hepar (MELD/UNOS listing).';
            }

            const resumeText = `[adjusterGEH CDSS] Child-Turcotte-Pugh (CTP): ${score} Poin (${ctpClass})\n1-Year Survival: ${surv1}, 2-Year Survival: ${surv2}, Perioperative Mortality: ${opMort}.\nPenyesuaian Obat: ${rxAdvice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="w-full">
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${ctpClass}</span>
                            <h3 class="text-xl font-bold text-white mt-1">Skor Child-Pugh: ${score} poin</h3>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">1-Year Survival:</span>
                                    <span class="text-base font-bold text-white">${surv1}</span>
                                </div>
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">2-Year Survival:</span>
                                    <span class="text-base font-bold text-white">${surv2}</span>
                                </div>
                                <div class="p-2.5 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">Mortalitas Operasi Abdomen:</span>
                                    <span class="text-base font-bold text-rose-300">${opMort}</span>
                                </div>
                            </div>
                            
                            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300">
                                <strong class="text-cyan-400 block mb-1"><i class="fa-solid fa-pills mr-1"></i> Penyesuaian Dosis Obat &amp; Panduan Klinis:</strong>
                                ${rxAdvice}
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume CTP
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 2.6 MELD, MELD-Na, & MELD 3.0 Logic ---
        function calculateMeld() {
            const biliRaw = parseFloat(document.getElementById('meld-bili').value);
            const crRaw = parseFloat(document.getElementById('meld-cr').value);
            const inrRaw = parseFloat(document.getElementById('meld-inr').value);
            const naRaw = parseFloat(document.getElementById('meld-na').value);
            const albRaw = parseFloat(document.getElementById('meld-alb').value);
            const sex = document.querySelector('input[name="meld-sex"]:checked').value;
            const dialysis = document.getElementById('meld-dialysis').checked;
            const res = document.getElementById('meld-result-container');

            if (isNaN(biliRaw) || isNaN(crRaw) || isNaN(inrRaw) || isNaN(naRaw) || isNaN(albRaw)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon lengkapi seluruh nilai lab numerik (Bilirubin, Kreatinin, INR, Natrium, Albumin).</div>`;
                res.classList.remove('hidden');
                return;
            }

            // Original MELD boundaries
            const crAdj = dialysis ? 4.0 : Math.min(4.0, Math.max(1.0, crRaw));
            const biliAdj = Math.max(1.0, biliRaw);
            const inrAdj = Math.max(1.0, inrRaw);

            const meldRaw = 9.57 * Math.log(crAdj) + 3.78 * Math.log(biliAdj) + 11.20 * Math.log(inrAdj) + 6.43;
            const meldOrig = Math.min(40, Math.max(6, Math.round(meldRaw)));

            // MELD-Na (UNOS 2016)
            const naAdj = Math.min(137, Math.max(125, naRaw));
            let meldNa = meldOrig;
            if (meldOrig > 11) {
                const meldNaRaw = meldOrig + 1.32 * (137 - naAdj) - (0.033 * meldOrig * (137 - naAdj));
                meldNa = Math.min(40, Math.max(6, Math.round(meldNaRaw)));
            }

            // MELD 3.0 (OPTN / Kim et al. 2021)
            const crAdjMeld3 = dialysis ? 3.0 : Math.min(3.0, Math.max(1.0, crRaw));
            const albAdj = Math.min(3.5, Math.max(1.5, albRaw));
            const isFemale = (sex === 'female') ? 1 : 0;
            const meld3Raw = (1.33 * isFemale)
                + (4.56 * Math.log(biliAdj))
                + (0.82 * (137 - naAdj))
                - (0.24 * (137 - naAdj) * Math.log(biliAdj))
                + (9.09 * Math.log(inrAdj))
                + (11.14 * Math.log(crAdjMeld3))
                + (1.85 * (3.5 - albAdj))
                - (1.83 * (3.5 - albAdj) * Math.log(crAdjMeld3))
                + 6.0;
            const meld3 = Math.min(40, Math.max(6, Math.round(meld3Raw)));

            // 90-Day Mortality based on MELD-Na
            let mort90 = '';
            let colorClass = 'emerald';
            if (meldNa < 10) {
                mort90 = '~1.9%';
                colorClass = 'emerald';
            } else if (meldNa <= 19) {
                mort90 = '~6.0%';
                colorClass = 'amber';
            } else if (meldNa <= 29) {
                mort90 = '~19.6%';
                colorClass = 'rose';
            } else if (meldNa <= 39) {
                mort90 = '~52.6%';
                colorClass = 'rose';
            } else {
                mort90 = '> 71.3%';
                colorClass = 'rose';
            }

            const resumeText = `[adjusterGEH CDSS] MELD Trio Assessment:\nOriginal MELD: ${meldOrig} | MELD-Na: ${meldNa} | MELD 3.0: ${meld3}\nEstimasi Mortalitas Waitlist 90-Hari (MELD-Na): ${mort90}\nPasien: ${sex === 'female' ? 'Wanita' : 'Pria'}, Bili ${biliRaw}, Cr ${crRaw} (Dialisis: ${dialysis}), INR ${inrRaw}, Na ${naRaw}, Albumin ${albRaw} g/dL.`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="w-full">
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">
                                Estimasi Mortalitas 90-Hari: ${mort90}
                            </span>
                            <h3 class="text-lg font-bold text-white mt-1">Perbandingan MELD Trio Multi-Model</h3>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                                <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 text-center">
                                    <span class="text-xs text-slate-400 font-semibold block">Original MELD (2002)</span>
                                    <span class="text-2xl font-black text-white block my-1">${meldOrig}</span>
                                    <span class="text-[10px] text-slate-500">Cr, Bili, INR</span>
                                </div>
                                <div class="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center">
                                    <span class="text-xs text-cyan-300 font-semibold block">MELD-Na (UNOS 2016)</span>
                                    <span class="text-2xl font-black text-cyan-400 block my-1">${meldNa}</span>
                                    <span class="text-[10px] text-cyan-200/60">Standar Alokasi UNOS</span>
                                </div>
                                <div class="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center">
                                    <span class="text-xs text-amber-300 font-semibold block">MELD 3.0 (OPTN 2021)</span>
                                    <span class="text-2xl font-black text-amber-400 block my-1">${meld3}</span>
                                    <span class="text-[10px] text-amber-200/60">+Gender &amp; Albumin Interaction</span>
                                </div>
                            </div>

                            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                                <p><strong class="text-white">Signifikansi Klinis:</strong> MELD-Na memperhitungkan hiponatremia sebagai prediktor independen perburukan ascites dan mortalitas. MELD 3.0 memberikan kompensasi +1.33 poin pada wanita serta penyesuaian interaksi albumin-kreatinin untuk mengurangi disparitas massa otot dan tingkat transplantasi pasien wanita.</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume MELD
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 2.7 SAAG & Absolute PMN Logic ---
        function calculateSaag() {
            const serumAlb = parseFloat(document.getElementById('saag-serum-alb').value);
            const ascitesAlb = parseFloat(document.getElementById('saag-ascites-alb').value);
            const wbc = parseFloat(document.getElementById('saag-wbc').value);
            const pmnPct = parseFloat(document.getElementById('saag-pmn').value);
            const ascitesProt = parseFloat(document.getElementById('saag-protein').value);
            const res = document.getElementById('saag-result-container');

            if (isNaN(serumAlb) || isNaN(ascitesAlb) || isNaN(wbc) || isNaN(pmnPct)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon isi data numerik wajib (Albumin serum, Albumin asites, Leukosit, dan % PMN).</div>`;
                res.classList.remove('hidden');
                return;
            }

            const saag = parseFloat((serumAlb - ascitesAlb).toFixed(2));
            const pmnAbs = Math.round(wbc * (pmnPct / 100));

            const isHighGradient = saag >= 1.1;
            const isSbp = pmnAbs >= 250;

            let saagCategory = isHighGradient ? 'High Gradient (Hipertensi Portal, Akurasi ~97%)' : 'Low Gradient (Non-Hipertensi Portal)';
            let saagColor = isHighGradient ? 'cyan' : 'purple';
            let saagDiff = isHighGradient
                ? 'Etiologi: Sirosis Hepatis, Alcoholic Hepatitis, Gagal Jantung Kongestif (CHF), Budd-Chiari, Trombosis Vena Porta masif.'
                : 'Etiologi: Karsinomatosis Peritoneal, Tuberkulosis Peritoneal, Sindrom Nefrotik, Pankreatitis, Infeksi Serosa Sekunder.';

            let sbpCategory = isSbp ? 'POSITIF SBP (Spontaneous Bacterial Peritonitis)' : 'Negatif SBP Sitologis';
            let sbpColor = isSbp ? 'rose' : 'emerald';
            let sbpRx = isSbp
                ? 'Indikasi mutlak antibiotik IV segera: Cefotaxime 2g IV q8h atau Ceftriaxone 2g IV q24h selama 5-7 hari. Berikan Albumin IV (1.5 g/kgBB dalam 6 jam pertama, 1.0 g/kgBB hari ke-3) jika Cr > 1.0, BUN > 30, atau Bilirubin > 4.0 mg/dL.'
                : 'Kriteria sitologis SBP belum terpenuhi (< 250 PMN/mm³). Jika klinis curiga tinggi atau cairan keruh, tetap inokulasikan botol kultur darah di bedside.';

            let protNote = '';
            if (!isNaN(ascitesProt)) {
                if (isHighGradient) {
                    if (ascitesProt < 2.5) {
                        protNote = 'Protein asites < 2.5 g/dL: Mendukung etiologi sinusoidal (Sirosis hepatis murni).';
                    } else {
                        protNote = 'Protein asites ≥ 2.5 g/dL: Curigai etiologi post-sinusoidal / cardiac ascites (Gagal Jantung, Konstriktif Perikarditis, atau Budd-Chiari dini).';
                    }
                }
                if (ascitesProt < 1.5) {
                    protNote += ' Protein < 1.5 g/dL meningkatkan risiko SBP primer (indikasi profilaksis primer Ciprofloxacin / Cotrimoxazole bila disertai disfungsi hati lanjut).';
                }
            }

            const resumeText = `[adjusterGEH CDSS] SAAG & SBP Evaluation:\nSAAG: ${saag} g/dL (${saagCategory})\nPMN Absolut: ${pmnAbs} sel/mm³ (${sbpCategory})\nAlb Serum ${serumAlb}, Alb Asites ${ascitesAlb}, WBC ${wbc}, PMN ${pmnPct}%.${protNote ? '\nProtein Asites: ' + ascitesProt + ' g/dL (' + protNote + ')' : ''}\nRekomendasi SBP: ${sbpRx}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 shadow-lg space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- SAAG Card -->
                        <div class="p-4 rounded-xl bg-${saagColor}-950/30 border border-${saagColor}-500/40">
                            <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-${saagColor}-500/20 text-${saagColor}-300 border border-${saagColor}-500/30">
                                ${isHighGradient ? 'SAAG ≥ 1.1 g/dL' : 'SAAG < 1.1 g/dL'}
                            </span>
                            <h4 class="text-xl font-bold text-white mt-1">SAAG: ${saag} g/dL</h4>
                            <p class="text-xs font-semibold text-${saagColor}-300 mt-1">${saagCategory}</p>
                            <p class="text-xs text-slate-300 mt-2 leading-relaxed">${saagDiff}</p>
                            ${protNote ? `<p class="text-xs text-amber-300/90 mt-2 pt-2 border-t border-slate-700/60"><i class="fa-solid fa-circle-info mr-1"></i> ${protNote}</p>` : ''}
                        </div>

                        <!-- PMN SBP Card -->
                        <div class="p-4 rounded-xl bg-${sbpColor}-950/30 border border-${sbpColor}-500/40">
                            <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-${sbpColor}-500/20 text-${sbpColor}-300 border border-${sbpColor}-500/30">
                                ${isSbp ? 'PMN ≥ 250 sel/mm³' : 'PMN < 250 sel/mm³'}
                            </span>
                            <h4 class="text-xl font-bold text-white mt-1">PMN Absolut: ${pmnAbs} sel/mm³</h4>
                            <p class="text-xs font-semibold text-${sbpColor}-300 mt-1">${sbpCategory}</p>
                            <p class="text-xs text-slate-300 mt-2 leading-relaxed">${sbpRx}</p>
                        </div>
                    </div>

                    <div class="flex justify-end pt-1">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume SAAG &amp; SBP
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 2.8 R-Factor Logic ---
        function calculateRFactor() {
            const alt = parseFloat(document.getElementById('rfactor-alt').value);
            const altUln = parseFloat(document.getElementById('rfactor-alt-uln').value);
            const alp = parseFloat(document.getElementById('rfactor-alp').value);
            const alpUln = parseFloat(document.getElementById('rfactor-alp-uln').value);
            const bili = parseFloat(document.getElementById('rfactor-bili').value);
            const res = document.getElementById('rfactor-result-container');

            if (isNaN(alt) || isNaN(altUln) || isNaN(alp) || isNaN(alpUln)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon isi nilai ALT, Batas Normal ALT, ALP, dan Batas Normal ALP.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const altRatio = alt / altUln;
            const alpRatio = alp / alpUln;
            const r = parseFloat((altRatio / alpRatio).toFixed(2));

            let pattern = '';
            let colorClass = 'emerald';
            let causes = '';

            if (r >= 5.0) {
                pattern = 'Hepatocellular Pattern (R ≥ 5.0)';
                colorClass = 'rose';
                causes = 'Cedera hepatoseluler mendominasi. DILI: Parasetamol, INH, Rifampisin, Pirazinamid, NSAID, Fenitoin, Valproat. Non-DILI: Viral hepatitis (A/B/C/E), Autoimmune hepatitis, Hepatitis iskemik/shock liver.';
            } else if (r > 2.0) {
                pattern = 'Mixed Pattern (2.0 < R < 5.0)';
                colorClass = 'amber';
                causes = 'Pola cedera campuran hepatosit & kanalikuli. DILI: Amoxicillin-clavulanate, Carbamazepine, Sulfonamides, Azathioprine, Enalapril.';
            } else {
                pattern = 'Cholestatic Pattern (R ≤ 2.0)';
                colorClass = 'emerald';
                causes = 'Cedera kolestatik mendominasi. DILI: Amoxicillin-clavulanate (fase kolestatik), Steroid anabolik, Chlorpromazine, Erythromycin, TMP-SMX, Estrogen. Non-DILI: Obstruksi bilier mekanik (batu/keganasan), PBC, PSC.';
            }

            // Hy's Law check (Total Bilirubin >= 2x ULN, ULN RS: 1.2 mg/dL -> >= 2.4 mg/dL)
            let hysLawAlert = '';
            const biliUln = 1.2;
            const hysBiliThreshold = 2.0 * biliUln; // 2.4 mg/dL
            if (!isNaN(bili) && altRatio >= 3.0 && bili >= hysBiliThreshold && alpRatio < 2.0) {
                hysLawAlert = `
                    <div class="mt-3 p-3 rounded-lg bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200">
                        <strong class="text-rose-300 block mb-1"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Memenuhi Kriteria Hy's Law (DILI Berat)</strong>
                        ALT ≥ 3x ULN dengan Total Bilirubin ≥ 2x ULN (≥ ${hysBiliThreshold.toFixed(1)} mg/dL [ULN RS: ${biliUln} mg/dL]) tanpa kolestasis awal (ALP &lt; 2x ULN). Menandakan risiko mortalitas hepar atau kebutuhan transplantasi hati hingga 10 - 50%. Hentikan segera obat yang dicurigai!
                    </div>
                `;
            }

            const resumeText = `[adjusterGEH CDSS] R-Factor for Liver Injury: ${r} (${pattern})\nALT ${alt} (ULN ${altUln}), ALP ${alp} (ULN ${alpUln})${!isNaN(bili) ? ', Bili: ' + bili + ' mg/dL' : ''}.\nKarakteristik: ${causes}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="w-full">
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${pattern}</span>
                            <h3 class="text-xl font-bold text-white mt-1">Nilai R-Factor: ${r}</h3>
                            <div class="grid grid-cols-2 gap-3 my-2 text-xs">
                                <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">ALT / ULN:</span>
                                    <span class="text-base font-bold text-white">${altRatio.toFixed(2)}x</span>
                                </div>
                                <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                    <span class="text-slate-400 block">ALP / ULN:</span>
                                    <span class="text-base font-bold text-white">${alpRatio.toFixed(2)}x</span>
                                </div>
                            </div>
                            <p class="text-xs sm:text-sm text-slate-300 mt-2">${causes}</p>
                            ${hysLawAlert}
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume R-Factor
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 2.9 De Ritis Ratio Logic ---
        function calculateDeRitis() {
            const ast = parseFloat(document.getElementById('deritis-ast').value);
            const alt = parseFloat(document.getElementById('deritis-alt').value);
            const res = document.getElementById('deritis-result-container');

            if (isNaN(ast) || isNaN(alt) || alt <= 0) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon isi nilai AST dan ALT yang valid (> 0).</div>`;
                res.classList.remove('hidden');
                return;
            }

            const ratio = parseFloat((ast / alt).toFixed(2));
            let category = '';
            let colorClass = 'emerald';
            let rationale = '';

            if (ratio > 2.0) {
                category = 'Sangat Sugestif Alcoholic Liver Disease (ALD)';
                colorClass = 'rose';
                rationale = 'Rasio > 2.0 (terutama jika AST < 300-500 U/L) memiliki spesifisitas tinggi (~90%) untuk hepatitis alkoholik. Defisiensi piridoksal-5-fosfat (Vit B6) menekan produksi ALT sitosol, sedangkan etanol merusak mitokondria memicu pelepasan masif AST mitokondrial.';
            } else if (ratio >= 1.0) {
                category = 'Curiga Fibrosis Lanjut atau Sirosis Hepatis';
                colorClass = 'amber';
                rationale = 'Pada penyakit non-alkoholik (seperti MASLD atau Hepatitis C), rasio AST/ALT ≥ 1.0 mengindikasikan penurunan klirens sinusoidal hepar terhadap AST, penanda kuat progresi ke arah fibrosis lanjut atau sirosis.';
            } else {
                category = 'Pola Tipikal MASLD / Hepatitis Akut (Non-Sirosis)';
                colorClass = 'emerald';
                rationale = 'Rasio < 1.0 (ALT lebih tinggi dari AST) merupakan pola klasik steatosis hati (MASLD/NAFLD), hepatitis virus kronik atau akut fase awal tanpa sirosis lanjut.';
            }

            if (ratio >= 3.5) {
                rationale += ' Rasio > 3.0-4.0 juga wajib diwaspadai untuk Penyakit Wilson (terutama jika Alkaline Phosphatase sangat rendah atau disertai anemia hemolitik).';
            }

            const resumeText = `[adjusterGEH CDSS] The De Ritis Ratio: ${ratio}\nAST ${ast} U/L, ALT ${alt} U/L.\nInterpretasi: ${category}\nAnalisis: ${rationale}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="w-full">
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${category}</span>
                            <h3 class="text-2xl font-black text-white mt-1">Rasio AST / ALT: ${ratio}</h3>
                            <div class="flex items-center space-x-4 my-2 text-xs text-slate-300 flex-wrap gap-y-1">
                                <span>AST: <strong class="text-white">${ast} U/L</strong> <span class="text-[11px] text-slate-400">(Ref RS: &lt;34)</span></span>
                                <span>ALT: <strong class="text-white">${alt} U/L</strong> <span class="text-[11px] text-slate-400">(Ref RS: &lt;55)</span></span>
                            </div>
                            <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">${rationale}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume De Ritis
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 2.10 NFS & BARD Logic ---
        function calculateNfs() {
            const age = parseFloat(document.getElementById('nfs-age').value);
            const bmi = parseFloat(document.getElementById('nfs-bmi').value);
            const dm = document.querySelector('input[name="nfs-dm"]:checked').value === 'yes' ? 1 : 0;
            const ast = parseFloat(document.getElementById('nfs-ast').value);
            const alt = parseFloat(document.getElementById('nfs-alt').value);
            const plt = parseFloat(document.getElementById('nfs-plt').value);
            const alb = parseFloat(document.getElementById('nfs-alb').value);
            const res = document.getElementById('nfs-result-container');

            if (isNaN(age) || isNaN(bmi) || isNaN(ast) || isNaN(alt) || isNaN(plt) || isNaN(alb) || alt <= 0) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon isi semua data numerik wajib untuk NFS &amp; BARD.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const astAltRatio = ast / alt;

            // NFS Formula: -1.675 + 0.037*Age + 0.094*BMI + 1.13*IFG/DM + 0.99*(AST/ALT) - 0.013*PLT - 0.66*Alb
            const nfsRaw = -1.675 + (0.037 * age) + (0.094 * bmi) + (1.13 * dm) + (0.99 * astAltRatio) - (0.013 * plt) - (0.66 * alb);
            const nfs = parseFloat(nfsRaw.toFixed(3));

            // BARD Score: BMI >= 28 (1), AST/ALT >= 0.8 (2), DM (1) -> 0-4
            let bard = 0;
            if (bmi >= 28) bard += 1;
            if (astAltRatio >= 0.8) bard += 2;
            if (dm === 1) bard += 1;

            let nfsCategory = '';
            let nfsColor = 'emerald';
            let nfsAdvice = '';

            if (nfs < -1.455) {
                nfsCategory = 'Low Probability of Advanced Fibrosis (F0 - F2)';
                nfsColor = 'emerald';
                nfsAdvice = 'Nilai prediksi negatif (NPV) ~90%. Advanced fibrosis dapat disingkirkan dengan aman. Pasien dapat dimonitor di faskes primer tiap 2-3 tahun dengan intervensi gaya hidup.';
            } else if (nfs <= 0.675) {
                nfsCategory = 'Indeterminate Score ("Gray Zone")';
                nfsColor = 'amber';
                nfsAdvice = 'Hasil berada dalam zona intermediate/abu-abu. Derajat fibrosis belum dapat disimpulkan pasti. Rekomendasi: Lakukan pemeriksaan elastografi transien (FibroScan/VCTE) atau rujuk ke Sp.PD.';
            } else {
                nfsCategory = 'High Probability of Advanced Fibrosis (F3 - F4 / Cirrhosis)';
                nfsColor = 'rose';
                nfsAdvice = 'Nilai prediksi positif (PPV) ~85-90%. Risiko tinggi fibrosis berat atau sirosis. Rujuk ke Sp.PD-KGEH untuk FibroScan/biopsi, skrining varises esofagus dengan EGD, dan surveilans HCC (USG 6 bulan sekali).';
            }

            let bardAdvice = (bard <= 1)
                ? 'BARD 0-1: Risiko rendah advanced fibrosis (NPV 96%).'
                : 'BARD 2-4: Risiko tinggi advanced fibrosis (Odds Ratio ~17x).';

            const resumeText = `[adjusterGEH CDSS] MASLD Fibrosis Assessment:\nNFS: ${nfs} (${nfsCategory})\nBARD Score: ${bard}/4 (${bardAdvice})\nUsia ${age}th, BMI ${bmi}, DM: ${dm ? 'Ya' : 'Tidak'}, AST ${ast}, ALT ${alt}, Plt ${plt}, Albumin ${alb} g/dL.\nRekomendasi: ${nfsAdvice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/80 shadow-lg space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- NFS Card -->
                        <div class="p-4 rounded-xl bg-${nfsColor}-950/30 border border-${nfsColor}-500/40">
                            <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-${nfsColor}-500/20 text-${nfsColor}-300 border border-${nfsColor}-500/30">
                                NAFLD Fibrosis Score
                            </span>
                            <h4 class="text-2xl font-black text-white mt-1">Skor NFS: ${nfs}</h4>
                            <p class="text-xs font-semibold text-${nfsColor}-300 mt-1">${nfsCategory}</p>
                            <p class="text-xs text-slate-300 mt-2 leading-relaxed">${nfsAdvice}</p>
                        </div>

                        <!-- BARD Card -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/60">
                            <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                BARD Score Alternatif
                            </span>
                            <h4 class="text-2xl font-black text-white mt-1">Skor BARD: ${bard} / 4</h4>
                            <p class="text-xs text-slate-300 mt-2 leading-relaxed">${bardAdvice}</p>
                            <div class="mt-2 text-[11px] text-slate-400 space-y-0.5">
                                <div>BMI &ge; 28: ${bmi >= 28 ? '1 poin' : '0 poin'}</div>
                                <div>AST/ALT &ge; 0.8: ${astAltRatio >= 0.8 ? '2 poin' : '0 poin'}</div>
                                <div>Diabetes: ${dm === 1 ? '1 poin' : '0 poin'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-1">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume NFS &amp; BARD
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
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

        

        // ==========================================
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
        }

        function toggleAihBiopsySection() {
            const status = document.getElementById('aih-biopsy-done').value;
            const container = document.getElementById('aih-biopsy-inputs');
            if (status === 'yes') {
                container.classList.remove('opacity-40', 'pointer-events-none');
            } else {
                container.classList.add('opacity-40', 'pointer-events-none');
            }
        }

        function checkAihSeronegativeRule() {
            const abVal = document.getElementById('aih-main-ab').value;
            const alertBox = document.getElementById('aih-seronegative-alert');
            if (alertBox) {
                if (abVal === '<1:40') {
                    alertBox.classList.remove('hidden');
                } else {
                    alertBox.classList.add('hidden');
                }
            }
        }

        function autoCalcLabRatios() {
            const alp = parseFloat(document.getElementById('aih-calc-alp').value);
            const ast = parseFloat(document.getElementById('aih-calc-ast').value);
            const alt = parseFloat(document.getElementById('aih-calc-alt').value);
            const proteinVal = parseFloat(document.getElementById('aih-calc-igg').value);
            const defaultUln = (currentAihProteinType === 'globulin') ? 3.2 : 1600;
            const proteinUln = parseFloat(document.getElementById('aih-calc-igg-uln').value) || defaultUln;
            const hint = document.getElementById('aih-lab-calc-hint');

            let appliedList = [];

            // Ratio ALP : AST or ALT (rounded to 2 decimal places to prevent float epsilon issues)
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
                appliedList.push(`Rasio ALP/Transaminase: ${minRatio.toFixed(2)} (${selectRatio.value})`);
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
                appliedList.push(`${typeName}: ${timesUln.toFixed(2)}× ULN (${selectIgg.value})`);
            }

            if (appliedList.length > 0) {
                hint.innerText = `Berhasil diterapkan: ${appliedList.join(' | ')}`;
            } else {
                hint.innerText = 'Harap isi angka lab minimal ALP & AST/ALT atau IgG & ULN.';
            }
        }

        function calculateAihScore() {
            const sex = document.getElementById('aih-sex').value;
            const alpRatio = document.getElementById('aih-alp-ratio').value;
            const iggLevel = document.getElementById('aih-igg-level').value;
            const mainAb = document.getElementById('aih-main-ab').value;
            const ama = document.getElementById('aih-ama').value;
            const viralMarkers = document.getElementById('aih-viral-markers').value;
            const drugs = document.getElementById('aih-drugs').value;
            const alcohol = document.getElementById('aih-alcohol').value;
            const biopsyDone = (document.getElementById('aih-biopsy-done').value === 'yes');

            const histInterface = document.getElementById('aih-hist-interface').checked;
            const histLympho = document.getElementById('aih-hist-lympho').checked;
            const histRosettes = document.getElementById('aih-hist-rosettes').checked;
            const histBiliary = document.getElementById('aih-hist-biliary').checked;
            const histOther = document.getElementById('aih-hist-other').checked;

            const otherAutoimmune = document.getElementById('aih-other-autoimmune').value;
            const otherAbs = document.getElementById('aih-other-abs').checked;
            const hlaDr = document.getElementById('aih-hla-dr').checked;
            const therapyResponse = document.getElementById('aih-therapy-response').value;

            let score = 0;
            const pointBreakdown = [];

            // 1. Sex
            if (sex === 'female') {
                score += 2;
                pointBreakdown.push({ param: 'Jenis Kelamin', val: 'Wanita / Female', pts: '+2' });
            } else {
                pointBreakdown.push({ param: 'Jenis Kelamin', val: 'Pria / Male', pts: '0' });
            }

            // 2. ALP:AST or ALT ratio
            if (alpRatio === '<1.5') {
                score += 2;
                pointBreakdown.push({ param: 'Rasio ALP : AST/ALT', val: '< 1.5 (Hepatoselular)', pts: '+2' });
            } else if (alpRatio === '>3.0') {
                score -= 2;
                pointBreakdown.push({ param: 'Rasio ALP : AST/ALT', val: '> 3.0 (Kolestatik)', pts: '-2' });
            } else {
                pointBreakdown.push({ param: 'Rasio ALP : AST/ALT', val: '1.5 - 3.0 (Mixed)', pts: '0' });
            }

            // 3. Globulins or IgG times ULN
            const proteinTitle = (currentAihProteinType === 'globulin') ? 'Serum Globulin' : 'Serum IgG';
            if (iggLevel === '>2.0') {
                score += 3;
                pointBreakdown.push({ param: `${proteinTitle} / ULN`, val: '> 2.0 × ULN', pts: '+3' });
            } else if (iggLevel === '1.5-2.0') {
                score += 2;
                pointBreakdown.push({ param: `${proteinTitle} / ULN`, val: '1.5 - 2.0 × ULN', pts: '+2' });
            } else if (iggLevel === '1.0-1.5') {
                score += 1;
                pointBreakdown.push({ param: `${proteinTitle} / ULN`, val: '1.0 - 1.5 × ULN', pts: '+1' });
            } else {
                pointBreakdown.push({ param: `${proteinTitle} / ULN`, val: '< 1.0 × ULN (Normal)', pts: '0' });
            }

            // 4. Main Autoantibodies (ANA, SMA, LKM-1)
            if (mainAb === '>1:80') {
                score += 3;
                pointBreakdown.push({ param: 'Titer ANA / SMA / LKM-1', val: '> 1:80', pts: '+3' });
            } else if (mainAb === '1:80') {
                score += 2;
                pointBreakdown.push({ param: 'Titer ANA / SMA / LKM-1', val: '1:80', pts: '+2' });
            } else if (mainAb === '1:40') {
                score += 1;
                pointBreakdown.push({ param: 'Titer ANA / SMA / LKM-1', val: '1:40', pts: '+1' });
            } else {
                pointBreakdown.push({ param: 'Titer ANA / SMA / LKM-1', val: '< 1:40 / Seronegatif', pts: '0' });
            }

            // 5. AMA
            if (ama === 'pos') {
                score -= 4;
                pointBreakdown.push({ param: 'Anti-Mitochondrial Ab (AMA)', val: 'Positif', pts: '-4' });
            } else {
                pointBreakdown.push({ param: 'Anti-Mitochondrial Ab (AMA)', val: 'Negatif', pts: '0' });
            }

            // 6. Hepatitis Viral Markers
            if (viralMarkers === 'neg') {
                score += 3;
                pointBreakdown.push({ param: 'Penanda Virus Hepatitis', val: 'Negatif (Non-reaktif)', pts: '+3' });
            } else {
                score -= 3;
                pointBreakdown.push({ param: 'Penanda Virus Hepatitis', val: 'Positif (Reaktif)', pts: '-3' });
            }

            // 7. Hepatotoxic drugs
            if (drugs === 'no') {
                score += 1;
                pointBreakdown.push({ param: 'Riwayat Obat Hepatotoksik', val: 'Tidak Ada', pts: '+1' });
            } else {
                score -= 4;
                pointBreakdown.push({ param: 'Riwayat Obat Hepatotoksik', val: 'Ada Riwayat Obat', pts: '-4' });
            }

            // 8. Alcohol
            if (alcohol === '<25') {
                score += 2;
                pointBreakdown.push({ param: 'Konsumsi Alkohol', val: '< 25 g/hari (Minimal)', pts: '+2' });
            } else if (alcohol === '>60') {
                score -= 2;
                pointBreakdown.push({ param: 'Konsumsi Alkohol', val: '> 60 g/hari (Berat)', pts: '-2' });
            } else {
                pointBreakdown.push({ param: 'Konsumsi Alkohol', val: '25 - 60 g/hari (Sedang)', pts: '0' });
            }

            // 9. Liver Histology
            if (biopsyDone) {
                let histPts = 0;
                let anyClassic = false;
                const histDetails = [];

                if (histInterface) {
                    histPts += 3;
                    anyClassic = true;
                    histDetails.push('Interface hepatitis (+3)');
                }
                if (histLympho) {
                    histPts += 1;
                    anyClassic = true;
                    histDetails.push('Infiltrat limfoplasmamositik (+1)');
                }
                if (histRosettes) {
                    histPts += 1;
                    anyClassic = true;
                    histDetails.push('Rosetting sel hepar (+1)');
                }

                if (!anyClassic) {
                    histPts -= 5;
                    histDetails.push('Tanpa 3 tanda khas AIH (-5)');
                }

                if (histBiliary) {
                    histPts -= 3;
                    histDetails.push('Perubahan duktus bilier (-3)');
                }
                if (histOther) {
                    histPts -= 3;
                    histDetails.push('Temuan etiologi lain (-3)');
                }

                score += histPts;
                pointBreakdown.push({
                    param: 'Histopatologi Hepar',
                    val: histDetails.join(', '),
                    pts: (histPts > 0 ? `+${histPts}` : `${histPts}`)
                });
            } else {
                pointBreakdown.push({ param: 'Histopatologi Hepar', val: 'Biopsi belum dilakukan / pending', pts: '0' });
            }

            // 10. Other autoimmune diseases
            if (otherAutoimmune === 'yes') {
                score += 2;
                pointBreakdown.push({ param: 'Penyakit Autoimun Lain', val: 'Ada pada pasien/keluarga tingkat-1', pts: '+2' });
            } else {
                pointBreakdown.push({ param: 'Penyakit Autoimun Lain', val: 'Tidak ada', pts: '0' });
            }

            // 11. Optional Parameters
            if (otherAbs) {
                score += 2;
                pointBreakdown.push({ param: 'Autoantibodi Spesifik Lain (SLA/LP/LC1/pANCA)', val: 'Seropositif', pts: '+2' });
            }
            if (hlaDr) {
                score += 1;
                pointBreakdown.push({ param: 'Genotipe HLA-DR3 / HLA-DR4', val: 'Positif', pts: '+1' });
            }

            // 12. Response to Therapy
            const isPostTx = (therapyResponse === 'complete' || therapyResponse === 'relapse');
            if (therapyResponse === 'complete') {
                score += 2;
                pointBreakdown.push({ param: 'Respon Terapi Imunosupresif', val: 'Respon Lengkap (Complete Remission)', pts: '+2' });
            } else if (therapyResponse === 'relapse') {
                score += 3;
                pointBreakdown.push({ param: 'Respon Terapi Imunosupresif', val: 'Relaps Pasca Penghentian/Tapering', pts: '+3' });
            } else {
                pointBreakdown.push({ param: 'Fase Evaluasi', val: 'Pre-Treatment (Belum Diterapi)', pts: '0' });
            }

            // Interpretation Logic
            let category = '';
            let color = 'emerald';
            let clinicalSummary = '';
            let rxAdvice = '';
            let phaseText = isPostTx ? 'Post-Treatment (Pasca Terapi)' : 'Pre-Treatment (Sebelum Terapi)';

            if (!isPostTx) {
                if (score > 15) {
                    category = 'Definite AIH (Pasti AIH)';
                    color = 'emerald';
                    clinicalSummary = 'Skor >15 pada evaluasi sebelum terapi mengonfirmasi kriteria diagnosis pasti (Definite Autoimmune Hepatitis).';
                    rxAdvice = 'Indikasi kuat untuk inisiasi imunosupresi standar (Prednison/Prednisolon ± Azathioprine). Budesonid oral dapat dipertimbangkan pada pasien non-sirotik tanpa hipertensi portal. Lakukan pemantauan enzim hepar (ALT/AST) dan kadar IgG serial secara berkala.';
                } else if (score >= 10) {
                    category = 'Probable AIH (Kemungkinan AIH)';
                    color = 'amber';
                    clinicalSummary = 'Skor 10 - 15 pada evaluasi sebelum terapi menunjukkan kemungkinan besar Autoimmune Hepatitis (Probable AIH).';
                    rxAdvice = 'Diagnosis probable memerlukan pertimbangan klinis cermat. Jika biopsi hati belum dilakukan, sangat direkomendasikan untuk konfirmasi histopatologis. Pertimbangkan skrining panel autoantibodi sekunder (anti-SLA, anti-LC1, pANCA) dan genotipe HLA-DR. Uji coba terapi (trial of corticosteroids) dapat dipertimbangkan setelah menyingkirkan infeksi aktif dan lesi obstruktif/DILI.';
                } else {
                    category = 'Unlikely AIH (Diagnosis AIH Tidak Terbukti)';
                    color = 'rose';
                    clinicalSummary = 'Skor <10 menunjukkan bukti klinis dan serologis tidak mencukupi untuk diagnosis Autoimmune Hepatitis.';
                    rxAdvice = 'Telusuri etiologi alternatif penyakit hati kronis/akut: viral hepatitis terselubung, drug-induced liver injury (DILI), sindrom metabolik (MASLD/MASH), penyakit kolestatik (PBC atau PSC), hemokromatosis, penyakit Wilson, atau defisiensi alfa-1-antitripsin.';
                }
            } else {
                if (score > 17) {
                    category = 'Definite AIH (Pasti AIH) — Post-Treatment';
                    color = 'emerald';
                    clinicalSummary = 'Skor >17 pasca terapi mengonfirmasi secara definitif diagnosis Autoimmune Hepatitis didukung respon terapi positif atau timbulnya relaps.';
                    rxAdvice = 'Pertahankan terapi pemeliharaan (maintenance) imunosupresif jangka panjang (mis. Azathioprine dosis optimal atau monoterapi steroid dosis terendah). Evaluasi remisi histologis sebelum mempertimbangkan withdrawal terapi di masa mendatang.';
                } else if (score >= 12) {
                    category = 'Probable AIH (Kemungkinan AIH) — Post-Treatment';
                    color = 'amber';
                    clinicalSummary = 'Skor 12 - 17 pasca terapi menunjukkan diagnosis probable AIH dengan respon atau perubahan terapi.';
                    rxAdvice = 'Lanjutkan pemantauan respons biokimiawi ketat. Bila respons suboptimal, evaluasi kemungkinan non-adherence, varian overlap syndrome (AIH-PBC atau AIH-PSC), atau resistensi terapi yang memerlukan imunosupresan lini kedua (mis. Mycophenolate Mofetil / MMF, Tacrolimus).';
                } else {
                    category = 'Unlikely AIH (Diagnosis AIH Tidak Terbukti) — Post-Treatment';
                    color = 'rose';
                    clinicalSummary = 'Skor <12 pasca terapi menunjukkan kriteria AIH tidak terpenuhi meskipun telah mendapat intervensi terapi.';
                    rxAdvice = 'Pertimbangkan diagnosis alternatif non-autoimun atau hentikan imunosupresi dengan tapering yang hati-hati jika tidak ada respons perbaikan objektif.';
                }
            }

            const resumeLines = [
                `======================================================================`,
                `[adjusterGEH] REVISED ORIGINAL SCORE FOR AUTOIMMUNE HEPATITIS (AIH)`,
                `International Autoimmune Hepatitis Group (IAHG / Alvarez et al., 1999)`,
                `======================================================================`,
                `FASE EVALUASI      : ${phaseText}`,
                `TOTAL SKOR AIH     : ${score} poin`,
                `KATEGORI DIAGNOSIS : ${category.toUpperCase()}`,
                `----------------------------------------------------------------------`,
                `RINCIAN SKORING PARAMETER:`,
                ...pointBreakdown.map(b => `• ${b.param.padEnd(30, ' ')} : ${b.val} [${b.pts} poin]`),
                `----------------------------------------------------------------------`,
                `INTERPRETASI KLINIS:`,
                clinicalSummary,
                ``,
                `REKOMENDASI TATALAKSANA (AASLD/EASL):`,
                rxAdvice,
                `======================================================================`
            ];
            const resumeText = resumeLines.join('\n');
            window.lastAihResume = resumeText;

            const res = document.getElementById('aih-result-container');
            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${color}-900/30 border border-${color}-500/50 shadow-xl space-y-4">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-${color}-500/30 pb-3">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${color}-500/20 text-${color}-300 border border-${color}-500/40">
                                ${phaseText}
                            </span>
                            <h3 class="text-xl sm:text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
                                <span>${category}</span>
                            </h3>
                            <p class="text-xs text-slate-300 mt-1">${clinicalSummary}</p>
                        </div>
                        <div class="text-left sm:text-right shrink-0">
                            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Skor Total AIH</span>
                            <span class="text-3xl sm:text-4xl font-black text-white font-mono">${score}</span>
                            <span class="text-xs text-slate-400 block">poin</span>
                        </div>
                    </div>

                    <!-- Cutoff Criteria Guide -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <div>
                            <span class="font-bold text-slate-300 block mb-1">Ambang Pre-Treatment:</span>
                            <span class="${!isPostTx && score > 15 ? 'text-emerald-400 font-bold' : 'text-slate-400'}">• &gt; 15 : Definite AIH</span><br>
                            <span class="${!isPostTx && score >= 10 && score <= 15 ? 'text-amber-400 font-bold' : 'text-slate-400'}">• 10 - 15 : Probable AIH</span><br>
                            <span class="${!isPostTx && score < 10 ? 'text-rose-400 font-bold' : 'text-slate-400'}">• &lt; 10 : Unlikely AIH</span>
                        </div>
                        <div>
                            <span class="font-bold text-slate-300 block mb-1">Ambang Post-Treatment:</span>
                            <span class="${isPostTx && score > 17 ? 'text-emerald-400 font-bold' : 'text-slate-400'}">• &gt; 17 : Definite AIH</span><br>
                            <span class="${isPostTx && score >= 12 && score <= 17 ? 'text-amber-400 font-bold' : 'text-slate-400'}">• 12 - 17 : Probable AIH</span><br>
                            <span class="${isPostTx && score < 12 ? 'text-rose-400 font-bold' : 'text-slate-400'}">• &lt; 12 : Unlikely AIH</span>
                        </div>
                    </div>

                    <!-- Breakdown Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr class="border-b border-slate-700/80 text-slate-400">
                                    <th class="py-2 px-3 font-semibold">Parameter Evaluasi</th>
                                    <th class="py-2 px-3 font-semibold">Temuan Pasien</th>
                                    <th class="py-2 px-3 font-semibold text-right">Poin</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 text-slate-200">
                                ${pointBreakdown.map(b => `
                                    <tr>
                                        <td class="py-1.5 px-3 text-slate-300 font-medium">${b.param}</td>
                                        <td class="py-1.5 px-3 text-slate-400">${b.val}</td>
                                        <td class="py-1.5 px-3 font-mono font-bold text-right ${b.pts.startsWith('+') ? 'text-emerald-400' : (b.pts.startsWith('-') ? 'text-rose-400' : 'text-slate-400')}">${b.pts}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Clinical Recommendation -->
                    <div class="p-3.5 rounded-xl bg-${color}-950/40 border border-${color}-500/30 text-xs">
                        <h4 class="font-bold text-white mb-1.5 flex items-center">
                            <i class="fa-solid fa-notes-medical mr-1.5 text-${color}-400"></i> Rekomendasi Tatalaksana Klinis (AASLD / EASL)
                        </h4>
                        <p class="text-slate-200 leading-relaxed">${rxAdvice}</p>
                    </div>

                    <!-- Copy Button -->
                    <div class="flex items-center justify-between pt-2 border-t border-${color}-500/20 flex-wrap gap-2">
                        <span class="text-[11px] text-slate-400">
                            <i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> Format resume siap disalin ke Rekam Medis (EMR)
                        </span>
                        <button type="button" onclick="copyAihResume()" class="glass-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume AIH
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
            res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        
        function copyAihResume() {
            if (window.lastAihResume) {
                copyToClipboard(window.lastAihResume, 'Resume Skor AIH berhasil disalin ke clipboard!');
            } else {
                showToast('Belum ada hasil kalkulasi untuk disalin.');
            }
        }

        function resetAihScore() {
            const form = document.getElementById('aih-form');
            if (form) form.reset();
            switchAihProteinType('globulin');
            const res = document.getElementById('aih-result-container');
            if (res) {
                res.innerHTML = '';
                res.classList.add('hidden');
            }
            const labHint = document.getElementById('aih-lab-calc-hint');
            if (labHint) labHint.innerText = '';
            toggleAihBiopsySection();
            checkAihSeronegativeRule();
            showToast('Form skor AIH berhasil di-reset!');
        }

        // Universal Module Reset
        function resetGehModule(formId, resId) {
            const f = document.getElementById(formId);
            if (f) f.reset();
            const r = document.getElementById(resId);
            if (r) {
                r.innerHTML = '';
                r.classList.add('hidden');
            }
            if (formId === 'aih-form') {
                resetAihScore();
                return;
            } else if (formId === 'gbs-form') {
                if (typeof setGbsBunUnit === 'function') setGbsBunUnit('mmol');
            } else if (formId === 'tg18-form') {
                if (typeof switchTg18Type === 'function') switchTg18Type('chole');
            } else if (formId === 'ranson-form') {
                if (typeof switchRansonType === 'function') switchRansonType('nongall');
            }
            if (typeof showToast === 'function') {
                showToast('Parameter kalkulator direset ke default.');
            }
        }

        function resetMaddrey() {
            const ptn = document.getElementById('maddrey-pt-ptn');
            const ctrl = document.getElementById('maddrey-pt-ctrl');
            const bili = document.getElementById('maddrey-bili');
            if (ptn) ptn.value = '';
            if (ctrl) ctrl.value = '';
            if (bili) bili.value = '';
            const heRadio = document.querySelector('input[name="maddrey-he"][value="no"]');
            if (heRadio) heRadio.checked = true;
            if (typeof setMaddreyBiliUnit === 'function') setMaddreyBiliUnit('mg');
            const res = document.getElementById('maddrey-result-container');
            if (res) {
                res.innerHTML = '';
                res.classList.add('hidden');
            }
            if (typeof showToast === 'function') {
                showToast('Parameter Maddrey direset ke default.');
            }
        }

        function resetLille() {
            ['lille-age', 'lille-alb', 'lille-cr', 'lille-bili0', 'lille-bili7', 'lille-pt'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            const res = document.getElementById('lille-result-container');
            if (res) {
                res.innerHTML = '';
                res.classList.add('hidden');
            }
            if (typeof showToast === 'function') {
                showToast('Parameter Lille direset ke default.');
            }
        }

        function resetForrest() {
            document.querySelectorAll('.forrest-card').forEach(c => {
                c.classList.remove('border-cyan-400', 'bg-cyan-950/30');
            });
            const box = document.getElementById('forrest-detail-box');
            if (box) box.innerHTML = '';
            if (typeof showToast === 'function') {
                showToast('Pilihan klasifikasi Forrest direset.');
            }
        }

        function resetLAGrade() {
            document.querySelectorAll('.la-card').forEach(c => {
                c.classList.remove('border-cyan-400', 'bg-cyan-950/30');
            });
            const box = document.getElementById('la-detail-box');
            if (box) box.innerHTML = '';
            if (typeof showToast === 'function') {
                showToast('Pilihan klasifikasi LA direset.');
            }
        }

        function resetAntithrombotic() {
            const bleed = document.getElementById('at-bleed-status');
            const drug = document.getElementById('at-drug');
            if (bleed) bleed.value = 'active';
            if (drug) drug.value = 'aspirin-sec';
            if (typeof updateAntithromboticAdvice === 'function') {
                updateAntithromboticAdvice();
            }
            if (typeof showToast === 'function') {
                showToast('Pilihan antitrombotik direset ke default.');
            }
        }

        function resetLftProfile() {
            document.getElementById('lft-profile-form').reset();
            const res = document.getElementById('lft-profile-result-container');
            res.innerHTML = '';
            res.classList.add('hidden');
            if (typeof showToast === 'function') {
                showToast('Parameter kalkulator direset ke default.');
            }
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
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-sm">Mohon isi setidaknya salah satu parameter laboratorium (Bilirubin, Enzim Hati, atau Protein Serum).</div>`;
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
                            biliAdvice = `Fraksi Direk ${directPct.toFixed(1)}% menandakan defek ekskresi kanalikular atau obstruksi bilier ekstra/intra-hepatik (Kolelitiasis, striktur, kolangitis, keganasan kaput pankreas, atau kolestasis obat).`;
                        } else if (directPct >= 20) {
                            biliCategory = 'Hiperbilirubinemia Campuran / Hepatoseluler (20 - 50%)';
                            biliColor = 'amber';
                            biliAdvice = `Fraksi Direk ${directPct.toFixed(1)}% menandakan kombinasi cedera integritas membran hepatosit dan ekskresi kanalikuli (Hepatitis virus akut, sirosis hepar dekompensata, atau toksisitas obat).`;
                        } else {
                            biliCategory = 'Hiperbilirubinemia Tak Terkonjugasi / Indirek (< 20%)';
                            biliColor = 'amber';
                            biliAdvice = `Fraksi Direk ${directPct.toFixed(1)}% menandakan dominasi indirek: pertimbangkan hemolisis berlebih, sindrom Gilbert (defisiensi glukuronil transferase), atau hematoma masif.`;
                        }
                    } else {
                        biliCategory = 'Hiperbilirubinemia Total Meningkat';
                        biliColor = 'amber';
                        biliAdvice = 'Kadar bilirubin total di atas normal RS (> 1.2 mg/dL). Lengkapi data bilirubin direk untuk menentukan fraksi.';
                    }
                }

                resumeParts.push(`Fraksi Bilirubin: Tot ${bTotStr}, Dir ${bDirStr}, Indir ${bIndirStr} mg/dL (${biliCategory})`);

                cardsHtml += `
                    <div class="p-4 rounded-xl bg-${biliColor}-950/20 border border-${biliColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-${biliColor}-400 uppercase tracking-wider">Fraksi Bilirubin Serum</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-${biliColor}-500/20 text-${biliColor}-300">${biliCategory}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Total (RS: 0.3-1.2)</span>
                                <span class="text-sm font-bold ${!isNaN(totBili) && totBili > REF.biliTot.max ? 'text-amber-400' : 'text-white'}">${bTotStr}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Direk (RS: 0.0-0.5)</span>
                                <span class="text-sm font-bold ${!isNaN(dirBili) && dirBili > REF.biliDir.max ? 'text-rose-400' : 'text-white'}">${bDirStr}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Indirek (RS: 0.2-0.7)</span>
                                <span class="text-sm font-bold ${!isNaN(indirBili) && indirBili > REF.biliIndir.max ? 'text-amber-400' : 'text-white'}">${bIndirStr}</span>
                            </div>
                        </div>
                        ${directPct !== null ? `<div class="text-[11px] text-cyan-300 font-semibold mb-1">Rasio Bilirubin Direk / Total: ${directPct.toFixed(1)}%</div>` : ''}
                        <p class="text-xs text-slate-300 leading-relaxed">${biliAdvice}</p>
                    </div>
                `;
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
                        enzymeAdvice = `Rasio AST/ALT ${deRitis} (> 2.0): Sangat spesifik untuk Alcoholic Liver Disease, iskemia miokard, atau sirosis dekompensata.`;
                    } else if (deRitis >= 1.0) {
                        enzymeColor = 'amber';
                        enzymeAdvice = `Rasio AST/ALT ${deRitis} (≥ 1.0): Waspadai progresi ke arah fibrosis lanjut / sirosis hepatis pada MASLD atau hepatitis kronik.`;
                    } else {
                        enzymeColor = 'amber';
                        enzymeAdvice = `Rasio AST/ALT ${deRitis} (< 1.0, ALT dominan): Pola khas MASLD/NAFLD atau hepatitis virus fase aktif.`;
                    }
                } else if (!isNaN(ast) || !isNaN(alt)) {
                    enzymeAdvice = 'Salah satu transaminase terisi. Lengkapi keduanya untuk kalkulasi otomatis Rasio De Ritis.';
                }

                resumeParts.push(`Transaminase: AST ${!isNaN(ast) ? ast : '-'} (${astUlnRatio}x ULN), ALT ${!isNaN(alt) ? alt : '-'} (${altUlnRatio}x ULN), De Ritis: ${deRitisStr}`);

                cardsHtml += `
                    <div class="p-4 rounded-xl bg-${enzymeColor}-950/20 border border-${enzymeColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-${enzymeColor}-400 uppercase tracking-wider">Enzim Hepatoseluler &amp; De Ritis</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">ULN: AST 34 | ALT 55</span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">AST (RS: &lt;34)</span>
                                <span class="text-sm font-bold ${!isNaN(ast) && ast > REF.ast.max ? 'text-rose-400' : 'text-white'}">${!isNaN(ast) ? ast + ' U/L' : '-'}</span>
                                <span class="text-[9px] text-slate-500 block">${astUlnRatio !== '-' ? astUlnRatio + 'x ULN' : ''}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">ALT (RS: &lt;55)</span>
                                <span class="text-sm font-bold ${!isNaN(alt) && alt > REF.alt.max ? 'text-rose-400' : 'text-white'}">${!isNaN(alt) ? alt + ' U/L' : '-'}</span>
                                <span class="text-[9px] text-slate-500 block">${altUlnRatio !== '-' ? altUlnRatio + 'x ULN' : ''}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Rasio AST/ALT</span>
                                <span class="text-sm font-bold text-cyan-300">${deRitisStr}</span>
                                <span class="text-[9px] text-slate-500 block">De Ritis</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${enzymeAdvice}</p>
                    </div>
                `;
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

                resumeParts.push(`Kolestasis: ALP ${!isNaN(alp) ? alp : '-'} U/L (RS: 40-150), GGT ${!isNaN(ggt) ? ggt : '-'} U/L (RS: <33)`);

                cardsHtml += `
                    <div class="p-4 rounded-xl bg-${cholColor}-950/20 border border-${cholColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-${cholColor}-400 uppercase tracking-wider">Marker Kolestasis &amp; Saluran Empedu</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">ULN: ALP 150 | GGT 33</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">ALP (RS: 40 - 150 U/L)</span>
                                <span class="text-sm font-bold ${isAlpHigh ? 'text-rose-400' : 'text-white'}">${!isNaN(alp) ? alp + ' U/L' : '-'}</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[10px]">Gamma GT (RS: &lt; 33 U/L)</span>
                                <span class="text-sm font-bold ${isGgtHigh ? 'text-rose-400' : 'text-white'}">${!isNaN(ggt) ? ggt + ' U/L' : '-'}</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${cholAdvice}</p>
                    </div>
                `;
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
                        protAdvice = `Rasio A/G terbalik (${agRatio} < 1.0) menunjukkan penurunan kapasitas sintesis albumin dan/atau peningkatan globulin (hipergamaglobulinemia poliklonal). Karakteristik khas sirosis hepatis lanjut, hepatitis autoimun, penyakit kolagen vaskular, atau multipel mieloma.`;
                    } else if (agRatio < 1.2) {
                        protColor = 'amber';
                        protAdvice = `Rasio A/G borderline rendah (${agRatio}). Periksa kecukupan nutrisi dan evaluasi kehilangan albumin (asites, proteinuria).`;
                    } else {
                        protAdvice = `Rasio Albumin/Globulin (${agRatio}) normal (rentang fisiologis ~1.1 - 2.5).`;
                    }
                }

                resumeParts.push(`Profil Protein: Tot ${pTotStr}, Alb ${pAlbStr}, Glob ${pGlobStr} g/dL, Rasio A/G: ${agRatioStr}`);

                cardsHtml += `
                    <div class="p-4 rounded-xl bg-${protColor}-950/20 border border-${protColor}-500/40">
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-bold text-${protColor}-400 uppercase tracking-wider">Profil Protein Serum &amp; Rasio A/G</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">Rujukan RS</span>
                        </div>
                        <div class="grid grid-cols-4 gap-2 my-2 text-center text-xs">
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Protein Total</span>
                                <span class="text-xs sm:text-sm font-bold text-white">${pTotStr}</span>
                                <span class="text-[8px] text-slate-500 block">6.4-8.3</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Albumin</span>
                                <span class="text-xs sm:text-sm font-bold ${!isNaN(alb) && alb < REF.alb.min ? 'text-rose-400' : 'text-white'}">${pAlbStr}</span>
                                <span class="text-[8px] text-slate-500 block">3.4-4.8</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Globulin</span>
                                <span class="text-xs sm:text-sm font-bold ${!isNaN(glob) && glob > REF.glob.max ? 'text-amber-400' : 'text-white'}">${pGlobStr}</span>
                                <span class="text-[8px] text-slate-500 block">2.2-3.7</span>
                            </div>
                            <div class="p-2 rounded bg-slate-900/60 border border-slate-700/60">
                                <span class="text-slate-400 block text-[9px]">Rasio A/G</span>
                                <span class="text-xs sm:text-sm font-bold text-cyan-300">${agRatioStr}</span>
                                <span class="text-[8px] text-slate-500 block">&ge; 1.0</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${protAdvice}</p>
                    </div>
                `;
            }

            const resumeText = `[adjusterGEH CDSS] Profil Faal Hati & Protein RS:\n${resumeParts.join('\n')}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-xl space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                Hasil Interpretasi Terkalibrasi RS
                            </span>
                            <h3 class="text-lg font-bold text-white mt-1">Evaluasi Komprehensif LFT &amp; Protein</h3>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center shrink-0">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume LFT
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${cardsHtml}
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }



        // ==========================================
        // 3. PANCREATOBILIARY & INFECTION LOGIC
        // ==========================================

        function switchTg18Type(type) {
            currentTg18Type = type;
            const btnChole = document.getElementById('tg18-type-chole');
            const btnCholang = document.getElementById('tg18-type-cholang');
            const secChole = document.getElementById('tg18-chole-fields');
            const secCholang = document.getElementById('tg18-cholang-fields');

            if (type === 'chole') {
                btnChole.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
                btnCholang.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';
                secChole.classList.remove('hidden');
                secCholang.classList.add('hidden');
            } else {
                btnCholang.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
                btnChole.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';
                secCholang.classList.remove('hidden');
                secChole.classList.add('hidden');
            }
        }

        function calculateTG18() {
            const res = document.getElementById('tg18-result-container');

            if (currentTg18Type === 'chole') {
                const local = document.getElementById('tg-chole-murphy').checked || document.getElementById('tg-chole-ruq').checked;
                const systemic = document.getElementById('tg-chole-fever').checked || document.getElementById('tg-chole-crp').checked;
                const imaging = document.getElementById('tg-chole-imaging').checked;
                const organ = document.getElementById('tg-chole-organ').checked;
                const mod = document.getElementById('tg-chole-mod').checked;

                const isDxDefinite = (local && systemic && imaging);
                const isDxSuspected = (local && systemic) || (local && imaging);

                let grade = '';
                let colorClass = 'emerald';
                let advice = '';

                if (!isDxDefinite && !isDxSuspected) {
                    res.innerHTML = `<div class="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm">Kriteria TG18 Kolesistitis Akut belum terpenuhi.</div>`;
                    res.classList.remove('hidden');
                    return;
                }

                if (organ) {
                    grade = 'TG18 Grade III (Severe Acute Cholecystitis)';
                    colorClass = 'rose';
                    advice = 'Disertai disfungsi organ. Resusitasi organ intensif, antibiotik broad-spectrum, dan drainase kandung empedu darurat (PTGBD).';
                } else if (mod) {
                    grade = 'TG18 Grade II (Moderate Acute Cholecystitis)';
                    colorClass = 'amber';
                    advice = 'Inflamasi lokal berat / leukositosis tinggi. Antibiotik IV, kolesistektomi dini (&lt; 72 jam), atau drainase bilier.';
                } else {
                    grade = 'TG18 Grade I (Mild Acute Cholecystitis)';
                    colorClass = 'emerald';
                    advice = 'Tanpa disfungsi organ. Kolesistektomi laparoskopik dini aman dan direkomendasikan dalam 72-96 jam.';
                }

                const resumeText = `[adjusterGEH CDSS] TG18 Kolesistitis: ${grade}\nDiagnosis: ${isDxDefinite ? 'Definite' : 'Suspected'}.\nRekomendasi: ${advice}`;

                res.innerHTML = `
                    <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                        <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${grade}</span>
                        <h3 class="text-lg font-bold text-white mt-1">Status: ${isDxDefinite ? 'Definite Diagnosis' : 'Suspected Diagnosis'}</h3>
                        <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                        <div class="mt-3">
                            <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                                <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume TG18
                            </button>
                        </div>
                    </div>
                `;
            } else {
                const fever = document.getElementById('tg-chol-fever').checked;
                const jaundice = document.getElementById('tg-chol-jaundice').checked;
                const ruq = document.getElementById('tg-chol-ruq').checked;
                const imaging = document.getElementById('tg-chol-imaging').checked;
                const organ = document.getElementById('tg-chol-organ').checked;

                const charcot = fever && jaundice && ruq;
                let grade = '';
                let colorClass = 'emerald';
                let advice = '';

                if (organ) {
                    grade = 'TG18 Grade III (Severe Acute Cholangitis)';
                    colorClass = 'rose';
                    advice = 'Gawat darurat! Dekompresi drainase bilier DARURAT (ERCP emergensi / PTBD), antibiotik broad-spectrum, dan ICU.';
                } else if (fever && jaundice) {
                    grade = 'TG18 Grade II (Moderate Acute Cholangitis)';
                    colorClass = 'amber';
                    advice = 'Indikasi drainase bilier dini (ERCP dalam 24-48 jam) dan antibiotik intravena.';
                } else {
                    grade = 'TG18 Grade I (Mild Acute Cholangitis)';
                    colorClass = 'emerald';
                    advice = 'Respon awal antibiotik IV; drainase bilier elektif terencana.';
                }

                const resumeText = `[adjusterGEH CDSS] TG18 Kolangitis: ${grade}\nTrias Charcot: ${charcot ? 'Lengkap' : 'Inkomplit'}.\nRekomendasi: ${advice}`;

                res.innerHTML = `
                    <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                        <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${grade}</span>
                        <h3 class="text-lg font-bold text-white mt-1">Trias Charcot: ${charcot ? 'Lengkap (Fever + Jaundice + RUQ pain)' : 'Sebagian'}</h3>
                        <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                        <div class="mt-3">
                            <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                                <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Kolangitis
                            </button>
                        </div>
                    </div>
                `;
            }
            res.classList.remove('hidden');
        }

        function calculateAtlanta() {
            let dxCount = 0;
            if (document.getElementById('atl-pain').checked) dxCount++;
            if (document.getElementById('atl-enz').checked) dxCount++;
            if (document.getElementById('atl-img').checked) dxCount++;

            const local = document.getElementById('atl-local').checked;
            const ofState = document.querySelector('input[name="atl-of"]:checked').value;
            const res = document.getElementById('atlanta-result-container');

            if (dxCount < 2) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-amber-900/30 border border-amber-500/50 text-amber-200 text-sm">Diagnosis pankreatitis akut belum pasti (memerlukan minimal 2 dari 3 kriteria).</div>`;
                res.classList.remove('hidden');
                return;
            }

            let severity = '';
            let colorClass = 'emerald';
            let advice = '';

            if (ofState === 'persistent') {
                severity = 'Severe Acute Pancreatitis (Berat)';
                colorClass = 'rose';
                advice = 'Gagal organ persisten (&gt;48 jam). Wajib rawat ICU/HCU, resusitasi cairan kristaloid terarah, nutrisi enteral dini via nasojejunal.';
            } else if (ofState === 'transient' || local) {
                severity = 'Moderately Severe Acute Pancreatitis (Sedang)';
                colorClass = 'amber';
                advice = 'Gagal organ transien (&lt;48 jam) atau disertai komplikasi lokal peripankreas. Pantau di ruang rawat intermediate/HCU.';
            } else {
                severity = 'Mild Acute Pancreatitis (Ringan)';
                colorClass = 'emerald';
                advice = 'Tanpa gagal organ dan tanpa komplikasi lokal. Pasien biasanya pulih dalam 3-5 hari dengan hidrasi intravena dan analgesik.';
            }

            const resumeText = `[adjusterGEH CDSS] Revised Atlanta 2012: ${severity}\nKriteria Diagnosis: ${dxCount}/3 Terpenuhi.\nOrgan Failure: ${ofState}, Komplikasi Lokal: ${local}.\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${severity}</span>
                    <h3 class="text-lg font-bold text-white mt-1">Diagnosis Positif (Kriteria Atlanta ${dxCount}/3)</h3>
                    <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                    <div class="mt-3">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Atlanta
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateCdiff() {
            const wbc = parseFloat(document.getElementById('cdiff-wbc').value);
            const cr = parseFloat(document.getElementById('cdiff-cr').value);
            const fulminant = document.getElementById('cdiff-fulminant').checked;
            const res = document.getElementById('cdiff-result-container');

            if (isNaN(wbc) || isNaN(cr)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon isi nilai Leukosit dan Kreatinin.</div>`;
                res.classList.remove('hidden');
                return;
            }

            let severity = '';
            let colorClass = 'emerald';
            let rx = '';

            if (fulminant) {
                severity = 'Fulminant Clostridioides difficile Colitis';
                colorClass = 'rose';
                rx = 'Regimen: Vancomycin oral 500 mg 4x/hari DITAMBAH Metronidazole 500 mg IV q8h. Konsul bedah cito untuk kolektomi subtotal.';
            } else if (wbc > 15000 || cr > 1.5) {
                severity = 'Severe C. difficile Infection (CDI Berat)';
                colorClass = 'amber';
                rx = 'Pilihan Lini Pertama (ACG 2021): Vancomycin oral 125 mg 4x/hari 10 hari ATAU Fidaxomicin 200 mg 2x/hari 10 hari.';
            } else {
                severity = 'Non-Severe C. difficile Infection (CDI Ringan-Sedang)';
                colorClass = 'emerald';
                rx = 'Pilihan Lini Pertama: Fidaxomicin 200 mg 2x/hari 10 hari ATAU Vancomycin oral 125 mg 4x/hari 10 hari.';
            }

            const resumeText = `[adjusterGEH CDSS] ACG 2021 C. diff: ${severity}\nWBC: ${wbc}/µL, Serum Cr: ${cr} mg/dL, Fulminan: ${fulminant}.\nRegimen: ${rx}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${severity}</span>
                    <h3 class="text-base sm:text-lg font-bold text-white mt-1">Rekomendasi Terapi Antibiotik (ACG 2021)</h3>
                    <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">${rx}</p>
                    <div class="mt-3">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume C. diff
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 3.4 BISAP Score Logic ---
        function calculateBisap() {
            let score = 0;
            const b = document.getElementById('bisap-b').checked;
            const i = document.getElementById('bisap-i').checked;
            const s = document.getElementById('bisap-s').checked;
            const a = document.getElementById('bisap-a').checked;
            const p = document.getElementById('bisap-p').checked;
            const res = document.getElementById('bisap-result-container');

            if (b) score++;
            if (i) score++;
            if (s) score++;
            if (a) score++;
            if (p) score++;

            let mortRate = '';
            let riskCategory = '';
            let colorClass = 'emerald';
            let advice = '';

            if (score <= 1) {
                riskCategory = 'Low In-Hospital Mortality Risk';
                colorClass = 'emerald';
                mortRate = (score === 0) ? '< 0.2%' : '~0.4 - 0.5%';
                advice = 'Risiko mortalitas in-hospital sangat rendah. Pasien umumnya mengalami pankreatitis akut ringan tanpa kegagalan organ. Rawat di ruang rawat biasa dengan resusitasi cairan Ringer Laktat terarah, analgesia adekuat, dan nutrisi oral dini saat nyeri membaik.';
            } else if (score === 2) {
                riskCategory = 'Intermediate Risk';
                colorClass = 'amber';
                mortRate = '~1.6 - 2.0%';
                advice = 'Risiko mortalitas moderat (~2%). Pantau hemodinamik, saturasi oksigen, dan produksi urin secara ketat setiap 4-6 jam. Evaluasi serial BUN/Hematokrit dalam 24 jam untuk menilai adekuasi hidrasi intravena.';
            } else {
                riskCategory = 'High Risk of Severe Pancreatitis & Mortality';
                colorClass = 'rose';
                if (score === 3) mortRate = '~5.3 - 8.9%';
                else if (score === 4) mortRate = '~12.8 - 15.0%';
                else mortRate = '> 22.0%';
                advice = 'Skor BISAP ≥ 3 mengindikasikan risiko tinggi severe acute pancreatitis (SAP), komplikasi nekrosis pankreas, dan gagal organ persisten. Sangat dianjurkan perawatan intensif di HCU/ICU, pemantauan CVP/invasif, dan konsultasi gastroenterologis cito.';
            }

            const resumeText = `[adjusterGEH CDSS] BISAP Score: ${score}/5 (${riskCategory})\nParameter: BUN>25 (${b ? 'Ya' : 'Tidak'}), Mental Impairment (${i ? 'Ya' : 'Tidak'}), SIRS (${s ? 'Ya' : 'Tidak'}), Usia>60 (${a ? 'Ya' : 'Tidak'}), Efusi Pleura (${p ? 'Ya' : 'Tidak'}).\nPrediksi Mortalitas: ${mortRate}\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-3xl font-black shrink-0">
                                ${score}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${riskCategory} (0-5)</span>
                                <h3 class="text-lg font-bold text-white mt-1">Skor BISAP: ${score} Poin (Mortalitas: ${mortRate})</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">${advice}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume BISAP
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // --- 3.5 Ranson's Criteria Logic ---
        let currentRansonType = 'nongall';

        function switchRansonType(type) {
            currentRansonType = type;
            const btnNongall = document.getElementById('ranson-type-nongall');
            const btnGall = document.getElementById('ranson-type-gall');
            const ageLabel = document.getElementById('ranson-age-label');
            const wbcLabel = document.getElementById('ranson-wbc-label');
            const glucLabel = document.getElementById('ranson-glucose-label');
            const ldhLabel = document.getElementById('ranson-ldh-label');
            const pao2Row = document.getElementById('ranson-pao2-row');
            const bunLabel = document.getElementById('ranson-bun-label');
            const bdLabel = document.getElementById('ranson-bd-label');
            const fluidLabel = document.getElementById('ranson-fluid-label');

            if (type === 'nongall') {
                btnNongall.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
                btnGall.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';
                ageLabel.innerText = 'Usia > 55 Tahun (Non-Gallstone)';
                wbcLabel.innerText = 'Leukosit (WBC) > 16.000 /µL';
                glucLabel.innerText = 'Glukosa Darah > 200 mg/dL (> 11.1 mmol/L)';
                ldhLabel.innerText = 'Serum LDH > 350 IU/L';
                pao2Row.classList.remove('hidden');
                bunLabel.innerText = 'Peningkatan BUN > 5 mg/dL (> 1.8 mmol/L)';
                bdLabel.innerText = 'Base Deficit > 4 mEq/L (Asidosis Metabolik)';
                fluidLabel.innerText = 'Sekuestrasi Cairan Terestimasi > 6 Liter';
            } else {
                btnGall.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
                btnNongall.className = 'px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700';
                ageLabel.innerText = 'Usia > 70 Tahun (Gallstone Pancreatitis)';
                wbcLabel.innerText = 'Leukosit (WBC) > 18.000 /µL';
                glucLabel.innerText = 'Glukosa Darah > 220 mg/dL (> 12.2 mmol/L)';
                ldhLabel.innerText = 'Serum LDH > 400 IU/L';
                pao2Row.classList.add('hidden');
                bunLabel.innerText = 'Peningkatan BUN > 2 mg/dL (> 0.7 mmol/L)';
                bdLabel.innerText = 'Base Deficit > 5 mEq/L (Asidosis Metabolik)';
                fluidLabel.innerText = 'Sekuestrasi Cairan Terestimasi > 4 Liter';
            }
        }

        function calculateRanson() {
            let admissionScore = 0;
            let lateScore = 0;

            if (document.getElementById('ranson-age').checked) admissionScore++;
            if (document.getElementById('ranson-wbc').checked) admissionScore++;
            if (document.getElementById('ranson-glucose').checked) admissionScore++;
            if (document.getElementById('ranson-ldh').checked) admissionScore++;
            if (document.getElementById('ranson-ast').checked) admissionScore++;

            if (document.getElementById('ranson-ca').checked) lateScore++;
            if (document.getElementById('ranson-hct').checked) lateScore++;
            if (currentRansonType === 'nongall' && document.getElementById('ranson-pao2').checked) lateScore++;
            if (document.getElementById('ranson-bun').checked) lateScore++;
            if (document.getElementById('ranson-bd').checked) lateScore++;
            if (document.getElementById('ranson-fluid').checked) lateScore++;

            const totalScore = admissionScore + lateScore;
            const maxScore = currentRansonType === 'nongall' ? 11 : 10;
            const res = document.getElementById('ranson-result-container');

            let riskCategory = '';
            let mortalityRate = '';
            let colorClass = 'emerald';
            let advice = '';

            if (totalScore <= 2) {
                riskCategory = 'Mild Acute Pancreatitis (Ringan)';
                mortalityRate = '< 1 - 3%';
                colorClass = 'emerald';
                advice = 'Pankreatitis akut ringan dengan mortalitas minimal. Tatalaksana suportif di bangsal reguler: rehidrasi cairan terukur, kontrol nyeri, puasa singkat hingga mual/nyeri mereda, lalu nutrisi oral dini rendah lemak.';
            } else if (totalScore <= 4) {
                riskCategory = 'Moderate to Severe Acute Pancreatitis (Sedang-Berat)';
                mortalityRate = '~15%';
                colorClass = 'amber';
                advice = 'Risiko komplikasi peripankreatik dan nekrosis meningkat. Dianjurkan pemantauan ketat hemodinamik dan saturasi oksigen (pertimbangkan HCU), hidrasi agresif, dan evaluasi USG/CT abdomen dengan kontras pasca 72 jam.';
            } else if (totalScore <= 6) {
                riskCategory = 'Severe Acute Pancreatitis (Berat)';
                mortalityRate = '~40%';
                colorClass = 'rose';
                advice = 'Pankreatitis akut berat dengan risiko mortalitas tinggi (~40%). Indikasi kuat perawatan di ICU, pemantauan disfungsi multiorgan, nutrisi enteral via nasojejunal, dan konsultasi digestif/bedah.';
            } else {
                riskCategory = 'Fulminant / Very Severe Acute Pancreatitis';
                mortalityRate = '> 50 - 100%';
                colorClass = 'rose';
                advice = 'Prognosis sangat buruk dengan mortalitas mencapai 50-100%. Wajib perawatan di Unit Perawatan Intensif (ICU) dengan dukungan ventilasi mekanik, resusitasi inotropik/vasopresor, dan evaluasi komplikasi sepsis pankreatik.';
            }

            const etioName = (currentRansonType === 'nongall') ? 'Non-Gallstone (Alkoholik/Lainnya)' : 'Gallstone Pancreatitis';
            const resumeText = `[adjusterGEH CDSS] Ranson's Criteria (${etioName}):\nTotal Skor: ${totalScore}/${maxScore} (Admisi: ${admissionScore}/5, 48 Jam: ${lateScore}/${maxScore - 5})\nKlasifikasi: ${riskCategory}\nEstimasi Mortalitas: ${mortalityRate}\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-3xl font-black shrink-0">
                                ${totalScore}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${riskCategory}</span>
                                <h3 class="text-lg font-bold text-white mt-1">Skor Ranson: ${totalScore} / ${maxScore} (Mortalitas: ${mortalityRate})</h3>
                                <p class="text-xs text-cyan-300 mt-0.5">Etiologi: ${etioName} | Tahap I (0 Jam): <strong>${admissionScore}/5</strong> poin | Tahap II (48 Jam): <strong>${lateScore}/${maxScore - 5}</strong> poin</p>
                                <p class="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">${advice}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Ranson
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 4. LUMINAL & IBD LOGIC
        // ==========================================

        function calculateTruelove() {
            const stools = document.querySelector('input[name="tw-stools"]:checked')?.value;
            const bleed = document.querySelector('input[name="tw-bleed"]:checked')?.value;
            const hr = document.querySelector('input[name="tw-hr"]:checked')?.value;
            const temp = document.querySelector('input[name="tw-temp"]:checked')?.value;
            const hb = document.querySelector('input[name="tw-hb"]:checked')?.value;
            const esr = document.querySelector('input[name="tw-esr"]:checked')?.value;
            const res = document.getElementById('truelove-result-container');

            let sysCount = 0;
            if (hr === '>=90') sysCount++;
            if (temp === '>=37.5') sysCount++;
            if (hb === '<=75') sysCount++;
            if (esr === 'elevated') sysCount++;

            let grade = '';
            let colorClass = 'emerald';
            let advice = '';

            // Truelove & Witts 1955 / ACG 2019 Criteria:
            // Severe (ASUC): Stools >= 6/day WITH severe macroscopic rectal bleeding AND >= 1 systemic toxicity sign
            // Mild: Stools < 4/day AND none/trace bleeding AND 0 systemic toxicity signs
            // Moderate: Intermediate between mild and severe
            if (stools === '>=6' && bleed === 'severe' && sysCount >= 1) {
                grade = 'Severe Disease (ASUC)';
                colorClass = 'rose';
                advice = 'Kegawatdaruratan IBD! Kriteria ASUC terpenuhi (Defekasi ≥6x/hari + Darah makroskopik berat + ≥1 tanda toksisitas sistemik). Rawat inap segera, Methylprednisolone 60 mg/hari IV (atau Hidrokortison 400 mg/hari), profilaksis VTE dengan LMWH, foto polos abdomen untuk menyingkirkan megakolon toksik. Evaluasi kriteria Travis / Oxford pada hari ke-3 s/d 5 untuk indikasi terapi penyelamatan (Infliximab atau Siklosporin) vs kolektomi.';
            } else if (stools === '<4' && (bleed === 'none') && sysCount === 0) {
                grade = 'Mild Disease';
                colorClass = 'emerald';
                advice = 'Rawat jalan. Defekasi < 4 kali/hari tanpa perdarahan makroskopik nyata dan tanpa tanda sistemik. Optimalkan 5-ASA oral dosis penuh (Mesalamine ≥ 4.8 g/hari atau Sulfasalazine 4-6 g/hari) ditambah terapi topikal supositoria/enema 5-ASA 1 g/hari.';
            } else {
                grade = 'Moderate Disease';
                colorClass = 'amber';
                advice = 'Aktivitas penyakit derajat sedang (antara ringan dan berat). Indikasi inisiasi kortikosteroid oral (Prednisone 40 mg/hari dengan tapering berkala selama 8 minggu) bila tidak merespon optimasi terapi 5-ASA dosis penuh.';
            }

            const bleedLabel = (bleed === 'severe') ? 'Makroskopis Berat' : (bleed === 'mod') ? 'Sedang' : 'Tidak Ada/Minimal';
            const resumeText = `[adjusterGEH CDSS] Truelove & Witts: ${grade}\nDefekasi: ${stools}/hari, Perdarahan Rektal: ${bleedLabel}, Tanda Sistemik: ${sysCount}/4.\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">Truelove & Witts Criteria</span>
                    <h3 class="text-base sm:text-lg font-bold text-white mt-1">${grade}</h3>
                    <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">${advice}</p>
                    <div class="mt-3">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Evaluasi UC
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateMayo() {
            const stool = parseInt(document.getElementById('mayo-stool').value, 10);
            const bleed = parseInt(document.getElementById('mayo-bleed').value, 10);
            const pga = parseInt(document.getElementById('mayo-pga').value, 10);
            const endoVal = document.getElementById('mayo-endo').value;
            const res = document.getElementById('mayo-result-container');

            const partialScore = stool + bleed + pga;
            let fullScore = null;
            if (endoVal !== 'skip') {
                fullScore = partialScore + parseInt(endoVal, 10);
            }

            let interp = '';
            let colorClass = 'emerald';

            if (fullScore !== null) {
                if (fullScore <= 2 && endoVal <= 1) {
                    interp = 'Remisi Klinis & Mukosa (Full Mayo 0-2).';
                    colorClass = 'emerald';
                } else if (fullScore <= 5) {
                    interp = 'Aktivitas Ringan (Full Mayo 3-5). Optimalkan 5-ASA.';
                    colorClass = 'emerald';
                } else if (fullScore <= 10) {
                    interp = 'Aktivitas Sedang (Full Mayo 6-10). Indikasi steroid oral / biologik.';
                    colorClass = 'amber';
                } else {
                    interp = 'Aktivitas Berat (Full Mayo 11-12). Rawat inap / steroid IV.';
                    colorClass = 'rose';
                }
            } else {
                if (partialScore <= 1) {
                    interp = 'Remisi Klinis (Partial Mayo 0-1).';
                    colorClass = 'emerald';
                } else if (partialScore <= 4) {
                    interp = 'Aktivitas Klinis Ringan (Partial Mayo 2-4).';
                    colorClass = 'emerald';
                } else if (partialScore <= 7) {
                    interp = 'Aktivitas Klinis Sedang (Partial Mayo 5-7).';
                    colorClass = 'amber';
                } else {
                    interp = 'Aktivitas Klinis Berat (Partial Mayo 8-9).';
                    colorClass = 'rose';
                }
            }

            const scoreDisplay = (fullScore !== null) ? `Full Mayo: ${fullScore}/12 (Partial: ${partialScore}/9)` : `Partial Mayo: ${partialScore}/9`;
            const resumeText = `[adjusterGEH CDSS] Mayo Score UC: ${scoreDisplay}\nInterpretasi: ${interp}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${scoreDisplay}</span>
                    <h3 class="text-base sm:text-lg font-bold text-white mt-1">${interp}</h3>
                    <div class="mt-3">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Mayo
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function calculateHBI() {
            const wellbeing = parseInt(document.getElementById('hbi-wellbeing').value, 10);
            const pain = parseInt(document.getElementById('hbi-pain').value, 10);
            const stools = parseInt(document.getElementById('hbi-stools').value, 10) || 0;
            const mass = parseInt(document.getElementById('hbi-mass').value, 10);

            let compScore = 0;
            const compIds = ['arthralgia', 'uveitis', 'erythema', 'aphthous', 'pyoderma', 'fissure', 'fistula', 'abscess'];
            compIds.forEach(id => {
                if (document.getElementById(`hbi-comp-${id}`).checked) compScore++;
            });

            const score = wellbeing + pain + stools + mass + compScore;
            let status = '';
            let colorClass = 'emerald';
            let advice = '';

            if (score < 5) {
                status = 'Remisi Klinis (Clinical Remission)';
                colorClass = 'emerald';
                advice = 'Pasien dalam remisi klinis. Lanjutkan terapi rumatan.';
            } else if (score <= 7) {
                status = 'Aktivitas Ringan (Mild Disease)';
                colorClass = 'emerald';
                advice = 'Aktivitas ringan. Budesonide oral atau eskalasi rumatan.';
            } else if (score <= 16) {
                status = 'Aktivitas Sedang (Moderate Disease)';
                colorClass = 'amber';
                advice = 'Aktivitas sedang. Prednisone oral atau inisiasi agen biologik (anti-TNF, Vedolizumab, Ustekinumab).';
            } else {
                status = 'Aktivitas Berat (Severe Disease)';
                colorClass = 'rose';
                advice = 'Aktivitas berat. Evaluasi rawat inap, kortikosteroid IV, dan pencitraan komplikasi.';
            }

            const resumeText = `[adjusterGEH CDSS] HBI (Crohn's): ${score} (${status})\nRekomendasi: ${advice}`;
            const res = document.getElementById('hbi-result-container');

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex items-center justify-center text-3xl font-black shrink-0">
                                ${score}
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${status}</span>
                                <h3 class="text-base sm:text-lg font-bold text-white mt-1">HBI Score: ${score} Poin</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">${advice}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume HBI
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        function selectLAGrade(grade) {
            document.querySelectorAll('.la-card').forEach(c => {
                c.classList.remove('border-cyan-400', 'bg-cyan-950/30');
            });
            const activeCard = document.getElementById(`la-card-${grade}`);
            if (activeCard) {
                activeCard.classList.add('border-cyan-400', 'bg-cyan-950/30');
            }

            const box = document.getElementById('la-detail-box');
            let severity = '';
            let rx = '';
            let fup = '';
            let color = 'emerald';

            if (grade === 'A') {
                severity = 'Esofagitis Refluks Ringan (Defek &le; 5 mm terisolasi).';
                rx = 'PPI oral dosis standar (Omeprazole 20 mg atau Esomeprazole 20-40 mg 1x/hari sebelum makan) selama 8 minggu.';
                fup = 'Tidak diperlukan endoskopi kontrol jika gejala mereda sempurna.';
            } else if (grade === 'B') {
                severity = 'Esofagitis Refluks Sedang (Defek &gt; 5 mm terisolasi).';
                rx = 'PPI oral dosis standar selama 8 minggu; optimasi gaya hidup.';
                fup = 'Endoskopi kontrol tidak rutin diperlukan bila respon baik.';
            } else if (grade === 'C') {
                severity = 'Esofagitis Refluks Berat (Defek menyambung &lt; 75% lingkar).';
                rx = 'PPI oral dosis ganda (Double-Dose PPI, misalnya Esomeprazole 40 mg 2x/hari) selama 8 - 12 minggu.';
                fup = 'Endoskopi kontrol (Surveillance EGD) WAJIB pasca 8-12 minggu untuk menyingkirkan Barrett’s Esophagus.';
                color = 'amber';
            } else if (grade === 'D') {
                severity = 'Esofagitis Refluks Sangat Berat / Sirkumferensial (&ge; 75% lingkar).';
                rx = 'PPI oral dosis ganda intensif minimal 12 minggu. Waspadai striktur peptik.';
                fup = 'Endoskopi kontrol WAJIB untuk menyingkirkan displasia / Barrett\'s dan dilatasi bila ada striktur.';
                color = 'rose';
            }

            const resumeText = `[adjusterGEH CDSS] LA Classification: Grade ${grade}\nKeparahan: ${severity}\nTerapi: ${rx}\nSurveilans: ${fup}`;

            box.innerHTML = `
                <div class="border-l-4 border-l-${color}-400 pl-4 py-1">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-bold text-white">Los Angeles Grade ${grade}</span>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3 py-1 rounded text-xs">
                            <i class="fa-regular fa-copy mr-1"></i> Salin Resume LA
                        </button>
                    </div>
                    <p class="text-xs text-${color}-300 font-semibold mb-2">${severity}</p>
                    <div class="space-y-2 text-xs text-slate-300">
                        <p><strong>Rekomendasi Terapi PPI:</strong> ${rx}</p>
                        <p><strong>Panduan Endoskopi Ulang:</strong> ${fup}</p>
                    </div>
                </div>
            `;
        }

        function calculateCalprotectin() {
            const val = parseFloat(document.getElementById('fcal-val').value);
            const res = document.getElementById('calprotectin-result-container');

            if (isNaN(val)) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon masukkan angka kadar Fecal Calprotectin.</div>`;
                res.classList.remove('hidden');
                return;
            }

            let status = '';
            let colorClass = 'emerald';
            let advice = '';

            if (val < 50) {
                status = 'Normal / Negatif Inflamasi Mukosa (&lt; 50 µg/g)';
                colorClass = 'emerald';
                advice = 'Inflamasi mukosa usus sangat tidak mungkin (NPV tinggi). Gejala kemungkinan besar IBS. Kolonoskopi umumnya tidak diperlukan.';
            } else if (val <= 150) {
                status = 'Borderline (50 - 150 µg/g)';
                colorClass = 'amber';
                advice = 'Kadar di zona abu-abu (NSAID / infeksi ringan / inflamasi mukosa derajat rendah). Ulangi tes dalam 4-6 minggu.';
            } else if (val <= 250) {
                status = 'Meningkat Moderat (150 - 250 µg/g)';
                colorClass = 'amber';
                advice = 'Terdapat bukti inflamasi mukosa aktif. Pada IBD yang sudah tegak, menandakan risiko relaps.';
            } else {
                status = 'Sangat Tinggi / Inflamasi Berat (&gt; 250 µg/g)';
                colorClass = 'rose';
                advice = 'Kadar sangat tinggi (spesifisitas &gt;85% untuk inflamasi aktif). Indikasi kolonoskopi segera atau eskalasi terapi.';
            }

            const resumeText = `[adjusterGEH CDSS] Fecal Calprotectin: ${val} µg/g (${status})\nRekomendasi: ${advice}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${status}</span>
                    <h3 class="text-base sm:text-lg font-bold text-white mt-1">Kadar Calprotectin: ${val} µg/g</h3>
                    <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">${advice}</p>
                    <div class="mt-3">
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Calprotectin
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 5. ENDOSCOPY LOGIC
        // ==========================================

        function calculatePolypSurveillance() {
            const finding = document.getElementById('polyp-finding').value;
            const res = document.getElementById('polyp-result-container');

            let interval = '';
            let riskGroup = 'Low Risk';
            let colorClass = 'emerald';
            let rationale = '';

            switch (finding) {
                case 'normal':
                    interval = '10 Tahun';
                    riskGroup = 'Skrining Rata-rata';
                    colorClass = 'emerald';
                    rationale = 'Kolonoskopi berkualitas baik tanpa polip. Ulangi skrining dalam 10 tahun.';
                    break;
                case 'hyperplastic-small':
                    interval = '10 Tahun';
                    riskGroup = 'Low Risk (Hiperplastik Distal)';
                    colorClass = 'emerald';
                    rationale = 'Polip hiperplastik &lt; 10 mm di rektum/sigmoid tidak memiliki potensi keganasan.';
                    break;
                case 'adenoma-1-2-small':
                    interval = '7 - 10 Tahun';
                    riskGroup = 'Low-Risk Adenoma';
                    colorClass = 'emerald';
                    rationale = 'Rekomendasi USMSTF 2020: Interval diperpanjang menjadi 7 s/d 10 tahun bila polipektomi komplit.';
                    break;
                case 'adenoma-3-4-small':
                    interval = '3 - 5 Tahun';
                    riskGroup = 'Intermediate Risk';
                    colorClass = 'amber';
                    rationale = '3 sampai 4 adenoma tubular &lt; 10 mm. Kolonoskopi ulang dalam 3 sampai 5 tahun.';
                    break;
                case 'adenoma-5-10':
                    interval = '3 Tahun';
                    riskGroup = 'High-Risk Adenoma';
                    colorClass = 'amber';
                    rationale = '5 sampai 10 adenoma tubular &lt; 10 mm. Interval surveilans 3 tahun.';
                    break;
                case 'adenoma-large-or-advanced':
                    interval = '3 Tahun';
                    riskGroup = 'Advanced Adenoma (High Risk)';
                    colorClass = 'rose';
                    rationale = 'Adenoma &ge; 10 mm, atau vilosa, atau high-grade dysplasia (HGD). Kolonoskopi dalam 3 tahun.';
                    break;
                case 'adenoma-more-10':
                    interval = '1 Tahun';
                    riskGroup = 'Very High Risk';
                    colorClass = 'rose';
                    rationale = 'Lebih dari 10 adenoma. Kolonoskopi ulang dalam 1 tahun dan pertimbangkan uji genetik poliposis.';
                    break;
                case 'ssl-1-2-small':
                    interval = '5 - 10 Tahun';
                    riskGroup = 'Low-Risk Serrated Lesion';
                    colorClass = 'emerald';
                    rationale = '1 sampai 2 Sessile Serrated Lesion (SSL) &lt; 10 mm tanpa displasia.';
                    break;
                case 'ssl-3-4':
                    interval = '3 - 5 Tahun';
                    riskGroup = 'Intermediate-Risk Serrated';
                    colorClass = 'amber';
                    rationale = '3 sampai 4 Sessile Serrated Lesion (SSL) &lt; 10 mm.';
                    break;
                case 'ssl-large-dysplasia':
                    interval = '3 Tahun';
                    riskGroup = 'Advanced Serrated Lesion';
                    colorClass = 'rose';
                    rationale = 'SSL &ge; 10 mm, atau SSL dengan displasia, atau Traditional Serrated Adenoma (TSA). Kolonoskopi 3 tahun.';
                    break;
                case 'ssl-more-10':
                    interval = '1 Tahun';
                    riskGroup = 'Serrated Polyposis Syndrome';
                    colorClass = 'rose';
                    rationale = 'Kriteria Serrated Polyposis Syndrome (WHO 2019). Surveilans tiap 1 tahun.';
                    break;
                case 'piecemeal-large':
                    interval = '6 Bulan';
                    riskGroup = 'Post-Piecemeal High Risk';
                    colorClass = 'rose';
                    rationale = 'Reseksi piecemeal adenoma / SSL &ge; 20 mm berisiko rekurensi lokal sisa polip. Kontrol scar dalam 6 bulan.';
                    break;
            }

            const resumeText = `[adjusterGEH CDSS] Polyp Surveillance (USMSTF 2020)\nTemuan: ${document.getElementById('polyp-finding').selectedOptions[0].text}\nInterval: ${interval}\nKeterangan: ${rationale}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-lg">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="p-3 rounded-2xl bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 flex flex-col items-center justify-center shrink-0 min-w-[5rem] text-center">
                                <span class="text-xs font-semibold uppercase text-slate-400">Interval</span>
                                <span class="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">${interval}</span>
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/30">${riskGroup}</span>
                                <h3 class="text-base sm:text-lg font-bold text-white mt-1">Jadwal Kolonoskopi Ulang: ${interval}</h3>
                                <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">${rationale}</p>
                            </div>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Interval
                        </button>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 2.11 ESPEN LIVER DISEASE NUTRITION LOGIC
        // ==========================================

        function toggleEspenMode() {
            const mode = document.querySelector('input[name="espen-mode"]:checked').value;
            const clinicalBox = document.getElementById('espen-clinical-box');
            const paraBox = document.getElementById('espen-paracentesis-box');
            if (mode === 'clinical') {
                clinicalBox.classList.remove('hidden');
                paraBox.classList.add('hidden');
            } else {
                clinicalBox.classList.add('hidden');
                paraBox.classList.remove('hidden');
            }
        }

        function calculateEspenNutrition() {
            const sex = document.getElementById('espen-sex').value;
            const age = parseInt(document.getElementById('espen-age').value, 10);
            const weight = parseFloat(document.getElementById('espen-weight').value);
            const height = parseFloat(document.getElementById('espen-height').value);
            const condition = document.getElementById('espen-condition').value;
            const mode = document.querySelector('input[name="espen-mode"]:checked').value;
            const res = document.getElementById('espen-nutrition-result-container');

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon masukkan berat badan dan tinggi badan yang valid.</div>`;
                res.classList.remove('hidden');
                return;
            }

            const heightM = height / 100;
            const actualBmi = (weight / (heightM * heightM)).toFixed(1);

            let fluidDeductionKg = 0;
            let fluidPct = 0;
            let ascitesText = '';
            let edemaText = '';

            if (mode === 'clinical') {
                const ascitesVal = parseFloat(document.getElementById('espen-ascites').value);
                const edemaVal = parseFloat(document.getElementById('espen-edema').value);
                fluidPct = ascitesVal + edemaVal;
                fluidDeductionKg = weight * (fluidPct / 100);
                ascitesText = ascitesVal === 0 ? 'Tanpa Asites' : ascitesVal === 2 ? 'Asites Ringan (USG)' : ascitesVal === 5 ? 'Asites Sedang' : 'Asites Berat/Tegang';
                edemaText = edemaVal === 0 ? 'Tanpa Edema' : edemaVal === 2 ? 'Edema Ankle' : edemaVal === 5 ? 'Edema Pretibial' : 'Edema Paha/Anasarca';
            } else {
                const paraVol = parseFloat(document.getElementById('espen-paracentesis-vol').value) || 0;
                const extraEdema = parseFloat(document.getElementById('espen-para-edema').value) || 0;
                fluidDeductionKg = paraVol + extraEdema;
                fluidPct = ((fluidDeductionKg / weight) * 100);
                ascitesText = `Parasentesis ${paraVol} L`;
                edemaText = extraEdema === 0 ? 'Tanpa sisa edema' : extraEdema === 2 ? 'Sisa edema ankle' : 'Sisa edema pretibial';
            }

            const dryWeight = Math.max(25, weight - fluidDeductionKg);
            const dryBmi = (dryWeight / (heightM * heightM)).toFixed(1);

            let bmiCategory = '';
            let bmiColor = 'emerald';
            if (dryBmi < 18.5) {
                bmiCategory = 'Underweight / Malnutrisi Kronik';
                bmiColor = 'rose';
            } else if (dryBmi < 25.0) {
                bmiCategory = 'Normoweight (Normal)';
                bmiColor = 'emerald';
            } else if (dryBmi < 30.0) {
                bmiCategory = 'Overweight';
                bmiColor = 'amber';
            } else {
                bmiCategory = 'Obesity (Sarcopenic Obesity risk)';
                bmiColor = 'amber';
            }

            let kcalMin = 0, kcalMax = 0, protMin = 0, protMax = 0;
            let bcaaIndicated = false;
            let bcaaDose = (0.25 * dryWeight).toFixed(1);
            let targetNotes = '';

            if (condition === 'stable') {
                kcalMin = Math.round(dryWeight * 30);
                kcalMax = Math.round(dryWeight * 35);
                protMin = (dryWeight * 1.2).toFixed(1);
                protMax = (dryWeight * 1.5).toFixed(1);
                targetNotes = 'Target standar sirosis kompensata: 30 - 35 kcal/kg dry weight & 1.2 - 1.5 g protein/kg dry weight.';
            } else if (condition === 'malnutrition') {
                kcalMin = Math.round(dryWeight * 35);
                kcalMax = Math.round(dryWeight * 40);
                protMin = (dryWeight * 1.5).toFixed(1);
                protMax = (dryWeight * 1.8).toFixed(1);
                bcaaIndicated = true;
                targetNotes = 'Hiperkatabolik / Sarkopenia: Target kalori dinaikkan ke 35 - 40 kcal/kg dan protein minimal 1.5 g/kg untuk memulihkan massa otot.';
            } else if (condition === 'obese') {
                kcalMin = Math.round(dryWeight * 20);
                kcalMax = Math.round(dryWeight * 25);
                protMin = (dryWeight * 1.5).toFixed(1);
                protMax = (dryWeight * 2.0).toFixed(1);
                targetNotes = 'Sirosis Obesitas: Diet hipokalorik moderat (20 - 25 kcal/kg dry weight) dengan PROTEIN TINGGI (≥1.5 g/kg) untuk mencegah kehilangan massa otot (sarkopenia) saat penurunan berat badan.';
            } else if (condition === 'encephalopathy') {
                kcalMin = Math.round(dryWeight * 30);
                kcalMax = Math.round(dryWeight * 35);
                protMin = (dryWeight * 1.2).toFixed(1);
                protMax = (dryWeight * 1.5).toFixed(1);
                bcaaIndicated = true;
                targetNotes = 'Ensefalopati Hepatikum (HE): Protein TIDAK BOLEH dibatasi (<1.0 g/kg dilarang). Berikan protein nabati & dairy yang lebih ditoleransi, ditambah suplemen oral BCAA untuk menurunkan amonia plasma.';
            }

            const lesKcal = '200 - 250 kcal';
            const lesCarb = '50 g karbohidrat kompleks atau formula BCAA';

            const resumeText = `[adjusterGEH CDSS] ESPEN Liver Disease Nutrition Assessment:
Pasien: ${sex === 'male' ? 'Pria' : 'Wanita'}, Usia ${age}th.
BB Aktual: ${weight} kg (BMI: ${actualBmi}), TB: ${height} cm.
Status Retensi: Asites (${ascitesText}), Edema (${edemaText}) -> Retensi Cairan: ${fluidDeductionKg.toFixed(1)} kg (${fluidPct.toFixed(1)}%).
ESTIMASI DRY WEIGHT: ${dryWeight.toFixed(1)} kg (Dry BMI: ${dryBmi} kg/m² - ${bmiCategory}).
TARGET KALORI: ${kcalMin} - ${kcalMax} kcal/hari (30-35 kcal/kg dry weight).
TARGET PROTEIN: ${protMin} - ${protMax} g/hari (1.2-1.5 g/kg dry weight).
LATE EVENING SNACK (LES): Wajib camilan malam (${lesKcal}, ${lesCarb}) sebelum tidur untuk cegah puasa malam >6-8 jam.
BCAA ORAL: ${bcaaIndicated ? 'Sangat Dianjurkan' : 'Sesuai indikasi (sarkopenia/intoleransi)'} dosis ${bcaaDose} g/hari (0.25 g/kg).
RESTRIKSI NATRIUM: 2.0 g Na/hari (~5 g NaCl/garam dapur). Hindari restriksi terlalu ketat.`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 shadow-xl space-y-5">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-amber-500/20 pb-4">
                        <div>
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">ESPEN 2019 / EASL Guideline</span>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${bmiColor}-500/20 text-${bmiColor}-300 border border-${bmiColor}-500/40">${bmiCategory}</span>
                            </div>
                            <h3 class="text-xl font-extrabold text-white">Hasil Kebutuhan Nutrisi Sirosis Hepar</h3>
                            <p class="text-xs text-slate-300 mt-1">${targetNotes}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Nutrisi
                        </button>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
                            <span class="text-[11px] text-slate-400 block uppercase font-semibold">Dry Weight</span>
                            <span class="text-2xl font-black text-amber-400 leading-tight mt-0.5 block">${dryWeight.toFixed(1)} <span class="text-xs font-normal text-slate-300">kg</span></span>
                            <span class="text-[10px] text-slate-400 mt-0.5 block">Koreksi: -${fluidDeductionKg.toFixed(1)} kg (${fluidPct.toFixed(1)}%)</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
                            <span class="text-[11px] text-slate-400 block uppercase font-semibold">Dry BMI</span>
                            <span class="text-2xl font-black text-white leading-tight mt-0.5 block">${dryBmi} <span class="text-xs font-normal text-slate-300">kg/m²</span></span>
                            <span class="text-[10px] text-slate-400 mt-0.5 block">BB Aktual: ${actualBmi} kg/m²</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/40 text-center">
                            <span class="text-[11px] text-cyan-300 block uppercase font-semibold">Target Energi Harian</span>
                            <span class="text-2xl font-black text-cyan-400 leading-tight mt-0.5 block">${kcalMin} - ${kcalMax}</span>
                            <span class="text-[10px] text-cyan-200 mt-0.5 block">kcal / hari</span>
                        </div>
                        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/40 text-center">
                            <span class="text-[11px] text-emerald-300 block uppercase font-semibold">Target Protein Harian</span>
                            <span class="text-2xl font-black text-emerald-400 leading-tight mt-0.5 block">${protMin} - ${protMax}</span>
                            <span class="text-[10px] text-emerald-200 mt-0.5 block">gram protein / hari</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                        <div class="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                            <div class="flex items-center space-x-2 text-amber-300 font-bold mb-2">
                                <i class="fa-solid fa-moon text-sm"></i>
                                <span>Late Evening Snack (LES) - Rekomendasi Wajib ESPEN</span>
                            </div>
                            <p class="leading-relaxed">
                                Pasien sirosis mengalami <em>accelerated starvation</em> setara puasa 3 hari hanya dalam 1 malam karena deplesi glikogen hati.
                            </p>
                            <div class="mt-2.5 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-[11px] space-y-1">
                                <p><strong>Target LES:</strong> ${lesKcal} (${lesCarb}) dikonsumsi tepat sebelum tidur malam.</p>
                                <p><strong>Contoh Menu:</strong> Biskuit gandum utuh + susu kedelai, bubur havermut/oatmeal, atau suplemen BCAA terlarut.</p>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
                            <div class="flex items-center space-x-2 text-cyan-300 font-bold mb-2">
                                <i class="fa-solid fa-utensils text-sm"></i>
                                <span>Pola Makan & Toleransi Protein</span>
                            </div>
                            <ul class="space-y-1.5 list-disc list-inside leading-relaxed text-[11px]">
                                <li><strong>Small Frequent Meals:</strong> Berikan 4 - 6 kali makan porsi kecil sepanjang hari (interval puasa tidak melebihi 4-6 jam).</li>
                                <li><strong>Sumber Protein:</strong> Utamakan protein nabati (tahu, tempe, polong-polongan) dan dairy (susu, yogurt) karena kaya BCAA dan memiliki profil asam amino aromatik rendah.</li>
                                <li><strong>Protein Hewani:</strong> Daging putih/unggas dan ikan dapat diberikan jika ditoleransi dengan baik.</li>
                            </ul>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
                            <div class="flex items-center space-x-2 text-emerald-300 font-bold mb-2">
                                <i class="fa-solid fa-pills text-sm"></i>
                                <span>Suplementasi Oral BCAA (Leucine, Isoleucine, Valine)</span>
                            </div>
                            <p class="leading-relaxed text-[11px]">
                                <strong>Dosis Anjuran:</strong> 0.25 g/kg dry weight / hari (rata-rata <strong>${bcaaDose} g/hari</strong>).
                            </p>
                            <p class="mt-1 text-[11px] text-slate-400">
                                Indikasi kuat pada sirosis dekompensata Child-Pugh B/C, riwayat ensefalopati hepatikum, intoleransi protein hewani, atau sarkopenia lanjut. Membantu detoksifikasi amonia di otot skeletal.
                            </p>
                        </div>

                        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
                            <div class="flex items-center space-x-2 text-rose-300 font-bold mb-2">
                                <i class="fa-solid fa-bottle-droplet text-sm"></i>
                                <span>Restriksi Natrium & Mikronutrien</span>
                            </div>
                            <ul class="space-y-1.5 list-disc list-inside leading-relaxed text-[11px]">
                                <li><strong>Restriksi Natrium:</strong> Batasi <strong>2.0 g natrium/hari</strong> (setara 5 g / 1 sdt garam dapur) pada asites/edema. <em>Hindari restriksi terlalu ketat (&lt;1.5 g)</em> karena menurunkan palatabilitas dan memicu hiponatremia/malnutrisi.</li>
                                <li><strong>Mikronutrien:</strong> Suplementasi Zinc (200 mg Zinc sulfat/hari untuk metabolisme urea hepar), Vitamin D (target serum &gt;30 ng/mL), dan Vitamin B kompleks (terutama Thiamine oral/IV).</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 5.1 ROME IV: IRRITABLE BOWEL SYNDROME LOGIC
        // ==========================================

        function calculateRome4Ibs() {
            const painFreq = document.getElementById('ibs-pain-freq').value;
            const onset6m = document.getElementById('ibs-onset-6m').value;
            const relDef = document.getElementById('ibs-rel-defecation').checked;
            const relFreq = document.getElementById('ibs-rel-freq').checked;
            const relForm = document.getElementById('ibs-rel-form').checked;
            const bristolHard = document.getElementById('ibs-bristol-hard').value;
            const bristolLoose = document.getElementById('ibs-bristol-loose').value;

            const alarmAge = document.getElementById('ibs-alarm-age50').checked;
            const alarmWeight = document.getElementById('ibs-alarm-weightloss').checked;
            const alarmNocturnal = document.getElementById('ibs-alarm-nocturnal').checked;
            const alarmBleeding = document.getElementById('ibs-alarm-bleeding').checked;
            const alarmAnemia = document.getElementById('ibs-alarm-anemia').checked;
            const alarmFamily = document.getElementById('ibs-alarm-family').checked;
            const alarmMass = document.getElementById('ibs-alarm-mass').checked;

            const alarmList = [];
            if (alarmAge) alarmList.push('Usia onset >50 th');
            if (alarmWeight) alarmList.push('Penurunan BB tanpa sebab');
            if (alarmNocturnal) alarmList.push('Gejala nokturnal');
            if (alarmBleeding) alarmList.push('Perdarahan saluran cerna');
            if (alarmAnemia) alarmList.push('Anemia defisiensi besi');
            if (alarmFamily) alarmList.push('Riwayat keluarga Ca/IBD');
            if (alarmMass) alarmList.push('Massa teraba / limfadenopati');

            const res = document.getElementById('rome4-ibs-result-container');

            let relationCount = 0;
            if (relDef) relationCount++;
            if (relFreq) relationCount++;
            if (relForm) relationCount++;

            const isCoreFulfilled = (painFreq === 'yes' && onset6m === 'yes' && relationCount >= 2);

            let subtype = '';
            let subtypeDesc = '';
            let isHardMore = (bristolHard === 'more');
            let isLooseMore = (bristolLoose === 'more');

            if (isHardMore && !isLooseMore) {
                subtype = 'IBS-C (Constipation-Predominant)';
                subtypeDesc = 'Didominasi konstipasi: Feses keras/bergumpal (Bristol 1-2) ≥ 25% dan feses cair (Bristol 6-7) < 25% waktu BAB abnormal.';
            } else if (isLooseMore && !isHardMore) {
                subtype = 'IBS-D (Diarrhea-Predominant)';
                subtypeDesc = 'Didominasi diare: Feses cair/lembek (Bristol 6-7) ≥ 25% dan feses keras (Bristol 1-2) < 25% waktu BAB abnormal.';
            } else if (isHardMore && isLooseMore) {
                subtype = 'IBS-M (Mixed Bowel Habits)';
                subtypeDesc = 'Pola campuran: Feses keras (Bristol 1-2) ≥ 25% DAN feses cair (Bristol 6-7) ≥ 25% waktu BAB abnormal.';
            } else {
                subtype = 'IBS-U (Unclassified)';
                subtypeDesc = 'Tidak terklasifikasi: Memenuhi kriteria IBS namun kelainan konsistensi < 25% untuk feses keras maupun cair.';
            }

            let statusTitle = '';
            let colorClass = 'emerald';
            let rxAdvice = '';

            if (!isCoreFulfilled) {
                statusTitle = 'Belum Memenuhi Kriteria Rome IV untuk IBS';
                colorClass = 'amber';
                rxAdvice = 'Pasien belum memenuhi kriteria formal Rome IV (syarat nyeri minimal 1 hari/minggu dalam 3 bulan terakhir dengan onset minimal 6 bulan lalu, dan minimal 2 dari 3 karakteristik terkait defekasi). Evaluasi penyebab fungsional lain atau penyakit organik saluran cerna.';
            } else if (alarmList.length > 0) {
                statusTitle = `Kriteria Rome IV IBS Terpenuhi (${subtype}) DENGAN ALARM RED FLAGS`;
                colorClass = 'rose';
                rxAdvice = `Ditemukan tanda bahaya (${alarmList.join(', ')}). <strong>WAJIB segera dilakukan evaluasi kolonoskopi</strong> dan laboratorium (Hb, ferritin, Fecal Calprotectin, serologi celiac) untuk menyingkirkan IBD, keganasan kolorektal, atau infeksi sebelum melabel murni fungsional!`;
            } else {
                statusTitle = `Diagnosis Tegak: Irritable Bowel Syndrome (${subtype})`;
                colorClass = 'emerald';
                if (subtype.startsWith('IBS-C')) {
                    rxAdvice = '<strong>Lini 1:</strong> Serat larut (Psyllium husk bertahap 3-4 g/hari), Polietilen glikol (PEG 17 g/hari). <br><strong>Lini 2 (Refrakter):</strong> Lubiprostone (8 mcg 2x/hari), Linaclotide (290 mcg 1x/hari), atau Prucalopride (1-2 mg 1x/hari). <br><strong>Nyeri viseral:</strong> Antispasmodik (Otilonium/Hyoscine) atau SSRI.';
                } else if (subtype.startsWith('IBS-D')) {
                    rxAdvice = '<strong>Lini 1:</strong> Diet Low-FODMAP terstruktur (4-6 minggu), Loperamide dosis titrasi prn. <br><strong>Lini 2:</strong> Antispasmodik (Mebeverine 135 mg 3x/hari), Rifaximin oral 550 mg 3x/hari selama 14 hari. <br><strong>Lini 3 / Nyeri:</strong> Neuromodulator sentral TCA dosis rendah (Amitriptyline 10 - 25 mg malam sebelum tidur), Eluxadoline atau Alosetron (bila tersedia).';
                } else if (subtype.startsWith('IBS-M')) {
                    rxAdvice = '<strong>Manajemen Simtomatik Terarah:</strong> Diet Low-FODMAP, regulasi mikrobiota usus, antispasmodik prn saat kram, loperamide saat diare, dan serat larut/PEG saat konstipasi. Neuromodulator (TCA/SSRI dosis rendah) efektif meregulasi Gut-Brain Axis.';
                } else {
                    rxAdvice = 'Modifikasi pola hidup, diet rendah fermentasi gas (Low-FODMAP), hidrasi cukup, manajemen stres, dan neuromodulator sentral.';
                }
            }

            const resumeText = `[adjusterGEH CDSS] Rome IV Criteria: Irritable Bowel Syndrome (IBS)
Status Diagnostik: ${statusTitle}
Subtipe: ${subtype}
Kriteria Terpenuhi: Nyeri & Waktu (${painFreq === 'yes' && onset6m === 'yes' ? 'Ya' : 'Tidak'}), Karakteristik Nyeri: ${relationCount}/3 (Defekasi: ${relDef}, Frekuensi: ${relFreq}, Bentuk: ${relForm}).
Proporsi Bristol: Keras >=25%: ${isHardMore}, Cair >=25%: ${isLooseMore}.
Alarm Red Flags: ${alarmList.length > 0 ? alarmList.join(', ') : 'Tidak ada (Aman)'}.
Rekomendasi Klinis: ${rxAdvice.replace(/<[^>]*>/g, '')}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-xl space-y-4">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-${colorClass}-500/30 pb-3">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/40">Rome IV Consensus</span>
                            <h3 class="text-lg sm:text-xl font-extrabold text-white mt-1">${statusTitle}</h3>
                            <p class="text-xs text-slate-300 mt-0.5">${subtypeDesc}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume IBS
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Subtipe IBS</span>
                            <span class="text-base font-bold text-white mt-0.5 block">${subtype}</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Kriteria Karakteristik Nyeri</span>
                            <span class="text-base font-bold ${relationCount >= 2 ? 'text-emerald-400' : 'text-amber-400'} mt-0.5 block">${relationCount} dari 3 Terpenuhi</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border ${alarmList.length > 0 ? 'border-rose-500/60 bg-rose-950/30' : 'border-slate-700/60'}">
                            <span class="${alarmList.length > 0 ? 'text-rose-300' : 'text-slate-400'} block font-semibold">Skrining Alarm Red Flags</span>
                            <span class="text-sm font-bold ${alarmList.length > 0 ? 'text-rose-400' : 'text-emerald-400'} mt-0.5 block">${alarmList.length > 0 ? alarmList.join(', ') : 'Negatif / Tidak Ada'}</span>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl bg-slate-900/80 border border-${colorClass}-500/30 text-xs text-slate-200 leading-relaxed">
                        <h4 class="font-bold text-white mb-1.5 flex items-center">
                            <i class="fa-solid fa-stethoscope mr-1.5 text-cyan-400"></i> Panduan Tatalaksana Berbasis Panduan ACG 2021:
                        </h4>
                        <div class="space-y-1">${rxAdvice}</div>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 5.2 ROME IV: FUNCTIONAL DYSPEPSIA LOGIC
        // ==========================================

        function calculateRome4Dyspepsia() {
            const duration = document.getElementById('dysp-duration').value;
            const egd = document.getElementById('dysp-egd').value;
            const fullness = document.getElementById('dysp-fullness').checked;
            const satiation = document.getElementById('dysp-satiation').checked;
            const pain = document.getElementById('dysp-pain').checked;
            const burning = document.getElementById('dysp-burning').checked;

            const alarmAge = document.getElementById('dysp-alarm-age60').checked;
            const alarmDysphagia = document.getElementById('dysp-alarm-dysphagia').checked;
            const alarmVomiting = document.getElementById('dysp-alarm-vomiting').checked;
            const alarmWeight = document.getElementById('dysp-alarm-weightloss').checked;
            const alarmBleeding = document.getElementById('dysp-alarm-bleeding').checked;
            const alarmFamily = document.getElementById('dysp-alarm-family').checked;
            const alarmMass = document.getElementById('dysp-alarm-mass').checked;

            const alarms = [];
            if (alarmAge) alarms.push('Usia ≥55-60 th onset baru');
            if (alarmDysphagia) alarms.push('Disfagia / Odinofagia');
            if (alarmVomiting) alarms.push('Muntah persisten');
            if (alarmWeight) alarms.push('Penurunan BB tanpa sebab');
            if (alarmBleeding) alarms.push('Perdarahan cerna / anemia');
            if (alarmFamily) alarms.push('Riwayat keluarga Ca gaster');
            if (alarmMass) alarms.push('Massa epigastrium / limfadenopati');

            const res = document.getElementById('rome4-dyspepsia-result-container');

            const hasPds = (fullness || satiation);
            const hasEps = (pain || burning);

            let subtype = '';
            let colorClass = 'emerald';
            let statusText = '';
            let rxText = '';

            if (egd === 'organic_found') {
                subtype = 'Bukan Dispepsia Fungsional (Dispepsia Organik/Struktural)';
                colorClass = 'rose';
                statusText = 'Ditemukan lesi struktural bermakna pada EGD (ulkus peptikum aktif, keganasan, striktur, dll). Tatalaksana ditujukan langsung pada etiologi organik spesifik tersebut.';
                rxText = 'Tatalaksana ulkus peptikum (PPI dosis penuh + eradikasi H. pylori jika positif) atau rujukan onkologi/bedah jika dicurigai keganasan.';
            } else if (duration !== 'yes') {
                subtype = 'Belum Memenuhi Syarat Waktu Rome IV';
                colorClass = 'amber';
                statusText = 'Durasi gejala belum mencapai kriteria Rome IV (minimal 3 bulan aktif dengan onset minimal 6 bulan lalu).';
                rxText = 'Lakukan evaluasi uninvestigated dyspepsia: uji non-invasif H. pylori (urea breath test / feses antigen), terapi simtomatis jangka pendek, dan edukasi diet.';
            } else if (!hasPds && !hasEps) {
                subtype = 'Gejala Kardinal Tidak Terpenuhi';
                colorClass = 'amber';
                statusText = 'Tidak ada dari 4 gejala kardinal (postprandial fullness, early satiation, epigastric pain, epigastric burning) yang dirasakan dalam frekuensi diagnostik.';
                rxText = 'Evaluasi kemungkinan GERD non-erosif, gangguan bilier fungsional, atau sindrom nyeri abdomen lain.';
            } else {
                if (hasPds && hasEps) {
                    subtype = 'Overlap PDS + EPS (Postprandial Distress & Epigastric Pain)';
                } else if (hasPds) {
                    subtype = 'Postprandial Distress Syndrome (PDS)';
                } else {
                    subtype = 'Epigastric Pain Syndrome (EPS)';
                }

                if (alarms.length > 0) {
                    colorClass = 'rose';
                    statusText = `Dispepsia Fungsional (${subtype}) DENGAN TANDA BAHAYA (ALARM FEATURES)`;
                    rxText = `Ditemukan tanda bahaya (${alarms.join(', ')}). <strong>WAJIB segera dilakukan tindakan Endoskopi (EGD)</strong> untuk menyingkirkan adenokarsinoma gaster, ulkus peptikum berat, atau obstruksi sebelum diterapi sebagai fungsional!`;
                } else if (egd === 'not_done') {
                    colorClass = 'amber';
                    statusText = `Kecurigaan Dispepsia Fungsional (${subtype}) - Uninvestigated`;
                    rxText = `Pasien belum pernah menjalani EGD namun tanpa tanda bahaya. <strong>Rekomendasi ACG/CAG:</strong> Lakukan strategi <em>H. pylori Test-and-Treat</em> terlebih dahulu. Jika H. pylori negatif atau gejala menetap pasca eradikasi, mulai terapi lini 1 sesuai subtipe (${subtype}).`;
                } else {
                    colorClass = 'emerald';
                    statusText = `Diagnosis Tegak: Functional Dyspepsia - ${subtype}`;
                    if (subtype.includes('PDS') && !subtype.includes('EPS')) {
                        rxText = '<strong>Lini 1:</strong> Modifikasi diet (makan porsi kecil lebih sering, kurangi makanan berlemak tinggi). Agen Prokinetik (Itopride 50 mg 3x/hari sebelum makan, atau Domperidone 10 mg 3x/hari jangka pendek). <br><strong>Lini 2 (Refrakter):</strong> Agen relaksasi fundus lambung (Buspirone 10 mg 3x/hari ac), atau neuromodulator pusat Mirtazapine (15 mg malam untuk early satiation & nafsu makan).';
                    } else if (subtype.includes('EPS') && !subtype.includes('PDS')) {
                        rxText = '<strong>Lini 1:</strong> Supresi asam lambung dengan PPI dosis standar (Omeprazole 20 mg atau Esomeprazole 20-40 mg 1x/hari 30 menit sebelum makan pagi) selama 4 - 8 minggu. <br><strong>Lini 2 (Respon parsial/refrakter):</strong> Neuromodulator sentral dosis rendah (TCA: Amitriptyline 10 - 25 mg malam sebelum tidur) yang terbukti superior untuk meredakan nyeri viseral.';
                    } else {
                        rxText = '<strong>Lini 1 (Overlap):</strong> Kombinasi PPI oral dosis standar sebelum makan pagi + Agen Prokinetik (Itopride 50 mg 3x/hari) sebelum makan selama 4-8 minggu. <br><strong>Lini 2:</strong> Eskalasi ke TCA dosis rendah (Amitriptyline 10-25 mg malam) atau terapi perilaku/CBT jika terdapat komponen kecemasan.';
                    }
                }
            }

            const resumeText = `[adjusterGEH CDSS] Rome IV Functional Dyspepsia Assessment
Status: ${statusText}
Subtipe: ${subtype}
Gejala Kardinal: Fullness (${fullness}), Early Satiation (${satiation}), Epigastric Pain (${pain}), Epigastric Burning (${burning}).
Status EGD: ${egd === 'ruled_out' ? 'Normal / Lesi organik tereksklusi' : egd === 'not_done' ? 'Belum EGD' : 'Ditemukan lesi organik'}
Alarm Signs: ${alarms.length > 0 ? alarms.join(', ') : 'Negatif'}
Rekomendasi Terapi: ${rxText.replace(/<[^>]*>/g, '')}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-xl space-y-4">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-${colorClass}-500/30 pb-3">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/40">Rome IV Dyspepsia</span>
                            <h3 class="text-lg sm:text-xl font-extrabold text-white mt-1">${subtype}</h3>
                            <p class="text-xs text-slate-300 mt-0.5">${statusText}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Dispepsia
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Komponen PDS</span>
                            <span class="text-sm font-bold ${hasPds ? 'text-cyan-400' : 'text-slate-500'} mt-0.5 block">${hasPds ? 'Positif (Fullness/Satiation)' : 'Negatif'}</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Komponen EPS</span>
                            <span class="text-sm font-bold ${hasEps ? 'text-amber-400' : 'text-slate-500'} mt-0.5 block">${hasEps ? 'Positif (Pain/Burning)' : 'Negatif'}</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border ${alarms.length > 0 ? 'border-rose-500/60 bg-rose-950/30' : 'border-slate-700/60'}">
                            <span class="${alarms.length > 0 ? 'text-rose-300' : 'text-slate-400'} block font-semibold">Tanda Bahaya</span>
                            <span class="text-sm font-bold ${alarms.length > 0 ? 'text-rose-400' : 'text-emerald-400'} mt-0.5 block">${alarms.length > 0 ? alarms.join(', ') : 'Negatif / Aman'}</span>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl bg-slate-900/80 border border-${colorClass}-500/30 text-xs text-slate-200 leading-relaxed">
                        <h4 class="font-bold text-white mb-1.5 flex items-center">
                            <i class="fa-solid fa-pills mr-1.5 text-cyan-400"></i> Rekomendasi Terapi Berbasis Bukti (ACG/CAG Guideline):
                        </h4>
                        <div>${rxText}</div>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // ==========================================
        // 5.3 LYON CONSENSUS 2.0: GERD LOGIC
        // ==========================================

        function calculateLyonGerd() {
            const egd = document.getElementById('lyon-egd').value;
            const aet = parseFloat(document.getElementById('lyon-aet').value);
            const refluxCount = parseInt(document.getElementById('lyon-reflux-count').value, 10);
            const corr = document.getElementById('lyon-symptom-corr').value;
            const mnbi = document.getElementById('lyon-mnbi').value;
            const pspw = document.getElementById('lyon-pspw').value;
            const res = document.getElementById('lyon-result-container');

            if (isNaN(aet) || aet < 0) {
                res.innerHTML = `<div class="p-4 rounded-xl bg-rose-900/40 text-rose-200 text-sm">Mohon masukkan angka Acid Exposure Time (AET %) yang valid.</div>`;
                res.classList.remove('hidden');
                return;
            }

            let classification = '';
            let categoryTitle = '';
            let colorClass = 'emerald';
            let rationale = '';
            let rxAdvice = '';

            const isEndoConclusive = (egd === 'la-c' || egd === 'la-d' || egd === 'stricture' || egd === 'barrett-long');
            const isAetConclusive = (aet > 6.0);

            if (isEndoConclusive || isAetConclusive) {
                classification = 'Proven / Conclusive GERD';
                categoryTitle = 'GERD Konklusif (Terbukti Secara Objektif)';
                colorClass = 'rose';
                rationale = isEndoConclusive 
                    ? `Bukti endoskopi definitif (${document.getElementById('lyon-egd').selectedOptions[0].text}) merupakan patognomonik kerusakan mukosa berat akibat refluks gastroesofagus.`
                    : `Acid Exposure Time abnormal tinggi (${aet}%) melebihi batas diagnostik Lyon 2.0 (> 6.0%), membuktikan beban asam esofagus patologis.`;
                rxAdvice = '<strong>Terapi Supresi Asam Agresif:</strong> PPI dosis standar hingga dosis ganda (misal Esomeprazole 40 mg 2x/hari) atau P-CAB (Vonoprazan 20 mg 1x/hari) selama 8 - 12 minggu. Evaluasi fundoplikasi bedah atau terapi endoluminal antirefluks jika respon medikamentosa suboptimal.';
            } else if ((aet >= 4.0 && aet <= 6.0) || egd === 'la-b' || (refluxCount > 80 && aet >= 4.0)) {
                classification = 'Borderline / Inconclusive GERD';
                categoryTitle = 'GERD Inkonklusif / Zona Abu-abu (Borderline)';
                colorClass = 'amber';
                rationale = `AET berada pada rentang batas abu-abu (4.0 - 6.0%) atau ditemukan LA Grade B. Memerlukan bukti penunjang tambahan untuk mengonfirmasi atau menyingkirkan GERD patologis.`;
                let adjNote = '';
                if (mnbi === 'low' || pspw === 'low') {
                    adjNote = ' Biomarker tambahan abnormal (MNBI < 1500 Ω atau PSPW < 50%) mendukung kecenderungan GERD sejati.';
                }
                rxAdvice = `<strong>Investigasi Lanjutan:</strong>${adjNote} Lakukan High-Resolution Manometry (HRM) untuk evaluasi fungsi sfingter esofagus bawah (LES) dan peristalsis, uji coba telemetri nirkabel kapsul pH 96 jam (Bravo), atau structured trial PPI selama 8 minggu dengan pemantauan respon klinis objektif.`;
            } else if (aet < 4.0) {
                if (corr === 'positive') {
                    classification = 'Reflux Hypersensitivity (RH)';
                    categoryTitle = 'Reflux Hypersensitivity (Hipersensitivitas Refluks)';
                    colorClass = 'pink';
                    rationale = `AET normal/fisiologis (< 4.0%), TETAPI korelasi gejala terhadap episode refluks POSITIF (SI ≥ 50% atau SAP ≥ 95%). Pasien memiliki ambang persepsi nyeri viseral yang hipersensitif terhadap refluks fisiologis.`;
                    rxAdvice = '<strong>Eskalasi PPI dosis tinggi TIDAK BERMANFAAT.</strong> Terapi utama ditujukan pada modulasi ambang nyeri saraf esofagus: Neuromodulator sentral/viseral dosis rendah (TCA misal Amitriptyline 10-25 mg malam, atau SSRI/SNRI), kombinasi antasid/alginat saat gejala timbul, modifikasi gaya hidup, dan hipnoterapi esofagus.';
                } else if (corr === 'negative') {
                    classification = 'Functional Heartburn (FH)';
                    categoryTitle = 'Functional Heartburn (Nyeri Ulu Hati Fungsional)';
                    colorClass = 'purple';
                    rationale = `AET normal (< 4.0%), total episode refluks normal, DAN korelasi gejala NEGATIF. Keluhan sensasi terbakar/heartburn TIDAK berhubungan dengan episode refluks lambung, melainkan interaksi Gut-Brain Axis.`;
                    rxAdvice = '<strong>HENTIKAN terapi PPI</strong> untuk menghindari polifarmasi yang tidak efektif. Edukasi bahwa keluhan bukan akibat asam lambung. Berikan neuromodulator sentral (TCA dosis rendah, SSRI), terapi perilaku kognitif (CBT), teknik relaksasi diafragma, dan akupunktur.';
                } else {
                    classification = 'Normal / Non-GERD';
                    categoryTitle = 'Normal / Fisiologis (Non-GERD)';
                    colorClass = 'emerald';
                    rationale = 'Paparan asam esofagus dalam batas normal fisiologis (< 4.0%) tanpa bukti korelasi refluks patologis.';
                    rxAdvice = 'Tidak diperlukan terapi supresi asam lambung jangka panjang.';
                }
            }

            const resumeText = `[adjusterGEH CDSS] Lyon Consensus 2.0 GERD Assessment:
Klasifikasi: ${classification} (${categoryTitle})
Temuan EGD: ${document.getElementById('lyon-egd').selectedOptions[0].text}
Monitoring Asam: AET ${aet}%, Total Refluks Episode: ${refluxCount}/24 jam.
Asosiasi Gejala: ${corr === 'positive' ? 'Positif (SI>=50% / SAP>=95%)' : corr === 'negative' ? 'Negatif' : 'Tidak dinilai'}.
Biomarker Tambahan: MNBI (${mnbi}), PSPW Index (${pspw}).
Interpretasi: ${rationale}
Rekomendasi Terapi: ${rxAdvice.replace(/<[^>]*>/g, '')}`;

            res.innerHTML = `
                <div class="p-5 rounded-2xl bg-${colorClass}-900/30 border border-${colorClass}-500/50 shadow-xl space-y-4">
                    <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-${colorClass}-500/30 pb-3">
                        <div>
                            <div class="flex items-center space-x-2 mb-1">
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-${colorClass}-500/20 text-${colorClass}-300 border border-${colorClass}-500/40">Lyon 2.0 Category</span>
                                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">AET: ${aet}%</span>
                            </div>
                            <h3 class="text-lg sm:text-xl font-extrabold text-white">${categoryTitle}</h3>
                            <p class="text-xs text-slate-300 mt-1 leading-relaxed">${rationale}</p>
                        </div>
                        <button type="button" onclick="copyToClipboard(\`${resumeText.replace(/"/g, '&quot;')}\`)" class="glass-btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume Lyon
                        </button>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Status AET</span>
                            <span class="text-base font-bold ${aet > 6 ? 'text-rose-400' : aet >= 4 ? 'text-amber-400' : 'text-emerald-400'} mt-0.5 block">${aet}% (${aet > 6 ? 'Abnormal' : aet >= 4 ? 'Borderline' : 'Normal'})</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Total Episode Refluks</span>
                            <span class="text-base font-bold text-white mt-0.5 block">${refluxCount} / 24h</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Asosiasi Gejala</span>
                            <span class="text-base font-bold ${corr === 'positive' ? 'text-pink-400' : 'text-slate-300'} mt-0.5 block">${corr === 'positive' ? 'Positif (+)' : corr === 'negative' ? 'Negatif (-)' : 'N/A'}</span>
                        </div>
                        <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                            <span class="text-slate-400 block font-semibold">Fenotipe Klinis</span>
                            <span class="text-base font-bold text-white mt-0.5 block">${classification}</span>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl bg-slate-900/80 border border-${colorClass}-500/30 text-xs text-slate-200 leading-relaxed">
                        <h4 class="font-bold text-white mb-1.5 flex items-center">
                            <i class="fa-solid fa-road mr-1.5 text-cyan-400"></i> Panduan Tatalaksana Berbasis Konsensus Lyon 2.0 (Gut 2024):
                        </h4>
                        <div>${rxAdvice}</div>
                    </div>
                </div>
            `;
            res.classList.remove('hidden');
        }

        // Initialize default views
        document.addEventListener('DOMContentLoaded', () => {
            initGlobalSearch();
            updateAntithromboticAdvice();
            selectForrest('Ia');
            selectLAGrade('A');
            calculateEspenNutrition();
            calculateRome4Ibs();
            calculateRome4Dyspepsia();
            calculateLyonGerd();
        });
    