import { Object3D, Scene } from 'three';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type Coordinates = [number, number];

export type Position = [number, number, number];

export type Size = [number, number];

export enum ObjectName {
  Camera = 'CAMERA',
  CameraAmbientLight = 'CAMERA_AMBIENT_LIGHT',
  CameraPointLight = 'CAMERA_POINT_LIGHT',
  Globe = 'GLOBE',
  GlobeBackground = 'GLOBE_BACKGROUND',
  GlobeClouds = 'GLOBE_CLOUDS',
  GlobeGlow = 'GLOBE_GLOW',
  GlobeSphere = 'GLOBE_SPHERE',
  MarkerObjects = 'MARKER_OBJECTS',
  Scene = 'SCENE',
}

export interface Marker {
  /** Color of the marker. */
  color?: string;
  /** [lat, lon] coordinates of the marker. */
  coordinates: Coordinates;
  /** Numeric value used to determine the size of the marker. */
  value: number;
  /** Any other custom fields */
  [customField: string]: Any;
}

export enum MarkerType {
  Bar = 'bar',
  Dot = 'dot',
}

export type EasingFunction =
  | ['Back', 'In']
  | ['Back', 'Out']
  | ['Back', 'InOut']
  | ['Bounce', 'In']
  | ['Bounce', 'Out']
  | ['Bounce', 'InOut']
  | ['Circular', 'In']
  | ['Circular', 'Out']
  | ['Circular', 'InOut']
  | ['Cubic', 'In']
  | ['Cubic', 'Out']
  | ['Cubic', 'InOut']
  | ['Elastic', 'In']
  | ['Elastic', 'Out']
  | ['Elastic', 'InOut']
  | ['Linear', 'None']
  | ['Exponential', 'In']
  | ['Exponential', 'Out']
  | ['Exponential', 'InOut']
  | ['Quadratic', 'In']
  | ['Quadratic', 'Out']
  | ['Quadratic', 'InOut']
  | ['Linear', 'None']
  | ['Cubic', 'In']
  | ['Cubic', 'Out']
  | ['Cubic', 'InOut']
  | ['Quartic', 'In']
  | ['Quartic', 'Out']
  | ['Quartic', 'InOut']
  | ['Quintic', 'In']
  | ['Quintic', 'Out']
  | ['Quintic', 'InOut']
  | ['Sinusoidal', 'In']
  | ['Sinusoidal', 'Out']
  | ['Sinusoidal', 'InOut']
  | ['Exponential', 'In']
  | ['Exponential', 'Out']
  | ['Exponential', 'InOut']
  | ['Circular', 'In']
  | ['Circular', 'Out']
  | ['Circular', 'InOut']
  | ['Elastic', 'In']
  | ['Elastic', 'Out']
  | ['Elastic', 'InOut']
  | ['Quadratic', 'In']
  | ['Quadratic', 'Out']
  | ['Quadratic', 'InOut'];

export interface Animation {
  /** Duration of the animation. */
  animationDuration: number;
  /** Coordinates that the globe will animate to. */
  coordinates: Coordinates;
  /** Distance (measured as a scale factor to the globe radius) that the globe will animate to. */
  distanceRadiusScale: number;
  /** Easing function applied for the animation. */
  easingFunction: EasingFunction;
}

export interface InteractionEvent extends Event {
  data: {
    originalEvent: PointerEvent;
  };
}

interface Interactable {
  on?(
    type: string,
    callback: (interactionEvent: InteractionEvent) => void,
  ): void;
}

export interface InteractableObject3D extends Interactable, Object3D {}

export interface InteractableScene extends Interactable, Scene {}

export interface CameraOptions {
  /** Speed of auto-rotation. */
  autoRotateSpeed: number;
  /** Distance (measured as a scale factor to the globe radius) that the camera is placed.  This value should be greater than 1. */
  distanceRadiusScale: number;
  /** Enable the auto-rotate feature of the globe. */
  enableAutoRotate: boolean;
  /** Enable the rotate feature of the globe. */
  enableRotate: boolean;
  /** Enable the zoom feature of the globe. */
  enableZoom: boolean;
  /** Max distance (measured as a scale factor to the globe radius) that the camera is allowed to be zoomed out.  This value should be greater than the distanceRadiusScale. */
  maxDistanceRadiusScale: number;
  /** The maximum angle to orbit vertically.  This value should be between 0 to Math.PI radians. */
  maxPolarAngle: number;
  /** The minimum angle to orbit vertically.  This value should be between 0 to Math.PI radians. */
  minPolarAngle: number;
  /** Speed of rotation. */
  rotateSpeed: number;
  /** Speed of zoom. */
  zoomSpeed: number;
}
export type CameraOptionsProp = Optional<CameraOptions>;

