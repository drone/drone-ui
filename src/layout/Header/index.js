import React from 'react';

import Row from '../grid/row';
import Col from '../grid/col';

import Logo from './logo';
import Avatar from './avatar';
import Dropdown from './dropdown';

export default
class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <Row>
          <Col xs={6} sm={1}>
            <Logo/>
          </Col>
          <Col xs={6} sm={2} last-sm>
            <Dropdown/>
            <Avatar/>
          </Col>
          <Col xs={12} sm={5} sm-offset={4}>
            <div className="search">
              <input type="search" name="search" placeholder="Search..."/>
            </div>
          </Col>
        </Row>
      </header>
    );
  }
}
