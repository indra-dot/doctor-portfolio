const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'adjustr-emd.html');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>adjustrEMD Pro - Endocrine & Metabolic Emergency CDSS</title>
    
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
            --glass-border-hover: rgba(16, 185, 129, 0.45);
            --text-heading: #F8FAFC;
            --text-secondary: #94A3B8;
            --text-muted: #64748B;
            --accent-emerald: #10B981;
            --accent-cyan: #00F2FE;
            --accent-blue: #38BDF8;
            --accent-amber: #F59E0B;
            --accent-rose: #EF4444;
            --accent-purple: #C084FC;
            --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45);
            --btn-gradient: linear-gradient(135deg, #10B981 0%, #0284C7 100%);
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
            background: radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, transparent 65%);
            filter: blur(80px); z-index: -1; pointer-events: none;
        }
        .ambient-glow-2 {
            position: fixed; bottom: 5%; right: 8%; width: 480px; height: 480px;
            background: radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 65%);
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
            box-shadow: 0 8px 30px 0 rgba(16, 185, 129, 0.16);
            transform: translateY(-2px);
        }

        .input-modern, select, textarea {
            background: rgba(30, 41, 59, 0.65) !important;
            border: 1px solid var(--glass-border) !important;
            color: var(--text-heading) !important;
            border-radius: var(--radius-sm);
            padding: 0.55rem 0.85rem;
            width: 100%;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }
        .input-modern:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-emerald) !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important;
        }

        /* Checkbox modern */
        .checkbox-modern {
            appearance: none;
            width: 1.2rem;
            height: 1.2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.375rem;
            background-color: rgba(30, 41, 59, 0.65);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }
        .checkbox-modern:checked {
            background-color: var(--accent-emerald);
            border-color: var(--accent-emerald);
        }
        .checkbox-modern:checked::after {
            content: '\\f00c';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            color: white;
            font-size: 0.7rem;
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
            border-color: rgba(16, 185, 129, 0.35);
        }
        .quick-nav-pill.active {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(2, 132, 199, 0.25) 100%);
            border-color: var(--accent-emerald);
            color: #FFFFFF;
            font-weight: 600;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.25);
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
            border-color: var(--accent-emerald);
            transform: translateX(-2px);
        }

        /* Clinical Pearl Box */
        .pearl-box {
            background: linear-gradient(to right, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.4));
            border-left: 3px solid var(--accent-emerald);
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
            padding: 1.15rem 1.35rem;
            margin-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 12px;
            margin-top: 1rem;
        }
        .metric-item {
            background: rgba(2, 6, 23, 0.55);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: var(--radius-md);
            padding: 0.85rem;
            text-align: center;
        }
        .metric-label {
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
            display: block;
        }
        .metric-value {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 1.6rem;
            font-weight: 800;
            color: var(--text-heading);
            line-height: 1.2;
        }
        .metric-unit {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-muted);
            margin-left: 2px;
        }

        #toast-notice {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
    </style>
