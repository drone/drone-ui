import { LOGS_LIMIT } from '_constants';

export const getStepSummary = (status, error, exitCode) => {
  switch (status) {
    case 'error':
      return error;
    case 'failure':
      return `Exit Code ${exitCode}`;
    case 'success':
      return 'Exit Code 0';
    case 'running':
      return 'Step is running...';
    case 'pending':
      return 'Step is pending';
    case 'killed':
      return 'Step is killed (canceled)';
    case 'skipped':
      return error ? 'Skipped due to error' : 'Skipped';
    default:
      return 'Loading...';
  }
};

export const mayBeLimitLogs = (logs, showAllLogs) => {
  const l = logs?.length;
  if (!showAllLogs && l && l > LOGS_LIMIT) {
    // always show last LOGS_LIMIT amount of logs
    const logsChunksAmount = Math.floor(l / LOGS_LIMIT);
    const logsChunksModule = l % LOGS_LIMIT;
    return logs.slice((logsChunksAmount - 1) * LOGS_LIMIT + logsChunksModule);
  }
  return logs;
};

export const createAndDownloadLogsBlob = (logs, fileName) => {
  let output = '';
  for (let i = 0; i < logs.length; ++i) {
    output += logs[i].out;
  }
  const link = document.createElement('a');
  const blob = new Blob([output], { type: 'application/text' });

  link.download = `${fileName}.log`;
  link.href = URL.createObjectURL(blob);
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
