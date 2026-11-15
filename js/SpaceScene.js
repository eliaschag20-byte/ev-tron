/* SpaceScene.js */
'use strict';
const SpaceScene={
  hits:[],markers:[],orbit:[],moonAng:.5,follow:null,flyDist:null,flyPos:null,fast:false,tmp:new V3(),
  initScene(){
    this.renderer=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(50,1,.1,3000);this.camera.position.set(45,50,125);
    this.anchor=new THREE.Object3D();this.anchor.position.set(45,0,-15);this.scene.add(this.anchor);
    this.scene.add(new THREE.AmbientLight(0x8899bb,.4));
    const sun=new THREE.DirectionalLight(0xffffff,1.7);sun.position.set(200,60,150);this.scene.add(sun);
    const N=5000,p=new Float32Array(N*3);
    for(let i=0;i<N;i++){const r=600+Math.random()*400,a=Math.random()*6.283,u=Math.acos(2*Math.random()-1);
      p.set([r*Math.sin(u)*Math.cos(a),r*Math.cos(u),r*Math.sin(u)*Math.sin(a)],i*3)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
    this.scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.5,sizeAttenuation:false})));
    this.controls=new THREE.OrbitControls(this.camera,this.renderer.domElement);
    Object.assign(this.controls,{enableDamping:true,dampingFactor:.07,minDistance:.6,maxDistance:450});
    this.controls.target.copy(this.anchor.position);
    addEventListener('resize',()=>this.resize());this.resize();
  },
  resize(){this.renderer.setSize(innerWidth,innerHeight,false);this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix()},
  tex(base,spots,craters,seed){
    const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');
    let s=seed;const r=()=>(s=s*16807%2147483647)/2147483647;
    g.fillStyle=base;g.fillRect(0,0,1024,512);
    spots.forEach(([col,n,rad])=>{g.fillStyle=col;for(let i=0;i<n;i++){g.beginPath();g.ellipse(r()*1024,r()*512,rad*(.4+r()),rad*(.3+r()*.7),r()*3,0,6.283);g.fill()}});
    for(let i=0;i<craters;i++){const x=r()*1024,y=r()*512,k=3+r()*16;g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.arc(x,y,k,0,6.283);g.fill()}
    return c;
  },
  createPlanets(){
    const sph=(r,m)=>new THREE.Mesh(new THREE.SphereGeometry(r,64,48),m),T3=c=>new THREE.CanvasTexture(c);
    const ec=this.tex('#1b55a8',[['#3f8f4d',40,60],['#8a7a4a',22,35],['#e9f3ff',14,30]],0,7),g=ec.getContext('2d');
    g.fillStyle='#f4fbff';g.fillRect(0,0,1024,26);g.fillRect(0,486,1024,26);
    this.earth=sph(5,new THREE.MeshStandardMaterial({map:T3(ec),roughness:.85}));this.scene.add(this.earth);
    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(5.6,48,32),new THREE.ShaderMaterial({
      vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'varying vec3 n;void main(){float i=pow(.72-dot(n,vec3(0.,0.,1.)),3.);gl_FragColor=vec4(.35,.65,1.,1.)*i;}',
      side:THREE.BackSide,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false})));
    this.moon=sph(1.5,new THREE.MeshStandardMaterial({map:T3(this.tex('#8d8d90',[['#6f6f74',30,50],['#a5a5a8',20,30]],260,11)),roughness:1}));this.scene.add(this.moon);
    const ring=new THREE.Mesh(new THREE.RingGeometry(31.9,32.1,128),new THREE.MeshBasicMaterial({color:0x6677aa,transparent:true,opacity:.25,side:THREE.DoubleSide}));
    ring.rotation.x=-Math.PI/2;this.scene.add(ring);
    this.mars=sph(3,new THREE.MeshStandardMaterial({map:T3(this.tex('#b5562f',[['#8a3b20',36,55],['#d98a5a',24,40]],120,23)),roughness:1}));
    this.mars.position.set(120,0,-45);this.scene.add(this.mars);
    this.surface(this.moon,1.5,'moon',.045);this.surface(this.mars,3,'mars',.09);this.createDeepSpace();
  },
  marker(parent,pos,rd,it){
    const col={ok:0x5dd39e,warn:0xFF9A3C}[it.s]||0x35E0F2,g=new THREE.Group();g.position.copy(pos);
    g.add(new THREE.Mesh(new THREE.SphereGeometry(rd,16,12),new THREE.MeshBasicMaterial({color:col})));
    const halo=new THREE.Mesh(new THREE.SphereGeometry(rd*2,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.35,depthWrite:false}));
    g.add(halo);this.hit(g,it,rd*3.4);parent.add(g);this.markers.push(halo);
  },
  hit(g,it,r){
    const h=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
    h.userData.id=it.id;g.add(h);this.hits.push(h);it.hit=h;it.grp=g;
  },
  surface(parent,R,zone,rd){
    HardwareData.filter(i=>i.z===zone).forEach(it=>{
      const la=it.lat*D2R,lo=it.lon*D2R;
      this.marker(parent,new V3(Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)).multiplyScalar(R),rd,it);
    });
  },
  createDeepSpace(){
    const S=(x,y,z,r,c,sc)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,24,18),new THREE.MeshStandardMaterial({color:c,roughness:1}));m.position.set(x,y,z);if(sc)m.scale.set(...sc);this.scene.add(m)};
    S(170,6,40,.8,0x9a9a96);S(-85,-6,-70,.9,0x8b7d6b,[1.5,.6,.6]);
    HardwareData.filter(i=>i.z==='deep').forEach(it=>this.marker(this.scene,new V3(...it.pos),.12,it));
  },
  createSatellites(){
    HardwareData.filter(i=>i.o).forEach(it=>{
      const {a,b,inc,sp,ph}=it.o,c=Math.sqrt(a*a-b*b),pivot=new THREE.Group();
      pivot.rotation.x=inc*D2R;pivot.rotation.y=ph;this.scene.add(pivot);
      const pts=[];for(let k=0;k<=96;k++){const q=k/96*6.283;pts.push(new V3(a*Math.cos(q)-c,0,b*Math.sin(q)))}
      pivot.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xFF9A3C,transparent:true,opacity:.4})));
      const sat=new THREE.Group();
      sat.add(new THREE.Mesh(new THREE.SphereGeometry(.1,16,12),new THREE.MeshStandardMaterial({color:0xdddddd,metalness:.8,roughness:.3})));
      for(let k=0;k<4;k++){const an=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.3),new THREE.MeshBasicMaterial({color:0xcccccc}));
        an.rotation.set(k%2?1:-1,0,k<2?1:-1);sat.add(an)}
      this.hit(sat,it,.5);pivot.add(sat);this.orbit.push({sat,a,b,c,sp,th:ph});
    });
  },
  label(it,name){
    const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');
    g.fillStyle='rgba(11,15,26,.8)';g.fillRect(0,0,256,64);g.strokeStyle='#FF9A3C';g.lineWidth=3;g.strokeRect(2,2,252,60);
    g.fillStyle='#FFD24A';g.font='bold 30px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('★ '+name,128,34,236);
    if(it.lbl)it.grp.remove(it.lbl);
    const w={orbit:.9,moon:.7,mars:1.4,deep:2.5}[it.z],sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));
    sp.scale.set(w,w/4,1);sp.position.y=-ZONE[it.z].off*.6;it.grp.add(sp);it.lbl=sp;
  },
  pick(e){
    this.raycaster=this.raycaster||new THREE.Raycaster();
    this.raycaster.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),this.camera);
    const h=this.raycaster.intersectObjects(this.hits,false)[0];return h?byId(h.object.userData.id):null;
  },
  track(obj,dist,fast){this.follow=obj;this.flyDist=dist;this.flyPos=null;this.fast=!!fast},
  focus(k){
    const B={earth:[this.earth,20],moon:[this.moon,7],mars:[this.mars,11]};
    if(k==='all'){this.follow=this.anchor;this.flyDist=null;this.flyPos=new V3(45,50,125)}
    else this.track(B[k][0],B[k][1]);
  },
  update(sd){
    this.earth.rotation.y+=.08*sd;this.mars.rotation.y+=.05*sd;
    this.moonAng+=.12*sd;const m=this.moonAng;
    this.moon.position.set(32*Math.cos(m),Math.sin(m)*2.8,-32*Math.sin(m));this.moon.lookAt(0,0,0);
    this.orbit.forEach(o=>{o.th+=o.sp*sd;o.sat.position.set(o.a*Math.cos(o.th)-o.c,0,o.b*Math.sin(o.th))});
    const tt=performance.now()/1000;this.markers.forEach((h,i)=>h.scale.setScalar(1+.5*Math.sin(tt*3+i)));
    const c=this.controls,cam=this.camera;
    if(this.follow){
      this.follow.getWorldPosition(this.tmp);const d=this.tmp.sub(c.target).multiplyScalar(this.fast?.2:.12);
      c.target.add(d);cam.position.add(d);
      if(this.flyDist!==null){
        const dir=cam.position.clone().sub(c.target),L=dir.length();dir.normalize();
        cam.position.copy(c.target).addScaledVector(dir,L+(this.flyDist-L)*.06);
        if(Math.abs(L-this.flyDist)<.05)this.flyDist=null;
      }
      if(this.flyPos){cam.position.lerp(this.flyPos,.05);if(cam.position.distanceTo(this.flyPos)<.5)this.flyPos=null}
    }
    c.update();cam.updateMatrixWorld();
  }
};
