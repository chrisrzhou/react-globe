import React, { useEffect, useRef } from 'react';

import Globe from './globe';
import { resize } from './utils';

export default function ReactGlobe({
  focus,
  height = '100%',
  initialCoordinates,
  markers,
  options,
  width = '100%',
  onClickMarker,
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
      initialCoordinates,
      tooltipElement,
    });
    globe.animate();
    globeRef.current = globe;
    return () => globe.destroy();
  }, [initialCoordinates]);

  // resize
  useEffect(() => {
    const mount = mountRef.current;
    const globe = globeRef.current;
    return resize(mount, globe.resize.bind(globe));
  }, []);

  // update options
  useEffect(() => {
    const globe = globeRef.current;
    globe.updateCallbacks({
      onClickMarker,
      onMouseOutMarker,
      onMouseOverMarker,
    });
  }, [onClickMarker, onMouseOutMarker, onMouseOverMarker]);

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

  useEffect(() => {
    const globe = globeRef.current;
    globe.updateFocus(focus);
  }, [focus]);

  return (
    <div ref={mountRef} style={{ height, width }}>
      <canvas ref={canvasRef} />
      <div ref={tooltipRef} />
    </div>
  );
}
