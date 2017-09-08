/**
 * Displays the globa message.
 *
 * @param {Object} tree - The drone state tree.
 * @param {string} message - The message text.
 */
export const displayMessage = (tree, message) => {
	tree.set(["message", "text"], message);
};

/**
 * Hide the global message.
 *
 * @param {Object} tree - The drone state tree.
 */
export const hideMessage = tree => {
	tree.unset(["message", "text"]);
};
