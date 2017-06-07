import ansi_up from 'ansi_up';
import React from 'react';

import './term_row.less';

const opts = {use_classes: true};

export default
class TermRow extends React.Component {
  render() {
    const {pos, out, time} = this.props.line;

    let html = ansi_up.escape_for_html(out || '');
    html = ansi_up.ansi_to_html(html, opts);

    return (
     <div className="term-row">
      <div className="row-num">{pos+1}</div>
      <div className="row-line" dangerouslySetInnerHTML={{__html: html}}></div>
      <div className="row-time">{time || 0}s</div>
     </div>
    );
  }
}
