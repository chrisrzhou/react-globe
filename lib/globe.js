import * as TWEEN from 'es6-tween';

import { createCamera } from './camera';
import { defaultInitialCoordinates, defaultOptions } from './defaults';
import { createEarth, updateEarth } from './earth';
import { createLights, updateLights } from './lights';
import { createOrbitControls, updateOrbitControls } from './orbit-controls';
import { createRenderer } from './renderer';
import { createScene } from './scene';
import Tooltip from './tooltip';

export default class Globe {
  constructor({
    canvasElement,
    initialCoordinates = defaultInitialCoordinates,
    tooltipElement,
  }) {
    this.options = defaultOptions;
    this.isFrozen = false;
    this.tooltip = new Tooltip(tooltipElement);

    // create objects
    this.renderer = createRenderer(canvasElement);
    this.camera = createCamera(initialCoordinates);
    this.earth = createEarth();
    this.lights = createLights();
    this.orbitControls = createOrbitControls(this.camera, this.renderer);

    // assemble scene
    this.camera.add(this.lights.ambient);
    this.camera.add(this.lights.point);
    this.scene = createScene();
    this.scene.add(this.camera);
    this.scene.add(this.earth.globe);
    this.update();
  }

  animate() {
    this.render();
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  // TODO: make this configurable
  animateClouds() {
    ['x', 'y', 'z'].forEach(axis => {
      this.earth.clouds.rotation[axis] += Math.random() / 10000;
    });
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.tooltip.destroy();
    this.renderer.domElement.remove();
  }

  render() {
    this.animateClouds();
    this.renderer.sortObjects = false;
    this.renderer.render(this.scene, this.camera);
    this.orbitControls.update();
    TWEEN.update();
  }

  freeze() {
    cancelAnimationFrame(this.animationFrameId);
    this.isFrozen = true;
  }

  resize(size) {
    const { height, width } = size;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  unfreeze() {
    if (this.isFrozen) {
      this.isFrozen = false;
      this.animate();
    }
  }

  update(options) {
    this.options = { ...defaultOptions, ...options };
    updateEarth(this.earth, this.options);
    updateLights(this.lights, this.options);
    updateOrbitControls(this.orbitControls, this.options);
  }
}
