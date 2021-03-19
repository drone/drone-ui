import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import React from 'react';

import { NodeEdgeModel } from './node-edge-model';
import { NodeEdgeWidget } from './node-edge-widget';

export class NodeEdgeFactory extends AbstractReactFactory {
  constructor() {
    super('node-edge');
  }

  generateModel() {
    return new NodeEdgeModel();
  }

  generateReactWidget(event) {
    return <NodeEdgeWidget engine={this.engine} node={event.model} />;
  }
}
