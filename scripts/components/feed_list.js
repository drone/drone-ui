import React, { Component, PropTypes } from "react";
import { FeedListItem } from "./feed_list_item";

export class FeedList extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // renders a loading message
    if (this.props.loading) {
      return (
        <div>Loading Feed</div>
      );
    }

    // renders an empty list message
    if (this.props.items.length === 0) {
      return (
        <div>Empty Feed</div>
      );
    }

    var items = [];
    this.props.items.forEach(function(item) {
      items.push(<FeedListItem item={item} key={item.full_name + "/" + item.number} />);
    });

    return (
      <div className="row row-feed">
        {items}
      </div>
    );
  }
}

FeedList.props = {
  loading: PropTypes.bool,
  items: PropTypes.array
}
