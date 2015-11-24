import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { postNode } from "../../../actions/node_actions";

class Page extends Component {
  constructor(props) {
    super(props)

    this.addMachine = this.addMachine.bind(this);
  }

  addMachine() {
    const {dispatch} = this.props;
    const machine = {
      address: this.refs.address.value,
      cert: this.refs.cert.value,
      key: this.refs.key.value,
      ca: this.refs.ca.value,
    };
    dispatch(postNode(machine));
  }

  render() {
    const {status} = this.props;

    var message = (
      <div className="alert alert-info">
        this is some text explaining this page
      </div>
    );

    if (status.isError) {
      message = (
        <div className="alert alert-danger">
          Failed to add machine {status.target.address}. {status.errorText}.
        </div>
      );
    }
    if (status.isSuccess) {
      message = (
        <div className="alert alert-success">
          Successfully added {status.target.address}. <Link to="/system/nodes">Return</Link> to the machine list.
        </div>
      );
    }

    return (
      <div className="container">
        {message}
        
        <form>
          <input ref="address" placeholder="unix:///var/run/docker.sock" />
          <label>Cert</label>
          <textarea ref="cert" />
          <label>Key</label>
          <textarea ref="key"/>
          <label>CA</label>
          <textarea ref="ca"/>
          <button type="button" onClick={this.addMachine}>Add Machine</button>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    status: state.status
  }
}

Page.props = {
  status: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page)