import { AmbientLight, Color, PointLight } from 'three';

import { RADIUS } from './enums';

export function createLights() {
  const ambient = new AmbientLight('white');
  const point = new PointLight('white');

  ambient.name = 'ambientLight';
  point.name = 'pointLight';

  return {
    ambient,
    point,
  };
}

export function updateLights(lights, options) {
  const {
    ambientLightColor,
    ambientLightIntensity,
    pointLightColor,
    pointLightIntensity,
    pointLightPositionRadiusScales,
  } = options;
  const { ambient, point } = lights;
  const [scaleX, scaleY, scaleZ] = pointLightPositionRadiusScales;

  ambient.color = new Color(ambientLightColor);
  ambient.intensity = ambientLightIntensity;

  point.color = new Color(pointLightColor);
  point.intensity = pointLightIntensity;
  point.position.set(RADIUS * scaleX, RADIUS * scaleY, RADIUS * scaleZ);
}
