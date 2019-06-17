import { Coordinates, FocusOptions, Marker } from './types';

export enum ActionType {
  Animate = 'ANIMATE',
  SetFocus = 'SET_FOCUS',
  SetActiveMarker = 'SET_ACTIVE_MANAGER',
}

interface Action {
  type: ActionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface State {
  activeMarker?: Marker;
  activeMarkerObject?: THREE.Object3D;
  focus?: Coordinates;
  focusOptions: FocusOptions;
}

export default function reducer(state: State, action: Action): State {
  const { payload, type } = action;
  switch (type) {
    case ActionType.Animate:
      return {
        ...state,
        activeMarker: undefined,
        activeMarkerObject: undefined,
        focus: payload.focus,
        focusOptions: payload.focusOptions,
      };
    case ActionType.SetFocus:
      return {
        ...state,
        activeMarker: undefined,
        activeMarkerObject: undefined,
        focus: payload.focus,
        focusOptions: payload.focusOptions || state.focusOptions,
      };
    case ActionType.SetActiveMarker:
      return {
        ...state,
        activeMarker: payload.marker,
        activeMarkerObject: payload.markerObject,
      };
    default:
      return state;
  }
}
