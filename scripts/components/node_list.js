import React, { Component, PropTypes } from 'react'
import { NodeItem } from "./node_list_item";

export class NodeList extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // renders a loading message
    if (this.props.loading) {
      return (
        <div>Loading Nodes</div>
      );
    }

    // renders an empty list message
    if (this.props.nodes.length === 0) {
      return (
        <div>No Nodes</div>
      );
    }

    var nodes = [];
    this.props.nodes.forEach(function(node) {
      nodes.push(<NodeItem node={node} key={node.id} onDelete={this.props.onDelete} />);
    }.bind(this));
    
    return (
      <div className="row row-node">
        {nodes}
      </div>
    );
  }
}

NodeList.props = {
  loading: PropTypes.bool,
  nodes: PropTypes.array,
  onDelete: PropTypes.function
}
