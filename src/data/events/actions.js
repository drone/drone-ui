
export function dispatchEvent(event) {
  return dispatch => {
    dispatch(eventReceived(event));
  };
}

export const EVENT_RECEIVED = 'EVENT_RECEIVED';
export function eventReceived(event) {
  return {
    type: EVENT_RECEIVED,
    event
  };
}
