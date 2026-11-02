import {SPORTS,DEFAULT_PROFILE,makeDemo,emptyState,normalizeState,todayISO,dateObj,dateLabel,round,bmr,getWeightOn,dailyReport,calculateModel,bmi,sportMetric,sportMetricsFor,sportMetricDefs,caloriesForSport,humorousMessage} from './core.js';
const KEY='metrica_v1_personal_archive';
const app=document.getElementById('app');
const icons={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
 book:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
 activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
 chart:'<path d="M3 3v18h18M7 16l4-5 4 3 5-8"/>',
 settings:'<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-2 2-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21h-2.9v-.09A1.7 1.7 0 0 0 10.3 19.4a1.7 1.7 0 0 0-1.86.35l-.06.06-2-2 .06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H5v-2.9h.08A1.7 1.7 0 0 0 6.6 10.3a1.7 1.7 0 0 0-.34-1.87l-.06-.06 2-2 .06.06a1.7 1.7 0 0 0 1.87.34 1.7 1.7 0 0 0 1-1.55V5h2.9v.08a1.7 1.7 0 0 0 1.55 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06 2 2-.06.06a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.55 1H21v2.9h-.08A1.7 1.7 0 0 0 19.4 15z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',flame:'<path d="M12 22c4.4 0 7-3.1 7-7 0-3-2.2-5.6-4-7-.1 3-1.7 4.1-2.6 4.2C13 8.7 11.6 5.3 8 2c.3 4.1-3 7-3 12 0 4.4 3 8 7 8z"/>',
 scale:'<path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zM8 10a4 4 0 0 1 8 0M12 10l2-2"/>',
 steps:'<path d="M6 2c2 0 3 3 3 5s-2 3-4 3-3-1-3-3 2-5 4-5ZM18 10c2 0 4 3 4 5s-1 3-4 3-4-1-4-3 2-5 4-5ZM5 14c3-1 5 1 5 3v4H3v-5ZM16 3c3 0 4 2 4 4"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v4h16v-4"/>',download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 edit:'<path d="M4 20h4l12-12-4-4L4 16zM14 6l4 4"/>',trash:'<path d="M4 7h16M10 3h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',shield:'<path d="m12 2 8 4v6c0 5-3.5 8.4-8 10-4.5-1.6-8-5-8-10V6zM9 12l2 2 4-4"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',trend:'<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
 meal:'<path d="M4 3v8m4-8v8M4 7h4M6 11v10M16 3v18m0-18c-4 4-4 8 0 10"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 check:'<path d="M4 12l5 5L20 6"/>',refresh:'<path d="M20 7V3l-4 4M4 17v4l4-4M5 10a7 7 0 0 1 12-4l3 1M19 14a7 7 0 0 1-12 4l-3-1"/>',
};
const ic=(name,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.info}</svg>`;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(v,d=0)=>Number.isFinite(v)?new Intl.NumberFormat('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d}).format(v):'—';
const sign=(v,d=0)=>v===null?'—':`${v>0?'+':''}${num(v,d)}`;
const fieldVal=v=>v===null||v===undefined?'':String(v);
const parseNum=v=>v===''||v===null||v===undefined?null:Number.isFinite(Number(v))?Number(v):null;
const avg=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const pace=v=>Number.isFinite(v)&&v>0?`${Math.floor(Math.round(v)/60)}:${String(Math.round(v)%60).padStart(2,'0')}`:'—';
let store;
try{const x=localStorage.getItem(KEY);store=x?normalizeState(JSON.parse(x)):makeDemo();if(x)store.mode='personal';}catch(e){store=makeDemo();}
let ui={view:'home',dayDate:store.mode==='demo'?store.days.at(-1)?.date||todayISO():todayISO(),sportKind:'running',sportMetric:'distance',sportPeriod:'all',listSportFilter:'all',analysisMetric:'weight',sportDraft:null,sportEditing:null,suggested:false};
let toastTimeout;
function notify(message){const node=document.getElementById('toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('show'),3500);}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(store));return true;}catch(e){notify('Memoria del browser non disponibile. Esporta un backup JSON.');return false;}}
function navTo(id){ui.view=id;ui.sportEditing=null;ui.sportDraft=null;render();window.scrollTo({top:0,behavior:'auto'});}
const navItems=[['home','home','Home'],['journal','book','Diario'],['sports','activity','Sport'],['analysis','chart','Analisi'],['settings','settings','Impostazioni']];
function shell(content){
 const nav=navItems.map(([id,icon,label])=>`<button type="button" class="${ui.view===id?'active':''}" data-nav="${id}">${ic(icon)}<span>${label}</span></button>`).join('');
 const demo=store.mode==='demo'?`<span class="tag warn">Dati demo</span>`:`<span class="tag neutral">Archivio locale</span>`;
 return `<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brand-icon">M</div><div><h2>metrica.</h2><span>diario & performance</span></div></div>
 <nav class="nav">${nav}</nav><div class="side-bottom"><div class="side-note"><strong>${ic('shield')} Privacy prima di tutto</strong>Le informazioni rimangono nel browser. Esporta periodicamente un backup.</div><div class="side-user"><div class="avatar">M</div><div><strong style="color:#e8eee9">Profilo personale</strong><div style="color:#8096a6;margin-top:3px">Metrica 1.0</div></div></div></div></aside>
 <main class="main"><header class="topbar"><div class="crumb">METRICA <span style="color:#bdc6cb;margin:0 9px">/</span><b>${navItems.find(x=>x[0]===ui.view)?.[2]}</b></div><div class="top-actions">${demo}<div class="date-chip">${ic('calendar')}${dateLabel(todayISO(),{day:'numeric',month:'long'})}</div><button class="head-cta" data-nav="journal">${ic('plus')} Registra giornata</button></div></header><div class="main-inner">${content}<div class="footer-note">Metrica v1.0 · Stime energetiche indicative · Archivio memorizzato esclusivamente sul dispositivo</div></div></main>
 <nav class="mobile-bar">${nav}</nav></div>`;
}
function head(label,title,subtitle){return `<div class="page-head"><div><div class="eyebrow">${label}</div><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div></div>`;}
function demoNotice(){return store.mode==='demo'?`<div class="notice demo">${ic('info')} <strong>Modalità dimostrativa.</strong> I valori visualizzati sono inventati. <button class="link" data-action="personal-start">Inizia con un archivio vuoto</button> oppure <button class="link" data-nav="settings">importa lo storico Excel</button>.</div>`:'';}
function button(label,action,style=''){return `<button class="btn ${style}" type="button" data-action="${action}">${label}</button>`;}
function metricBox(label,value,unit='',sub='',icon='trend',color=''){return `<div class="card kpi"><div class="caption">${label}${ic(icon)}</div><div><div class="value number ${color}">${value} <span class="suffix">${unit}</span></div><div class="foot">${sub}</div></div></div>`;}
function field(name,label,value='',extra='',type='number',hint=''){
 return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" ${type==='number'?'step="any" min="0"':''} value="${esc(fieldVal(value))}" ${extra}>${hint?`<div class="field-hint">${hint}</div>`:''}</div>`;
}
function selectField(name,label,options,value,extra=''){return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}" ${extra}>${options.map(([v,t])=>`<option value="${esc(v)}" ${String(value)===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`;}
function safeTextArea(name,label,value=''){return `<div class="field"><label for="${name}">${label}</label><textarea id="${name}" name="${name}" rows="3">${esc(value)}</textarea></div>`;}
function emptyGraph(title='Nessun dato disponibile',sub='Registra qualche attività per visualizzare un andamento.'){
 return `<div class="empty">${ic('chart')}<strong>${title}</strong><p>${sub}</p></div>`;
}
function svgChart(rows,series,{height=246,formatAxis=null}={}){
 const values=rows.flatMap(r=>series.map(s=>r[s.key]).filter(v=>Number.isFinite(v)));
 if(!values.length)return emptyGraph('Grafico ancora vuoto','Servono almeno una o più registrazioni con questo indicatore.');
 const W=740,H=height, L=53,R=16,T=23,B=35;
 let low=Math.min(...values),high=Math.max(...values);let pad=(high-low)*.16||Math.max(1,Math.abs(high)*.025);
 low-=pad;high+=pad;
 let times=rows.map(r=>dateObj(r.date).getTime());const tMin=Math.min(...times),tMax=Math.max(...times);
 const x=i=>tMin===tMax?(L+W-R)/2:L+(times[i]-tMin)/(tMax-tMin)*(W-R-L);
 const y=v=>T+(high-v)/(high-low)*(H-B-T);
 const axes=Array.from({length:5},(_,i)=>{let v=low+(high-low)*(4-i)/4,py=y(v);const label=formatAxis?formatAxis(v):num(v,Math.abs(high-low)<20?1:0);return `<line class="gridline" x1="${L}" x2="${W-R}" y1="${py}" y2="${py}"/><text class="label" text-anchor="end" x="${L-11}" y="${py+4}">${esc(label)}</text>`;}).join('');
 const dates=[0,Math.round((rows.length-1)/2),rows.length-1].filter((n,i,a)=>a.indexOf(n)===i);
 const labels=dates.map(i=>`<text class="label" text-anchor="middle" x="${x(i)}" y="${H-11}">${dateLabel(rows[i].date,{day:'2-digit',month:'short'})}</text>`).join('');
 const lines=series.map(s=>{
   // segmentazione: non connettiamo valori mancanti.
   let segments=[],current=[];
   rows.forEach((r,i)=>{const v=r[s.key];if(Number.isFinite(v)){current.push([x(i),y(v),v,r.date]);}else if(current.length){segments.push(current);current=[];}});
   if(current.length)segments.push(current);
   return segments.map(seg=>{
      const d=seg.map(([xx,yy],j)=>`${j?'L':'M'}${xx.toFixed(1)} ${yy.toFixed(1)}`).join(' ');
      return `<path class="line" d="${d}" stroke="${s.color}"/>${seg.map(([xx,yy,v,date])=>`<circle class="dot" cx="${xx}" cy="${yy}" r="4" fill="${s.color}"><title>${esc(s.label)} · ${dateLabel(date)}: ${formatAxis?formatAxis(v):num(v,2)} ${s.unit||''}</title></circle>`).join('')}`;
   }).join('');
 }).join('');
 const legend=series.map(s=>`<span class="legend-item"><span class="legend-dot" style="background:${s.color}"></span>${s.label}</span>`).join('');
 return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafico ${series.map(s=>s.label).join(' e ')}">${axes}${labels}${lines}</svg><div class="chart-legend">${legend}</div>`;
}
function home(){
 const date=ui.dayDate||todayISO(),p=store.profile,r=dailyReport(date,store.days,store.sports,p),model=calculateModel(store);
 const reported=model.find(x=>x.date===date),lastWeight=[...store.days].filter(d=>Number.isFinite(d.weight)).sort((a,b)=>b.date.localeCompare(a.date))[0];
 const quote=humorousMessage(r.balance,date);
 const goal=p.calorieGoal,kcal=r.kcal;
 const weightRows=[...new Set([...store.days.filter(d=>Number.isFinite(d.weight)).map(d=>d.date),...model.map(d=>d.date)])].sort().map(date=>({date,real:store.days.find(d=>d.date===date)?.weight??null,pred:model.find(d=>d.date===date)?.estimatedWeight??null}));
 const act=[...store.sports].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
 return `${head('IL TUO CRUSCOTTO','Panoramica personale','Calorie, peso e attività fisica in un solo posto. Le previsioni sono stime da confrontare con le misurazioni reali.')}${demoNotice()}
 <div class="section-stack" style="margin-top:${store.mode==='demo'?'16px':'0'}"><div class="grid grid-home"><section class="card hero"><div class="hero-content"><div class="eyebrow">BILANCIO DELLA GIORNATA</div><div class="hero-label">${dateLabel(date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div><div class="hero-num number">${r.balance===null?'—':sign(Math.round(r.balance))} <span>kcal</span></div><p class="hero-note">${r.balance===null?'Nessuna registrazione alimentare. Inizia dal diario.':r.balance<0?'Deficit energetico stimato rispetto al consumo totale.':r.balance>0?'Surplus energetico stimato rispetto al consumo totale.':'Bilancio giornaliero stimato in pareggio.'}</p><div class="hero-metrics"><div><b>${kcal===null?'—':num(kcal)}</b><span>Calorie introdotte</span></div><div><b>${num(r.tdee)}</b><span>TDEE stimato</span></div><div><b>${num(r.sportEnergy)}</b><span>Sport extra</span></div></div><div class="hero-actions">${button(`${ic('plus')} Registra giornata`,'go-journal','mint')}</div></div></section>
 <section class="card"><div class="card-top"><div><div class="card-title">Obiettivo alimentare</div><div class="card-sub">Confronto con il target quotidiano</div></div><span class="tag">${num(goal)} kcal</span></div><div style="display:flex;align-items:baseline;gap:6px"><strong class="number" style="font-size:38px;letter-spacing:-1.6px">${kcal===null?'—':num(kcal)}</strong><span class="muted small">/ ${num(goal)} kcal</span></div><div class="calorie-track"><div style="width:${kcal===null?0:Math.max(0,Math.min(100,kcal/goal*100))}%"></div></div><div class="splitline"><span>Scostamento dal target</span><b class="number ${kcal===null?'':kcal>goal?'color-orange':'color-green'}">${kcal===null?'—':`${sign(kcal-goal)} kcal`}</b></div><div class="divider"></div><div class="card-title" style="margin-bottom:15px">Macronutrienti registrati</div>${macroBars(r.day,p)}</section></div>
 <div class="grid grid-4">${metricBox('Ultimo peso',lastWeight?num(lastWeight.weight,1):'—','kg',lastWeight?`Misurato il ${dateLabel(lastWeight.date)}`:'Nessuna pesata', 'scale')}${metricBox('BMI attuale',lastWeight?num(bmi(lastWeight.weight,p.heightCm),1):'—','','Indice di massa corporea', 'target')}${metricBox('Passi del giorno',Number.isFinite(r.day.steps)?num(r.day.steps):'—','','Passi registrati manualmente', 'steps')}${metricBox('Modello peso',reported?num(reported.estimatedWeight,1):'—','kg',reported?'Previsione dal bilancio registrato':'Disponibile per date modellate','trend','color-green')}</div>
 <div class="grid grid-home"><section class="card"><div class="card-top"><div><div class="card-title">Peso reale e stimato</div><div class="card-sub">Confronto delle registrazioni disponibili</div></div>${button('Apri analisi','go-analysis','tiny')}</div><div class="chart-container">${svgChart(weightRows,[{key:'real',label:'Peso misurato',color:'#254a5c',unit:'kg'},{key:'pred',label:'Peso previsto',color:'#36b397',unit:'kg'}])}</div><p class="small-note">Il peso previsto considera solo le giornate con calorie registrate, non i giorni mancanti.</p></section>
 <section class="card"><div class="card-top"><div><div class="card-title">Ultime attività</div><div class="card-sub">Allenamenti registrati</div></div>${button('Vedi tutte','go-sport','tiny')}</div>${act.length?act.map(s=>activityRow(s)).join(''):emptyGraph('Nessuna attività','Aggiungi il primo allenamento dal diario sportivo.')}</section></div>
 <section class="quote"><div class="quote-icon">${ic('flame')}</div><div><strong>${esc(quote.title)}</strong><p>${esc(quote.subtitle)}</p></div></section></div>`;
}
function macroBars(d,p){const ms=[['Proteine','protein','macroProtein','#40b69b'],['Carboidrati','carbs','macroCarbs','#d7a774'],['Grassi','fat','macroFat','#8c93d9']];
 return `<div class="macros">${ms.map(([name,key,target,col])=>{const n=d?.[key];return `<div class="macro-item"><div class="macro-head"><b>${name}</b><span>${n===null||n===undefined?'—':num(n)} / ${num(p[target])} g</span></div><div class="bar"><div style="width:${n===null||n===undefined?0:Math.min(100,n/p[target]*100)}%;background:${col}"></div></div></div>`;}).join('')}</div>`;
}
function activityRow(s){const meta=SPORTS[s.kind]||SPORTS.other,w=getWeightOn(s.date,store.days,store.profile),energy=caloriesForSport(s,w,store.profile);
 const parts=[dateLabel(s.date,{day:'numeric',month:'short'}),s.distanceKm?`${num(s.distanceKm,1)} km`:null,s.movingMin?`${num(s.movingMin)} min`:null].filter(Boolean);
 return `<div class="activity-row"><div class="activity-left"><div class="sport-icon">${meta.emoji}</div><div style="min-width:0"><div class="activity-name">${esc(meta.label)}</div><div class="activity-meta">${parts.join(' · ')}</div></div></div><div class="activity-val"><b>${num(energy)} kcal</b><span>${s.calories===null?'stima MET':s.caloriesSource==='excel-unverified'?'storico Excel':'registrate'}</span></div></div>`;
}
function journal(){
 const date=ui.dayDate,day=store.days.find(d=>d.date===date)||{date},report=dailyReport(date,store.days,store.sports,store.profile);
 const dates=[...store.days].sort((a,b)=>b.date.localeCompare(a.date));
 return `${head('REGISTRAZIONE QUOTIDIANA','Diario alimentare','Calorie, macronutrienti, passi e peso in un’unica scheda. Le calorie consumate sono distinte dal bilancio energetico.')}${demoNotice()}
 <div class="grid grid-home" style="margin-top:${store.mode==='demo'?'17px':'0'}"><section class="card"><div class="card-top"><div><div class="card-title">Registra o modifica una giornata</div><div class="card-sub">Le celle vuote rimangono non registrate, non diventano zero.</div></div>${button('Oggi','day-today','tiny')}</div>
 <form id="day-form"><div class="form-grid">${field('day-date','Data',date,'required','date')}${field('day-calories','Calorie assunte (kcal)',day.calories,'placeholder="es. 2050"')}</div>
 <div class="form-section">Macronutrienti · facoltativi</div><div class="form-grid three">${field('day-protein','Proteine (g)',day.protein)}${field('day-carbs','Carboidrati (g)',day.carbs)}${field('day-fat','Grassi (g)',day.fat)}${field('day-fiber','Fibre (g)',day.fiber)}</div>
 <div class="form-section">Movimento e peso</div><div class="form-grid">${field('day-steps','Passi giornalieri',day.steps,'placeholder="es. 8500"')}${field('day-distance','Distanza a piedi da telefono (km)',day.distanceKm,'placeholder="alternativa ai passi"')}${field('day-weight','Peso da bilancia (kg)',day.weight,'placeholder="es. 89.8"')}</div>
 <p class="small-note" style="margin:13px 0 3px">Se inserisci sia passi sia chilometri, il calcolo del movimento utilizza i chilometri. Se un allenamento è già compreso nel totale, la sua quota viene sottratta dal movimento quotidiano.</p>
 <div class="form-section">Note</div>${safeTextArea('day-notes','Annotazioni giornaliere',day.notes)}
 <div class="btn-row" style="margin-top:19px"><button type="submit" class="btn primary">${ic('check')} Salva giornata</button>${store.days.some(x=>x.date===date)?button(`${ic('trash')} Elimina giorno`,'delete-day','danger'):''}</div></form></section>
 <section class="section-stack"><div class="card"><div class="card-top"><div><div class="card-title">Bilancio · ${dateLabel(date)}</div><div class="card-sub">Calcolato sui dati attualmente salvati</div></div><span class="tag ${report.legacy?'warn':''}">${report.legacy?'Metodo storico':'TDEE dinamico'}</span></div>
 ${[['Metabolismo basale',report.bmr],['Dispendio di riferimento',report.base],['Variazione dai passi',report.stepsEnergy],['Attività sportive extra',report.sportEnergy],['TDEE complessivo',report.tdee]].map(([k,v],i)=>`<div class="splitline"><span>${k}</span><b class="number">${i===2||i===3?sign(Math.round(v)):num(Math.round(v))} kcal</b></div>`).join('')}
 <div class="divider"></div><div class="splitline"><strong>Bilancio netto</strong><strong class="number ${report.balance===null?'':report.balance<0?'color-green':'color-orange'}">${report.balance===null?'—':`${sign(Math.round(report.balance))} kcal`}</strong></div>
 <div class="tip">${report.legacy?'Dato storico: il TDEE originario dell’Excel è conservato finché non registri nuovi passi o chilometri per questo giorno.':'Il dispendio è una stima: parte dal BMR, aggiunge movimento e sport senza duplicare le attività segnate come incluse nei passi.'}</div></div>
 <div class="card"><div class="card-top"><div><div class="card-title">Sport nello stesso giorno</div><div class="card-sub">${dateLabel(date)}</div></div>${button(`${ic('plus')} Attività`,'add-sport-from-day','tiny')}</div>${report.sports.length?report.sports.map(activityRow).join(''):emptyGraph('Nessuno sport registrato','Le attività verranno sommate automaticamente al dispendio della giornata.')}</div></section></div>
 <section class="card" style="margin-top:20px"><div class="card-top"><div><div class="card-title">Storico alimentare</div><div class="card-sub">Seleziona una data per aprirla nel diario</div></div><span class="tag neutral">${dates.length} giornate</span></div>
 ${dates.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Calorie</th><th>Proteine</th><th>Passi</th><th>Peso</th><th>Bilancio</th><th></th></tr></thead><tbody>${dates.slice(0,40).map(d=>{
 const rr=dailyReport(d.date,store.days,store.sports,store.profile);
 return `<tr><td><strong>${dateLabel(d.date)}</strong></td><td>${num(d.calories)} kcal</td><td>${num(d.protein)} g</td><td>${num(d.steps)}</td><td>${num(d.weight,1)} kg</td><td class="${rr.balance===null?'':rr.balance<0?'color-green':'color-orange'}">${sign(rr.balance===null?null:Math.round(rr.balance))}</td><td><button class="btn tiny" data-date="${d.date}">Apri</button></td></tr>`;}).join('')}</tbody></table></div>`:emptyGraph('Non ci sono giornate','Inserisci la prima registrazione nel modulo qui sopra.')}</section>`;
}
const optionSports=Object.entries(SPORTS).map(([k,v])=>[k,v.label]);
function sportDraft(){return ui.sportDraft||{date:ui.dayDate||todayISO(),kind:'running',distanceKm:null,movingMin:null,elapsedMin:null,elevationM:null,calories:null,caloriesType:'active',includedInSteps:true,activitySteps:null,intensity:'moderate',notes:'',location:''};}
function sportForm(){
 const d=sportDraft(),sport=SPORTS[d.kind]||SPORTS.other,showDistance=sport.distance;
 const wt=getWeightOn(d.date,store.days,store.profile),estimate=caloriesForSport({...d,calories:null},wt,store.profile);
 return `<section class="card" id="sport-entry"><div class="card-top"><div><div class="card-title">${ui.sportEditing?'Modifica allenamento':'Nuova attività sportiva'}</div><div class="card-sub">Registra solo ciò che sai. Gli altri campi rimangono facoltativi.</div></div><span class="tag">${sport.emoji} ${sport.label}</span></div>
 <form id="sport-form"><div class="form-grid">${field('sport-date','Data',d.date,'required','date')}${selectField('sport-kind','Disciplina',optionSports,d.kind)}</div>
 <div class="form-section">Dati della sessione</div><div class="form-grid">${field('sport-minutes','Tempo in movimento (min)',d.movingMin,'placeholder="es. 45"')}${showDistance?field('sport-distance','Distanza (km)',d.distanceKm,'placeholder="es. 5.2"'):''}
 ${showDistance?field('sport-total','Tempo totale con pause (min)',d.elapsedMin,'placeholder="facoltativo"'):''}${sport.elevation?field('sport-elevation','Dislivello positivo (m)',d.elevationM,'placeholder="es. 110"'):''}</div>
 ${showDistance?`<div class="form-grid" style="margin-top:13px">${field('sport-place','Luogo / percorso',d.location,'placeholder="facoltativo"','text')}</div>`:''}
 <div id="sport-derived" class="small-note" style="margin-top:12px">Velocità e passo medio verranno calcolati da distanza e tempo in movimento.</div><div class="form-section">Consumo energetico</div><div class="form-grid">${field('sport-kcal','Calorie inserite manualmente',d.calories,'placeholder="vuoto = stima automatica"')}${selectField('sport-intensity','Intensità', [['light','Leggera'],['moderate','Moderata'],['vigorous','Intensa']],d.intensity)}</div>
 <div class="form-grid" style="margin-top:14px">${selectField('sport-kcal-type','Tipo di calorie inserite',[['active','Attive / aggiuntive'],['total','Totali della sessione']],d.caloriesType)}</div>
 <div class="tip" style="margin-top:14px">Stima indicativa se lasci le calorie vuote: <strong id="sport-estimated">${d.movingMin>0?`${num(estimate)} kcal attive`:'inserisci la durata'}</strong>. Basata su MET e intensità; per bici e corsa considera anche la velocità ricavata. Non è una misura diretta.</div>
 ${showDistance&&['running','walking','hiking'].includes(d.kind)?`<div class="form-section">Passi e sovrapposizioni</div><label class="checkbox-row"><input type="checkbox" id="sport-included" ${d.includedInSteps?'checked':''}> I passi di questa attività sono già nel totale del telefono</label><div class="form-grid" style="margin-top:12px">${field('sport-activity-steps','Passi dell’attività (se noti)',d.activitySteps,'placeholder="altrimenti stimati dai km"')}</div>`:''}
 <div class="form-section">Note</div>${safeTextArea('sport-notes','Note sull’attività',d.notes)}
 <div class="btn-row" style="margin-top:18px"><button class="btn primary" type="submit">${ic('check')} ${ui.sportEditing?'Salva modifiche':'Aggiungi attività'}</button>${ui.sportEditing?button('Annulla modifica','cancel-sport','') : ''}</div></form></section>`;
}
function sportChart(){
 const kind=ui.sportKind,possible=sportMetricsFor(kind);if(!possible.includes(ui.sportMetric))ui.sportMetric=possible[0];
 const metric=ui.sportMetric,definition={...sportMetricDefs[metric],...(kind==='swimming'&&metric==='pace'?{unit:'min/100 m'}:{})},period=ui.sportPeriod;
 let data=store.sports.filter(s=>s.kind===kind).sort((a,b)=>a.date.localeCompare(b.date));
 if(period!=='all'){const cutoff=new Date();cutoff.setDate(cutoff.getDate()-Number(period));const minISO=dayISO(cutoff);data=data.filter(s=>s.date>=minISO);}
 const rows=data.map(s=>({date:s.date,value:metric==='calories'?caloriesForSport(s,getWeightOn(s.date,store.days,store.profile),store.profile):sportMetric(s,metric)})).filter(r=>Number.isFinite(r.value));
 const first=rows[0]?.value,last=rows.at(-1)?.value,diff=Number.isFinite(first)&&Number.isFinite(last)&&first!==0?(last-first)/Math.abs(first)*100:null;
 const present=v=>metric==='pace'?pace(v):num(v,['speed','distance'].includes(metric)?2:0);
 const descriptor=metric==='pace'?'Un passo inferiore indica maggiore velocità.':'Confronta sessioni comparabili per percorso e intensità.';
 const labelOptions=possible.map(v=>[v,sportMetricDefs[v].label]);
 return `<section class="card"><div class="card-top"><div><div class="card-title">Esplora le prestazioni</div><div class="card-sub">Scegli sport, indicatore e intervallo temporale.</div></div><span class="tag neutral">${rows.length} sessioni</span></div>
 <div class="form-grid three" style="margin-bottom:20px">${selectField('sport-filter','Attività',optionSports,kind)}${selectField('sport-metric','Indicatore',labelOptions,metric)}${selectField('sport-period','Periodo',[['all','Tutto'],['30','30 giorni'],['90','90 giorni'],['365','12 mesi']],period)}</div>
 <h3>${definition.label} <span class="muted small" style="font-weight:500">· ${definition.unit}</span></h3><div class="chart-container">${svgChart(rows,[{key:'value',label:definition.label,color:'#2eab8b',unit:definition.unit}],{formatAxis:metric==='pace'?pace:null})}</div>
 <div class="macros-grid" style="margin-top:12px"><div class="mini-stat"><div class="ms-val number">${rows.length}</div><div class="ms-cap">Sessioni con dati</div></div><div class="mini-stat"><div class="ms-val number">${first===undefined?'—':present(first)}</div><div class="ms-cap">Prima sessione</div></div><div class="mini-stat"><div class="ms-val number">${last===undefined?'—':present(last)}</div><div class="ms-cap">Ultima sessione</div></div></div><p class="small-note" style="margin-top:13px">${descriptor} ${diff===null?'':`Differenza prima/ultima: ${sign(diff,1)}%.`} Un trend richiede più rilevazioni e condizioni di confronto omogenee.</p></section>`;
}
const dayISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function sportsPage(){
 const all=[...store.sports].sort((a,b)=>b.date.localeCompare(a.date)),kinds=[...new Set(store.sports.map(s=>s.kind))],shown=all.filter(s=>ui.listSportFilter==='all'||s.kind===ui.listSportFilter);
 return `${head('ALLENAMENTO E PROGRESSO','Diario sportivo','Registra le attività una sola volta: il consumo energetico aggiorna il diario calorico e le prestazioni alimentano i grafici.')}${demoNotice()}
 <div class="grid grid-home" style="margin-top:${store.mode==='demo'?'17px':'0'}">${sportChart()}${sportForm()}</div>
 <section class="card" style="margin-top:20px"><div class="card-top"><div><div class="card-title">Sessioni registrate</div><div class="card-sub">Dati originali, modificabili quando vuoi</div></div><div class="inline-controls"><select id="sport-list-filter" class="compact-select" aria-label="Filtra elenco attività"><option value="all" ${ui.listSportFilter==='all'?'selected':''}>Tutte le attività</option>${optionSports.map(([k,n])=>`<option value="${k}" ${ui.listSportFilter===k?'selected':''}>${n}</option>`).join('')}</select><span class="tag neutral">${shown.length} attività</span></div></div>
 ${shown.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Data</th><th>Disciplina</th><th>Distanza</th><th>Movimento</th><th>Passo / velocità</th><th>Dislivello</th><th>Calorie</th><th>Azioni</th></tr></thead><tbody>${shown.slice(0,75).map(s=>{
 const k=SPORTS[s.kind],pacing=s.kind==='running'||s.kind==='hiking'||s.kind==='swimming'?pace(sportMetric(s,'pace'))+(s.distanceKm&&s.movingMin?' min/km':''):num(sportMetric(s,'speed'),1)+(s.distanceKm&&s.movingMin?' km/h':'');
 return `<tr><td>${dateLabel(s.date)}</td><td><strong>${k.emoji} ${esc(k.label)}</strong></td><td>${num(s.distanceKm,2)} km</td><td>${num(s.movingMin)}${s.elapsedMin?` / ${num(s.elapsedMin)}`:''} min</td><td>${s.distanceKm&&s.movingMin?pacing:'—'}</td><td>${num(s.elevationM)} m</td><td>${num(caloriesForSport(s,getWeightOn(s.date,store.days,store.profile),store.profile))} kcal</td><td><div class="btn-row"><button type="button" title="Modifica" class="icon-btn" data-sport-edit="${esc(s.id)}">${ic('edit')}</button><button type="button" title="Elimina" class="icon-btn" data-sport-delete="${esc(s.id)}">${ic('trash')}</button></div></td></tr>`;
 }).join('')}</tbody></table></div>`:emptyGraph('Diario sportivo vuoto','Registra un’attività per iniziare a costruire uno storico.')}</section>`;
}
function analysis(){
 const p=store.profile,weightEntries=store.days.filter(d=>Number.isFinite(d.weight)).sort((a,b)=>a.date.localeCompare(b.date));
 const model=calculateModel(store),latest=weightEntries.at(-1),early=weightEntries[0],lastModel=model.at(-1);
 const dayRows=[...store.days].filter(x=>x.calories!==null).sort((a,b)=>a.date.localeCompare(b.date)).map(d=>{
 const r=dailyReport(d.date,store.days,store.sports,p);
 return {date:d.date,calories:d.calories,tdee:r.tdee,balance:r.balance,steps:d.steps};
 });
 const three=weightEntries.map((d,i)=>{const v=weightEntries.slice(Math.max(0,i-6),i+1).map(x=>x.weight);return {date:d.date,weight:d.weight,avg:avg(v),pred:model.find(m=>m.date===d.date)?.estimatedWeight??null};});
 const metric=ui.analysisMetric;
 let rows,series,title,sub;
 if(metric==='weight'){
   rows=[...new Map([...three,...model.filter(m=>!three.some(d=>d.date===m.date)).map(m=>({date:m.date,pred:m.estimatedWeight,weight:null,avg:null}))].map(x=>[x.date,x])).values()].sort((a,b)=>a.date.localeCompare(b.date));
   series=[{key:'weight',label:'Peso registrato',color:'#254a5c',unit:'kg'},{key:'avg',label:'Media ultime 7 pesate',color:'#ad94d5',unit:'kg'},{key:'pred',label:'Peso previsto',color:'#37b397',unit:'kg'}];
   title='Peso corporeo: reale e previsto';sub='La media è calcolata sulle ultime sette pesate disponibili, non necessariamente consecutive.';
 }else{
   rows=dayRows;series=[{key:metric,label:{calories:'Calorie introdotte',tdee:'TDEE stimato',balance:'Bilancio energetico',steps:'Passi registrati'}[metric],color:'#36a787',unit:metric==='steps'?'passi':'kcal'}];
   title={calories:'Calorie introdotte',tdee:'TDEE giornaliero',balance:'Bilancio energetico',steps:'Passi quotidiani'}[metric];
   sub='L’andamento comprende le sole giornate compilate; nessun valore è inventato per le date mancanti.';
 }
 const completed=dayRows.slice(-7),meanBalance=avg(completed.map(d=>d.balance).filter(x=>Number.isFinite(x)));
 const lastWeight=latest?.weight,delta=latest&&early&&latest!==early?latest.weight-early.weight:null;
 return `${head('STATISTICHE E TREND','Analisi del percorso','Confronta le misurazioni con i risultati del modello. Le stime sono strumenti orientativi, non misurazioni di massa grassa.')}${demoNotice()}
 <div class="section-stack" style="margin-top:${store.mode==='demo'?'17px':'0'}">
 <div class="grid grid-4">${metricBox('Peso attuale',latest?num(lastWeight,1):'—','kg',latest?dateLabel(latest.date):'Nessuna pesata','scale')}${metricBox('Variazione registrata',delta===null?'—':sign(delta,1),'kg','Tra prima e ultima pesata','trend',delta!==null&&delta<0?'color-green':'')}${metricBox('Obiettivo peso',num(p.goalWeightKg,1),'kg','Modificabile nelle impostazioni','target')}${metricBox('Bilancio medio',meanBalance===null?'—':sign(Math.round(meanBalance)),'kcal','Ultime 7 giornate compilate','flame')}</div>
 <section class="card"><div class="toolbar"><div><div class="card-title">${title}</div><div class="card-sub">${sub}</div></div><div class="inline-controls"><select id="analysis-metric" class="compact-select" aria-label="Indicatore">${[['weight','Peso e previsione'],['calories','Calorie giornaliere'],['tdee','TDEE'],['balance','Bilancio energetico'],['steps','Passi']].map(([k,v])=>`<option value="${k}" ${k===metric?'selected':''}>${v}</option>`).join('')}</select></div></div>
 <div class="chart-container">${svgChart(rows,series)}</div></section>
 <div class="grid grid-2"><section class="card"><div class="card-title" style="margin-bottom:15px">Come funziona la previsione</div>
 ${[['Peso di partenza del modello',`${num(p.modelAnchorWeightKg,1)} kg`],['Data di riferimento',dateLabel(p.modelAnchorDate)],['Giornate calcolate',`${model.length}`],['Ultimo peso teorico',lastModel?`${num(lastModel.estimatedWeight,2)} kg`:'—'],['Energia teorica / kg','7.700 kcal/kg']].map(([l,v])=>`<div class="splitline"><span>${l}</span><b>${v}</b></div>`).join('')}
 <div class="tip" style="margin-top:14px">Il modello integra il bilancio energetico solo nei giorni registrati. Periodi non compilati possono rendere inaffidabile il confronto: per una nuova fase puoi aggiornare la data e il peso iniziali nelle Impostazioni.</div></section>
 <section class="card"><div class="card-title" style="margin-bottom:15px">Interpretazione dei risultati</div><div class="section-stack" style="gap:15px"><div class="splitline"><span>BMI più recente</span><b>${latest?num(bmi(lastWeight,p.heightCm),1):'—'}</b></div><div class="splitline"><span>Pesate registrate</span><b>${weightEntries.length}</b></div><div class="splitline"><span>Giornate alimentari</span><b>${dayRows.length}</b></div><div class="splitline"><span>Sessioni sportive</span><b>${store.sports.length}</b></div>
 <div class="notice"><strong>Attenzione al significato fisico.</strong> La variazione energetica / 7.700 rappresenta un'equivalenza semplificata: non misura direttamente il grasso corporeo. Acqua, glicogeno, massa magra e adattamenti metabolici possono spiegare scostamenti importanti. Il BMI non misura la percentuale di grasso.</div></div></section></div>
 </div>`;
}
function settings(){
 const p=store.profile;
 return `${head('PROFILO E ARCHIVIO','Impostazioni','Personalizza il modello di calcolo e gestisci i dati conservati soltanto su questo dispositivo.')}${demoNotice()}
 <div class="grid grid-home" style="margin-top:${store.mode==='demo'?'17px':'0'}"><section class="card"><div class="card-title">Profilo personale e obiettivi</div><div class="card-sub">Tutti i parametri sono modificabili. Non occorre ricompilare le giornate salvate.</div>
 <form id="profile-form"><div class="form-section">Dati corporei</div><div class="form-grid">${field('profile-age','Età (anni)',p.age,'required')}${field('profile-height','Altezza (cm)',p.heightCm,'required')}
 ${selectField('profile-sex','Sesso per la formula BMR',[['male','Maschile'],['female','Femminile']],p.sex)}${field('profile-refweight','Peso di riferimento se mancano pesate (kg)',p.referenceWeightKg,'required')}</div>
 <div class="form-section">Obiettivi nutrizionali</div><div class="form-grid">${field('profile-goal','Obiettivo alimentare (kcal)',p.calorieGoal,'required')}${field('profile-target','Peso obiettivo (kg)',p.goalWeightKg,'required')}${field('profile-protein','Target proteine (g)',p.macroProtein)}${field('profile-carbs','Target carboidrati (g)',p.macroCarbs)}${field('profile-fat','Target grassi (g)',p.macroFat)}</div>
 <div class="form-section">Calcolo dinamico del TDEE</div><div class="form-grid">${field('profile-factor','Fattore sedentario BMR ×',p.baseActivityFactor,'required','number','Valore iniziale 1,20; comprende attività ordinarie e termogenesi stimata.')}${field('profile-baseline-steps','Passi già compresi nel riferimento',p.baselineSteps,'required','number','Variazioni sopra/sotto questo valore modificano il consumo.')}${field('profile-walking-cost','Costo netto camminata (kcal/kg/km)',p.walkingKcalKgKm,'required','number','Coefficiente approssimativo iniziale 0,45.')}</div>
 <div class="form-section">Punto di partenza della previsione del peso</div><div class="form-grid">${field('profile-anchor-date','Data di inizio modello',p.modelAnchorDate,'required','date')}${field('profile-anchor-weight','Peso teorico iniziale (kg)',p.modelAnchorWeightKg,'required')}</div>
 <p class="small-note" style="margin-top:12px">Se riparti dopo un lungo periodo senza registrazioni, imposta una nuova data di riferimento e il peso misurato in quel momento. Le registrazioni precedenti restano archiviate, ma non entrano nella nuova previsione.</p>
 <div class="btn-row" style="margin-top:21px"><button type="submit" class="btn primary">${ic('check')} Salva impostazioni</button>${button('Ancora dall’ultima pesata','anchor-latest','')}</div></form></section>
 <div class="section-stack"><section class="card"><div class="card-title">Backup e importazione</div><div class="card-sub">Un backup JSON permette di trasferire l’archivio tra dispositivi, senza pubblicarlo.</div>
 <div class="section-stack" style="margin-top:17px;gap:11px">${button(`${ic('download')} Esporta dati in JSON`,'export-json','full')}
 <button type="button" class="btn full" id="import-trigger">${ic('upload')} Importa archivio JSON</button>
 <input type="file" id="import-file" class="file-input" accept=".json,application/json">
 <div class="notice"><strong>Privacy:</strong> non inserire il file con lo storico personale nel repository GitHub pubblico. Importalo soltanto nell'app dal tuo dispositivo. I dati salvati nel browser possono scomparire cancellando i dati del sito.</div></div></section>
 <section class="card"><div class="card-title">Gestione dell’archivio</div><div class="card-sub">Il reset cancella l'archivio locale corrente.</div><div class="splitline"><span>Giornate</span><b>${store.days.length}</b></div><div class="splitline"><span>Sport</span><b>${store.sports.length}</b></div><div class="btn-row" style="margin-top:15px">${button('Archivio vuoto','reset-empty','danger')}${button('Carica dati demo','reset-demo','')}</div></section>
 <section class="card"><div class="card-title">Metodologia e fonti</div><p class="small-note" style="margin-top:11px">BMR: Mifflin-St Jeor. Attività: stime approssimative ispirate al 2024 Adult Compendium of Physical Activities, con MET legati al tipo e all'intensità. Consumo di camminata, livello sedentario e soglia passi sono ipotesi modificabili. Il modello energetico utilizza 7.700 kcal/kg solo come indicatore teorico.</p>
 <p class="small-note" style="margin-top:10px"><a href="https://pacompendium.com/adult-compendium/" target="_blank" rel="noopener noreferrer">Catalogo MET</a> · <a href="https://www.niddk.nih.gov/bwp" target="_blank" rel="noopener noreferrer">NIH Body Weight Planner</a></p></section></div></div>`;
}
function render(){
 const content={home,journal,sports:sportsPage,analysis,settings}[ui.view]?.()||home();
 app.innerHTML=shell(content);
}
function formValue(form,name){return form.querySelector(`[name="${name}"]`)?.value??'';}
function formN(form,name){return parseNum(formValue(form,name));}
function personalIfDemo(){if(store.mode!=='demo')return;store=emptyState();}
function saveDay(form){
 const date=formValue(form,'day-date');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){notify('Inserisci una data valida.');return;}
 const row={date,calories:formN(form,'day-calories'),protein:formN(form,'day-protein'),carbs:formN(form,'day-carbs'),fat:formN(form,'day-fat'),fiber:formN(form,'day-fiber'),
    steps:formN(form,'day-steps'),distanceKm:formN(form,'day-distance'),weight:formN(form,'day-weight'),notes:formValue(form,'day-notes').slice(0,1000)};
 if(row.weight!==null&&(row.weight<20||row.weight>400)){notify('Controlla il peso inserito.');return;}
 if(row.steps!==null&&row.steps>100000){notify('Numero passi non plausibile.');return;}
 if(Object.entries(row).filter(([k])=>!['date','notes'].includes(k)).every(([k,v])=>v===null)){notify('Inserisci almeno un valore da salvare.');return;}
 personalIfDemo();const old=store.days.find(x=>x.date===date);
 // Per le giornate storiche, manteniamo il TDEE originale solo se non sono stati registrati nuovi passi.
 if(old?.legacyTdee&&row.steps===null&&row.distanceKm===null)row.legacyTdee=old.legacyTdee;
 if(old?.source)row.source=old.source;
 store.days=store.days.filter(d=>d.date!==date).concat(row).sort((a,b)=>a.date.localeCompare(b.date));
 ui.dayDate=date;persist();notify('Giornata salvata.');render();
}
function readSportForm(form){
 const kind=formValue(form,'sport-kind'),d={
    date:formValue(form,'sport-date'),kind,location:formValue(form,'sport-place'),
    movingMin:formN(form,'sport-minutes'),elapsedMin:formN(form,'sport-total'),distanceKm:formN(form,'sport-distance'),elevationM:formN(form,'sport-elevation'),
    calories:formN(form,'sport-kcal'),caloriesType:formValue(form,'sport-kcal-type')||'active',
    intensity:formValue(form,'sport-intensity')||'moderate',activitySteps:formN(form,'sport-activity-steps'),
    includedInSteps:!!form.querySelector('#sport-included')?.checked,notes:formValue(form,'sport-notes').slice(0,1000),
 };
 if(!SPORTS[kind]?.distance){d.location='';d.distanceKm=null;d.elapsedMin=null;d.elevationM=null;d.activitySteps=null;d.includedInSteps=false;}
 return d;
}
function saveSport(form){
 const d=readSportForm(form);
 if(!d.date||!SPORTS[d.kind]){notify('Data o disciplina non valida.');return;}
 if(!(d.movingMin>0)&&d.calories===null){notify('Inserisci la durata oppure le calorie sportive.');return;}
 if(d.movingMin!==null&&d.movingMin>1440){notify('Durata superiore a 24 ore: controlla il dato.');return;}
 if(d.elapsedMin!==null&&d.movingMin!==null&&d.elapsedMin<d.movingMin){notify('Il tempo totale non può essere inferiore al tempo in movimento.');return;}
 if(d.caloriesType==='total'&&!(d.movingMin>0)){notify('Per le calorie totali serve anche la durata della sessione.');return;}
 personalIfDemo();
 if(ui.sportEditing){d.id=ui.sportEditing;store.sports=store.sports.filter(s=>s.id!==ui.sportEditing);}else d.id=`activity-${Date.now()}-${Math.floor(Math.random()*1e6)}`;
 d.caloriesSource=d.calories===null?'estimated':'manual';d.source='Inserimento app';
 store.sports.push(d);ui.sportKind=d.kind;ui.sportEditing=null;ui.sportDraft=null;persist();notify('Allenamento salvato nel diario.');render();
}
function saveProfile(form){
 const p={...store.profile,
 age:formN(form,'profile-age'),heightCm:formN(form,'profile-height'),sex:formValue(form,'profile-sex'),referenceWeightKg:formN(form,'profile-refweight'),
 calorieGoal:formN(form,'profile-goal'),goalWeightKg:formN(form,'profile-target'),macroProtein:formN(form,'profile-protein'),macroCarbs:formN(form,'profile-carbs'),macroFat:formN(form,'profile-fat'),
 baseActivityFactor:formN(form,'profile-factor'),baselineSteps:formN(form,'profile-baseline-steps'),walkingKcalKgKm:formN(form,'profile-walking-cost'),
 modelAnchorDate:formValue(form,'profile-anchor-date'),modelAnchorWeightKg:formN(form,'profile-anchor-weight')};
 if(!(p.age>=1&&p.age<=110&&p.heightCm>=80&&p.heightCm<=230&&p.referenceWeightKg>=20&&p.referenceWeightKg<=400&&p.calorieGoal>=500&&p.calorieGoal<=10000&&p.goalWeightKg>=20&&p.modelAnchorWeightKg>=20&&p.baseActivityFactor>=1&&p.baseActivityFactor<=2&&p.baselineSteps>=0&&p.walkingKcalKgKm>=0&&p.walkingKcalKgKm<=2)){
   notify('Controlla i parametri del profilo.');return;
 }
 if(['macroProtein','macroCarbs','macroFat'].some(k=>!(p[k]>0))){notify('I target dei macronutrienti devono essere positivi.');return;}
 personalIfDemo();store.profile=p;persist();notify('Impostazioni aggiornate.');render();
}
function downloadJson(){
 const contents=JSON.stringify({...store,schemaVersion:1,mode:'personal'},null,2),blob=new Blob([contents],{type:'application/json'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=`metrica-backup-${todayISO()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);notify('Backup esportato. Conserva il file in un luogo sicuro.');
}
async function importJson(file){
 if(!file)return;
 if(file.size>15_000_000){notify('File troppo grande.');return;}
 try{
 const raw=JSON.parse(await file.text()),newState=normalizeState(raw);
 if(!window.confirm(`Importare ${newState.days.length} giornate e ${newState.sports.length} attività? L’archivio attuale verrà sostituito.`))return;
 store=newState;ui.dayDate=todayISO();ui.sportKind=newState.sports.at(-1)?.kind||'running';ui.sportMetric=sportMetricsFor(ui.sportKind)[0];ui.view='home';persist();render();notify('Storico importato correttamente.');
 }catch(e){notify(`Importazione non riuscita: ${e.message}`);}
}
app.addEventListener('submit',event=>{
 event.preventDefault();
 if(event.target.id==='day-form')saveDay(event.target);
 else if(event.target.id==='sport-form')saveSport(event.target);
 else if(event.target.id==='profile-form')saveProfile(event.target);
});
function updateSportPreview(){
 const form=document.getElementById('sport-form');if(!form)return;
 const d=readSportForm(form),weight=getWeightOn(d.date,store.days,store.profile);
 const el=document.getElementById('sport-estimated');
 if(el)el.textContent=d.movingMin>0?`${num(caloriesForSport({...d,calories:null},weight,store.profile))} kcal attive`:'inserisci la durata';
 const stat=document.getElementById('sport-derived');
 if(stat)stat.textContent=d.distanceKm>0&&d.movingMin>0
  ?`Dati calcolati: ${num(60*d.distanceKm/d.movingMin,2)} km/h · ${pace(60*d.movingMin/d.distanceKm)} min/km${d.elapsedMin>=d.movingMin?` · pausa ${num(d.elapsedMin-d.movingMin)} min`:''}`
  :'Velocità e passo medio verranno calcolati da distanza e tempo in movimento.';
}
app.addEventListener('input',event=>{if(event.target.closest('#sport-form'))updateSportPreview();});
app.addEventListener('change',event=>{
 const id=event.target.id;
 if(id==='day-date'){ui.dayDate=event.target.value;render();return;}
 if(id==='sport-filter'){ui.sportKind=event.target.value;ui.sportMetric=sportMetricsFor(ui.sportKind)[0];render();return;}
 if(id==='sport-metric'){ui.sportMetric=event.target.value;render();return;}
 if(id==='sport-period'){ui.sportPeriod=event.target.value;render();return;}
 if(id==='sport-list-filter'){ui.listSportFilter=event.target.value;render();return;}
 if(id==='analysis-metric'){ui.analysisMetric=event.target.value;render();return;}
 if(id==='sport-kind'){
   ui.sportDraft=readSportForm(document.getElementById('sport-form'));
   if(['running','hiking','walking'].includes(ui.sportDraft.kind))ui.sportDraft.includedInSteps=true;
   ui.sportEditing=ui.sportEditing||null;render();return;
 }
 if(event.target.closest('#sport-form'))updateSportPreview();
 if(id==='import-file')importJson(event.target.files?.[0]);
});
app.addEventListener('click',event=>{
 const nav=event.target.closest('[data-nav]');if(nav){navTo(nav.dataset.nav);return;}
 const dateBtn=event.target.closest('[data-date]');if(dateBtn){ui.dayDate=dateBtn.dataset.date;navTo('journal');return;}
 const ebtn=event.target.closest('[data-sport-edit]');if(ebtn){const s=store.sports.find(x=>x.id===ebtn.dataset.sportEdit);if(s){ui.sportEditing=s.id;ui.sportDraft={...s};ui.sportKind=s.kind;ui.view='sports';render();document.getElementById('sport-entry')?.scrollIntoView({behavior:'smooth'});}return;}
 const dbtn=event.target.closest('[data-sport-delete]');if(dbtn){if(window.confirm('Eliminare questa attività dal diario sportivo?')){store.sports=store.sports.filter(s=>s.id!==dbtn.dataset.sportDelete);persist();render();notify('Attività eliminata.');}return;}
 if(event.target.closest('#import-trigger')){document.getElementById('import-file')?.click();return;}
 const act=event.target.closest('[data-action]')?.dataset.action;
 if(!act)return;
 if(act==='go-journal'){navTo('journal');return;}
 if(act==='go-analysis'){navTo('analysis');return;}
 if(act==='go-sport'){navTo('sports');return;}
 if(act==='day-today'){ui.dayDate=todayISO();render();return;}
 if(act==='add-sport-from-day'){ui.sportDraft={...sportDraft(),date:ui.dayDate};ui.sportEditing=null;ui.view='sports';render();document.getElementById('sport-entry')?.scrollIntoView({behavior:'smooth'});return;}
 if(act==='delete-day'){
   if(window.confirm(`Eliminare la registrazione del ${dateLabel(ui.dayDate)}? Gli sport di quel giorno resteranno salvati.`)){
     store.days=store.days.filter(d=>d.date!==ui.dayDate);persist();render();notify('Giornata eliminata.');
   }return;
 }
 if(act==='cancel-sport'){ui.sportDraft=null;ui.sportEditing=null;render();return;}
 if(act==='export-json'){downloadJson();return;}
 if(act==='anchor-latest'){
   const latest=[...store.days].filter(d=>Number.isFinite(d.weight)).sort((a,b)=>b.date.localeCompare(a.date))[0];
   if(!latest){notify('Non ci sono pesate registrate.');return;}
   if(!window.confirm(`Usare ${num(latest.weight,1)} kg alla data ${dateLabel(latest.date)} come nuovo punto di partenza?`))return;
   personalIfDemo();store.profile.modelAnchorDate=latest.date;store.profile.modelAnchorWeightKg=latest.weight;persist();render();notify('Punto di partenza aggiornato.');return;
 }
 if(act==='personal-start'||act==='reset-empty'){
   if(window.confirm('Creare un archivio personale vuoto? I dati attuali saranno sostituiti. Esporta prima un backup se vuoi conservarli.')){
     store=emptyState();ui.dayDate=todayISO();ui.sportDraft=null;ui.sportEditing=null;ui.view='home';persist();render();notify('Archivio personale pronto.');
   }return;
 }
 if(act==='reset-demo'){
   if(window.confirm('Sostituire i tuoi dati locali con un archivio dimostrativo?')){
     store=makeDemo();ui.dayDate=store.days.at(-1).date;ui.view='home';localStorage.removeItem(KEY);render();notify('Modalità demo attivata.');
   }return;
 }
});
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
render();
