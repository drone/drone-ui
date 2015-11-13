const initialState = {
  hostname: (window && window.location.host) || "",
  protocol: (window && window.location.protocol) || "",
}

export function location(state = initialState, action) {
  return state;
}
