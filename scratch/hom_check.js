
const PIL={onco:'Onco-Emergency',chemo:'Chemo Dosing',hemo:'Hemostasis & Trombosis',transf:'Transfusi & Prognostik'};
const ok=Number.isFinite;
const f=(x,d=1)=>Number(x).toFixed(d).replace('.',',');
const NUM=(k,l,u,o={})=>({k,l,t:'num',u,...o});
const SEL=(k,l,opts,o={})=>({k,l,t:'sel',opts,...o});
const CHK=(k,l)=>({k,l,t:'chk',full:true});
const sumC=(v,ks)=>ks.reduce((a,k)=>a+(v[k]?1:0),0);
const miss=m=>({missing:m||'Lengkapi parameter yang diperlukan.'});
const C=[];

/* ===== PILAR 1 ===== */
C.push({id:'mascc',pillar:'onco',title:'MASCC Risk Index',sub:'Stratifikasi risiko neutropenia febril (skor maks 26). Centang bila kriteria terpenuhi.',tags:'neutropenia febril fever',
fields:[SEL('burden','Beban penyakit (gejala demam)',[['5','Tanpa/gejala ringan (5)'],['3','Gejala sedang (3)'],['0','Gejala berat/moribund (0)']],{full:true}),
CHK('nohypo','Tidak hipotensi (SBP >90 mmHg) (+5)'),CHK('nocopd','Tidak ada PPOK (+4)'),
CHK('nofungal','Tumor solid, atau keganasan hematologi tanpa riwayat infeksi jamur (+4)'),
CHK('nodehyd','Tidak dehidrasi yang butuh cairan IV (+3)'),CHK('outpt','Status rawat jalan saat onset demam (+3)'),CHK('age60','Usia <60 tahun (+2)')],
run:v=>{const s=Number(v.burden)+5*(v.nohypo?1:0)+4*(v.nocopd?1:0)+4*(v.nofungal?1:0)+3*(v.nodehyd?1:0)+3*(v.outpt?1:0)+2*(v.age60?1:0);
const low=s>=21;return{level:low?'ok':'bad',head:'MASCC '+s+'/26 \u2192 '+(low?'RISIKO RENDAH':'RISIKO TINGGI'),
lines:['Ambang risiko rendah: skor \u226521.'],
plan:low?['Kultur darah \u00d72 sebelum antibiotik.','Pertimbangkan terapi oral (amoksisilin-klavulanat + siprofloksasin) bila tanpa profilaksis kuinolon, bisa observasi, dan akses/follow-up terjamin.']
:['Kultur darah \u00d72 (perifer + CVC bila ada), lalu antibiotik IV anti-pseudomonas dalam \u226460 menit: piperasilin-tazobaktam / sefepim / meropenem.','Rawat inap, monitor hemodinamik & laktat.','Evaluasi G-CSF bila risiko tinggi komplikasi.']}}});

C.push({id:'cisne',pillar:'onco',title:'CISNE Score',sub:'Khusus tumor solid dengan neutropenia febril yang tampak stabil (tanpa hipotensi/sepsis berat).',tags:'neutropenia febril solid',
fields:[CHK('ecog','ECOG PS \u22652 (+2)'),CHK('hyper','Hiperglikemia akibat stres (+2)'),CHK('copd','PPOK (+1)'),CHK('cvd','Penyakit kardiovaskular kronik (+1)'),CHK('muc','Mukositis NCI grade \u22652 (+1)'),CHK('mono','Monosit <200/\u00b5L (+1)')],
run:v=>{const s=2*(v.ecog?1:0)+2*(v.hyper?1:0)+sumC(v,['copd','cvd','muc','mono']);
const g=s===0?['ok','RISIKO RENDAH']:s<=2?['warn','RISIKO INTERMEDIATE']:['bad','RISIKO TINGGI'];
return{level:g[0],head:'CISNE '+s+' \u2192 '+g[1],lines:['0 = rendah, 1\u20132 = intermediate, \u22653 = tinggi (risiko komplikasi serius).'],
plan:s===0?['Kandidat terapi oral/rawat jalan bila kriteria klinis lain terpenuhi.']:s<=2?['Pertimbangkan rawat inap singkat / observasi ketat.']:['Rawat inap, antibiotik IV empirik, monitor ketat.']}}});

