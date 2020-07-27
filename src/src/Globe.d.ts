import { Group, Object3D, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Tooltip from './Tooltip';
import {
  Animation,
  Callbacks,
  CameraOptions,
  Coordinates,
  FocusOptions,
  GlobeOptions,
  InteractableScene,
  LightOptions,
  Marker,
  MarkerOptions,
  ObjectName,
  Optional,
  Options,
  Position,
  Size,
} from './types';
export default class Globe {
  activeMarker: Marker;
  activeMarkerObject: Object3D;
  animationFrameId: number;
  callbacks: Callbacks;
  camera: PerspectiveCamera;
  focus?: Coordinates;
  globe: Group;
  initialCoordinates: Coordinates;
  isFrozen: boolean;
  markerObjects: Group;
  options: Options;
  orbitControls: OrbitControls;
  preFocusPosition: Position;
  renderer: WebGLRenderer;
  scene: InteractableScene;
  tooltip: Tooltip;
  constructor(canvas: HTMLCanvasElement, tooltipDiv: HTMLDivElement);
  animate(): void;
  animateClouds(): void;
  applyAnimations(animations: Animation[]): () => void;
  destroy(): void;
  enableOrbitControls(enabled: boolean, autoRotate?: boolean): void;
  freeze(): void;
  getObjectByName(name: ObjectName): Object3D;
  isFocusing(): boolean;
  render(): void;
  updateCallbacks(callbacks?: Optional<Callbacks>): void;
  updateCamera(
    initialCoordinates?: Coordinates,
    cameraOptions?: Optional<CameraOptions>,
  ): void;
  updateFocus(
    focus?: Coordinates,
    focusOptions?: Optional<FocusOptions>,
    autoDefocus?: boolean,
  ): void;
  updateGlobe(globeOptions?: Optional<GlobeOptions>): void;
  updateLights(lightOptions?: Optional<LightOptions>): void;
  updateMarkers(
    markers?: Marker[],
    markerOptions?: Optional<MarkerOptions>,
  ): void;
  updateOptions<T>(options: T, key: string): void;
  updateSize(size?: Size): void;
  unfreeze(): void;
}
