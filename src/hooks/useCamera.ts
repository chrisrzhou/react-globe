import * as React from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import {
  CameraOptions,
  Coordinates,
  FocusOptions,
  LightsOptions,
  Position,
} from '../types';
import { coordinatesToPosition, tween } from '../utils';

const { useEffect, useRef } = React;

export default function useCamera<T>(
  {
    autoRotateSpeed,
    distanceRadiusScale,
    enableAutoRotate,
    enablePan,
    enableRotate,
    enableZoom,
    maxDistanceRadiusScale,
    maxPolarAngle,
    minPolarAngle,
    rotateSpeed,
  }: CameraOptions,
  {
    ambientLightColor,
    ambientLightIntensity,
    pointLightColor,
    pointLightIntensity,
    pointLightPositionRadiusScales,
  }: LightsOptions,
  {
    animationDuration: focusAnimationDuration,
    distanceRadiusScale: focusDistanceRadiusScale,
    easingFunction: focusEasingFunction,
  }: FocusOptions,
  rendererRef: React.RefObject<THREE.WebGLRenderer>,
  aspect: number,
  radius: number,
  focus?: Coordinates,
): [React.RefObject<THREE.PerspectiveCamera>, React.RefObject<OrbitControls>] {
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(),
  );
  const ambientLightRef = useRef<THREE.AmbientLight>();
  const pointLightRef = useRef<THREE.PointLight>();
  const orbitControlsRef = useRef<OrbitControls>();
  const preFocusCoordinatesRef = useRef<Coordinates>();

  // init
  useEffect(() => {
    const camera = cameraRef.current;

    const ambientLight = new THREE.AmbientLight('white');
    ambientLightRef.current = ambientLight;
    camera.add(ambientLight);

    const pointLight = new THREE.PointLight('white');
    pointLightRef.current = pointLight;
    camera.add(pointLight);

    orbitControlsRef.current = new OrbitControls(
      camera,
      rendererRef.current.domElement,
    );
  }, [rendererRef]);

  // update options
  useEffect(() => {
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;
    const ambientLight = ambientLightRef.current;
    const pointLight = pointLightRef.current;

    camera.far = 100000;
    camera.fov = 45;
    camera.near = 1;
    camera.position.set(0, 0, radius * distanceRadiusScale);

    // apply light options
    ambientLight.color = new THREE.Color(ambientLightColor);
    ambientLight.intensity = ambientLightIntensity;
    pointLight.color = new THREE.Color(pointLightColor);
    pointLight.intensity = pointLightIntensity;
    pointLight.position.set(
      radius * pointLightPositionRadiusScales[0],
      radius * pointLightPositionRadiusScales[1],
      radius * pointLightPositionRadiusScales[2],
    );

    // apply orbit controls options
    orbitControls.enableDamping = true;
    orbitControls.autoRotate = enableAutoRotate;
    orbitControls.autoRotateSpeed = autoRotateSpeed;
    orbitControls.dampingFactor = 0.1;
    orbitControls.enablePan = false;
    orbitControls.enableRotate = enableRotate;
    orbitControls.enableZoom = enableZoom;
    orbitControls.maxDistance = radius * maxDistanceRadiusScale;
    orbitControls.maxPolarAngle = maxPolarAngle;
    orbitControls.minDistance = radius * 1.1;
    orbitControls.minPolarAngle = minPolarAngle;
    orbitControls.rotateSpeed = rotateSpeed;
    orbitControls.zoomSpeed = 1;
    orbitControlsRef.current = orbitControls;
  }, [
    ambientLightColor,
    ambientLightIntensity,
    autoRotateSpeed,
    distanceRadiusScale,
    enableAutoRotate,
    enablePan,
    enableRotate,
    enableZoom,
    maxDistanceRadiusScale,
    maxPolarAngle,
    minPolarAngle,
    pointLightColor,
    pointLightIntensity,
    pointLightPositionRadiusScales,
    radius,
    rotateSpeed,
  ]);

  // update size
  useEffect(() => {
    const camera = cameraRef.current;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }, [aspect]);

  // update focus
  useEffect(() => {
    const orbitControls = orbitControlsRef.current;
    const camera = cameraRef.current;
    const preFocusCoordinates = preFocusCoordinatesRef.current;

    if (focus) {
      // disable orbit controls when focused
      orbitControls.autoRotate = false;
      orbitControls.enabled = false;
      preFocusCoordinatesRef.current = focus;

      const from: Position = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ];
      const to: Position = coordinatesToPosition(
        focus,
        radius * focusDistanceRadiusScale,
      );
      tween(from, to, focusAnimationDuration, focusEasingFunction, () => {
        camera.position.set(...from);
      });
    } else {
      if (preFocusCoordinates) {
        const from: Position = [
          camera.position.x,
          camera.position.y,
          camera.position.z,
        ];
        const to: Position = coordinatesToPosition(
          preFocusCoordinates,
          radius * distanceRadiusScale,
        );
        tween(
          from,
          to,
          focusAnimationDuration,
          focusEasingFunction,
          () => {
            camera.position.set(...from);
          },
          () => {
            orbitControls.enabled = true;
            orbitControls.autoRotate = enableAutoRotate;
          },
        );
      }
    }
  }, [
    distanceRadiusScale,
    enableAutoRotate,
    focus,
    focusAnimationDuration,
    focusDistanceRadiusScale,
    focusEasingFunction,
    radius,
  ]);

  return [cameraRef, orbitControlsRef];
}
