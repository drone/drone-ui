import { PortWidget } from '@projectstorm/react-diagrams';
import classNames from 'classnames/bind';
import React from 'react';

import { ReactComponent as GraphStartIcon } from 'svg/graph-start.svg';

import css from './node-edge-widget.module.scss';

const cx = classNames.bind(css);

const NodeEdgeWidget = (props) => {
  const { engine, node } = props;
  return (
    <div className={cx('node-wrapper')}>
      <button
        className={cx('node-inner')}
        type="button"
      >
        {node.getPort('in') && (
        <PortWidget className={cx('port', 'port-in')} engine={engine} port={node.getPort('in')}>
          <div className={cx('circle-port', 'circle-port-in')} />
        </PortWidget>
        )}
        {node.getPort('out') && (
        <PortWidget className={cx('port', 'port-out')} engine={engine} port={node.getPort('out')}>
          <div className={cx('circle-port', 'circle-port-out')} />
        </PortWidget>
        )}
        {node.isStart ? (
          <GraphStartIcon />
        ) : (
          <i className={cx('fake-icon-stop')} />)}
      </button>
    </div>
  );
};

export { NodeEdgeWidget };
