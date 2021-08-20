import classNames from 'classnames/bind';
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
                  stageInPath={stage}
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
  const [isExpanded, setIsExpanded] = useState(stageNumber == stageInPath);
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
        {steps.map(({
          id: stepId, status, name: stepName, started, stopped,
        }, stepIndex) => (status === 'skipped' ? (
          <li key={stepId}>
            <div className={cx('stage-step', 'stage-step-unselectable')}>
              <Status className={cx('status')} status={status} />
              <span className={cx('name')}>{stepName}</span>
            </div>
          </li>
        ) : (
          <li key={stepId}>
            <NavLink
              activeClassName={cx('stage-step-active')}
              className={cx('stage-step')}
              isActive={stepIndex ? undefined : (match, location) => {
                // if path looks like namespace/name/build
                // highlight the first step in the first stage
                // by default to match logs behavior
                const [, , , , stepIdx] = location.pathname.split('/').filter(Boolean);
                return (match || (stageNumber == stageInPath && !stepIdx));
              }}
              to={`/${namespace}/${name}/${build}/${stageNumber}/${stepIndex + 1}`}
              exact
              onClick={onStepClick}
            >
              <Status className={cx('status')} status={status} />
              <span className={cx('name')}>{stepName}</span>
              <Elapsed className={cx('time')} started={started} finished={stopped} />
            </NavLink>
          </li>
        )))}
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
  } = props;
  return (
    <div className={cx('stage')}>
      <h3 className={cx('stage-header', 'stage-header-unselectable')}>
        <ChevronIcon className={cx('chevron', 'chevron-disabled')} />
        <Status className={cx('stage-status')} status={stageStatus} />
        <span className={cx('name')}>{stageName}</span>
        <Elapsed className={cx('time')} started={stageStarted} finished={stageStopped} />
      </h3>
    </div>
  );
};
