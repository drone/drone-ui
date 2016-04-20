import React from 'react';
import { connect } from 'react-redux';
import { Grid, Cell } from 'react-mdl';

import './index.less';

import PageContent from '../../components/layout/content';

class Content extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    return (
      <PageContent className="repository-settings">
        <Grid>
          <Cell phone={12} col={3}>Push Hooks</Cell>
          <Cell phone={12} col={9}>
            <input type="checkbox"/>
          </Cell>
        </Grid>
      </PageContent>
    );
  }
}

export default connect()(Content);
