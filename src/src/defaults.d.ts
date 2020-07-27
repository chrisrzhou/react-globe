import {
  CameraOptions,
  Coordinates,
  EasingFunction,
  FocusOptions,
  GlobeOptions,
  LightOptions,
  MarkerOptions,
} from './types';
export declare const RADIUS = 300;
export declare const BACKGROUND_RADIUS_SCALE = 10;
export declare const CAMERA_FAR: number;
export declare const CAMERA_FOV = 45;
export declare const CAMERA_NEAR = 1;
export declare const CAMERA_DAMPING_FACTOR = 0.1;
export declare const CAMERA_MAX_POLAR_ANGLE: number;
export declare const CAMERA_MIN_POLAR_ANGLE = 0;
export declare const CAMERA_MIN_DISTANCE_RADIUS_SCALE = 1.1;
export declare const CLOUDS_RADIUS_OFFSET = 1;
export declare const GLOBE_SEGMENTS = 50;
export declare const INITIAL_COORDINATES: Coordinates;
export declare const MARKER_DEFAULT_COLOR = 'gold';
export declare const MARKER_SEGMENTS = 10;
export declare const MARKER_UNIT_RADIUS_SCALE = 0.01;
export declare const MARKER_ACTIVE_ANIMATION_DURATION = 100;
export declare const MARKER_ACTIVE_ANIMATION_EASING_FUNCTION: EasingFunction;
export declare const defaultCameraOptions: CameraOptions;
export declare const defaultFocusOptions: FocusOptions;
export declare const defaultGlobeOptions: GlobeOptions;
export declare const defaultLightOptions: LightOptions;
export declare const defaultDotMarkerOptions: MarkerOptions;
export declare const defaultBarMarkerOptions: MarkerOptions;
export declare const defaultMarkerOptions: MarkerOptions;
