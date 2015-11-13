import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

class Page extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container">
        Add Machine
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