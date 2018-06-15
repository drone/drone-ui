import { displayMessage } from "./message";

/**
 * Get the named repository and store the results in
 * the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 */
export const fetchRepository = (tree, client, namespace, name) => {
	tree.unset(["repo", "error"]);
	tree.unset(["repo", "loaded"]);

	client
		.getRepo(namespace, name)
		.then(repo => {
			tree.set(["repos", "data", repo.slug], repo);
			tree.set(["repo", "loaded"], true);
		})
		.catch(error => {
			tree.set(["repo", "error"], error);
			tree.set(["repo", "loaded"], true);
		});
};

/**
 * Get the repository list for the current user and
 * store the results in the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export const fetchRepostoryList = (tree, client) => {
	tree.unset(["repos", "loaded"]);
	tree.unset(["repos", "error"]);

	client
		.getRepoList({ all: true })
		.then(results => {
			let list = {};
			results.map(repo => {
				list[repo.slug] = repo;
			});

			const path = ["repos", "data"];
			if (tree.exists(path)) {
				tree.deepMerge(path, list);
			} else {
				tree.set(path, list);
			}

			tree.set(["repos", "loaded"], true);
		})
		.catch(error => {
			tree.set(["repos", "loaded"], true);
			tree.set(["repos", "error"], error);
		});
};

/**
 * Synchronize the repository list for the current user
 * and merge the results into the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export const syncRepostoryList = (tree, client) => {
	tree.unset(["repos", "loaded"]);
	tree.unset(["repos", "error"]);

	client
		.getRepoList({ all: true, flush: true })
		.then(results => {
			let list = {};
			results.map(repo => {
				list[repo.slug] = repo;
			});

			const path = ["repos", "data"];
			if (tree.exists(path)) {
				tree.deepMerge(path, list);
			} else {
				tree.set(path, list);
			}

			displayMessage(tree, "Successfully synchronized your repository list");
			tree.set(["repos", "loaded"], true);
		})
		.catch(error => {
			displayMessage(tree, "Failed to synchronize your repository list");
			tree.set(["repos", "loaded"], true);
			tree.set(["repos", "error"], error);
		});
};

/**
 * Update the repository and if successful update the
 * repository information into the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 * @param {Object} data - The repository updates.
 */
export const updateRepository = (tree, client, namespace, name, data) => {
	client
		.updateRepo(namespace, name, data)
		.then(repo => {
			tree.set(["repos", "data", repo.slug], repo);
			displayMessage(tree, "Successfully updated the repository settings");
		})
		.catch(() => {
			displayMessage(tree, "Failed to update the repository settings");
		});
};

/**
 * Enables the repository and if successful update the
 * repository active status in the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 */
export const enableRepository = (tree, client, namespace, name) => {
	client
		.activateRepo(namespace, name)
		.then(result => {
			displayMessage(tree, "Successfully activated your repository");
			tree.set(["repos", "data", result.slug, "active"], true);
		})
		.catch(() => {
			displayMessage(tree, "Failed to activate your repository");
		});
};

/**
 * Disables the repository and if successful update the
 * repository active status in the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 */
export const disableRepository = (tree, client, namespace, name) => {
	client
		.deleteRepo(namespace, name)
		.then(result => {
			displayMessage(tree, "Successfully disabled your repository");
			tree.set(["repos", "data", result.slug, "active"], false);
		})
		.catch(() => {
			displayMessage(tree, "Failed to disabled your repository");
		});
};

/**
 * Compare two repositories by name.
 *
 * @param {Object} a - A repository.
 * @param {Object} b - A repository.
 * @returns {number}
 */
export const compareRepository = (a, b) => {
	if (a.slug < b.slug) return -1;
	if (a.slug > b.slug) return 1;
	return 0;
};

/**
 * Returns the repository slug.
 *
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 */
export const repositorySlug = (namespace, name) => {
	return `${namespace}/${name}`;
};
