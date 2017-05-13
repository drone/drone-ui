import React from 'react';

import './status.less';

// TODO: Move this into separate file, should not be the components concern
export const SUCCESS = 'success';
export const FAILURE = 'failure';
export const KILLED = 'killed';
export const ERROR = 'error';
export const RUNNING = 'running';
export const PENDING = 'pending';
export const BLOCKED = 'blocked';
export const DECLINED = 'declined';
export const UNKNOWN = 'unknown';
export const SKIPPED = 'skipped';

export default
class Status extends React.Component {
  render() {
    let {state} = this.props;

    state = !state ? UNKNOWN : state.toLowerCase();

    let classes = ['status'];

    state == SUCCESS && classes.push(SUCCESS);
    state == FAILURE && classes.push(FAILURE);
    state == KILLED && classes.push(KILLED);
    state == ERROR && classes.push(ERROR);
    state == RUNNING && classes.push(RUNNING);
    state == PENDING && classes.push(PENDING);
    state == BLOCKED && classes.push(BLOCKED);
    state == DECLINED && classes.push(DECLINED);
    state == UNKNOWN && classes.push(UNKNOWN);

    return (
      <div className={classes.join(' ')}></div>
    );
  }
}
