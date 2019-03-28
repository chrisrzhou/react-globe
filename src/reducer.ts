import { Action, ActionType, State } from './types';

export default function reducer(state: State, action: Action): State {
  const { payload, type } = action;
  switch (type) {
    case ActionType.SetFocus:
      return {
        ...state,
        focus: payload,
        activeMarker: undefined,
        activeMarkerObject: undefined,
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
