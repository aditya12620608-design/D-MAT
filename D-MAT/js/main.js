
/* Local mode: when opened outside Claude, history is stored in this browser's localStorage */
if(typeof claude==='undefined'){const K='dmat_history',rd=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return{}}},wr=o=>localStorage.setItem(K,JSON.stringify(o));
window.claude={use:async n=>n==='user'?{me:async()=>({id:'local',name:'Local student',color:'#5b8cff'})}:{collection:()=>({doc:id=>({set:async d=>{const o=rd();o[id]=d;wr(o)},delete:async()=>{const o=rd();delete o[id];wr(o)}}),get:async()=>({docs:Object.entries(rd()).map(([id,d])=>({id,data:()=>d}))})})}}}


const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),list=s=>s.split(/[\s,]+/).filter(Boolean);
const row=(a,b,c)=>`<div class="res"><b>${a}</b><span class="${c===true?'ok':c===false?'bad':''}">${esc(b)}</span></div>`;
const fm=a=>'{'+[...a].join(', ')+'}';
const MODS=[['home','Home','⌂','Overview'],['t0','Sets & relations','∪','Set operations, relations and functions',()=>runSets()],['t1','Logic','∧','Truth tables, equivalence and minterms',()=>runLogic()],['t2','Automata','⇄','DFA, NFA and ε-NFA with step traces',()=>runFA()],['t3','Graphs','◉','BFS, DFS, coloring and shortest paths',()=>runGraph()],['t4','Grammars','Σ','Derivations and parse trees',()=>runG()],['t5','Moore & Mealy','⇆','Output machines and their conversion',()=>runMM()],['learn','Syllabus','☰','Unit-wise topics and progress'],['hist','History','⏱','Your saved experiments']];
let cur='home',DB=null,UID=null,HIST=[];
MODS.forEach(m=>{const b=document.createElement('button');b.innerHTML=`<i>${m[2]}</i>${m[1]}`;b.setAttribute('role','tab');b.dataset.id=m[0];b.onclick=()=>show(m[0]);$('#tabs').append(b)});
$('#cards').innerHTML=MODS.slice(1,7).map(m=>`<button class='card' onclick="show('${m[0]}')"><i>${m[2]}</i><b>${m[1]}</b><span>${m[3]}</span></button>`).join('');
function show(id){cur=id;document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id==id));[...$('#tabs').children].forEach(b=>b.setAttribute('aria-selected',b.dataset.id==id));$('#bar').style.display=/^t\d/.test(id)?'flex':'none';$('#cur').textContent=(MODS.find(m=>m[0]==id)||[])[1]||'';if(id=='hist')loadHist();try{location.hash=id}catch(e){}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2800)}
const EX={ends01:[['q0,0,q1','q0,1,q0','q1,0,q1','q1,1,q2','q2,0,q1','q2,1,q0'],'q0','q2','1101'],even0:[['q0,0,q1','q0,1,q0','q1,0,q0','q1,1,q1'],'q0','q0','1001'],has101:[['s0,0,s0','s0,1,s1','s1,0,s2','s1,1,s1','s2,0,s0','s2,1,s3','s3,0,s3','s3,1,s3'],'s0','s3','0101'],nfa01:[['q0,0,q0','q0,1,q0','q0,0,q1','q1,1,q2'],'q0','q2','1101'],enfa:[['q0,a,q0','q0,e,q1','q1,b,q1'],'q0','q1','aabb']};
function loadEx(k){const e=EX[k];if(!e)return;$('#fa-t').value=e[0].join('\n');$('#fa-s').value=e[1];$('#fa-f').value=e[2];$('#fa-w').value=e[3];runFA()}
async function initAcct(){const a=$('#acct'),g=m=>a.innerHTML=`<div><b>Guest mode</b><small>${m}</small></div>`;g('Checking sign-in…');
try{const[u,d]=await Promise.all([claude.use('user'),claude.use('db')]);const me=u&&await u.me();if(u&&d&&me.id){UID=me.id;DB=d;a.innerHTML=`<div class='av' style='background:${esc(me.color||'#5b8cff')}'>${esc((me.name||'S')[0])}</div><div><b>${esc(me.name||'Student')}</b><small>Signed in, history on</small></div>`}else g('Sign in to Claude to save experiments')}catch(e){g('History unavailable here')}}
const col=()=>DB.collection('data/users/'+UID);
async function saveExp(){if(!DB){toast('Sign in to Claude to save experiments. You are in guest mode.');return}const sec=$('#'+cur),st={};sec.querySelectorAll('input,textarea,select').forEach(e=>st[e.id]=e.value);const sum=((sec.querySelector('.v')||sec.querySelector('.res span')||{}).textContent||'').slice(0,140);
try{await col().doc('e'+Date.now()).set({mod:cur,title:(MODS.find(m=>m[0]==cur)||[])[1],st:JSON.stringify(st),sum,at:Date.now()});toast('Saved to History')}catch(e){toast('Could not save: '+(e.message||e.code||'error'))}}
async function loadHist(){const L=$('#hlist');if(!DB){$('#hnote').textContent='Guest mode: sign in to Claude to save and reopen experiments.';L.innerHTML='';return}$('#hnote').textContent='Private to you. Reopen an experiment to rerun it.';
try{const s=await col().get();HIST=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.at-a.at);L.innerHTML=HIST.length?HIST.map(r=>`<div class='hrow'><div><b>${esc(r.title)}</b><small>${new Date(r.at).toLocaleString()}</small><p>${esc(r.sum)}</p></div><div><button onclick="openExp('${r.id}')">Reopen</button><button onclick="delExp('${r.id}')">Delete</button></div></div>`).join(''):'<p class="note">No saved experiments yet. Run one and choose Save experiment.</p>'}catch(e){L.innerHTML='<div class="v bad">Could not load history.</div>'}}
function openExp(id){const r=HIST.find(x=>x.id==id);if(!r)return;show(r.mod);const st=JSON.parse(r.st);for(const k in st){const e=document.getElementById(k);if(e)e.value=st[k]}MODS.find(m=>m[0]==r.mod)[4]()}
async function delExp(id){try{await col().doc(id).delete();toast('Deleted');loadHist()}catch(e){toast('Could not delete')}}
function stepper(box,draw){let S=[],i=0,tm;box.innerHTML='<div class="ctl"><button data-a="p">Back</button><button data-a="n">Next</button><button data-a="a">Play</button><span></span></div><div class="log"></div>';
const lg=box.querySelector('.log'),cn=box.querySelector('span');
function r(){draw(S[i]);lg.innerHTML=S.map((s,k)=>`<div class="${k==i?'on':''}">${k+1}. ${esc(s.text)}</div>`).join('');const on=lg.querySelector('.on');if(on)lg.scrollTop=on.offsetTop-60;cn.textContent=(i+1)+' / '+S.length}
box.onclick=e=>{const a=e.target.dataset.a;if(!a)return;clearInterval(tm);if(a=='p')i=Math.max(0,i-1);if(a=='n')i=Math.min(S.length-1,i+1);if(a=='a'){i=0;r();tm=setInterval(()=>{if(i<S.length-1){i++;r()}else clearInterval(tm)},900);return}r()};
return s=>{clearInterval(tm);S=s;i=0;r()}}


