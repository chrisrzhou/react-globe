import * as TWEEN from 'es6-tween';

import { createCamera } from './camera';
import {
  defaultCallbacks,
  defaultInitialCoordinates,
  defaultOptions,
} from './defaults';
import { createEarth, updateEarth } from './earth';
import { createLights, updateLights } from './lights';
import { createMarkerObjects, updateMarkerObjects } from './markers';
import { createOrbitControls, updateOrbitControls } from './orbit-controls';
import { createRenderer } from './renderer';
import { createScene } from './scene';
import Tooltip from './tooltip';
import { merge } from './utils';

export default class Globe {
  constructor({
    canvasElement,
    initialCoordinates = defaultInitialCoordinates,
    tooltipElement,
  }) {
    // state variables
    this.callbacks = defaultCallbacks;
    this.isFrozen = false;
    this.markers = [];
    this.options = defaultOptions;
    this.tooltip = new Tooltip(tooltipElement);

    // create objects
    this.renderer = createRenderer(canvasElement);
    this.camera = createCamera(initialCoordinates);
    this.earth = createEarth();
    this.lights = createLights();
    this.markerObjects = createMarkerObjects();
    this.orbitControls = createOrbitControls(this.camera, this.renderer);

    // assemble scene
    this.scene = createScene({
      camera: this.camera,
      earth: this.earth,
      lights: this.lights,
      markerObjects: this.markerObjects,
      renderer: this.renderer,
    });

    // initialize
    this.updateOptions();
    this.updateCallbacks();
    this.updateMarkers();
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
    this.renderer.sortObjects = false;
    this.renderer.render(this.scene, this.camera);
    this.orbitControls.update();
    this.animateClouds();
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

  updateCallbacks(callbacks = {}) {
    this.callbacks = merge(callbacks, defaultCallbacks);
  }

  updateOptions(options = {}) {
    this.options = merge(options, defaultOptions);
    updateEarth(this.earth, this.options);
    updateLights(this.lights, this.options);
    this.updateMarkers(this.markers);
    updateOrbitControls(this.orbitControls, this.options);
  }

  updateMarkers(markers = []) {
    this.markers = markers;
    updateMarkerObjects(this.markerObjects, {
      options: this.options,
      markers,
      callbacks: this.callbacks,
      tooltip: this.tooltip,
    });
  }
}
