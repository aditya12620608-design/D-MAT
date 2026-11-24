
/* ---------- Module 4 ---------- */
const PAL=['#f59e0b','#38bdf8','#a3e635','#f472b6','#c084fc','#fb7185','#2dd4bf'];let G;
function drawG(s){const n=G.V.length,P={};G.V.forEach((v,k)=>{const a=2*Math.PI*k/n-Math.PI/2;P[v]=[160+105*Math.cos(a),140+100*Math.sin(a)]});let h='';
G.E.forEach(([a,b,w])=>{const hot=s&&s.edges&&(s.edges.includes(a+'|'+b)||s.edges.includes(b+'|'+a));h+=`<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" stroke="${hot?'var(--acc)':'var(--mut)'}" stroke-width="${hot?5:1.6}"/>`;if(G.W)h+=`<text x="${(P[a][0]+P[b][0])/2+5}" y="${(P[a][1]+P[b][1])/2-4}" style="font-size:11px">${w}</text>`});
G.V.forEach(v=>{const f=s&&s.fill&&s.fill[v],c=f==null?'var(--panel)':f=='c'?'var(--hl)':f=='d'?'var(--soft)':f=='q'?'var(--bg)':PAL[f%7],dark=f!=null&&f!='d'&&f!='q';h+=`<circle cx="${P[v][0]}" cy="${P[v][1]}" r="19" fill="${c}" stroke="var(--ink)" stroke-width="2" ${f=='q'?'stroke-dasharray="4 3"':''}/><text x="${P[v][0]}" y="${P[v][1]+4}" text-anchor="middle" style="font-weight:700;${dark?'fill:#17222c':''}">${esc(v)}</text>`});
$('#g-svg').innerHTML=`<svg viewBox="0 0 320 280" role="img" aria-label="Graph">${h}</svg>`}
const setG=stepper($('#g-st'),drawG);
function runGraph(){const V=[...new Set(list($('#gv').value))],E=$('#ge').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const m=l.match(/^(\S+?)\s*-\s*(\S+?)(?::(\d+(?:\.\d+)?))?$/);return m?[m[1],m[2],m[3]?+m[3]:1,!!m[3]]:null}).filter(Boolean);
E.forEach(e=>{[e[0],e[1]].forEach(v=>{if(!V.includes(v))V.push(v)})});G={V,E,W:E.some(e=>e[3])};
const nb=v=>E.filter(e=>e[0]==v||e[1]==v).map(e=>e[0]==v?e[1]:e[0]).sort(),alg=$('#ga').value,s0=$('#g1').value.trim(),s1=$('#g2').value.trim(),S=[];
if(alg!='deg'&&alg!='col'&&!V.includes(s0)){$('#g-st').innerHTML='<div class="v bad">Start vertex “'+esc(s0)+'” is not in the graph.</div>';return}
if(alg=='bfs'){const vis=new Set([s0]),q=[s0],fill={[s0]:'q'},done=[];S.push({fill:{...fill},edges:[],text:`Start at ${s0}. Queue: [${q}]`});
while(q.length){const u=q.shift(),add=nb(u).filter(x=>!vis.has(x)),ed=add.map(x=>u+'|'+x);add.forEach(x=>{vis.add(x);q.push(x);fill[x]='q'});fill[u]='c';S.push({fill:{...fill},edges:ed,text:`Visit ${u}, enqueue [${add}]. Queue: [${q}]`});fill[u]='d'}}
if(alg=='dfs'){const vis=new Set(),fill={},go=(u,p)=>{vis.add(u);fill[u]='c';S.push({fill:{...fill},edges:p?[p+'|'+u]:[],text:`Enter ${u}`});nb(u).forEach(x=>{if(!vis.has(x))go(x,u)});fill[u]='d';S.push({fill:{...fill},edges:[],text:`${u} has no unvisited neighbors, backtrack`})};go(s0)}
if(alg=='col'){const order=[...V].sort((a,b)=>nb(b).length-nb(a).length),col={};order.forEach(v=>{const bad=nb(v).map(x=>col[x]),c=[...Array(V.length).keys()].find(i=>!bad.includes(i));col[v]=c;S.push({fill:{...col},edges:[],text:`${v} (degree ${nb(v).length}) gets color ${c+1}, the lowest not used by neighbors`})});S.push({fill:{...col},edges:[],text:`Done: ${new Set(Object.values(col)).size} colors used (greedy upper bound on the chromatic number)`})}
if(alg=='deg'){S.push({fill:{},edges:[],text:'Degrees: '+V.map(v=>v+'='+nb(v).length).join(', ')+' · sum = '+V.reduce((a,v)=>a+nb(v).length,0)+' = 2 × '+E.length+' edges'})}
if(alg=='dij'){const d={},pr={},fin=new Set(),fill={};V.forEach(v=>d[v]=Infinity);d[s0]=0;
while(true){const u=V.filter(v=>!fin.has(v)&&d[v]<Infinity).sort((a,b)=>d[a]-d[b])[0];if(!u)break;fin.add(u);fill[u]='c';const rl=[];E.forEach(([a,b,w])=>{const x=a==u?b:b==u?a:null;if(x&&!fin.has(x)&&d[u]+w<d[x]){d[x]=d[u]+w;pr[x]=u;rl.push(`${x}=${d[x]}`);fill[x]='q'}});S.push({fill:{...fill},edges:Object.keys(pr).map(k=>pr[k]+'|'+k),text:`Settle ${u} (distance ${d[u]}).${rl.length?' Relax: '+rl.join(', '):' Nothing to relax.'}`});fill[u]='d'}
if(V.includes(s1)&&d[s1]<Infinity){const path=[s1];while(path[0]!=s0)path.unshift(pr[path[0]]);const f={};path.forEach(v=>f[v]='c');S.push({fill:f,edges:path.slice(1).map((v,i)=>path[i]+'|'+v),text:`Shortest ${s0} → ${s1}: ${path.join(' → ')} with cost ${d[s1]}`})}else S.push({fill,edges:[],text:`No path to ${s1}`})}
setG(S)}
