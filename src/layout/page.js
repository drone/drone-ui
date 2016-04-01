import React from 'react';

import Header from 'header/index';
import Breadcrumb from './breadcrumb';
import Content from './content';

export default
class Page extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <Breadcrumb/>
        <hr/>
        <Content>
          hello world
        </Content>
      </div>
    );
  }
}
