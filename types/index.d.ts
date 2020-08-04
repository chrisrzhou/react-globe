import { Object3D } from 'three';

/**
 * Types
 */
export interface Animation {
  /** Coordinates that the globe will animate to. */
  coordinates: Coordinates;
  /** Duration of the animation. */
  focusAnimationDuration: number;
  /** Distance (measured as a scale factor to the globe radius) that the globe will animate to. */
  focusDistanceRadiusScale: number;
  /** Easing function applied for the animation. */
  focusEasingFunction: EasingFunction;
}

export type Coordinates = [number, number];

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

export interface Marker {
  /** Any other custom fields. */
  [key: string]: any;
  /** [lat, lon] coordinates of the marker. */
  coordinates: Coordinates;
  /** Unique ID of marker. */
  id: string;
  /** Numeric value used to determine the size of the marker. */
  value: number;
  /** Color of the marker. */
  color?: string;
}

export type MarkerCallback = (
  marker: Marker,
  markerObject?: Object3D,
  event?: PointerEvent,
) => void;

export type MinMaxPair = [number, number];

export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export interface Options {
  /** Ambient light color. */
  ambientLightColor: string;
  /** Ambient light intensity. */
  ambientLightIntensity: number;
  /** Camera auto-rotation speed. */
  cameraAutoRotateSpeed: number;
  /** Distance (measured as a scale factor to the globe radius) that the camera is placed.  This value should be greater than 1. */
  cameraDistanceRadiusScale: number;
  /** Max distance (measured as a scale factor to the globe radius) that the camera is allowed to be zoomed out.  This value should be greater than the distanceRadiusScale. */
  cameraMaxDistanceRadiusScale: number;
  /** The maximum angle to orbit vertically.  This value should be between 0 to Math.PI radians. */
  cameraMaxPolarAngle: number;
  /** The minimum angle to orbit vertically.  This value should be between 0 to Math.PI radians. */
  cameraMinPolarAngle: number;
  /** Camera rotation speed */
  cameraRotateSpeed: number;
  /** Camera zoom speed */
  cameraZoomSpeed: number;
  /** Enable camera auto-rotation. */
  enableCameraAutoRotate: boolean;
  /** Enable camera rotation. */
  enableCameraRotate: boolean;
  /** Enable camera zoom. */
  enableCameraZoom: boolean;
  /** Enable the defocus feature (i.e. clicking the globe after a focus has been applied). */
  enableDefocus: boolean;
  /** Enable the globe background.  If disabled, the canvas will be transparent, allowing use of custom styled backgrounds. */
  enableGlobeBackground: boolean;
  /** Enable globe clouds. */
  enableGlobeClouds: boolean;
  /** Enable glow effect of the globe. */
  enableGlobeGlow: boolean;
  /** Enable glow effect of the marker. */
  enableMarkerGlow: boolean;
  /** Enable marker tooltips. */
  enableMarkerTooltip: boolean;
  /** Duration of the focus animation. */
  focusAnimationDuration: number;
  /** Distance (measured as a scale factor to the globe radius) that the focus will be viewed from. */
  focusDistanceRadiusScale: number;
  /** Easing function applied for the animation. */
  focusEasingFunction: EasingFunction;
  /** Globe background texture.  Accepts a URL or image data. */
  globeBackgroundTexture: string;
  /** Opacity of clouds with values from 0 to 1. */
  globeCloudsOpacity: number;
  /** Globe cloud texture.  Accepts a URL or image data. */
  globeCloudsTexture: string;
  /** Globe glow coefficient (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  globeGlowCoefficient: number;
  /** Globe glow color. */
  globeGlowColor: number;
  /** Globe glow power (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  globeGlowPower: number;
  /** Size of the globe glow radius (measured as a scale factor to the globe radius). */
  globeGlowRadiusScale: number;
  /** Globe texture.  Accepts a URL or image data. */
  globeTexture: string;
  /** Duration of marker enter animation (in milliseconds). */
  markerEnterAnimationDuration: number;
  /** Easing function of marker enter animation. */
  markerEnterEasingFunction: EasingFunction;
  /** Duration of marker exit animation (in milliseconds). */
  markerExitAnimationDuration: number;
  /** Easing function of marker exit animation. */
  markerExitEasingFunction: EasingFunction;
  /** Marker glow coefficient (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  markerGlowCoefficient: number;
  /** Marker glow power (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  markerGlowPower: number;
  /** Size of the marker glow radius (measured as a scale factor to the globe radius). */
  markerGlowRadiusScale: number;
  /** Marker position offset from surface of the globe (measured as a scale factor to the globe radius).  If undefined, an automated offset is applied based on the marker type used. */
  markerOffsetRadiusScale: number;
  /** [min, max] size of markers (measured as scale factors to the globe radius). */
  markerRadiusScaleRange: MinMaxPair;
  /** Provide a custom marker renderer that should return a THREE.Object3D object for the associated marker data object. */
  markerRenderer: (marker: Marker) => Object3D | null;
  /** Callback to render the tooltip string content based on the marker data. */
  markerTooltipRenderer: (marker: Marker) => string;
  /** If a valid type is passed, ReactGlobe will render the supported marker type. */
  markerType: 'dot' | 'bar';
  /** Point light color. */
  pointLightColor: string;
  /** Point light intensity. */
  pointLightIntensity: number;
  /** [x, y, z] position of the point light (measured as scale factors to the globe radius). */
  pointLightPositionRadiusScales: Position;
}

