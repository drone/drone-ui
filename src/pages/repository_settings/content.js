import React from 'react';
import { connect } from 'react-redux';

import './index.less';

import Row from '../../components/grid/row';
import Col from '../../components/grid/col';
import PageContent from '../../components/layout/content';

class Content extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    return (
      <PageContent className="repository-settings">
        <Row>
          <Col xs={12} sm={3}>Push Hooks</Col>
          <Col xs={12} sm={9}>
            <input type="checkbox"/>
          </Col>
        </Row>
      </PageContent>
    );
  }
}

export default connect()(Content);
