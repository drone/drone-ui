/**
 * Get the event feed and store the results in the
 * state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export const fetchFeed = (tree, client) => {
	client
		.getRepoList({ latest: true })
		.then(results => {
			let list = {};
			let sorted = results.sort(compareFeedItem);
			sorted.map(repo => {
				list[repo.slug] = repo;
			});
			if (sorted && sorted.length > 0) {
				tree.set(["feed", "latest"], sorted[0]);
			}
			tree.set(["feed", "loaded"], true);
			tree.set(["feed", "data"], list);
		})
		.catch(error => {
			tree.set(["feed", "loaded"], true);
			tree.set(["feed", "error"], error);
		});
};

/**
 * Ensures the fetchFeed function is invoked exactly once.
 * TODO replace this with a decorator
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export function fetchFeedOnce(tree, client) {
	if (fetchFeedOnce.fired) {
		return;
	}
	fetchFeedOnce.fired = true;
	return fetchFeed(tree, client);
}

/**
 * Subscribes to the server-side event feed and synchonizes
 * event data with the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export const subscribeToFeed = (tree, client) => {
	return client.on(data => {
		if (!data || !data.build) {
			return;
		}

		if (tree.exists("feed", "data", data.slug)) {
			tree.set(["feed", "data", data.slug], data)
		}

		if (tree.exists("builds", "data", data.slug)) {
			tree.set(["builds", "data", data.slug, data.build.number], data.build);
		}
	});
};

/**
 * Ensures the subscribeToFeed function is invoked exactly once.
 * TODO replace this with a decorator
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export function subscribeToFeedOnce(tree, client) {
	if (subscribeToFeedOnce.fired) {
		return;
	}
	subscribeToFeedOnce.fired = true;
	return subscribeToFeed(tree, client);
}

/**
 * Compare two feed items by name.
 * @param {Object} a - A feed item.
 * @param {Object} b - A feed item.
 * @returns {number}
 */
export const compareFeedItem = (a, b) => {
	return (
		(b.started || b.created || -1) - (a.started || a.created || -1)
	);
};
