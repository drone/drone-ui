import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { pushState } from "redux-router";
import Header from "../components/header";
import HeaderGuest from "../components/header_guest";

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(nextValue) {
    this.props.pushState(null, `/${nextValue}`)
  }

  render() {
    const { content, pagehead, pagenav } = this.props.children;
    
    var header;
    if (this.props.user) {
      header = <Header user={this.props.user} />;
    } else {
      header = <HeaderGuest />;
    }

    return (
      <div>
        {header}
        <div>{pagehead}</div>
        <div id="content">{content || this.props.children}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    router: state.router,
  }
}

App.props = {
  children: PropTypes.node,
  pushState: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, {
  pushState,
})(App);
