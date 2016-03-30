import React from 'react';

import {styles as globalStyles} from '../../style';
import Logo from './Logo';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

export default
class Header extends React.Component {
  render() {
    let styles = {
      header: {
        marginTop: globalStyles.layout.margins.top,
        marginLeft: globalStyles.layout.margins.left,
        marginRight: globalStyles.layout.margins.right,
        marginBottom: globalStyles.layout.margins.bottom
      },
      search: Object.assign({}, globalStyles.input, {
        width: 256,
        float: 'left'
      }),
      avatar: {
        marginLeft: globalStyles.layout.margins.left / 2
      },
      dropdown: {
        marginLeft: globalStyles.layout.margins.left / 2
      }
    };

    return (
      <header style={styles.header}>
        <Logo/>
        <div style={{float:'right'}}>
          <input type="search" name="search" placeholder="Search..." style={styles.search}/>
          <Avatar style={styles.avatar}/>
          <Dropdown style={styles.dropdown}/>
        </div>
      </header>
    );
  }
}
