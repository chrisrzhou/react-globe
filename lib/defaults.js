import { MarkerTypes } from './enums';

export const defaultCallbacks = {
  onClickMarker: (_marker, _markerObject, _event) => {},
  onMouseOutMarker: (_marker, _markerObject, _event) => {},
  onMouseOverMarker: (_marker, _markerObject, _event) => {},
};

export const defaultInitialCoordinates = [1.29027, 103.851959]; // singapore!

export const defaultOptions = {
  ambientLightColor: 'white',
  ambientLightIntensity: 0.8,
  cameraAutoRotateSpeed: 0.1,
  cameraDistanceRadiusScale: 3,
  cameraMaxDistanceRadiusScale: 4,
  cameraMaxPolarAngle: Math.PI,
  cameraMinPolarAngle: 0,
  cameraRotateSpeed: 0.2,
  cameraZoomSpeed: 1,
  enableCameraAutoRotate: true,
  enableCameraRotate: true,
  enableCameraZoom: true,
  enableDefocus: true,
  enableGlobeBackground: true,
  enableGlobeClouds: true,
  enableGlobeGlow: true,
  enableMarkerGlow: true,
  enableMarkerTooltip: true,
  focusAnimationDuration: 1000,
  focusDistanceRadiusScale: 1.5,
  focusEasingFunction: ['Cubic', 'Out'],
  globeBackgroundTexture:
    'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/background.png',
  globeCloudsOpacity: 0.3,
  globeCloudsTexture:
    'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/clouds.png',
  globeGlowCoefficient: 0.1,
  globeGlowColor: '#d1d1d1',
  globeGlowPower: 3,
  globeGlowRadiusScale: 0.2,
  globeTexture:
    'https://raw.githubusercontent.com/chrisrzhou/react-globe/main/textures/globe.jpg',
  markerEnterAnimationDuration: 1000,
  markerEnterEasingFunction: ['Linear', 'None'],
  markerGlowCoefficient: 0,
  markerGlowPower: 3,
  markerGlowRadiusScale: 2,
  markerExitAnimationDuration: 500,
  markerExitEasingFunction: ['Cubic', 'Out'],
  markerOffsetRadiusScale: 0,
  markerRadiusScaleRange: [0.005, 0.02],
  markerRenderer: null,
  markerTooltipRenderer: marker => JSON.stringify(marker.coordinates),
  markerType: MarkerTypes.DOT,
  pointLightColor: 'white',
  pointLightIntensity: 1,
  pointLightPositionRadiusScales: [-2, 1, -1],
};