C.push({id:'tls',pillar:'onco',title:'Tumor Lysis Syndrome (Cairo-Bishop)',sub:'Isi nilai lab; sistem menghitung kriteria laboratorik & klinis. (Kriteria juga mencakup perubahan \u226525% dari baseline.)',tags:'tls lisis tumor rasburicase',
fields:[NUM('ua','Asam urat','mg/dL',{step:.1}),NUM('k','Kalium','mmol/L',{step:.1}),NUM('ph','Fosfat','mg/dL',{step:.1}),NUM('ca','Kalsium','mg/dL',{step:.1}),
NUM('cr','Kreatinin (\u00d7 ULN)','\u00d7ULN',{step:.1}),CHK('arr','Aritmia jantung / henti jantung mendadak'),CHK('sz','Kejang')],
run:v=>{if(!['ua','k','ph','ca'].some(k=>ok(v[k])))return miss('Isi minimal satu parameter lab.');
const L=[];if(ok(v.ua)&&v.ua>=8)L.push('Asam urat \u22658 mg/dL');if(ok(v.k)&&v.k>=6)L.push('Kalium \u22656 mmol/L');if(ok(v.ph)&&v.ph>=4.5)L.push('Fosfat \u22654,5 mg/dL');if(ok(v.ca)&&v.ca<=7)L.push('Kalsium \u22647 mg/dL');
const lab=L.length>=2;const K=[];if(ok(v.cr)&&v.cr>=1.5)K.push('Kreatinin \u22651,5\u00d7ULN');if(v.arr)K.push('Aritmia');if(v.sz)K.push('Kejang');
const plan=['Hiperhidrasi IV (\u22482\u20133 L/m\u00b2/hari), target urin \u2265100 mL/jam; hindari suplemen K/P/Ca kecuali simtomatik.','Monitor lab (K, P, Ca, urat, kreatinin) tiap 4\u20136 jam.','Rasburicase 0,2 mg/kg IV bila risiko tinggi/urat tinggi (SKRINING G6PD dulu; kontraindikasi bila defisiensi G6PD). Alternatif: allopurinol.','Konsul nefrologi bila oliguria/hiperkalemia/hiperfosfatemia refrakter (pertimbangkan dialisis).'];
if(lab&&K.length)return{level:'bad',head:'CLINICAL TLS',lines:['Lab: '+L.join('; '),'Klinis: '+K.join('; ')],plan:['Rawat ICU/HCU, EKG kontinu.',...plan]};
if(lab)return{level:'warn',head:'LABORATORY TLS',lines:['Kriteria terpenuhi: '+L.join('; ')],plan};
return{level:'ok',head:'Belum memenuhi kriteria Laboratory TLS ('+L.length+'/2)',lines:L.length?['Terpenuhi: '+L.join('; ')]:['Tidak ada kriteria terpenuhi.'],plan:['Tetap monitor bila risiko TLS tinggi (tumor burden besar, LDH tinggi, leukemia/limfoma agresif).']}}});

C.push({id:'cacorr',pillar:'onco',title:'Kalsium Terkoreksi & Hiperkalsemia Malignansi',sub:'Ca terkoreksi = Ca + 0,8 \u00d7 (4,0 \u2212 albumin). Idealnya konfirmasi dengan kalsium terionisasi.',tags:'hiperkalsemia kalsium calcium',
fields:[NUM('ca','Kalsium total','mg/dL',{step:.1}),NUM('alb','Albumin','g/dL',{step:.1})],
run:v=>{if(!ok(v.ca)||!ok(v.alb))return miss();const c=v.ca+0.8*(4-v.alb);
const g=c<10.5?['ok','Normal / tidak hiperkalsemia']:c<12?['warn','Hiperkalsemia RINGAN']:c<=14?['warn','Hiperkalsemia SEDANG']:['bad','Hiperkalsemia BERAT / krisis'];
const plan=c<10.5?['Tidak diperlukan terapi hiperkalsemia.']:c<12?['Bila asimtomatik: rehidrasi & hindari obat memperberat (tiazid, vit D/Ca).']:['Rehidrasi NaCl 0,9% (target urin 100\u2013150 mL/jam; diuretik loop hanya bila overload).','Zoledronat 4 mg IV (\u226515 mnt) atau pamidronat 60\u201390 mg IV; sesuaikan fungsi ginjal.','Kalsitonin 4 IU/kg SC tiap 12 jam (48 jam pertama) untuk efek cepat.','Denosumab 120 mg SC bila refrakter bisfosfonat / eGFR rendah.','Terapi kausa keganasan; monitor Ca, Mg, P, K.'];
return{level:g[0],head:'Ca terkoreksi '+f(c,1)+' mg/dL \u2192 '+g[1],lines:['Ringan <12; sedang 12\u201314; berat >14 mg/dL.'],plan}}});

C.push({id:'redflag',pillar:'onco',title:'Red Flag: Kompresi Medula Spinalis & SVCO',sub:'Checklist cepat kegawatan onkologi struktural.',tags:'spinal cord compression svco vena kava',
fields:[CHK('c1','Nyeri punggung progresif / nyeri radikuler (pasien kanker)'),CHK('c2','Kelemahan tungkai / gangguan gait'),CHK('c3','Gangguan sensorik / level sensorik'),CHK('c4','Retensi urin / inkontinensia'),
CHK('s1','Edema wajah/leher/lengan'),CHK('s2','Distensi vena leher / kolateral dada'),CHK('s3','Dispnea berat / stridor'),CHK('s4','Sefalgia / penurunan kesadaran')],
run:v=>{const cord=sumC(v,['c1','c2','c3','c4']),sv=sumC(v,['s1','s2','s3','s4']);if(!cord&&!sv)return{level:'ok',head:'Tidak ada red flag dipilih',lines:[],plan:[]};
const lines=[],plan=[];let lv='warn';
if(cord){lv='bad';lines.push('Curiga kompresi medula spinalis ('+cord+' tanda).');plan.push('MRI seluruh tulang belakang CITO.','Deksametason 10 mg IV bolus, lanjut 16 mg/hari terbagi (mis. 4 mg tiap 6 jam) + proteksi lambung.','Konsul radioterapi / bedah saraf SEGERA; imobilisasi bila curiga instabil.');}
if(sv){if(v.s3||v.s4)lv='bad';lines.push('Curiga SVCO ('+sv+' tanda).');plan.push('Posisi kepala tinggi, O\u2082; CT toraks kontras.','Stridor/gangguan neurologis = kegawatan: stent / RT cito; steroid hanya bila limfoma/dugaan sensitif.','Hindari akses IV di ekstremitas atas bila memungkinkan.');}
return{level:lv,head:cord&&sv?'RED FLAG: kompresi medula & SVCO':cord?'RED FLAG: Kompresi Medula Spinalis':'WASPADA: Sindrom Vena Kava Superior',lines,plan}}});

