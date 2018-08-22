import { displayMessage } from "./message";

/**
* Generates a personal access token and stores the results in
* the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 */
export const generateToken = (tree, client) => {
	client
		.getToken()
		.then(result => {
			tree.set(["token"], result.token);
		})
		.catch(() => {
			displayMessage(tree, "Failed to retrieve your personal access token");
		});
};

export function checkSyncing(tree, client) {
	var user = tree.get(["user", "data"]);
	if (!user.syncing) {
		return;
	}
	var timer = setInterval(() => {
		client
			.getSelf()
			.then(result => {
				tree.set(["user", "data"], result);
				if (!result.syncing) {
					clearInterval(timer);
				}
			})
			.catch(() => {
				clearInterval(timer);
				displayMessage(tree, "Failed to fetch your account details");
			});
	}, 5000);
}
