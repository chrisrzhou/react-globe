import { useEffect, useRef } from 'react';
import { AmbientLight, Color, PerspectiveCamera, PointLight } from 'three';
import OrbitControls from 'three-orbitcontrols';

import {
  CAMERA_DAMPING_FACTOR,
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_MAX_POLAR_ANGLE,
  CAMERA_MIN_DISTANCE_RADIUS_SCALE,
  CAMERA_MIN_POLAR_ANGLE,
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
  const cameraRef = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera());
  const ambientLightRef = useRef<THREE.AmbientLight>();
  const pointLightRef = useRef<THREE.PointLight>();
  const orbitControlsRef = useRef<OrbitControls>();
  const preFocusPositionRef = useRef<Position>();
  const [
    pointLightRadiusScaleX,
    pointLightRadiusScaleY,
    pointLightRadiusScaleZ,
  ] = pointLightPositionRadiusScales;

  // init
  useEffect(() => {
    const camera = cameraRef.current;

    const ambientLight = new AmbientLight('white');
    ambientLightRef.current = ambientLight;
    camera.add(ambientLight);

    const pointLight = new PointLight('white');
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
    ambientLight.color = new Color(ambientLightColor);
    ambientLight.intensity = ambientLightIntensity;
    pointLight.color = new Color(pointLightColor);
    pointLight.intensity = pointLightIntensity;
    pointLight.position.set(
      RADIUS * pointLightRadiusScaleX,
      RADIUS * pointLightRadiusScaleY,
      RADIUS * pointLightRadiusScaleZ,
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
    pointLightRadiusScaleX,
    pointLightRadiusScaleY,
    pointLightRadiusScaleZ,
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
    const preFocusPosition = preFocusPositionRef.current;

    if (focus) {
      // disable orbit controls when focused
      orbitControls.autoRotate = false;
      orbitControls.enabled = false;
      orbitControls.minPolarAngle = CAMERA_MIN_POLAR_ANGLE;
      orbitControls.maxPolarAngle = CAMERA_MAX_POLAR_ANGLE;

      const from: Position = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ];
      const to: Position = coordinatesToPosition(
        focus,
        RADIUS * focusDistanceRadiusScale,
      );
      preFocusPositionRef.current =
        preFocusPosition || (from.slice() as Position);
      tween(from, to, focusAnimationDuration, focusEasingFunction, () => {
        camera.position.set(...from);
      });
    } else {
      if (preFocusPosition) {
        const from: Position = [
          camera.position.x,
          camera.position.y,
          camera.position.z,
        ];
        const to: Position = preFocusPosition;
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
            orbitControls.maxPolarAngle = maxPolarAngle;
            orbitControls.minPolarAngle = minPolarAngle;
            preFocusPositionRef.current = undefined;
          },
        );
      }
    }
  }, [
    enableAutoRotate,
    focus,
    focusAnimationDuration,
    focusDistanceRadiusScale,
    focusEasingFunction,
    maxPolarAngle,
    minPolarAngle,
  ]);

  return [cameraRef, orbitControlsRef];
}
