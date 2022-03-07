import classNames from 'classnames/bind';
import { PropTypes } from 'prop-types';
import React, {
  useState,
} from 'react';
import { NavLink, useParams } from 'react-router-dom';

import Elapsed from 'components/shared/elapsed';
import Status from 'components/shared/status';
import { useDynamicHeight } from 'hooks';
import { ReactComponent as ChevronIcon } from 'svg/chevron-down.svg';

import styles from './stage-nav.module.scss';

const cx = classNames.bind(styles);

export default function StageNav(props) {
  const {
    isDataLoading,
    stages = [],
    className,
    onStepClick,
  } = props;
  const {
    namespace, name, build, stage = 1,
  } = useParams();
  const { dynamicHeight, dynamicHeightRef } = useDynamicHeight();
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h3 className={cx('title')}>Pipeline stages</h3>
        <span className={cx('counter')}>{isDataLoading ? null : `${stages.length} ${stages.length === 1 ? 'stage' : 'stages'}`}</span>
      </div>
      <nav
        className={classNames(cx('inner'), className)}
        ref={dynamicHeightRef}
        style={{ height: dynamicHeight }}
      >
        {isDataLoading ? (
          <div className={cx('stage')}>
            <h3 className={cx('stage-header')}>
              Loading...
            </h3>
          </div>
        )
          : stages
            .map(({
              id: stageId,
              name: stageName,
              status: stageStatus,
              started: stageStarted,
              stopped: stageStopped,
              steps,
              number: stageNumber,
              error,
            }) => {
              if (!steps?.length || [
                'skipped',
                'blocked',
                'pending',
                'waiting_on_dependencies',
              ].includes(stageStatus)) {
                return (
                  <StageEmpty
                    key={stageId}
                    stageId={stageId}
                    stageName={stageName}
                    stageStatus={stageStatus}
                    stageStarted={stageStarted}
                    stageStopped={stageStopped}
                    namespace={namespace}
                    name={name}
                    build={build}
                    stageNumber={stageNumber}
                  />
                );
              }
              return (
                <StageDefault
                  key={stageId}
                  stageId={stageId}
                  stageName={stageName}
                  stageStatus={stageStatus}
                  stageStarted={stageStarted}
                  stageStopped={stageStopped}
                  stageNumber={stageNumber}
                  steps={steps}
                  namespace={namespace}
                  name={name}
                  build={build}
                  stageInPath={Number(stage)}
                  error={error}
                  onStepClick={onStepClick}
                />
              );
            })}
      </nav>
    </div>
  );
}

const StageDefault = (props) => {
  const {
    stageStatus,
    stageName,
    stageStarted,
    stageNumber,
    stageStopped,
    steps,
    name,
    namespace,
    build,
    stageInPath,
    onStepClick,
  } = props;
  const [isExpanded, setIsExpanded] = useState(stageNumber === stageInPath);
  const toggleIsExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <div className={cx('stage', { 'stage-expanded': isExpanded })}>
      <button
        type="button"
        className={cx('stage-header', { 'stage-header-expanded': isExpanded })}
        onClick={toggleIsExpanded}
      >
        <ChevronIcon className={cx('chevron')} />
        <Status className={cx('stage-status')} status={stageStatus} />
        <span className={cx('name')}>{stageName}</span>
        <Elapsed className={cx('time')} started={stageStarted} finished={stageStopped} />
      </button>
      {isExpanded && (
      <ul className={cx('stage-steps')}>
        <li className={cx('steps-header')}>
          Steps
          <i className={cx('divider')} />
        </li>
        {steps.sort((a, b) => a.number - b.number).map(({
          id: stepId, status, name: stepName, started, stopped, number: stepNumber,
        }, stepIndex) => (
          <li key={stepId}>
            <NavLink
              activeClassName={cx('stage-step-active')}
              className={cx('stage-step')}
              isActive={stepIndex ? undefined : (match, location) => {
                // if path looks like namespace/name/build
                // highlight the first step in the first stage
                // by default to match logs behavior
                const isStepInPath = !!location.pathname.split('/')[4];
                return (match || (stageNumber === stageInPath && !isStepInPath));
              }}
              to={`/${namespace}/${name}/${build}/${stageNumber}/${stepNumber}`}
              title={stepName}
              exact
              onClick={onStepClick}
            >
              <Status className={cx('status')} status={status} />
              <span className={cx('name')}>{stepName}</span>
              <Elapsed className={cx('time')} started={started} finished={stopped} />
            </NavLink>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

const StageEmpty = (props) => {
  const {
    stageStatus,
    stageName,
    stageStarted,
    stageStopped,
    namespace,
    name,
    build,
    stageNumber,
  } = props;
  return (
    <NavLink
      activeClassName={cx('stage-active')}
      className={cx('stage')}
      to={`/${namespace}/${name}/${build}/${stageNumber}`}
      exact
    >
      <h3 className={cx('stage-header')}>
        <ChevronIcon className={cx('chevron-hidden')} />
        <Status className={cx('stage-status')} status={stageStatus} />
        <span className={cx('name')}>{stageName}</span>
        <Elapsed className={cx('time')} started={stageStarted} finished={stageStopped} />
      </h3>
    </NavLink>
  );
};

StageNav.propTypes = {
  className: PropTypes.string.isRequired,
  stages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    started: PropTypes.number.isRequired,
    stopped: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      started: PropTypes.number.isRequired,
      stopped: PropTypes.number.isRequired,
    })),
    number: PropTypes.number.isRequired,
  })),
  isDataLoading: PropTypes.bool.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

StageNav.defaultProps = {
  stages: [],
};

StageDefault.propTypes = {
  stageStatus: PropTypes.string.isRequired,
  stageName: PropTypes.string.isRequired,
  stageStarted: PropTypes.number.isRequired,
  stageNumber: PropTypes.number.isRequired,
  stageStopped: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    started: PropTypes.number.isRequired,
    stopped: PropTypes.number.isRequired,
  })).isRequired,
  name: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  build: PropTypes.string.isRequired,
  stageInPath: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
};

StageEmpty.propTypes = {
  stageStatus: PropTypes.string.isRequired,
  stageName: PropTypes.string.isRequired,
  stageStarted: PropTypes.number.isRequired,
  stageStopped: PropTypes.number.isRequired,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  build: PropTypes.string.isRequired,
  stageNumber: PropTypes.number.isRequired,
};
