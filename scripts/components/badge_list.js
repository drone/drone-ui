import React, { Component, PropTypes } from 'react'
import { MarkupLink, MarkdownLink, CCMenuLink } from "./badge_link";

export class BadgeList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {protocol, hostname, owner, name} = this.props;
    return (
      <div className="badge-list">
        <div className="row">
          <div className="col-md-3">Markdown</div>
          <div className="col-md-9">
            <MarkdownLink protocol={protocol} hostname={hostname} owner={owner} name={name} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">Markup</div>
          <div className="col-md-9">
            <MarkupLink protocol={protocol} hostname={hostname} owner={owner} name={name} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">CC Menu</div>
          <div className="col-md-9">
            <CCMenuLink protocol={protocol} hostname={hostname} owner={owner} name={name} />
          </div>
        </div>
      </div>
    );
  }
}

BadgeList.props = {
  protocol: PropTypes.string,
  hostname: PropTypes.string,
  owner: PropTypes.string,
  name: PropTypes.string
}
