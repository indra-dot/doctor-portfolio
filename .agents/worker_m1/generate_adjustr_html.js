const fs = require('fs');
const path = require('path');
const drugDatabase = require('./build_drug_data');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>adjustr-io — Renal Antimicrobial Dosing Guide</title>
  <!-- Google Fonts Preconnect & Inter / Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #040814;
      --card-bg: rgba(15, 23, 42, 0.75);
      --card-bg-elevated: rgba(30, 41, 59, 0.82);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-border-hover: rgba(0, 242, 254, 0.45);
      --card-border-active: rgba(0, 242, 254, 0.75);
      --accent-cyan: #00F2FE;
      --accent-blue: #4FACFE;
      --accent-gradient: linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%);
      --accent-glow: rgba(0, 242, 254, 0.25);
      --text-pure: #F8FAFC;
      --text-dim: #94A3B8;
      --text-muted: #64748B;
      --danger-red: #EF4444;
      --danger-bg: rgba(239, 68, 68, 0.14);
      --danger-border: rgba(239, 68, 68, 0.35);
      --warning-amber: #F59E0B;
      --warning-bg: rgba(245, 158, 11, 0.14);
      --warning-border: rgba(245, 158, 11, 0.35);
      --success-green: #10B981;
      --success-bg: rgba(16, 185, 129, 0.14);
      --success-border: rgba(16, 185, 129, 0.35);
      --info-blue: #3B82F6;
      --info-bg: rgba(59, 130, 246, 0.14);
      --info-border: rgba(59, 130, 246, 0.35);
      --radius-pill: 9999px;
      --radius-xl: 24px;
      --radius-lg: 18px;
      --radius-md: 12px;
      --radius-sm: 8px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      background-color: var(--bg-dark);
      color: var(--text-pure);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      width: 100%;
      line-height: 1.5;
    }

    /* Ambient Background Glows */
    .ambient-glow-1 {
      position: fixed;
      top: -120px;
      left: 10%;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(79, 172, 254, 0.03) 50%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
      animation: floatAmbient 14s ease-in-out infinite alternate;
    }

    .ambient-glow-2 {
      position: fixed;
      bottom: 5%;
      right: 5%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, transparent 70%);
      filter: blur(100px);
      pointer-events: none;
      z-index: 0;
      animation: floatAmbient 18s ease-in-out infinite alternate-reverse;
    }

    @keyframes floatAmbient {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(40px, 25px) scale(1.08); }
    }

    .app-container {
      position: relative;
      z-index: 1;
      max-width: 860px;
      margin: 0 auto;
      padding: 1.25rem 1.25rem 4rem;
    }

    /* Header / Nav */
    header {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-xl);
      padding: 1.1rem 1.5rem;
      margin-bottom: 1.75rem;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon-box {
      background: var(--accent-gradient);
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
      color: #030712;
      flex-shrink: 0;
    }

    .brand-icon-box svg {
      width: 24px;
      height: 24px;
      stroke-width: 2.3;
    }

    .brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-title .brand-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
      display: inline-block;
    }

    .brand-subtitle {
      font-size: 0.72rem;
      color: var(--text-dim);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-reset {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-dim);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .btn-reset:hover {
      background: rgba(51, 65, 85, 0.9);
      color: var(--text-pure);
      border-color: var(--card-border-hover);
    }

    .btn-contact {
      background: var(--accent-gradient);
      color: #030712;
      text-decoration: none;
      padding: 0.5rem 1.1rem;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(0, 242, 254, 0.3);
    }

    .btn-contact:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 242, 254, 0.5);
    }

    /* Glass Cards */
    .glass-card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .glass-card:hover {
      border-color: var(--card-border-hover);
      box-shadow: 0 16px 40px rgba(0, 242, 254, 0.08);
    }

    .card-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 0.75rem;
    }

    .card-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-title svg {
      color: var(--accent-cyan);
      width: 18px;
      height: 18px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-pill);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-cyan {
      background: rgba(0, 242, 254, 0.12);
      color: var(--accent-cyan);
      border: 1px solid rgba(0, 242, 254, 0.3);
    }

    .badge-blue {
      background: rgba(79, 172, 254, 0.12);
      color: var(--accent-blue);
      border: 1px solid rgba(79, 172, 254, 0.3);
    }

    .badge-amber {
      background: var(--warning-bg);
      color: var(--warning-amber);
      border: 1px solid var(--warning-border);
    }

    .badge-red {
      background: var(--danger-bg);
      color: var(--danger-red);
      border: 1px solid var(--danger-border);
    }

    .badge-green {
      background: var(--success-bg);
      color: var(--success-green);
      border: 1px solid var(--success-border);
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.1rem;
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-label span.unit {
      color: var(--accent-cyan);
      font-weight: 600;
    }

    .gender-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      background: rgba(15, 23, 42, 0.8);
      padding: 4px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .gender-btn {
      padding: 0.65rem;
      border: none;
      background: transparent;
      color: var(--text-dim);
      font-weight: 700;
      font-size: 0.85rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .gender-btn.active {
      background: var(--accent-gradient);
      color: #030712;
      box-shadow: 0 2px 10px rgba(0, 242, 254, 0.35);
    }

    .input-field {
      width: 100%;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      color: #FFFFFF;
      font-size: 1rem;
      font-weight: 600;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }

    .input-field:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 14px rgba(0, 242, 254, 0.25);
      background: rgba(15, 23, 42, 0.95);
    }

    .input-field.input-highlight {
      border-color: rgba(0, 242, 254, 0.4);
      background: rgba(0, 242, 254, 0.04);
      color: var(--accent-cyan);
      font-size: 1.35rem;
      font-weight: 800;
    }

    /* Validation Banners */
    .alert-banner {
      padding: 0.9rem 1.2rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.85rem;
      line-height: 1.45;
      animation: fadeIn 0.25s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .alert-banner svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .alert-danger {
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      color: #FECACA;
    }
    .alert-danger strong { color: #F87171; }

    .alert-warning {
      background: var(--warning-bg);
      border: 1px solid var(--warning-border);
      color: #FEF3C7;
    }
    .alert-warning strong { color: #FBBF24; }

    .alert-info {
      background: var(--info-bg);
      border: 1px solid var(--info-border);
      color: #DBEAFE;
    }
    .alert-info strong { color: #60A5FA; }

    /* Weight Selection & Badges Card */
    .weight-panel {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-top: 1.25rem;
    }

    @media (max-width: 640px) {
      .weight-panel {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .weight-badge-card {
      background: rgba(30, 41, 59, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: var(--radius-md);
      padding: 0.8rem;
      text-align: center;
      position: relative;
      transition: all 0.2s ease;
    }

    .weight-badge-card.active-weight {
      border-color: var(--accent-cyan);
      background: rgba(0, 242, 254, 0.08);
      box-shadow: 0 0 16px rgba(0, 242, 254, 0.25);
    }

    .weight-badge-card .w-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      margin-bottom: 4px;
    }

    .weight-badge-card .w-val {
      font-size: 1.2rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .weight-badge-card.active-weight .w-val {
      color: var(--accent-cyan);
    }

    .weight-badge-card .w-sub {
      font-size: 0.65rem;
      color: var(--text-muted);
      margin-top: 2px;
      font-weight: 600;
    }

    .active-tag {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--accent-gradient);
      color: #030712;
      font-size: 0.58rem;
      font-weight: 800;
      padding: 1px 7px;
      border-radius: var(--radius-pill);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      box-shadow: 0 2px 6px rgba(0, 242, 254, 0.4);
      white-space: nowrap;
    }

    /* Renal Primary Clearance Display */
    .clearance-showcase {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 680px) {
      .clearance-showcase {
        grid-template-columns: 1fr;
      }
    }

    .clearance-primary-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%);
      border: 1px solid rgba(0, 242, 254, 0.3);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.05);
      position: relative;
      overflow: hidden;
    }

    .clearance-primary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--accent-gradient);
    }

    .metric-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    .metric-caption {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
    }

    .crcl-huge-num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.04em;
      color: #FFFFFF;
      display: inline-flex;
      align-items: baseline;
      gap: 6px;
    }

    .crcl-huge-num .unit {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--accent-cyan);
      letter-spacing: normal;
    }

    .metric-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 0.9rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;
    }

    .metric-meta-item {
      display: flex;
      flex-direction: column;
    }

    .metric-meta-item .m-title {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
    }

    .metric-meta-item .m-val {
      font-size: 0.85rem;
      color: var(--text-pure);
      font-weight: 700;
    }

    .kdigo-stage-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .kdigo-badge-display {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 1.2rem;
      font-weight: 800;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0.5rem 0;
      width: fit-content;
    }

    .kdigo-label {
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .kdigo-desc {
      font-size: 0.75rem;
      color: var(--text-dim);
      line-height: 1.4;
      margin-top: 4px;
    }

    .egfr-ref-note {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 0.75rem;
      padding-top: 0.6rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Drug Selector & Search */
    .drug-search-box {
      position: relative;
      margin-bottom: 1rem;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      pointer-events: none;
      transition: color 0.2s;
    }

    .search-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-pill);
      padding: 0.85rem 1rem 0.85rem 2.8rem;
      color: #FFFFFF;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }

    .search-input:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 16px rgba(0, 242, 254, 0.25);
    }

    .search-input:focus ~ .search-icon {
      color: var(--accent-cyan);
    }

    .category-filter-bar {
      display: flex;
      gap: 0.4rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
      scrollbar-width: none;
    }
    .category-filter-bar::-webkit-scrollbar { display: none; }

    .cat-chip {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-dim);
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-pill);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .cat-chip:hover {
      background: rgba(51, 65, 85, 0.8);
      color: var(--text-pure);
    }

    .cat-chip.active {
      background: var(--accent-gradient);
      color: #030712;
      font-weight: 700;
      border-color: transparent;
      box-shadow: 0 2px 10px rgba(0, 242, 254, 0.35);
    }

    /* Drug Dropdown / Results list */
    .drug-results-dropdown {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid var(--card-border-hover);
      border-radius: var(--radius-lg);
      max-height: 280px;
      overflow-y: auto;
      margin-bottom: 1.5rem;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
      display: none;
    }

    .drug-results-dropdown.visible {
      display: block;
    }

    .drug-list-item {
      padding: 0.85rem 1.2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: background 0.15s;
    }

    .drug-list-item:last-child {
      border-bottom: none;
    }

    .drug-list-item:hover {
      background: rgba(0, 242, 254, 0.08);
    }

    .drug-list-item .d-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #FFFFFF;
    }

    .drug-list-item .d-class {
      font-size: 0.7rem;
      color: var(--text-dim);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Selected Drug Detail View */
    .selected-drug-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border-active);
      border-radius: var(--radius-xl);
      padding: 1.6rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 25px rgba(0, 242, 254, 0.12);
      animation: fadeIn 0.3s ease;
    }

    .drug-banner-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 1.1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .drug-title-area h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .drug-tags-row {
      display: flex;
      gap: 0.5rem;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .btn-close-drug {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-dim);
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-close-drug:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #F87171;
      border-color: rgba(239, 68, 68, 0.4);
    }

    .strategy-selector-box {
      margin-bottom: 1.25rem;
    }

    .strategy-selector-box label {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      display: block;
      margin-bottom: 0.4rem;
    }

    .strategy-pills {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .strat-pill {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-pure);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .strat-pill:hover {
      border-color: var(--accent-cyan);
    }

    .strat-pill.active {
      background: var(--accent-gradient);
      color: #030712;
      font-weight: 700;
      border-color: transparent;
      box-shadow: 0 2px 10px rgba(0, 242, 254, 0.3);
    }

    /* Single Calculated Dose Box */
    .calculated-single-dose-box {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid rgba(0, 242, 254, 0.35);
      border-radius: var(--radius-lg);
      padding: 1.1rem 1.4rem;
      margin-bottom: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .csd-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .csd-icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0, 242, 254, 0.15);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .csd-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
    }

    .csd-value {
      font-size: 1.6rem;
      font-weight: 800;
      color: #FFFFFF;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .csd-right {
      text-align: right;
    }

    .csd-right .basis-title {
      font-size: 0.65rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
    }

    .csd-right .basis-val {
      font-size: 0.85rem;
      color: var(--accent-cyan);
      font-weight: 700;
    }

    /* Maintenance Dose Callout Card */
    .maintenance-regimen-card {
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(79, 172, 254, 0.08) 100%);
      border: 1px solid rgba(0, 242, 254, 0.4);
      border-radius: var(--radius-lg);
      padding: 1.4rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 8px 24px rgba(0, 242, 254, 0.12);
    }

    .maint-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .maint-caption {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .maint-dose-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.55rem;
      font-weight: 800;
      line-height: 1.25;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    /* Titration Table */
    .titration-table-wrap {
      margin-bottom: 1.25rem;
      overflow-x: auto;
    }

    .titration-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }

    .titration-table th {
      background: rgba(30, 41, 59, 0.6);
      color: var(--text-dim);
      text-transform: uppercase;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 0.6rem 0.9rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .titration-table td {
      padding: 0.65rem 0.9rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--text-pure);
    }

    .titration-table tr.active-bracket {
      background: rgba(0, 242, 254, 0.12);
      font-weight: 700;
    }

    .titration-table tr.active-bracket td:first-child {
      color: var(--accent-cyan);
      border-left: 3px solid var(--accent-cyan);
    }

    /* RRT Cards Grid */
    .rrt-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    @media (max-width: 640px) {
      .rrt-grid {
        grid-template-columns: 1fr;
      }
    }

    .rrt-box {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md);
      padding: 1rem;
    }

    .rrt-box .rrt-title {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent-blue);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 0.4rem;
    }

    .rrt-box .rrt-text {
      font-size: 0.83rem;
      color: var(--text-pure);
      line-height: 1.45;
    }

    /* Clinical Pearls Note */
    .pearls-box {
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: var(--radius-md);
      padding: 1rem 1.2rem;
      display: flex;
      gap: 12px;
      font-size: 0.83rem;
      line-height: 1.5;
    }

    .pearls-box svg {
      color: var(--warning-amber);
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .pearls-title {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--warning-amber);
      margin-bottom: 2px;
    }

    .pearls-text {
      color: #FDE68A;
      font-style: italic;
    }

    /* Inventory Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(4, 8, 20, 0.85);
      backdrop-filter: blur(12px);
      z-index: 999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-backdrop.active {
      display: flex;
    }

    .modal-card {
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--card-border-hover);
      border-radius: var(--radius-xl);
      max-width: 620px;
      width: 100%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
      overflow: hidden;
      animation: modalSlide 0.25s ease;
    }

    @keyframes modalSlide {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.2rem;
      font-weight: 800;
      color: #FFFFFF;
    }

    .modal-body {
      padding: 1.25rem 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .inventory-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
    }

    @media (max-width: 500px) {
      .inventory-grid {
        grid-template-columns: 1fr;
      }
    }

    .inventory-item-btn {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      text-align: left;
      cursor: pointer;
      color: var(--text-pure);
      transition: all 0.2s;
    }

    .inventory-item-btn:hover {
      background: rgba(0, 242, 254, 0.1);
      border-color: var(--accent-cyan);
    }

    .inventory-item-btn .inv-name {
      font-weight: 700;
      font-size: 0.85rem;
      display: block;
    }

    .inventory-item-btn .inv-class {
      font-size: 0.68rem;
      color: var(--text-dim);
      text-transform: uppercase;
      font-weight: 600;
    }

    /* Footer */
    footer {
      text-align: center;
      padding: 2.5rem 1rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.75rem;
      color: var(--text-dim);
      line-height: 1.6;
    }

    footer p {
      margin-bottom: 0.5rem;
    }

    .footer-feedback-link {
      color: var(--accent-cyan);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .footer-feedback-link:hover {
      text-decoration: underline;
      color: #FFFFFF;
    }

    .disclaimer-pill {
      display: inline-block;
      margin-top: 0.5rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-pill);
      padding: 0.3rem 0.9rem;
      font-size: 0.68rem;
      color: var(--text-muted);
      font-weight: 600;
    }
  </style>
