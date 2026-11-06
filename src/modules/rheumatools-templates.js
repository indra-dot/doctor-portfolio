const RHEUMA_TEMPLATES = {"diag-approach-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n\n          <!-- Elevated Clinical Flowchart Card -->\n          <div class=\"card\" style=\"max-width: 900px; margin: 0 auto;\">\n            <div class=\"card-header\" style=\"text-align: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1.25rem;\">\n              <div class=\"diag-stepper-header\">\n                <span class=\"diag-step-pill\"><i class=\"fa-solid fa-code-branch mr-1\"></i> Rekomendasi IRA 2020</span>\n                <span class=\"diag-step-pill\"><i class=\"fa-solid fa-hospital-user mr-1\"></i> Clinical Decision Support</span>\n              </div>\n              <h2 style=\"font-size: 1.35rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.01em;\">\n                Algoritma Evaluasi & Pendekatan Diagnosis Nyeri Sendi\n              </h2>\n              <p style=\"max-width: 680px; margin: 0.5rem auto 0; font-size: 0.85rem; color: var(--text-secondary);\">\n                Alur penelusuran klinis sistematis berdasarkan konsensus Perhimpunan Reumatologi Indonesia (IRA 2020) & Harrison Rheumatology untuk memandu dokter menentukan etiologi, menyingkirkan emergensi (artritis septik), dan memilih strategi penunjang.\n              </p>\n            </div>\n\n            <div class=\"card-body\">\n              <div id=\"diag-steps-container\">\n\n                <!-- STEP 1: TRAUMA -->\n                <div id=\"step-trauma\" class=\"diag-tree-step\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 1 dari 5 &bull; Anamnesis Riwayat</span>\n                  </div>\n                  <h3 class=\"diag-question\">1. Apakah terdapat riwayat trauma fisik atau cedera akut pada sendi terkait?</h3>\n                  <div class=\"diag-pearl-box\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>Petunjuk Klinis:</b> Evaluasi adanya trauma mekanik baru (&lt; 24-48 jam), cedera puntir (twisting), suara 'pop' saat cedera, ketidakmampuan menumpu berat badan (Ottawa rules), deformitas gross, atau pembengkakan cepat (hemartrosis).\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option alert-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-high'><i class='fa-solid fa-bone mr-1'></i> Cedera Muskuloskeletal Akut / Traumatik</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Fraktur Intra-artikular / Fraktur Avulsi:</b> Perlu evaluasi stabilitas tulang dan kontur korteks.</li><li><b>Ruptur Ligamen / Tendon Mayor:</b> Ruptur ACL/PCL, meniskus, tendo Achilles, atau cuff rotator.</li><li><b>Hemartrosis Traumatik:</b> Pembengkakan tegang dalam 1-2 jam pasca trauma mengindikasikan robekan vaskular intra-artikular.</li><li><b>Subluksasi atau Dislokasi Sendi:</b> Disertai deformitas dan disfungsi mekanik total.</li></ul><div class='diag-pearl-box'><b>Rencana Tindakan:</b> Lakukan imobilisasi segera (splint/bidai), kompres dingin & elevasi (RICE), foto rontgen polos minimal 2 posisi (AP/Lateral), evaluasi status neurovaskular distal, dan segera rujuk ke Spesialis Bedah Ortopedi & Traumatologi.</div>\" data-actions=\"references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-person-falling-burst\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Ya (Ada Riwayat Trauma Fisik Akut)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: #FB7185; border: 1px solid rgba(244,63,94,0.3);\">Trauma / Mekanik</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Keluhan diawali insiden benturan, tarikan, cedera saat olahraga, atau dislokasi mendadak.</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-next-step=\"step-articular\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-shield-heart\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Tidak Ada Riwayat Trauma (Non-Traumatik)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: var(--accent-cyan); border: 1px solid rgba(0,242,254,0.3);\">Lanjut ke Langkah 2</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Nyeri timbul spontan, tanpa riwayat cedera fisik nyata, atau berlangsung tanpa kaitan mekanisme benturan.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- STEP 2: ARTIKULAR VS PERIARTIKULAR -->\n                <div id=\"step-articular\" class=\"diag-tree-step\" style=\"display: none;\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 2 dari 5 &bull; Lokalisasi Anatomis</span>\n                  </div>\n                  <h3 class=\"diag-question\">2. Apakah keluhan berasal dari dalam kapsul sendi (Artikular) atau struktur sekitar sendi (Periartikular)?</h3>\n                  <div class=\"diag-pearl-box\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>Kunci Pemeriksaan Fisik:</b>\n                    <ul class=\"list-disc list-inside mt-1 space-y-0.5\">\n                      <li><b>Artikular:</b> Nyeri tekan merata pada garis sendi (joint line tenderness), keterbatasan lingkup gerak (ROM) pada <i>gerakan aktif DAN pasif</i>, disertai efusi menyeluruh melingkupi kapsul.</li>\n                      <li><b>Periartikular:</b> Nyeri fokal pada insersi tendo/ligamen/bursa. ROM <i>pasif utuh/bebas</i>; nyeri muncul terutama saat <i>gerakan aktif melawan tahanan</i> atau regangan pasif spesifik.</li>\n                    </ul>\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-next-step=\"step-duration\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-bone\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Nyeri Artikular (Intra-Sendi / Kapsular)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: var(--accent-cyan); border: 1px solid rgba(0,242,254,0.3);\">True Arthritis</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Nyeri pada celah sendi, pembengkakan efusi difus, ROM aktif dan pasif keduanya terbatas/nyeri.</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-low'><i class='fa-solid fa-hand-holding-medical mr-1'></i> Reumatik Jaringan Lunak / Periartikular</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Tendinitis / Tenosinovitis:</b> De Quervain tenosynovitis (finkelstein test +), tendo achilles, bicipital tendinitis.</li><li><b>Bursitis:</b> Bursitis prepatelar (housemaid's knee), olekranon (student's elbow), trochanteric major.</li><li><b>Entesitis:</b> Nyeri insersi fasia plantar / achilles (waspadai spektrum Spondiloartropati / SpA bila multipel).</li><li><b>Sindrom Nyeri Miofasial / Fibromialgia:</b> Tender points difus non-artikular, fatigue, gangguan tidur.</li><li><b>Polimialgia Reumatika (PMR):</b> Nyeri dan kaku simetris gelang bahu dan panggul pada usia &gt;50 tahun dengan LED meningkat tinggi.</li></ul><div class='diag-pearl-box'><b>Rencana Tindakan:</b> Lakukan uji provokasi spesifik (Finkelstein, Neer/Hawkins, palpasi fokal), pertimbangkan USG muskuloskeletal soft-tissue resolusi tinggi, istirahat lokal, kompres, NSAID, dan latihan peregangan fisioterapi.</div>\" data-actions=\"references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-hand-dots\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Non-Artikular / Periartikular (Jaringan Lunak)</span>\n                          <span class=\"diag-choice-badge\">Tendon / Bursa / Otot</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Nyeri fokal pada satu titik bursa atau insersi tendo; gerakan pasif masih bebas, nyeri saat melawan tahanan.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- STEP 3: DURASI (KRONISITAS) -->\n                <div id=\"step-duration\" class=\"diag-tree-step\" style=\"display: none;\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 3 dari 5 &bull; Kronisitas Waktu</span>\n                  </div>\n                  <h3 class=\"diag-question\">3. Berapa lama durasi keluhan nyeri sendi berlangsung sejak onset pertama?</h3>\n                  <div class=\"diag-pearl-box\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>Titik Tolak 6 Minggu (Konsensus IRA 2020 & ACR/EULAR):</b>\n                    Ambang batas 6 minggu membedakan kondisi infeksi akut atau reaksi viral reaktif transien dari penyakit sendi inflamasi kronis atau penyakit jaringan ikat autoimun sistemik persisten.\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-next-step=\"step-inflammation-acute\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-stopwatch-20\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Akut (&lt; 6 Minggu)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: var(--accent-cyan); border: 1px solid rgba(0,242,254,0.3);\">&lt; 6 Minggu</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Onset mendadak hingga beberapa hari/minggu. Waspadai infeksi septik, artritis kristal (Gout), atau artritis viral.</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-next-step=\"step-inflammation-chronic\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-calendar-days\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Kronis (&ge; 6 Minggu)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: #FBBF24; border: 1px solid rgba(245,158,11,0.3);\">&ge; 6 Minggu</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Keluhan menetap atau kambuh berulang lebih dari 6 minggu. Mengarah pada RA, SLE, SpA, atau Osteoartritis.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- STEP 4-AKUT: INFLAMASI AKUT -->\n                <div id=\"step-inflammation-acute\" class=\"diag-tree-step\" style=\"display: none;\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 4 dari 5 &bull; Karakteristik Inflamasi Akut</span>\n                  </div>\n                  <h3 class=\"diag-question\">4. Pada keluhan Akut (&lt; 6 minggu), apakah ditemukan tanda-tanda inflamasi lokal atau sistemik?</h3>\n                  <div class=\"diag-pearl-box\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>Kriteria Tanda Inflamasi Positif:</b>\n                    Sendi teraba hangat (kalor), kemerahan (rubor), bengkak dengan efusi nyata (tumor), dan kaku pagi hari (morning stiffness) &gt; 30-60 menit yang membaik setelah sendi digerakkan.\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option alert-choice diag-btn\" data-next-step=\"step-joint-count-acute\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-fire-flame-curved\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Ya, Inflamasi Positif (Hangat, Bengkak, Kaku Pagi &gt;30 Mnt)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: #FB7185; border: 1px solid rgba(244,63,94,0.3);\">Inflammatory Arthritis</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Sendi meradang aktif, efusi tegang, kulit kemerahan, atau disertai peningkatan reaktan fase akut (LED/CRP).</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-moderate'><i class='fa-solid fa-circle-info mr-1'></i> Artropati Non-Inflamasi Akut</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Hemartrosis Spontan:</b> Pasien dengan koagulopati bawaan (hemofilia) atau konsumsi obat antikoagulan (warfarin, DOAC).</li><li><b>Disrupsi Internal / Mikrotrauma Mekanik:</b> Robekan meniskus degeneratif atau chondral flap tanpa riwayat trauma masif.</li><li><b>Loose Body Intra-Artikular:</b> Menimbulkan sensasi 'joint locking' atau sendi tiba-tiba macet saat melangkah.</li><li><b>Nekrosis Avaskular Akut Dini (AVN):</b> Nyeri panggul/lutut hebat saat menumpu, terutama riwayat penggunaan kortikosteroid sistemik.</li></ul><div class='diag-pearl-box'><b>Rencana Tindakan:</b> Artrosentesis diagnostik bila ada efusi tegang untuk konfirmasi darah (hemartrosis) vs cairan jernih; evaluasi hemostasis lengkap (PT/APTT/INR); foto rontgen polos atau MRI sendi terkait.</div>\" data-actions=\"references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-circle-notch\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Tidak Ada Tanda Inflamasi (Mekanik Non-Inflamasi)</span>\n                          <span class=\"diag-choice-badge\">Non-Inflamasi</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Sendi tidak hangat, tidak merah, kaku pagi minimal (&lt; 15-30 menit), nyeri terutama timbul saat diberi beban fisik.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- STEP 4-KRONIS: INFLAMASI KRONIS -->\n                <div id=\"step-inflammation-chronic\" class=\"diag-tree-step\" style=\"display: none;\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 4 dari 5 &bull; Karakteristik Inflamasi Kronis</span>\n                  </div>\n                  <h3 class=\"diag-question\">4. Pada keluhan Kronis (&ge; 6 minggu), apakah pola nyeri bersifat Inflamatori atau Mekanik/Degeneratif?</h3>\n                  <div class=\"diag-pearl-box\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>Diferensiasi Kunci Inflamasi vs Mekanik:</b>\n                    <ul class=\"list-disc list-inside mt-1 space-y-0.5\">\n                      <li><b>Inflamatori:</b> Nyeri paling berat saat bangun tidur/istirahat, membaik dengan latihan gerak, kaku pagi &ge; 30-60 menit, sering disertai kelelahan (fatigue) sistemik.</li>\n                      <li><b>Mekanik (Degeneratif):</b> Nyeri bertambah berat saat beraktivitas/menumpu berat badan dan berkurang saat istirahat, kaku pagi singkat (&lt; 30 menit), dapat disertai krepitasi kasar.</li>\n                    </ul>\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-next-step=\"step-pattern-chronic\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-fire\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Nyeri Inflamasi Kronis (Kaku Pagi &ge; 30 Mnt, Bengkak Sinovitis)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: var(--accent-cyan); border: 1px solid rgba(0,242,254,0.3);\">Chronic Inflammatory</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Gejala membaik setelah beraktivitas, terdapat sinovitis perabaan 'boggy/doughy', atau reaktan fase akut meningkat.</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-moderate'><i class='fa-solid fa-person-walking mr-1'></i> Artropati Degeneratif / Mekanik Kronis</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Osteoartritis (OA) Genu / Koksa:</b> Nyeri beban, krepitasi, efusi dingin non-inflamasi, penyempitan celah sendi dan osteofit marjinal pada foto Rontgen.</li><li><b>Osteoartritis Tangan Nodal:</b> Nodul Heberden (sendi DIP) dan nodul Bouchard (sendi PIP), squaring sendi CMC-1 dasar ibu jari.</li><li><b>Artropati Neuropatik (Sendi Charcot):</b> Destruksi sendi masif dengan nyeri minimal akibat hilangnya sensasi proprioseptif (DM neuropati, siringomielia).</li><li><b>Penyakit Tulang Metabolik / Hemokromatosis:</b> Kondrokalsinosis sekunder, keterlibatan sendi MCP 2-3 dengan hook-like osteophytes.</li></ul><div class='diag-pearl-box'><b>Rencana Tindakan:</b> Rontgen sendi terdampak dengan penopang beban (weight-bearing AP/Lateral), edukasi modifikasi gaya hidup / penurunan berat badan, fisioterapi penguatan otot quadriceps, parasetamol / NSAID topikal sebagai lini pertama, injeksi asam hialuronat / steroid bila ada eksaserbasi efusi.</div>\" data-actions=\"references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-person-cane\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Nyeri Mekanik / Degeneratif (Osteoartritis)</span>\n                          <span class=\"diag-choice-badge\">Degeneratif</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Nyeri memberat saat berjalan/berdiri, membaik saat duduk/berbaring, krepitasi fokal, kaku pagi &lt; 30 menit.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- STEP 5-AKUT: JUMLAH SENDIR AKUT -->\n                <div id=\"step-joint-count-acute\" class=\"diag-tree-step\" style=\"display: none;\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 5 dari 5 &bull; Pola & Jumlah Sendi Akut</span>\n                  </div>\n                  <h3 class=\"diag-question\">5. Berapa jumlah sendi yang mengalami inflamasi akut?</h3>\n                  <div class=\"red-flag-box\">\n                    <i class=\"fa-solid fa-triangle-exclamation text-rose-400 mr-1.5\"></i>\n                    <b>PERINGATAN EMERGENSI MEDIS:</b>\n                    Setiap pasien dengan <b>Monoartritis Akut</b> yang sangat nyeri, bengkak tegang, hangat, dan demam <u>HARUS</u> dianggap sebagai <b>Artritis Septik</b> sampai terbukti sebaliknya melalui aspirasi cairan sendi cito! Keterlambatan penanganan &gt; 24 jam dapat menyebabkan kerusakan kartilago permanen dan sepsis sistemik.\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option alert-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-high'><i class='fa-solid fa-triangle-exclamation mr-1'></i> Monoartritis Akut Inflamatori &bull; Waspada Emergensi Artritis Septik!</span></div><div class='red-flag-box'><b>TINDAKAN GAWAT DARURAT:</b> Segera lakukan <b>ARTROSENTESIS CITO</b> sebelum memulai antibiotik! Periksa pewarnaan Gram, kultur & resistensi, hitung leukosit (bila &gt;50.000/&mu;L dengan PMN &gt;90% sangat suspek septik), serta analisis kristal cahaya terpolarisasi.</div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Artritis Septik / Bakterial:</b> Onset hiperakut, nyeri gerak ekstrem, demam. Kuman tersering: <i>Staphylococcus aureus</i>, <i>Streptococcus</i>, atau <i>N. gonorrhoeae</i> pada dewasa muda aktif seksual.</li><li><b>Artritis Gout Akut:</b> Serangan podagra pada MTP-1 (tersering 50%), pergelangan kaki, atau lutut. Puncak nyeri tercapai dalam &lt; 24 jam, kulit merah mengkilap. Ditemukan kristal MSU bentuk jarum dengan birefringence negatif kuat.</li><li><b>Pseudogout / CPPD (Kalsium Pirofosfat):</b> Predileksi lutut dan pergelangan tangan pada lansia. Kristal bentuk belah ketupat (rhomboid) dengan birefringence positif lemah.</li><li><b>Artritis Reaktif Akut:</b> Onset 1-4 minggu pasca infeksi urogenital (Chlamydia) atau gastrointestinal (Salmonella/Shigella/Campylobacter).</li></ul><div class='diag-pearl-box'><b>Pemeriksaan Penunjang Segera:</b> Artrosentesis cairan sendi, DPL + hitung jenis, LED, CRP kuantitatif, Prokalsitonin, Asam urat serum (catatan: asam urat bisa normal semu saat fase akut gout), Rontgen sendi.</div>\" data-actions=\"gout,as,references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-1\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Monoartritis Akut (1 Sendi Terlibat)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: #FB7185; border: 1px solid rgba(244,63,94,0.3);\">⚠️ Emergensi</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Hanya 1 sendi yang meradang hebat (Lutut, MTP-1/Ibu jari kaki, Pergelangan Kaki, atau Siku).</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-moderate'><i class='fa-solid fa-arrows-split-up-and-left mr-1'></i> Oligoartritis Akut Inflamatori (2 - 4 Sendi)</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Artritis Reaktif:</b> Keterlibatan asimetris sendi ekstremitas bawah, entesitis, daktilitis, lesi keratoderma blenorrhagica / balanitis sirsinata.</li><li><b>Gout / Pseudogout Poliartikular Akut:</b> Serangan asam urat yang mengenai 2-4 sendi secara bersamaan pada pasien dengan hiperurisemia lama.</li><li><b>Disseminated Gonococcal Infection (DGI):</b> Trias tenosinovitis, lesi dermatitis pustular akral, dan oligoartritis migratori.</li><li><b>Spondiloartropati Perifer Awal:</b> Onset awal artritis psoriatik atau spondilitis ankilosing perifer.</li></ul><div class='diag-pearl-box'><b>Pemeriksaan Penunjang:</b> Analisis cairan sendi, swab urogenital PCR Chlamydia/Gonorrhea, kultur darah, CRP, LED, asam urat serum, Rontgen sendi terdampak.</div>\" data-actions=\"psa,as,gout,references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-layer-group\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Oligoartritis Akut (2 &ndash; 4 Sendi Terlibat)</span>\n                          <span class=\"diag-choice-badge\">2-4 Sendi</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Mengenai beberapa sendi (biasanya asimetris pada sendi penumpu beban anggota gerak bawah).</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-low'><i class='fa-solid fa-network-wired mr-1'></i> Poliartritis Akut Inflamatori (&gt; 4 Sendi)</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Artritis Viral Akut:</b> Infeksi Chikungunya, Dengue, Parvovirus B19, Hepatitis B/C, Epstein-Barr Virus, atau Rubella. Umumnya simetris dan self-limiting (&lt; 6-8 minggu).</li><li><b>Demam Reumatik Akut (DRA):</b> Poliartritis migratori pada anak/dewasa muda pasca faringitis streptokokus beta-hemolitikus grup A (evaluasi kriteria Jones: karditis, chorea, eritema marginatum, ASTO).</li><li><b>Onset Awal Artritis Reumatoid (AR) atau Lupus (SLE):</b> Onset eksplosif penyakit autoimun sistemik.</li><li><b>Penyakit Still Dewasa (AOSD):</b> Demam tinggi intermiten (spiking fever), ruam evanescent salmon-pink maculopapular, faringitis, ferritin serum meningkat sangat tinggi (&gt; 1000-3000 ng/mL).</li></ul><div class='diag-pearl-box'><b>Pemeriksaan Penunjang:</b> Serologi virus (IgM/IgG Chikungunya/Dengue, HBsAg, Anti-HCV), ASTO / kultur swab tenggorok, ANA profile, RF, Anti-CCP, Ferritin serum, DPL lengkap, LED/CRP.</div>\" data-actions=\"ra,sle,references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-chart-line\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Poliartritis Akut (&gt; 4 Sendi Terlibat)</span>\n                          <span class=\"diag-choice-badge\">&gt; 4 Sendi</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Mengenai banyak sendi sekaligus secara akut, sering disertai gejala sistemik febris atau ruam kulit.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n                <!-- STEP 5-KRONIS: POLA KRONIS -->\n                <div id=\"step-pattern-chronic\" class=\"diag-tree-step\" style=\"display: none;\">\n                  <div class=\"diag-stepper-header\">\n                    <span class=\"diag-step-pill\">Langkah 5 dari 5 &bull; Distribusi Sendi Inflamasi Kronis</span>\n                  </div>\n                  <h3 class=\"diag-question\">5. Bagaimana pola predileksi dan distribusi sendi yang terlibat dalam inflamasi kronis (&ge; 6 minggu)?</h3>\n                  <div class=\"diag-pearl-box\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>Kunci Distribusi Topografis:</b>\n                    Poliartritis simetris sendi kecil tangan (MCP/PIP) adalah hallmark AR/SLE; Keterlibatan sendi DIP adalah hallmark PsA/OA; Oligoartritis asimetris sendi besar ekstremitas bawah khas Spondiloartropati; Nyeri punggung bawah inflamasi khas Spondiloartritis Aksial.\n                  </div>\n                  <div class=\"diag-action-btns\" style=\"flex-direction: column; max-width: 650px; margin: 0 auto;\">\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-remission'><i class='fa-solid fa-hands mr-1'></i> Poliartritis Kronis Simetris &bull; Suspek Penyakit Autoimun Sistemik</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Rheumatoid Arthritis (RA):</b> Poliartritis simetris sendi kecil (MCP, PIP, pergelangan tangan, MTP 2-5, spare DIP), kaku pagi &gt; 1 jam, erosi tulang periartikular, nodul reumatoid.</li><li><b>Systemic Lupus Erythematosus (SLE):</b> Artropati Jaccoud non-erosif fleksibel, fotosensitivitas, malar rash, sitopenia hematologi, keterlibatan renal (proteinuria).</li><li><b>Systemic Sclerosis (SSc):</b> Sklerodaktili, puffy fingers, telangiektasia, fenomena Raynaud, kapiler kuku abnormal.</li><li><b>Sindrom Sj&ouml;gren:</b> Gejala sikka (mata/mulut kering), anti-SSA/Ro positif, parotomegali bilateral.</li><li><b>Mixed Connective Tissue Disease (MCTD):</b> Karakteristik overlap dengan titer anti-U1-RNP positif tinggi.</li></ul><div class='diag-pearl-box'><b>Pemeriksaan Penunjang Esensial:</b> Faktor Reumatoid (RF kuantitatif), Anti-CCP (ACPA), ANA IF (HEp-2 pattern & titer), Panel ENA, LED, CRP kuantitatif, urinalisis rutin, foto Rontgen manus dan pedis bilateral.</div>\" data-actions=\"ra,sle,ssc,references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-hands\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Poliartritis Simetris Sendi Kecil (&gt; 4 Sendi: MCP, PIP, Pergelangan)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: var(--accent-cyan); border: 1px solid rgba(0,242,254,0.3);\">Suspek RA / SLE</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Keterlibatan bilateral simetris sendi jari tangan dan pergelangan, kaku pagi hari &gt; 1 jam.</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-moderate'><i class='fa-solid fa-shoe-prints mr-1'></i> Mono / Oligoartritis Kronis Asimetris &bull; Suspek Spondiloartropati / Infeksi Kronis</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Diagnosis Diferensial Utama:</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li><b>Spondiloartropati Perifer (SpA):</b> Artritis Psoriatik (PsA), Ankylosing Spondylitis perifer, Artritis Enteropatik (IBD: Crohn / Kolitis Ulseratif). Khas disertai entesitis (tumit) dan daktilitis (sausage digit).</li><li><b>Artritis Psoriatik (PsA):</b> Mengenai sendi DIP jari tangan, distrofi kuku (nail pitting, onikolisis), bercak plak psoriasis di scalp/umbilikus/gluteal.</li><li><b>Gout Kronis Bertofus:</b> Poliartritis asimetris dengan tofus subkutan teraba pada heliks telinga, olekranon, bursa patela, sendi jari.</li><li><b>Artritis Tuberkulosis (TB Sendi) / Fungal Indolent:</b> Monoartritis lutut atau panggul kronis dingin ('cold abscess') tanpa eritema mencolok, riwayat kontak TB atau penurunan berat badan.</li></ul><div class='diag-pearl-box'><b>Pemeriksaan Penunjang:</b> Aspirasi cairan sendi & GeneXpert MTB / kultur BTA & jamur, Rontgen pelvis AP (sakroilitis), HLA-B27, asam urat serum, inspeksi kulit & kuku seluruh tubuh, USG muskuloskeletal untuk entesitis/sinovitis.</div>\" data-actions=\"psa,as,gout,references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-shoe-prints\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Mono / Oligoartritis Asimetris (1 &ndash; 4 Sendi, Entesis, Daktilitis)</span>\n                          <span class=\"diag-choice-badge\" style=\"color: #FBBF24; border: 1px solid rgba(245,158,11,0.3);\">Suspek SpA / PsA / TB</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Terutama sendi besar ekstremitas bawah (lutut, pergelangan kaki), jari bengkak sosis (daktilitis), atau tumit.</div>\n                      </div>\n                    </button>\n\n                    <button type=\"button\" class=\"diag-card-option primary-choice diag-btn\" data-result=\"<div class='mb-2'><span class='status-badge badge-low'><i class='fa-solid fa-child-reaching mr-1'></i> Nyeri Punggung Inflamasi &bull; Suspek Spondiloartritis Aksial (axSpA)</span></div><div class='text-sm text-slate-200 font-semibold mb-2'>Karakteristik Inflammatory Back Pain (IBP - Konsensus ASAS):</div><ul class='text-xs text-slate-300 text-left space-y-1.5 list-disc list-inside mb-4'><li>Onset usia muda (&lt; 45 tahun) dan durasi nyeri punggung bawah &ge; 3 bulan secara kontinu.</li><li>Onset timbul perlahan (insidious), membaik saat pasien melakukan olahraga/aktivitas fisik, <b>TIDAK</b> membaik saat istirahat.</li><li>Nyeri malam hari yang membangunkan pasien pada paruh kedua malam. Kaku pagi hari &gt; 30 menit.</li><li>Respons perbaikan klinis sangat dramatis dan cepat (dalam 24-48 jam) setelah pemberian NSAID dosis terapeutik.</li></ul><div class='diag-pearl-box'><b>Pemeriksaan Penunjang Utama:</b> MRI sendi sakroiliaka (sekuens STIR & T1 untuk edema sumsum tulang aktif), Rontgen pelvis AP (sakroilitis bilateral kriteria New York modifikasi), pemeriksaan antigen HLA-B27, CRP kuantitatif, dan LED.</div>\" data-actions=\"as,references\">\n                      <div class=\"diag-choice-icon\"><i class=\"fa-solid fa-child-reaching\"></i></div>\n                      <div class=\"diag-choice-body\">\n                        <div class=\"diag-choice-title\">\n                          <span>Keterlibatan Aksial / Nyeri Punggung Inflamasi (IBP &ge; 3 Bulan)</span>\n                          <span class=\"diag-choice-badge\">axSpA / AS</span>\n                        </div>\n                        <div class=\"diag-choice-desc\">Nyeri tulang belakang / bokong alternating pada usia muda &lt;45 tahun, kaku pagi, membaik dengan olahraga.</div>\n                      </div>\n                    </button>\n                  </div>\n                </div>\n\n              </div>\n\n              <!-- DYNAMIC RESULT CONTAINER -->\n              <div id=\"diag-result-box\" class=\"diag-result-card\" style=\"display: none; text-align: left;\">\n                <div class=\"flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4\">\n                  <div class=\"flex items-center gap-2\">\n                    <span class=\"w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse\"></span>\n                    <span class=\"text-xs font-bold uppercase tracking-wider text-slate-300\">Hasil Resume Keputusan Klinis</span>\n                  </div>\n                  <span class=\"text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold\">Alur IRA 2020</span>\n                </div>\n\n                <div id=\"diag-result-text\" style=\"font-size: 0.92rem; color: #F8FAFC; line-height: 1.6;\"></div>\n\n                <!-- Action Shortcut Buttons to open relevant tools -->\n                <div id=\"diag-result-actions\" class=\"diag-result-actions\" style=\"display: none;\">\n                  <div class=\"diag-result-actions-title\">\n                    <i class=\"fa-solid fa-arrow-up-right-from-square text-cyan-400\"></i>\n                    Buka Alat Evaluasi & Kriteria Klasifikasi Terkait:\n                  </div>\n                  <div id=\"diag-result-buttons-container\" class=\"diag-result-actions-grid\"></div>\n                </div>\n\n                <div class=\"pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-3\">\n                  <div class=\"flex items-center gap-2\">\n                    <button type=\"button\" id=\"btn-copy-diag\" class=\"glass-btn text-xs py-2 px-4 text-cyan-300 hover:text-cyan-200\">\n                      <i class=\"fa-regular fa-copy mr-1.5\"></i> Salin Kesimpulan Klinis\n                    </button>\n                    <button type=\"button\" id=\"btn-reset-diag\" class=\"glass-btn text-xs py-2 px-4\">\n                      <i class=\"fa-solid fa-arrow-rotate-left mr-1.5\"></i> Mulai Kasus Baru\n                    </button>\n                  </div>\n                  <span class=\"text-[11px] text-slate-400 italic\">Disusun berdasarkan Panduan Diagnosis Reumatologi IRA 2020</span>\n                </div>\n              </div>\n\n              <!-- CLINICAL REFERENCE ACCORDION SECTION -->\n              <div class=\"mt-8 space-y-3\">\n                <div class=\"flex items-center gap-2 mb-2 px-1\">\n                  <i class=\"fa-solid fa-book-medical text-cyan-400 text-sm\"></i>\n                  <h4 class=\"text-xs font-bold uppercase tracking-wider text-slate-300\">Panduan & Matriks Klinis Nyeri Sendi</h4>\n                </div>\n\n                <!-- ACCORDION 1: ARTICULAR VS NON-ARTICULAR -->\n                <div class=\"accordion-card\">\n                  <div class=\"accordion-header\" id=\"toggle-articular-def\">\n                    <span class=\"font-semibold text-xs flex items-center gap-2\">\n                      <i class=\"fa-solid fa-table text-cyan-400\"></i>\n                      Tabel Diferensiasi: Nyeri Artikular vs Periartikular vs Nyeri Alih\n                    </span>\n                    <i class=\"fa-solid fa-chevron-down text-xs text-slate-400 transition-transform\"></i>\n                  </div>\n                  <div class=\"accordion-content\" id=\"content-articular-def\">\n                    <table class=\"clinical-table w-full text-xs\">\n                      <thead>\n                        <tr><th>Karakteristik</th><th>Artikular (Intra-Sendi)</th><th>Periartikular (Jaringan Lunak)</th><th>Nyeri Alih (Referred)</th></tr>\n                      </thead>\n                      <tbody>\n                        <tr><td><b>Lokasi Nyeri Tekan</b></td><td>Pada garis sendi (joint line) melingkari kapsul</td><td>Fokal pada bursa, tendo, atau insersi entesis</td><td>Tidak ada nyeri tekan lokal pada sendi terkait</td></tr>\n                        <tr><td><b>Lingkup Gerak (ROM)</b></td><td>Terbatas pada gerakan aktif DAN pasif</td><td>Terbatas terutama pada gerakan aktif tertentu</td><td>ROM sendi lokal normal dan bebas</td></tr>\n                        <tr><td><b>Bengkak / Efusi</b></td><td>Efusi difus menyeluruh kapsular</td><td>Fokal (bursa/selubung tendo) atau tanpa efusi</td><td>Tidak pernah ada pembengkakan lokal</td></tr>\n                        <tr><td><b>Krepitasi</b></td><td>Krepitasi halus atau kasar pada seluruh gerak</td><td>Krepitasi tendo lokal (tenosynovial crepitus)</td><td>Tidak ada krepitasi</td></tr>\n                        <tr><td><b>Contoh Kasus</b></td><td>Osteoartritis, Artritis Reumatoid, Gout, Septik</td><td>Bursitis subakromial, De Quervain, Entesitis</td><td>Nyeri bahu akibat iskemia miokard, radikulopati</td></tr>\n                      </tbody>\n                    </table>\n                  </div>\n                </div>\n\n                <!-- ACCORDION 2: INFLAMMATORY VS MECHANICAL -->\n                <div class=\"accordion-card\">\n                  <div class=\"accordion-header\" id=\"toggle-inflam-def\">\n                    <span class=\"font-semibold text-xs flex items-center gap-2\">\n                      <i class=\"fa-solid fa-fire text-amber-400\"></i>\n                      Tabel Komparasi: Nyeri Inflamasi vs Nyeri Mekanik (Non-Inflamasi)\n                    </span>\n                    <i class=\"fa-solid fa-chevron-down text-xs text-slate-400 transition-transform\"></i>\n                  </div>\n                  <div class=\"accordion-content\" id=\"content-inflam-def\">\n                    <table class=\"clinical-table w-full text-xs\">\n                      <thead>\n                        <tr><th>Fitur Klinis</th><th>Nyeri Inflamasi (Inflammatory)</th><th>Nyeri Mekanik / Degeneratif</th></tr>\n                      </thead>\n                      <tbody>\n                        <tr><td><b>Kaku Pagi (Morning Stiffness)</b></td><td>Lama (&ge; 30 - 60 menit), membaik lambat</td><td>Singkat (&lt; 15 - 30 menit), cepat mereda</td></tr>\n                        <tr><td><b>Pengaruh Aktivitas Fisik</b></td><td><b>Membaik</b> setelah bergerak atau latihan</td><td><b>Memburuk</b> saat beraktivitas / menumpu beban</td></tr>\n                        <tr><td><b>Pengaruh Istirahat</b></td><td><b>Memburuk</b> (fenomena gel / kaku setelah diam)</td><td><b>Membaik</b> saat duduk atau berbaring</td></tr>\n                        <tr><td><b>Tanda Inflamasi Lokal</b></td><td>Sering teraba hangat, eritema, bengkak sinovitis boggy</td><td>Dingin, efusi mekanik tanpa kalor/rubor, osteofit keras</td></tr>\n                        <tr><td><b>Reaktan Fase Akut</b></td><td>LED / ESR dan CRP serum meningkat</td><td>LED dan CRP umumnya dalam batas normal</td></tr>\n                        <tr><td><b>Gejala Sistemik</b></td><td>Kelelahan (fatigue), penurunan BB, demam subfebris</td><td>Tidak ada gejala konstitusional sistemik</td></tr>\n                      </tbody>\n                    </table>\n                  </div>\n                </div>\n\n                <!-- ACCORDION 3: ARTHROCENTESIS -->\n                <div class=\"accordion-card\">\n                  <div class=\"accordion-header\" id=\"toggle-fluid-def\">\n                    <span class=\"font-semibold text-xs flex items-center gap-2\">\n                      <i class=\"fa-solid fa-syringe text-emerald-400\"></i>\n                      Panduan Artrosentesis & Interpretasi Analisis Cairan Sendi (Sinovial)\n                    </span>\n                    <i class=\"fa-solid fa-chevron-down text-xs text-slate-400 transition-transform\"></i>\n                  </div>\n                  <div class=\"accordion-content\" id=\"content-fluid-def\">\n                    <table class=\"clinical-table w-full text-xs\">\n                      <thead>\n                        <tr><th>Kategori</th><th>Kejernihan & Warna</th><th>Viskositas</th><th>Leukosit (/mm&sup3;)</th><th>Neutrofil PMN (%)</th><th>Etiologi Tersering</th></tr>\n                      </thead>\n                      <tbody>\n                        <tr><td><b>Grup I: Non-Inflamasi</b></td><td>Jernih, kuning transparan</td><td>Tinggi (string test &gt; 3 cm)</td><td>&lt; 2.000</td><td>&lt; 25%</td><td>Osteoartritis, trauma ringan, osteonekrosis</td></tr>\n                        <tr><td><b>Grup II: Inflamasi</b></td><td>Keruh / translusen, kuning-hijau</td><td>Rendah (mudah putus)</td><td>2.000 &ndash; 50.000</td><td>&ge; 50%</td><td>Rheumatoid Arthritis, Gout, PsA, Reaktif</td></tr>\n                        <tr><td><b>Grup III: Septik</b></td><td>Sangat keruh / purulen (nanah)</td><td>Sangat rendah</td><td><b>&gt; 50.000</b> (bisa &gt;100k)</td><td><b>&ge; 75 &ndash; 90%</b></td><td>Artritis Septik bakterial (staphylococcus, dll)</td></tr>\n                        <tr><td><b>Grup IV: Hemoragik</b></td><td>Merah darah / xanthochromic</td><td>Bervariasi</td><td>Sesuai darah perifer</td><td>Sesuai darah perifer</td><td>Trauma berat, hemartrosis hemofilia, tumor sinovial</td></tr>\n                      </tbody>\n                    </table>\n                    <div class=\"mt-2 text-[11px] text-slate-300\">\n                      <b>Pemeriksaan Kristal Polarisasi:</b> Kristal Asam Urat (MSU) = bentuk jarum runcing, birefringence negatif kuat (berwarna kuning sejajar sumbu kompensator). Kristal Kalsium Pirofosfat (CPPD) = bentuk romboid/batang pendek, birefringence positif lemah (berwarna biru sejajar sumbu).\n                    </div>\n                  </div>\n                </div>\n\n                <!-- ACCORDION 4: TOPOGRAPHIC DISTRIBUTION -->\n                <div class=\"accordion-card\">\n                  <div class=\"accordion-header\" id=\"toggle-dist-def\">\n                    <span class=\"font-semibold text-xs flex items-center gap-2\">\n                      <i class=\"fa-solid fa-diagram-project text-purple-400\"></i>\n                      Matriks Predileksi Distribusi Sendi Reumatologi Klinis\n                    </span>\n                    <i class=\"fa-solid fa-chevron-down text-xs text-slate-400 transition-transform\"></i>\n                  </div>\n                  <div class=\"accordion-content\" id=\"content-dist-def\">\n                    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs\">\n                      <div class=\"p-3 rounded-lg bg-slate-900/70 border border-slate-700/60\">\n                        <div class=\"font-bold text-cyan-400 mb-1 flex items-center gap-1.5\">\n                          <i class=\"fa-solid fa-hand\"></i> Sendi Tangan & Jari\n                        </div>\n                        <ul class=\"space-y-1 text-slate-300 list-disc list-inside\">\n                          <li><b>Sendi DIP (Distal Interphalangeal):</b> Terkena pada Osteoartritis (Nodul Heberden) dan Artritis Psoriatik (PsA); <u>TIDAK</u> terkena pada RA (RA sparing DIP).</li>\n                          <li><b>Sendi MCP & PIP:</b> Target klasik Rheumatoid Arthritis (simetris) dan SLE.</li>\n                          <li><b>Sendi CMC-1 (Dasar Ibu Jari):</b> Khas pada Osteoartritis tangan (rhizarthrosis).</li>\n                          <li><b>Daktilitis (Sausage Digit):</b> Bengkak difus seluruh jari, khas pada SpA, PsA, atau Gout kronis.</li>\n                        </ul>\n                      </div>\n                      <div class=\"p-3 rounded-lg bg-slate-900/70 border border-slate-700/60\">\n                        <div class=\"font-bold text-purple-400 mb-1 flex items-center gap-1.5\">\n                          <i class=\"fa-solid fa-person-walking\"></i> Ekstremitas Bawah & Aksial\n                        </div>\n                        <ul class=\"space-y-1 text-slate-300 list-disc list-inside\">\n                          <li><b>Sendi MTP-1 (Ibu Jari Kaki):</b> Lokasi klasik Podagra Gout Akut (&gt;50% serangan pertama).</li>\n                          <li><b>Sendi Lutut & Panggul:</b> Predileksi tersering Osteoartritis beban, artritis septik, dan infeksi TB.</li>\n                          <li><b>Sakroiliaka & Kolumna Vertebralis:</b> Khas Spondiloartritis Aksial (Ankylosing Spondylitis, axSpA).</li>\n                          <li><b>Entesitis Tumit (Achilles / Plantar):</b> Hallmark Spondiloartropati (PsA, AS, Artritis Reaktif).</li>\n                        </ul>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n\n              </div>\n\n            </div>\n            <div class=\"card-footer-ref\">\n              <span>Buku Saku Reumatologi Perhimpunan Reumatologi Indonesia (IRA 2020) & EULAR Recommendations</span>\n            </div>\n          </div>","ra-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n          <div class=\"card-grid\">\n            <!-- Diagnosis Criteria Card -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\"/></svg>\n                  Kriteria Klasifikasi ACR/EULAR 2010\n                </h3>\n                <p>Prasyarat: Pasien dengan minimal 1 sendi sinovitis definit tanpa diagnosis diferensial lain. Skor &ge; 6 dari 10 mengklasifikasikan sebagai Rheumatoid Arthritis definit.</p>\n              </div>\n\n              <div class=\"card-body\" style=\"max-height: 520px; overflow-y: auto; padding-right: 6px;\">\n                <!-- Domain A -->\n                <div class=\"check-domain-title\">A. Keterlibatan Sendi (Pilih skor tertinggi, 0 - 5 poin):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-joint\" value=\"0\" checked>1 sendi besar (bahu, siku, panggul, lutut, pergelangan kaki) (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-joint\" value=\"1\">2–10 sendi besar (1)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-joint\" value=\"2\">1–3 sendi kecil (MCP, PIP, MTP 2–5, ibu jari) (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-joint\" value=\"3\">4–10 sendi kecil (3)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-joint\" value=\"5\">&gt;10 sendi (minimal terdapat 1 sendi kecil) (5)</label>\n                </div>\n\n                <!-- Domain B -->\n                <div class=\"check-domain-title\" style=\"margin-top: 1rem;\">B. Serologi (Pilih skor tertinggi, 0 - 3 poin):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-serology\" value=\"0\" checked>RF Negatif DAN ACPA / Anti-CCP Negatif (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-serology\" value=\"2\">RF Positif Rendah ATAU ACPA Positif Rendah (&le; 3&times; batas atas normal) (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-serology\" value=\"3\">RF Positif Tinggi ATAU ACPA Positif Tinggi (&gt; 3&times; batas atas normal) (3)</label>\n                </div>\n\n                <!-- Domain C -->\n                <div class=\"check-domain-title\" style=\"margin-top: 1rem;\">C. Reaktan Fase Akut (0 - 1 poin):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-apr\" value=\"0\" checked>CRP Normal DAN LED / ESR Normal (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-apr\" value=\"1\">CRP Abnormal ATAU LED / ESR Abnormal (1)</label>\n                </div>\n\n                <!-- Domain D -->\n                <div class=\"check-domain-title\" style=\"margin-top: 1rem;\">D. Durasi Gejala Sinovitis (0 - 1 poin):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-duration\" value=\"0\" checked>&lt; 6 Minggu (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ra-duration\" value=\"1\">&ge; 6 Minggu (1)</label>\n                </div>\n              </div>\n\n              <div class=\"btn-group\" style=\"padding: 0 1.25rem 0.5rem;\">\n                <button id=\"btn-calc-ra-acr\" class=\"btn btn-primary\" style=\"flex: 1;\">\n                  <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z\"/></svg>\n                  Evaluasi Kriteria ACR 2010\n                </button>\n                <button id=\"btn-copy-ra-acr\" class=\"btn btn-secondary\" title=\"Salin Hasil Klasifikasi ACR 2010\">\n                  <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                  Salin Hasil\n                </button>\n                <button id=\"btn-reset-ra-acr\" class=\"btn btn-secondary\">Reset</button>\n              </div>\n\n              <div style=\"padding: 0 1.25rem 1.25rem;\">\n                <div id=\"ra-acr-result\" class=\"result-panel\">\n                  <div class=\"result-header\">\n                    <span class=\"result-title\">Hasil Klasifikasi ACR/EULAR 2010</span>\n                  </div>\n                  <div class=\"result-score-line\">\n                    <div id=\"ra-acr-score\" class=\"result-number\">0 / 10</div>\n                    <div id=\"ra-acr-badge\" class=\"status-badge\">Menunggu Evaluasi</div>\n                  </div>\n                  <div id=\"ra-acr-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n\n              <div class=\"card-footer-ref\">\n                <span>Referensi: Aletaha D, et al. Arthritis Rheum 2010;62(9):2569–81</span>\n              </div>\n            </div>\n\n            <!-- Disease Activity Suite Card (DAS28 / CDAI / SDAI) -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6\"/></svg>\n                  Skor Aktivitas Penyakit Artritis Reumatoid\n                </h3>\n                <p>Kalkulator tervalidasi klinis: DAS28-CRP, DAS28-LED (ESR), CDAI, dan SDAI.</p>\n              </div>\n\n              <!-- Sub-tabs for Calculators -->\n              <div class=\"px-5 pt-3\">\n                <div class=\"pill-tabs\" id=\"ra-calc-tabs\">\n                  <div class=\"pill-tab active\" data-tab=\"das-crp\">DAS28-CRP</div>\n                  <div class=\"pill-tab\" data-tab=\"das-esr\">DAS28-LED (ESR)</div>\n                  <div class=\"pill-tab\" data-tab=\"cdai\">CDAI</div>\n                  <div class=\"pill-tab\" data-tab=\"sdai\">SDAI</div>\n                </div>\n\n                <!-- Benchmark Loader Button -->\n                <div class=\"flex justify-end mb-3\">\n                  <button id=\"btn-load-benchmark-ra\" class=\"btn btn-sample text-xs\" title=\"Muat Kasus Uji Benchmark Klinis\">\n                    <i class=\"fa-solid fa-bolt-lightning text-cyan-400 mr-1.5\"></i>\n                    Kasus Benchmark (TJC 6, SJC 4, CRP 15, PGA 40)\n                  </button>\n                </div>\n              </div>\n\n              <div class=\"card-body\" style=\"padding-top: 0;\">\n                <!-- Common / Shared Inputs (Clean 2-Column Grid) -->\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3\">\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Sendi Nyeri (TJC28)</span>\n                      <span class=\"form-hint\">Rentang: 0 - 28</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-tjc\" class=\"input-field text-sm\" min=\"0\" max=\"28\" placeholder=\"0 - 28 sendi\">\n                    <span id=\"err-ra-tjc\" class=\"error-msg\">Wajib diisi antara 0 dan 28 sendi.</span>\n                  </div>\n\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Sendi Bengkak (SJC28)</span>\n                      <span class=\"form-hint\">Rentang: 0 - 28</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-sjc\" class=\"input-field text-sm\" min=\"0\" max=\"28\" placeholder=\"0 - 28 sendi\">\n                    <span id=\"err-ra-sjc\" class=\"error-msg\">Wajib diisi antara 0 dan 28 sendi.</span>\n                  </div>\n                </div>\n\n                <!-- Tab-Specific Inputs -->\n                <!-- 1. DAS28-CRP fields -->\n                <div id=\"fields-das-crp\" class=\"space-y-3\">\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>C-Reactive Protein (CRP)</span>\n                      <span class=\"form-hint\">Satuan: <b>mg/L</b> (&ge; 0 mg/L)</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-crp-mgl\" class=\"input-field text-sm\" min=\"0\" step=\"0.1\" placeholder=\"e.g., 15 (mg/L)\">\n                    <span id=\"err-ra-crp\" class=\"error-msg\">CRP wajib diisi &ge; 0 mg/L.</span>\n                  </div>\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Penilaian Global Pasien (PGA)</span>\n                      <span class=\"form-hint\">VAS: 0 - 100 mm</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-pga-100\" class=\"input-field text-sm\" min=\"0\" max=\"100\" placeholder=\"0 - 100 mm\">\n                    <span id=\"err-ra-pga-100\" class=\"error-msg\">PGA VAS wajib diisi antara 0 dan 100 mm.</span>\n                  </div>\n                </div>\n\n                <!-- 2. DAS28-ESR fields -->\n                <div id=\"fields-das-esr\" class=\"space-y-3\" style=\"display: none;\">\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Laju Endap Darah (LED / ESR Westergren)</span>\n                      <span class=\"form-hint\">Satuan: <b>mm/jam</b> (&ge; 1 mm/jam)</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-esr\" class=\"input-field text-sm\" min=\"1\" max=\"150\" placeholder=\"e.g., 30 (mm/jam)\">\n                    <span id=\"err-ra-esr\" class=\"error-msg\">LED / ESR wajib diisi &ge; 1 mm/jam.</span>\n                  </div>\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Penilaian Global Pasien (PGA)</span>\n                      <span class=\"form-hint\">VAS: 0 - 100 mm</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-pga-esr\" class=\"input-field text-sm\" min=\"0\" max=\"100\" placeholder=\"0 - 100 mm\">\n                    <span id=\"err-ra-pga-esr\" class=\"error-msg\">PGA VAS wajib diisi antara 0 dan 100 mm.</span>\n                  </div>\n                </div>\n\n                <!-- 3. CDAI fields -->\n                <div id=\"fields-cdai\" class=\"space-y-3\" style=\"display: none;\">\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Penilaian Global Pasien (PGA 0-10)</span>\n                      <span class=\"form-hint\">VAS: 0.0 - 10.0 cm</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-pga-10\" class=\"input-field text-sm\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                    <span id=\"err-ra-pga-10\" class=\"error-msg\">PGA wajib diisi antara 0 dan 10.</span>\n                  </div>\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Penilaian Global Dokter / Evaluator (EGA 0-10)</span>\n                      <span class=\"form-hint\">VAS: 0.0 - 10.0 cm</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-ega-10\" class=\"input-field text-sm\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                    <span id=\"err-ra-ega-10\" class=\"error-msg\">EGA wajib diisi antara 0 dan 10.</span>\n                  </div>\n                </div>\n\n                <!-- 4. SDAI fields -->\n                <div id=\"fields-sdai\" class=\"space-y-3\" style=\"display: none;\">\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Penilaian Global Pasien (PGA 0-10)</span>\n                      <span class=\"form-hint\">VAS: 0.0 - 10.0 cm</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-sdai-pga\" class=\"input-field text-sm\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                    <span id=\"err-ra-sdai-pga\" class=\"error-msg\">PGA wajib diisi antara 0 dan 10.</span>\n                  </div>\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Penilaian Global Dokter (EGA 0-10)</span>\n                      <span class=\"form-hint\">VAS: 0.0 - 10.0 cm</span>\n                    </label>\n                    <input type=\"number\" id=\"ra-sdai-ega\" class=\"input-field text-sm\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                    <span id=\"err-ra-sdai-ega\" class=\"error-msg\">EGA wajib diisi antara 0 dan 10.</span>\n                  </div>\n                  <div class=\"form-group mb-0\">\n                    <label class=\"form-label text-xs\">\n                      <span>Kadar CRP (mg/dL)</span>\n                      <span class=\"form-hint\">Catatan: <b>1 mg/dL = 10 mg/L</b></span>\n                    </label>\n                    <input type=\"number\" id=\"ra-sdai-crp\" class=\"input-field text-sm\" min=\"0\" step=\"0.01\" placeholder=\"e.g., 1.5 (mg/dL)\">\n                    <span id=\"err-ra-sdai-crp\" class=\"error-msg\">CRP (mg/dL) wajib diisi &ge; 0.</span>\n                  </div>\n                </div>\n\n                <!-- Action Buttons -->\n                <div class=\"btn-group mt-4\">\n                  <button id=\"btn-calc-ra-activity\" class=\"btn btn-primary\" style=\"flex: 1;\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z\"/></svg>\n                    Hitung Aktivitas Penyakit\n                  </button>\n                  <button id=\"btn-copy-ra-result\" class=\"btn btn-secondary\" title=\"Salin Hasil Aktivitas RA\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-ra-activity\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <!-- Calculation Result Panel -->\n                <div id=\"ra-activity-result\" class=\"result-panel\">\n                  <div class=\"result-header\">\n                    <span id=\"ra-res-title\" class=\"result-title\">Hasil Skor Aktivitas Penyakit</span>\n                  </div>\n                  <div class=\"result-score-line\">\n                    <div id=\"ra-res-number\" class=\"result-number\">--</div>\n                    <div id=\"ra-res-badge\" class=\"status-badge\">Menunggu Input</div>\n                  </div>\n\n                  <!-- Cutoff Range Visualizer -->\n                  <div class=\"cutoff-bar\">\n                    <div class=\"cutoff-seg remission\" title=\"Remisi\"></div>\n                    <div class=\"cutoff-seg low\" title=\"Aktivitas Rendah\"></div>\n                    <div class=\"cutoff-seg moderate\" title=\"Aktivitas Sedang\"></div>\n                    <div class=\"cutoff-seg high\" title=\"Aktivitas Tinggi\"></div>\n                  </div>\n                  <div id=\"ra-cutoff-labels\" class=\"cutoff-labels\">\n                    <span>Remisi: &le;2.60</span>\n                    <span>Rendah: 2.61-3.20</span>\n                    <span>Sedang: 3.21-5.10</span>\n                    <span>Tinggi: >5.10</span>\n                  </div>\n\n                  <div id=\"ra-res-details\" class=\"result-details\"></div>\n                </div>\n\n              </div>\n              <div class=\"card-footer-ref\">\n                <span id=\"ra-formula-ref\">Formula: 0.56*&radic;(TJC) + 0.28*&radic;(SJC) + 0.36*ln(CRP+1) + 0.014*(PGA) + 0.96</span>\n              </div>\n            </div>\n          </div>","sle-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n          <div class=\"card-grid\">\n            <!-- Classification Criteria EULAR/ACR 2019 -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z\"/></svg>\n                  Kriteria Klasifikasi SLE (EULAR/ACR 2019)\n                </h3>\n                <p>Prasyarat: ANA titer &ge; 1:80. Hitung poin tertinggi per domain. Skor &ge; 10 mengklasifikasikan SLE.</p>\n              </div>\n\n              <div class=\"card-body\" style=\"max-height: 520px; overflow-y: auto; padding-right: 6px;\">\n                <!-- Entry Criterion Check -->\n                <label class=\"check-item\" style=\"border-color: rgba(0, 242, 254, 0.35); background: rgba(0, 242, 254, 0.05);\">\n                  <input type=\"checkbox\" id=\"sle-ana-entry\" checked>\n                  <div>\n                    <span style=\"font-weight: 700; color: #FFFFFF;\">Prasyarat Masuk: ANA Positif &ge; 1:80 pada sel HEp-2</span>\n                    <div style=\"font-size: 0.74rem; color: var(--accent-cyan);\">Wajib positif untuk dapat mengaplikasikan kriteria EULAR/ACR 2019</div>\n                  </div>\n                </label>\n\n                <!-- Domain 1: Konstitusional -->\n                <div class=\"check-domain-title\">1. Konstitusional</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sle-acr-item\">Demam > 38.3&deg;C tanpa infeksi (2)</label>\n                </div>\n\n                <!-- Domain 2: Muskuloskeletal -->\n                <div class=\"check-domain-title\">2. Muskuloskeletal</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"6\" class=\"sle-acr-item\">Artritis / Sinovitis &ge; 2 sendi atau nyeri tekan & kaku pagi &ge; 30 mnt (6)</label>\n                </div>\n\n                <!-- Domain 3: Hematologi -->\n                <div class=\"check-domain-title\">3. Hematologi (Pilih skor tertinggi)</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-hem\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-hem\" value=\"3\">Leukopenia &lt; 4.000 / &mu;L (3)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-hem\" value=\"4\">Trombositopenia &lt; 100.000 / &mu;L (4)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-hem\" value=\"4\">Anemia Hemolitik Autoimun (Coombs+) (4)</label>\n                </div>\n\n                <!-- Domain 4: Neuropsikiatri -->\n                <div class=\"check-domain-title\">4. Neuropsikiatri (Pilih skor tertinggi)</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-neuro\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-neuro\" value=\"2\">Delirium akut (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-neuro\" value=\"3\">Psikosis lupus (3)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-neuro\" value=\"5\">Kejang (5)</label>\n                </div>\n\n                <!-- Domain 5: Mukokutan -->\n                <div class=\"check-domain-title\">5. Mukokutan (Pilih skor tertinggi)</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-skin\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-skin\" value=\"2\">Non-scarring Alopecia (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-skin\" value=\"2\">Ulkus oral (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-skin\" value=\"4\">Lupus kutan subakut / diskoid (4)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-skin\" value=\"6\">Lupus kutan akut (malar rash) (6)</label>\n                </div>\n\n                <!-- Domain 6: Serosa -->\n                <div class=\"check-domain-title\">6. Serosa (Pilih skor tertinggi)</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-serosa\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-serosa\" value=\"5\">Efusi pleura atau perikardial (5)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-serosa\" value=\"6\">Perikarditis akut (6)</label>\n                </div>\n\n                <!-- Domain 7: Renal -->\n                <div class=\"check-domain-title\">7. Renal (Pilih skor tertinggi)</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-renal\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-renal\" value=\"4\">Proteinuria > 0.5 g / 24 jam (4)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-renal\" value=\"8\">Biopsi: Nefritis Lupus Kelas II / V (8)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-renal\" value=\"10\">Biopsi: Nefritis Lupus Kelas III / IV (10)</label>\n                </div>\n\n                <!-- Domain 8: Antibodi Antifosfolipid -->\n                <div class=\"check-domain-title\">8. Antibodi Antifosfolipid</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sle-acr-item\">aCL IgG/IgM tinggi, anti-&beta;2GP1, atau Lupus Antikoagulan (2)</label>\n                </div>\n\n                <!-- Domain 9: Komplemen -->\n                <div class=\"check-domain-title\">9. Komplemen (Pilih skor tertinggi)</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-comp\" value=\"0\" checked>Normal (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-comp\" value=\"3\">C3 rendah ATAU C4 rendah (3)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"sle-comp\" value=\"4\">C3 rendah DAN C4 rendah (4)</label>\n                </div>\n\n                <!-- Domain 10: Antibodi Spesifik SLE -->\n                <div class=\"check-domain-title\">10. Antibodi Spesifik</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"6\" class=\"sle-acr-item\">Anti-dsDNA ATAU Anti-Smith (Sm) Positif (6)</label>\n                </div>\n              </div>\n\n              <div class=\"btn-group\">\n                <button id=\"btn-calc-sle-acr\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung Skor SLE</button>\n                <button id=\"btn-copy-sle-acr\" class=\"btn btn-secondary\" title=\"Salin Hasil Kriteria EULAR/ACR 2019\">\n                  <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                  Salin Hasil\n                </button>\n                <button id=\"btn-reset-sle-acr\" class=\"btn btn-secondary\">Reset</button>\n              </div>\n\n              <div id=\"sle-acr-result\" class=\"result-panel\">\n                <div class=\"result-header\"><span class=\"result-title\">Hasil Evaluasi SLE</span></div>\n                <div class=\"result-score-line\">\n                  <div id=\"sle-acr-score-num\" class=\"result-number\">0 Poin</div>\n                  <div id=\"sle-acr-badge\" class=\"status-badge\">Menunggu Evaluasi</div>\n                </div>\n                <div id=\"sle-acr-text\" class=\"result-details\"></div>\n              </div>\n\n              <div class=\"card-footer-ref\">\n                <span>Referensi: Aringer M, et al. Arthritis Rheumatol 2019;71(9):1400–12</span>\n              </div>\n            </div>\n\n            <!-- Activity Calculator Suite: SLEDAI-2K & MEX-SLEDAI -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 10V3L4 14h7v7l9-11h-7z\"/></svg>\n                  Skor Aktivitas Penyakit Lupus Eritematosus Sistemik\n                </h3>\n                <p>Pilih instrumen: <b>SLEDAI-2K</b> (standar baku emas dengan tes imunologi) atau <b>MEX-SLEDAI</b> (skor klinis tervalidasi tanpa tes dsDNA & komplemen).</p>\n              </div>\n\n              <!-- Pill Tabs for SLE Activity Calculators -->\n              <div class=\"px-5 pt-3\">\n                <div class=\"pill-tabs\" id=\"sle-calc-tabs\">\n                  <div class=\"pill-tab active\" data-tab=\"sledai-2k\">SLEDAI-2K (Standar Imunologi)</div>\n                  <div class=\"pill-tab\" data-tab=\"mex-sledai\">MEX-SLEDAI (Klinis / Faskes Terbatas)</div>\n                </div>\n              </div>\n\n              <!-- PANEL 1: SLEDAI-2K -->\n              <div id=\"panel-sledai-2k\">\n                <div class=\"card-body\" style=\"max-height: 520px; overflow-y: auto; padding-right: 6px; padding-top: 0;\">\n                  <!-- Bobot 8 -->\n                  <div class=\"check-domain-title\"><span class=\"tier-badge tier-8\">Bobot 8 (Aktivitas Berat)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Kejang onset baru (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Psikosis lupus tanpa delirium (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Organic Brain Syndrome (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Gangguan visual (retinitis, eksudat, skleritis) (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Defisit saraf kranial onset baru (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Sakit kepala lupus berat persisten (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">CVA / Stroke lupus baru (8)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"sledai-item\">Vaskulitis (gangren, infark periungual, ulserasi) (8)</label>\n                  </div>\n\n                  <!-- Bobot 4 -->\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-4\">Bobot 4 (Aktivitas Sedang)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"sledai-item\">Artritis (> 2 sendi nyeri dan bengkak) (4)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"sledai-item\">Miositis proksimal (4)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"sledai-item\">Silinder urin (granular / sel darah merah) (4)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"sledai-item\">Hematuria (> 5 eritrosit/LPB non-infeksi) (4)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"sledai-item\">Proteinuria onset baru (> 0.5 g/24 jam) (4)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"sledai-item\">Piuria (> 5 leukosit/LPB non-infeksi) (4)</label>\n                  </div>\n\n                  <!-- Bobot 2 -->\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-2\">Bobot 2 (Aktivitas Ringan)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Ruam inflamasi baru / rekuren (2)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Alopesia difus / bercak non-scarring (2)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Ulkus mukosa oral / nasal (2)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Pleuritis dengan rub atau efusi (2)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Perikarditis dengan rub atau EKG khas (2)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Komplemen rendah (C3 / C4 di bawah normal) (2)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"sledai-item\">Peningkatan anti-dsDNA di atas rentang normal (2)</label>\n                  </div>\n\n                  <!-- Bobot 1 -->\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-1\">Bobot 1 (Aktivitas Minimal)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"sledai-item\">Demam > 38.0&deg;C non-infeksi (1)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"sledai-item\">Trombositopenia &lt; 100.000 / &mu;L (1)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"sledai-item\">Leukopenia &lt; 4.000 / &mu;L (1)</label>\n                  </div>\n                </div>\n\n                <div class=\"btn-group\" style=\"padding: 0 1.25rem 0.5rem;\">\n                  <button id=\"btn-calc-sledai\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung SLEDAI-2K</button>\n                  <button id=\"btn-copy-sledai\" class=\"btn btn-secondary\" title=\"Salin Hasil SLEDAI-2K\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-sledai\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div style=\"padding: 0 1.25rem 1.25rem;\">\n                  <div id=\"sledai-result\" class=\"result-panel\">\n                    <div class=\"result-header\"><span class=\"result-title\">Hasil Skor SLEDAI-2K</span></div>\n                    <div class=\"result-score-line\">\n                      <div id=\"sledai-score-num\" class=\"result-number\">0</div>\n                      <div id=\"sledai-badge\" class=\"status-badge\">Tidak Ada Aktivitas</div>\n                    </div>\n                    <div id=\"sledai-desc\" class=\"result-details\"></div>\n                  </div>\n                </div>\n\n                <div class=\"card-footer-ref\">\n                  <span>Referensi: Gladman DD, et al. J Rheumatol 2002;29(2):288–91</span>\n                </div>\n              </div>\n\n              <!-- PANEL 2: MEX-SLEDAI (Clinical modification without specialized immunology) -->\n              <div id=\"panel-mex-sledai\" style=\"display: none;\">\n                <div class=\"card-body\" style=\"max-height: 520px; overflow-y: auto; padding-right: 6px; padding-top: 0;\">\n                  <div class=\"p-3 mb-3 rounded-lg bg-cyan-950/30 border border-cyan-500/25 text-xs text-slate-300\">\n                    <i class=\"fa-solid fa-circle-info text-cyan-400 mr-1.5\"></i>\n                    <b>MEX-SLEDAI (Mexican SLEDAI):</b> Indeks aktivitas tervalidasi yang dirancang khusus untuk faskes tanpa fasilitas pemeriksaan anti-dsDNA dan komplemen C3/C4 serial. Menilai 11 domain klinis & lab rutin dalam 30 hari terakhir.\n                  </div>\n\n                  <div class=\"check-domain-title\"><span class=\"tier-badge tier-8\">Bobot 8 (Aktivitas Sangat Berat)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"8\" class=\"mex-sledai-item\"><b>Gangguan Neurologis (Skor 8):</b> Psikosis lupus, konvulsi/kejang baru, organic brain syndrome, defisit saraf kranial, stroke lupus, atau mielitis transversa</label>\n                  </div>\n\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-8\" style=\"background: rgba(239, 68, 68, 0.2); color: #FCA5A5;\">Bobot 6 (Keterlibatan Renal)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"6\" class=\"mex-sledai-item\"><b>Gangguan Ginjal / Renal (Skor 6):</b> Proteinuria onset baru &gt; 0.5 g/24 jam, hematuria &gt; 5 eritrosit/LPB non-infeksi, silinder leukosit/eritrosit, atau peningkatan kreatinin serum &gt; 50%</label>\n                  </div>\n\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-4\">Bobot 4 (Vaskulitis)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"4\" class=\"mex-sledai-item\"><b>Vaskulitis (Skor 4):</b> Ulkus kulit aktif, gangren digital, infark periungual, splinter hemorrhage, atau vaskulitis sistemik organ</label>\n                  </div>\n\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-4\" style=\"background: rgba(245, 158, 11, 0.2); color: #FCD34D;\">Bobot 3 (Hemolisis & Miositis)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"3\" class=\"mex-sledai-item\"><b>Hemolisis Autoimun (Skor 3):</b> Anemia hemolitik (penurunan Hb dengan tes Coombs positif atau retikulositosis &gt; 3%)</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"3\" class=\"mex-sledai-item\"><b>Miositis (Skor 3):</b> Nyeri atau kelemahan otot proksimal dengan peningkatan enzim otot CPK atau aldolase</label>\n                  </div>\n\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-2\">Bobot 2 (Artritis, Mukokutan, Serositis)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"mex-sledai-item\"><b>Artritis Inflamasi (Skor 2):</b> Keterlibatan aktif pada &ge; 2 sendi dengan nyeri tekan, pembengkakan sinovitis, dan kaku pagi hari</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"mex-sledai-item\"><b>Mukokutan (Skor 2):</b> Ruam malar aktif, ruam diskoid, ulkus oral/nasal aktif, atau fotosensitivitas baru</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"mex-sledai-item\"><b>Serositis (Skor 2):</b> Pleuritis atau perikarditis aktif dengan friction rub, efusi pada foto/USG, atau EKG khas</label>\n                  </div>\n\n                  <div class=\"check-domain-title\" style=\"margin-top: 1rem;\"><span class=\"tier-badge tier-1\">Bobot 1 (Sitopenia & Demam)</span></div>\n                  <div class=\"checklist-container\">\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"mex-sledai-item\"><b>Demam (Skor 1):</b> Suhu tubuh &gt; 38.0&deg;C tanpa bukti penyebab infeksi lain</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"mex-sledai-item\"><b>Trombositopenia (Skor 1):</b> Hitung trombosit &lt; 100.000 / &mu;L tanpa penyebab lain</label>\n                    <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"mex-sledai-item\"><b>Leukopenia (Skor 1):</b> Hitung leukosit &lt; 4.000 / &mu;L non-iatrogenik</label>\n                  </div>\n                </div>\n\n                <div class=\"btn-group\" style=\"padding: 0 1.25rem 0.5rem;\">\n                  <button id=\"btn-calc-mex-sledai\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung MEX-SLEDAI</button>\n                  <button id=\"btn-copy-mex-sledai\" class=\"btn btn-secondary\" title=\"Salin Hasil MEX-SLEDAI\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-mex-sledai\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div style=\"padding: 0 1.25rem 1.25rem;\">\n                  <div id=\"mex-sledai-result\" class=\"result-panel\">\n                    <div class=\"result-header\"><span class=\"result-title\">Hasil Skor MEX-SLEDAI</span></div>\n                    <div class=\"result-score-line\">\n                      <div id=\"mex-sledai-score-num\" class=\"result-number\">0 / 33</div>\n                      <div id=\"mex-sledai-badge\" class=\"status-badge\">Tidak Ada Aktivitas</div>\n                    </div>\n                    <div id=\"mex-sledai-desc\" class=\"result-details\"></div>\n                  </div>\n                </div>\n\n                <div class=\"card-footer-ref\">\n                  <span>Referensi: Guzmán J, et al. J Rheumatol 1992;19(10):1551–1558 (Validasi Indeks Aktivitas SLE Tanpa Tes Imunologi)</span>\n                </div>\n              </div>\n            </div>\n          </div>","psa-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n          <div class=\"card-grid\">\n            <!-- CASPAR Criteria -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1\"/></svg>\n                  Kriteria Klasifikasi CASPAR (2006)\n                </h3>\n                <p>Prasyarat: terdapat penyakit sendi inflamasi (sendi, tulang belakang, atau entesis). Skor &ge; 3 mengklasifikasikan sebagai PsA.</p>\n              </div>\n\n              <div class=\"card-body\">\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"caspar-item\">Psoriasis kutan saat ini (Skor 2)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"caspar-item\">Riwayat psoriasis pribadi / keluarga tingkat 1 (Skor 1)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"caspar-item\">Distrofi kuku psoriatik (pitting, onikolisis, hiperkeratosis) (Skor 1)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"caspar-item\">Faktor Reumatoid (RF) negatif (Skor 1)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"caspar-item\">Daktilitis (saat ini atau riwayat daktilitis oleh dokter) (Skor 1)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"1\" class=\"caspar-item\">Bukti radiologis formasi tulang baru juxta-artikular (Skor 1)</label>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-calc-caspar\" class=\"btn btn-primary\" style=\"flex: 1;\">Evaluasi CASPAR</button>\n                  <button id=\"btn-copy-caspar\" class=\"btn btn-secondary\" title=\"Salin Hasil CASPAR\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-caspar\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"caspar-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Hasil Kriteria CASPAR</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"caspar-score-num\" class=\"result-number\">0 / 6</div>\n                    <div id=\"caspar-badge\" class=\"status-badge\">Menunggu Evaluasi</div>\n                  </div>\n                  <div id=\"caspar-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n              <div class=\"card-footer-ref\">\n                <span>Referensi: Taylor W, et al. Arthritis Rheum 2006;54(8):2665–73</span>\n              </div>\n            </div>\n\n            <!-- DAPSA Disease Activity Calculator -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z\"/></svg>\n                  Skor Aktivitas Penyakit PsA (DAPSA)\n                </h3>\n                <p>Disease Activity Index for Psoriatic Arthritis: TJC68 + SJC66 + CRP(mg/dL) + PGA(0-10) + Nyeri(0-10).</p>\n              </div>\n\n              <div class=\"card-body\">\n                <div class=\"form-group\">\n                  <label class=\"form-label\">\n                    <span>Jumlah Sendi Nyeri (0 - 68)</span>\n                  </label>\n                  <input type=\"number\" id=\"psa-tjc\" class=\"input-field\" min=\"0\" max=\"68\" placeholder=\"0 - 68\">\n                  <span id=\"err-psa-tjc\" class=\"error-msg\">Wajib diisi antara 0 dan 68.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">\n                    <span>Jumlah Sendi Bengkak (0 - 66)</span>\n                  </label>\n                  <input type=\"number\" id=\"psa-sjc\" class=\"input-field\" min=\"0\" max=\"66\" placeholder=\"0 - 66\">\n                  <span id=\"err-psa-sjc\" class=\"error-msg\">Wajib diisi antara 0 dan 66.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">\n                    <span>Kadar CRP (mg/dL)</span>\n                    <span class=\"form-hint\">Contoh: 15 mg/L = 1.5 mg/dL</span>\n                  </label>\n                  <input type=\"number\" id=\"psa-crp\" class=\"input-field\" min=\"0\" step=\"0.1\" placeholder=\"e.g., 1.5 (mg/dL)\">\n                  <span id=\"err-psa-crp\" class=\"error-msg\">CRP (mg/dL) wajib diisi &ge; 0.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">\n                    <span>Penilaian Global Pasien (0 - 10)</span>\n                  </label>\n                  <input type=\"number\" id=\"psa-pga\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-psa-pga\" class=\"error-msg\">PGA wajib diisi antara 0 dan 10.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">\n                    <span>Skala Nyeri Pasien (0 - 10)</span>\n                  </label>\n                  <input type=\"number\" id=\"psa-pain\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-psa-pain\" class=\"error-msg\">Skala nyeri wajib diisi antara 0 dan 10.</span>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-calc-dapsa\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung DAPSA</button>\n                  <button id=\"btn-copy-dapsa\" class=\"btn btn-secondary\" title=\"Salin Hasil DAPSA\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-dapsa\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"dapsa-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Hasil Skor DAPSA</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"dapsa-score-num\" class=\"result-number\">--</div>\n                    <div id=\"dapsa-badge\" class=\"status-badge\">Menunggu Input</div>\n                  </div>\n                  <div id=\"dapsa-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n              <div class=\"card-footer-ref\">\n                <span>Cutoff: &le;4 Remisi | 4.1-14 Rendah | 14.1-28 Sedang | >28 Tinggi</span>\n              </div>\n            </div>\n          </div>","as-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n          <div class=\"card-grid\">\n            <!-- ASAS Classification -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z\"/></svg>\n                  Kriteria Klasifikasi SpA Aksial (ASAS 2009)\n                </h3>\n                <p>Untuk pasien dengan nyeri punggung kronis &ge; 3 bulan dan onset usia &lt; 45 tahun.</p>\n              </div>\n\n              <div class=\"card-body\">\n                <div class=\"check-domain-title\">Pilar Utama (Pilih yang positif):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" id=\"as-sacroiliitis\">Sakroilitis pada Pencitraan (MRI aktif atau X-ray definit)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" id=\"as-hla-b27\">HLA-B27 Positif</label>\n                </div>\n\n                <div class=\"check-domain-title\" style=\"margin-top: 1rem;\">Fitur Spondiloartritis (SpA Features):</div>\n                <div class=\"checklist-container\" style=\"max-height: 250px; overflow-y: auto;\">\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Nyeri punggung inflamasi (IBP)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Artritis perifer</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Entesitis (tendon Achilles / fasia plantar)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Uveitis anterior akut</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Daktilitis</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Psoriasis</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Penyakit Crohn / Kolitis Ulseratif (IBD)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Respon baik terhadap NSAID (24-48 jam)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Riwayat keluarga SpA tingkat 1/2</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" class=\"as-feature\">Peningkatan CRP / LED tanpa penyebab lain</label>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-calc-as-asas\" class=\"btn btn-primary\" style=\"flex: 1;\">Evaluasi ASAS</button>\n                  <button id=\"btn-copy-as-asas\" class=\"btn btn-secondary\" title=\"Salin Hasil Kriteria ASAS\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-as-asas\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"as-asas-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Hasil Klasifikasi ASAS</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"as-asas-badge\" class=\"status-badge\">Menunggu Evaluasi</div>\n                  </div>\n                  <div id=\"as-asas-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n              <div class=\"card-footer-ref\">\n                <span>Referensi: Rudwaleit M, et al. Ann Rheum Dis 2009;68(6):770–6</span>\n              </div>\n            </div>\n\n            <!-- BASDAI Disease Activity Calculator -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 10V3L4 14h7v7l9-11h-7z\"/></svg>\n                  Skor Aktivitas BASDAI\n                </h3>\n                <p>Bath Ankylosing Spondylitis Disease Activity Index (0-10 skala VAS untuk 7 hari terakhir). Skor &ge; 4 menandakan penyakit aktif.</p>\n              </div>\n\n              <div class=\"card-body\">\n                <div class=\"form-group\">\n                  <label class=\"form-label\"><span>1. Tingkat kelelahan / lesu (fatigue)?</span></label>\n                  <input type=\"number\" id=\"basdai-q1\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-basdai-q1\" class=\"error-msg\">Wajib diisi 0 - 10.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\"><span>2. Tingkat nyeri leher, punggung, atau panggul?</span></label>\n                  <input type=\"number\" id=\"basdai-q2\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-basdai-q2\" class=\"error-msg\">Wajib diisi 0 - 10.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\"><span>3. Tingkat nyeri / bengkak sendi perifer lainnya?</span></label>\n                  <input type=\"number\" id=\"basdai-q3\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-basdai-q3\" class=\"error-msg\">Wajib diisi 0 - 10.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\"><span>4. Tingkat nyeri saat area entesis disentuh/ditekan?</span></label>\n                  <input type=\"number\" id=\"basdai-q4\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-basdai-q4\" class=\"error-msg\">Wajib diisi 0 - 10.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\"><span>5. Tingkat keparahan kaku pagi hari?</span></label>\n                  <input type=\"number\" id=\"basdai-q5\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-basdai-q5\" class=\"error-msg\">Wajib diisi 0 - 10.</span>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\"><span>6. Durasi kaku pagi hari (0 = 0 jam, 5 = 1 jam, 10 = &ge;2 jam)?</span></label>\n                  <input type=\"number\" id=\"basdai-q6\" class=\"input-field\" min=\"0\" max=\"10\" step=\"0.1\" placeholder=\"0.0 - 10.0\">\n                  <span id=\"err-basdai-q6\" class=\"error-msg\">Wajib diisi 0 - 10.</span>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-calc-basdai\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung Skor BASDAI</button>\n                  <button id=\"btn-copy-basdai\" class=\"btn btn-secondary\" title=\"Salin Hasil Skor BASDAI\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-basdai\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"basdai-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Hasil Skor BASDAI</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"basdai-score-num\" class=\"result-number\">--</div>\n                    <div id=\"basdai-badge\" class=\"status-badge\">Menunggu Input</div>\n                  </div>\n                  <div id=\"basdai-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n              <div class=\"card-footer-ref\">\n                <span>Formula: ((Q1 + Q2 + Q3 + Q4) + ((Q5 + Q6) / 2)) / 5</span>\n              </div>\n            </div>\n          </div>","ssc-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n          <div class=\"card-grid\">\n            <!-- ACR/EULAR 2013 Criteria -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4\"/></svg>\n                  Kriteria Klasifikasi Sklerosis Sistemik (ACR/EULAR 2013)\n                </h3>\n                <p>Skor total &ge; 9 mengklasifikasikan sebagai Sklerosis Sistemik definit.</p>\n              </div>\n\n              <div class=\"card-body\" style=\"max-height: 520px; overflow-y: auto;\">\n                <label class=\"check-item\" style=\"border-color: rgba(0, 242, 254, 0.3); background: rgba(0, 242, 254, 0.05);\">\n                  <input type=\"checkbox\" data-score=\"9\" class=\"ssc-item\">\n                  <div>\n                    <span style=\"font-weight: 700; color: #FFFFFF;\">Penebalan kulit kedua tangan meluas proksimal dari sendi MCP (Skor 9 - Kriteria Cukup)</span>\n                  </div>\n                </label>\n\n                <div class=\"check-domain-title\">Penebalan Kulit Jari (Pilih skor tertinggi):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ssc-fingers\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ssc-fingers\" value=\"2\">Puffy fingers / bengkak pada jari (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ssc-fingers\" value=\"4\">Sklerodaktili (distal dari MCP) (4)</label>\n                </div>\n\n                <div class=\"check-domain-title\" style=\"margin-top: 1rem;\">Lesi Ujung Jari (Pilih skor tertinggi):</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ssc-lesions\" value=\"0\" checked>Tidak ada (0)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ssc-lesions\" value=\"2\">Ulkus digitalis (2)</label>\n                  <label class=\"check-item\"><input type=\"radio\" name=\"ssc-lesions\" value=\"3\">Pitting scars di bantalan ujung jari (3)</label>\n                </div>\n\n                <div class=\"check-domain-title\" style=\"margin-top: 1rem;\">Manifestasi Klinis & Laboratoris Lainnya:</div>\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"ssc-item\">Telangiektasia (2)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"ssc-item\">Kapilaroskopi lipatan kuku abnormal (giant capillaries / avascular) (2)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"2\" class=\"ssc-item\">Hipertensi Arteri Pulmonal (PAH) dan/atau Interstitial Lung Disease (ILD) (2)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"3\" class=\"ssc-item\">Fenomena Raynaud (3)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" data-score=\"3\" class=\"ssc-item\">Autoantibodi spesifik SSc (Anti-Scl-70, ACA / Anti-Centromere, Anti-RNA Pol III) (3)</label>\n                </div>\n              </div>\n\n              <div class=\"btn-group\">\n                <button id=\"btn-calc-ssc\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung Skor SSc</button>\n                <button id=\"btn-copy-ssc\" class=\"btn btn-secondary\" title=\"Salin Hasil Kriteria SSc\">\n                  <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                  Salin Hasil\n                </button>\n                <button id=\"btn-reset-ssc\" class=\"btn btn-secondary\">Reset</button>\n              </div>\n\n              <div id=\"ssc-result\" class=\"result-panel\">\n                <div class=\"result-header\"><span class=\"result-title\">Hasil Evaluasi Sklerosis Sistemik</span></div>\n                <div class=\"result-score-line\">\n                  <div id=\"ssc-score-num\" class=\"result-number\">0 / 9</div>\n                  <div id=\"ssc-badge\" class=\"status-badge\">Menunggu Evaluasi</div>\n                </div>\n                <div id=\"ssc-desc\" class=\"result-details\"></div>\n              </div>\n\n              <div class=\"card-footer-ref\">\n                <span>Referensi: Van den Hoogen F, et al. Arthritis Rheum 2013;65(11):2737–47</span>\n              </div>\n            </div>\n\n            <!-- Modified Rodnan Skin Score (mRSS) -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z\"/></svg>\n                  Skor Kulit Rodnan Termodifikasi (mRSS)\n                </h3>\n                <p>Penilaian palpasi ketebalan kulit pada 17 area anatomis (skala 0-3 per area, total 0-51).</p>\n              </div>\n\n              <div class=\"card-body\">\n                <!-- Vector Anatomical Mannequin (17 Areas & Severity Scale) -->\n                <div style=\"background: rgba(226, 232, 240, 0.95); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--card-border); color: #0F172A; margin-bottom: 0.5rem;\">\n                  <div style=\"display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;\">\n                    <span style=\"font-weight: 700; font-size: 0.82rem; color: #0F172A;\">Peta Anatomis 17 Area Palpasi mRSS</span>\n                    <span style=\"font-size: 0.7rem; color: #475569; font-weight: 500;\">Skor: 0 (Normal) - 3 (Penebalan Berat)</span>\n                  </div>\n\n                  <svg viewBox=\"0 0 700 700\" style=\"width: 100%; height: auto; display: block; border-radius: 8px;\" aria-label=\"Diagram Anatomis 17 Area Palpasi mRSS\">\n                    <!-- Background Card -->\n                    <rect width=\"700\" height=\"700\" fill=\"#EAE8E3\" rx=\"10\"/>\n\n                    <!-- Legend Box -->\n                    <rect x=\"25\" y=\"25\" width=\"205\" height=\"110\" fill=\"#E2DFD8\" stroke=\"#D1CDC4\" stroke-width=\"1.2\" rx=\"6\"/>\n                    <!-- 0: Uninvolved -->\n                    <rect x=\"38\" y=\"37\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\" stroke-width=\"0.8\"/>\n                    <text x=\"62\" y=\"50\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#1E293B\" font-weight=\"500\">Uninvolved (0)</text>\n                    <!-- 1: Mild -->\n                    <rect x=\"38\" y=\"60\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\" stroke-width=\"0.8\"/>\n                    <text x=\"62\" y=\"73\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#1E293B\" font-weight=\"500\">Mild thickening (1)</text>\n                    <!-- 2: Moderate -->\n                    <rect x=\"38\" y=\"83\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\" stroke-width=\"0.8\"/>\n                    <text x=\"62\" y=\"96\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#1E293B\" font-weight=\"500\">Moderate thickening (2)</text>\n                    <!-- 3: Severe -->\n                    <rect x=\"38\" y=\"106\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\" stroke-width=\"0.8\"/>\n                    <text x=\"62\" y=\"119\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#1E293B\" font-weight=\"500\">Severe thickening (3)</text>\n\n                    <!-- Human Silhouette (Mannequin) -->\n                    <!-- Head -->\n                    <circle cx=\"350\" cy=\"120\" r=\"28\" fill=\"#FFFFFF\" stroke=\"#D1D5DB\" stroke-width=\"1.2\"/>\n                    <!-- Neck -->\n                    <rect x=\"343\" y=\"145\" width=\"14\" height=\"16\" fill=\"#FFFFFF\"/>\n                    <!-- Torso -->\n                    <path d=\"M 320 160 C 310 200, 305 280, 312 370 C 330 385, 370 385, 388 370 C 395 280, 390 200, 380 160 Z\" fill=\"#FFFFFF\" stroke=\"#D1D5DB\" stroke-width=\"1.2\"/>\n                    <!-- Dashed Lines on Torso (Chest / Abdomen) -->\n                    <line x1=\"315\" y1=\"230\" x2=\"385\" y2=\"230\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/>\n                    <line x1=\"311\" y1=\"270\" x2=\"389\" y2=\"270\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/>\n                    <!-- Arms (Left & Right) -->\n                    <!-- Left (anatomical right) -->\n                    <path d=\"M 319 162 C 285 200, 270 240, 268 280 C 265 315, 250 350, 240 375 C 235 385, 222 390, 230 405 C 242 400, 252 385, 262 360 C 280 320, 288 280, 290 240 C 298 215, 310 185, 319 162 Z\" fill=\"#FFFFFF\" stroke=\"#D1D5DB\" stroke-width=\"1.2\"/>\n                    <!-- Right (anatomical left) -->\n                    <path d=\"M 381 162 C 415 200, 430 240, 432 280 C 435 315, 450 350, 460 375 C 465 385, 478 390, 470 405 C 458 400, 448 385, 438 360 C 420 320, 412 280, 410 240 C 402 215, 390 185, 381 162 Z\" fill=\"#FFFFFF\" stroke=\"#D1D5DB\" stroke-width=\"1.2\"/>\n                    <!-- Arm boundary dash lines -->\n                    <line x1=\"280\" y1=\"225\" x2=\"305\" y2=\"235\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n                    <line x1=\"395\" y1=\"235\" x2=\"420\" y2=\"225\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n                    <line x1=\"255\" y1=\"345\" x2=\"275\" y2=\"355\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n                    <line x1=\"425\" y1=\"355\" x2=\"445\" y2=\"345\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n\n                    <!-- Legs (Left & Right) -->\n                    <!-- Left leg (anatomical right) -->\n                    <path d=\"M 316 372 C 314 430, 310 470, 312 510 C 314 545, 314 600, 312 630 C 310 650, 305 660, 320 660 C 332 660, 335 635, 338 580 C 342 530, 345 470, 346 390 Z\" fill=\"#FFFFFF\" stroke=\"#D1D5DB\" stroke-width=\"1.2\"/>\n                    <!-- Right leg (anatomical left) -->\n                    <path d=\"M 384 372 C 386 430, 390 470, 388 510 C 386 545, 386 600, 388 630 C 390 650, 395 660, 380 660 C 368 660, 365 635, 362 580 C 358 530, 355 470, 354 390 Z\" fill=\"#FFFFFF\" stroke=\"#D1D5DB\" stroke-width=\"1.2\"/>\n                    <!-- Leg boundary dashes -->\n                    <line x1=\"310\" y1=\"465\" x2=\"346\" y2=\"465\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n                    <line x1=\"354\" y1=\"465\" x2=\"390\" y2=\"465\" stroke=\"#CBD5E1\" stroke-width=\"1.5\" stroke-dasharray=\"3 3\"/>\n\n                    <!-- Right Side Labels & Swatches -->\n                    <!-- 1. Face -->\n                    <g transform=\"translate(485, 115)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"14\" fill=\"#0F172A\" font-weight=\"600\">Wajah (Face)</text>\n                    </g>\n\n                    <!-- 2. Upper arm (R) -->\n                    <g transform=\"translate(485, 205)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Lengan Atas Kiri</text>\n                    </g>\n\n                    <!-- 3. Anterior chest -->\n                    <g transform=\"translate(485, 245)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Dada (Chest)</text>\n                    </g>\n\n                    <!-- 4. Forearm (R) -->\n                    <g transform=\"translate(485, 310)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Lengan Bawah Kiri</text>\n                    </g>\n\n                    <!-- 5. Hand (R) -->\n                    <g transform=\"translate(485, 360)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Dorsum Tangan Kiri</text>\n                    </g>\n\n                    <!-- 6. Fingers (R) -->\n                    <g transform=\"translate(485, 390)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Jari Tangan Kiri</text>\n                    </g>\n\n                    <!-- 7. Thigh (R) -->\n                    <g transform=\"translate(485, 435)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Paha Kiri</text>\n                    </g>\n\n                    <!-- 8. Leg (R) -->\n                    <g transform=\"translate(485, 535)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Tungkai Bawah Kiri</text>\n                    </g>\n\n                    <!-- 9. Foot (R) -->\n                    <g transform=\"translate(485, 625)\">\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                      <text x=\"96\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\">Kaki Kiri</text>\n                    </g>\n\n                    <!-- Left Side Labels & Swatches -->\n                    <!-- 10. Upper arm (L) -->\n                    <g transform=\"translate(130, 205)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Lengan Atas Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 11. Abdomen -->\n                    <g transform=\"translate(130, 280)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Perut (Abdomen)</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 12. Forearm (L) -->\n                    <g transform=\"translate(130, 310)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Lengan Bawah Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 13. Hand (L) -->\n                    <g transform=\"translate(130, 360)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Dorsum Tangan Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 14. Fingers (L) -->\n                    <g transform=\"translate(130, 390)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Jari Tangan Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 15. Thigh (L) -->\n                    <g transform=\"translate(130, 435)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Paha Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 16. Leg (L) -->\n                    <g transform=\"translate(130, 535)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Tungkai Bawah Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n\n                    <!-- 17. Foot (L) -->\n                    <g transform=\"translate(130, 625)\">\n                      <text x=\"-15\" y=\"13\" font-family=\"'Inter', sans-serif\" font-size=\"13\" fill=\"#0F172A\" font-weight=\"600\" text-anchor=\"end\">Kaki Kanan</text>\n                      <rect x=\"0\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FDF498\" stroke=\"#D9CE6B\"/>\n                      <rect x=\"22\" y=\"0\" width=\"16\" height=\"16\" fill=\"#FCD34D\" stroke=\"#D97706\"/>\n                      <rect x=\"44\" y=\"0\" width=\"16\" height=\"16\" fill=\"#F59E0B\" stroke=\"#B45309\"/>\n                      <rect x=\"66\" y=\"0\" width=\"16\" height=\"16\" fill=\"#D95B00\" stroke=\"#9A3412\"/>\n                    </g>\n                  </svg>\n                </div>\n\n                <div class=\"form-group\" style=\"margin-top: 0.5rem;\">\n                  <label class=\"form-label\">\n                    <span>Total Skor mRSS yang Dihitung (0 - 51)</span>\n                    <span class=\"form-hint\">Rentang: 0 - 51</span>\n                  </label>\n                  <input type=\"number\" id=\"ssc-mrss-input\" class=\"input-field\" min=\"0\" max=\"51\" placeholder=\"Masukkan skor 0 - 51\">\n                  <span id=\"err-ssc-mrss\" class=\"error-msg\">Skor mRSS harus berada antara 0 dan 51.</span>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-interpret-mrss\" class=\"btn btn-primary\" style=\"flex: 1;\">Interpretasi Derajat Kulit</button>\n                  <button id=\"btn-copy-mrss\" class=\"btn btn-secondary\" title=\"Salin Hasil Interpretasi mRSS\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-mrss\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"mrss-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Interpretasi Derajat mRSS</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"mrss-score-num\" class=\"result-number\">--</div>\n                    <div id=\"mrss-badge\" class=\"status-badge\">Menunggu Input</div>\n                  </div>\n                  <div id=\"mrss-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n\n              <div class=\"card-footer-ref\">\n                <span>Cutoff: 0 Normal | 1-14 Ringan | 15-29 Sedang | &ge;30 Berat</span>\n              </div>\n            </div>\n          </div>","gout-page":"<button type=\"button\" onclick=\"navigateTo('home-module', 'Home Dashboard', 'pill-dash')\" class=\"btn-back\">\n                    <i class=\"fa-solid fa-arrow-left\"></i> Kembali ke Dashboard\n                </button>\n          <div class=\"card-grid\">\n            <!-- ACR/EULAR 2015 Gout Criteria -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M7 21a4 4 0 01-4-4 8.014 8.014 0 014-7.465V3a1 1 0 012 0v6.535A8.014 8.014 0 0113 17a4 4 0 01-4 4H7z\"/></svg>\n                  Kriteria Klasifikasi Gout (ACR/EULAR 2015)\n                </h3>\n                <p>Prasyarat: &ge; 1 episode nyeri/bengkak sendi perifer. Skor &ge; 8 mengklasifikasikan Gout.</p>\n              </div>\n\n              <div class=\"card-body\">\n                <div class=\"form-group\">\n                  <label class=\"form-label\">1. Pola Keterlibatan Sendi / Bursa</label>\n                  <div class=\"radio-pill-group\" id=\"gout-joint-group\">\n                    <input type=\"radio\" name=\"gout-joint\" id=\"gout-joint-0\" value=\"0\" checked>\n                    <label for=\"gout-joint-0\"><span class=\"radio-pill-dot\"></span>Sendi lain yang bukan pergelangan/kaki — 0 poin</label>\n                    <input type=\"radio\" name=\"gout-joint\" id=\"gout-joint-1\" value=\"1\">\n                    <label for=\"gout-joint-1\"><span class=\"radio-pill-dot\"></span>Pergelangan kaki ATAU Sendi midfoot — 1 poin</label>\n                    <input type=\"radio\" name=\"gout-joint\" id=\"gout-joint-2\" value=\"2\">\n                    <label for=\"gout-joint-2\"><span class=\"radio-pill-dot\"></span>Sendi MTP-1 (ibu jari kaki / Podagra) — 2 poin</label>\n                  </div>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">2. Karakteristik Episode Flare (Eritema, Sangat nyeri sentuh, Kesulitan berjalan)</label>\n                  <div class=\"radio-pill-group\" id=\"gout-char-group\">\n                    <input type=\"radio\" name=\"gout-char\" id=\"gout-char-0\" value=\"0\" checked>\n                    <label for=\"gout-char-0\"><span class=\"radio-pill-dot\"></span>Tidak ada karakteristik khas — 0 poin</label>\n                    <input type=\"radio\" name=\"gout-char\" id=\"gout-char-1\" value=\"1\">\n                    <label for=\"gout-char-1\"><span class=\"radio-pill-dot\"></span>Terdapat 1 karakteristik khas — 1 poin</label>\n                    <input type=\"radio\" name=\"gout-char\" id=\"gout-char-2\" value=\"2\">\n                    <label for=\"gout-char-2\"><span class=\"radio-pill-dot\"></span>Terdapat 2 karakteristik khas — 2 poin</label>\n                    <input type=\"radio\" name=\"gout-char\" id=\"gout-char-3\" value=\"3\">\n                    <label for=\"gout-char-3\"><span class=\"radio-pill-dot\"></span>Terdapat ketiga karakteristik khas — 3 poin</label>\n                  </div>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">3. Perjalanan Waktu Episode Nyeri</label>\n                  <div class=\"radio-pill-group\" id=\"gout-time-group\">\n                    <input type=\"radio\" name=\"gout-time\" id=\"gout-time-0\" value=\"0\" checked>\n                    <label for=\"gout-time-0\"><span class=\"radio-pill-dot\"></span>Tidak ada episode khas — 0 poin</label>\n                    <input type=\"radio\" name=\"gout-time\" id=\"gout-time-1\" value=\"1\">\n                    <label for=\"gout-time-1\"><span class=\"radio-pill-dot\"></span>1 episode tipikal (puncak nyeri &lt;24 jam, resolusi &le;14 hari) — 1 poin</label>\n                    <input type=\"radio\" name=\"gout-time\" id=\"gout-time-2\" value=\"2\">\n                    <label for=\"gout-time-2\"><span class=\"radio-pill-dot\"></span>Episode tipikal berulang (&gt; 1 kali) — 2 poin</label>\n                  </div>\n                </div>\n\n                <div class=\"form-group\">\n                  <label class=\"form-label\">4. Kadar Asam Urat Serum (SUA)</label>\n                  <div class=\"radio-pill-group\" id=\"gout-urate-group\">\n                    <input type=\"radio\" name=\"gout-urate\" id=\"gout-urate-n4\" value=\"-4\">\n                    <label for=\"gout-urate-n4\"><span class=\"radio-pill-dot\"></span>&lt; 4.0 mg/dL — &minus;4 poin</label>\n                    <input type=\"radio\" name=\"gout-urate\" id=\"gout-urate-0\" value=\"0\" checked>\n                    <label for=\"gout-urate-0\"><span class=\"radio-pill-dot\"></span>4.0 – &lt; 6.0 mg/dL — 0 poin</label>\n                    <input type=\"radio\" name=\"gout-urate\" id=\"gout-urate-2\" value=\"2\">\n                    <label for=\"gout-urate-2\"><span class=\"radio-pill-dot\"></span>6.0 – &lt; 8.0 mg/dL — 2 poin</label>\n                    <input type=\"radio\" name=\"gout-urate\" id=\"gout-urate-3\" value=\"3\">\n                    <label for=\"gout-urate-3\"><span class=\"radio-pill-dot\"></span>8.0 – &lt; 10.0 mg/dL — 3 poin</label>\n                    <input type=\"radio\" name=\"gout-urate\" id=\"gout-urate-4\" value=\"4\">\n                    <label for=\"gout-urate-4\"><span class=\"radio-pill-dot\"></span>&ge; 10.0 mg/dL — 4 poin</label>\n                  </div>\n                </div>\n\n                <div class=\"checklist-container\" style=\"margin-top: 0.5rem;\">\n                  <label class=\"check-item\"><input type=\"checkbox\" id=\"gout-tophus\" data-score=\"4\">Tofus klinis teraba pada pemeriksaan fisik (4 poin)</label>\n                  <label class=\"check-item\"><input type=\"checkbox\" id=\"gout-imaging\" data-score=\"4\">Bukti pencitraan deposisi kristal urat (Double Contour Sign pada USG atau DECT) (4 poin)</label>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-calc-gout\" class=\"btn btn-primary\" style=\"flex: 1;\">Hitung Skor Gout</button>\n                  <button id=\"btn-copy-gout\" class=\"btn btn-secondary\" title=\"Salin Hasil Klasifikasi Gout\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-gout\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"gout-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Hasil Evaluasi Gout</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"gout-score-num\" class=\"result-number\">0 / 8</div>\n                    <div id=\"gout-badge\" class=\"status-badge\">Menunggu Evaluasi</div>\n                  </div>\n                  <div id=\"gout-desc\" class=\"result-details\"></div>\n                </div>\n              </div>\n\n              <div class=\"card-footer-ref\">\n                <span>Referensi: Neogi T, et al. Arthritis Rheumatol 2015;67(10):2557–68</span>\n              </div>\n            </div>\n\n            <!-- Steinbrocker Functional Classification -->\n            <div class=\"card\">\n              <div class=\"card-header\">\n                <h3>\n                  <svg width=\"18\" height=\"18\" fill=\"none\" stroke=\"var(--accent-cyan)\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10\"/></svg>\n                  Kelas Fungsional Steinbrocker\n                </h3>\n                <p>Klasifikasi kapasitas fungsional aktivitas harian pada pasien artritis.</p>\n              </div>\n\n              <div class=\"card-body\">\n                <div class=\"checklist-container\">\n                  <label class=\"check-item\">\n                    <input type=\"radio\" name=\"gout-func\" value=\"Kelas I\" checked>\n                    <div>\n                      <b>Kelas I:</b>\n                      <div style=\"font-size: 0.78rem; color: var(--text-dim);\">Dapat melakukan seluruh aktivitas fungsional harian dan perawatan diri secara mandiri tanpa hambatan.</div>\n                    </div>\n                  </label>\n\n                  <label class=\"check-item\">\n                    <input type=\"radio\" name=\"gout-func\" value=\"Kelas II\">\n                    <div>\n                      <b>Kelas II:</b>\n                      <div style=\"font-size: 0.78rem; color: var(--text-dim);\">Dapat melakukan perawatan diri dan pekerjaan harian normal, namun terbatas pada kegiatan rekreasi / fisik berat.</div>\n                    </div>\n                  </label>\n\n                  <label class=\"check-item\">\n                    <input type=\"radio\" name=\"gout-func\" value=\"Kelas III\">\n                    <div>\n                      <b>Kelas III:</b>\n                      <div style=\"font-size: 0.78rem; color: var(--text-dim);\">Mampu melakukan perawatan diri mandiri, tetapi mengalami keterbatasan bermakna dalam pekerjaan utama dan aktivitas harian.</div>\n                    </div>\n                  </label>\n\n                  <label class=\"check-item\">\n                    <input type=\"radio\" name=\"gout-func\" value=\"Kelas IV\">\n                    <div>\n                      <b>Kelas IV:</b>\n                      <div style=\"font-size: 0.78rem; color: var(--text-dim);\">Sangat terbatas; imobilisasi total di tempat tidur atau kursi roda, memerlukan bantuan penuh untuk perawatan diri.</div>\n                    </div>\n                  </label>\n                </div>\n\n                <div class=\"btn-group\">\n                  <button id=\"btn-eval-func\" class=\"btn btn-primary\" style=\"flex: 1;\">Tetapkan Kelas Fungsional</button>\n                  <button id=\"btn-copy-func\" class=\"btn btn-secondary\" title=\"Salin Hasil Kelas Fungsional\">\n                    <svg width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3\"/></svg>\n                    Salin Hasil\n                  </button>\n                  <button id=\"btn-reset-func\" class=\"btn btn-secondary\">Reset</button>\n                </div>\n\n                <div id=\"func-result\" class=\"result-panel\">\n                  <div class=\"result-header\"><span class=\"result-title\">Hasil Kelas Fungsional</span></div>\n                  <div class=\"result-score-line\">\n                    <div id=\"func-class-title\" class=\"result-number\" style=\"font-size: 1.6rem;\">Kelas I</div>\n                  </div>\n                  <div id=\"func-class-desc\" class=\"result-details\">Kapasitas fungsional penuh tanpa hendaya.</div>\n                </div>\n              </div>\n\n              <div class=\"card-footer-ref\">\n                <span>Klasifikasi Fungsional Steinbrocker (Revisi IRA 2020)</span>\n              </div>\n            </div>\n          </div>"};

