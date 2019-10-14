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
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { createGlowMesh } from 'three-glow-mesh';
import OrbitControls from 'three-orbitcontrols';
import { Interaction } from 'three.interaction';

import {
  BACKGROUND_RADIUS_SCALE,
  CAMERA_DAMPING_FACTOR,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_MAX_POLAR_ANGLE,
  CAMERA_MIN_DISTANCE_RADIUS_SCALE,
  CAMERA_MIN_POLAR_ANGLE,
  CAMERA_NEAR,
  CLOUDS_RADIUS_OFFSET,
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
  GLOBE_SEGMENTS,
  MARKER_ACTIVE_ANIMATION_DURATION,
  MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
  MARKER_DEFAULT_COLOR,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from './defaults';
import Tooltip from './Tooltip';
import {
  Animation,
  Callbacks,
  CameraOptions,
  Coordinates,
  FocusOptions,
  GlobeOptions,
  InteractableObject3D,
  InteractableScene,
  InteractionEvent,
  LightOptions,
  Marker,
  MarkerOptions,
  MarkerType,
  ObjectName,
  Optional,
  Options,
  Position,
  Size,
} from './types';
import {
  coordinatesToPosition,
  getMarkerCoordinatesKey,
  maxValue,
  minValue,
  tween,
} from './utils';

const emptyFunction = (): void => {};

const defaultCallbacks = {
  onClickMarker: emptyFunction,
  onDefocus: emptyFunction,
  onMouseOutMarker: emptyFunction,
  onMouseOverMarker: emptyFunction,
  onTextureLoaded: emptyFunction,
};

const defaultOptions: Options = {
  camera: defaultCameraOptions,
  globe: defaultGlobeOptions,
  focus: defaultFocusOptions,
  marker: defaultMarkerOptions,
  light: defaultLightOptions,
};

export default class Globe {
  activeMarker: Marker;
  activeMarkerObject: Object3D;
  animationFrameId: number;
  callbacks: Callbacks;
  camera: PerspectiveCamera;
  focus?: Coordinates;
  frozen: boolean;
  globe: Group;
  initialCoordinates: Coordinates;
  isInteractionDisabled: boolean;
  markerObjects: Group;
  options: Options;
  orbitControls: OrbitControls;
  preFocusPosition: Position;
  renderer: WebGLRenderer;
  scene: InteractableScene;
  tooltip: Tooltip;

  constructor(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement) {
    // create objects
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
    const scene = new Scene() as InteractableScene;
    const tooltip = new Tooltip(tooltipDiv);

    // name objects
    camera.name = ObjectName.Camera;
    cameraAmbientLight.name = ObjectName.CameraAmbientLight;
    cameraPointLight.name = ObjectName.CameraPointLight;
    globe.name = ObjectName.Globe;
    globeBackground.name = ObjectName.GlobeBackground;
    globeClouds.name = ObjectName.GlobeClouds;
    globeSphere.name = ObjectName.GlobeSphere;
    markerObjects.name = ObjectName.MarkerObjects;
    scene.name = ObjectName.Scene;

    // add objects to scene
    camera.add(cameraAmbientLight);
    camera.add(cameraPointLight);
    globe.add(globeBackground);
    globe.add(globeClouds);
    globe.add(globeSphere);
    scene.add(markerObjects);
    scene.add(camera);
    scene.add(globe);

    // add interactions to scene
    new Interaction(renderer, scene, camera);
    scene.on('mousemove', (event: InteractionEvent) => {
      if (this.isInteractionDisabled) {
        return;
      }
      if (this.activeMarker) {
        const { activeScale } = this.options.marker;
        const from = [activeScale, activeScale, activeScale] as Position;
        tween(
          from,
          [1, 1, 1],
          MARKER_ACTIVE_ANIMATION_DURATION,
          MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
          () => {
            if (this.activeMarkerObject) {
              this.activeMarkerObject.scale.set(...from);
            }
          },
          () => {
            this.activeMarker = undefined;
            this.activeMarkerObject = undefined;
          },
        );
        this.callbacks.onMouseOutMarker(
          this.activeMarker,
          this.activeMarkerObject,
          event.data.originalEvent,
        );
        this.tooltip.hide();
      }
    });
    scene.on('click', (event: InteractionEvent) => {
      if (this.isInteractionDisabled) {
        return;
      }
      if (this.options.focus.enableDefocus && this.preFocusPosition) {
        this.callbacks.onDefocus(this.focus, event.data.originalEvent);
        this.updateFocus(undefined, this.options.focus);
      }
    });

    // assign values to class variables
    this.activeMarker = undefined;
    this.activeMarkerObject = undefined;
    this.animationFrameId = undefined;
    this.callbacks = defaultCallbacks;
    this.camera = camera;
    this.focus = undefined;
    this.frozen = false;
    this.globe = globe;
    this.isInteractionDisabled = false;
    this.markerObjects = markerObjects;
    this.options = defaultOptions;
    this.orbitControls = orbitControls;
    this.preFocusPosition = undefined;
    this.renderer = renderer;
    this.scene = scene;
    this.tooltip = tooltip;
  }

  // for each animation, update the focus and focusOptions provided by the animation over an array of timeouts
  applyAnimations(animations: Animation[]): () => void {
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
        this.updateFocus(coordinates, {
          animationDuration,
          distanceRadiusScale,
          easingFunction,
        });
      }, wait);
      timeouts.push(timeout);
      wait += animationDuration;
    });

    // return cleanup function
    return (): void => {
      timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
      this.updateFocus(currentFocus, currentFocusOptions);
    };
  }

  animate(): void {
    this.render();
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  animateClouds(): void {
    const SECONDS_TO_MILLISECONDS = 1000;
    const globeClouds = this.getObjectByName(ObjectName.GlobeClouds);
    ['x', 'y', 'z'].forEach(axis => {
      globeClouds.rotation[axis] +=
        (Math.random() * this.options.globe.cloudsSpeed) /
        SECONDS_TO_MILLISECONDS;
    });
  }

  destroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.tooltip.destroy();
  }

  getObjectByName(name: ObjectName): Object3D {
    return this.scene.getObjectByName(name);
  }

  render(): void {
    this.renderer.sortObjects = false;
    this.renderer.render(this.scene, this.camera);
    this.animateClouds();
    this.orbitControls.update();
    TWEEN.update();
  }

  resize(size: Size): void {
    const [width, height] = size;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  updateCallbacks(callbacks: Optional<Callbacks> = {}): void {
    Object.keys(defaultCallbacks).forEach(key => {
      this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
    });
  }

  updateCamera(
    initialCoordinates: Coordinates,
    cameraOptions: Optional<CameraOptions> = {},
  ): void {
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
    this.updateOrbitControls({
      autoRotate: enableAutoRotate,
      autoRotateSpeed,
      dampingFactor: CAMERA_DAMPING_FACTOR,
      enableDamping: true,
      enablePan: false,
      enableRotate,
      enableZoom,
      maxDistance: RADIUS * maxDistanceRadiusScale,
      maxPolarAngle,
      minDistance: RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE,
      minPolarAngle,
      rotateSpeed,
      zoomSpeed,
    });
  }

  updateFocus(
    focus: Coordinates,
    focusOptions: Optional<FocusOptions> = {},
  ): void {
    this.updateOptions(focusOptions, 'focus');
    this.focus = focus;

    const {
      animationDuration,
      distanceRadiusScale,
      easingFunction,
    } = this.options.focus;
    const {
      enableAutoRotate,
      maxPolarAngle,
      minPolarAngle,
    } = this.options.camera;

    if (this.frozen) {
      return;
    }

    if (this.focus) {
      // disable orbit controls when focused
      this.updateOrbitControls({
        autoRotate: false,
        enabled: false,
        maxPolarAngle: CAMERA_MAX_POLAR_ANGLE,
        minPolarAngle: CAMERA_MIN_POLAR_ANGLE,
      });
      const from: Position = [
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
      ];
      const to: Position = coordinatesToPosition(
        this.focus,
        RADIUS * distanceRadiusScale,
      );
      this.preFocusPosition = this.preFocusPosition || ([...from] as Position);
      tween(
        from,
        to,
        animationDuration,
        easingFunction,
        () => {
          this.isInteractionDisabled = true;
          this.camera.position.set(...from);
        },
        () => {
          this.isInteractionDisabled = false;
        },
      );
    } else {
      if (this.preFocusPosition) {
        const from: Position = [
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z,
        ];
        const to: Position = this.preFocusPosition;
        tween(
          from,
          to,
          animationDuration,
          easingFunction,
          () => {
            this.isInteractionDisabled = true;
            this.camera.position.set(...from);
          },
          () => {
            this.updateOrbitControls({
              autoRotate: enableAutoRotate,
              enabled: true,
              maxPolarAngle,
              minPolarAngle,
            });
            this.preFocusPosition = undefined;
            this.isInteractionDisabled = false;
          },
        );
      }
    }
  }

  updateGlobe(globeOptions: Optional<GlobeOptions> = {}): void {
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

    const globeBackground = this.getObjectByName(
      ObjectName.GlobeBackground,
    ) as Mesh;
    const globeClouds = this.getObjectByName(ObjectName.GlobeClouds) as Mesh;
    const globeSphere = this.getObjectByName(ObjectName.GlobeSphere) as Mesh;

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
        globeSphere.remove(this.getObjectByName(ObjectName.GlobeGlow));
        const globeGlow = createGlowMesh(globeSphere.geometry, {
          backside: true,
          color: glowColor,
          coefficient: glowCoefficient,
          power: glowPower,
          size: RADIUS * glowRadiusScale,
        });
        globeGlow.name = ObjectName.GlobeGlow;
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

  updateLights(lightOptions: Optional<LightOptions> = {}): void {
    this.updateOptions(lightOptions, 'light');
    const {
      ambientLightColor,
      ambientLightIntensity,
      pointLightColor,
      pointLightIntensity,
      pointLightPositionRadiusScales,
    } = this.options.light;

    const cameraAmbientLight = this.getObjectByName(
      ObjectName.CameraAmbientLight,
    ) as AmbientLight;
    const cameraPointLight = this.getObjectByName(
      ObjectName.CameraPointLight,
    ) as PointLight;

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

  updateMarkers(
    markers: Marker[],
    markerOptions: Optional<MarkerOptions> = {},
  ): void {
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

      let markerObject: InteractableObject3D;
      // create new marker objects
      if (!markerObjectNames.has(markerCoordinatesKey)) {
        if (renderer !== undefined) {
          markerObject = renderer(marker);
        } else {
          const color = marker.color || MARKER_DEFAULT_COLOR;
          const from = { size: 0 };
          const to = { size };
          const mesh = new Mesh();
          tween(
            from,
            to,
            enterAnimationDuration,
            enterEasingFunction,
            () => {
              this.isInteractionDisabled = true;
              switch (type) {
                case MarkerType.Bar:
                  mesh.geometry = new BoxGeometry(
                    unitRadius,
                    unitRadius,
                    from.size,
                  );
                  mesh.material = new MeshLambertMaterial({
                    color,
                  });
                  break;
                case MarkerType.Dot:
                default:
                  mesh.geometry = new SphereGeometry(
                    from.size,
                    MARKER_SEGMENTS,
                    MARKER_SEGMENTS,
                  );
                  mesh.material = new MeshBasicMaterial({ color });
                  if (enableGlow) {
                    // add glow
                    const glowMesh = createGlowMesh(
                      mesh.geometry.clone() as THREE.Geometry,
                      {
                        backside: false,
                        color,
                        coefficient: glowCoefficient,
                        power: glowPower,
                        size: from.size * glowRadiusScale,
                      },
                    );
                    mesh.children = [];
                    mesh.add(glowMesh);
                  }
              }
            },
            () => {
              this.isInteractionDisabled = false;
            },
          );
          markerObject = mesh;
        }

        // place markers
        let heightOffset = 0;
        if (offsetRadiusScale !== undefined) {
          heightOffset = RADIUS * offsetRadiusScale;
        } else {
          if (type === MarkerType.Dot) {
            heightOffset = (size * (1 + glowRadiusScale)) / 2;
          } else {
            heightOffset = 0;
          }
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

      // update existing marker objects
      markerObject = this.markerObjects.getObjectByName(markerCoordinatesKey);
      const handleClick = (event: InteractionEvent): void => {
        if (this.isInteractionDisabled) {
          this.tooltip.hide();
          return;
        }
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
        if (this.isInteractionDisabled) {
          this.tooltip.hide();
          return;
        }
        event.stopPropagation();
        const from = markerObject.scale.toArray() as Position;
        tween(
          from,
          [activeScale, activeScale, activeScale],
          MARKER_ACTIVE_ANIMATION_DURATION,
          MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
          () => {
            if (markerObject) {
              markerObject.scale.set(...from);
            }
          },
        );
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

    // remove marker objects that are stale
    const markerObjectsToRemove = this.markerObjects.children.filter(
      markerObject => !markerCoordinatesKeys.has(markerObject.name),
    );
    markerObjectsToRemove.forEach(markerObject => {
      const from = markerObject.scale.toArray() as Position;
      tween(
        from,
        [0, 0, 0],
        exitAnimationDuration,
        exitEasingFunction,
        () => {
          this.isInteractionDisabled = true;
          if (markerObject) {
            markerObject.scale.set(...from);
          }
        },
        () => {
          this.isInteractionDisabled = false;
          this.markerObjects.remove(markerObject);
        },
      );
    });
  }

  updateOptions<T>(options: T, key: string): void {
    this.options = {
      ...defaultOptions,
      [key]: {
        ...defaultOptions[key],
        ...options,
      },
    };
  }

  updateOrbitControls(orbitControlOptions: Optional<OrbitControls> = {}): void {
    Object.keys(orbitControlOptions).forEach(key => {
      this.orbitControls[key] = orbitControlOptions[key];
    });
  }

  freeze(): void {
    this.frozen = true;
    this.updateOrbitControls({ enabled: false });
    cancelAnimationFrame(this.animationFrameId);
  }

  unfreeze(): void {
    if (this.frozen) {
      this.frozen = false;
      this.updateOrbitControls({ enabled: true });
      this.animate();
    }
  }
}
