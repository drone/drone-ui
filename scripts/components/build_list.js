import React, { Component, PropTypes } from "react";
import { BuildListItem } from "./build_list_item";
import moment from "moment";

export class BuildList extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // renders a loading message
    if (this.props.loading) {
      return (
        <div>Loading Builds</div>
      );
    }

    // renders an empty list message
    if (this.props.builds.length === 0) {
      return (
        <div>No Builds Yet</div>
      );
    }

    var sections = [];
    var groups = new Map();
    var { repo } = this.props;

    // groups builds by date.
    this.props.builds.forEach(function(build) {
      var date = moment(new Date(build.created_at*1000)).format('ll');
      var group = groups.get(date);
      if (!group) {
        group = [];
        groups.set(date, group);
      }
      group.push(build);
    });

    // iterates through groups to generate markup
    for (var [date, group] of groups) {
      var items = [];

      // line-item for each build in the group
      group.forEach(function(build) {
        items.push(<BuildListItem repo={repo} build={build} key={build.number} />);
      });

      // added to the build section
      sections.push(
        <div className="group" key={date}>
          <div className="group-title" key="title">{date}</div>
          {items}
        </div>
      );
    }

    return (
      <div className="timeline">
        {sections}
      </div>
    );
  }
}

BuildList.props = {
  loading: PropTypes.bool,
  builds: PropTypes.array,
  repo: PropTypes.object
}
