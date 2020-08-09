import {
  BackSide,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  TextureLoader,
} from 'three';
import { createGlowMesh } from 'three-glow-mesh';

import {
  defaultGlobeBackgroundTexture,
  defaultGlobeCloudsTexture,
  defaultGlobeTexture,
} from './defaults';
import { BACKGROUND_RADIUS_SCALE, RADIUS } from './enums';

const CLOUDS_RADIUS_OFFSET = 1;
const GLOBE_SEGMENTS = 50;

export function createEarth() {
  const globe = new Mesh();
  globe.geometry = new SphereGeometry(RADIUS, GLOBE_SEGMENTS, GLOBE_SEGMENTS);
  globe.name = 'earth';

  const clouds = new Mesh();
  clouds.geometry = new SphereGeometry(
    RADIUS + CLOUDS_RADIUS_OFFSET,
    GLOBE_SEGMENTS,
    GLOBE_SEGMENTS,
  );
  clouds.name = 'clouds';

  const background = new Mesh();
  background.name = 'background';
  background.geometry = new SphereGeometry(
    RADIUS * BACKGROUND_RADIUS_SCALE,
    GLOBE_SEGMENTS,
    GLOBE_SEGMENTS,
  );

  return {
    clouds,
    globe,
    background,
  };
}

export function updateEarth(earth, { callbacks, options, textures }) {
  const {
    enableGlobeGlow,
    globeCloudsOpacity,
    globeGlowColor,
    globeGlowCoefficient,
    globeGlowPower,
    globeGlowRadiusScale,
  } = options;
  const {
    onGlobeBackgroundTextureLoaded,
    onGlobeCloudsTextureLoaded,
    onGlobeTextureLoaded,
  } = callbacks;
  const {
    globeBackgroundTexture = defaultGlobeBackgroundTexture,
    globeCloudsTexture = defaultGlobeCloudsTexture,
    globeTexture = defaultGlobeTexture,
  } = textures;
  let { clouds, globe, glow, background } = earth;

  if (enableGlobeGlow) {
    glow = createGlowMesh(globe.geometry, {
      backside: true,
      coefficient: globeGlowCoefficient,
      color: globeGlowColor,
      power: globeGlowPower,
      size: RADIUS * globeGlowRadiusScale,
    });
    glow.name = 'glow';
  }

  if (globeTexture) {
    new TextureLoader().load(
      globeTexture,
      map => {
        globe.material = new MeshLambertMaterial({ map });
        globe.remove(globe.getObjectByName('glow'));
        globe.add(glow);
        onGlobeTextureLoaded();
      },
      () => {},
      onGlobeTextureLoaded,
    );
  }

  if (globeBackgroundTexture) {
    new TextureLoader().load(
      globeBackgroundTexture,
      map => {
        background.material = new MeshBasicMaterial({ map, side: BackSide });
        onGlobeBackgroundTextureLoaded();
      },
      () => {},
      onGlobeBackgroundTextureLoaded,
    );
    globe.remove(globe.getObjectByName('background'));
    globe.add(background);
  }

  if (globeCloudsTexture) {
    new TextureLoader().load(
      globeCloudsTexture,
      map => {
        clouds.material = new MeshLambertMaterial({ map, transparent: true });
        clouds.material.opacity = globeCloudsOpacity;
        onGlobeCloudsTextureLoaded();
      },
      () => {},
      onGlobeCloudsTextureLoaded,
    );
    globe.remove(globe.getObjectByName('clouds'));
    globe.add(clouds);
  }
}
