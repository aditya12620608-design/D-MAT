
/* ---------- Module 1 ---------- */
function runSets(){const A=[...new Set(list($('#sa').value))],B=[...new Set(list($('#sb').value))],inB=x=>B.includes(x),inA=x=>A.includes(x);
const I=A.filter(inB),AB=A.filter(x=>!inB(x)),BA=B.filter(x=>!inA(x)),U=[...new Set([...A,...B])];
const cp=[];A.forEach(a=>B.forEach(b=>cp.push(`(${a},${b})`)));
const R=list($('#rel').value).map(p=>p.split('-')),has=(a,b)=>R.some(r=>r[0]==a&&r[1]==b);
const nr=A.filter(a=>!has(a,a)),ns=R.find(([a,b])=>!has(b,a));let nt=null;R.forEach(([a,b])=>R.forEach(([c,d])=>{if(b==c&&!has(a,d)&&!nt)nt=[a,d]}));
const refl=!nr.length,sym=!ns,tr=!nt;
const F=list($('#fn').value).map(p=>p.split('>')),isF=A.every(a=>F.filter(p=>p[0]==a).length==1)&&F.every(p=>inA(p[0])&&inB(p[1]));
const im=F.map(p=>p[1]),inj=new Set(im).size==F.length,sur=B.every(b=>im.includes(b)),bij=isF&&inj&&sur;
let h=row('Union A ∪ B',fm(U))+row('Intersection A ∩ B',fm(I))+row('A − B',fm(AB))+row('B − A',fm(BA))+row('A × B ('+cp.length+' pairs)',cp.slice(0,24).join(' ')+(cp.length>24?' …':''));
h+=row('Reflexive',refl?'yes':'no, missing ('+nr.map(a=>a+','+a).join('), (')+')',refl)+row('Symmetric',sym?'yes':`no, (${ns}) has no reverse`,sym)+row('Transitive',tr?'yes':`no, (${nt}) is missing`,tr)+row('Equivalence relation',refl&&sym&&tr?'yes':'no',refl&&sym&&tr);
if(refl&&sym&&tr){const cls=[],seen=new Set();A.forEach(a=>{if(!seen.has(a)){const c=A.filter(b=>has(a,b));c.forEach(x=>seen.add(x));cls.push(fm(c))}});h+=row('Equivalence classes',cls.join(' '))}
h+=row('Valid function A → B',isF?'yes':'no, every element of A needs exactly one image in B',isF);
if(isF){h+=row('Injective',inj?'yes':'no',inj)+row('Surjective',sur?'yes':'no',sur)+row('Bijective',bij?'yes':'no',bij);if(bij)h+=row('Inverse',F.map(p=>p[1]+'>'+p[0]).join(', '))}
$('#so').innerHTML=h;
const t=(x,y,a)=>`<text x="${x}" y="${y}" text-anchor="middle">${esc(a.join(' ').slice(0,14))}</text>`;
$('#venn').innerHTML=`<svg viewBox="0 0 300 170" role="img" aria-label="Venn diagram"><circle cx="110" cy="85" r="64" fill="#1f4fd833" stroke="currentColor"/><circle cx="190" cy="85" r="64" fill="#ffd23f55" stroke="currentColor"/><text x="70" y="22">A</text><text x="230" y="22">B</text>${t(72,90,AB)}${t(150,90,I)}${t(228,90,BA)}</svg>`}
