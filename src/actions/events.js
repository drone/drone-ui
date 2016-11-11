import Emmett from 'emmett';
import Request from 'superagent';
import {tree} from './tree';

export const events = new Emmett();

export const STREAM_FEED = 'STREAM_FEED';
export const OPEN_LOG_STREAM = 'OPEN_LOG_STREAM';
export const CLOSE_LOG_STREAM = 'CLOSE_LOG_STREAM';
export const GET_FEED = 'GET_FEED';
export const GET_REPO = 'GET_REPO';
export const DEL_REPO = 'DEL_REPO';
export const PATCH_REPO = 'PATCH_REPO';
export const POST_REPO = 'POST_REPO';
export const GET_REPO_LIST = 'GET_REPO_LIST';
export const SYNC_REPO_LIST = 'SYNC_REPO_LIST';
export const GET_BUILD = 'GET_BUILD';
export const POST_BUILD = 'POST_BUILD';
export const DEL_BUILD = 'DEL_BUILD';
export const GET_BUILD_LIST = 'GET_BUILD_LIST';
export const GET_BUILD_LOGS = 'GET_BUILD_LOGS';
export const DEL_BUILD_LOGS = 'DEL_BUILD_LOGS';
export const FILTER = 'FILTER';
export const FILTER_CLEAR = 'FILTER_CLEAR';
export const GET_TOKEN = 'GET_TOKEN';
export const SHOW_TOKEN = 'SHOW_TOKEN';
export const HIDE_TOKEN = 'HIDE_TOKEN';
export const CLEAR_TOAST = 'CLEAR_TOAST';
export const FOLLOW_LOGS = 'FOLLOW_LOGS';
export const UNFOLLOW_LOGS = 'UNFOLLOW_LOGS';
export const ADD_CUSTOM_PARAM = 'ADD_CUSTOM_PARAM';
export const REMOVE_CUSTOM_PARAM = 'REMOVE_CUSTOM_PARAM';
export const UPDATE_CUSTOM_PARAM = 'UPDATE_CUSTOM_PARAM';
export const CLEAR_CUSTOM_PARAMS = 'CLEAR_CUSTOM_PARAMS';

let token = function() {
  var meta = document.querySelector('meta[name=csrf-token]');
  if (meta) { return meta.getAttribute('content'); }
  else return '';
}();

events.once(GET_FEED, function() {
  Request.get('/api/user/feed?latest=true')
    .end((err, response) => {
      if (err != null) {
        console.error(err);
        return;
      }
      let feed = JSON.parse(response.text);
      feed.sort(function(a, b) {
        return (b.started_at || b.created_at || -1) - (a.started_at || a.created_at || -1);
      });
      tree.set('feed', feed);
    });
});

events.once(STREAM_FEED, function() {
  let proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  let ws = new WebSocket(proto + '//' + window.location.host + '/ws/feed');
  ws.onmessage = function(message) {
    let {repo, build, job} = JSON.parse(message.data);

    // merge the item into the feed
    tree.select(['feed']).map((cursor) => {
      var selected = cursor.get();
      if (selected.owner == repo.owner && selected.name == repo.name) {
        cursor.merge(build);
      }
    });

    const cursor = tree.select(['builds', repo.owner, repo.name, build.number]);
    if (cursor && cursor.get()) {
      const previous = cursor.get();
      if (previous.jobs) {
        build.jobs = previous.jobs.slice();
      } else {
        build.jobs = [];
      }
      if (job) build.jobs[job.number-1] = job;
      cursor.set(build);
    }

    // append the build to the index if not exists.
    if (!tree.exists(['builds', repo.owner, repo.name, build.number])) {
      tree.set(['builds', repo.owner, repo.name, build.number], build);
    }
  };
});

events.once(GET_REPO_LIST, function() {
  Request.get('/api/user/repos?all=true')
    .end((err, response) => {
      if (err != null) {
        console.error(err);
      }
      let repos = JSON.parse(response.text);
      repos.sort(function(a, b) {
        if(a.full_name < b.full_name) return -1;
        if(a.full_name > b.full_name) return 1;
        return 0;
      });
      tree.set(['user', 'repos'], repos);
    });
});

events.on(SYNC_REPO_LIST, function() {
  tree.set(['pages', 'account', 'syncing'], true);

  Request.get('/api/user/repos?all=true&flush=true')
    .end((err, response) => {
      tree.set(['pages', 'account', 'syncing'], false);

      if (err != null) {
        tree.set(['pages', 'toast'], 'Error syncing repository list');
        return;
      }
      let repos = JSON.parse(response.text);
      repos.sort(function(a, b) {
        if(a.full_name < b.full_name) return -1;
        if(a.full_name > b.full_name) return 1;
        return 0;
      });
      tree.set(['user', 'repos'], repos);
      tree.set(['pages', 'toast'], 'Successfully synchronized repository list');
    });
});

