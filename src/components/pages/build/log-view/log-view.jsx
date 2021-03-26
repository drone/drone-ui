import classNames from 'classnames/bind';
import React, { useCallback, useState, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

import Modal, { useModal } from 'components/shared/modal';

import ConsoleManager from './console-manager';
import css from './log-view.module.scss';
import StageNav from './stage-nav';

const cx = classNames.bind(css);

const LogView = (props) => {
  const {
    stage = 1, step = 1,
  } = useParams();
  const {
    isDataLoading,
    data,
  } = props;
  const [isModalShowing, toggleModal] = useModal();
  const [shouldHandleStepClick, setShouldHandleStepClick] = useState(false);
  const handleStepClick = useCallback(() => (shouldHandleStepClick ? toggleModal() : {}), [shouldHandleStepClick, toggleModal]);

  useLayoutEffect(() => {
    if (window.innerWidth < 768) {
      setShouldHandleStepClick(true);
    }
  }, []);

  return (
    <>
      <section className={cx('page-wrapper')}>
        <div className={cx('inner')}>
          <StageNav
            isDataLoading={isDataLoading}
            className={cx('navbar')}
            stages={data?.stages}
            onStepClick={handleStepClick}
          />
          <div className={cx('logs')}>
            <ConsoleManager
              isDataLoading={isDataLoading}
              hasBuildDebugMode={data?.debug || false}
              buildStatus={data?.status}
              stageStatus={data?.stages?.[stage - 1]?.status}
              stageName={data?.stages?.[stage - 1]?.name}
              stepData={data?.stages?.[stage - 1]?.steps?.[step - 1]}
            />
          </div>
        </div>
      </section>
      <Modal
        isShowing={isModalShowing}
        appearance="plain"
        hide={toggleModal}
      >
        <ConsoleManager
          consoleProps={{
            showCloseBtn: true,
            onCloseBtnClick: toggleModal,
          }}
          isDataLoading={isDataLoading}
          hasBuildDebugMode={data?.debug || false}
          buildStatus={data?.status}
          stageStatus={data?.stages?.[stage - 1]?.status}
          stageName={data?.stages?.[stage - 1]?.name}
          stepData={data?.stages?.[stage - 1]?.steps?.[step - 1]}
        />
      </Modal>
    </>
  );
};

export default LogView;
