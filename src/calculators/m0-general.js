/* ===================== CALCULATOR REGISTRY ===================== */
// field: {id, label, type:'number'|'check'|'select', ctx?:key, options?:[[label,value]], step?}
const R = [];
function reg(c) { R.push(c); }
const SEX_OPT = [['Pria', 'male'], ['Wanita', 'female']];
const AGE_OPT = [['Dewasa', 'adult'], ['Lansia', 'elderly'], ['Anak', 'child']];
const has = (...xs) => xs.every(x => x !== undefined && !isNaN(x));

reg({ id:'curb65', nama:'CURB-65', divisi:'Pulmonologi', tags:'pneumonia komunitas rawat inap severity', batch:'M0',
  fields:[
    {id:'c', label:'Confusion (bingung baru)', type:'check'},
    {id:'u', label:'Ureum/BUN > 19 mg/dL', type:'check', ctxFn: c => c.bun !== undefined ? c.bun > 19 : undefined},
    {id:'r', label:'RR ≥ 30', type:'check', ctxFn: c => c.rr !== undefined ? c.rr >= 30 : undefined},
    {id:'b', label:'TD sistolik < 90 atau diastolik ≤ 60', type:'check', ctxFn: c => c.sbp !== undefined ? (c.sbp < 90 || (c.dbp !== undefined && c.dbp <= 60)) : undefined},
    {id:'a', label:'Usia ≥ 65', type:'check', ctxFn: c => c.age !== undefined ? c.age >= 65 : undefined}],
  compute: v => { const s = Object.values(v).filter(Boolean).length;
    const [txt, cls] = s <= 1 ? ['Mortalitas rendah (~1,5%). Pertimbangkan rawat jalan.', 'ok'] : s === 2 ? ['Mortalitas sedang (~9%). Pertimbangkan rawat inap.', 'warn'] : ['Mortalitas tinggi (15–40%). Rawat inap, pertimbangkan ICU bila skor 4–5.', 'bad'];
    return { value: s + ' / 5', text: txt, cls }; } });

reg({ id:'anion-gap', nama:'Anion Gap (terkoreksi albumin)', divisi:'Ginjal-Hipertensi', tags:'asidosis metabolik agd elektrolit delta', batch:'M0',
  fields:[
    {id:'na', label:'Na (mEq/L)', type:'number', ctx:'na'},
    {id:'cl', label:'Cl (mEq/L)', type:'number', ctx:'cl'},
    {id:'hco3', label:'HCO3 (mEq/L)', type:'number', ctx:'hco3'},
    {id:'alb', label:'Albumin (g/dL)', type:'number', ctx:'alb', step:'0.1'}],
  compute: v => { if ([v.na, v.cl, v.hco3].some(x => x === undefined || isNaN(x))) return null;
    const ag = v.na - v.cl - v.hco3; const corr = (v.alb !== undefined && !isNaN(v.alb)) ? ag + 2.5 * (4 - v.alb) : ag;
    const hi = corr > 12; return { value: corr.toFixed(1) + ' mEq/L', text: `AG ${ag.toFixed(1)}; terkoreksi albumin ${corr.toFixed(1)}. ` + (hi ? 'Anion gap meningkat (>12): pikirkan KAD, laktat, uremia, toksin.' : 'Anion gap normal.'), cls: hi ? 'warn' : 'ok' }; } });


reg({ id:'corr-na', nama:'Natrium Terkoreksi Hiperglikemia', divisi:'Endokrin-Metabolik', tags:'hiponatremia glukosa hhs kad', batch:'M0',
  fields:[
    {id:'na', label:'Na terukur (mEq/L)', type:'number', ctx:'na'},
    {id:'glu', label:'Glukosa (mg/dL)', type:'number', ctx:'glu'}],
  compute: v => { if ([v.na, v.glu].some(x => x === undefined || isNaN(x))) return null;
    const c = v.na + 1.6 * Math.max(0, v.glu - 100) / 100; const c2 = v.na + 2.4 * Math.max(0, v.glu - 100) / 100;
    return { value: c.toFixed(1) + ' mEq/L', text: `Faktor 1,6: ${c.toFixed(1)}; faktor 2,4 (glukosa >400): ${c2.toFixed(1)}.`, cls: 'ok' }; } });