/* ===== PILAR 2 ===== */
C.push({id:'calvert',pillar:'chemo',title:'Calvert - Dosis Karboplatin',sub:'Dosis (mg) = AUC \u00d7 (GFR + 25). GFR dibatasi maksimum 125 mL/mnt.',tags:'carboplatin karboplatin calvert auc gfr',
fields:[NUM('auc','Target AUC','',{step:.5}),NUM('gfr','GFR langsung (opsional)','mL/mnt'),NUM('age','Usia','th'),NUM('wt','Berat badan','kg',{step:.1}),
SEL('sex','Jenis kelamin',[['m','Laki-laki'],['f','Perempuan']]),NUM('scr','Kreatinin serum','mg/dL',{step:.01}),CHK('floor','Terapkan batas bawah SCr 0,7 mg/dL (kebijakan institusi)')],
run:v=>{if(!ok(v.auc))return miss('Isi target AUC.');let g,src;
if(ok(v.gfr)){g=v.gfr;src='GFR input langsung';}else{if(!ok(v.age)||!ok(v.wt)||!ok(v.scr))return miss('Isi GFR langsung, atau usia + BB + kreatinin (Cockcroft-Gault).');
let s=v.scr;if(v.floor&&s<0.7)s=0.7;g=(140-v.age)*v.wt/(72*s);if(v.sex==='f')g*=0.85;src='Cockcroft-Gault (BB aktual)';}
const cap=g>125,u=Math.min(g,125),d=v.auc*(u+25);
return{level:cap?'warn':'ok',head:'Dosis karboplatin = '+Math.round(d)+' mg',lines:['GFR digunakan: '+f(u,0)+' mL/mnt ('+src+')'+(cap?' \u2014 DIBATASI dari '+f(g,0):''),'Rumus: '+f(v.auc,1)+' \u00d7 ('+f(u,0)+' + 25)'],
plan:['Verifikasi metode GFR & SCr (IDMS) sesuai protokol.','Pada obesitas/usia lanjut/sarkopenia, pertimbangkan estimasi GFR alternatif.']}}});

C.push({id:'bsa',pillar:'chemo',title:'BSA Multi-Formula',sub:'Mosteller, DuBois, Boyd, Gehan-George + dosis total per m\u00b2.',tags:'bsa body surface area luas permukaan',
fields:[NUM('h','Tinggi badan','cm'),NUM('w','Berat badan','kg',{step:.1}),NUM('dose','Dosis obat (opsional)','mg/m\u00b2')],
run:v=>{if(!ok(v.h)||!ok(v.w))return miss();const h=v.h,w=v.w,wg=w*1000;
const m=Math.sqrt(h*w/3600),d=0.007184*Math.pow(w,0.425)*Math.pow(h,0.725),b=0.0003207*Math.pow(h,0.3)*Math.pow(wg,0.7285-0.0188*Math.log10(wg)),g=0.0235*Math.pow(w,0.51456)*Math.pow(h,0.42246);
const lines=['<table><tr><td>Mosteller</td><td><b>'+f(m,2)+' m\u00b2</b></td></tr><tr><td>DuBois</td><td>'+f(d,2)+' m\u00b2</td></tr><tr><td>Boyd</td><td>'+f(b,2)+' m\u00b2</td></tr><tr><td>Gehan-George</td><td>'+f(g,2)+' m\u00b2</td></tr></table>'];
if(ok(v.dose))lines.push('Dosis total (Mosteller): <b>'+f(v.dose*m,0)+' mg</b> ('+f(v.dose,1)+' mg/m\u00b2 \u00d7 '+f(m,2)+')');
return{level:m>2?'warn':'info',head:'BSA (Mosteller) '+f(m,2)+' m\u00b2',raw:true,lines,plan:m>2?['BSA >2,0 m\u00b2: ikuti panduan ASCO (dosis penuh berbasis BB aktual) / kebijakan institusi.']:[]}}});

const AE={hec:['bad','HEC: Cisplatin, AC (antrasiklin+siklofosfamid), siklofosfamid \u22651500 mg/m\u00b2, dakarbazin',['Olanzapin 5\u201310 mg PO hari 1\u20134','NK1 RA: aprepitan 125 mg PO (hari 1) lalu 80 mg hari 2\u20133, atau fosaprepitan 150 mg IV hari 1','5-HT3 RA: palonosetron 0,25 mg IV / ondansetron 8\u201316 mg hari 1','Deksametason 12 mg hari 1 lalu 8 mg hari 2\u20134 (kurangi bila tanpa NK1 RA sesuai panduan)']],
carbo:['warn','Karboplatin AUC \u22654 (dikategorikan emetogenik tinggi)',['NK1 RA + 5-HT3 RA + deksametason 12 mg hari 1','Olanzapin dapat ditambahkan bila mual breakthrough sebelumnya']],
mec:['warn','MEC: oksaliplatin, doksorubisin, irinotekan, siklofosfamid <1500, karboplatin AUC <4',['5-HT3 RA (palonosetron 0,25 mg IV) + deksametason 8 mg hari 1','Pertimbangkan NK1 RA bila faktor risiko pasien tinggi (wanita muda, riwayat mual)','Deksametason 8 mg hari 2\u20133 opsional']],
lec:['ok','LEC: paklitaksel, docetaxel, gemsitabin, 5-FU, etoposid',['Dosis tunggal: deksametason 8 mg, ATAU 5-HT3 RA, ATAU metoklopramid/prokloperazin']],
min:['ok','Minimal: bevacizumab, rituximab, vinkristin, bleomisin',['Tidak ada profilaksis rutin']]};
C.push({id:'antiemetic',pillar:'chemo',title:'Profilaksis Antiemetik (ASCO/MASCC)',sub:'Pilih kategori emetogenisitas regimen kemoterapi.',tags:'antiemetik mual muntah hec mec',
fields:[SEL('risk','Risiko emetogenik',[['hec','Tinggi (HEC)'],['carbo','Karboplatin AUC \u22654'],['mec','Sedang (MEC)'],['lec','Rendah (LEC)'],['min','Minimal']],{full:true})],
run:v=>{const a=AE[v.risk];return{level:a[0],head:a[1],lines:[],plan:a[2]}}});

