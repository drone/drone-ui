import React from 'react';
import { connect } from 'react-redux';

import { getRepo } from '../../data/repos/actions';

class Content extends React.Component {
  componentDidMount() {
    const {owner, name} = this.props.params;

    this.props.dispatch(getRepo(owner, name));
  }

  render() {
    return (
      <div>repository!</div>
    );
  }
}

export default connect()(Content);
