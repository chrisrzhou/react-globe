import * as TWEEN from 'es6-tween';
import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { useEventCallback } from 'react-cached-callback';
import { Scene } from 'three';
import { Interaction } from 'three.interaction';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
  MARKER_ACTIVE_ANIMATION_DURATION,
  MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
} from './defaults';
import Globe from './Globe';
import { useMemoizedOptions, useResize } from './hooks';
import reducer, { ActionType } from './reducer';
import Tooltip from './Tooltip';
import {
  Animation,
  CameraOptions,
  Coordinates,
  FocusOptions,
  GlobeOptions,
  InteractableScene,
  LightOptions,
  Marker,
  MarkerCallback,
  MarkerOptions,
  Optional,
  Size,
} from './types';
import { tween } from './utils';

export interface Props {
  /** An array of animation steps to power globe animations. */
  animations?: Animation[];
  /** Configure camera options (e.g. rotation, zoom, angles). */
  cameraOptions?: Optional<CameraOptions>;
  /** A set of [lat, lon] coordinates to be focused on. */
  focus?: Coordinates;
  /** Configure focusing options (e.g. animation duration, distance, easing function). */
  focusOptions?: Optional<FocusOptions>;
  /** Configure globe options (e.g. textures, background, clouds, glow). */
  globeOptions?: Optional<GlobeOptions>;
  /** Configure light options (e.g. ambient and point light colors + intensity). */
  lightOptions?: Optional<LightOptions>;
  /** A set of starting [lat, lon] coordinates for the globe. */
  lookAt?: Coordinates;
  /** An array of data that will render interactive markers on the globe. */
  markers?: Marker[];
  /** Configure marker options (e.g. tooltips, size, marker types, custom marker renderer). */
  markerOptions?: Optional<MarkerOptions>;
  /** Callback to handle click events of a marker.  Captures the clicked marker, ThreeJS object and pointer event. */
  onClickMarker?: MarkerCallback;
  /** Callback to handle defocus events (i.e. clicking the globe after a focus has been applied).  Captures the previously focused coordinates and pointer event. */
  onDefocus?: (previousFocus: Coordinates, event?: PointerEvent) => void;
  /** Callback to handle mouseout events of a marker.  Captures the previously hovered marker, ThreeJS object and pointer event. */
  onMouseOutMarker?: MarkerCallback;
  /** Callback to handle mouseover events of a marker.  Captures the hovered marker, ThreeJS object and pointer event. */
  onMouseOverMarker?: MarkerCallback;
  /** Callback when texture is successfully loaded */
  onTextureLoaded?: () => void;
  /** Set explicit [width, height] values for the canvas container.  This will disable responsive resizing. */
  size?: Size;
}

export default function ReactGlobe({
  animations,
  cameraOptions: cameraOptionsProp,
  focus,
  focusOptions: focusOptionsProp,
  globeOptions: globeOptionsProp,
  lightOptions: lightOptionsProp,
  lookAt,
  markers,
  markerOptions: markerOptionsProp,
  onClickMarker,
  onDefocus,
  onMouseOutMarker,
  onMouseOverMarker,
  onTextureLoaded,
  size: initialSize,
}: Props): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>();
  const globeRef = useRef<Globe>();
  const mountRef = useRef<HTMLDivElement>();
  const mouseRef = useRef<{ x: number; y: number }>();
  const size = useResize(mountRef, initialSize);

  // memoize options
  const {
    cameraOptions,
    focusOptions,
    globeOptions,
    lightOptions,
    markerOptions,
  } = useMemoizedOptions({
    cameraOptionsProp,
    focusOptionsProp,
    globeOptionsProp,
    lightOptionsProp,
    markerOptionsProp,
  });

  // init
  useEffect(() => {
    console.log('init');
    const globe = new Globe(canvasRef.current);
    const mount = mountRef.current;
    mount.appendChild(globe.renderer.domElement);
    globeRef.current = globe;

    function onMouseUpdate(e: MouseEvent): void {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener('mousemove', onMouseUpdate, false);

    return (): void => {
      mount.removeChild(globe.renderer.domElement);
      document.removeEventListener('mousemove', onMouseUpdate, false);
    };
  }, []);

  // resize
  useEffect(() => {
    console.log('resize');
    globeRef.current.resize(size);
  }, [size]);

  // update camera
  useEffect(() => {
    console.log('camera');
    globeRef.current.updateCamera(cameraOptions, lookAt);
  }, [cameraOptions, lookAt]);

  // update focus
  useEffect(() => {
    console.log('focus');
    globeRef.current.updateFocus(focusOptions, focus);
  }, [focus, focusOptions]);

  // update globe
  useEffect(() => {
    console.log('globe');
    globeRef.current.updateGlobe(globeOptions, onTextureLoaded);
  }, [globeOptions, onTextureLoaded]);

  // update lights
  useEffect(() => {
    console.log('lights');
    globeRef.current.updateLights(lightOptions);
  }, [lightOptions]);

  // update markers
  useEffect(() => {
    console.log('markers');
    globeRef.current.updateMarkers(markerOptions, markers);
  }, [markerOptions, markers]);

  // animate
  useEffect(() => {
    const globe = globeRef.current;

    let animationFrameID: number;
    function animate(): void {
      globe.renderer.sortObjects = false;
      globe.render();
      globe.animateClouds();
      globe.orbitControls.update();
      TWEEN.update();
      animationFrameID = requestAnimationFrame(animate);
    }
    animate();
    return (): void => {
      if (animationFrameID) {
        cancelAnimationFrame(animationFrameID);
      }
    };
  }, []);

  return (
    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

ReactGlobe.defaultProps = {
  animations: [],
  cameraOptions: defaultCameraOptions,
  focusOptions: defaultFocusOptions,
  globeOptions: defaultGlobeOptions,
  lightOptions: defaultLightOptions,
  lookAt: [1.3521, 103.8198],
  markers: [],
  markerOptions: defaultMarkerOptions,
};
