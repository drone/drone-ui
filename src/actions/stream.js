import {instance, token} from "./config";

export const BUILD_EVENT = 'BUILD_EVENT';

export const streamEvents = (dispatch, store) => {
    let path = !token
        ? `${instance}/api/stream`
        : `${instance}/api/stream?access_token=${token}`

    let events = new EventSource(path);
    events.onmessage = function(event) {
        var data = JSON.parse(event.data);
        dispatch({
            type: BUILD_EVENT,
            data,
        });
    };
    return events;
}

export const LOG_WRITE = 'LOG_WRITE';

export const streamLogs = (dispatch, state) => {
	const {namespace, name, build, stage, step} = state.route.params;
    let path = `${instance}/api/stream/${namespace}/${name}/${build}/${stage}/${step}`;
    path = !token ? path : `${path}?access_token=${token}`;

    let events = new EventSource(path);
    events.onmessage = function(event) {
        var data = JSON.parse(event.data);
        dispatch({
            type: LOG_WRITE,
            data,
        });
    };
    events.onerror = function(err) {
        if (err.data === "eof") {
            events.close();
        }
    };
    return events;
}
