import * as React from 'react';
import * as THREE from 'three';

import createGlowMesh from '../createGlowMesh';
import { GlobeOptions } from '../types';

const { useEffect, useRef } = React;

const BACKGROUND_RADIUS_SCALE = 10;
const CLOUDS_RADIUS_OFFSET = 1;
const SEGMENTS = 50;

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
  radius,
  texture,
}: GlobeOptions): React.RefObject<THREE.Group> {
  const globeRef = useRef<THREE.Group>(new THREE.Group());
  const sphereRef = useRef<THREE.Mesh>(new THREE.Mesh());
  const backgroundRef = useRef<THREE.Mesh>(new THREE.Mesh());
  const cloudsRef = useRef<THREE.Mesh>(new THREE.Mesh());

  // init
  useEffect(() => {
    const globe = globeRef.current;
    const sphere = sphereRef.current;
    const background = backgroundRef.current;
    const clouds = cloudsRef.current;

    // add background if enabled
    if (enableBackground) {
      new THREE.TextureLoader().load(backgroundTexture, map => {
        background.geometry = new THREE.SphereGeometry(
          radius * BACKGROUND_RADIUS_SCALE,
          SEGMENTS,
          SEGMENTS,
        );
        background.material = new THREE.MeshBasicMaterial({
          map,
          side: THREE.BackSide,
        });
        globe.add(background);
      });
    }

    // add clouds if enabled
    if (enableClouds) {
      new THREE.TextureLoader().load(cloudsTexture, map => {
        clouds.geometry = new THREE.SphereGeometry(
          radius + CLOUDS_RADIUS_OFFSET,
          SEGMENTS,
          SEGMENTS,
        );
        clouds.material = new THREE.MeshLambertMaterial({
          map,
          transparent: true,
        });
        clouds.material.opacity = cloudsOpacity;
        globe.add(clouds);

        function animateClouds(): void {
          clouds.rotation.x += (Math.random() * cloudsSpeed) / 1000;
          clouds.rotation.y += (Math.random() * cloudsSpeed) / 1000;
          clouds.rotation.z += (Math.random() * cloudsSpeed) / 1000;
          requestAnimationFrame(animateClouds);
        }
        animateClouds();
      });
    }

    new THREE.TextureLoader().load(texture, map => {
      sphere.geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS);
      sphere.material = new THREE.MeshLambertMaterial({
        map,
      });
      globe.add(sphere);

      // Add glow if enabled
      if (enableGlow) {
        const glowMesh = createGlowMesh(
          sphere.geometry,
          radius * glowRadiusScale,
          {
            color: glowColor,
            coefficient: glowCoefficient,
            power: glowPower,
          },
        );
        sphere.children = []; // remove all glow instances
        sphere.add(glowMesh);
      }
    });
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
    radius,
    texture,
  ]);

  return globeRef;
}
