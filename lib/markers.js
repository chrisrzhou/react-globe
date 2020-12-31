import { scaleLinear } from 'd3-scale';
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import { createGlowMesh } from 'three-glow-mesh';

import { RADIUS, MarkerTypes } from './enums';
import { coordinatesToPosition, tween } from './utils';

const MARKER_DEFAULT_COLOR = 'gold';
const MARKER_SEGMENTS = 10;
const MARKER_UNIT_RADIUS_SCALE = 0.01;

export function createMarkerObjects() {
  const markerObjects = new Group();
  markerObjects.name = 'markers';

  return markerObjects;
}

export function updateMarkerObjects(
  markerObjects,
  { callbacks, markers, options },
) {
  const {
    markerExitAnimationDuration,
    markerExitEasingFunction,
    markerRadiusScaleRange,
  } = options;

  const markerValues = markers.map(marker => marker.value);
  const markerIdSet = new Set(markers.map(marker => marker.id));
  const [radiusScaleMin, radiusScaleMax] = markerRadiusScaleRange;

  const sizeScale = scaleLinear()
    .domain([
      Math.min.apply(null, markerValues),
      Math.max.apply(null, markerValues),
    ])
    .range([RADIUS * radiusScaleMin, RADIUS * radiusScaleMax]);

  markers.forEach(marker => {
    const { id, value } = marker;
    const size = sizeScale(value);

    // create new marker objects if non-existent
    let markerObject = markerObjects.children.find(
      object => object.marker.id === marker.id,
    );
    if (!markerObject) {
      markerObject = createMarkerObject(marker, options, size);
      markerObject.name = id;
      markerObjects.add(markerObject);
    }
    markerObject.marker = marker;
  });

  // apply marker callbacks and remove marker objects that are stale
  markerObjects.children.forEach(markerObject => {
    if (!markerIdSet.has(markerObject.marker.id)) {
      const from = markerObject.scale.toArray();
      tween({
        from,
        to: [0, 0, 0],
        animationDuration: markerExitAnimationDuration,
        easingFunction: markerExitEasingFunction,
        onUpdate: () => {
          if (markerObject) {
            markerObject.scale.set(...from);
          }
        },
        onEnd: () => {
          markerObjects.remove(markerObject);
        },
      });
    }
    applyCallbacks(markerObject, callbacks);
  });
}

function createMarkerObject(marker, options, size) {
  const {
    enableMarkerGlow,
    markerEnterAnimationDuration,
    markerEnterEasingFunction,
    markerGlowCoefficient,
    markerGlowPower,
    markerGlowRadiusScale,
    markerOffsetRadiusScale,
    markerRenderer,
    markerType,
  } = options;
  const unitRadius = RADIUS * MARKER_UNIT_RADIUS_SCALE;

  let markerObject;
  if (markerRenderer) {
    markerObject = markerRenderer(marker);
  } else {
    const color = marker.color || MARKER_DEFAULT_COLOR;
    const from = { size: 0 };
    const to = { size };
    const mesh = new Mesh();
    tween({
      from,
      to,
      animationDuration: markerEnterAnimationDuration,
      easingFunction: markerEnterEasingFunction,
      onUpdate: () => {
        switch (markerType) {
          case MarkerTypes.BAR:
            mesh.geometry = new BoxGeometry(unitRadius, unitRadius, from.size);
            mesh.material = new MeshLambertMaterial({ color });
            break;
          case MarkerTypes.DOT:
          default:
            mesh.geometry = new SphereGeometry(
              from.size,
              MARKER_SEGMENTS,
              MARKER_SEGMENTS,
            );
            mesh.material = new MeshBasicMaterial({ color });
            if (enableMarkerGlow) {
              const glow = createGlowMesh(mesh.geometry, {
                backside: false,
                coefficient: markerGlowCoefficient,
                color,
                power: markerGlowPower,
                size: from.size * markerGlowRadiusScale,
              });
              mesh.children = [];
              mesh.add(glow);
            }
        }
      },
    });
    markerObject = mesh;
  }

  // place markers
  let heightOffset = 0;
  if (markerOffsetRadiusScale) {
    heightOffset = RADIUS * markerOffsetRadiusScale;
  } else if (markerType === MarkerTypes.DOT) {
    heightOffset = (size * (1 + markerGlowRadiusScale)) / 2;
  } else {
    heightOffset = 0;
  }
  const position = coordinatesToPosition(
    marker.coordinates,
    RADIUS + heightOffset,
  );
  markerObject.position.set(...position);
  markerObject.lookAt(new Vector3(0, 0, 0));

  markerObject.name = marker.id;

  return markerObject;
}

function applyCallbacks(markerObject, callbacks) {
  const { marker } = markerObject;

  // TODO: remove hack and find formal way to remove listener
  markerObject._listeners = {};
  markerObject.on('click', interaction => {
    const event = interaction.data.originalEvent;
    callbacks.onClickMarker(marker, markerObject, event);
  });
  markerObject.on('touchstart', interaction => {
    const event = interaction.data.originalEvent;
    callbacks.onTouchMarker(marker, markerObject, event);
  });
  markerObject.on('mousemove', interaction => {
    const event = interaction.data.originalEvent;
    callbacks.onMouseOverMarker(marker, markerObject, event);
  });
  markerObject.on('mouseout', interaction => {
    const event = interaction.data.originalEvent;
    callbacks.onMouseOutMarker(marker, markerObject, event);
  });
}
