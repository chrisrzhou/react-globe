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
  MARKER_ACTIVE_ANIMATION_DURATION,
  MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
} from './defaults';
import {
  useCamera,
  useEventCallback,
  useGlobe,
  useMarkers,
  useRenderer,
  useResize,
} from './hooks';
import reducer from './reducer';
import Tooltip from './Tooltip';
import {
  ActionType,
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
import { tween } from './utils';

const { useEffect, useReducer, useRef } = React;

export interface Props {
  cameraOptions: CameraOptions;
  focus?: Coordinates;
  focusOptions: FocusOptions;
  globeOptions: GlobeOptions;
  lightOptions: LightsOptions;
  lookAt: Coordinates;
  markers: Marker[];
  markerOptions: MarkerOptions;
  onClickMarker?: MarkerCallback;
  onDefocus?: (previousFocus: Coordinates, event?: PointerEvent) => void;
  onMouseOutMarker?: MarkerCallback;
  onMouseOverMarker?: MarkerCallback;
  size: Size;
}

function ReactGlobe({
  cameraOptions,
  focus: initialFocus,
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
  size: initialSize,
}: Props): React.ReactElement {
  // merge options with defaults to support incomplete options
  const mergedGlobeOptions = { ...defaultGlobeOptions, ...globeOptions };
  const mergedCameraOptions = { ...defaultCameraOptions, ...cameraOptions };
  const mergedLightOptions = { ...defaultLightOptions, ...lightOptions };
  const mergedFocusOptions = { ...defaultFocusOptions, ...focusOptions };
  const mergedMarkerOptions = { ...defaultMarkerOptions, ...markerOptions };

  const [state, dispatch] = useReducer(reducer, {
    focus: initialFocus,
  });
  const { activeMarker, activeMarkerObject, focus } = state;
  const { enableDefocus } = focusOptions;
  const { activeScale, enableTooltip, getTooltipContent } = mergedMarkerOptions;

  const handleClickMarker = useEventCallback(
    (
      marker: Marker,
      event: PointerEvent,
      markerObject: THREE.Object3D,
    ): void => {
      dispatch({
        type: ActionType.SetFocus,
        payload: marker.coordinates,
      });
      onClickMarker && onClickMarker(marker, event, markerObject);
    },
  );

  const handleMouseOutMarker = useEventCallback(
    (marker: Marker, event: PointerEvent): void => {
      dispatch({
        type: ActionType.SetActiveMarker,
        payload: {
          activeMarker: undefined,
          activeMarkerObject: undefined,
        },
      });
      const from: [number, number, number] = [
        activeScale,
        activeScale,
        activeScale,
      ];
      tween(
        from,
        [1, 1, 1],
        MARKER_ACTIVE_ANIMATION_DURATION,
        MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
        () => activeMarkerObject.scale.set(...from),
      );
      onMouseOutMarker && onMouseOutMarker(marker, event, activeMarkerObject);
    },
  );

  const handleMouseOverMarker = useEventCallback(
    (
      marker: Marker,
      event: PointerEvent,
      markerObject: THREE.Object3D,
    ): void => {
      dispatch({
        type: ActionType.SetActiveMarker,
        payload: {
          marker,
          markerObject,
        },
      });
      const from: [number, number, number] = [1, 1, 1];
      tween(
        from,
        [activeScale, activeScale, activeScale],
        MARKER_ACTIVE_ANIMATION_DURATION,
        MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
        () => markerObject.scale.set(...from),
      );
      onMouseOverMarker && onMouseOverMarker(marker, event, markerObject);
    },
  );

  const handleDefocus = useEventCallback((event: PointerEvent) => {
    if (focus && enableDefocus) {
      dispatch({
        type: ActionType.SetFocus,
        payload: undefined,
      });
      onDefocus && onDefocus(focus, event);
    }
  });

  // initialize THREE instances
  const [mountRef, size] = useResize(initialSize);
  const [rendererRef, canvasRef] = useRenderer(size);
  const globeRef = useGlobe(mergedGlobeOptions);
  const [cameraRef, orbitControlsRef] = useCamera(
    mergedCameraOptions,
    mergedLightOptions,
    mergedFocusOptions,
    rendererRef,
    size,
    lookAt,
    focus,
  );
  const markersRef = useMarkers(markers, mergedMarkerOptions, {
    onClick: handleClickMarker,
    onMouseOver: handleMouseOverMarker,
  });
  const mouseRef = useRef<{ x: number; y: number }>();

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
    dispatch({
      type: ActionType.SetFocus,
      payload: initialFocus,
    });
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
    new Interaction(renderer, scene, camera);
    // @ts-ignore: three.interaction is untyped
    scene.on('mousemove', event => {
      if (activeMarker) {
        handleMouseOutMarker(
          activeMarker,
          event.data.originalEvent,
          activeMarkerObject,
        );
      }
    });
    if (enableDefocus && focus) {
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
    activeMarker,
    activeMarkerObject,
    cameraRef,
    enableDefocus,
    focus,
    globeRef,
    handleDefocus,
    handleMouseOutMarker,
    markersRef,
    mountRef,
    orbitControlsRef,
    rendererRef,
  ]);

  return (
    <div ref={mountRef} style={{ height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {enableTooltip && activeMarker && (
        <Tooltip
          offset={10}
          x={mouseRef.current.x}
          y={mouseRef.current.y}
          content={getTooltipContent(activeMarker)}
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
  lookAt: [1.3521, 103.8198],
  markers: [],
  markerOptions: defaultMarkerOptions,
};

export default ReactGlobe;