function bindRheumaEvents(container, emit) {
  // Polyfill copyTextToClipboard to integrate with InternaHub toast and emit
  window.copyTextToClipboard = window.copyTextToClipboard || function(text) {
    window._last = text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    toast('Resume klinis reumatologi disalin');
    if (emit) emit({ value: 'Disalin', text: text.split('\n')[0], cppt: text });
  };

  /* --- 1. RHEUMATOID ARTHRITIS --- */
          const btnCalcRaAcr = document.getElementById('btn-calc-ra-acr');
          const btnResetRaAcr = document.getElementById('btn-reset-ra-acr');
          const btnCopyRaAcr = document.getElementById('btn-copy-ra-acr');
          const raAcrResult = document.getElementById('ra-acr-result');
          const raAcrScore = document.getElementById('ra-acr-score');
          const raAcrBadge = document.getElementById('ra-acr-badge');
          const raAcrDesc = document.getElementById('ra-acr-desc');

          if (btnCalcRaAcr) {
            btnCalcRaAcr.addEventListener('click', function () {
              const joint = parseInt(document.querySelector('input[name="ra-joint"]:checked').value, 10);
              const serology = parseInt(document.querySelector('input[name="ra-serology"]:checked').value, 10);
              const apr = parseInt(document.querySelector('input[name="ra-apr"]:checked').value, 10);
              const duration = parseInt(document.querySelector('input[name="ra-duration"]:checked').value, 10);
              const total = joint + serology + apr + duration;

              raAcrScore.textContent = total + ' / 10 Poin';
              if (total >= 6) {
                raAcrBadge.className = 'status-badge badge-remission';
                raAcrBadge.textContent = 'Memenuhi Kriteria RA Definit';
                raAcrDesc.innerHTML = 'Skor total <b>' + total + ' &ge; 6</b> mengklasifikasikan pasien sebagai <b>Rheumatoid Arthritis definit</b> menurut konsensus ACR/EULAR 2010.';
              } else {
                raAcrBadge.className = 'status-badge badge-moderate';
                raAcrBadge.textContent = 'Belum Memenuhi Kriteria';
                raAcrDesc.innerHTML = 'Skor total <b>' + total + ' &lt; 6</b> belum memenuhi ambang klasifikasi RA definit.';
              }
              raAcrResult.classList.add('visible');
            });
          }

          if (btnResetRaAcr) {
            btnResetRaAcr.addEventListener('click', function () {
              document.getElementById('ra-joint-0').checked = true;
              document.getElementById('ra-serology-0').checked = true;
              document.getElementById('ra-apr-0').checked = true;
              document.getElementById('ra-duration-0').checked = true;
              raAcrResult.classList.remove('visible');
            });
          }

          if (btnCopyRaAcr) {
            btnCopyRaAcr.addEventListener('click', function () {
              btnCalcRaAcr.click();
              const totalText = raAcrScore.textContent;
              const statusText = raAcrBadge.textContent;
              const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
              const text = `[RheumaTools CDSS] HASIL EVALUASI ARTRITIS REUMATOID (ACR/EULAR 2010)
Tanggal: ${today}
Total Skor: ${totalText}
Status Klasifikasi: ${statusText}
Referensi: Aletaha D, et al. Arthritis Rheum 2010;62(9):2569–81.`;
              copyTextToClipboard(text);
            });
          }

          let currentRaTab = 'das-crp';
          const raTabs = document.querySelectorAll('#ra-calc-tabs .pill-tab');
          const fieldsDasCrp = document.getElementById('fields-das-crp');
          const fieldsDasEsr = document.getElementById('fields-das-esr');
          const fieldsCdai = document.getElementById('fields-cdai');
          const fieldsSdai = document.getElementById('fields-sdai');
          const raFormulaRef = document.getElementById('ra-formula-ref');
          const raCutoffLabels = document.getElementById('ra-cutoff-labels');
          const btnCalcRaActivity = document.getElementById('btn-calc-ra-activity');
          const btnResetRaActivity = document.getElementById('btn-reset-ra-activity');
          const btnCopyRaResult = document.getElementById('btn-copy-ra-result');
          const btnLoadBenchmark = document.getElementById('btn-load-benchmark-ra');

          const raResTitle = document.getElementById('ra-res-title');
          const raResNumber = document.getElementById('ra-res-number');
          const raResBadge = document.getElementById('ra-res-badge');
          const raResDetails = document.getElementById('ra-res-details');
          const raActivityResult = document.getElementById('ra-activity-result');

          let lastCalculationSummary = '';

          if (raTabs) {
            raTabs.forEach(tab => {
              tab.addEventListener('click', function () {
                raTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentRaTab = this.dataset.tab;

                if (fieldsDasCrp) fieldsDasCrp.style.display = 'none';
                if (fieldsDasEsr) fieldsDasEsr.style.display = 'none';
                if (fieldsCdai) fieldsCdai.style.display = 'none';
                if (fieldsSdai) fieldsSdai.style.display = 'none';

                if (currentRaTab === 'das-crp') {
                  if (fieldsDasCrp) fieldsDasCrp.style.display = 'block';
                  if (raFormulaRef) raFormulaRef.innerHTML = 'Formula: 0.56*&radic;(TJC) + 0.28*&radic;(SJC) + 0.36*ln(CRP+1) + 0.014*(PGA) + 0.96';
                  if (raCutoffLabels) raCutoffLabels.innerHTML = '<span>Remisi: &le;2.60</span><span>Rendah: 2.61-3.20</span><span>Sedang: 3.21-5.10</span><span>Tinggi: >5.10</span>';
                } else if (currentRaTab === 'das-esr') {
                  if (fieldsDasEsr) fieldsDasEsr.style.display = 'block';
                  if (raFormulaRef) raFormulaRef.innerHTML = 'Formula: 0.56*&radic;(TJC) + 0.28*&radic;(SJC) + 0.70*ln(ESR) + 0.014*(PGA)';
                  if (raCutoffLabels) raCutoffLabels.innerHTML = '<span>Remisi: &le;2.60</span><span>Rendah: 2.61-3.20</span><span>Sedang: 3.21-5.10</span><span>Tinggi: >5.10</span>';
                } else if (currentRaTab === 'cdai') {
                  if (fieldsCdai) fieldsCdai.style.display = 'block';
                  if (raFormulaRef) raFormulaRef.innerHTML = 'Formula: TJC28 + SJC28 + PGA(0-10) + EGA(0-10)';
                  if (raCutoffLabels) raCutoffLabels.innerHTML = '<span>Remisi: &le;2.8</span><span>Rendah: 2.9-10.0</span><span>Sedang: 10.1-22.0</span><span>Tinggi: >22.0</span>';
                } else if (currentRaTab === 'sdai') {
                  if (fieldsSdai) fieldsSdai.style.display = 'block';
                  if (raFormulaRef) raFormulaRef.innerHTML = 'Formula: TJC28 + SJC28 + PGA(0-10) + EGA(0-10) + CRP(mg/dL)';
                  if (raCutoffLabels) raCutoffLabels.innerHTML = '<span>Remisi: &le;3.3</span><span>Rendah: 3.4-11.0</span><span>Sedang: 11.1-26.0</span><span>Tinggi: >26.0</span>';
                }
                if (raActivityResult) raActivityResult.classList.remove('visible');
              });
            });
          }

          if (btnLoadBenchmark) {
            btnLoadBenchmark.addEventListener('click', function () {
              const dasTab = document.querySelector('#ra-calc-tabs .pill-tab[data-tab="das-crp"]');
              if (dasTab) dasTab.click();
              document.getElementById('ra-tjc').value = 6;
              document.getElementById('ra-sjc').value = 4;
              document.getElementById('ra-crp-mgl').value = 15;
              document.getElementById('ra-pga-100').value = 40;
              if (btnCalcRaActivity) btnCalcRaActivity.click();
              showToast('Kasus benchmark dimuat: DAS28-CRP = 4.45');
            });
          }

          if (btnCalcRaActivity) {
            btnCalcRaActivity.addEventListener('click', function () {
              document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
              document.querySelectorAll('.input-field').forEach(el => el.classList.remove('input-error'));

              const tjcVal = document.getElementById('ra-tjc').value.trim();
              const sjcVal = document.getElementById('ra-sjc').value.trim();

              try {
                if (currentRaTab === 'das-crp') {
                  const crpVal = document.getElementById('ra-crp-mgl').value.trim();
                  const pgaVal = document.getElementById('ra-pga-100').value.trim();
                  const res = RheumaCalc.calculateDAS28_CRP(tjcVal, sjcVal, crpVal, pgaVal);

                  raResTitle.textContent = 'Skor DAS28-CRP (C-Reactive Protein)';
                  raResNumber.textContent = res.score;
                  raResBadge.className = 'status-badge ' + res.activity.badgeClass;
                  raResBadge.textContent = res.activity.label;
                  raResDetails.innerHTML = res.activity.desc + '<br><small class="text-slate-400">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', CRP=' + crpVal + ' mg/L, PGA=' + pgaVal + ' mm</small>';
                  lastCalculationSummary = '[RheumaTools CDSS] Skor Aktivitas DAS28-CRP: ' + res.score + ' (' + res.activity.label + ')\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', CRP=' + crpVal + ' mg/L, PGA=' + pgaVal + '/100 mm';

                } else if (currentRaTab === 'das-esr') {
                  const esrVal = document.getElementById('ra-esr').value.trim();
                  const pgaVal = document.getElementById('ra-pga-esr').value.trim();
                  const res = RheumaCalc.calculateDAS28_ESR(tjcVal, sjcVal, esrVal, pgaVal);

                  raResTitle.textContent = 'Skor DAS28-LED (Erythrocyte Sedimentation Rate)';
                  raResNumber.textContent = res.score;
                  raResBadge.className = 'status-badge ' + res.activity.badgeClass;
                  raResBadge.textContent = res.activity.label;
                  raResDetails.innerHTML = res.activity.desc + '<br><small class="text-slate-400">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', LED=' + esrVal + ' mm/jam, PGA=' + pgaVal + ' mm</small>';
                  lastCalculationSummary = '[RheumaTools CDSS] Skor Aktivitas DAS28-LED: ' + res.score + ' (' + res.activity.label + ')\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', LED=' + esrVal + ' mm/jam, PGA=' + pgaVal + '/100 mm';

                } else if (currentRaTab === 'cdai') {
                  const pgaVal = document.getElementById('ra-pga-10').value.trim();
                  const egaVal = document.getElementById('ra-ega-10').value.trim();
                  const res = RheumaCalc.calculateCDAI(tjcVal, sjcVal, pgaVal, egaVal);

                  raResTitle.textContent = 'Skor CDAI (Clinical Disease Activity Index)';
                  raResNumber.textContent = res.score;
                  raResBadge.className = 'status-badge ' + res.activity.badgeClass;
                  raResBadge.textContent = res.activity.label;
                  raResDetails.innerHTML = res.activity.desc + '<br><small class="text-slate-400">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', PGA=' + pgaVal + ', EGA=' + egaVal + '</small>';
                  lastCalculationSummary = '[RheumaTools CDSS] Skor Aktivitas CDAI: ' + res.score + ' (' + res.activity.label + ')\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', PGA=' + pgaVal + '/10, EGA=' + egaVal + '/10';

                } else if (currentRaTab === 'sdai') {
                  const pgaVal = document.getElementById('ra-sdai-pga').value.trim();
                  const egaVal = document.getElementById('ra-sdai-ega').value.trim();
                  const crpVal = document.getElementById('ra-sdai-crp').value.trim();
                  const res = RheumaCalc.calculateSDAI(tjcVal, sjcVal, pgaVal, egaVal, crpVal);

                  raResTitle.textContent = 'Skor SDAI (Simplified Disease Activity Index)';
                  raResNumber.textContent = res.score;
                  raResBadge.className = 'status-badge ' + res.activity.badgeClass;
                  raResBadge.textContent = res.activity.label;
                  raResDetails.innerHTML = res.activity.desc + '<br><small class="text-slate-400">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', PGA=' + pgaVal + ', EGA=' + egaVal + ', CRP=' + crpVal + ' mg/dL</small>';
                  lastCalculationSummary = '[RheumaTools CDSS] Skor Aktivitas SDAI: ' + res.score + ' (' + res.activity.label + ')\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', PGA=' + pgaVal + '/10, EGA=' + egaVal + '/10, CRP=' + crpVal + ' mg/dL';
                }

                raActivityResult.classList.add('visible');

              } catch (err) {
                raActivityResult.classList.remove('visible');
                showToast(err.message);
              }
            });
          }

          if (btnResetRaActivity) {
            btnResetRaActivity.addEventListener('click', function () {
              ['ra-tjc', 'ra-sjc', 'ra-crp-mgl', 'ra-esr', 'ra-pga-100', 'ra-pga-esr', 'ra-pga-10', 'ra-ega-10', 'ra-sdai-pga', 'ra-sdai-ega', 'ra-sdai-crp'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
              });
              document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
              document.querySelectorAll('.input-field').forEach(el => el.classList.remove('input-error'));
              raActivityResult.classList.remove('visible');
              lastCalculationSummary = '';
            });
          }

          if (btnCopyRaResult) {
            btnCopyRaResult.addEventListener('click', function () {
              if (!lastCalculationSummary) {
                btnCalcRaActivity.click();
              }
              if (lastCalculationSummary) {
                copyTextToClipboard(lastCalculationSummary);
              }
            });
          }

          /* --- 2. ALUR PENDEKATAN NYERI SENDI --- */
          const stepsContainer = document.getElementById('diag-steps-container');
          const diagResultBox = document.getElementById('diag-result-box');
          const diagResultText = document.getElementById('diag-result-text');
          const diagResultActions = document.getElementById('diag-result-actions');
          const diagResultButtonsContainer = document.getElementById('diag-result-buttons-container');
          const btnResetDiag = document.getElementById('btn-reset-diag');

          const diagActionMeta = {
            'ra': { label: 'Buka Kriteria Rheumatoid Arthritis (RA 2010)', icon: '🩺' },
            'sle': { label: 'Buka Kriteria Systemic Lupus (SLE 2019)', icon: '🦋' },
            'gout': { label: 'Buka Kriteria Gout Arthritis (ACR 2015)', icon: '🦶' },
            'psa': { label: 'Buka Kriteria Psoriatic Arthritis (PsA)', icon: '🧬' },
            'as': { label: 'Buka Kriteria Ankylosing Spondylitis (AS)', icon: '🦴' },
            'ssc': { label: 'Buka Kriteria Systemic Sclerosis (SSc)', icon: '🖐️' },
            'references': { label: 'Buka Guideline & Pustaka Konsensus IRA', icon: '📚' }
          };

          document.querySelectorAll('.diag-btn').forEach(button => {
            button.addEventListener('click', function () {
              const nextStep = this.dataset.nextStep;
              const resText = this.dataset.result;
              const actList = this.dataset.actions ? this.dataset.actions.split(',') : [];
              this.closest('.diag-tree-step').style.display = 'none';

              if (nextStep) {
                const nextEl = document.getElementById(nextStep);
                if (nextEl) nextEl.style.display = 'block';
              } else if (resText) {
                stepsContainer.style.display = 'none';
                diagResultText.innerHTML = resText;

                if (diagResultButtonsContainer && diagResultActions) {
                  diagResultButtonsContainer.innerHTML = '';
                  if (actList.length > 0) {
                    actList.forEach(act => {
                      const cleanAct = act.trim();
                      if (diagActionMeta[cleanAct]) {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'btn-action-jump';
                        btn.dataset.jumpPage = cleanAct;
                        btn.innerHTML = `<span>${diagActionMeta[cleanAct].icon}</span> <span>${diagActionMeta[cleanAct].label}</span> <i class="fa-solid fa-arrow-right ml-1"></i>`;
                        diagResultButtonsContainer.appendChild(btn);
                      }
                    });
                    diagResultActions.style.display = 'flex';
                  } else {
                    diagResultActions.style.display = 'none';
                  }
                }

                diagResultBox.style.display = 'block';
              }
            });
          });

          if (btnResetDiag) {
            const btnCopyDiag = document.getElementById('btn-copy-diag');
            if (btnCopyDiag) {
              btnCopyDiag.addEventListener('click', function () {
                const rawText = diagResultText ? (diagResultText.innerText || diagResultText.textContent) : '';
                const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                const resumeText = `[RheumaTools CDSS - Alur Pendekatan Diagnostik Nyeri Sendi / Artritis]
Tanggal: ${today}

${rawText.trim()}

Referensi: Rekomendasi Diagnosis & Pengelolaan Artritis & Penyakit Reumatik (Perhimpunan Reumatologi Indonesia - IRA 2020).`;
                copyTextToClipboard(resumeText);
              });
            }

            btnResetDiag.addEventListener('click', function () {
              diagResultBox.style.display = 'none';
              if (diagResultActions) diagResultActions.style.display = 'none';
              if (diagResultButtonsContainer) diagResultButtonsContainer.innerHTML = '';
              stepsContainer.style.display = 'block';
              document.querySelectorAll('.diag-tree-step').forEach(step => {
                step.style.display = 'none';
              });
              const stepTrauma = document.getElementById('step-trauma');
              if (stepTrauma) stepTrauma.style.display = 'block';
            });
          }

          /* --- UNIVERSAL CLINICAL REFERENCE ACCORDIONS --- */
          document.querySelectorAll('.accordion-header').forEach(hdr => {
            hdr.addEventListener('click', function () {
              const content = this.nextElementSibling;
              if (content && content.classList.contains('accordion-content')) {
                const isOpen = content.classList.contains('open');
                content.classList.toggle('open');
                this.classList.toggle('active', !isOpen);
                const chevron = this.querySelector('.fa-chevron-down');
                if (chevron) {
                  chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                }
              }
            });
          });

          /* --- 3. SYSTEMIC LUPUS ERYTHEMATOSUS (SLE) --- */
          const btnCalcSleAcr = document.getElementById('btn-calc-sle-acr');
          const btnResetSleAcr = document.getElementById('btn-reset-sle-acr');
          const btnCopySleAcr = document.getElementById('btn-copy-sle-acr');
          const sleAcrResult = document.getElementById('sle-acr-result');
          const sleAcrScoreNum = document.getElementById('sle-acr-score-num');
          const sleAcrBadge = document.getElementById('sle-acr-badge');
          const sleAcrText = document.getElementById('sle-acr-text');

          if (btnCalcSleAcr) {
            btnCalcSleAcr.addEventListener('click', function () {
              const anaPositive = document.getElementById('sle-ana-entry').checked;
              if (!anaPositive) {
                sleAcrScoreNum.textContent = 'Prasyarat (-)';
                sleAcrBadge.className = 'status-badge badge-high';
                sleAcrBadge.textContent = 'Kriteria Masuk Tidak Terpenuhi';
                sleAcrText.innerHTML = 'Prasyarat ANA positif &ge; 1:80 tidak terpenuhi. Berdasarkan kriteria EULAR/ACR 2019, diagnosis SLE tidak dapat diklasifikasikan dengan sistem skor ini.';
                sleAcrResult.classList.add('visible');
                return;
              }

              let score = 0;
              document.querySelectorAll('.sle-acr-item:checked').forEach(item => {
                score += parseInt(item.dataset.score, 10);
              });

              ['sle-hem', 'sle-neuro', 'sle-skin', 'sle-serosa', 'sle-renal', 'sle-comp'].forEach(groupName => {
                const checked = document.querySelector('input[name="' + groupName + '"]:checked');
                if (checked) score += parseInt(checked.value, 10);
              });

              sleAcrScoreNum.textContent = score + ' Poin';
              if (score >= 10) {
                sleAcrBadge.className = 'status-badge badge-remission';
                sleAcrBadge.textContent = 'Memenuhi Kriteria SLE Definit';
                sleAcrText.innerHTML = 'Skor total <b>' + score + ' &ge; 10</b> mengklasifikasikan sebagai <b>Systemic Lupus Erythematosus definit</b> menurut konsensus EULAR/ACR 2019.';
              } else {
                sleAcrBadge.className = 'status-badge badge-moderate';
                sleAcrBadge.textContent = 'Belum Memenuhi Ambang (Skor < 10)';
                sleAcrText.innerHTML = 'Skor total <b>' + score + '</b> belum memenuhi ambang klasifikasi SLE definit (&ge; 10 poin).';
              }
              sleAcrResult.classList.add('visible');
            });
          }

          if (btnResetSleAcr) {
            btnResetSleAcr.addEventListener('click', function () {
              document.querySelectorAll('.sle-acr-item').forEach(item => { item.checked = false; });
              ['sle-hem', 'sle-neuro', 'sle-skin', 'sle-serosa', 'sle-renal', 'sle-comp'].forEach(groupName => {
                const first = document.querySelector('input[name="' + groupName + '"][value="0"]');
                if (first) first.checked = true;
              });
              document.getElementById('sle-ana-entry').checked = true;
              sleAcrResult.classList.remove('visible');
            });
          }

          if (btnCopySleAcr) {
            btnCopySleAcr.addEventListener('click', function () {
              btnCalcSleAcr.click();
              const score = sleAcrScoreNum.textContent;
              const badge = sleAcrBadge.textContent;
              const text = `[RheumaTools CDSS] HASIL EVALUASI SLE (EULAR/ACR 2019)
Prasyarat ANA: ${document.getElementById('sle-ana-entry').checked ? 'Positif (>= 1:80)' : 'Negatif'}
Total Skor: ${score}
Klasifikasi: ${badge}
Referensi: Aringer M, et al. Arthritis Rheumatol 2019;71(9):1400–12.`;
              copyTextToClipboard(text);
            });
          }

          const btnCalcSledai = document.getElementById('btn-calc-sledai');
          const btnResetSledai = document.getElementById('btn-reset-sledai');
          const btnCopySledai = document.getElementById('btn-copy-sledai');
          const sledaiResult = document.getElementById('sledai-result');
          const sledaiScoreNum = document.getElementById('sledai-score-num');
          const sledaiBadge = document.getElementById('sledai-badge');
          const sledaiDesc = document.getElementById('sledai-desc');

          if (btnCalcSledai) {
            btnCalcSledai.addEventListener('click', function () {
              let score = 0;
              document.querySelectorAll('.sledai-item:checked').forEach(item => {
                score += parseInt(item.dataset.score, 10);
              });

              sledaiScoreNum.textContent = score;
              if (score > 20) {
                sledaiBadge.className = 'status-badge badge-high';
                sledaiBadge.textContent = 'Aktivitas Sangat Tinggi (Very High)';
                sledaiDesc.textContent = 'Skor SLEDAI-2K > 20 menandakan ancaman organ vital; pertimbangkan intensifikasi imunosupresi agresif.';
              } else if (score >= 11) {
                sledaiBadge.className = 'status-badge badge-high';
                sledaiBadge.textContent = 'Aktivitas Tinggi (High Activity)';
                sledaiDesc.textContent = 'Aktivitas penyakit tinggi (skor 11-20).';
              } else if (score >= 6) {
                sledaiBadge.className = 'status-badge badge-moderate';
                sledaiBadge.textContent = 'Aktivitas Sedang (Moderate Activity)';
                sledaiDesc.textContent = 'Aktivitas penyakit moderat (skor 6-10).';
              } else if (score >= 1) {
                sledaiBadge.className = 'status-badge badge-low';
                sledaiBadge.textContent = 'Aktivitas Ringan (Mild Activity)';
                sledaiDesc.textContent = 'Aktivitas penyakit ringan (skor 1-5).';
              } else {
                sledaiBadge.className = 'status-badge badge-remission';
                sledaiBadge.textContent = 'Inaktif / Remisi (No Activity)';
                sledaiDesc.textContent = 'Tidak ditemukan manifestasi aktif SLEDAI-2K dalam 30 hari terakhir.';
              }
              sledaiResult.classList.add('visible');
            });
          }

          if (btnResetSledai) {
            btnResetSledai.addEventListener('click', function () {
              document.querySelectorAll('.sledai-item').forEach(item => { item.checked = false; });
              sledaiResult.classList.remove('visible');
            });
          }

          if (btnCopySledai) {
            btnCopySledai.addEventListener('click', function () {
              btnCalcSledai.click();
              const score = sledaiScoreNum.textContent;
              const badge = sledaiBadge.textContent;
              const text = `[RheumaTools CDSS] HASIL SKOR AKTIVITAS SLE (SLEDAI-2K)
Skor SLEDAI-2K: ${score}
Tingkat Aktivitas: ${badge}
Referensi: Gladman DD, et al. J Rheumatol 2002;29(2):288–91.`;
              copyTextToClipboard(text);
            });
          }

          /* --- SLE ACTIVITY TABS (SLEDAI-2K & MEX-SLEDAI) --- */
          const sleTabs = document.querySelectorAll('#sle-calc-tabs .pill-tab');
          const panelSledai = document.getElementById('panel-sledai-2k');
          const panelMexSledai = document.getElementById('panel-mex-sledai');

          if (sleTabs) {
            sleTabs.forEach(tab => {
              tab.addEventListener('click', function () {
                sleTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const targetTab = this.dataset.tab;
                if (targetTab === 'sledai-2k') {
                  if (panelSledai) panelSledai.style.display = 'block';
                  if (panelMexSledai) panelMexSledai.style.display = 'none';
                } else if (targetTab === 'mex-sledai') {
                  if (panelSledai) panelSledai.style.display = 'none';
                  if (panelMexSledai) panelMexSledai.style.display = 'block';
                }
              });
            });
          }

          /* --- MEX-SLEDAI CALCULATOR (Guzmán 1992) --- */
          const btnCalcMexSledai = document.getElementById('btn-calc-mex-sledai');
          const btnResetMexSledai = document.getElementById('btn-reset-mex-sledai');
          const btnCopyMexSledai = document.getElementById('btn-copy-mex-sledai');
          const mexSledaiResult = document.getElementById('mex-sledai-result');
          const mexSledaiScoreNum = document.getElementById('mex-sledai-score-num');
          const mexSledaiBadge = document.getElementById('mex-sledai-badge');
          const mexSledaiDesc = document.getElementById('mex-sledai-desc');

          if (btnCalcMexSledai) {
            btnCalcMexSledai.addEventListener('click', function () {
              let score = 0;
              document.querySelectorAll('.mex-sledai-item:checked').forEach(item => {
                score += parseInt(item.dataset.score, 10);
              });

              mexSledaiScoreNum.textContent = score + ' / 33';
              const classification = RheumaCalc.classifyMEX_SLEDAI(score);
              mexSledaiBadge.className = 'status-badge ' + classification.badgeClass;
              mexSledaiBadge.textContent = classification.label;
              mexSledaiDesc.innerHTML = classification.desc;
              mexSledaiResult.classList.add('visible');
            });
          }

          if (btnResetMexSledai) {
            btnResetMexSledai.addEventListener('click', function () {
              document.querySelectorAll('.mex-sledai-item').forEach(item => { item.checked = false; });
              mexSledaiResult.classList.remove('visible');
            });
          }

          if (btnCopyMexSledai) {
            btnCopyMexSledai.addEventListener('click', function () {
              btnCalcMexSledai.click();
              const score = mexSledaiScoreNum.textContent;
              const badge = mexSledaiBadge.textContent;
              const desc = mexSledaiDesc.textContent;
              const checkedList = [];
              document.querySelectorAll('.mex-sledai-item:checked').forEach(item => {
                checkedList.push('- ' + item.closest('label')?.textContent.trim());
              });
              const checkedStr = checkedList.length > 0 ? checkedList.join('\n') : '- Tidak ada kriteria aktif yang dipilih';
              const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
              const text = `[RheumaTools CDSS] HASIL EVALUASI SKOR MEX-SLEDAI
Tanggal: ${today}
Skor Total: ${score}
Tingkat Aktivitas: ${badge}
Interpretasi: ${desc}

Manifestasi Aktif Terpilih:
${checkedStr}

Referensi: Guzmán J, et al. J Rheumatol 1992;19(10):1551-8.`;
              copyTextToClipboard(text);
            });
          }

          /* --- 4. PSORIATIC ARTHRITIS --- */
          const btnCalcCaspar = document.getElementById('btn-calc-caspar');
          const btnResetCaspar = document.getElementById('btn-reset-caspar');
          const btnCopyCaspar = document.getElementById('btn-copy-caspar');
          const casparResult = document.getElementById('caspar-result');
          const casparScoreNum = document.getElementById('caspar-score-num');
          const casparBadge = document.getElementById('caspar-badge');
          const casparDesc = document.getElementById('caspar-desc');

          if (btnCalcCaspar) {
            btnCalcCaspar.addEventListener('click', function () {
              let score = 0;
              document.querySelectorAll('.caspar-item:checked').forEach(item => {
                score += parseInt(item.dataset.score, 10);
              });
              casparScoreNum.textContent = score + ' / 6 Poin';
              if (score >= 3) {
                casparBadge.className = 'status-badge badge-remission';
                casparBadge.textContent = 'Memenuhi Kriteria PsA';
                casparDesc.innerHTML = 'Skor total <b>' + score + ' &ge; 3</b> mengklasifikasikan sebagai <b>Psoriatic Arthritis</b> menurut kriteria CASPAR.';
              } else {
                casparBadge.className = 'status-badge badge-moderate';
                casparBadge.textContent = 'Belum Memenuhi Kriteria';
                casparDesc.innerHTML = 'Skor total <b>' + score + ' &lt; 3</b> belum memenuhi ambang klasifikasi PsA.';
              }
              casparResult.classList.add('visible');
            });
          }

          if (btnResetCaspar) {
            btnResetCaspar.addEventListener('click', function () {
              document.querySelectorAll('.caspar-item').forEach(item => { item.checked = false; });
              casparResult.classList.remove('visible');
            });
          }

          if (btnCopyCaspar) {
            btnCopyCaspar.addEventListener('click', function () {
              btnCalcCaspar.click();
              const score = casparScoreNum.textContent;
              const badge = casparBadge.textContent;
              const text = `[RheumaTools CDSS] HASIL KRITERIA CASPAR (PSORIATIC ARTHRITIS)
Total Skor: ${score}
Klasifikasi: ${badge}
Referensi: Taylor W, et al. Arthritis Rheum 2006;54(8):2665–73.`;
              copyTextToClipboard(text);
            });
          }

          const btnCalcDapsa = document.getElementById('btn-calc-dapsa');
          const btnResetDapsa = document.getElementById('btn-reset-dapsa');
          const btnCopyDapsa = document.getElementById('btn-copy-dapsa');
          const dapsaResult = document.getElementById('dapsa-result');
          const dapsaScoreNum = document.getElementById('dapsa-score-num');
          const dapsaBadge = document.getElementById('dapsa-badge');
          const dapsaDesc = document.getElementById('dapsa-desc');

          if (btnCalcDapsa) {
            btnCalcDapsa.addEventListener('click', function () {
              const tjc = document.getElementById('psa-tjc').value.trim();
              const sjc = document.getElementById('psa-sjc').value.trim();
              const crp = document.getElementById('psa-crp').value.trim();
              const pga = document.getElementById('psa-pga').value.trim();
              const pain = document.getElementById('psa-pain').value.trim();

              try {
                const res = RheumaCalc.calculateDAPSA(tjc, sjc, crp, pga, pain);
                dapsaScoreNum.textContent = res.score;
                dapsaBadge.className = 'status-badge ' + res.activity.badgeClass;
                dapsaBadge.textContent = res.activity.label;
                dapsaDesc.innerHTML = 'Skor DAPSA: ' + res.score + ' (' + res.activity.label + ')';
                dapsaResult.classList.add('visible');
              } catch (err) {
                dapsaResult.classList.remove('visible');
                showToast(err.message);
              }
            });
          }

          if (btnResetDapsa) {
            btnResetDapsa.addEventListener('click', function () {
              ['psa-tjc', 'psa-sjc', 'psa-crp', 'psa-pga', 'psa-pain'].forEach(id => {
                document.getElementById(id).value = '';
              });
              dapsaResult.classList.remove('visible');
            });
          }

          if (btnCopyDapsa) {
            btnCopyDapsa.addEventListener('click', function () {
              btnCalcDapsa.click();
              if (dapsaResult.classList.contains('visible')) {
                const score = dapsaScoreNum.textContent;
                const badge = dapsaBadge.textContent;
                const text = `[RheumaTools CDSS] HASIL SKOR AKTIVITAS DAPSA (PsA)
Komponen: TJC=${document.getElementById('psa-tjc').value}, SJC=${document.getElementById('psa-sjc').value}, CRP=${document.getElementById('psa-crp').value} mg/dL, PGA=${document.getElementById('psa-pga').value}, Nyeri=${document.getElementById('psa-pain').value}
Skor DAPSA: ${score}
Aktivitas: ${badge}
Referensi: Schoels M, et al. Ann Rheum Dis 2010.`;
                copyTextToClipboard(text);
              }
            });
          }

          /* --- 5. ANKYLOSING SPONDYLITIS --- */
          const btnCalcAsAsas = document.getElementById('btn-calc-as-asas');
          const btnResetAsAsas = document.getElementById('btn-reset-as-asas');
          const btnCopyAsAsas = document.getElementById('btn-copy-as-asas');
          const asAsasResult = document.getElementById('as-asas-result');
          const asAsasBadge = document.getElementById('as-asas-badge');
          const asAsasDesc = document.getElementById('as-asas-desc');

          if (btnCalcAsAsas) {
            btnCalcAsAsas.addEventListener('click', function () {
              const sacro = document.getElementById('as-sacroiliitis').checked;
              const hla = document.getElementById('as-hla-b27').checked;
              const featureCount = document.querySelectorAll('.as-feature:checked').length;

              const meetsImagingArm = sacro && featureCount >= 1;
              const meetsClinicalArm = hla && featureCount >= 2;

              if (meetsImagingArm || meetsClinicalArm) {
                asAsasBadge.className = 'status-badge badge-remission';
                asAsasBadge.textContent = 'Memenuhi Kriteria SpA Aksial';
                let rationale = meetsImagingArm ? '&bull; Lengan Pencitraan: Sakroilitis (+) disertai ' + featureCount + ' fitur SpA.<br>' : '';
                if (meetsClinicalArm) rationale += '&bull; Lengan Klinis: HLA-B27 (+) disertai ' + featureCount + ' fitur SpA.';
                asAsasDesc.innerHTML = rationale;
              } else {
                asAsasBadge.className = 'status-badge badge-moderate';
                asAsasBadge.textContent = 'Belum Memenuhi Kriteria ASAS';
                asAsasDesc.innerHTML = 'Pasien belum memenuhi kriteria lengan pencitraan maupun lengan klinis.';
              }
              asAsasResult.classList.add('visible');
            });
          }

          if (btnResetAsAsas) {
            btnResetAsAsas.addEventListener('click', function () {
              document.getElementById('as-sacroiliitis').checked = false;
              document.getElementById('as-hla-b27').checked = false;
              document.querySelectorAll('.as-feature').forEach(item => { item.checked = false; });
              asAsasResult.classList.remove('visible');
            });
          }

          if (btnCopyAsAsas) {
            btnCopyAsAsas.addEventListener('click', function () {
              btnCalcAsAsas.click();
              const badge = asAsasBadge.textContent;
              const text = `[RheumaTools CDSS] HASIL KLASIFIKASI SpA AKSIAL (ASAS 2009)
Status: ${badge}
Keterangan: ${asAsasDesc.innerText.replace(/\n+/g, ' ')}
Referensi: Rudwaleit M, et al. Ann Rheum Dis 2009;68(6):770–6.`;
              copyTextToClipboard(text);
            });
          }

          const btnCalcBasdai = document.getElementById('btn-calc-basdai');
          const btnResetBasdai = document.getElementById('btn-reset-basdai');
          const btnCopyBasdai = document.getElementById('btn-copy-basdai');
          const basdaiResult = document.getElementById('basdai-result');
          const basdaiScoreNum = document.getElementById('basdai-score-num');
          const basdaiBadge = document.getElementById('basdai-badge');
          const basdaiDesc = document.getElementById('basdai-desc');

          if (btnCalcBasdai) {
            btnCalcBasdai.addEventListener('click', function () {
              const q1 = document.getElementById('basdai-q1').value.trim();
              const q2 = document.getElementById('basdai-q2').value.trim();
              const q3 = document.getElementById('basdai-q3').value.trim();
              const q4 = document.getElementById('basdai-q4').value.trim();
              const q5 = document.getElementById('basdai-q5').value.trim();
              const q6 = document.getElementById('basdai-q6').value.trim();

              try {
                const res = RheumaCalc.calculateBASDAI(q1, q2, q3, q4, q5, q6);
                basdaiScoreNum.textContent = res.score;
                if (res.active) {
                  basdaiBadge.className = 'status-badge badge-high';
                  basdaiBadge.textContent = 'Penyakit Aktif (BASDAI >= 4)';
                  basdaiDesc.textContent = 'Skor BASDAI >= 4 menandakan aktivitas aktif; pertimbangkan evaluasi DMARD biologik.';
                } else {
                  basdaiBadge.className = 'status-badge badge-remission';
                  basdaiBadge.textContent = 'Penyakit Terkontrol Inaktif (BASDAI < 4)';
                  basdaiDesc.textContent = 'Aktivitas penyakit aksial berada dalam batas terkontrol.';
                }
                basdaiResult.classList.add('visible');
              } catch (err) {
                basdaiResult.classList.remove('visible');
                showToast(err.message);
              }
            });
          }

          if (btnResetBasdai) {
            btnResetBasdai.addEventListener('click', function () {
              ['basdai-q1', 'basdai-q2', 'basdai-q3', 'basdai-q4', 'basdai-q5', 'basdai-q6'].forEach(id => {
                document.getElementById(id).value = '';
              });
              basdaiResult.classList.remove('visible');
            });
          }

          if (btnCopyBasdai) {
            btnCopyBasdai.addEventListener('click', function () {
              btnCalcBasdai.click();
              if (basdaiResult.classList.contains('visible')) {
                const score = basdaiScoreNum.textContent;
                const badge = basdaiBadge.textContent;
                const text = `[RheumaTools CDSS] HASIL SKOR AKTIVITAS BASDAI (AS)
Skor BASDAI: ${score} / 10
Status: ${badge}
Referensi: Garrett S, et al. J Rheumatol 1994.`;
                copyTextToClipboard(text);
              }
            });
          }

          /* --- 6. SYSTEMIC SCLEROSIS --- */
          const btnCalcSsc = document.getElementById('btn-calc-ssc');
          const btnResetSsc = document.getElementById('btn-reset-ssc');
          const btnCopySsc = document.getElementById('btn-copy-ssc');
          const sscResult = document.getElementById('ssc-result');
          const sscScoreNum = document.getElementById('ssc-score-num');
          const sscBadge = document.getElementById('ssc-badge');
          const sscDesc = document.getElementById('ssc-desc');

          if (btnCalcSsc) {
            btnCalcSsc.addEventListener('click', function () {
              let score = 0;
              document.querySelectorAll('.ssc-item:checked').forEach(item => {
                score += parseInt(item.dataset.score, 10);
              });
              const fingers = document.querySelector('input[name="ssc-fingers"]:checked');
              if (fingers) score += parseInt(fingers.value, 10);
              const lesions = document.querySelector('input[name="ssc-lesions"]:checked');
              if (lesions) score += parseInt(lesions.value, 10);

              sscScoreNum.textContent = score + ' / 9 Poin';
              if (score >= 9) {
                sscBadge.className = 'status-badge badge-remission';
                sscBadge.textContent = 'Memenuhi Kriteria SSc Definit';
                sscDesc.innerHTML = 'Skor total <b>' + score + ' &ge; 9</b> mengklasifikasikan sebagai <b>Sklerosis Sistemik definit</b> menurut ACR/EULAR 2013.';
              } else {
                sscBadge.className = 'status-badge badge-moderate';
                sscBadge.textContent = 'Belum Memenuhi Ambang (Skor < 9)';
                sscDesc.innerHTML = 'Skor total <b>' + score + ' &lt; 9</b> belum memenuhi ambang klasifikasi definit SSc.';
              }
              sscResult.classList.add('visible');
            });
          }

          if (btnResetSsc) {
            btnResetSsc.addEventListener('click', function () {
              document.querySelectorAll('.ssc-item').forEach(item => { item.checked = false; });
              const f0 = document.querySelector('input[name="ssc-fingers"][value="0"]');
              if (f0) f0.checked = true;
              const l0 = document.querySelector('input[name="ssc-lesions"][value="0"]');
              if (l0) l0.checked = true;
              sscResult.classList.remove('visible');
            });
          }

          if (btnCopySsc) {
            btnCopySsc.addEventListener('click', function () {
              btnCalcSsc.click();
              const score = sscScoreNum.textContent;
              const badge = sscBadge.textContent;
              const text = `[RheumaTools CDSS] HASIL KLASIFIKASI SKLEROSIS SISTEMIK (ACR/EULAR 2013)
Total Skor: ${score}
Klasifikasi: ${badge}
Referensi: Van den Hoogen F, et al. Arthritis Rheum 2013;65(11):2737–47.`;
              copyTextToClipboard(text);
            });
          }

          const btnInterpretMrss = document.getElementById('btn-interpret-mrss');
          const btnResetMrss = document.getElementById('btn-reset-mrss');
          const btnCopyMrss = document.getElementById('btn-copy-mrss');
          const mrssResult = document.getElementById('mrss-result');
          const mrssScoreNum = document.getElementById('mrss-score-num');
          const mrssBadge = document.getElementById('mrss-badge');
          const mrssDesc = document.getElementById('mrss-desc');

          if (btnInterpretMrss) {
            btnInterpretMrss.addEventListener('click', function () {
              const val = document.getElementById('ssc-mrss-input').value.trim();
              if (val === '' || isNaN(val)) {
                showToast('Silakan masukkan nilai skor mRSS.');
                return;
              }
              const num = Number(val);
              if (num < 0 || num > 51) {
                showToast('Skor mRSS harus berada di antara 0 dan 51.');
                return;
              }
              mrssScoreNum.textContent = num + ' / 51';
              if (num === 0) {
                mrssBadge.className = 'status-badge badge-remission';
                mrssBadge.textContent = 'Normal (Tidak Ada Penebalan)';
                mrssDesc.textContent = 'Kulit normal tanpa indurasi / penebalan.';
              } else if (num <= 14) {
                mrssBadge.className = 'status-badge badge-low';
                mrssBadge.textContent = 'Penebalan Ringan (Mild)';
                mrssDesc.textContent = 'Derajat penebalan kulit ringan; pantau progresivitas secara berkala.';
              } else if (num <= 29) {
                mrssBadge.className = 'status-badge badge-moderate';
                mrssBadge.textContent = 'Penebalan Sedang (Moderate)';
                mrssDesc.textContent = 'Derajat penebalan kulit sedang.';
              } else {
                mrssBadge.className = 'status-badge badge-high';
                mrssBadge.textContent = 'Penebalan Berat (Severe)';
                mrssDesc.textContent = 'Derajat penebalan kulit berat; risiko keterlibatan viseral lebih tinggi.';
              }
              mrssResult.classList.add('visible');
            });
          }

          if (btnResetMrss) {
            btnResetMrss.addEventListener('click', function () {
              document.getElementById('ssc-mrss-input').value = '';
              mrssResult.classList.remove('visible');
            });
          }

          if (btnCopyMrss) {
            btnCopyMrss.addEventListener('click', function () {
              btnInterpretMrss.click();
              if (mrssResult.classList.contains('visible')) {
                const score = mrssScoreNum.textContent;
                const badge = mrssBadge.textContent;
                const text = `[RheumaTools CDSS] HASIL SKOR KULIT RODNAN TERMODIFIKASI (mRSS)
Skor mRSS: ${score}
Derajat Penebalan: ${badge}
Area Evaluasi: 17 area anatomis
Referensi: Clements PJ, et al. J Rheumatol 1995.`;
                copyTextToClipboard(text);
              }
            });
          }

          /* --- 7. GOUT ARTHRITIS --- */
          const btnCalcGout = document.getElementById('btn-calc-gout');
          const btnResetGout = document.getElementById('btn-reset-gout');
          const btnCopyGout = document.getElementById('btn-copy-gout');
          const goutResult = document.getElementById('gout-result');
          const goutScoreNum = document.getElementById('gout-score-num');
          const goutBadge = document.getElementById('gout-badge');
          const goutDesc = document.getElementById('gout-desc');

          if (btnCalcGout) {
            btnCalcGout.addEventListener('click', function () {
              let score = 0;
              score += parseInt(document.querySelector('input[name="gout-joint"]:checked').value, 10);
              score += parseInt(document.querySelector('input[name="gout-char"]:checked').value, 10);
              score += parseInt(document.querySelector('input[name="gout-time"]:checked').value, 10);
              score += parseInt(document.querySelector('input[name="gout-urate"]:checked').value, 10);

              if (document.getElementById('gout-tophus').checked) score += 4;
              if (document.getElementById('gout-imaging').checked) score += 4;

              goutScoreNum.textContent = score + ' Poin';
              if (score >= 8) {
                goutBadge.className = 'status-badge badge-remission';
                goutBadge.textContent = 'Sangat Mungkin Gout (Klasifikasi Positif)';
                goutDesc.innerHTML = 'Skor total <b>' + score + ' &ge; 8</b> mengklasifikasikan pasien sebagai <b>Gout Artritis</b> menurut ACR/EULAR 2015.';
              } else {
                goutBadge.className = 'status-badge badge-moderate';
                goutBadge.textContent = 'Gout Tidak Memenuhi Ambang';
                goutDesc.innerHTML = 'Skor total <b>' + score + ' &lt; 8</b> belum memenuhi ambang klasifikasi Gout.';
              }
              goutResult.classList.add('visible');
            });
          }

          if (btnResetGout) {
            btnResetGout.addEventListener('click', function () {
              document.getElementById('gout-joint-0').checked = true;
              document.getElementById('gout-char-0').checked = true;
              document.getElementById('gout-time-0').checked = true;
              document.getElementById('gout-urate-0').checked = true;
              document.getElementById('gout-tophus').checked = false;
              document.getElementById('gout-imaging').checked = false;
              goutResult.classList.remove('visible');
            });
          }

          if (btnCopyGout) {
            btnCopyGout.addEventListener('click', function () {
              btnCalcGout.click();
              const score = goutScoreNum.textContent;
              const badge = goutBadge.textContent;
              const text = `[RheumaTools CDSS] HASIL KLASIFIKASI GOUT ARTRITIS (ACR/EULAR 2015)
Total Skor: ${score}
Klasifikasi: ${badge}
Referensi: Neogi T, et al. Arthritis Rheumatol 2015;67(10):2557–68.`;
              copyTextToClipboard(text);
            });
          }

          const btnEvalFunc = document.getElementById('btn-eval-func');
          const btnResetFunc = document.getElementById('btn-reset-func');
          const btnCopyFunc = document.getElementById('btn-copy-func');
          const funcResult = document.getElementById('func-result');
          const funcClassTitle = document.getElementById('func-class-title');
          const funcClassDesc = document.getElementById('func-class-desc');

          if (btnEvalFunc) {
            btnEvalFunc.addEventListener('click', function () {
              const selected = document.querySelector('input[name="gout-func"]:checked');
              if (selected) {
                funcClassTitle.textContent = selected.value;
                if (selected.value === 'Kelas I') funcClassDesc.textContent = 'Kapasitas fungsional penuh untuk semua aktivitas hidup harian tanpa hambatan.';
                else if (selected.value === 'Kelas II') funcClassDesc.textContent = 'Mampu melakukan perawatan diri mandiri dan pekerjaan normal, namun terbatas pada aktivitas berat / rekreasi.';
                else if (selected.value === 'Kelas III') funcClassDesc.textContent = 'Mampu melakukan perawatan diri, namun terbatas dalam aktivitas pekerjaan dan aktivitas lainnya.';
                else funcClassDesc.textContent = 'Sangat terbatas; tidak mampu melakukan sebagian besar aktivitas perawatan diri tanpa bantuan.';
                funcResult.classList.add('visible');
              }
            });
          }

          if (btnResetFunc) {
            btnResetFunc.addEventListener('click', function () {
              const first = document.querySelector('input[name="gout-func"][value="Kelas I"]');
              if (first) first.checked = true;
              funcResult.classList.remove('visible');
            });
          }

          if (btnCopyFunc) {
            btnCopyFunc.addEventListener('click', function () {
              btnEvalFunc.click();
              const classTitle = funcClassTitle.textContent;
              const classDesc = funcClassDesc.textContent;
              const text = `[RheumaTools CDSS] KELAS FUNGSIONAL STEINBROCKER
Kapasitas: ${classTitle}
Keterangan: ${classDesc}
Referensi: Buku Saku Reumatologi (IRA 2020).`;
              copyTextToClipboard(text);
            });
          }
}

