export const FEED_REQUEST = "FEED_REQUEST";
export const FEED_SUCCESS = "FEED_SUCCESS";
export const FEED_FAILURE = "FEED_FAILURE";

export function requestFeed() {
  return { type: FEED_REQUEST }
}

export function receiveFeed(data) {
  return { type: FEED_SUCCESS, items: data }
}

export function fetchFeed() {
  return dispatch => {
    dispatch(requestFeed());

    return fetch("/api/user/feed")
      .then(response => response.json())
      .then(json => dispatch(receiveFeed(json)));
  }
}
