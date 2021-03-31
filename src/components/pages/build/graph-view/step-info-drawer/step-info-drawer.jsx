import classNames from 'classnames/bind';
import React, {
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/shared/button';
import Elapsed from 'components/shared/elapsed';
import Status from 'components/shared/status';
import { ReactComponent as CloseIcon } from 'svg/close.svg';
import { getFullDateRepresentation } from 'utils';

import ConsoleManager from '../../log-view/console-manager';

import css from './step-info-drawer.module.scss';

const cx = classNames.bind(css);

const StepInfoDrawer = (props) => {
  const {
    data,
    isDataLoading,
    isShown,
    hide,
  } = props;
  const { stage = 1, step = 1 } = useParams();
  const stepData = data?.stages?.[stage - 1]?.steps?.[step - 1];
  const drawerRef = useRef();
  if (!isShown || !stepData) {
    return null;
  }
  const handleStepDrawerHide = () => {
    drawerRef.current.classList.add(cx('slide-out'));
    setTimeout(hide, 200);
  };
  return (
    <div className={cx('step')} ref={drawerRef}>
      <div className={cx('step-header')}>
        <Status className={cx('status')} status={stepData?.status} />
        <h3 className={cx('heading')}>
          {stepData?.name}
        </h3>
        <Button onClick={handleStepDrawerHide}><CloseIcon /></Button>
      </div>

      <div className={cx('step-meta')}>
        {!['pending', 'skipped', 'blocked', 'waiting_on_dependencies'].includes(stepData?.status) ? (
          <dl>
            <dt>Started:</dt>
            <dd>{getFullDateRepresentation({ date: stepData?.started })}</dd>
            {stepData?.stopped && (
              <>
                <dt>Finished:</dt>
                <dd>{getFullDateRepresentation({ date: stepData?.stopped })}</dd>
              </>
            )}
            <dt>Duration:</dt>
            <dd><Elapsed started={stepData?.started} finished={stepData?.stopped} withLetters /></dd>
          </dl>
        ) : <div>Step data is unavailable</div>}
      </div>
      <ConsoleManager
        isDataLoading={isDataLoading}
        hasBuildDebugMode={data?.debug || false}
        buildStatus={data?.status}
        stageStatus={data?.stages?.[stage - 1]?.status}
        stageNumber={data?.stages?.[stage - 1]?.number}
        stageName={data?.stages?.[stage - 1]?.name}
        stepData={stepData}
        consoleProps={{
          showFooter: false,
          showHeader: true,
        }}
      />
    </div>
  );
};

export default StepInfoDrawer;
