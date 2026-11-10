# Doctor Portfolio & InternaHub CDSS

Kumpulan alat bantu keputusan klinis (Clinical Decision Support Systems) berbasis web mandiri (*self-contained single-file HTML*) untuk embed Google Sites, dirancang untuk dokter spesialis penyakit dalam dan dokter jaga rumah sakit akut.

---

## 🚀 Perintah Cepat (NPM Scripts)

Proyek ini telah dilengkapi pipeline modular dan suite verifikasi klinis:

```bash
# 1. Pengecekan Sintaks & Integritas Tag Script (0 leaked code check)
npm run check

# 2. Benchmark Perhitungan & Algoritma Klinis (27 skenario klinis)
npm test

# 3. Build semua (internahub.html + index.html) & auto-sync ke Google Drive untuk GAS
npm run build

# 3b. Build khusus index.html saja & auto-sync ke Google Drive
npm run build:index

# 4. Audit Keamanan & Analisis Kode Statis
npm run audit:code
```

---

## 📁 Struktur Direktori

```text
doctor-portfolio/
├── dist/
│   └── internahub.html        # Output produksi terkompilasi (siap embed Google Sites)
├── src/                       # Komponen sumber modular
│   ├── template.html          # Kerangka dasar HTML (head, header, navbar, container)
│   ├── css/
│   │   └── styles.css         # Token obsidian/cyan & utilitas styling
│   ├── core/
│   │   ├── context.js         # Patient context store (BB, TB, lab, umur, gender)
│   │   └── router.js          # Search, router hash, filter chips, SIMETRISS parser
│   ├── calculators/
│   │   ├── m0-general.js      # CURB-65, Anion Gap, Osmolaritas, DKA, Glukosa, Lipid
│   │   ├── m1-cairan.js       # Holliday-Segar, Adrogué-Madias, Defisit K, Mg, Ca
│   │   ├── m2-endokrin.js     # Tiroid (BWPS, Wayne, Billewicz), Adrenal Crisis
│   │   ├── m3-geh.js          # CTP, MELD-Na, FIB-4, SAAG, APRI, BISAP, Truelove
│   │   └── m4-hom.js          # MASCC, CISNE, Calvert, Ganzoni, 4Ts HIT, ISTH DIC
│   ├── engines/
│   │   └── rheuma-engine.js   # DAS28-CRP/ESR, CDAI, SDAI, Kriteria ACR/EULAR
│   ├── data/
│   │   └── drug-database.js   # Database 36 antimikroba + Cockcroft-Gault Engine
│   └── modules/
│       ├── adjustr-io.html    # Template UI mandiri Adjustr-IO (HTML murni)
│       ├── adjustr-io.js      # Event handler, seleksi obat, & resume CPPT
│       └── rheumatools-templates.js # Template view 17 skor reumatologi
├── scripts/
│   ├── build-internahub.js    # Compiler bundler src/ -> dist/ (safe script escaping)
│   ├── check-html-scripts.js  # Verifikator sintaks AST JS & detektor kebocoran kode
│   └── audit-code.js          # Auditor keamanan DOM, ID ganda, & localStorage
├── tests/
│   ├── harness.js             # JSDOM headless clinical test harness
│   ├── run-all-tests.js       # Master test runner
│   └── calc/                  # Test suite per spesialisasi medis
├── archive/                   # File backup (*.bak) & riwayat scratch terdahulu
├── internahub.html            # File aktif hasil build di root
└── index.html                 # Landing page portofolio utama
```

---

## 🔄 Sinkronisasi Git dengan Google Drive

Repository ini terhubung langsung dengan **bare repository di Google Drive**:

- **Working Tree Lokal:** `C:\Users\Wib PC\Documents\Project\myproject\doctor-portfolio`
- **Origin Remote (Drive):** `G:/My Drive/git/doctor-portfolio.git`
- **Cadangan Arsip Zip:** `G:\My Drive\git\backups\`

### Alur Kerja Harian:
1. Edit kode di folder `src/` lokal.
2. Jalankan `npm run build` dan `npm test` untuk memverifikasi.
3. Commit dan push langsung ke Google Drive:
   ```bash
   git add .
   git commit -m "feat: deskripsi perubahan"
   git push origin main
   ```
4. Di laptop / perangkat lain yang memiliki akses Google Drive, cukup clone sekali:
   ```bash
   git clone "G:/My Drive/git/doctor-portfolio.git"
   ```
   Lalu tinggal `git pull` setiap kali ada update tanpa perlu copy-paste manual.

---

## 🩺 Standar Rujukan Klinis

- **Nefrologi:** KDIGO 2024 / Cockcroft-Gault (Devine IBW & Sarasin ABW untuk Obesitas).
- **Antimikroba:** Stanford Antimicrobial Dosing 2025 & Sanford Guide 2024.
- **Elektrolit:** Adrogué-Madias Formula (NEJM) dengan *ODS Safety Ceiling* (8–10 mEq/24h).
- **Reumatologi:** ACR/EULAR 2010 RA Classification & DAS28 Cutoff (Remisi: score $\le 2.60$).
- **Gastroenterohepatologi:** Baveno VII, EASL CLIF-C, UNOS MELD-Na, ACG C. diff 2021.
- **Hematologi-Onkologi:** ASCO Antiemetic 2020, ISTH DIC, Wintrobe Hematology.
