
/* ---------- Module 2 ---------- */
function parseL(src){const t=src.replace(/∧/g,'&').replace(/∨/g,'|').replace(/¬/g,'~').replace(/↔/g,'<->').replace(/→/g,'->').replace(/⊕/g,'^').match(/<->|->|[A-Za-z_]\w*|[01]|[&|^~!()]/g)||[];let i=0;
const lvl=(ops,nx)=>()=>{let l=nx();while(ops.includes(t[i])){const o=t[i++];l={o,l,r:nx()}}return l};
const atom=()=>{const x=t[i++];if(x=='(' ){const e=iff();if(t[i++]!=')')throw Error('Missing closing parenthesis');return e}if(x=='~'||x=='!')return{o:'~',r:atom()};if(x&&/^[A-Za-z_]/.test(x))return{v:x};if(x=='0'||x=='1')return{c:+x};throw Error('Unexpected '+(x||'end of expression'))};
const and=lvl(['&'],atom),xor=lvl(['^'],and),or=lvl(['|'],xor),imp=()=>{const l=or();if(t[i]=='->'){i++;return{o:'->',l,r:imp()}}return l},iff=lvl(['<->'],imp);
const e=iff();if(i<t.length)throw Error('Unexpected '+t[i]);return e}
const str=n=>n.v||(n.c!=null?String(n.c):n.o=='~'?'~'+(n.r.v||n.r.c!=null||n.r.o=='~'?str(n.r):'('+str(n.r)+')'):'('+str(n.l)+' '+n.o+' '+str(n.r)+')');
const ev=(n,E)=>n.v?E[n.v]:n.c!=null?n.c:n.o=='~'?1-ev(n.r,E):({'&':(a,b)=>a&b,'|':(a,b)=>a|b,'^':(a,b)=>a^b,'->':(a,b)=>(1-a)|b,'<->':(a,b)=>+(a==b)})[n.o](ev(n.l,E),ev(n.r,E));
const vars=(n,s=new Set())=>{if(n.v)s.add(n.v);if(n.l)vars(n.l,s);if(n.r)vars(n.r,s);return s};
const subs=(n,o=[])=>{if(n.l)subs(n.l,o);if(n.r)subs(n.r,o);if(!n.v&&n.c==null&&!o.some(x=>str(x)==str(n)))o.push(n);return o};
function runLogic(){const o=$('#lo');try{const a=parseL($('#ex').value),b=$('#ex2').value.trim()?parseL($('#ex2').value):null;
const V=[...new Set([...vars(a),...(b?vars(b):[])])].sort();if(V.length>6)throw Error('Use at most 6 variables');
const cols=subs(a),rows=[],res=[],res2=[];
for(let m=0;m<1<<V.length;m++){const E={};V.forEach((v,k)=>E[v]=(m>>(V.length-1-k))&1);rows.push([...V.map(v=>E[v]),...cols.map(c=>ev(c,E))]);res.push(ev(a,E));if(b)res2.push(ev(b,E))}
const cell=(x,last)=>`<td class="${x?'t':'f'}"${last?' style="font-weight:700"':''}>${x}</td>`;
let h='<div class="tw"><table><tr>'+V.map(v=>`<th>${v}</th>`).join('')+cols.map(c=>`<th>${esc(str(c))}</th>`).join('')+'</tr>'+rows.map(r=>'<tr>'+r.map((x,k)=>k<V.length?`<td>${x}</td>`:cell(x,k==r.length-1)).join('')+'</tr>').join('')+'</table></div>';
const ones=res.filter(x=>x).length,kind=ones==res.length?'Tautology (always true)':ones==0?'Contradiction (always false)':'Contingency (true in '+ones+' of '+res.length+' rows)';
const mt=res.map((x,i)=>x?i:null).filter(x=>x!=null);
h+=`<div class="v">${kind}</div>`+row('Minterms Σm',mt.length?'('+mt.join(', ')+')':'none');
if(b)h+=row('Equivalent to '+str(b)+'?',res.every((x,i)=>x==res2[i])?'yes, both give the same output in every row':'no, they differ in rows '+res.map((x,i)=>x!=res2[i]?i:null).filter(x=>x!=null).join(', '),res.every((x,i)=>x==res2[i]));
o.innerHTML=h}catch(e){o.innerHTML='<div class="v bad">'+esc(e.message)+'</div>'}}
