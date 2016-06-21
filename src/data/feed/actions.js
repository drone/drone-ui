import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

export const feedSchema = new Schema('feed', { idAttribute: 'full_name' });

export function getFeed() {
  return dispatch => {
    Request.get('/api/user/feed?latest=true')
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), arrayOf(feedSchema));
        let feed = Immutable.fromJS(response.entities.feed);
        dispatch(feedReceived(feed));
      });
  };
}

export const FEED_RECEIVED = 'FEED_RECEIVED';
export function feedReceived(feed) {
  return {
    type: FEED_RECEIVED,
    feed
  };
}
