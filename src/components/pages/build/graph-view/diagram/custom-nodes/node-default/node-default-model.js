import { DefaultPortModel, NodeModel } from '@projectstorm/react-diagrams';

export class NodeDefaultModel extends NodeModel {
  constructor(options = {}) {
    super({
      ...options,
      type: 'node-default',
    });
    // for the graph to be layout correctly
    this.width = 80;
    this.height = 36;
    this.isImperativelySelected = false;
  }

  setIsImperativelySelected(selected) {
    this.isImperativelySelected = selected;
  }

  addPort(port) {
    super.addPort(port);
    return port;
  }

  addInPort(label) {
    const port = new DefaultPortModel({
      in: true,
      name: label,
      label,
    });
    return this.addPort(port);
  }

  addOutPort(label) {
    const port = new DefaultPortModel({
      in: false,
      name: label,
      label,
    });
    return this.addPort(port);
  }

  serialize() {
    return {
      ...super.serialize(),
      color: this.color,
    };
  }

  deserialize(ob, engine) {
    super.deserialize(ob, engine);
    this.color = ob.color;
  }
}
