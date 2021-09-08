import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import { useResizeObserver } from 'hooks';

import css from './bar-chart.module.scss';

const cx = classNames.bind(css);

const MIN_BAR_WIDTH = 8;
const MAX_BAR_WIDTH = 10;
const MIN_GAP_WIDTH = 12;
const BARS_SHOWN = 50;

// local helpers
const roundUpMinutes = (secs, shouldBeDivisibleBy5) => {
  let temp = secs;
  if (shouldBeDivisibleBy5) {
    while (!(temp % 60) && !((temp / 60) % 5)) {
      temp += 1;
    }
  } else {
    while (temp % 60 !== 0) {
      temp += 1;
    }
  }
  return temp;
};

const getYTickValues = (data) => {
  const max = Math.max(...data.map((item) => item.duration));
  let topBp = roundUpMinutes(max);
  if (max < 60) {
    return [0, topBp];
  }
  if (max < 360) {
    return [0, Math.floor(topBp / 2), topBp];
  }
  topBp = roundUpMinutes(max, true);
  return [0, topBp * 0.25, topBp * 0.5, topBp * 0.75, topBp];
};

const BarChart = (props) => {
  const {
    className,
    data,
    height,
    onClick,
    minBarWidth = MIN_BAR_WIDTH,
    minGapWidth = MIN_GAP_WIDTH,
    barsShown = BARS_SHOWN,
  } = props;

  const [gridGap, setGridGap] = useState(minBarWidth);

  const [resizeObserverRef] = useResizeObserver((entries) => {
    // compute bar spacing taking into account 1:1 ratio
    const { width } = entries[0].contentRect;
    const gap = Math.floor(width / barsShown - minBarWidth);
    setGridGap(gap < minGapWidth ? minGapWidth : gap);
  }, {
    attributes: true,
    characterData: false,
    subtree: false,
    childList: false,
  });

  const yTickValues = useMemo(() => getYTickValues(data), [data]);

  // inject height and add bars placeholders
  const processedData = useMemo(() => {
    // get max time
    const max = yTickValues[yTickValues.length - 1];
    const withHeight = data.map((item) => {
      const barHeight = height * (item.duration / (max * 0.01) / 100);
      return {
        ...item,
        height: barHeight,
      };
    });
    if (data.length < barsShown) {
      const barPlaceholders = Array
        .from({ length: barsShown - data.length },
          (_, i) => ({ number: 0 - i }));
      return withHeight.concat(barPlaceholders);
    }
    return withHeight;
  }, [data, height, yTickValues, barsShown]);

  const handleBarClick = (bar) => (e) => {
    if (e.type !== 'keypress' || (e.type === 'keypress' && e.key === 'Enter')) {
      onClick(bar);
    }
  };

  return (
    <div className={cx('wrapper', className)} style={{ height }}>
      <div className={cx('y-axis')}>
        {yTickValues.map((value) => <span key={value}>{`${Math.floor(value / 60)}`}</span>)}
      </div>
      <div
        className={cx('chart-grid')}
        style={{ columnGap: gridGap, gridTemplateColumns: `repeat(50, minmax(${MIN_BAR_WIDTH}px, ${MAX_BAR_WIDTH}px))` }}
        ref={resizeObserverRef}
      >
        {processedData.map((bar) => {
          let actualBar = null;
          if (bar.status) {
            actualBar = (
              <div
                className={cx('bar', `bar-${bar.status}`)}
                data-build-number={bar.number}
                style={{ height: bar.height }}
                role="button"
                aria-label={bar.number}
                tabIndex={0}
                key={bar.number}
                data-test={bar.number}
                onClick={handleBarClick(bar)}
                onKeyPress={handleBarClick(bar)}
              />
            );
          }
          return (
            <div data-test={bar.number} className={cx('bar-background')} key={bar.number}>
              {actualBar}
            </div>
          );
        })}
      </div>
    </div>
  );
};

BarChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  minBarWidth: PropTypes.number,
  minGapWidth: PropTypes.number,
  barsShown: PropTypes.number,
};

BarChart.defaultProps = {
  className: '',
  minBarWidth: MIN_BAR_WIDTH,
  minGapWidth: MIN_GAP_WIDTH,
  barsShown: BARS_SHOWN,
};

export default BarChart;
