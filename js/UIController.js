/* UIController.js */
'use strict';
const INTRO={en:`Hey there, {name}! I’m EVI, your guide through space. Quick question: what do you think happens to a spacecraft when its mission is over? Does it just vanish? Nope! Many of them are still out there, quietly resting on the Moon, on Mars, or circling above our heads. Think of them as old explorers who finished their adventure and stayed behind to watch the sky. Each one has a story. Some were built to work for three months and kept going for fifteen years. Some made huge discoveries. And some just did their very best until the lights went out. On this journey, we’ll visit them one by one. I’ll tell you who they were, what they found, and where they rest today. Listen to a whole story, and your name joins the Explorers list for that mission. Maybe you’ll even grab the gold! Ready to blast off? Pick a stop, or ask me for the full tour. Let’s go!`,
es:`¡Hola, {name}! Soy EVI y hoy vas a ser mi copiloto. ¿Sabías que en la Luna hay un coche abandonado? Y no es el único: hay robots, satélites y sondas que cumplieron su misión y se quedaron donde están, como monumentos del espacio. Algunos aterrizaron en Marte hace casi cincuenta años y siguen ahí, quietos. Otros dieron tantas vueltas que ya perdimos la cuenta. Lo más increíble es que casi todos duraron mucho más de lo que sus creadores esperaban. Cada uno guarda una historia de valentía, de ciencia y de mucha curiosidad. En este recorrido los vamos a visitar uno por uno. Te contaré quiénes fueron, qué descubrieron y dónde descansan ahora. Y atento: si escuchas la historia completa, tu nombre quedará en la lista de Exploradores de esa misión. ¡Quizá llegues al primer lugar! ¿Listo para despegar? Elige una parada o pídeme el recorrido completo. ¡Vamos!`};
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
  name:'',cur:null,
  mode:'play',timeScale:1,tour:-1,tourTimer:null,voice:false,voices:[],u:null,onEnd:null,
  setupControls(){
    $('#bPause').onclick=()=>{this.closeDialog(true);this.setMode(this.mode==='pause'?'play':'pause')};
    $('#bSlow').onclick=()=>this.setMode(this.mode==='slow'?'play':'slow');
    document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{this.closeDialog(true,true);SpaceScene.focus(b.dataset.f)});
    document.querySelectorAll('#lang button').forEach(b=>b.onclick=()=>{LANG=b.dataset.l;this.applyLang()});
    $('#catBtn').onclick=()=>{const h=$('#cat').hidden=!$('#cat').hidden;$('#catBtn').setAttribute('aria-expanded',String(!h))};
    $('#dX').onclick=()=>this.closeDialog(true);
    $('#dVoice').onclick=()=>{
      this.voice=!this.voice;$('#dVoice').setAttribute('aria-pressed',String(this.voice));
      if(!this.voice)this.cancelSpeech();else EviAssistant.speakNow();
    };
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
    $('#dX').setAttribute('aria-label',LANG==='es'?'Cerrar':'Close');$('#nm').placeholder=t('wp');if(!$('#board').hidden)Board.render(false);if(this.cur==='intro'&&!$('#dlg').hidden)this.intro();
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
    $('#spd').textContent='×'+this.timeScale.toFixed(2);return dt*this.timeScale;
  },
  story(it){const r=it[LANG];return [r.rec,r.sci,r.po].join('\u0001')},
  select(it){this.stopTour();EviAssistant.goTo(it)},
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
    const p=s.split('\u0001');
    $('#l1').textContent=p[0]||'';$('#l2').textContent=p[1]||'';$('#l3').textContent=p[2]||'';$('#l3w').hidden=p.length<3;
  },
  start(){
    this.name=$('#nm').value.trim().slice(0,16)||t('anon');
    try{localStorage.setItem('evtron.name',this.name)}catch(e){}
    $('#welcome').hidden=true;this.intro();
  },
  intro(){
    this.cur='intro';$('#dlg').hidden=false;$('#board').hidden=true;$('#src').hidden=true;
    $('#dMeta').textContent=t('intro')+' · EVI';
    ['l1','l2','l3'].forEach(i=>{$('#'+i).textContent='';$('#'+i).dataset.t=''});$('#l3w').hidden=true;
    const x=INTRO[LANG].replace('{name}',this.name);$('#sr').textContent=x;EviAssistant.say(x,()=>{});
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
    $('#dlg').hidden=true;$('#board').hidden=true;this.cur=null;EviAssistant.talking=false;this.setTalking(false);this.stopTour();this.cancelSpeech();
    if(goHome&&EviAssistant.state!=='idle'){EviAssistant.returnHome();if(!keepCam)SpaceScene.focus('all')}
  },
  startTour(){this.tour=0;this.runTour()},
  runTour(){const it=HardwareData[this.tour];if(it)EviAssistant.goTo(it);else{this.tour=-1;this.closeDialog(true)}},
  afterStory(){
    if(this.tour<0)return;
    const go=()=>{this.tourTimer=setTimeout(()=>{this.tour++;this.runTour()},2500)};
    if(this.voice&&this.u)this.onEnd=go;else go();
  },
  stopTour(){this.tour=-1;clearTimeout(this.tourTimer)}
};
// goTo llama stopTour vía select; el tour usa EviAssistant.goTo directamente
