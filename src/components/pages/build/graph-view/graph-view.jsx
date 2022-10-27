import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import './graph-view.scss';

import { useDynamicHeight } from 'hooks';

import Diagram from './diagram';
import css from './graph-view.module.scss';
import StepInfoDrawer from './step-info-drawer';

const cx = classNames.bind(css);

const GraphView = (props) => {
  const { data, isDataLoading } = props;
  const {
    namespace, name, build, stage = 1, step = 1,
  } = useParams();
  const history = useHistory();
  const [isStepInfoShown, setIsStepInfoShown] = useState(false);
  const {
    dynamicHeightRef, dynamicHeight,
  } = useDynamicHeight((height) => height);

  const hideStepInfoDrawer = () => setIsStepInfoShown(false);
  const showStepInfoDrawer = () => setIsStepInfoShown(true);

  const stageSelectHandler = (selectedStage) => {
    history.replace(`/${namespace}/${name}/${build}/${selectedStage}/1`);
  };

  const stepSelectHandler = (selectedStep) => {
    showStepInfoDrawer();
    history.replace(`/${namespace}/${name}/${build}/${stage}/${selectedStep}`);
  };

  return (
    <section className={cx('graph-wrapper')} ref={dynamicHeightRef} style={{ height: dynamicHeight }}>
      <SplitPane
        split="horizontal"
        minSize={190}
        defaultSize={dynamicHeight / 2}
        maxSize={dynamicHeight - 190}
      >
        <div className={cx('graph-stages')}>
          <Diagram
            kind="stage"
            items={data?.stages}
            nodeSelectHandler={stageSelectHandler}
            selectedNodeNumber={stage}
            graphOffsetX={60}
            graphOffsetY={60}
          />
        </div>
        <div className={cx('graph-steps')}>
          <Diagram
            items={data?.stages?.[stage - 1]?.steps}
            nodeSelectHandler={stepSelectHandler}
            selectedNodeNumber={step}
            graphOffsetX={60}
            graphOffsetY={60}
          />
        </div>
      </SplitPane>
      <StepInfoDrawer
        isShown={isStepInfoShown}
        hide={hideStepInfoDrawer}
        isDataLoading={isDataLoading}
        data={data}
      />
    </section>
  );
};

export default GraphView;
