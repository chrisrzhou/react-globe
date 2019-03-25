import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import * as React from 'react';
import * as THREE from 'three';

import { Datum, MarkersOptions, MarkersType } from '../types';
import { coordinatesToPosition } from '../utils';

const { useEffect, useRef } = React;

const SEGMENTS = 10;

export default function useMarkers<T>(
  data: Datum[],
  radius: number,
  { radiusScaleRange, renderer, type }: MarkersOptions,
): React.RefObject<THREE.Group> {
  const markersRef = useRef<THREE.Group>(new THREE.Group());
  const unitRadius = radius * 0.01;

  // init
  useEffect(() => {
    const sizeScale = scaleLinear()
      .domain([min(data, d => d.value), max(data, d => d.value)])
      .range([radius * radiusScaleRange[0], radius * radiusScaleRange[1]]);

    const markers = markersRef.current;
    markers.children = []; // clear data before adding
    data.forEach(d => {
      const { color, coordinates, value } = d;
      const size = sizeScale(value);
      const material = new THREE.MeshBasicMaterial({ color });
      let radiusOffset = 0;
      let marker;
      if (renderer) {
        // TODO: implement custom renderer
      } else {
        switch (type) {
          case MarkersType.Bar:
            marker = new THREE.Mesh(
              new THREE.BoxGeometry(
                unitRadius,
                unitRadius,
                size,
                SEGMENTS,
                SEGMENTS,
              ),
              material,
            );
            break;
          case MarkersType.Dot:
          default:
            marker = new THREE.Mesh(
              new THREE.SphereGeometry(size, SEGMENTS, SEGMENTS),
              material,
            );
            radiusOffset = size;
        }
      }

      // place markers
      const position = coordinatesToPosition(
        coordinates,
        radius + radiusOffset,
      );
      marker.position.set(...position);
      marker.lookAt(new THREE.Vector3(0, 0, 0));
      markers.add(marker);
    });
  }, [data, radius, radiusScaleRange, renderer, type, unitRadius]);

  return markersRef;
}
