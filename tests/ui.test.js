import test from 'node:test';
import assert from 'node:assert/strict';
const handlers={};
const local={};
const app={innerHTML:'',addEventListener:(kind,fn)=>handlers[kind]=fn};
const toast={textContent:'',classList:{add(){},remove(){}}};
globalThis.localStorage={getItem:k=>local[k]??null,setItem:(k,v)=>local[k]=v,removeItem:k=>delete local[k]};
globalThis.document={getElementById:id=>id==='app'?app:toast};
globalThis.window={scrollTo(){},addEventListener(){},confirm(){return true;}};
Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});globalThis.location={protocol:'file:',hostname:''};
await import('../app.js');
function go(id){handlers.click({target:{closest(sel){if(sel==='[data-nav]')return {dataset:{nav:id}};return null;}}});}
test('render della home senza errori',()=>{
 go('home');assert.match(app.innerHTML,/Panoramica personale/);assert.match(app.innerHTML,/Modello peso/);
});
test('render della scheda diario',()=>{
 go('journal');assert.match(app.innerHTML,/day-form/);assert.match(app.innerHTML,/Passi giornalieri/);
});
test('render sport: grafici, filtri e form',()=>{
 go('sports');assert.match(app.innerHTML,/sport-metric/);assert.match(app.innerHTML,/sport-form/);assert.match(app.innerHTML,/Sessioni registrate/);
});
test('render analisi e settings',()=>{
 go('analysis');assert.match(app.innerHTML,/Peso corporeo: reale e previsto/);
 go('settings');assert.match(app.innerHTML,/profile-form/);assert.match(app.innerHTML,/import-file/);
});
