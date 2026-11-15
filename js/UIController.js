/* UIController.js */
'use strict';
const GREET={en:`Hello! I am EVI-E, a little robotic explorer designed for a very special mission: traveling through the archives of deep space. Many satellites, rovers, and probes that paved the way to the stars now rest in silence. My job is not just to study cold data, but to rescue their stories, their triumphs, and their last echoes so they are never forgotten. Are you ready to excavate the past and discover the magic of timeless technology?`,
es:`¡Hola! Soy EVI-E, un pequeño explorador robótico diseñado para una misión muy especial: viajar por los archivos del espacio profundo. Muchos satélites, rovers y sondas que abrieron el camino hacia las estrellas descansan hoy en silencio. Mi trabajo no es solo estudiar datos fríos, sino rescatar sus historias, sus triunfos y sus últimos ecos para que nunca sean olvidados. ¿Estás listo para excavar el pasado y descubrir la magia de la tecnología atemporal?`};
const MINI=[{f:'earth',k:'m_earth'},{f:'mars',k:'m_mars'},{f:'moon',k:'m_moon'}]; // Tierra → Marte → Luna
const Board={d:{},id:null,
  init(){this.d=Store.local()},
  show(id){this.id=id;$('#board').hidden=false;this.render(false);this.sync(id)},
  sync(id){ // trae la lista compartida y la muestra si sigue abierta
    if(!Store.on)return;
    Store.list(id).then(l=>{this.d[id]=l;Store.saveLocal(this.d);if(this.id===id&&!$('#board').hidden)this.render(false)}).catch(()=>{});
  },
  add(id,name){ // optimista: se ve al instante y luego se guarda en la base
    const l=(this.d[id]||[]).filter(n=>n.toLowerCase()!==name.toLowerCase());l.unshift(name);
    const fallen=l.length>10?l.pop():null;this.d[id]=l;Store.saveLocal(this.d);
    this.id=id;$('#board').hidden=false;this.render(true,fallen);
    Store.add(id,name).then(()=>this.sync(id)).catch(()=>{});
  },
  render(fresh,fallen){
    const ol=$('#bList'),l=this.d[this.id]||[],mk=(c,x)=>{const li=document.createElement('li');li.className=c;li.textContent=x;ol.appendChild(li);return li};
    $('#bTitle').textContent='🏆 '+t('board')+' · '+byId(this.id)[LANG].n.split(' (')[0];ol.textContent='';
    if(!l.length)mk('r4',t('first'));
    l.forEach((n,i)=>mk('r'+Math.min(i+1,4)+(fresh&&!i?' in':''),(['🥇','🥈','🥉'][i]||(i+1)+'.')+' '+n));
    if(fallen){const li=mk('r4 fall','11. '+fallen);setTimeout(()=>li.remove(),950)}
  }
};
const UI={
  name:'',cur:null,sink:null,greetOn:false,miniIdx:-1,musicOn:true,vol:0,
  mode:'play',timeScale:1,tour:-1,tourTimer:null,voice:false,voices:[],u:null,onEnd:null,
  setupControls(){
    $('#bPause').onclick=()=>{this.closeDialog(true);this.setMode(this.mode==='pause'?'play':'pause')};
    $('#bSlow').onclick=()=>this.setMode(this.mode==='slow'?'play':'slow');
    document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{this.closeDialog(true,true);SpaceScene.focus(b.dataset.f)});
    document.querySelectorAll('#lang button').forEach(b=>b.onclick=()=>{LANG=b.dataset.l;this.applyLang()});
    $('#catBtn').onclick=()=>{const h=$('#cat').hidden=!$('#cat').hidden;$('#catBtn').setAttribute('aria-expanded',String(!h))};
    $('#dX').onclick=()=>{const m=this.miniIdx>=0;this.closeDialog(true);if(m)this.choice()};
    $('#dVoice').onclick=$('#gVoice').onclick=()=>{
      this.voice=!this.voice;['#dVoice','#gVoice'].forEach(q=>$(q).setAttribute('aria-pressed',String(this.voice)));
      if(!this.voice)this.cancelSpeech();else EviAssistant.speakNow();
    };
    $('#gNext').onclick=()=>this.endGreet();$('#bMusic').onclick=()=>this.music();
    $('#chTour').onclick=()=>this.startTour();$('#chFree').onclick=()=>this.free();
    $('#tour').onchange=e=>{const v=e.target.value;e.target.value='';
      if(v==='all')this.startTour();else if(v==='stop'){this.closeDialog(true)}else if(v)this.select(byId(v))};
    addEventListener('keydown',e=>{if(e.key==='Escape')this.closeDialog(true)});
    if(window.speechSynthesis){const L=()=>this.voices=speechSynthesis.getVoices();L();speechSynthesis.onvoiceschanged=L}
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)this.mode='slow';
    document.querySelectorAll('#welcome [data-l]').forEach(b=>b.onclick=()=>{LANG=b.dataset.l;this.applyLang()});
    $('#go').onclick=()=>this.start();$('#nm').addEventListener('keydown',e=>{if(e.key==='Enter')this.start()});
    try{$('#nm').value=localStorage.getItem('evtron.name')||''}catch(e){}
    this.applyLang();
  },
  handleInteractions(){
    const cv=SpaceScene.renderer.domElement;let down=null;
    cv.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
    cv.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const it=SpaceScene.pick(e);if(it)this.select(it)}down=null});
    cv.addEventListener('pointermove',e=>{if(!e.buttons)cv.style.cursor=SpaceScene.pick(e)?'pointer':'grab'});
  },
  applyLang(){
    document.documentElement.lang=LANG;
    document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
    document.querySelectorAll('[data-l]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
    $('#dX').setAttribute('aria-label',LANG==='es'?'Cerrar':'Close');$('#nm').placeholder=t('wp');if(!$('#board').hidden)Board.render(false);$('#eviImg').alt=LANG==='es'?'EVI-E, un robot sonriente que saluda':'EVI-E, a smiling robot waving';if(this.greetOn)this.greet();else if(this.cur==='mini'&&this.miniIdx>=0&&!$('#dlg').hidden)this.mini(this.miniIdx);
    this.setMode(this.mode);this.updateUI();EviAssistant.renderHud();
    const E=EviAssistant;if(E.state==='speak'&&E.target){this.openDialog(E.target);E.say(this.story(E.target),()=>this.afterStory())}
  },
  updateUI(){
    const cat=$('#cat'),tr=$('#tour');cat.textContent='';tr.textContent='';
    [['',t('tour')],['all',t('full').replace('{n}',HardwareData.length)],...HardwareData.map(i=>[i.id,t('go')+i[LANG].n]),['stop',t('stop')]]
      .forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;tr.appendChild(o)});
    ['orbit','moon','mars','deep'].forEach(z=>{
      const h=document.createElement('h2');h.textContent=t('z_'+z);cat.appendChild(h);
      HardwareData.filter(i=>i.z===z).forEach(it=>{
        const b=document.createElement('button'),d=document.createElement('span');
        d.className='dot '+it.s;d.setAttribute('aria-hidden','true');b.append(d,it[LANG].n);b.onclick=()=>this.select(it);cat.appendChild(b);
      });
    });
    cat.setAttribute('aria-label',t('cat'));
  },
  setMode(m){
    this.mode=m;$('#bPause').setAttribute('aria-pressed',String(m==='pause'));$('#bSlow').setAttribute('aria-pressed',String(m==='slow'));
    $('#bPause').textContent=m==='pause'?t('resume'):t('pause');
  },
  tick(dt){
    let k=this.mode==='pause'?0:this.mode==='slow'?.15:1;
    if(EviAssistant.state==='fly'||EviAssistant.state==='speak')k*=.2;
    this.timeScale+=(k-this.timeScale)*Math.min(1,dt*3);
    $('#spd').textContent='×'+this.timeScale.toFixed(2);
    // música de fondo: se silencia mientras EVI-E narra con la opción de audio activa
    const b=this.bgm||(this.bgm=$('#bgm')),talk=this.voice&&(EviAssistant.talking||(window.speechSynthesis&&speechSynthesis.speaking));
    this.vol+=((this.musicOn&&!talk?.22:0)-this.vol)*Math.min(1,dt*4);b.volume=Math.max(0,Math.min(1,this.vol));b.muted=this.vol<.01;
    return dt*this.timeScale;
  },
  story(it){const r=it[LANG];return [r.rec,r.sci,r.po].join('\u0001')},
  select(it){this.stopTour();this.miniIdx=-1;$('#choice').hidden=true;EviAssistant.goTo(it)},
  openDialog(it){
    const r=it[LANG];this.cur=it;$('#dlg').hidden=false;$('#src').hidden=false;
    $('#dMeta').textContent=`${r.n} · ${r.loc} · ${r.st}`;
    $('#l1').dataset.t=t('L1');$('#l2').dataset.t=t('L2');$('#l3').dataset.t=t('L3');$('#src').dataset.t=t('src');
    $('#l3d').textContent=r.dis||t('dis');
    const a=$('#aN'),s=$('#aS');
    a.href=it.nssdc?'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id='+it.nssdc:'https://nssdc.gsfc.nasa.gov/';
    a.textContent='NSSDCA ↗';
    s.hidden=!it.u;s.href=it.u?SCI+it.u:'#';s.textContent='NASA Science ↗';
    $('#l1').textContent=$('#l2').textContent=$('#l3').textContent='';$('#l3w').hidden=true;
    Board.show(it.id);
    $('#sr').textContent=this.story(it).replace(/\u0001/g,'. ');
  },
  setText(s){
    if(this.sink)return this.sink(s);
    const p=s.split('\u0001');
    $('#l1').textContent=p[0]||'';$('#l2').textContent=p[1]||'';$('#l3').textContent=p[2]||'';$('#l3w').hidden=p.length<3;
  },
  start(){
    this.name=$('#nm').value.trim().slice(0,16)||t('anon');
    try{localStorage.setItem('evtron.name',this.name)}catch(e){}
    $('#nameBox').hidden=true;$('#greet').hidden=false;
    this.music(true);                       // gesto del usuario: ya se puede reproducir la música
    this.greetOn=true;this.sink=s=>{$('#gTxt').textContent=s};this.greet();
    $('#gNext').focus();
  },
  greet(){const x=GREET[LANG];$('#gSr').textContent=x;$('#gTxt').textContent='';EviAssistant.say(x,()=>{})},
  endGreet(){
    this.greetOn=false;this.sink=null;this.cancelSpeech();EviAssistant.talking=false;this.setTalking(false);
    $('#welcome').hidden=true;this.miniIdx=0;this.mini(0);
  },
  mini(i){ // mini recorrido: Tierra → Marte → Luna
    this.miniIdx=i;this.cur='mini';const m=MINI[i];SpaceScene.focus(m.f);
    $('#dlg').hidden=false;$('#board').hidden=true;$('#src').hidden=true;
    $('#dMeta').textContent=t('m_title')+' · '+t(m.f)+' ('+(i+1)+'/'+MINI.length+')';
    ['l1','l2','l3'].forEach(q=>{$('#'+q).textContent='';$('#'+q).dataset.t=''});$('#l3w').hidden=true;
    const x=t(m.k);$('#sr').textContent=x;EviAssistant.say(x,()=>this.afterMini());
  },
  afterMini(){
    const go=()=>{this.tourTimer=setTimeout(()=>{if(this.miniIdx<0)return;if(this.miniIdx<MINI.length-1)this.mini(this.miniIdx+1);else this.choice()},2500)};
    if(this.voice&&this.u)this.onEnd=go;else go();
  },
  choice(){ // tour completo guiado o explorar por cuenta propia
    this.miniIdx=-1;this.cur=null;$('#dlg').hidden=true;SpaceScene.focus('all');$('#choice').hidden=false;$('#chTour').focus();
  },
  free(){
    $('#choice').hidden=true;SpaceScene.focus('all');$('#cat').hidden=false;$('#catBtn').setAttribute('aria-expanded','true');
  },
  music(on){
    this.musicOn=on===undefined?!this.musicOn:on;$('#bMusic').setAttribute('aria-pressed',String(this.musicOn));
    const b=$('#bgm');if(this.musicOn){b.volume=0;this.vol=0;b.play().catch(()=>{})}else b.pause();
  },
  finish(it){Board.add(it.id,this.name||t('anon'));SpaceScene.label(it,this.name||t('anon'))},
  setTalking(b){$('#bars').classList.toggle('talk',b)},
  pick(){ // dos voces distintas: una por idioma, preferiendo voces naturales y cálidas
    const re=LANG==='es'?/^es/i:/^en/i,vs=this.voices.filter(v=>re.test(v.lang));
    const pref=/natural|neural|online|google|samantha|karen|ava|allison|paulina|monica|sabina|helena|lucia|female|zira|susan/i;
    return vs.find(v=>pref.test(v.name))||vs[0]||null;
  },
  speak(text){
    if(!this.voice||!window.speechSynthesis)return;
    this.cancelSpeech();
    const v=this.pick(),parts=text.match(/[^.!?]+[.!?]*\s*/g)||[text];
    parts.forEach((q,i)=>{
      const u=new SpeechSynthesisUtterance(q);if(v)u.voice=v;u.lang=v?v.lang:(LANG==='es'?'es-ES':'en-US');
      u.rate=LANG==='es'?.9:.98;u.pitch=LANG==='es'?1.1:1.2;
      if(i===parts.length-1){u.onend=()=>{if(this.u===u&&this.onEnd){const f=this.onEnd;this.onEnd=null;f()}};this.u=u}
      speechSynthesis.speak(u);
    });
  },
  cancelSpeech(){if(this.u)this.u.onend=null;this.u=null;this.onEnd=null;window.speechSynthesis&&speechSynthesis.cancel()},
  closeDialog(goHome,keepCam){
    $('#dlg').hidden=true;$('#choice').hidden=true;$('#board').hidden=true;this.cur=null;this.miniIdx=-1;EviAssistant.talking=false;this.setTalking(false);this.stopTour();this.cancelSpeech();
    if(goHome&&EviAssistant.state!=='idle'){EviAssistant.returnHome();if(!keepCam)SpaceScene.focus('all')}
  },
  startTour(){this.miniIdx=-1;$('#choice').hidden=true;this.tour=0;this.runTour()},
  runTour(){const it=HardwareData[this.tour];if(it)EviAssistant.goTo(it);else{this.tour=-1;this.closeDialog(true)}},
  afterStory(){
    if(this.tour<0)return;
    const go=()=>{this.tourTimer=setTimeout(()=>{this.tour++;this.runTour()},2500)};
    if(this.voice&&this.u)this.onEnd=go;else go();
  },
  stopTour(){this.tour=-1;clearTimeout(this.tourTimer)}
};
// goTo llama stopTour vía select; el tour usa EviAssistant.goTo directamente
