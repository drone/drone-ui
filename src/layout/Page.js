import React from 'react';

import { styles } from '../style';

import Header from './Header/index';
import Breadcrumb from './Breadcrumb';
import Content from './Content';

export default
class Page extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <Breadcrumb/>
        <hr style={styles.hr}/>
        <Content>
          hello world
        </Content>
      </div>
    );
  }
}
