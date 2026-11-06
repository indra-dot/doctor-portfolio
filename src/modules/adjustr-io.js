function initAdjustrIo(container, ctx, emit) {
  container.innerHTML = IO_CONTAINER_HTML;

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
          errors.push('Usia harus berupa angka positif.');
        } else if (age < 18) {
          warnings.push('<strong>Peringatan Pediatrik:</strong> Persamaan Cockcroft-Gault &amp; CKD-EPI divalidasi untuk dewasa (usia &ge; 18 th). Untuk pasien anak, gunakan rumus Bedside Schwartz.');
        } else if (age > 120) {
          warnings.push('Usia > 120 tahun: Harap periksa kembali usia yang dimasukkan.');
        }
      }

      // Validate weight
      if (weightStr) {
        if (isNaN(weight) || weight <= 0) {
          errors.push('Berat badan aktual (TBW) harus berupa angka positif lebih dari 0 kg.');
        } else if (weight < 25 || weight > 350) {
          warnings.push('Berat badan (' + weight + ' kg) berada di luar rentang tipikal dewasa (25–350 kg).');
        }
      }

      // Validate height
      if (heightStr) {
        if (isNaN(height) || height <= 0) {
          errors.push('Tinggi badan harus berupa angka positif lebih dari 0 cm.');
        } else if (height < 60 || height > 240) {
          warnings.push('Tinggi badan (' + height + ' cm) berada di luar rentang tipikal dewasa.');
        }
      }

      // Validate creatinine
      if (scrStr) {
        if (isNaN(scr) || scr <= 0) {
          errors.push('Kreatinin serum (SCr) harus lebih besar dari 0 mg/dL.');
        } else if (scr < 0.2) {
          warnings.push('<strong>Physiological Floor:</strong> Kreatinin serum sangat rendah (&lt; 0.2 mg/dL) umumnya mencerminkan massa otot rendah/kakeksia, yang dapat menghasilkan overestimasi (angka CrCl semu tinggi).');
        } else if (scr > 20) {
          warnings.push('Kreatinin serum meningkat nyata (&gt; 20 mg/dL): Gagal ginjal akut berat atau ESRD terminal.');
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
      el.valBsa.textContent = res.bsa.toFixed(2) + ' m&sup2;';
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
        el.drugToxicityBadge.textContent = 'Nefrotoksik + Neurotoksik';
      } else if (drug.isNephrotoxic) {
        el.drugToxicityBadge.style.display = 'inline-flex';
        el.drugToxicityBadge.className = 'badge-pill badge-red';
        el.drugToxicityBadge.textContent = 'Agen Nefrotoksik';
      } else if (drug.isNeurotoxic) {
        el.drugToxicityBadge.style.display = 'inline-flex';
        el.drugToxicityBadge.className = 'badge-pill badge-amber';
        el.drugToxicityBadge.textContent = 'Risiko Neurotoksik';
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
        el.drugContraindicationText.innerHTML = '<strong>KONTRAINDIKASI MUTLAK:</strong> ' + drug.contraindication;
      } else if (drug.contraindication && crcl < 60) {
        el.drugContraindicationAlert.style.display = 'flex';
        el.drugContraindicationText.innerHTML = '<strong>PERINGATAN KLINIS:</strong> ' + drug.contraindication;
      } else {
        el.drugContraindicationAlert.style.display = 'none';
      }

      // Loading dose note
      if (drug.loadingDose) {
        el.loadingDoseBanner.style.display = 'flex';
        el.loadingDoseText.innerHTML = '<strong>PRINSIP LOADING DOSE:</strong> ' + drug.loadingDose;
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
          basisLabel = 'Berat Badan Aktual (TBW)';
        }

        if (activeStrategyData.is_bsa) {
          const bsaDose = Math.round(doseFactor * state.patientResults.bsa);
          el.valCalculatedSingleDose.textContent = bsaDose + ' mg';
          el.valSingleDoseBasis.textContent = doseFactor + ' mg/m&sup2; &times; ' + state.patientResults.bsa.toFixed(2) + ' m&sup2;';
        } else {
          const totalMg = doseFactor * weightForDose;
          if (totalMg >= 1000) {
            el.valCalculatedSingleDose.textContent = (totalMg / 1000).toFixed(2) + ' g';
          } else {
            el.valCalculatedSingleDose.textContent = Math.round(totalMg) + ' mg';
          }
          el.valSingleDoseBasis.textContent = doseFactor + ' mg/kg &times; ' + weightForDose.toFixed(1) + ' kg (' + basisLabel + ')';
        }
      } else {
        el.singleDoseBox.style.display = 'none';
      }

      // Matched Renal Adjusted Regimen
      const adjustments = activeStrategyData.adjustments || [];
      if (!state.patientResults) {
        el.valMaintenanceDose.textContent = activeStrategyData.standard_dose || 'Standard Dose';
        el.activeCrclIndicator.textContent = 'Masukkan data laboratorium pasien untuk penyesuaian CrCl';
      } else {
        const matchResult = ClinicalEngine.matchAdjustment(adjustments, state.patientResults.crCl);
        if (matchResult && matchResult.matched) {
          el.valMaintenanceDose.textContent = matchResult.matched.recommendation;
          el.activeCrclIndicator.textContent = 'Tercocokkan: ' + matchResult.matched.label + ' (CrCl Pasien: ' + state.patientResults.crCl.toFixed(1) + ' mL/min)';
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
        el.valRrtIhd.textContent = rrtData.ihd || 'Konsultasikan dengan spesialis nefrologi / farmasi klinis.';
        el.valRrtCrrt.textContent = rrtData.crrt || 'Konsultasikan dengan farmasi klinis intensive care / ICU.';
      } else {
        el.valRrtIhd.textContent = 'Berikan dosis pasca-HD pada hari dialisis; panduan TDM dianjurkan.';
        el.valRrtCrrt.textContent = 'Dosis standar terapi pengganti ginjal kontinu (CRRT).';
      }

      // Clinical Pearls
      el.valClinicalNote.textContent = drug.note || 'Tidak ada catatan farmakologi khusus.';

      // Generate CPPT Text
      generateDrugCPPT(drug, activeStrategyData);
    }

    // 7. DRUG SEARCH & FILTERING
    function toggleTierTable(btn) {
      const collapse = btn.nextElementSibling;
      const isOpen = !collapse.hidden;
      if (isOpen) {
        collapse.hidden = true;
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        collapse.hidden = false;
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    }

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
        el.drugDropdown.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">Tidak ditemukan antimikroba yang cocok.</div>';
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


    // Helper Toast
    function showToast(msg) {
      const toastEl = document.getElementById('toast-notice');
      const toastMsg = document.getElementById('toast-message');
      if (toastEl && toastMsg) {
        toastMsg.textContent = msg;
        toastEl.style.transform = 'translateY(0)';
        toastEl.style.opacity = '1';
        toastEl.style.pointerEvents = 'auto';
        setTimeout(function() {
          toastEl.style.transform = 'translateY(100px)';
          toastEl.style.opacity = '0';
          toastEl.style.pointerEvents = 'none';
        }, 3200);
      }
    }

    function generateDrugCPPT(drug, activeStrategyData) {
      const cpptPre = document.getElementById('drug-cppt-pre');
      if (!cpptPre) return;

      const pRes = state.patientResults;
      const crclVal = pRes ? pRes.crCl.toFixed(1) + ' mL/min' : '--';
      const normCrcl = pRes ? pRes.normCrCl.toFixed(1) + ' mL/min/1.73m2' : '--';
      const ckdEpi = pRes ? pRes.ckdEpi.toFixed(1) + ' mL/min/1.73m2' : '--';
      const ageVal = state.age || '--';
      const weightVal = state.weight || '--';
      const heightVal = state.height || '--';
      const scrVal = state.serumCreatinine || '--';
      const genderVal = state.gender === 'male' ? 'Pria' : 'Wanita';

      let text = '[adjustr-io CDSS] PENYESUAIAN DOSIS ANTIMIKROBA\n';
      text += 'Pasien: ' + genderVal + ', Usia ' + ageVal + ' th, BB ' + weightVal + ' kg, TB ' + heightVal + ' cm | SCr ' + scrVal + ' mg/dL\n';
      text += 'Klirens Ginjal: CrCl ' + crclVal + ' (Cockcroft-Gault) | eGFR ' + ckdEpi + ' (CKD-EPI 2021)\n';
      if (pRes) {
        text += 'Bobot Dosing: ' + pRes.usedWeight.toFixed(1) + ' kg (' + pRes.weightType + ') | BSA: ' + pRes.bsa.toFixed(2) + ' m2\n\n';
      }

      text += 'OBAT TERPILIH: ' + drug.name + ' (' + drug.class + ')\n';
      if (state.selectedStrategyName) {
        text += 'Indikasi / Strategi: ' + state.selectedStrategyName + '\n';
      }
      text += '- Dosis Standar (Fungsi Normal): ' + (activeStrategyData.standard_dose || '--') + '\n';

      const singleDoseEl = document.getElementById('val-calculated-single-dose');
      if (singleDoseEl && singleDoseEl.textContent !== '--' && document.getElementById('single-dose-box').style.display !== 'none') {
        text += '- Kalkulasi Single Dose: ' + singleDoseEl.textContent + ' (' + document.getElementById('val-single-dose-basis').textContent + ')\n';
      }

      const maintDose = document.getElementById('val-maintenance-dose')?.textContent || '--';
      const activeIndicator = document.getElementById('active-crcl-indicator')?.textContent || '';
      text += '- Rekomendasi Rumatan Ginjal: ' + maintDose + ' [' + activeIndicator + ']\n';

      const rrtIhd = document.getElementById('val-rrt-ihd')?.textContent;
      const rrtCrrt = document.getElementById('val-rrt-crrt')?.textContent;
      if (rrtIhd && rrtIhd !== '--') text += '- Hemodialisis (IHD): ' + rrtIhd + '\n';
      if (rrtCrrt && rrtCrrt !== '--') text += '- CRRT: ' + rrtCrrt + '\n';

      if (drug.note) {
        text += '- Clinical Pearl: ' + drug.note + '\n';
      }

      cpptPre.textContent = text;
    }

    window.copyDrugResume = function() {
      const cpptPre = document.getElementById('drug-cppt-pre');
      if (!cpptPre || !cpptPre.textContent) {
        showToast('Pilih obat terlebih dahulu.');
        return;
      }
      const textToCopy = cpptPre.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(function() {
          showToast('Resume penyesuaian dosis obat berhasil disalin!');
        }).catch(function() {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    };

    function fallbackCopyText(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Resume penyesuaian dosis obat berhasil disalin!');
      } catch (e) {
        showToast('Gagal menyalin otomatis, silakan salin manual.');
      }
      document.body.removeChild(ta);
    }

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
      // Also reset selected drug
      state.selectedDrugKey = null;
      state.selectedStrategyName = null;
      el.drugSearch.value = '';
      el.selectedDrugCard.style.display = 'none';
      showToast('Parameter biometrik dan kalkulator direset ke default.');
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

  // Pre-fill from patient context
  if (ctx) {
    if (ctx.age !== undefined && el.inputAge) el.inputAge.value = ctx.age;
    if (ctx.bb !== undefined && el.inputWeight) el.inputWeight.value = ctx.bb;
    if ((ctx.tb !== undefined || ctx.h !== undefined) && el.inputHeight) el.inputHeight.value = ctx.tb || ctx.h;
    if (ctx.cr !== undefined && el.inputCreatinine) el.inputCreatinine.value = ctx.cr;
    if (ctx.sex !== undefined) {
      if (ctx.sex === 'P' || ctx.sex === 'female') {
        if (el.genderFemale) el.genderFemale.click();
      } else {
        if (el.genderMale) el.genderMale.click();
      }
    }
    recalculate();
  }

  // Default drug selection
  selectDrug('meropenem');

  // Hook copy button
  const copyBtn = container.querySelector('#btn-copy-cppt');
  if (copyBtn) {
    const origHandler = copyBtn.onclick;
    copyBtn.onclick = (e) => {
      if (origHandler) origHandler(e);
      const pre = container.querySelector('#drug-cppt-pre');
      if (pre && pre.textContent) {
        window._last = pre.textContent;
        if (emit) emit({ value: 'Disalin', text: 'Dosis Antimikroba Disalin', cppt: pre.textContent });
      }
    };
  }
}

reg({
  id: 'adjustr-io',
  nama: 'Penyesuaian Dosis Antimikroba (adjustr-io CDSS)',
  divisi: 'Ginjal-Hipertensi',
  sub: 'Farmakologi Ginjal',
  tags: 'antimikroba antibiotik dosis ginjal crcl ckd-epi kdigo hemodialisis ihd crrt meropenem vankomisin colistin piperasilin penyesuaian dosis',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    initAdjustrIo(container, ctx, emit);
  }
});

