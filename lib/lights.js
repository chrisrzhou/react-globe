import { AmbientLight, Color, PointLight } from 'three';

import { RADIUS } from './enums';

export function createLights() {
  const ambient = new AmbientLight('white');
  const point = new PointLight('white');

  return {
    ambient,
    point,
  };
}

export function updateLights(lights, options) {
  const {
    lightAmbientColor,
    lightAmbientIntensity,
    lightPointColor,
    lightPointIntensity,
    lightPointPositionRadiusScales,
  } = options;
  const { ambient, point } = lights;

  ambient.color = new Color(lightAmbientColor);
  ambient.intensity = lightAmbientIntensity;

  point.color = new Color(lightPointColor);
  point.intensity = lightPointIntensity;
  point.position.set(
    RADIUS * lightPointPositionRadiusScales[0],
    RADIUS * lightPointPositionRadiusScales[1],
    RADIUS * lightPointPositionRadiusScales[2],
  );
}
