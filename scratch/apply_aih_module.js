const fs = require('fs');

const filePath = 'adjustr-GEH.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Home Dashboard Card description and count
const oldHomeCount = '<span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka 12 Kalkulator <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>';
const newHomeCount = '<span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka 13 Kalkulator <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>';
content = content.replace(oldHomeCount, newHomeCount);

const oldHomeDesc = '<p class="text-xs text-slate-400 line-clamp-2 mb-3">Child-Pugh, MELD Trio, ESPEN Nutrition, SAAG & PMN, FIB-4 & APRI, R-Factor, De Ritis, NFS, Maddrey, CLIF-C, Baveno VII, & Panel LFT RS.</p>';
const newHomeDesc = '<p class="text-xs text-slate-400 line-clamp-2 mb-3">Child-Pugh, MELD Trio, ESPEN Nutrition, SAAG & PMN, FIB-4 & APRI, R-Factor, De Ritis, NFS, Maddrey, CLIF-C, Baveno VII, Panel LFT RS, & Revised AIH Score.</p>';
content = content.replace(oldHomeDesc, newHomeDesc);

// 2. Update Hub-hepa badge and add card
const oldHubBadge = '<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">11 Modul</span>';
const newHubBadge = '<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">13 Modul</span>';
content = content.replace(oldHubBadge, newHubBadge);

const aihHubCard = `
                    <!-- Revised Original AIH Score (IAHG 1999) -->
                    <button type="button" onclick="navigateTo('aih-module', 'Revised Original AIH Score (IAHG)', 'pill-hepa', 'hub-hepa')" class="glass-card rounded-xl p-5 flex items-start text-left cursor-pointer group border-purple-500/40">
                        <div class="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg mr-4 shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-dna"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-1.5 mb-1">
                                <h4 class="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">Revised Original AIH Score</h4>
                                <span class="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded">IAHG 1999</span>
                            </div>
                            <p class="text-xs text-slate-400">Sistem skor diagnostik komprehensif Autoimmune Hepatitis pre- &amp; post-terapi (Alvarez 1999) berbasis serologi, rasio lab, &amp; histologi.</p>
                        </div>
                    </button>
                </div>
            </section>`;

// Replace end of hub-hepa cards container
const hubEndPattern = `                    <!-- Profil LFT & Protein RS -->[\\s\\S]*?</div>\\s*</section>`;
const hubMatch = content.match(new RegExp(hubEndPattern));
if (!hubMatch) {
    console.error('Could not match hub-hepa end pattern');
    process.exit(1);
}
// We will insert the card right before the closing </div></section> of hub-hepa
const lastLftCardEnd = `Fraksi Bilirubin (Direk/Indirek), Enzim Hepatoseluler & Kolestatik (ALP/GGT), serta Rasio A/G Protein terkalibrasi RS.</p>
                        </div>
                    </button>`;

content = content.replace(lastLftCardEnd, lastLftCardEnd + `\n` + `                    <!-- Revised Original AIH Score (IAHG 1999) -->
                    <button type="button" onclick="navigateTo('aih-module', 'Revised Original AIH Score (IAHG)', 'pill-hepa', 'hub-hepa')" class="glass-card rounded-xl p-5 flex items-start text-left cursor-pointer group border-purple-500/40">
                        <div class="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg mr-4 shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-dna"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-1.5 mb-1">
                                <h4 class="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">Revised Original AIH Score</h4>
                                <span class="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded">IAHG 1999</span>
                            </div>
                            <p class="text-xs text-slate-400">Sistem skor diagnostik komprehensif Autoimmune Hepatitis pre- &amp; post-terapi (Alvarez 1999) berbasis serologi, rasio lab, &amp; histologi.</p>
                        </div>
                    </button>`);

