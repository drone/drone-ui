import { DefaultPortModel, NodeModel } from '@projectstorm/react-diagrams';

export class NodeEdgeModel extends NodeModel {
  constructor(options = {}) {
    const { isStart = true } = options;

    super({
      ...options,
      type: 'node-edge',
      name: isStart ? 'Start' : 'Stop',
    });

    this.isStart = isStart;
    // for the graph to be layout correctly
    this.width = 30;
    this.height = 30;

    if (this.isStart) {
      this.addPort(
        new DefaultPortModel({
          in: false,
          name: 'out',
        }),
      );
    } else {
      this.addPort(
        new DefaultPortModel({
          in: true,
          name: 'in',
        }),
      );
    }
  }

  serialize() {
    return super.serialize();
  }

  deserialize(ob, engine) {
    super.deserialize(ob, engine);
  }
}
