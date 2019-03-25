import * as TWEEN from 'es6-tween';
import * as React from 'react';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';

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
  FocusOptions,
  GlobeOptions,
  LightsOptions,
  Marker,
  MarkersOptions,
  Size,
} from './types';

const { useEffect, useState } = React;

export interface Props {
  cameraOptions: CameraOptions;
  focus?: Coordinates;
  focusOptions: FocusOptions;
  globeOptions: GlobeOptions;
  lightOptions: LightsOptions;
  markers: Marker[];
  markersOptions: MarkersOptions;
  onDefocus?: (previousCoordinates: Coordinates) => void;
  onClickMarker?: (marker: Marker) => void;
  onHoverMarker?: (marker: Marker) => void;
  size: Size;
}

function ReactGlobe({
  cameraOptions,
  focus: initialFocus,
  focusOptions,
  globeOptions,
  lightOptions,
  markers,
  markersOptions,
  onClickMarker,
  onDefocus,
  onHoverMarker,
  size: initialSize,
}: Props): React.ReactElement {
  const [focus, setFocus] = useState<Coordinates>(initialFocus);

  // sync state with props
  useEffect(() => {
    setFocus(initialFocus);
  }, [initialFocus]);

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

  function handleClickMarker(marker: Marker): void {
    setFocus(marker.coordinates);
    if (onClickMarker) {
      onClickMarker(marker);
    }
  }

  function handleHoverMarker(marker: Marker): void {
    if (onHoverMarker) {
      onHoverMarker(marker);
    }
  }

  const markersRef = useMarkers(markers, radius, markersOptions, {
    onClick: handleClickMarker,
    onHover: handleHoverMarker,
  });

  // handle animation effect
  useEffect(() => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    let animationFrameID: number;

    // create scene
    const scene = new THREE.Scene();
    scene.add(camera);
    scene.add(globeRef.current);
    scene.add(markersRef.current);
    mount.appendChild(renderer.domElement);

    // initialize interaction events
    new Interaction(renderer, scene, camera);
    if (focusOptions.enableDefocus && focus) {
      scene.on('click', () => {
        onDefocus && onDefocus(focus);
        setFocus(undefined);
      });
    }

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
    focus,
    focusOptions.enableDefocus,
    globeRef,
    markersRef,
    mountRef,
    onDefocus,
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
  focusOptions: defaultFocusOptions,
  globeOptions: defaultGlobeOptions,
  lightOptions: defaultLightOptions,
  markers: [],
  markersOptions: defaultMarkersOptions,
};

export default ReactGlobe;
