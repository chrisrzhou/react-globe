import { MarkerTypes } from './enums';

export const defaultCallbacks = {
  onClickMarker: () => {},
  onMouseOutMarker: () => {},
  onMouseOverMarker: () => {},
};

export const defaultInitialCoordinates = [1.29027, 103.851959]; // singapore!

export const defaultOptions = {
  enableGlobeBackground: true,
  enableGlobeClouds: true,
  enableGlobeGlow: true,
  enableMarkerGlow: true,
  enableMarkerTooltip: true,
  enableOrbitControlsAutoRotate: true,
  enableOrbitControlsRotate: true,
  enableOrbitControlsZoom: true,
  lightAmbientColor: 'white',
  lightAmbientIntensity: 0.8,
  lightPointColor: 'white',
  lightPointIntensity: 1,
  lightPointPositionRadiusScales: [-2, 1, -1],
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
  orbitControlsAutoRotateSpeed: 0.1,
  orbitControlsDistanceRadiusScale: 3,
  orbitControlsMaxDistanceRadiusScale: 4,
  orbitControlsMaxPolarAngle: Math.PI,
  orbitControlsMinPolarAngle: 0,
  orbitControlsRotateSpeed: 0.2,
  orbitControlsZoomSpeed: 1,
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
};