events.on(GET_REPO, function(event) {
  const {owner, name} = event.data;
  Request.get(`/api/repos/${owner}/${name}`)
    .end((err, response) => {
      if (err != null) {
        Object.assign({
          statusCode: response.statusCode,
          statusText: response.statusText
        }, err);
        tree.set(['repos', owner, name], err);
        return;
      }

      let repo = JSON.parse(response.text);
      let cursor = tree.select(['repos', owner, name]);
      if (cursor.get()) {
        cursor.merge(repo);
      } else {
        tree.set(['repos', owner, name], repo);
      }
    });
});

events.on(PATCH_REPO, function(event) {
  const {owner, name} = event.data;

  // there is a bug where the input parameter names differ from
  // the output parameter names. This attempts to resolve.
  if (event.data.allow_deploys !== undefined) {
    event.data['allow_deploy'] = event.data.allow_deploys;
  }
  if (event.data.allow_tags !== undefined) {
    event.data['allow_tag'] = event.data.allow_tags;
  }

  Request.patch(`/api/repos/${owner}/${name}`)
    .set('X-CSRF-TOKEN', token)
    .send(event.data)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
        tree.set(['pages', 'toast'], 'Error updating repository settings');
        return;
      }
      let repo = JSON.parse(response.text);
      tree.set(['repos', owner, name], repo);
      tree.set(['pages', 'toast'], 'Successfully updated repository settings');
    });
});

events.on(GET_BUILD_LIST, function(event) {
  const {owner, name} = event.data;
  Request.get(`/api/repos/${owner}/${name}/builds`)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
      }
      let builds = JSON.parse(response.text);
      if (builds.length == 0) {
        tree.set(['builds', owner, name], {});
      }

      builds.map(function(build) {
        tree.set(['builds', owner, name, build.number], build);
      });
    });
});


events.on(GET_BUILD, function(event) {
  const {owner, name, number} = event.data;
  Request.get(`/api/repos/${owner}/${name}/builds/${number}`)
    .end((err, response) => {
      if (err != null) {
        Object.assign({
          statusCode: response.statusCode,
          statusText: response.statusText
        }, err);
        tree.set(['builds', owner, name, number], err);
        return;
      }
      let build = JSON.parse(response.text);
      tree.unset('logs');
      tree.set(['builds', owner, name, number], build);
    });
});

events.on(POST_BUILD, function(event) {
  const {owner, name, number, params} = event.data;
  Request.post(`/api/repos/${owner}/${name}/builds/${number}?${params}`)
    .set('X-CSRF-TOKEN', token)
    .end((err) => {
      if (err != null) {
        console.error(err);
      }
    });
});

events.on(DEL_BUILD, function(event) {
  const {owner, name, number, job} = event.data;
  Request.delete(`/api/repos/${owner}/${name}/builds/${number}/${job}`)
    .set('X-CSRF-TOKEN', token)
    .end((err) => {
      if (err != null) {
        console.error(err);
      }
    });
});

events.on(GET_BUILD_LOGS, function(event) {
  const {owner, name, number, job} = event.data;
  Request.get(`/api/repos/${owner}/${name}/logs/${number}/${job}`)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
      }
      let lines = JSON.parse(response.text);
      let procs = {};

      // this code groups the lines of output by process.
      lines.map(function(line) {
        if (!line || !line.proc || !line.out) return;
        let proc = procs[line.proc];
        if (!proc) {
          proc=[];
          procs[line.proc]=proc;
        }
        proc.push(line);
      });

      tree.set('logs', procs);
    });
});

events.on(DEL_BUILD_LOGS, function() {
  tree.unset('logs');
});

events.on(OPEN_LOG_STREAM, function(event) {
  if (this.ws) {
    this.ws.close();
  }

  const {owner, name, number, job} = event.data;
  console.log(OPEN_LOG_STREAM, owner, name, number, job);

  const proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  const path = ['/ws/logs', owner, name, number, job].join('/');

  tree.set('logs', {});

  this.ws = new WebSocket(proto + '//' + window.location.host + path);
  this.ws.onmessage = function(message) {
    let event = JSON.parse(message.data);
    if (!event || !event.proc || !event.out) return;

    if (!tree.exists(['logs', event.proc])) tree.set(['logs', event.proc], []);
    tree.select(['logs', event.proc]).push(event);
  };
});

