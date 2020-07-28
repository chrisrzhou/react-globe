import {
  CameraOptions,
  Coordinates,
  EasingFunction,
  FocusOptions,
  GlobeOptions,
  LightOptions,
  MarkerOptions,
} from './types';

export const RADIUS: number;
export const BACKGROUND_RADIUS_SCALE: number;
export const CAMERA_FAR: number;
export const CAMERA_FOV: number;
export const CAMERA_NEAR: number;
export const CAMERA_DAMPING_FACTOR: number;
export const CAMERA_MAX_POLAR_ANGLE: number;
export const CAMERA_MIN_POLAR_ANGLE: number;
export const CAMERA_MIN_DISTANCE_RADIUS_SCALE: number;
export const CLOUDS_RADIUS_OFFSET: number;
export const GLOBE_SEGMENTS: number;
export const INITIAL_COORDINATES: Coordinates;
export const MARKER_DEFAULT_COLOR: string;
export const MARKER_SEGMENTS: number;
export const MARKER_UNIT_RADIUS_SCALE: number;
export const MARKER_ACTIVE_ANIMATION_DURATION: number;
export const MARKER_ACTIVE_ANIMATION_EASING_FUNCTION: EasingFunction;

export const defaultCameraOptions: CameraOptions;
export const defaultFocusOptions: FocusOptions;
export const defaultGlobeOptions: GlobeOptions;
export const defaultLightOptions: LightOptions;
export const defaultDotMarkerOptions: MarkerOptions;
export const defaultBarMarkerOptions: MarkerOptions;
export const defaultMarkerOptions: MarkerOptions;
