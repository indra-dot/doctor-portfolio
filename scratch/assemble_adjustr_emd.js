const fs = require('fs');
const path = require('path');

console.log("Assembling adjustr-emd.html from parts...");

// Execute the part builders
require('./build_part1.js');
require('./build_part2.js');
require('./build_part3.js');
require('./build_part4.js');
require('./build_part5.js');

const p1 = fs.readFileSync(path.join(__dirname, 'part1.html'), 'utf8');
const p2 = fs.readFileSync(path.join(__dirname, 'part2.html'), 'utf8');
const p3 = fs.readFileSync(path.join(__dirname, 'part3.html'), 'utf8');
const p4 = fs.readFileSync(path.join(__dirname, 'part4.html'), 'utf8');
const p5 = fs.readFileSync(path.join(__dirname, 'part5.html'), 'utf8');

const fullHtml = p1 + p2 + p3 + p4 + p5;

const targetFile = path.join(__dirname, '..', 'adjustr-emd.html');
fs.writeFileSync(targetFile, fullHtml, 'utf8');

console.log(`Successfully assembled adjustr-emd.html! Total length: ${fullHtml.length} characters.`);

// Sanity checks:
const forbiddenText = "Sistem pendukung keputusan klinis (CDSS) Kedaruratan Endokrin, Metabolik, dan Kardiometabolik: Stratifikasi badai tiroid & hipotiroid (BWPS, Wayne, Billewicz), krisis hiperglikemia (Osmolaritas Serum Efektif, Anion Gap, Koreksi Natrium), dosis awal insulin basal-bolus TDD, evaluasi resistensi insulin & profil lipid (TyG, HOMA-IR, Friedewald LDL), serta protokol bridging titrasi drip insulin IV 24 jam ke regimen subkutan.";

if (fullHtml.includes(forbiddenText)) {
  console.error("ERROR: Forbidden old banner text is still present!");
} else {
  console.log("PASS: Old banner text has been removed.");
}

const requiredTools = [
  'bwps', 'wayne', 'billewicz', 'myxedema',
  'adrenal', 'apoplexy',
  'osmo', 'ag', 'dka-tracker', 'hypoglycemia', 'insulin-tdd',
  'tyg', 'homa', 'friedewald', 'aip', 'ascvd', 'hba1c-eag',
  'bridging-insulin'
];

let allToolsFound = true;
requiredTools.forEach(t => {
  if (!fullHtml.includes(`card-${t}`)) {
    console.error(`ERROR: Card for ${t} not found!`);
    allToolsFound = false;
  }
  if (!fullHtml.includes(`copyCPPTResume('${t}')`)) {
    console.error(`ERROR: CPPT copy for ${t} not found!`);
    allToolsFound = false;
  }
});

if (allToolsFound) {
  console.log(`PASS: All ${requiredTools.length} tools verified with cards and CPPT copy.`);
}

// Check JavaScript syntax
const scriptMatch = fullHtml.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/i);
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    console.log("PASS: JavaScript syntax is completely VALID.");
  } catch (err) {
    console.error("JavaScript syntax error:", err);
  }
} else {
  console.error("Could not extract script block.");
}
