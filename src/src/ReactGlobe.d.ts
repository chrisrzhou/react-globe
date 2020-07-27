/// <reference types="react" />
import Globe from './Globe';
import {
  Animation,
  CameraOptionsProp,
  Coordinates,
  FocusCallback,
  FocusOptionsProp,
  GlobeOptionsProp,
  LightOptionsProp,
  Marker,
  MarkerCallback,
  MarkerOptionsProp,
  Size,
} from './types';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
export interface Props {
  /** Apply an array of animation steps to sequentially animate the globe. */
  animations?: Animation[];
  /** Configure camera options (e.g. rotation, zoom, angles). */
  cameraOptions?: CameraOptionsProp;
  /** A set of [lat, lon] coordinates to be focused on. */
  focus?: Coordinates;
  /** Configure focusing options (e.g. animation duration, distance, easing function). */
  focusOptions?: FocusOptionsProp;
  /** Configure globe options (e.g. textures, background, clouds, glow). */
  globeOptions?: GlobeOptionsProp;
  /** Initial [lat, lon] coordinates for the globe. */
  initialCoordinates?: Coordinates;
  /** Configure light options (e.g. ambient and point light colors/intensity). */
  lightOptions?: LightOptionsProp;
  /** An array of data that will render interactive markers on the globe. */
  markers?: Marker[];
  /** Configure marker options (e.g. tooltips, size, marker types, custom marker renderer). */
  markerOptions?: MarkerOptionsProp;
  /** Callback to handle click events of a marker.  Captures the clicked marker, ThreeJS object and pointer event. */
  onClickMarker?: MarkerCallback;
  /** Callback to handle defocus events (i.e. clicking the globe after a focus has been applied).  Captures the previously focused coordinates and pointer event. */
  onDefocus?: FocusCallback;
  /** Callback to capture the Globe class instance. */
  onGetGlobeInstance?: (globe: Globe) => void;
  /** Callback to handle mouseout events of a marker.  Captures the previously hovered marker, ThreeJS object and pointer event. */
  onMouseOutMarker?: MarkerCallback;
  /** Callback to handle mouseover events of a marker.  Captures the hovered marker, ThreeJS object and pointer event. */
  onMouseOverMarker?: MarkerCallback;
  /** Callback when texture is successfully loaded. */
  onTextureLoaded?: () => void;
  /** Set explicit [width, height] values for the canvas container.  This will disable responsive resizing. */
  size?: Size;
}
declare function ReactGlobe({
  animations,
  cameraOptions,
  focus,
  focusOptions,
  globeOptions,
  lightOptions,
  initialCoordinates,
  markers,
  markerOptions,
  onClickMarker,
  onDefocus,
  onMouseOutMarker,
  onMouseOverMarker,
  onGetGlobeInstance,
  onTextureLoaded,
  size: initialSize,
}: Props): JSX.Element;
declare namespace ReactGlobe {
  var defaultProps: {
    animations: any[];
    cameraOptions: import('./types').CameraOptions;
    focusOptions: import('./types').FocusOptions;
    globeOptions: import('./types').GlobeOptions;
    lightOptions: import('./types').LightOptions;
    initialCoordinates: Coordinates;
    markers: any[];
    markerOptions: import('./types').MarkerOptions;
  };
}
export default ReactGlobe;
