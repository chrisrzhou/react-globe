import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import * as React from 'react';
import * as THREE from 'three';

import {
  MARKER_ANIMATION_DURATION,
  MARKER_DEFAULT_COLOR,
  MARKER_GLOW_COEFFICIENT,
  MARKER_GLOW_POWER,
  MARKER_GLOW_RADIUS_SCALE,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from '../defaults';
import { createGlowMesh } from '../three-glow-mesh';
import { Marker, MarkerCallback, MarkerOptions, MarkerType } from '../types';
import { coordinatesToPosition, tween } from '../utils';

const { useEffect, useRef } = React;

interface Handlers {
  onClick: MarkerCallback;
  onMouseOver: MarkerCallback;
}

export default function useMarkers<T>(
  markers: Marker[],
  { radiusScaleRange, renderer, type }: MarkerOptions,
  { onClick, onMouseOver }: Handlers,
): React.RefObject<THREE.Group> {
  const markersRef = useRef<THREE.Group>(new THREE.Group());
  const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;

  // init
  useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([
        min(markers, marker => marker.value),
        max(markers, marker => marker.value),
      ])
      .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

    markersRef.current.children = []; // clear data before adding
    markers.forEach(marker => {
      const { coordinates, value } = marker;
      const shouldUseCustomMarker = renderer !== undefined;

      const color = marker.color || MARKER_DEFAULT_COLOR;
      const size = sizeScale(value);
      let markerObject: THREE.Object3D;

      if (shouldUseCustomMarker) {
        markerObject = renderer(marker);
      } else {
        let from = { size: 0 };
        const to = { size };
        const mesh = new THREE.Mesh();
        tween(from, to, MARKER_ANIMATION_DURATION, ['Linear', 'None'], () => {
          switch (type) {
            case MarkerType.Bar:
              mesh.geometry = new THREE.BoxGeometry(
                unitRadius,
                unitRadius,
                from.size,
              );
              mesh.material = new THREE.MeshLambertMaterial({
                color,
              });
              break;
            case MarkerType.Dot:
            default:
              mesh.geometry = new THREE.SphereGeometry(
                from.size,
                MARKER_SEGMENTS,
                MARKER_SEGMENTS,
              );
              mesh.material = new THREE.MeshBasicMaterial({ color });
              // add glow
              const glowMesh = createGlowMesh(
                mesh.geometry.clone() as THREE.Geometry,
                from.size * MARKER_GLOW_RADIUS_SCALE,
                {
                  color,
                  coefficient: MARKER_GLOW_COEFFICIENT,
                  power: MARKER_GLOW_POWER,
                },
                false,
              );
              mesh.children = [];
              mesh.add(glowMesh);
          }
        });
        markerObject = mesh;
      }

      let heightOffset = 0;
      if (type === MarkerType.Dot) {
        heightOffset = (size * (1 + MARKER_GLOW_RADIUS_SCALE)) / 2;
      }

      // place markers
      const position = coordinatesToPosition(
        coordinates,
        RADIUS + heightOffset,
      );
      markerObject.position.set(...position);
      markerObject.lookAt(new THREE.Vector3(0, 0, 0));

      // handle events
      // @ts-ignore: three.interaction is untyped
      markerObject.on('click', event => {
        event.stopPropagation();
        onClick(marker, markerObject, event.data.originalEvent);
      });
      // @ts-ignore: three.interaction is untyped
      markerObject.on('mousemove', event => {
        event.stopPropagation();
        onMouseOver(marker, markerObject, event.data.originalEvent);
      });
      markersRef.current.add(markerObject);
    });
  }, [
    markers,
    onClick,
    onMouseOver,
    radiusScaleRange,
    renderer,
    type,
    unitRadius,
  ]);

  return markersRef;
}