const OA={cis:['Cisplatin','CrCl <60 mL/mnt: hindari / pertimbangkan karboplatin. Wajib hidrasi + Mg/K.'],
mtx:['Metotreksat','Reduksi dosis ~35\u201350% pada CrCl 30\u201360; hindari pada CrCl <30. Bilirubin >5 mg/dL: hindari. Dosis tinggi butuh leukovorin & alkalinisasi urin.'],
dox:['Doksorubisin','Bilirubin 1,2\u20133,0: 50% dosis; 3,1\u20135,0: 25%; >5,0 atau Child-Pugh C: hindari. Cek fungsi jantung (LVEF).'],
doc:['Docetaxel','Bilirubin >ULN: hindari; AST/ALT >1,5\u00d7ULN dengan ALP >2,5\u00d7ULN: hindari.'],
cap:['Kapesitabin','CrCl 30\u201350: 75% dosis; CrCl <30: kontraindikasi. Waspada interaksi warfarin.'],
oxa:['Oksaliplatin','CrCl <30: mulai 65 mg/m\u00b2 (label AS); lainnya dosis penuh. Monitor neuropati.'],
iri:['Irinotekan','Bilirubin 1,0\u20132,0: kurangi dosis awal; >2,0: hindari. UGT1A1*28 homozigot: kurangi dosis.']};
C.push({id:'organ',pillar:'chemo',title:'Penyesuaian Dosis Fungsi Organ (Quick Lookup)',sub:'Acuan cepat; WAJIB verifikasi dengan label produk & protokol.',tags:'renal hepatik adjustment dosis',
fields:[SEL('drug','Agen kemoterapi',Object.keys(OA).map(k=>[k,OA[k][0]]),{full:true})],
run:v=>({level:'info',head:OA[v.drug][0],lines:[OA[v.drug][1]],plan:['Gunakan hasil Calvert/eGFR & bilirubin/transaminase terkini.']})});

/* ===== PILAR 3 ===== */
C.push({id:'khorana',pillar:'hemo',title:'Khorana Score (VTE pada Kanker)',sub:'Prediksi risiko tromboemboli sebelum kemoterapi rawat jalan.',tags:'khorana vte tromboemboli cat profilaksis',
fields:[SEL('site','Lokasi tumor primer',[['0','Lainnya (payudara, kolorektal, prostat, dll) (0)'],['1','Risiko tinggi: paru, limfoma, ginekologi, kandung kemih, testis (+1)'],['2','Sangat tinggi: lambung, pankreas (+2)']],{full:true}),
CHK('plt','Trombosit \u2265350.000/\u00b5L (+1)'),CHK('hb','Hb <10 g/dL atau memakai ESA (+1)'),CHK('wbc','Leukosit >11.000/\u00b5L (+1)'),CHK('bmi','BMI \u226535 kg/m\u00b2 (+1)')],
run:v=>{const s=Number(v.site)+sumC(v,['plt','hb','wbc','bmi']);const g=s===0?['ok','RISIKO RENDAH']:s<=2?['warn','RISIKO INTERMEDIATE']:['bad','RISIKO TINGGI'];
return{level:g[0],head:'Khorana '+s+' \u2192 '+g[1],lines:['0 = rendah, 1\u20132 = intermediate, \u22653 = tinggi.'],
plan:s>=2?['Pertimbangkan tromboprofilaksis (ASCO 2023, skor \u22652): apiksaban 2,5 mg 2\u00d7/hari, rivaroksaban 10 mg 1\u00d7/hari, atau LMWH, selama 6 bulan atau selama terapi aktif.','Syarat: tanpa perdarahan aktif, trombosit \u226550.000, tanpa interaksi obat bermakna (CYP3A4/P-gp), fungsi ginjal memadai.','Diskusikan risiko-manfaat dengan pasien.']:['Tromboprofilaksis rutin tidak direkomendasikan; edukasi gejala VTE.']}}});

C.push({id:'4ts',pillar:'hemo',title:'4Ts Score (HIT)',sub:'Probabilitas pra-tes Heparin-Induced Thrombocytopenia.',tags:'hit heparin trombositopenia 4ts',
fields:[SEL('t1','Thrombocytopenia',[['2','Turun >50% DAN nadir \u226520.000 (2)'],['1','Turun 30\u201350% ATAU nadir 10\u201319.000 (1)'],['0','Turun <30% ATAU nadir <10.000 (0)']],{full:true}),
SEL('t2','Timing penurunan trombosit',[['2','Hari 5\u201310, atau \u22641 hari bila paparan heparin 30 hari terakhir (2)'],['1','Konsisten tapi tidak jelas / >hari 10 / \u22641 hari dengan paparan 30\u2013100 hari (1)'],['0','\u22644 hari tanpa paparan heparin baru (0)']],{full:true}),
SEL('t3','Thrombosis / sekuele',[['2','Trombosis baru, nekrosis kulit, reaksi sistemik akut pasca bolus (2)'],['1','Trombosis progresif/rekuren, lesi kulit non-nekrotik, dugaan trombosis (1)'],['0','Tidak ada (0)']],{full:true}),
SEL('t4','oTher causes',[['2','Tidak ada penyebab lain (2)'],['1','Mungkin ada penyebab lain (1)'],['0','Ada penyebab lain yang pasti (0)']],{full:true})],
run:v=>{const s=['t1','t2','t3','t4'].reduce((a,k)=>a+Number(v[k]),0);const g=s<=3?['ok','PROBABILITAS RENDAH']:s<=5?['warn','PROBABILITAS INTERMEDIATE']:['bad','PROBABILITAS TINGGI'];
return{level:g[0],head:'4Ts '+s+'/8 \u2192 '+g[1],lines:['0\u20133 rendah, 4\u20135 intermediate, 6\u20138 tinggi.'],
plan:s<=3?['HIT sangat tidak mungkin; heparin dapat dilanjutkan, cari penyebab lain.']:['Hentikan SEMUA heparin (termasuk flush & kateter berheparin) sambil menunggu tes.','Kirim PF4/heparin ELISA (\u00b1 uji fungsional).','Mulai antikoagulan non-heparin: argatroban / bivalirudin / fondaparinux (sesuaikan ginjal & hati).','Hindari transfusi trombosit profilaksis & warfarin saat fase akut.']}}});

