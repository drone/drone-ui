// default server api token.
const token = process.env.REACT_APP_DRONE_TOKEN || '';

// default server address.
const instance = process.env.REACT_APP_DRONE_SERVER
 || `${window.location.protocol}//${window.location.host}`;

const LOGS_LIMIT = 250;

// @TODO: confirm if it is correct,
// confirm if stage states are the same
// then replace hard coded entries

// step states
const STEP_STATES = {
  ERROR: 'error',
  RUNNING: 'running',
  PENDING: 'pending',
  SUCCESS: 'success',
  DECLINED: 'declined',
  FAILURE: 'failure',
  KILLED: 'killed',
  SKIPPED: 'skipped',
  WAITING: 'waiting_on_dependencies',
  BLOCKED: 'blocked',
};

const FAVICON_STATES = { DEFAULT: 'default', RUNNING: 'running' };

// enumerated list of timeout values for simplified
// and touch-friendly user experience.
const TIMEOUTS = [15, 30, 60, 90, 120, 180, 240, 300, 360, 420, 480,
  540, 600, 660, 720, 1080, 1440, 2880, 4320];

// supplementary state object for handling complex logic
const STATES = {
  LOADING: 'loading',
  STREAM_ON: 'stream_on',
  RESOLVED: 'resolved',
  NO_LOGS_AVAILABLE: 'no_logs_available',
  ERROR: 'error',
  IDLE: 'idle',
};

const isLicenseExpired = window && window.LICENSE_EXPIRED;
const isLicenseExceeded = window && window.LICENSE_LIMIT_EXCEEDED;

const VISIBILITY_LEVELS = {
  PUBLIC: 0,
  PRIVATE: 1,
  ADMIN: 2,
};

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export {
  token, instance, STEP_STATES, TIMEOUTS, FAVICON_STATES, LOGS_LIMIT, STATES,
  isLicenseExceeded, isLicenseExpired, VISIBILITY_LEVELS, THEMES,
};
