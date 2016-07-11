import {branch} from 'baobab-react/higher-order';
import PageContent from '../../components/layout/content';
import React from 'react';
import {Grid, Cell} from 'react-mdl';

import './index.less';

class Content extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    const host = window.location.origin;

    const markdown = `[![Build Status](${host}/api/badges/${owner}/${name}/status.svg)](${host}/${owner}/${name})`;
    const markup = `<a href="${host}/${owner}/${name}"><img src="${host}/api/badges/${owner}/${name}/status.svg"/></a>`;
    const ccMenu = `${host}/api/badges/${owner}/${name}/cc.xml`;

    return (
      <PageContent className="repository-badge">
        <Grid>
          <Cell phone={12} col={2}>Markdown</Cell>
          <Cell phone={12} col={10}>
            <pre>{markdown}</pre>
          </Cell>
        </Grid>

        <hr/>

        <Grid>
          <Cell phone={12} col={2}>Markup</Cell>
          <Cell phone={12} col={10}>
            <pre>{markup}</pre>
          </Cell>
        </Grid>

        <hr/>

        <Grid>
          <Cell phone={12} col={2}>CC Menu</Cell>
          <Cell phone={12} col={10}>
            <pre>{ccMenu}</pre>
          </Cell>
        </Grid>
      </PageContent>
    );
  }
}

export default branch((props) => {
  const {owner, name} = props.params;
  return {
    repository: ['repos', owner, name]
  };
}, Content);
