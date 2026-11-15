/* Store.js · Persistencia de la lista de exploradores.
   Con js/config.js completo usa Supabase por REST (fetch, sin SDK); si no, solo localStorage. */
'use strict';
const Store={
  get on(){return !!(EVTRON_DB.url&&EVTRON_DB.key)},
  base(){return EVTRON_DB.url.replace(/\/$/,'')+'/rest/v1/explorers'},
  headers(){
    const h={apikey:EVTRON_DB.key,'Content-Type':'application/json'};
    if(EVTRON_DB.key.startsWith('eyJ'))h.Authorization='Bearer '+EVTRON_DB.key; // solo claves JWT (anon clásica)
    return h;
  },
  local(){try{return JSON.parse(localStorage.getItem('evtron.board')||'{}')}catch(e){return {}}},
  saveLocal(d){try{localStorage.setItem('evtron.board',JSON.stringify(d))}catch(e){}},
  uniq(a){const s=new Set();return a.filter(n=>{const k=n.toLowerCase();if(s.has(k))return false;s.add(k);return true})},
  async list(id){ // los 10 más recientes (sin repetir nombres), el primero es el más nuevo
    if(!this.on)return this.local()[id]||[];
    const q='?select=name&hidden=eq.false&order=created_at.desc&limit=40&mission=eq.'+encodeURIComponent(id);
    const r=await fetch(this.base()+q,{headers:this.headers()});
    if(!r.ok)throw new Error('db '+r.status);
    return this.uniq((await r.json()).map(x=>x.name)).slice(0,10);
  },
  async add(id,name){
    if(!this.on)return;
    const r=await fetch(this.base(),{method:'POST',headers:{...this.headers(),Prefer:'return=minimal'},body:JSON.stringify({mission:id,name})});
    if(!r.ok)throw new Error('db '+r.status);
  }
};
