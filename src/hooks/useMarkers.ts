import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import * as React from 'react';
import * as THREE from 'three';

import {
  MARKER_ANIMATION_DURATION,
  MARKER_DEFAULT_COLOR,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from '../defaults';
import { createGlowMesh } from '../three-glowmesh';
import { Marker, MarkerCallback, MarkerOptions, MarkerType } from '../types';
import { coordinatesToPosition, tween } from '../utils';

const { useEffect, useRef } = React;

interface Handlers {
  onClick: MarkerCallback;
  onMouseOver: MarkerCallback;
}

export default function useMarkers<T>(
  markers: Marker[],
  {
    glowCoefficient,
    glowPower,
    glowRadiusScale,
    radiusScaleRange,
    renderer,
    type,
  }: MarkerOptions,
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
      const shouldUseCustomMarker = renderer !== undefined;
      const { coordinates, value } = marker;

      const color = marker.color || MARKER_DEFAULT_COLOR;
      const size = sizeScale(value);
      let radiusOffset = 0;
      let markerObject: THREE.Mesh = new THREE.Mesh();

      if (shouldUseCustomMarker) {
        // TODO: implement custom renderer
      } else {
        let from = { size: 0 };
        const to = { size };
        tween(from, to, MARKER_ANIMATION_DURATION, ['Linear', 'None'], () => {
          switch (type) {
            case MarkerType.Bar:
              markerObject.geometry = new THREE.BoxGeometry(
                unitRadius,
                unitRadius,
                from.size,
              );
              markerObject.material = new THREE.MeshLambertMaterial({
                color,
              });
              break;
            case MarkerType.Dot:
            default:
              markerObject.geometry = new THREE.SphereGeometry(
                from.size,
                MARKER_SEGMENTS,
                MARKER_SEGMENTS,
              );
              markerObject.material = new THREE.MeshBasicMaterial({ color });
              radiusOffset = size;
              // add glow
              const glowMesh = createGlowMesh(
                markerObject.geometry as THREE.Geometry,
                from.size * glowRadiusScale,
                {
                  color,
                  coefficient: glowCoefficient,
                  power: glowPower,
                },
                false,
              );
              markerObject.children = [];
              markerObject.add(glowMesh);
          }
        });
      }

      // place markers
      const position = coordinatesToPosition(
        coordinates,
        RADIUS + radiusOffset,
      );
      markerObject.position.set(...position);
      markerObject.lookAt(new THREE.Vector3(0, 0, 0));

      // handle events
      // @ts-ignore: three.interaction is untyped
      markerObject.on('click', event => {
        console.log(event);
        event.stopPropagation();
        onClick(marker, event.data.originalEvent, event.data.target);
      });
      // @ts-ignore: three.interaction is untyped
      markerObject.on('mousemove', event => {
        event.stopPropagation();
        onMouseOver(marker, event.data.originalEvent, event.data.target);
      });

      markersRef.current.add(markerObject);
    });
  }, [
    glowCoefficient,
    glowPower,
    glowRadiusScale,
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
