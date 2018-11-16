import {instance, token} from "./config";

export const BUILD_EVENT = 'BUILD_EVENT';

export const streamEvents = ({commit}, store) => {
    let path = !token
        ? `${instance}/api/stream`
        : `${instance}/api/stream?access_token=${token}`

    let events = new EventSource(path);
    events.onmessage = function(event) {
        var data = JSON.parse(event.data);
        commit(BUILD_EVENT, {event: data});
    };
    return events;
}