// 3. Module Section
const aihModuleHtml = `
            <!-- 2.12 Revised Original Score for Autoimmune Hepatitis (IAHG 1999) -->
            <section id="aih-module" class="module-section hidden">
                <div class="glass-panel rounded-2xl p-5 sm:p-6 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3 flex-wrap">
                        <button type="button" onclick="navigateTo('hub-hepa', 'Hepatology Hub', 'pill-hepa')" class="btn-back">
                            <i class="fa-solid fa-arrow-left"></i> Kembali ke Hepatology
                        </button>
                        <span class="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">Autoimmune Liver Disease</span>
                    </div>

                    <div class="mb-4">
                        <div class="flex items-center space-x-2">
                            <h2 class="text-xl sm:text-2xl font-bold text-white">Revised Original Score for Autoimmune Hepatitis (AIH)</h2>
                            <span class="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded">IAHG 1999</span>
                        </div>
                        <p class="text-slate-400 text-xs sm:text-sm mt-1">Sistem kriteria diagnostik komprehensif International Autoimmune Hepatitis Group (Alvarez et al., 1999) untuk konfirmasi diagnosis pasti (definite) atau kemungkinan (probable) AIH pada evaluasi pre- maupun post-terapi.</p>
                    </div>

                    <form id="aih-form" class="space-y-4">
                        <!-- 1. Demografi & Enzim Hepar -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center">
                                <i class="fa-solid fa-flask-vial mr-1.5"></i> 1. Demografi &amp; Rasio Enzim Hepar
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <label for="aih-sex" class="font-semibold text-slate-300 block mb-1">Jenis Kelamin (Sex) <span class="text-rose-400">*</span></label>
                                    <select id="aih-sex" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="female" selected>Wanita / Female (+2 poin)</option>
                                        <option value="male">Pria / Male (0 poin)</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">AIH predominan terjadi pada wanita (~70-80%).</span>
                                </div>

                                <div>
                                    <label for="aih-alp-ratio" class="font-semibold text-slate-300 block mb-1">Rasio ALP : AST atau ALP : ALT <span class="text-rose-400">*</span></label>
                                    <select id="aih-alp-ratio" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="<1.5" selected>&lt; 1.5 (+2 poin) — dominan hepatoselular</option>
                                        <option value="1.5-3.0">1.5 - 3.0 (0 poin) — intermediate / mixed</option>
                                        <option value=">3.0">&gt; 3.0 (-2 poin) — dominan kolestatik</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">Rasio ALP terhadap aminotransferase (ALT/AST).</span>
                                </div>

                                <div>
                                    <label for="aih-igg-level" class="font-semibold text-slate-300 block mb-1">Serum Globulin atau IgG (&times; Batas Atas Normal) <span class="text-rose-400">*</span></label>
                                    <select id="aih-igg-level" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value=">2.0">&gt; 2.0 &times; ULN (+3 poin)</option>
                                        <option value="1.5-2.0" selected>1.5 - 2.0 &times; ULN (+2 poin)</option>
                                        <option value="1.0-1.5">1.0 - 1.5 &times; ULN (+1 poin)</option>
                                        <option value="<1.0">&lt; 1.0 &times; ULN / Normal (0 poin)</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">Dihitung berdasarkan kelipatan nilai batas atas normal (ULN) lab.</span>
                                </div>
                            </div>

                            <!-- Optional Lab Quick Helper Accordion -->
                            <details class="text-xs bg-slate-800/40 rounded-lg p-3 border border-slate-700/40">
                                <summary class="font-semibold text-cyan-300 cursor-pointer hover:text-cyan-200 flex items-center justify-between">
                                    <span><i class="fa-solid fa-calculator mr-1"></i> Bantuan Hitung Rasio Otomatis dari Hasil Lab Angka (Opsional)</span>
                                    <span class="text-[10px] text-slate-400">Klik untuk buka/tutup</span>
                                </summary>
                                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 pt-2 border-t border-slate-700/50">
                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">ALP (U/L)</label>
                                        <input type="number" id="aih-calc-alp" placeholder="mis. 120" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">AST / SGOT (U/L)</label>
                                        <input type="number" id="aih-calc-ast" placeholder="mis. 180" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">ALT / SGPT (U/L)</label>
                                        <input type="number" id="aih-calc-alt" placeholder="mis. 210" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">IgG (mg/dL)</label>
                                        <input type="number" id="aih-calc-igg" placeholder="mis. 2400" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                    <div>
                                        <label class="text-[11px] text-slate-300 block mb-0.5">ULN IgG (mg/dL)</label>
                                        <input type="number" id="aih-calc-igg-uln" placeholder="mis. 1600" value="1600" class="glass-input w-full px-2 py-1.5 rounded text-xs">
                                    </div>
                                </div>
                                <div class="mt-2.5 flex items-center justify-between">
                                    <button type="button" onclick="autoCalcLabRatios()" class="glass-btn-secondary px-3 py-1 rounded text-[11px] font-semibold flex items-center">
                                        <i class="fa-solid fa-arrows-rotate mr-1"></i> Terapkan ke Dropdown Skoring
                                    </button>
                                    <span id="aih-lab-calc-hint" class="text-[11px] text-emerald-400"></span>
                                </div>
                            </details>
                        </div>

                        <!-- 2. Serologi & Penanda Viral -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                                <i class="fa-solid fa-shield-virus mr-1.5"></i> 2. Panel Autoantibodi &amp; Penanda Viral
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <label for="aih-main-ab" class="font-semibold text-slate-300 block mb-1">Titer ANA, SMA, atau Anti-LKM-1 <span class="text-rose-400">*</span></label>
                                    <select id="aih-main-ab" class="glass-input w-full px-3 py-2 rounded-lg text-sm" onchange="checkAihSeronegativeRule()">
                                        <option value=">1:80" selected>&gt; 1:80 (+3 poin)</option>
                                        <option value="1:80">1:80 (+2 poin)</option>
                                        <option value="1:40">1:40 (+1 poin)</option>
                                        <option value="<1:40">&lt; 1:40 / Seronegatif (0 poin)</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">Gunakan titer tertinggi di antara ANA, SMA, atau Anti-LKM-1.</span>
                                </div>

                                <div>
                                    <label for="aih-ama" class="font-semibold text-slate-300 block mb-1">Anti-Mitochondrial Antibody (AMA) <span class="text-rose-400">*</span></label>
                                    <select id="aih-ama" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="neg" selected>Negatif (0 poin)</option>
                                        <option value="pos">Positif (-4 poin) — mengarah ke PBC / Overlap</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">AMA positif kuat mengindikasikan Primary Biliary Cholangitis (PBC).</span>
                                </div>

                                <div>
                                    <label for="aih-viral-markers" class="font-semibold text-slate-300 block mb-1">Penanda Virus Hepatitis (HAV, HBV, HCV)¹ <span class="text-rose-400">*</span></label>
                                    <select id="aih-viral-markers" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="neg" selected>Negatif (+3 poin) — etiologi viral tersingkirkan</option>
                                        <option value="pos">Positif (-3 poin) — ditemukan penanda infeksi virus</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">¹Termasuk IgM anti-HAV, HBsAg, IgM anti-HBc, anti-HCV / HCV-RNA.</span>
                                </div>
                            </div>
                        </div>

                        <!-- 3. Riwayat Klinis, Obat, & Alkohol -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center">
                                <i class="fa-solid fa-notes-medical mr-1.5"></i> 3. Riwayat Klinis, Obat, &amp; Gaya Hidup
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <label for="aih-drugs" class="font-semibold text-slate-300 block mb-1">Penggunaan Obat Hepatotoksik Baru/Aktif <span class="text-rose-400">*</span></label>
                                    <select id="aih-drugs" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="no" selected>Tidak ada (+1 poin)</option>
                                        <option value="yes">Ya, ada riwayat obat hepatotoksik (-4 poin)</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">Obat-obatan pencetus DILI (mis. nitrofurantoin, minocycline, augmentin).</span>
                                </div>

                                <div>
                                    <label for="aih-alcohol" class="font-semibold text-slate-300 block mb-1">Rata-rata Konsumsi Alkohol Harian <span class="text-rose-400">*</span></label>
                                    <select id="aih-alcohol" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="<25" selected>&lt; 25 g/hari (+2 poin) — minimal / tidak minum</option>
                                        <option value="25-60">25 - 60 g/hari (0 poin) — sedang</option>
                                        <option value=">60">&gt; 60 g/hari (-2 poin) — berat</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">1 unit standar minuman beralkohol ≈ 10-12 g etanol.</span>
                                </div>

                                <div>
                                    <label for="aih-other-autoimmune" class="font-semibold text-slate-300 block mb-1">Penyakit Autoimun Lain pada Pasien / Kerabat Tk.1² <span class="text-rose-400">*</span></label>
                                    <select id="aih-other-autoimmune" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="no" selected>Tidak ada (0 poin)</option>
                                        <option value="yes">Ada (+2 poin)</option>
                                    </select>
                                    <span class="text-[10px] text-slate-400 mt-1 block">²Mis. tiroiditis Hashimoto, Graves, DM Tipe 1, Celiac, IBD, vitiligo.</span>
                                </div>
                            </div>
                        </div>

                        <!-- 4. Histopatologi Biopsi Hepar -->
                        <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                            <div class="flex items-center justify-between flex-wrap gap-2">
                                <h4 class="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-microscope mr-1.5"></i> 4. Temuan Histopatologi Biopsi Hepar
                                </h4>
                                <div class="flex items-center space-x-2">
                                    <label for="aih-biopsy-done" class="text-xs text-slate-300 font-semibold">Status Biopsi:</label>
                                    <select id="aih-biopsy-done" class="glass-input px-2.5 py-1 rounded text-xs" onchange="toggleAihBiopsySection()">
                                        <option value="yes" selected>Biopsi Dilakukan (Evaluasi Temuan)</option>
                                        <option value="no">Biopsi Belum Dilakukan / Pending (0 poin)</option>
                                    </select>
                                </div>
                            </div>

                            <div id="aih-biopsy-inputs" class="space-y-2 pt-2 border-t border-slate-800">
                                <p class="text-xs text-slate-300 mb-2">Pilih semua gambaran patologi yang ditemukan pada spesimen biopsi:</p>
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-purple-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-hist-interface" checked class="mt-0.5 rounded border-slate-600 text-purple-600 focus:ring-purple-500">
                                        <div>
                                            <span class="font-bold text-white block">Interface Hepatitis (+3)</span>
                                            <span class="text-[11px] text-slate-400">Piecemeal necrosis pada batas limiting plate porta.</span>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-purple-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-hist-lympho" checked class="mt-0.5 rounded border-slate-600 text-purple-600 focus:ring-purple-500">
                                        <div>
                                            <span class="font-bold text-white block">Infiltrat Limfoplasmamositik (+1)</span>
                                            <span class="text-[11px] text-slate-400">Predominan sel plasma dan limfosit pada traktus porta.</span>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-purple-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-hist-rosettes" class="mt-0.5 rounded border-slate-600 text-purple-600 focus:ring-purple-500">
                                        <div>
                                            <span class="font-bold text-white block">Hepatic Rosettes (+1)</span>
                                            <span class="text-[11px] text-slate-400">Pseudoroset atau susunan roset hepatosit yang meregenerasi.</span>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-rose-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-hist-biliary" class="mt-0.5 rounded border-slate-600 text-rose-600 focus:ring-rose-500">
                                        <div>
                                            <span class="font-bold text-rose-300 block">Perubahan Bilier (-3)</span>
                                            <span class="text-[11px] text-slate-400">Lesi duktus biliaris khas PBC/PSC, reaksi duktular periportal dg akumulasi copper.</span>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-rose-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-hist-other" class="mt-0.5 rounded border-slate-600 text-rose-600 focus:ring-rose-500">
                                        <div>
                                            <span class="font-bold text-rose-300 block">Etiologi Lain yang Menonjol (-3)</span>
                                            <span class="text-[11px] text-slate-400">Steatohepatitis, granuloma, badan Mallory-Denk, deposisi besi masif.</span>
                                        </div>
                                    </label>
                                </div>
                                <div class="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg mt-1">
                                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> <strong>Aturan Histologi Alvarez 1999:</strong> Jika biopsi dilakukan namun ketiga tanda khas AIH (Interface hepatitis, Infiltrat limfoplasmamositik, dan Rosetting) semuanya <strong>tidak ditemukan</strong>, sistem otomatis memberikan penalti <strong>-5 poin</strong>.
                                </div>
                            </div>
                        </div>

                        <!-- 5. Parameter Tambahan & Respon Terapi -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Parameter Tambahan Opsional -->
                            <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                                <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-dna mr-1.5"></i> 5. Parameter Tambahan Opsional³
                                </h4>
                                <p class="text-[11px] text-slate-400">
                                    ³<strong>Konsensus IAHG:</strong> Parameter berikut dialokasikan poin terutama jika pasien seronegatif untuk antibodi konvensional (ANA, SMA, LKM-1 &lt; 1:40).
                                </p>
                                <div class="space-y-2 text-xs">
                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-cyan-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-other-abs" class="mt-0.5 rounded border-slate-600 text-cyan-600 focus:ring-cyan-500">
                                        <div>
                                            <span class="font-semibold text-white block">Autoantibodi Spesifik Terdefinisi Lainnya (+2 poin)⁴</span>
                                            <span class="text-[11px] text-slate-400">⁴Termasuk seropositif untuk pANCA, anti-LC1, anti-SLA/LP, anti-ASGPR, anti-sulfatide.</span>
                                        </div>
                                    </label>

                                    <label class="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-cyan-500/50 cursor-pointer transition">
                                        <input type="checkbox" id="aih-hla-dr" class="mt-0.5 rounded border-slate-600 text-cyan-600 focus:ring-cyan-500">
                                        <div>
                                            <span class="font-semibold text-white block">Genotipe HLA-DR3 atau HLA-DR4 (+1 poin)</span>
                                            <span class="text-[11px] text-slate-400">Faktor predisposisi genetik lokus HLA klas II terbukti positif.</span>
                                        </div>
                                    </label>
                                </div>
                                <div id="aih-seronegative-alert" class="hidden text-[11px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg">
                                    <i class="fa-solid fa-circle-info mr-1"></i> Pasien terdeteksi seronegatif konvensional (ANA/SMA/LKM-1 &lt; 1:40). Penambahan parameter opsional sangat relevan untuk diagnosis AIH seronegatif.
                                </div>
                            </div>

                            <!-- Respon Terapi (Post-treatment) -->
                            <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-3">
                                <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                                    <i class="fa-solid fa-pills mr-1.5"></i> 6. Fase Evaluasi &amp; Respon Terapi
                                </h4>
                                <div class="text-xs">
                                    <label for="aih-therapy-response" class="font-semibold text-slate-300 block mb-1">Evaluasi Terapi Kortikosteroid / Imunosupresif <span class="text-rose-400">*</span></label>
                                    <select id="aih-therapy-response" class="glass-input w-full px-3 py-2 rounded-lg text-sm">
                                        <option value="none" selected>Evaluasi Pre-Treatment (Belum Diterapi / Evaluasi Awal) (0 poin)</option>
                                        <option value="complete">Post-Treatment: Respon Lengkap / Complete Remission (+2 poin)</option>
                                        <option value="relapse">Post-Treatment: Terjadi Relaps Pasca Penghentian/Tapering (+3 poin)</option>
                                    </select>
                                </div>
                                <div class="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40 text-[11px] text-slate-300 space-y-1">
                                    <span class="font-bold text-white block"><i class="fa-solid fa-scale-balanced mr-1 text-cyan-400"></i> Nilai Ambang Batas Diagnostik (Cutoff):</span>
                                    <div>• <strong>Pre-treatment:</strong> &gt; 15 (Definite), 10 - 15 (Probable), &lt; 10 (Unlikely)</div>
                                    <div>• <strong>Post-treatment:</strong> &gt; 17 (Definite), 12 - 17 (Probable), &lt; 12 (Unlikely)</div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-2 flex flex-wrap items-center gap-2">
                            <button type="button" onclick="calculateAihScore()" class="glass-btn px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center">
                                <i class="fa-solid fa-calculator mr-2"></i> Hitung Skor AIH Revisi
                            </button>
                            <button type="button" onclick="resetAihScore()" class="glass-btn-secondary px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white flex items-center">
                                <i class="fa-solid fa-rotate-left mr-1.5"></i> Reset Form
                            </button>
                        </div>
                    </form>

                    <!-- Result Container -->
                    <div id="aih-result-container" class="hidden mt-6"></div>

                    <!-- Evidence & Citation -->
                    <div class="mt-8 pt-4 border-t border-slate-800 text-xs">
                        <div class="flex items-center text-cyan-400 font-semibold mb-2">
                            <i class="fa-solid fa-book-medical mr-2"></i> Evidence &amp; Guidelines Citation
                        </div>
                        <p class="text-slate-300">
                            <strong>Alvarez F, Berg PA, Bianchi FB, et al.</strong> International Autoimmune Hepatitis Group Report: review of criteria for diagnosis of autoimmune hepatitis. <em>Journal of Hepatology</em>. 1999;31(5):929-938.
                        </p>
                        <a href="https://www.journal-of-hepatology.eu/article/S0168-8278(99)80297-9/fulltext" target="_blank" rel="noopener" class="inline-flex items-center text-cyan-400 hover:underline mt-2 mr-4">
                            <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i> Journal of Hepatology Full Text
                        </a>
                        <div class="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-400 text-[11px] leading-relaxed">
                            <strong class="text-slate-200">Evidence Appraisal:</strong> Skor konvensional IAHG 1999 telah divalidasi luas pada populasi hepatologi rujukan tersier global. Dengan cakupan parameter biokimia, serologi, dan histologi yang komprehensif, skor ini mengodifikasi pendekatan diagnostik formal terstandar. Skor ini sangat bernilai pada kasus kompleks atau seronegatif, namun memiliki spesifisitas yang lebih moderat pada kategori <em>'Probable AIH'</em> (risiko false positive terhadap DILI atau varian kolestatik). Pada praktik klinis sehari-hari, skor ini melengkapi kriteria sederhana <em>Simplified AIH Criteria (Hennes et al., 2008)</em>.
                        </div>
                    </div>
                </div>
            </section>
`;

