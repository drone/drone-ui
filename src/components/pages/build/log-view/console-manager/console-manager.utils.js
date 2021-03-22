import { STATES } from '_constants';

export const getIntentFromStepStatus = (status) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'failure':
    case 'declined':
    case 'error':
    case 'killed':
      return 'danger';
    default:
      return 'warning';
  }
};

export const getLogsErrorContent = ({
  stageStatus, stageName, stepName, stepError, logsHookError,
}) => {
  if (stageStatus === 'skipped') {
    return `${stageName}: Skipped`;
  } if (stageStatus === 'error') {
    return `${stageName}: ${stepName} - Error`;
  } if (stageStatus === 'killed') {
    return `${stageName}: ${stepName} - Killed (Cancelled)`;
  } if (stepError) {
    return `${stepName}: ${stepError}`;
  } if (logsHookError) {
    const msg = logsHookError.message === 'sql: no rows in result set' ? 'Step does not exist' : logsHookError.message;
    return msg;
  }

  return 'Something went wrong, please, reload the page or restart the build';
};

export const mayBeExtractTmateLink = (logLine, stepStatus, hasBuildDebugMode) => {
  // if the pipeline step is running and if the pipeline
  // step is in debug mode, check the log line for the tmate
  // session url.
  if (logLine && stepStatus === 'running' && hasBuildDebugMode) {
    // if a log entry exists for the tmate session url, trim
    // the log entry so that we are only left with the url.
    return logLine.out.startsWith('web session: ') ? logLine.out.replace('web session: ', '').replace('\n', '') : '';
  }
  return '';
};

export const getNextCompState = ({
  stageStatus, stepStatus, logsExist, currentCompState,
}) => {
  if (stageStatus === 'error') {
    return STATES.ERROR;
  }
  switch (stepStatus) {
    case 'skipped':
      return STATES.NO_LOGS_AVAILABLE;
    case 'error':
      return STATES.ERROR;
    case 'killed':
      if (!logsExist) return currentCompState;
      return STATES.RESOLVED;
    case 'failure':
      return STATES.RESOLVED;
    case 'running':
      return STATES.STREAM_ON;
    case 'pending':
    case 'waiting_on_dependencies':
      return STATES.LOADING;
    case 'success':
      if (currentCompState === STATES.LOADING && !logsExist) {
        return STATES.RESOLVED;
      }
      return logsExist ? STATES.RESOLVED : STATES.NO_LOGS_AVAILABLE;
    default:
      return currentCompState;
  }
};
