import classNames from 'classnames/bind';
import { formatDistanceToNow, intervalToDuration } from 'date-fns';
import React from 'react';

import { ReactComponent as ClockIcon } from 'svg/clock.svg';

import css from './elapsed.module.scss';

const cx = classNames.bind(css);

// local helpers
const padTime = (n, withLetters) => n.toString().padStart(withLetters ? 1 : 2, '0');

const getTimeElapsed = ({ started, finished, withLetters = false }) => {
  if (!started || !finished) return '';
  const {
    days, hours, minutes, seconds,
  } = intervalToDuration({
    start: new Date(started * 1000),
    end: new Date(finished * 1000),
  });
  if (withLetters) {
    return `${days ? `${padTime(days, withLetters)}d` : ''} ${hours ? `${padTime(hours, withLetters)}h` : ''} ${padTime(minutes, withLetters)}m ${padTime(seconds, withLetters)}s`;
  }
  return `${days ? `${padTime(days)}` : ''} ${hours ? `${padTime(hours)}:` : ''}${padTime(minutes)}:${padTime(seconds)}`;
};

const getTimeElapsedSince = ({ dateSince }) => formatDistanceToNow(
  dateSince * 1000, { addSuffix: true },
);

// local helper hook
const useDynamicElapsedTime = ({ started, withLetters }) => {
  const [time, setTime] = React.useState(() => getTimeElapsed({ started, finished: Date.now() / 1000, withLetters }));
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeElapsed({ started, finished: Date.now() / 1000, withLetters }));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, withLetters]);
  return time;
};

const ElapsedContent = (props) => {
  const {
    className, withIcon, label, elapsed,
  } = props;
  return (
    <div className={cx('elapsed-static', className || '')}>
      {withIcon ? (
        <ClockIcon />
      ) : null}
      {label && (
        <span>
          {label}
          &nbsp;
        </span>
      )}
      {elapsed}
    </div>
  );
};

const ElapsedDynamic = (props) => {
  const {
    started, className, withIcon, withLetters, label,
  } = props;
  const elapsed = useDynamicElapsedTime({ started, withLetters });
  return (
    <ElapsedContent
      className={className}
      elapsed={elapsed}
      withIcon={withIcon}
      label={label}
    />
  );
};

const ElapsedStatic = (props) => {
  const {
    className, started, finished, withIcon, withLetters, since, label,
  } = props;
  const elapsed = since
    ? getTimeElapsedSince({ dateSince: finished })
    : getTimeElapsed({ started, finished, withLetters });
  return (
    <ElapsedContent
      elapsed={elapsed}
      withIcon={withIcon}
      className={className}
      label={label}
    />
  );
};

const Elapsed = (props) => {
  const { started, finished } = props;
  if (started && !finished) {
    return <ElapsedDynamic {...props} />;
  }
  return <ElapsedStatic {...props} />;
};

export default Elapsed;
export { ElapsedDynamic, ElapsedStatic };
