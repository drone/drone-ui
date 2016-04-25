import React from 'react';

import Breadcrumb from '../../components/layout/breadcrumb';

export default
class Header extends React.Component {
  render() {
    return (
      <Breadcrumb elements={['Users']}/>
    );
  }
}