C.push({id:'isth',pillar:'hemo',title:'ISTH Overt DIC Score',sub:'Skor \u22655 sesuai overt DIC.',tags:'dic koagulasi isth fibrinogen',
fields:[SEL('plt','Trombosit',[['0','>100.000/\u00b5L (0)'],['1','50.000\u2013100.000 (1)'],['2','<50.000 (2)']],{full:true}),
SEL('dd','D-dimer / FDP',[['0','Tidak meningkat (0)'],['2','Meningkat sedang (2)'],['3','Meningkat kuat (3)']],{full:true}),
SEL('pt','Pemanjangan PT',[['0','<3 detik (0)'],['1','3\u20136 detik (1)'],['2','>6 detik (2)']],{full:true}),
SEL('fib','Fibrinogen',[['0','>100 mg/dL (0)'],['1','\u2264100 mg/dL (1)']],{full:true})],
run:v=>{const s=['plt','dd','pt','fib'].reduce((a,k)=>a+Number(v[k]),0);const o=s>=5;
return{level:o?'bad':'warn',head:'ISTH '+s+'/8 \u2192 '+(o?'OVERT DIC':'Belum overt DIC (non-overt, ulangi 1\u20132 hari)'),
lines:['Syarat penggunaan: ada kondisi dasar yang berhubungan dengan DIC (sepsis, keganasan, trauma, dll).'],
plan:o?['Terapi kausa dasar (antibiotik/kemoterapi, dsb).','Transfusi hanya bila perdarahan aktif / prosedur: trombosit <50.000 (perdarahan), FFP/kriopresipitat (fibrinogen <150 mg/dL dengan perdarahan).','Pertimbangkan heparin profilaksis/terapeutik bila dominan trombosis & tanpa perdarahan aktif.','Monitor PT, aPTT, fibrinogen, trombosit tiap 6\u201312 jam.']:['Ulangi tes dalam 24\u201348 jam, tangani kondisi dasar.']}}});

C.push({id:'plasmic',pillar:'hemo',title:'PLASMIC Score (TTP)',sub:'Probabilitas defisiensi berat ADAMTS13. Centang bila kriteria TERPENUHI.',tags:'ttp plasmic adamts13 plasma exchange mahah',
fields:[CHK('p1','Trombosit <30.000/\u00b5L'),CHK('p2','Hemolisis: retikulosit >2,5% ATAU haptoglobin tak terdeteksi ATAU bilirubin indirek >2 mg/dL'),CHK('p3','Tidak ada kanker aktif (dalam 1 tahun)'),CHK('p4','Tidak ada riwayat transplantasi organ solid/sel punca'),CHK('p5','MCV <90 fL'),CHK('p6','INR <1,5'),CHK('p7','Kreatinin <2,0 mg/dL')],
run:v=>{const s=sumC(v,['p1','p2','p3','p4','p5','p6','p7']);const g=s<=4?['ok','RISIKO RENDAH']:s===5?['warn','RISIKO INTERMEDIATE']:['bad','RISIKO TINGGI'];
return{level:g[0],head:'PLASMIC '+s+'/7 \u2192 '+g[1],lines:['0\u20134 rendah, 5 intermediate, 6\u20137 tinggi (defisiensi ADAMTS13 <10%).','Catatan: kanker aktif menurunkan nilai prediktif skor.'],
plan:s>=5?['Kirim ADAMTS13 aktivitas + inhibitor SEBELUM plasma exchange.','Mulai plasma exchange (PEX) cito + metilprednisolon/prednison bila probabilitas tinggi; pertimbangkan kaplacizumab & rituksimab sesuai ketersediaan.','Hindari transfusi trombosit kecuali perdarahan mengancam jiwa.']:['TTP kurang mungkin; evaluasi diagnosis banding (DIC, HUS, SLE, obat, keganasan).']}}});

