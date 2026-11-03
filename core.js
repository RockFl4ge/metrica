/** Modello numerico di Metrica 1.0. Stime indicative, non misurazioni cliniche. */
export const SPORTS = {
  running:{label:'Corsa',emoji:'🏃',distance:true,pace:true,elevation:true},
  cycling:{label:'Bicicletta',emoji:'🚴',distance:true,pace:false,elevation:true},
  hiking:{label:'Escursionismo',emoji:'🥾',distance:true,pace:true,elevation:true},
  swimming:{label:'Nuoto',emoji:'🏊',distance:true,pace:true,elevation:false},
  skiing:{label:'Sci',emoji:'⛷️',distance:true,pace:false,elevation:true},
  walking:{label:'Camminata',emoji:'🚶',distance:true,pace:true,elevation:true},
  gym:{label:'Palestra',emoji:'🏋️',distance:false,pace:false,elevation:false},
  basketball:{label:'Basket',emoji:'🏀',distance:false,pace:false,elevation:false},
  other:{label:'Altro',emoji:'⚡',distance:false,pace:false,elevation:false},
};
export const DEFAULT_PROFILE={
 age:30,sex:'male',heightCm:175,referenceWeightKg:78,initialWeightKg:78,goalWeightKg:70,
 calorieGoal:2000,macroProtein:120,macroFat:65,macroCarbs:230,
 baseActivityFactor:1.2,baselineSteps:2500,walkingKcalKgKm:0.45,
 modelAnchorDate:'2026-01-01',modelAnchorWeightKg:78,
};
export const dayStamp = d => {
 const a=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),n=String(d.getDate()).padStart(2,'0');
 return `${a}-${m}-${n}`;
};
export const todayISO=()=>dayStamp(new Date());
export const dateObj=iso=>new Date(`${iso}T12:00:00`);
export const dateLabel=(iso,options={day:'numeric',month:'short',year:'numeric'})=>
  iso?new Intl.DateTimeFormat('it-IT',options).format(dateObj(iso)):'—';
