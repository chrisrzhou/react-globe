import { useEffect, useRef } from 'react';
import {
  BackSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  TextureLoader,
} from 'three';

import {
  BACKGROUND_RADIUS_SCALE,
  CLOUDS_RADIUS_OFFSET,
  GLOBE_SEGMENTS,
  RADIUS,
} from '../defaults';
import { createGlowMesh } from '../three-glow-mesh';
import { GlobeOptions } from '../types';

const SECONDS_TO_MILLISECONDS = 1000;

export default function useGlobe<T>({
  backgroundTexture,
  cloudsOpacity,
  cloudsSpeed,
  cloudsTexture,
  enableBackground,
  enableClouds,
  enableGlow,
  glowCoefficient,
  glowColor,
  glowPower,
  glowRadiusScale,
  texture,
}: GlobeOptions): React.RefObject<THREE.Group> {
  const globeRef = useRef<THREE.Group>(new Group());
  const sphereRef = useRef<THREE.Mesh>(new Mesh());
  const backgroundRef = useRef<THREE.Mesh>(new Mesh());
  const cloudsRef = useRef<THREE.Mesh>(new Mesh());

  // init
  useEffect((): void => {
    const globe = globeRef.current;
    const sphere = sphereRef.current;
    const background = backgroundRef.current;
    const clouds = cloudsRef.current;

    // add background if enabled
    if (enableBackground) {
      new TextureLoader().load(
        backgroundTexture,
        (map): void => {
          background.geometry = new SphereGeometry(
            RADIUS * BACKGROUND_RADIUS_SCALE,
            GLOBE_SEGMENTS,
            GLOBE_SEGMENTS,
          );
          background.material = new MeshBasicMaterial({
            map,
            side: BackSide,
          });
          globe.add(background);
        },
      );
    }

    // add clouds if enabled
    if (enableClouds) {
      new TextureLoader().load(
        cloudsTexture,
        (map): void => {
          clouds.geometry = new SphereGeometry(
            RADIUS + CLOUDS_RADIUS_OFFSET,
            GLOBE_SEGMENTS,
            GLOBE_SEGMENTS,
          );
          clouds.material = new MeshLambertMaterial({
            map,
            transparent: true,
          });
          clouds.material.opacity = cloudsOpacity;
          globe.add(clouds);

          function animateClouds(): void {
            clouds.rotation.x +=
              (Math.random() * cloudsSpeed) / SECONDS_TO_MILLISECONDS;
            clouds.rotation.y +=
              (Math.random() * cloudsSpeed) / SECONDS_TO_MILLISECONDS;
            clouds.rotation.z +=
              (Math.random() * cloudsSpeed) / SECONDS_TO_MILLISECONDS;
            requestAnimationFrame(animateClouds);
          }
          animateClouds();
        },
      );
    }

    new TextureLoader().load(
      texture,
      (map): void => {
        sphere.geometry = new SphereGeometry(
          RADIUS,
          GLOBE_SEGMENTS,
          GLOBE_SEGMENTS,
        );
        sphere.material = new MeshLambertMaterial({
          map,
        });
        globe.add(sphere);

        // Add glow if enabled
        if (enableGlow) {
          const glowMesh = createGlowMesh(
            sphere.geometry,
            RADIUS * glowRadiusScale,
            {
              color: glowColor,
              coefficient: glowCoefficient,
              power: glowPower,
            },
          );
          sphere.children = []; // remove all glow instances
          sphere.add(glowMesh);
        }
      },
    );
  }, [
    backgroundTexture,
    cloudsOpacity,
    cloudsSpeed,
    cloudsTexture,
    enableBackground,
    enableClouds,
    enableGlow,
    glowCoefficient,
    glowColor,
    glowPower,
    glowRadiusScale,
    texture,
  ]);

  return globeRef;
}
