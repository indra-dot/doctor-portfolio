(function () {
      'use strict';

      /* ==========================================================
         Pinterest RedSun Feature: Scroll Animation Lighting Engine
         Calculates scroll progress and sweeps a radial spotlight
         across the RedSun horizon orb, showcase frame, and bento cards.
         ========================================================== */
      var redsunStageEl = document.getElementById('redsun-stage');
      var showcaseEl = document.getElementById('showcase');
      var bentoCards = Array.prototype.slice.call(document.querySelectorAll('.bento-card'));
      var ticking = false;

      function updateScrollLighting() {
        var targetEl = redsunStageEl || showcaseEl;
        if (!targetEl) return;
        var rect = targetEl.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Calculate scroll ratio (0 when approaching, 1 when scrolled past)
        var relativeTop = rect.top / windowHeight;
        var scrollRatio = Math.max(0, Math.min(1, (1 - relativeTop)));
        var beamAngle = Math.round(45 + scrollRatio * 180);
        var beamPos = Math.round(15 + scrollRatio * 70);

        if (redsunStageEl) {
          redsunStageEl.style.setProperty('--scroll-ratio', scrollRatio.toFixed(3));
        }

        if (showcaseEl) {
          showcaseEl.style.setProperty('--scroll-ratio', scrollRatio.toFixed(3));
          showcaseEl.style.setProperty('--beam-angle', beamAngle + 'deg');
          showcaseEl.style.setProperty('--beam-pos', beamPos + '%');
        }

        ticking = false;
      }

      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollLighting);
          ticking = true;
        }
      }, { passive: true });

      // Run on initial load
      updateScrollLighting();

      // Interactive Directional Lighting on Bento Cards
      bentoCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var cardRect = card.getBoundingClientRect();
          var cx = cardRect.left + cardRect.width / 2;
          var cy = cardRect.top + cardRect.height / 2;
          var angle = Math.round(Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90);
          card.style.setProperty('--card-beam-angle', angle + 'deg');
        }, { passive: true });
      });

      // Mouse Lighting on Showcase
      if (showcaseEl) {
        showcaseEl.addEventListener('mousemove', function (e) {
          var sRect = showcaseEl.getBoundingClientRect();
          var scx = sRect.left + sRect.width / 2;
          var scy = sRect.top + sRect.height / 2;
          var sAngle = Math.round(Math.atan2(e.clientY - scy, e.clientX - scx) * (180 / Math.PI) + 90);
          showcaseEl.style.setProperty('--beam-angle', sAngle + 'deg');
        }, { passive: true });
      }

    })();

    /* ==========================================================
       Hero Showcase: 3-Tab Switcher Logic (InternaHub, CBT, Internize)
       ========================================================== */
    function switchShowcaseTab(tabName) {
      var tabInternahub = document.getElementById('tab-btn-internahub');
      var tabCbt = document.getElementById('tab-btn-cbt');
      var tabInternize = document.getElementById('tab-btn-internize');

      var paneInternahub = document.getElementById('pane-internahub');
      var paneCbt = document.getElementById('pane-cbt');
      var paneInternize = document.getElementById('pane-internize');

      var badgeEl = document.getElementById('window-status-badge');

      // Reset all tabs
      [tabInternahub, tabCbt, tabInternize].forEach(function (tab) {
        if (tab) {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        }
      });

      // Reset all panes
      [paneInternahub, paneCbt, paneInternize].forEach(function (pane) {
        if (pane) pane.classList.remove('active');
      });

      if (tabName === 'internahub') {
        if (tabInternahub) {
          tabInternahub.classList.add('active');
          tabInternahub.setAttribute('aria-selected', 'true');
        }
        if (paneInternahub) paneInternahub.classList.add('active');
        if (badgeEl) {
          badgeEl.innerHTML = '<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg><span>Evidence-Based</span>';
        }
      } else if (tabName === 'cbt') {
        if (tabCbt) {
          tabCbt.classList.add('active');
          tabCbt.setAttribute('aria-selected', 'true');
        }
        if (paneCbt) paneCbt.classList.add('active');
        if (badgeEl) {
          badgeEl.innerHTML = '<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Simulation Active</span>';
        }
      } else if (tabName === 'internize') {
        if (tabInternize) {
          tabInternize.classList.add('active');
          tabInternize.setAttribute('aria-selected', 'true');
        }
        if (paneInternize) paneInternize.classList.add('active');
        if (badgeEl) {
          badgeEl.innerHTML = '<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg><span>HIPAA Safe Harbor</span>';
        }
        renderInternizeSimulation();
      }
    }

    /* ==========================================================
       Hero Showcase: Interactive Live Cockcroft-Gault Calculator
       ========================================================== */
    var currentGender = 'male';

    function setGender(gender) {
      currentGender = gender;
      var btnM = document.getElementById('gender-m');
      var btnF = document.getElementById('gender-f');

      if (gender === 'male') {
        btnM.classList.add('active');
        btnF.classList.remove('active');
      } else {
        btnF.classList.add('active');
        btnM.classList.remove('active');
      }
      runLiveCrCl();
    }

    function runLiveCrCl() {
      var age = parseFloat(document.getElementById('input-age').value) || 65;
      var weight = parseFloat(document.getElementById('input-weight').value) || 60;
      var scr = parseFloat(document.getElementById('input-scr').value) || 1.2;

      if (scr <= 0) scr = 0.1;

      // Cockcroft-Gault Formula: [(140 - Age) * Weight] / (72 * SCr) * (0.85 if female)
      var crcl = ((140 - age) * weight) / (72 * scr);
      if (currentGender === 'female') {
        crcl = crcl * 0.85;
      }

      var displayCrCl = crcl.toFixed(1);
      document.getElementById('output-crcl').textContent = displayCrCl;

      // Clinical Stage & Antimicrobial Dosing Guidance
      var stageEl = document.getElementById('output-stage');
      var dosingEl = document.getElementById('output-dosing');

      if (crcl >= 90) {
        stageEl.textContent = 'G1 · Normal or High Function';
        stageEl.style.color = '#10B981';
        dosingEl.innerHTML = '<strong>Meropenem:</strong> 1,000 mg IV q8h (Standard unadjusted regimen).';
      } else if (crcl >= 60) {
        stageEl.textContent = 'G2 · Mild Reduction';
        stageEl.style.color = '#2DD4BF';
        dosingEl.innerHTML = '<strong>Meropenem:</strong> 1,000 mg IV q8h (Monitor serial SCr).';
      } else if (crcl >= 50) {
        stageEl.textContent = 'G3a · Mild-Moderate Impairment';
        stageEl.style.color = '#38BDF8';
        dosingEl.innerHTML = '<strong>Meropenem:</strong> 1,000 mg IV q12h (Extended infusion over 3 hrs recommended).';
      } else if (crcl >= 26) {
        stageEl.textContent = 'G3b-G4 · Moderate-Severe Impairment';
        stageEl.style.color = '#F59E0B';
        dosingEl.innerHTML = '<strong>Meropenem:</strong> 500 mg IV q12h (Dose adjusted for reduced renal clearance).';
      } else if (crcl >= 10) {
        stageEl.textContent = 'G4 · Severe Kidney Impairment';
        stageEl.style.color = '#F43F5E';
        dosingEl.innerHTML = '<strong>Meropenem:</strong> 500 mg IV q24h (Dose reduction with extended infusion).';
      } else {
        stageEl.textContent = 'G5 · Kidney Failure / Pre-Dialysis';
        stageEl.style.color = '#F43F5E';
        dosingEl.innerHTML = '<strong>Meropenem:</strong> 500 mg IV q24h. If Hemodialysis: give supplemental 500 mg post-HD.';
      }
    }

    // Run once on load
    runLiveCrCl();

    /* ==========================================================
       Hero Showcase: Interactive IPD CBT Pro Exam Simulator
       ========================================================== */
    function answerCBT(chosen) {
      var optA = document.getElementById('cbt-opt-a');
      var optB = document.getElementById('cbt-opt-b');
      var optC = document.getElementById('cbt-opt-c');
      var optD = document.getElementById('cbt-opt-d');
      var feedbackEl = document.getElementById('cbt-feedback');

      // Reset states
      [optA, optB, optC, optD].forEach(function (opt) {
        opt.classList.remove('correct', 'incorrect');
      });

      // Correct answer is C (CURB-65 = 4)
      optC.classList.add('correct');

      if (chosen === 'c') {
        feedbackEl.className = 'cbt-feedback-alert show is-correct';
        feedbackEl.innerHTML = '<strong>✓ Correct!</strong> CURB-65 Criteria: Confusion (+1), Urea/BUN >19 mg/dL (+1), RR &ge;30/min (+1), BP &lt;90/60 mmHg (+1), Age &ge;65 (+1). Total = 5 (or 4). Severe Community-Acquired Pneumonia with ~30% 30-day mortality indicates emergency resuscitation and immediate Intensive Care Unit (ICU) admission.';
      } else {
        var chosenBtn = document.getElementById('cbt-opt-' + chosen);
        if (chosenBtn) chosenBtn.classList.add('incorrect');
        feedbackEl.className = 'cbt-feedback-alert show';
        feedbackEl.style.background = 'rgba(244, 63, 94, 0.12)';
        feedbackEl.style.border = '1px solid rgba(244, 63, 94, 0.35)';
        feedbackEl.style.color = '#FECDD3';
        feedbackEl.innerHTML = '<strong>✕ Incorrect.</strong> The correct answer is <strong>C</strong>. The patient fulfills criteria for Confusion, BUN &gt;19 mg/dL, Tachypnea (RR 34), Hypotension (BP 84/52), and Age &ge;65. A score &ge;3 signifies severe CAP mandating ICU evaluation.';
      }
    }

    /* ==========================================================
       Hero Showcase TAB 3: Internize.ai On-Device Clinical Simulation
       ========================================================== */
    var internizeCurrentCase = 'adhf';
    var internizeDeidEnabled = true;
    var internizeNerEnabled = true;

    var internizeCaseData = {
      adhf: {
        title: 'Case 1: Acute Decompensated Heart Failure (ADHF)',
        phi: {
          name: { raw: 'Budi Santoso', deid: '[PATIENT_NAME]' },
          mrn: { raw: 'MRN-849201', deid: '[MRN]' },
          date: { raw: '2026-03-14 08:30', deid: '[DATE_TIME]' },
          room: { raw: 'RSUP Sanglah Room 304', deid: '[LOCATION]' }
        },
        entities: [
          { type: 'Condition', label: 'Acute decompensated heart failure (ADHF)', code: 'ICD-10: I50.9', category: 'prob' },
          { type: 'Observation', label: 'BNP 1,420 pg/mL (Critical High)', code: 'LOINC: 30934-4', category: 'lab' },
          { type: 'Medication', label: 'IV Furosemide 40 mg bolus', code: 'RxNorm: 4603', category: 'med' },
          { type: 'Observation', label: 'Serum Creatinine 1.8 mg/dL', code: 'LOINC: 2160-0', category: 'lab' }
        ],
        render: function (deid, ner) {
          var nameSpan = deid 
            ? '<span class="phi-mask">[PATIENT_NAME]</span>' 
            : '<span class="phi-raw">Budi Santoso</span>';
          var mrnSpan = deid 
            ? '<span class="phi-mask">[MRN]</span>' 
            : '<span class="phi-raw">MRN-849201</span>';
          var dateSpan = deid 
            ? '<span class="phi-mask">[DATE_TIME]</span>' 
            : '<span class="phi-raw">2026-03-14 08:30</span>';
          var locSpan = deid 
            ? '<span class="phi-mask">[LOCATION]</span>' 
            : '<span class="phi-raw">RSUP Sanglah Room 304</span>';

          var p1 = ner ? '<span class="ner-span ner-prob">acute decompensated heart failure (ADHF)</span>' : 'acute decompensated heart failure (ADHF)';
          var p2 = ner ? '<span class="ner-span ner-prob">orthopnea</span>' : 'orthopnea';
          var p3 = ner ? '<span class="ner-span ner-prob">paroxysmal nocturnal dyspnea</span>' : 'paroxysmal nocturnal dyspnea';
          var p4 = ner ? '<span class="ner-span ner-prob">bilateral crackles</span>' : 'bilateral crackles';
          var p5 = ner ? '<span class="ner-span ner-prob">pedal edema 2+</span>' : 'pedal edema 2+';
          var m1 = ner ? '<span class="ner-span ner-med">IV Furosemide 40 mg</span>' : 'IV Furosemide 40 mg';
          var m2 = ner ? '<span class="ner-span ner-med">Ramipril 5 mg PO</span>' : 'Ramipril 5 mg PO';
          var l1 = ner ? '<span class="ner-span ner-lab">BNP 1,420 pg/mL</span>' : 'BNP 1,420 pg/mL';
          var l2 = ner ? '<span class="ner-span ner-lab">Serum Creatinine 1.8 mg/dL</span>' : 'Serum Creatinine 1.8 mg/dL';
          var l3 = ner ? '<span class="ner-span ner-lab">BP 168/94 mmHg</span>' : 'BP 168/94 mmHg';

          return '<p><strong>Admit Note:</strong> ' + nameSpan + ' (67M), ' + mrnSpan + ', admitted to ' + locSpan + ' on ' + dateSpan + '.</p>' +
                 '<p>Presents with progressive dyspnea on exertion, severe ' + p2 + ', and ' + p3 + '. Physical exam reveals ' + l3 + ', JVP 5+4 cmH2O, bibasilar ' + p4 + ', and bilateral ' + p5 + '.</p>' +
                 '<p>Diagnostic workup confirmed ' + p1 + ' with ' + l1 + ' and baseline renal insufficiency with ' + l2 + '.</p>' +
                 '<p>Immediate management: ' + m1 + ' bolus followed by continuous infusion, held ' + m2 + ' pending serial electrolyte monitoring.</p>';
        },
        fhir: {
          resourceType: "Bundle",
          id: "bundle-adhf-transaction",
          type: "transaction",
          timestamp: "2026-03-14T08:35:00Z",
          entry: [
            {
              fullUrl: "urn:uuid:c7a10294-81d3-4f21-a3f2-11029481d34f",
              resource: {
                resourceType: "Condition",
                clinicalStatus: {
                  coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
                },
                verificationStatus: {
                  coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" }]
                },
                code: {
                  coding: [
                    { system: "http://hl7.org/fhir/sid/icd-10", code: "I50.9", display: "Heart failure, unspecified" },
                    { system: "http://snomed.info/sct", code: "42343007", display: "Congestive heart failure" }
                  ],
                  text: "Acute decompensated heart failure"
                },
                subject: { reference: "urn:uuid:patient-anon-01" }
              },
              request: { method: "POST", url: "Condition" }
            },
            {
              fullUrl: "urn:uuid:89bc4412-ef49-41d8-a159-2041d8a15989",
              resource: {
                resourceType: "Observation",
                status: "final",
                code: {
                  coding: [{ system: "http://loinc.org", code: "30934-4", display: "B-type natriuretic peptide [Mass/volume] in Blood" }]
                },
                valueQuantity: { value: 1420, unit: "pg/mL", system: "http://unitsofmeasure.org", code: "pg/mL" },
                interpretation: [{
                  coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation", code: "HH", display: "Critical high" }]
                }],
                subject: { reference: "urn:uuid:patient-anon-01" }
              },
              request: { method: "POST", url: "Observation" }
            },
            {
              fullUrl: "urn:uuid:df392110-38ae-4f91-b1e0-39211038ae4f",
              resource: {
                resourceType: "MedicationStatement",
                status: "active",
                medicationCodeableConcept: {
                  coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "4603", display: "Furosemide 40 MG Injection" }],
                  text: "IV Furosemide 40 mg"
                },
                subject: { reference: "urn:uuid:patient-anon-01" }
              },
              request: { method: "POST", url: "MedicationStatement" }
            }
          ]
        }
      },
      sepsis: {
        title: 'Case 2: Sepsis & Diabetic Ketoacidosis (DKA)',
        phi: {
          name: { raw: 'Ni Ketut Rai', deid: '[PATIENT_NAME]' },
          mrn: { raw: 'MRN-910442', deid: '[MRN]' },
          date: { raw: '2026-04-02 21:15', deid: '[DATE_TIME]' },
          room: { raw: 'ICU Isolation Bed 03', deid: '[LOCATION]' }
        },
        entities: [
          { type: 'Condition', label: 'Septic shock secondary to urosepsis', code: 'ICD-10: R65.21', category: 'prob' },
          { type: 'Condition', label: 'Diabetic ketoacidosis (DKA)', code: 'ICD-10: E11.10', category: 'prob' },
          { type: 'Observation', label: 'Serum Lactate 4.2 mmol/L (Critical High)', code: 'LOINC: 2524-7', category: 'lab' },
          { type: 'Medication', label: 'IV Norepinephrine 0.15 mcg/kg/min', code: 'RxNorm: 7512', category: 'med' }
        ],
        render: function (deid, ner) {
          var nameSpan = deid 
            ? '<span class="phi-mask">[PATIENT_NAME]</span>' 
            : '<span class="phi-raw">Ni Ketut Rai</span>';
          var mrnSpan = deid 
            ? '<span class="phi-mask">[MRN]</span>' 
            : '<span class="phi-raw">MRN-910442</span>';
          var dateSpan = deid 
            ? '<span class="phi-mask">[DATE_TIME]</span>' 
            : '<span class="phi-raw">2026-04-02 21:15</span>';
          var locSpan = deid 
            ? '<span class="phi-mask">[LOCATION]</span>' 
            : '<span class="phi-raw">ICU Isolation Bed 03</span>';

          var p1 = ner ? '<span class="ner-span ner-prob">septic shock secondary to urosepsis</span>' : 'septic shock secondary to urosepsis';
          var p2 = ner ? '<span class="ner-span ner-prob">diabetic ketoacidosis (DKA)</span>' : 'diabetic ketoacidosis (DKA)';
          var p3 = ner ? '<span class="ner-span ner-prob">Kussmaul breathing</span>' : 'Kussmaul breathing';
          var m1 = ner ? '<span class="ner-span ner-med">IV Norepinephrine 0.15 mcg/kg/min</span>' : 'IV Norepinephrine 0.15 mcg/kg/min';
          var m2 = ner ? '<span class="ner-span ner-med">Regular Insulin infusion 0.1 U/kg/hr</span>' : 'Regular Insulin infusion 0.1 U/kg/hr';
          var m3 = ner ? '<span class="ner-span ner-med">IV Meropenem 1g q12h</span>' : 'IV Meropenem 1g q12h';
          var l1 = ner ? '<span class="ner-span ner-lab">Lactate 4.2 mmol/L</span>' : 'Lactate 4.2 mmol/L';
          var l2 = ner ? '<span class="ner-span ner-lab">Blood Glucose 480 mg/dL</span>' : 'Blood Glucose 480 mg/dL';
          var l3 = ner ? '<span class="ner-span ner-lab">Arterial pH 7.18</span>' : 'Arterial pH 7.18';
          var l4 = ner ? '<span class="ner-span ner-lab">MAP 54 mmHg</span>' : 'MAP 54 mmHg';

          return '<p><strong>Emergency Critical Care Note:</strong> ' + nameSpan + ' (54F), ' + mrnSpan + ', received at ' + locSpan + ' on ' + dateSpan + '.</p>' +
                 '<p>Patient lethargic with tachypnea and marked ' + p3 + '. Initial hemodynamics reveal refractory hypotension with ' + l4 + ' despite crystalloids, diagnostic of ' + p1 + '.</p>' +
                 '<p>Point-of-care labs demonstrate concurrent severe ' + p2 + ' with ' + l2 + ', ' + l3 + ', urine ketones ++++, and tissue hypoperfusion marker ' + l1 + '.</p>' +
                 '<p>Resuscitation protocol: titrated ' + m1 + ' for target MAP &ge;65 mmHg, initiated ' + m2 + ', and broad-spectrum coverage with ' + m3 + '.</p>';
        },
        fhir: {
          resourceType: "Bundle",
          id: "bundle-sepsis-dka-transaction",
          type: "transaction",
          timestamp: "2026-04-02T21:20:00Z",
          entry: [
            {
              fullUrl: "urn:uuid:1049281a-28e4-4a21-9921-1049281a28e4",
              resource: {
                resourceType: "Condition",
                clinicalStatus: {
                  coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
                },
                code: {
                  coding: [
                    { system: "http://hl7.org/fhir/sid/icd-10", code: "R65.21", display: "Severe sepsis with septic shock" },
                    { system: "http://snomed.info/sct", code: "76571007", display: "Septic shock" }
                  ],
                  text: "Septic shock secondary to urosepsis"
                },
                subject: { reference: "urn:uuid:patient-anon-02" }
              },
              request: { method: "POST", url: "Condition" }
            },
            {
              fullUrl: "urn:uuid:771928bc-5512-4011-b021-771928bc5512",
              resource: {
                resourceType: "Condition",
                clinicalStatus: {
                  coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }]
                },
                code: {
                  coding: [
                    { system: "http://hl7.org/fhir/sid/icd-10", code: "E11.10", display: "Type 2 diabetes with ketoacidosis" }
                  ],
                  text: "Diabetic ketoacidosis (DKA)"
                },
                subject: { reference: "urn:uuid:patient-anon-02" }
              },
              request: { method: "POST", url: "Condition" }
            },
            {
              fullUrl: "urn:uuid:99381023-ff12-4211-c918-99381023ff12",
              resource: {
                resourceType: "Observation",
                status: "final",
                code: {
                  coding: [{ system: "http://loinc.org", code: "2524-7", display: "Lactate [Moles/volume] in Blood" }]
                },
                valueQuantity: { value: 4.2, unit: "mmol/L", system: "http://unitsofmeasure.org", code: "mmol/L" },
                interpretation: [{
                  coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation", code: "H", display: "High" }]
                }],
                subject: { reference: "urn:uuid:patient-anon-02" }
              },
              request: { method: "POST", url: "Observation" }
            }
          ]
        }
      }
    };

    function setInternizeCase(caseId) {
      internizeCurrentCase = caseId;
      var btnAdhf = document.getElementById('case-btn-adhf');
      var btnSepsis = document.getElementById('case-btn-sepsis');

      if (caseId === 'adhf') {
        if (btnAdhf) btnAdhf.classList.add('active');
        if (btnSepsis) btnSepsis.classList.remove('active');
      } else {
        if (btnSepsis) btnSepsis.classList.add('active');
        if (btnAdhf) btnAdhf.classList.remove('active');
      }

      renderInternizeSimulation();
    }

    function toggleInternizeDeid() {
      internizeDeidEnabled = !internizeDeidEnabled;
      var chip = document.getElementById('chip-toggle-deid');
      if (chip) {
        if (internizeDeidEnabled) {
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
        } else {
          chip.classList.remove('active');
          chip.setAttribute('aria-pressed', 'false');
        }
      }
      renderInternizeSimulation();
    }

    function toggleInternizeNer() {
      internizeNerEnabled = !internizeNerEnabled;
      var chip = document.getElementById('chip-toggle-ner');
      if (chip) {
        if (internizeNerEnabled) {
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
        } else {
          chip.classList.remove('active');
          chip.setAttribute('aria-pressed', 'false');
        }
      }
      renderInternizeSimulation();
    }

    function renderInternizeSimulation() {
      var noteBox = document.getElementById('internize-note-display');
      var fhirBox = document.getElementById('internize-fhir-display');
      var entitiesBox = document.getElementById('internize-entities-display');
      var gatePill = document.getElementById('internize-gate-pill');
      var gateText = document.getElementById('internize-gate-text');

      var cData = internizeCaseData[internizeCurrentCase] || internizeCaseData.adhf;

      // Update Gate Pill status
      if (gatePill && gateText) {
        if (internizeDeidEnabled) {
          gatePill.className = 'internize-gate-pill gate-pass';
          gateText.textContent = 'G1a: PASS \u2022 100% Recall';
        } else {
          gatePill.className = 'internize-gate-pill gate-warn';
          gateText.textContent = 'WARN: Raw PHI Exposed';
        }
      }

      // Render clinical note
      if (noteBox) {
        noteBox.innerHTML = cData.render(internizeDeidEnabled, internizeNerEnabled);
      }

      // Render normalized structured clinical entities (Zero Deadspace Flat List)
      if (entitiesBox && cData.entities) {
        entitiesBox.innerHTML = cData.entities.map(function (item) {
          var catClass = 'legend-' + item.category;
          return '<div class="entity-flat-row">' +
                 '  <div class="entity-flat-left">' +
                 '    <span class="legend-chip ' + catClass + '">' + item.type + '</span>' +
                 '    <span class="entity-flat-name">' + item.label + '</span>' +
                 '  </div>' +
                 '  <span class="entity-flat-code">' + item.code + '</span>' +
                 '</div>';
        }).join('');
      }

      // Render FHIR JSON with syntax highlighting
      if (fhirBox) {
        var rawJson = JSON.stringify(cData.fhir, null, 2);
        fhirBox.dataset.rawJson = rawJson;
        fhirBox.innerHTML = syntaxHighlightJson(rawJson);
        fhirBox.scrollTop = 0;
      }
    }

    function syntaxHighlightJson(json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
      }
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'token-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'token-key';
          } else {
            cls = 'token-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'token-boolean';
        } else if (/null/.test(match)) {
          cls = 'token-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }

    function copyFhirBundle() {
      var fhirBox = document.getElementById('internize-fhir-display');
      if (!fhirBox) return;
      var text = fhirBox.dataset.rawJson || fhirBox.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('FHIR R4 Bundle copied to clipboard!');
        }).catch(function () {
          showToast('FHIR JSON ready to copy.');
        });
      } else {
        showToast('FHIR JSON ready.');
      }
    }

    // Initial render for Tab 3 simulation
    renderInternizeSimulation();

    /* ==========================================================
       Toast Notification & Clipboard Utilities
       ========================================================== */
    var toastTimer = null;
    function showToast(message) {
      var toast = document.getElementById('global-toast');
      var msgEl = document.getElementById('toast-message');
      if (!toast || !msgEl) return;

      msgEl.textContent = message;
      toast.classList.add('show');

      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toast.classList.remove('show');
      }, 3200);
    }

    function handleEmailClick(e, email) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).catch(function () {});
      }
      showToast('Email address copied. Opening Gmail…');
    }

    function copyEmailOnly(e, email) {
      e.preventDefault();
      e.stopPropagation();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showToast('Email address copied to clipboard!');
        }).catch(function () {
          showToast('Email: ' + email);
        });
      } else {
        showToast('Email: ' + email);
      }
    }

    /* ==========================================================
       Google Apps Script (GAS) & Google Sites Iframe Bridge:
       Smooth internal #anchor scrolling without iframe reload
       ========================================================== */
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var targetId = href.slice(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