reg({
  id: 'crcl-cockcroft',
  nama: 'Kalkulator Klirens Kreatinin Cockcroft-Gault & Berat Badan Dosis',
  divisi: 'Ginjal-Hipertensi',
  sub: 'Fungsi Ginjal',
  tags: 'crcl cockcroft gault klirens kreatinin ibw abw devine kdigo berat kering gfr',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Jenis Kelamin</label>
          <select id="cg_sex"><option value="male">Laki-laki</option><option value="female">Perempuan</option></select>
        </div>
        <div>
          <label>Usia (tahun)</label>
          <input type="number" id="cg_age" value="${ctx && ctx.age ? ctx.age : 50}">
        </div>
        <div>
          <label>Berat Badan Aktual (kg)</label>
          <input type="number" id="cg_wt" step="0.1" value="${ctx && ctx.bb ? ctx.bb : 65}">
        </div>
        <div>
          <label>Tinggi Badan (cm)</label>
          <input type="number" id="cg_ht" step="0.1" value="${ctx && (ctx.tb || ctx.h) ? (ctx.tb || ctx.h) : 165}">
        </div>
        <div>
          <label>Serum Kreatinin (mg/dL)</label>
          <input type="number" id="cg_scr" step="0.01" value="${ctx && ctx.cr ? ctx.cr : 1.0}">
        </div>
      </div>
      <div id="cg_res" style="margin-top:16px;"></div>
    `;

    const calc = () => {
      const sex = container.querySelector('#cg_sex').value;
      const age = parseFloat(container.querySelector('#cg_age').value) || 0;
      const wt = parseFloat(container.querySelector('#cg_wt').value) || 0;
      const ht = parseFloat(container.querySelector('#cg_ht').value) || 0;
      const scr = parseFloat(container.querySelector('#cg_scr').value) || 0;

      if (age <= 0 || wt <= 0 || ht <= 0 || scr <= 0) return;

      const res = ClinicalEngine.calculateCrCl(age, wt, ht, scr, sex);
      const egfr = ClinicalEngine.calculateCKDEPI(age, scr, sex);
      const kdigo = ClinicalEngine.classifyKDIGO(egfr != null ? egfr : res.crCl);

      const html = `
        <div class="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span class="text-xs text-slate-400 block">CrCl Cockcroft</span>
              <span class="text-xl font-black text-cyan-400">${res.crCl.toFixed(1)}</span>
              <span class="text-[10px] text-slate-400 block">mL/min</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span class="text-xs text-slate-400 block">CrCl Normalisasi</span>
              <span class="text-xl font-bold text-white">${res.normCrCl.toFixed(1)}</span>
              <span class="text-[10px] text-slate-400 block">mL/min/1.73m²</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span class="text-xs text-slate-400 block">CKD-EPI 2021</span>
              <span class="text-xl font-bold text-emerald-400">${egfr.toFixed(1)}</span>
              <span class="text-[10px] text-slate-400 block">mL/min/1.73m²</span>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span class="text-xs text-slate-400 block">Stadium KDIGO</span>
              <span class="text-xl font-black text-amber-400">${kdigo.stage}</span>
              <span class="text-[10px] text-slate-400 block">${kdigo.label}</span>
            </div>
          </div>
          <div class="text-xs text-slate-300 space-y-1">
            <p><strong>Bobot Dosis Digunakan:</strong> ${res.usedWeight.toFixed(1)} kg (${res.weightType}) | <strong>IBW:</strong> ${res.ibw.toFixed(1)} kg | <strong>BSA:</strong> ${res.bsa.toFixed(2)} m²</p>
            <p class="text-slate-400">${kdigo.desc}</p>
          </div>
        </div>
      `;
      container.querySelector('#cg_res').innerHTML = html;

      const cppt = `[InternaHub CDSS] Evaluasi Klirens Ginjal
CrCl Cockcroft-Gault: ${res.crCl.toFixed(1)} mL/min (Normalisasi: ${res.normCrCl.toFixed(1)} mL/min/1.73m²)
CKD-EPI 2021 eGFR: ${egfr.toFixed(1)} mL/min/1.73m² (KDIGO ${kdigo.stage} - ${kdigo.label})
Bobot Dosis: ${res.usedWeight.toFixed(1)} kg (${res.weightType}) | TBW: ${wt} kg | IBW: ${res.ibw.toFixed(1)} kg | BSA: ${res.bsa.toFixed(2)} m²`;
      window._last = cppt;
      emit({ value: res.crCl.toFixed(1) + ' mL/min', text: 'KDIGO ' + kdigo.stage + ' (' + kdigo.label + '). CKD-EPI: ' + egfr.toFixed(1), cls: res.crCl < 30 ? 'bad' : res.crCl < 60 ? 'warn' : 'ok', cppt });
    };

    container.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  }
});

reg({
  id: 'ckd-epi-2021',
  nama: 'Kalkulator eGFR CKD-EPI 2021 (Race-Free)',
  divisi: 'Ginjal-Hipertensi',
  sub: 'Fungsi Ginjal',
  tags: 'ckd-epi egfr 2021 race free tanpa ras kreatinin kdigo staging penyakit ginjal kronik pgk',
  batch: 'M5',
  mount: (container, ctx, emit) => {
    container.innerHTML = `
      <div class="row">
        <div>
          <label>Jenis Kelamin</label>
          <select id="epi_sex"><option value="male">Laki-laki</option><option value="female">Perempuan</option></select>
        </div>
        <div>
          <label>Usia (tahun)</label>
          <input type="number" id="epi_age" value="${ctx && ctx.age ? ctx.age : 50}">
        </div>
        <div>
          <label>Serum Kreatinin (mg/dL)</label>
          <input type="number" id="epi_scr" step="0.01" value="${ctx && ctx.cr ? ctx.cr : 1.0}">
        </div>
      </div>
      <div id="epi_res" style="margin-top:16px;"></div>
    `;

    const calc = () => {
      const sex = container.querySelector('#epi_sex').value;
      const age = parseFloat(container.querySelector('#epi_age').value) || 0;
      const scr = parseFloat(container.querySelector('#epi_scr').value) || 0;

      if (age <= 0 || scr <= 0) return;

      const egfr = ClinicalEngine.calculateCKDEPI(age, scr, sex);
      const kdigo = ClinicalEngine.classifyKDIGO(egfr);

      const html = `
        <div class="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30">
          <div class="flex items-center justify-between mb-3">
            <div>
              <span class="text-xs text-slate-400 block font-semibold">eGFR CKD-EPI 2021</span>
              <span class="text-3xl font-black text-emerald-400">${egfr.toFixed(1)}</span>
              <span class="text-xs text-slate-400">mL/min/1.73 m²</span>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${kdigo.stage}</span>
              <span class="block text-sm font-bold text-white mt-1">${kdigo.label}</span>
            </div>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${kdigo.desc}</p>
        </div>
      `;
      container.querySelector('#epi_res').innerHTML = html;

      const cppt = `[InternaHub CDSS] eGFR CKD-EPI 2021 (Race-Free)
Usia: ${age} th | Jenis Kelamin: ${sex === 'male' ? 'Laki-laki' : 'Perempuan'} | SCr: ${scr} mg/dL
Hasil: ${egfr.toFixed(1)} mL/min/1.73 m²
Staging KDIGO: ${kdigo.stage} (${kdigo.label})
Deskripsi: ${kdigo.desc}`;
      window._last = cppt;
      emit({ value: egfr.toFixed(1) + ' mL/min/1.73m²', text: 'KDIGO ' + kdigo.stage + ' (' + kdigo.label + ')', cls: egfr < 30 ? 'bad' : egfr < 60 ? 'warn' : 'ok', cppt });
    };

    container.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  }
});