C.push({id:'acplt',pillar:'hemo',title:'Antikoagulasi pada Trombositopenia',sub:'Panduan dosis berdasarkan trombosit (konsensus ISTH, kanker).',tags:'antikoagulan trombositopenia lmwh vte',
fields:[NUM('plt','Trombosit','\u00d710\u00b3/\u00b5L'),SEL('risk','Risiko trombosis',[['hi','Tinggi (VTE akut <30 hari / proksimal / PE)'],['lo','Lebih rendah (VTE subakut / distal / profilaksis)']],{full:true})],
run:v=>{if(!ok(v.plt))return miss('Isi hitung trombosit.');const p=v.plt;
if(p>=50)return{level:'ok',head:'Trombosit \u226550: antikoagulasi dosis penuh',lines:[],plan:['Dosis terapeutik penuh LMWH/DOAC; monitor trombosit & tanda perdarahan.']};
if(p>=25)return{level:'warn',head:'Trombosit 25\u201350: dosis dimodifikasi',lines:[],plan:v.risk==='hi'?['Risiko tinggi: LMWH dosis penuh dengan dukungan transfusi trombosit (jaga >40\u201350k) ATAU reduksi 50%.']:['Risiko lebih rendah: LMWH dosis profilaksis / reduksi 50\u201375%.','Hindari DOAC bila trombosit tidak stabil.']};
return{level:'bad',head:'Trombosit <25: tahan antikoagulan',lines:[],plan:['Tunda antikoagulan; pertimbangkan transfusi trombosit bila trombosis mengancam jiwa.','Pertimbangkan filter IVC bila VTE akut proksimal dan antikoagulasi mustahil.','Evaluasi ulang harian.']}}});

/* ===== PILAR 4 ===== */
C.push({id:'ganzoni',pillar:'transf',title:'Ganzoni - Defisit Besi',sub:'Defisit (mg) = BB \u00d7 (Hb target \u2212 Hb aktual) \u00d7 2,4 + depot besi.',tags:'ganzoni besi iron defisiensi ferric',
fields:[NUM('wt','Berat badan','kg',{step:.1}),NUM('hb','Hb aktual','g/dL',{step:.1}),NUM('tgt','Hb target','g/dL',{step:.1,def:13}),NUM('dep','Depot besi','mg',{def:500})],
run:v=>{if(!ok(v.wt)||!ok(v.hb)||!ok(v.tgt))return miss();const dep=ok(v.dep)?v.dep:500;const d=v.wt*(v.tgt-v.hb)*2.4+dep;if(d<=0)return{level:'ok',head:'Tidak ada defisit besi terhitung',lines:[],plan:[]};
return{level:'info',head:'Defisit besi total \u2248 '+Math.round(d)+' mg',lines:['Iron sucrose 100 mg/ampul \u2192 \u2248 '+Math.ceil(d/100)+' ampul (100\u2013200 mg/sesi, beberapa sesi).','Ferric carboxymaltose: maks 1000 mg/dosis (20 mg/kg) per minggu; waspadai hipofosfatemia.'],
plan:['Konfirmasi defisiensi besi (feritin, TSAT) & singkirkan inflamasi/infeksi aktif.','Siapkan penanganan reaksi hipersensitivitas; monitor Hb 4\u20138 minggu.']}}});

C.push({id:'prc',pillar:'transf',title:'Kebutuhan Transfusi PRC',sub:'Estimasi volume PRC (mL) = \u0394Hb \u00d7 BB \u00d7 3 (dewasa); kantong \u2248250 mL.',tags:'prc transfusi eritrosit volume',
fields:[NUM('wt','Berat badan','kg',{step:.1}),NUM('hb','Hb aktual','g/dL',{step:.1}),NUM('tgt','Hb target','g/dL',{step:.1})],
run:v=>{if(!ok(v.wt)||!ok(v.hb)||!ok(v.tgt))return miss();const d=v.tgt-v.hb;if(d<=0)return{level:'ok',head:'Hb sudah \u2265 target',lines:[],plan:[]};const ml=d*v.wt*3;
return{level:'info',head:'PRC \u2248 '+Math.round(ml)+' mL (\u2248 '+f(ml/250,1)+' kantong)',lines:['Tiap 1 unit PRC umumnya menaikkan Hb \u22481 g/dL pada dewasa 70 kg.'],
plan:['Strategi restriktif: transfusi bila Hb <7 g/dL (stabil), <8 g/dL pada penyakit kardiovaskular/ortopedi; sesuaikan gejala.','Berikan 1 unit lalu nilai ulang; kecepatan lebih lambat pada risiko overload (pertimbangkan furosemid).']}}});

C.push({id:'cci',pillar:'transf',title:'Platelet CCI (Refrakter Trombosit)',sub:'CCI = (post \u2212 pre) \u00d7 BSA / jumlah trombosit \u00d710\u00b9\u00b9.',tags:'cci refrakter trombosit transfusi',
fields:[NUM('pre','Trombosit pra-transfusi','/\u00b5L'),NUM('post','Trombosit pasca-transfusi','/\u00b5L'),NUM('bsa','BSA','m\u00b2',{step:.01}),NUM('dose','Jumlah trombosit diberikan','\u00d710\u00b9\u00b9',{step:.1,def:3}),
SEL('tm','Waktu pengambilan sampel',[['1','10\u201360 menit'],['24','18\u201324 jam']],{full:true})],
run:v=>{if(!ok(v.pre)||!ok(v.post)||!ok(v.bsa)||!ok(v.dose)||v.dose<=0)return miss();const c=(v.post-v.pre)*v.bsa/v.dose;const th=v.tm==='1'?7500:5000;const bad=c<th;
return{level:bad?'bad':'ok',head:'CCI = '+Math.round(c).toLocaleString('id-ID'),lines:['Ambang respons adekuat: \u22657.500 (1 jam) atau \u22655.000 (24 jam).'],
plan:bad?['Curiga refrakter: ulangi dengan 2 transfusi ABO-compatible segar & CCI ulang.','Bila refrakter imun (HLA/HPA): trombosit HLA-matched / crossmatch; singkirkan penyebab non-imun (demam, sepsis, DIC, splenomegali, obat).']:['Respons transfusi trombosit memadai.']}}});

