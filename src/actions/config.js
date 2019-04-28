// default authentication credentials. In product cookie-based
// authentication is being used.
export const headers = new Headers(
  process.env.VUE_APP_DRONE_TOKEN ? { Authorization: `Bearer ${process.env.VUE_APP_DRONE_TOKEN}` } : {}
);

// default server api token.
export const token = process.env.VUE_APP_DRONE_TOKEN;

// default server address.
export const instance = process.env.VUE_APP_DRONE_SERVER || "";
