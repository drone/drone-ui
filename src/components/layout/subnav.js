import React from 'react';
import { Grid } from 'react-mdl';

import './subnav.less';

export default
class Subnav extends React.Component {
  render() {
    return (
      <nav className="sub">
        <Grid>
          {this.props.children}
        </Grid>
      </nav>
    );
  }
}