</head>
<body>
  <!-- Ambient background lighting -->
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>

  <div class="app-container">
    <!-- Header -->
    <header>
      <div class="brand-group">
        <div class="brand-icon-box">
          <!-- Activity/Heartbeat SVG -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div>
          <div class="brand-title">
            ADJUSTR.IO <span class="brand-dot"></span>
          </div>
          <div class="brand-subtitle">Renal Antimicrobial Dosing Guide • Stanford 2025 + KDIGO 2024</div>
        </div>
      </div>
      <div class="header-actions">
        <button id="btn-inventory" class="btn-reset" title="View Full Drug Database">
          <!-- BookOpen SVG -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Catalog
        </button>
        <button id="btn-reset" class="btn-reset" title="Reset all inputs">
          <!-- RefreshCw SVG -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Reset
        </button>
        <a href="mailto:putrawan.2371041010@student.unud.ac.id" class="btn-contact" title="Send clinical feedback">
          <!-- Mail SVG -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Contact
        </a>
      </div>
    </header>

    <!-- Patient Parameters Card -->
    <section class="glass-card">
      <div class="card-header-bar">
        <div class="card-title">
          <!-- Calculator SVG -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="14" x2="16" y2="18"></line>
            <path d="M16 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M8 14h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M8 18h.01"></path>
          </svg>
          Patient Biometrics & Renal Panel
        </div>
        <span class="badge-pill badge-cyan">Cockcroft-Gault + CKD-EPI</span>
      </div>

      <!-- Input Validation Banner (Dynamic) -->
      <div id="validation-banner" style="display: none;"></div>

      <div class="form-grid">
        <!-- Gender Toggle -->
        <div class="form-group">
          <label class="form-label">Biological Sex</label>
          <div class="gender-toggle">
            <button type="button" id="gender-male" class="gender-btn active" data-gender="male">Male (Pria)</button>
            <button type="button" id="gender-female" class="gender-btn" data-gender="female">Female (Wanita)</button>
          </div>
        </div>

        <!-- Age Input -->
        <div class="form-group">
          <label class="form-label" for="input-age">Age <span class="unit">Years</span></label>
          <input type="number" id="input-age" class="input-field" placeholder="e.g. 50" min="1" max="130" step="1" />
        </div>

        <!-- Weight (TBW) Input -->
        <div class="form-group">
          <label class="form-label" for="input-weight">Total Body Weight (TBW) <span class="unit">kg</span></label>
          <input type="number" id="input-weight" class="input-field" placeholder="e.g. 70" min="1" max="350" step="0.1" />
        </div>

        <!-- Height Input -->
        <div class="form-group">
          <label class="form-label" for="input-height">Height <span class="unit">cm</span></label>
          <input type="number" id="input-height" class="input-field" placeholder="e.g. 175" min="40" max="250" step="0.5" />
        </div>

        <!-- Serum Creatinine Input -->
        <div class="form-group full-width">
          <label class="form-label" for="input-creatinine">Serum Creatinine (SCr) <span class="unit">mg/dL</span></label>
          <input type="number" id="input-creatinine" class="input-field input-highlight" placeholder="e.g. 1.0" min="0.1" max="35" step="0.01" />
        </div>
      </div>

      <!-- Weight Selection Badges Panel -->
      <div id="weight-panel" class="weight-panel" style="display: none;">
        <!-- TBW Badge Card -->
        <div id="card-tbw" class="weight-badge-card">
          <div class="w-label">TBW (Actual)</div>
          <div id="val-tbw" class="w-val">-- kg</div>
          <div id="val-bmi" class="w-sub">BMI: --</div>
        </div>

        <!-- IBW Badge Card -->
        <div id="card-ibw" class="weight-badge-card">
          <div class="w-label">IBW (Devine)</div>
          <div id="val-ibw" class="w-val">-- kg</div>
          <div class="w-sub">Ideal Mass</div>
        </div>

        <!-- ABW Badge Card -->
        <div id="card-abw" class="weight-badge-card">
          <div class="w-label">ABW (40%)</div>
          <div id="val-abw" class="w-val">-- kg</div>
          <div class="w-sub">Adjusted Obese</div>
        </div>

        <!-- Active Weight Badge Card -->
        <div id="card-active-weight" class="weight-badge-card active-weight">
          <div class="active-tag">Active Dosing Mass</div>
          <div class="w-label">Used For CrCl</div>
          <div id="val-used-weight" class="w-val">-- kg</div>
          <div id="val-used-type" class="w-sub">--</div>
        </div>
      </div>
    </section>

    <!-- Renal Clearance & KDIGO Staging Panel -->
    <section id="clearance-section" class="clearance-showcase" style="display: none;">
      <!-- CrCl Card -->
      <div class="clearance-primary-card">
        <div class="metric-top">
          <span class="metric-caption">Est. CrCl (Cockcroft-Gault)</span>
          <span id="crcl-badge" class="badge-pill badge-green">Calculated</span>
        </div>
        <div class="crcl-huge-num">
          <span id="val-crcl">--</span>
          <span class="unit">mL/min</span>
        </div>
        <div class="metric-meta-row">
          <div class="metric-meta-item">
            <span class="m-title">BSA (Mosteller)</span>
            <span id="val-bsa" class="m-val">-- m²</span>
          </div>
          <div class="metric-meta-item">
            <span class="m-title">CrCl (BSA-Normalized)</span>
            <span id="val-norm-crcl" class="m-val">-- mL/min/1.73m²</span>
          </div>
          <div class="metric-meta-item">
            <span class="m-title">Dosing Weight</span>
            <span id="val-dosing-weight-meta" class="m-val">-- kg</span>
          </div>
        </div>
      </div>

      <!-- KDIGO Stage Card -->
      <div class="kdigo-stage-card">
        <div>
          <div class="metric-caption">KDIGO CKD Staging (2024)</div>
          <div id="kdigo-badge" class="kdigo-badge-display">
            <span id="kdigo-stage-name">G--</span>
          </div>
          <div id="kdigo-stage-label" class="kdigo-label">Awaiting parameters...</div>
          <div id="kdigo-stage-desc" class="kdigo-desc">Enter complete patient labs to determine renal impairment staging.</div>
        </div>
        <div class="egfr-ref-note">
          CKD-EPI 2021 Race-Free eGFR: <strong id="val-ckd-epi" style="color: #FFFFFF;">--</strong> mL/min/1.73m²
        </div>
      </div>
    </section>

    <!-- Severe Renal Failure Warning Banner (CrCl < 15) -->
    <div id="severe-esrd-banner" class="alert-banner alert-danger" style="display: none;">
      <!-- AlertTriangle SVG -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <div>
        <strong>CRITICAL RENAL ALERT — CrCl &lt; 15 mL/min (KDIGO G5 / Kidney Failure):</strong>
        Profound accumulation risk for renally eliminated drugs. Prioritize non-nephrotoxic agents, implement mandatory ceiling dose limits, obtain nephrology consult, and confirm dialysis (IHD/CRRT) timing before administering maintenance doses.
      </div>
    </div>

    <!-- Antimicrobial Dosing Section -->
    <section class="glass-card">
      <div class="card-header-bar">
        <div class="card-title">
          <!-- Pill SVG -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
            <path d="m8.5 8.5 7 7"></path>
          </svg>
          Antimicrobial Renal Titration Engine
        </div>
        <span class="badge-pill badge-blue">36 Agents Verified</span>
      </div>

      <!-- Search Box & Categories -->
      <div class="drug-search-box">
        <div class="search-input-wrapper">
          <input type="text" id="drug-search" class="search-input" placeholder="Search antimicrobial (e.g. Meropenem, Vancomycin, Cefepime, Cotrimoxazole)..." autocomplete="off" />
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <!-- Category Filter Chips -->
      <div class="category-filter-bar" id="category-chips">
        <button type="button" class="cat-chip active" data-cat="all">All (36)</button>
        <button type="button" class="cat-chip" data-cat="penicillin">Penicillins</button>
        <button type="button" class="cat-chip" data-cat="cephalosporin">Cephalosporins</button>
        <button type="button" class="cat-chip" data-cat="carbapenem">Carbapenems</button>
        <button type="button" class="cat-chip" data-cat="fluoroquinolone">Fluoroquinolones</button>
        <button type="button" class="cat-chip" data-cat="aminoglycoside">Aminoglycosides</button>
        <button type="button" class="cat-chip" data-cat="glycopeptide">Glycopeptides / Lipo</button>
        <button type="button" class="cat-chip" data-cat="antiviral">Antivirals</button>
        <button type="button" class="cat-chip" data-cat="antifungal">Antifungals</button>
        <button type="button" class="cat-chip" data-cat="other">Others</button>
      </div>

      <!-- Dropdown Results (Visible on Search / Click) -->
      <div id="drug-dropdown" class="drug-results-dropdown"></div>

      <!-- Selected Drug Detail Card (Visible when drug selected) -->
      <div id="selected-drug-card" class="selected-drug-card" style="display: none;">
        <!-- Drug Banner Header -->
        <div class="drug-banner-header">
          <div class="drug-title-area">
            <h2 id="drug-detail-name">Drug Name</h2>
            <div class="drug-tags-row">
              <span id="drug-detail-class" class="badge-pill badge-blue">Class</span>
              <span id="drug-toxicity-badge" class="badge-pill" style="display: none;">Toxicity</span>
            </div>
          </div>
          <button type="button" id="btn-clear-drug" class="btn-close-drug" title="Clear selected drug">
            <!-- X SVG -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- High-Risk Warning Banners -->
        <div id="drug-nephro-alert" class="alert-banner alert-danger" style="display: none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <div>
            <strong>HIGH-RISK NEPHROTOXIC ANTIMICROBIAL:</strong>
            Mandatory Therapeutic Drug Monitoring (TDM). Avoid concomitant nephrotoxins (NSAIDs, ACEi, contrast). Pre-dose trough monitoring is required.
          </div>
        </div>

        <div id="drug-neuro-alert" class="alert-banner alert-warning" style="display: none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>NEUROTOXICITY GUARDRAIL:</strong>
            High risk of severe encephalopathy, myoclonus, and seizures when unadjusted in renal failure. Strictly titrate maintenance dose.
          </div>
        </div>

        <div id="drug-contraindication-alert" class="alert-banner alert-danger" style="display: none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
          <div id="drug-contraindication-text"></div>
        </div>

        <!-- Strategy Selector (For Multi-Strategy Drugs) -->
        <div id="strategy-selector-container" class="strategy-selector-box" style="display: none;">
          <label>Select Clinical Indication / Regimen Strategy</label>
          <div id="strategy-pills-list" class="strategy-pills"></div>
        </div>

        <!-- Loading Dose Guidance Banner -->
        <div id="loading-dose-banner" class="alert-banner alert-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div id="loading-dose-text">
            <strong>LOADING DOSE PRINCIPLE:</strong> In acute sepsis, Volume of Distribution (Vd) is preserved or increased. NEVER reduce initial loading dose for renal failure. Renal titration applies strictly to maintenance intervals.
          </div>
        </div>

        <!-- Calculated Single Dose Box (If weight-based factor exists) -->
        <div id="single-dose-box" class="calculated-single-dose-box" style="display: none;">
          <div class="csd-left">
            <div class="csd-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <div>
              <div class="csd-label">Calculated Single Dose</div>
              <div id="val-calculated-single-dose" class="csd-value">--</div>
            </div>
          </div>
          <div class="csd-right">
            <div class="csd-title basis-title">Weight Basis</div>
            <div id="val-single-dose-basis" class="basis-val">-- kg</div>
          </div>
        </div>

        <!-- Matched Renal Maintenance Regimen Card -->
        <div class="maintenance-regimen-card">
          <div class="maint-top-row">
            <span class="maint-caption">
              <!-- CheckCircle SVG -->
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Matched Renal Adjusted Maintenance Regimen
            </span>
            <span id="active-crcl-indicator" class="badge-pill badge-cyan">Based on CrCl</span>
          </div>
          <div id="val-maintenance-dose" class="maint-dose-text">Awaiting renal clearance calculation...</div>
        </div>

        <!-- Titration Brackets Comparative Table -->
        <div class="titration-table-wrap">
          <table class="titration-table">
            <thead>
              <tr>
                <th>Renal Function Tier</th>
                <th>Recommended Maintenance Regimen</th>
              </tr>
            </thead>
            <tbody id="titration-table-body">
              <!-- Dynamically populated rows -->
            </tbody>
          </table>
        </div>

        <!-- Renal Replacement Therapy (IHD / CRRT) Cards -->
        <div class="rrt-grid">
          <div class="rrt-box">
            <div class="rrt-title">
              <!-- Shield SVG -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Intermittent Hemodialysis (IHD)
            </div>
            <div id="val-rrt-ihd" class="rrt-text">--</div>
          </div>

          <div class="rrt-box">
            <div class="rrt-title">
              <!-- Shield SVG -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              CRRT (CVVH / CVVHD / CVVHDF)
            </div>
            <div id="val-rrt-crrt" class="rrt-text">--</div>
          </div>
        </div>

        <!-- Clinical Pearls Box -->
        <div class="pearls-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            <div class="pearls-title">Expert Clinical Pearls &amp; Pharmacology Notes</div>
            <div id="val-clinical-note" class="pearls-text">--</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <p>
        <strong>ADJUSTR.IO</strong> is synthesized from the <em>Stanford Antimicrobial Dosing Guide (Nov 2025)</em>, <em>KDIGO 2024 Clinical Practice Guidelines</em>, <em>Sanford Guide</em>, and <em>Winter's Clinical Pharmacokinetics</em>.
      </p>
      <p>
        For inquiries, bug reports, or clinical feedback, contact: 
        <a href="mailto:putrawan.2371041010@student.unud.ac.id" class="footer-feedback-link">putrawan.2371041010@student.unud.ac.id</a>
      </p>
      <div>
        <span class="disclaimer-pill">Clinical Decision Support Tool • For Licensed Medical Professionals • Not a Substitute for Clinical Judgment</span>
      </div>
    </footer>
  </div>

  <!-- Drug Catalog Modal -->
  <div id="inventory-modal" class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-header">
        <h3>Complete Drug Catalog (36 Agents)</h3>
        <button type="button" id="btn-close-modal" class="btn-close-drug">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div id="inventory-grid" class="inventory-grid"></div>
      </div>
    </div>
  </div>

  <!-- Embedded Standalone JavaScript Engine -->
  <script>
  (function() {
    'use strict';

    // 1. EMBEDDED COMPLETE ANTIMICROBIAL DATABASE (36 Agents)
    const DRUG_DATABASE = ${JSON.stringify(drugDatabase, null, 2)};

    // 2. CLINICAL CALCULATION ENGINE
    const ClinicalEngine = {
      // Devine Ideal Body Weight with short stature clamp
      calculateIBW: function(heightCm, gender) {
        if (!heightCm || heightCm <= 0) return 0;
        const heightInches = heightCm / 2.54;
        const base = (gender === 'female' || gender === 'wanita') ? 45.5 : 50.0;
        if (heightInches <= 60) return base; // Clamp at baseline for <= 60 inches
        return base + 2.3 * (heightInches - 60);
      },

      // Body Mass Index (BMI)
      calculateBMI: function(weightKg, heightCm) {
        if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) return 0;
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
      },

      // Clinical Dosing Weight Selection Logic
      selectWeight: function(tbw, heightCm, gender) {
        const ibw = this.calculateIBW(heightCm, gender);
        const bmi = this.calculateBMI(tbw, heightCm);
        const abw = (tbw > ibw) ? (ibw + 0.4 * (tbw - ibw)) : null;

        if (tbw < ibw) {
          return {
            usedWeight: tbw,
            weightType: 'TBW (Underweight)',
            ibw: ibw,
            bmi: bmi,
            abw: abw,
            category: 'Underweight'
          };
        } else if (bmi >= 30.0) {
          return {
            usedWeight: abw,
            weightType: 'ABW (Obese, BMI ≥ 30)',
            ibw: ibw,
            bmi: bmi,
            abw: abw,
            category: 'Obese (Class ' + (bmi >= 40 ? 'III' : bmi >= 35 ? 'II' : 'I') + ')'
          };
        } else {
          return {
            usedWeight: tbw,
            weightType: 'TBW (Normal/Overweight)',
            ibw: ibw,
            bmi: bmi,
            abw: abw,
            category: bmi >= 25 ? 'Overweight' : 'Normal Weight'
          };
        }
      },

      // Cockcroft-Gault Equation for CrCl
      calculateCrCl: function(age, tbw, heightCm, scr, gender) {
        if (!age || age < 18 || !tbw || tbw <= 0 || !heightCm || heightCm <= 0 || !scr || scr <= 0) {
          return null;
        }
        const weightInfo = this.selectWeight(tbw, heightCm, gender);
        const factor = (gender === 'female' || gender === 'wanita') ? 0.85 : 1.0;
        const crcl = ((140 - age) * weightInfo.usedWeight) / (72 * scr) * factor;
        const bsa = Math.sqrt((heightCm * tbw) / 3600);
        const normalizedCrCl = bsa > 0 ? (crcl * 1.73) / bsa : crcl;

        return {
          crCl: Math.max(0, crcl),
          normalizedCrCl: Math.max(0, normalizedCrCl),
          usedWeight: weightInfo.usedWeight,
          weightType: weightInfo.weightType,
          ibw: weightInfo.ibw,
          bmi: weightInfo.bmi,
          abw: weightInfo.abw,
          category: weightInfo.category,
          bsa: bsa
        };
      },

      // CKD-EPI 2021 Race-Free Equation for eGFR
      calculateCKDEPI: function(age, scr, gender) {
        if (!age || age < 18 || !scr || scr <= 0) return null;
        const isFemale = (gender === 'female' || gender === 'wanita');
        const kappa = isFemale ? 0.7 : 0.9;
        const alpha = isFemale ? -0.241 : -0.302;
        const genderMult = isFemale ? 1.012 : 1.0;
        const scrRatio = scr / kappa;
        const minPart = Math.pow(Math.min(scrRatio, 1), alpha);
        const maxPart = Math.pow(Math.max(scrRatio, 1), -1.200);
        const agePart = Math.pow(0.9938, age);
        const egfr = 142 * minPart * maxPart * agePart * genderMult;
        return Math.max(0, egfr);
      },

      // KDIGO eGFR Staging (2024 Guidelines)
      classifyKDIGO: function(gfr) {
        if (gfr == null || isNaN(gfr)) {
          return { stage: 'G--', label: 'Awaiting data', desc: 'Enter patient parameters', color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.15)' };
        }
        if (gfr >= 90) {
          return { stage: 'G1', label: 'Normal or High', desc: 'Normal renal function or hyperfiltration', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' };
        }
        if (gfr >= 60) {
          return { stage: 'G2', label: 'Mildly Decreased', desc: 'Mild clearance impairment relative to young adult normal', color: '#34D399', bg: 'rgba(52, 211, 153, 0.2)' };
        }
        if (gfr >= 45) {
          return { stage: 'G3a', label: 'Mild to Moderately Decreased', desc: 'Mild-moderate CKD; dosage adjustments indicated for high-clearance drugs', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.2)' };
        }
        if (gfr >= 30) {
          return { stage: 'G3b', label: 'Moderately to Severely Decreased', desc: 'Moderate-severe impairment; therapeutic drug monitoring & renal adjustments necessary', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' };
        }
        if (gfr >= 15) {
          return { stage: 'G4', label: 'Severely Decreased', desc: 'Severe reduction; significant accumulation risk of renally cleared drugs', color: '#F97316', bg: 'rgba(249, 115, 22, 0.2)' };
        }
        return { stage: 'G5', label: 'Kidney Failure (End Stage)', desc: 'Profound renal failure; dialysis required or impending. Implement ceiling doses', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.25)' };
      },

      // Continuous Interval Matching (No gaps, no silent full-dose fallback)
      matchAdjustment: function(adjustments, crcl) {
        if (!adjustments || adjustments.length === 0) return null;
        // Sort descending by minCrCl
        const sorted = [...adjustments].sort((a, b) => b.minCrCl - a.minCrCl);
        for (let i = 0; i < sorted.length; i++) {
          if (crcl >= sorted[i].minCrCl) {
            return { matched: sorted[i], index: i, total: sorted.length };
          }
        }
        // If CrCl < lowest threshold, assign the most restrictive renal bracket
        return { matched: sorted[sorted.length - 1], index: sorted.length - 1, total: sorted.length };
      }
    };

    // 3. APPLICATION STATE
    const state = {
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      creatinine: '',
      selectedDrugKey: null,
      selectedStrategyName: null,
      selectedCategory: 'all',
      searchQuery: '',
      patientResults: null
    };

    // 4. DOM ELEMENTS
    const el = {
      genderMale: document.getElementById('gender-male'),
      genderFemale: document.getElementById('gender-female'),
      inputAge: document.getElementById('input-age'),
      inputWeight: document.getElementById('input-weight'),
      inputHeight: document.getElementById('input-height'),
      inputCreatinine: document.getElementById('input-creatinine'),
      validationBanner: document.getElementById('validation-banner'),
      weightPanel: document.getElementById('weight-panel'),
      valTbw: document.getElementById('val-tbw'),
      valBmi: document.getElementById('val-bmi'),
      valIbw: document.getElementById('val-ibw'),
      valAbw: document.getElementById('val-abw'),
      valUsedWeight: document.getElementById('val-used-weight'),
      valUsedType: document.getElementById('val-used-type'),
      cardTbw: document.getElementById('card-tbw'),
      cardIbw: document.getElementById('card-ibw'),
      cardAbw: document.getElementById('card-abw'),
      cardActiveWeight: document.getElementById('card-active-weight'),
      clearanceSection: document.getElementById('clearance-section'),
      valCrcl: document.getElementById('val-crcl'),
      crclBadge: document.getElementById('crcl-badge'),
      valBsa: document.getElementById('val-bsa'),
      valNormCrcl: document.getElementById('val-norm-crcl'),
      valDosingWeightMeta: document.getElementById('val-dosing-weight-meta'),
      kdigoBadge: document.getElementById('kdigo-badge'),
      kdigoStageName: document.getElementById('kdigo-stage-name'),
      kdigoStageLabel: document.getElementById('kdigo-stage-label'),
      kdigoStageDesc: document.getElementById('kdigo-stage-desc'),
      valCkdEpi: document.getElementById('val-ckd-epi'),
      severeEsrdBanner: document.getElementById('severe-esrd-banner'),
      drugSearch: document.getElementById('drug-search'),
      categoryChips: document.getElementById('category-chips'),
      drugDropdown: document.getElementById('drug-dropdown'),
      selectedDrugCard: document.getElementById('selected-drug-card'),
      drugDetailName: document.getElementById('drug-detail-name'),
      drugDetailClass: document.getElementById('drug-detail-class'),
      drugToxicityBadge: document.getElementById('drug-toxicity-badge'),
      btnClearDrug: document.getElementById('btn-clear-drug'),
      drugNephroAlert: document.getElementById('drug-nephro-alert'),
      drugNeuroAlert: document.getElementById('drug-neuro-alert'),
      drugContraindicationAlert: document.getElementById('drug-contraindication-alert'),
      drugContraindicationText: document.getElementById('drug-contraindication-text'),
      strategySelectorContainer: document.getElementById('strategy-selector-container'),
      strategyPillsList: document.getElementById('strategy-pills-list'),
      loadingDoseBanner: document.getElementById('loading-dose-banner'),
      loadingDoseText: document.getElementById('loading-dose-text'),
      singleDoseBox: document.getElementById('single-dose-box'),
      valCalculatedSingleDose: document.getElementById('val-calculated-single-dose'),
      valSingleDoseBasis: document.getElementById('val-single-dose-basis'),
      valMaintenanceDose: document.getElementById('val-maintenance-dose'),
      activeCrclIndicator: document.getElementById('active-crcl-indicator'),
      titrationTableBody: document.getElementById('titration-table-body'),
      valRrtIhd: document.getElementById('val-rrt-ihd'),
      valRrtCrrt: document.getElementById('val-rrt-crrt'),
      valClinicalNote: document.getElementById('val-clinical-note'),
      btnReset: document.getElementById('btn-reset'),
      btnInventory: document.getElementById('btn-inventory'),
      inventoryModal: document.getElementById('inventory-modal'),
      btnCloseModal: document.getElementById('btn-close-modal'),
      inventoryGrid: document.getElementById('inventory-grid')
    };

    // 5. INPUT VALIDATION & REAL-TIME CALCULATION
    function recalculate() {
      const ageStr = el.inputAge.value.trim();
      const weightStr = el.inputWeight.value.trim();
      const heightStr = el.inputHeight.value.trim();
      const scrStr = el.inputCreatinine.value.trim();

      state.age = ageStr;
      state.weight = weightStr;
      state.height = heightStr;
      state.creatinine = scrStr;

      // Check if completely empty
      if (!ageStr && !weightStr && !heightStr && !scrStr) {
        el.validationBanner.style.display = 'none';
        el.weightPanel.style.display = 'none';
        el.clearanceSection.style.display = 'none';
        el.severeEsrdBanner.style.display = 'none';
        state.patientResults = null;
        renderDrugDosing();
        return;
      }

      // Numerical parsing
      const age = parseFloat(ageStr);
      const weight = parseFloat(weightStr);
      const height = parseFloat(heightStr);
      const scr = parseFloat(scrStr);

      const errors = [];
      const warnings = [];

      // Validate age
      if (ageStr) {
        if (isNaN(age) || age <= 0) {
          errors.push('Age must be a positive integer.');
        } else if (age < 18) {
          warnings.push('<strong>Pediatric Warning:</strong> Cockcroft-Gault & CKD-EPI equations are validated for adults (age ≥ 18). For pediatric patients, use the Bedside Schwartz equation.');
        } else if (age > 120) {
          warnings.push('Age > 120 years: Please verify entered age.');
        }
      }

      // Validate weight
      if (weightStr) {
        if (isNaN(weight) || weight <= 0) {
          errors.push('Total body weight must be a positive number greater than 0 kg.');
        } else if (weight < 25 || weight > 350) {
          warnings.push('Weight (' + weight + ' kg) is outside typical adult range (25–350 kg).');
        }
      }

      // Validate height
      if (heightStr) {
        if (isNaN(height) || height <= 0) {
          errors.push('Height must be a positive number greater than 0 cm.');
        } else if (height < 60 || height > 240) {
          warnings.push('Height (' + height + ' cm) is outside typical adult range.');
        }
      }

      // Validate creatinine
      if (scrStr) {
        if (isNaN(scr) || scr <= 0) {
          errors.push('Serum creatinine must be greater than 0 mg/dL.');
        } else if (scr < 0.2) {
          warnings.push('<strong>Physiological Floor:</strong> Extremely low creatinine (&lt; 0.2 mg/dL) often reflects low muscle mass/cachexia, falsely inflating calculated CrCl.');
        } else if (scr > 20) {
          warnings.push('Markedly elevated serum creatinine (&gt; 20 mg/dL): Severe acute or end-stage kidney failure.');
        }
      }

      // Render validation alerts
      if (errors.length > 0) {
        el.validationBanner.className = 'alert-banner alert-danger';
        el.validationBanner.innerHTML = errors.join('<br>');
        el.validationBanner.style.display = 'flex';
        el.weightPanel.style.display = 'none';
        el.clearanceSection.style.display = 'none';
        el.severeEsrdBanner.style.display = 'none';
        state.patientResults = null;
        renderDrugDosing();
        return;
      } else if (warnings.length > 0) {
        el.validationBanner.className = 'alert-banner alert-warning';
        el.validationBanner.innerHTML = warnings.join('<br>');
        el.validationBanner.style.display = 'flex';
      } else {
        el.validationBanner.style.display = 'none';
      }

      // If missing any parameter, wait for full input
      if (!ageStr || !weightStr || !heightStr || !scrStr || isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(scr)) {
        el.weightPanel.style.display = 'none';
        el.clearanceSection.style.display = 'none';
        el.severeEsrdBanner.style.display = 'none';
        state.patientResults = null;
        renderDrugDosing();
        return;
      }

      // Execute full genuine calculation
      const res = ClinicalEngine.calculateCrCl(age, weight, height, scr, state.gender);
      const egfr = ClinicalEngine.calculateCKDEPI(age, scr, state.gender);
      const kdigo = ClinicalEngine.classifyKDIGO(egfr != null ? egfr : res.crCl);

      state.patientResults = {
        ...res,
        egfr: egfr,
        kdigo: kdigo
      };

      // Update Weight Badges
      el.weightPanel.style.display = 'grid';
      el.valTbw.textContent = weight.toFixed(1) + ' kg';
      el.valBmi.textContent = 'BMI: ' + res.bmi.toFixed(1) + ' (' + res.category + ')';
      el.valIbw.textContent = res.ibw.toFixed(1) + ' kg';
      el.valAbw.textContent = res.abw ? (res.abw.toFixed(1) + ' kg') : 'N/A';
      el.valUsedWeight.textContent = res.usedWeight.toFixed(1) + ' kg';
      el.valUsedType.textContent = res.weightType;

      // Update Clearance Showcase
      el.clearanceSection.style.display = 'grid';
      el.valCrcl.textContent = res.crCl.toFixed(1);
      el.valBsa.textContent = res.bsa.toFixed(2) + ' m²';
      el.valNormCrcl.textContent = res.normalizedCrCl.toFixed(1);
      el.valDosingWeightMeta.textContent = res.usedWeight.toFixed(1) + ' kg';

      // KDIGO Showcase
      el.kdigoBadge.style.background = kdigo.bg;
      el.kdigoBadge.style.color = kdigo.color;
      el.kdigoStageName.textContent = kdigo.stage;
      el.kdigoStageLabel.textContent = kdigo.label;
      el.kdigoStageLabel.style.color = kdigo.color;
      el.kdigoStageDesc.textContent = kdigo.desc;
      el.valCkdEpi.textContent = egfr != null ? egfr.toFixed(1) : 'N/A';

      // Severe ESRD Banner (< 15)
      if (res.crCl < 15) {
        el.severeEsrdBanner.style.display = 'flex';
      } else {
        el.severeEsrdBanner.style.display = 'none';
      }

      // Render antimicrobial dosing with new renal parameters
      renderDrugDosing();
    }

    // 6. ANTIMICROBIAL DOSING RENDERER
    function renderDrugDosing() {
      const drugKey = state.selectedDrugKey;
      if (!drugKey || !DRUG_DATABASE[drugKey]) {
        el.selectedDrugCard.style.display = 'none';
        return;
      }

      const drug = DRUG_DATABASE[drugKey];
      el.selectedDrugCard.style.display = 'block';

      // Header info
      el.drugDetailName.textContent = drug.name;
      el.drugDetailClass.textContent = drug.class;

      // Toxicity badge
      if (drug.isNephrotoxic && drug.isNeurotoxic) {
        el.drugToxicityBadge.style.display = 'inline-flex';
        el.drugToxicityBadge.className = 'badge-pill badge-red';
        el.drugToxicityBadge.textContent = 'Nephrotoxic + Neurotoxic';
      } else if (drug.isNephrotoxic) {
        el.drugToxicityBadge.style.display = 'inline-flex';
        el.drugToxicityBadge.className = 'badge-pill badge-red';
        el.drugToxicityBadge.textContent = 'Nephrotoxic Agent';
      } else if (drug.isNeurotoxic) {
        el.drugToxicityBadge.style.display = 'inline-flex';
        el.drugToxicityBadge.className = 'badge-pill badge-amber';
        el.drugToxicityBadge.textContent = 'Neurotoxic Risk';
      } else {
        el.drugToxicityBadge.style.display = 'none';
      }

      // High-risk alerts
      const crcl = state.patientResults ? state.patientResults.crCl : 100;
      el.drugNephroAlert.style.display = drug.isNephrotoxic ? 'flex' : 'none';
      el.drugNeuroAlert.style.display = (drug.isNeurotoxic && crcl < 60) ? 'flex' : 'none';

      // Contraindication alert
      if (drug.contraindication && crcl < 30) {
        el.drugContraindicationAlert.style.display = 'flex';
        el.drugContraindicationText.innerHTML = '<strong>ABSOLUTE CONTRAINDICATION:</strong> ' + drug.contraindication;
      } else if (drug.contraindication && crcl < 60) {
        el.drugContraindicationAlert.style.display = 'flex';
        el.drugContraindicationText.innerHTML = '<strong>CLINICAL CAUTION:</strong> ' + drug.contraindication;
      } else {
        el.drugContraindicationAlert.style.display = 'none';
      }

      // Loading dose note
      if (drug.loadingDose) {
        el.loadingDoseBanner.style.display = 'flex';
        el.loadingDoseText.innerHTML = '<strong>LOADING DOSE PRINCIPLE:</strong> ' + drug.loadingDose;
      } else {
        el.loadingDoseBanner.style.display = 'none';
      }

      // Strategy handling
      let activeStrategyData = drug;
      if (drug.isMultiStrategy && drug.strategies) {
        el.strategySelectorContainer.style.display = 'block';
        const strategyNames = Object.keys(drug.strategies);
        if (!state.selectedStrategyName || !drug.strategies[state.selectedStrategyName]) {
          state.selectedStrategyName = strategyNames[0];
        }

        el.strategyPillsList.innerHTML = '';
        strategyNames.forEach(function(sname) {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'strat-pill' + (sname === state.selectedStrategyName ? ' active' : '');
          pill.textContent = sname;
          pill.addEventListener('click', function() {
            state.selectedStrategyName = sname;
            renderDrugDosing();
          });
          el.strategyPillsList.appendChild(pill);
        });

        activeStrategyData = drug.strategies[state.selectedStrategyName];
      } else {
        el.strategySelectorContainer.style.display = 'none';
      }

      // Calculated Single Dose (if weight-based factor)
      const doseFactor = activeStrategyData.dose_factor || drug.dose_factor;
      if (doseFactor && state.patientResults) {
        el.singleDoseBox.style.display = 'flex';
        // For vancomycin or actual weight rules:
        let weightForDose = state.patientResults.usedWeight;
        let basisLabel = state.patientResults.weightType;
        if (drug.name.includes('Vancomycin')) {
          weightForDose = parseFloat(state.weight) || weightForDose;
          basisLabel = 'Actual Weight (TBW)';
        }

        if (activeStrategyData.is_bsa) {
          const bsaDose = Math.round(doseFactor * state.patientResults.bsa);
          el.valCalculatedSingleDose.textContent = bsaDose + ' mg';
          el.valSingleDoseBasis.textContent = doseFactor + ' mg/m² × ' + state.patientResults.bsa.toFixed(2) + ' m²';
        } else {
          const totalMg = doseFactor * weightForDose;
          if (totalMg >= 1000) {
            el.valCalculatedSingleDose.textContent = (totalMg / 1000).toFixed(2) + ' g';
          } else {
            el.valCalculatedSingleDose.textContent = Math.round(totalMg) + ' mg';
          }
          el.valSingleDoseBasis.textContent = doseFactor + ' mg/kg × ' + weightForDose.toFixed(1) + ' kg (' + basisLabel + ')';
        }
      } else {
        el.singleDoseBox.style.display = 'none';
      }

      // Matched Renal Adjusted Regimen
      const adjustments = activeStrategyData.adjustments || [];
      if (!state.patientResults) {
        el.valMaintenanceDose.textContent = activeStrategyData.standard_dose || 'Standard Dose';
        el.activeCrclIndicator.textContent = 'Enter patient labs for CrCl adjustment';
      } else {
        const matchResult = ClinicalEngine.matchAdjustment(adjustments, state.patientResults.crCl);
        if (matchResult && matchResult.matched) {
          el.valMaintenanceDose.textContent = matchResult.matched.recommendation;
          el.activeCrclIndicator.textContent = 'Matched: ' + matchResult.matched.label + ' (Patient CrCl: ' + state.patientResults.crCl.toFixed(1) + ' mL/min)';
        } else {
          el.valMaintenanceDose.textContent = activeStrategyData.standard_dose || 'Standard Dose';
          el.activeCrclIndicator.textContent = 'CrCl: ' + state.patientResults.crCl.toFixed(1) + ' mL/min';
        }
      }

      // Titration Table
      el.titrationTableBody.innerHTML = '';
      if (adjustments.length > 0) {
        const patientCrCl = state.patientResults ? state.patientResults.crCl : null;
        const matched = patientCrCl != null ? ClinicalEngine.matchAdjustment(adjustments, patientCrCl) : null;

        adjustments.forEach(function(adj) {
          const row = document.createElement('tr');
          const isMatched = matched && matched.matched.label === adj.label;
          if (isMatched) {
            row.className = 'active-bracket';
          }
          const tdLabel = document.createElement('td');
          tdLabel.innerHTML = (isMatched ? '<strong>✓ ' : '') + adj.label + (isMatched ? '</strong>' : '');
          const tdRec = document.createElement('td');
          tdRec.innerHTML = (isMatched ? '<strong>' : '') + adj.recommendation + (isMatched ? '</strong>' : '');
          row.appendChild(tdLabel);
          row.appendChild(tdRec);
          el.titrationTableBody.appendChild(row);
        });
      }

      // RRT (IHD / CRRT)
      const rrtData = activeStrategyData.rrt || drug.rrt;
      if (rrtData) {
        el.valRrtIhd.textContent = rrtData.ihd || 'Consult clinical nephrology / pharmacy.';
        el.valRrtCrrt.textContent = rrtData.crrt || 'Consult intensive care clinical pharmacy.';
      } else {
        el.valRrtIhd.textContent = 'Dose post-HD on dialysis days; TDM guided.';
        el.valRrtCrrt.textContent = 'Standard continuous replacement therapy dosing.';
      }

      // Clinical Pearls
      el.valClinicalNote.textContent = drug.note || 'No special pharmacology pearls noted.';
    }

    // 7. DRUG SEARCH & FILTERING
    function renderDrugDropdown() {
      const query = state.searchQuery.toLowerCase().trim();
      const cat = state.selectedCategory;
      const drugKeys = Object.keys(DRUG_DATABASE);

      const filtered = drugKeys.filter(function(k) {
        const d = DRUG_DATABASE[k];
        const nameMatch = d.name.toLowerCase().includes(query);
        const classMatch = d.class.toLowerCase().includes(query);

        if (!nameMatch && !classMatch) return false;

        if (cat === 'all') return true;
        if (cat === 'penicillin') return d.class.toLowerCase().includes('penicillin');
        if (cat === 'cephalosporin') return d.class.toLowerCase().includes('cephalosporin');
        if (cat === 'carbapenem') return d.class.toLowerCase().includes('carbapenem');
        if (cat === 'fluoroquinolone') return d.class.toLowerCase().includes('fluoroquinolone');
        if (cat === 'aminoglycoside') return d.class.toLowerCase().includes('aminoglycoside');
        if (cat === 'glycopeptide') return d.class.toLowerCase().includes('glycopeptide') || d.class.toLowerCase().includes('lipopeptide');
        if (cat === 'antiviral') return d.class.toLowerCase().includes('antiviral');
        if (cat === 'antifungal') return d.class.toLowerCase().includes('antifungal');
        if (cat === 'other') {
          return !d.class.toLowerCase().includes('penicillin') &&
                 !d.class.toLowerCase().includes('cephalosporin') &&
                 !d.class.toLowerCase().includes('carbapenem') &&
                 !d.class.toLowerCase().includes('fluoroquinolone') &&
                 !d.class.toLowerCase().includes('aminoglycoside') &&
                 !d.class.toLowerCase().includes('glycopeptide') &&
                 !d.class.toLowerCase().includes('antiviral') &&
                 !d.class.toLowerCase().includes('antifungal');
        }
        return true;
      });

      if (filtered.length === 0) {
        el.drugDropdown.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">No matching antimicrobials found.</div>';
        el.drugDropdown.classList.add('visible');
        return;
      }

      el.drugDropdown.innerHTML = '';
      filtered.forEach(function(k) {
        const d = DRUG_DATABASE[k];
        const item = document.createElement('div');
        item.className = 'drug-list-item';
        item.innerHTML = '<div><div class="d-name">' + d.name + '</div><div class="d-class">' + d.class + '</div></div>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-cyan);">' +
          '<polyline points="9 18 15 12 9 6"></polyline></svg>';
        item.addEventListener('click', function() {
          selectDrug(k);
        });
        el.drugDropdown.appendChild(item);
      });

      el.drugDropdown.classList.add('visible');
    }

    function selectDrug(drugKey) {
      state.selectedDrugKey = drugKey;
      state.selectedStrategyName = null;
      el.drugSearch.value = DRUG_DATABASE[drugKey].name;
      el.drugDropdown.classList.remove('visible');
      renderDrugDosing();
      // Scroll to drug card smoothly
      setTimeout(function() {
        el.selectedDrugCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }

    // 8. INVENTORY MODAL
    function buildInventoryModal() {
      el.inventoryGrid.innerHTML = '';
      const drugKeys = Object.keys(DRUG_DATABASE).sort();
      drugKeys.forEach(function(k) {
        const d = DRUG_DATABASE[k];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'inventory-item-btn';
        btn.innerHTML = '<span class="inv-name">' + d.name + '</span><span class="inv-class">' + d.class + '</span>';
        btn.addEventListener('click', function() {
          selectDrug(k);
          el.inventoryModal.classList.remove('active');
        });
        el.inventoryGrid.appendChild(btn);
      });
    }

    // 9. EVENT LISTENERS
    // Gender buttons
    el.genderMale.addEventListener('click', function() {
      state.gender = 'male';
      el.genderMale.classList.add('active');
      el.genderFemale.classList.remove('active');
      recalculate();
    });

    el.genderFemale.addEventListener('click', function() {
      state.gender = 'female';
      el.genderFemale.classList.add('active');
      el.genderMale.classList.remove('active');
      recalculate();
    });

    // Inputs
    [el.inputAge, el.inputWeight, el.inputHeight, el.inputCreatinine].forEach(function(input) {
      input.addEventListener('input', recalculate);
      input.addEventListener('change', recalculate);
    });

    // Reset button
    el.btnReset.addEventListener('click', function() {
      el.inputAge.value = '';
      el.inputWeight.value = '';
      el.inputHeight.value = '';
      el.inputCreatinine.value = '';
      state.gender = 'male';
      el.genderMale.classList.add('active');
      el.genderFemale.classList.remove('active');
      recalculate();
    });

    // Drug search input
    el.drugSearch.addEventListener('focus', function() {
      renderDrugDropdown();
    });

    el.drugSearch.addEventListener('input', function(e) {
      state.searchQuery = e.target.value;
      renderDrugDropdown();
    });

    // Category chips
    el.categoryChips.addEventListener('click', function(e) {
      const chip = e.target.closest('.cat-chip');
      if (!chip) return;
      document.querySelectorAll('.cat-chip').forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      state.selectedCategory = chip.getAttribute('data-cat');
      renderDrugDropdown();
    });

    // Close dropdown on click outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.drug-search-box') && !e.target.closest('.category-filter-bar') && !e.target.closest('#drug-dropdown')) {
        el.drugDropdown.classList.remove('visible');
      }
    });

    // Clear selected drug
    el.btnClearDrug.addEventListener('click', function() {
      state.selectedDrugKey = null;
      state.selectedStrategyName = null;
      el.drugSearch.value = '';
      el.selectedDrugCard.style.display = 'none';
    });

    // Modal controls
    el.btnInventory.addEventListener('click', function() {
      buildInventoryModal();
      el.inventoryModal.classList.add('active');
    });

    el.btnCloseModal.addEventListener('click', function() {
      el.inventoryModal.classList.remove('active');
    });

    el.inventoryModal.addEventListener('click', function(e) {
      if (e.target === el.inventoryModal) {
        el.inventoryModal.classList.remove('active');
      }
    });

    // Default select Meropenem on load for immediate clinical exploration
    setTimeout(function() {
      selectDrug('meropenem');
    }, 100);

  })();
  </script>
</body>
</html>
`;

const targetPath = path.resolve(__dirname, '../../adjustr-io.html');
fs.writeFileSync(targetPath, htmlContent, 'utf8');
console.log('Successfully wrote modern obsidian adjustr-io.html to:', targetPath);
console.log('File size:', fs.statSync(targetPath).size, 'bytes');
