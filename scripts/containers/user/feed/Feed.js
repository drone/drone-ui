import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchFeed } from "../../../actions/feed_actions";
import { FeedList } from "../../../components/feed_list";

class Feed extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchFeed());
  }

  render() {
    return (
      <div className="container">
        <FeedList items={this.props.items} loading={this.props.loading} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.feed.loading,
    items: state.feed.items
  }
}

Feed.props = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Feed)