import { createStore } from "redux"

// get the initial state from local storage
const stateStr = localStorage.getItem("STATE") // window.STATE_FROM_SERVER
const state = JSON.parse(stateStr)

export const store = createStore(drone, state);
