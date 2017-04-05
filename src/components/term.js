import React from 'react';
import Status from './status';
import TermRow from './term_row';

import './term.less';

export default
class Term extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const {proc, open} = this.props;

    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick({
        data: {
          proc: proc,
          open: !open
        }
      });
    }
  }

  render() {
    const {proc, lines, open} = this.props;

    let rows = [];
    for (var i=0;i < lines.length; i++) {
      let line = lines[i];
      rows.push(<TermRow line={line} key={i} />);
    }
    if (proc.end_time && proc.end_time != 0) {
      rows.push(
        <div className="term-row term-row-exit-code" key="exit">
          <div>exit code {proc.exit_code}</div>
        </div>
      );
    }

    var attrs = {'open': open};
    return (
      <details className="term" {...attrs}>
        <summary onClick={this.handleClick}>
          <span>{proc.name}</span>
          <Status state={proc.state} />
        </summary>
        <div>{rows}</div>
      </details>
    );
  }
}