function mountRheumaTool(pageId, subTab, targetScrollId, container, ctx, emit) {
  container.innerHTML = RHEUMA_TEMPLATES[pageId] || '';
  bindRheumaEvents(container, emit);

  // Auto-fill from patient context
  if (ctx) {
    if (ctx.crp !== undefined) {
      const crpL = container.querySelector('#ra-crp-mgl');
      if (crpL) crpL.value = ctx.crp;
      const crpDl = container.querySelector('#ra-crp-mgdl, #dapsa-crp');
      if (crpDl) crpDl.value = (ctx.crp > 10 ? ctx.crp / 10 : ctx.crp); // convert if needed
    }
    if (ctx.esr !== undefined) {
      const esr = container.querySelector('#ra-esr');
      if (esr) esr.value = ctx.esr;
    }
  }

  // Activate sub-tab if specified
  if (subTab) {
    const tabEl = container.querySelector('[data-tab="' + subTab + '"]');
    if (tabEl) tabEl.click();
  }

  // Scroll to target card if specified
  if (targetScrollId) {
    setTimeout(() => {
      const target = container.querySelector('#' + targetScrollId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// Register 17 Rheumatology Calculators
reg({
  id: 'diag-approach',
  nama: 'Alur Pendekatan Nyeri Sendi (IRA 2020)',
  divisi: 'Reumatologi',
  sub: 'Alur Diagnostik',
  tags: 'alur nyeri sendi algoritma artralgia artritis trauma monoartritis poliartritis ira pohon keputusan',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('diag-approach-page', null, null, container, ctx, emit);
  }
});

reg({
  id: 'ra-acr',
  nama: 'Kriteria Klasifikasi RA (ACR/EULAR 2010)',
  divisi: 'Reumatologi',
  sub: 'Rheumatoid Arthritis',
  tags: 'ra rheumatoid arthritis artritis reumatoid acr eular rf anti ccp led crp sinovitis sendi',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ra-page', null, 'ra-acr-result', container, ctx, emit);
  }
});

reg({
  id: 'das28-crp',
  nama: 'Kalkulator DAS28-CRP (Disease Activity Score)',
  divisi: 'Reumatologi',
  sub: 'Rheumatoid Arthritis',
  tags: 'das28 das28-crp aktivitas ra remisi tjc sjc crp pga t2t',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ra-page', 'das-crp', 'fields-das-crp', container, ctx, emit);
  }
});

reg({
  id: 'das28-esr',
  nama: 'Kalkulator DAS28-LED / ESR',
  divisi: 'Reumatologi',
  sub: 'Rheumatoid Arthritis',
  tags: 'das28-esr das28-led laju endap darah esr led westergren aktivitas ra',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ra-page', 'das-esr', 'fields-das-esr', container, ctx, emit);
  }
});

reg({
  id: 'cdai',
  nama: 'Kalkulator CDAI (Clinical Disease Activity Index)',
  divisi: 'Reumatologi',
  sub: 'Rheumatoid Arthritis',
  tags: 'cdai clinical disease activity bedside tanpa lab ega pga tjc sjc',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ra-page', 'cdai', 'fields-cdai', container, ctx, emit);
  }
});

