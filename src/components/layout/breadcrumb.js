import React from 'react';
import { Cell } from 'react-mdl';

import './breadcrumb.less';

export const SEPARATOR = (
  <i className="material-icons">chevron_right</i>
);

export default
class Breadcrumb extends React.Component {
  render() {
    const {elements} = this.props;

    return (
      <Cell col={12} className="breadcrumb">
        <ol>
          {elements.map((element, index) => {
            return (
              <li key={index}>{element}</li>
            );
          })}
        </ol>
      </Cell>
    );
  }
}
