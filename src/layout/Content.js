import React from 'react';

import { styles as globalStyles } from '../style';

export default
class Content extends React.Component {
  render() {
    let styles = {
      maxWidth: globalStyles.layout.maxWidth,
      marginTop: globalStyles.layout.margins.top,
      marginRight: 'auto',
      marginBottom: globalStyles.layout.margins.bottom,
      marginLeft: 'auto',
      paddingRight: globalStyles.layout.margins.right,
      paddingLeft: globalStyles.layout.margins.left
    };

    return (
      <main style={styles}>
        {this.props.children}
      </main>
    );
  }
}
