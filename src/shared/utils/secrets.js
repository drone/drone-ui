import { displayMessage } from "./message";
import { repositorySlug } from "./repository";

/**
 * Get the secret list for the named repository and
 * store the results in the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 */
export const fetchSecretList = (tree, client, namespace, name) => {
	const slug = repositorySlug(namespace, name);

	tree.unset(["secrets", "loaded"]);
	tree.unset(["secrets", "error"]);

	client.getSecretList(namespace, name).then(results => {
		let list = {};
		results.map(secret => {
			list[secret.name] = secret;
		});
		tree.set(["secrets", "data", slug], list);
		tree.set(["secrets", "loaded"], true);
	});
};

/**
 * Create the named repository secret and if successful
 * store the result in the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 * @param {Object} secret - The secret object.
 */
export const createSecret = (tree, client, namespace, name, secret) => {
	const slug = repositorySlug(namespace, name);

	client
		.createSecret(namespace, name, secret)
		.then(result => {
			tree.set(["secrets", "data", slug, secret.name], result);
			displayMessage(tree, "Successfully added the secret");
		})
		.catch(() => {
			displayMessage(tree, "Failed to create the secret");
		});
};

/**
 * Delete the named repository secret from the server and
 * remove from the state tree.
 *
 * @param {Object} tree - The drone state tree.
 * @param {Object} client - The drone client.
 * @param {string} namespace - The repository namespace.
 * @param {string} name - The repository name.
 * @param {string} secret - The secret name.
 */
export const deleteSecret = (tree, client, namespace, name, secret) => {
	const slug = repositorySlug(namespace, name);

	client
		.deleteSecret(namespace, name, secret)
		.then(result => {
			tree.unset(["secrets", "data", slug, secret]);
			displayMessage(tree, "Successfully removed the secret");
		})
		.catch(() => {
			displayMessage(tree, "Failed to remove the secret");
		});
};
