import React from 'react';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';
import {events, GET_FEED, FILTER, FILTER_CLEAR} from '../../actions/events';

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
          <input type="search" placeholder="Filter..." onChange={this.onFilter} spellcheck="off" />
        </div>
        <div>
        {feed.map((repo, index) => {
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
    // this.ws = this.createWebSocket();
    // this.ws.onmessage = function(message) {
    //   let event = JSON.parse(message.data);
    //   this.props.dispatch(dispatchEvent(event));
    // }.bind(this)
  }

  componentWillUnmount() {
    // this.ws.close();
    events.emit(FILTER_CLEAR);
  }
  //
  // createWebSocket() {
  //   let proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  //   return new WebSocket(proto + '//' + window.location.host + '/ws/feed');
  // }

  onFilter(event) {
    events.emit(FILTER, event.target.value);
  }
}

export default branch({
  feed: ['feed'],
  user: ['user'],
  state: ['pages', 'repo']
}, Sidebar);
