import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_PROFILE,bmr,caloriesForSport,dailyReport,calculateModel,normalizeState,sportMetric,makeDemo} from '../core.js';
const profile={...DEFAULT_PROFILE};
test('Mifflin–St Jeor: parametri sintetici',()=>{
 assert.equal(bmr({...profile,age:30,heightCm:175},78),1728.75);
});
test('ricostruzione del bilancio e del peso teorico',()=>{
 const d={date:'2026-01-05',calories:2200,weight:78,steps:null,distanceKm:null,legacyTdee:2400};
 const r=dailyReport(d.date,[d],[],profile);assert.equal(r.balance,-200);
 const state={profile:{...profile,modelAnchorDate:'2026-01-04',modelAnchorWeightKg:78},days:[d],sports:[]};
 assert.ok(Math.abs(calculateModel(state)[0].estimatedWeight-(78-200/7700))<.00001);
});
test('sport sottratto dal bilancio solo nella data corrispondente',()=>{
 const d={date:'2026-01-05',calories:2200,weight:78,legacyTdee:2400,steps:null,distanceKm:null};
 const s={date:d.date,kind:'running',movingMin:57,calories:400,caloriesType:'active'};
 assert.equal(dailyReport(d.date,[d],[s],profile).balance,-600);
});
test('non duplicare passi già contabilizzati in corsa',()=>{
 const d={date:'2026-01-05',calories:2000,weight:78,steps:10000,distanceKm:null};
 const s={date:d.date,kind:'running',movingMin:30,distanceKm:5,calories:400,caloriesType:'active',includedInSteps:true};
 const a=dailyReport(d.date,[d],[s],profile),b=dailyReport(d.date,[d],[{...s,includedInSteps:false}],profile);
 assert.ok(a.stepsEnergy<b.stepsEnergy);assert.equal(a.sportEnergy,400);
});
test('calorie totali decurtate della quota basale',()=>{
 assert.ok(caloriesForSport({kind:'gym',calories:400,caloriesType:'total',movingMin:60},78,profile)<400);
});
test('giorno vuoto non produce deficit fittizio',()=>{
 assert.equal(dailyReport('2026-01-05',[],[],profile).balance,null);
});
test('passo medio in secondi/km',()=>{
 assert.equal(sportMetric({distanceKm:5,movingMin:30},'pace'),360);
});
test('dataset dimostrativo e normalizzazione',()=>{
 const x=normalizeState(makeDemo());assert.equal(x.days.length,18);assert.ok(x.sports.length>0);
});

test('distanza sportiva sottratta dai km del telefono senza conversione in passi',()=>{
 const d={date:'2026-01-05',calories:2000,weight:78,steps:10000,distanceKm:8};
 const s={date:d.date,kind:'running',distanceKm:5,movingMin:30,calories:400,caloriesType:'active',includedInSteps:true};
 const r=dailyReport(d.date,[d],[s],profile);
 assert.equal(r.nonSportDistanceKm,3);
});


test('nuoto: passo espresso in secondi per 100 m',()=>{
 assert.equal(sportMetric({kind:'swimming',distanceKm:1,movingMin:20},'pace'),120);
});
test('data impossibile rifiutata in importazione',()=>{
 const invalid=makeDemo();invalid.days=[{date:'2026-02-31',calories:2000}];
 assert.equal(normalizeState(invalid).days.length,0);
});
