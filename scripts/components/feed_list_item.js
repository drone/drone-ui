import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export class FeedListItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { item } = this.props;
    const link = `/${item.full_name}/${item.number}`;
    return (
      <Link className="col-sm-4" to={link}>
        <div className="card">
          <div className="card-header">
            <img className="avatar" src={this.props.item.avatar_url} />
          </div>
          <div className="card-block">
            <h3>{this.props.item.full_name}</h3>
            <p>{this.props.item.message}</p>
            <p>{this.props.item.status}</p>
          </div>
        </div>
      </Link>
    );
  }
}

FeedListItem.props = {
	item: PropTypes.object,
}
