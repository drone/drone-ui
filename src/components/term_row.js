import aha from 'aha';
import {Buffer} from 'buffer';
import React from 'react';

import './term_row.less';

const opts = {no_header: true, stylesheet: true};

export default
class TermRow extends React.Component {
  render() {
    const {pos, out, time, type} = this.props.line;

    if (type === 2) {
      return (
       <div className="term-row term-row-exit-code">
        <div>exit code {out}</div>
       </div>
      );
    }

    let html = aha(Buffer.from(out || ''), opts);

    return (
     <div className="term-row">
      <div>{pos+1}</div>
      <div dangerouslySetInnerHTML={{__html: html}}></div>
      <div>{time || 0}s</div>
     </div>
    );
  }
}