export const round=(n,d=0)=>Number.isFinite(n)?Number(n.toFixed(d)):null;
export function makeDemo(){
 const end=dateObj(todayISO()),days=[],sports=[];
 for(let i=17;i>=0;i--){
   const t=new Date(end);t.setDate(t.getDate()-i);const date=dayStamp(t);
   const k=17-i,cal=Math.round(1850+220*Math.sin(k*1.61)+k%5*37);
   days.push({date,calories:cal,protein:116+k%6*5,fat:62+k%4*5,carbs:187+k%5*7,steps:4700+(k*1877)%8400,
     distanceKm:null,weight:k%3===0?round(78.4-k*.105+(k%4-1)*.11,1):null,notes:'',source:'Dati dimostrativi'});
   if([1,4,7,11,14,16].includes(k)){
     const running=k!==11;
     sports.push({id:`demo-${k}`,date,kind:running?'running':'cycling',distanceKm:running?round(4.5+k*.19,2):23.7,
       movingMin:running?Math.round(32+k*.55):84,elapsedMin:running?Math.round(36+k*.6):96,
       elevationM:running?20+k*3:210,calories:null,caloriesType:'active',caloriesSource:'estimated',
       intensity:'moderate',includedInSteps:running,activitySteps:null,location:'Esempio',notes:'Dati inventati a scopo dimostrativo'});
   }
 }
 return {schemaVersion:1,mode:'demo',profile:{...DEFAULT_PROFILE,modelAnchorDate:days[0].date,modelAnchorWeightKg:78.4},days,sports};
}
export const emptyState=()=>({schemaVersion:1,mode:'personal',profile:{...DEFAULT_PROFILE,modelAnchorDate:todayISO(),modelAnchorWeightKg:78},days:[],sports:[]});
export const validNumber=v=>v===null||v===undefined||v===''?null:Number.isFinite(Number(v))?Number(v):null;
export function normalizeState(raw){
 if(!raw||typeof raw!=='object'||!Array.isArray(raw.days)||!Array.isArray(raw.sports))throw Error('File non riconosciuto: mancano days o sports.');
 if(raw.days.length>30000||raw.sports.length>40000)throw Error('Archivio troppo grande per questa versione.');
 const p={...DEFAULT_PROFILE,...(raw.profile||{})};
 for(const k of Object.keys(DEFAULT_PROFILE)) if(typeof DEFAULT_PROFILE[k]==='number') {
   const v=validNumber(p[k]);p[k]=v===null?DEFAULT_PROFILE[k]:v;
 }
 if(p.age<1||p.age>110||p.heightCm<80||p.heightCm>230||p.calorieGoal<1||p.referenceWeightKg<=0)throw Error('Parametri del profilo non validi.');
 const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(dateObj(d).getTime())&&dayStamp(dateObj(d))===d;
 if(!validDate(p.modelAnchorDate))p.modelAnchorDate=todayISO();
 const mapDays=new Map();
 for(const d of raw.days){
   if(!validDate(d.date))continue;
   const row={date:d.date};
   for(const k of ['calories','protein','fat','carbs','fiber','weight','steps','distanceKm','legacyTdee','legacyBalance','legacyPredictedWeight'])row[k]=validNumber(d[k]);
   row.notes=String(d.notes||'').slice(0,1000);row.source=String(d.source||'').slice(0,100);
   mapDays.set(d.date,row);
 }
 const allSports=[];
 for(const a of raw.sports){
   if(!validDate(a.date))continue;
   const kind=SPORTS[a.kind]?a.kind:'other';
   const row={id:String(a.id||`s-${a.date}-${allSports.length}`).slice(0,70),date:a.date,kind,
     label:String(a.label||'').slice(0,70),location:String(a.location||'').slice(0,120),notes:String(a.notes||'').slice(0,1000),
     caloriesType:a.caloriesType==='total'?'total':'active',caloriesSource:String(a.caloriesSource||'manual').slice(0,40),
     intensity:['light','moderate','vigorous'].includes(a.intensity)?a.intensity:'moderate',
     includedInSteps:!!a.includedInSteps,source:String(a.source||'').slice(0,100)};
   for(const k of ['distanceKm','movingMin','elapsedMin','elevationM','calories','activitySteps'])row[k]=validNumber(a[k]);
   if(row.calories!==null&&row.calories<0)row.calories=null;
   allSports.push(row);
 }
 return {schemaVersion:1,mode:'personal',profile:p,days:[...mapDays.values()].sort((a,b)=>a.date.localeCompare(b.date)),sports:allSports};
}
export function bmr(profile,weight){
 return 10*weight+6.25*profile.heightCm-5*profile.age+(profile.sex==='female'?-161:5);
}
export function getWeightOn(date,days,p){
 const candidates=days.filter(d=>d.date<=date&&Number.isFinite(d.weight)).sort((a,b)=>b.date.localeCompare(a.date));
 return candidates.length?candidates[0].weight:p.referenceWeightKg;
}
export function metForSport(s){
 const speed=s.distanceKm>0&&s.movingMin>0?60*s.distanceKm/s.movingMin:null;
 const m={
   running:{light:7,moderate:9.3,vigorous:11.5},
   cycling:{light:4,moderate:6.8,vigorous:9},
   hiking:{light:4.5,moderate:6,vigorous:7.8},
   swimming:{light:4.8,moderate:6,vigorous:8.3},
   skiing:{light:3.5,moderate:5.3,vigorous:7},
   walking:{light:2.8,moderate:3.8,vigorous:5},
   gym:{light:2.8,moderate:3.5,vigorous:6},
   basketball:{light:4.5,moderate:6.5,vigorous:8},
   other:{light:2.5,moderate:4,vigorous:6},
 };
 let val=m[s.kind]?.[s.intensity||'moderate']||4;
 if(speed!==null&&s.kind==='running')val=speed<8?8.3:speed<10?9.3:speed<12?10.5:12;
 if(speed!==null&&s.kind==='cycling')val=speed<15?4:speed<19?6.8:speed<23?8:10;
 return val;
}
export function caloriesForSport(s,weight,profile){
 if(Number.isFinite(s.calories)&&s.calories>=0){
   if(s.caloriesType==='total'&&s.movingMin>0)return Math.max(0,s.calories-bmr(profile,weight)*s.movingMin/1440);
   return s.calories;
 }
 if(!(s.movingMin>0))return 0;
 // Convenzione MET approssimata: il MET di riposo viene già incluso nel TDEE di base.
 return Math.max(0,(metForSport(s)-1)*weight*s.movingMin/60);
}
function includedSportSteps(s,profile){
 if(!s.includedInSteps)return 0;
 if(Number.isFinite(s.activitySteps))return Math.max(0,s.activitySteps);
 if(['running','walking','hiking'].includes(s.kind)&&s.distanceKm>0){
   const strideM=profile.heightCm*(s.kind==='running'?0.0055:0.00415);
   return s.distanceKm*1000/strideM;
 }
 return 0;
}
export function dailyReport(date,days,sports,profile){
 const d=days.find(x=>x.date===date)||{date};
 const weight=getWeightOn(date,days,profile);
 const act=sports.filter(x=>x.date===date);
 const resting=bmr(profile,weight);
 const historic=Number.isFinite(d.legacyTdee)&&d.steps===null&&d.distanceKm===null;
 let base=historic?d.legacyTdee:resting*profile.baseActivityFactor;
 let stepsEnergy=0,adjustedSteps=null,nonSportDistanceKm=null;
 const strideM=profile.heightCm*0.00415;
 const excluded=act.reduce((v,s)=>v+includedSportSteps(s,profile),0);
 if(!historic&&(Number.isFinite(d.steps)||Number.isFinite(d.distanceKm))){
   const useMeasuredDistance=Number.isFinite(d.distanceKm);
   const grossDistance=useMeasuredDistance?d.distanceKm:(d.steps*strideM/1000);
   // Se il telefono dà km reali, sottraiamo i km dell'attività; se dà passi, sottraiamo i passi.
   const sportDist=useMeasuredDistance
     ?act.filter(s=>s.includedInSteps).reduce((sum,s)=>sum+(Number.isFinite(s.distanceKm)?s.distanceKm:includedSportSteps(s,profile)*strideM/1000),0)
     :excluded*strideM/1000;
   nonSportDistanceKm=Math.max(0,grossDistance-sportDist);
   adjustedSteps=nonSportDistanceKm*1000/strideM;
   const baseDistance=profile.baselineSteps*strideM/1000;
   stepsEnergy=(nonSportDistanceKm-baseDistance)*weight*profile.walkingKcalKgKm;
 }
 const sportEnergy=act.reduce((v,s)=>v+caloriesForSport(s,weight,profile),0);
 const tdee=base+stepsEnergy+sportEnergy;
 const kcal=Number.isFinite(d.calories)?d.calories:null;
 return {date,day:d,weight,bmr:resting,base,stepsEnergy,nonSportDistanceKm,adjustedSteps,
   sportEnergy,tdee,balance:kcal===null?null:kcal-tdee,kcal,sports:act,legacy:historic};
}
export function calculateModel(state){
 const {days,sports,profile}=state;
 let estimated=profile.modelAnchorWeightKg;
 const result=[];
 const valid=days.filter(d=>d.date>profile.modelAnchorDate&&d.calories!==null&&d.calories!==undefined).sort((a,b)=>a.date.localeCompare(b.date));
 for(const d of valid){
   const r=dailyReport(d.date,days,sports,profile);
   if(r.balance!==null){estimated+=r.balance/7700;result.push({...r,estimatedWeight:estimated});}
 }
 return result;
}
export function bmi(weight,heightCm){return weight/((heightCm/100)**2);}
export function sportMetric(s,key){
 if(key==='distance')return s.distanceKm;
 if(key==='duration')return s.movingMin;
 if(key==='elevation')return s.elevationM;
 if(key==='calories')return s.calories;
 if(s.distanceKm>0&&s.movingMin>0){
   if(key==='speed')return 60*s.distanceKm/s.movingMin;
   if(key==='pace')return (s.kind==='swimming'?6:60)*s.movingMin/s.distanceKm; // s/100 m per nuoto; s/km per le altre discipline
 }
 return null;
}
export const sportMetricDefs={
  distance:{label:'Distanza',unit:'km'},speed:{label:'Velocità media',unit:'km/h'},
  pace:{label:'Passo medio',unit:'min/km'},duration:{label:'Tempo in movimento',unit:'min'},
  elevation:{label:'Dislivello positivo',unit:'m'},calories:{label:'Calorie',unit:'kcal'},
};
export function sportMetricsFor(kind){
 if(kind==='gym'||kind==='basketball'||kind==='other')return ['duration','calories'];
 if(kind==='swimming')return ['distance','pace','duration','calories'];
 if(kind==='skiing')return ['distance','speed','duration','elevation','calories'];
 if(kind==='cycling')return ['distance','speed','duration','elevation','calories'];
 return ['distance','pace','speed','duration','elevation','calories'];
}
export function humorousMessage(balance,date){
 if(balance===null)return {title:'Il foglio è in attesa',subtitle:'I numeri non si indovinano. Registra la giornata per sbloccare il verdetto.'};
 const list=balance<-450?[
  ['Il frigorifero ti cerca','Ti ha lasciato tre vocali, non rispondere.'],
  ['Modalità batteria efficiente','Oggi il budget calorico ha fatto economia.'],
  ['Missione sotto controllo','Il grafico ha messo gli occhiali da sole.']]:balance<200?[
  ['Precisino cosmico','Il bilancio ha quasi preso la laurea in equilibrio.'],
  ['Il criceto approva','Una giornata quasi senza drammi matematici.'],
  ['Pilota automatico','La navicella calorica resta in orbita.']]:balance<700?[
  ['Il biscotto ha vinto un round','Ma la partita è molto più lunga di oggi.'],
  ['Piccola festa del saldo','Il contatore ha chiesto il bis.'],
  ['Tensione al reparto snack','Nessuna emergenza: sono soltanto numeri.']]:[
  ['Il frigorifero è diventato sindaco','Ha promesso più aperture straordinarie.'],
  ['Hai sbloccato il DLC del buffet','Disponibile la modalità boss finale.'],
  ['Il contatore è andato in ferie','Tornerà domani con una calcolatrice nuova.']];
 const hash=[...date].reduce((a,c)=>a+c.charCodeAt(0),0);
 const item=list[hash%list.length];return {title:item[0],subtitle:item[1]};
}
