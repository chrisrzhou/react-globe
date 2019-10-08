import * as TWEEN from 'es6-tween';
import React, { useEffect, useRef } from 'react';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
} from './defaults';
import GlobeManager from './GlobeManager';
import {
  Animation,
  CameraOptions,
  Coordinates,
  FocusOptions,
  GlobeOptions,
  LightOptions,
  Marker,
  MarkerCallback,
  MarkerOptions,
  Optional,
  Size,
} from './types';
import useResize from './useResize';

export interface Props {
  /** An array of animation steps to power globeManager animations. */
  animations?: Animation[];
  /** Configure camera options (e.g. rotation, zoom, angles). */
  cameraOptions?: Optional<CameraOptions>;
  /** A set of [lat, lon] coordinates to be focused on. */
  focus?: Coordinates;
  /** Configure focusing options (e.g. animation duration, distance, easing function). */
  focusOptions?: Optional<FocusOptions>;
  /** Configure globeManager options (e.g. textures, background, clouds, glow). */
  globeOptions?: Optional<GlobeOptions>;
  /** Configure light options (e.g. ambient and point light colors + intensity). */
  lightOptions?: Optional<LightOptions>;
  /** A set of starting [lat, lon] coordinates for the globeManager. */
  lookAt?: Coordinates;
  /** An array of data that will render interactive markers on the globeManager. */
  markers?: Marker[];
  /** Configure marker options (e.g. tooltips, size, marker types, custom marker renderer). */
  markerOptions?: Optional<MarkerOptions>;
  /** Callback to handle click events of a marker.  Captures the clicked marker, ThreeJS object and pointer event. */
  onClickMarker?: MarkerCallback;
  /** Callback to handle defocus events (i.e. clicking the globeManager after a focus has been applied).  Captures the previously focused coordinates and pointer event. */
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
  cameraOptions,
  focus,
  focusOptions,
  globeOptions,
  lightOptions,
  lookAt,
  markers,
  markerOptions,
  onClickMarker,
  onDefocus,
  onMouseOutMarker,
  onMouseOverMarker,
  onTextureLoaded,
  size: initialSize,
}: Props): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>();
  const globeManagerRef = useRef<GlobeManager>();
  const mountRef = useRef<HTMLDivElement>();
  const mouseRef = useRef<{ x: number; y: number }>();
  const tooltipRef = useRef<HTMLDivElement>();
  const size = useResize(mountRef, initialSize);

  // init
  useEffect(() => {
    console.log('init');
    const globeManager = new GlobeManager(
      canvasRef.current,
      tooltipRef.current,
    );
    const mount = mountRef.current;
    mount.appendChild(globeManager.renderer.domElement);
    globeManagerRef.current = globeManager;

    function onMouseUpdate(e: MouseEvent): void {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener('mousemove', onMouseUpdate, false);

    return (): void => {
      mount.removeChild(globeManager.renderer.domElement);
      globeManager.destroy();
      document.removeEventListener('mousemove', onMouseUpdate, false);
    };
  }, []);

  // resize
  useEffect(() => {
    console.log('resize');
    globeManagerRef.current.resize(size);
  }, [size]);

  // update callbacks
  useEffect(() => {
    console.log('callbacks');
    globeManagerRef.current.updateCallbacks({
      onClickMarker,
      onDefocus,
      onMouseOutMarker,
      onMouseOverMarker,
      onTextureLoaded,
    });
  }, [
    onClickMarker,
    onDefocus,
    onMouseOutMarker,
    onMouseOverMarker,
    onTextureLoaded,
  ]);

  // update camera
  useEffect(() => {
    console.log('camera');
    globeManagerRef.current.updateCamera(lookAt, cameraOptions);
  }, [cameraOptions, lookAt]);

  // update focus
  useEffect(() => {
    console.log('focus');
    globeManagerRef.current.updateFocus(focus, focusOptions);
  }, [focus, focusOptions]);

  // update globeManager
  useEffect(() => {
    console.log('globeManager');
    globeManagerRef.current.updateGlobe(globeOptions);
  }, [globeOptions]);

  // update lights
  useEffect(() => {
    console.log('lights');
    globeManagerRef.current.updateLights(lightOptions);
  }, [lightOptions]);

  // update markers
  useEffect(() => {
    console.log('markers');
    globeManagerRef.current.updateMarkers(markers, markerOptions);
  }, [markerOptions, markers]);

  // handle animations
  useEffect(() => {
    const globeManager = globeManagerRef.current;
    const currentFocus = globeManager.focus;
    const currentFocusOptions = globeManager.options.focus;

    let wait = 0;
    const timeouts = [];
    animations.forEach(animation => {
      const {
        animationDuration,
        coordinates,
        distanceRadiusScale,
        easingFunction,
      } = animation;
      const timeout = setTimeout(() => {
        globeManager.updateFocus(coordinates, {
          animationDuration,
          distanceRadiusScale,
          easingFunction,
        });
      }, wait);
      timeouts.push(timeout);
      wait += animationDuration;
    });
    return (): void => {
      // clear timeouts and reset focus and focusOptions
      timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
      globeManager.updateFocus(currentFocus, currentFocusOptions);
    };
  }, [animations]);

  // render loop
  useEffect(() => {
    const globeManager = globeManagerRef.current;

    let animationFrameID: number;
    function animate(): void {
      globeManager.renderer.sortObjects = false;
      globeManager.render();
      globeManager.animateClouds();
      globeManager.orbitControls.update();
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
      <div ref={tooltipRef} />
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
