// @ts-ignore: es6-tween is untyped
import * as TWEEN from 'es6-tween';
import * as React from 'react';
import * as THREE from 'three';
// @ts-ignore: three.interaction is untyped
import { Interaction } from 'three.interaction';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
} from './defaults';
import {
  useCamera,
  useEventCallback,
  useGlobe,
  useMarkers,
  useRenderer,
  useResize,
} from './hooks';
import Tooltip from './Tooltip';
import {
  CameraOptions,
  Coordinates,
  FocusOptions,
  GlobeOptions,
  LightsOptions,
  Marker,
  MarkerCallback,
  MarkerOptions,
  Size,
} from './types';

const { useEffect, useRef, useState } = React;

export interface Props {
  cameraOptions: CameraOptions;
  focus?: Coordinates;
  focusOptions: FocusOptions;
  globeOptions: GlobeOptions;
  lightOptions: LightsOptions;
  markers: Marker[];
  markerOptions: MarkerOptions;
  onClickMarker?: MarkerCallback;
  onDefocus?: (previousFocus: Coordinates, event?: PointerEvent) => void;
  onMouseOutMarker?: MarkerCallback;
  onMouseOverMarker?: MarkerCallback;
  size: Size;
  start: Coordinates;
}

function ReactGlobe({
  cameraOptions,
  focus: initialFocus,
  focusOptions,
  globeOptions,
  lightOptions,
  markers,
  markerOptions,
  onClickMarker,
  onDefocus,
  onMouseOutMarker,
  onMouseOverMarker,
  size: initialSize,
  start,
}: Props): React.ReactElement {
  // merge options with defaults to support incomplete options
  const mergedGlobeOptions = { ...defaultGlobeOptions, ...globeOptions };
  const mergedCameraOptions = { ...defaultCameraOptions, ...cameraOptions };
  const mergedLightOptions = { ...defaultLightOptions, ...lightOptions };
  const mergedFocusOptions = { ...defaultFocusOptions, ...focusOptions };
  const mergedMarkerOptions = { ...defaultMarkerOptions, ...markerOptions };

  const [focus, setFocus] = useState<Coordinates>(initialFocus);
  const [hoveredMarker, setHoveredMarker] = useState<Marker>();
  const mouseRef = useRef<{ x: number; y: number }>();

  const handleClickMarker = useEventCallback(
    (marker: Marker, event: PointerEvent, target: any): void => {
      setFocus(marker.coordinates);
      setHoveredMarker(undefined);
      onClickMarker && onClickMarker(marker, event, target);
    },
  );

  const handleMouseOutMarker = useEventCallback(
    (marker: Marker, event: PointerEvent, target: any): void => {
      setHoveredMarker(undefined);
      onMouseOutMarker && onMouseOutMarker(marker, event, target);
    },
  );

  const handleMouseOverMarker = useEventCallback(
    (marker: Marker, event: PointerEvent, target: any): void => {
      setHoveredMarker(marker);
      onMouseOverMarker && onMouseOverMarker(marker, event, target);
    },
  );

  const handleDefocus = useEventCallback((event: PointerEvent) => {
    if (focus && onDefocus) {
      onDefocus(focus, event);
      setFocus(undefined);
    }
  });

  console.log('render');

  // initialize THREE instances
  const [mountRef, size] = useResize(initialSize);
  const [rendererRef, canvasRef] = useRenderer(size);
  const globeRef = useGlobe(mergedGlobeOptions);
  const [cameraRef, orbitControlsRef] = useCamera(
    mergedCameraOptions,
    mergedLightOptions,
    mergedFocusOptions,
    rendererRef,
    size[0] / size[1],
    start,
    focus,
  );
  const markersRef = useMarkers(markers, mergedMarkerOptions, {
    onClick: handleClickMarker,
    onMouseOver: handleMouseOverMarker,
  });

  // track mouse position
  useEffect(() => {
    function onMouseUpdate(e: MouseEvent): void {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener('mousemove', onMouseUpdate, false);
    return () => {
      document.removeEventListener('mousemove', onMouseUpdate, false);
    };
  }, []);

  // sync state with props
  useEffect(() => {
    setFocus(initialFocus);
  }, [initialFocus]);

  // handle animation effect
  useEffect(() => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const globe = globeRef.current;
    const camera = cameraRef.current;
    let animationFrameID: number;

    // create scene
    const scene = new THREE.Scene();
    globe.add(markersRef.current);
    scene.add(camera);
    scene.add(globe);
    mount.appendChild(renderer.domElement);

    // initialize interaction events
    new Interaction(renderer, scene, camera, {
      interactionFrequency: 100,
    });
    // @ts-ignore: three.interaction is untyped
    scene.on('mousemove', event => {
      if (hoveredMarker) {
        handleMouseOutMarker(
          hoveredMarker,
          event.data.originalEvent,
          event.data.target,
        );
      }
    });
    if (mergedFocusOptions.enableDefocus && focus) {
      // @ts-ignore: three.interaction is untyped
      scene.on('click', event => {
        handleDefocus(event.data.originalEvent);
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
    globeRef,
    handleDefocus,
    handleMouseOutMarker,
    hoveredMarker,
    markersRef,
    mergedFocusOptions.enableDefocus,
    mountRef,
    orbitControlsRef,
    rendererRef,
  ]);

  return (
    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {mergedMarkerOptions.enableTooltip && hoveredMarker && (
        <Tooltip
          offset={10}
          x={mouseRef.current.x}
          y={mouseRef.current.y}
          content={mergedMarkerOptions.getTooltipContent(hoveredMarker)}
        />
      )}
    </div>
  );
}

ReactGlobe.defaultProps = {
  cameraOptions: defaultCameraOptions,
  focusOptions: defaultFocusOptions,
  globeOptions: defaultGlobeOptions,
  lightOptions: defaultLightOptions,
  markers: [],
  markerOptions: defaultMarkerOptions,
  start: [1.3521, 103.8198],
};

export default ReactGlobe;