reg({
  id: 'sdai',
  nama: 'Kalkulator SDAI (Simplified Disease Activity Index)',
  divisi: 'Reumatologi',
  sub: 'Rheumatoid Arthritis',
  tags: 'sdai simplified disease activity crp mg/dl aktivitas ra tjc sjc pga ega',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ra-page', 'sdai', 'fields-sdai', container, ctx, emit);
  }
});

reg({
  id: 'sle-eular',
  nama: 'Kriteria Klasifikasi SLE (EULAR/ACR 2019)',
  divisi: 'Reumatologi',
  sub: 'Lupus SLE',
  tags: 'sle lupus eular acr 2019 ana antinuclear nefritis sitopenia malar dsdna',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('sle-page', null, 'sle-acr-result', container, ctx, emit);
  }
});

reg({
  id: 'sledai-2k',
  nama: 'Kalkulator SLEDAI-2K (Lupus Activity Index)',
  divisi: 'Reumatologi',
  sub: 'Lupus SLE',
  tags: 'sledai sledai-2k aktivitas sle kejang psikosis vaskulitis komplemen c3 c4',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('sle-page', 'sledai-2k', 'fields-sledai-2k', container, ctx, emit);
  }
});

reg({
  id: 'mex-sledai',
  nama: 'Kalkulator MEX-SLEDAI (Clinical Lupus Activity)',
  divisi: 'Reumatologi',
  sub: 'Lupus SLE',
  tags: 'mex-sledai mex sledai aktivitas sle lupus guzman tanpa imunologi nefritis sitopenia',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('sle-page', 'mex-sledai', 'fields-mex-sledai', container, ctx, emit);
  }
});