const lftSectionEnd = `                        <p class="text-slate-300"><strong>ACG Clinical Guideline (2017):</strong> Evaluation of Abnormal Liver Chemistries (Kwo PY, Cohen SM, Lim JK). <em>Am J Gastroenterol</em>. 2017;112(1):18-35. Fraksi bilirubin direk &gt;50% mengonfirmasi hiperbilirubinemia terkonjugasi/kolestatik. Rasio A/G &lt;1.0 (reversal) merupakan penanda penurunan fungsi sintesis hepatik kronis dan hipergamaglobulinemia poliklonal pada sirosis hepar.</p>
                    </div>
                </div>
            </section>`;

content = content.replace(lftSectionEnd, lftSectionEnd + `\n` + aihModuleHtml);

// 4. Update CALCULATORS_DB
const aihDbEntry = `            { id: 'aih-module', name: 'Revised Original AIH Score (IAHG 1999)', category: 'Hepatology', color: 'amber', pillId: 'pill-hepa', hubId: 'hub-hepa', desc: 'Skor komprehensif IAHG (Alvarez 1999) untuk diagnosis Autoimmune Hepatitis pre- & post-terapi.', keywords: ['aih', 'autoimmune hepatitis', 'hepatitis autoimun', 'alvarez', 'iahg', 'ana', 'sma', 'lkm-1', 'ama', 'igg', 'globulin', 'biopsi hati'] },\n`;
content = content.replace(`            // Hepatology (11)\n`, `            // Hepatology (12)\n` + aihDbEntry);

