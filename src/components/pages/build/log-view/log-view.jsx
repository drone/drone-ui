import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
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
  const handleStepClick = useCallback(
    () => (shouldHandleStepClick ? toggleModal() : {}), [shouldHandleStepClick, toggleModal],
  );

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
              stageError={data?.stages?.[stage - 1]?.error}
              stepData={data?.stages?.[stage - 1]?.steps?.[step - 1]}
            />
          </div>
        </div>
      </section>
      <Modal
        isShowing={isModalShowing}
        mode="fullscreen"
        hide={toggleModal}
      >
        <ConsoleManager
          consoleProps={{
            showCloseBtn: true,
            onCloseBtnClick: toggleModal,
            className: cx('console-mobile'),
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

LogView.propTypes = {
  isDataLoading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    debug: PropTypes.bool,
    status: PropTypes.string,
    stages: PropTypes.arrayOf(PropTypes.shape({
      status: PropTypes.string,
      name: PropTypes.string,
      error: PropTypes.string,
      steps: PropTypes.arrayOf(PropTypes.shape),
    })),
  }).isRequired,
};

export default LogView;
