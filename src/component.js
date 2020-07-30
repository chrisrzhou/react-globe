import React, { useEffect, useRef } from 'react';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
  INITIAL_COORDINATES,
} from './defaults';
import Globe from './globe';
import { resize } from './utils';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

export default function ReactGlobe({
  animations,
  cameraOptions,
  focus,
  focusOptions,
  globeOptions,
  lightOptions,
  initialCoordinates,
  markers,
  markerOptions,
  onClickMarker,
  onDefocus,
  onMouseOutMarker,
  onMouseOverMarker,
  onGetGlobeInstance,
  onTextureLoaded,
  size,
}) {
  const canvasRef = useRef(null);
  const globeInstanceRef = useRef(null);
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);

  // Init
  useEffect(() => {
    const mount = mountRef.current;
    const globeInstance = new Globe(canvasRef.current, tooltipRef.current);
    mount.append(globeInstance.renderer.domElement);
    globeInstance.animate();
    globeInstanceRef.current = globeInstance;
    if (onGetGlobeInstance) {
      onGetGlobeInstance(globeInstance);
    }

    return () => {
      globeInstance.renderer.domElement.remove();
      globeInstance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update callbacks
  useEffect(() => {
    globeInstanceRef.current.updateCallbacks({
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

  // Update camera
  useEffect(() => {
    globeInstanceRef.current.updateCamera(initialCoordinates, cameraOptions);
  }, [cameraOptions, initialCoordinates]);

  // Update focus
  useEffect(() => {
    globeInstanceRef.current.updateFocus(focus, focusOptions);
  }, [focus, focusOptions]);

  // Update globe
  useEffect(() => {
    globeInstanceRef.current.updateGlobe(globeOptions);
  }, [globeOptions]);

  // Update lights
  useEffect(() => {
    globeInstanceRef.current.updateLights(lightOptions);
  }, [lightOptions]);

  // Update markers
  useEffect(() => {
    globeInstanceRef.current.updateMarkers(markers, markerOptions);
  }, [markerOptions, markers]);

  // Apply animations
  useEffect(() => {
    return globeInstanceRef.current.applyAnimations(animations);
  }, [animations]);

  // Resize
  useEffect(() => {
    return resize(mountRef.current, globeInstanceRef.current.updateSize);
  }, [size]);

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
  initialCoordinates: INITIAL_COORDINATES,
  markers: [],
  markerOptions: defaultMarkerOptions,
};
