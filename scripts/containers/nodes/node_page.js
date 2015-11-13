import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchNodeList } from "../../actions/node_actions";
import { NodeList } from "../../components/node_list";
import { Link } from "react-router";

class Page extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchNodeList());
  }

  render() {
    return (
      <div className="container">
        <div className="toolbar">
          <Link className="btn btn-info" to="/system/nodes/add">New Node</Link>
        </div>
        <NodeList nodes={this.props.nodes} loading={this.props.loading} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.nodes.loading,
    nodes: state.nodes.list
  }
}

Page.props = {
  nodes: PropTypes.array,
  loading: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page)