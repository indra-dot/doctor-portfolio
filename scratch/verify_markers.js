const fs = require('fs');

const original = fs.readFileSync('adjustr-GEH.html', 'utf8');

// 1. Check home-module update
const homeSearchStr = '<span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka 12 Kalkulator <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>';
const homeReplaceStr = '<span class="mt-auto text-xs text-amber-400 font-semibold flex items-center">Buka 13 Kalkulator <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i></span>';

console.log('Home search string found:', original.includes(homeSearchStr));

// In home description:
const homeDescSearch = '<p class="text-xs text-slate-400 line-clamp-2 mb-3">Child-Pugh, MELD Trio, ESPEN Nutrition, SAAG & PMN, FIB-4 & APRI, R-Factor, De Ritis, NFS, Maddrey, CLIF-C, Baveno VII, & Panel LFT RS.</p>';
const homeDescReplace = '<p class="text-xs text-slate-400 line-clamp-2 mb-3">Child-Pugh, MELD Trio, ESPEN Nutrition, SAAG & PMN, FIB-4 & APRI, R-Factor, De Ritis, NFS, Maddrey, CLIF-C, Baveno VII, Panel LFT RS, & Revised AIH Score.</p>';

console.log('Home desc string found:', original.includes(homeDescSearch));

// 2. Hub-hepa badge & new card
const hubBadgeSearch = '<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">11 Modul</span>';
const hubBadgeReplace = '<span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">13 Modul</span>';

console.log('Hub badge search string found:', original.includes(hubBadgeSearch));

const hubEndCardMarker = `                    <!-- Profil LFT & Protein RS -->`;
console.log('Hub LFT marker found:', original.includes(hubEndCardMarker));

// 3. Module section insertion after lft-profile-module
const lftSectionEnd = `                        <p class="text-slate-300"><strong>ACG Clinical Guideline (2017):</strong> Evaluation of Abnormal Liver Chemistries (Kwo PY, Cohen SM, Lim JK). <em>Am J Gastroenterol</em>. 2017;112(1):18-35. Fraksi bilirubin direk &gt;50% mengonfirmasi hiperbilirubinemia terkonjugasi/kolestatik. Rasio A/G &lt;1.0 (reversal) merupakan penanda penurunan fungsi sintesis hepatik kronis dan hipergamaglobulinemia poliklonal pada sirosis hepar.</p>
                    </div>
                </div>
            </section>`;

console.log('LFT section end found:', original.includes(lftSectionEnd));

// 4. CALCULATORS_DB entry insertion
const calcDbMarker = `            // Hepatology (11)`;
console.log('CALCULATORS_DB marker found:', original.includes(calcDbMarker));
