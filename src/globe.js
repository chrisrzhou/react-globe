import { scaleLinear } from 'd3-scale';
import * as TWEEN from 'es6-tween';
import {
  AmbientLight,
  BackSide,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createGlowMesh } from 'three-glow-mesh';
import { Interaction } from 'three.interaction';

import {
  BACKGROUND_RADIUS_SCALE,
  CAMERA_DAMPING_FACTOR,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_MIN_DISTANCE_RADIUS_SCALE,
  CAMERA_NEAR,
  CLOUDS_RADIUS_OFFSET,
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
  GLOBE_SEGMENTS,
  INITIAL_COORDINATES,
  MARKER_ACTIVE_ANIMATION_DURATION,
  MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
  MARKER_DEFAULT_COLOR,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from './defaults';
import { MarkerTypes, ObjectTypes } from './enums';
import Tooltip from './tooltip';
import {
  coordinatesToPosition,
  getMarkerCoordinatesKey,
  maxValue,
  minValue,
  tween,
} from './utils';

const emptyFunction = () => {};

const defaultCallbacks = {
  onClickMarker: emptyFunction,
  onDefocus: emptyFunction,
  onMouseOutMarker: emptyFunction,
  onMouseOverMarker: emptyFunction,
  onTextureLoaded: emptyFunction,
};

const defaultOptions = {
  camera: defaultCameraOptions,
  globe: defaultGlobeOptions,
  focus: defaultFocusOptions,
  marker: defaultMarkerOptions,
  light: defaultLightOptions,
};

export default class Globe {
  constructor(canvas, tooltipDiv) {
    // Create objects
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });
    const camera = new PerspectiveCamera();
    const cameraAmbientLight = new AmbientLight('white');
    const cameraPointLight = new PointLight('white');
    const globe = new Group();
    const globeBackground = new Mesh();
    const globeClouds = new Mesh();
    const globeSphere = new Mesh();
    const markerObjects = new Group();
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    const scene = new Scene();
    const tooltip = new Tooltip(tooltipDiv);

    // Name objects
    camera.name = ObjectTypes.Camera;
    cameraAmbientLight.name = ObjectTypes.CameraAmbientLight;
    cameraPointLight.name = ObjectTypes.CameraPointLight;
    globe.name = ObjectTypes.Globe;
    globeBackground.name = ObjectTypes.GlobeBackground;
    globeClouds.name = ObjectTypes.GlobeClouds;
    globeSphere.name = ObjectTypes.GlobeSphere;
    markerObjects.name = ObjectTypes.MarkerObjects;
    scene.name = ObjectTypes.Scene;

    // Add objects to scene
    camera.add(cameraAmbientLight);
    camera.add(cameraPointLight);
    globe.add(globeBackground);
    globe.add(globeClouds);
    globe.add(globeSphere);
    scene.add(markerObjects);
    scene.add(camera);
    scene.add(globe);

    // Add interactions to scene
    // eslint-disable-next-line no-new
    new Interaction(renderer, scene, camera);
    scene.on('mousemove', event => {
      if (this.isFocusing()) {
        return;
      }

      if (this.activeMarker) {
        const { activeScale } = this.options.marker;
        const from = [activeScale, activeScale, activeScale];
        tween({
          from,
          to: [1, 1, 1],
          animationDuration: MARKER_ACTIVE_ANIMATION_DURATION,
          easingFunction: MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
          onUpdate: () => {
            if (this.activeMarkerObject) {
              this.activeMarkerObject.scale.set(...from);
            }
          },
          onEnd: () => {
            this.activeMarker = undefined;
            this.activeMarkerObject = undefined;
          },
        });
        this.callbacks.onMouseOutMarker(
          this.activeMarker,
          this.activeMarkerObject,
          event.data.originalEvent,
        );
        this.tooltip.hide();
      }
    });
    scene.on('click', event => {
      if (this.isFocusing()) {
        return;
      }

      if (this.options.focus.enableDefocus && this.preFocusPosition) {
        this.callbacks.onDefocus(this.focus, event.data.originalEvent);
        this.updateFocus(undefined, this.options.focus);
      }
    });

    // Assign values to class variables
    this.activeMarker = undefined;
    this.activeMarkerObject = undefined;
    this.animationFrameId = undefined;
    this.callbacks = defaultCallbacks;
    this.camera = camera;
    this.focus = undefined;
    this.globe = globe;
    this.isFrozen = false;
    this.markerObjects = markerObjects;
    this.options = defaultOptions;
    this.orbitControls = orbitControls;
    this.preFocusPosition = undefined;
    this.renderer = renderer;
    this.scene = scene;
    this.tooltip = tooltip;

    // Update objects
    this.updateCallbacks();
    this.updateCamera();
    this.updateFocus();
    this.updateGlobe({
      enableBackground: false,
      enableClouds: false,
    });
    this.updateLights();
    this.updateMarkers();
    this.updateSize();
  }

  animate() {
    this.render();
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  animateClouds() {
    const globeClouds = this.getObjectByName(ObjectTypes.GlobeClouds);
    ['x', 'y', 'z'].forEach(axis => {
      globeClouds.rotation[axis] += Math.random() / 10000;
    });
  }

  // For each animation, update the focus and focusOptions provided by the animation over an array of timeouts
  applyAnimations(animations) {
    const currentFocus = this.focus;
    const currentFocusOptions = this.options.focus;

    let wait = 0;
    const timeouts = [];
    animations.forEach(animation => {
      const {
        animationDuration,
        coordinates,
        distanceRadiusScale,
        easingFunction,
      } = animation;
      const timeout = setTimeout(() => {
        this.updateFocus(
          coordinates,
          {
            animationDuration,
            distanceRadiusScale,
            easingFunction,
          },
          true,
        );
      }, wait);
      timeouts.push(timeout);
      wait += animationDuration;
    });

    // Return cleanup function
    return () => {
      timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
      this.updateFocus(currentFocus, currentFocusOptions);
    };
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    this.tooltip.destroy();
  }

  enableOrbitControls(enabled, autoRotate = enabled) {
    this.orbitControls.enabled = enabled;
    this.orbitControls.autoRotate = autoRotate;
  }

  freeze() {
    this.isFrozen = true;
    this.enableOrbitControls(false);
    cancelAnimationFrame(this.animationFrameId);
  }

  getObjectByName(name) {
    return this.scene.getObjectByName(name);
  }

  isFocusing() {
    return !this.orbitControls.enabled;
  }

  render() {
    this.renderer.sortObjects = false;
    this.renderer.render(this.scene, this.camera);
    this.animateClouds();
    this.orbitControls.update();
    TWEEN.update();
  }

  updateCallbacks(callbacks = {}) {
    Object.keys(defaultCallbacks).forEach(key => {
      this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
    });
  }

  updateCamera(initialCoordinates = INITIAL_COORDINATES, cameraOptions = {}) {
    this.updateOptions(cameraOptions, 'camera');
    const {
      autoRotateSpeed,
      distanceRadiusScale,
      enableAutoRotate,
      enableRotate,
      enableZoom,
      maxDistanceRadiusScale,
      maxPolarAngle,
      minPolarAngle,
      rotateSpeed,
      zoomSpeed,
    } = this.options.camera;

    if (this.initialCoordinates !== initialCoordinates) {
      const [x, y, z] = coordinatesToPosition(
        initialCoordinates,
        RADIUS * distanceRadiusScale,
      );
      this.camera.position.set(x, y, z);
      this.initialCoordinates = initialCoordinates;
    }

    this.camera.far = CAMERA_FAR;
    this.camera.fov = CAMERA_FOV;
    this.camera.near = CAMERA_NEAR;
    this.orbitControls.autoRotate = enableAutoRotate;
    this.orbitControls.autoRotateSpeed = autoRotateSpeed;
    this.orbitControls.dampingFactor = CAMERA_DAMPING_FACTOR;
    this.orbitControls.enableDamping = true;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableRotate = enableRotate;
    this.orbitControls.enableZoom = enableZoom;
    this.orbitControls.maxDistance = RADIUS * maxDistanceRadiusScale;
    this.orbitControls.maxPolarAngle = maxPolarAngle;
    this.orbitControls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
    this.orbitControls.minPolarAngle = minPolarAngle;
    this.orbitControls.rotateSpeed = rotateSpeed;
    this.orbitControls.zoomSpeed = zoomSpeed;
  }

  updateFocus(focus, focusOptions = {}, autoDefocus = false) {
    this.updateOptions(focusOptions, 'focus');
    this.focus = focus;

    const {
      animationDuration,
      distanceRadiusScale,
      easingFunction,
    } = this.options.focus;

    if (this.isFrozen) {
      return;
    }

    if (this.focus) {
      // Disable orbit controls when focused
      const from = [
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
      ];
      const to = coordinatesToPosition(
        this.focus,
        RADIUS * distanceRadiusScale,
      );
      this.preFocusPosition = this.preFocusPosition || [...from];
      tween({
        from,
        to,
        animationDuration,
        easingFunction,
        onUpdate: () => {
          this.enableOrbitControls(false);
          this.camera.position.set(...from);
        },
        onEnd: () => {
          if (autoDefocus) {
            this.focus = undefined;
            this.preFocusPosition = undefined;
          }

          this.enableOrbitControls(true, autoDefocus);
        },
      });
    } else if (this.preFocusPosition) {
      const from = [
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
      ];
      const to = this.preFocusPosition;
      tween({
        from,
        to,
        animationDuration,
        easingFunction,
        onUpdate: () => {
          this.enableOrbitControls(false);
          this.camera.position.set(...from);
        },
        onEnd: () => {
          this.preFocusPosition = undefined;
          this.enableOrbitControls(true);
        },
      });
    }
  }

  updateGlobe(globeOptions) {
    this.updateOptions(globeOptions, 'globe');
    const {
      backgroundTexture,
      cloudsOpacity,
      cloudsTexture,
      enableBackground,
      enableClouds,
      enableGlow,
      glowColor,
      glowCoefficient,
      glowPower,
      glowRadiusScale,
      texture,
    } = this.options.globe;

    const globeBackground = this.getObjectByName(ObjectTypes.GlobeBackground);
    const globeClouds = this.getObjectByName(ObjectTypes.GlobeClouds);
    const globeSphere = this.getObjectByName(ObjectTypes.GlobeSphere);

    new TextureLoader().load(texture, map => {
      globeSphere.geometry = new SphereGeometry(
        RADIUS,
        GLOBE_SEGMENTS,
        GLOBE_SEGMENTS,
      );
      globeSphere.material = new MeshLambertMaterial({
        map,
      });
      if (enableGlow) {
        globeSphere.remove(this.getObjectByName(ObjectTypes.GlobeGlow));
        const globeGlow = createGlowMesh(globeSphere.geometry, {
          backside: true,
          color: glowColor,
          coefficient: glowCoefficient,
          power: glowPower,
          size: RADIUS * glowRadiusScale,
        });
        globeGlow.name = ObjectTypes.GlobeGlow;
        globeSphere.add(globeGlow);
      }

      this.callbacks.onTextureLoaded();
    });

    if (enableBackground) {
      new TextureLoader().load(backgroundTexture, map => {
        globeBackground.geometry = new SphereGeometry(
          RADIUS * BACKGROUND_RADIUS_SCALE,
          GLOBE_SEGMENTS,
          GLOBE_SEGMENTS,
        );
        globeBackground.material = new MeshBasicMaterial({
          map,
          side: BackSide,
        });
      });
    }

    if (enableClouds) {
      new TextureLoader().load(cloudsTexture, map => {
        globeClouds.geometry = new SphereGeometry(
          RADIUS + CLOUDS_RADIUS_OFFSET,
          GLOBE_SEGMENTS,
          GLOBE_SEGMENTS,
        );
        globeClouds.material = new MeshLambertMaterial({
          map,
          transparent: true,
        });
        globeClouds.material.opacity = cloudsOpacity;
      });
    }
  }

  updateLights(lightOptions = {}) {
    this.updateOptions(lightOptions, 'light');
    const {
      ambientLightColor,
      ambientLightIntensity,
      pointLightColor,
      pointLightIntensity,
      pointLightPositionRadiusScales,
    } = this.options.light;

    const cameraAmbientLight = this.getObjectByName(
      ObjectTypes.CameraAmbientLight,
    );
    const cameraPointLight = this.getObjectByName(ObjectTypes.CameraPointLight);

    cameraAmbientLight.color = new Color(ambientLightColor);
    cameraAmbientLight.intensity = ambientLightIntensity;
    cameraPointLight.color = new Color(pointLightColor);
    cameraPointLight.intensity = pointLightIntensity;
    cameraPointLight.position.set(
      RADIUS * pointLightPositionRadiusScales[0],
      RADIUS * pointLightPositionRadiusScales[1],
      RADIUS * pointLightPositionRadiusScales[2],
    );
  }

  updateMarkers(markers = [], markerOptions = {}) {
    this.updateOptions(markerOptions, 'marker');
    const {
      activeScale,
      enableGlow,
      enableTooltip,
      enterAnimationDuration,
      enterEasingFunction,
      exitAnimationDuration,
      exitEasingFunction,
      getTooltipContent,
      glowCoefficient,
      glowPower,
      glowRadiusScale,
      offsetRadiusScale,
      radiusScaleRange,
      renderer,
      type,
    } = this.options.marker;

    const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;
    const sizeScale = scaleLinear()
      .domain([
        minValue(markers, marker => marker.value),
        maxValue(markers, marker => marker.value),
      ])
      .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

    const markerCoordinatesKeys = new Set(markers.map(getMarkerCoordinatesKey));
    const markerObjectNames = new Set(
      this.markerObjects.children.map(markerObject => markerObject.name),
    );

    markers.forEach(marker => {
      const { coordinates, value } = marker;
      const markerCoordinatesKey = getMarkerCoordinatesKey(marker);
      const size = sizeScale(value);

      let markerObject;
      // Create new marker objects
      if (!markerObjectNames.has(markerCoordinatesKey)) {
        if (renderer === undefined) {
          const color = marker.color || MARKER_DEFAULT_COLOR;
          const from = { size: 0 };
          const to = { size };
          const mesh = new Mesh();
          tween({
            from,
            to,
            animationDuration: enterAnimationDuration,
            easingFunction: enterEasingFunction,
            onUpdate: () => {
              switch (type) {
                case MarkerTypes.Bar:
                  mesh.geometry = new BoxGeometry(
                    unitRadius,
                    unitRadius,
                    from.size,
                  );
                  mesh.material = new MeshLambertMaterial({
                    color,
                  });
                  break;
                case MarkerTypes.Dot:
                default:
                  mesh.geometry = new SphereGeometry(
                    from.size,
                    MARKER_SEGMENTS,
                    MARKER_SEGMENTS,
                  );
                  mesh.material = new MeshBasicMaterial({ color });
                  if (enableGlow) {
                    // Add glow
                    const glowMesh = createGlowMesh(mesh.geometry.clone(), {
                      backside: false,
                      color,
                      coefficient: glowCoefficient,
                      power: glowPower,
                      size: from.size * glowRadiusScale,
                    });
                    mesh.children = [];
                    mesh.add(glowMesh);
                  }
              }
            },
          });
          markerObject = mesh;
        } else {
          markerObject = renderer(marker);
        }

        // Place markers
        let heightOffset = 0;
        if (offsetRadiusScale !== undefined) {
          heightOffset = RADIUS * offsetRadiusScale;
        } else if (type === MarkerTypes.Dot) {
          heightOffset = (size * (1 + glowRadiusScale)) / 2;
        } else {
          heightOffset = 0;
        }

        const position = coordinatesToPosition(
          coordinates,
          RADIUS + heightOffset,
        );
        markerObject.position.set(...position);
        markerObject.lookAt(new Vector3(0, 0, 0));

        markerObject.name = markerCoordinatesKey;
        this.markerObjects.add(markerObject);
      }

      // Update existing marker objects
      markerObject = this.markerObjects.getObjectByName(markerCoordinatesKey);
      const handleClick = event => {
        event.stopPropagation();
        this.updateFocus(marker.coordinates);
        this.callbacks.onClickMarker(
          marker,
          markerObject,
          event.data.originalEvent,
        );
      };

      markerObject.on('click', handleClick.bind(this));
      markerObject.on('touchstart', handleClick.bind(this));
      markerObject.on('mousemove', event => {
        if (this.isFocusing()) {
          this.tooltip.hide();
          return;
        }

        event.stopPropagation();
        const from = markerObject.scale.toArray();
        tween({
          from,
          to: [activeScale, activeScale, activeScale],
          animationDuration: MARKER_ACTIVE_ANIMATION_DURATION,
          easingFunction: MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
          onUpdate: () => {
            if (markerObject) {
              markerObject.scale.set(...from);
            }
          },
        });
        const { originalEvent } = event.data;
        this.activeMarker = marker;
        this.activeMarkerObject = markerObject;
        this.callbacks.onMouseOverMarker(marker, markerObject, originalEvent);

        if (enableTooltip) {
          this.tooltip.show(
            originalEvent.clientX,
            originalEvent.clientY,
            getTooltipContent(marker),
          );
        }
      });
    });

    // Remove marker objects that are stale
    const markerObjectsToRemove = this.markerObjects.children.filter(
      markerObject => !markerCoordinatesKeys.has(markerObject.name),
    );
    markerObjectsToRemove.forEach(markerObject => {
      const from = markerObject.scale.toArray();
      tween({
        from,
        to: [0, 0, 0],
        animationDuration: exitAnimationDuration,
        easingFunction: exitEasingFunction,
        onUpdate: () => {
          if (markerObject) {
            markerObject.scale.set(...from);
          }
        },
        onEnd: () => {
          this.markerObjects.remove(markerObject);
        },
      });
    });
  }

  updateOptions(options, key) {
    this.options = {
      ...defaultOptions,
      [key]: {
        ...defaultOptions[key],
        ...options,
      },
    };
  }

  updateSize(size) {
    if (size) {
      const [width, height] = size;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
    }

    this.camera.updateProjectionMatrix();
  }

  unfreeze() {
    if (this.isFrozen) {
      this.isFrozen = false;
      this.enableOrbitControls(true);
      this.animate();
    }
  }
}
