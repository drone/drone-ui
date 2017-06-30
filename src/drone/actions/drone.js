class DroneClient {

	constructor(server, token, csrf) {
		this.server = server;
		this.token = token;
		this.csrf = csrf;
	}

	/**
	 * Returns the user repository list.
	 */
	getRepoList(opts) {
		const query = this._query(opts);
		const endpoint = ["/api/user/repos", query].join("");
		return this._get(endpoint);
	}

	/**
	 * Returns the repository by owner and name.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	getRepo(owner, name) {
		const endpoint = ["/api/repos", owner, name].join("/");
		return this._get(endpoint);
	}

	/**
	 * Activates the repository by owner and name.
	 * @param {string} repository name.
	 */
	activateRepo(repo) {
		const endpoint = ["/api/repos", repo].join("/");
		return this._post(endpoint);
	}

	/**
	 * Updates the repository.
	 * @param {Object} repository object.
	 */
	updateRepo(repo) {
		const endpoint = ["/api/repos", repo.owner, repo.name].join("/");
		return this._patch(endpoint, repo);
	}

	/**
	 * Deletes the repository by owner and name.
	 * @param {string} repository name.
	 */
	deleteRepo(repo) {
		const endpoint = ["/api/repos", repo].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Returns the build list for the given repository.
	 * @param {Object} repository object.
	 * @param {Object} request options.
	 */
	getBuildList(repo, opts) {
		const endpoint = ["/api/repos", repo.owner, repo.name, "builds"].join("/");
		return this._get(endpoint);
	}

	/**
	 * returns the build feed for the user account.
	 * @param {Object} request options.
	 */
	getBuildFeed(opts) {
		var query = this._query(opts);
		var endpoint = ["/api/user/feed", query].join("");
		return this._get(endpoint);
	}

	/**
	 * Returns the build by number for the given repository.
	 * @param {Object} repository object.
	 * @param {number} build number.
	 */
	getBuild(repo, number) {
		const endpoint = ["/api/repos", repo.owner, repo.name, "builds", number].join("/");
		return this._get(endpoint);
	}

	/**
	 * Cancels the build by number for the given repository.
	 * @param {Object} repository name.
	 * @param {number} build number.
	 * @param {number} process number.
	 */
	cancelBuild(repo, number, ppid) {
		const endpoint = ["/api/repos", repo, "builds", number, ppid].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Approves the build.
	 * @param {Object} repository name.
	 * @param {number} build number.
	 */
	approveBuild(repo, number) {
		const endpoint = ["/api/repos", repo, "builds", number, "approve"].join("/");
		return this._post(endpoint);
	}

	/**
	 * Approves the build.
	 * @param {Object} repository name.
	 * @param {number} build number.
	 */
	declineBuild(repo, number) {
		const endpoint = ["/api/repos", repo, "builds", number, "decline"].join("/");
		return this._post(endpoint);
	}

	/**
	 * Restarts the build by number for the given repository.
	 * @param {Object} repository object.
	 * @param {number} build number.
	 */
	restartBuild(repo, number) {
		const endpoint = ["/api/repos", repo, "builds", number].join("/");
		return this._post(endpoint);
	}

	/**
	 * Returns the build by number for the given repository.
	 * @param {String} repository name.
	 * @param {number} build number.
	 * @param {number} proc number.
	 * @param {String} step name.
	 */
	getLogs(repo, build, proc, step) {
		const endpoint = ["/api/repos", repo, "logs", build, proc, step].join("/");
		return this._get(endpoint)
	}

	/**
	 * Returns the repository secret list.
	 */
	getSecretList(owner, repo) {
		const endpoint = ["/api/repos", owner, repo, "secrets"].join("/");
		return this._get(endpoint);
	}

	/**
	 * Create the named registry.
	 * @param {Object} repository name.
	 * @param {number} secret details.
	 */
	createSecret(repo, secret) {
		const endpoint = ["/api/repos", repo, "secrets"].join("/");
		return this._post(endpoint, secret);
	}

	/**
	 * Deletes the named repository secret.
	 * @param {Object} repository name.
	 * @param {number} registry address.
	 */
	deleteSecret(repo, secret) {
		const endpoint = ["/api/repos", repo, "secrets", secret].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Returns the repository registry list.
	 */
	getRegistryList(owner, repo) {
		const endpoint = ["/api/repos", owner, repo, "registry"].join("/");
		return this._get(endpoint);
	}

	/**
	 * Create the named registry.
	 * @param {Object} repository name.
	 * @param {number} registry details.
	 */
	createRegistry(repo, registry) {
		const endpoint = ["/api/repos", repo, "registry"].join("/");
		return this._post(endpoint, registry);
	}

	/**
	 * Deletes the named registry.
	 * @param {Object} repository name.
	 * @param {number} registry address.
	 */
	deleteRegistry(repo, address) {
		const endpoint = ["/api/repos", repo, "registry", address].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Returns the currently authenticated user.
	 */
	getSelf() {
		return this._get("/api/user");
	}

	/**
	 * Returns the user's personal API token.
	 */
	getToken() {
		return this._post("/api/user/token");
	}

	/*
	 * Subscribes to a server-side event feed and emits
	 * events to the callback receiver.
	 *
	 * @param {Function} callback function
	 * @return {Object} websocket
	 */
	on(receiver) {
		let endpoint = [this.server, "/ws/feed"].join("")
						.replace("http://", "ws://")
						.replace("https://", "wss://");

		endpoint = this.token ? endpoint+'?access_token='+this.token : endpoint;
		let ws = new WebSocket(endpoint);
		ws.onmessage = function(message) {
			const data = JSON.parse(message.data);
			receiver(data);
		};
		return ws;
	}

	/*
	 * Subscribes to an server-side event feed and emits
	 * events to the callback receiver.
	 *
	 * @param {Function} callback function
	 * @return {Object} websocket
	 */
	stream(repo, build, proc, receiver) {
		var endpoint = ["/ws/logs", repo, build, proc].join("/")
		return this._ws(endpoint, receiver);
	}

	/**
	 * Returns a Promise for an XHR GET request.
	 * @private
	 * @param {string} request path.
	*/
	_get(path) {
		return this._request("GET", path, null);
	}

	/**
	 * Returns a Promise for an XHR POST request.
	 * @private
	 * @param {string} request path.
	 * @param {Object} request data.
	*/
	_post(path, data) {
		return this._request("POST", path, data);
	}

	/**
	 * Returns a Promise for an XHR PUT request.
	 * @private
	 * @param {string} request path.
	 * @param {Object} request data.
	*/
	_put(path, data) {
		return this._request("PUT", path, data);
	}

	/**
	 * Returns a Promise for an XHR PATCH request.
	 * @private
	 * @param {string} request path.
	 * @param {Object} request data.
	*/
	_patch(path, data) {
		return this._request("PATCH", path, data);
	}

	/**
	 * Returns a Promise for an XHR DELETE request.
	 * @private
	 * @param {string} request path.
	 */
	_delete(path) {
		return this._request("DELETE", path, null);
	}

	/**
	 * Subscribes to a websocket stream and emits events to the
	 * callback receiver.
	 *
	 * @private
	 * @param {string} request path.
	 * @param {Function} callback function.
	*/
	_ws(path, receiver) {
		var endpoint = [this.server, path].join("");
		endpoint = endpoint.replace("http://", "ws://").replace("https://", "wss://");
		endpoint = this.token ? endpoint+'?access_token='+this.token : endpoint;
		var ws = new WebSocket(endpoint);
		ws.onmessage = function(message) {
			const data = JSON.parse(message.data);
			receiver(data);
		};
		return ws;
	}

	/**
	 * Returns a query string from the given parameters.
	 * @param {Object} query parameters in key value object.
	 * @return {string} query string.
	 */
	_query(opts) {
		if (!opts) return;
		var query = [];
		for(var key in opts) {
			var value = opts[key];
			query.push([
				encodeURIComponent(key),
				encodeURIComponent(value)].join("=")
			);
		}
		return query.length == 0 ? "" : "?" + query.join("&")
	}

	/**
	 * Returns true if the XHR response is a JSON document.
	 * @private
	 * @param {Object} XHR response.
	 */
	_isJSON(xhr) {
		return xhr.getResponseHeader("Content-Type").indexOf("json") != -1
			|| xhr.response.startsWith("{")  // HACK remove
			|| xhr.response.startsWith("["); // HACK remove
	}

	/**
	 * Returns a Promise for an XHR request.
	 * @private
	 * @param {string} request method.
	 * @param {string} request path.
	 * @param {Object} request data.
	 */
	_request(method, path, data) {
		var endpoint = [this.server, path].join("");
		var xhr = new XMLHttpRequest();
		xhr.open(method, endpoint, true);
		if (this.token) {
			xhr.setRequestHeader("Authorization", "Bearer "+this.token);
		}
		if (method !== "GET" && this.csrf) {
			xhr.setRequestHeader("X-CSRF-TOKEN", this.csrf);
		}
		return new Promise(function (resolve, reject) {
			xhr.onload = function () {
				if (xhr.readyState === xhr.DONE) {
					if (xhr.status >= 300) {
						reject({
							status: xhr.status,
							message: xhr.response,
						});
					} else if (this._isJSON(xhr)) {
						resolve(JSON.parse(xhr.response));
					} else {
						resolve(xhr.response);
					}
				}
			}.bind(this);
			xhr.onerror = function (e) {
				reject(e);
			};
			if (data) {
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify(data));
			} else {
				xhr.send();
			}
		}.bind(this));
	}
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
