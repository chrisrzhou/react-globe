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

export interface Callbacks {
  onClickMarker: MarkerCallback;
  onDefocus: (previousFocus: Coordinates | null) => void;
  onGlobeBackgroundTextureLoaded: () => void;
  onGlobeCloudsTextureLoaded: () => void;
  onGlobeTextureLoaded: () => void;
  onMouseOutMarker: MarkerCallback;
  onMouseOverMarker: MarkerCallback;
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
  markerObject: Object3D,
  event: PointerEvent,
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
  /** Opacity of clouds with values from 0 to 1. */
  globeCloudsOpacity: number;
  /** Globe glow coefficient (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  globeGlowCoefficient: number;
  /** Globe glow color. */
  globeGlowColor: string;
  /** Globe glow power (see http://stemkoski.github.io/Three.js/Shader-Glow.html). */
  globeGlowPower: number;
  /** Size of the globe glow radius (measured as a scale factor to the globe radius). */
  globeGlowRadiusScale: number;
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
  markerRenderer: (marker: Marker) => Object3D;
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
  /** Globe background texture.  Accepts a URL or image data. If null, disables the background */
  globeBackgroundTexture?: string | null;
  /** Globe cloud texture.  Accepts a URL or image data. If null, disables the clouds */
  globeCloudsTexture?: string | null;
  /** Globe texture.  Accepts a URL or image data. If null, disables the globe texture (there's no reason to do this!) */
  globeTexture?: string | null;
  /** Distance (measured as a scale factor to the globe radius) that the camera is initially placed.  This value should be greater than 1. */
  initialCameraDistanceRadiusScale?: number;
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
  /** Capture the initialized globe instance */
  onGetGlobe?: (globe: Globe) => void;
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

export class Globe {
  constructor({
    canvasElement,
    initialCameraDistanceRadiusScale,
    initialCoordinates,
    textures,
    tooltipElement,
  }: {
    canvasElement: HTMLCanvasElement;
    initialCameraDistanceRadiusScale?: number;
    initialCoordinates?: Coordinates;
    textures?: {
      globeBackgroundTexture?: string | null;
      globeCloudsTexture?: string | null;
      globeTexture?: string | null;
    };
    tooltipElement: HTMLDivElement;
  });

  animate(): void;

  animateClouds(): void;

  applyAnimations(animations: Animation[]): () => void;

  defocus(): void;

  destroy(): void;

  lock(): void;

  render(): void;

  resize(size: { height: number; width: number }): void;

  saveFocus(focusPosition: Coordinates | null): void;

  unlock(): void;

  updateCallbacks(callbacks?: Optional<Callbacks>): void;

  updateFocus(
    focus: Coordinates | null,
    overrideOptions?: Optional<Options>,
    shouldUnlockAfterFocus?: boolean,
  ): void;

  updateMarkers(markers?: Marker[]): void;

  updateOptions(options?: Optional<Options>): void;
}

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
  delay,
}: {
  from: any;
  to: any;
  animationDuration: number;
  easingFunction: EasingFunction;
  onUpdate: () => void;
  onEnd?: () => void;
  delay?: number;
}): void;

/**
 * Defaults
 */

export const defaultGlobeBackgroundTexture: string;

export const defaultGlobeCloudsTexture: string;

export const defaultGlobeTexture: string;

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
