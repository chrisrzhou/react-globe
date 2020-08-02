import { Scene } from 'three';
import { Interaction } from 'three.interaction';

export function createScene({
  camera,
  earth,
  lights,
  markerObjects,
  renderer,
}) {
  const scene = new Scene();

  camera.add(lights.ambient);
  camera.add(lights.point);
  scene.add(camera);
  scene.add(earth.globe);
  scene.add(markerObjects);

  new Interaction(renderer, scene, camera);

  console.log(scene);
  return scene;
}
