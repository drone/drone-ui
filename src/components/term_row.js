import React from 'react';
import ansi_up from 'ansi_up';

import './term_row.less';

const opts = {use_classes: true};

export default
class TermRow extends React.Component {
  render() {
    const {out} = this.props.line;

    let html = ansi_up.escape_for_html(out || '');
    html = ansi_up.ansi_to_html(html, opts);
    html = ansi_up.linkify(html);

    return (
     <div className="term-row" dangerouslySetInnerHTML={{__html: html}}></div>
    );
  }
}
