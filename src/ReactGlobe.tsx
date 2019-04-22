import * as TWEEN from 'es6-tween';
import React, { useEffect, useReducer, useRef } from 'react';
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
  Animation,
  CameraOptions,
  Coordinates,
  FocusOptions,
  GlobeOptions,
  LightOptions,
  Marker,
  MarkerOptions,
  Size,
} from './types';
import { tween } from './utils';

export interface Props {
  /** An array of animation steps to power globe animations. */
  animations: Animation[];
  /** Configure camera options (e.g. rotation, zoom, angles). */
  cameraOptions: CameraOptions;
  /** A set of [lat, lon] coordinates to be focused on. */
  focus?: Coordinates;
  /** Configure focusing options (e.g. animation duration, distance, easing function). */
  focusOptions: FocusOptions;
  /** Configure globe options (e.g. textures, background, clouds, glow). */
  globeOptions: GlobeOptions;
  /** Configure light options (ambient and point light colors and intensity). */
  lightOptions: LightOptions;
  /** A set of starting [lat, lon] coordinates for the globe. */
  lookAt: Coordinates;
  /** An array of data that will render interactive markers on the globe. */
  markers: Marker[];
  /** Configure marker options (e.g. tooltips, size, marker types and custom marker renderer). */
  markerOptions: MarkerOptions;
  /** Callback to handle click events of a marker.  Captures the clicked marker, ThreeJS object and pointer event. */
  onClickMarker?: (
    marker: Marker,
    markerObject?: THREE.Object3D,
    event?: PointerEvent,
  ) => void;
  /** Callback to handle defocus events (i.e. clicking the globe after a focus has been applied).  Captures the previously focused coordinates and pointer event. */
  onDefocus?: (previousFocus: Coordinates, event?: PointerEvent) => void;
  /** Callback to handle mouseout events of a marker.  Captures the previously hovered marker, ThreeJS object and pointer event. */
  onMouseOutMarker?: (
    marker: Marker,
    markerObject?: THREE.Object3D,
    event?: PointerEvent,
  ) => void;
  /** Callback to handle mouseover events of a marker.  Captures the hovered marker, ThreeJS object and pointer event. */
  onMouseOverMarker?: (
    marker: Marker,
    markerObject?: THREE.Object3D,
    event?: PointerEvent,
  ) => void;
  /** Set explicit [width, height] values for the canvas container.  This will disable responsive resizing. */
  size?: Size;
}

export default function ReactGlobe({
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
  size: initialSize,
}: Props): React.ReactElement {
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

  const handleClickMarker = useEventCallback(
    (
      marker: Marker,
      markerObject: THREE.Object3D,
      event: PointerEvent,
    ): void => {
      dispatch({
        type: ActionType.SetFocus,
        payload: marker.coordinates,
      });
      onClickMarker && onClickMarker(marker, markerObject, event);
    },
  );

  const handleMouseOutMarker = useEventCallback(
    (
      marker: Marker,
      markerObject: THREE.Object3D,
      event: PointerEvent,
    ): void => {
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
        (): void => {
          if (activeMarkerObject) {
            activeMarkerObject.scale.set(...from);
          }
        },
      );
      onMouseOutMarker && onMouseOutMarker(marker, activeMarkerObject, event);
    },
  );

  const handleMouseOverMarker = useEventCallback(
    (
      marker: Marker,
      markerObject: THREE.Object3D,
      event: PointerEvent,
    ): void => {
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
        (): void => {
          if (markerObject) {
            markerObject.scale.set(...from);
          }
        },
      );
      onMouseOverMarker && onMouseOverMarker(marker, markerObject, event);
    },
  );

  const handleDefocus = useEventCallback(
    (event: PointerEvent): void => {
      if (focus && enableDefocus) {
        dispatch({
          type: ActionType.SetFocus,
          payload: undefined,
        });
        onDefocus && onDefocus(focus, event);
      }
    },
  );

  // initialize THREE instances
  const [mountRef, size] = useResize(initialSize);
  const [rendererRef, canvasRef] = useRenderer(size);
  const globeRef = useGlobe(mergedGlobeOptions);
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
  useEffect((): React.EffectCallback => {
    function onMouseUpdate(e: MouseEvent): void {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener('mousemove', onMouseUpdate, false);
    return (): void => {
      document.removeEventListener('mousemove', onMouseUpdate, false);
    };
  }, []);

  // sync state with props
  useEffect((): void => {
    dispatch({
      type: ActionType.SetFocus,
      payload: initialFocus,
    });
  }, [initialFocus]);

  // handle animations
  useEffect((): React.EffectCallback => {
    let wait = 0;
    const timeouts: NodeJS.Timeout[] = [];

    animations.forEach(
      (animation, i): void => {
        const {
          animationDuration,
          coordinates,
          distanceRadiusScale,
          easingFunction,
        } = animation;
        const timeout: NodeJS.Timeout = setTimeout((): void => {
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
          if (i === animations.length - 1) {
            dispatch({
              type: ActionType.SetFocus,
              payload: undefined,
            });
          }
        }, wait);
        timeouts.push(timeout);
        wait += animationDuration;
      },
    );

    return (): void => {
      timeouts.forEach(
        (timeout): void => {
          clearTimeout(timeout);
        },
      );
    };
  }, [animations]);

  // handle scene and rendering loop
  useEffect((): React.EffectCallback => {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const globe = globeRef.current;
    const camera = cameraRef.current;
    let animationFrameID: number;

    // create scene
    const scene = new Scene();
    globe.add(markersRef.current);
    scene.add(camera);
    scene.add(globe);
    mount.appendChild(renderer.domElement);

    // initialize interaction events
    new Interaction(renderer, scene, camera);
    // @ts-ignore: three.interaction is untyped
    scene.on(
      'mousemove',
      // @ts-ignore: three.interaction is untyped
      (event): void => {
        if (activeMarker) {
          handleMouseOutMarker(
            activeMarker,
            activeMarkerObject,
            event.data.originalEvent,
          );
        }
      },
    );
    if (enableDefocus && focus) {
      // @ts-ignore: three.interaction is untyped
      scene.on(
        'click',
        // @ts-ignore: three.interaction is untyped
        (event): void => {
          handleDefocus(event.data.originalEvent);
        },
      );
    }

    function animate(): void {
      renderer.render(scene, cameraRef.current);
      TWEEN.update();
      orbitControlsRef.current.update();
      animationFrameID = requestAnimationFrame(animate);
    }
    animate();

    return (): void => {
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
