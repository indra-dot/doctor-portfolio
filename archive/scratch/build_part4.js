const fs = require('fs');
const path = require('path');

console.log("Writing part4: tab-metabolic and tab-bridging-insulin...");

const part4 = `
            <!-- ================= MODULE 4: METABOLIC & LIPID ================= -->
            <section id="tab-metabolic" class="module-section hidden space-y-6 md:space-y-8">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>

                <!-- Grid Baris 1: TyG & HOMA-IR -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  <!-- 1. TyG Index -->
                  <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between" id="card-tyg">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
                        <div>
                          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                            TyG Index
                            <span class="text-[10px] bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 px-2 py-0.5 rounded-full font-medium">Surrogate IR</span>
                          </h2>
                          <p class="text-xs text-slate-400 mt-0.5">Triglyceride-Glucose index untuk resistensi insulin & MASLD.</p>
                        </div>
                        
                        <div class="flex items-center gap-2">
                          <div class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            <button type="button" onclick="togglePin('tyg')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                              <i class="fa-regular fa-star text-xs star-icon" id="star-tyg"></i>
                            </button>
                            <button type="button" onclick="resetCalculator('tyg')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                              <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                            </button>
                            <button type="button" onclick="copyCPPTResume('tyg')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition" title="Salin CPPT">
                              <i class="fa-solid fa-clipboard-list text-xs"></i>
                            </button>
                          </div>

                          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 shrink-0 text-right min-w-[100px]">
                            <div class="text-2xl sm:text-3xl font-extrabold text-fuchsia-400 tracking-tight leading-none" id="res-tyg">-</div>
                            <div class="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold">Cutoff 4.49</div>
                          </div>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Trigliserida Puasa [mg/dL]</label>
                          <input type="number" id="tyg-tg" class="input-modern" placeholder="e.g. 150">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Glukosa Puasa [mg/dL]</label>
                          <input type="number" id="tyg-glu" class="input-modern" placeholder="e.g. 100">
                        </div>
                      </div>
                    </div>
                    
                    <div class="pearl-box !border-fuchsia-500 !bg-gradient-to-r !from-fuchsia-500/10 !to-transparent mt-5">
                      <p class="text-[13px] text-slate-300 leading-relaxed"><span class="text-fuchsia-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl: TyG Index</span> 
                      Formula: <strong>Ln[TG (mg/dL) &times; Glukosa (mg/dL)] / 2</strong>. Marker surrogate resistensi insulin yang sangat hemat biaya dan berkorelasi kuat dengan steatosis hepatik (MASLD/NAFLD). Nilai &gt; 4.49 mengindikasikan resistensi insulin bermakna.</p>
                    </div>
                  </div>

                  <!-- 2. HOMA-IR Assessment -->
                  <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between" id="card-homa">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
                        <div>
                          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                            HOMA-IR Assessment
                            <span class="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-medium">Homeostasis Model</span>
                          </h2>
                          <p class="text-xs text-slate-400 mt-0.5">Penentuan resistensi insulin kuantitatif (Matthews formula).</p>
                        </div>

                        <div class="flex items-center gap-2">
                          <div class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            <button type="button" onclick="togglePin('homa')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                              <i class="fa-regular fa-star text-xs star-icon" id="star-homa"></i>
                            </button>
                            <button type="button" onclick="resetCalculator('homa')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                              <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                            </button>
                            <button type="button" onclick="copyCPPTResume('homa')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition" title="Salin CPPT">
                              <i class="fa-solid fa-clipboard-list text-xs"></i>
                            </button>
                          </div>

                          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 shrink-0 text-right min-w-[100px]">
                            <div class="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tight leading-none" id="res-homa">-</div>
                            <div class="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold">Cutoff 2.0</div>
                          </div>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Insulin Puasa [mU/L atau µU/mL]</label>
                          <input type="number" id="homa-ins" class="input-modern" placeholder="e.g. 15">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Glukosa Puasa [mg/dL]</label>
                          <input type="number" id="homa-glu" class="input-modern" placeholder="e.g. 100">
                        </div>
                      </div>
                    </div>
                    
                    <div class="pearl-box !border-violet-500 !bg-gradient-to-r !from-violet-500/10 !to-transparent mt-5">
                      <p class="text-[13px] text-slate-300 leading-relaxed"><span class="text-violet-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl: HOMA-IR</span> 
                      Formula: <strong>[Insulin Puasa (µU/mL) &times; Glukosa Puasa (mg/dL)] / 405</strong>. Skor &gt; 2.0 mengindikasikan resistensi insulin awal, &gt; 2.5 resistensi insulin berat (umum pada PCOS, sindrom metabolik).</p>
                    </div>
                  </div>
                </div>

                <!-- Grid Baris 2: Friedewald & AIP (Atherogenic Index of Plasma) -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  
                  <!-- 3. Friedewald LDL-C -->
                  <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between" id="card-friedewald">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
                        <div>
                          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                            Friedewald Formula (LDL)
                            <span class="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-medium">Lipid Panel</span>
                          </h2>
                          <p class="text-xs text-slate-400 mt-0.5">Estimasi LDL-C (Valid jika TG &le; 400 mg/dL).</p>
                        </div>

                        <div class="flex items-center gap-2">
                          <div class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            <button type="button" onclick="togglePin('friedewald')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                              <i class="fa-regular fa-star text-xs star-icon" id="star-friedewald"></i>
                            </button>
                            <button type="button" onclick="resetCalculator('friedewald')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                              <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                            </button>
                            <button type="button" onclick="copyCPPTResume('friedewald')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition" title="Salin CPPT">
                              <i class="fa-solid fa-clipboard-list text-xs"></i>
                            </button>
                          </div>

                          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 shrink-0 text-right min-w-[100px]">
                            <div class="text-2xl sm:text-3xl font-extrabold text-sky-400 tracking-tight leading-none" id="res-ldl">-</div>
                            <div class="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold">mg/dL</div>
                          </div>
                        </div>
                      </div>

                      <div id="ldl-warning" class="hidden mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-medium flex items-center">
                        <i class="fa-solid fa-triangle-exclamation text-base mr-2.5"></i> 
                        Rumus Friedewald tidak valid untuk Trigliserida &gt; 400 mg/dL.
                      </div>

                      <div class="grid grid-cols-3 gap-3">
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">Total Kolesterol [mg/dL]</label>
                          <input type="number" id="lip-tc" class="input-modern" placeholder="e.g. 200">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">HDL [mg/dL]</label>
                          <input type="number" id="lip-hdl" class="input-modern" placeholder="e.g. 45">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1">Trigliserida [mg/dL]</label>
                          <input type="number" id="lip-tg" class="input-modern" placeholder="e.g. 150">
                        </div>
                      </div>
                    </div>
                    
                    <div class="pearl-box !border-sky-500 !bg-gradient-to-r !from-sky-500/10 !to-transparent mt-5">
                      <p class="text-[13px] text-slate-300 leading-relaxed"><span class="text-sky-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl</span> Bila TG &gt; 400 mg/dL, gunakan <strong>Non-HDL Kolesterol (TC - HDL)</strong> sebagai target terapi atau lakukan pemeriksaan LDL direk. Inisiasi fibrat jika TG &gt; 500 mg/dL untuk cegah pankreatitis.</p>
                    </div>
                  </div>

                  <!-- 4. Atherogenic Index of Plasma (AIP) [NEW] -->
                  <div class="glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between" id="card-aip">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800/80 gap-3">
                        <div>
                          <h2 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
                            Atherogenic Index of Plasma (AIP)
                            <span class="text-[10px] bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full font-medium">sdLDL Marker</span>
                          </h2>
                          <p class="text-xs text-slate-400 mt-0.5">Surrogate biomarker aterogenisitas partikel small dense LDL.</p>
                        </div>

                        <div class="flex items-center gap-2">
                          <div class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                            <button type="button" onclick="togglePin('aip')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                              <i class="fa-regular fa-star text-xs star-icon" id="star-aip"></i>
                            </button>
                            <button type="button" onclick="resetCalculator('aip')" class="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                              <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                            </button>
                            <button type="button" onclick="copyCPPTResume('aip')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition" title="Salin CPPT">
                              <i class="fa-solid fa-clipboard-list text-xs"></i>
                            </button>
                          </div>

                          <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 shrink-0 text-right min-w-[110px]">
                            <div class="text-2xl sm:text-3xl font-extrabold text-teal-400 tracking-tight leading-none" id="res-aip">-</div>
                            <div class="text-[10px] text-slate-400 mt-0.5 uppercase font-semibold" id="res-aip-interp">Risiko Rendah</div>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">Trigliserida [mg/dL]</label>
                          <input type="number" id="aip-tg" class="input-modern" placeholder="e.g. 180">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-400 mb-1.5">HDL Kolesterol [mg/dL]</label>
                          <input type="number" id="aip-hdl" class="input-modern" placeholder="e.g. 40">
                        </div>
                      </div>
                    </div>
                    
                    <div class="pearl-box !border-teal-500 !bg-gradient-to-r !from-teal-500/10 !to-transparent mt-5">
                      <p class="text-[13px] text-slate-300 leading-relaxed"><span class="text-teal-400 font-bold uppercase text-[11px] tracking-wider block mb-1">Clinical Pearl: AIP Formula & Stratifikasi</span> 
                      Formula: <strong>log₁₀[(TG / 88.57) / (HDL / 38.67)]</strong>. 
                      <strong>&lt; 0.11:</strong> Risiko Kardiovaskular Rendah; 
                      <strong>0.11 - 0.21:</strong> Risiko Sedang; 
                      <strong>&gt; 0.21:</strong> Risiko Tinggi (prediktor partikel small dense LDL yang sangat aterogenik dan mudah teroksidasi di dinding arteri).</p>
                    </div>
                  </div>
                </div>

                <!-- 5. ASCVD 10-Year Risk & Target LDL Intensif [NEW] -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 lg:p-8" id="card-ascvd">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 flex-wrap">
                        ASCVD 10-Year Risk Estimator & Target LDL
                        <span class="text-[11px] bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full font-medium tracking-wide">AHA/ACC Guideline</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-slate-400 mt-1">Estimasi risiko kejadian kardiovaskular 10 tahun dan penentuan target penurunan LDL intensif.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="togglePin('ascvd')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                          <i class="fa-regular fa-star text-xs star-icon" id="star-ascvd"></i>
                        </button>
                        <button type="button" onclick="resetCalculator('ascvd')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                          <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                        </button>
                        <button type="button" onclick="copyCPPTResume('ascvd')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5" title="Salin Resume SOAP / CPPT">
                          <i class="fa-solid fa-clipboard-list text-xs"></i>
                          <span>Salin CPPT</span>
                        </button>
                      </div>

                      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 shrink-0 min-w-[150px]">
                        <div class="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight leading-none" id="res-ascvd-score">- %</div>
                        <div class="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1 sm:mt-1.5 text-right" id="res-ascvd-target">Target LDL: -</div>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Usia Pasien (Tahun)</label>
                      <input type="number" id="ascvd-age" class="input-modern ascvd-input" placeholder="40 - 79">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Jenis Kelamin</label>
                      <select id="ascvd-gender" class="input-modern ascvd-input">
                        <option value="male">Pria</option>
                        <option value="female">Wanita</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Tekanan Darah Sistolik (mmHg)</label>
                      <input type="number" id="ascvd-sbp" class="input-modern ascvd-input" placeholder="e.g. 140">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Pengobatan Hipertensi</label>
                      <select id="ascvd-htn" class="input-modern ascvd-input">
                        <option value="no">Tidak Mengonsumsi Obat</option>
                        <option value="yes">Ya, Rutin Obat Antihipertensi</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Kolesterol Total [mg/dL]</label>
                      <input type="number" id="ascvd-tc" class="input-modern ascvd-input" placeholder="e.g. 210">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">HDL Kolesterol [mg/dL]</label>
                      <input type="number" id="ascvd-hdl" class="input-modern ascvd-input" placeholder="e.g. 45">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Riwayat Diabetes Melitus</label>
                      <select id="ascvd-dm" class="input-modern ascvd-input">
                        <option value="no">Tidak Ada DM</option>
                        <option value="yes">Ya, Mengidap Diabetes</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-400 mb-1.5">Status Merokok Aktif</label>
                      <select id="ascvd-smoke" class="input-modern ascvd-input">
                        <option value="no">Bukan Perokok</option>
                        <option value="yes">Perokok Aktif</option>
                      </select>
                    </div>
                  </div>

                  <!-- Recommendation banner -->
                  <div class="mt-5 p-4 rounded-xl bg-blue-950/30 border border-blue-500/30">
                    <h3 class="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1.5">
                      <i class="fa-solid fa-shield-heart mr-1.5"></i> Rekomendasi Terapi Statin & Target LDL (AHA/ACC & ESC)
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-2">
                      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span class="text-slate-400 block font-semibold">Risiko Sangat Tinggi / Klinis ASCVD</span>
                        <span class="text-emerald-300 font-bold">Target LDL &lt; 55 mg/dL</span>
                        <span class="text-[11px] text-slate-400 block mt-0.5">High-intensity Statin + Ezetimibe jika perlu</span>
                      </div>
                      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span class="text-slate-400 block font-semibold">Risiko Tinggi (Skor &ge; 20% / DM lanjut)</span>
                        <span class="text-sky-300 font-bold">Target LDL &lt; 70 mg/dL</span>
                        <span class="text-[11px] text-slate-400 block mt-0.5">High-intensity Statin (Reduksi &ge; 50%)</span>
                      </div>
                      <div class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span class="text-slate-400 block font-semibold">Risiko Sedang (7.5% - 19.9%)</span>
                        <span class="text-amber-300 font-bold">Target LDL &lt; 100 mg/dL</span>
                        <span class="text-[11px] text-slate-400 block mt-0.5">Moderate-intensity Statin (Reduksi 30-49%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 6. Konversi HbA1c ke eAG (Estimated Average Glucose) [NEW] -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 lg:p-8" id="card-hba1c-eag">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-800/80 gap-4">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 flex-wrap">
                        Konversi HbA1c ke eAG (Estimated Average Glucose)
                        <span class="text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-medium tracking-wide">ADAG Study Formula</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-slate-400 mt-1">Konversi matematis HbA1c ke rerata gula darah harian untuk sarana edukasi pasien poliklinik.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="togglePin('hba1c-eag')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                          <i class="fa-regular fa-star text-xs star-icon" id="star-hba1c-eag"></i>
                        </button>
                        <button type="button" onclick="resetCalculator('hba1c-eag')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                          <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                        </button>
                        <button type="button" onclick="copyCPPTResume('hba1c-eag')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1.5" title="Salin Resume SOAP / CPPT">
                          <i class="fa-solid fa-clipboard-list text-xs"></i>
                          <span>Salin CPPT</span>
                        </button>
                      </div>

                      <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 shrink-0 min-w-[150px]">
                        <div class="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight leading-none" id="res-eag-mg">-</div>
                        <div class="text-[11px] sm:text-xs text-slate-400 font-semibold mt-1 sm:mt-1.5 text-right" id="res-eag-mmol">- mmol/L</div>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div class="md:col-span-5 space-y-4">
                      <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Kadar HbA1c Pasien (%)</label>
                        <input type="number" id="eag-hba1c" step="0.1" class="input-modern text-lg font-bold" placeholder="e.g. 7.5">
                      </div>
                      <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 space-y-2">
                        <div class="font-semibold text-white">Formula Validasi ADAG:</div>
                        <div><code>eAG (mg/dL) = 28.7 &times; HbA1c - 46.7</code></div>
                        <div><code>eAG (mmol/L) = 1.59 &times; HbA1c - 2.59</code></div>
                      </div>
                    </div>

                    <!-- Comparison Table for Patient Education -->
                    <div class="md:col-span-7">
                      <div class="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
                        <table class="w-full text-xs text-left">
                          <thead class="bg-slate-900 text-slate-300 font-semibold uppercase text-[10px] border-b border-slate-800">
                            <tr>
                              <th class="py-2 px-3">HbA1c</th>
                              <th class="py-2 px-3">Rerata Gula Darah (mg/dL)</th>
                              <th class="py-2 px-3">Status Kontrol</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-800/60 font-mono text-[11px]">
                            <tr class="hover:bg-slate-900/40">
                              <td class="py-1.5 px-3 font-bold text-emerald-400">6.0%</td>
                              <td class="py-1.5 px-3">126 mg/dL (7.0 mmol/L)</td>
                              <td class="py-1.5 px-3 text-emerald-400 font-sans">Sangat Baik / Optimal</td>
                            </tr>
                            <tr class="hover:bg-slate-900/40">
                              <td class="py-1.5 px-3 font-bold text-emerald-400">7.0%</td>
                              <td class="py-1.5 px-3">154 mg/dL (8.6 mmol/L)</td>
                              <td class="py-1.5 px-3 text-emerald-300 font-sans">Target Standar Dewasa</td>
                            </tr>
                            <tr class="hover:bg-slate-900/40">
                              <td class="py-1.5 px-3 font-bold text-amber-400">8.0%</td>
                              <td class="py-1.5 px-3">183 mg/dL (10.2 mmol/L)</td>
                              <td class="py-1.5 px-3 text-amber-300 font-sans">Kontrol Kurang Baik</td>
                            </tr>
                            <tr class="hover:bg-slate-900/40">
                              <td class="py-1.5 px-3 font-bold text-rose-400">9.0%</td>
                              <td class="py-1.5 px-3">212 mg/dL (11.8 mmol/L)</td>
                              <td class="py-1.5 px-3 text-rose-300 font-sans">Kontrol Buruk</td>
                            </tr>
                            <tr class="hover:bg-slate-900/40">
                              <td class="py-1.5 px-3 font-bold text-rose-500">10.0%</td>
                              <td class="py-1.5 px-3">240 mg/dL (13.4 mmol/L)</td>
                              <td class="py-1.5 px-3 text-rose-400 font-sans">Sangat Buruk / Toksisitas Glukosa</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

            </section>

            <!-- ================= MODULE 5: BRIDGING INSULIN ================= -->
            <section id="tab-bridging-insulin" class="module-section hidden space-y-6 md:space-y-8">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>

                <div class="glass-card rounded-2xl p-6 sm:p-7 lg:p-8" id="card-bridging-insulin">
                  <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800/80">
                    <div>
                      <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 flex-wrap">
                        <i class="fa-solid fa-syringe text-orange-400"></i> Bridging Insulin
                        <span class="text-[11px] bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full font-medium tracking-wide">IV to SC Transition</span>
                      </h2>
                      <p class="text-xs sm:text-sm text-slate-400 mt-1">Konversi titrasi drip insulin IV 24 jam ke regimen basal-bolus subkutan.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="togglePin('bridging-insulin')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition" title="Pin ke Favorit Dashboard">
                          <i class="fa-regular fa-star text-xs star-icon" id="star-bridging-insulin"></i>
                        </button>
                        <button type="button" onclick="resetCalculator('bridging-insulin')" class="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition group" title="Reset Parameter">
                          <i class="fa-solid fa-rotate-left text-xs group-hover:-rotate-90 transition-transform"></i>
                        </button>
                      </div>

                      <label class="text-xs text-slate-300 flex items-center gap-2">
                        <span>Jam Awal:</span>
                        <select id="ins-start-hour" onchange="renderInsulinTable()" class="input-modern !py-1 !px-2.5 text-xs w-auto">
                          <option value="23" selected>23:00</option>
                          <option value="0">00:00</option>
                          <option value="6">06:00</option>
                          <option value="7">07:00</option>
                          <option value="8">08:00</option>
                          <option value="12">12:00</option>
                          <option value="18">18:00</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Table 24h -->
                    <div class="lg:col-span-6 flex flex-col">
                      <div class="flex justify-between items-center mb-2">
                        <h3 class="text-sm font-semibold text-white">Input Drip Insulin (24 Jam)</h3>
                        <span class="text-xs text-slate-400">Satuan: Unit</span>
                      </div>
                      <div class="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 shadow-inner">
                        <div class="max-h-[380px] overflow-y-auto custom-scrollbar">
                          <table class="w-full text-sm text-left border-collapse">
                            <thead class="text-xs uppercase bg-slate-900 text-slate-200 sticky top-0 z-10 border-b border-slate-800">
                              <tr>
                                <th class="px-4 py-2.5 w-28 text-center font-bold tracking-wider border-r border-slate-800">Jam</th>
                                <th class="px-4 py-2.5 font-bold tracking-wider">Insulin (U)</th>
                              </tr>
                            </thead>
                            <tbody id="insulin-table-body" class="divide-y divide-slate-800/60">
                              <!-- Dynamic table rows -->
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <!-- Result Summary -->
                    <div class="lg:col-span-6 flex flex-col justify-between space-y-5">
                      <div class="bg-slate-900/60 rounded-xl p-6 border border-slate-800 space-y-4">
                        <h3 class="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                          <i class="fa-solid fa-calculator text-orange-400"></i> Ringkasan Dosis Subkutan
                        </h3>

                        <div class="space-y-3 font-mono text-sm">
                          <div class="flex justify-between items-center py-1">
                            <span class="text-slate-300">Total drip 24 jam</span>
                            <span class="text-lg font-bold text-white">: <span id="ins-total">0</span> U</span>
                          </div>
                          <div class="flex justify-between items-center py-1 border-t border-slate-800">
                            <span class="text-slate-300">Total basal-bolus (80%)</span>
                            <span class="text-xl font-bold text-orange-400">: <span id="ins-bb-80">0</span> U</span>
                          </div>
                          <div class="flex justify-between items-center py-1 border-t border-slate-800">
                            <span class="text-slate-300">Insulin basal (50%)</span>
                            <span class="text-xl font-bold text-emerald-400">: <span id="ins-basal-50">0</span> U</span>
                          </div>
                          <div class="flex justify-between items-center py-1 border-t border-slate-800">
                            <span class="text-slate-300">Insulin prandial (per x3)</span>
                            <span class="text-xl font-bold text-cyan-400">: <span id="ins-prandial-3">0</span> U</span>
                          </div>
                        </div>

                        <div class="text-xs text-slate-400 pt-3 border-t border-slate-800 leading-relaxed italic">
                          Protokol: 80% dosis drip 24 jam sebagai TDD basal-bolus subkutan; 50% sebagai basal (1x/hari), 50% sisanya dibagi rata 3x prandial.
                        </div>
                        <div class="text-xs font-semibold text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                          <i class="fa-solid fa-triangle-exclamation mr-1"></i> Overlap: Berikan basal 1-2 jam sebelum drip insulin IV dihentikan.
                        </div>
                      </div>

                      <!-- Quick fill helper -->
                      <div class="p-4 bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span class="text-slate-400">Set rata-rata drip:</span>
                        <div class="flex gap-2">
                          <button onclick="quickFillInsulin(1)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">1 U/jam</button>
                          <button onclick="quickFillInsulin(2)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">2 U/jam</button>
                          <button onclick="quickFillInsulin(3)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">3 U/jam</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- CPPT Box -->
                  <div class="mt-6 p-5 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-semibold text-orange-400 text-sm flex items-center gap-2"><i class="fa-solid fa-clipboard-list"></i> Copy ke CPPT</h4>
                      <button onclick="copyCPPTResume('bridging-insulin')" class="bg-slate-800 hover:bg-slate-700 text-white text-xs py-1.5 px-3 rounded-lg border border-slate-700 transition-colors">
                        <i class="fa-solid fa-copy mr-1"></i> Copy
                      </button>
                    </div>
                    <pre id="ins-cppt" class="text-sm text-slate-300 whitespace-pre font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto"></pre>
                  </div>

                  <!-- Pearl Box -->
                  <div class="pearl-box !border-orange-500 !bg-gradient-to-r !from-orange-500/10 !to-transparent mt-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <span class="flex items-center text-xs font-bold text-orange-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                        <p class="text-[13px] text-slate-300 leading-relaxed">Transisi dari IV drip ke regimen Subkutan dilakukan saat krisis hiperglikemia (KDA/HHS) sudah terkonversi (pH &gt; 7.30, HCO3 &ge; 18 mEq/L, Anion Gap normal) dan pasien sudah dapat makan secara oral.</p>
                      </div>
                      <div>
                        <span class="flex items-center text-xs font-bold text-orange-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                        <p class="text-[13px] text-slate-300 leading-relaxed">Berikan dosis insulin basal subkutan pertama 1-2 jam sebelum drip insulin IV distop total untuk mencegah terjadinya rebound hiperglikemia atau kecenderungan ketoasidosis berulang.</p>
                      </div>
                    </div>
                  </div>
                </div>
            </section>

        </main>
    </div>
`;

fs.writeFileSync(path.join(__dirname, 'part4.html'), part4);
console.log("Part 4 written.");