export interface FocusOptions {
  /** Duration of the focus animation. */
  animationDuration: number;
  /** Distance (measured as a scale factor to the globe radius) that the focus will be viewed from. */
  distanceRadiusScale: number;
  /** Easing function applied for the animation. */
  easingFunction: EasingFunction;
  /** Enable the defocus feature (i.e. clicking the globe after a focus has been applied). */
  enableDefocus: boolean;
}
export type FocusOptionsProp = Optional<FocusOptions>;

export interface GlobeOptions {
  /** Background texture.  Accepts a URL or image data. */
  backgroundTexture: string;
  /** Opacity of clouds with values from 0 to 1. */
  cloudsOpacity: number;
  /** Cloud texture.  Accepts a URL or image data. */
  cloudsTexture: string;
  /** Enable background.  If disabled, the canvas will be transparent, allowing use of custom styled backgrounds. */
  enableBackground: boolean;
  /** Enable clouds. */
  enableClouds: boolean;
  /** Enable glow effect of the globe. */
  enableGlow: boolean;
  /** Glow coefficient (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  glowCoefficient: number;
  /** Glow color. */
  glowColor: string;
  /** Glow power (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  glowPower: number;
  /** Size of the glow radius (measured as a scale factor to the globe radius). */
  glowRadiusScale: number;
  /** Globe texture.  Accepts a URL or image data. */
  texture: string;
}
export type GlobeOptionsProp = Optional<GlobeOptions>;

export interface LightOptions {
  /** Ambient light color. */
  ambientLightColor: string;
  /** Ambient light intensity. */
  ambientLightIntensity: number;
  /** Point light color. */
  pointLightColor: string;
  /** Point light intensity. */
  pointLightIntensity: number;
  /** [x, y, z] position of the point light (measured as scale factors to the globe radius). */
  pointLightPositionRadiusScales: Position;
}
export type LightOptionsProp = Optional<LightOptions>;

export interface MarkerOptions {
  /** Scale factor of marker size when active (i.e. hovered). */
  activeScale: number;
  /** Enable glow effect of the marker. */
  enableGlow: boolean;
  /** Enable tooltip features. */
  enableTooltip: boolean;
  /** Duration of marker enter animation (in milliseconds). */
  enterAnimationDuration: number;
  /** Easing function of enter animation. */
  enterEasingFunction: EasingFunction;
  /** Duration of marker exit animation (in milliseconds). */
  exitAnimationDuration: number;
  /** Easing function of exit animation. */
  exitEasingFunction: EasingFunction;
  /** Callback to set the tooltip string content based on the marker data. */
  getTooltipContent: (marker: Marker) => string;
  /** Glow coefficient (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  glowCoefficient: number;
  /** Glow power (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  glowPower: number;
  /** Size of the glow radius (measured as a scale factor to the globe radius). */
  glowRadiusScale: number;
  /** Marker position offset from surface of the globe (measured as a scale factor to the globe radius).  If undefined, an automated offset is applied based on the marker type used. */
  offsetRadiusScale?: number;
  /** [min, max] size of markers (measured as scale factors to the globe radius). */
  radiusScaleRange: [number, number];
  /** Provide a custom marker renderer that should return a THREE.Object3D object for the associated marker data object. */
  renderer?: (marker: Marker) => THREE.Object3D;
  /** If a valid type is passed, ReactGlobe will render the supported markers. */
  type: MarkerType;
}
export type MarkerOptionsProp = Optional<MarkerOptions>;

export type Options = {
  camera: CameraOptions;
  focus: FocusOptions;
  globe: GlobeOptions;
  light: LightOptions;
  marker: MarkerOptions;
};

export type FocusCallback = (focus: Coordinates, event?: PointerEvent) => void;

export type MarkerCallback = (
  marker: Marker,
  markerObject?: THREE.Object3D,
  event?: PointerEvent,
) => void;

export interface Callbacks {
  onClickMarker: MarkerCallback;
  onDefocus: FocusCallback;
  onMouseOutMarker: MarkerCallback;
  onMouseOverMarker: MarkerCallback;
  onTextureLoaded: () => void;
}
