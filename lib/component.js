import React, { useEffect, useRef } from 'react';

import Globe from './globe';
import { resize } from './utils';

export default function ReactGlobe({
  height = '100%',
  initialCoordinates,
  options,
  width = '100%',
}) {
  const canvasRef = useRef(null);
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    const globe = new Globe({
      canvasElement: canvasRef.current,
      initialCoordinates,
      tooltipElement: tooltipRef.current,
    });
    globe.animate();
    globeRef.current = globe;
    return () => globe.destroy();
  }, [initialCoordinates]);

  // resize
  useEffect(() => {
    const globe = globeRef.current;
    return resize(mountRef.current, globe.resize.bind(globe));
  }, []);

  // update options;
  useEffect(() => {
    const globe = globeRef.current;
    return globe.update(options);
  }, [options]);

  return (
    <div ref={mountRef} style={{ height, width }}>
      <canvas ref={canvasRef} />
      <div ref={tooltipRef} />
    </div>
  );
}
