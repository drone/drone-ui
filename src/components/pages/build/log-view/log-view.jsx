import classNames from 'classnames/bind';
import React from 'react';
import { useParams } from 'react-router-dom';

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
  return (
    <section className={cx('page-wrapper')}>
      <div className={cx('inner')}>
        <StageNav
          isDataLoading={isDataLoading}
          className={cx('navbar')}
          stages={data?.stages}
        />
        <div className={cx('logs')}>
          <ConsoleManager
            isDataLoading={isDataLoading}
            hasBuildDebugMode={data?.debug || false}
            buildStatus={data?.status}
            stageStatus={data?.stages?.[stage - 1]?.status}
            stageNumber={data?.stages?.[stage - 1]?.number}
            stageName={data?.stages?.[stage - 1]?.name}
            stepData={data?.stages?.[stage - 1]?.steps?.[step - 1]}
          />
        </div>
      </div>
    </section>
  );
};

export default LogView;
