import React, { Component, PropTypes } from "react";

// MarkupLink displays an HTML markup string that can be used
// to display a badge on a README.md.
export class MarkupLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {protocol, hostname, owner, name} = this.props;
    const string = markupString(protocol, hostname, owner, name)
    return (<pre>{string}</pre>);
  }
}

MarkupLink.props = {
  protocol: PropTypes.string,
  hostname: PropTypes.string,
  owner: PropTypes.string,
  name: PropTypes.string
}

// MarkdownLink displays a Markdown string that can be used
// to display a badge in markdown format in a README.md.
export class MarkdownLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {protocol, hostname, owner, name} = this.props;
    const string = markdownString(protocol, hostname, owner, name)
    return (<pre>{string}</pre>);
  }
}

MarkdownLink.props = {
  protocol: PropTypes.string,
  hostname: PropTypes.string,
  owner: PropTypes.string,
  name: PropTypes.string
}

// CCMenuLink displays a link to a CCMenu feed.
export class CCMenuLink extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {protocol, hostname, owner, name} = this.props;
    const string = ccmenuString(protocol, hostname, owner, name)
    return (<pre>{string}</pre>);
  }
}

CCMenuLink.props = {
  protocol: PropTypes.string,
  hostname: PropTypes.string,
  owner: PropTypes.string,
  name: PropTypes.string
}

function markdownString(protocol, hostname, owner, name) {
  return `[![Build Status](${protocol}//${hostname}/api/badges/${owner}/${name}/status.svg)](${protocol}//${hostname}/${owner}/${name})`;
}

function markupString(protocol, hostname, owner, name) {
  return `<a href="${protocol}//${hostname}/${owner}/${name}"><img src="${protocol}//${hostname}/api/badges/${owner}/${name}/status.svg" /></a>`;
}

function ccmenuString(protocol, hostname, owner, name) {
  return `${protocol}//${hostname}/api/badges/${owner}/${name}/cc.xml`
}
