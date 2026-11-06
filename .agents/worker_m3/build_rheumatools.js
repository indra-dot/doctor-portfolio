const fs = require('fs');
const path = require('path');

// Read the extracted mRSS base64 image data
const mrssImageData = fs.readFileSync(path.join(__dirname, 'mrss_image_data.txt'), 'utf8').trim();

console.log('Read mRSS base64 length:', mrssImageData.length);

const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RheumaTools - Clinical Rheumatology Decision Companion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #040814;
      --card-bg: rgba(15, 23, 42, 0.78);
      --card-bg-subtle: rgba(15, 23, 42, 0.5);
      --card-border: rgba(255, 255, 255, 0.08);
      --card-border-hover: rgba(0, 242, 254, 0.45);
      --accent-cyan: #00F2FE;
      --accent-blue: #4FACFE;
      --accent-emerald: #10B981;
      --accent-amber: #F59E0B;
      --accent-rose: #F43F5E;
      --text-pure: #F8FAFC;
      --text-dim: #94A3B8;
      --text-muted: #64748B;
      --input-bg: rgba(30, 41, 59, 0.65);
      --input-border: rgba(255, 255, 255, 0.12);
      --input-focus: #00F2FE;
      --radius-pill: 9999px;
      --radius-lg: 20px;
      --radius-md: 14px;
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    /* Ambient Background Glows */
    .ambient-glow-1 {
      position: fixed;
      top: -120px;
      left: 10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(79, 172, 254, 0.03) 50%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }

    .ambient-glow-2 {
      position: fixed;
      bottom: 5%;
      right: 8%;
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 0;
    }

    /* Responsive App Container (No Scroll Trap) */
    .app-layout {
      display: flex;
      min-height: 100vh;
      position: relative;
      z-index: 1;
    }

    /* Sidebar Navigation */
    .sidebar {
      width: 290px;
      background: rgba(10, 16, 31, 0.92);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      flex-shrink: 0;
      padding: 1.5rem 1rem;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 50;
    }

    .sidebar::-webkit-scrollbar {
      width: 5px;
    }
    .sidebar::-webkit-scrollbar-track {
      background: transparent;
    }
    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    .brand-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0.5rem 0.75rem 1.25rem;
      border-bottom: 1px solid var(--card-border);
      text-decoration: none;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(79, 172, 254, 0.2) 100%);
      border: 1px solid rgba(0, 242, 254, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-cyan);
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.25);
    }

    .brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .brand-badge {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0, 242, 254, 0.15);
      color: var(--accent-cyan);
      border: 1px solid rgba(0, 242, 254, 0.3);
      text-transform: uppercase;
      font-weight: 600;
    }

    .nav-section-title {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 1.25rem 0.75rem 0.4rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      color: var(--text-dim);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.2s ease;
      margin-bottom: 2px;
      border: 1px solid transparent;
    }

    .nav-link:hover {
      color: var(--text-pure);
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.06);
    }

    .nav-link.active {
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.12) 0%, rgba(79, 172, 254, 0.06) 100%);
      color: var(--accent-cyan);
      border-color: rgba(0, 242, 254, 0.3);
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0, 242, 254, 0.08);
    }

    .nav-link svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      opacity: 0.75;
      transition: opacity 0.2s;
    }

    .nav-link.active svg {
      opacity: 1;
      stroke: var(--accent-cyan);
    }

    .sidebar-footer {
      padding-top: 1rem;
      border-top: 1px solid var(--card-border);
    }

    /* Main App Area */
    .main-wrapper {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .top-header {
      background: rgba(10, 16, 31, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--card-border);
      padding: 0.9rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .menu-btn {
      display: none;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      color: var(--text-pure);
      width: 36px;
      height: 36px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .header-title-box h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #FFFFFF;
    }
    .header-title-box p {
      font-size: 0.78rem;
      color: var(--text-dim);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feedback-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-pill);
      background: rgba(0, 242, 254, 0.08);
      border: 1px solid rgba(0, 242, 254, 0.25);
      color: var(--accent-cyan);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .feedback-pill:hover {
      background: rgba(0, 242, 254, 0.16);
      border-color: rgba(0, 242, 254, 0.5);
      box-shadow: 0 0 16px rgba(0, 242, 254, 0.25);
      transform: translateY(-1px);
    }

    /* Content Area */
    .content-area {
      flex: 1;
      padding: 2rem 1.75rem 3rem;
      max-width: 1280px;
      margin: 0 auto;
      width: 100%;
    }

    .content-page {
      display: none;
      animation: fadeIn 0.25s ease-out;
    }

    .content-page.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards & Layout */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .card:hover {
      border-color: rgba(0, 242, 254, 0.22);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    }

    .card-header {
      margin-bottom: 1.25rem;
    }

    .card-header h2, .card-header h3 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-header p {
      font-size: 0.82rem;
      color: var(--text-dim);
      line-height: 1.45;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .card-footer-ref {
      margin-top: 1.25rem;
      padding-top: 0.85rem;
      border-top: 1px solid var(--card-border);
      font-size: 0.72rem;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Form Controls */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-pure);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-hint {
      font-size: 0.72rem;
      font-weight: 400;
      color: var(--text-muted);
    }

    .input-field, select.input-field {
      width: 100%;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-radius: var(--radius-md);
      padding: 0.65rem 0.9rem;
      color: var(--text-pure);
      font-family: 'Inter', sans-serif;
      font-size: 0.88rem;
      transition: all 0.2s ease;
      outline: none;
    }

    .input-field:focus, select.input-field:focus {
      border-color: var(--input-focus);
      background: rgba(30, 41, 59, 0.9);
      box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.15);
    }

    select.input-field option {
      background-color: #0d1527;
      color: var(--text-pure);
    }

    .input-field.input-error {
      border-color: var(--accent-rose) !important;
      box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.18) !important;
    }

    .error-msg {
      font-size: 0.74rem;
      color: var(--accent-rose);
      display: none;
      margin-top: 2px;
    }

    .error-msg.visible {
      display: block;
    }

    /* Button System */
    .btn-group {
      display: flex;
      gap: 10px;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0.65rem 1.25rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
    }

    .btn-primary {
      background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%);
      color: #030712;
      box-shadow: 0 4px 14px rgba(0, 242, 254, 0.25);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 20px rgba(0, 242, 254, 0.4);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--card-border);
      color: var(--text-dim);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.09);
      color: var(--text-pure);
      border-color: rgba(255, 255, 255, 0.16);
    }

    .btn-sample {
      background: rgba(0, 242, 254, 0.08);
      border-color: rgba(0, 242, 254, 0.25);
      color: var(--accent-cyan);
      font-size: 0.78rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-pill);
    }
    .btn-sample:hover {
      background: rgba(0, 242, 254, 0.16);
      border-color: rgba(0, 242, 254, 0.45);
    }

    /* Sub-tabs / Nav Pills */
    .pill-tabs {
      display: flex;
      gap: 6px;
      background: rgba(15, 23, 42, 0.6);
      padding: 4px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--card-border);
      margin-bottom: 1.25rem;
      overflow-x: auto;
    }

    .pill-tab {
      padding: 0.45rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-dim);
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .pill-tab:hover {
      color: var(--text-pure);
    }

    .pill-tab.active {
      background: rgba(0, 242, 254, 0.14);
      color: var(--accent-cyan);
      border-color: rgba(0, 242, 254, 0.35);
      font-weight: 600;
    }

    /* Result Display Box */
    .result-panel {
      margin-top: 1.25rem;
      border-radius: var(--radius-md);
      padding: 1.25rem;
      border: 1px solid var(--card-border);
      background: rgba(15, 23, 42, 0.7);
      display: none;
      animation: fadeIn 0.25s ease;
    }

    .result-panel.visible {
      display: block;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .result-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      font-weight: 600;
    }

    .result-score-line {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .result-number {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 2.2rem;
      font-weight: 800;
      line-height: 1;
      color: #FFFFFF;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-pill);
      font-size: 0.82rem;
      font-weight: 600;
    }

    .badge-remission {
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.2);
    }

    .badge-low {
      background: rgba(6, 182, 212, 0.15);
      color: #38BDF8;
      border: 1px solid rgba(6, 182, 212, 0.35);
      box-shadow: 0 0 14px rgba(6, 182, 212, 0.2);
    }

    .badge-moderate {
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 0 14px rgba(245, 158, 11, 0.2);
    }

    .badge-high {
      background: rgba(244, 63, 94, 0.15);
      color: #FB7185;
      border: 1px solid rgba(244, 63, 94, 0.35);
      box-shadow: 0 0 14px rgba(244, 63, 94, 0.2);
    }

    .result-details {
      font-size: 0.82rem;
      color: var(--text-dim);
      line-height: 1.5;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 0.75rem;
      margin-top: 0.5rem;
    }

    /* Cutoff Legend Bar */
    .cutoff-bar {
      display: flex;
      margin-top: 0.85rem;
      border-radius: var(--radius-pill);
      overflow: hidden;
      height: 8px;
      background: rgba(255, 255, 255, 0.05);
    }
    .cutoff-seg {
      height: 100%;
      position: relative;
    }
    .cutoff-seg.remission { background: #10B981; flex: 26; }
    .cutoff-seg.low { background: #06B6D4; flex: 6; }
    .cutoff-seg.moderate { background: #F59E0B; flex: 19; }
    .cutoff-seg.high { background: #F43F5E; flex: 40; }

    .cutoff-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.68rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Checkbox & Radio lists */
    .checklist-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .check-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--card-border);
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.84rem;
      color: var(--text-dim);
    }

    .check-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-pure);
      border-color: rgba(255, 255, 255, 0.12);
    }

    .check-item input[type="checkbox"], .check-item input[type="radio"] {
      margin-top: 3px;
      accent-color: var(--accent-cyan);
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .check-domain-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0.75rem 0 0.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tier-badge {
      font-size: 0.68rem;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 600;
    }
    .tier-8 { background: rgba(244, 63, 94, 0.2); color: #FB7185; }
    .tier-4 { background: rgba(245, 158, 11, 0.2); color: #FBBF24; }
    .tier-2 { background: rgba(6, 182, 212, 0.2); color: #38BDF8; }
    .tier-1 { background: rgba(16, 185, 129, 0.2); color: #34D399; }

    /* Accordion / Collapsible */
    .accordion-card {
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      background: rgba(15, 23, 42, 0.5);
      margin-top: 1rem;
      overflow: hidden;
    }

    .accordion-header {
      padding: 0.85rem 1.15rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--text-dim);
      transition: background 0.2s;
    }

    .accordion-header:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-pure);
    }

    .accordion-content {
      padding: 1.15rem;
      border-top: 1px solid var(--card-border);
      font-size: 0.8rem;
      color: var(--text-dim);
      line-height: 1.6;
      display: none;
    }

    .accordion-content.open {
      display: block;
    }

    /* Comparison Table */
    .clinical-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
      margin: 0.75rem 0;
    }

    .clinical-table th, .clinical-table td {
      border: 1px solid var(--card-border);
      padding: 0.65rem 0.85rem;
      text-align: left;
    }

    .clinical-table th {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-pure);
      font-weight: 600;
    }

    /* Interactive Decision Tree in Diag Approach */
    .diag-tree-step {
      text-align: center;
      padding: 1.5rem 0;
    }

    .diag-question {
      font-size: 1.1rem;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 1.25rem;
      line-height: 1.4;
    }

    .diag-action-btns {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .diag-result-card {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      margin-top: 1.5rem;
      text-align: center;
    }

    /* Toast Notification */
    .toast-box {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(14px);
      border: 1px solid var(--accent-cyan);
      box-shadow: 0 10px 30px rgba(0, 242, 254, 0.25);
      border-radius: var(--radius-md);
      padding: 0.8rem 1.25rem;
      font-size: 0.84rem;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 100;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .toast-box.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Footer */
    .app-footer {
      border-top: 1px solid var(--card-border);
      background: rgba(10, 16, 31, 0.6);
      padding: 1.5rem 1.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      text-align: center;
    }

    .app-footer a {
      color: var(--accent-cyan);
      text-decoration: none;
    }
    .app-footer a:hover {
      text-decoration: underline;
    }

    /* Overlay for Mobile Drawer */
    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 45;
    }

    /* Responsive Queries */
    @media (max-width: 860px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-overlay.open {
        display: block;
      }

      .menu-btn {
        display: inline-flex;
      }

      .card-grid {
        grid-template-columns: 1fr;
      }

      .content-area {
        padding: 1.25rem 1rem 2.5rem;
      }
    }
  </style>
</head>
<body>
  <!-- Ambient Lighting Effects -->
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>

  <div class="app-layout">
    <!-- Mobile Backdrop Overlay -->
    <div id="mobile-overlay" class="mobile-overlay"></div>

    <!-- Sidebar Navigation -->
    <aside id="sidebar" class="sidebar">
      <div>
        <a href="#" class="brand-box">
          <div class="brand-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
          </div>
          <div>
            <div class="brand-title">RheumaTools</div>
            <div class="brand-badge">Clinical Suite</div>
          </div>
        </a>

        <div class="nav-section-title">Alat Diagnostik</div>
        <nav>
          <a href="#" class="nav-link active" data-page="ra">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Rheumatoid Arthritis</span>
          </a>
          <a href="#" class="nav-link" data-page="diag-approach">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>
            <span>Alur Nyeri Sendi</span>
          </a>
          <a href="#" class="nav-link" data-page="sle">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            <span>Systemic Lupus (SLE)</span>
          </a>
          <a href="#" class="nav-link" data-page="psa">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            <span>Psoriatic Arthritis</span>
          </a>
          <a href="#" class="nav-link" data-page="as">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
            <span>Ankylosing Spondylitis</span>
          </a>
          <a href="#" class="nav-link" data-page="ssc">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            <span>Systemic Sclerosis</span>
          </a>
          <a href="#" class="nav-link" data-page="gout">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4 8.014 8.014 0 014-7.465V3a1 1 0 012 0v6.535A8.014 8.014 0 0113 17a4 4 0 01-4 4H7z"/></svg>
            <span>Gout Arthritis</span>
          </a>
          <a href="#" class="nav-link" data-page="references">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <span>Pustaka & Referensi</span>
          </a>
        </nav>
      </div>

      <div class="sidebar-footer">
        <a href="mailto:putrawan.2371041010@student.unud.ac.id" class="feedback-pill" style="width: 100%; justify-content: center;">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Feedback Dokter
        </a>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <header class="top-header">
        <div class="header-left">
          <button id="menu-btn" class="menu-btn" aria-label="Buka Menu">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div class="header-title-box">
            <h1 id="page-title">Rheumatoid Arthritis</h1>
            <p id="page-subtitle">Kriteria Klasifikasi ACR/EULAR 2010 & Skor Aktivitas DAS28 / CDAI / SDAI</p>
          </div>
        </div>
        <div class="header-actions">
          <a href="mailto:putrawan.2371041010@student.unud.ac.id" class="feedback-pill">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Feedback</span>
          </a>
        </div>
      </header>

      <main class="content-area">

        <!-- ================= PAGE 1: RHEUMATOID ARTHRITIS ================= -->
        <section id="ra-page" class="content-page active">
          <div class="card-grid">
            <!-- Diagnosis Criteria Card -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Kriteria Klasifikasi ACR/EULAR 2010
                </h3>
                <p>Klasifikasi RA definit bila skor total &ge; 6 dari 10 poin (pasien dengan sinovitis minimal 1 sendi).</p>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">A. Keterlibatan Sendi (0-5 poin)</label>
                  <select id="ra-joint" class="input-field">
                    <option value="0">1 sendi besar (bahu, siku, panggul, lutut, pergelangan kaki) (0 poin)</option>
                    <option value="1">2-10 sendi besar (1 poin)</option>
                    <option value="2">1-3 sendi kecil (MCP, PIP, MTP 2-5, ibu jari) (2 poin)</option>
                    <option value="3">4-10 sendi kecil (3 poin)</option>
                    <option value="5">>10 sendi (minimal 1 sendi kecil) (5 poin)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">B. Serologi (0-3 poin)</label>
                  <select id="ra-serology" class="input-field">
                    <option value="0">RF Negatif DAN ACPA/anti-CCP Negatif (0 poin)</option>
                    <option value="2">RF Positif Rendah ATAU ACPA Positif Rendah (&le; 3x ULN) (2 poin)</option>
                    <option value="3">RF Positif Tinggi ATAU ACPA Positif Tinggi (> 3x ULN) (3 poin)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">C. Reaktan Fase Akut (0-1 poin)</label>
                  <select id="ra-apr" class="input-field">
                    <option value="0">CRP Normal DAN LED/ESR Normal (0 poin)</option>
                    <option value="1">CRP Abnormal ATAU LED/ESR Abnormal (1 poin)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">D. Durasi Gejala Sinovitis (0-1 poin)</label>
                  <select id="ra-duration" class="input-field">
                    <option value="0">&lt; 6 Minggu (0 poin)</option>
                    <option value="1">&ge; 6 Minggu (1 poin)</option>
                  </select>
                </div>

                <div class="btn-group">
                  <button id="btn-calc-ra-acr" class="btn btn-primary" style="flex: 1;">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Evaluasi Kriteria
                  </button>
                  <button id="btn-reset-ra-acr" class="btn btn-secondary">Reset</button>
                </div>

                <div id="ra-acr-result" class="result-panel">
                  <div class="result-header">
                    <span class="result-title">Hasil Klasifikasi ACR/EULAR 2010</span>
                  </div>
                  <div class="result-score-line">
                    <div id="ra-acr-score" class="result-number">0 / 10</div>
                    <div id="ra-acr-badge" class="status-badge">Menunggu Evaluasi</div>
                  </div>
                  <div id="ra-acr-desc" class="result-details"></div>
                </div>
              </div>
              <div class="card-footer-ref">
                <span>Referensi: Aletaha D, et al. Arthritis Rheum 2010;62(9):2569–81</span>
              </div>
            </div>

            <!-- Disease Activity Suite Card (DAS28 / CDAI / SDAI) -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  Skor Aktivitas Penyakit Artritis Reumatoid
                </h3>
                <p>Kalkulator tervalidasi klinis: DAS28-CRP, DAS28-LED (ESR), CDAI, dan SDAI.</p>
              </div>

              <!-- Sub-tabs for Calculators -->
              <div class="pill-tabs" id="ra-calc-tabs">
                <div class="pill-tab active" data-tab="das-crp">DAS28-CRP</div>
                <div class="pill-tab" data-tab="das-esr">DAS28-LED (ESR)</div>
                <div class="pill-tab" data-tab="cdai">CDAI</div>
                <div class="pill-tab" data-tab="sdai">SDAI</div>
              </div>

              <!-- Benchmark Loader Button -->
              <div style="display: flex; justify-content: flex-end; margin-bottom: 0.75rem;">
                <button id="btn-load-benchmark-ra" class="btn btn-sample" title="Muat Kasus Uji Benchmark Klinis">
                  <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Muat Kasus Benchmark (TJC 6, SJC 4, CRP 15, PGA 40)
                </button>
              </div>

              <div class="card-body">
                <!-- Common / Shared Inputs -->
                <div class="form-group">
                  <label class="form-label">
                    <span>Jumlah Sendi Nyeri (TJC28)</span>
                    <span class="form-hint">Rentang: 0 - 28</span>
                  </label>
                  <input type="number" id="ra-tjc" class="input-field" min="0" max="28" placeholder="0 - 28 sendi">
                  <span id="err-ra-tjc" class="error-msg">TJC wajib diisi antara 0 dan 28 sendi.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>Jumlah Sendi Bengkak (SJC28)</span>
                    <span class="form-hint">Rentang: 0 - 28</span>
                  </label>
                  <input type="number" id="ra-sjc" class="input-field" min="0" max="28" placeholder="0 - 28 sendi">
                  <span id="err-ra-sjc" class="error-msg">SJC wajib diisi antara 0 dan 28 sendi.</span>
                </div>

                <!-- Tab-Specific Inputs -->
                <!-- 1. DAS28-CRP fields -->
                <div id="fields-das-crp">
                  <div class="form-group">
                    <label class="form-label">
                      <span>C-Reactive Protein (CRP)</span>
                      <span class="form-hint">Satuan: <b>mg/L</b> (&ge; 0 mg/L)</span>
                    </label>
                    <input type="number" id="ra-crp-mgl" class="input-field" min="0" step="0.1" placeholder="e.g., 15 (mg/L)">
                    <span id="err-ra-crp" class="error-msg">CRP wajib diisi &ge; 0 mg/L (termasuk 0 bila tidak terdeteksi).</span>
                  </div>
                  <div class="form-group" style="margin-top: 0.75rem;">
                    <label class="form-label">
                      <span>Penilaian Global Pasien (PGA)</span>
                      <span class="form-hint">VAS: 0 - 100 mm</span>
                    </label>
                    <input type="number" id="ra-pga-100" class="input-field" min="0" max="100" placeholder="0 - 100 mm">
                    <span id="err-ra-pga-100" class="error-msg">PGA VAS wajib diisi antara 0 dan 100 mm.</span>
                  </div>
                </div>

                <!-- 2. DAS28-ESR fields -->
                <div id="fields-das-esr" style="display: none;">
                  <div class="form-group">
                    <label class="form-label">
                      <span>Laju Endap Darah (LED / ESR)</span>
                      <span class="form-hint">Satuan: <b>mm/jam</b> (&ge; 1 mm/jam)</span>
                    </label>
                    <input type="number" id="ra-esr" class="input-field" min="1" max="150" placeholder="e.g., 30 (mm/jam)">
                    <span id="err-ra-esr" class="error-msg">LED / ESR wajib diisi &ge; 1 mm/jam [ln(&le;0) tidak terdefinisi].</span>
                  </div>
                  <div class="form-group" style="margin-top: 0.75rem;">
                    <label class="form-label">
                      <span>Penilaian Global Pasien (PGA)</span>
                      <span class="form-hint">VAS: 0 - 100 mm</span>
                    </label>
                    <input type="number" id="ra-pga-esr" class="input-field" min="0" max="100" placeholder="0 - 100 mm">
                    <span id="err-ra-pga-esr" class="error-msg">PGA VAS wajib diisi antara 0 dan 100 mm.</span>
                  </div>
                </div>

                <!-- 3. CDAI fields -->
                <div id="fields-cdai" style="display: none;">
                  <div class="form-group">
                    <label class="form-label">
                      <span>Penilaian Global Pasien (PGA 0-10)</span>
                      <span class="form-hint">VAS: 0.0 - 10.0 cm</span>
                    </label>
                    <input type="number" id="ra-pga-10" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                    <span id="err-ra-pga-10" class="error-msg">PGA wajib diisi antara 0 dan 10.</span>
                  </div>
                  <div class="form-group" style="margin-top: 0.75rem;">
                    <label class="form-label">
                      <span>Penilaian Global Dokter / Evaluator (EGA 0-10)</span>
                      <span class="form-hint">VAS: 0.0 - 10.0 cm</span>
                    </label>
                    <input type="number" id="ra-ega-10" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                    <span id="err-ra-ega-10" class="error-msg">EGA wajib diisi antara 0 dan 10.</span>
                  </div>
                </div>

                <!-- 4. SDAI fields -->
                <div id="fields-sdai" style="display: none;">
                  <div class="form-group">
                    <label class="form-label">
                      <span>Penilaian Global Pasien (PGA 0-10)</span>
                      <span class="form-hint">VAS: 0.0 - 10.0 cm</span>
                    </label>
                    <input type="number" id="ra-sdai-pga" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                    <span id="err-ra-sdai-pga" class="error-msg">PGA wajib diisi antara 0 dan 10.</span>
                  </div>
                  <div class="form-group" style="margin-top: 0.75rem;">
                    <label class="form-label">
                      <span>Penilaian Global Dokter (EGA 0-10)</span>
                      <span class="form-hint">VAS: 0.0 - 10.0 cm</span>
                    </label>
                    <input type="number" id="ra-sdai-ega" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                    <span id="err-ra-sdai-ega" class="error-msg">EGA wajib diisi antara 0 dan 10.</span>
                  </div>
                  <div class="form-group" style="margin-top: 0.75rem;">
                    <label class="form-label">
                      <span>Kadar CRP (mg/dL)</span>
                      <span class="form-hint">Catatan: <b>1 mg/dL = 10 mg/L</b></span>
                    </label>
                    <input type="number" id="ra-sdai-crp" class="input-field" min="0" step="0.01" placeholder="e.g., 1.5 (mg/dL)">
                    <span id="err-ra-sdai-crp" class="error-msg">CRP (mg/dL) wajib diisi &ge; 0.</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="btn-group">
                  <button id="btn-calc-ra-activity" class="btn btn-primary" style="flex: 1;">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Hitung Aktivitas Penyakit
                  </button>
                  <button id="btn-copy-ra-result" class="btn btn-secondary" title="Salin Catatan Klinis">
                    <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                    Salin
                  </button>
                  <button id="btn-reset-ra-activity" class="btn btn-secondary">Reset</button>
                </div>

                <!-- Calculation Result Panel -->
                <div id="ra-activity-result" class="result-panel">
                  <div class="result-header">
                    <span id="ra-res-title" class="result-title">Hasil Skor Aktivitas Penyakit</span>
                  </div>
                  <div class="result-score-line">
                    <div id="ra-res-number" class="result-number">--</div>
                    <div id="ra-res-badge" class="status-badge">Menunggu Input</div>
                  </div>

                  <!-- Cutoff Range Visualizer -->
                  <div class="cutoff-bar">
                    <div class="cutoff-seg remission" title="Remisi"></div>
                    <div class="cutoff-seg low" title="Aktivitas Rendah"></div>
                    <div class="cutoff-seg moderate" title="Aktivitas Sedang"></div>
                    <div class="cutoff-seg high" title="Aktivitas Tinggi"></div>
                  </div>
                  <div id="ra-cutoff-labels" class="cutoff-labels">
                    <span>Remisi: &le;2.60</span>
                    <span>Rendah: 2.61-3.20</span>
                    <span>Sedang: 3.21-5.10</span>
                    <span>Tinggi: >5.10</span>
                  </div>

                  <div id="ra-res-details" class="result-details"></div>
                </div>

              </div>
              <div class="card-footer-ref">
                <span id="ra-formula-ref">Formula: 0.56*&radic;(TJC) + 0.28*&radic;(SJC) + 0.36*ln(CRP+1) + 0.014*(PGA) + 0.96</span>
              </div>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 2: ALUR PENDEKATAN NYERI SENDI ================= -->
        <section id="diag-approach-page" class="content-page">
          <div class="card" style="max-width: 820px; margin: 0 auto;">
            <div class="card-header" style="text-align: center;">
              <h2>
                <svg width="20" height="20" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>
                Algoritma Diagnosis Interaktif Nyeri Sendi
              </h2>
              <p>Panduan langkah demi langkah berdasarkan Rekomendasi Perhimpunan Reumatologi Indonesia (IRA 2020).</p>
            </div>

            <div class="card-body">
              <div id="diag-steps-container">
                <div id="step-trauma" class="diag-tree-step">
                  <p class="diag-question">1. Apakah terdapat riwayat trauma fisik akut?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan: Strain / Sprain Ligamen, Fraktur Tulang, atau Robekan Meniskus/Tendon. Rujuk bedah ortopedi / evaluasi radiologis segera.">Ya (Ada Riwayat Trauma)</button>
                    <button class="btn btn-primary diag-btn" data-next-step="step-articular">Tidak (Non-Trauma)</button>
                  </div>
                </div>

                <div id="step-articular" class="diag-tree-step" style="display: none;">
                  <p class="diag-question">2. Apakah keluhan berasal dari intra-sendi (Artikular) atau luar sendi (Non-Artikular)?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-primary diag-btn" data-next-step="step-duration">Artikular (Nyeri pada joint line, lingkup gerak terbatas simetris)</button>
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Non-Artikular: Fibromialgia, Polimialgia Reumatika (PMR), Tendinitis / Tenosinovitis, Bursitis, Entesitis, Miopati / Miositis.">Non-Artikular (Periartikular)</button>
                  </div>
                </div>

                <div id="step-duration" class="diag-tree-step" style="display: none;">
                  <p class="diag-question">3. Berapa lama durasi keluhan nyeri sendi berlangsung?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-primary diag-btn" data-next-step="step-inflammation-acute">Akut (&lt; 6 Minggu)</button>
                    <button class="btn btn-primary diag-btn" data-next-step="step-inflammation-chronic">Kronis (&ge; 6 Minggu)</button>
                  </div>
                </div>

                <div id="step-inflammation-acute" class="diag-tree-step" style="display: none;">
                  <p class="diag-question">4. Pada keluhan Akut (&lt;6 mgg), apakah terdapat tanda inflamasi (hangat, bengkak, kaku pagi >30 menit)?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-primary diag-btn" data-next-step="step-joint-count-acute">Ya (Inflamasi Positif)</button>
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Artropati Non-Inflamasi Akut: Hemartrosis (perdarahan intraartikular), trauma mikro, atau fase awal disrupsi mekanik.">Tidak (Non-Inflamasi)</button>
                  </div>
                </div>

                <div id="step-inflammation-chronic" class="diag-tree-step" style="display: none;">
                  <p class="diag-question">4. Pada keluhan Kronis (&ge;6 mgg), apakah terdapat tanda inflamasi (hangat, bengkak, kaku pagi >30 menit)?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-primary diag-btn" data-next-step="step-joint-count-chronic">Ya (Inflamasi Kronis)</button>
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Artropati Non-Inflamasi Kronis: Osteoartritis (OA), Osteonekrosis / Avascular Necrosis, Artropati Charcot (Neuropatik), Hemokromatosis.">Tidak (Non-Inflamasi)</button>
                  </div>
                </div>

                <div id="step-joint-count-acute" class="diag-tree-step" style="display: none;">
                  <p class="diag-question">5. Berapa jumlah sendi yang terlibat dalam inflamasi akut?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Mono / Oligoartritis Akut (1-4 sendi): Artritis Septik / Infeksiosa (WASPADA EMERGENSI!), Gout Artritis Akut, Pseudogout (CPPD), Artritis Reaktif.">1 - 4 Sendi (Mono/Oligoartritis)</button>
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Poliartritis Akut (>4 sendi): Artritis Viral (Dengue, Chikungunya, Parvovirus B19, Hepatitis B/C), Demam Reumatik Akut, Artritis Psoriatik (onset awal), Artritis Enteropatik.">> 4 Sendi (Poliartritis)</button>
                  </div>
                </div>

                <div id="step-joint-count-chronic" class="diag-tree-step" style="display: none;">
                  <p class="diag-question">5. Berapa jumlah sendi yang terlibat dalam inflamasi kronis?</p>
                  <div class="diag-action-btns">
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Mono / Oligoartritis Kronis (1-4 sendi): Artritis Tuberkulosis / Fungal, Spondiloartropati (Ankylosing Spondylitis, PsA), Gout Kronis Bertofus, Vaskulitis, Sarkoidosis.">1 - 4 Sendi (Mono/Oligoartritis)</button>
                    <button class="btn btn-secondary diag-btn" data-result="Kemungkinan Poliartritis Kronis (>4 sendi): Artritis Reumatoid (AR), Lupus Eritematosus Sistemik (LES), Sklerosis Sistemik, Sindrom Sjogren, Penyakit Jaringan Ikat Campuran (MCTD).">> 4 Sendi (Poliartritis)</button>
                  </div>
                </div>
              </div>

              <!-- Result Container -->
              <div id="diag-result-box" class="diag-result-card" style="display: none;">
                <div style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Hasil Penelusuran Klinis:</div>
                <div id="diag-result-text" style="font-size: 1.05rem; font-weight: 700; color: #34D399; line-height: 1.5;"></div>
                <button id="btn-reset-diag" class="btn btn-primary" style="margin-top: 1.25rem;">Mulai Penelusuran Baru</button>
              </div>

              <!-- Collapsible Clinical Guide -->
              <div class="accordion-card">
                <div class="accordion-header" id="toggle-articular-def">
                  <span>Tabel Diferensiasi: Artikular vs Non-Artikular & Inflamasi</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div class="accordion-content" id="content-articular-def">
                  <table class="clinical-table">
                    <thead>
                      <tr><th>Pemeriksaan Klinis</th><th>Artikular</th><th>Non-Artikular (Periartikular)</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Lingkup Gerak Sendi (ROM)</td><td>Terbatas pada semua bidang gerak</td><td>Terbatas hanya pada bidang tendon/ligamen terkait</td></tr>
                      <tr><td>Gerakan Aktif vs Pasif</td><td>Terbatas pada gerakan aktif DAN pasif</td><td>Nyeri/terbatas terutama pada gerakan aktif</td></tr>
                      <tr><td>Nyeri Tekan (Tenderness)</td><td>Pada garis sendi (joint line)</td><td>Pada insersi tendon, bursa, atau massa otot</td></tr>
                      <tr><td>Bengkak / Efusi</td><td>Menyeluruh (diffuse) melingkupi kapsul sendi</td><td>Terlokalisir (fokal) di bursa atau selubung tendon</td></tr>
                    </tbody>
                  </table>
                  <div style="margin-top: 0.75rem;">
                    <p><b>Kaku Pagi (Morning Stiffness):</b> Inflamasi &ge; 30-60 menit (membaik dengan aktivitas); Non-inflamasi &lt; 30 menit (memburuk dengan aktivitas).</p>
                    <p style="margin-top: 4px;"><b>Pola Progresi:</b> Aditif (menjalar bertambah, misal AR), Migratori (berpindah sembuh di satu sendi timbul di sendi lain, misal Demam Reumatik), Intermiten (episodik berulang dengan resolusi komplit, misal Gout).</p>
                  </div>
                </div>
              </div>

            </div>
            <div class="card-footer-ref">
              <span>Buku Saku Reumatologi Perhimpunan Reumatologi Indonesia (IRA 2020)</span>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 3: SYSTEMIC LUPUS ERYTHEMATOSUS (SLE) ================= -->
        <section id="sle-page" class="content-page">
          <div class="card-grid">
            <!-- Classification Criteria EULAR/ACR 2019 -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  Kriteria Klasifikasi SLE (EULAR/ACR 2019)
                </h3>
                <p>Prasyarat: ANA titer &ge; 1:80. Hitung poin tertinggi per domain. Skor &ge; 10 mengklasifikasikan SLE.</p>
              </div>

              <div class="card-body" style="max-height: 520px; overflow-y: auto; padding-right: 6px;">
                <!-- Entry Criterion Check -->
                <label class="check-item" style="border-color: rgba(0, 242, 254, 0.35); background: rgba(0, 242, 254, 0.05);">
                  <input type="checkbox" id="sle-ana-entry" checked>
                  <div>
                    <span style="font-weight: 700; color: #FFFFFF;">Prasyarat Masuk: ANA Positif &ge; 1:80 pada sel HEp-2</span>
                    <div style="font-size: 0.74rem; color: var(--accent-cyan);">Wajib positif untuk dapat mengaplikasikan kriteria EULAR/ACR 2019</div>
                  </div>
                </label>

                <!-- Domain 1: Konstitusional -->
                <div class="check-domain-title">1. Konstitusional</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="2" class="sle-acr-item">Demam > 38.3&deg;C tanpa infeksi (2)</label>
                </div>

                <!-- Domain 2: Muskuloskeletal -->
                <div class="check-domain-title">2. Muskuloskeletal</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="6" class="sle-acr-item">Artritis / Sinovitis &ge; 2 sendi atau nyeri tekan & kaku pagi &ge; 30 mnt (6)</label>
                </div>

                <!-- Domain 3: Hematologi -->
                <div class="check-domain-title">3. Hematologi (Pilih skor tertinggi)</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="sle-hem" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="sle-hem" value="3">Leukopenia &lt; 4.000 / &mu;L (3)</label>
                  <label class="check-item"><input type="radio" name="sle-hem" value="4">Trombositopenia &lt; 100.000 / &mu;L (4)</label>
                  <label class="check-item"><input type="radio" name="sle-hem" value="4">Anemia Hemolitik Autoimun (Coomb+) (4)</label>
                </div>

                <!-- Domain 4: Neuropsikiatri -->
                <div class="check-domain-title">4. Neuropsikiatri (Pilih skor tertinggi)</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="sle-neuro" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="sle-neuro" value="2">Delirium akut (2)</label>
                  <label class="check-item"><input type="radio" name="sle-neuro" value="3">Psikosis lupus (3)</label>
                  <label class="check-item"><input type="radio" name="sle-neuro" value="5">Kejang (5)</label>
                </div>

                <!-- Domain 5: Mukokutan -->
                <div class="check-domain-title">5. Mukokutan (Pilih skor tertinggi)</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="sle-skin" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="sle-skin" value="2">Non-scarring Alopecia (2)</label>
                  <label class="check-item"><input type="radio" name="sle-skin" value="2">Ulkus oral (2)</label>
                  <label class="check-item"><input type="radio" name="sle-skin" value="4">Lupus kutan subakut / diskoid (4)</label>
                  <label class="check-item"><input type="radio" name="sle-skin" value="6">Lupus kutan akut (malar rash) (6)</label>
                </div>

                <!-- Domain 6: Serosa -->
                <div class="check-domain-title">6. Serosa (Pilih skor tertinggi)</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="sle-serosa" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="sle-serosa" value="5">Efusi pleura atau perikardial (5)</label>
                  <label class="check-item"><input type="radio" name="sle-serosa" value="6">Perikarditis akut (6)</label>
                </div>

                <!-- Domain 7: Renal -->
                <div class="check-domain-title">7. Renal (Pilih skor tertinggi)</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="sle-renal" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="sle-renal" value="4">Proteinuria > 0.5 g / 24 jam (4)</label>
                  <label class="check-item"><input type="radio" name="sle-renal" value="8">Biopsi: Nefritis Lupus Kelas II / V (8)</label>
                  <label class="check-item"><input type="radio" name="sle-renal" value="10">Biopsi: Nefritis Lupus Kelas III / IV (10)</label>
                </div>

                <!-- Domain 8: Antibodi Antifosfolipid -->
                <div class="check-domain-title">8. Antibodi Antifosfolipid</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="2" class="sle-acr-item">aCL IgG/IgM tinggi, anti-&beta;2GP1, atau Lupus Antikoagulan (2)</label>
                </div>

                <!-- Domain 9: Komplemen -->
                <div class="check-domain-title">9. Komplemen (Pilih skor tertinggi)</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="sle-comp" value="0" checked>Normal (0)</label>
                  <label class="check-item"><input type="radio" name="sle-comp" value="3">C3 rendah ATAU C4 rendah (3)</label>
                  <label class="check-item"><input type="radio" name="sle-comp" value="4">C3 rendah DAN C4 rendah (4)</label>
                </div>

                <!-- Domain 10: Antibodi Spesifik SLE -->
                <div class="check-domain-title">10. Antibodi Spesifik</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="6" class="sle-acr-item">Anti-dsDNA ATAU Anti-Smith (Sm) Positif (6)</label>
                </div>
              </div>

              <div class="btn-group">
                <button id="btn-calc-sle-acr" class="btn btn-primary" style="flex: 1;">Hitung Skor SLE</button>
                <button id="btn-reset-sle-acr" class="btn btn-secondary">Reset</button>
              </div>

              <div id="sle-acr-result" class="result-panel">
                <div class="result-header"><span class="result-title">Hasil Evaluasi SLE</span></div>
                <div class="result-score-line">
                  <div id="sle-acr-score-num" class="result-number">0 Poin</div>
                  <div id="sle-acr-badge" class="status-badge">Menunggu Evaluasi</div>
                </div>
                <div id="sle-acr-text" class="result-details"></div>
              </div>

              <div class="card-footer-ref">
                <span>Referensi: Aringer M, et al. Arthritis Rheumatol 2019;71(9):1400–12</span>
              </div>
            </div>

            <!-- Activity Calculator: SLEDAI-2K -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Skor Aktivitas Penyakit SLE (SLEDAI-2K)
                </h3>
                <p>Centang manifestasi klinis dan laboratoris yang muncul / persisten dalam 30 hari terakhir.</p>
              </div>

              <div class="card-body" style="max-height: 520px; overflow-y: auto; padding-right: 6px;">
                <!-- Bobot 8 -->
                <div class="check-domain-title"><span class="tier-badge tier-8">Bobot 8 (Aktivitas Berat)</span></div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Kejang onset baru (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Psikosis lupus tanpa delirium (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Organic Brain Syndrome (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Gangguan visual (retinitis, eksudat, skleritis) (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Defisit saraf kranial onset baru (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Sakit kepala lupus berat persisten (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">CVA / Stroke lupus baru (8)</label>
                  <label class="check-item"><input type="checkbox" data-score="8" class="sledai-item">Vaskulitis (gangren, infark periungual, ulserasi) (8)</label>
                </div>

                <!-- Bobot 4 -->
                <div class="check-domain-title" style="margin-top: 1rem;"><span class="tier-badge tier-4">Bobot 4 (Aktivitas Sedang)</span></div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="4" class="sledai-item">Artritis (> 2 sendi nyeri dan bengkak) (4)</label>
                  <label class="check-item"><input type="checkbox" data-score="4" class="sledai-item">Miositis proksimal (4)</label>
                  <label class="check-item"><input type="checkbox" data-score="4" class="sledai-item">Silinder urin (granular / sel darah merah) (4)</label>
                  <label class="check-item"><input type="checkbox" data-score="4" class="sledai-item">Hematuria (> 5 eritrosit/LPB non-infeksi) (4)</label>
                  <label class="check-item"><input type="checkbox" data-score="4" class="sledai-item">Proteinuria onset baru (> 0.5 g/24 jam) (4)</label>
                  <label class="check-item"><input type="checkbox" data-score="4" class="sledai-item">Piuria (> 5 leukosit/LPB non-infeksi) (4)</label>
                </div>

                <!-- Bobot 2 -->
                <div class="check-domain-title" style="margin-top: 1rem;"><span class="tier-badge tier-2">Bobot 2 (Aktivitas Ringan)</span></div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Ruam inflamasi baru / rekuren (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Alopesia difus / bercak non-scarring (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Ulkus mukosa oral / nasal (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Pleuritis dengan rub atau efusi (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Perikarditis dengan rub atau EKG khas (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Komplemen rendah (C3 / C4 di bawah normal) (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="sledai-item">Peningkatan anti-dsDNA di atas rentang normal (2)</label>
                </div>

                <!-- Bobot 1 -->
                <div class="check-domain-title" style="margin-top: 1rem;"><span class="tier-badge tier-1">Bobot 1 (Aktivitas Minimal)</span></div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="1" class="sledai-item">Demam > 38.0&deg;C non-infeksi (1)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="sledai-item">Trombositopenia &lt; 100.000 / &mu;L (1)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="sledai-item">Leukopenia &lt; 4.000 / &mu;L (1)</label>
                </div>
              </div>

              <div class="btn-group">
                <button id="btn-calc-sledai" class="btn btn-primary" style="flex: 1;">Hitung SLEDAI-2K</button>
                <button id="btn-reset-sledai" class="btn btn-secondary">Reset</button>
              </div>

              <div id="sledai-result" class="result-panel">
                <div class="result-header"><span class="result-title">Hasil Skor SLEDAI-2K</span></div>
                <div class="result-score-line">
                  <div id="sledai-score-num" class="result-number">0</div>
                  <div id="sledai-badge" class="status-badge">Tidak Ada Aktivitas</div>
                </div>
                <div id="sledai-desc" class="result-details"></div>
              </div>

              <div class="card-footer-ref">
                <span>Referensi: Gladman DD, et al. J Rheumatol 2002;29(2):288–91</span>
              </div>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 4: PSORIATIC ARTHRITIS ================= -->
        <section id="psa-page" class="content-page">
          <div class="card-grid">
            <!-- CASPAR Criteria -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                  Kriteria Klasifikasi CASPAR (2006)
                </h3>
                <p>Prasyarat: terdapat penyakit sendi inflamasi (sendi, tulang belakang, atau entesis). Skor &ge; 3 mengklasifikasikan sebagai PsA.</p>
              </div>

              <div class="card-body">
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="2" class="caspar-item">Psoriasis kutan saat ini (Skor 2)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="caspar-item">Riwayat psoriasis pribadi / keluarga tingkat 1 (Skor 1)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="caspar-item">Distrofi kuku psoriatik (pitting, onikolisis, hiperkeratosis) (Skor 1)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="caspar-item">Faktor Reumatoid (RF) negatif (Skor 1)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="caspar-item">Daktilitis (saat ini atau riwayat daktilitis oleh dokter) (Skor 1)</label>
                  <label class="check-item"><input type="checkbox" data-score="1" class="caspar-item">Bukti radiologis formasi tulang baru juxta-artikular (Skor 1)</label>
                </div>

                <div class="btn-group">
                  <button id="btn-calc-caspar" class="btn btn-primary" style="flex: 1;">Evaluasi CASPAR</button>
                  <button id="btn-reset-caspar" class="btn btn-secondary">Reset</button>
                </div>

                <div id="caspar-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Hasil Kriteria CASPAR</span></div>
                  <div class="result-score-line">
                    <div id="caspar-score-num" class="result-number">0 / 6</div>
                    <div id="caspar-badge" class="status-badge">Menunggu Evaluasi</div>
                  </div>
                  <div id="caspar-desc" class="result-details"></div>
                </div>
              </div>
              <div class="card-footer-ref">
                <span>Referensi: Taylor W, et al. Arthritis Rheum 2006;54(8):2665–73</span>
              </div>
            </div>

            <!-- DAPSA Disease Activity Calculator -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  Skor Aktivitas Penyakit PsA (DAPSA)
                </h3>
                <p>Disease Activity Index for Psoriatic Arthritis: TJC68 + SJC66 + CRP(mg/dL) + PGA(0-10) + Nyeri(0-10).</p>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">
                    <span>Jumlah Sendi Nyeri (0 - 68)</span>
                  </label>
                  <input type="number" id="psa-tjc" class="input-field" min="0" max="68" placeholder="0 - 68">
                  <span id="err-psa-tjc" class="error-msg">Wajib diisi antara 0 dan 68.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>Jumlah Sendi Bengkak (0 - 66)</span>
                  </label>
                  <input type="number" id="psa-sjc" class="input-field" min="0" max="66" placeholder="0 - 66">
                  <span id="err-psa-sjc" class="error-msg">Wajib diisi antara 0 dan 66.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>Kadar CRP (mg/dL)</span>
                    <span class="form-hint">Contoh: 15 mg/L = 1.5 mg/dL</span>
                  </label>
                  <input type="number" id="psa-crp" class="input-field" min="0" step="0.1" placeholder="e.g., 1.5 (mg/dL)">
                  <span id="err-psa-crp" class="error-msg">CRP (mg/dL) wajib diisi &ge; 0.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>Penilaian Global Pasien (0 - 10)</span>
                  </label>
                  <input type="number" id="psa-pga" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-psa-pga" class="error-msg">PGA wajib diisi antara 0 dan 10.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>Skala Nyeri Pasien (0 - 10)</span>
                  </label>
                  <input type="number" id="psa-pain" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-psa-pain" class="error-msg">Skala nyeri wajib diisi antara 0 dan 10.</span>
                </div>

                <div class="btn-group">
                  <button id="btn-calc-dapsa" class="btn btn-primary" style="flex: 1;">Hitung DAPSA</button>
                  <button id="btn-reset-dapsa" class="btn btn-secondary">Reset</button>
                </div>

                <div id="dapsa-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Hasil Skor DAPSA</span></div>
                  <div class="result-score-line">
                    <div id="dapsa-score-num" class="result-number">--</div>
                    <div id="dapsa-badge" class="status-badge">Menunggu Input</div>
                  </div>
                  <div id="dapsa-desc" class="result-details"></div>
                </div>
              </div>
              <div class="card-footer-ref">
                <span>Cutoff: &le;4 Remisi | 4.1-14 Rendah | 14.1-28 Sedang | >28 Tinggi</span>
              </div>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 5: ANKYLOSING SPONDYLITIS ================= -->
        <section id="as-page" class="content-page">
          <div class="card-grid">
            <!-- ASAS Classification -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
                  Kriteria Klasifikasi SpA Aksial (ASAS 2009)
                </h3>
                <p>Untuk pasien dengan nyeri punggung kronis &ge; 3 bulan dan onset usia &lt; 45 tahun.</p>
              </div>

              <div class="card-body">
                <div class="check-domain-title">Pilar Utama (Pilih yang positif):</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" id="as-sacroiliitis">Sakroilitis pada Pencitraan (MRI aktif atau X-ray definit)</label>
                  <label class="check-item"><input type="checkbox" id="as-hla-b27">HLA-B27 Positif</label>
                </div>

                <div class="check-domain-title" style="margin-top: 1rem;">Fitur Spondiloartritis (SpA Features):</div>
                <div class="checklist-container" style="max-height: 250px; overflow-y: auto;">
                  <label class="check-item"><input type="checkbox" class="as-feature">Nyeri punggung inflamasi (IBP)</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Artritis perifer</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Entesitis (tendon Achilles / fasia plantar)</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Uveitis anterior akut</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Daktilitis</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Psoriasis</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Penyakit Crohn / Kolitis Ulseratif (IBD)</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Respon baik terhadap NSAID (24-48 jam)</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Riwayat keluarga SpA tingkat 1/2</label>
                  <label class="check-item"><input type="checkbox" class="as-feature">Peningkatan CRP / LED tanpa penyebab lain</label>
                </div>

                <div class="btn-group">
                  <button id="btn-calc-as-asas" class="btn btn-primary" style="flex: 1;">Evaluasi ASAS</button>
                  <button id="btn-reset-as-asas" class="btn btn-secondary">Reset</button>
                </div>

                <div id="as-asas-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Hasil Klasifikasi ASAS</span></div>
                  <div class="result-score-line">
                    <div id="as-asas-badge" class="status-badge">Menunggu Evaluasi</div>
                  </div>
                  <div id="as-asas-desc" class="result-details"></div>
                </div>
              </div>
              <div class="card-footer-ref">
                <span>Referensi: Rudwaleit M, et al. Ann Rheum Dis 2009;68(6):770–6</span>
              </div>
            </div>

            <!-- BASDAI Disease Activity Calculator -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Skor Aktivitas BASDAI
                </h3>
                <p>Bath Ankylosing Spondylitis Disease Activity Index (0-10 skala VAS untuk 7 hari terakhir). Skor &ge; 4 menandakan penyakit aktif.</p>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label class="form-label"><span>1. Tingkat kelelahan / lesu (fatigue)?</span></label>
                  <input type="number" id="basdai-q1" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-basdai-q1" class="error-msg">Wajib diisi 0 - 10.</span>
                </div>

                <div class="form-group">
                  <label class="form-label"><span>2. Tingkat nyeri leher, punggung, atau panggul?</span></label>
                  <input type="number" id="basdai-q2" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-basdai-q2" class="error-msg">Wajib diisi 0 - 10.</span>
                </div>

                <div class="form-group">
                  <label class="form-label"><span>3. Tingkat nyeri / bengkak sendi perifer lainnya?</span></label>
                  <input type="number" id="basdai-q3" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-basdai-q3" class="error-msg">Wajib diisi 0 - 10.</span>
                </div>

                <div class="form-group">
                  <label class="form-label"><span>4. Tingkat nyeri saat area entesis disentuh/ditekan?</span></label>
                  <input type="number" id="basdai-q4" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-basdai-q4" class="error-msg">Wajib diisi 0 - 10.</span>
                </div>

                <div class="form-group">
                  <label class="form-label"><span>5. Tingkat keparahan kaku pagi hari?</span></label>
                  <input type="number" id="basdai-q5" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-basdai-q5" class="error-msg">Wajib diisi 0 - 10.</span>
                </div>

                <div class="form-group">
                  <label class="form-label"><span>6. Durasi kaku pagi hari (0 = 0 jam, 5 = 1 jam, 10 = &ge;2 jam)?</span></label>
                  <input type="number" id="basdai-q6" class="input-field" min="0" max="10" step="0.1" placeholder="0.0 - 10.0">
                  <span id="err-basdai-q6" class="error-msg">Wajib diisi 0 - 10.</span>
                </div>

                <div class="btn-group">
                  <button id="btn-calc-basdai" class="btn btn-primary" style="flex: 1;">Hitung Skor BASDAI</button>
                  <button id="btn-reset-basdai" class="btn btn-secondary">Reset</button>
                </div>

                <div id="basdai-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Hasil Skor BASDAI</span></div>
                  <div class="result-score-line">
                    <div id="basdai-score-num" class="result-number">--</div>
                    <div id="basdai-badge" class="status-badge">Menunggu Input</div>
                  </div>
                  <div id="basdai-desc" class="result-details"></div>
                </div>
              </div>
              <div class="card-footer-ref">
                <span>Formula: ((Q1 + Q2 + Q3 + Q4) + ((Q5 + Q6) / 2)) / 5</span>
              </div>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 6: SYSTEMIC SCLEROSIS ================= -->
        <section id="ssc-page" class="content-page">
          <div class="card-grid">
            <!-- ACR/EULAR 2013 Criteria -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                  Kriteria Klasifikasi Sklerosis Sistemik (ACR/EULAR 2013)
                </h3>
                <p>Skor total &ge; 9 mengklasifikasikan sebagai Sklerosis Sistemik definit.</p>
              </div>

              <div class="card-body" style="max-height: 520px; overflow-y: auto;">
                <label class="check-item" style="border-color: rgba(0, 242, 254, 0.3); background: rgba(0, 242, 254, 0.05);">
                  <input type="checkbox" data-score="9" class="ssc-item">
                  <div>
                    <span style="font-weight: 700; color: #FFFFFF;">Penebalan kulit kedua tangan meluas proksimal dari sendi MCP (Skor 9 - Kriteria Cukup)</span>
                  </div>
                </label>

                <div class="check-domain-title">Penebalan Kulit Jari (Pilih skor tertinggi):</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="ssc-fingers" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="ssc-fingers" value="2">Puffy fingers / bengkak pada jari (2)</label>
                  <label class="check-item"><input type="radio" name="ssc-fingers" value="4">Sklerodaktili (distal dari MCP) (4)</label>
                </div>

                <div class="check-domain-title" style="margin-top: 1rem;">Lesi Ujung Jari (Pilih skor tertinggi):</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="radio" name="ssc-lesions" value="0" checked>Tidak ada (0)</label>
                  <label class="check-item"><input type="radio" name="ssc-lesions" value="2">Ulkus digitalis (2)</label>
                  <label class="check-item"><input type="radio" name="ssc-lesions" value="3">Pitting scars di bantalan ujung jari (3)</label>
                </div>

                <div class="check-domain-title" style="margin-top: 1rem;">Manifestasi Klinis & Laboratoris Lainnya:</div>
                <div class="checklist-container">
                  <label class="check-item"><input type="checkbox" data-score="2" class="ssc-item">Telangiektasia (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="ssc-item">Kapilaroskopi lipatan kuku abnormal (giant capillaries / avascular) (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="2" class="ssc-item">Hipertensi Arteri Pulmonal (PAH) dan/atau Interstitial Lung Disease (ILD) (2)</label>
                  <label class="check-item"><input type="checkbox" data-score="3" class="ssc-item">Fenomena Raynaud (3)</label>
                  <label class="check-item"><input type="checkbox" data-score="3" class="ssc-item">Autoantibodi spesifik SSc (Anti-Scl-70, ACA / Anti-Centromere, Anti-RNA Pol III) (3)</label>
                </div>
              </div>

              <div class="btn-group">
                <button id="btn-calc-ssc" class="btn btn-primary" style="flex: 1;">Hitung Skor SSc</button>
                <button id="btn-reset-ssc" class="btn btn-secondary">Reset</button>
              </div>

              <div id="ssc-result" class="result-panel">
                <div class="result-header"><span class="result-title">Hasil Evaluasi Sklerosis Sistemik</span></div>
                <div class="result-score-line">
                  <div id="ssc-score-num" class="result-number">0 / 9</div>
                  <div id="ssc-badge" class="status-badge">Menunggu Evaluasi</div>
                </div>
                <div id="ssc-desc" class="result-details"></div>
              </div>

              <div class="card-footer-ref">
                <span>Referensi: Van den Hoogen F, et al. Arthritis Rheum 2013;65(11):2737–47</span>
              </div>
            </div>

            <!-- Modified Rodnan Skin Score (mRSS) -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  Skor Kulit Rodnan Termodifikasi (mRSS)
                </h3>
                <p>Penilaian palpasi ketebalan kulit pada 17 area anatomis (skala 0-3 per area, total 0-51).</p>
              </div>

              <div class="card-body">
                <!-- Anatomical Diagram (Inlined Base64 Preserved) -->
                <div style="text-align: center; margin-bottom: 1rem;">
                  <img src="${mrssImageData}" alt="Diagram Anatomis 17 Area mRSS" style="max-width: 100%; height: auto; border-radius: var(--radius-md); border: 1px solid var(--card-border); background: #ffffff; padding: 4px;">
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">17 Area Anatomis: Wajah, Dada, Perut, Lengan Atas (2), Lengan Bawah (2), Tangan (2), Jari (2), Paha (2), Tungkai Bawah (2), Kaki (2)</div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span>Total Skor mRSS yang Dihitung (0 - 51)</span>
                    <span class="form-hint">Derajat: 0 (Normal) hingga 3 (Berat)</span>
                  </label>
                  <input type="number" id="ssc-mrss-input" class="input-field" min="0" max="51" placeholder="Masukkan skor 0 - 51">
                  <span id="err-ssc-mrss" class="error-msg">Skor mRSS harus berada antara 0 dan 51.</span>
                </div>

                <div class="btn-group">
                  <button id="btn-interpret-mrss" class="btn btn-primary" style="flex: 1;">Interpretasi Derajat Kulit</button>
                  <button id="btn-reset-mrss" class="btn btn-secondary">Reset</button>
                </div>

                <div id="mrss-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Interpretasi Derajat mRSS</span></div>
                  <div class="result-score-line">
                    <div id="mrss-score-num" class="result-number">--</div>
                    <div id="mrss-badge" class="status-badge">Menunggu Input</div>
                  </div>
                  <div id="mrss-desc" class="result-details"></div>
                </div>
              </div>

              <div class="card-footer-ref">
                <span>Cutoff: 0 Normal | 1-14 Ringan | 15-29 Sedang | &ge;30 Berat</span>
              </div>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 7: GOUT ARTHRITIS ================= -->
        <section id="gout-page" class="content-page">
          <div class="card-grid">
            <!-- ACR/EULAR 2015 Gout Criteria -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4 8.014 8.014 0 014-7.465V3a1 1 0 012 0v6.535A8.014 8.014 0 0113 17a4 4 0 01-4 4H7z"/></svg>
                  Kriteria Klasifikasi Gout (ACR/EULAR 2015)
                </h3>
                <p>Prasyarat: &ge; 1 episode nyeri/bengkak sendi perifer. Skor &ge; 8 mengklasifikasikan Gout.</p>
              </div>

              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">1. Pola Keterlibatan Sendi / Bursa</label>
                  <select id="gout-joint" class="input-field">
                    <option value="0">Sendi lain yang bukan pergelangan/kaki (0 poin)</option>
                    <option value="1">Pergelangan kaki ATAU Sendi midfoot (1 poin)</option>
                    <option value="2">Sendi MTP-1 (ibu jari kaki / Podagra) (2 poin)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">2. Karakteristik Episode Flare (Eritema, Sangat nyeri sentuh, Kesulitan berjalan)</label>
                  <select id="gout-char" class="input-field">
                    <option value="0">Tidak ada atau hanya 1 karakteristik (0 poin)</option>
                    <option value="1">Terdapat 1 karakteristik khas (1 poin)</option>
                    <option value="2">Terdapat 2 karakteristik khas (2 poin)</option>
                    <option value="3">Terdapat ketiga karakteristik khas (3 poin)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">3. Perjalanan Waktu Episode Nyeri</label>
                  <select id="gout-time" class="input-field">
                    <option value="0">Tidak ada episode khas (0 poin)</option>
                    <option value="1">1 episode tipikal (puncak nyeri &lt;24 jam, resolusi &le;14 hari) (1 poin)</option>
                    <option value="2">Episode tipikal berulang (> 1 kali) (2 poin)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">4. Kadar Asam Urat Serum (SUA)</label>
                  <select id="gout-urate" class="input-field">
                    <option value="-4">&lt; 4.0 mg/dL (-4 poin)</option>
                    <option value="0">4.0 - &lt; 6.0 mg/dL (0 poin)</option>
                    <option value="2">6.0 - &lt; 8.0 mg/dL (2 poin)</option>
                    <option value="3">8.0 - &lt; 10.0 mg/dL (3 poin)</option>
                    <option value="4">&ge; 10.0 mg/dL (4 poin)</option>
                  </select>
                </div>

                <div class="checklist-container" style="margin-top: 0.5rem;">
                  <label class="check-item"><input type="checkbox" id="gout-tophus" data-score="4">Tofus klinis teraba pada pemeriksaan fisik (4 poin)</label>
                  <label class="check-item"><input type="checkbox" id="gout-imaging" data-score="4">Bukti pencitraan deposisi kristal urat (Double Contour Sign pada USG atau DECT) (4 poin)</label>
                </div>

                <div class="btn-group">
                  <button id="btn-calc-gout" class="btn btn-primary" style="flex: 1;">Hitung Skor Gout</button>
                  <button id="btn-reset-gout" class="btn btn-secondary">Reset</button>
                </div>

                <div id="gout-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Hasil Evaluasi Gout</span></div>
                  <div class="result-score-line">
                    <div id="gout-score-num" class="result-number">0 / 8</div>
                    <div id="gout-badge" class="status-badge">Menunggu Evaluasi</div>
                  </div>
                  <div id="gout-desc" class="result-details"></div>
                </div>
              </div>

              <div class="card-footer-ref">
                <span>Referensi: Neogi T, et al. Arthritis Rheumatol 2015;67(10):2557–68</span>
              </div>
            </div>

            <!-- Steinbrocker Functional Classification -->
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                  Kelas Fungsional Steinbrocker
                </h3>
                <p>Klasifikasi kapasitas fungsional aktivitas harian pada pasien artritis.</p>
              </div>

              <div class="card-body">
                <div class="checklist-container">
                  <label class="check-item">
                    <input type="radio" name="gout-func" value="Kelas I" checked>
                    <div>
                      <b>Kelas I:</b>
                      <div style="font-size: 0.78rem; color: var(--text-dim);">Dapat melakukan seluruh aktivitas fungsional harian dan perawatan diri secara mandiri tanpa hambatan.</div>
                    </div>
                  </label>

                  <label class="check-item">
                    <input type="radio" name="gout-func" value="Kelas II">
                    <div>
                      <b>Kelas II:</b>
                      <div style="font-size: 0.78rem; color: var(--text-dim);">Dapat melakukan perawatan diri dan pekerjaan harian normal, namun terbatas pada kegiatan rekreasi / fisik berat.</div>
                    </div>
                  </label>

                  <label class="check-item">
                    <input type="radio" name="gout-func" value="Kelas III">
                    <div>
                      <b>Kelas III:</b>
                      <div style="font-size: 0.78rem; color: var(--text-dim);">Mampu melakukan perawatan diri mandiri, tetapi mengalami keterbatasan bermakna dalam pekerjaan utama dan aktivitas harian.</div>
                    </div>
                  </label>

                  <label class="check-item">
                    <input type="radio" name="gout-func" value="Kelas IV">
                    <div>
                      <b>Kelas IV:</b>
                      <div style="font-size: 0.78rem; color: var(--text-dim);">Sangat terbatas; imobilisasi total di tempat tidur atau kursi roda, memerlukan bantuan penuh untuk perawatan diri.</div>
                    </div>
                  </label>
                </div>

                <div class="btn-group">
                  <button id="btn-eval-func" class="btn btn-primary" style="flex: 1;">Tetapkan Kelas Fungsional</button>
                  <button id="btn-reset-func" class="btn btn-secondary">Reset</button>
                </div>

                <div id="func-result" class="result-panel">
                  <div class="result-header"><span class="result-title">Hasil Kelas Fungsional</span></div>
                  <div class="result-score-line">
                    <div id="func-class-title" class="result-number" style="font-size: 1.6rem;">Kelas I</div>
                  </div>
                  <div id="func-class-desc" class="result-details">Kapasitas fungsional penuh tanpa hendaya.</div>
                </div>
              </div>

              <div class="card-footer-ref">
                <span>Klasifikasi Fungsional Steinbrocker (Revisi IRA 2020)</span>
              </div>
            </div>
          </div>
        </section>


        <!-- ================= PAGE 8: PUSTAKA & REFERENSI ================= -->
        <section id="references-page" class="content-page">
          <div class="card" style="max-width: 900px; margin: 0 auto;">
            <div class="card-header">
              <h2>
                <svg width="20" height="20" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                Pustaka & Bukti Klinis Guideline
              </h2>
              <p>Daftar lengkap publikasi ilmiah dan pedoman resmi yang mendasari algoritma dan formula RheumaTools.</p>
            </div>

            <div class="card-body">
              <div class="checklist-container" style="gap: 1rem;">
                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">1. Buku Saku Reumatologi (2020)</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Perhimpunan Reumatologi Indonesia (IRA). Sumber utama untuk alur diagnosis nyeri sendi, batasan kriteria klasifikasi, dan tatalaksana yang diselaraskan dengan praktek klinis di Indonesia.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">2. Kriteria Klasifikasi Artritis Reumatoid (ACR/EULAR 2010)</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Aletaha D, Neogi T, Silman AJ, et al. <i>2010 Rheumatoid arthritis classification criteria: an American College of Rheumatology/European League Against Rheumatism collaborative initiative.</i> Arthritis Rheum. 2010;62(9):2569–2581.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">3. Formula Validasi DAS28-CRP & DAS28-ESR</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Inoue E, Yamanaka H, Hara M, Tomatsu T, Kamatani N. <i>Comparison of Disease Activity Score (DAS)28-erythrocyte sedimentation rate and DAS28-C-reactive protein threshold values.</i> J Rheumatol. 2007;34(5):840–845. Prevoo MLL, et al. <i>Arthritis Rheum</i> 1995;38(1):44–48.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">4. Kriteria CDAI & SDAI untuk Artritis Reumatoid</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Aletaha D, Nell VPK, Tanew T, et al. <i>The Simplified Disease Activity Index (SDAI) and the Clinical Disease Activity Index (CDAI) to monitor patients in standard clinical care.</i> Arthritis Res Ther. 2005;7(4):R796–R806. Smolen JS, et al. <i>Rheumatology.</i> 2003;42(2):244–257.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">5. Kriteria Klasifikasi SLE (EULAR/ACR 2019) & SLEDAI-2K</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Aringer M, Costenbader K, Daikh D, et al. <i>2019 European League Against Rheumatism/American College of Rheumatology classification criteria for systemic lupus erythematosus.</i> Arthritis Rheumatol. 2019;71(9):1400–1412. Gladman DD, et al. <i>J Rheumatol.</i> 2002;29(2):288–291.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">6. Kriteria Klasifikasi CASPAR untuk Artritis Psoriatik (2006) & DAPSA</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Taylor W, Gladman D, Helliwell P, et al. <i>Classification criteria for psoriatic arthritis: Development of new criteria from a large international study.</i> Arthritis Rheum. 2006;54(8):2665–2673. Schoels M, et al. <i>Ann Rheum Dis.</i> 2010;69(8):1441–1447.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">7. Kriteria Klasifikasi ASAS untuk SpA Aksial (2009) & BASDAI</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Rudwaleit M, van der Heijde D, Landewé R, et al. <i>The development of Assessment of SpondyloArthritis international Society classification criteria for axial spondyloarthritis (part II).</i> Ann Rheum Dis. 2009;68(6):770–776. Garrett S, et al. <i>J Rheumatol.</i> 1994;21(12):2286–2291.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">8. Kriteria Klasifikasi Sklerosis Sistemik (ACR/EULAR 2013) & mRSS</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">van den Hoogen F, Khanna D, Fransen J, et al. <i>2013 classification criteria for systemic sclerosis: an American College of Rheumatology/European League Against Rheumatism collaborative initiative.</i> Arthritis Rheum. 2013;65(11):2737–2747. Clements PJ, et al. <i>J Rheumatol.</i> 1995;22(7):1281–1285.</div>
                </div>

                <div class="check-item" style="display: block; cursor: default;">
                  <div style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem;">9. Kriteria Klasifikasi Gout (ACR/EULAR 2015)</div>
                  <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Neogi T, Jansen TLTA, Dalbeth N, et al. <i>2015 Gout classification criteria: an American College of Rheumatology/European League Against Rheumatism collaborative initiative.</i> Arthritis Rheumatol. 2015;67(10):2557–2568.</div>
                </div>
              </div>
            </div>
            <div class="card-footer-ref">
              <span>drguswib &copy; 2026. Alat bantu keputusan klinis berbasis bukti.</span>
            </div>
          </div>
        </section>

      </main>

      <!-- Bottom Application Footer -->
      <footer class="app-footer">
        <div>&copy; 2026 RheumaTools &bull; Pengembang: <b>drguswib</b></div>
        <div>
          Umpan balik klinis & verifikasi algoritma: 
          <a href="mailto:putrawan.2371041010@student.unud.ac.id">putrawan.2371041010@student.unud.ac.id</a>
        </div>
        <div style="font-size: 0.72rem; color: var(--text-muted); max-width: 680px; margin-top: 4px;">
          Kalkulator ini diperuntukkan sebagai instrumen pendukung keputusan klinis (Clinical Decision Support) bagi tenaga kesehatan profesional.
        </div>
      </footer>
    </div>
  </div>

  <!-- Notification Toast -->
  <div id="toast" class="toast-box">
    <svg width="18" height="18" fill="none" stroke="var(--accent-cyan)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span id="toast-message">Notifikasi</span>
  </div>

  <!-- Clinical Calculation Engine & UI Controller -->
  <script>
    (function () {
      'use strict';

      /* --- CLINICAL CALCULATION ENGINE --- */
      const RheumaCalc = {
        // DAS28-CRP (CRP in mg/L, PGA in 0-100 mm VAS)
        calculateDAS28_CRP(tjc, sjc, crp_mg_L, pga) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (crp_mg_L === '' || crp_mg_L === null || isNaN(crp_mg_L)) throw new Error('Kadar CRP wajib diisi.');
          if (pga === '' || pga === null || isNaN(pga)) throw new Error('Penilaian Global Pasien (PGA) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const c = Number(crp_mg_L);
          const p = Number(pga);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (c < 0) throw new Error('Kadar CRP harus >= 0 mg/L (CRP 0 diperbolehkan).');
          if (p < 0 || p > 100) throw new Error('PGA VAS harus berada di antara 0 dan 100 mm.');

          // Exact formula: 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.36*ln(CRP+1) + 0.014*(PGA) + 0.96
          const raw = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.36 * Math.log(c + 1) + 0.014 * p + 0.96;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyDAS28(score)
          };
        },

        // DAS28-ESR (ESR in mm/hr, PGA in 0-100 mm VAS)
        calculateDAS28_ESR(tjc, sjc, esr, pga) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (esr === '' || esr === null || isNaN(esr)) throw new Error('Laju Endap Darah (LED/ESR) wajib diisi.');
          if (pga === '' || pga === null || isNaN(pga)) throw new Error('Penilaian Global Pasien (PGA) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const e = Number(esr);
          const p = Number(pga);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (e < 1) throw new Error('LED / ESR Westergren harus >= 1 mm/jam karena ln(<=0) tidak terdefinisi.');
          if (p < 0 || p > 100) throw new Error('PGA VAS harus berada di antara 0 dan 100 mm.');

          // Exact formula: 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.70*ln(ESR) + 0.014*(PGA)
          const raw = 0.56 * Math.sqrt(t) + 0.28 * Math.sqrt(s) + 0.70 * Math.log(e) + 0.014 * p;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyDAS28(score)
          };
        },

        // CDAI (Clinical Disease Activity Index)
        calculateCDAI(tjc, sjc, pga_10, ega_10) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (pga_10 === '' || pga_10 === null || isNaN(pga_10)) throw new Error('Penilaian Global Pasien (PGA 0-10) wajib diisi.');
          if (ega_10 === '' || ega_10 === null || isNaN(ega_10)) throw new Error('Penilaian Global Dokter (EGA 0-10) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const p = Number(pga_10);
          const e = Number(ega_10);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (p < 0 || p > 10) throw new Error('PGA harus berada di antara 0 dan 10.');
          if (e < 0 || e > 10) throw new Error('EGA harus berada di antara 0 dan 10.');

          const raw = t + s + p + e;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyCDAI(score)
          };
        },

        // SDAI (Simplified Disease Activity Index)
        calculateSDAI(tjc, sjc, pga_10, ega_10, crp_mg_dL) {
          if (tjc === '' || tjc === null || isNaN(tjc)) throw new Error('Jumlah Sendi Nyeri (TJC28) wajib diisi.');
          if (sjc === '' || sjc === null || isNaN(sjc)) throw new Error('Jumlah Sendi Bengkak (SJC28) wajib diisi.');
          if (pga_10 === '' || pga_10 === null || isNaN(pga_10)) throw new Error('Penilaian Global Pasien (PGA 0-10) wajib diisi.');
          if (ega_10 === '' || ega_10 === null || isNaN(ega_10)) throw new Error('Penilaian Global Dokter (EGA 0-10) wajib diisi.');
          if (crp_mg_dL === '' || crp_mg_dL === null || isNaN(crp_mg_dL)) throw new Error('Kadar CRP (mg/dL) wajib diisi.');

          const t = Number(tjc);
          const s = Number(sjc);
          const p = Number(pga_10);
          const e = Number(ega_10);
          const c = Number(crp_mg_dL);

          if (t < 0 || t > 28) throw new Error('TJC28 harus berada di antara 0 dan 28.');
          if (s < 0 || s > 28) throw new Error('SJC28 harus berada di antara 0 dan 28.');
          if (p < 0 || p > 10) throw new Error('PGA harus berada di antara 0 dan 10.');
          if (e < 0 || e > 10) throw new Error('EGA harus berada di antara 0 dan 10.');
          if (c < 0) throw new Error('Kadar CRP (mg/dL) harus >= 0.');

          const raw = t + s + p + e + c;
          const score = Math.round(raw * 100) / 100;
          return {
            raw,
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifySDAI(score)
          };
        },

        // DAPSA (PsA Disease Activity)
        calculateDAPSA(tjc, sjc, crp_mg_dL, pga, pain) {
          if (tjc === '' || isNaN(tjc) || sjc === '' || isNaN(sjc) || crp_mg_dL === '' || isNaN(crp_mg_dL) || pga === '' || isNaN(pga) || pain === '' || isNaN(pain)) {
            throw new Error('Semua field DAPSA wajib diisi.');
          }
          const t = Number(tjc), s = Number(sjc), c = Number(crp_mg_dL), p = Number(pga), pn = Number(pain);
          if (t < 0 || t > 68 || s < 0 || s > 66 || c < 0 || p < 0 || p > 10 || pn < 0 || pn > 10) {
            throw new Error('Nilai input DAPSA di luar rentang valid.');
          }
          const score = Math.round((t + s + c + p + pn) * 100) / 100;
          return {
            score: score.toFixed(2),
            numericScore: score,
            activity: this.classifyDAPSA(score)
          };
        },

        // BASDAI
        calculateBASDAI(q1, q2, q3, q4, q5, q6) {
          const qs = [q1, q2, q3, q4, q5, q6];
          for (let i = 0; i < 6; i++) {
            if (qs[i] === '' || isNaN(qs[i])) throw new Error('Pertanyaan Q' + (i + 1) + ' wajib diisi.');
            const val = Number(qs[i]);
            if (val < 0 || val > 10) throw new Error('Pertanyaan Q' + (i + 1) + ' harus di antara 0 dan 10.');
          }
          const score = ((Number(q1) + Number(q2) + Number(q3) + Number(q4)) + ((Number(q5) + Number(q6)) / 2)) / 5;
          const rounded = Math.round(score * 100) / 100;
          return {
            score: rounded.toFixed(2),
            numericScore: rounded,
            active: rounded >= 4.0
          };
        },

        /* Cutoff Classifiers */
        classifyDAS28(score) {
          if (score > 5.10) {
            return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high', desc: 'Indikasi eskalasi terapi DMARD / Biologic menurut rekomendasi IRA & EULAR.' };
          }
          if (score > 3.20) {
            return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'Aktivitas penyakit moderat; pertimbangkan optimasi dosis DMARD konvensional / kombinasi.' };
          }
          if (score > 2.60) {
            return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low', desc: 'Aktivitas penyakit terkontrol rendah; pertahankan terapi sesuai target Treat-to-Target (T2T).' };
          }
          return { level: 'Remission', label: 'Remisi Klinis (Clinical Remission)', badgeClass: 'badge-remission', desc: 'Target klinis tercapai (DAS28 <= 2.60). Lanjutkan pemantauan rutin dan evaluasi de-eskalasi bila stabil >6 bulan.' };
        },

        classifyCDAI(score) {
          if (score > 22.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high', desc: 'CDAI > 22.0: Aktivitas penyakit tinggi; evaluasi perubahan strategi terapi.' };
          if (score > 10.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'CDAI 10.1 - 22.0: Aktivitas sedang.' };
          if (score > 2.8) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low', desc: 'CDAI 2.9 - 10.0: Aktivitas rendah terkontrol.' };
          return { level: 'Remission', label: 'Remisi Klinis (Remission)', badgeClass: 'badge-remission', desc: 'CDAI <= 2.8: Remisi klinis tercapai.' };
        },

        classifySDAI(score) {
          if (score > 26.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high', desc: 'SDAI > 26.0: Aktivitas penyakit tinggi.' };
          if (score > 11.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate', desc: 'SDAI 11.1 - 26.0: Aktivitas sedang.' };
          if (score > 3.3) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low', desc: 'SDAI 3.4 - 11.0: Aktivitas rendah terkontrol.' };
          return { level: 'Remission', label: 'Remisi Klinis (Remission)', badgeClass: 'badge-remission', desc: 'SDAI <= 3.3: Remisi klinis tercapai (rekomendasi ACR/EULAR).' };
        },

        classifyDAPSA(score) {
          if (score > 28.0) return { level: 'High', label: 'Aktivitas Tinggi (High Activity)', badgeClass: 'badge-high' };
          if (score > 14.0) return { level: 'Moderate', label: 'Aktivitas Sedang (Moderate Activity)', badgeClass: 'badge-moderate' };
          if (score > 4.0) return { level: 'Low', label: 'Aktivitas Rendah (Low Activity)', badgeClass: 'badge-low' };
          return { level: 'Remission', label: 'Remisi Klinis (Remission)', badgeClass: 'badge-remission' };
        }
      };


      /* --- DOM & UI LOGIC --- */
      document.addEventListener('DOMContentLoaded', function () {
        // Elements
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const navLinks = document.querySelectorAll('.nav-link');
        const contentPages = document.querySelectorAll('.content-page');
        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');

        function showToast(msg) {
          toastMessage.textContent = msg;
          toast.classList.add('show');
          setTimeout(() => { toast.classList.remove('show'); }, 3000);
        }

        // Navigation Page Switcher
        const pageMeta = {
          'ra': { title: 'Rheumatoid Arthritis', subtitle: 'Kriteria Klasifikasi ACR/EULAR 2010 & Skor Aktivitas DAS28 / CDAI / SDAI' },
          'diag-approach': { title: 'Alur Pendekatan Nyeri Sendi', subtitle: 'Algoritma Diagnostik Sistematis Berdasarkan Buku Saku IRA 2020' },
          'sle': { title: 'Systemic Lupus Erythematosus (SLE)', subtitle: 'Kriteria Klasifikasi EULAR/ACR 2019 & Indeks Aktivitas SLEDAI-2K' },
          'psa': { title: 'Psoriatic Arthritis (PsA)', subtitle: 'Kriteria CASPAR 2006 & Skor Aktivitas DAPSA' },
          'as': { title: 'Ankylosing Spondylitis (AS)', subtitle: 'Kriteria Spondiloartritis Aksial ASAS 2009 & Skor BASDAI' },
          'ssc': { title: 'Systemic Sclerosis (SSc)', subtitle: 'Kriteria Klasifikasi ACR/EULAR 2013 & Skor Kulit Rodnan (mRSS)' },
          'gout': { title: 'Gout Arthritis', subtitle: 'Kriteria Klasifikasi ACR/EULAR 2015 & Kelas Fungsional Steinbrocker' },
          'references': { title: 'Pustaka & Guideline Klinis', subtitle: 'Landasan Bukti Ilmiah dan Rekomendasi Konsensus Reumatologi' }
        };

        navLinks.forEach(link => {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.dataset.page;
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            contentPages.forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(target + '-page');
            if (targetPage) targetPage.classList.add('active');

            if (pageMeta[target]) {
              pageTitle.textContent = pageMeta[target].title;
              pageSubtitle.textContent = pageMeta[target].subtitle;
            }

            // Close mobile menu
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('open');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        });

        // Mobile Drawer Toggle
        menuBtn.addEventListener('click', () => {
          sidebar.classList.toggle('open');
          mobileOverlay.classList.toggle('open');
        });
        mobileOverlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          mobileOverlay.classList.remove('open');
        });


        /* ================= 1. RHEUMATOID ARTHRITIS LOGIC ================= */
        // ACR/EULAR 2010 Diagnosis Criteria
        const btnCalcRaAcr = document.getElementById('btn-calc-ra-acr');
        const btnResetRaAcr = document.getElementById('btn-reset-ra-acr');
        const raAcrResult = document.getElementById('ra-acr-result');
        const raAcrScore = document.getElementById('ra-acr-score');
        const raAcrBadge = document.getElementById('ra-acr-badge');
        const raAcrDesc = document.getElementById('ra-acr-desc');

        btnCalcRaAcr.addEventListener('click', function () {
          const joint = parseInt(document.getElementById('ra-joint').value, 10);
          const serology = parseInt(document.getElementById('ra-serology').value, 10);
          const apr = parseInt(document.getElementById('ra-apr').value, 10);
          const duration = parseInt(document.getElementById('ra-duration').value, 10);
          const total = joint + serology + apr + duration;

          raAcrScore.textContent = total + ' / 10 Poin';
          if (total >= 6) {
            raAcrBadge.className = 'status-badge badge-remission';
            raAcrBadge.textContent = 'Memenuhi Kriteria RA Definit';
            raAcrDesc.innerHTML = 'Skor total <b>' + total + ' >= 6</b> mengklasifikasikan pasien sebagai <b>Rheumatoid Arthritis definit</b> menurut konsensus ACR/EULAR 2010.';
          } else {
            raAcrBadge.className = 'status-badge badge-moderate';
            raAcrBadge.textContent = 'Belum Memenuhi Kriteria';
            raAcrDesc.innerHTML = 'Skor total <b>' + total + ' &lt; 6</b> belum memenuhi ambang klasifikasi RA definit. Evaluasi kemungkinan diagnosis banding lain atau pemantauan serial.';
          }
          raAcrResult.classList.add('visible');
        });

        btnResetRaAcr.addEventListener('click', function () {
          document.getElementById('ra-joint').selectedIndex = 0;
          document.getElementById('ra-serology').selectedIndex = 0;
          document.getElementById('ra-apr').selectedIndex = 0;
          document.getElementById('ra-duration').selectedIndex = 0;
          raAcrResult.classList.remove('visible');
        });


        // RA Disease Activity (DAS28-CRP, DAS28-ESR, CDAI, SDAI)
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

        raTabs.forEach(tab => {
          tab.addEventListener('click', function () {
            raTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentRaTab = this.dataset.tab;

            fieldsDasCrp.style.display = 'none';
            fieldsDasEsr.style.display = 'none';
            fieldsCdai.style.display = 'none';
            fieldsSdai.style.display = 'none';

            if (currentRaTab === 'das-crp') {
              fieldsDasCrp.style.display = 'block';
              raFormulaRef.innerHTML = 'Formula: 0.56*&radic;(TJC) + 0.28*&radic;(SJC) + 0.36*ln(CRP+1) + 0.014*(PGA) + 0.96';
              raCutoffLabels.innerHTML = '<span>Remisi: &le;2.60</span><span>Rendah: 2.61-3.20</span><span>Sedang: 3.21-5.10</span><span>Tinggi: >5.10</span>';
            } else if (currentRaTab === 'das-esr') {
              fieldsDasEsr.style.display = 'block';
              raFormulaRef.innerHTML = 'Formula: 0.56*&radic;(TJC) + 0.28*&radic;(SJC) + 0.70*ln(ESR) + 0.014*(PGA)';
              raCutoffLabels.innerHTML = '<span>Remisi: &le;2.60</span><span>Rendah: 2.61-3.20</span><span>Sedang: 3.21-5.10</span><span>Tinggi: >5.10</span>';
            } else if (currentRaTab === 'cdai') {
              fieldsCdai.style.display = 'block';
              raFormulaRef.innerHTML = 'Formula: TJC28 + SJC28 + PGA(0-10) + EGA(0-10)';
              raCutoffLabels.innerHTML = '<span>Remisi: &le;2.8</span><span>Rendah: 2.9-10.0</span><span>Sedang: 10.1-22.0</span><span>Tinggi: >22.0</span>';
            } else if (currentRaTab === 'sdai') {
              fieldsSdai.style.display = 'block';
              raFormulaRef.innerHTML = 'Formula: TJC28 + SJC28 + PGA(0-10) + EGA(0-10) + CRP(mg/dL)';
              raCutoffLabels.innerHTML = '<span>Remisi: &le;3.3</span><span>Rendah: 3.4-11.0</span><span>Sedang: 11.1-26.0</span><span>Tinggi: >26.0</span>';
            }
            raActivityResult.classList.remove('visible');
          });
        });

        // Load Benchmark Scenario (TJC=6, SJC=4, CRP=15, PGA=40)
        btnLoadBenchmark.addEventListener('click', function () {
          // Switch to DAS28-CRP tab
          document.querySelector('#ra-calc-tabs .pill-tab[data-tab="das-crp"]').click();
          document.getElementById('ra-tjc').value = 6;
          document.getElementById('ra-sjc').value = 4;
          document.getElementById('ra-crp-mgl').value = 15;
          document.getElementById('ra-pga-100').value = 40;
          btnCalcRaActivity.click();
          showToast('Kasus benchmark berhasil dimuat: DAS28-CRP = 4.45');
        });

        // Calculate Disease Activity
        btnCalcRaActivity.addEventListener('click', function () {
          // Hide all error messages first
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
              raResDetails.innerHTML = res.activity.desc + '<br><small style="color:var(--text-muted)">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', CRP=' + crpVal + ' mg/L, PGA=' + pgaVal + ' mm</small>';

              lastCalculationSummary = 'Skor DAS28-CRP: ' + res.score + ' (' + res.activity.label + ')\\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', CRP=' + crpVal + ' mg/L, PGA=' + pgaVal + '/100 mm';

            } else if (currentRaTab === 'das-esr') {
              const esrVal = document.getElementById('ra-esr').value.trim();
              const pgaVal = document.getElementById('ra-pga-esr').value.trim();

              const res = RheumaCalc.calculateDAS28_ESR(tjcVal, sjcVal, esrVal, pgaVal);

              raResTitle.textContent = 'Skor DAS28-LED (Erythrocyte Sedimentation Rate)';
              raResNumber.textContent = res.score;
              raResBadge.className = 'status-badge ' + res.activity.badgeClass;
              raResBadge.textContent = res.activity.label;
              raResDetails.innerHTML = res.activity.desc + '<br><small style="color:var(--text-muted)">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', LED=' + esrVal + ' mm/jam, PGA=' + pgaVal + ' mm</small>';

              lastCalculationSummary = 'Skor DAS28-LED: ' + res.score + ' (' + res.activity.label + ')\\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', LED=' + esrVal + ' mm/jam, PGA=' + pgaVal + '/100 mm';

            } else if (currentRaTab === 'cdai') {
              const pgaVal = document.getElementById('ra-pga-10').value.trim();
              const egaVal = document.getElementById('ra-ega-10').value.trim();

              const res = RheumaCalc.calculateCDAI(tjcVal, sjcVal, pgaVal, egaVal);

              raResTitle.textContent = 'Skor CDAI (Clinical Disease Activity Index)';
              raResNumber.textContent = res.score;
              raResBadge.className = 'status-badge ' + res.activity.badgeClass;
              raResBadge.textContent = res.activity.label;
              raResDetails.innerHTML = res.activity.desc + '<br><small style="color:var(--text-muted)">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', PGA=' + pgaVal + ', EGA=' + egaVal + '</small>';

              lastCalculationSummary = 'Skor CDAI: ' + res.score + ' (' + res.activity.label + ')\\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', PGA=' + pgaVal + '/10, EGA=' + egaVal + '/10';

            } else if (currentRaTab === 'sdai') {
              const pgaVal = document.getElementById('ra-sdai-pga').value.trim();
              const egaVal = document.getElementById('ra-sdai-ega').value.trim();
              const crpVal = document.getElementById('ra-sdai-crp').value.trim();

              const res = RheumaCalc.calculateSDAI(tjcVal, sjcVal, pgaVal, egaVal, crpVal);

              raResTitle.textContent = 'Skor SDAI (Simplified Disease Activity Index)';
              raResNumber.textContent = res.score;
              raResBadge.className = 'status-badge ' + res.activity.badgeClass;
              raResBadge.textContent = res.activity.label;
              raResDetails.innerHTML = res.activity.desc + '<br><small style="color:var(--text-muted)">Komponen: TJC=' + tjcVal + ', SJC=' + sjcVal + ', PGA=' + pgaVal + ', EGA=' + egaVal + ', CRP=' + crpVal + ' mg/dL</small>';

              lastCalculationSummary = 'Skor SDAI: ' + res.score + ' (' + res.activity.label + ')\\nKomponen: TJC28=' + tjcVal + ', SJC28=' + sjcVal + ', PGA=' + pgaVal + '/10, EGA=' + egaVal + '/10, CRP=' + crpVal + ' mg/dL';
            }

            raActivityResult.classList.add('visible');

          } catch (err) {
            raActivityResult.classList.remove('visible');
            showToast(err.message);

            // Highlight specific input error if possible
            if (err.message.includes('TJC')) {
              document.getElementById('ra-tjc').classList.add('input-error');
              document.getElementById('err-ra-tjc').classList.add('visible');
            }
            if (err.message.includes('SJC')) {
              document.getElementById('ra-sjc').classList.add('input-error');
              document.getElementById('err-ra-sjc').classList.add('visible');
            }
            if (err.message.includes('CRP') && currentRaTab === 'das-crp') {
              document.getElementById('ra-crp-mgl').classList.add('input-error');
              document.getElementById('err-ra-crp').classList.add('visible');
            }
            if (err.message.includes('LED') || err.message.includes('ESR')) {
              document.getElementById('ra-esr').classList.add('input-error');
              document.getElementById('err-ra-esr').classList.add('visible');
            }
            if (err.message.includes('PGA') && currentRaTab === 'das-crp') {
              document.getElementById('ra-pga-100').classList.add('input-error');
              document.getElementById('err-ra-pga-100').classList.add('visible');
            }
            if (err.message.includes('PGA') && currentRaTab === 'das-esr') {
              document.getElementById('ra-pga-esr').classList.add('input-error');
              document.getElementById('err-ra-pga-esr').classList.add('visible');
            }
            if (err.message.includes('PGA') && currentRaTab === 'cdai') {
              document.getElementById('ra-pga-10').classList.add('input-error');
              document.getElementById('err-ra-pga-10').classList.add('visible');
            }
            if (err.message.includes('EGA') && currentRaTab === 'cdai') {
              document.getElementById('ra-ega-10').classList.add('input-error');
              document.getElementById('err-ra-ega-10').classList.add('visible');
            }
            if (err.message.includes('PGA') && currentRaTab === 'sdai') {
              document.getElementById('ra-sdai-pga').classList.add('input-error');
              document.getElementById('err-ra-sdai-pga').classList.add('visible');
            }
            if (err.message.includes('EGA') && currentRaTab === 'sdai') {
              document.getElementById('ra-sdai-ega').classList.add('input-error');
              document.getElementById('err-ra-sdai-ega').classList.add('visible');
            }
            if (err.message.includes('CRP') && currentRaTab === 'sdai') {
              document.getElementById('ra-sdai-crp').classList.add('input-error');
              document.getElementById('err-ra-sdai-crp').classList.add('visible');
            }
          }
        });

        btnResetRaActivity.addEventListener('click', function () {
          document.getElementById('ra-tjc').value = '';
          document.getElementById('ra-sjc').value = '';
          document.getElementById('ra-crp-mgl').value = '';
          document.getElementById('ra-esr').value = '';
          document.getElementById('ra-pga-100').value = '';
          document.getElementById('ra-pga-esr').value = '';
          document.getElementById('ra-pga-10').value = '';
          document.getElementById('ra-ega-10').value = '';
          document.getElementById('ra-sdai-pga').value = '';
          document.getElementById('ra-sdai-ega').value = '';
          document.getElementById('ra-sdai-crp').value = '';
          document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
          document.querySelectorAll('.input-field').forEach(el => el.classList.remove('input-error'));
          raActivityResult.classList.remove('visible');
          lastCalculationSummary = '';
        });

        // Copy to clipboard
        btnCopyRaResult.addEventListener('click', function () {
          if (!lastCalculationSummary) {
            showToast('Silakan lakukan perhitungan terlebih dahulu.');
            return;
          }
          navigator.clipboard.writeText(lastCalculationSummary).then(() => {
            showToast('Catatan klinis berhasil disalin ke clipboard!');
          }).catch(() => {
            showToast('Gagal menyalin. Silakan salin secara manual.');
          });
        });


        /* ================= 2. ALUR PENDEKATAN NYERI SENDI ================= */
        const stepsContainer = document.getElementById('diag-steps-container');
        const diagResultBox = document.getElementById('diag-result-box');
        const diagResultText = document.getElementById('diag-result-text');
        const btnResetDiag = document.getElementById('btn-reset-diag');

        document.querySelectorAll('.diag-btn').forEach(button => {
          button.addEventListener('click', function () {
            const nextStep = this.dataset.nextStep;
            const resText = this.dataset.result;
            this.closest('.diag-tree-step').style.display = 'none';

            if (nextStep) {
              const nextEl = document.getElementById(nextStep);
              if (nextEl) nextEl.style.display = 'block';
            } else if (resText) {
              stepsContainer.style.display = 'none';
              diagResultText.innerHTML = resText;
              diagResultBox.style.display = 'block';
            }
          });
        });

        btnResetDiag.addEventListener('click', function () {
          diagResultBox.style.display = 'none';
          stepsContainer.style.display = 'block';
          document.querySelectorAll('.diag-tree-step').forEach(step => {
            step.style.display = 'none';
          });
          document.getElementById('step-trauma').style.display = 'block';
        });

        // Accordion toggle
        const toggleArticularDef = document.getElementById('toggle-articular-def');
        const contentArticularDef = document.getElementById('content-articular-def');
        if (toggleArticularDef && contentArticularDef) {
          toggleArticularDef.addEventListener('click', function () {
            contentArticularDef.classList.toggle('open');
          });
        }


        /* ================= 3. SYSTEMIC LUPUS ERYTHEMATOSUS (SLE) ================= */
        // ACR/EULAR 2019 Criteria
        const btnCalcSleAcr = document.getElementById('btn-calc-sle-acr');
        const btnResetSleAcr = document.getElementById('btn-reset-sle-acr');
        const sleAcrResult = document.getElementById('sle-acr-result');
        const sleAcrScoreNum = document.getElementById('sle-acr-score-num');
        const sleAcrBadge = document.getElementById('sle-acr-badge');
        const sleAcrText = document.getElementById('sle-acr-text');

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

          // Radio domains (takes highest per domain)
          ['sle-hem', 'sle-neuro', 'sle-skin', 'sle-serosa', 'sle-renal', 'sle-comp'].forEach(groupName => {
            const checked = document.querySelector('input[name="' + groupName + '"]:checked');
            if (checked) score += parseInt(checked.value, 10);
          });

          sleAcrScoreNum.textContent = score + ' Poin';
          if (score >= 10) {
            sleAcrBadge.className = 'status-badge badge-remission';
            sleAcrBadge.textContent = 'Memenuhi Kriteria SLE Definit';
            sleAcrText.innerHTML = 'Skor total <b>' + score + ' >= 10</b> mengklasifikasikan sebagai <b>Systemic Lupus Erythematosus definit</b> menurut konsensus EULAR/ACR 2019.';
          } else {
            sleAcrBadge.className = 'status-badge badge-moderate';
            sleAcrBadge.textContent = 'Belum Memenuhi Ambang (Skor < 10)';
            sleAcrText.innerHTML = 'Skor total <b>' + score + '</b> belum memenuhi ambang klasifikasi SLE definit (&ge; 10 poin).';
          }
          sleAcrResult.classList.add('visible');
        });

        btnResetSleAcr.addEventListener('click', function () {
          document.querySelectorAll('.sle-acr-item').forEach(item => { item.checked = false; });
          ['sle-hem', 'sle-neuro', 'sle-skin', 'sle-serosa', 'sle-renal', 'sle-comp'].forEach(groupName => {
            const first = document.querySelector('input[name="' + groupName + '"][value="0"]');
            if (first) first.checked = true;
          });
          document.getElementById('sle-ana-entry').checked = true;
          sleAcrResult.classList.remove('visible');
        });

        // SLEDAI-2K
        const btnCalcSledai = document.getElementById('btn-calc-sledai');
        const btnResetSledai = document.getElementById('btn-reset-sledai');
        const sledaiResult = document.getElementById('sledai-result');
        const sledaiScoreNum = document.getElementById('sledai-score-num');
        const sledaiBadge = document.getElementById('sledai-badge');
        const sledaiDesc = document.getElementById('sledai-desc');

        btnCalcSledai.addEventListener('click', function () {
          let score = 0;
          document.querySelectorAll('.sledai-item:checked').forEach(item => {
            score += parseInt(item.dataset.score, 10);
          });

          sledaiScoreNum.textContent = score;
          if (score > 20) {
            sledaiBadge.className = 'status-badge badge-high';
            sledaiBadge.textContent = 'Aktivitas Sangat Tinggi (Very High)';
            sledaiDesc.textContent = 'Skor SLEDAI-2K > 20 menandakan ancaman organ vital; pertimbangkan pulse methylprednisolone / agen imunosupresif kuat.';
          } else if (score >= 11) {
            sledaiBadge.className = 'status-badge badge-high';
            sledaiBadge.textContent = 'Aktivitas Tinggi (High Activity)';
            sledaiDesc.textContent = 'Aktivitas penyakit tinggi (skor 11-20). Memerlukan intensifikasi terapi imunosupresan.';
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

        btnResetSledai.addEventListener('click', function () {
          document.querySelectorAll('.sledai-item').forEach(item => { item.checked = false; });
          sledaiResult.classList.remove('visible');
        });


        /* ================= 4. PSORIATIC ARTHRITIS ================= */
        // CASPAR
        const btnCalcCaspar = document.getElementById('btn-calc-caspar');
        const btnResetCaspar = document.getElementById('btn-reset-caspar');
        const casparResult = document.getElementById('caspar-result');
        const casparScoreNum = document.getElementById('caspar-score-num');
        const casparBadge = document.getElementById('caspar-badge');
        const casparDesc = document.getElementById('caspar-desc');

        btnCalcCaspar.addEventListener('click', function () {
          let score = 0;
          document.querySelectorAll('.caspar-item:checked').forEach(item => {
            score += parseInt(item.dataset.score, 10);
          });
          casparScoreNum.textContent = score + ' / 6 Poin';
          if (score >= 3) {
            casparBadge.className = 'status-badge badge-remission';
            casparBadge.textContent = 'Memenuhi Kriteria PsA';
            casparDesc.innerHTML = 'Skor total <b>' + score + ' >= 3</b> mengklasifikasikan sebagai <b>Psoriatic Arthritis</b> menurut kriteria CASPAR (sensitivitas 91.4%, spesifisitas 98.7%).';
          } else {
            casparBadge.className = 'status-badge badge-moderate';
            casparBadge.textContent = 'Belum Memenuhi Kriteria';
            casparDesc.innerHTML = 'Skor total <b>' + score + ' &lt; 3</b> belum memenuhi ambang klasifikasi PsA.';
          }
          casparResult.classList.add('visible');
        });

        btnResetCaspar.addEventListener('click', function () {
          document.querySelectorAll('.caspar-item').forEach(item => { item.checked = false; });
          casparResult.classList.remove('visible');
        });

        // DAPSA
        const btnCalcDapsa = document.getElementById('btn-calc-dapsa');
        const btnResetDapsa = document.getElementById('btn-reset-dapsa');
        const dapsaResult = document.getElementById('dapsa-result');
        const dapsaScoreNum = document.getElementById('dapsa-score-num');
        const dapsaBadge = document.getElementById('dapsa-badge');
        const dapsaDesc = document.getElementById('dapsa-desc');

        btnCalcDapsa.addEventListener('click', function () {
          document.querySelectorAll('#psa-page .error-msg').forEach(el => el.classList.remove('visible'));
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

        btnResetDapsa.addEventListener('click', function () {
          ['psa-tjc', 'psa-sjc', 'psa-crp', 'psa-pga', 'psa-pain'].forEach(id => {
            document.getElementById(id).value = '';
          });
          dapsaResult.classList.remove('visible');
        });


        /* ================= 5. ANKYLOSING SPONDYLITIS ================= */
        // ASAS
        const btnCalcAsAsas = document.getElementById('btn-calc-as-asas');
        const btnResetAsAsas = document.getElementById('btn-reset-as-asas');
        const asAsasResult = document.getElementById('as-asas-result');
        const asAsasBadge = document.getElementById('as-asas-badge');
        const asAsasDesc = document.getElementById('as-asas-desc');

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
            asAsasDesc.innerHTML = 'Pasien belum memenuhi kriteria lengan pencitraan (sakroilitis + &ge;1 fitur) maupun lengan klinis (HLA-B27 + &ge;2 fitur).';
          }
          asAsasResult.classList.add('visible');
        });

        btnResetAsAsas.addEventListener('click', function () {
          document.getElementById('as-sacroiliitis').checked = false;
          document.getElementById('as-hla-b27').checked = false;
          document.querySelectorAll('.as-feature').forEach(item => { item.checked = false; });
          asAsasResult.classList.remove('visible');
        });

        // BASDAI
        const btnCalcBasdai = document.getElementById('btn-calc-basdai');
        const btnResetBasdai = document.getElementById('btn-reset-basdai');
        const basdaiResult = document.getElementById('basdai-result');
        const basdaiScoreNum = document.getElementById('basdai-score-num');
        const basdaiBadge = document.getElementById('basdai-badge');
        const basdaiDesc = document.getElementById('basdai-desc');

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
              basdaiDesc.textContent = 'Skor BASDAI >= 4 menandakan aktivitas penyakit aktif; indikasi evaluasi terapi biologik anti-TNF / anti-IL-17.';
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

        btnResetBasdai.addEventListener('click', function () {
          ['basdai-q1', 'basdai-q2', 'basdai-q3', 'basdai-q4', 'basdai-q5', 'basdai-q6'].forEach(id => {
            document.getElementById(id).value = '';
          });
          basdaiResult.classList.remove('visible');
        });


        /* ================= 6. SYSTEMIC SCLEROSIS ================= */
        // ACR/EULAR 2013 Criteria
        const btnCalcSsc = document.getElementById('btn-calc-ssc');
        const btnResetSsc = document.getElementById('btn-reset-ssc');
        const sscResult = document.getElementById('ssc-result');
        const sscScoreNum = document.getElementById('ssc-score-num');
        const sscBadge = document.getElementById('ssc-badge');
        const sscDesc = document.getElementById('ssc-desc');

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
            sscDesc.innerHTML = 'Skor total <b>' + score + ' >= 9</b> mengklasifikasikan sebagai <b>Sklerosis Sistemik definit</b> menurut ACR/EULAR 2013.';
          } else {
            sscBadge.className = 'status-badge badge-moderate';
            sscBadge.textContent = 'Belum Memenuhi Ambang (Skor < 9)';
            sscDesc.innerHTML = 'Skor total <b>' + score + ' &lt; 9</b> belum memenuhi ambang klasifikasi definit SSc.';
          }
          sscResult.classList.add('visible');
        });

        btnResetSsc.addEventListener('click', function () {
          document.querySelectorAll('.ssc-item').forEach(item => { item.checked = false; });
          const f0 = document.querySelector('input[name="ssc-fingers"][value="0"]');
          if (f0) f0.checked = true;
          const l0 = document.querySelector('input[name="ssc-lesions"][value="0"]');
          if (l0) l0.checked = true;
          sscResult.classList.remove('visible');
        });

        // mRSS Interpretation
        const btnInterpretMrss = document.getElementById('btn-interpret-mrss');
        const btnResetMrss = document.getElementById('btn-reset-mrss');
        const mrssResult = document.getElementById('mrss-result');
        const mrssScoreNum = document.getElementById('mrss-score-num');
        const mrssBadge = document.getElementById('mrss-badge');
        const mrssDesc = document.getElementById('mrss-desc');

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
            mrssDesc.textContent = 'Derajat penebalan kulit berat; risiko keterlibatan organ viseral lebih tinggi.';
          }
          mrssResult.classList.add('visible');
        });

        btnResetMrss.addEventListener('click', function () {
          document.getElementById('ssc-mrss-input').value = '';
          mrssResult.classList.remove('visible');
        });


        /* ================= 7. GOUT ARTHRITIS ================= */
        // ACR/EULAR 2015 Criteria
        const btnCalcGout = document.getElementById('btn-calc-gout');
        const btnResetGout = document.getElementById('btn-reset-gout');
        const goutResult = document.getElementById('gout-result');
        const goutScoreNum = document.getElementById('gout-score-num');
        const goutBadge = document.getElementById('gout-badge');
        const goutDesc = document.getElementById('gout-desc');

        btnCalcGout.addEventListener('click', function () {
          let score = 0;
          score += parseInt(document.getElementById('gout-joint').value, 10);
          score += parseInt(document.getElementById('gout-char').value, 10);
          score += parseInt(document.getElementById('gout-time').value, 10);
          score += parseInt(document.getElementById('gout-urate').value, 10);

          if (document.getElementById('gout-tophus').checked) score += 4;
          if (document.getElementById('gout-imaging').checked) score += 4;

          goutScoreNum.textContent = score + ' Poin';
          if (score >= 8) {
            goutBadge.className = 'status-badge badge-remission';
            goutBadge.textContent = 'Sangat Mungkin Gout (Klasifikasi Positif)';
            goutDesc.innerHTML = 'Skor total <b>' + score + ' >= 8</b> mengklasifikasikan pasien sebagai <b>Gout Artritis</b> menurut ACR/EULAR 2015.';
          } else {
            goutBadge.className = 'status-badge badge-moderate';
            goutBadge.textContent = 'Gout Tidak Memenuhi Ambang';
            goutDesc.innerHTML = 'Skor total <b>' + score + ' &lt; 8</b> belum memenuhi ambang klasifikasi Gout.';
          }
          goutResult.classList.add('visible');
        });

        btnResetGout.addEventListener('click', function () {
          document.getElementById('gout-joint').selectedIndex = 0;
          document.getElementById('gout-char').selectedIndex = 0;
          document.getElementById('gout-time').selectedIndex = 0;
          document.getElementById('gout-urate').selectedIndex = 1; // 4.0 - < 6.0
          document.getElementById('gout-tophus').checked = false;
          document.getElementById('gout-imaging').checked = false;
          goutResult.classList.remove('visible');
        });

        // Functional Class
        const btnEvalFunc = document.getElementById('btn-eval-func');
        const btnResetFunc = document.getElementById('btn-reset-func');
        const funcResult = document.getElementById('func-result');
        const funcClassTitle = document.getElementById('func-class-title');
        const funcClassDesc = document.getElementById('func-class-desc');

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

        btnResetFunc.addEventListener('click', function () {
          const first = document.querySelector('input[name="gout-func"][value="Kelas I"]');
          if (first) first.checked = true;
          funcResult.classList.remove('visible');
        });

      });
    })();
  </script>
</body>
</html>
`;

const targetFile = path.resolve(__dirname, '../../rheumatools.html');
fs.writeFileSync(targetFile, html, 'utf8');
console.log('Successfully wrote updated rheumatools.html, file size:', html.length, 'bytes');