const PT={prof:['Profilaksis tanpa perdarahan (hematologi)',10],apl:['Leukemia promielositik akut (APL)',30],cvc:['Pemasangan CVC',20],sepsis:['Demam tinggi/sepsis/koagulopati',20],lp:['Punksi lumbal',50],endo:['Endoskopi dengan biopsi / bedah minor',50],surg:['Bedah mayor',50],neuro:['Bedah saraf / mata / perdarahan SSP',100],bleed:['Perdarahan aktif signifikan',50]};
C.push({id:'pltthr',pillar:'transf',title:'Ambang Trombosit Prosedur',sub:'Acuan ambang transfusi trombosit (\u00d710\u00b3/\u00b5L) per indikasi.',tags:'ambang trombosit prosedur transfusi tc',
fields:[SEL('proc','Indikasi / prosedur',Object.keys(PT).map(k=>[k,PT[k][0]]),{full:true}),NUM('plt','Trombosit saat ini','\u00d710\u00b3/\u00b5L')],
run:v=>{const t=PT[v.proc][1];if(!ok(v.plt))return{level:'info',head:'Ambang: \u2265'+t+'.000/\u00b5L',lines:[PT[v.proc][0]],plan:['Isi trombosit saat ini untuk evaluasi.']};
const low=v.plt<t;return{level:low?'warn':'ok',head:low?'Trombosit '+v.plt+' < ambang '+t+' \u2192 pertimbangkan transfusi TC':'Trombosit '+v.plt+' \u2265 ambang '+t,lines:[PT[v.proc][0]],
plan:low?['Dosis dewasa: 1 pooled TC / 1 apheresis; periksa kenaikan 1 jam (lihat CCI).']:['Tidak perlu transfusi trombosit untuk indikasi ini.']}}});

C.push({id:'riss',pillar:'transf',title:'R-ISS & R2-ISS (Multiple Myeloma)',sub:'Staging prognostik MM baru terdiagnosis.',tags:'myeloma riss r2-iss multiple',
fields:[NUM('b2m','\u03b2\u2082-mikroglobulin','mg/L',{step:.1}),NUM('alb','Albumin','g/dL',{step:.1}),CHK('ldh','LDH di atas normal'),CHK('del17','del(17p)'),CHK('t414','t(4;14)'),CHK('t1416','t(14;16)'),CHK('q1','Gain/amp 1q21 (1q+)')],
run:v=>{if(!ok(v.b2m)||!ok(v.alb))return miss('Isi \u03b2\u2082M dan albumin.');
const iss=v.b2m>=5.5?3:(v.b2m<3.5&&v.alb>=3.5)?1:2;const hr=v.del17||v.t414||v.t1416;
const r=iss===1&&!hr&&!v.ldh?'I':iss===3&&(hr||v.ldh)?'III':'II';
const p=(iss===2?1:iss===3?1.5:0)+(v.del17?1:0)+(v.ldh?1:0)+(v.t414?1:0)+(v.q1?.5:0);
const r2=p===0?'I':p<=1?'II':p<=2.5?'III':'IV';
return{level:r==='III'||r2==='IV'?'bad':r==='II'?'warn':'ok',head:'ISS '+iss+' \u2022 R-ISS '+r+' \u2022 R2-ISS '+r2+' (poin '+f(p,1)+')',lines:['HRCA: del(17p), t(4;14), t(14;16).','R-ISS I: ISS I + risiko standar + LDH normal; III: ISS III + HRCA atau LDH tinggi.'],plan:['Gunakan bersama stratifikasi transplant-eligibility & sitogenetik FISH.']}}});

C.push({id:'ipi',pillar:'transf',title:'IPI (DLBCL / Limfoma Agresif)',sub:'International Prognostic Index. Centang faktor yang ada.',tags:'ipi limfoma dlbcl',
fields:[CHK('a','Usia >60 tahun'),CHK('l','LDH di atas normal'),CHK('e','ECOG PS \u22652'),CHK('s','Stadium Ann Arbor III\u2013IV'),CHK('x','Lokasi ekstranodal >1')],
run:v=>{const s=sumC(v,['a','l','e','s','x']);const g=s<=1?['ok','RENDAH']:s===2?['warn','RENDAH-INTERMEDIATE']:s===3?['warn','TINGGI-INTERMEDIATE']:['bad','TINGGI'];
return{level:g[0],head:'IPI '+s+'/5 \u2192 '+g[1],lines:['0\u20131 rendah, 2 low-intermediate, 3 high-intermediate, 4\u20135 tinggi.'],plan:['Pertimbangkan R-IPI/NCCN-IPI & profil molekuler (COO, double-hit) untuk prognosis akurat.','Rencana terapi sesuai stadium, bulky disease, dan kelayakan R-CHOP.']}}});

