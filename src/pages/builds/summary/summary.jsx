import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import PropTypes from 'prop-types';
import React, {
  useCallback, useMemo,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';

import BarChart from 'components/shared/bar-chart';

import css from './summary.module.scss';

const cx = classNames.bind(css);

/* local helpers */

const getSummaryMeta = (builds) => {
  const sortedByDuration = builds.slice().sort((a, b) => a.duration - b.duration);
  const sortedByStarted = builds.slice().sort((a, b) => a.timeStarted - b.timeStarted);

  const middle = Math.floor(sortedByDuration.length / 2);
  const median = Math.floor((
    sortedByDuration.length % 2
      ? sortedByDuration[middle].duration / 60
      : (sortedByDuration[middle - 1].duration + sortedByDuration[middle].duration) / 120));
  const medianReadable = median === 0 ? '< 1' : median;

  const latest = sortedByStarted[sortedByStarted.length - 1].timeStarted;
  const [number, ...units] = formatDistanceStrict(new Date(latest * 1000), new Date(), { addSuffix: true }).split(' ');
  return {
    median: medianReadable,
    latest: {
      number,
      units: units.join(' '),
      status: sortedByStarted[sortedByStarted.length - 1].status,
    },
  };
};

const Summary = (props) => {
  const { data, totalBuildsCounter, className } = props;
  const barData = useMemo(() => data.slice(0, 50).map((build) => ({
    number: build.number,
    duration: (build?.finished || Math.floor(Date.now() / 1000)) - (build.started || build.created),
    status: build.status,
    timeStarted: build.started || 0,
  })).filter(({ timeStarted }) => timeStarted >= 0).reverse(), [data]);
  const { namespace, name } = useParams();
  const history = useHistory();

  const handleBarClick = useCallback(({ number }) => history.push(`/${namespace}/${name}/${number}`), [namespace, name, history]);

  const { median, latest } = useMemo(() => getSummaryMeta(barData), [barData]);
  return (
    <div className={cx('wrapper', className)}>
      <div className={cx('info')}>
        <ul className={cx('summary')}>
          <li className={cx('item')}>
            <span className={cx('item-heading')}>Total Builds</span>
            <span className={cx('item-content')}>
              <span>
                {totalBuildsCounter}
              </span>
            </span>
          </li>
          <li className={cx('item')}>
            <span className={cx('item-heading')}>Median Build</span>
            <span className={cx('item-content')}>
              <span>
                {median}
                <sub>{median > 1 ? 'minutes' : 'minute'}</sub>
              </span>
            </span>
          </li>
          <li className={cx('item')}>
            <span className={cx('item-heading')}>Last Build</span>
            <span className={cx('item-content')}>
              {/* @NOTE: putting "ago" description and units under
                * the sub tag in order to prevent broken layout */}
              <span>
                {latest.number}
                <sub>{latest.units}</sub>
              </span>
            </span>
          </li>
          <li className={cx('item')}>
            <span className={cx('item-heading')}>Last Status</span>
            <span className={cx('item-content')}>
              <span className={cx('status', `status-${latest.status}`)}>
                {latest.status}
              </span>
            </span>
          </li>
        </ul>
      </div>
      <div className={cx('bar-wrapper')}>
        <BarChart
          data={barData}
          height={170}
          barsShown={50}
          onClick={handleBarClick}
        />
      </div>
    </div>
  );
};

Summary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.number,
    finished: PropTypes.number,
    started: PropTypes.number,
    created: PropTypes.number,
    status: PropTypes.string,
  })).isRequired,
  totalBuildsCounter: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Summary.defaultProps = {
  className: undefined,
};

export default Summary;
