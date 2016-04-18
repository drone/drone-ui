import React from 'react';
import { connect } from 'react-redux';

import './index.less';

import PageContent from '../../components/layout/content';
import Row from '../../components/grid/row';
import Col from '../../components/grid/col';

class Content extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    const host = window.location.origin;

    const markdown = `[![Build Status](${host}/api/badges/${owner}/${name}/status.svg)](${host}/${owner}/${name})`;
    const markup = `<a href="${host}/${owner}/${name}"><img src="${host}/api/badges/${owner}/${name}/status.svg"/></a>`;
    const ccMenu = `${host}/api/badges/${owner}/${name}/cc.xml`;

    return (
      <PageContent className="repository-badge">
        <Row>
          <Col xs={12} sm={2}>Markdown</Col>
          <Col xs={12} sm={10}>
            <pre>{markdown}</pre>
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col xs={12} sm={2}>Markup</Col>
          <Col xs={12} sm={10}>
            <pre>{markup}</pre>
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col xs={12} sm={2}>CC Menu</Col>
          <Col xs={12} sm={10}>
            <pre>{ccMenu}</pre>
          </Col>
        </Row>
      </PageContent>
    );
  }
}

export default connect()(Content);
