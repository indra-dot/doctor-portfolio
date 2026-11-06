const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Calc-Med.html');
const rawHtml = fs.readFileSync(filePath, 'utf8');

// Function to extract section by ID
function extractSection(html, id) {
    const startTag = `<section id="${id}"`;
    const startIndex = html.indexOf(startTag);
    if (startIndex === -1) throw new Error(`Section ${id} not found`);
    const endTag = `</section>`;
    const endIndex = html.indexOf(endTag, startIndex);
    if (endIndex === -1) throw new Error(`End of section ${id} not found`);
    return html.substring(startIndex, endIndex + endTag.length);
}

const sections = [
    'calc-ne',
    'calc-dobu',
    'calc-dopa',
    'calc-nicardipine',
    'calc-ntg',
    'calc-insulin',
    'calc-na',
    'calc-abg'
];

const backBtn = `
        <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
        </button>
`;

const extractedSections = {};
sections.forEach(id => {
    let s = extractSection(rawHtml, id);
    // Replace calc-section with module-section hidden
    s = s.replace(/class="calc-section[^"]*"/, 'class="module-section hidden"');
    // Add back button after <section ...>
    s = s.replace(/(<section[^>]*>)/, '$1' + backBtn);
    extractedSections[id] = s;
});

const upgradedHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>CalcMed Pro - Clinical Infusion & Critical Dosing CDSS</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts: Inter & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-main: #040814;
            --glass-bg: rgba(15, 23, 42, 0.78);
            --glass-bg-hover: rgba(22, 34, 60, 0.90);
            --glass-border: rgba(255, 255, 255, 0.09);
            --glass-border-hover: rgba(0, 242, 254, 0.45);
            --text-heading: #F8FAFC;
            --text-secondary: #94A3B8;
            --text-muted: #64748B;
            --accent-cyan: #00F2FE;
            --accent-blue: #38BDF8;
            --accent-emerald: #10B981;
            --accent-amber: #F59E0B;
            --accent-rose: #EF4444;
            --accent-purple: #C084FC;
            --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45);
            --btn-gradient: linear-gradient(135deg, #00F2FE 0%, #2563EB 100%);
            --radius-pill: 9999px;
            --radius-lg: 20px;
            --radius-md: 14px;
            --radius-sm: 8px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-main);
            color: var(--text-secondary);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Ambient Glow Effects matching adjustr-GEH */
        .ambient-glow-1 {
            position: fixed; top: -120px; left: 10%; width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(0, 242, 254, 0.10) 0%, transparent 65%);
            filter: blur(80px); z-index: -1; pointer-events: none;
        }
        .ambient-glow-2 {
            position: fixed; bottom: 5%; right: 8%; width: 480px; height: 480px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 65%);
            filter: blur(80px); z-index: -1; pointer-events: none;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.16); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
        }

        .glass-card, .card {
            background: var(--glass-bg);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--glass-shadow);
            transition: all 0.22s ease;
            width: 100%;
            box-sizing: border-box;
        }
        .glass-card:hover, .card:hover {
            border-color: var(--glass-border-hover);
            box-shadow: 0 8px 30px 0 rgba(0, 242, 254, 0.16);
            transform: translateY(-2px);
        }

        .glass-input, input, select, textarea {
            background: rgba(30, 41, 59, 0.65) !important;
            border: 1px solid var(--glass-border) !important;
            color: var(--text-heading) !important;
            border-radius: var(--radius-sm);
            padding: 0.55rem 0.85rem;
            width: 100%;
            transition: all 0.2s ease;
        }
        .glass-input:focus, input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-cyan) !important;
            box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.2) !important;
        }

        /* Quick Navigation Bar */
        .quick-nav-bar {
            background: rgba(4, 8, 20, 0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--glass-border);
            position: sticky;
            top: 56px;
            z-index: 30;
            padding: 0.5rem 1rem;
        }
        .quick-nav-scroll {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            max-width: 1200px;
            margin: 0 auto;
        }
        .quick-nav-scroll::-webkit-scrollbar { display: none; }

        .quick-nav-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 0.4rem 0.85rem;
            border-radius: var(--radius-pill);
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--glass-border);
            color: var(--text-secondary);
            font-size: 0.78rem;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .quick-nav-pill:hover {
            background: rgba(255, 255, 255, 0.09);
            color: #FFFFFF;
            border-color: rgba(0, 242, 254, 0.35);
        }
        .quick-nav-pill.active {
            background: linear-gradient(135deg, rgba(0, 242, 254, 0.22) 0%, rgba(37, 99, 235, 0.25) 100%);
            border-color: var(--accent-cyan);
            color: #FFFFFF;
            font-weight: 600;
            box-shadow: 0 0 15px rgba(0, 242, 254, 0.25);
        }

        .btn-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0.45rem 0.95rem;
            border-radius: var(--radius-pill);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: var(--text-secondary);
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 1.25rem;
        }
        .btn-back:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #FFFFFF;
            border-color: var(--accent-cyan);
            transform: translateX(-2px);
        }

        /* Clinical Pearl Box */
        .pearl-box {
            background: linear-gradient(to right, rgba(0, 242, 254, 0.08), rgba(15, 23, 42, 0.4));
            border-left: 3px solid var(--accent-cyan);
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
            padding: 1.15rem 1.35rem;
            margin-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        #toast-notice {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
    </style>
</head>
<body class="selection:bg-cyan-900 selection:text-cyan-100">

    <div class="ambient-glow-1"></div>
    <div class="ambient-glow-2"></div>

    <!-- Toast Notification (Matching adjustr-GEH) -->
    <div id="toast-notice" class="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-[0_10px_35px_rgba(0,242,254,0.3)] text-white text-sm font-medium translate-y-24 opacity-0 pointer-events-none">
        <i class="fa-solid fa-circle-check text-cyan-400 text-lg"></i>
        <span id="toast-message">Resume klinis CPPT berhasil disalin!</span>
    </div>

    <!-- Main Container -->
    <div class="flex flex-col min-h-screen">
        
        <!-- Top Sticky Header -->
        <header class="h-14 glass-panel sticky top-0 z-40 border-t-0 border-x-0 rounded-none flex items-center justify-between px-3 sm:px-6 gap-2">
            <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer text-left">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                        <i class="fa-solid fa-syringe text-base"></i>
                    </div>
                    <div>
                        <span class="text-white font-bold text-sm tracking-tight block leading-tight font-['Plus_Jakarta_Sans']">CalcMed Pro</span>
                        <span class="text-[10px] text-cyan-400 font-medium block leading-tight">Clinical Infusion & Dosing CDSS</span>
                    </div>
                </button>
                <div class="h-4 w-px bg-white/10 hidden md:block"></div>
                <div class="hidden md:block">
                    <h2 id="header-title" class="text-xs font-semibold text-slate-200 truncate max-w-[160px] lg:max-w-none">Home Dashboard</h2>
                </div>
            </div>

            <!-- Top Search Bar (Realtime Calculator Discovery) -->
            <div class="relative flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4" id="header-search-container">
                <div class="relative flex items-center">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 text-slate-400 text-xs pointer-events-none"></i>
                    <input type="text" id="global-search-input" placeholder="Cari obat (e.g. Norepinefrin, Dobutamin, Dopamin, Nikardipin, NTG, Insulin, AGD)..." autocomplete="off" class="w-full pl-8 pr-14 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all">
                    <span class="hidden sm:inline-block absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700 pointer-events-none">Ctrl K</span>
                    <button id="search-clear-btn" type="button" onclick="clearGlobalSearch()" class="hidden absolute right-2.5 text-slate-400 hover:text-white text-xs px-1">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <!-- Search Results Dropdown -->
                <div id="search-results-dropdown" class="hidden absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 max-h-96 overflow-y-auto p-2"></div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium hidden sm:inline-block">8 Tools</span>
                <a href="mailto:putrawan.2371041010@student.unud.ac.id" target="_blank" rel="noopener" class="px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors flex items-center gap-1.5">
                    <i class="fa-solid fa-envelope text-[11px]"></i>
                    <span class="hidden md:inline">Feedback</span>
                </a>
            </div>
        </header>

        <!-- Sticky Quick Navigation Bar (Horizontal Scrollable Pills) -->
        <nav class="quick-nav-bar" aria-label="Quick Category Switcher">
            <div class="quick-nav-scroll">
                <button type="button" id="pill-dash" onclick="navigateTo('home-module', 'Home Dashboard', this.id)" class="quick-nav-pill active">
                    <i class="fa-solid fa-house text-cyan-400 text-xs"></i>
                    <span>Dashboard</span>
                </button>
                <button type="button" id="pill-ne" onclick="navigateTo('calc-ne', 'Norepinephrine (NE)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-vial text-cyan-400 text-xs"></i>
                    <span>Norepinephrine</span>
                </button>
                <button type="button" id="pill-dobu" onclick="navigateTo('calc-dobu', 'Dobutamin (Inotrope)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-heart-pulse text-rose-400 text-xs"></i>
                    <span>Dobutamin</span>
                </button>
                <button type="button" id="pill-dopa" onclick="navigateTo('calc-dopa', 'Dopamin', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-pills text-purple-400 text-xs"></i>
                    <span>Dopamin</span>
                </button>
                <button type="button" id="pill-nicardipine" onclick="navigateTo('calc-nicardipine', 'Nikardipin', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-brain text-yellow-400 text-xs"></i>
                    <span>Nikardipin</span>
                </button>
                <button type="button" id="pill-ntg" onclick="navigateTo('calc-ntg', 'Nitrogliserin (NTG)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-lungs text-emerald-400 text-xs"></i>
                    <span>Nitrogliserin</span>
                </button>
                <button type="button" id="pill-insulin" onclick="navigateTo('calc-insulin', 'Bridging Insulin IV ke SC', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-syringe text-orange-400 text-xs"></i>
                    <span>Bridging Insulin</span>
                </button>
                <button type="button" id="pill-na" onclick="navigateTo('calc-na', 'Koreksi Hipernatremia', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-droplet text-blue-400 text-xs"></i>
                    <span>Hipernatremia</span>
                </button>
                <button type="button" id="pill-abg" onclick="navigateTo('calc-abg', 'Acid-Base Analyzer (AGD)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-flask text-pink-400 text-xs"></i>
                    <span>Acid-Base AGD</span>
                </button>
            </div>
        </nav>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto z-10">

            <!-- ======================================================== -->
            <!-- LEVEL 0: HOME DASHBOARD                                  -->
            <!-- ======================================================== -->
            <section id="home-module" class="module-section block">
                
                <!-- Welcome Banner -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 mb-7 relative overflow-hidden border-t-2 border-t-cyan-400/50">
                    <div class="absolute -right-6 -top-6 opacity-10 pointer-events-none">
                        <i class="fa-solid fa-syringe text-9xl text-cyan-400"></i>
                    </div>
                    <div class="relative z-10">
                        <span class="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/30 inline-block mb-2">
                            Critical Care & Emergency CDSS
                        </span>
                        <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                            CalcMed <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Pro Clinical Toolkit</span>
                        </h2>
                        <p class="text-slate-300 max-w-3xl text-xs sm:text-sm mt-1 leading-relaxed">
                            Sistem pendukung keputusan klinis (CDSS) titrasi obat emergensi, inotropik, vasopresor, vasodilator, serta transisi terapi kritis: Norepinefrin, Dobutamin, Dopamin, Nikardipin, Nitrogliserin (NTG), protokol Bridging Insulin 24 jam ke subkutan, koreksi hipernatremia Adrogué-Madias, dan analisis komprehensif gas darah (AGD).
                        </p>
                    </div>
                </div>

                <!-- 8 Main Tools Grid -->
                <h3 class="text-sm font-bold text-white mb-3 flex items-center justify-between">
                    <span>Modul Titrasi Infus & Dosing Kritis</span>
                    <span class="text-xs text-slate-400 font-normal">Pilih kalkulator untuk membuka alat perhitungan dan tabel titrasi</span>
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <!-- 1. Norepinephrine -->
                    <button type="button" onclick="navigateTo('calc-ne', 'Norepinephrine (NE)', 'pill-ne')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-vial"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">1. Norepinephrine (NE)</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Vasopresor lini pertama syok septik. Konsentrasi syringe pump 50 cc & tabel titrasi 0.05–1.0 mcg/kg/menit.</p>
                        <span class="mt-auto text-xs text-cyan-400 font-semibold flex items-center">Buka Norepinephrine <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 2. Dobutamin -->
                    <button type="button" onclick="navigateTo('calc-dobu', 'Dobutamin (Inotrope)', 'pill-dobu')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-heart-pulse"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">2. Dobutamin</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Inotropik murni pilihan syok kardiogenik dengan TDS &ge; 90 mmHg. Tabel titrasi 2–20 mcg/kg/menit.</p>
                        <span class="mt-auto text-xs text-rose-400 font-semibold flex items-center">Buka Dobutamin <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 3. Dopamin -->
                    <button type="button" onclick="navigateTo('calc-dopa', 'Dopamin', 'pill-dopa')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-pills"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">3. Dopamin</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Inotropik & vasopresor alternatif dengan titrasi bertingkat 5–20 mcg/kg/menit.</p>
                        <span class="mt-auto text-xs text-purple-400 font-semibold flex items-center">Buka Dopamin <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 4. Nikardipin -->
                    <button type="button" onclick="navigateTo('calc-nicardipine', 'Nikardipin', 'pill-nicardipine')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-brain"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">4. Nikardipin</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">CCB vaskuloselektif untuk krisis hipertensi neurologis tanpa menaikkan TIK (0.5–6 mcg/kg/menit).</p>
                        <span class="mt-auto text-xs text-yellow-400 font-semibold flex items-center">Buka Nikardipin <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 5. Nitrogliserin -->
                    <button type="button" onclick="navigateTo('calc-ntg', 'Nitrogliserin (NTG)', 'pill-ntg')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-lungs"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">5. Nitrogliserin (NTG)</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Venodilator reduksi preload pada ALO dan sindrom koroner akut (dosis tetap 10–100 mcg/menit).</p>
                        <span class="mt-auto text-xs text-emerald-400 font-semibold flex items-center">Buka Nitrogliserin <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 6. Bridging Insulin -->
                    <button type="button" onclick="navigateTo('calc-insulin', 'Bridging Insulin IV ke SC', 'pill-insulin')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-syringe"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">6. Bridging Insulin</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Konversi titrasi drip insulin IV 24 jam ke regimen basal-bolus 80% dengan panduan overlap 1-2 jam.</p>
                        <span class="mt-auto text-xs text-orange-400 font-semibold flex items-center">Buka Bridging Insulin <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 7. Hipernatremia -->
                    <button type="button" onclick="navigateTo('calc-na', 'Koreksi Hipernatremia', 'pill-na')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-droplet"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">7. Koreksi Hipernatremia</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Formula Adrogué-Madias & Free Water Deficit (FWD) dengan batas aman penurunan Na maksimal 10 mEq/hari.</p>
                        <span class="mt-auto text-xs text-blue-400 font-semibold flex items-center">Buka Hipernatremia <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 8. Acid-Base Analyzer -->
                    <button type="button" onclick="navigateTo('calc-abg', 'Acid-Base Analyzer (AGD)', 'pill-abg')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-flask"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">8. Acid-Base Analyzer (AGD)</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Validasi Henderson, formula Winter's, Anion Gap terkoreksi albumin, Delta ratio, dan rasio P/F.</p>
                        <span class="mt-auto text-xs text-pink-400 font-semibold flex items-center">Buka Acid-Base AGD <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                </div>
            </section>

            <!-- ================= TOOL 1: NOREPINEPHRINE ================= -->
            ${extractedSections['calc-ne']}

            <!-- ================= TOOL 2: DOBUTAMIN ================= -->
            ${extractedSections['calc-dobu']}

            <!-- ================= TOOL 3: DOPAMIN ================= -->
            ${extractedSections['calc-dopa']}

            <!-- ================= TOOL 4: NIKARDIPIN ================= -->
            ${extractedSections['calc-nicardipine']}

            <!-- ================= TOOL 5: NITROGLISERIN ================= -->
            ${extractedSections['calc-ntg']}

            <!-- ================= TOOL 6: BRIDGING INSULIN ================= -->
            ${extractedSections['calc-insulin']}

            <!-- ================= TOOL 7: HIPERNATREMIA ================= -->
            ${extractedSections['calc-na']}

            <!-- ================= TOOL 8: ACID-BASE ANALYZER ================= -->
            ${extractedSections['calc-abg']}

            <footer class="mt-12 mb-6 p-4 glass-panel rounded-xl text-center">
                <p class="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Alat bantu hitung dosis klinis — bukan pengganti penilaian klinis profesional. Selalu verifikasi ulang dosis dan konsentrasi larutan sebelum diberikan.<br>
                    &copy; 2026 CalcMed Pro | Basis: dr. Gus Bhaskara (BHS) &bull; disempurnakan oleh dr. I Putu Yogi Sastrawan, Sp.PD, dr. Guswib (IWP)
                </p>
            </footer>

        </main>
    </div>

    <!-- SCRIPT ENGINE -->
    <script>
    // ==========================================
    // GLOBAL TOOL REGISTRY & SEARCH ENGINE
    // ==========================================
    const CALCULATORS_DB = [
      { id: 'calc-ne', name: 'Norepinephrine (NE)', category: 'Vasopresor', color: 'cyan', pillId: 'pill-ne', desc: 'Vasopresor lini pertama syok septik. Tabel kecepatan infus syringe pump 50 cc (0.05–1.0 mcg/kg/menit).', keywords: ['norepinephrine', 'ne', 'vasopresor', 'syok septik', 'map', 'levophed'] },
      { id: 'calc-dobu', name: 'Dobutamin (Inotrope)', category: 'Inotropik', color: 'rose', pillId: 'pill-dobu', desc: 'Inotropik murni pilihan syok kardiogenik low output dengan TDS >= 90 mmHg (2–20 mcg/kg/menit).', keywords: ['dobutamin', 'dobu', 'inotrope', 'syok kardiogenik', 'gagal jantung', 'inotropik'] },
      { id: 'calc-dopa', name: 'Dopamin', category: 'Inotropik & Vasopresor', color: 'purple', pillId: 'pill-dopa', desc: 'Inotropik dan vasopresor alternatif dengan titrasi bertingkat 5–20 mcg/kg/menit.', keywords: ['dopamin', 'dopa', 'inotropik', 'vasopresor', 'bradikardia'] },
      { id: 'calc-nicardipine', name: 'Nikardipin', category: 'Antihipertensi IV', color: 'yellow', pillId: 'pill-nicardipine', desc: 'CCB vaskuloselektif untuk krisis hipertensi neurologis tanpa meningkatkan TIK (0.5–6 mcg/kg/menit).', keywords: ['nikardipin', 'nicardipine', 'krisis hipertensi', 'perdarahan intraserebral', 'stroke'] },
      { id: 'calc-ntg', name: 'Nitrogliserin (NTG)', category: 'Vasodilator', color: 'emerald', pillId: 'pill-ntg', desc: 'Venodilator poten untuk reduksi preload pada ALO dan ACS (dosis tetap 10–100 mcg/menit).', keywords: ['nitrogliserin', 'ntg', 'vasodilator', 'alo', 'edema paru', 'iskemia miokard'] },
      { id: 'calc-insulin', name: 'Bridging Insulin IV ke SC', category: 'Protokol Transisi', color: 'orange', pillId: 'pill-insulin', desc: 'Titrasi drip insulin 24 jam ke regimen basal-bolus 80% dengan overlap 1-2 jam dan ekspor CPPT.', keywords: ['bridging insulin', 'insulin', 'drip', 'subkutan', 'kda', 'hhs', 'overlap'] },
      { id: 'calc-na', name: 'Koreksi Hipernatremia', category: 'Elektrolit & Cairan', color: 'blue', pillId: 'pill-na', desc: 'Formula Adrogué-Madias & Free Water Deficit (FWD) dengan batas aman penurunan Na maksimal 10 mEq/hari.', keywords: ['hipernatremia', 'adrogue-madias', 'fwd', 'free water deficit', 'd5w', 'natrium'] },
      { id: 'calc-abg', name: 'Acid-Base Analyzer (AGD)', category: 'Asam-Basa', color: 'pink', pillId: 'pill-abg', desc: 'Validasi Henderson, Winter formula kompensasi, Anion Gap terkoreksi albumin, Delta ratio, dan rasio P/F.', keywords: ['agd', 'acid base', 'analisis gas darah', 'winter', 'anion gap', 'henderson', 'p/f ratio'] }
    ];

    function showToast(msg) {
        const toastEl = document.getElementById('toast-notice');
        const toastMsg = document.getElementById('toast-message');
        if (toastEl && toastMsg) {
            toastMsg.textContent = msg;
            toastEl.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
            toastEl.classList.add('translate-y-0', 'opacity-100');
            setTimeout(() => {
                toastEl.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
                toastEl.classList.remove('translate-y-0', 'opacity-100');
            }, 3000);
        }
    }

    // Direct Navigation matching adjustr-GEH
    window.navigateTo = function (targetId, title, activePillId = null) {
        document.querySelectorAll('.module-section').forEach(sec => {
            sec.classList.add('hidden');
            sec.classList.remove('block');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('block');
        }

        const headerTitle = document.getElementById('header-title');
        if (headerTitle && title) {
            headerTitle.textContent = title;
        }

        document.querySelectorAll('.quick-nav-pill').forEach(pill => pill.classList.remove('active'));
        if (activePillId) {
            const el = document.getElementById(activePillId);
            if (el) el.classList.add('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    function initGlobalSearch() {
        const searchInput = document.getElementById('global-search-input');
        const searchDropdown = document.getElementById('search-results-dropdown');
        const clearBtn = document.getElementById('search-clear-btn');

        if (!searchInput || !searchDropdown) return;

        function renderResults(query) {
            const clean = query.trim().toLowerCase();
            if (!clean) {
                searchDropdown.classList.add('hidden');
                searchDropdown.innerHTML = '';
                if (clearBtn) clearBtn.classList.add('hidden');
                return;
            }

            if (clearBtn) clearBtn.classList.remove('hidden');

            const matches = CALCULATORS_DB.filter(tool => {
                return tool.name.toLowerCase().includes(clean) ||
                       tool.category.toLowerCase().includes(clean) ||
                       tool.desc.toLowerCase().includes(clean) ||
                       tool.keywords.some(k => k.toLowerCase().includes(clean));
            });

            if (matches.length === 0) {
                searchDropdown.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">Tidak ditemukan kalkulator untuk "' + query + '".</div>';
                searchDropdown.classList.remove('hidden');
                return;
            }

            let html = '<div class="space-y-1">';
            matches.forEach(tool => {
                html += \`
                    <button type="button" onclick="selectSearchResult('\${tool.id}', '\${tool.name.replace(/'/g, "\\\\'")}', '\${tool.pillId}')" class="w-full p-2.5 rounded-lg bg-slate-800/60 hover:bg-cyan-500/20 border border-slate-700/50 hover:border-cyan-500/50 text-left transition-all group flex items-start space-x-3">
                        <div class="h-7 w-7 rounded-md bg-\${tool.color}-500/20 text-\${tool.color}-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                            <i class="fa-solid fa-calculator"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2">
                                <span class="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">\${tool.name}</span>
                                <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-medium shrink-0">\${tool.category}</span>
                            </div>
                            <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">\${tool.desc}</p>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-slate-500 group-hover:text-cyan-400 mt-1 shrink-0"></i>
                    </button>
                \`;
            });
            html += '</div>';

            searchDropdown.innerHTML = html;
            searchDropdown.classList.remove('hidden');
        }

        searchInput.addEventListener('input', (e) => {
            renderResults(e.target.value);
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            if (e.key === 'Escape' && !searchDropdown.classList.contains('hidden')) {
                searchDropdown.classList.add('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            const container = document.getElementById('header-search-container');
            if (container && !container.contains(e.target)) {
                searchDropdown.classList.add('hidden');
            }
        });
    }

    window.clearGlobalSearch = function () {
        const input = document.getElementById('global-search-input');
        if (input) {
            input.value = '';
            input.focus();
            const dropdown = document.getElementById('search-results-dropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
                dropdown.innerHTML = '';
            }
            const clearBtn = document.getElementById('search-clear-btn');
            if (clearBtn) clearBtn.classList.add('hidden');
        }
    };

    window.selectSearchResult = function (targetId, name, pillId) {
        const searchDropdown = document.getElementById('search-results-dropdown');
        if (searchDropdown) searchDropdown.classList.add('hidden');
        navigateTo(targetId, name, pillId);
    };

    function copyCPPT(elementId, btnElement) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const textToCopy = el.innerText;
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast('Resume klinis CPPT berhasil disalin!');
            }).catch(fallbackCopy);
        } else {
            fallbackCopy();
        }

        function fallbackCopy() {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('Resume klinis CPPT berhasil disalin!');
            } catch (err) {
                console.error('Gagal menyalin:', err);
            }
            document.body.removeChild(textArea);
        }
    }

    function fmtIndo(num, digits = 1) {
        if (isNaN(num) || !isFinite(num)) return "0";
        return Number(num).toFixed(digits).replace('.', ',');
    }

    // 1. Norepinephrine
    function calcNE() {
        const bb = parseFloat(document.getElementById('ne-bb')?.value) || 0;
        const mg = parseFloat(document.getElementById('ne-mg')?.value) || 0;
        const cc = parseFloat(document.getElementById('ne-cc')?.value) || 1;
        
        const conc = (mg * 1000) / cc; // mcg/cc
        const concEl = document.getElementById('ne-conc');
        if (concEl) concEl.innerText = conc > 0 ? conc.toFixed(0) : "0";

        let cppt = \`COPY KE CPPT\\n\`;
        cppt += \`Drip norepinefrin \${mg} mg dalam NaCl 0.9% \${cc} cc (BB: \${bb} kg)\\n\`;
        cppt += \`Konsentrasi: \${conc.toFixed(0)} mcg/cc\\n\\n\`;
        
        const dosesNE = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
        for (let d of dosesNE) {
            let r = conc > 0 ? (d * bb * 60) / conc : 0;
            let dStr = String(d).replace('.', ',').padEnd(4, ' ');
            let rStr = fmtIndo(r, 1).padStart(5, ' ');
            cppt += \`  \${dStr} mcg/kg/menit   :   \${rStr} ml/jam\\n\`;
        }
        const cpptEl = document.getElementById('ne-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 2. Dobutamin
    function calcDobu() {
        const bb = parseFloat(document.getElementById('dobu-bb')?.value) || 0;
        const mg = parseFloat(document.getElementById('dobu-mg')?.value) || 0;
        const cc = parseFloat(document.getElementById('dobu-cc')?.value) || 1;
        
        const conc = (mg * 1000) / cc;
        const concEl = document.getElementById('dobu-conc');
        if (concEl) concEl.innerText = conc > 0 ? conc.toFixed(0) : "0";

        let cppt = \`COPY KE CPPT\\n\`;
        cppt += \`Drip dobutamin \${mg} mg dalam NaCl 0.9% \${cc} cc (BB: \${bb} kg)\\n\`;
        cppt += \`Konsentrasi: \${conc.toFixed(0)} mcg/cc\\n\\n\`;

        for (let d = 2; d <= 20; d++) {
            let r = conc > 0 ? (d * bb * 60) / conc : 0;
            let dStr = String(d).padEnd(2, ' ');
            let rStr = fmtIndo(r, 1).padStart(5, ' ');
            cppt += \`  \${dStr} mcg/kg/menit     :   \${rStr} ml/jam\\n\`;
        }
        const cpptEl = document.getElementById('dobu-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 3. Dopamin (5 - 20 mcg/kg/menit)
    function calcDopa() {
        const bb = parseFloat(document.getElementById('dopa-bb')?.value) || 0;
        const mg = parseFloat(document.getElementById('dopa-mg')?.value) || 0;
        const cc = parseFloat(document.getElementById('dopa-cc')?.value) || 1;
        
        const conc = (mg * 1000) / cc;
        const concEl = document.getElementById('dopa-conc');
        if (concEl) concEl.innerText = conc > 0 ? conc.toFixed(0) : "0";

        let cppt = \`COPY KE CPPT\\n\`;
        cppt += \`Drip dopamin \${mg} mg dalam NaCl 0.9% \${cc} cc (BB: \${bb} kg)\\n\`;
        cppt += \`Konsentrasi: \${conc.toFixed(0)} mcg/cc\\n\\n\`;

        for (let d = 5; d <= 20; d++) {
            let r = conc > 0 ? (d * bb * 60) / conc : 0;
            let dStr = String(d).padEnd(2, ' ');
            let rStr = fmtIndo(r, 1).padStart(5, ' ');
            cppt += \`  \${dStr} mcg/kg/menit     :   \${rStr} ml/jam\\n\`;
        }
        const cpptEl = document.getElementById('dopa-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 4. Nikardipin (0.5, 1, 1.5, 2, 3, 4, 5, 6 mcg/kg/menit)
    function calcNica() {
        const bb = parseFloat(document.getElementById('nica-bb')?.value) || 0;
        const mg = parseFloat(document.getElementById('nica-mg')?.value) || 0;
        const cc = parseFloat(document.getElementById('nica-cc')?.value) || 1;
        
        const conc = (mg * 1000) / cc;
        const concEl = document.getElementById('nica-conc');
        if (concEl) concEl.innerText = conc > 0 ? conc.toFixed(0) : "0";

        let cppt = \`COPY KE CPPT\\n\`;
        cppt += \`Drip nikardipin \${mg} mg dalam NaCl 0.9% \${cc} cc (BB: \${bb} kg)\\n\`;
        cppt += \`Konsentrasi: \${conc.toFixed(0)} mcg/cc\\n\\n\`;

        const dosesNica = [0.5, 1, 1.5, 2, 3, 4, 5, 6];
        for (let d of dosesNica) {
            let r = conc > 0 ? (d * bb * 60) / conc : 0;
            let dStr = String(d).replace('.', ',').padEnd(3, ' ');
            let rStr = fmtIndo(r, 1).padStart(5, ' ');
            cppt += \`  \${dStr} mcg/kg/menit   :   \${rStr} ml/jam\\n\`;
        }
        const cpptEl = document.getElementById('nica-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 5. Nitrogliserin (10 - 100 mcg/menit)
    function calcNTG() {
        const mg = parseFloat(document.getElementById('ntg-mg')?.value) || 0;
        const cc = parseFloat(document.getElementById('ntg-cc')?.value) || 1;
        
        const conc = (mg * 1000) / cc;
        const concEl = document.getElementById('ntg-conc');
        if (concEl) concEl.innerText = conc > 0 ? conc.toFixed(0) : "0";

        let cppt = \`COPY KE CPPT\\n\`;
        cppt += \`Drip nitrogliserin (NTG) \${mg} mg dalam NaCl 0.9% \${cc} cc\\n\`;
        cppt += \`Konsentrasi: \${conc.toFixed(0)} mcg/cc\\n\\n\`;

        for (let d = 10; d <= 100; d += 10) {
            let r = conc > 0 ? (d * 60) / conc : 0;
            let dStr = String(d).padEnd(3, ' ');
            let rStr = fmtIndo(r, 1).padStart(5, ' ');
            cppt += \`  \${dStr} mcg/menit        :   \${rStr} ml/jam\\n\`;
        }
        const cpptEl = document.getElementById('ntg-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 6. Bridging Insulin
    function renderInsulinTable() {
        const startHourSelect = document.getElementById('ins-start-hour');
        if (!startHourSelect) return;
        const startHour = parseInt(startHourSelect.value, 10) || 0;
        const tbody = document.getElementById('insulin-table-body');
        if (!tbody) return;
        
        const currentVals = [];
        tbody.querySelectorAll('.ins-hourly-input').forEach(input => {
            currentVals.push(input.value);
        });

        let html = '';
        for (let i = 0; i < 24; i++) {
            let h = (startHour + i) % 24;
            let hourStr = \`\${h.toString().padStart(2, '0')}:00\`;
            let val = currentVals[i] !== undefined ? currentVals[i] : '0';
            
            html += \`
                <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="px-4 py-2 font-mono text-slate-300 text-center bg-slate-900/30 border-r border-slate-800">\${hourStr}</td>
                    <td class="px-3 py-1.5">
                        <input type="number" class="ins-hourly-input w-full glass-input rounded-md px-3 py-1 text-sm font-mono text-center calc-trigger" value="\${val}" min="0" step="0.5">
                    </td>
                </tr>
            \`;
        }
        tbody.innerHTML = html;

        tbody.querySelectorAll('.calc-trigger').forEach(inp => {
            inp.addEventListener('input', calcInsulin);
        });

        calcInsulin();
    }

    function resetInsulinInputs() {
        document.querySelectorAll('.ins-hourly-input').forEach(input => {
            input.value = "0";
        });
        calcInsulin();
    }

    function quickFillInsulin(val) {
        document.querySelectorAll('.ins-hourly-input').forEach(input => {
            input.value = val;
        });
        calcInsulin();
    }

    function calcInsulin() {
        let total = 0;
        document.querySelectorAll('.ins-hourly-input').forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        const totalBB = total * 0.8;
        const basal = totalBB * 0.5;
        const prandial = basal / 3;

        const totalEl = document.getElementById('ins-total');
        if (!totalEl) return;

        totalEl.innerText = fmtIndo(total, 1);
        document.getElementById('ins-bb-80').innerText = fmtIndo(totalBB, 1);
        document.getElementById('ins-basal-50').innerText = fmtIndo(basal, 1);
        document.getElementById('ins-prandial-3').innerText = fmtIndo(prandial, 1);

        let cppt = \`BRIDGING INSULIN (TRANSISI KE SUBKUTAN)\\n\\n\`;
        cppt += \`Total drip 24 jam       : \${fmtIndo(total, 1)} U\\n\`;
        cppt += \`Total basal-bolus (80%) : \${fmtIndo(totalBB, 1)} U\\n\`;
        cppt += \`Insulin basal (50%)     : \${fmtIndo(basal, 1)} U (diberikan 1x/hari SC)\\n\`;
        cppt += \`Insulin prandial (/x3)  : \${fmtIndo(prandial, 1)} U (tiap makan SC)\\n\\n\`;
        cppt += \`Instruksi Overlap:\\n\`;
        cppt += \`- Berikan dosis insulin basal subkutan 1 - 2 jam sebelum drip IV dihentikan.\\n\`;
        cppt += \`- Pastikan pasien toleransi intake oral saat beralih ke regimen subkutan.\`;

        const cpptEl = document.getElementById('ins-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 7. Koreksi Hipernatremia
    function calcNa() {
        const sex = document.getElementById('na-sex')?.value || 'm';
        const age = document.getElementById('na-age')?.value || 'young';
        const bb = parseFloat(document.getElementById('na-bb')?.value) || 0;
        const actualNa = parseFloat(document.getElementById('na-actual')?.value) || 0;
        const targetNa = parseFloat(document.getElementById('na-target')?.value) || 140;

        const fluidSelect = document.getElementById('na-fluid');
        if (!fluidSelect) return;
        const infusNa = parseFloat(fluidSelect.value) || 0;
        const fluidName = fluidSelect.options[fluidSelect.selectedIndex].text.split('(')[0].trim();

        let factor = 0.6;
        if (sex === 'm') {
            factor = (age === 'young') ? 0.6 : 0.5;
        } else {
            factor = (age === 'young') ? 0.5 : 0.45;
        }

        const tbw = bb * factor;
        let adrogueDrop = 0;
        let adrogueVol = 0;
        let hourlyRate = 0;

        if (actualNa > 0 && tbw > 0) {
            adrogueDrop = (actualNa - infusNa) / (tbw + 1);
            if (adrogueDrop > 0) {
                const targetDrop = actualNa - targetNa;
                adrogueVol = targetDrop / adrogueDrop;
                hourlyRate = (adrogueVol * 1000) / 24;
            }
        }

        let fwd = 0;
        if (actualNa > targetNa && targetNa > 0) {
            fwd = tbw * ((actualNa / targetNa) - 1);
        }

        document.getElementById('na-tbw').innerText = tbw.toFixed(1);
        document.getElementById('na-adrogue-drop').innerText = adrogueDrop.toFixed(2);
        document.getElementById('na-adrogue-vol').innerText = Math.max(0, adrogueVol).toFixed(2);
        document.getElementById('na-infusion-rate').innerText = Math.max(0, Math.round(hourlyRate));
        document.getElementById('na-fwd').innerText = fwd > 0 ? fwd.toFixed(2) : "0.00";

        let cppt = \`KOREKSI HIPERNATREMIA\\n\`;
        cppt += \`Data Pasien: BB \${bb} kg | TBW: \${tbw.toFixed(1)} L | Na Aktual: \${actualNa} mEq/L -> Target: \${targetNa} mEq/L\\n\\n\`;
        cppt += \`[1] Metode Adrogue-Madias (PAPDI):\\n\`;
        cppt += \`  - Cairan Infus : \${fluidName} (Na: \${infusNa} mEq/L)\\n\`;
        cppt += \`  - Estimasi Drop: \${adrogueDrop.toFixed(2)} mEq/L per 1 Liter cairan\\n\`;
        cppt += \`  - Total Cairan : \${Math.max(0, adrogueVol).toFixed(2)} Liter\\n\`;
        cppt += \`  - Kecepatan    : \${Math.max(0, Math.round(hourlyRate))} mL/jam (habis dalam 24 jam)\\n\\n\`;
        cppt += \`[2] Free Water Deficit (Air Murni):\\n\`;
        cppt += \`  - Defisit Cairan: \${Math.max(0, fwd).toFixed(2)} Liter\\n\\n\`;
        cppt += \`Peringatan: Penurunan Na maks 10-12 mEq/L per 24 jam untuk mencegah edema serebri.\`;

        const cpptEl = document.getElementById('na-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    // 8. Acid-Base Analyzer
    function calcABG() {
        const ph = parseFloat(document.getElementById('abg-ph')?.value) || 0;
        const pco2 = parseFloat(document.getElementById('abg-pco2')?.value) || 0;
        const hco3 = parseFloat(document.getElementById('abg-hco3')?.value) || 0;
        const na = parseFloat(document.getElementById('abg-na')?.value) || 140;
        const cl = parseFloat(document.getElementById('abg-cl')?.value) || 105;
        const alb = parseFloat(document.getElementById('abg-alb')?.value) || 4.0;
        const pao2 = parseFloat(document.getElementById('abg-pao2')?.value) || 90;
        const fio2 = parseFloat(document.getElementById('abg-fio2')?.value) || 21;
        const bb = parseFloat(document.getElementById('abg-bb')?.value) || 60;

        if (ph === 0 || pco2 === 0 || hco3 === 0) return;

        // 1. Henderson Equation Validation: [H+] = 24 * (pCO2 / HCO3)
        const h_calc = 24 * (pco2 / hco3);
        let h_exact = 40;
        if (ph >= 7.0 && ph <= 7.8) {
            h_exact = 40 + ((7.40 - ph) * 100);
        } else {
            h_exact = Math.pow(10, (9 - ph));
        }
        const diff = Math.abs(h_calc - h_exact) / h_exact * 100;
        let valStatus = diff <= 15 
            ? \`<span class="text-emerald-400 font-semibold">Valid (&Delta; \${diff.toFixed(1)}%)</span>\` 
            : \`<span class="text-rose-400 font-semibold">Tidak Valid (&Delta; \${diff.toFixed(1)}%)</span>\`;
        const henEl = document.getElementById('abg-res-henderson');
        if (henEl) henEl.innerHTML = \`H+ Kalkulasi: \${h_calc.toFixed(1)} | Aktual: \${h_exact.toFixed(1)} &rarr; \${valStatus}\`;

        // 2 & 3. Gangguan Primer & Winter's Formula
        let primer = "Normal / Terkompensasi Sempurna";
        let komp = "-";
        let winter = "-";

        if (ph < 7.35) {
            if (hco3 < 22 && pco2 <= 45) {
                primer = "Asidosis Metabolik";
                let expPco2 = (1.5 * hco3) + 8;
                winter = \`Winter's exp pCO2: \${expPco2.toFixed(1)} &plusmn; 2 mmHg\`;
                if (pco2 >= expPco2 - 2 && pco2 <= expPco2 + 2) komp = "Kompensasi Respiratorik Adekuat";
                else if (pco2 > expPco2 + 2) komp = "Campuran: + Asidosis Respiratorik";
                else komp = "Campuran: + Alkalosis Respiratorik";
            } else if (pco2 > 45) {
                primer = "Asidosis Respiratorik";
                let expHco3Akut = 24 + 0.1 * (pco2 - 40);
                let expHco3Kronik = 24 + 0.35 * (pco2 - 40);
                winter = \`Exp HCO3 Akut: \${expHco3Akut.toFixed(1)} | Kronik: \${expHco3Kronik.toFixed(1)}\`;
                if (hco3 > 26) komp = "Kompensasi Metabolik Renal";
                else komp = "Fase Akut / Belum Ada Kompensasi Ginjal";
            }
        } else if (ph > 7.45) {
            if (hco3 > 26 && pco2 >= 35) {
                primer = "Alkalosis Metabolik";
                let expPco2 = (0.7 * hco3) + 21;
                winter = \`Exp pCO2: \${expPco2.toFixed(1)} &plusmn; 2 mmHg\`;
                if (pco2 >= expPco2 - 2 && pco2 <= expPco2 + 2) komp = "Kompensasi Respiratorik Adekuat";
                else if (pco2 > expPco2 + 2) komp = "Campuran: + Asidosis Respiratorik";
                else komp = "Campuran: + Alkalosis Respiratorik";
            } else if (pco2 < 35) {
                primer = "Alkalosis Respiratorik";
                let expHco3Akut = 24 - 0.2 * (40 - pco2);
                let expHco3Kronik = 24 - 0.5 * (40 - pco2);
                winter = \`Exp HCO3 Akut: \${expHco3Akut.toFixed(1)} | Kronik: \${expHco3Kronik.toFixed(1)}\`;
                if (hco3 < 22) komp = "Kompensasi Ginjal";
                else komp = "Fase Akut";
            }
        }

        const primerEl = document.getElementById('abg-res-primer');
        if (primerEl) primerEl.innerText = primer;
        const kompEl = document.getElementById('abg-res-komp');
        if (kompEl) kompEl.innerText = komp;
        const winterEl = document.getElementById('abg-res-winter');
        if (winterEl) winterEl.innerHTML = winter;

        // 4. Anion Gap + Koreksi Albumin
        let ag = na - (cl + hco3);
        let agCorr = ag + 2.5 * (4.0 - alb);
        let agStatus = agCorr > 12 ? "High Anion Gap (AGMA)" : "Normal Anion Gap (NAGMA)";
        const agEl = document.getElementById('abg-res-ag');
        if (agEl) agEl.innerHTML = \`AG Aktual: \${ag.toFixed(1)} | <span class="text-amber-400 font-bold">Koreksi: \${agCorr.toFixed(1)}</span> &rarr; \${agStatus}\`;

        // 5. Workup AGMA / Delta Ratio
        let workupText = "-";
        if (primer.includes("Asidosis Metabolik") && agCorr > 12) {
            let deltaAG = agCorr - 12;
            let deltaHCO3 = 24 - hco3;
            let deltaRatio = deltaHCO3 !== 0 ? (deltaAG / deltaHCO3) : 1;
            let dx = "";
            if (deltaRatio < 0.4) dx = "NAGMA Murni";
            else if (deltaRatio >= 0.4 && deltaRatio <= 0.8) dx = "Campuran AGMA + NAGMA";
            else if (deltaRatio > 0.8 && deltaRatio <= 2.0) dx = "AGMA Murni (Pure AGMA)";
            else dx = "Campuran AGMA + Alkalosis Metabolik Pre-existing";

            workupText = \`Delta Ratio: <span class="font-bold text-amber-400">\${deltaRatio.toFixed(2)}</span> &rarr; \${dx}\`;
        } else if (primer.includes("Asidosis Metabolik")) {
            workupText = \`<span class="text-amber-400 font-semibold">NAGMA Murni</span>. Evaluasi GI loss (diare) atau Renal loss (RTA).\`;
        } else {
            workupText = \`N/A (Bukan kelainan primer Asidosis Metabolik).\`;
        }
        const workupEl = document.getElementById('abg-res-workup');
        if (workupEl) workupEl.innerHTML = workupText;

        // 6. Oksigenasi (PaO2 / FiO2 Ratio)
        let pfRatio = fio2 > 0 ? (pao2 / (fio2 / 100)) : 0;
        let pfStatus = "";
        if (pfRatio > 400) pfStatus = "Normal (>400)";
        else if (pfRatio > 300) pfStatus = "Oksigenasi suboptimal (300-400)";
        else if (pfRatio > 200) pfStatus = "Mild ARDS (200-300)";
        else if (pfRatio > 100) pfStatus = "Moderate ARDS (100-200)";
        else pfStatus = "Severe ARDS (&le; 100)";

        const oxyEl = document.getElementById('abg-res-oxy');
        if (oxyEl) oxyEl.innerHTML = \`Rasio P/F: <span class="font-bold text-cyan-400">\${Math.round(pfRatio)}</span> &rarr; \${pfStatus}\`;

        // 7. Indikasi Bikarbonat (NaHCO3)
        let bicarbText = "Tidak ada indikasi mutlak pemberian koreksi bikarbonat (pH &ge; 7.1).";
        if (ph < 7.1 && primer.includes("Asidosis Metabolik")) {
            let doseBicarb = 0.5 * bb * (15 - hco3);
            if (doseBicarb > 0) {
                bicarbText = \`<span class="text-rose-400 font-bold">Asidemia Berat (pH &lt; 7.1)</span>: Estimasi defisit awal = \${doseBicarb.toFixed(1)} mEq (berikan 1/2 dosis sebagai infus lambat).\`;
            }
        }
        const bicarbEl = document.getElementById('abg-res-bicarb');
        if (bicarbEl) bicarbEl.innerHTML = bicarbText;

        // Output CPPT
        let cppt = \`ANALISIS GAS DARAH (BGA)\\n\`;
        cppt += \`Parameter: pH \${ph} | pCO2 \${pco2} | HCO3 \${hco3} | PaO2 \${pao2} | FiO2 \${fio2}%\\n\`;
        cppt += \`Elektrolit: Na \${na} | Cl \${cl} | Albumin \${alb} g/dL\\n\\n\`;
        cppt += \`INTERPRETASI:\\n\`;
        cppt += \`1. Validasi Henderson : \${valStatus.replace(/<[^>]*>?/gm, '')}\\n\`;
        cppt += \`2. Gangguan Primer    : \${primer}\\n\`;
        cppt += \`3. Kompensasi Paru    : \${komp} (\${winter.replace(/&plusmn;/g, '±')})\\n\`;
        cppt += \`4. Anion Gap          : Koreksi \${agCorr.toFixed(1)} (\${agStatus})\\n\`;
        cppt += \`5. Analisis Delta     : \${workupText.replace(/<[^>]*>?/gm, '')}\\n\`;
        cppt += \`6. Status Oksigenasi  : P/F \${Math.round(pfRatio)} (\${pfStatus.replace(/&le;/g, '<=')})\\n\`;
        cppt += \`7. Koreksi NaHCO3     : \${bicarbText.replace(/<[^>]*>?/gm, '')}\`;

        const cpptEl = document.getElementById('abg-cppt');
        if (cpptEl) cpptEl.innerText = cppt;
    }

    function calculateAll() {
        calcNE();
        calcDobu();
        calcDopa();
        calcNica();
        calcNTG();
        calcInsulin();
        calcNa();
        calcABG();
    }

    // Initialize calculations & UI bindings
    document.addEventListener('DOMContentLoaded', () => {
        initGlobalSearch();
        renderInsulinTable();

        document.querySelectorAll('.calc-trigger').forEach(input => {
            input.addEventListener('input', calculateAll);
        });

        document.getElementById('na-fluid')?.addEventListener('change', calculateAll);
        document.getElementById('na-sex')?.addEventListener('change', calculateAll);
        document.getElementById('na-age')?.addEventListener('change', calculateAll);

        calculateAll();
    });
    </script>
</body>
</html>`;

fs.writeFileSync(filePath, upgradedHtml, 'utf8');
console.log('Successfully written upgraded Calc-Med.html! Length: ' + upgradedHtml.length);
