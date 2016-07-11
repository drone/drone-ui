import {branch} from 'baobab-react/higher-order';
import Breadcrumb from '../../components/layout/breadcrumb';
import React from 'react';

class Header extends React.Component {
  componentDidMount() {
    const {owner, name} = this.props.params;
    document.title = `${owner}/${name} | drone`;
  }

  render() {
    const {owner, name} = this.props.params;

    return (
      <div>
        <Breadcrumb elements={[`${owner} / ${name}`]}/>
      </div>
    );
  }
}

export default branch({}, Header);
