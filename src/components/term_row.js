import ansi_up from 'ansi_up';
import React from 'react';

import './term_row.less';

const opts = {use_classes: true};

export default
class TermRow extends React.Component {
  render() {
    const {pos, out, time, type} = this.props.line;

    if (type === 2) {
      return (
       <div className="term-row term-row-exit-code">
        <div>exit code {out}</div>
       </div>
      )
    }

    let html = ansi_up.escape_for_html(out || '');
    html = ansi_up.ansi_to_html(html, opts);
    html = ansi_up.linkify(html);

    return (
     <div className="term-row">
      <div>{pos+1}</div>
      <div dangerouslySetInnerHTML={{__html: html}}></div>
      <div>{time || 0}s</div>
     </div>
    );
  }
}