/* motion layer: graph constellation background, nav slider, stagger, ripple, card spotlight */
(()=>{
const pass=r=>r.querySelectorAll('tr,.res,.hrow,.card').forEach((e,i)=>e.style.setProperty('--i',Math.min(i,18)));
pass(document);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType==1)pass(n)}))).observe(document.querySelector('main'),{childList:true,subtree:true});
const mv=()=>{const b=document.querySelector('#tabs [aria-selected=true]'),n=$('#tabs');if(b){n.style.setProperty('--y',b.offsetTop+'px');n.style.setProperty('--h',b.offsetHeight+'px')}};
const o=window.show;window.show=function(id){o(id);mv()};mv();addEventListener('resize',mv);
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.go');if(!b)return;const r=b.getBoundingClientRect();b.style.setProperty('--rx',e.clientX-r.left+'px');b.style.setProperty('--ry',e.clientY-r.top+'px');b.classList.remove('rip');void b.offsetWidth;b.classList.add('rip')});
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')});
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const c=document.getElementById('bg'),x=c.getContext('2d'),m={x:-999,y:-999};let W,H,P=[];
const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight;P=Array.from({length:Math.min(60,W*H/24000|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};
rs();addEventListener('resize',rs);addEventListener('pointermove',e=>{m.x=e.clientX;m.y=e.clientY});
const col=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||'#5b8cff';
(function f(){x.clearRect(0,0,W,H);x.fillStyle=x.strokeStyle=col;
for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy)||1;if(d<130){p.x+=dx/d*.9;p.y+=dy/d*.9}}
for(let i=0;i<P.length;i++){const a=P[i];x.globalAlpha=.55;x.beginPath();x.arc(a.x,a.y,2,0,7);x.fill();for(let j=i+1;j<P.length;j++){const b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<140){x.globalAlpha=(1-d/140)*.3;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}}
requestAnimationFrame(f)})();
})();

// Start the workbench after all module files have loaded.
window.addEventListener('load', () => {
  show(MODS.some(m => m[0] === location.hash.slice(1)) ? location.hash.slice(1) : 'home');
  initAcct();
  runSets();
  runLogic();
  runFA();
  runGraph();
  runG();
});
