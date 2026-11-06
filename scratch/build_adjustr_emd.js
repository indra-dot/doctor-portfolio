// Builder script to construct adjustr-emd.html cleanly and modularly
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'adjustr-emd.html');

console.log("Building comprehensive adjustr-emd.html...");

// Let's create modular parts
const htmlHeader = `<!DOCTYPE html>
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

        /* Ambient Glow Effects */
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
            padding: 1.5rem;
            position: relative;
        }
        @media (min-width: 640px) {
            .glass-card, .card {
                padding: 1.75rem 2rem;
            }
        }
        button.glass-card {
            padding: 1.25rem !important;
        }
        .glass-card:hover, .card:hover {
            border-color: var(--glass-border-hover);
            box-shadow: 0 8px 30px 0 rgba(16, 185, 129, 0.16);
            transform: translateY(-2px);
        }

        /* Reset flash animation */
        @keyframes flash-reset {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
            50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.3); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .flash-reset-anim {
            animation: flash-reset 0.45s ease-out;
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
            border-radius: var(--radius-md);
            padding: 1.15rem 1.35rem;
            margin-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Safety Clinical Guardrail Box */
        .guardrail-box {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.75) 100%);
            border: 1px solid rgba(239, 68, 68, 0.45);
            border-left: 4px solid #EF4444;
            box-shadow: 0 6px 25px rgba(239, 68, 68, 0.18);
            border-radius: var(--radius-md);
            padding: 1rem 1.25rem;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }

        #toast-notice {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
    </style>
</head>
<body class="selection:bg-emerald-900 selection:text-emerald-100">

    <div class="ambient-glow-1"></div>
    <div class="ambient-glow-2"></div>

    <!-- Toast Notification -->
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

            <!-- Top Search Bar (Realtime Discovery) -->
            <div class="relative flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4" id="header-search-container">
                <div class="relative flex items-center">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 text-slate-400 text-xs pointer-events-none"></i>
                    <input type="text" id="global-search-input" placeholder="Cari 18 kalkulator (BWPS, Koma Miksedema, DKA, Adrenal, Hipoglikemia)..." autocomplete="off" class="w-full pl-8 pr-14 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all">
                    <span class="hidden sm:inline-block absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700 pointer-events-none">Ctrl K</span>
                    <button id="search-clear-btn" type="button" onclick="clearGlobalSearch()" class="hidden absolute right-2.5 text-slate-400 hover:text-white text-xs px-1">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <!-- Search Results Dropdown -->
                <div id="search-results-dropdown" class="hidden absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 max-h-96 overflow-y-auto p-2"></div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
                <!-- Unit Converter Button -->
                <button type="button" onclick="openUnitConverterModal()" class="px-2.5 py-1 text-xs rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors flex items-center gap-1.5" title="Buka Kalkulator Konversi Satuan Lab">
                    <i class="fa-solid fa-arrow-right-arrow-left text-[11px]"></i>
                    <span class="hidden lg:inline">Konversi Satuan</span>
                </button>
                <span class="px-2.5 py-0.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium hidden sm:inline-block">18 Tools</span>
                <a href="mailto:putrawan.2371041010@student.unud.ac.id" target="_blank" rel="noopener" class="px-2.5 py-1 text-xs rounded-full bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 transition-colors flex items-center gap-1.5">
                    <i class="fa-solid fa-envelope text-[11px]"></i>
                    <span class="hidden md:inline">Feedback</span>
                </a>
            </div>
        </header>

        <!-- Sticky Quick Navigation Bar -->
        <nav class="quick-nav-bar" aria-label="Quick Category Switcher">
            <div class="quick-nav-scroll">
                <button type="button" id="pill-dash" onclick="navigateTo('home-module', 'Home Dashboard', this.id)" class="quick-nav-pill active">
                    <i class="fa-solid fa-house text-emerald-400 text-xs"></i>
                    <span>Dashboard</span>
                </button>
                <button type="button" id="pill-thyroid" onclick="navigateTo('tab-thyroid', 'Tiroid & Krisis', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-fire text-rose-400 text-xs"></i>
                    <span>Tiroid (BWPS & Miksedema)</span>
                </button>
                <button type="button" id="pill-adrenal" onclick="navigateTo('tab-adrenal-pituitary', 'Adrenal & Pituitari', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-capsules text-sky-400 text-xs"></i>
                    <span>Adrenal & Pituitari</span>
                </button>
                <button type="button" id="pill-emergencies" onclick="navigateTo('tab-emergencies', 'Emergensi Metabolik & Dosing', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-truck-medical text-amber-400 text-xs"></i>
                    <span>Emergensi, DKA & Glukosa</span>
                </button>
                <button type="button" id="pill-metabolic" onclick="navigateTo('tab-metabolic', 'Kardiometabolik & Lipid', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-chart-pie text-violet-400 text-xs"></i>
                    <span>Kardiometabolik & Lipid</span>
                </button>
                <button type="button" id="pill-bridging-insulin" onclick="navigateTo('tab-bridging-insulin', 'Bridging Insulin IV ke SC', this.id)" class="quick-nav-pill">
                    <i class="fa-solid fa-syringe text-orange-400 text-xs"></i>
                    <span>Bridging Insulin</span>
                </button>
            </div>
        </nav>
`;

console.log("HTML Header generated.");
