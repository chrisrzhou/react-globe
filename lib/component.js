import React, { useEffect, useRef } from 'react';

import { defaultOptions } from './defaults';
import Globe from './globe';
import { resize } from './utils';

export default function ReactGlobe({
  animations = [],
  focus,
  height = '100%',
  globeBackgroundTexture,
  globeCloudsTexture,
  globeTexture,
  initialCameraDistanceRadiusScale,
  initialCoordinates,
  markers,
  options = defaultOptions,
  width = '100%',
  onClickMarker,
  onTouchMarker,
  onDefocus,
  onGetGlobe,
  onGlobeBackgroundTextureLoaded,
  onGlobeCloudsTextureLoaded,
  onGlobeTextureLoaded,
  onMouseOutMarker,
  onMouseOverMarker,
}) {
  const canvasRef = useRef(null);
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const tooltipElement = tooltipRef.current;
    const globe = new Globe({
      canvasElement,
      initialCameraDistanceRadiusScale:
        initialCameraDistanceRadiusScale || options.cameraDistanceRadiusScale,
      initialCoordinates,
      textures: {
        globeBackgroundTexture,
        globeCloudsTexture,
        globeTexture,
      },
      tooltipElement,
    });
    globe.animate();
    globeRef.current = globe;
    if (onGetGlobe) {
      onGetGlobe(globe);
    }
    return () => globe.destroy();
  }, [
    globeBackgroundTexture,
    globeCloudsTexture,
    globeTexture,
    initialCameraDistanceRadiusScale,
    options.cameraDistanceRadiusScale,
    initialCoordinates,
    onGetGlobe,
  ]);

  // resize
  useEffect(() => {
    const mount = mountRef.current;
    const globe = globeRef.current;
    return resize(mount, globe.resize.bind(globe));
  }, []);

  // update callbacks
  useEffect(() => {
    const globe = globeRef.current;
    globe.updateCallbacks({
      onClickMarker,
      onTouchMarker,
      onDefocus,
      onGlobeBackgroundTextureLoaded,
      onGlobeCloudsTextureLoaded,
      onGlobeTextureLoaded,
      onMouseOutMarker,
      onMouseOverMarker,
    });
  }, [
    onClickMarker,
    onTouchMarker,
    onDefocus,
    onGlobeBackgroundTextureLoaded,
    onGlobeCloudsTextureLoaded,
    onGlobeTextureLoaded,
    onMouseOutMarker,
    onMouseOverMarker,
  ]);

  // update options
  useEffect(() => {
    const globe = globeRef.current;
    globe.updateOptions(options);
  }, [options]);

  // update markers
  useEffect(() => {
    const globe = globeRef.current;
    globe.updateMarkers(markers);
  }, [markers]);

  // update focus
  useEffect(() => {
    const globe = globeRef.current;
    globe.updateFocus(focus);
  }, [focus]);

  // apply animations
  useEffect(() => {
    const globe = globeRef.current;
    return globe.applyAnimations(animations);
  }, [animations]);

  return (
    <div ref={mountRef} style={{ height, width }}>
      <canvas ref={canvasRef} />
      <div ref={tooltipRef} />
    </div>
  );
}
