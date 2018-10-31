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

export const LOG_WRITE = 'LOG_WRITE';

export const streamLogs = ({commit}, params) => {
	const {namespace, name, build, stage, step} = params;
    let path = `${instance}/api/stream/${namespace}/${name}/${build}/${stage}/${step}`;
    path = !token ? path : `${path}?access_token=${token}`;

    let events = new EventSource(path);
    events.onmessage = function(event) {
        const line = JSON.parse(event.data);
        commit(LOG_WRITE, {...params, line});
    };
    events.onerror = function(err) {
        if (err.data === "eof") {
            events.close();
        }
    };
    return events;
}
