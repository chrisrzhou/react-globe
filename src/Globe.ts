import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import {
    AmbientLight, BackSide, BoxGeometry, Color, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial,
    Object3D, PerspectiveCamera, PointLight, Scene, SphereGeometry, TextureLoader, Vector3,
    WebGLRenderer
} from 'three';
import { createGlowMesh } from 'three-glow-mesh';
import OrbitControls from 'three-orbitcontrols';
import { Interaction } from 'three.interaction';
import tippy, { Instance } from 'tippy.js';

import {
    BACKGROUND_RADIUS_SCALE, CAMERA_DAMPING_FACTOR, CAMERA_FAR, CAMERA_FOV, CAMERA_MAX_POLAR_ANGLE,
    CAMERA_MIN_DISTANCE_RADIUS_SCALE, CAMERA_MIN_POLAR_ANGLE, CAMERA_NEAR, CLOUDS_RADIUS_OFFSET,
    defaultCameraOptions, defaultFocusOptions, defaultGlobeOptions, defaultLightOptions,
    defaultMarkerOptions, GLOBE_SEGMENTS, MARKER_ACTIVE_ANIMATION_DURATION,
    MARKER_ACTIVE_ANIMATION_EASING_FUNCTION, MARKER_DEFAULT_COLOR, MARKER_SEGMENTS,
    MARKER_UNIT_RADIUS_SCALE, RADIUS, TOOLTIP_OFFSET
} from './defaults';
import {
    Callbacks, CameraOptions, Coordinates, FocusOptions, GlobeOptions, InteractableObject3D,
    InteractableScene, InteractionEvent, LightOptions, Marker, MarkerOptions, MarkerType,
    ObjectName, Optional, Options, Position, Size
} from './types';
import { coordinatesToPosition, tween } from './utils';

const emptyFunction = (): void => {};

const defaultCallbacks = {
  onClickMarker: emptyFunction,
  onDefocus: emptyFunction,
  onMouseOutMarker: emptyFunction,
  onMouseOverMarker: emptyFunction,
  onTextureLoaded: emptyFunction,
};

export default class Globe {
  activeMarker: Marker;
  activeMarkerObject: Object3D;
  ambientLight: AmbientLight;
  background: Mesh;
  callbacks: Callbacks;
  camera: PerspectiveCamera;
  clouds: Mesh;
  focus?: Coordinates;
  globe: Group;
  glow: Mesh;
  markerObjects: Group;
  options: Options;
  orbitControls: OrbitControls;
  pointLight: PointLight;
  preFocusPosition: Position;
  scene: InteractableScene;
  sphere: Mesh;
  renderer: WebGLRenderer;
  tooltipDiv: HTMLDivElement;
  tooltipInstance: Instance;

