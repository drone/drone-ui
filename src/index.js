require("babel-polyfill");

import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";

let root;

function init() {
	let App = require("./screens/drone").default;
	root = render(<App />, document.body, root);
}

init();

if (module.hot) module.hot.accept("./screens/drone", init);
