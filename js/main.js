/* main.js */
/* Arranque de la aplicación */
if(typeof THREE==='undefined'||!THREE.OrbitControls||typeof TWEEN==='undefined'){
  document.body.insertAdjacentHTML('beforeend','<p style="padding:90px 20px">No se pudieron cargar las librerías 3D. Revisa tu conexión.</p>');
}else{
  SpaceScene.initScene();SpaceScene.createPlanets();SpaceScene.createSatellites();
  EviAssistant.build();UI.setupControls();UI.handleInteractions();UI.updateUI();
  const clock=new THREE.Clock();
  (function loop(){
    requestAnimationFrame(loop);
    const dt=Math.min(clock.getDelta(),.05),sd=UI.tick(dt);
    SpaceScene.update(sd);TWEEN.update();EviAssistant.update(dt,clock.elapsedTime);
    SpaceScene.renderer.render(SpaceScene.scene,SpaceScene.camera);
  })();
}
