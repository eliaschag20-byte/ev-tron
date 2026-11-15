/* EviAssistant.js */
'use strict';
const EviAssistant={
  state:'idle',hs:['float',''],talking:false,tween:null,full:'',n:0,shown:0,onDone:null,target:null,
  build(){
    const g=this.g=new THREE.Group(),M=THREE.MeshStandardMaterial;
    const white=new M({color:0xf4f7fb,roughness:.25,metalness:.2,emissive:0x223344,emissiveIntensity:.35});
    const silver=new M({color:0xb4bdcc,roughness:.25,metalness:.9});
    const blue=new THREE.MeshBasicMaterial({color:0x35E0F2});
    const body=new THREE.Mesh(new THREE.SphereGeometry(.5,32,24),white);body.scale.set(1,1.1,1);g.add(body);
    const visor=new THREE.Mesh(new THREE.SphereGeometry(.38,24,16),new M({color:0x0a1230,roughness:.1,metalness:.6}));
    visor.scale.set(1,.62,.55);visor.position.set(0,.08,.3);g.add(visor);
    this.eyes=[-.13,.13].map(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),blue);e.position.set(x,.1,.5);g.add(e);return e});
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.62,.035,12,48),silver);ring.rotation.x=Math.PI/2;g.add(ring);
    this.halo=new THREE.Mesh(new THREE.TorusGeometry(.62,.012,8,48),new THREE.MeshBasicMaterial({color:0x35E0F2,transparent:true,opacity:.8,blending:THREE.AdditiveBlending}));
    this.halo.rotation.x=Math.PI/2;this.halo.position.y=-.05;g.add(this.halo);
    [-.62,.62].forEach(x=>{const p=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),silver);p.position.set(x,0,0);g.add(p)});
    const ant=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.3),silver);ant.position.y=.7;g.add(ant);
    const tip=new THREE.Mesh(new THREE.SphereGeometry(.05,12,10),blue);tip.position.y=.87;g.add(tip);
    this.fire=new THREE.Mesh(new THREE.ConeGeometry(.2,.45,16),new THREE.MeshBasicMaterial({color:0x35E0F2,transparent:true,opacity:.6,blending:THREE.AdditiveBlending}));
    this.fire.rotation.x=Math.PI;this.fire.position.y=-.72;g.add(this.fire);
    g.add(new THREE.PointLight(0x35E0F2,.8,4));
    g.scale.setScalar(.32);SpaceScene.scene.add(g);
  },
  hudPoint(){
    const r=$('#hud').getBoundingClientRect(),cam=SpaceScene.camera;
    const v=new V3((r.left+r.width/2)/innerWidth*2-1,1-(r.top+r.height/2)/innerHeight*2,.5).unproject(cam);
    return v.sub(cam.position).normalize().multiplyScalar(6).add(cam.position);
  },
  targetPos(it){const w=it.hit.getWorldPosition(new V3());w.y+=ZONE[it.z].off;return w},
  setState(s,key,arg){this.state=s;this.hs=[key,arg||''];this.renderHud()},
  renderHud(){$('#hudSt').textContent=t(this.hs[0])+this.hs[1]},
  fly(to,sc1,done,ms){
    if(this.tween)this.tween.stop();
    const from=this.g.position.clone(),s0=this.g.scale.x,o={t:0};
    this.tween=new TWEEN.Tween(o).to({t:1},ms).easing(TWEEN.Easing.Cubic.InOut).onUpdate(()=>{
      this.g.position.lerpVectors(from,to(),o.t);this.g.position.y+=Math.sin(o.t*Math.PI)*2;
      this.g.scale.setScalar(s0+(sc1-s0)*o.t);
    }).onComplete(done).start();
  },
  goTo(it){
    this.stopTalk();
    this.setState('fly','fly',it[LANG].n.split(' (')[0].slice(0,22));
    $('#dlg').hidden=true;
    SpaceScene.track(this.g,ZONE[it.z].d,true);
    this.fly(()=>this.targetPos(it),ZONE[it.z].sc,()=>{
      this.setState('speak','talk');this.target=it;
      SpaceScene.track(it.hit,ZONE[it.z].d,false);
      UI.openDialog(it);this.say(UI.story(it),()=>{UI.finish(it);UI.afterStory()});
    },2800);
  },
  returnHome(){
    this.stopTalk();this.target=null;this.setState('return','back');
    this.fly(()=>this.hudPoint(),.32,()=>this.setState('idle','float'),2200);
  },
  say(text,done){this.full=text;this.n=0;this.shown=-1;this.talking=true;this.onDone=done;UI.setTalking(true);UI.speak(text.replace(/\u0001/g,' '))},
  speakNow(){ // el audio arranca desde donde va el relato
    if(!this.full||($('#dlg').hidden&&!UI.sink))return;
    const from=this.talking?Math.max(0,this.shown):0;
    UI.speak(this.full.slice(from).replace(/\u0001/g,' '));
  },
  stopTalk(){if(this.tween)this.tween.stop();this.talking=false;UI.setTalking(false);UI.cancelSpeech()},
  update(dt,tt){
    const g=this.g,cam=SpaceScene.camera;
    if(this.state==='idle')g.position.copy(this.hudPoint()).y+=Math.sin(tt*1.6)*.05;
    if(this.state==='speak'&&this.target)g.position.copy(this.targetPos(this.target)).y+=Math.sin(tt*1.6)*.03*g.scale.x/.22;
    g.lookAt(cam.position);
    if(this.talking){
      this.n+=dt*(UI.voice?15:38);const k=Math.floor(this.n);
      if(k!==this.shown){this.shown=Math.min(k,this.full.length);UI.setText(this.full.slice(0,this.shown))}
      if(this.n>=this.full.length){this.talking=false;UI.setTalking(false);UI.setText(this.full);this.onDone&&this.onDone()}
    }
    const amp=this.talking?.4+.6*Math.abs(Math.sin(tt*18)):1;
    this.eyes.forEach(e=>e.scale.y=this.talking?amp:1);
    this.halo.material.opacity=.55+.3*Math.sin(tt*3)+(this.talking?.2:0);
    this.fire.scale.y=(this.state==='fly'||this.state==='return'?1.6:1)*(.85+.15*Math.sin(tt*25));
  }
};
