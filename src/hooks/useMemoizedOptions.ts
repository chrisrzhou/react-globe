import { useMemo } from 'react';

import {
  defaultCameraOptions,
  defaultFocusOptions,
  defaultGlobeOptions,
  defaultLightOptions,
  defaultMarkerOptions,
} from '../defaults';
import {
  CameraOptions,
  FocusOptions,
  GlobeOptions,
  LightOptions,
  MarkerOptions,
  Optional,
} from '../types';

export function useMemoizedOptions({
  cameraOptionsProp,
  focusOptionsProp,
  globeOptionsProp,
  lightOptionsProp,
  markerOptionsProp,
}: {
  cameraOptionsProp: Optional<CameraOptions>;
  focusOptionsProp: Optional<FocusOptions>;
  globeOptionsProp: Optional<GlobeOptions>;
  lightOptionsProp: Optional<LightOptions>;
  markerOptionsProp: Optional<MarkerOptions>;
}): {
  cameraOptions: CameraOptions;
  focusOptions: FocusOptions;
  globeOptions: GlobeOptions;
  lightOptions: LightOptions;
  markerOptions: MarkerOptions;
} {
  const cameraOptions = useMemo(
    () => ({
      ...defaultCameraOptions,
      ...cameraOptionsProp,
    }),
    [cameraOptionsProp],
  );

  const focusOptions = useMemo(
    () => ({
      ...defaultFocusOptions,
      ...focusOptionsProp,
    }),
    [focusOptionsProp],
  );

  const globeOptions = useMemo(
    () => ({
      ...defaultGlobeOptions,
      ...globeOptionsProp,
    }),
    [globeOptionsProp],
  );

  const lightOptions = useMemo(
    () => ({
      ...defaultLightOptions,
      ...lightOptionsProp,
    }),
    [lightOptionsProp],
  );

  const markerOptions = useMemo(
    () => ({
      ...defaultMarkerOptions,
      ...markerOptionsProp,
    }),
    [markerOptionsProp],
  );

  return {
    cameraOptions,
    focusOptions,
    globeOptions,
    lightOptions,
    markerOptions,
  };
}
