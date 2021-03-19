export const humanizeEvent = (event) => {
  switch (event) {
    case 'pull_request':
      return 'opened pull request';
    case 'tag':
      return 'created tag';
    case 'promote':
      return 'promoted to build';
    case 'rollback':
      return 'reverted to build';
    default:
      return 'pushed';
  }
};

export const humanizeStepStatus = (status) => {
  switch (status) {
    case 'success':
      return 'succeeded';
    case 'declined':
      return 'declined';
    case 'killed':
      return 'killed (canceled)';
    case 'failure':
      return 'failed';
    case 'waiting_on_dependencies':
      return 'waiting';
    default:
      return status;
  }
};
