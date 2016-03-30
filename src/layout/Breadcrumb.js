import React from 'react';

import {styles as globalStyles} from '../style';

export default
class Breadcrumb extends React.Component {
  render() {
    let styles = {
      root: {
        marginTop: globalStyles.layout.margins.top * 2,
        marginRight: globalStyles.layout.margins.right,
        marginBottom: globalStyles.layout.margins.bottom * 2,
        marginLeft: globalStyles.layout.margins.left
      },
      ol: {
        float: 'left',
        margin: 0,
        padding: 0
      },
      li: {
        display: 'inline-block',
        fontSize: 21
      }
    };

    return (
      <div style={styles.root}>
        <ol style={styles.ol}>
          <li style={styles.li}>MetalMatze / matthiasloibl.com</li>
          <li style={styles.li}>
            <i className="material-icons">chevron_right</i>
          </li>
          <li style={styles.li}>
            9
          </li>
        </ol>
        <div style={{clear:'both'}}></div>
      </div>
    );
  }
}
