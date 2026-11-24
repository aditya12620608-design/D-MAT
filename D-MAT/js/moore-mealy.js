
const MMX={moore11:['moore',['q0,0,q0','q0,1,q1','q1,0,q0','q1,1,q2','q2,0,q0','q2,1,q2'],'q0=0, q1=0, q2=1','q0','1101'],flip:['mealy',['q0,0,q0,1','q0,1,q0,0'],'','q0','1011'],seq01:['mealy',['a,0,b,0','a,1,a,0','b,0,b,0','b,1,a,1'],'','a','0101'],vend:['mealy',['s0,a,s5,n','s0,b,s10,n','s5,a,s10,n','s5,b,s0,d','s10,a,s0,d','s10,b,s0,d'],'','s0','aab']};
let MM;
const setMM=stepper($('#mm-st'),s=>{const o=M;M=MM;window.FAT='#mm-svg';drawFA(s);M=o;window.FAT=null});
function loadMM(type,t,o,s,w){$('#mm-type').value=type;$('#mm-t').value=t.join('\n');$('#mm-o').value=o;$('#mm-s').value=s;if(w!=null)$('#mm-w').value=w;runMM()}
function loadMMex(k){const e=MMX[k];if(e)loadMM(e[0],e[1],e[2],e[3],e[4])}
function mmParse(){const type=$('#mm-type').value,T=$('#mm-t').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>l.split(/[\s,]+/)),O={};list($('#mm-o').value).forEach(p=>{const[a,b]=p.split('=');if(b!=null)O[a]=b});const start=$('#mm-s').value.trim();return{type,T,O,start,st:[...new Set([start,...T.flatMap(t=>[t[0],t[2]])])]}}
function runMM(){const P=mmParse(),moore=P.type=='moore',d=q=>moore?q+'/'+(P.O[q]??'?'):q;
MM={T:P.T.map(t=>[d(t[0]),moore?t[1]:t[1]+'/'+t[3],d(t[2])]),st:P.st.map(d),acc:[],start:d(P.start)};
const w=[...$('#mm-w').value.trim()],steps=[],out=[];let q=P.start,err=null;if(moore)out.push(P.O[q]??'?');
steps.push({S:new Set([d(q)]),used:[],text:moore?`Start in ${q}, output ${out[0]}`:`Start in ${q}`});
for(const c of w){const t=P.T.find(t=>t[0]==q&&t[1]==c);if(!t){err=`No transition from ${q} on “${c}”`;steps.push({S:new Set([d(q)]),used:[],text:err});break}
const nq=t[2],o=moore?(P.O[nq]??'?'):t[3];out.push(o);steps.push({S:new Set([d(nq)]),used:[d(q)+'|'+d(nq)],text:`Read “${c}”: ${q} → ${nq}, output ${o}${moore?' (the output of '+nq+')':''}`});q=nq}
const res=out.join('');if(!err)steps.push({S:new Set([d(q)]),used:[],text:`Output sequence: ${res||'(empty)'}`});
$('#mm-v').innerHTML=`<div class='v ${err?'bad':'ok'}'>${err?esc(err):'Output for “'+esc(w.join(''))+'”: '+esc(res)} · ${moore?'Moore: '+(w.length+1):'Mealy: '+w.length} outputs for ${w.length} inputs</div>`;$('#mm-o2').innerHTML='';setMM(steps)}
function convMM(){const P=mmParse();let h='',type,T,O='',s;
if(P.type=='moore'){type='mealy';T=P.T.map(t=>[t[0],t[1],t[2],P.O[t[2]]??'?']);s=P.start;h=`<h3>Moore → Mealy</h3><p class='note'>Each transition takes the output of the state it enters. The first output of the Moore machine (from the start state) has no Mealy counterpart, so it is dropped.</p>`}
else{type='moore';const df=P.T.length?P.T[0][3]:'0',nm=(q,o)=>q+'_'+o,s0=nm(P.start,df),seen=new Set([s0]),qu=[[P.start,df]],tt=[],oo=[];
while(qu.length){const[q,o]=qu.shift();oo.push(nm(q,o)+'='+o);P.T.filter(t=>t[0]==q).forEach(t=>{const n=nm(t[2],t[3]);tt.push([nm(q,o),t[1],n]);if(!seen.has(n)){seen.add(n);qu.push([t[2],t[3]])}})}
T=tt;O=oo.join(', ');s=s0;h=`<h3>Mealy → Moore</h3><p class='note'>Each Moore state is a pair: a Mealy state and the output on the transitions entering it. The start state gets the arbitrary output “${esc(df)}”, which is ignored. The Moore machine has ${seen.size} states (the Mealy machine had ${P.st.length}).</p>`}
window.MMC=[type,T.map(t=>t.join(',')),O,s];
h+=`<div class='tw'><table><tr><th>from</th><th>input</th><th>to</th>${type=='mealy'?'<th>output</th>':''}</tr>${T.map(t=>'<tr>'+t.map(x=>`<td>${esc(x)}</td>`).join('')+'</tr>').join('')}</table></div>`+(O?row('State outputs',O):'')+`<button class='go' onclick='loadMM(...MMC)'>Load this ${type} machine into the editor</button>`;$('#mm-o2').innerHTML=h}
loadMMex('moore11');
