import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
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
  GLOBE_SEGMENTS,
  MARKER_DEFAULT_COLOR,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from './defaults';
import {
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
  Position,
  Size,
} from './types';
import { coordinatesToPosition, tween } from './utils';

export default class Globe {
  ambientLight: AmbientLight;
  camera: PerspectiveCamera;
  cameraOptions: CameraOptions;
  background: Mesh;
  clouds: Mesh;
  focusOptions: FocusOptions;
  globe: Group;
  globeOptions: GlobeOptions;
  glow: Mesh;
  lightOptions: LightOptions;
  markerObjects: Group;
  markerOptions: MarkerOptions;
  orbitControls: OrbitControls;
  pointLight: PointLight;
  preFocusPosition: Position;
  scene: Scene;
  sphere: Mesh;
  renderer: WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
    });
    this.createScene();
    this.createLights();
    this.createCamera(this.renderer);
    this.createGlobe();
    this.createMarkerObjects();
    this.buildScene();
  }

  animateClouds(): void {
    const SECONDS_TO_MILLISECONDS = 1000;
    ['x', 'y', 'z'].forEach(axis => {
      this.clouds.rotation[axis] +=
        (Math.random() * this.globeOptions.cloudsSpeed) /
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

  createCamera(renderer: WebGLRenderer): void {
    this.camera = new PerspectiveCamera();
    this.camera.name = ObjectName.Camera;

    this.orbitControls = new OrbitControls(this.camera, renderer.domElement);
  }

  createGlobe(): void {
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

  createLights(): void {
    this.ambientLight = new AmbientLight('white');
    this.ambientLight.name = ObjectName.AmbientLight;

    this.pointLight = new PointLight('white');
    this.pointLight.name = ObjectName.PointLight;
  }

  createMarkerObjects(): void {
    this.markerObjects = new Group();
    this.markerObjects.name = ObjectName.MarkerObjects;
  }

  createScene(): void {
    this.scene = new Scene() as InteractableScene;
    this.scene.name = ObjectName.Scene;
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

  updateCamera(cameraOptions: CameraOptions, lookAt: Coordinates): void {
    this.cameraOptions = cameraOptions;
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
    } = cameraOptions;

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

  updateFocus(focusOptions: FocusOptions, focus: Coordinates): void {
    this.focusOptions = focusOptions;
    const {
      animationDuration,
      distanceRadiusScale,
      easingFunction,
    } = focusOptions;
    const {
      enableAutoRotate,
      maxPolarAngle,
      minPolarAngle,
    } = this.cameraOptions;

    if (focus) {
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
        focus,
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

  updateGlobe(globeOptions: GlobeOptions, onTextureLoaded: () => void): void {
    this.globeOptions = globeOptions;
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
    } = globeOptions;

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
      onTextureLoaded && onTextureLoaded();
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

  updateLights(lightOptions: LightOptions): void {
    this.lightOptions = lightOptions;
    const {
      ambientLightColor,
      ambientLightIntensity,
      pointLightColor,
      pointLightIntensity,
      pointLightPositionRadiusScales,
    } = lightOptions;

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

  updateMarkers(markerOptions: MarkerOptions, markers: Marker[]): void {
    this.markerOptions = markerOptions;
    const {
      animationDuration,
      enableGlow,
      glowCoefficient,
      glowPower,
      glowRadiusScale,
      offsetRadiusScale,
      radiusScaleRange,
      renderer,
      type,
    } = markerOptions;

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
        // onClick(marker, markerObject, event.data.originalEvent);
      }

      // markerObject.on('click', handleClick);
      // markerObject.on('touchstart', handleClick);
      // markerObject.on('mousemove', event => {
      // event.stopPropagation();
      // onMouseOver(marker, markerObject, event.data.originalEvent);
      // });
      this.markerObjects.add(markerObject);
    });
  }

  updateOrbitControls(options: Optional<OrbitControls>): void {
    Object.keys(options).forEach(key => {
      this.orbitControls[key] = options[key];
    });
  }
}
