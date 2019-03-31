import * as React from 'react';
import * as THREE from 'three';
// @ts-ignore: three-orbitcontrols is untyped
import OrbitControls from 'three-orbitcontrols';

import {
  CAMERA_DAMPING_FACTOR,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_MIN_DISTANCE_RADIUS_SCALE,
  CAMERA_NEAR,
  RADIUS,
} from '../defaults';
import {
  CameraOptions,
  Coordinates,
  FocusOptions,
  LightOptions,
  Position,
  Size,
} from '../types';
import { coordinatesToPosition, tween } from '../utils';

const { useEffect, useRef } = React;

export default function useCamera<T>(
  {
    autoRotateSpeed,
    distanceRadiusScale,
    enableAutoRotate,
    enableRotate,
    enableZoom,
    maxDistanceRadiusScale,
    maxPolarAngle,
    minPolarAngle,
    rotateSpeed,
    zoomSpeed,
  }: CameraOptions,
  {
    ambientLightColor,
    ambientLightIntensity,
    pointLightColor,
    pointLightIntensity,
    pointLightPositionRadiusScales,
  }: LightOptions,
  {
    animationDuration: focusAnimationDuration,
    distanceRadiusScale: focusDistanceRadiusScale,
    easingFunction: focusEasingFunction,
  }: FocusOptions,
  rendererRef: React.RefObject<THREE.WebGLRenderer>,
  size: Size,
  lookAt: Coordinates,
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

    camera.far = CAMERA_FAR;
    camera.fov = CAMERA_FOV;
    camera.near = CAMERA_NEAR;
    const position = coordinatesToPosition(
      lookAt,
      RADIUS * distanceRadiusScale,
    );
    camera.position.set(...position);

    // apply light options
    ambientLight.color = new THREE.Color(ambientLightColor);
    ambientLight.intensity = ambientLightIntensity;
    pointLight.color = new THREE.Color(pointLightColor);
    pointLight.intensity = pointLightIntensity;
    pointLight.position.set(
      RADIUS * pointLightPositionRadiusScales[0],
      RADIUS * pointLightPositionRadiusScales[1],
      RADIUS * pointLightPositionRadiusScales[2],
    );

    // apply orbit controls options
    orbitControls.enableDamping = true;
    orbitControls.autoRotate = enableAutoRotate;
    orbitControls.autoRotateSpeed = autoRotateSpeed;
    orbitControls.dampingFactor = CAMERA_DAMPING_FACTOR;
    orbitControls.enablePan = false;
    orbitControls.enableRotate = enableRotate;
    orbitControls.enableZoom = enableZoom;
    orbitControls.maxDistance = RADIUS * maxDistanceRadiusScale;
    orbitControls.maxPolarAngle = maxPolarAngle;
    orbitControls.minDistance = RADIUS * CAMERA_MIN_DISTANCE_RADIUS_SCALE;
    orbitControls.minPolarAngle = minPolarAngle;
    orbitControls.rotateSpeed = rotateSpeed;
    orbitControls.zoomSpeed = zoomSpeed;
    orbitControlsRef.current = orbitControls;
  }, [
    ambientLightColor,
    ambientLightIntensity,
    autoRotateSpeed,
    distanceRadiusScale,
    enableAutoRotate,
    enableRotate,
    enableZoom,
    lookAt,
    maxDistanceRadiusScale,
    maxPolarAngle,
    minPolarAngle,
    pointLightColor,
    pointLightIntensity,
    pointLightPositionRadiusScales,
    rotateSpeed,
    zoomSpeed,
  ]);

  // update size
  useEffect(() => {
    const camera = cameraRef.current;
    camera.aspect = size[0] / size[1];
    camera.updateProjectionMatrix();
  }, [size]);

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
        RADIUS * focusDistanceRadiusScale,
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
          RADIUS * distanceRadiusScale,
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
  ]);

  return [cameraRef, orbitControlsRef];
}
