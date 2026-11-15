// Prueba Store con fetch simulado (sin red): node scripts/test-store.js
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const calls=[],mem={};
const ctx={encodeURIComponent,
  localStorage:{getItem:k=>mem[k]||null,setItem:(k,v)=>{mem[k]=v}},
  fetch:async(u,o)=>{calls.push([u,o]);return {ok:true,json:async()=>[{name:'Ana'},{name:'ana'},{name:'Luis'}]}}};
vm.createContext(ctx);
const src=['js/config.js','js/Store.js'].map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n');
const {Store,EVTRON_DB}=vm.runInContext(src+';({Store,EVTRON_DB})',ctx);
(async()=>{
  assert.strictEqual(Store.on,false);
  assert.strictEqual(JSON.stringify(await Store.list('x')),'[]');                // modo local vacío
  EVTRON_DB.url='https://demo.supabase.co/';EVTRON_DB.key='sb_publishable_x';
  assert.strictEqual(Store.on,true);
  assert.strictEqual(JSON.stringify(await Store.list('opportunity')),'["Ana","Luis"]'); // sin duplicados, máx. 10
  assert.ok(calls[0][0].startsWith('https://demo.supabase.co/rest/v1/explorers?'));
  assert.ok(calls[0][0].includes('mission=eq.opportunity')&&calls[0][0].includes('order=created_at.desc'));
  assert.strictEqual(calls[0][1].headers.Authorization,undefined);  // clave nueva: solo apikey
  await Store.add('opportunity','Sofi');
  assert.strictEqual(calls[1][1].method,'POST');
  assert.strictEqual(calls[1][1].body,JSON.stringify({mission:'opportunity',name:'Sofi'}));
  console.log('Store OK');
})().catch(e=>{console.error(e);process.exit(1)});
