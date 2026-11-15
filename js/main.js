/* main.js · Arranque de la aplicación y bucle de animación */
'use strict';
if(typeof THREE==='undefined'||!THREE.OrbitControls||typeof TWEEN==='undefined'){
  document.body.insertAdjacentHTML('beforeend','<p style="padding:90px 20px">3D libraries could not be loaded. / No se pudieron cargar las librerías 3D.</p>');
}else{
  SpaceScene.initScene();SpaceScene.createPlanets();SpaceScene.createSatellites();
  EviAssistant.build();Board.init();UI.setupControls();UI.handleInteractions();
  const clock=new THREE.Clock();
  (function loop(){
    requestAnimationFrame(loop);
    const dt=Math.min(clock.getDelta(),.05),sd=UI.tick(dt);
    SpaceScene.update(sd);TWEEN.update();EviAssistant.update(dt,clock.elapsedTime);
    SpaceScene.renderer.render(SpaceScene.scene,SpaceScene.camera);
  })();
}
