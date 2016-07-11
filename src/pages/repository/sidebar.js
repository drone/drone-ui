import React from 'react';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';
import {events, GET_FEED, FILTER, FILTER_CLEAR, STREAM_FEED} from '../../actions/events';

import RepoListItem from '../../components/repo_list_item';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.onFilter = this.onFilter.bind(this);
  }

  render() {
    let {feed, user, state} = this.props;

    if (!user) {
      return (
        <div className="repository-sidebar">
          <div className="alert">
            <a href="/login">Login</a> to view your repository list.
          </div>
        </div>
      );
    }

    if (feed.length == 0) {
      return <div>Loading...</div>;
    }

    if (state.filter) {
      feed = feed.filter((item) => {
        return item.full_name.toLowerCase().indexOf(state.filter) > -1;
      });
    }

    return (
      <div className="repository-sidebar">
        <div className="repository-search">
          <input type="search" placeholder="Filter..." onChange={this.onFilter} spellCheck="off" />
        </div>
        <div>
        {feed.map((repo) => {
          return (
            <Link key={repo.full_name} to={`/${repo.owner}/${repo.name}`}>
              <RepoListItem repo={repo}/>
            </Link>
          );
        })}
        </div>
      </div>
    );
  }

  componentDidMount() {
    events.emit(GET_FEED);
    events.emit(STREAM_FEED);
  }

  componentWillUnmount() {
    events.emit(FILTER_CLEAR);
  }

  onFilter(event) {
    events.emit(FILTER, event.target.value);
  }
}

export default branch({
  feed: ['feed'],
  user: ['user'],
  state: ['pages', 'repo']
}, Sidebar);
