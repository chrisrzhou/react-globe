import * as TWEEN from 'es6-tween';
import React, { useEffect, useReducer, useRef } from 'react';
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
import {
  useCamera,
  useGlobe,
  useMarkers,
  useRenderer,
  useResize,
} from './hooks';
import reducer, { ActionType } from './reducer';
import Tooltip from './Tooltip';
import * as types from './types';
import { tween } from './utils';

export type CameraOptions = types.Optional<types.CameraOptions>;
export type FocusOptions = types.Optional<types.FocusOptions>;
export type GlobeOptions = types.Optional<types.GlobeOptions>;
export type LightOptions = types.Optional<types.LightOptions>;
export type MarkerOptions = types.Optional<types.MarkerOptions>;

export type Animation = types.Animation;
export type Coordinates = types.Coordinates;
export type EasingFunction = types.EasingFunction;
export type InteractionEvent = types.InteractionEvent;
export type Interactable = types.Interactable;
export type Marker = types.Marker;
export type MarkerCallback = types.MarkerCallback;
export type MarkerType = types.MarkerType;
export type Position = types.Position;
export type Size = types.Size;

export interface Props {
  /** An array of animation steps to power globe animations. */
  animations?: Animation[];
  /** Configure camera options (e.g. rotation, zoom, angles). */
  cameraOptions?: CameraOptions;
  /** A set of [lat, lon] coordinates to be focused on. */
  focus?: Coordinates;
  /** Configure focusing options (e.g. animation duration, distance, easing function). */
  focusOptions?: FocusOptions;
  /** Configure globe options (e.g. textures, background, clouds, glow). */
  globeOptions?: GlobeOptions;
  /** Configure light options (e.g. ambient and point light colors + intensity). */
  lightOptions?: LightOptions;
  /** A set of starting [lat, lon] coordinates for the globe. */
  lookAt?: Coordinates;
  /** An array of data that will render interactive markers on the globe. */
  markers?: Marker[];
  /** Configure marker options (e.g. tooltips, size, marker types, custom marker renderer). */
  markerOptions?: MarkerOptions;
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

function ReactGlobe({
  animations,
  cameraOptions,
  focus: initialFocus,
  focusOptions: initialFocusOptions,
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
}: Props) {
  // merge options with defaults to support incomplete options
  const mergedGlobeOptions = { ...defaultGlobeOptions, ...globeOptions };
  const mergedCameraOptions = { ...defaultCameraOptions, ...cameraOptions };
  const mergedLightOptions = { ...defaultLightOptions, ...lightOptions };
  const mergedFocusOptions = { ...defaultFocusOptions, ...initialFocusOptions };
  const mergedMarkerOptions = { ...defaultMarkerOptions, ...markerOptions };

  const [state, dispatch] = useReducer(reducer, {
    focus: initialFocus,
    focusOptions: mergedFocusOptions,
  });
  const { activeMarker, activeMarkerObject, focus, focusOptions } = state;
  const { enableDefocus } = focusOptions;
  const { activeScale, enableTooltip, getTooltipContent } = mergedMarkerOptions;

  // cache event handlers
  const handleClickMarker = useEventCallback(
    (marker: Marker, markerObject: THREE.Object3D, event: PointerEvent) => {
      dispatch({
        type: ActionType.SetFocus,
        payload: {
          focus: marker.coordinates,
        },
      });
      onClickMarker && onClickMarker(marker, markerObject, event);
    },
  );
  const handleMouseOutMarker = useEventCallback(
    (marker: Marker, markerObject: THREE.Object3D, event: PointerEvent) => {
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
        () => {
          if (activeMarkerObject) {
            activeMarkerObject.scale.set(...from);
          }
        },
      );
      onMouseOutMarker && onMouseOutMarker(marker, activeMarkerObject, event);
    },
  );
  const handleMouseOverMarker = useEventCallback(
    (marker: Marker, markerObject: THREE.Object3D, event: PointerEvent) => {
      dispatch({
        type: ActionType.SetActiveMarker,
        payload: {
          marker,
          markerObject,
        },
      });
      const from = markerObject.scale.toArray() as [number, number, number];
      tween(
        from,
        [activeScale, activeScale, activeScale],
        MARKER_ACTIVE_ANIMATION_DURATION,
        MARKER_ACTIVE_ANIMATION_EASING_FUNCTION,
        () => {
          if (markerObject) {
            markerObject.scale.set(...from);
          }
        },
      );
      onMouseOverMarker && onMouseOverMarker(marker, markerObject, event);
    },
  );
  const handleDefocus = useEventCallback((event: PointerEvent) => {
    if (focus && enableDefocus) {
      dispatch({
        type: ActionType.SetFocus,
        payload: {
          focus: undefined,
        },
      });
      onDefocus && onDefocus(focus, event);
    }
  });

  // initialize THREE instances
  const [mountRef, size] = useResize(initialSize);
  const [rendererRef, canvasRef] = useRenderer(size);
  const globeRef = useGlobe(mergedGlobeOptions, onTextureLoaded);
  const [cameraRef, orbitControlsRef] = useCamera(
    mergedCameraOptions,
    mergedLightOptions,
    focusOptions,
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
    function onMouseUpdate(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener('mousemove', onMouseUpdate, false);
    return () => {
      document.removeEventListener('mousemove', onMouseUpdate, false);
    };
  }, []);

  // update state from props
  useEffect(() => {
    dispatch({
      type: ActionType.SetFocus,
      payload: {
        focus: initialFocus,
        focusOptions: {
          ...defaultFocusOptions,
          ...initialFocusOptions,
        },
      },
    });
  }, [initialFocus, initialFocusOptions]);

  // handle animations
  useEffect(() => {
    let wait = 0;
    const timeouts: NodeJS.Timeout[] = [];
    animations.forEach(animation => {
      const {
        animationDuration,
        coordinates,
        distanceRadiusScale,
        easingFunction,
      } = animation;
      const timeout: NodeJS.Timeout = setTimeout(() => {
        dispatch({
          type: ActionType.Animate,
          payload: {
            focus: coordinates,
            focusOptions: {
              animationDuration,
              distanceRadiusScale,
              easingFunction,
            },
          },
        });
      }, wait);
      timeouts.push(timeout);
      wait += animationDuration;
    });
    return () => {
      timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [animations]);

  // handle scene and rendering loop
  useEffect(() => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const globe = globeRef.current;
    const camera = cameraRef.current;
    let animationFrameID: number;

    // create scene
    const scene = new Scene() as types.InteractableScene;
    globe.add(markersRef.current);
    scene.add(camera);
    scene.add(globe);
    mount.appendChild(renderer.domElement);

    // initialize interaction events
    new Interaction(renderer, scene, camera);
    scene.on('mousemove', event => {
      if (activeMarker) {
        handleMouseOutMarker(
          activeMarker,
          activeMarkerObject,
          event.data.originalEvent,
        );
      }
    });
    if (enableDefocus && focus) {
      scene.on('click', event => {
        handleDefocus(event.data.originalEvent);
      });
    }

    function animate() {
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
  animations: [],
  cameraOptions: defaultCameraOptions,
  focusOptions: defaultFocusOptions,
  globeOptions: defaultGlobeOptions,
  lightOptions: defaultLightOptions,
  lookAt: [1.3521, 103.8198],
  markers: [],
  markerOptions: defaultMarkerOptions,
};

export default ReactGlobe;
