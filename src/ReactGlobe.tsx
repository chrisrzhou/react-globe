import * as TWEEN from 'es6-tween';
import * as React from 'react';
import * as THREE from 'three';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkersOptions,
} from './defaults';
import {
  useCamera,
  useGlobe,
  useMarkers,
  useRenderer,
  useResize,
} from './hooks';
import {
  CameraOptions,
  Coordinates,
  Datum,
  FocusOptions,
  GlobeOptions,
  LightsOptions,
  MarkersOptions,
  Size,
} from './types';

const { useEffect } = React;

export interface Props {
  cameraOptions: CameraOptions;
  data: Datum[];
  focus?: Coordinates;
  focusOptions: FocusOptions;
  globeOptions: GlobeOptions;
  lightOptions: LightsOptions;
  markersOptions: MarkersOptions;
  size: Size;
}

function ReactGlobe({
  cameraOptions,
  data,
  focus,
  focusOptions,
  globeOptions,
  lightOptions,
  markersOptions,
  size: initialSize,
}: Props): React.ReactElement {
  const { radius } = globeOptions;
  // initialize THREE instances
  const [mountRef, size] = useResize(initialSize);
  const [rendererRef, canvasRef] = useRenderer(size);
  const globeRef = useGlobe({ ...defaultGlobeOptions, ...globeOptions });
  const [cameraRef, orbitControlsRef] = useCamera(
    { ...defaultCameraOptions, ...cameraOptions },
    { ...defaultLightOptions, ...lightOptions },
    { ...defaultFocusOptions, ...focusOptions },
    rendererRef,
    size[0] / size[1],
    radius,
    focus,
  );
  const markersRef = useMarkers(data, radius, markersOptions);

  // handle animation effect
  useEffect(() => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    let animationFrameID: number;

    // create scene
    const scene = new THREE.Scene();
    scene.add(cameraRef.current);
    scene.add(globeRef.current);
    scene.add(markersRef.current);
    mount.appendChild(renderer.domElement);

    function animate(): void {
      renderer.render(scene, cameraRef.current);
      TWEEN.update();
      orbitControlsRef.current.update();
      animationFrameID = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      if (animationFrameID) {
        cancelAnimationFrame(animationFrameID);
      }
      mount.removeChild(renderer.domElement);
    };
  }, [
    cameraRef,
    globeRef,
    markersRef,
    mountRef,
    orbitControlsRef,
    rendererRef,
  ]);

  return (
    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

ReactGlobe.defaultProps = {
  cameraOptions: defaultCameraOptions,
  data: [],
  focusOptions: defaultFocusOptions,
  globeOptions: defaultGlobeOptions,
  lightOptions: defaultLightOptions,
  markersOptions: defaultMarkersOptions,
};

export default ReactGlobe;
