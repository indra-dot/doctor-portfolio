const fs = require('fs');
const path = require('path');

console.log("Writing part3: tab-emergencies...");

const part3 = `
            <!-- ================= MODULE 3: EMERGENCIES & METABOLIC ================= -->
            <section id="tab-emergencies" class="module-section hidden space-y-6 md:space-y-8">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>

                <!-- Grid Baris 1: Osmolaritas & Anion Gap + Delta Gap -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  
                  <!-- 1. Effective Serum Osmolarity -->
                  <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between" id="card-osmo">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
                        <div>
                          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                            Effective Serum Osmolarity
                            <span class="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">Tonicity</span>
                          </h2>
                          <p class="text-xs text-slate-400 mt-0.5">Penilaian tonisitas efektif krisis hiperglikemia (HHS vs DKA).</p>
                        </div>
                        
                        <div class="flex items-center gap-2.5">
                          <div class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            <button type="button" onclick="togglePin('osmo')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                              <i class="fa-regular fa-star text-xs star-icon" id="star-osmo"></i>
                            </button>
                            <button type="button" onclick="resetCalculator('osmo')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                              <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                            </button>
                            <button type="button" onclick="copyCPPTResume('osmo')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition" title="Salin CPPT">
                              <i class="fa-solid fa-clipboard-list text-xs"></i>
                            </button>
                          </div>

                          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 shrink-0 text-right min-w-[100px]">
                            <div class="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight leading-none" id="res-osmo">-</div>
                            <div class="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold">mOsm/kg</div>
                          </div>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Natrium Terukur [mEq/L]</label>
                          <input type="number" id="osmo-na" class="input-modern" placeholder="e.g. 140">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Glukosa Darah [mg/dL]</label>
                          <input type="number" id="osmo-glu" class="input-modern" placeholder="e.g. 600">
                        </div>
                      </div>
                    </div>
                    
                    <div class="pearl-box !border-amber-500 !bg-gradient-to-r !from-amber-500/10 !to-transparent mt-5">
                      <p class="text-[13px] text-slate-300 mb-2"><span class="text-amber-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl: Tonisitas</span> Penurunan kesadaran (obtundasi/koma) pada krisis hiperglikemia berkorelasi langsung dengan osmolaritas efektif (&gt; 320 mOsm/kg), bukan kadar gula darah absolut. Tonisitas mengecualikan BUN karena urea bebas menembus membran sel.</p>
                      <p class="text-[13px] text-slate-300"><span class="text-amber-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Next Step</span> Resusitasi cairan kristaloid isotonik agresif (NaCl 0.9% 15-20 mL/kg/jam) adalah prioritas pertama sebelum inisiasi insulin pada HHS untuk mencegah kolaps vaskular.</p>
                    </div>
                  </div>

                  <!-- 2. Anion Gap, Corrected Na, Delta Gap & Delta Ratio (Integrated) -->
                  <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between" id="card-ag">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
                        <div>
                          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                            Anion Gap & Delta Ratio
                            <span class="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Acid-Base</span>
                          </h2>
                          <p class="text-xs text-slate-400 mt-0.5">Asidosis metabolik, pseudohiponatremia & gangguan campuran.</p>
                        </div>

                        <div class="flex items-center gap-2">
                          <div class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            <button type="button" onclick="togglePin('ag')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                              <i class="fa-regular fa-star text-xs star-icon" id="star-ag"></i>
                            </button>
                            <button type="button" onclick="resetCalculator('ag')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                              <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                            </button>
                            <button type="button" onclick="copyCPPTResume('ag')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition" title="Salin CPPT">
                              <i class="fa-solid fa-clipboard-list text-xs"></i>
                            </button>
                          </div>

                          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1.5 shrink-0 flex items-center gap-2.5">
                            <div class="text-right">
                              <span class="text-[9px] text-slate-400 uppercase font-semibold block">AG</span>
                              <span class="text-lg sm:text-xl font-extrabold text-emerald-400 tracking-tight leading-none" id="res-ag">-</span>
                            </div>
                            <div class="h-6 w-px bg-slate-800"></div>
                            <div class="text-right">
                              <span class="text-[9px] text-slate-400 uppercase font-semibold block">cNa</span>
                              <span class="text-lg sm:text-xl font-extrabold text-cyan-400 tracking-tight leading-none" id="res-cna">-</span>
                            </div>
                            <div class="h-6 w-px bg-slate-800"></div>
                            <div class="text-right">
                              <span class="text-[9px] text-slate-400 uppercase font-semibold block">Δ Ratio</span>
                              <span class="text-lg sm:text-xl font-extrabold text-amber-400 tracking-tight leading-none" id="res-delta-ratio">-</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">Na [mEq/L]</label>
                          <input type="number" id="ag-na" class="input-modern" placeholder="140">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">Cl [mEq/L]</label>
                          <input type="number" id="ag-cl" class="input-modern" placeholder="100">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">HCO3 [mEq/L]</label>
                          <input type="number" id="ag-hco3" class="input-modern" placeholder="24">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">Glukosa [mg/dL]</label>
                          <input type="number" id="ag-glu" class="input-modern" placeholder="250">
                        </div>
                      </div>

                      <!-- Delta Ratio Interpretation Card -->
                      <div class="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                        <div class="flex items-center justify-between text-slate-300">
                          <span>Delta Gap (ΔAG = AG - 12): <strong id="res-delta-gap" class="text-emerald-400">-</strong></span>
                          <span>Delta HCO3 (24 - HCO3): <strong id="res-delta-hco3" class="text-cyan-400">-</strong></span>
                        </div>
                        <div class="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-300" id="res-delta-interp">
                          Masukkan nilai Na, Cl, dan HCO3 untuk melihat interpretasi asam-basa campuran.
                        </div>
                      </div>
                    </div>
                    
                    <div class="pearl-box mt-5">
                      <p class="text-[13px] text-slate-300 leading-relaxed"><span class="text-emerald-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl: Delta Ratio (ΔAG / ΔHCO3)</span> 
                      <strong>&lt; 0.8:</strong> High AG Acidosis + Bersamaan NAGMA (Hyperchloremic Acidosis, umum pasca resusitasi kristaloid NaCl 0.9% masif); 
                      <strong>0.8 - 2.0:</strong> Pure High AG Acidosis murni (DKA, Asidosis Laktat); 
                      <strong>&gt; 2.0:</strong> High AG Acidosis + Bersamaan Alkalosis Metabolik (misal muntah berulang) atau retensi bikarbonat kronis.</p>
                    </div>
                  </div>
                </div>

                <!-- 3. DKA Severity & Resolution Tracker (ADA / ISPAD) [NEW] -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 lg:p-8" id="card-dka-tracker">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 flex-wrap">
                        DKA Severity & Resolution Tracker
                        <span class="text-[11px] bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-medium tracking-wide">ADA / ISPAD Consensus</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-slate-400 mt-1">Stratifikasi keparahan ketoasidosis diabetikum & checklist kriteria konversi/resolusi.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="togglePin('dka-tracker')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                          <i class="fa-regular fa-star text-xs star-icon" id="star-dka-tracker"></i>
                        </button>
                        <button type="button" onclick="resetCalculator('dka-tracker')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                          <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                        </button>
                        <button type="button" onclick="copyCPPTResume('dka-tracker')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5" title="Salin Resume SOAP / CPPT">
                          <i class="fa-solid fa-clipboard-list text-xs"></i>
                          <span>Salin CPPT</span>
                        </button>
                      </div>

                      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 shrink-0 min-w-[150px]">
                        <div class="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight leading-none" id="res-dka-severity">-</div>
                        <div class="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 sm:mt-1.5 text-right" id="res-dka-res-status">Belum Resolusi</div>
                      </div>
                    </div>
                  </div>

                  <!-- Safety Guardrail Banner for Kalium -->
                  <div id="guardrail-dka" class="guardrail-box hidden mb-5">
                    <div class="flex items-start gap-3">
                      <i class="fa-solid fa-triangle-exclamation text-rose-400 text-lg mt-0.5 animate-pulse"></i>
                      <div>
                        <h4 class="text-xs font-bold text-rose-300 uppercase tracking-wider">CRITICAL CLINICAL GUARDRAIL: HYPOKALEMIA</h4>
                        <p class="text-xs text-slate-200 mt-0.5 leading-relaxed">
                          <strong>KADAR KALIUM &lt; 3.5 mEq/L:</strong> <strong>TUNDA INFUS INSULIN!</strong> Insulin mendorong kalium masuk ke intraseluler dan dapat memicu aritmia ventrikel fatal atau henti jantung mendadak. <strong>Koreksi KCl 20 - 30 mEq/jam</strong> dalam cairan infus hingga Kalium &gt; 3.5 mEq/L sebelum memulai insulin!
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Input parameter DKA -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">pH Darah (Vena / Arteri)</label>
                      <input type="number" id="dka-ph" step="0.01" class="input-modern dka-input" placeholder="e.g. 7.15">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Serum Bikarbonat / HCO3 (mEq/L)</label>
                      <input type="number" id="dka-hco3" step="0.5" class="input-modern dka-input" placeholder="e.g. 11.0">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">GDS Aktual (mg/dL)</label>
                      <input type="number" id="dka-glu" class="input-modern dka-input" placeholder="e.g. 380">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Status Mental / Kesadaran</label>
                      <select id="dka-mental" class="input-modern dka-input">
                        <option value="alert">Alert / Compos Mentis</option>
                        <option value="drowsy">Drowsy / Mengantuk / Somnolen</option>
                        <option value="stupor">Stupor / Koma</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Anion Gap (mEq/L)</label>
                      <input type="number" id="dka-ag" class="input-modern dka-input" placeholder="e.g. 20 (atau hitung di modul AG)">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Serum Kalium (mEq/L) [Guardrail Check]</label>
                      <input type="number" id="dka-k" step="0.1" class="input-modern dka-input" placeholder="e.g. 4.2">
                    </div>
                  </div>

                  <!-- Resolution Criteria Display -->
                  <div class="mt-5 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                    <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Kriteria Resolusi DKA (Konsensus ADA)</span>
                      <span id="dka-resolution-badge" class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">Belum Terpenuhi</span>
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      <div id="crit-glu" class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400">
                        1. GDS &lt; 200 mg/dL <span class="float-right" id="ico-crit-glu"><i class="fa-solid fa-clock"></i></span>
                      </div>
                      <div id="crit-hco3" class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400">
                        2. HCO3 &ge; 18 mEq/L <span class="float-right" id="ico-crit-hco3"><i class="fa-solid fa-clock"></i></span>
                      </div>
                      <div id="crit-ph" class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400">
                        3. Venous pH &gt; 7.30 <span class="float-right" id="ico-crit-ph"><i class="fa-solid fa-clock"></i></span>
                      </div>
                      <div id="crit-ag" class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400">
                        4. Anion Gap &le; 12 mEq/L <span class="float-right" id="ico-crit-ag"><i class="fa-solid fa-clock"></i></span>
                      </div>
                    </div>
                    <div class="mt-3 text-[11px] text-slate-400 italic">
                      *Resolusi DKA tercapai jika GDS &lt; 200 mg/dL PLUS minimal 2 dari: HCO3 &ge; 18, pH &gt; 7.30, atau Anion Gap normal. Pasien siap transisi ke regimen insulin subkutan (Bridging).
                    </div>
                  </div>

                  <div class="pearl-box !border-rose-500 !bg-gradient-to-r !from-rose-500/10 !to-transparent mt-5">
                    <p class="text-[13px] text-slate-300"><span class="text-rose-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Panduan Cairan Dekstrosa</span> Saat GDS turun di bawah 200-250 mg/dL pada DKA, <strong>segera tambahkan Dextrose 5% atau 10% ke dalam cairan infus</strong> sementara drip insulin dilanjutkan (titrasi ke 0.02 - 0.05 U/kg/jam) untuk menyelesaikan pembersihan ketonemia tanpa menimbulkan hipoglikemia iatrogenik.</p>
                  </div>
                </div>

                <!-- 4. Koreksi Hipoglikemia Berat (PERKENI & Rumus 30) [NEW] -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 lg:p-8" id="card-hypoglycemia">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 flex-wrap">
                        Koreksi Hipoglikemia Berat
                        <span class="text-[11px] bg-red-500/10 border border-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full font-medium tracking-wide">Protokol PERKENI & Rumus 30</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-slate-400 mt-1">Dosis bolus Dextrose 40%, cairan rumatan (maintenance), dan target gula darah aman.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="togglePin('hypoglycemia')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                          <i class="fa-regular fa-star text-xs star-icon" id="star-hypoglycemia"></i>
                        </button>
                        <button type="button" onclick="resetCalculator('hypoglycemia')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                          <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                        </button>
                        <button type="button" onclick="copyCPPTResume('hypoglycemia')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5" title="Salin Resume SOAP / CPPT">
                          <i class="fa-solid fa-clipboard-list text-xs"></i>
                          <span>Salin CPPT</span>
                        </button>
                      </div>

                      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 shrink-0 min-w-[150px]">
                        <div class="text-3xl sm:text-4xl font-extrabold text-red-400 tracking-tight leading-none" id="res-hypo-flakon">-</div>
                        <div class="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 sm:mt-1.5 text-right" id="res-hypo-interp">Flakon D40%</div>
                      </div>
                    </div>
                  </div>

                  <!-- Safety Guardrail for Unconscious Hypoglycemia -->
                  <div id="guardrail-hypo" class="guardrail-box hidden mb-5">
                    <div class="flex items-start gap-3">
                      <i class="fa-solid fa-triangle-exclamation text-rose-400 text-lg mt-0.5 animate-pulse"></i>
                      <div>
                        <h4 class="text-xs font-bold text-rose-300 uppercase tracking-wider">SAFETY GUARDRAIL: PASIEN PENURUNAN KESADARAN</h4>
                        <p class="text-xs text-slate-200 mt-0.5 leading-relaxed">
                          <strong>KONTRAINDIKASI PEMBERIAN AIR GULA / ORAL:</strong> Risiko tinggi aspirasi masif ke paru! Segera pasang akses IV untuk bolus D40% IV atau berikan <strong>Glukagon 1 mg IM / SC</strong> jika akses vena sulit didapat.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">GDS Aktual Pasien [mg/dL]</label>
                        <input type="number" id="hypo-gds" class="input-modern hypo-input" placeholder="e.g. 42">
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Target GDS yang Diinginkan [mg/dL]</label>
                        <input type="number" id="hypo-target" class="input-modern hypo-input" value="100">
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Tingkat Kesadaran Pasien</label>
                        <select id="hypo-conscious" class="input-modern hypo-input">
                          <option value="conscious">Sadar Penuh (Bisa Menelan)</option>
                          <option value="unconscious" selected>Penurunan Kesadaran / Tidak Sadar / Mengantuk Berat</option>
                        </select>
                      </div>
                    </div>

                    <div class="p-5 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 class="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                          <i class="fa-solid fa-check-double mr-1.5"></i> Rekomendasi Terapi Berbasis Algoritma
                        </h3>
                        
                        <div class="space-y-2 text-xs text-slate-300">
                          <div class="flex justify-between border-b border-slate-800/80 pb-1.5">
                            <span>1. Dosis Bolus PERKENI:</span>
                            <strong id="hypo-perkeni-desc" class="text-white">-</strong>
                          </div>
                          <div class="flex justify-between border-b border-slate-800/80 pb-1.5">
                            <span>2. Hitungan Rumus 30 Presisi:</span>
                            <strong id="hypo-rumus30-desc" class="text-amber-300">-</strong>
                          </div>
                          <div class="flex justify-between border-b border-slate-800/80 pb-1.5">
                            <span>3. Cairan Rumatan (Maintenance):</span>
                            <strong class="text-emerald-400">IVFD Dextrose 10% / D5% 20 tpm</strong>
                          </div>
                          <div class="flex justify-between pb-1">
                            <span>4. Evaluasi Ulang GDS:</span>
                            <strong class="text-cyan-400">Cek tiap 15 - 30 menit</strong>
                          </div>
                        </div>
                      </div>

                      <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                        1 flakon D40% (25 cc) berisi 10 gram dekstrosa murni, mengestimasikan kenaikan gula darah rerata 30 mg/dL (Rumus 30).
                      </div>
                    </div>
                  </div>

                  <div class="pearl-box !border-red-500 !bg-gradient-to-r !from-red-500/10 !to-transparent mt-5">
                    <p class="text-[13px] text-slate-300"><span class="text-red-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Rule of 15 (Untuk Pasien Sadar Ringan)</span> Jika pasien sadar dan GDS 50-70 mg/dL: Berikan 15-20 gram karbohidrat cepat serap per oral (1 sendok makan gula larut dalam air atau 1/2 cangkir jus buah), tunggu 15 menit, lalu cek ulang GDS (Rule of 15).</p>
                  </div>
                </div>

                <!-- 5. Insulin Basal-Bolus TDD -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 lg:p-8" id="card-insulin-tdd">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 flex-wrap">
                        Insulin Basal-Bolus TDD
                        <span class="text-[11px] bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-medium tracking-wide">Physiologic Dosing</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-slate-400 mt-1">Distribusi dosis harian total (TDD) fisiologis berbasis berat badan.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="togglePin('insulin-tdd')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                          <i class="fa-regular fa-star text-xs star-icon" id="star-insulin-tdd"></i>
                        </button>
                        <button type="button" onclick="resetCalculator('insulin-tdd')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                          <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                        </button>
                        <button type="button" onclick="copyCPPTResume('insulin-tdd')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5" title="Salin Resume SOAP / CPPT">
                          <i class="fa-solid fa-clipboard-list text-xs"></i>
                          <span>Salin CPPT</span>
                        </button>
                      </div>

                      <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center min-w-[150px]">
                        <div class="text-3xl sm:text-4xl font-extrabold text-rose-400 tracking-tight leading-none" id="res-tdd">-</div>
                        <div class="text-[11px] sm:text-xs text-slate-400 font-semibold mt-1 sm:mt-1.5 uppercase tracking-wide text-right">Total Units / Day</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Berat Badan Pasien (kg)</label>
                        <input type="number" id="ins-wt" class="input-modern" placeholder="e.g. 70">
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Faktor Pengali TDD (Units/kg)</label>
                        <select id="ins-factor" class="input-modern">
                          <option value="0.3">0.3 (Sensitif / Geriatri / CKD / Dialisis)</option>
                          <option value="0.4">0.4 (Diabetes Awitan Baru / Normal weight)</option>
                          <option value="0.5" selected>0.5 (Standar Dewasa Rawat Inap)</option>
                          <option value="0.6">0.6 (Resisten Insulin / Obesitas)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="bg-slate-900/40 p-5 rounded-xl border border-slate-800/60 flex flex-col justify-center">
                      <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                        <span class="text-sm font-medium text-slate-300">Basal (50%)</span>
                        <span class="font-bold text-2xl text-rose-300 tracking-tighter" id="res-basal">- <span class="text-sm font-medium text-slate-400 ml-1">U Qd</span></span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-slate-300">Bolus Prandial (50% dibagi 3 makan)</span>
                        <span class="font-bold text-2xl text-rose-300 tracking-tighter" id="res-bolus">- <span class="text-sm font-medium text-slate-400 ml-1">U TID</span></span>
                      </div>
                    </div>
                  </div>

                  <div class="pearl-box !border-rose-500 !bg-gradient-to-r !from-rose-500/10 !to-transparent mt-6">
                    <p class="text-[13px] text-slate-300 leading-relaxed"><span class="text-rose-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl: Sliding Scale vs Basal-Bolus</span> Sliding scale insulin tunggal tidak direkomendasikan karena menciptakan fluktuasi glikemik tajam (rollercoaster) dan risiko hipoglikemia reaktif. Rejimen fisiologis basal-bolus meniru sekresi sel beta pankreas normal.</p>
                  </div>
                </div>

            </section>
`;

fs.writeFileSync(path.join(__dirname, 'part3.html'), part3);
console.log("Part 3 written.");
