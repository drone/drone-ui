let notificationCounter = 0;
export const showNotification = async ({ commit }, params) => {
  const notificationId = notificationCounter + 1;
  const timeoutId = setTimeout(() => commit("NOTIFICATION_REMOVE", notificationId), 5000);

  notificationCounter += 1;

  commit("NOTIFICATION_ADD", { ...params, id: notificationId, timeoutId });
};

export const hideNotification = async ({ commit }, notificationId) => {
  commit("NOTIFICATION_REMOVE", notificationId);
};
