import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_PROFILE} from '../core.js';
const handlers={}, saved={}, calls=[];
const key='metrica_v1_personal_archive';
let confirm=true, imported=null, exported=true, failSave=false;
const app={innerHTML:'',addEventListener:(event,fn)=>handlers[event]=fn};
const toast={textContent:'',classList:{add(){},remove(){}}};
globalThis.document={getElementById:id=>id==='app'?app:toast};
globalThis.localStorage={
 getItem:k=>saved[k]??null,
 setItem(k,v){if(failSave)throw Error('quota');saved[k]=v;},
 removeItem:k=>delete saved[k],
};
globalThis.window={scrollTo(){},addEventListener(){},__TAURI__:{core:{async invoke(cmd,args){
 calls.push([cmd,args]);
 if(cmd==='confirm_action')return confirm;
 if(cmd==='import_archive')return imported;
 if(cmd==='export_archive')return exported;
 throw Error('Comando inatteso');
}}}};
Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});
globalThis.location={protocol:'tauri:',hostname:'localhost'};
globalThis.setTimeout=()=>0;
await import('../app.js');
const click=async (selector,dataset={})=>handlers.click({target:{closest:s=>s===selector?{dataset}:null}});
const nav=id=>click('[data-nav]',{nav:id});
const fixture=()=>JSON.stringify({schemaVersion:1,profile:{...DEFAULT_PROFILE},days:[{date:'2026-01-05',calories:2200,weight:78}],sports:[]});

test('desktop: archivio iniziale vuoto, non demo',async()=>{
 assert.doesNotMatch(app.innerHTML,/Modalità dimostrativa/);
 await nav('settings');assert.match(app.innerHTML,/Giornate<\/span><b>0/);
});
test('importazione annullata: nessun dato scritto',async()=>{
 imported=fixture();confirm=false;
 await click('#import-trigger');
 assert.equal(saved[key],undefined);
});
test('JSON malformato: archivio invariato e messaggio errore',async()=>{
 imported='{non-json';confirm=true;
 await click('#import-trigger');assert.equal(saved[key],undefined);
 assert.match(toast.textContent,/Importazione non riuscita/);
});
test('importazione confermata: persiste solo dati normalizzati',async()=>{
 imported=fixture();await click('#import-trigger');
 const state=JSON.parse(saved[key]);assert.equal(state.days.length,1);
 assert.equal(state.days[0].calories,2200);
 assert.match(toast.textContent,/Storico importato correttamente/);
});
test('annullamento del selettore mantiene archivio',async()=>{
 const before=saved[key];imported=null;
 await click('#import-trigger');assert.equal(saved[key],before);
});
test('errore di memoria: importazione non dichiarata riuscita',async()=>{
 const before=saved[key];imported=JSON.stringify({...JSON.parse(fixture()),days:[]});
 failSave=true;await click('#import-trigger');failSave=false;
 assert.equal(saved[key],before);assert.match(toast.textContent,/Memoria/);
});
test('esportazione desktop: contenuto JSON effettivo e annullamento',async()=>{
 exported=false;toast.textContent='';
 await click('[data-action]',{action:'export-json'});
 // La chiamata al gestore avvia downloadJson; attendi il completamento della Promise.
 await new Promise(resolve=>queueMicrotask(resolve));
 let call=calls.filter(([cmd])=>cmd==='export_archive').at(-1);
 assert.equal(JSON.parse(call[1].contents).days.length,1);
 assert.match(call[1].filename,/^metrica-backup-.*\.json$/);
 assert.equal(toast.textContent,'');
 exported=true;await click('[data-action]',{action:'export-json'});
 await new Promise(resolve=>queueMicrotask(resolve));
 assert.match(toast.textContent,/Backup esportato/);
});
test('conferme distruttive native: annullare preserva archivio',async()=>{
 const before=saved[key];confirm=false;
 await click('[data-action]',{action:'reset-empty'});
 assert.equal(saved[key],before);
});
