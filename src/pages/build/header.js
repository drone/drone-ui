import {branch} from 'baobab-react/higher-order';
import {Link} from 'react-router';
import React from 'react';
import Breadcrumb, {SEPARATOR} from '../../components/layout/breadcrumb';

class Header extends React.Component {
  render() {
    const {owner, name, number} = this.props.params;

    return (
      <Breadcrumb elements={[
        <Link to={`/${owner}/${name}`}>{owner} / {name}</Link>,
        SEPARATOR,
        <Link to={`/${owner}/${name}/${number}`}>{number}</Link>
      ]}/>
    );
  }
}

export default branch({}, Header);
