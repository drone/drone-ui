import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import React from 'react';

import { NodeDefaultModel } from './node-default-model';
import { NodeDefaultWidget } from './node-default-widget';

export class NodeDefaultFactory extends AbstractReactFactory {
  constructor() {
    super('node-default');
  }

  generateModel() {
    return new NodeDefaultModel();
  }

  generateReactWidget(event) {
    return <NodeDefaultWidget engine={this.engine} node={event.model} />;
  }
}