reg({
  id: 'caspar',
  nama: 'Kriteria Klasifikasi CASPAR (Psoriatic Arthritis)',
  divisi: 'Reumatologi',
  sub: 'Spondiloartropati & PsA',
  tags: 'caspar psa psoriatic arthritis artritis psoriatik psoriasis daktilitis kuku',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('psa-page', null, 'caspar-result', container, ctx, emit);
  }
});

reg({
  id: 'dapsa',
  nama: 'Kalkulator DAPSA (PsA Disease Activity)',
  divisi: 'Reumatologi',
  sub: 'Spondiloartropati & PsA',
  tags: 'dapsa aktivitas psa tjc68 sjc66 remisi psa nyeri pga',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('psa-page', null, 'dapsa-result', container, ctx, emit);
  }
});

reg({
  id: 'as-asas',
  nama: 'Kriteria SpA Aksial ASAS 2009',
  divisi: 'Reumatologi',
  sub: 'Spondiloartropati & PsA',
  tags: 'as asas 2009 ankylosing spondylitis spa aksial sakroilitis hla-b27 nyeri pinggang inflamasi',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('as-page', null, 'as-asas-result', container, ctx, emit);
  }
});

reg({
  id: 'basdai',
  nama: 'Kalkulator BASDAI (Bath Ankylosing Spondylitis)',
  divisi: 'Reumatologi',
  sub: 'Spondiloartropati & PsA',
  tags: 'basdai bath aktivitas as kaku pagi kelelahan entesitis vas',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('as-page', null, 'basdai-result', container, ctx, emit);
  }
});

