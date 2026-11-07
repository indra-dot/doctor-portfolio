const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '..', 'profile.jpg');
const indexPath = path.join(__dirname, '..', 'index.html');

const b64 = fs.readFileSync(imgPath).toString('base64');
const dataUri = `data:image/jpeg;base64,${b64}`;

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add hero top badges CSS if not already present
const cssTarget = `.hero-section {`;
const cssReplacement = `.hero-top-badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
    }

    .hero-physician-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0.3rem 0.95rem 0.3rem 0.35rem;
      border-radius: var(--radius-pill);
      background: rgba(13, 22, 46, 0.85);
      border: 1px solid var(--line-medium);
      color: var(--text-1);
      font-size: 0.8125rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      transition: all var(--t-fast) ease;
    }

    .hero-physician-pill:hover {
      border-color: rgba(var(--rgb-cyan), 0.45);
      transform: translateY(-1px);
    }

    .physician-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      border: 1.5px solid var(--cyan);
      flex-shrink: 0;
    }

    .physician-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .physician-sep {
      color: var(--text-3);
    }

    .physician-sub {
      color: var(--text-3);
      font-weight: 500;
    }

    .hero-section {`;

html = html.replace(cssTarget, cssReplacement);

// Remove margin-bottom from .announcement-pill so the wrapper manages it
html = html.replace(
  'font-size: 0.8125rem;\n      font-weight: 500;\n      margin-bottom: 1.75rem;',
  'font-size: 0.8125rem;\n      font-weight: 500;'
);

// 2. Insert Hero Physician Pill alongside the Announcement Pill
const heroPillOld = `        <!-- Announcement Pill (RedSun Style) -->
        <a href="https://sites.google.com/view/drguswib/internahub" target="_blank" rel="noopener noreferrer" class="announcement-pill">
          <span class="pill-badge">v2.4 Live</span>
          <span>InternaHub CDSS: 40+ Clinical Calculators Ready</span>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
        </a>`;

const heroPillNew = `        <!-- Physician Profile Pill & Announcement Pill -->
        <div class="hero-top-badges">
          <a href="#about" class="hero-physician-pill" title="View physician background">
            <span class="physician-avatar">
              <img src="profile.jpg" alt="dr. Ida Bagus Indra Wibawa Putrawan" onerror="this.onerror=null;this.src='${dataUri}';" />
            </span>
            <span>dr. Guswib</span>
            <span class="physician-sep">·</span>
            <span class="physician-sub">Internal Medicine Resident</span>
          </a>
          <a href="https://sites.google.com/view/drguswib/internahub" target="_blank" rel="noopener noreferrer" class="announcement-pill">
            <span class="pill-badge">v2.4 Live</span>
            <span>InternaHub CDSS: 40+ Calculators</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>`;

html = html.replace(heroPillOld, heroPillNew);

// 3. Update About section avatar to use dataUri fallback
const aboutAvatarOld = `<div class="avatar-frame">
            <img src="profile.jpg" alt="dr. Ida Bagus Indra Wibawa Putrawan" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%2300F2FE\\' stroke-width=\\'1.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3E%3Cpath d=\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\'%3E%3C/path%3E%3Ccircle cx=\\'12\\' cy=\\'7\\' r=\\'4\\'%3E%3C/circle%3E%3C/svg%3E';" />
          </div>`;

const aboutAvatarNew = `<div class="avatar-frame">
            <img src="profile.jpg" alt="dr. Ida Bagus Indra Wibawa Putrawan" onerror="this.onerror=null;this.src='${dataUri}';" loading="eager" />
          </div>`;

html = html.replace(aboutAvatarOld, aboutAvatarNew);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully embedded profile photo in Hero and About sections with robust fallback!');
