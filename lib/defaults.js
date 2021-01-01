import { BACKGROUND_RADIUS_SCALE, MarkerTypes } from './enums';

export const defaultCallbacks = {
  onClickMarker: (_marker, _markerObject, _event) => {},
  onTouchMarker: (_marker, _markerObject, _event) => {},
  onDefocus: _previousFocus => {},
  onGlobeBackgroundTextureLoaded: () => {},
  onGlobeCloudsTextureLoaded: () => {},
  onGlobeTextureLoaded: () => {},
  onMouseOutMarker: (_marker, _markerObject, _event) => {},
  onMouseOverMarker: (_marker, _markerObject, _event) => {},
};

export const defaultGlobeBackgroundTexture =
  'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/background.png';

export const defaultGlobeCloudsTexture =
  'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/clouds.png';

export const defaultGlobeTexture =
  'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe.jpg';

export const defaultInitialCoordinates = [1.29027, 103.851959]; // singapore!

export const defaultOptions = {
  ambientLightColor: 'white',
  ambientLightIntensity: 0.8,
  cameraAutoRotateSpeed: 0.1,
  cameraDistanceRadiusScale: 3,
  cameraMaxDistanceRadiusScale: BACKGROUND_RADIUS_SCALE,
  cameraMaxPolarAngle: Math.PI,
  cameraMinPolarAngle: 0,
  cameraRotateSpeed: 0.2,
  cameraZoomSpeed: 1,
  enableCameraAutoRotate: true,
  enableCameraRotate: true,
  enableCameraZoom: true,
  enableDefocus: true,
  enableGlobeGlow: true,
  enableMarkerGlow: true,
  enableMarkerTooltip: true,
  focusAnimationDuration: 1000,
  focusDistanceRadiusScale: 1.5,
  focusEasingFunction: ['Cubic', 'Out'],
  globeCloudsOpacity: 0.3,
  globeGlowCoefficient: 0.1,
  globeGlowColor: '#d1d1d1',
  globeGlowPower: 3,
  globeGlowRadiusScale: 0.2,
  markerEnterAnimationDuration: 1000,
  markerEnterEasingFunction: ['Linear', 'None'],
  markerExitAnimationDuration: 500,
  markerExitEasingFunction: ['Cubic', 'Out'],
  markerGlowCoefficient: 0,
  markerGlowPower: 3,
  markerGlowRadiusScale: 2,
  markerOffsetRadiusScale: 0,
  markerRadiusScaleRange: [0.005, 0.02],
  markerRenderer: null,
  markerTooltipRenderer: marker => JSON.stringify(marker.coordinates),
  markerType: MarkerTypes.DOT,
  pointLightColor: 'white',
  pointLightIntensity: 1,
  pointLightPositionRadiusScales: [-2, 1, -1],
};

export const defaultDotMarkerOptions = {
  enableMarkerGlow: true,
  markerRadiusScaleRange: [0.005, 0.02],
  markerType: 'dot',
};

export const defaultBarMarkerOptions = {
  enableMarkerGlow: false,
  markerRadiusScaleRange: [0.2, 0.5],
  markerType: 'bar',
};