reg({
  id: 'ssc-acr',
  nama: 'Kriteria Klasifikasi Sklerosis Sistemik (ACR/EULAR 2013)',
  divisi: 'Reumatologi',
  sub: 'Sklerosis Sistemik',
  tags: 'ssc sklerosis sistemik scleroderma sklerodaktili raynaud telangiektasia pah ild',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ssc-page', null, 'ssc-result', container, ctx, emit);
  }
});

reg({
  id: 'mrss',
  nama: 'Skor Kulit Rodnan Termodifikasi (mRSS)',
  divisi: 'Reumatologi',
  sub: 'Sklerosis Sistemik',
  tags: 'mrss rodnan skor kulit penebalan kulit indurasi 17 area skleroderma',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('ssc-page', null, 'mrss-result', container, ctx, emit);
  }
});

reg({
  id: 'gout-acr',
  nama: 'Kriteria Klasifikasi Gout (ACR/EULAR 2015)',
  divisi: 'Reumatologi',
  sub: 'Gout & Fungsional',
  tags: 'gout asam urat podagra tofus urate hiperurisemia monosodium urat msu acr eular',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('gout-page', null, 'gout-result', container, ctx, emit);
  }
});

reg({
  id: 'steinbrocker',
  nama: 'Kelas Fungsional Steinbrocker',
  divisi: 'Reumatologi',
  sub: 'Gout & Fungsional',
  tags: 'steinbrocker fungsional kelas i kelas ii kelas iii kelas iv kemandirian adl',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    mountRheumaTool('gout-page', null, 'func-result', container, ctx, emit);
  }
});