function fetchRepo(owner, name) {
  return fetch("/data/repo.json")
    .then(response => response.json());
}

function fetchRepoArray() {
  return fetch("/data/repos.json")
    .then(response => response.json());
}

function postRepo(login) {
  return fetch("/data/out.txt", {method: "post"})
    .then(response => response.json());
}

function putRepo(login) {
  return fetch("/data/out.txt", {method: "post"})
    .then(response => response.json());
}

function deleteRepo(login) {
  return fetch("/data/out.txt", {method: "delete"})
    .then(response => response.json());
}