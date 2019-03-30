import * as THREE from 'three';

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

export type Position = [number, number, number];

export type Size = [number, number];

// Props
export interface Animation {
  /** Duration of the animation. */
  animationDuration: number;
  /** Coordinates that the globe will animate to. */
  coordinates: Coordinates;
  /** Distance (measured as a scale factor to the globe radius) that the globe will animate to. **/
  distanceRadiusScale: number;
  /** Easing function applied for the animation. */
  easingFunction: EasingFunction;
}

export interface CameraOptions {
  /** Auto-rotate speed. */
  autoRotateSpeed: number;
  /** Distance (measured as a scale factor to the globe radius) that the camera is placed.  This number should be greater than 1. */
  distanceRadiusScale: number;
  /** Enable the auto-rotate feature of the globe. */
  enableAutoRotate: boolean;
  /** Enable the rotate feature of the globe. */
  enableRotate: boolean;
  /** Enable the zoom feature of the globe. */
  enableZoom: boolean;
  /** Max distance (measured as a scale factor to the globe radius) that the camera is allowed to be zoomed out.  This number should be greater than `distanceRadiusScale`. */
  maxDistanceRadiusScale: number;
  /** The maximum angle to orbit vertically.  This number should be between `0` to `Math.PI` radians. */
  maxPolarAngle: number;
  /** The minimum angle to orbit vertically.  This number should be between `0` to `Math.PI` radians. */
  minPolarAngle: number;
  /** Speed of rotation. */
  rotateSpeed: number;
  /** Speed of zoom. */
  zoomSpeed: number;
}

export type EasingFunction =  // TweenJS curves: https://sole.github.io/tween.js/examples/03_graphs.html
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
  animationDuration: number;
  distanceRadiusScale: number;
  easingFunction: EasingFunction;
  enableDefocus: boolean;
}

export interface GlobeOptions {
  backgroundTexture: string;
  cloudsOpacity: number;
  cloudsSpeed: number;
  cloudsTexture: string;
  enableBackground: boolean;
  enableClouds: boolean;
  enableGlow: boolean;
  glowCoefficient: number;
  glowColor: string;
  glowPower: number;
  glowRadiusScale: number;
  texture: string;
}

export interface LightOptions {
  ambientLightColor: string;
  ambientLightIntensity: number;
  pointLightColor: string;
  pointLightIntensity: number;
  pointLightPositionRadiusScales: Position;
}

export interface Marker {
  coordinates: Coordinates;
  value: number;
  [key: string]: any;
}

export type MarkerCallback = (
  marker: Marker,
  markerObject?: THREE.Object3D,
  event?: PointerEvent,
) => void;

export enum MarkerType {
  Bar = 'bar',
  Dot = 'dot',
}

export interface MarkerOptions {
  activeScale: number;
  enableTooltip: boolean;
  getTooltipContent: (marker: Marker) => string;
  radiusScaleRange: [number, number];
  renderer?: (marker: Marker) => THREE.Object3D;
  type: MarkerType;
}
