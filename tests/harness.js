/**
 * tests/harness.js
 * 
 * Clinical Calculation Test Harness for InternaHub.
 * Loads internahub.html in JSDOM, exposes the clinical registry R,
 * and allows programmatic execution of any of the 85 clinical calculators.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let cachedDom = null;

function getInternaHubEnv() {
  if (cachedDom) return cachedDom;

  const htmlPath = path.resolve(__dirname, '..', 'internahub.html');
  let rawHtml = fs.readFileSync(htmlPath, 'utf8');

  // Strip external Tailwind CSS network script to prevent JSDOM network timeout
  rawHtml = rawHtml.replace(/<script\s+src="https:\/\/cdn\.tailwindcss\.com"><\/script>/i, '');

  // Inject a small hook right before </script> to expose R and helper to window
  const hook = `
    window._CLINICAL_REGISTRY = typeof R !== 'undefined' ? R : [];
    window._DRUG_DATABASE = typeof DRUG_DATABASE !== 'undefined' ? DRUG_DATABASE : {};
    window._PATIENT_CTX = typeof ctx !== 'undefined' ? ctx : {};
    window._RHEUMA_CALC = typeof RheumaCalc !== 'undefined' ? RheumaCalc : null;
    window._CLINICAL_ENGINE = typeof ClinicalEngine !== 'undefined' ? ClinicalEngine : null;
  `;
  rawHtml = rawHtml.replace(/<\/script>\s*<\/body>/i, `${hook}\n</script>\n</body>`);

  const dom = new JSDOM(rawHtml, {
    url: 'http://localhost/internahub.html',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });

  cachedDom = dom;
  return dom;
}

/**
 * Get all registered modules in InternaHub
 */
function getAllModules() {
  const dom = getInternaHubEnv();
  return dom.window._CLINICAL_REGISTRY;
}

/**
 * Find a specific clinical module by ID
 */
function getModule(id) {
  const modules = getAllModules();
  return modules.find(m => m.id === id);
}

/**
 * Execute calculation for a schema-based module (c.calc) or mounted module (c.mount)
 * @param {string} moduleId - e.g. 'curb65', 'anion-gap', 'corr-na', 'crcl-cockcroft'
 * @param {object} inputs - key/value pairs matching field IDs or input IDs
 * @returns {object} - { value, text, cls, cppt, table, raw }
 */
async function runCalculation(moduleId, inputs = {}) {
  const dom = getInternaHubEnv();
  const mod = getModule(moduleId);
  if (!mod) {
    throw new Error(`Module '${moduleId}' not found in InternaHub registry!`);
  }

  // Schema-based calculator with c.compute or c.calc
  const calcFn = mod.compute || mod.calc;
  if (calcFn && typeof calcFn === 'function') {
    const result = calcFn(inputs);
    return result;
  }

  // Mounted interactive module with c.mount
  if (mod.mount && typeof mod.mount === 'function') {
    const container = dom.window.document.createElement('div');
    dom.window.document.body.appendChild(container);

    let lastResult = null;
    const emit = (res) => {
      lastResult = res;
    };

    // Mount module
    mod.mount(container, inputs.ctx || {}, emit);

    // If inputs provided, populate DOM fields and trigger change/input events
    for (const [key, val] of Object.entries(inputs)) {
      if (key === 'ctx') continue;
      const el = container.querySelector(`#${key}`) ||
                 container.querySelector(`[name="${key}"]`) ||
                 container.querySelector(`[data-id="${key}"]`) ||
                 dom.window.document.getElementById(key);

      if (el) {
        if (el.tagName === 'SELECT') {
          el.value = val;
          el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
        } else if (el.type === 'checkbox') {
          el.checked = !!val;
          el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = val;
          el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
          el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
        }
      }
    }

    // Cleanup container from body
    dom.window.document.body.removeChild(container);
    return lastResult;
  }

  throw new Error(`Module '${moduleId}' has neither c.calc nor c.mount!`);
}

module.exports = {
  getInternaHubEnv,
  getAllModules,
  getModule,
  runCalculation
};
