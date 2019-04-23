import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useEffect, useRef } from 'react';
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  Vector3,
} from 'three';

import {
  MARKER_DEFAULT_COLOR,
  MARKER_SEGMENTS,
  MARKER_UNIT_RADIUS_SCALE,
  RADIUS,
} from '../defaults';
import { createGlowMesh } from '../three-glow-mesh';
import { Marker, MarkerCallback, MarkerOptions, MarkerType } from '../types';
import { coordinatesToPosition, tween } from '../utils';

interface Handlers {
  onClick: MarkerCallback;
  onMouseOver: MarkerCallback;
}

export default function useMarkers<T>(
  markers: Marker[],
  {
    animationDuration,
    enableGlow,
    glowCoefficient,
    glowPower,
    glowRadiusScale,
    radiusScaleRange,
    renderer,
    type,
  }: MarkerOptions,
  { onClick, onMouseOver }: Handlers,
): React.RefObject<THREE.Group> {
  const markersRef = useRef<THREE.Group>(new Group());
  const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;

  // init
  useEffect((): void => {
    const sizeScale = scaleLinear()
      .domain([
        min(markers, (marker): number => marker.value),
        max(markers, (marker): number => marker.value),
      ])
      .range([RADIUS * radiusScaleRange[0], RADIUS * radiusScaleRange[1]]);

    markersRef.current.children = []; // clear data before adding
    markers.forEach(
      (marker): void => {
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
          const mesh = new Mesh();
          tween(
            from,
            to,
            animationDuration,
            ['Linear', 'None'],
            (): void => {
              switch (type) {
                case MarkerType.Bar:
                  mesh.geometry = new BoxGeometry(
                    unitRadius,
                    unitRadius,
                    from.size,
                  );
                  mesh.material = new MeshLambertMaterial({
                    color,
                  });
                  break;
                case MarkerType.Dot:
                default:
                  mesh.geometry = new SphereGeometry(
                    from.size,
                    MARKER_SEGMENTS,
                    MARKER_SEGMENTS,
                  );
                  mesh.material = new MeshBasicMaterial({ color });
                  if (enableGlow) {
                    // add glow
                    const glowMesh = createGlowMesh(
                      mesh.geometry.clone() as THREE.Geometry,
                      from.size * glowRadiusScale,
                      {
                        color,
                        coefficient: glowCoefficient,
                        power: glowPower,
                      },
                      false,
                    );
                    mesh.children = [];
                    mesh.add(glowMesh);
                  }
              }
            },
          );
          markerObject = mesh;
        }

        let heightOffset = 0;
        if (type === MarkerType.Dot) {
          heightOffset = (size * (1 + glowRadiusScale)) / 2;
        }

        // place markers
        const position = coordinatesToPosition(
          coordinates,
          RADIUS + heightOffset,
        );
        markerObject.position.set(...position);
        markerObject.lookAt(new Vector3(0, 0, 0));

        // handle events
        // @ts-ignore: three.interaction is untyped
        function handleClick(event): void {
          event.stopPropagation();
          onClick(marker, markerObject, event.data.originalEvent);
        }
        // @ts-ignore: three.interaction is untyped
        markerObject.on('click', handleClick);
        // @ts-ignore: three.interaction is untyped
        markerObject.on('touchstart', handleClick);
        // @ts-ignore: three.interaction is untyped
        markerObject.on(
          'mousemove',
          // @ts-ignore: three.interaction is untyped
          (event): void => {
            event.stopPropagation();
            onMouseOver(marker, markerObject, event.data.originalEvent);
          },
        );
        markersRef.current.add(markerObject);
      },
    );
  }, [
    animationDuration,
    enableGlow,
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