export type Position = [number, number, number];

/**
 * Globe / Component
 */
export interface Props {
  /** Apply an array of animation steps to sequentially animate the globe. */
  animations?: Animation[];
  /** A set of [lat, lon] coordinates to be focused on. */
  focus?: Coordinates | null;
  /** Height of globe (e.g. 30vh, 100%, 300px, 400).  Note that the globe aspect ratio is scaled to its height */
  height?: string | number;
  /** Initial [lat, lon] coordinates for the globe. */
  initialCoordinates?: Coordinates;
  /** An array of data that will render interactive markers on the globe. */
  markers?: Marker[];
  /** Configurations for the globe */
  options?: Optional<Options>;
  /** Width of globe (e.g. 100vw, 100%, 300px 400) */
  width?: string | number;
  /** Callback to handle click events of a marker.  Captures the clicked marker, ThreeJS object and pointer event. */
  onClickMarker?: MarkerCallback;
  /** Callback to handle defocus events (i.e. clicking the globe after a focus has been applied).  Captures the previously focused coordinates. */
  onDefocus?: (previousFocus: Coordinates) => void;
  /** Callback when globe background texture is successfully loaded. */
  onGlobeBackgroundTextureLoaded?: () => void;
  /** Callback when globe clouds texture is successfully loaded. */
  onGlobeCloudsTextureLoaded?: () => void;
  /** Callback when globe texture is successfully loaded. */
  onGlobeTextureLoaded?: () => void;
  /** Callback to handle mouseout events of a marker.  Captures the previously hovered marker, ThreeJS object and pointer event. */
  onMouseOutMarker?: MarkerCallback;
  /** Callback to handle mouseover events of a marker.  Captures the hovered marker, ThreeJS object and pointer event. */
  onMouseOverMarker?: MarkerCallback;
}

export default function ReactGlobe(props: Props): JSX.Element;

export function Globe(): void;

/**
 * Utils
 */
export function tween({
  from,
  to,
  animationDuration,
  easingFunction,
  onUpdate,
  onEnd,
}: {
  from: any;
  to: any;
  animationDuration: number;
  easingFunction: EasingFunction;
  onUpdate: () => void;
  onEnd?: () => void;
}): void;

/**
 * Defaults
 */
export const defaultInitialCoordinates: Coordinates;

export const defaultOptions: Options;

export const defaultDotMarkerOptions: {
  enableMarkerGlow: boolean;
  markerRadiusScaleRange: MinMaxPair;
  markerType: 'dot';
};

export const defaultBarMarkerOptions: {
  enableMarkerGlow: boolean;
  markerRadiusScaleRange: MinMaxPair;
  markerType: 'bar';
};