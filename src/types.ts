// Internal
export enum ActionType {
  Animate = 'ANIMATE',
  SetFocus = 'SET_FOCUS',
  SetActiveMarker = 'SET_ACTIVE_MANAGER',
}

export interface Action {
  type: ActionType;
  payload: any;
}

export interface State {
  activeMarker?: Marker;
  activeMarkerObject?: THREE.Object3D;
  focus?: Coordinates;
  focusOptions: FocusOptions;
}

export type Coordinates = [number, number];

export type MarkerCallback = (
  marker: Marker,
  markerObject?: THREE.Object3D,
  event?: PointerEvent,
) => void;

export enum MarkerType {
  Bar = 'bar',
  Dot = 'dot',
}

export type Position = [number, number, number];

export type Size = [number, number];

// Props
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

export interface CameraOptions {
  /** Auto-rotate speed. */
  autoRotateSpeed: number;
  /** Distance (measured as a scale factor to the globe radius) that the camera is placed.  This value should be greater than 1. */
  distanceRadiusScale: number;
  /** Enable the auto-rotate feature of the globe. */
  enableAutoRotate: boolean;
  /** Enable the rotate feature of the globe. */
  enableRotate: boolean;
  /** Enable the zoom feature of the globe. */
  enableZoom: boolean;
  /** Max distance (measured as a scale factor to the globe radius) that the camera is allowed to be zoomed out.  This value should be greater than distanceRadiusScale. */
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

export interface GlobeOptions {
  /** Background texture.  Accepts a URL or image data. */
  backgroundTexture: string;
  /** Opacity of clouds with values from 0 to 1. */
  cloudsOpacity: number;
  /** Speed of clouds. */
  cloudsSpeed: number;
  /** Cloud texture.  Accepts a URL or image data. */
  cloudsTexture: string;
  /** Enable background.  If disabled, the canvas will be transparent, allowing use of custom div backgrounds. */
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

export interface Marker {
  /** Color of the marker */
  color?: string;
  /** [lat, lon] coordinates of the marker. */
  coordinates: Coordinates;
  /** Numeric value used to determine the size of the marker. */
  value: number;
}

export interface MarkerOptions {
  /** Scale factor of marker size when active (i.e. hovered). */
  activeScale: number;
  /** Enable tooltip features. */
  enableTooltip: boolean;
  /** Callback to set the tooltip string content based on the marker data. */
  getTooltipContent: (marker: Marker) => string;
  /** [min, max] size of markers (measured as scale factors to the globe radius). */
  radiusScaleRange: [number, number];
  /** Custom marker renderer returning a THREE.Object3D object. */
  renderer?: (marker: Marker) => THREE.Object3D;
  /** If a valid type is passed, ReactGlobe will render the supported markers. */
  type: MarkerType;
}
