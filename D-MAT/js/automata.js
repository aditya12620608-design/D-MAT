
/* ---------- Module 3 ---------- */
let M;const fa=()=>{const T=$('#fa-t').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>l.split(/[\s,]+/)),start=$('#fa-s').value.trim();return{T,start,acc:list($('#fa-f').value),st:[...new Set([start,...list($('#fa-f').value),...T.flatMap(t=>[t[0],t[2]])])]}};
const cl=(M,S)=>{const o=new Set(S),q=[...o];while(q.length){const u=q.pop();M.T.forEach(t=>{if(t[0]==u&&t[1]=='e'&&!o.has(t[2])){o.add(t[2]);q.push(t[2])}})}return o};
const mv=(M,S,c)=>{const o=new Set();M.T.forEach(t=>{if(S.has(t[0])&&t[1]==c)o.add(t[2])});return cl(M,o)};
const pos=(M,k,n)=>{const a=2*Math.PI*k/n-Math.PI/2;return[170+(n==1?0:92)*Math.cos(a),122+(n==1?0:80)*Math.sin(a),Math.cos(a),Math.sin(a)]};
function drawFA(s){const R=18,n=M.st.length,P={};M.st.forEach((q,k)=>P[q]=pos(M,k,n));const E={};M.T.forEach(t=>{(E[t[0]+'|'+t[2]]=E[t[0]+'|'+t[2]]||[]).push(t[1]=='e'?'ε':t[1])});
let g='<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>';
const used=s?s.used:[];
for(const k in E){const[a,b]=k.split('|'),hot=used.includes(k),lab=[...new Set(E[k])].join(','),sw=hot?3.5:1.5,col=hot?'var(--acc)':'currentColor';
if(a==b){let[x,y,ux,uy]=P[a];if(n==1){ux=0;uy=-1}const vx=-uy,vy=ux;const f=(r,w)=>[x+ux*r+vx*w,y+uy*r+vy*w].join(' ');
g+=`<path d="M${f(R-2,-9)} C${f(R+38,-28)} ${f(R+38,28)} ${f(R-2,9)}" fill="none" stroke="${col}" stroke-width="${sw}" marker-end="url(#ar)"/><text x="${x+ux*(R+36)}" y="${y+uy*(R+36)+4}" text-anchor="middle">${lab}</text>`}
else{const[x1,y1]=P[a],[x2,y2]=P[b],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,off=E[b+'|'+a]?24:0,cx=(x1+x2)/2-uy*off,cy=(y1+y2)/2+ux*off;
const sx=x1+ux*R,sy=y1+uy*R,ex=x2-ux*(R+3),ey=y2-uy*(R+3);g+=`<path d="M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}" fill="none" stroke="${col}" stroke-width="${sw}" marker-end="url(#ar)"/><text x="${.25*sx+.5*cx+.25*ex-uy*(off?0:8)}" y="${.25*sy+.5*cy+.25*ey+(off?(uy>0?0:0):4)+(off?0:ux*0)}" text-anchor="middle">${lab}</text>`}}
M.st.forEach(q=>{const[x,y]=P[q],on=s&&s.S.has(q);g+=`<circle cx="${x}" cy="${y}" r="${R}" fill="${on?'var(--hl)':'var(--panel)'}" stroke="currentColor" stroke-width="2"/>${M.acc.includes(q)?`<circle cx="${x}" cy="${y}" r="${R-4}" fill="none" stroke="currentColor"/>`:''}<text x="${x}" y="${y+4}" text-anchor="middle" style="fill:${on?'#17222c':'var(--ink)'};font-weight:700">${esc(q)}</text>`});
const[sx,sy]=P[M.start];g+=`<path d="M${sx-R-26} ${sy} L${sx-R-2} ${sy}" stroke="currentColor" stroke-width="2" marker-end="url(#ar)"/>`;
$(window.FAT||'#fa-svg').innerHTML=`<svg viewBox="0 0 340 250" role="img" aria-label="Automaton diagram" style="color:var(--ink)">${g}</svg>`}
const setFA=stepper($('#fa-st'),s=>drawFA(s));
function runFA(){M=fa();const w=[...$('#fa-w').value.trim()];let S=cl(M,[M.start]);const steps=[{S,used:[],text:`Start in ${fm(S)}`}];
w.forEach(c=>{const used=[];M.T.forEach(t=>{if(S.has(t[0])&&t[1]==c)used.push(t[0]+'|'+t[2])});const N=mv(M,S,c);steps.push({S:N,used,text:`Read “${c}”: ${fm(S)} → ${N.size?fm(N):'∅ (no transition, the run dies)'}`});S=N});
const ok=M.acc.some(q=>S.has(q)),eps=M.T.some(t=>t[1]=='e'),dfa=!eps&&M.T.every((t,i)=>M.T.findIndex(u=>u[0]==t[0]&&u[1]==t[1])==i);
steps.push({S,used:[],text:ok?'End of input in an accepting state: accepted':'End of input, no accepting state active: rejected'});
$('#fa-v').innerHTML=`<div class="v ${ok?'ok':'bad'}">“${esc(w.join(''))}” is ${ok?'accepted':'rejected'} · machine type: ${dfa?'DFA':eps?'ε-NFA':'NFA'}</div>`;$('#fa-o').innerHTML='';setFA(steps)}
function subset(){M=fa();const al=[...new Set(M.T.map(t=>t[1]).filter(c=>c!='e'))].sort(),nm=S=>S.size?'{'+[...S].sort().join(',')+'}':'∅',s0=cl(M,[M.start]),seen={[nm(s0)]:s0},ord=[nm(s0)],D={};
for(let i=0;i<ord.length;i++){const S=seen[ord[i]];D[ord[i]]={};al.forEach(c=>{const N=mv(M,S,c),k=nm(N);D[ord[i]][c]=k;if(!seen[k]){seen[k]=N;ord.push(k)}})}
const acc=k=>M.acc.some(q=>seen[k].has(q));let g={};ord.forEach(k=>g[k]=acc(k)?1:0);let cnt=0,ng=2;
for(;;){const sig={},ng2={};ord.forEach(k=>{const s=g[k]+'|'+al.map(c=>g[D[k][c]]).join(',');if(!(s in sig))sig[s]=Object.keys(sig).length;ng2[k]=sig[s]});const c=Object.keys(sig).length;g=ng2;if(c==cnt)break;cnt=c}
const grp={};ord.forEach(k=>(grp[g[k]]=grp[g[k]]||[]).push(k));
$('#fa-o').innerHTML=`<h2 style="margin-top:16px">Subset construction</h2><div class="tw"><table><tr><th>DFA state</th>${al.map(c=>`<th>${c}</th>`).join('')}<th>accepting</th></tr>${ord.map((k,i)=>`<tr><td>${i?'':'→ '}${esc(k)}</td>${al.map(c=>`<td>${esc(D[k][c])}</td>`).join('')}<td>${acc(k)?'yes':''}</td></tr>`).join('')}</table></div>`+
row('Partition refinement',ord.length+' states → '+cnt+' after merging equivalent states')+row('Merged groups',Object.values(grp).map(a=>'{'+a.join(' ')+'}').join('  '))}


