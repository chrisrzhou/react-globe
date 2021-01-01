import * as TWEEN from 'es6-tween';

import { createCamera } from './camera';
import {
  defaultCallbacks,
  defaultInitialCoordinates,
  defaultOptions,
} from './defaults';
import { createEarth, updateEarth } from './earth';
import { updateFocus } from './focus';
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
    initialCameraDistanceRadiusScale = defaultOptions.cameraDistanceRadiusScale,
    initialCoordinates = defaultInitialCoordinates,
    textures = {},
    tooltipElement,
  }) {
    // state variables
    this.callbacks = defaultCallbacks;
    this.focus = null;
    this.isLocked = false;
    this.markers = [];
    this.options = defaultOptions;
    this.textures = textures;
    this.previousFocus = null;
    this.tooltip = new Tooltip(tooltipElement);

    // create objects
    this.renderer = createRenderer(canvasElement);
    this.camera = createCamera(
      initialCoordinates,
      initialCameraDistanceRadiusScale,
    );
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
      defocus: this.defocus.bind(this),
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

  applyAnimations(animations) {
    // const currentFocus = this.focus;
    // const currentFocusOptions = this.options.focus;
    let wait = 0;
    const timeouts = [];
    animations.forEach((animation, i) => {
      const {
        coordinates,
        focusAnimationDuration,
        focusDistanceRadiusScale,
        focusEasingFunction,
      } = animation;
      const overrideOptions = {
        focusAnimationDuration,
        focusDistanceRadiusScale,
        focusEasingFunction,
      };
      const shouldUnlockAfterFocus = i === animations.length - 1;

      const timeout = setTimeout(() => {
        this.unlock();
        this.updateFocus(coordinates, overrideOptions, shouldUnlockAfterFocus);
      }, wait);
      timeouts.push(timeout);
      wait += focusAnimationDuration;
    });

    return () => {
      timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }

  defocus() {
    if (!this.isLocked && this.previousFocus && this.options.enableDefocus) {
      this.updateFocus(null);
      this.callbacks.onDefocus(this.previousFocus);
    }
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.tooltip.destroy();
    this.renderer.domElement.remove();
  }

  lock() {
    this.isLocked = true;
    this.orbitControls.enabled = false;
    this.orbitControls.autoRotate = false;
  }

  render() {
    this.renderer.sortObjects = false;
    this.renderer.render(this.scene, this.camera);
    this.orbitControls.update();
    this.animateClouds();
    TWEEN.update();
  }

  resize(size) {
    const { height, width } = size;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  saveFocus(focusPosition) {
    this.previousFocus = focusPosition;
  }

  unlock() {
    this.isLocked = false;
    this.orbitControls.enabled = true;
    this.orbitControls.autoRotate = true;
  }

  updateCallbacks(callbacks = {}) {
    this.callbacks = merge(callbacks, defaultCallbacks);
  }

  updateFocus(focus, overrideOptions = {}, shouldUnlockAfterFocus = true) {
    if (!this.isLocked) {
      this.focus = focus;
      updateFocus(this.focus, this.camera, {
        shouldUnlockAfterFocus,
        options: merge(overrideOptions, this.options),
        previousFocus: this.previousFocus,
        lock: this.lock.bind(this),
        unlock: this.unlock.bind(this),
        saveFocus: this.saveFocus.bind(this),
      });
    }
  }

  updateMarkers(markers = []) {
    this.markers = markers;
    const callbacks = {
      onClickMarker: (marker, markerObject, event) => {
        this.updateFocus(marker.coordinates);
        this.callbacks.onClickMarker(marker, markerObject, event);
      },
      onTouchMarker: (marker, markerObject, event) => {
        this.updateFocus(marker.coordinates);
        if (this.options.enableMarkerTooltip) {
          this.tooltip.show(
            event.clientX,
            event.clientY,
            this.options.markerTooltipRenderer(markerObject.marker),
          );
        }
        this.callbacks.onTouchMarker(marker, markerObject, event);
      },
      onMouseOutMarker: (marker, markerObject, event) => {
        this.tooltip.hide();
        this.callbacks.onMouseOutMarker(marker, markerObject, event);
      },
      onMouseOverMarker: (marker, markerObject, event) => {
        if (this.options.enableMarkerTooltip) {
          this.tooltip.show(
            event.clientX,
            event.clientY,
            this.options.markerTooltipRenderer(markerObject.marker),
          );
        }
        this.callbacks.onMouseOverMarker(marker, markerObject, event);
      },
    };
    updateMarkerObjects(this.markerObjects, {
      options: this.options,
      markers,
      callbacks,
    });
  }

  updateOptions(options = {}) {
    this.options = merge(options, defaultOptions);
    updateEarth(this.earth, {
      callbacks: this.callbacks,
      options: this.options,
      textures: this.textures,
    });
    updateLights(this.lights, this.options);
    updateOrbitControls(this.orbitControls, this.options);
    this.updateFocus.bind(this, this.focus);
    this.updateMarkers.bind(this, this.markers);
  }
}
