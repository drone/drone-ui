import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useRef, useEffect, useState,
} from 'react';

import Button from 'components/shared/button';
import Status from 'components/shared/status';
import { ReactComponent as CloseIcon } from 'svg/close.svg';
import { ReactComponent as DownloadIcon } from 'svg/download-cloud.svg';
import { ReactComponent as PauseIcon } from 'svg/pause.svg';
import { ReactComponent as PlayIcon } from 'svg/play.svg';

import styles from './console.module.scss';
import {
  getStepSummary,
  mayBeLimitLogs,
  createAndDownloadLogsBlob,
} from './console.utils';

import './console.scss';

const cx = classNames.bind(styles);

const ConsoleHeader = (props) => {
  const {
    areLogsLoading,
    toggleFollowLogs,
    shouldFollowLogs,
    handleDownloadClick,
    showDownloadBtn,
    showCloseBtn,
    showFollowLogsBtn,
    onCloseBtnClick,
  } = props;
  return (
    <header className={cx('header')}>
      <div className={cx('header-inner')}>
        <div className={cx('info')}>
          <h3>
            Console Logs
          </h3>
        </div>
        {!areLogsLoading && (
        <div className={cx('controls')}>
          {showFollowLogsBtn && (
            <Button
              className={cx('controls-logs-toggler')}
              title={shouldFollowLogs ? 'Stop following logs' : 'Follow logs'}
              onClick={toggleFollowLogs}
            >
              {shouldFollowLogs ? <PauseIcon /> : <PlayIcon />}
            </Button>
          )}
          {showDownloadBtn && (
            <Button
              onClick={handleDownloadClick}
            >
              <DownloadIcon />
            </Button>
          )}
          {showCloseBtn && (
            <Button
              className={cx('btn-close')}
              onClick={onCloseBtnClick}
            >
              <CloseIcon />
            </Button>
          )}
        </div>
        )}
      </div>
    </header>
  );
};

ConsoleHeader.propTypes = {
  shouldFollowLogs: PropTypes.bool.isRequired,
  showFollowLogsBtn: PropTypes.bool,
  showCloseBtn: PropTypes.bool,
  showDownloadBtn: PropTypes.bool,
  areLogsLoading: PropTypes.bool.isRequired,
  toggleFollowLogs: PropTypes.func.isRequired,
  handleDownloadClick: PropTypes.func.isRequired,
  onCloseBtnClick: PropTypes.func,
};

ConsoleHeader.defaultProps = {
  showFollowLogsBtn: false,
  showDownloadBtn: false,
  showCloseBtn: false,
  onCloseBtnClick: undefined,
};

