import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import * as React from 'react';
import * as THREE from 'three';

import { createGlowMesh } from '../three-glowmesh';
import { Marker, MarkersOptions, MarkersType } from '../types';
import { coordinatesToPosition } from '../utils';

const { useEffect, useRef } = React;

const DEFAULT_MARKER_COLOR = '#D1D1D1';
const SEGMENTS = 10;

interface Handlers {
  onClick: (marker: Marker) => void;
  onHover: (marker: Marker) => void;
}

export default function useMarkers<T>(
  markers: Marker[],
  radius: number,
  {
    enableGlow,
    glowCoefficient,
    glowPower,
    glowRadiusScale,
    radiusScaleRange,
    renderer,
    type,
  }: MarkersOptions,
  { onClick, onHover }: Handlers,
): React.RefObject<THREE.Group> {
  const markersRef = useRef<THREE.Group>(new THREE.Group());
  const unitRadius = radius * 0.01;

  // init
  useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([
        min(markers, marker => marker.value),
        max(markers, marker => marker.value),
      ])
      .range([radius * radiusScaleRange[0], radius * radiusScaleRange[1]]);

    markersRef.current.children = []; // clear data before adding
    markers.forEach(marker => {
      const { coordinates, value } = marker;
      const color = marker.color || DEFAULT_MARKER_COLOR;
      const size = sizeScale(value);
      let radiusOffset = 0;
      let markerObject: THREE.Mesh;
      if (renderer) {
        // TODO: implement custom renderer
      } else {
        switch (type) {
          case MarkersType.Bar:
            markerObject = new THREE.Mesh(
              new THREE.BoxGeometry(
                unitRadius,
                unitRadius,
                size,
                SEGMENTS,
                SEGMENTS,
              ),
              new THREE.MeshLambertMaterial({ color }),
            );
            break;
          case MarkersType.Dot:
          default:
            markerObject = new THREE.Mesh(
              new THREE.SphereGeometry(size, SEGMENTS, SEGMENTS),
              new THREE.MeshBasicMaterial({ color }),
            );
            radiusOffset = size;
        }
        if (enableGlow) {
          const glowMesh = createGlowMesh(
            markerObject.geometry as THREE.Geometry,
            size * glowRadiusScale,
            {
              color,
              coefficient: glowCoefficient,
              power: glowPower,
            },
            false,
          );
          markerObject.add(glowMesh);
        }
      }

      // place markers
      const position = coordinatesToPosition(
        coordinates,
        radius + radiusOffset,
      );
      markerObject.position.set(...position);
      markerObject.lookAt(new THREE.Vector3(0, 0, 0));

      // handle events
      markerObject.on('click', event => {
        event.stopPropagation();
        onClick(marker);
      });
      markerObject.on('mouseover', event => {
        event.stopPropagation();
        onHover(marker);
      });
      markersRef.current.add(markerObject);
    });
  }, [
    enableGlow,
    glowCoefficient,
    glowPower,
    glowRadiusScale,
    markers,
    onClick,
    onHover,
    radius,
    radiusScaleRange,
    renderer,
    type,
    unitRadius,
  ]);

  return markersRef;
}
