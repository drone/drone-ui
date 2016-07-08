import React from 'react';

import TermRow from './term_row';

import './term.less';

export default
class Term extends React.Component {
  render() {
    const {name, lines} = this.props;
    
    let rows = [];
    for (var i=0;i < lines.length; i++) {
      let line = lines[i];
      rows.push(<TermRow line={line} key={i}/>);
    }

    return (
      <details className="term" open>
        <summary>{name}</summary>
        <div>{rows}</div>
      </details>
    );
  }
}
