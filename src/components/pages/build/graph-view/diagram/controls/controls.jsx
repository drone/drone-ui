import classNames from 'classnames/bind';
import React, {
  useCallback,
} from 'react';

import Button from 'components/shared/button';
import { ReactComponent as ZoomInIcon } from 'svg/zoom-in.svg';
import { ReactComponent as ZoomOutIcon } from 'svg/zoom-out.svg';
import { ReactComponent as ZoomResetIcon } from 'svg/zoom-reset.svg';
import { ReactComponent as ZoomToFitIcon } from 'svg/zoom-to-fit.svg';

import css from './controls.module.scss';

const cx = classNames.bind(css);

const Controls = (props) => {
  const { engine } = props;

  const zoomToFit = useCallback(() => {
    engine.zoomToFit();
  }, [engine]);

  const zoomReset = useCallback(() => {
    engine.getModel().setZoomLevel(100);
    engine.getModel().setOffset(0, 0);
    engine.repaintCanvas();
  }, [engine]);

  const zoomIn = useCallback(() => {
    const zoomLevel = engine.getModel().getZoomLevel();
    engine.getModel().setZoomLevel(zoomLevel + 20);
    engine.repaintCanvas();
  }, [engine]);

  const zoomOut = useCallback(() => {
    const zoomLevel = engine.getModel().getZoomLevel();
    engine.getModel().setZoomLevel(zoomLevel - 20);
    engine.repaintCanvas();
  }, [engine]);
  return (
    <div className={cx('diagram-controls')}>
      <Button
        className={cx('btn')}
        title="Zoom to fit"
        onClick={zoomToFit}
      >
        <ZoomToFitIcon />

      </Button>
      <Button
        className={cx('btn')}
        title="Reset zoom"
        onClick={zoomReset}
      >
        <ZoomResetIcon />

      </Button>
      <div className={cx('diagram-controls-group')}>
        <Button
          className={cx('btn', 'btn-zoom-in')}
          title="Zoom in"
          onClick={zoomIn}
        >
          <ZoomInIcon />

        </Button>
        <Button
          className={cx('btn', 'btn-zoom-out')}
          title="Zoom out"
          onClick={zoomOut}
        >
          <ZoomOutIcon />

        </Button>
      </div>
    </div>
  );
};

export default Controls;