/* ===== ENGINE ===== */
const KEY='adjustrHOM_state_v1';
let S={};try{S=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){S={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const grid=document.getElementById('grid'),tabsEl=document.getElementById('tabs'),qEl=document.getElementById('q');
let pil='all';
const fid=(c,k)=>c.id+'__'+k;

function fieldHTML(c,fl){const id=fid(c,fl.k);
if(fl.t==='chk')return '<label class="chk f full"><input type="checkbox" id="'+id+'"><span>'+fl.l+'</span></label>';
if(fl.t==='sel')return '<div class="f'+(fl.full?' full':'')+'"><label for="'+id+'">'+fl.l+'</label><select id="'+id+'">'+fl.opts.map(o=>'<option value="'+o[0]+'">'+o[1]+'</option>').join('')+'</select></div>';
return '<div class="f"><label for="'+id+'">'+fl.l+(fl.u?' ('+fl.u+')':'')+'</label><input type="number" inputmode="decimal" id="'+id+'" step="'+(fl.step||1)+'" min="0"></div>';}

function read(c){const v={};c.fields.forEach(fl=>{const e=document.getElementById(fid(c,fl.k));
v[fl.k]=fl.t==='chk'?e.checked:fl.t==='sel'?e.value:(e.value===''?NaN:parseFloat(e.value));});return v;}

function fmtVal(fl,val){if(fl.t==='chk')return val?'Ya':'Tidak';if(fl.t==='sel')return (fl.opts.find(o=>o[0]===val)||[0,val])[1];return ok(val)?val+(fl.u?' '+fl.u:''):null;}
const strip=s=>String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

function buildNote(c,v,r){const dt=new Date().toLocaleString('id-ID');
const inp=c.fields.map(fl=>{const x=fmtVal(fl,v[fl.k]);return x===null?null:'- '+fl.l.replace(/\s*\([^)]*\)\s*$/,'')+': '+x;}).filter(Boolean).join('\n');
return '[adjustrHOM Pro] '+c.title+' ('+dt+')\nS/O:\n'+inp+'\nA: '+r.head+(r.lines&&r.lines.length?'\n'+r.lines.map(l=>'   '+strip(l)).join('\n'):'')+'\nP:\n'+(r.plan&&r.plan.length?r.plan.map(p=>'- '+p).join('\n'):'- Observasi & evaluasi ulang')+'\n*Alat bantu keputusan; verifikasi klinis oleh DPJP.';}

function update(c,el){const v=read(c);S[c.id]=v;save();let r;
try{r=c.run(v)}catch(e){r={missing:'Input tidak valid.'}}
const box=el.querySelector('.res'),pre=el.querySelector('pre');
if(r.missing){box.className='res info';box.innerHTML='<div class="h">Menunggu input</div>'+r.missing;el._note=null;pre.textContent='';return;}
box.className='res '+r.level;
box.innerHTML='<div class="h">'+r.head+'</div>'+(r.lines&&r.lines.length?'<ul>'+r.lines.map(l=>(r.raw&&l.startsWith('<table'))?'</ul>'+l+'<ul>':'<li>'+l+'</li>').join('')+'</ul>':'')+
(r.plan&&r.plan.length?'<div class="pl"><b>Rencana / Rekomendasi</b><ul>'+r.plan.map(p=>'<li>'+p+'</li>').join('')+'</ul></div>':'');
el._note=buildNote(c,v,r);pre.textContent=el._note;}

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800);}
function copy(text){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
return new Promise(res=>{const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();res();});}

function render(c){const el=document.createElement('article');el.className='card';el.id='c-'+c.id;el.dataset.pillar=c.pillar;
el.dataset.text=(c.title+' '+c.sub+' '+(c.tags||'')).toLowerCase();
el.innerHTML='<div class="ch"><div><div class="ct">'+c.title+'</div><div class="cs">'+c.sub+'</div></div><span class="pill p-'+c.pillar+'">'+PIL[c.pillar]+'</span></div>'+
'<div class="form">'+c.fields.map(fl=>fieldHTML(c,fl)).join('')+'</div><div class="res info"></div>'+
'<div class="act"><button class="btn" data-a="reset">Reset</button><button class="btn pri" data-a="copy">Salin ke CPPT/EMR</button></div><details><summary>Pratinjau catatan CPPT</summary><pre></pre></details>';
grid.appendChild(el);
const saved=S[c.id]||{};
c.fields.forEach(fl=>{const e=el.querySelector('#'+fid(c,fl.k));const sv=saved[fl.k];
if(fl.t==='chk')e.checked=!!sv;
else if(fl.t==='sel'){if(sv!==undefined&&fl.opts.some(o=>o[0]===sv))e.value=sv;}
else if(typeof sv==='number'&&ok(sv))e.value=sv;else if(fl.def!==undefined)e.value=fl.def;});
el.addEventListener('input',()=>update(c,el));el.addEventListener('change',()=>update(c,el));
el.querySelector('[data-a=reset]').onclick=()=>{c.fields.forEach(fl=>{const e=el.querySelector('#'+fid(c,fl.k));
if(fl.t==='chk')e.checked=false;else if(fl.t==='sel')e.selectedIndex=0;else e.value=fl.def!==undefined?fl.def:'';});update(c,el);};
el.querySelector('[data-a=copy]').onclick=()=>{if(!el._note)return toast('Lengkapi input terlebih dahulu');copy(el._note).then(()=>toast('Catatan CPPT disalin'));};
update(c,el);}

function filter(){const q=qEl.value.trim().toLowerCase();let n=0;
document.querySelectorAll('.card').forEach(el=>{const show=(pil==='all'||el.dataset.pillar===pil)&&(!q||el.dataset.text.includes(q));el.classList.toggle('hide',!show);if(show)n++;});
let em=document.getElementById('empty');if(!n){if(!em){em=document.createElement('div');em.id='empty';em.className='empty';em.textContent='Tidak ada kalkulator yang cocok.';grid.appendChild(em);}}else if(em)em.remove();}

const tabList=[['all','Semua']].concat(Object.keys(PIL).map(k=>[k,PIL[k]]));
tabList.forEach(t=>{const b=document.createElement('button');b.className='tab'+(t[0]==='all'?' on':'');b.textContent=t[1];
b.onclick=()=>{pil=t[0];tabsEl.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));b.classList.add('on');filter();};tabsEl.appendChild(b);});
qEl.addEventListener('input',filter);
C.forEach(render);filter();
document.getElementById('clearAll').onclick=()=>{if(confirm('Hapus semua data input tersimpan?')){localStorage.removeItem(KEY);S={};location.reload();}};

