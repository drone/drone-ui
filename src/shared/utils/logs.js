import { repositorySlug } from "./repository";

export function subscribeToLogs(
	tree,
	client,
	namespace,
	repo,
	build,
	stage,
	step,
) {
	if (subscribeToLogs.ws) {
		subscribeToLogs.ws.close();
	}
	const slug = repositorySlug(namespace, repo);
	const init = { data: [] };

	tree.set(["logs", "data", slug, build, stage, step], init);

	subscribeToLogs.ws = client.stream(
		namespace,
		repo,
		build,
		stage,
		step,
		item => {
			tree.push(["logs", "data", slug, build, stage, step, "data"], item);
		},
	);
}

export function fetchLogs(tree, client, namespace, repo, build, stage, step) {
	const slug = repositorySlug(namespace, repo);
	const init = {
		data: [],
		loading: true,
	};

	tree.set(["logs", "data", slug, build, stage, step], init);

	client
		.getLogs(namespace, repo, build, stage, step)
		.then(results => {
			tree.set(
				["logs", "data", slug, build, stage, step, "data"],
				results || [],
			);
			tree.set(["logs", "data", slug, build, stage, step, "loading"], false);
			tree.set(["logs", "data", slug, build, stage, step, "eof"], true);
		})
		.catch(() => {
			tree.set(["logs", "data", slug, build, stage, step, "loading"], false);
			tree.set(["logs", "data", slug, build, stage, step, "eof"], true);
		});
}

/**
 * Toggles whether or not the browser should follow
 * the logs (ie scroll to bottom).
 *
 * @param {boolean} follow - Follow the logs.
 */
export const toggleLogs = (tree, follow) => {
	tree.set(["logs", "follow"], follow);
};
