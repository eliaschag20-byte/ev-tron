/* UIController.js */
const UI={
  mode:'play',timeScale:1,tour:-1,tourTimer:null,voice:false,
  setupControls(){
    $('#bPause').onclick=()=>{this.closeDialog(true);this.setMode(this.mode==='pause'?'play':'pause')};
    $('#bSlow').onclick=()=>this.setMode(this.mode==='slow'?'play':'slow');
    document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{this.closeDialog(true,true);SpaceScene.focus(b.dataset.f)});
    const tg=(a,b)=>{const h=$(a).hidden=!$(a).hidden;$(b).setAttribute('aria-expanded',String(!h));return h};
    $('#catBtn').onclick=()=>{if(!tg('#cat','#catBtn')){$('#res').hidden=true;$('#resBtn').setAttribute('aria-expanded','false')}};
    $('#resBtn').onclick=()=>{if(!tg('#res','#resBtn')){$('#cat').hidden=true;$('#catBtn').setAttribute('aria-expanded','false')}};
    $('#dX').onclick=()=>this.closeDialog(true);
    $('#dVoice').onclick=()=>{this.voice=!this.voice;$('#dVoice').setAttribute('aria-pressed',String(this.voice));if(!this.voice)speechSynthesis.cancel()};
    $('#tour').onchange=e=>{const v=e.target.value;e.target.value='';
      if(v==='all')this.startTour();else if(v.startsWith('z:'))this.startTour(v.slice(2));else if(v==='stop'){this.stopTour();this.closeDialog(true)}else if(v)this.select(byId(v))};
    addEventListener('keydown',e=>{if(e.key==='Escape')this.closeDialog(true)});
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)this.setMode('slow');
  },
  handleInteractions(){
    const cv=SpaceScene.renderer.domElement;let down=null;
    cv.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
    cv.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const it=SpaceScene.pick(e);if(it)this.select(it)}down=null});
    cv.addEventListener('pointermove',e=>{if(!e.buttons)cv.style.cursor=SpaceScene.pick(e)?'pointer':'grab'});
  },
  updateUI(){
    this.buildResources();const cat=$('#cat'),tr=$('#tour');cat.textContent='';tr.textContent='';
    const a=document.createElement('a');a.href=NSSDCA;a.target='_blank';a.rel='noopener';a.textContent='📚 NSSDCA: catálogo de naves de la NASA ↗';a.style.cssText='display:block;color:var(--acc);margin-bottom:6px;font-size:13px';cat.appendChild(a);
    [['','Tour guiado por EVI…'],['all','▶ Tour completo ('+HardwareData.length+' paradas)'],['z:moon','▶ Tour: Luna'],['z:mars','▶ Tour: Marte'],['z:deep','▶ Tour: Espacio profundo'],...HardwareData.map(i=>[i.id,'Ir a: '+i.n]),['stop','■ Detener tour']]
      .forEach(([v,l])=>{const o=document.createElement('option');o.value=v;o.textContent=l;tr.appendChild(o)});
    Object.keys(ZONE).forEach(z=>{
      const h=document.createElement('h2');h.textContent=ZONE[z].lbl;cat.appendChild(h);
      HardwareData.filter(i=>i.z===z).forEach(it=>{
        const b=document.createElement('button'),d=document.createElement('span');
        d.className='dot '+it.s;d.setAttribute('aria-hidden','true');b.append(d,it.n);b.onclick=()=>this.select(it);cat.appendChild(b);
      });
    });
  },
  buildResources(){
    const box=$('#res');box.textContent='';
    const h=document.createElement('h2');h.textContent='Recursos de la NASA';box.appendChild(h);
    RES.groups.forEach(g=>{
      const t=document.createElement('h3'),ul=document.createElement('ul');t.textContent=g.t;box.appendChild(t);
      g.items.forEach(([n,u,d])=>{const li=document.createElement('li'),a=document.createElement('a');
        a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.textContent=n+' ↗';li.append(a,' — '+d);ul.appendChild(li)});
      box.appendChild(ul);
    });
  },
  setMode(m){
    this.mode=m;$('#bPause').setAttribute('aria-pressed',String(m==='pause'));$('#bSlow').setAttribute('aria-pressed',String(m==='slow'));
    $('#bPause').textContent=m==='pause'?'▶ Reanudar':'⏸ Pausar';
  },
  tick(dt){
    let t=this.mode==='pause'?0:this.mode==='slow'?.15:1;
    if(EviAssistant.state==='fly'||EviAssistant.state==='speak')t*=.2;
    this.timeScale+=(t-this.timeScale)*Math.min(1,dt*3);
    $('#spd').textContent='×'+this.timeScale.toFixed(2);return dt*this.timeScale;
  },
  select(it){this.stopTour();EviAssistant.goTo(it)},
  openDialog(it){
    $('#dlg').hidden=false;$('#dMeta').textContent=`${it.n} · Lanzamiento: ${it.y} · Estado: ${it.state}`;
    $('#dTxt').textContent='';$('#sr').textContent=it.story;$('#dSrc').href=SRC[it.id]||NSSDCA;
    const src=RES.src[it.id],a=$('#dSrc');a.hidden=!src;if(src)a.href=src;
  },
  setText(s){$('#dTxt').textContent=s},
  setTalking(b){$('#bars').classList.toggle('talk',b)},
  speak(text){
    if(!this.voice||!window.speechSynthesis)return;
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.rate=1.02;speechSynthesis.speak(u);
  },
  closeDialog(goHome,keepCam){
    $('#dlg').hidden=true;this.stopTour();
    if(goHome&&EviAssistant.state!=='idle'){EviAssistant.returnHome();if(!keepCam)SpaceScene.focus('all')}
  },
  startTour(z){this.list=z?HardwareData.filter(i=>i.z===z):['orbit','moon','mars','deep'].flatMap(k=>HardwareData.filter(i=>i.z===k));this.tour=0;this.runTour()},
  runTour(){const it=this.list[this.tour];if(it)EviAssistant.goTo(it);else{this.tour=-1;this.closeDialog(true)}},
  afterStory(){if(this.tour>=0)this.tourTimer=setTimeout(()=>{this.tour++;this.runTour()},3500)},
  stopTour(){this.tour=-1;clearTimeout(this.tourTimer)}
};