</head>
<body class="selection:bg-emerald-900 selection:text-emerald-100">

    <div class="ambient-glow-1"></div>
    <div class="ambient-glow-2"></div>

    <!-- Toast Notification (Matching adjustr-GEH) -->
    <div id="toast-notice" class="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-[0_10px_35px_rgba(16,185,129,0.3)] text-white text-sm font-medium translate-y-24 opacity-0 pointer-events-none">
        <i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
        <span id="toast-message">Resume klinis CPPT berhasil disalin!</span>
    </div>

    <!-- Main Container -->
    <div class="flex flex-col min-h-screen">
        
        <!-- Top Sticky Header -->
        <header class="h-14 glass-panel sticky top-0 z-40 border-t-0 border-x-0 rounded-none flex items-center justify-between px-3 sm:px-6 gap-2">
            <div class="flex items-center space-x-2 sm:space-x-3 shrink-0">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer text-left">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <i class="fa-solid fa-bolt-lightning text-base"></i>
                    </div>
                    <div>
                        <span class="text-white font-bold text-sm tracking-tight block leading-tight font-['Plus_Jakarta_Sans']">adjustrEMD Pro</span>
                        <span class="text-[10px] text-emerald-400 font-medium block leading-tight">Endocrine & Metabolic CDSS</span>
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
                    <input type="text" id="global-search-input" placeholder="Cari kalkulator (e.g. BWPS, Wayne, Osmolaritas, Anion Gap, TyG, Bridging)..." autocomplete="off" class="w-full pl-8 pr-14 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all">
                    <span class="hidden sm:inline-block absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700 pointer-events-none">Ctrl K</span>
                    <button id="search-clear-btn" type="button" onclick="clearGlobalSearch()" class="hidden absolute right-2.5 text-slate-400 hover:text-white text-xs px-1">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <!-- Search Results Dropdown -->
                <div id="search-results-dropdown" class="hidden absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 max-h-96 overflow-y-auto p-2"></div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium hidden sm:inline-block">10 Tools</span>
                <a href="mailto:putrawan.2371041010@student.unud.ac.id" target="_blank" rel="noopener" class="px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 transition-colors flex items-center gap-1.5">
                    <i class="fa-solid fa-envelope text-[11px]"></i>
                    <span class="hidden md:inline">Feedback</span>
                </a>
            </div>
        </header>

        <!-- Sticky Quick Navigation Bar (Horizontal Scrollable Pills) -->
        <nav class="quick-nav-bar" aria-label="Quick Category Switcher">
            <div class="quick-nav-scroll">
                <button type="button" id="pill-dash" onclick="navigateTo('home-module', 'Home Dashboard', this.id)" class="quick-nav-pill active">
                    <i class="fa-solid fa-house text-emerald-400 text-xs"></i>
                    <span>Dashboard</span>
                </button>
                <button type="button" id="pill-bwps" onclick="navigateTo('tab-bwps', 'BWPS (Thyroid Storm)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-fire text-rose-400 text-xs"></i>
                    <span>BWPS (Badai Tiroid)</span>
                </button>
                <button type="button" id="pill-wayne" onclick="navigateTo('tab-wayne', 'Wayne Clinical Index', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-gauge-high text-cyan-400 text-xs"></i>
                    <span>Wayne Index</span>
                </button>
                <button type="button" id="pill-billewicz" onclick="navigateTo('tab-billewicz', 'Billewicz Score (Hipotiroid)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-temperature-arrow-down text-indigo-400 text-xs"></i>
                    <span>Billewicz Score</span>
                </button>
                <button type="button" id="pill-osmo" onclick="navigateTo('tab-osmo', 'Osmolaritas Serum Efektif', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-droplet text-amber-400 text-xs"></i>
                    <span>Osmolaritas Efektif</span>
                </button>
                <button type="button" id="pill-ag" onclick="navigateTo('tab-ag', 'Anion Gap & Corr Na', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-scale-balanced text-emerald-400 text-xs"></i>
                    <span>Anion Gap & cNa</span>
                </button>
                <button type="button" id="pill-tdd" onclick="navigateTo('tab-tdd', 'Insulin Basal-Bolus TDD', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-syringe text-rose-400 text-xs"></i>
                    <span>Basal-Bolus TDD</span>
                </button>
                <button type="button" id="pill-tyg" onclick="navigateTo('tab-tyg', 'TyG Index (Resistensi Insulin)', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-chart-line text-fuchsia-400 text-xs"></i>
                    <span>TyG Index</span>
                </button>
                <button type="button" id="pill-homa" onclick="navigateTo('tab-homa', 'HOMA-IR', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-dna text-violet-400 text-xs"></i>
                    <span>HOMA-IR</span>
                </button>
                <button type="button" id="pill-friedewald" onclick="navigateTo('tab-friedewald', 'Friedewald LDL-C', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-heart-pulse text-sky-400 text-xs"></i>
                    <span>Friedewald LDL</span>
                </button>
                <button type="button" id="pill-bridging" onclick="navigateTo('tab-bridging', 'Bridging Insulin IV ke SC', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-shuffle text-orange-400 text-xs"></i>
                    <span>Bridging Insulin (IV-SC)</span>
                </button>
            </div>
        </nav>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto z-10">

            <!-- ======================================================== -->
            <!-- LEVEL 0: HOME DASHBOARD                                  -->
            <!-- ======================================================== -->
            <section id="home-module" class="module-section block">
                
                <!-- Welcome Banner -->
                <div class="glass-card rounded-2xl p-6 sm:p-7 mb-7 relative overflow-hidden border-t-2 border-t-emerald-400/50">
                    <div class="absolute -right-6 -top-6 opacity-10 pointer-events-none">
                        <i class="fa-solid fa-bolt-lightning text-9xl text-emerald-400"></i>
                    </div>
                    <div class="relative z-10">
                        <span class="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30 inline-block mb-2">
                            Evidence-Based Medicine
                        </span>
                        <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                            adjustrEMD <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Clinical Toolkit</span>
                        </h2>
                        <p class="text-slate-300 max-w-3xl text-xs sm:text-sm mt-1 leading-relaxed">
                            Sistem pendukung keputusan klinis (CDSS) Kedaruratan Endokrin, Metabolik, dan Kardiometabolik: Stratifikasi krisis tiroid (BWPS, Wayne, Billewicz), krisis hiperglikemia DKA/HHS (Osmolaritas, Anion Gap, koreksi Na), regimen insulin basal-bolus TDD, indeks resistensi insulin & profil lipid (TyG, HOMA-IR, Friedewald), serta protokol bridging titrasi drip insulin IV ke subkutan 24 jam.
                        </p>
                    </div>
                </div>

                <!-- 10 Main Tools Category Grid -->
                <h3 class="text-sm font-bold text-white mb-3 flex items-center justify-between">
                    <span>Modul Endokrin & Kedaruratan Metabolik</span>
                    <span class="text-xs text-slate-400 font-normal">Pilih kalkulator untuk membuka alat perhitungan klinis</span>
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <!-- 1. BWPS -->
                    <button type="button" onclick="navigateTo('tab-bwps', 'BWPS (Thyroid Storm)', 'pill-bwps')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-fire"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">1. Burch-Wartofsky Scale (BWPS)</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Kriteria diagnostik krisis tirotoksikosis / badai tiroid (suhu, SSP, GI, takikardia, gagal jantung, AF).</p>
                        <span class="mt-auto text-xs text-rose-400 font-semibold flex items-center">Buka Evaluasi BWPS <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 2. Wayne Index -->
                    <button type="button" onclick="navigateTo('tab-wayne', 'Wayne Clinical Index', 'pill-wayne')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-gauge-high"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">2. Wayne's Clinical Index</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Skor klinis terstandar untuk membedakan status eutiroid vs hipertiroid klinis sebelum hasil lab tersedia.</p>
                        <span class="mt-auto text-xs text-cyan-400 font-semibold flex items-center">Buka Wayne Index <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 3. Billewicz Score -->
                    <button type="button" onclick="navigateTo('tab-billewicz', 'Billewicz Score (Hipotiroid)', 'pill-billewicz')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-temperature-arrow-down"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">3. Billewicz Diagnostic Score</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Indeks diagnostik hipotiroidisme klinis berdasarkan gejala konstitusional dan refleks relaksasi tendo Achilles.</p>
                        <span class="mt-auto text-xs text-indigo-400 font-semibold flex items-center">Buka Billewicz Score <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 4. Osmolaritas Serum -->
                    <button type="button" onclick="navigateTo('tab-osmo', 'Osmolaritas Serum Efektif', 'pill-osmo')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-droplet"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">4. Osmolaritas Serum Efektif</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Diferensiasi krisis hiperglikemia (HHS vs DKA) dan korelasi tingkat penurunan kesadaran (>320 mOsm/kg).</p>
                        <span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka Osmolaritas <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 5. Anion Gap & Corr Na -->
                    <button type="button" onclick="navigateTo('tab-ag', 'Anion Gap & Corr Na', 'pill-ag')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-scale-balanced"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">5. Anion Gap & Koreksi Natrium</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Evaluasi asidosis metabolik celah anion (AGMA) dan koreksi pseudohiponatremia akibat hiperglikemia akut.</p>
                        <span class="mt-auto text-xs text-emerald-400 font-semibold flex items-center">Buka Anion Gap & cNa <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 6. Basal-Bolus TDD -->
                    <button type="button" onclick="navigateTo('tab-tdd', 'Insulin Basal-Bolus TDD', 'pill-tdd')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-syringe"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">6. Insulin Basal-Bolus TDD</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Distribusi dosis harian total (TDD) berbasis berat badan: 50% basal (1x/hari) dan 50% bolus prandial (3x/hari).</p>
                        <span class="mt-auto text-xs text-rose-400 font-semibold flex items-center">Buka Basal-Bolus TDD <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 7. TyG Index -->
                    <button type="button" onclick="navigateTo('tab-tyg', 'TyG Index (Resistensi Insulin)', 'pill-tyg')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">7. TyG Index (Triglyceride-Glucose)</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Surrogate marker sensitif untuk resistensi insulin dan perlemakan hati metabolik (MASLD).</p>
                        <span class="mt-auto text-xs text-fuchsia-400 font-semibold flex items-center">Buka TyG Index <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 8. HOMA-IR -->
                    <button type="button" onclick="navigateTo('tab-homa', 'HOMA-IR', 'pill-homa')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-dna"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">8. HOMA-IR Assessment</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Homeostatic model assessment resistensi insulin dari kadar insulin puasa dan glukosa darah.</p>
                        <span class="mt-auto text-xs text-violet-400 font-semibold flex items-center">Buka HOMA-IR <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 9. Friedewald LDL -->
                    <button type="button" onclick="navigateTo('tab-friedewald', 'Friedewald LDL-C', 'pill-friedewald')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full">
                        <div class="h-11 w-11 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-heart-pulse"></i>
                        </div>
                        <h4 class="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">9. Formula Friedewald (LDL-C)</h4>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-3">Estimasi kadar kolesterol LDL dari profil lipid standar dengan guardrail batas trigliserida > 400 mg/dL.</p>
                        <span class="mt-auto text-xs text-sky-400 font-semibold flex items-center">Buka Formula Friedewald <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                    <!-- 10. Bridging Insulin -->
                    <button type="button" onclick="navigateTo('tab-bridging', 'Bridging Insulin IV ke SC', 'pill-bridging')" class="glass-card rounded-xl p-5 flex flex-col items-start text-left cursor-pointer group w-full md:col-span-2 lg:col-span-3">
                        <div class="flex items-center space-x-3 mb-2">
                            <div class="h-11 w-11 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                <i class="fa-solid fa-shuffle"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">10. Bridging Insulin: Transisi IV Drip 24 Jam ke Regimen Subkutan</h4>
                                <span class="text-xs text-orange-400 font-medium">Protokol Overlap Kritis & Kalkulator Konversi Subkutan Terpadu</span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-400 mb-3">Input titrasi insulin per jam selama 24 jam terakhir, kalkulasi otomatis 80% TDD, pembagian 50% basal dan 50% prandial, panduan overlap 1-2 jam sebelum stop infus, dan ekspor CPPT instan.</p>
                        <span class="text-xs text-orange-400 font-semibold flex items-center">Buka Protokol Bridging Insulin <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>
                    </button>

                </div>
            </section>

            <!-- ================= TOOL 1: BWPS ================= -->
            <section id="tab-bwps" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Thyroid Storm CDSS</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Burch-Wartofsky Point Scale (BWPS)</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Kriteria diagnostik obyektif untuk badai tiroid (thyrotoxic crisis).</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-emerald-400 tracking-tight" id="res-bwps">0</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-emerald-400" id="res-bwps-interp">Thyroid Storm Unlikely</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Suhu Tubuh (&deg;C)</label>
                            <select id="bwps-temp" class="input-modern bwps-input">
                                <option value="0">&lt; 37.2 &deg;C (0)</option>
                                <option value="5">37.2 - 37.7 &deg;C (+5)</option>
                                <option value="10">37.8 - 38.3 &deg;C (+10)</option>
                                <option value="15">38.4 - 38.8 &deg;C (+15)</option>
                                <option value="20">38.9 - 39.3 &deg;C (+20)</option>
                                <option value="25">39.4 - 39.9 &deg;C (+25)</option>
                                <option value="30">&ge; 40.0 &deg;C (+30)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Disfungsi Sistem Saraf Pusat (SSP)</label>
                            <select id="bwps-cns" class="input-modern bwps-input">
                                <option value="0">Tidak Ada / Normal (0)</option>
                                <option value="10">Ringan: Agitasi (+10)</option>
                                <option value="20">Sedang: Delirium, Psikosis, Letargi Ekstrem (+20)</option>
                                <option value="30">Berat: Kejang atau Koma (+30)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Disfungsi Gastrointestinal / Hepatik</label>
                            <select id="bwps-gi" class="input-modern bwps-input">
                                <option value="0">Tidak Ada / Normal (0)</option>
                                <option value="10">Sedang: Diare, Mual/Muntah, Nyeri Perut (+10)</option>
                                <option value="20">Berat: Ikterus tanpa sebab jelas (+20)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Denyut Jantung / Takikardia (bpm)</label>
                            <select id="bwps-hr" class="input-modern bwps-input">
                                <option value="0">&lt; 90 bpm (0)</option>
                                <option value="5">90 - 109 bpm (+5)</option>
                                <option value="10">110 - 119 bpm (+10)</option>
                                <option value="15">120 - 129 bpm (+15)</option>
                                <option value="20">130 - 139 bpm (+20)</option>
                                <option value="25">&ge; 140 bpm (+25)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Gagal Jantung Kongestif (CHF)</label>
                            <select id="bwps-chf" class="input-modern bwps-input">
                                <option value="0">Tidak Ada (0)</option>
                                <option value="5">Ringan: Edema Perifer (+5)</option>
                                <option value="10">Sedang: Ronki Basal Bilateral (+10)</option>
                                <option value="15">Berat: Edema Paru Akut (+15)</option>
                            </select>
                        </div>
                        <div class="flex flex-col gap-3 justify-center bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" id="bwps-af" value="10" class="checkbox-modern bwps-input">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Fibrilasi Atrium (AF) (+10)</span>
                            </label>
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" id="bwps-precipitant" value="10" class="checkbox-modern bwps-input">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Faktor Presipitasi Akut (Infeksi/Trauma/Operasi) (+10)</span>
                            </label>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-emerald-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Sensitivitas mendekati 100% namun spesifisitas rendah pada sepsis berat. Skor &lt; 25 menyingkirkan badai tiroid; 25–44 impending crisis; &ge; 45 sangat sugestif badai tiroid.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-emerald-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step & Protokol Terapi</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Jika Skor &ge; 45, rawat ICU. Urutan terapi: 1) Beta-blocker (Propranolol) &rarr; 2) Tionamid (PTU dosis tinggi) &rarr; 3) Solusio Lugol (1 jam setelah PTU) &rarr; 4) Glukokortikoid IV (Hidrokortison).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 2: WAYNE'S INDEX ================= -->
            <section id="tab-wayne" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Hyperthyroid Index</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Wayne's Clinical Index</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Diagnosis klinis hipertiroidisme berdasarkan gejala subyektif dan tanda obyektif.</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-cyan-400 tracking-tight" id="res-wayne">0</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-cyan-400" id="res-wayne-interp">Euthyroid</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Symptoms (Left) -->
                        <div class="space-y-2.5 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                            <h3 class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-clipboard-user text-cyan-400"></i> Gejala Subyektif (Symptoms)
                            </h3>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Sesak saat aktivitas (Dyspnoea on exertion) (+1)</span>
                                <input type="checkbox" value="1" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Palpitasi / Jantung Berdebar (+2)</span>
                                <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Mudah lelah (Fatigue) (+2)</span>
                                <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Lebih menyukai hawa panas (-5)</span>
                                <input type="checkbox" value="-5" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Lebih menyukai hawa dingin (+5)</span>
                                <input type="checkbox" value="5" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Keringat berlebihan (Excessive sweating) (+3)</span>
                                <input type="checkbox" value="3" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Gelisah / Cemas (Nervousness) (+2)</span>
                                <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Nafsu makan meningkat (+3)</span>
                                <input type="checkbox" value="3" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Nafsu makan menurun (-3)</span>
                                <input type="checkbox" value="-3" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Berat badan naik (-3)</span>
                                <input type="checkbox" value="-3" class="checkbox-modern wayne-input">
                            </label>
                            <label class="flex items-center justify-between cursor-pointer group py-1">
                                <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Berat badan turun (+3)</span>
                                <input type="checkbox" value="3" class="checkbox-modern wayne-input">
                            </label>
                        </div>
                        
                        <!-- Signs (Right) -->
                        <div class="space-y-2.5 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50 flex flex-col">
                            <h3 class="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-stethoscope text-cyan-400"></i> Tanda Fisik (Signs)
                            </h3>
                            <div class="space-y-2 flex-1">
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Tiroid teraba membesar (+3)</span>
                                    <input type="checkbox" value="3" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Bruit pada tiroid (+2)</span>
                                    <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Eksoftalmus (+2)</span>
                                    <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Retraksi kelopak mata (+2)</span>
                                    <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Lid lag (+1)</span>
                                    <input type="checkbox" value="1" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Gerakan hiperkinetik (+4)</span>
                                    <input type="checkbox" value="4" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Fine finger tremor (+1)</span>
                                    <input type="checkbox" value="1" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Telapak tangan hangat (Hot hands) (+2)</span>
                                    <input type="checkbox" value="2" class="checkbox-modern wayne-input">
                                </label>
                                <label class="flex items-center justify-between cursor-pointer group py-1 border-b border-white/5">
                                    <span class="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors">Telapak tangan basah (Moist hands) (+1)</span>
                                    <input type="checkbox" value="1" class="checkbox-modern wayne-input">
                                </label>
                            </div>
                            
                            <div class="mt-3 pt-3 border-t border-slate-700/50">
                                <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Frekuensi Nadi / Irama Jantung</label>
                                <select id="wayne-pulse" class="input-modern wayne-input">
                                    <option value="0">Normal (80 - 90 bpm) (0)</option>
                                    <option value="-3">&lt; 80 bpm (-3)</option>
                                    <option value="3">&gt; 90 bpm (+3)</option>
                                    <option value="3">Fibrilasi Atrium (+3)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-cyan-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Interpretasi skor: <strong>&lt; 11: Eutiroid</strong>, <strong>11–19: Equivocal / Meragukan</strong>, <strong>&gt; 19: Toksik (Hipertiroidisme)</strong>. Sangat berguna di faskes primer sebelum hasil lab FT4/TSH keluar.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-cyan-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Konfirmasi dengan lab Free T4 dan TSHs. Berikan beta-blocker (Propranolol 10-40 mg TID) untuk kontrol simptom adrenergik segera.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 3: BILLEWICZ ================= -->
            <section id="tab-billewicz" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Hypothyroid Index</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Billewicz Diagnostic Score</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Indeks diagnostik klinis untuk mendeteksi hipotiroidisme primer.</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-indigo-400 tracking-tight" id="res-billewicz">-51</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-indigo-400" id="res-billewicz-interp">Euthyroid</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Keringat Berkurang</label>
                            <select class="input-modern billewicz-input">
                                <option value="-6">Tidak / Normal (-6)</option>
                                <option value="3">Ya, Berkurang (+3)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Kulit Kering (Dry Skin)</label>
                            <select class="input-modern billewicz-input">
                                <option value="-6">Tidak (-6)</option>
                                <option value="3">Ya (+3)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Intoleransi Dingin</label>
                            <select class="input-modern billewicz-input">
                                <option value="-5">Tidak (-5)</option>
                                <option value="4">Ya (+4)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Kenaikan Berat Badan</label>
                            <select class="input-modern billewicz-input">
                                <option value="-1">Tidak (-1)</option>
                                <option value="1">Ya (+1)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Konstipasi</label>
                            <select class="input-modern billewicz-input">
                                <option value="-1">Tidak (-1)</option>
                                <option value="2">Ya (+2)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Suara Parau (Hoarseness)</label>
                            <select class="input-modern billewicz-input">
                                <option value="-6">Tidak (-6)</option>
                                <option value="5">Ya (+5)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Parestesia / Kesemutan</label>
                            <select class="input-modern billewicz-input">
                                <option value="-4">Tidak (-4)</option>
                                <option value="5">Ya (+5)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Gangguan Pendengaran</label>
                            <select class="input-modern billewicz-input">
                                <option value="0">Tidak (0)</option>
                                <option value="2">Ya (+2)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Gerakan Lambat (Slow Movements)</label>
                            <select class="input-modern billewicz-input">
                                <option value="-3">Tidak (-3)</option>
                                <option value="11">Ya (+11)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Delayed Ankle Jerk (Woltman Sign)</label>
                            <select class="input-modern billewicz-input">
                                <option value="-6">Normal (-6)</option>
                                <option value="15">Melambat / Delayed (+15)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Kulit Kasar (Coarse Skin)</label>
                            <select class="input-modern billewicz-input">
                                <option value="-7">Tidak (-7)</option>
                                <option value="7">Ya (+7)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Kulit Dingin (Cold Skin)</label>
                            <select class="input-modern billewicz-input">
                                <option value="-2">Tidak (-2)</option>
                                <option value="3">Ya (+3)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Periorbital Puffiness / Bengkak</label>
                            <select class="input-modern billewicz-input">
                                <option value="-4">Tidak (-4)</option>
                                <option value="4">Ya (+4)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Frekuensi Nadi (Pulse)</label>
                            <select class="input-modern billewicz-input">
                                <option value="0">75 - 85 bpm (0)</option>
                                <option value="4">&lt; 75 bpm (+4)</option>
                                <option value="-4">&gt; 85 bpm (-4)</option>
                            </select>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-indigo-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Delayed ankle jerk (fase relaksasi refleks tendo Achilles melambat / Woltman's sign) bernilai +15 dan sangat spesifik. Skor <strong>&ge; +25: Hipotiroid</strong>; <strong>-29 s/d +24: Equivocal</strong>; <strong>&le; -30: Eutiroid</strong>.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-indigo-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Periksa TSH dan FT4. Mulai substitusi Levothyroxine dosis rendah (12.5–25 mcg/hari) terutama pada geriatri atau riwayat PJK untuk mencegah presipitasi iskemia miokard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 4: OSMOLARITAS SERUM ================= -->
            <section id="tab-osmo" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">HHS vs DKA CDSS</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Effective Serum Osmolarity</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Osmolaritas efektif (tonisitas) untuk diagnosis krisis hiperglikemia (HHS / KDA).</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-amber-400 tracking-tight" id="res-osmo">-</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-slate-400" id="res-osmo-unit">mOsm/kg</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Natrium Serum (Na) [mEq/L]</label>
                            <input type="number" id="osmo-na" class="input-modern" placeholder="e.g. 140" value="140" oninput="calcOsmo()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Glukosa Darah Sewaktu [mg/dL]</label>
                            <input type="number" id="osmo-glu" class="input-modern" placeholder="e.g. 600" value="600" oninput="calcOsmo()">
                        </div>
                    </div>

                    <div class="metric-grid">
                        <div class="metric-item">
                            <span class="metric-label">Formula Tonisitas Efektif</span>
                            <div class="text-xs text-slate-300 font-mono mt-1">2 &times; Na + (Glukosa / 18)</div>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Batas Kritis HHS</span>
                            <div class="text-sm font-bold text-rose-400 mt-1">&gt; 320 mOsm/kg</div>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Tingkat penurunan kesadaran pada krisis hiperglikemia berkorelasi langsung dengan osmolaritas efektif (&gt; 320 mOsm/kg umumnya menyebabkan stupor/koma), bukan semata-mata kadar gula darah absolut. Urea (BUN) diabaikan karena bebas menembus membran sel tanpa gradien osmotik.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Resusitasi cairan kristaloid isotonik agresif (0.9% NaCl 1000 mL/jam pada jam pertama) adalah langkah utama sebelum insulin dimulai pada HHS untuk mencegah kolaps vaskular akut.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 5: ANION GAP & CORR NA ================= -->
            <section id="tab-ag" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Acid-Base & Electrolyte</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Serum Anion Gap & Corrected Sodium</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Evaluasi metabolik asidosis DKA dan koreksi natrium pada hiperglikemia (Katz formula).</p>
                        </div>
                        <div class="flex items-center gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-right">
                                <span class="text-[11px] text-slate-400 font-semibold block uppercase">Anion Gap</span>
                                <span class="text-3xl font-extrabold text-emerald-400 tracking-tight" id="res-ag">16.0</span>
                            </div>
                            <div class="h-8 w-px bg-white/10"></div>
                            <div class="text-right">
                                <span class="text-[11px] text-slate-400 font-semibold block uppercase">Corrected Na</span>
                                <span class="text-3xl font-extrabold text-cyan-400 tracking-tight" id="res-cna">142.4</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Na [mEq/L]</label>
                            <input type="number" id="ag-na" class="input-modern" placeholder="140" value="140" oninput="calcAG()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Cl [mEq/L]</label>
                            <input type="number" id="ag-cl" class="input-modern" placeholder="100" value="100" oninput="calcAG()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">HCO3 [mEq/L]</label>
                            <input type="number" id="ag-hco3" class="input-modern" placeholder="24" value="24" oninput="calcAG()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Glukosa [mg/dL]</label>
                            <input type="number" id="ag-glu" class="input-modern" placeholder="250" value="250" oninput="calcAG()">
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-emerald-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Pseudohiponatremia timbul akibat pergeseran osmotik air dari intraseluler ke ekstraseluler. Koreksi Na dihitung dengan penambahan 1.6 mEq/L per kenaikan 100 mg/dL glukosa di atas 100.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-emerald-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Jika corrected Na normal atau tinggi, ganti cairan infus dari 0.9% NaCl ke 0.45% NaCl untuk mencegah hiperkloremik asidosis metabolik. Tambahkan Dextrose 5% saat glukosa turun &lt; 200 mg/dL.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 6: BASAL-BOLUS TDD ================= -->
            <section id="tab-tdd" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Insulin Initiation</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Insulin Basal-Bolus TDD Regimen</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Estimasi Total Daily Dose (TDD) dan proporsi basal fisiologis vs bolus prandial.</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-rose-400 tracking-tight" id="res-tdd">35</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-slate-400">Total Units / 24h</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Berat Badan Pasien (kg)</label>
                                <input type="number" id="ins-wt" class="input-modern" placeholder="e.g. 70" value="70" oninput="calcInsulin()">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Faktor Dosis TDD (Unit/kg/hari)</label>
                                <select id="ins-factor" class="input-modern" onchange="calcInsulin()">
                                    <option value="0.3">0.3 U/kg (Sensitif / Geriatri / CKD / Dialisis)</option>
                                    <option value="0.4">0.4 U/kg (Sensitivitas Sedang)</option>
                                    <option value="0.5" selected>0.5 U/kg (Standard Rekomendasi)</option>
                                    <option value="0.6">0.6 U/kg (Resistensi Insulin / Obesitas / Terapi Steroid)</option>
                                </select>
                            </div>
                        </div>

                        <div class="bg-slate-900/40 p-5 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                            <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                                <div>
                                    <span class="text-sm font-semibold text-white block">Insulin Basal (50%)</span>
                                    <span class="text-xs text-slate-400">Glargine / Detemir / Degludec 1x/hari malam</span>
                                </div>
                                <span class="font-extrabold text-2xl text-rose-300 tracking-tight" id="res-basal">18 <span class="text-xs font-normal text-slate-400 ml-1">U Qd</span></span>
                            </div>
                            <div class="flex justify-between items-center">
                                <div>
                                    <span class="text-sm font-semibold text-white block">Insulin Prandial (50% / 3)</span>
                                    <span class="text-xs text-slate-400">Aspart / Lispro / Glulisine tiap sebelum makan</span>
                                </div>
                                <span class="font-extrabold text-2xl text-rose-300 tracking-tight" id="res-bolus">6 <span class="text-xs font-normal text-slate-400 ml-1">U TID</span></span>
                            </div>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-rose-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Penggunaan <em>sliding scale insulin</em> saja tidak dianjurkan karena menyebabkan variabilitas glikemik tajam dan hipoglikemia reaktif. Regimen basal-bolus fisiologis meniru pelepasan insulin endogen.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-rose-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Titrasi & NPO</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Titrasi basal berdasarkan glukosa puasa pagi; titrasi bolus berdasarkan pre-prandial. Jika pasien dipuasakan (NPO), hentikan bolus makanan tetapi pertahankan dosis basal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 7: TYG INDEX ================= -->
            <section id="tab-tyg" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Cardiometabolic Risk</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Triglyceride-Glucose (TyG) Index</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Surrogate marker terpercaya untuk resistensi insulin dan perlemakan hati metabolik (MASLD).</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-fuchsia-400 tracking-tight" id="res-tyg">8.92</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-slate-400">Score &gt; 4.49 Elevated</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Trigliserida Puasa [mg/dL]</label>
                            <input type="number" id="tyg-tg" class="input-modern" placeholder="e.g. 150" value="150" oninput="calcMetabolic()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Glukosa Darah Puasa [mg/dL]</label>
                            <input type="number" id="tyg-glu" class="input-modern" placeholder="e.g. 100" value="100" oninput="calcMetabolic()">
                        </div>
                    </div>

                    <div class="metric-grid">
                        <div class="metric-item">
                            <span class="metric-label">Formula Perhitungan</span>
                            <div class="text-xs text-slate-300 font-mono mt-1">ln [ (TG &times; Glukosa) / 2 ]</div>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Batas Cutoff Resistensi</span>
                            <div class="text-sm font-bold text-fuchsia-400 mt-1">&ge; 4.49 (atau &ge; 8.5 tergantung log-base)</div>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-fuchsia-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Indeks TyG sangat efisien dalam praktik klinis karena hanya memerlukan profil lipid rutin dan gula darah puasa tanpa pemeriksaan insulin puasa yang mahal. Berkorelasi kuat dengan steatosis hepar (MASLD) dan risiko aterosklerosis subklinis.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-fuchsia-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Rekomendasi Klinis</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Intervensi gaya hidup intensif (diet Mediterania, penurunan berat badan 5-10%), serta pertimbangkan terapi farmakologis sensitizer insulin dini (Metformin, GLP-1 RA, SGLT2i).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 8: HOMA-IR ================= -->
            <section id="tab-homa" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-violet-500/15 border border-violet-500/30 text-violet-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Endocrine Model</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">HOMA-IR Assessment</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Homeostatic Model Assessment of Insulin Resistance.</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-violet-400 tracking-tight" id="res-homa">3.70</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-slate-400">&gt; 2.5 Insulin Resistant</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Insulin Puasa (Fasting Insulin) [mU/L]</label>
                            <input type="number" id="homa-ins" class="input-modern" placeholder="e.g. 15" value="15" oninput="calcMetabolic()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Glukosa Darah Puasa [mg/dL]</label>
                            <input type="number" id="homa-glu" class="input-modern" placeholder="e.g. 100" value="100" oninput="calcMetabolic()">
                        </div>
                    </div>

                    <div class="metric-grid">
                        <div class="metric-item">
                            <span class="metric-label">Formula Matthews</span>
                            <div class="text-xs text-slate-300 font-mono mt-1">(Insulin &times; Glukosa) / 405</div>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Ambang Resistensi</span>
                            <div class="text-sm font-bold text-violet-400 mt-1">&gt; 2.0 - 2.5</div>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-violet-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Nilai normal HOMA-IR umumnya &lt; 2.0. Nilai &gt; 2.5 mengindikasikan resistensi insulin bermakna, sering digunakan dalam evaluasi sindrom ovarium polikistik (PCOS) dan prediabetes.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-violet-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Targetkan penurunan berat badan 5-10%, evaluasi ada tidaknya sindrom metabolik konkomitan, dan pertimbangkan terapi farmakologis sensitizer insulin.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 9: FRIEDEWALD LDL ================= -->
            <section id="tab-friedewald" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4 border-b border-slate-700/40 pb-5">
                        <div>
                            <span class="text-[10px] bg-sky-500/15 border border-sky-500/30 text-sky-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">Lipidology</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Friedewald Equation (Estimated LDL-C)</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Estimasi kolesterol LDL berdasarkan Kolesterol Total, HDL, dan Trigliserida.</p>
                        </div>
                        <div class="sm:text-right flex items-center sm:block gap-4 bg-slate-900/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
                            <div class="text-4xl font-extrabold text-sky-400 tracking-tight" id="res-ldl">125.0</div>
                            <div class="text-xs uppercase tracking-wider font-bold mt-1 text-slate-400">mg/dL</div>
                        </div>
                    </div>

                    <div id="ldl-warning" class="hidden mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-medium flex items-center shadow-lg">
                        <i class="fa-solid fa-triangle-exclamation text-lg mr-3 shrink-0 text-rose-400"></i> 
                        <span><strong>PERINGATAN VALIDITAS:</strong> Rumus Friedewald tidak valid untuk Trigliserida &gt; 400 mg/dL karena estimasi VLDL (TG/5) tidak lagi akurat. Gunakan pemeriksaan Direct LDL atau Non-HDL.</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Kolesterol Total [mg/dL]</label>
                            <input type="number" id="lip-tc" class="input-modern" placeholder="e.g. 200" value="200" oninput="calcMetabolic()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">HDL [mg/dL]</label>
                            <input type="number" id="lip-hdl" class="input-modern" placeholder="e.g. 45" value="45" oninput="calcMetabolic()">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Trigliserida [mg/dL]</label>
                            <input type="number" id="lip-tg" class="input-modern" placeholder="e.g. 150" value="150" oninput="calcMetabolic()">
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-sky-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Clinical Pearl</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Rumus Friedewald cenderung meremehkan (underestimate) kadar LDL-C pada kadar trigliserida &gt; 200 mg/dL dan sepenuhnya tidak valid jika TG &gt; 400 mg/dL.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-sky-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Next Step</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Bila TG &gt; 400 mg/dL, gunakan target Non-HDL (Total Kolesterol &minus; HDL) atau periksa Direct LDL-C assay. Jika TG &gt; 500 mg/dL, prioritaskan fibrat segera untuk mencegah pankreatitis akut.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ================= TOOL 10: BRIDGING INSULIN ================= -->
            <section id="tab-bridging" class="module-section hidden">
                <button type="button" onclick="navigateTo('home-module', 'Home Dashboard', 'pill-dash')" class="btn-back">
                    <i class="fa-solid fa-arrow-left"></i> Kembali ke Dashboard
                </button>
                <div class="glass-card">
                    <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/40">
                        <div>
                            <span class="text-[10px] bg-orange-500/15 border border-orange-500/30 text-orange-300 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-2">IV to SC Transition</span>
                            <h2 class="text-xl sm:text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">Bridging Insulin: Transisi Drip IV ke Subkutan</h2>
                            <p class="text-xs sm:text-sm text-slate-400 mt-1">Konversi titrasi drip insulin reguler IV 24 jam ke regimen basal-bolus subkutan.</p>
                        </div>
                        <div class="flex items-center gap-2.5">
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
                            <button type="button" onclick="resetInsulinInputs()" class="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                                <i class="fa-solid fa-rotate-left mr-1"></i> Reset
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <!-- Table 24h -->
                        <div class="lg:col-span-6 flex flex-col">
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="text-xs font-bold text-white uppercase tracking-wider">Input Drip Insulin 24 Jam</h3>
                                <span class="text-xs text-slate-400 font-mono">Satuan: Unit</span>
                            </div>
                            <div class="rounded-xl border border-slate-700/60 overflow-hidden bg-slate-950/60 shadow-inner">
                                <div class="max-h-[380px] overflow-y-auto">
                                    <table class="w-full text-xs sm:text-sm text-left border-collapse">
                                        <thead class="text-[11px] uppercase bg-slate-900 text-slate-300 sticky top-0 z-10 border-b border-slate-800">
                                            <tr>
                                                <th class="px-4 py-2.5 w-28 text-center font-bold tracking-wider border-r border-slate-800">Jam</th>
                                                <th class="px-4 py-2.5 font-bold tracking-wider">Drip Insulin (Unit)</th>
                                            </tr>
                                        </thead>
                                        <tbody id="insulin-table-body" class="divide-y divide-slate-800/60">
                                            <!-- Dynamically injected rows -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Quick Fill -->
                            <div class="p-3 bg-slate-900/40 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs mt-3">
                                <span class="text-slate-400">Preset rata-rata:</span>
                                <div class="flex gap-2">
                                    <button type="button" onclick="quickFillInsulin(1)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">1 U/jam</button>
                                    <button type="button" onclick="quickFillInsulin(2)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">2 U/jam</button>
                                    <button type="button" onclick="quickFillInsulin(3)" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">3 U/jam</button>
                                </div>
                            </div>
                        </div>

                        <!-- Result Summary -->
                        <div class="lg:col-span-6 flex flex-col justify-between space-y-4">
                            <div class="bg-slate-900/60 rounded-xl p-5 border border-slate-700/50 space-y-4">
                                <h3 class="text-sm font-bold text-white border-b border-slate-700/40 pb-2.5 flex items-center gap-2">
                                    <i class="fa-solid fa-calculator text-orange-400"></i> Ringkasan Dosis Subkutan
                                </h3>

                                <div class="space-y-2.5 font-mono text-xs sm:text-sm">
                                    <div class="flex justify-between items-center py-1">
                                        <span class="text-slate-300">Total Drip 24 Jam</span>
                                        <span class="text-base sm:text-lg font-bold text-white">: <span id="ins-total">0</span> U</span>
                                    </div>
                                    <div class="flex justify-between items-center py-1 border-t border-slate-800">
                                        <span class="text-slate-300">Total Basal-Bolus (80%)</span>
                                        <span class="text-base sm:text-lg font-bold text-orange-400">: <span id="ins-bb-80">0</span> U</span>
                                    </div>
                                    <div class="flex justify-between items-center py-1 border-t border-slate-800">
                                        <span class="text-slate-300">Insulin Basal (50%)</span>
                                        <span class="text-base sm:text-lg font-bold text-emerald-400">: <span id="ins-basal-50">0</span> U</span>
                                    </div>
                                    <div class="flex justify-between items-center py-1 border-t border-slate-800">
                                        <span class="text-slate-300">Insulin Prandial (per x3)</span>
                                        <span class="text-base sm:text-lg font-bold text-cyan-400">: <span id="ins-prandial-3">0</span> U</span>
                                    </div>
                                </div>

                                <div class="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed italic">
                                    Protokol: 80% dosis drip 24 jam sebagai TDD basal-bolus subkutan; 50% sebagai basal (1x/hari), 50% sisanya dibagi rata 3x prandial sebelum makan.
                                </div>
                                <div class="text-xs font-semibold text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                                    <i class="fa-solid fa-triangle-exclamation mr-1"></i> <strong>PANDUAN OVERLAP MUTLAK:</strong> Berikan insulin basal subkutan pertama 1–2 jam SEBELUM drip insulin IV distop total untuk mencegah rebound ketoasidosis!
                                </div>
                            </div>

                            <!-- CPPT Box -->
                            <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
                                <div class="flex justify-between items-center mb-2">
                                    <h4 class="font-semibold text-orange-400 text-xs sm:text-sm flex items-center gap-2">
                                        <i class="fa-solid fa-clipboard-list"></i> Salin Resume Klinis CPPT
                                    </h4>
                                    <button type="button" onclick="copyCPPT('ins-cppt', this)" class="bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs py-1.5 px-3 rounded-lg border border-emerald-500/40 transition-colors flex items-center gap-1.5">
                                        <i class="fa-solid fa-copy"></i>
                                        <span>Salin CPPT</span>
                                    </button>
                                </div>
                                <pre id="ins-cppt" class="text-xs text-slate-300 whitespace-pre font-mono bg-slate-950 p-3.5 rounded-xl border border-slate-800 overflow-x-auto max-h-48"></pre>
                            </div>
                        </div>
                    </div>

                    <div class="pearl-box">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <span class="flex items-center text-xs font-bold text-orange-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-microscope mr-2 text-sm"></i> Kriteria Resolusi DKA/HHS</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Transisi ke subkutan dilakukan hanya jika krisis hiperglikemia telah teresolusi (pH &gt; 7.30, HCO3 &gt; 18 mEq/L, Anion Gap normal &le; 12) dan pasien mampu mentoleransi asupan oral.</p>
                            </div>
                            <div>
                                <span class="flex items-center text-xs font-bold text-orange-400 mb-1.5 uppercase tracking-wider"><i class="fa-solid fa-forward-step mr-2 text-sm"></i> Monitoring Lanjutan</span>
                                <p class="text-xs sm:text-[13px] text-slate-300 leading-relaxed">Periksa gula darah kapiler sebelum makan dan sebelum tidur (4x/hari). Siapkan insulin koreksi bolus tambahan sesuai skala koreksional bila terjadi hiperglikemia pasca makan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>

    <!-- SCRIPT ENGINE -->
    <script>
    // ==========================================
    // GLOBAL TOOL REGISTRY & SEARCH ENGINE
    // ==========================================
    const CALCULATORS_DB = [
      { id: 'tab-bwps', name: 'Burch-Wartofsky Scale (BWPS)', category: 'Tiroid & Krisis', color: 'rose', pillId: 'pill-bwps', desc: 'Skor diagnostik badai tiroid (thyroid storm) berdasarkan kriteria suhu, SSP, GI, takikardia, gagal jantung, dan AF.', keywords: ['bwps', 'burch-wartofsky', 'badai tiroid', 'thyroid storm', 'tirotoksikosis', 'krisis tiroid', 'ptu'] },
      { id: 'tab-wayne', name: 'Wayne Clinical Index', category: 'Tiroid & Krisis', color: 'cyan', pillId: 'pill-wayne', desc: 'Evaluasi klinis hipertiroidisme berdasarkan anamnesis gejala dan pemeriksaan tanda fisik tanpa lab.', keywords: ['wayne', 'hipertiroid', 'eutiroid', 'toksik', 'tremor', 'tiroid', 'palpitasi'] },
      { id: 'tab-billewicz', name: 'Billewicz Diagnostic Score', category: 'Tiroid & Krisis', color: 'indigo', pillId: 'pill-billewicz', desc: 'Skor diagnostik hipotiroidisme klinis berdasarkan gejala konstitusional dan refleks tendo Achilles (Woltman).', keywords: ['billewicz', 'hipotiroid', 'woltman', 'ankle jerk', 'levothyroxine', 'keringat berkurang'] },
      { id: 'tab-osmo', name: 'Effective Serum Osmolarity', category: 'Emergensi Metabolik', color: 'amber', pillId: 'pill-osmo', desc: 'Osmolaritas efektif (tonisitas) untuk stratifikasi krisis hiperglikemia HHS vs DKA dan korelasi kesadaran.', keywords: ['osmolaritas', 'osmo', 'hhs', 'dka', 'hiperglikemia', 'koma', 'tonisitas'] },
      { id: 'tab-ag', name: 'Anion Gap & Corrected Sodium', category: 'Emergensi Metabolik', color: 'emerald', pillId: 'pill-ag', desc: 'Evaluasi asidosis metabolik anion gap (AGMA) dan koreksi pseudohiponatremia hiperglikemik akut.', keywords: ['anion gap', 'corrected na', 'pseudohiponatremia', 'cna', 'katz', 'dka', 'asidosis'] },
      { id: 'tab-tdd', name: 'Insulin Basal-Bolus TDD', category: 'Emergensi Metabolik', color: 'rose', pillId: 'pill-tdd', desc: 'Distribusi total daily dose (TDD) fisiologis: 50% basal (1x/hari) dan 50% bolus prandial terbagi 3 makan.', keywords: ['tdd', 'insulin', 'basal bolus', 'dosis harian', 'glargine', 'aspart', 'sliding scale'] },
      { id: 'tab-tyg', name: 'Triglyceride-Glucose (TyG) Index', category: 'Kardiometabolik & Lipid', color: 'fuchsia', pillId: 'pill-tyg', desc: 'Surrogate marker resistensi insulin dan perlemakan hati metabolik (MASLD) dari trigliserida dan glukosa.', keywords: ['tyg', 'triglyceride glucose', 'resistensi insulin', 'masld', 'nafld', 'kardiometabolik'] },
      { id: 'tab-homa', name: 'HOMA-IR Assessment', category: 'Kardiometabolik & Lipid', color: 'violet', pillId: 'pill-homa', desc: 'Penentuan kuantitatif resistensi insulin dari kadar insulin puasa dan glukosa puasa (Matthews formula).', keywords: ['homa-ir', 'homa', 'insulin puasa', 'fasting insulin', 'pcos', 'prediabetes'] },
      { id: 'tab-friedewald', name: 'Friedewald Estimated LDL-C', category: 'Kardiometabolik & Lipid', color: 'sky', pillId: 'pill-friedewald', desc: 'Estimasi kadar kolesterol LDL dari profil lipid standar dengan guardrail batas aman TG > 400 mg/dL.', keywords: ['friedewald', 'ldl', 'kolesterol', 'profil lipid', 'trigliserida', 'non-hdl'] },
      { id: 'tab-bridging', name: 'Bridging Insulin IV ke Subkutan', category: 'Protokol Khusus', color: 'orange', pillId: 'pill-bridging', desc: 'Titrasi drip insulin 24 jam ke regimen subkutan basal-bolus 80% dengan instruksi overlap aman.', keywords: ['bridging', 'bridging insulin', 'drip insulin', 'transisi subkutan', 'kda', 'hhs', 'overlap'] }
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
                    <button type="button" onclick="selectSearchResult('\${tool.id}', '\${tool.name.replace(/'/g, "\\\\'")}', '\${tool.pillId}')" class="w-full p-2.5 rounded-lg bg-slate-800/60 hover:bg-emerald-500/20 border border-slate-700/50 hover:border-emerald-500/50 text-left transition-all group flex items-start space-x-3">
                        <div class="h-7 w-7 rounded-md bg-\${tool.color}-500/20 text-\${tool.color}-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                            <i class="fa-solid fa-calculator"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2">
                                <span class="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">\${tool.name}</span>
                                <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-medium shrink-0">\${tool.category}</span>
                            </div>
                            <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">\${tool.desc}</p>
                        </div>
                        <i class="fa-solid fa-arrow-right text-xs text-slate-500 group-hover:text-emerald-400 mt-1 shrink-0"></i>
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
            if (!document.getElementById('header-search-container').contains(e.target)) {
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

    // Helper for Real-time listeners
    function addRealTimeListeners(selector, callback) {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('input', callback);
        if(el.tagName === 'SELECT') {
            el.addEventListener('change', callback);
        }
      });
    }

    // ==========================================
    // 1. BURCH-WARTOFSKY POINT SCALE (BWPS)
    // ==========================================
    function calcBWPS() {
      let score = 0;
      score += parseInt(document.getElementById('bwps-temp')?.value) || 0;
      score += parseInt(document.getElementById('bwps-cns')?.value) || 0;
      score += parseInt(document.getElementById('bwps-gi')?.value) || 0;
      score += parseInt(document.getElementById('bwps-hr')?.value) || 0;
      score += parseInt(document.getElementById('bwps-chf')?.value) || 0;
      if (document.getElementById('bwps-af')?.checked) score += parseInt(document.getElementById('bwps-af').value);
      if (document.getElementById('bwps-precipitant')?.checked) score += parseInt(document.getElementById('bwps-precipitant').value);

      const resEl = document.getElementById('res-bwps');
      const interpEl = document.getElementById('res-bwps-interp');
      if (!resEl || !interpEl) return;
      
      resEl.textContent = score;

      if (score >= 45) {
        interpEl.textContent = "Highly suggestive of Thyroid Storm";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-rose-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-rose-400 tracking-tight";
      } else if (score >= 25) {
        interpEl.textContent = "Impending Thyroid Storm";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-amber-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-amber-400 tracking-tight";
      } else {
        interpEl.textContent = "Thyroid Storm Unlikely";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-emerald-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-emerald-400 tracking-tight";
      }
    }
    addRealTimeListeners('.bwps-input', calcBWPS);

    // ==========================================
    // 2. WAYNE'S CLINICAL INDEX
    // ==========================================
    function calcWayne() {
      let score = 0;
      document.querySelectorAll('.wayne-input[type="checkbox"]:checked').forEach(cb => {
        score += parseInt(cb.value) || 0;
      });
      score += parseInt(document.getElementById('wayne-pulse')?.value) || 0;

      const resEl = document.getElementById('res-wayne');
      const interpEl = document.getElementById('res-wayne-interp');
      if (!resEl || !interpEl) return;
      
      resEl.textContent = score;

      if (score > 19) {
        interpEl.textContent = "Toxic (Hyperthyroidism)";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-rose-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-rose-400 tracking-tight";
      } else if (score >= 11) {
        interpEl.textContent = "Equivocal (Meragukan)";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-amber-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-amber-400 tracking-tight";
      } else {
        interpEl.textContent = "Euthyroid";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-cyan-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-cyan-400 tracking-tight";
      }
    }
    addRealTimeListeners('.wayne-input', calcWayne);

    // ==========================================
    // 3. BILLEWICZ SCORE
    // ==========================================
    function calcBillewicz() {
      let score = 0;
      document.querySelectorAll('.billewicz-input').forEach(sel => {
        score += parseInt(sel.value) || 0;
      });

      const resEl = document.getElementById('res-billewicz');
      const interpEl = document.getElementById('res-billewicz-interp');
      if (!resEl || !interpEl) return;
      
      resEl.textContent = (score > 0 ? '+' : '') + score;

      if (score >= 25) {
        interpEl.textContent = "Hypothyroid";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-rose-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-rose-400 tracking-tight";
      } else if (score > -30) {
        interpEl.textContent = "Equivocal (Meragukan)";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-amber-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-amber-400 tracking-tight";
      } else {
        interpEl.textContent = "Euthyroid";
        interpEl.className = "text-xs uppercase tracking-wider mt-1 text-indigo-400 font-bold";
        resEl.className = "text-4xl font-extrabold text-indigo-400 tracking-tight";
      }
    }
    addRealTimeListeners('.billewicz-input', calcBillewicz);

    // ==========================================
    // 4. OSMOLARITAS SERUM EFEKTIF
    // ==========================================
    function calcOsmo() {
      const na = parseFloat(document.getElementById('osmo-na')?.value);
      const glu = parseFloat(document.getElementById('osmo-glu')?.value);
      const resEl = document.getElementById('res-osmo');
      if (!resEl) return;

      if (!isNaN(na) && !isNaN(glu)) {
        const osmo = (2 * na) + (glu / 18);
        resEl.textContent = osmo.toFixed(1);
        if(osmo >= 320) {
          resEl.className = "text-4xl font-extrabold text-rose-500 tracking-tight";
        } else {
          resEl.className = "text-4xl font-extrabold text-amber-400 tracking-tight";
        }
      } else {
        resEl.textContent = "-";
        resEl.className = "text-4xl font-extrabold text-amber-400 tracking-tight";
      }
    }

    // ==========================================
    // 5. ANION GAP & CORRECTED SODIUM
    // ==========================================
    function calcAG() {
      const na = parseFloat(document.getElementById('ag-na')?.value);
      const cl = parseFloat(document.getElementById('ag-cl')?.value);
      const hco3 = parseFloat(document.getElementById('ag-hco3')?.value);
      const glu = parseFloat(document.getElementById('ag-glu')?.value);

      const agEl = document.getElementById('res-ag');
      const cnaEl = document.getElementById('res-cna');

      if (!isNaN(na) && !isNaN(cl) && !isNaN(hco3) && agEl) {
        const ag = na - (cl + hco3);
        agEl.textContent = ag.toFixed(1);
        agEl.style.color = ag > 12 ? '#EF4444' : '#10B981';
      } else if (agEl) {
        agEl.textContent = "-";
      }

      if (!isNaN(na) && !isNaN(glu) && glu > 100 && cnaEl) {
        const cNa = na + 1.6 * ((glu - 100) / 100);
        cnaEl.textContent = cNa.toFixed(1);
      } else if (!isNaN(na) && cnaEl) {
        cnaEl.textContent = na.toFixed(1);
      } else if (cnaEl) {
        cnaEl.textContent = "-";
      }
    }

    // ==========================================
    // 6. INSULIN BASAL-BOLUS TDD
    // ==========================================
    function calcInsulin() {
      const wt = parseFloat(document.getElementById('ins-wt')?.value);
      const factor = parseFloat(document.getElementById('ins-factor')?.value);

      if (!isNaN(wt) && !isNaN(factor)) {
        const tdd = wt * factor;
        const basal = tdd * 0.5;
        const bolus = (tdd * 0.5) / 3;

        document.getElementById('res-tdd').textContent = Math.round(tdd);
        document.getElementById('res-basal').innerHTML = Math.round(basal) + ' <span class="text-xs font-normal text-slate-400 ml-1">U Qd</span>';
        document.getElementById('res-bolus').innerHTML = Math.round(bolus) + ' <span class="text-xs font-normal text-slate-400 ml-1">U TID</span>';
      } else {
        document.getElementById('res-tdd').textContent = "-";
        document.getElementById('res-basal').innerHTML = '- <span class="text-xs font-normal text-slate-400 ml-1">U Qd</span>';
        document.getElementById('res-bolus').innerHTML = '- <span class="text-xs font-normal text-slate-400 ml-1">U TID</span>';
      }
    }

    // ==========================================
    // 7, 8, 9. METABOLIC: TYG, HOMA-IR, FRIEDEWALD
    // ==========================================
    function calcMetabolic() {
      // TyG
      const tgTyg = parseFloat(document.getElementById('tyg-tg')?.value);
      const gluTyg = parseFloat(document.getElementById('tyg-glu')?.value);
      const tygEl = document.getElementById('res-tyg');
      if (tygEl) {
        if (!isNaN(tgTyg) && !isNaN(gluTyg) && tgTyg > 0 && gluTyg > 0) {
          const tyg = Math.log((tgTyg * gluTyg) / 2);
          tygEl.textContent = tyg.toFixed(2);
        } else {
          tygEl.textContent = "-";
        }
      }

      // HOMA-IR
      const insHoma = parseFloat(document.getElementById('homa-ins')?.value);
      const gluHoma = parseFloat(document.getElementById('homa-glu')?.value);
      const homaEl = document.getElementById('res-homa');
      if (homaEl) {
        if (!isNaN(insHoma) && !isNaN(gluHoma) && insHoma > 0 && gluHoma > 0) {
          const homa = (insHoma * gluHoma) / 405;
          homaEl.textContent = homa.toFixed(2);
        } else {
          homaEl.textContent = "-";
        }
      }

      // Friedewald
      const tc = parseFloat(document.getElementById('lip-tc')?.value);
      const hdl = parseFloat(document.getElementById('lip-hdl')?.value);
      const tgLip = parseFloat(document.getElementById('lip-tg')?.value);
      
      const resLdl = document.getElementById('res-ldl');
      const ldlWarn = document.getElementById('ldl-warning');

      if (!isNaN(tc) && !isNaN(hdl) && !isNaN(tgLip) && resLdl) {
        if (tgLip > 400) {
          resLdl.textContent = "N/A";
          resLdl.className = "text-4xl font-extrabold text-slate-500 tracking-tight";
          if (ldlWarn) ldlWarn.classList.remove('hidden');
        } else {
          const ldl = tc - hdl - (tgLip / 5);
          resLdl.textContent = ldl.toFixed(1);
          resLdl.className = "text-4xl font-extrabold text-sky-400 tracking-tight";
          if (ldlWarn) ldlWarn.classList.add('hidden');
        }
      } else if (resLdl) {
        resLdl.textContent = "-";
        resLdl.className = "text-4xl font-extrabold text-sky-400 tracking-tight";
        if (ldlWarn) ldlWarn.classList.add('hidden');
      }
    }

    // ==========================================
    // 10. BRIDGING INSULIN TRANSITION
    // ==========================================
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
        let hourStr = h.toString().padStart(2, '0') + ':00';
        let val = currentVals[i] !== undefined ? currentVals[i] : '2';
        
        html += \`
          <tr class="hover:bg-slate-900/60 transition-colors">
            <td class="px-4 py-2 font-mono text-slate-300 text-center bg-slate-950/40 border-r border-slate-800">\${hourStr}</td>
            <td class="px-3 py-1.5">
              <input type="number" class="ins-hourly-input input-modern !py-1 text-center font-mono" value="\${val}" min="0" step="0.5">
            </td>
          </tr>
        \`;
      }
      tbody.innerHTML = html;

      tbody.querySelectorAll('.ins-hourly-input').forEach(inp => {
        inp.addEventListener('input', calcBridgingInsulin);
      });

      calcBridgingInsulin();
    }

    function resetInsulinInputs() {
      document.querySelectorAll('.ins-hourly-input').forEach(input => {
        input.value = "0";
      });
      calcBridgingInsulin();
    }

    function quickFillInsulin(val) {
      document.querySelectorAll('.ins-hourly-input').forEach(input => {
        input.value = val;
      });
      calcBridgingInsulin();
    }

    function calcBridgingInsulin() {
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

      let cppt = \`[adjustrEMD CDSS] BRIDGING INSULIN (TRANSISI KE SUBKUTAN)\\n\`;
      cppt += \`Total Drip 24 Jam       : \${fmtIndo(total, 1)} Unit\\n\`;
      cppt += \`Total Basal-Bolus (80%) : \${fmtIndo(totalBB, 1)} Unit/hari\\n\`;
      cppt += \`Insulin Basal (50%)     : \${fmtIndo(basal, 1)} Unit (1x/hari SC malam)\\n\`;
      cppt += \`Insulin Prandial (/x3)  : \${fmtIndo(prandial, 1)} Unit (tiap sebelum makan SC)\\n\\n\`;
      cppt += \`INSTRUKSI OVERLAP:\\n\`;
      cppt += \`- Berikan dosis pertama insulin basal subkutan 1 - 2 jam SEBELUM drip IV distop.\\n\`;
      cppt += \`- Pastikan krisis hiperglikemia (DKA/HHS) sudah resolusi dan intake oral adekuat.\`;

      const cpptEl = document.getElementById('ins-cppt');
      if (cpptEl) cpptEl.innerText = cppt;
    }

    // Init All on DOM Load
    document.addEventListener('DOMContentLoaded', () => {
      initGlobalSearch();
      calcBWPS();
      calcWayne();
      calcBillewicz();
      calcOsmo();
      calcAG();
      calcInsulin();
      calcMetabolic();
      renderInsulinTable();
    });
    </script>
</body>
</html>
\`;

fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully written updated adjustr-emd.html, bytes: ' + htmlContent.length);