// 5. Add JavaScript functions right before universal reset
const aihJsCode = `
        // ==========================================
        // 2.12 REVISED ORIGINAL SCORE FOR AUTOIMMUNE HEPATITIS (AIH) - IAHG 1999
        // ==========================================

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
            const igg = parseFloat(document.getElementById('aih-calc-igg').value);
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
            }

            if (appliedList.length > 0) {
                hint.innerText = \`Berhasil diterapkan: \${appliedList.join(' | ')}\`;
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
                    pts: (histPts > 0 ? \`+\${histPts}\` : \`\${histPts}\`)
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
                \`======================================================================\`,
                \`[adjusterGEH] REVISED ORIGINAL SCORE FOR AUTOIMMUNE HEPATITIS (AIH)\`,
                \`International Autoimmune Hepatitis Group (IAHG / Alvarez et al., 1999)\`,
                \`======================================================================\`,
                \`FASE EVALUASI      : \${phaseText}\`,
                \`TOTAL SKOR AIH     : \${score} poin\`,
                \`KATEGORI DIAGNOSIS : \${category.toUpperCase()}\`,
                \`----------------------------------------------------------------------\`,
                \`RINCIAN SKORING PARAMETER:\`,
                ...pointBreakdown.map(b => \`• \${b.param.padEnd(30, ' ')} : \${b.val} [\${b.pts} poin]\`),
                \`----------------------------------------------------------------------\`,
                \`INTERPRETASI KLINIS:\`,
                clinicalSummary,
                \`\`,
                \`REKOMENDASI TATALAKSANA (AASLD/EASL):\`,
                rxAdvice,
                \`======================================================================\`
            ];
            const resumeText = resumeLines.join('\\n');

            const res = document.getElementById('aih-result-container');
            res.innerHTML = \`
                <div class="p-5 rounded-2xl bg-\${color}-900/30 border border-\${color}-500/50 shadow-xl space-y-4">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-\${color}-500/30 pb-3">
                        <div>
                            <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-\${color}-500/20 text-\${color}-300 border border-\${color}-500/40">
                                \${phaseText}
                            </span>
                            <h3 class="text-xl sm:text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
                                <span>\${category}</span>
                            </h3>
                            <p class="text-xs text-slate-300 mt-1">\${clinicalSummary}</p>
                        </div>
                        <div class="text-left sm:text-right shrink-0">
                            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Skor Total AIH</span>
                            <span class="text-3xl sm:text-4xl font-black text-white font-mono">\${score}</span>
                            <span class="text-xs text-slate-400 block">poin</span>
                        </div>
                    </div>

                    <!-- Cutoff Criteria Guide -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                        <div>
                            <span class="font-bold text-slate-300 block mb-1">Ambang Pre-Treatment:</span>
                            <span class="\${!isPostTx && score > 15 ? 'text-emerald-400 font-bold' : 'text-slate-400'}">• &gt; 15 : Definite AIH</span><br>
                            <span class="\${!isPostTx && score >= 10 && score <= 15 ? 'text-amber-400 font-bold' : 'text-slate-400'}">• 10 - 15 : Probable AIH</span><br>
                            <span class="\${!isPostTx && score < 10 ? 'text-rose-400 font-bold' : 'text-slate-400'}">• &lt; 10 : Unlikely AIH</span>
                        </div>
                        <div>
                            <span class="font-bold text-slate-300 block mb-1">Ambang Post-Treatment:</span>
                            <span class="\${isPostTx && score > 17 ? 'text-emerald-400 font-bold' : 'text-slate-400'}">• &gt; 17 : Definite AIH</span><br>
                            <span class="\${isPostTx && score >= 12 && score <= 17 ? 'text-amber-400 font-bold' : 'text-slate-400'}">• 12 - 17 : Probable AIH</span><br>
                            <span class="\${isPostTx && score < 12 ? 'text-rose-400 font-bold' : 'text-slate-400'}">• &lt; 12 : Unlikely AIH</span>
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
                                \${pointBreakdown.map(b => \`
                                    <tr>
                                        <td class="py-1.5 px-3 text-slate-300 font-medium">\${b.param}</td>
                                        <td class="py-1.5 px-3 text-slate-400">\${b.val}</td>
                                        <td class="py-1.5 px-3 font-mono font-bold text-right \${b.pts.startsWith('+') ? 'text-emerald-400' : (b.pts.startsWith('-') ? 'text-rose-400' : 'text-slate-400')}">\${b.pts}</td>
                                    </tr>
                                \`).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Clinical Recommendation -->
                    <div class="p-3.5 rounded-xl bg-\${color}-950/40 border border-\${color}-500/30 text-xs">
                        <h4 class="font-bold text-white mb-1.5 flex items-center">
                            <i class="fa-solid fa-notes-medical mr-1.5 text-\${color}-400"></i> Rekomendasi Tatalaksana Klinis (AASLD / EASL)
                        </h4>
                        <p class="text-slate-200 leading-relaxed">\${rxAdvice}</p>
                    </div>

                    <!-- Copy Button -->
                    <div class="flex items-center justify-between pt-2 border-t border-\${color}-500/20 flex-wrap gap-2">
                        <span class="text-[11px] text-slate-400">
                            <i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> Format resume siap disalin ke Rekam Medis (EMR)
                        </span>
                        <button type="button" onclick="copyToClipboard(\\\`\${resumeText.replace(/\\\\\`/g, '\\\\\\\\\`').replace(/"/g, '&quot;')}\\\`)" class="glass-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center">
                            <i class="fa-regular fa-copy mr-1.5"></i> Salin Resume AIH
                        </button>
                    </div>
                </div>
            \`;
            res.classList.remove('hidden');
            res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function resetAihScore() {
            const form = document.getElementById('aih-form');
            if (form) form.reset();
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
`;

// Insert the JavaScript code right before `// Universal Module Reset`
content = content.replace(`        // Universal Module Reset`, aihJsCode + `\n        // Universal Module Reset`);

// Also update resetGehModule to handle aih-form
content = content.replace(`if (formId === 'gbs-form') {`, `if (formId === 'aih-form') {
                resetAihScore();
                return;
            } else if (formId === 'gbs-form') {`);

fs.writeFileSync('adjustr-GEH.html', content, 'utf8');
console.log('Successfully updated adjustr-GEH.html!');
