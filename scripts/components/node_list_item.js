import React, { Component, PropTypes } from 'react'

export class NodeItem extends Component {
  constructor(props) {
    super(props)
    
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.node);
  }

  render() {
    return (
      <div className="col-sm-4">
        <div className="card">
          <div className="card-header">
            <i className="linux_amd64"></i>
          </div>
          <div className="card-block">
            <h3 className="addr">{this.props.node.address}</h3>
            <p className="arch card-text">{this.props.node.architecture}</p>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NodeItem.props = {
	node: PropTypes.object,
  onDelete: PropTypes.function
}
