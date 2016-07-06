import Baobab from 'baobab';

export const tree = new Baobab({
  repos: {
    "drone": {
      "drone-test-go": {"id":1,"owner":"drone","name":"drone-test-go","full_name":"drone/drone-test-go","avatar_url":"https://avatars.githubusercontent.com/u/2181346?v=3","link_url":"https://github.com/drone/drone-test-go","scm":"git","clone_url":"https://github.com/drone/drone-test-go.git","default_branch":"master","timeout":383,"private":true,"trusted":true,"allow_pr":true,"allow_push":true,"allow_deploys":false,"allow_tags":false},
      "drone": {"id":4,"owner":"drone","name":"drone","full_name":"drone/drone","avatar_url":"https://avatars.githubusercontent.com/u/2181346?v=3","link_url":"https://github.com/drone/drone","scm":"git","clone_url":"https://github.com/drone/drone.git","default_branch":"master","timeout":265,"trusted":false,"allow_pr":true,"allow_push":true,"allow_deploys":false,"allow_tags":false}
    }
  },
  builds: {
    "drone": {
      "drone-test-go": {
        "241": {"id": 4566, "number": 242, "event": "push", "status": "success", "enqueued_at": 1466722476, "created_at": 1466722476, "started_at": 1466722476, "finished_at": 1466722525, "deploy_to": "", "commit": "a24380b5157e24cb26a4c576d6a69997abf57cba", "branch": "master", "ref": "refs\/heads\/master", "refspec": "", "remote": "https:\/\/github.com\/drone\/drone-test-go.git", "title": "", "message": "Update .drone.yml", "timestamp": 0, "author": "bradrydzewski", "author_avatar": "https:\/\/avatars.githubusercontent.com\/u\/817538?v=3", "author_email": "brad.rydzewski@gmail.com", "link_url": "https:\/\/github.com\/drone\/drone-test-go\/commit\/a24380b5157e24cb26a4c576d6a69997abf57cba", "signed": true,  "verified": false, "jobs":[{"id":5143,"number":1,"error":"","status":"success","exit_code":0,"enqueued_at":1466722476,"started_at":1466722476,"finished_at":1466722504,"environment":{"SLEEP":"4"}},{"id":5144,"number":2,"error":"","status":"success","exit_code":0,"enqueued_at":1466722476,"started_at":1466722476,"finished_at":1466722525,"environment":{"SLEEP":"10"}}]},
        "242": {"id": 4544, "number": 241, "event": "push", "status": "success", "enqueued_at": 1466439430, "created_at": 1466439430, "started_at": 1466439430, "finished_at": 1466439444, "deploy_to": "", "commit": "c0ed34450e3fbdd5369c09ed5ffd02a9cff0ee75", "branch": "master", "ref": "refs\/heads\/master", "refspec": "", "remote": "https:\/\/github.com\/drone\/drone-test-go.git", "title": "", "message": "Update Dockerfile", "timestamp": 0, "author": "bradrydzewski", "author_avatar": "https:\/\/avatars.githubusercontent.com\/u\/817538?v=3", "author_email": "brad.rydzewski@gmail.com", "link_url": "https:\/\/github.com\/drone\/drone-test-go\/commit\/c0ed34450e3fbdd5369c09ed5ffd02a9cff0ee75", "signed": true, "verified": false, "jobs":[{"id":5143,"number":1,"error":"","status":"success","exit_code":0,"enqueued_at":1466722476,"started_at":1466722476,"finished_at":1466722504,"environment":{"SLEEP":"4"}},{"id":5144,"number":2,"error":"","status":"success","exit_code":0,"enqueued_at":1466722476,"started_at":1466722476,"finished_at":1466722525,"environment":{"SLEEP":"10"}}]}
      }
    }
  },
  feed: [],
  user: window.STATE_FROM_SERVER && window.STATE_FROM_SERVER.user,
  location: window.location,
  pages: {
    account: {
      token: false,
      error: null
    }
  }
});
