import { PortWidget } from '@projectstorm/react-diagrams';
import classNames from 'classnames/bind';
import React from 'react';

import Status from 'components/shared/status';

import css from './node-default-widget.module.scss';

const cx = classNames.bind(css);

const NodeDefaultWidget = (props) => {
  const { engine, node } = props;
  return (
    <div className={cx('node-wrapper')}>
      <button
        className={cx('node-inner', { 'node-inner-selected': node.isImperativelySelected }, `node-inner-${node.options.status}`)}
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

        <Status className={cx('status')} status={node.options.status} />
      </button>
      <p className={cx('name')}>{node.options.name}</p>
    </div>
  );
};

export { NodeDefaultWidget };
