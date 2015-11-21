import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

class Page extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container">
        <div className="alert alert-info">
          this is some text explaining this page
        </div>
        <div className="alert alert-success">
          successfully added node. add another or <Link to="/system/nodes">go back</Link> to the node list
        </div>
        <div className="alert alert-danger">
          failed to add node. error message here.
        </div>
        
        <form>
          <input ref="address" placeholder="unix:///var/run/docker.sock" />
          <label>Cert</label>
          <textarea ref="cert" />
          <label>Key</label>
          <textarea ref="key"/>
          <label>CA</label>
          <textarea ref="ca"/>
          <button type="button">Add Machine</button>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

Page.props = {
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page)