  constructor(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement) {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });
    this.tooltipDiv = tooltipDiv;
    this.initializeCallbacks();
    this.initializeOptions();
    this.initializeCamera(this.renderer);
    this.initializeLights();
    this.initializeGlobe();
    this.initializeMarkerObjects();
    this.initializeScene(this.renderer, this.camera);
    this.buildScene();
  }

  animateClouds(): void {
    const SECONDS_TO_MILLISECONDS = 1000;
    ['x', 'y', 'z'].forEach(axis => {
      this.clouds.rotation[axis] +=
        (Math.random() * this.options.globe.cloudsSpeed) /
        SECONDS_TO_MILLISECONDS;
    });
  }

  buildScene(): void {
    this.camera.add(this.ambientLight);
    this.camera.add(this.pointLight);

    this.globe.add(this.background);
    this.globe.add(this.sphere);
    this.globe.add(this.clouds);
    this.globe.add(this.markerObjects);

    this.scene.add(this.camera);
    this.scene.add(this.globe);
  }

  destroy(): void {
    if (this.tooltipInstance) {
      this.tooltipInstance.destroy();
    }
  }

  initializeCallbacks(): void {
    this.callbacks = defaultCallbacks;
  }

  initializeCamera(renderer: WebGLRenderer): void {
    this.camera = new PerspectiveCamera();
    this.camera.name = ObjectName.Camera;

    this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
  }

  initializeGlobe(): void {
    this.background = new Mesh();
    this.background.name = ObjectName.Background;

    this.clouds = new Mesh();
    this.clouds.name = ObjectName.Clouds;

    this.globe = new Group();
    this.globe.name = ObjectName.Globe;

    this.glow = new Mesh();
    this.glow.name = ObjectName.Glow;

    this.sphere = new Mesh();
    this.sphere.name = ObjectName.Sphere;
  }

  initializeLights(): void {
    this.ambientLight = new AmbientLight('white');
    this.ambientLight.name = ObjectName.AmbientLight;

    this.pointLight = new PointLight('white');
    this.pointLight.name = ObjectName.PointLight;
  }

  initializeMarkerObjects(): void {
    this.markerObjects = new Group();
    this.markerObjects.name = ObjectName.MarkerObjects;
  }

  initializeOptions(): void {
    this.options = {
      camera: defaultCameraOptions,
      globe: defaultGlobeOptions,
      focus: defaultFocusOptions,
      marker: defaultMarkerOptions,
      light: defaultLightOptions,
    };
  }

  initializeScene(renderer: WebGLRenderer, camera: PerspectiveCamera): void {
    this.scene = new Scene() as InteractableScene;
    this.scene.name = ObjectName.Scene;
    new Interaction(renderer, this.scene, camera);

    this.scene.on('mousemove', (event: InteractionEvent) => {
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
        if (this.tooltipInstance) {
          document.body.style.cursor = 'inherit';
          this.tooltipDiv.style.position = 'fixed';
          this.tooltipDiv.style.left = '0';
          this.tooltipDiv.style.top = '0';
          this.tooltipInstance.hide();
        }
      }
    });
    this.scene.on('click', (event: InteractionEvent) => {
      if (this.options.focus.enableDefocus && this.preFocusPosition) {
        this.callbacks.onDefocus(this.focus, event.data.originalEvent);
        this.updateFocus(undefined, this.options.focus);
      }
    });
  }

  getObjectByName(name: ObjectName): Object3D {
    return this.scene.getObjectByName(name);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  resize(size: Size): void {
    const [width, height] = size;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  updateCallbacks(callbacks: Optional<Callbacks>): void {
    Object.keys(defaultCallbacks).forEach(key => {
      this.callbacks[key] = callbacks[key] || defaultCallbacks[key];
    });
  }

  updateCamera(
    lookAt: Coordinates,
    cameraOptions: Optional<CameraOptions>,
  ): void {
    this.options.camera = {
      ...defaultCameraOptions,
      ...cameraOptions,
    };
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

    const [x, y, z] = coordinatesToPosition(
      lookAt,
      RADIUS * distanceRadiusScale,
    );

    this.camera.far = CAMERA_FAR;
    this.camera.fov = CAMERA_FOV;
    this.camera.near = CAMERA_NEAR;
    this.camera.position.set(x, y, z);
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
    this.options.focus = {
      ...defaultFocusOptions,
      ...focusOptions,
    };
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
      tween(from, to, animationDuration, easingFunction, () => {
        this.camera.position.set(...from);
      });
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
          },
        );
      }
    }
  }

  updateGlobe(globeOptions: Optional<GlobeOptions>): void {
    this.options.globe = {
      ...defaultGlobeOptions,
      ...globeOptions,
    };
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

    new TextureLoader().load(texture, map => {
      this.sphere.geometry = new SphereGeometry(
        RADIUS,
        GLOBE_SEGMENTS,
        GLOBE_SEGMENTS,
      );
      this.sphere.material = new MeshLambertMaterial({
        map,
      });
      if (enableGlow) {
        this.sphere.remove(this.glow);
        this.glow = createGlowMesh(this.sphere.geometry, {
          backside: true,
          color: glowColor,
          coefficient: glowCoefficient,
          power: glowPower,
          size: RADIUS * glowRadiusScale,
        });
        this.sphere.add(this.glow);
      }
      this.callbacks.onTextureLoaded();
    });

    if (enableBackground) {
      new TextureLoader().load(backgroundTexture, map => {
        this.background.geometry = new SphereGeometry(
          RADIUS * BACKGROUND_RADIUS_SCALE,
          GLOBE_SEGMENTS,
          GLOBE_SEGMENTS,
        );
        this.background.material = new MeshBasicMaterial({
          map,
          side: BackSide,
        });
      });
    }

    if (enableClouds) {
      new TextureLoader().load(cloudsTexture, map => {
        this.clouds.geometry = new SphereGeometry(
          RADIUS + CLOUDS_RADIUS_OFFSET,
          GLOBE_SEGMENTS,
          GLOBE_SEGMENTS,
        );
        this.clouds.material = new MeshLambertMaterial({
          map,
          transparent: true,
        });
        this.clouds.material.opacity = cloudsOpacity;
      });
    }
  }

  updateLights(lightOptions: Optional<LightOptions>): void {
    this.options.light = {
      ...defaultLightOptions,
      ...lightOptions,
    };
    const {
      ambientLightColor,
      ambientLightIntensity,
      pointLightColor,
      pointLightIntensity,
      pointLightPositionRadiusScales,
    } = this.options.light;

    const [
      pointLightRadiusScaleX,
      pointLightRadiusScaleY,
      pointLightRadiusScaleZ,
    ] = pointLightPositionRadiusScales;

    this.ambientLight.color = new Color(ambientLightColor);
    this.ambientLight.intensity = ambientLightIntensity;
    this.pointLight.color = new Color(pointLightColor);
    this.pointLight.intensity = pointLightIntensity;
    this.pointLight.position.set(
      RADIUS * pointLightRadiusScaleX,
      RADIUS * pointLightRadiusScaleY,
      RADIUS * pointLightRadiusScaleZ,
    );
  }

  updateMarkers(
    markers: Marker[],
    markerOptions: Optional<MarkerOptions>,
  ): void {
    this.options.marker = {
      ...defaultMarkerOptions,
      ...markerOptions,
    };
    const {
      activeScale,
      animationDuration,
      enableGlow,
      enableTooltip,
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
        min(markers, marker => marker.value),
        max(markers, marker => marker.value),
      ])
      .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

    this.markerObjects.children = []; // clear data before adding
    markers.forEach(marker => {
      const { coordinates, value } = marker;
      const shouldUseCustomMarker = renderer !== undefined;

      const color = marker.color || MARKER_DEFAULT_COLOR;
      const size = sizeScale(value);
      let markerObject: InteractableObject3D;

      if (shouldUseCustomMarker) {
        markerObject = renderer(marker);
      } else {
        const from = { size: 0 };
        const to = { size };
        const mesh = new Mesh();
        tween(from, to, animationDuration, ['Linear', 'None'], () => {
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
        });
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

      // handle events
      function handleClick(event: InteractionEvent): void {
        event.stopPropagation();
        this.updateFocus(marker.coordinates);
        this.callbacks.onClickMarker(
          marker,
          markerObject,
          event.data.originalEvent,
        );
      }

      markerObject.on('click', handleClick.bind(this));
      markerObject.on('touchstart', handleClick.bind(this));
      markerObject.on('mousemove', event => {
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
          document.body.style.cursor = 'pointer';
          this.tooltipDiv.style.position = 'fixed';
          this.tooltipDiv.style.left = `${originalEvent.clientX +
            TOOLTIP_OFFSET}px`;
          this.tooltipDiv.style.top = `${originalEvent.clientY +
            TOOLTIP_OFFSET}px`;
          if (!this.tooltipInstance) {
            this.tooltipInstance = tippy(this.tooltipDiv, {
              animation: 'scale',
            }) as Instance;
          }
          this.tooltipInstance.setContent(getTooltipContent(marker));
          this.tooltipInstance.show();
        }
      });
      this.markerObjects.add(markerObject);
    });
  }

  updateOrbitControls(orbitControlOptions: Optional<OrbitControls>): void {
    Object.keys(orbitControlOptions).forEach(key => {
      this.orbitControls[key] = orbitControlOptions[key];
    });
  }
}