const ConsoleFooter = (props) => {
  const {
    stepStatus,
    stepError,
    stepExitCode,
    tmateLink,
    stageError,
    stageStatus,
  } = props;
  return (
    <footer className={cx('footer')}>
      <div className={cx('summary')}>
        <div className={cx('summary-info')}>
          {(stepStatus || stageStatus) && (
          <Status
            className={cx('summary-status')}
            status={stepStatus || stageStatus}
          />
          )}
          {getStepSummary(
            stepStatus || stageStatus,
            stepError || stageError,
            stepExitCode,
          )}
        </div>
        <div className={cx('summary-controls')}>

          {tmateLink ? (
            <a
              className={cx('tmate-link')}
              href={tmateLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Remote Session
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

ConsoleFooter.propTypes = {
  stepStatus: PropTypes.string,
  stepError: PropTypes.string,
  stepExitCode: PropTypes.number,
  tmateLink: PropTypes.string,
};

ConsoleFooter.defaultProps = {
  stepStatus: '',
  stepError: '',
  stepExitCode: undefined,
  tmateLink: '',
};

const ShowAllLogsBtn = (props) => {
  const { shouldShow, handleShowAllLogsClick } = props;
  if (shouldShow) {
    return (
      <Button
        className={cx('btn-show-all-logs')}
        onClick={handleShowAllLogsClick}
      >
        Show all logs

      </Button>
    );
  }
  return null;
};

ShowAllLogsBtn.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
  handleShowAllLogsClick: PropTypes.func.isRequired,
};

const LogsLoadingLine = ({ shouldShow }) => {
  if (shouldShow) {
    return (
      <div className={cx('line-number')}>
        Loading...
      </div>
    );
  }
  return null;
};

LogsLoadingLine.propTypes = {
  shouldShow: PropTypes.bool.isRequired,
};

const LogsLine = (props) => {
  const {
    out, pos, html, time,
  } = props;
  return (
    <div className={cx('line')} key={pos}>
      <span className={cx('line-number')}>{pos + 1}</span>
      {html ? (
        <span
          className={classNames('loc-html', cx('line-content'))}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <span className={cx('line-content')}>{out}</span>
      )}
      <span className={cx('line-time')}>{`${time}s`}</span>
    </div>
  );
};

LogsLine.propTypes = {
  out: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
  html: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
};

const StageError = ({ error }) => (
  <div className={cx('stage-error')}>
    <Status className={cx('status')} status="error" />
    <span className={cx('text')}>{error}</span>
  </div>
);

StageError.propTypes = {
  error: PropTypes.string.isRequired,
};

const Console = React.forwardRef((props, ref) => {
  const {
    className,
    height,
    showHeader,
    showFooter,
    shownLogsLimit,
    tmateLink,
    logs,
    showLogsLoadingLine,
    areLogsLoading,
    stepData,
    showDownloadBtn,
    showFollowLogsBtn,
    logsBlobName,
    showCloseBtn,
    onCloseBtnClick,
    stageError,
    stageStatus,
  } = props;

  const [showAllLogs, setShowAllLogs] = useState(false);
  const [shouldFollowLogs, setShouldFollowLogs] = useState(false);

  const bottomAnchorRef = useRef();

  const handleDownloadClick = () => createAndDownloadLogsBlob(logs, logsBlobName);

  const handleShowAllLogsClick = () => setShowAllLogs(true);
  const toggleFollowLogs = () => setShouldFollowLogs((prev) => !prev);

  // follow logs logic
  useEffect(() => {
    if (shouldFollowLogs && stepData.status === 'running' && logs.length) {
      bottomAnchorRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    } else {
      setShouldFollowLogs(false);
    }
  }, [shouldFollowLogs, stepData.status, logs.length]);

  return (
    <div
      className={cx('wrapper', className)}
      ref={ref}
      style={{ height }}
    >
      {showHeader && (

      <ConsoleHeader
        areLogsLoading={areLogsLoading}
        showDownloadBtn={showDownloadBtn}
        showFollowLogsBtn={showFollowLogsBtn}
        showCloseBtn={showCloseBtn}
        shouldFollowLogs={shouldFollowLogs}
        toggleFollowLogs={toggleFollowLogs}
        handleDownloadClick={handleDownloadClick}
        onCloseBtnClick={onCloseBtnClick}
      />
      )}
      <pre
        className={cx('terminal')}
      >
        <ShowAllLogsBtn
          shouldShow={
        logs.length > shownLogsLimit && !showAllLogs
      }
          handleShowAllLogsClick={handleShowAllLogsClick}
        />
        {stageError && <StageError error={stageError} />}
        <code className={classNames('ansi-hook', cx('output'))}>
          <LogsLoadingLine
            shouldShow={showLogsLoadingLine}
          />
          {logs.length
      && !areLogsLoading
            ? mayBeLimitLogs(logs, showAllLogs)
              .map((log) => <LogsLine {...log} key={log.pos} />) : null}
          <div ref={bottomAnchorRef} />
        </code>
      </pre>
      {showFooter && (

      <ConsoleFooter
        stepStatus={stepData.status}
        stepError={stepData.error}
        stepExitCode={stepData.exit_code}
        tmateLink={tmateLink}
        stageError={stageError}
        stageStatus={stageStatus}
      />
      )}
    </div>
  );
});

Console.propTypes = {
  areLogsLoading: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  showCloseBtn: PropTypes.bool,
  shownLogsLimit: PropTypes.number,
  tmateLink: PropTypes.string,
  logs: PropTypes.arrayOf(PropTypes.shape({
    out: PropTypes.string,
    html: PropTypes.string,
    pos: PropTypes.number,
    time: PropTypes.number,
  })),
  showLogsLoadingLine: PropTypes.bool,
  stepData: PropTypes.shape({
    error: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    stopped: PropTypes.number,
    exit_code: PropTypes.number,
  }),
  showDownloadBtn: PropTypes.bool,
  showFollowLogsBtn: PropTypes.bool,
  logsBlobName: PropTypes.string,
  onCloseBtnClick: PropTypes.func,
  stageError: PropTypes.string,
  stageStatus: PropTypes.string,
};

Console.defaultProps = {
  areLogsLoading: true,
  showHeader: true,
  showFooter: true,
  shownLogsLimit: 250,
  tmateLink: '',
  logs: [],
  showLogsLoadingLine: false,
  stepData: {},
  showDownloadBtn: false,
  showFollowLogsBtn: false,
  showCloseBtn: false,
  onCloseBtnClick: undefined,
  logsBlobName: 'step_logs',
  stageError: null,
  stageStatus: null,
};

export default Console;