function genFA(txt,type){const t=txt.toLowerCase().replace(/[“”"'’]/g,'').trim(),q=i=>'q'+i;let m;
const al=(...w)=>{const s=new Set(w.join('').split(''));if([...s].every(c=>'01'.includes(c))){s.add('0');s.add('1')}else if(s.size<2){s.add('a');s.add('b')}return[...s].sort()};
const out=(S,T,acc,desc,sample,start='q0')=>({S,T:T.map(x=>x.join(',')),acc,start,desc,sample});
const kmp=(w,S,ab)=>{const T=[],n=w.length;for(let k=0;k<=n;k++)S.forEach(c=>{if(ab&&k==n){T.push([q(k),c,q(k)]);return}const s=w.slice(0,k)+c;let j=Math.min(n,s.length);while(j>0&&w.slice(0,j)!=s.slice(s.length-j))j--;T.push([q(k),c,q(j)])});return T};
const chain=(w,S,ls,le)=>{const T=[],n=w.length;if(ls)S.forEach(c=>T.push(['q0',c,'q0']));for(let k=0;k<n;k++)T.push([q(k),w[k],q(k+1)]);if(le)S.forEach(c=>T.push([q(n),c,q(n)]));return T};
const wrap=r=>{if(type=='enfa'&&r.start=='q0'&&r.T.some(x=>x.startsWith('q0,'))&&!r.dfaOnly){r.T.push('S,e,q0');r.start='S'}return r};
if(m=t.match(/length\s*(?:is\s*)?(?:divisible by|a multiple of|multiple of)\s*(\d+)/)){const k=+m[1],S=al(),T=[];for(let i=0;i<k;i++)S.forEach(c=>T.push([q(i),c,q((i+1)%k)]));return out(S,T,['q0'],`Each symbol advances a counter modulo ${k}. The string is accepted when the remainder is 0.`,'1011')}
if(m=t.match(/(even|odd)\s*number\s*of\s*([a-z0-9])/)){const c=m[2],S=al(c),T=[];S.forEach(x=>T.push(['q0',x,x==c?'q1':'q0'],['q1',x,x==c?'q0':'q1']));return out(S,T,[m[1]=='even'?'q0':'q1'],`q0 means an even number of ${c}s so far and q1 means odd. Every ${c} flips the state.`,S[0]==c?c+S[1]+c:c+S[0])}
if(m=t.match(/number\s*of\s*([a-z0-9])s?\s*(?:is\s*)?(?:divisible by|a multiple of|multiple of)\s*(\d+)/)){const c=m[1],k=+m[2],S=al(c),T=[];for(let i=0;i<k;i++)S.forEach(x=>T.push([q(i),x,x==c?q((i+1)%k):q(i)]));return out(S,T,['q0'],`The state is the count of ${c}s modulo ${k}. It accepts when the count is a multiple of ${k}.`,(c+S[0]).repeat(k))}
if(m=t.match(/exactly\s*(\d+)\s*([a-z0-9])/)){const n=+m[1],c=m[2],S=al(c),T=[];for(let i=0;i<=n+1;i++)S.forEach(x=>T.push([q(i),x,x==c?q(Math.min(i+1,n+1)):q(i)]));return out(S,T,[q(n)],`The state counts the ${c}s seen. Seeing more than ${n} sends the machine to the dead state q${n+1}.`,c.repeat(n))}
if(m=t.match(/at least\s*(\d+)\s*([a-z0-9])/)){const n=+m[1],c=m[2],S=al(c),T=[];for(let i=0;i<=n;i++)S.forEach(x=>T.push([q(i),x,x==c?q(Math.min(i+1,n)):q(i)]));return out(S,T,[q(n)],`The state counts the ${c}s seen, stopping at ${n}. Reaching q${n} means the condition is met for good.`,c.repeat(n))}
if(m=t.match(/divisible by\s*(\d+)/)){const n=+m[1],T=[];for(let i=0;i<n;i++)['0','1'].forEach(b=>T.push([q(i),b,q((2*i+ +b)%n)]));return out(['0','1'],T,['q0'],`The state is the remainder of the binary number read so far. Reading bit b turns remainder r into (2r + b) mod ${n}.`,'110')}
if(m=t.match(/(?:start|begin)(?:s|ing|ning)?\s*with\s*([a-z0-9]+)/)){const w=m[1],S=al(w),n=w.length,T=[];if(type=='dfa'){for(let k=0;k<n;k++)S.forEach(c=>T.push([q(k),c,c==w[k]?q(k+1):'d']));S.forEach(c=>{T.push([q(n),c,q(n)]);T.push(['d',c,'d'])})}else T.push(...chain(w,S,false,true));return wrap(out(S,T,[q(n)],`The machine follows the prefix ${w} one symbol at a time${type=='dfa'?', and a dead state d catches any mismatch':''}. After the prefix it accepts whatever follows.`,w+S[0]))}
if(m=t.match(/contain(?:s|ing)?\s*(?:the\s*)?(?:substring\s*|pattern\s*)?([a-z0-9]+)/)){const w=m[1],S=al(w),n=w.length;const T=type=='dfa'?kmp(w,S,true):chain(w,S,true,true);return wrap(out(S,T,[q(n)],`State qk means the last k symbols match the first k symbols of ${w}. Reaching q${n} means ${w} has appeared, and the machine stays there.`,S[0]+w+S[0]))}
if(m=t.match(/end(?:s|ing)?\s*with\s*([a-z0-9]+)/)){const w=m[1],S=al(w),n=w.length;const T=type=='dfa'?kmp(w,S,false):chain(w,S,true,false);return wrap(out(S,T,[q(n)],type=='dfa'?`State qk means the longest suffix read so far that matches the first k symbols of ${w} has length k. Only q${n} accepts.`:`The NFA keeps looping in q0 and guesses where the final ${w} begins. It accepts if the guess is right.`,S[0]+w))}
return null}
function buildFA(){const txt=$('#fa-p').value,ty=$('#fa-type').value,r=genFA(txt,ty),o=$('#fa-o');
if(!r){o.innerHTML=row('Not recognised','I could not turn that into a machine. Try wording like: ending with 11, starting with 01, containing 101, even number of 0s, number of 1s divisible by 3, binary number divisible by 3, exactly 2 a’s, at least 2 b’s, length divisible by 2. You can also type the transitions yourself below.',false);return}
$('#fa-ex').value='';$('#fa-t').value=r.T.join('\n');$('#fa-s').value=r.start;$('#fa-f').value=r.acc.join(',');$('#fa-w').value=r.sample;runFA();
const n=new Set(r.T.flatMap(x=>{const p=x.split(',');return[p[0],p[2]]})).size;
o.innerHTML=row('Problem',txt.trim())+row('Machine',({dfa:'DFA',nfa:'NFA',enfa:'ε-NFA'})[ty]+' with '+n+' states, alphabet {'+r.S.join(', ')+'}, accepting '+r.acc.join(', '))+row('How it works',r.desc)}
const _rf=runFA;window.runFA=function(){_rf();const ty=$('#fa-type').value,P=fa(),al=[...new Set(P.T.map(t=>t[1]).filter(c=>c!='e'))].sort(),eps=P.T.some(t=>t[1]=='e'),nd=P.T.some((t,i)=>P.T.findIndex(u=>u[0]==t[0]&&u[1]==t[1])!=i);let msg='';
if(ty=='dfa'){if(eps)msg='A DFA cannot have ε-transitions.';else if(nd)msg='A DFA allows only one transition per state and symbol, but this machine is nondeterministic. Choose NFA or fix the transitions.';else{const ms=P.st.flatMap(s=>al.map(c=>[s,c])).find(([s,c])=>!P.T.some(t=>t[0]==s&&t[1]==c));if(ms)msg=`A DFA needs a transition for every state and symbol: ${ms[0]} has none on “${ms[1]}”.`}}
if(ty=='nfa'&&eps)msg='This machine uses ε-transitions, so choose ε-NFA.';
if(msg)$('#fa-v').insertAdjacentHTML('beforeend',`<div class='v bad'>${esc(msg)}</div>`)};
const _le=loadEx;window.loadEx=function(k){if(EX[k])$('#fa-type').value=k=='nfa01'?'nfa':k=='enfa'?'enfa':'dfa';_le(k)};
$('#fa-p').addEventListener('keydown',e=>{if(e.key=='Enter')buildFA()});
