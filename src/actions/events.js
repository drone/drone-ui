import Emmett from 'emmett';
import Request from 'superagent';
import {tree} from './tree';

export const events = new Emmett();

export const GET_FEED = "GET_FEED";
events.once(GET_FEED, function(event) {
  Request.get('/api/user/feed?latest=true')
    .end((err, response) => {
      if (err != null) {
        console.error(err);
      }
      let feed = JSON.parse(response.text);
      feed.sort(function(a, b) {
        return b.started_at - a.started_at;
      });
      tree.set('feed', feed);
    });
});

export const GET_REPO_LIST = "GET_REPO_LIST";
events.once(GET_REPO_LIST, function(event) {
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

export const GET_REPO = "GET_REPO";
events.on(GET_REPO, function(event) {
  const {owner, name} = event.data;
  Request.get(`/api/repos/${owner}/${name}`)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
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


export const GET_BUILD_LIST = "GET_BUILD_LIST";
events.on(GET_BUILD_LIST, function(event) {
  const {owner, name} = event.data;
  Request.get(`/api/repos/${owner}/${name}/builds`)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
      }
      let builds = JSON.parse(response.text);
      builds.map(function(build) {
        tree.set(['builds', owner, name, build.number], build);
      });
    });
});


export const GET_BUILD = "GET_BUILD";
events.on(GET_BUILD, function(event) {
  const {owner, name, number} = event.data;
  Request.get(`/api/repos/${owner}/${name}/builds/${number}`)
    .end((err, response) => {
      if (err != null) {
        console.error(err);
      }
      let build = JSON.parse(response.text);
      tree.unset('logs');
      tree.set(['builds', owner, name, build.number], build);
    });
});

export const GET_BUILD_LOGS = "GET_BUILD_LOGS";
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

export const PUT_REPO       = "PUT_REPO";
export const DEL_REPO       = "DEL_REPO";
export const POST_REPO      = "POST_REPO";
export const POST_BUILD     = "POST_BUILD";
export const DEL_BUILD      = "DEL_BUILD";

export const GET_TOKEN = "GET_TOKEN";
events.once(GET_TOKEN, function(event) {
  Request.post(`/api/user/token`)
    .end((err, response) => {
      if (err != null) {
        console.error(err); // TODO: Add ui error handling
      }

      tree.set('token', response.text);
    });
});

export const SHOW_TOKEN = "SHOW_TOKEN";
events.on(SHOW_TOKEN, function(event) {
  tree.set(['pages', 'account', 'token'], true);
});

export const HIDE_TOKEN = "HIDE_TOKEN";
events.on(HIDE_TOKEN, function(event) {
  tree.set(['pages', 'account', 'token'], false);
});

export const FILTER = "FILTER";
events.on(FILTER, function(event) {
  const data = event.data.toLowerCase();
  if (data === '') {
    tree.unset(['pages', 'repo', 'filter']);
  } else {
    tree.set(['pages', 'repo', 'filter'], data);
  }
});

export const FILTER_CLEAR = "FILTER_CLEAR";
events.on(FILTER_CLEAR, function(event) {
  tree.unset(['pages', 'repo', 'filter']);
});