events.on(CLOSE_LOG_STREAM, function() {
  console.log(CLOSE_LOG_STREAM);
  if (this.ws) {
    this.ws.close();
    this.ws = null;
  }
});

events.on(DEL_REPO, (event) => {
  const {owner, name} = event.data;

  tree.select(['user','repos']).map((cursor) => {
    var selected = cursor.get();
    if (selected.owner == owner && selected.name == name) {
      cursor.unset(['id']);
    }
  });

  Request.del(`/api/repos/${owner}/${name}`)
    .set('X-CSRF-TOKEN', token)
    .end((err) => {
      if (err != null) {
        console.error(err);
        tree.set(['pages', 'toast'], `Error disabling ${owner}/${name}`);
        return;
      }

      tree.unset(['repos', owner, name]);
      tree.unset(['builds', owner, name]);

      // tree.select(['user','repos']).map((cursor, i) => {
      //   var selected = cursor.get();
      //   if (selected.owner == owner && selected.name == name) {
      //     cursor.unset(['id']);
      //   }
      // });

      // TODO remove from feed

      tree.set(['pages', 'toast'], `Successfully disabled ${owner}/${name}`);
    });
});

events.on(POST_REPO, (event) => {
  const {owner, name} = event.data;

  tree.select(['user','repos']).map((cursor) => {
    var selected = cursor.get();
    if (selected.owner == owner && selected.name == name) {
      cursor.set(['id'], -1);
    }
  });

  Request.post(`/api/repos/${owner}/${name}`)
    .set('X-CSRF-TOKEN', token)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
        tree.set(['pages', 'toast'], `Error activating ${repo.full_name}`);
        return;
      }

      let repo = JSON.parse(response.text);

      // update the repositroy index to include this repository.
      tree.set(['repos', owner, name], repo);

      // update the repository in the user repository list, iterate
      // through the cursor to find the entry.
      tree.select(['user','repos']).map((cursor) => {
        var selected = cursor.get();
        if (selected.owner == owner && selected.name == name) {
          cursor.merge(repo);
        }
      });

      // append the repsotiroy to the feed.
      tree.push(['feed'], repo);
      tree.set(['pages', 'toast'], `Successfully activated ${repo.full_name}`);
    });
});

events.once(GET_TOKEN, function() {
  Request.post('/api/user/token')
    .set('X-CSRF-TOKEN', token)
    .end((err, response) => {
      if (err != null) {
        console.error(err); // TODO: Add ui error handling
      }

      tree.set('token', response.text);
    });
});

events.on(SHOW_TOKEN, function() {
  tree.set(['pages', 'account', 'token'], true);
});

events.on(HIDE_TOKEN, function() {
  tree.set(['pages', 'account', 'token'], false);
});

events.on(FOLLOW_LOGS, function() {
  tree.set(['pages', 'build', 'follow'], true);
});

events.on(UNFOLLOW_LOGS, function() {
  tree.set(['pages', 'build', 'follow'], false);
});

events.on(FILTER, function(event) {
  const data = event.data.toLowerCase();
  if (data === '') {
    tree.unset(['pages', 'repo', 'filter']);
  } else {
    tree.set(['pages', 'repo', 'filter'], data);
  }
});

events.on(FILTER_CLEAR, function() {
  tree.unset(['pages', 'repo', 'filter']);
});

events.on(CLEAR_TOAST, function() {
  tree.unset(['pages', 'toast']);
});

events.on(ADD_CUSTOM_PARAM, function(event) {
  const data = event.data;
  if (!tree.exists(['pages', 'build', 'custom_params'])) {
    tree.set(['pages', 'build', 'custom_params'], []); // initialize
  }
  tree.push(['pages', 'build', 'custom_params'], data);
});

events.on(REMOVE_CUSTOM_PARAM, function(event) {
  const index = event.data;
  let param = tree.get(['pages', 'build', 'custom_params', index]);
  if(param.value) {
    // if params exists we flag it for removal
    tree.merge(['pages', 'build', 'custom_params', index], {removed: true});
  } else {
    // it was empty so it's safe to remove it entirely
    tree.splice(['pages', 'build', 'custom_params'], [index, 1]);
  }
});

events.on(UPDATE_CUSTOM_PARAM, function(event) {
  const {index, value} = event.data;
  tree.merge(['pages', 'build', 'custom_params', index], {value: value});
});

events.on(CLEAR_CUSTOM_PARAMS, function() {
  tree.unset(['pages', 'build', 'custom_params']);
});
