export const USER_LIST_REQUEST = "USER_LIST_REQUEST";
export const USER_LIST_SUCCESS = "USER_LIST_SUCCESS";
export const USER_LIST_FAILURE = "USER_LIST_FAILURE";

export function requestUserList() {
  return { type: USER_LIST_REQUEST }
}

export function receiveUserList(data) {
  return { type: USER_LIST_SUCCESS, users: data }
}

export function fetchUserList() {
  return dispatch => {
    dispatch(requestUserList());

    return fetch("/api/users")
      .then(response => response.json())
      .then(json => dispatch(receiveUserList(json)));
  }
}

export const USER_TOKEN_REQUEST = "USER_TOKEN_REQUEST";
export const USER_TOKEN_SUCCESS = "USER_TOKEN_SUCCESS";
export const USER_TOKEN_FAILURE = "USER_TOKEN_FAILURE";

export function requestUserToken() {
  return { type: USER_TOKEN_REQUEST }
}

export function receiveUserToken(data) {
  return { type: USER_TOKEN_SUCCESS, token: data }
}

export function fetchUserToken() {
  return dispatch => {
    dispatch(requestUserToken());

    return fetch("/api/user/token", {method: "POST"})
      .then(response => response.text())
      .then(text => dispatch(receiveUserToken(text)));
  }
}


// function fetchUser() {
//   return fetch("/data/user.json")
//     .then((response) => {
//       if (response.status !== 200) {  
//         throw response; 
//       }
//       return response.json();
//     });
// }

// function fetchUserArray() {
//   return fetch("/data/users.json")
//     .then((response) => {
//       if (response.status !== 200) {  
//         throw response; 
//       }
//       return response.json();
//     });
// }

// function createUser(user) {
//   return fetch(`/api/users/${user.login}`, {method: "POST"})
//     .then((response) => {
//       if (response.status !== 200) {  
//         throw response; 
//       }
//       return response.json();
//     });
// }

// function updateUser(user) {
//   return fetch(`/api/users/${user.login}`, {
//       method: "PUT",
//       body: JSON.stringify(user)
//     })
//     .then((response) => {
//       if (response.status !== 200) {  
//         throw response; 
//       }
//       return response.json();
//     });
// }

// function deleteUser(user) {
//   return fetch(`/api/users/${user.login}`, {method: "DELETE"})
//     .then(response => response.json());
// }
