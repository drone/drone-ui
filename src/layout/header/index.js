import React from 'react';
import { Link } from 'react-router';

import Row from '../grid/row';
import Col from '../grid/col';

import Logo from './logo';
import Avatar from './avatar';
import Dropdown from './dropdown';

export default
class Header extends React.Component {
  render() {
    const {user} = this.props;

    return (
      <header className="header">
        <Row>
          <Col xs={6} sm={1}>
            <Link to="/">
              <Logo/>
            </Link>
          </Col>
          <Col xs={6} sm={2} last-sm>
            <Dropdown/>
            <Avatar src={user.get('avatar_url')}/>
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
